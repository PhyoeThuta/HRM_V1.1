import express from 'express';
import { dbFetch, dbFetchOne, supabase, dbInsert, dbUpdate } from '../lib/supabase.js';
import { verifyToken, requireAdmin } from '../middleware/auth.js';
import { calculatePayroll, getSettings } from './payroll_engine.js';

const router = express.Router();
router.use(verifyToken);
router.use(requireAdmin);

function getBkkDateString(dateInput) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bangkok' }).format(new Date(dateInput));
}

function getGrade(cpi) {
  if (cpi === null || cpi === undefined || isNaN(cpi)) {
    return { grade: '—', label: 'No Data Yet', bonusPct: 0, isPending: true };
  }
  if (cpi >= 95) return { grade: 'A+', label: 'Exceptional',    bonusPct: 100 };
  if (cpi >= 85) return { grade: 'A',  label: 'High Achiever',  bonusPct: 100 };
  if (cpi >= 75) return { grade: 'B',  label: 'Standard',       bonusPct: 75  };
  if (cpi >= 60) return { grade: 'C',  label: 'Needs Improve',  bonusPct: 50  };
  return           { grade: 'D',  label: 'Underperform',   bonusPct: 0   };
}

async function computeEmployeeCPI(employee, month) {
  const mStart = new Date(`${month}-01`);
  const mEnd   = new Date(mStart.getFullYear(), mStart.getMonth() + 1, 0, 23, 59, 59, 999);
  const startDate = mStart.toISOString();
  const endDate   = mEnd.toISOString();
  const empId = employee.id;

  // Load KPI settings configured by Admin
  const settings = await getSettings();
  const configuredWeights = settings.auto_weights || { sops: 50, kpis: 50, peer_voting: 0, attendance: 0 };

  // ─── 1. Attendance & Punctuality (Informational) ─────────────
  let attendanceRate = 0;
  let punctualityRate = 0;
  let actualAttendance = 0;
  const workingDays = 26;

  try {
    const { data: attRecords } = await supabase
      .from('attendance_records')
      .select('check_in, is_late')
      .eq('employee_id', empId)
      .gte('check_in', startDate)
      .lte('check_in', endDate);

    const attendanceDates = new Set();
    const checkinByDate = {};
    (attRecords || []).forEach(a => {
      if (!a.check_in) return;
      const d = getBkkDateString(a.check_in);
      attendanceDates.add(d);
      if (!checkinByDate[d] || new Date(a.check_in) < new Date(checkinByDate[d].check_in)) {
        checkinByDate[d] = a;
      }
    });

    let onTimeCount = Object.values(checkinByDate).filter(a => a.is_late === false || a.is_late === 'false').length;

    // Approved leaves this month
    const { data: leaves } = await supabase
      .from('Leave_Request')
      .select('start_date, end_date')
      .eq('employee_id', empId)
      .eq('status', 'Approved');

    let approvedLeaveDays = 0;
    (leaves || []).forEach(l => {
      const lStart = new Date(l.start_date);
      const lEnd   = new Date(l.end_date);
      if (lStart <= mEnd && lEnd >= mStart) {
        let cur = new Date(Math.max(lStart, mStart));
        const end = new Date(Math.min(lEnd, mEnd));
        while (cur <= end) {
          const dStr = getBkkDateString(cur);
          if (!attendanceDates.has(dStr)) { approvedLeaveDays++; }
          cur.setDate(cur.getDate() + 1);
        }
      }
    });

    actualAttendance = attendanceDates.size + approvedLeaveDays;
    onTimeCount += approvedLeaveDays;
    attendanceRate = Math.min(100, (actualAttendance / workingDays) * 100);
    punctualityRate = actualAttendance > 0 ? Math.min(100, (onTimeCount / actualAttendance) * 100) : 0;
  } catch (e) {
    console.error(`[PERF] Attendance error for ${empId}:`, e.message);
  }

  // ─── 2. SOP Compliance ───────────────────────────────────────
  let sopScore = 0;
  let completedSops = 0;
  let totalSops = 0;
  let hasSopData = false;
  try {
    const { data: sops } = await supabase
      .from('daily_sops')
      .select('is_completed, task_description, content')
      .eq('employee_id', empId)
      .gte('assigned_date', startDate)
      .lte('assigned_date', endDate);

    if (sops && sops.length > 0) {
      sops.forEach(s => {
        const tasks = (s.task_description || s.content || '').split('\n').filter(t => t.trim());
        const taskCount = Math.max(1, tasks.length);
        totalSops += taskCount;
        if (s.is_completed) completedSops += taskCount;
      });
      if (totalSops > 0) {
        sopScore = (completedSops / totalSops) * 100;
        hasSopData = true;
      }
    }
  } catch (e) {
    console.error(`[PERF] SOP error for ${empId}:`, e.message);
  }

  // ─── 3. JD & KPI Targets ─────────────────────────────────────
  let kpiScore = 0;
  let kpiRecordsFound = 0;
  let hasKpiData = false;
  try {
    const { data: kpis } = await supabase
      .from('kpis')
      .select('actual_score, target_score')
      .eq('employee_id', empId)
      .gte('created_at', startDate)
      .lte('created_at', endDate);

    if (kpis && kpis.length > 0) {
      kpiRecordsFound = kpis.length;
      const avg = kpis.reduce((acc, k) => {
        const target = parseFloat(k.target_score || 100);
        const actual = parseFloat(k.actual_score || 0);
        return acc + Math.min(100, (actual / target) * 100);
      }, 0) / kpis.length;
      kpiScore = avg;
      hasKpiData = true;
    }
  } catch (e) {
    console.error(`[PERF] KPI error for ${empId}:`, e.message);
  }

  // ─── 4. Peer Voting ──────────────────────────────────────────
  let peerScore = 0;
  let peerVotesCount = 0;
  let hasPeerData = false;
  try {
    const { data: votes } = await supabase
      .from('peer_voting_records')
      .select('score')
      .eq('nominee_id', empId)
      .gte('created_at', startDate)
      .lte('created_at', endDate);

    if (votes && votes.length > 0) {
      peerVotesCount = votes.length;
      const avg = votes.reduce((acc, v) => acc + parseFloat(v.score || 0), 0) / votes.length;
      peerScore = (avg / 5.0) * 100;
      hasPeerData = true;
    }
  } catch (e) {
    console.error(`[PERF] Peer error for ${empId}:`, e.message);
  }

  // ─── 5. Dynamic Performance Index Calculation ─────────────────
  const activeComponents = [];

  if (hasSopData) {
    activeComponents.push({ name: 'sop', score: sopScore, weight: configuredWeights.sops || 50 });
  }

  if (hasKpiData) {
    activeComponents.push({ name: 'kpi', score: kpiScore, weight: configuredWeights.kpis || 50 });
  }

  if (hasPeerData && (configuredWeights.peer_voting || 0) > 0) {
    activeComponents.push({ name: 'peer', score: peerScore, weight: configuredWeights.peer_voting });
  }

  // Attendance ONLY included if explicitly requested in configuredWeights AND data exists
  if (configuredWeights.attendance > 0 && actualAttendance > 0) {
    activeComponents.push({ name: 'attendance', score: attendanceRate, weight: configuredWeights.attendance });
  }

  const totalActiveWeight = activeComponents.reduce((sum, c) => sum + c.weight, 0);

  let cpi = null;
  let hasEvaluatedData = activeComponents.length > 0;

  if (hasEvaluatedData && totalActiveWeight > 0) {
    const rawCpi = activeComponents.reduce((sum, c) => sum + (c.score * (c.weight / totalActiveWeight)), 0);
    cpi = parseFloat(Math.min(100, Math.max(0, rawCpi)).toFixed(1));
  }

  const cultureScore = hasPeerData
    ? (attendanceRate * 0.50) + (punctualityRate * 0.25) + (peerScore * 0.25)
    : (attendanceRate * 0.67) + (punctualityRate * 0.33);

  const grade = getGrade(cpi);

  return {
    employee_id:       empId,
    employee_code:     employee.employee_id || '—',
    full_name:         employee.Full_name   || '—',
    department_id:     employee.Dept_id,
    department_name:   employee._deptName   || '—',
    position_title:    employee._posTitle   || '—',
    sop_score:         hasSopData ? parseFloat(sopScore.toFixed(1)) : 0,
    has_sop:           hasSopData,
    sop_completed:     completedSops,
    sop_total:         totalSops,
    kpi_score:         hasKpiData ? parseFloat(kpiScore.toFixed(1)) : 0,
    has_kpi:           hasKpiData,
    kpi_records_found: kpiRecordsFound,
    culture_score:     parseFloat(cultureScore.toFixed(1)),
    attendance_rate:   parseFloat(attendanceRate.toFixed(1)),
    punctuality_rate:  parseFloat(punctualityRate.toFixed(1)),
    peer_score:        hasPeerData ? parseFloat(peerScore.toFixed(1)) : 0,
    has_peer:          hasPeerData,
    peer_votes:        peerVotesCount,
    cpi:               cpi,
    has_evaluated_data: hasEvaluatedData,
    grade:             grade.grade,
    grade_label:       grade.label,
    bonus_pct:         grade.bonusPct,
    active_metrics_count: activeComponents.length,
  };
}

