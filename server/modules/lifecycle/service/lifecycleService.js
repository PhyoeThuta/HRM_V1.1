import { lifecycleRepository } from '../repository/lifecycleRepository.js';
import { handoverModule } from '../../handover/index.js';
import { dbFetch, dbFetchOne, dbInsert, dbUpdate } from '../../../lib/supabase.js';

function normalizeOffboarding(ob) {
  if (!ob) return ob;
  ob.last_working_day = ob.last_working_day || ob.last_working_date || null;
  ob.reason = ob.reason || ob.termination_reason || null;
  return ob;
}

export const lifecycleService = {
  // --- Onboarding ---
  getOnboardingList: async () => {
    const [onboarding, employees, assignments] = await Promise.all([
      lifecycleRepository.getAllOnboardings(),
      dbFetch('Employees', 'id,Full_name,employee_id,hire_date', { status: 'Active' }),
      lifecycleRepository.getAllOnboardingAssignmentsStatus()
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

    return { onboarding, employees, new_hires, stats };
  },

  getOnboardingDetail: async (id) => {
    const ob = await lifecycleRepository.getOnboardingById(id);
    if (!ob) return null;
    
    const [tasks, employees, taskDefs] = await Promise.all([
      lifecycleRepository.getAssignmentsByOnboardingId(id),
      dbFetch('Employees', 'id,Full_name,employee_id'),
      lifecycleRepository.getOnboardingTasks()
    ]);
    
    const empMap = Object.fromEntries(employees.map(e => [e.id, e]));
    const emp = empMap[ob.employee_id] || {};
    ob.employee_name = emp.Full_name || '—';
    
    const tdMap = Object.fromEntries(taskDefs.map(t => [t.id, t]));
    tasks.forEach(t => { 
      const def = tdMap[t.task_id] || {};
      t.task_name = def.task_name || '—'; 
      t.category = def.category || 'General';
      t.is_preboarding = def.is_preboarding || false;
      t.assigned_to = def.assigned_to_role || 'HR';
    });
    
    return { onboarding: ob, tasks };
  },

  createOnboarding: async (data) => {
    const sd = data.start_date || new Date().toISOString().slice(0, 10);
    const result = await lifecycleRepository.createOnboarding({
      employee_id: data.employee_id, 
      status: data.status || 'Pre-boarding',
      start_date: sd, 
      notes: data.notes || null,
      created_at: new Date().toISOString(),
    });
    
    if (result) {
      const defaultTasks = await lifecycleRepository.getDefaultOnboardingTasks();
      const insertTasks = [];
      for (const task of defaultTasks) {
        const dueDays = parseInt(task.due_days_after_hire || 1);
        const dueDate = new Date(new Date(sd).getTime() + dueDays * 24 * 60 * 60 * 1000);
        insertTasks.push({
          onboarding_id: result.id,
          task_id: task.id,
          status: 'Pending',
          due_date: dueDate.toISOString().slice(0, 10),
          created_at: new Date().toISOString(),
        });
      }
      if (insertTasks.length > 0) {
        await lifecycleRepository.createAssignmentsBulk(insertTasks);
      }
    }
    
    return result;
  },

  updateOnboarding: async (id, data) => {
    return await lifecycleRepository.updateOnboarding(id, {
      status: data.status,
      notes: data.notes,
      updated_at: new Date().toISOString()
    });
  },

  toggleOnboardingTask: async (onboardingId, assignId) => {
    const assign = await lifecycleRepository.getAssignmentById(assignId);
    if (!assign) throw new Error('Task not found');

    const isCompleted = assign.status === 'Completed';
    await lifecycleRepository.updateAssignment(assignId, {
      status: isCompleted ? 'Pending' : 'Completed',
      completed_at: isCompleted ? null : new Date().toISOString()
    });

    const allAssignments = await lifecycleRepository.getAssignmentStatusCounts(onboardingId);
    const done = allAssignments.filter(a => a.status === 'Completed').length;
    const total = allAssignments.length;
    const pct = total ? Math.round((done / total) * 100) : 0;
    const newStatus = pct === 100 ? 'Completed' : 'In Progress';
    
    await lifecycleRepository.updateOnboarding(onboardingId, { completion_pct: pct, status: newStatus });
    
    return { pct, status: newStatus };
  },

  // --- Offboarding ---
  getOffboardingList: async () => {
    const [offboarding, employees, tasks, departments] = await Promise.all([
      lifecycleRepository.getAllOffboardings(),
      dbFetch('Employees', 'id,Full_name,employee_id,Dept_id,position_id'),
      lifecycleRepository.getAllOffboardingTasksStatus(),
      dbFetch('Departments', 'id,Department_name'),
    ]);
    
    const empMap = Object.fromEntries(employees.map(e => [e.id, e]));
    const deptMap = Object.fromEntries(departments.map(d => [d.id, d.Department_name]));

    const taskMap = {};
    tasks.forEach(t => {
      if (!taskMap[t.offboarding_id]) taskMap[t.offboarding_id] = { total: 0, done: 0 };
      taskMap[t.offboarding_id].total += 1;
      if (t.status === 'Completed') taskMap[t.offboarding_id].done += 1;
    });

    offboarding.forEach(o => {
      normalizeOffboarding(o);
      const emp = empMap[o.employee_id] || {};
      o.employee_name = emp.Full_name || '—';
      o.employee_code = emp.employee_id || '—';
      o.department = deptMap[emp.Dept_id] || '—';
      
      const st = taskMap[o.id] || { total: 0, done: 0 };
      o.tasks_total = st.total;
      o.tasks_done = st.done;
      o.completion_pct = st.total ? Math.round((st.done / st.total) * 100) : 0;
    });
    
    return { offboarding, employees };
  },

  getOffboardingDetail: async (id) => {
    const ob = await lifecycleRepository.getOffboardingById(id);
    if (!ob) return null;
    
    const employees = await dbFetch('Employees', 'id,Full_name,employee_id');
    const empMap = Object.fromEntries(employees.map(e => [e.id, e]));
    const emp = empMap[ob.employee_id] || {};
    ob.employee_name = emp.Full_name || '—';
    ob.employee_code = emp.employee_id || '—';

    const tasks = await lifecycleRepository.getTasksByOffboardingId(id);
    
    let handover = null;
    normalizeOffboarding(ob);
    // Still safely querying handovers using direct dbFetchOne here to maintain exact legacy behavior for now.
    // Or we could use handoverModule. However, the requirement is to use handoverModule if possible.
    if (ob.handover_id) {
      handover = await dbFetchOne('employee_handovers', '*', { id: ob.handover_id });
    } else {
      handover = await dbFetchOne('employee_handovers', '*', { offboarding_id: ob.id });
    }

    return { offboarding: ob, tasks, handover };
  },

  getOffboardingSimple: async (id) => {
    const ob = await lifecycleRepository.getOffboardingById(id);
    if (!ob) return null;
    const employees = await dbFetch('Employees', 'id,Full_name,employee_id');
    const empMap = Object.fromEntries(employees.map(e => [e.id, e]));
    const emp = empMap[ob.employee_id] || {};
    ob.employee_name = emp.Full_name || '—';
    return { offboarding: ob };
  },

  createOffboarding: async (data, creatorUserId) => {
    const lastDay = data.last_working_day || data.last_working_date || null;
    const result = await lifecycleRepository.createOffboarding({
      employee_id: data.employee_id,
      last_working_date: lastDay,
      termination_reason: data.reason || data.termination_reason || null,
      exit_type: data.exit_type || null,
      resignation_date: data.resignation_date || null,
      settlement_status: 'Hold',
      created_at: new Date().toISOString(),
    });

    if (result) {
      normalizeOffboarding(result);
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
      const insertTasks = defaultTasks.map(task => ({
        offboarding_id: result.id,
        task_name: task.task_name,
        category: task.category,
        responsible: task.responsible,
        status: 'Pending',
        due_date: lastDay,
        created_at: new Date().toISOString(),
      }));
      
      if (insertTasks.length > 0) {
        await lifecycleRepository.createTasksBulk(insertTasks);
      }

      // Use the direct Handover module reference
      await handoverModule.createHandoverForOffboarding(result, creatorUserId);

      // Identity system notifications
      const outgoingUser = await dbFetchOne('sys_users', 'id', { employee_id: data.employee_id });
      if (outgoingUser) {
        await dbInsert('system_notifications', {
          recipient_user_id: outgoingUser.id,
          title: 'Offboarding started — complete handover',
          message: 'Please complete your employee handover checklist before your last working day.',
          link_url: '/portal/handover/outgoing',
          is_read: false,
          created_at: new Date().toISOString(),
        });
      }
    }
    return result;
  },

  updateOffboardingStatus: async (id, data) => {
    return await lifecycleRepository.updateOffboarding(id, { 
      settlement_status: data.settlement_status, 
      updated_at: new Date().toISOString() 
    });
  },

  toggleClearanceField: async (id, field, value) => {
    const allowed = ['laptop_returned', 'access_card_returned', 'nda_signed', 'knowledge_transfer'];
    if (!allowed.includes(field)) throw new Error('Invalid field');
    return await lifecycleRepository.updateOffboarding(id, { 
      [field]: value, 
      updated_at: new Date().toISOString() 
    });
  },

  releaseSettlement: async (id) => {
    const ob = await lifecycleRepository.getOffboardingById(id);
    if (!ob) throw new Error('Not found');

    const tasks = await lifecycleRepository.getAllOffboardingTasksStatus();
    const specificTasks = tasks.filter(t => t.offboarding_id === id);
    const allDone = specificTasks.length > 0 && specificTasks.every(t => t.status === 'Completed');
    
    if (!allDone) {
      throw new Error('Complete all offboarding tasks before releasing settlement');
    }

    if (await handoverModule.isHandoverBlockingSettlement(ob)) {
      throw new Error('Handover must be completed or waived before releasing final settlement');
    }

    return await lifecycleRepository.updateOffboarding(id, { 
      settlement_status: 'Released', 
      updated_at: new Date().toISOString() 
    });
  },

  toggleOffboardingTask: async (taskId) => {
    const task = await lifecycleRepository.getTaskById(taskId);
    if (!task) throw new Error('Task not found');
    const isDone = task.status === 'Completed';
    return await lifecycleRepository.updateTask(taskId, {
      status: isDone ? 'Pending' : 'Completed',
      completed_at: isDone ? null : new Date().toISOString(),
    });
  },

  saveExitInterview: async (id, data) => {
    const ei = await lifecycleRepository.getExitInterviewByOffboardingId(id);
    const dataObj = {
      offboarding_id: id,
      interviewer_name: data.interviewer_name,
      interview_date: data.interview_date,
      reason_for_leaving: data.reason_for_leaving,
      job_satisfaction: data.job_satisfaction,
      management_rating: data.management_rating,
      work_environment: data.work_environment,
      compensation_benefits: data.compensation_benefits,
      career_growth: data.career_growth,
      return_future: data.return_future,
      recommend_company: data.recommend_company,
      highlights: data.highlights,
      improvements: data.improvements,
      additional_comments: data.additional_comments,
      updated_at: new Date().toISOString()
    };
    
    if (ei) {
      await lifecycleRepository.updateExitInterview(ei.id, dataObj);
    } else {
      await lifecycleRepository.createExitInterview({ ...dataObj, created_at: new Date().toISOString() });
    }
  },

  getExitSurvey: async (employeeId) => {
    if (!employeeId) return { ob: null, ei: null };
    
    const ob = await lifecycleRepository.getOffboardingByEmployeeId(employeeId);
    if (!ob) return { ob: null, ei: null };
    
    const ei = await lifecycleRepository.getExitInterviewByOffboardingId(ob.id);
    return { ob, ei };
  },

  linkHandover: async (offboardingId, handoverId) => {
    return await lifecycleRepository.updateOffboarding(offboardingId, {
      handover_id: handoverId,
      handover_required: true,
      updated_at: new Date().toISOString()
    });
  },

  getActiveOffboardingWarning: async (employeeId) => {
    if (!employeeId) return null;
    const ob = await lifecycleRepository.getOffboardingByEmployeeId(employeeId);
    if (!ob) return null;
    return {
      code: 'employee_in_offboarding',
      message: 'This employee has an active offboarding case. Leave and offboarding will run in parallel — continue tracking laptop return, NDA, exit interview, and settlement on Offboarding.',
      offboarding_id: ob.id,
      last_working_date: ob.last_working_date || null,
    };
  },

  getOffboardingById: async (id) => {
    return await lifecycleRepository.getOffboardingById(id);
  },

  submitExitSurvey: async (employeeId, data) => {
    if (!employeeId) throw new Error('No employee profile');
    
    const ob = await lifecycleRepository.getOffboardingByEmployeeId(employeeId);
    if (!ob) throw new Error('No offboarding record found for you');
    
    const ei = await lifecycleRepository.getExitInterviewByOffboardingId(ob.id);
    const dataObj = {
      offboarding_id: ob.id,
      reason_for_leaving: data.reason_for_leaving,
      job_satisfaction: data.job_satisfaction,
      management_rating: data.management_rating,
      work_environment: data.work_environment,
      compensation_benefits: data.compensation_benefits,
      career_growth: data.career_growth,
      return_future: data.return_future,
      recommend_company: data.recommend_company,
      highlights: data.highlights,
      improvements: data.improvements,
      additional_comments: data.additional_comments,
      updated_at: new Date().toISOString()
    };
    
    if (ei) {
      await lifecycleRepository.updateExitInterview(ei.id, dataObj);
    } else {
      await lifecycleRepository.createExitInterview(dataObj);
    }
  },

  markKnowledgeTransferComplete: async (offboardingId, options = {}) => {
    if (!offboardingId) return;

    const { isWaived, reason, userId } = options;

    const updateData = {
      knowledge_transfer: true,
      updated_at: new Date().toISOString(),
    };

    if (isWaived) {
      updateData.handover_required = false;
      updateData.handover_waived_reason = reason;
      updateData.handover_waived_by = userId;
    }

    await lifecycleRepository.updateOffboarding(offboardingId, updateData);

    const tasks = await lifecycleRepository.getTasksByOffboardingId(offboardingId);
    for (const t of tasks) {
      if (
        t.category === 'Knowledge Transfer' ||
        (t.task_name && (t.task_name.includes('Knowledge Transfer') || t.task_name.includes('Handover')))
      ) {
        if (t.status !== 'Completed') {
          await lifecycleRepository.updateTask(t.id, {
            status: 'Completed',
            completed_at: new Date().toISOString(),
          });
        }
      }
    }
  },

  getLastWorkingDate: async (employeeId) => {
    if (!employeeId) return null;
    const records = await lifecycleRepository.getCorporateOffboarding();
    const ob = records.find(r => r.employee_id === employeeId);
    return ob || null;
  }
};
