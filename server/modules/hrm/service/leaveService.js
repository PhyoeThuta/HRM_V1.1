import { leaveRepository } from '../repository/leaveRepository.js';
import {
  enrichLeaveWithHandoverFlags,
  getOffboardingWarningForEmployee,
  getActiveLinkedLeaveHandovers,
  detachTerminalHandoversFromLeave,
} from '../../../lib/handoverHelpers.js';
import { dbFetch, dbFetchOne } from '../../../lib/supabase.js';

export const leaveService = {
  getLeaveOverview: async (isAdmin, employeeId) => {
    const reqFilter = isAdmin ? {} : { employee_id: employeeId };
    const balFilter = isAdmin ? {} : { employee_id: employeeId };

    const [requests, leaveTypes, employees, balances] = await Promise.all([
      leaveRepository.getLeaveRequests(reqFilter, { order: 'created_at', ascending: false }),
      leaveRepository.getLeaveTypes(),
      dbFetch('Employees', 'id,Full_name,employee_id', { status: 'Active' }),
      leaveRepository.getLeaveBalances(balFilter)
    ]);

    const ltMap = Object.fromEntries(leaveTypes.map(t => [t.id, t.type_name]));
    const empMap = Object.fromEntries(employees.map(e => [e.id, e]));
    
    const activeBalances = balances.filter(b => empMap[b.employee_id]);
    
    const handoverIds = [
      ...new Set(
        requests.flatMap(r => [r.coverage_handover_id, r.return_handover_id].filter(Boolean))
      ),
    ];
    let handoverMap = {};
    if (handoverIds.length) {
      const handovers = await leaveRepository.getHandoversByIds(handoverIds);
      handoverMap = Object.fromEntries(handovers.map(h => [h.id, h]));
    }

    const { lifecycleModule } = await import('../../lifecycle/index.js');

    for (const r of requests) {
      r.type_name = ltMap[r.leave_type_id] || '—';
      const emp = empMap[r.employee_id] || {};
      r.employee_name = emp.Full_name || '—';
      r.employee_code = emp.employee_id || '—';
      await enrichLeaveWithHandoverFlags(r, handoverMap);
      
      const ob = await lifecycleModule.getLastWorkingDate(r.employee_id);
      r.employee_in_offboarding = !!ob;
      if (ob) {
        r.offboarding_warning =
          'Employee is in offboarding. Leave coverage can proceed, but exit tasks (laptop, NDA, exit interview, settlement) must still be completed separately.';
        r.offboarding_last_working_date = ob.last_working_date || null;
      }
    }
    activeBalances.forEach(b => { b.type_name = ltMap[b.leave_type_id] || '—'; });
    
    return { requests, leave_types: leaveTypes, employees, balances: activeBalances };
  },

  createLeaveRequest: async (data, documentUrl) => {
    const start = new Date(data.start_date);
    const end = new Date(data.end_date);
    if (end < start) {
      throw new Error('Invalid date range: end date cannot be earlier than start date.');
    }
    return await leaveRepository.createLeaveRequest({
      employee_id: data.employee_id,
      leave_type_id: data.leave_type_id,
      start_date: data.start_date,
      end_date: data.end_date,
      reason: data.reason,
      status: 'Pending',
      document_url: documentUrl,
      created_at: new Date().toISOString(),
    });
  },

  updateLeaveStatus: async (id, status, e_signature, currentEmployeeId) => {
    const reqData = await leaveRepository.getLeaveRequestById(id);
    if (!reqData) throw new Error('Leave request not found');
    
    if (reqData.employee_id === currentEmployeeId) {
      throw new Error('You cannot approve or reject your own leave request.');
    }
    
    if (status === 'Approved' && reqData.status !== 'Approved') {
      const start = new Date(reqData.start_date);
      const end = new Date(reqData.end_date);
      if (end < start) {
        throw new Error('Invalid date range: end date cannot be earlier than start date.');
      }
      const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      
      const balance = await leaveRepository.getLeaveBalanceByComposite(reqData.employee_id, reqData.leave_type_id);
      
      if (balance) {
        if (balance.balance < diffDays) {
          throw new Error('Insufficient leave balance.');
        }
        await leaveRepository.updateLeaveBalance(balance.id, { balance: balance.balance - diffDays });
      }
    }
    
    if (status !== 'Approved' && reqData.status === 'Approved') {
      const start = new Date(reqData.start_date);
      const end = new Date(reqData.end_date);
      if (end < start) {
        throw new Error('Invalid date range: end date cannot be earlier than start date.');
      }
      const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      
      const balance = await leaveRepository.getLeaveBalanceByComposite(reqData.employee_id, reqData.leave_type_id);
      
      if (balance) {
        await leaveRepository.updateLeaveBalance(balance.id, { balance: balance.balance + diffDays });
      }
    }

    await leaveRepository.updateLeaveRequest(id, { status, e_signature });
    
    let warning = null;
    if (status === 'Approved' && reqData.employee_id) {
      warning = await getOffboardingWarningForEmployee(reqData.employee_id);
    }

    return { reqData, warning };
  },

  deleteLeaveRequest: async (id) => {
    const leave = await leaveRepository.getLeaveRequestById(id);
    if (!leave) throw new Error('Leave request not found');

    const activeHandovers = await getActiveLinkedLeaveHandovers(leave);
    if (activeHandovers.length > 0) {
      const first = activeHandovers[0];
      const err = new Error(`Cannot delete leave while ${first.handover_kind || 'coverage'} handover is active (${first.status?.replace(/_/g, ' ')}). Waive or complete the handover first.`);
      err.active_handovers = activeHandovers.map(h => ({
        id: h.id,
        kind: h.handover_kind,
        status: h.status,
      }));
      throw err;
    }

    await detachTerminalHandoversFromLeave(leave);
    await leaveRepository.deleteLeaveRequest(id);
  },
  
  getLeaveTypes: async () => leaveRepository.getLeaveTypes(),
  createLeaveType: async (data) => leaveRepository.createLeaveType(data),
  updateLeaveType: async (id, data) => leaveRepository.updateLeaveType(id, data),
  deleteLeaveType: async (id) => leaveRepository.deleteLeaveType(id),

  // Public HRM API methods:
  getEmployeeLeaveBalances: async (employeeId) => {
    return await leaveRepository.getLeaveBalances({ employee_id: employeeId });
  },

  getActiveLeaves: async () => {
    return await leaveRepository.getLeaveRequests({ status: 'Approved' });
  },

  getEmployeeLeaveRequests: async (employeeId) => {
    return await leaveRepository.getLeaveRequests({ employee_id: employeeId }, { order: 'created_at', ascending: false });
  },
  
  getAllLeaveRequests: async () => {
    return await leaveRepository.getLeaveRequests({}, { order: 'created_at', ascending: false });
  },
  
  getLeaveBalancesForAll: async () => {
    return await leaveRepository.getLeaveBalances({});
  },

  createNotification: async (data) => leaveRepository.createNotification(data),

  linkCoverageHandover: async (leaveId, handoverId) => {
    if (!leaveId) return;
    return await leaveRepository.updateLeaveRequest(leaveId, {
      coverage_handover_id: handoverId
    });
  },

  linkReturnHandover: async (leaveId, handoverId) => {
    if (!leaveId) return;
    return await leaveRepository.updateLeaveRequest(leaveId, {
      return_handover_id: handoverId
    });
  }
};