// ─── GET /api/performance?month=YYYY-MM&dept_id=xxx ──────────────
router.get('/', async (req, res) => {
  try {
    const month   = req.query.month   || new Date().toISOString().slice(0, 7);
    const deptId  = req.query.dept_id || null;

    const [employees, departments, positions] = await Promise.all([
      dbFetch('Employees', 'id,employee_id,Full_name,Dept_id,position_id,status'),
      dbFetch('Departments', 'id,Department_name'),
      dbFetch('positions', 'id,title'),
    ]);

    const deptMap = Object.fromEntries(departments.map(d => [d.id, d.Department_name]));
    const posMap  = Object.fromEntries(positions.map(p => [p.id, p.title]));

    const active = employees.filter(e =>
      String(e.status || '').toLowerCase() === 'active' &&
      (!deptId || String(e.Dept_id) === String(deptId))
    );

    // Enrich with names
    active.forEach(e => {
      e._deptName = deptMap[e.Dept_id] || '—';
      e._posTitle  = posMap[e.position_id] || '—';
    });

    // Compute CPI for all employees (parallelised in batches of 5)
    const results = [];
    for (let i = 0; i < active.length; i += 5) {
      const batch = active.slice(i, i + 5);
      const batchResults = await Promise.all(batch.map(e => computeEmployeeCPI(e, month)));
      results.push(...batchResults);
    }

    results.sort((a, b) => (b.cpi ?? -1) - (a.cpi ?? -1));

    // ─── Department aggregates ───────────────────────────────
    const deptAgg = {};
    results.forEach(r => {
      const dn = r.department_name;
      if (!deptAgg[dn]) deptAgg[dn] = { total: 0, count: 0, sopTotal: 0 };
      deptAgg[dn].total   += (r.cpi || 0);
      deptAgg[dn].sopTotal += r.sop_score;
      deptAgg[dn].count++;
    });
    const departmentStats = Object.entries(deptAgg).map(([name, v]) => ({
      name,
      avg_cpi:       v.count > 0 ? parseFloat((v.total / v.count).toFixed(1)) : 0,
      avg_sop_score: v.count > 0 ? parseFloat((v.sopTotal / v.count).toFixed(1)) : 0,
      count:         v.count,
    })).sort((a, b) => b.avg_cpi - a.avg_cpi);

    // ─── Summary stats ───────────────────────────────────────
    const totalEmployees = results.length;
    const evaluatedList = results.filter(r => r.cpi !== null && r.cpi !== undefined);
    const avgCpi = evaluatedList.length > 0
      ? parseFloat((evaluatedList.reduce((a, r) => a + r.cpi, 0) / evaluatedList.length).toFixed(1))
      : 0;
    const avgSop   = totalEmployees > 0
      ? parseFloat((results.reduce((a, r) => a + r.sop_score, 0) / totalEmployees).toFixed(1))
      : 0;
    const topCount  = results.filter(r => ['A+', 'A'].includes(r.grade)).length;
    const riskCount = results.filter(r => ['C', 'D'].includes(r.grade)).length;

    // ─── 6-month trend ───────────────────────────────────────
    // Lightweight: return placeholder months for frontend rendering
    // (Full historical computation deferred to keep response fast)
    const trend = [];
    const [yr, mo] = month.split('-').map(Number);
    for (let i = 5; i >= 0; i--) {
      const d = new Date(yr, mo - 1 - i, 1);
      trend.push({
        month: d.toISOString().slice(0, 7),
        label: d.toLocaleString('en-US', { month: 'short', year: '2-digit' }),
        avg_cpi: i === 0 ? avgCpi : null, // Only current month has real data; past months null until historical endpoint built
      });
    }

    return res.json({
      month,
      summary: { avg_cpi: avgCpi, avg_sop: avgSop, top_count: topCount, risk_count: riskCount, total: totalEmployees },
      employees: results,
      department_stats: departmentStats,
      trend,
      departments: departments.map(d => ({ id: d.id, name: d.Department_name })),
    });
  } catch (e) {
    console.error('[PERFORMANCE]', e);
    return res.status(500).json({ error: e.message });
  }
});

