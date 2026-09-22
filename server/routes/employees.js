import express from 'express';
import { dbFetch, dbFetchOne, dbInsert, dbUpdate, dbDelete } from '../lib/supabase.js';
import { verifyToken, requireAdmin, hashPassword } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createEmployeeSchema } from '../schemas/index.js';
import { supabase } from '../lib/supabase.js';
import multer from 'multer';
import { hrmModule } from '../modules/hrm/index.js';
import { payrollModule } from '../modules/payroll/index.js';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

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
      /manager|boss|ceo|head|lead|director/i.test(e.Full_name || '') ||
      /manager|boss|ceo|head|lead|director/i.test(e.employee_id || '')
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
      payrollModule.getEmployeePayrolls(req.params.id, true),
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

    // Fetch Career Timeline
    let careerTimeline = [];
    try {
      careerTimeline = await dbFetch('employee_career_timeline', '*', { employee_id: req.params.id }, { order: 'effective_date', ascending: false });
    } catch (e) {
      console.warn('employee_career_timeline error:', e.message);
    }

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
      career_timeline: careerTimeline,
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// GET /api/employees/:id/timeline
router.get('/:id/timeline', async (req, res) => {
  try {
    let items = [];
    try {
      items = await dbFetch('employee_career_timeline', '*', { employee_id: req.params.id }, { order: 'effective_date', ascending: false });
    } catch (e) {
      items = [];
    }
    return res.json({ timeline: items });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// POST /api/employees
router.post('/', requireAdmin, validate(createEmployeeSchema), async (req, res) => {
  try {
    const { result, credentials } = await hrmModule.createEmployee(req.body, req.user);
    return res.json({ success: true, employee: result, message: `Employee added! Login: ${credentials.username} / ${credentials.defaultPassword}` });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// PUT /api/employees/:id
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    await hrmModule.updateEmployee(req.params.id, req.body, req.user);
    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// POST /api/employees/bulk-import (Bulk Upload/Update Employee Numbers & Base Salaries via JSON or Excel/CSV)
router.post('/bulk-import', requireAdmin, upload.single('file'), async (req, res) => {
  try {
    let rows = [];
    if (req.file) {
      const wb = (await import('xlsx')).default.read(req.file.buffer, { type: 'buffer' });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      rows = (await import('xlsx')).default.utils.sheet_to_json(sheet);
    } else if (Array.isArray(req.body.employees)) {
      rows = req.body.employees;
    } else {
      return res.status(400).json({ error: 'No Excel file or employee payload provided.' });
    }

    if (!rows.length) return res.status(400).json({ error: 'Payload or Excel sheet is empty.' });

    let updatedCount = 0;
    let createdCount = 0;
    const errors = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const empId = String(row.employee_id || row['Employee ID'] || row['EmployeeID'] || row.id || '').trim();
      const name = String(row.Full_name || row['Full Name'] || row.name || row['Name'] || '').trim();
      const salaryVal = row.salary !== undefined ? row.salary : (row['Salary'] !== undefined ? row['Salary'] : row['Base Salary']);
      const parsedSalary = salaryVal !== undefined && salaryVal !== '' && !isNaN(salaryVal) ? parseFloat(salaryVal) : null;
      const email = row.email || row['Email'] || null;
      const phone = row.phone || row['Phone'] || null;
      const dbId = row.db_id || row.id;

      if (!empId && !name && !dbId) continue;

      try {
        let existing = null;
        if (dbId) existing = await dbFetchOne('Employees', '*', { id: dbId });
        if (!existing && empId) existing = await dbFetchOne('Employees', '*', { employee_id: empId });

        if (existing) {
          // UPDATE
          const newEmpId = empId || existing.employee_id;
          const oldSal = existing.salary ? parseFloat(existing.salary) : 0;
          const updateObj = {
            employee_id: newEmpId,
            updated_at: new Date().toISOString()
          };
          if (name) updateObj.Full_name = name;
          if (parsedSalary !== null) updateObj.salary = parsedSalary;
          if (email) updateObj.email = email;
          if (phone) updateObj.phone = phone;

          await dbUpdate('Employees', existing.id, updateObj);

          if (newEmpId && newEmpId !== existing.employee_id) {
            const sysUser = await dbFetchOne('sys_users', 'id', { employee_id: existing.id });
            if (sysUser) {
              await dbUpdate('sys_users', sysUser.id, { username: newEmpId.toLowerCase() });
            }
          }

          if (parsedSalary !== null && oldSal !== parsedSalary) {
            const diff = parsedSalary - oldSal;
            await dbInsert('employee_career_timeline', {
              employee_id: existing.id,
              event_type: diff > 0 ? 'SALARY_RAISE' : 'OTHER',
              title: diff > 0 ? `Salary Increased by $${diff.toLocaleString()}` : `Salary Adjusted to $${parsedSalary.toLocaleString()}`,
              description: `Bulk update: Base salary changed from $${oldSal.toLocaleString()} to $${parsedSalary.toLocaleString()}`,
              previous_salary: oldSal,
              new_salary: parsedSalary,
              effective_date: new Date().toISOString().split('T')[0],
              created_at: new Date().toISOString(),
            }).catch(console.error);
          }

          updatedCount++;
        } else {
          // CREATE
          if (!name || !empId) {
            errors.push(`Row ${i + 1}: Name and Employee ID are required for new records.`);
            continue;
          }
          const { data: createdData } = await supabase.from('Employees').insert({
            employee_id: empId,
            Full_name: name,
            salary: parsedSalary,
            email, phone,
            created_at: new Date().toISOString(),
          }).select();

          const created = createdData?.[0];
          if (created) {
            await dbInsert('sys_users', {
              username: empId.toLowerCase(),
              password_hash: 'MUST_CHANGE:' + hashPassword('123456'),
              role: 'employee',
              employee_id: created.id,
              full_name: name,
            }).catch(console.error);

            await dbInsert('employee_career_timeline', {
              employee_id: created.id,
              event_type: 'HIRED',
              title: `Joined Company`,
              description: `Bulk imported with base salary $${parsedSalary || 0}`,
              new_salary: parsedSalary,
              effective_date: new Date().toISOString().split('T')[0],
              created_at: new Date().toISOString(),
            }).catch(console.error);

            createdCount++;
          }
        }
      } catch (err) {
        errors.push(`Row ${i + 1} error: ${err.message}`);
      }
    }

    return res.json({
      success: true,
      message: `Bulk update completed! Updated: ${updatedCount}, Created: ${createdCount}`,
      updatedCount,
      createdCount,
      errors
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// POST /api/employees/:id/avatar
router.post('/:id/avatar', upload.single('avatar'), async (req, res) => {
  try {
    const eid = req.params.id;
    // Only allow if user is admin, boss, or the employee themselves
    const isAdmin = ['boss', 'hr_manager', 'general_manager'].includes(req.user.role);
    if (!isAdmin && req.user.employee_id !== parseInt(eid) && req.user.employee_id !== eid) {
      return res.status(403).json({ error: 'Not authorized to update this avatar' });
    }

    if (!req.file) return res.status(400).json({ error: 'No image provided' });

    const fileExt = req.file.originalname.split('.').pop();
    const fileName = `avatar_${eid}_${Date.now()}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: true
      });

    if (uploadError) throw new Error(`Storage error: ${uploadError.message}`);

    const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
    const avatar_url = publicUrlData.publicUrl;

    const ok = await dbUpdate('Employees', eid, {
      avatar_url: avatar_url,
      updated_at: new Date().toISOString()
    });

    if (!ok) throw new Error('Failed to update employee record');

    await dbInsert('sys_audit_logs', {
      user_id: req.user.id,
      action: 'UPDATE',
      module: 'Employees',
      details: `Updated avatar for employee ID ${eid}`,
      ip_address: req.ip || '0.0.0.0'
    }).catch(console.error);

    return res.json({ success: true, avatar_url });
  } catch (e) {
    console.error('Avatar upload error:', e);
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
    const eid = req.params.id;
    // Helper to throw on error, but ignore table missing errors
    const cascade = async (table, col = 'employee_id') => {
      const { error } = await supabase.from(table).delete().eq(col, eid);
      // PGRST205: table doesn't exist. We can safely ignore this.
      if (error && error.code !== '42P01' && error.code !== 'PGRST205') { 
        console.error(`Error deleting from ${table}:`, error);
        throw new Error(`Cannot delete: referenced in ${table}`);
      }
    };

    // Delete all related records across modules first to prevent foreign key errors
    await cascade('sys_users');
    await cascade('Leave_balances');
    await cascade('Leave_Request');
    await cascade('attendance_records');
    await cascade('biometric_registrations');
    await cascade('kpis');
    await cascade('payrolls');
    await cascade('employee_documents');
    await cascade('schedules');
    await cascade('roster_shifts');
    await cascade('peer_voting_records', 'nominee_id');
    await cascade('peer_voting_records', 'voter_id');
    await cascade('employee_daily_schedules');
    await cascade('employee_onboarding');

    // Also nullify Manager_id in Employees where this user is the manager
    await supabase.from('Employees').update({ Manager_id: null }).eq('Manager_id', eid);
    
    // Delete employee permanently
    const { error: deleteErr } = await supabase.from('Employees').delete().eq('id', eid);
    if (deleteErr) throw new Error(`Cannot delete employee: ${deleteErr.message}`);
    
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
