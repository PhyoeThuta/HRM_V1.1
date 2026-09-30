import express from 'express';
import { dbFetch, dbFetchOne, dbInsert, dbUpdate, dbDelete, supabase } from '../lib/supabase.js';
import { verifyToken, requireAdmin, requireFinance } from '../middleware/auth.js';
import { calculatePayroll, getSettings } from './payroll_engine.js';
import { hrmModule } from '../modules/hrm/index.js';
import { calculateBonus, calculateNetSalary, calculateDailyRate, calculateUnpaidDeduction } from '../modules/hrm/engine/payrollCalculationEngine.js';
import { getPayrollPolicy } from '../modules/hrm/service/payrollPolicyService.js';

const router = express.Router();
router.use(verifyToken);

// GET /api/payroll
router.get('/', requireAdmin, async (req, res) => {
  try {
    const [payrolls, { employees, positions }, kpis] = await Promise.all([
      dbFetch('payrolls', '*', {}, { order: 'month', ascending: false }),
      hrmModule.getEmployeesForPayroll(),
      dbFetch('kpis', '*', {}, { order: 'created_at', ascending: false })
    ]);
    const empMap = Object.fromEntries(employees.map(e => [e.id, e]));
    const posMap = Object.fromEntries(positions.map(p => [p.id, p.title]));
    const kpiMap = Object.fromEntries(kpis.map(k => [k.id, k]));

    payrolls.forEach(p => {
      const emp = empMap[p.employee_id] || {};
      p.employee_name = emp.Full_name || '—';
      p.employee_code = emp.employee_id || '—';
      p.position_title = posMap[emp.position_id] || '—';
      const kpi = kpiMap[p.kpi_id] || {};
      p.kpi_score = kpi.actual_score ? `${kpi.actual_score}%` : '—';
    });

    // Also enrich kpis for the UI table
    kpis.forEach(k => {
      const emp = empMap[k.employee_id] || {};
      k.Full_name = emp.Full_name || '—';
    });

    const totalPaid = payrolls.filter(p => p.payment_status === 'Paid').reduce((s, p) => s + parseFloat(p.net_salary || 0), 0);
    return res.json({ payrolls, employees, kpis, total_paid: totalPaid });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// POST /api/payroll
router.post('/', requireAdmin, async (req, res) => {
  try {
    const d = req.body;
    let kpi_id = null;
    
    // Auto-save KPI if final_kpi_score is provided
    if (d.final_kpi_score) {
      const kpiData = {
        employee_id: d.employee_id,
        recent_period: d.month,
        target_score: 100,
        actual_score: parseFloat(d.final_kpi_score || 0),
        review_comment: `Auto-calculated for ${d.month} payroll.`,
        created_at: new Date().toISOString()
      };
      const kpiRes = await dbInsert('kpis', kpiData);
      if (kpiRes && kpiRes.id) {
        kpi_id = kpiRes.id;
      }
    }

    // Perform Server-Side Calculation (Trust Boundary)
    const calc = await calculatePayroll(d.employee_id, d.month);
    
    // We trust basic_salary, allowances, deductions from HR, but we calculate bonus.
    const basic = parseFloat(d.basic_salary || calc.base_salary || 0);
    const allow = parseFloat(d.allowances || 0);
    const deduc = parseFloat(d.deductions || 0);
    
    // Bonus and net computed by the canonical engine — single source of truth
    const computedBonus = calculateBonus(basic, calc.target_bonus_percentage, calc.auto_kpi_contribution);
    const computedNet   = calculateNetSalary(basic, allow, computedBonus, deduc);

    const result = await dbInsert('payrolls', {
      employee_id: d.employee_id, month: d.month,
      basic_salary: basic,
      allowances: allow,
      deductions: deduc,
      bonus: computedBonus,
      net_salary: computedNet,
      payment_status: d.payment_status || 'Pending',
      notes: d.notes || null,
      kpi_id: kpi_id,
      created_at: new Date().toISOString(),
    });

    // Audit log
    await dbInsert('sys_audit_logs', {
      user_id: req.user.id,
      user_name: req.user.full_name || req.user.username,
      action: 'CREATE',
      module: 'Payroll',
      details: `Generated payroll for employee ID ${d.employee_id} (Month: ${d.month})`,
      created_at: new Date().toISOString()
    }).catch(console.error);

    return res.json({ success: !!result, payroll: result });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// PUT /api/payroll/:id
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const d = req.body;
    const pRecord = await dbFetchOne('payrolls', '*', { id: req.params.id });
    if (!pRecord) return res.status(404).json({ error: 'Payroll record not found' });
    
    const calc = await calculatePayroll(pRecord.employee_id, pRecord.month);
    const basic = parseFloat(d.basic_salary || calc.base_salary || 0);
    const allow = parseFloat(d.allowances || 0);
    const deduc = parseFloat(d.deductions || 0);
    
    // Bonus and net computed by the canonical engine — single source of truth
    const computedBonus = calculateBonus(basic, calc.target_bonus_percentage, calc.auto_kpi_contribution);
    const computedNet   = calculateNetSalary(basic, allow, computedBonus, deduc);

    await dbUpdate('payrolls', req.params.id, {
      basic_salary: basic,
      allowances: allow,
      deductions: deduc,
      bonus: computedBonus,
      net_salary: computedNet,
      payment_status: d.payment_status,
      notes: d.notes || null,
      updated_at: new Date().toISOString(),
    });

    // Audit log
    await dbInsert('sys_audit_logs', {
      user_id: req.user.id,
      user_name: req.user.full_name || req.user.username,
      action: 'UPDATE',
      module: 'Payroll',
      details: `Updated payroll ID ${req.params.id}`,
      created_at: new Date().toISOString()
    }).catch(console.error);

    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// ─── WORKSPACE ENDPOINTS ──────────────────────────────────────────────────────
//
// Phase 3: Payroll Calculation Workspace
//
// Two endpoints:
//   POST /workspace/calculate  — READ-ONLY preview (no DB writes)
//   POST /workspace/apply      — Write official payroll from workspace result

/**
 * applyOverrides — apply HR-provided override values onto system calculation result.
 * NEVER lets the frontend dictate final values directly.
 * All derived values (daily_rate, deduction, bonus, net) are always recomputed.
 *
 * @param {object} sys   - System calculation result from calculatePayroll()
 * @param {object} ov    - Validated override object
 * @param {object} settings - KPI settings (target_bonus_percentage etc.)
 * @returns {object}     - Manual result object
 */
function applyOverrides(sys, ov, settings) {
  const basic         = ov.basic_salary        != null ? parseFloat(ov.basic_salary)        : sys.base_salary;
  const working_days  = ov.working_days        != null ? parseInt(ov.working_days)           : sys.expected_working_days;
  const unpaid_days   = ov.unpaid_leave_days   != null ? parseInt(ov.unpaid_leave_days)      : sys.unpaid_leave_days;
  const allowances    = ov.allowances          != null ? parseFloat(ov.allowances)           : 0;
  const deductions_override = ov.deductions    != null ? parseFloat(ov.deductions)           : 0;
  const kpi_override  = ov.kpi_override        != null ? parseFloat(ov.kpi_override)         : null;

  // Recalculate derived values from overridden inputs — never from frontend finals
  const daily_rate         = basic > 0 && working_days > 0 ? Math.round((basic / working_days) * 10000) / 10000 : 0;
  const unpaid_deduction   = Math.round(daily_rate * unpaid_days * 100) / 100;
  const effective_kpi      = kpi_override != null ? kpi_override : sys.auto_kpi_contribution;
  const total_deductions   = parseFloat((unpaid_deduction + deductions_override).toFixed(2));
  const bonus              = calculateBonus(basic, settings.target_bonus_percentage, effective_kpi);
  const net_salary         = calculateNetSalary(basic, allowances, bonus, total_deductions);

  return {
    basic_salary:           parseFloat(basic.toFixed(2)),
    working_days,
    daily_rate:             parseFloat(daily_rate.toFixed(4)),
    // KPI component scores are ALWAYS from the system — cannot be overridden
    attendance_score:       sys.attendance_score,
    punctuality_score:      sys.punctuality_score,
    sop_score:              sys.sop_score,
    peer_score:             sys.peer_score,
    auto_kpi_contribution:  sys.auto_kpi_contribution,
    kpi_override:           kpi_override,
    effective_kpi:          parseFloat(effective_kpi.toFixed(2)),
    unpaid_leave_days:      unpaid_days,
    unpaid_leave_deduction: unpaid_deduction,
    allowances:             parseFloat(allowances.toFixed(2)),
    extra_deductions:       parseFloat(deductions_override.toFixed(2)),
    total_deductions:       total_deductions,
    bonus:                  bonus,
    net_salary:             net_salary,
  };
}

/**
 * buildDiff — field-by-field numeric/value diff between system and manual results.
 */
function buildDiff(sys, manual) {
  const sysView = {
    basic_salary:           sys.base_salary,
    working_days:           sys.expected_working_days,
    daily_rate:             sys.base_salary > 0 && sys.expected_working_days > 0
                              ? Math.round((sys.base_salary / sys.expected_working_days) * 10000) / 10000 : 0,
    attendance_score:       sys.attendance_score,
    punctuality_score:      sys.punctuality_score,
    sop_score:              sys.sop_score,
    peer_score:             sys.peer_score,
    effective_kpi:          sys.auto_kpi_contribution,
    unpaid_leave_days:      sys.unpaid_leave_days,
    unpaid_leave_deduction: sys.unpaid_leave_deduction,
    allowances:             0,
    extra_deductions:       0,
    total_deductions:       sys.unpaid_leave_deduction,
    bonus:                  calculateBonus(sys.base_salary, sys.target_bonus_percentage, sys.auto_kpi_contribution),
    net_salary:             0, // will be computed
  };
  sysView.net_salary = calculateNetSalary(sysView.basic_salary, sysView.allowances, sysView.bonus, sysView.total_deductions);

  const diff = {};
  const COMPARE_FIELDS = [
    'basic_salary','working_days','daily_rate','attendance_score','punctuality_score',
    'sop_score','peer_score','effective_kpi','unpaid_leave_days','unpaid_leave_deduction',
    'allowances','extra_deductions','total_deductions','bonus','net_salary'
  ];
  for (const f of COMPARE_FIELDS) {
    const sv = parseFloat(sysView[f] || 0);
    const mv = parseFloat(manual[f] || 0);
    diff[f] = parseFloat((mv - sv).toFixed(4));
  }
  return { system: sysView, diff };
}

/**
 * validateOverrides — rejects any forbidden override fields before they reach the engine.
 * Returns an error string or null if valid.
 */
function validateOverrides(ov) {
  if (!ov || typeof ov !== 'object') return null; // empty overrides = ok
  const FORBIDDEN = ['attendance_score','punctuality_score','sop_score','peer_score',
                     'auto_kpi_contribution','target_bonus_percentage','net_salary',
                     'salary_divisor','weekly_holidays','timezone'];
  for (const f of FORBIDDEN) {
    if (ov[f] != null) {
      return `Override field '${f}' is not allowed. Only HR input fields may be overridden.`;
    }
  }
  if (ov.working_days != null && (parseInt(ov.working_days) <= 0 || parseInt(ov.working_days) > 365)) {
    return 'working_days must be between 1 and 365.';
  }
  if (ov.unpaid_leave_days != null && parseFloat(ov.unpaid_leave_days) < 0) {
    return 'unpaid_leave_days cannot be negative.';
  }
  if (ov.basic_salary != null && parseFloat(ov.basic_salary) < 0) {
    return 'basic_salary cannot be negative.';
  }
  if (ov.kpi_override != null && (parseFloat(ov.kpi_override) < 0 || parseFloat(ov.kpi_override) > 200)) {
    return 'kpi_override must be between 0 and 200.';
  }
  return null;
}

// POST /api/payroll/workspace/calculate  — READ ONLY
// Returns system + manual (with overrides) + diff.
// Does NOT write to payrolls, kpis, or audit logs.
router.post('/workspace/calculate', requireAdmin, async (req, res) => {
  try {
    const { employee_id, month, overrides = {} } = req.body;
    if (!employee_id) return res.status(400).json({ error: 'employee_id is required' });
    if (!month || !/^\d{4}-\d{2}$/.test(month)) return res.status(400).json({ error: 'month must be YYYY-MM' });

    // Validate no forbidden overrides
    const ovErr = validateOverrides(overrides);
    if (ovErr) return res.status(400).json({ error: ovErr });

    // Load settings
    const settings = await getSettings();
    const policy   = await getPayrollPolicy('bbd');

    // 1. System calculation — exactly what Auto Payroll uses
    const sys = await calculatePayroll(employee_id, month, overrides.working_days || null);

    // 2. Apply overrides and compute manual result
    const manual = applyOverrides(sys, overrides, settings);

    // 3. Build diff
    const { system: sysView, diff } = buildDiff(sys, manual);

    // 4. Detect which fields were actually overridden
    const has_overrides = Object.keys(overrides).length > 0;
    const overridden_fields = Object.keys(overrides).filter(k => overrides[k] != null);

    return res.json({
      success: true,
      system:  sysView,
      manual,
      diff,
      has_overrides,
      overridden_fields,
      policy: {
        salary_divisor: policy.salary_divisor,
        weekly_holidays: policy.weekly_holidays,
        timezone: policy.timezone,
      },
    });
  } catch (e) {
    console.error('[WORKSPACE CALCULATE]', e);
    return res.status(500).json({ error: e.message });
  }
});

// POST /api/payroll/workspace/apply  — WRITES official payroll
// Re-runs server-side calculation from overrides. Never trusts client-sent final values.
router.post('/workspace/apply', requireAdmin, async (req, res) => {
  try {
    const { employee_id, month, overrides = {}, notes } = req.body;
    if (!employee_id) return res.status(400).json({ error: 'employee_id is required' });
    if (!month || !/^\d{4}-\d{2}$/.test(month)) return res.status(400).json({ error: 'month must be YYYY-MM' });

    // Validate overrides
    const ovErr = validateOverrides(overrides);
    if (ovErr) return res.status(400).json({ error: ovErr });

    // Check notes required when overrides exist
    const hasRealOverrides = Object.values(overrides).some(v => v != null);
    if (hasRealOverrides && (!notes || !notes.trim())) {
      return res.status(400).json({ error: 'Notes are required when overrides are applied.' });
    }

    // Fetch employee
    const employee = await dbFetchOne('Employees', 'id, Full_name, salary', { id: employee_id });
    if (!employee) return res.status(404).json({ error: 'Employee not found' });

    // Load settings + policy
    const settings = await getSettings();

    // Server recalculates — never trust client final values
    const sys    = await calculatePayroll(employee_id, month, overrides.working_days || null);
    const manual = applyOverrides(sys, overrides, settings);

    // ── Check existing payroll for this employee + month ──────────────────────
    const { data: existing, error: fetchErr } = await supabase
      .from('payrolls')
      .select('id, payment_status, calculation_source, basic_salary, net_salary')
      .eq('employee_id', employee_id)
      .eq('month', month)
      .single();

    if (fetchErr && fetchErr.code !== 'PGRST116') throw fetchErr;

    // Reject if existing payroll is Paid
    if (existing && existing.payment_status === 'Paid') {
      return res.status(409).json({
        error: `This payroll record is already marked as Paid and cannot be overwritten. ` +
               `To make corrections, consult your system administrator.`,
        code: 'PAYROLL_ALREADY_PAID',
        existing_payroll_id: existing.id,
      });
    }

    // ── System view for audit diff ────────────────────────────────────────────
    const { system: sysView, diff } = buildDiff(sys, manual);

    const now = new Date().toISOString();
    let action_type;
    let payroll_id;

    const payrollData = {
      employee_id,
      month,
      basic_salary:       manual.basic_salary,
      allowances:         manual.allowances,
      deductions:         manual.total_deductions,
      bonus:              manual.bonus,
      net_salary:         manual.net_salary,
      payment_status:     existing ? existing.payment_status : 'Pending',
      notes:              notes || null,
      calculation_source: 'workspace',
      workspace_notes:    notes || null,
    };

    if (existing) {
      // UPDATE existing Pending record
      await dbUpdate('payrolls', existing.id, { ...payrollData, updated_at: now });
      payroll_id  = existing.id;
      action_type = 'updated';
    } else {
      // INSERT new record — DB unique constraint protects against race conditions
      const inserted = await dbInsert('payrolls', { ...payrollData, created_at: now });
      payroll_id  = inserted?.id;
      action_type = 'created';
    }

    // ── Audit log ─────────────────────────────────────────────────────────────
    await dbInsert('sys_audit_logs', {
      user_id:   req.user.id,
      user_name: req.user.full_name || req.user.username,
      action:    'WORKSPACE_APPLY',
      module:    'Payroll Workspace',
      details:   JSON.stringify({
        employee_id,
        employee_name: employee.Full_name,
        month,
        action_type,
        system_net_salary:  sysView.net_salary,
        manual_net_salary:  manual.net_salary,
        net_salary_diff:    diff.net_salary,
        overrides: { ...overrides },
        overridden_fields: Object.keys(overrides).filter(k => overrides[k] != null),
        notes: notes || null,
        previous_record: existing ? {
          id: existing.id,
          basic_salary: existing.basic_salary,
          net_salary: existing.net_salary,
          payment_status: existing.payment_status,
        } : null,
        applied_result: {
          basic_salary: manual.basic_salary,
          allowances:   manual.allowances,
          deductions:   manual.total_deductions,
          bonus:        manual.bonus,
          net_salary:   manual.net_salary,
          effective_kpi: manual.effective_kpi,
        },
      }),
      created_at: now,
    }).catch(err => console.error('[WORKSPACE AUDIT]', err));

    return res.json({
      success: true,
      action: action_type,
      payroll_id,
      applied_result: {
        basic_salary:    manual.basic_salary,
        allowances:      manual.allowances,
        deductions:      manual.total_deductions,
        bonus:           manual.bonus,
        net_salary:      manual.net_salary,
        effective_kpi:   manual.effective_kpi,
        calculation_source: 'workspace',
      },
    });
  } catch (e) {
    console.error('[WORKSPACE APPLY]', e);
    // Detect unique-constraint violation (concurrent duplicate)
    if (e.code === '23505') {
      return res.status(409).json({
        error: 'A payroll record was just created for this employee and month by another session. Please refresh and try again.',
        code: 'CONCURRENT_DUPLICATE',
      });
    }
    return res.status(500).json({ error: e.message });
  }
});

// DELETE /api/payroll/:id
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await dbDelete('payrolls', req.params.id);

    // Audit log
    await dbInsert('sys_audit_logs', {
      user_id: req.user.id,
      user_name: req.user.full_name || req.user.username,
      action: 'DELETE',
      module: 'Payroll',
      details: `Deleted payroll ID ${req.params.id}`,
      created_at: new Date().toISOString()
    }).catch(console.error);

    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// DELETE /api/payroll/kpi/:id
router.delete('/kpi/:id', requireAdmin, async (req, res) => {
  try {
    await dbDelete('kpis', req.params.id);
    await dbInsert('sys_audit_logs', {
      user_id: req.user.id,
      action: 'DELETE',
      module: 'Payroll (KPI)',
      details: `Deleted KPI ID: ${req.params.id}`,
      ip_address: req.ip || '0.0.0.0'
    }).catch(console.error);
    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

export default router;
