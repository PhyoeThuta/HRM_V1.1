import express from 'express';
import { dbFetch, dbFetchOne, dbInsert, dbUpdate, dbDelete } from '../lib/supabase.js';
import { verifyToken, requireAdmin, hashPassword } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createEmployeeSchema } from '../schemas/index.js';
import { supabase } from '../lib/supabase.js';
const router = express.Router();
router.use(verifyToken);

async function enrichEmployees(employees) {
  const [depts, positions] = await Promise.all([
    dbFetch('Departments', 'id,Department_name'),
    dbFetch('positions', 'id,title'),
  ]);
  const deptMap = Object.fromEntries(depts.map(d => [d.id, d.Department_name]));
  const posMap = Object.fromEntries(positions.map(p => [p.id, p.title]));
  return employees.map(e => ({
    ...e,
    dept_name: deptMap[e.Dept_id] || '—',
    pos_title: posMap[e.position_id] || '—',
  }));
}

// GET /api/employees
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50; // Use high limit by default for legacy UI compat, but can be scaled
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let q = supabase
      .from('Employees')
      .select('*', { count: 'exact' })
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .range(from, to);
      
    const { data: employees, count, error } = await q;
    if (error) throw error;

    const enriched = await enrichEmployees(employees || []);
    return res.json({ employees: enriched, total: count, page, limit });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// GET /api/employees/recycle-bin