// ─── GET /api/performance/employee/:id?month=YYYY-MM ─────────────
// Detailed scorecard for a single employee (modal view)
router.get('/employee/:id', async (req, res) => {
  try {
    const month = req.query.month || new Date().toISOString().slice(0, 7);
    const employee = await dbFetchOne('Employees', 'id,employee_id,Full_name,Dept_id,position_id,status', { id: req.params.id });
    if (!employee) return res.status(404).json({ error: 'Employee not found' });

    const [departments, positions] = await Promise.all([
      dbFetch('Departments', 'id,Department_name'),
      dbFetch('positions', 'id,title'),
    ]);
    employee._deptName = (departments.find(d => d.id === employee.Dept_id) || {}).Department_name || '—';
    employee._posTitle  = (positions.find(p  => p.id === employee.position_id) || {}).title || '—';

    const cpiData = await computeEmployeeCPI(employee, month);
    return res.json(cpiData);
  } catch (e) {
    console.error('[PERFORMANCE DETAIL]', e);
    return res.status(500).json({ error: e.message });
  }
});

// ─── POST /api/performance/sync-payroll ──────────────────────────
// Patches EXISTING payroll records with computed CPI scores
router.post('/sync-payroll', async (req, res) => {
  try {
    const { month } = req.body;
    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({ error: 'Invalid month format. Use YYYY-MM.' });
    }

    // Fetch existing payroll records for the month
    const { data: payrolls, error: prErr } = await supabase
      .from('payrolls')
      .select('id, employee_id')
      .eq('month', month);

    if (prErr) throw prErr;
    if (!payrolls || payrolls.length === 0) {
      return res.json({ synced: 0, skipped: 0, errors: [], message: 'No payroll records found for this month.' });
    }

    // Get unique employee IDs from payroll records
    const empIds = [...new Set(payrolls.map(p => p.employee_id))];

    // Fetch employee details
    const { data: employees } = await supabase
      .from('Employees')
      .select('id,employee_id,Full_name,Dept_id,position_id,status')
      .in('id', empIds);

    const empMap = Object.fromEntries((employees || []).map(e => [e.id, e]));

    let synced = 0;
    let skipped = 0;
    const errors = [];

    for (const pr of payrolls) {
      try {
        const emp = empMap[pr.employee_id];
        if (!emp) { skipped++; continue; }

        // Compute CPI
        emp._deptName = '';
        emp._posTitle = '';
        const cpiData = await computeEmployeeCPI(emp, month);
        const cpi = cpiData.cpi;

        // Recalculate bonus using existing payroll engine
        const calc = await calculatePayroll(pr.employee_id, month);
        const basic = parseFloat(calc.base_salary || 0);
        const grade = getGrade(cpi);
        const targetBonusPct = (calc.target_bonus_percentage || 15) / 100;
        const computedBonus = Math.round(basic * targetBonusPct * (cpi / 100) * 100) / 100;

        await supabase
          .from('payrolls')
          .update({
            final_kpi_score: cpi,
            bonus: computedBonus,
            net_salary: supabase.rpc ? undefined : undefined, // net_salary recalc handled below
            updated_at: new Date().toISOString(),
          })
          .eq('id', pr.id);

        // Also update net_salary separately (basic + allowances + bonus - deductions)
        const { data: fullPr } = await supabase.from('payrolls').select('basic_salary,allowances,deductions').eq('id', pr.id).single();
        if (fullPr) {
          const net = parseFloat(fullPr.basic_salary || 0) + parseFloat(fullPr.allowances || 0) + computedBonus - parseFloat(fullPr.deductions || 0);
          await supabase.from('payrolls').update({ net_salary: net }).eq('id', pr.id);
        }

        synced++;
      } catch (empErr) {
        errors.push({ employee_id: pr.employee_id, error: empErr.message });
      }
    }

    // Audit log
    await dbInsert('sys_audit_logs', {
      user_id:    req.user.id,
      user_name:  req.user.full_name || req.user.username,
      action:     'UPDATE',
      module:     'Performance Sync',
      details:    `Synced performance scores to payroll for ${month}. Synced: ${synced}, Skipped: ${skipped}, Errors: ${errors.length}`,
      created_at: new Date().toISOString(),
    }).catch(console.error);

    return res.json({ synced, skipped, errors, month });
  } catch (e) {
    console.error('[PERFORMANCE SYNC]', e);
    return res.status(500).json({ error: e.message });
  }
});

export default router;
