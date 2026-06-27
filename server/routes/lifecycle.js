import express from 'express';
import { dbFetch, dbFetchOne, dbInsert, dbUpdate, dbDelete } from '../lib/supabase.js';
import { verifyToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();
router.use(verifyToken);

// Onboarding
router.get('/onboarding', async (req, res) => {
  try {
    const [onboarding, employees, assignments] = await Promise.all([
      dbFetch('employee_onboarding', '*', {}, { order: 'created_at', ascending: false }),
      dbFetch('Employees', 'id,Full_name,employee_id,hire_date', { status: 'Active' }),
      dbFetch('onboarding_assignments', 'onboarding_id,status')
    ]);
    const empMap = Object.fromEntries(employees.map(e => [e.id, e]));
    
    const assignMap = {};
    assignments.forEach(a => {
      if (!assignMap[a.onboarding_id]) assignMap[a.onboarding_id] = { total: 0, done: 0 };
      assignMap[a.onboarding_id].total += 1;
      if (a.status === 'Completed') assignMap[a.onboarding_id].done += 1;
    });

    onboarding.forEach(o => {
      const emp = empMap[o.employee_id] || {};
      o.employee_name = emp.Full_name || '—';
      o.employee_code = emp.employee_id || '—';
      
      const st = assignMap[o.id] || { total: 0, done: 0 };
      o.tasks_total = st.total;
      o.tasks_done = st.done;
      o.completion_pct = st.total ? Math.round((st.done / st.total) * 100) : 0;
    });

    const onboardedIds = new Set(onboarding.map(o => o.employee_id));
    const new_hires = employees.filter(e => !onboardedIds.has(e.id));
    
    const stats = {
      pre_boarding: onboarding.filter(o => o.status === 'Pre-boarding').length,
      in_progress: onboarding.filter(o => o.status === 'In Progress').length,
      completed: onboarding.filter(o => o.status === 'Completed').length,
    };

    return res.json({ onboarding, employees, new_hires, stats });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

router.get('/onboarding/:id', async (req, res) => {
  try {
    const ob = await dbFetchOne('employee_onboarding', '*', { id: req.params.id });
    if (!ob) return res.status(404).json({ error: 'Not found' });
    const [tasks, employees] = await Promise.all([
      dbFetch('onboarding_assignments', '*', { onboarding_id: req.params.id }),
      dbFetch('Employees', 'id,Full_name,employee_id'),
    ]);
    const empMap = Object.fromEntries(employees.map(e => [e.id, e]));
    const emp = empMap[ob.employee_id] || {};
    ob.employee_name = emp.Full_name || '—';
    // Enrich tasks with task definitions
    const taskDefs = await dbFetch('onboarding_tasks', '*');
    const tdMap = Object.fromEntries(taskDefs.map(t => [t.id, t]));
    tasks.forEach(t => { 
      const def = tdMap[t.task_id] || {};
      t.task_name = def.task_name || '—'; 
      t.category = def.category || 'General';
      t.is_preboarding = def.is_preboarding || false;
      t.assigned_to = def.assigned_to_role || 'HR';
    });
    return res.json({ onboarding: ob, tasks });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

router.post('/onboarding', requireAdmin, async (req, res) => {
  try {
    const d = req.body;
    const sd = d.start_date || new Date().toISOString().slice(0, 10);
    const result = await dbInsert('employee_onboarding', {
      employee_id: d.employee_id, status: d.status || 'Pre-boarding',
      start_date: sd, notes: d.notes || null,
      created_at: new Date().toISOString(),
    });
    
    if (result) {
      const defaultTasks = await dbFetch('onboarding_tasks', 'id,due_days_after_hire');
      for (const task of defaultTasks) {
        const dueDays = parseInt(task.due_days_after_hire || 1);
        const dueDate = new Date(new Date(sd).getTime() + dueDays * 24 * 60 * 60 * 1000);
        await dbInsert('onboarding_assignments', {
          onboarding_id: result.id,
          task_id: task.id,
          status: 'Pending',
          due_date: dueDate.toISOString().slice(0, 10),
          created_at: new Date().toISOString(),
        });
      }
    }
    
    return res.json({ success: !!result, onboarding: result });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

router.put('/onboarding/:id', requireAdmin, async (req, res) => {
  try {
    const d = req.body;
    await dbUpdate('employee_onboarding', req.params.id, { status: d.status, notes: d.notes, updated_at: new Date().toISOString() });
    return res.json({ success: true });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

router.post('/onboarding/:id/task/:assign_id/complete', requireAdmin, async (req, res) => {
  try {
    const obId = req.params.id;
    const assignId = req.params.assign_id;
    
    const assign = await dbFetchOne('onboarding_assignments', '*', { id: assignId });
    if (!assign) return res.status(404).json({ error: 'Task not found' });

    const isCompleted = assign.status === 'Completed';
    await dbUpdate('onboarding_assignments', assignId, {
      status: isCompleted ? 'Pending' : 'Completed',
      completed_at: isCompleted ? null : new Date().toISOString()
    });

    const allAssignments = await dbFetch('onboarding_assignments', 'status', { onboarding_id: obId });
    const done = allAssignments.filter(a => a.status === 'Completed').length;
    const total = allAssignments.length;
    const pct = total ? Math.round((done / total) * 100) : 0;
    const newStatus = pct === 100 ? 'Completed' : 'In Progress';
    
    await dbUpdate('employee_onboarding', obId, { completion_pct: pct, status: newStatus });

    return res.json({ success: true, pct, status: newStatus });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

// Offboarding
router.get('/offboarding', async (req, res) => {
  try {
    const [offboarding, employees, tasks, departments] = await Promise.all([
      dbFetch('corporate_offboarding', '*', {}, { order: 'created_at', ascending: false }),
      dbFetch('Employees', 'id,Full_name,employee_id,Dept_id,position_id'),
      dbFetch('offboarding_tasks', 'offboarding_id,status'),
      dbFetch('departments', 'id,name'),
    ]);
    const empMap = Object.fromEntries(employees.map(e => [e.id, e]));
    const deptMap = Object.fromEntries(departments.map(d => [d.id, d.name]));

    // Task counts per offboarding
    const taskMap = {};
    tasks.forEach(t => {
      if (!taskMap[t.offboarding_id]) taskMap[t.offboarding_id] = { total: 0, done: 0 };
      taskMap[t.offboarding_id].total += 1;
      if (t.status === 'Completed') taskMap[t.offboarding_id].done += 1;
    });

    offboarding.forEach(o => {
      const emp = empMap[o.employee_id] || {};
      o.employee_name = emp.Full_name || '—';
      o.employee_code = emp.employee_id || '—';
      o.department = deptMap[emp.Dept_id] || '—';
      const st = taskMap[o.id] || { total: 0, done: 0 };
      o.tasks_total = st.total;
      o.tasks_done = st.done;
      o.completion_pct = st.total ? Math.round((st.done / st.total) * 100) : 0;
    });
    return res.json({ offboarding, employees });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

router.get('/offboarding/:id/detail', async (req, res) => {
  try {
    const ob = await dbFetchOne('corporate_offboarding', '*', { id: req.params.id });
    if (!ob) return res.status(404).json({ error: 'Not found' });
    const employees = await dbFetch('Employees', 'id,Full_name,employee_id');
    const empMap = Object.fromEntries(employees.map(e => [e.id, e]));
    const emp = empMap[ob.employee_id] || {};
    ob.employee_name = emp.Full_name || '—';
    ob.employee_code = emp.employee_id || '—';

    const tasks = await dbFetch('offboarding_tasks', '*', { offboarding_id: req.params.id });
    return res.json({ offboarding: ob, tasks });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

router.get('/offboarding/:id', async (req, res) => {
  try {
    const ob = await dbFetchOne('corporate_offboarding', '*', { id: req.params.id });
    if (!ob) return res.status(404).json({ error: 'Not found' });
    const employees = await dbFetch('Employees', 'id,Full_name,employee_id');
    const empMap = Object.fromEntries(employees.map(e => [e.id, e]));
    const emp = empMap[ob.employee_id] || {};
    ob.employee_name = emp.Full_name || '—';
    return res.json({ offboarding: ob });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

router.post('/offboarding', requireAdmin, async (req, res) => {
  try {
    const d = req.body;
    const result = await dbInsert('corporate_offboarding', {
      employee_id: d.employee_id,
      last_working_day: d.last_working_day || null,
      reason: d.reason || null,
      exit_type: d.exit_type || null,
      resignation_date: d.resignation_date || null,
      settlement_status: 'Hold',
      created_at: new Date().toISOString(),
    });

    // Auto-create default offboarding tasks
    if (result) {
      const defaultTasks = [
        { task_name: 'Return Laptop & Equipment', category: 'IT', responsible: 'IT' },
        { task_name: 'Revoke All System Access', category: 'IT', responsible: 'IT' },
        { task_name: 'Return Access Card & Keys', category: 'Facilities', responsible: 'Facilities' },
        { task_name: 'Sign NDA Exit Confirmation', category: 'Legal', responsible: 'HR' },
        { task_name: 'Complete Knowledge Transfer Doc', category: 'Knowledge Transfer', responsible: 'Manager' },
        { task_name: 'Handover Projects & Tasks', category: 'Knowledge Transfer', responsible: 'Manager' },
        { task_name: 'Clear Outstanding Expenses', category: 'Finance', responsible: 'Finance' },
        { task_name: 'Final Payroll Calculation', category: 'Finance', responsible: 'Finance' },
        { task_name: 'Return Company Documents', category: 'HR', responsible: 'HR' },
        { task_name: 'Schedule Exit Interview', category: 'HR', responsible: 'HR' },
      ];
      for (const task of defaultTasks) {
        await dbInsert('offboarding_tasks', {
          offboarding_id: result.id,
          task_name: task.task_name,
          category: task.category,
          responsible: task.responsible,
          status: 'Pending',
          due_date: d.last_working_day || null,
          created_at: new Date().toISOString(),
        });
      }
    }

    return res.json({ success: !!result, offboarding: result });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

router.put('/offboarding/:id', requireAdmin, async (req, res) => {
  try {
    const d = req.body;
    await dbUpdate('corporate_offboarding', req.params.id, { settlement_status: d.settlement_status, notes: d.notes, updated_at: new Date().toISOString() });
    return res.json({ success: true });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

// Toggle individual clearance field
router.patch('/offboarding/:id/clearance', requireAdmin, async (req, res) => {
  try {
    const { field, value } = req.body;
    const allowed = ['laptop_returned', 'access_card_returned', 'nda_signed', 'knowledge_transfer'];
    if (!allowed.includes(field)) return res.status(400).json({ error: 'Invalid field' });
    await dbUpdate('corporate_offboarding', req.params.id, { [field]: value, updated_at: new Date().toISOString() });
    return res.json({ success: true });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

// Release final settlement
router.patch('/offboarding/:id/release', requireAdmin, async (req, res) => {
  try {
    await dbUpdate('corporate_offboarding', req.params.id, { settlement_status: 'Released', updated_at: new Date().toISOString() });
    return res.json({ success: true });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

// Toggle a task complete/pending
router.post('/offboarding/:id/task/:taskId/toggle', requireAdmin, async (req, res) => {
  try {
    const task = await dbFetchOne('offboarding_tasks', '*', { id: req.params.taskId });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    const isDone = task.status === 'Completed';
    await dbUpdate('offboarding_tasks', req.params.taskId, {
      status: isDone ? 'Pending' : 'Completed',
      completed_at: isDone ? null : new Date().toISOString(),
    });
    return res.json({ success: true });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

// Save exit interview
router.post('/offboarding/:id/exit-interview', requireAdmin, async (req, res) => {
  try {
    const d = req.body;
    const ei = await dbFetchOne('exit_interviews', '*', { offboarding_id: req.params.id });
    const dataObj = {
      offboarding_id: req.params.id,
      interviewer_name: d.interviewer_name,
      interview_date: d.interview_date,
      reason_for_leaving: d.reason_for_leaving,
      job_satisfaction: d.job_satisfaction,
      management_rating: d.management_rating,
      work_environment: d.work_environment,
      compensation_benefits: d.compensation_benefits,
      career_growth: d.career_growth,
      return_future: d.return_future,
      recommend_company: d.recommend_company,
      highlights: d.highlights,
      improvements: d.improvements,
      additional_comments: d.additional_comments,
      updated_at: new Date().toISOString()
    };
    if (ei) {
      await dbUpdate('exit_interviews', ei.id, dataObj);
    } else {
      await dbInsert('exit_interviews', { ...dataObj, created_at: new Date().toISOString() });
    }
    return res.json({ success: true });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

// Portal: Exit Survey
router.get('/exit-survey', async (req, res) => {
  try {
    const empId = req.user.employee_id;
    if (!empId) return res.json({ ob: null, ei: null });
    
    const ob = await dbFetchOne('corporate_offboarding', '*', { employee_id: empId });
    if (!ob) return res.json({ ob: null, ei: null });
    
    const ei = await dbFetchOne('exit_interviews', '*', { offboarding_id: ob.id });
    return res.json({ ob, ei });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

router.post('/exit-survey', async (req, res) => {
  try {
    const d = req.body;
    const empId = req.user.employee_id;
    if (!empId) return res.status(400).json({ error: 'No employee profile' });
    
    const ob = await dbFetchOne('corporate_offboarding', '*', { employee_id: empId });
    if (!ob) return res.status(400).json({ error: 'No offboarding record found for you' });
    
    const ei = await dbFetchOne('exit_interviews', '*', { offboarding_id: ob.id });
    
    const dataObj = {
      offboarding_id: ob.id,
      reason_for_leaving: d.reason_for_leaving,
      job_satisfaction: d.job_satisfaction,
      management_rating: d.management_rating,
      work_environment: d.work_environment,
      compensation_benefits: d.compensation_benefits,
      career_growth: d.career_growth,
      return_future: d.return_future,
      recommend_company: d.recommend_company,
      highlights: d.highlights,
      improvements: d.improvements,
      additional_comments: d.additional_comments,
      updated_at: new Date().toISOString()
    };
    
    if (ei) {
      await dbUpdate('exit_interviews', ei.id, dataObj);
    } else {
      await dbInsert('exit_interviews', dataObj);
    }
    
    return res.json({ success: true, message: 'Exit Survey submitted successfully!' });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

export default router;