router.get('/recycle-bin', requireAdmin, async (req, res) => {
  try {
    let q = supabase
      .from('Employees')
      .select('*', { count: 'exact' })
      .not('deleted_at', 'is', null)
      .order('deleted_at', { ascending: false });
      
    const { data: employees, count, error } = await q;
    if (error) throw error;

    const enriched = await enrichEmployees(employees || []);
    return res.json({ employees: enriched, total: count });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// GET /api/employees/form-data
router.get('/form-data', async (req, res) => {
  try {
    const [depts, positions, posWithLevel, allActive, hired] = await Promise.all([
      dbFetch('Departments', 'id,Department_name'),
      dbFetch('positions', 'id,title'),
      dbFetch('positions', 'id,level'),
      dbFetch('Employees', 'id,Full_name,employee_id,position_id', { status: 'Active' }),
      dbFetch('recruitment_candidates', '*', { status: 'Hired' }),
    ]);
    const managerLevels = new Set(posWithLevel.filter(p => ['Manager', 'Executive', 'Senior'].includes(p.level)).map(p => p.id));
    const managers = allActive.filter(e => 
      managerLevels.has(e.position_id) || 
      /manager|boss|ceo|head|lead|director/i.test(e.Full_name)
    );
    return res.json({ departments: depts, positions, managers, candidates: hired });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// GET /api/employees/:id
router.get('/:id', async (req, res) => {
  try {
    const emp = await dbFetchOne('Employees', '*', { id: req.params.id });
    if (!emp) return res.status(404).json({ error: 'Employee not found' });

    const [depts, positions, allEmps, leaveBals, leaveTypes, leaveReqs, attRecs, payrolls, kpis, votes, onboarding] = await Promise.all([
      dbFetch('Departments', 'id,Department_name'),
      dbFetch('positions', 'id,title'),
      dbFetch('Employees', 'id,Full_name'),
      dbFetch('Leave_balances', '*', { employee_id: req.params.id }),
      dbFetch('Leave_type', 'id,type_name'),
      dbFetch('Leave_Request', '*', { employee_id: req.params.id }),
      dbFetch('attendance_records', '*', { employee_id: req.params.id }, { order: 'check_in', ascending: false }),
      dbFetch('payrolls', '*', { employee_id: req.params.id }, { order: 'month', ascending: true }),
      dbFetch('kpis', '*', { employee_id: req.params.id }),
      dbFetch('peer_voting_records', '*', { nominee_id: req.params.id }),
      dbFetchOne('employee_onboarding', '*', { employee_id: req.params.id }),
    ]);

    const deptMap = Object.fromEntries(depts.map(d => [d.id, d.Department_name]));
    const posMap = Object.fromEntries(positions.map(p => [p.id, p.title]));
    const mgrMap = Object.fromEntries(allEmps.map(e => [e.id, e.Full_name]));
    const ltMap = Object.fromEntries(leaveTypes.map(lt => [lt.id, lt.type_name]));

    emp.dept_name = deptMap[emp.Dept_id] || '—';
    emp.pos_title = posMap[emp.position_id] || '—';
    emp.manager_name = mgrMap[emp.Manager_id] || null;

    leaveBals.forEach(b => { b.type_name = ltMap[b.leave_type_id] || '—'; });
    leaveReqs.forEach(r => { r.type_name = ltMap[r.leave_type_id] || '—'; });

    // Work hours calc
    attRecs.forEach(r => {
      if (r.check_in && r.check_out) {
        try {
          const diff = (new Date(r.check_out) - new Date(r.check_in)) / 3600000;
          r.work_hours_calc = Math.max(0, Math.round(diff * 100) / 100);
        } catch { r.work_hours_calc = 0; }
      } else { r.work_hours_calc = null; }
    });

    const voteCount = votes.length;
    const voteTotal = votes.reduce((s, v) => s + parseInt(v.score || 0), 0);
    const voteAvg = voteCount > 0 ? Math.round((voteTotal / voteCount) * 10) / 10 : 0;
    const totalPaid = payrolls.filter(p => p.payment_status === 'Paid').reduce((s, p) => s + parseFloat(p.net_salary || 0), 0);

    return res.json({
      emp,
      attendance_records: attRecs,
      leave_balances: leaveBals,
      leave_requests: leaveReqs,
      payroll_records: payrolls,
      total_paid: totalPaid,
      kpi_records: kpis,
      vote_stats: { votes: voteCount, total: voteTotal, avg: voteAvg },
      onboarding,
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// POST /api/employees
router.post('/', requireAdmin, validate(createEmployeeSchema), async (req, res) => {
  try {
    const d = req.body;
    const result = await dbInsert('Employees', {
      employee_id: d.employee_id, Full_name: d.Full_name,
      email: d.email || null, phone: d.phone || null,
      Dept_id: d.Dept_id || null, position_id: d.position_id || null,
      Manager_id: d.Manager_id || null,
      hire_date: d.hire_date || null, date_of_birth: d.date_of_birth || null,
      national_id: d.national_id || null, address: d.address || null,
      employment_type: d.employment_type || 'Full-Time',
      status: d.status || 'Active',
      salary: d.salary ? parseFloat(d.salary) : null,
      salary: d.salary ? parseFloat(d.salary) : null,
      created_at: new Date().toISOString(),
    });
    if (!result) return res.status(500).json({ error: 'Failed to add employee' });

    // Audit log
    await dbInsert('sys_audit_logs', {
      user_id: req.user.id,
      user_name: req.user.full_name || req.user.username,
      action: 'CREATE',
      module: 'Employees',
      details: `Created employee ${d.Full_name} (${d.employee_id})`,
      created_at: new Date().toISOString()
    }).catch(console.error);

    // Auto-create sys_users
    try {
      const username = d.employee_id.toLowerCase();
      let role = 'employee';
      if (d.position_id) {
        const pos = await dbFetchOne('positions', '*', { id: d.position_id });
        if (pos) {
          const title = (pos.title || '').toLowerCase();
          const team = (pos.team || '').toLowerCase();
          if (team.includes('finance') || title.includes('finance')) role = 'finance';
          else if (title.includes('hr manager') || team.includes('human resources')) role = 'hr_manager';
          else if (title.includes('boss') || title.includes('executive') || title.includes('general manager')) role = 'boss';
        }
      }
      await dbInsert('sys_users', {
        username, password_hash: 'MUST_CHANGE:' + hashPassword('123456'),
        role, employee_id: result.id, full_name: d.Full_name,
      });
      return res.json({ success: true, employee: result, message: `Employee added! Login: ${username} / 123456` });
    } catch (userErr) {
      console.error('Auto-create user failed:', userErr);
      return res.json({ success: true, employee: result });
    }
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// PUT /api/employees/:id
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const d = req.body;
    const ok = await dbUpdate('Employees', req.params.id, {
      employee_id: d.employee_id, Full_name: d.Full_name, email: d.email || null, phone: d.phone || null,
      Dept_id: d.Dept_id || null, position_id: d.position_id || null,
      Manager_id: d.Manager_id || null,
      hire_date: d.hire_date || null, date_of_birth: d.date_of_birth || null,
      national_id: d.national_id || null, address: d.address || null,
      employment_type: d.employment_type || 'Full-Time',
      status: d.status || 'Active',
      salary: d.salary ? parseFloat(d.salary) : null,
      salary: d.salary ? parseFloat(d.salary) : null,
      updated_at: new Date().toISOString(),
    });
    if (!ok) return res.status(500).json({ error: 'Update failed' });

    // Audit log
    await dbInsert('sys_audit_logs', {
      user_id: req.user.id,
      user_name: req.user.full_name || req.user.username,
      action: 'UPDATE',
      module: 'Employees',
      details: `Updated employee ${d.Full_name} (${d.employee_id})`,
      created_at: new Date().toISOString()
    }).catch(console.error);

    return res.json({ success: true });
    return res.json({ employees: enriched, total: count, page, limit });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// GET /api/employees/recycle-bin
router.get('/recycle-bin', requireAdmin, async (req, res) => {
  try {
    let q = supabase
      .from('Employees')
      .select('*', { count: 'exact' })
      .not('deleted_at', 'is', null)
      .order('deleted_at', { ascending: false });
      
    const { data: employees, count, error } = await q;
    if (error) throw error;

    const enriched = await enrichEmployees(employees || []);
    return res.json({ employees: enriched, total: count });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// GET /api/employees/form-data
router.get('/form-data', async (req, res) => {
  try {
    const [depts, positions, posWithLevel, allActive, hired] = await Promise.all([
      dbFetch('Departments', 'id,Department_name'),
      dbFetch('positions', 'id,title'),
      dbFetch('positions', 'id,level'),
      dbFetch('Employees', 'id,Full_name,employee_id,position_id', { status: 'Active' }),
      dbFetch('recruitment_candidates', '*', { status: 'Hired' }),
    ]);
    const managerLevels = new Set(posWithLevel.filter(p => ['Manager', 'Executive', 'Senior'].includes(p.level)).map(p => p.id));
    const managers = allActive.filter(e => 
      managerLevels.has(e.position_id) || 
      /manager|boss|ceo|head|lead|director/i.test(e.Full_name)
    );
    return res.json({ departments: depts, positions, managers, candidates: hired });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// GET /api/employees/:id
router.get('/:id', async (req, res) => {
  try {
    const emp = await dbFetchOne('Employees', '*', { id: req.params.id });
    if (!emp) return res.status(404).json({ error: 'Employee not found' });

    const [depts, positions, allEmps, leaveBals, leaveTypes, leaveReqs, attRecs, payrolls, kpis, votes, onboarding] = await Promise.all([
      dbFetch('Departments', 'id,Department_name'),
      dbFetch('positions', 'id,title'),
      dbFetch('Employees', 'id,Full_name'),
      dbFetch('Leave_balances', '*', { employee_id: req.params.id }),
      dbFetch('Leave_type', 'id,type_name'),
      dbFetch('Leave_Request', '*', { employee_id: req.params.id }),
      dbFetch('attendance_records', '*', { employee_id: req.params.id }, { order: 'check_in', ascending: false }),
      dbFetch('payrolls', '*', { employee_id: req.params.id }, { order: 'month', ascending: true }),
      dbFetch('kpis', '*', { employee_id: req.params.id }),
      dbFetch('peer_voting_records', '*', { nominee_id: req.params.id }),
      dbFetchOne('employee_onboarding', '*', { employee_id: req.params.id }),
    ]);

    const deptMap = Object.fromEntries(depts.map(d => [d.id, d.Department_name]));
    const posMap = Object.fromEntries(positions.map(p => [p.id, p.title]));
    const mgrMap = Object.fromEntries(allEmps.map(e => [e.id, e.Full_name]));
    const ltMap = Object.fromEntries(leaveTypes.map(lt => [lt.id, lt.type_name]));

    emp.dept_name = deptMap[emp.Dept_id] || '—';
    emp.pos_title = posMap[emp.position_id] || '—';
    emp.manager_name = mgrMap[emp.Manager_id] || null;

    leaveBals.forEach(b => { b.type_name = ltMap[b.leave_type_id] || '—'; });
    leaveReqs.forEach(r => { r.type_name = ltMap[r.leave_type_id] || '—'; });

    // Work hours calc
    attRecs.forEach(r => {
      if (r.check_in && r.check_out) {
        try {
          const diff = (new Date(r.check_out) - new Date(r.check_in)) / 3600000;
          r.work_hours_calc = Math.max(0, Math.round(diff * 100) / 100);
        } catch { r.work_hours_calc = 0; }
      } else { r.work_hours_calc = null; }
    });

    const voteCount = votes.length;
    const voteTotal = votes.reduce((s, v) => s + parseInt(v.score || 0), 0);
    const voteAvg = voteCount > 0 ? Math.round((voteTotal / voteCount) * 10) / 10 : 0;
    const totalPaid = payrolls.filter(p => p.payment_status === 'Paid').reduce((s, p) => s + parseFloat(p.net_salary || 0), 0);

    return res.json({
      emp,
      attendance_records: attRecs,
      leave_balances: leaveBals,
      leave_requests: leaveReqs,
      payroll_records: payrolls,
      total_paid: totalPaid,
      kpi_records: kpis,
      vote_stats: { votes: voteCount, total: voteTotal, avg: voteAvg },
      onboarding,
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// POST /api/employees
router.post('/', requireAdmin, validate(createEmployeeSchema), async (req, res) => {
  try {
    const d = req.body;
    const result = await dbInsert('Employees', {
      employee_id: d.employee_id, Full_name: d.Full_name,
      email: d.email || null, phone: d.phone || null,
      Dept_id: d.Dept_id || null, position_id: d.position_id || null,
      Manager_id: d.Manager_id || null,
      hire_date: d.hire_date || null, date_of_birth: d.date_of_birth || null,
      national_id: d.national_id || null, address: d.address || null,
      employment_type: d.employment_type || 'Full-Time',
      status: d.status || 'Active',
      salary: d.salary ? parseFloat(d.salary) : null,
      salary: d.salary ? parseFloat(d.salary) : null,
      created_at: new Date().toISOString(),
    });
    if (!result) return res.status(500).json({ error: 'Failed to add employee' });

    // Audit log
    await dbInsert('sys_audit_logs', {
      user_id: req.user.id,
      user_name: req.user.full_name || req.user.username,
      action: 'CREATE',
      module: 'Employees',
      details: `Created employee ${d.Full_name} (${d.employee_id})`,
      created_at: new Date().toISOString()
    }).catch(console.error);

    // Auto-create sys_users
    try {
      const username = d.employee_id.toLowerCase();
      let role = 'employee';
      if (d.position_id) {
        const pos = await dbFetchOne('positions', '*', { id: d.position_id });
        if (pos) {
          const title = (pos.title || '').toLowerCase();
          const team = (pos.team || '').toLowerCase();
          if (team.includes('finance') || title.includes('finance')) role = 'finance';
          else if (title.includes('hr manager') || team.includes('human resources')) role = 'hr_manager';
          else if (title.includes('boss') || title.includes('executive') || title.includes('general manager')) role = 'boss';
        }
      }
      await dbInsert('sys_users', {
        username, password_hash: 'MUST_CHANGE:' + hashPassword('123456'),
        role, employee_id: result.id, full_name: d.Full_name,
      });
      return res.json({ success: true, employee: result, message: `Employee added! Login: ${username} / 123456` });
    } catch (userErr) {
      console.error('Auto-create user failed:', userErr);
      return res.json({ success: true, employee: result });
    }
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// PUT /api/employees/:id
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const d = req.body;
    const ok = await dbUpdate('Employees', req.params.id, {
      employee_id: d.employee_id, Full_name: d.Full_name, email: d.email || null, phone: d.phone || null,
      Dept_id: d.Dept_id || null, position_id: d.position_id || null,
      Manager_id: d.Manager_id || null,
      hire_date: d.hire_date || null, date_of_birth: d.date_of_birth || null,
      national_id: d.national_id || null, address: d.address || null,
      employment_type: d.employment_type || 'Full-Time',
      status: d.status || 'Active',
      salary: d.salary ? parseFloat(d.salary) : null,
      salary: d.salary ? parseFloat(d.salary) : null,
      updated_at: new Date().toISOString(),
    });
    if (!ok) return res.status(500).json({ error: 'Update failed' });

    // Audit log
    await dbInsert('sys_audit_logs', {
      user_id: req.user.id,
      user_name: req.user.full_name || req.user.username,
      action: 'UPDATE',
      module: 'Employees',
      details: `Updated employee ${d.Full_name} (${d.employee_id})`,
      created_at: new Date().toISOString()
    }).catch(console.error);

    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// DELETE /api/employees/:id
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    // Check if sys_user exists
    const user = await dbFetchOne('sys_users', 'id', { employee_id: req.params.id });
    if (user) await dbUpdate('sys_users', user.id, { is_active: false });

    // Soft delete employee
    await dbUpdate('Employees', req.params.id, { status: 'Inactive', deleted_at: new Date().toISOString() });
    
    // Audit log
    await dbInsert('sys_audit_logs', {
      user_id: req.user.id,
      user_name: req.user.full_name || req.user.username,
      action: 'DELETE',
      module: 'Employees',
      details: `Soft-deleted employee ID ${req.params.id}`,
      created_at: new Date().toISOString()
    }).catch(console.error);

    return res.json({ success: true, message: 'Employee soft-deleted' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// PUT /api/employees/:id/restore
router.put('/:id/restore', requireAdmin, async (req, res) => {
  try {
    await dbUpdate('Employees', req.params.id, { status: 'Active', deleted_at: null });
    
    // Reactivate sys_user if exists
    const user = await dbFetchOne('sys_users', 'id', { employee_id: req.params.id });
    if (user) await dbUpdate('sys_users', user.id, { is_active: true });

    // Audit log
    await dbInsert('sys_audit_logs', {
      user_id: req.user.id,
      user_name: req.user.full_name || req.user.username,
      action: 'UPDATE',
      module: 'Employees',
      details: `Restored employee ID ${req.params.id} from Recycle Bin`,
      created_at: new Date().toISOString()
    }).catch(console.error);

    return res.json({ success: true, message: 'Employee restored' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// DELETE /api/employees/:id/hard (Permanent Delete)
router.delete('/:id/hard', requireAdmin, async (req, res) => {
  try {
    // Delete sys_user explicitly
    const user = await dbFetchOne('sys_users', 'id', { employee_id: req.params.id });
    if (user) await dbDelete('sys_users', user.id);
    
    // Delete employee permanently
    await dbDelete('Employees', req.params.id);
    
    // Audit log
    await dbInsert('sys_audit_logs', {
      user_id: req.user.id,
      user_name: req.user.full_name || req.user.username,
      action: 'DELETE',
      module: 'Employees',
      details: `Permanently deleted employee ID ${req.params.id}`,
      created_at: new Date().toISOString()
    }).catch(console.error);

    return res.json({ success: true, message: 'Employee permanently deleted' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

export default router;
