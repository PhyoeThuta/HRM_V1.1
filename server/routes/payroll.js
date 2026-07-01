import express from 'express';
import { dbFetch, dbInsert, dbUpdate, dbDelete } from '../lib/supabase.js';
import { verifyToken, requireAdmin, requireFinance } from '../middleware/auth.js';

const router = express.Router();
router.use(verifyToken);

// GET /api/payroll
router.get('/', requireAdmin, async (req, res) => {
  try {
    const [payrolls, employees, positions, kpis] = await Promise.all([
      dbFetch('payrolls', '*', {}, { order: 'month', ascending: false }),
      dbFetch('Employees', 'id,Full_name,employee_id,position_id'),
      dbFetch('positions', 'id,title'),
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

    const result = await dbInsert('payrolls', {
      employee_id: d.employee_id, month: d.month,
      basic_salary: parseFloat(d.basic_salary || 0),
      allowances: parseFloat(d.allowances || 0),
      deductions: parseFloat(d.deductions || 0),
      bonus: parseFloat(d.bonus || 0),
      net_salary: parseFloat(d.net_salary || 0),
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
    await dbUpdate('payrolls', req.params.id, {
      basic_salary: parseFloat(d.basic_salary || 0),
      allowances: parseFloat(d.allowances || 0),
      deductions: parseFloat(d.deductions || 0),
      bonus: parseFloat(d.bonus || 0),
      net_salary: parseFloat(d.net_salary || 0),
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
