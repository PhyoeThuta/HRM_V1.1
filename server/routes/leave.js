import express from 'express';
import multer from 'multer';
import { supabase, dbFetch, dbFetchOne, dbInsert, dbUpdate, dbDelete } from '../lib/supabase.js';
import { verifyToken, requireAdmin } from '../middleware/auth.js';
import {
  enrichLeaveWithHandoverFlags,
  getOffboardingWarningForEmployee,
  getActiveLinkedLeaveHandovers,
  detachTerminalHandoversFromLeave,
} from '../lib/handoverHelpers.js';

const router = express.Router();
router.use(verifyToken);

// GET /api/leave
router.get('/', async (req, res) => {
  try {
    const adminRoles = ['boss', 'hr_manager', 'general_manager', 'admin'];
    const isAdmin = adminRoles.includes(req.user.role);
    
    const reqFilter = isAdmin ? {} : { employee_id: req.user.employee_id };
    const balFilter = isAdmin ? {} : { employee_id: req.user.employee_id };

    const [requests, leaveTypes, employees, balances, offboardingRecords] = await Promise.all([
      dbFetch('Leave_Request', '*', reqFilter, { order: 'created_at', ascending: false }),
      dbFetch('Leave_type', '*'),
      dbFetch('Employees', 'id,Full_name,employee_id', { status: 'Active' }),
      dbFetch('Leave_balances', '*', balFilter),
      dbFetch('corporate_offboarding', 'employee_id,id,last_working_date'),
    ]);
    const ltMap = Object.fromEntries(leaveTypes.map(t => [t.id, t.type_name]));
    const empMap = Object.fromEntries(employees.map(e => [e.id, e]));
    
    // Filter balances to only include active employees
    const activeBalances = balances.filter(b => empMap[b.employee_id]);
    
    const handoverIds = [
      ...new Set(
        requests.flatMap(r => [r.coverage_handover_id, r.return_handover_id].filter(Boolean))
      ),
    ];
    let handoverMap = {};
    if (handoverIds.length) {
      const { data: handovers } = await supabase
        .from('employee_handovers')
        .select('id,status,completion_pct')
        .in('id', handoverIds);
      handoverMap = Object.fromEntries((handovers || []).map(h => [h.id, h]));
    }

    const offboardingByEmp = Object.fromEntries(offboardingRecords.map(o => [o.employee_id, o]));

    for (const r of requests) {
      r.type_name = ltMap[r.leave_type_id] || '—';
      const emp = empMap[r.employee_id] || {};
      r.employee_name = emp.Full_name || '—';
      r.employee_code = emp.employee_id || '—';
      await enrichLeaveWithHandoverFlags(r, handoverMap);
      const ob = offboardingByEmp[r.employee_id];
      r.employee_in_offboarding = !!ob;
      if (ob) {
        r.offboarding_warning =
          'Employee is in offboarding. Leave coverage can proceed, but exit tasks (laptop, NDA, exit interview, settlement) must still be completed separately.';
        r.offboarding_last_working_date = ob.last_working_date || null;
      }
    }
    activeBalances.forEach(b => { b.type_name = ltMap[b.leave_type_id] || '—'; });
    
    return res.json({ requests, leave_types: leaveTypes, employees, balances: activeBalances });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

const upload = multer({ storage: multer.memoryStorage() });

// POST /api/leave/request
router.post('/request', upload.single('attachment'), async (req, res) => {
  try {
    const d = req.body;
    let documentUrl = null;

    if (req.file) {
      const fileExt = req.file.originalname.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from('leave_documents')
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: true
        });
      
      if (error) {
        console.error('[STORAGE UPLOAD ERROR]', error);
        return res.status(500).json({ error: 'Failed to upload document. Please try again.' });
      } else {
        const { data: pubData } = supabase.storage.from('leave_documents').getPublicUrl(fileName);
        documentUrl = pubData.publicUrl;
      }
    }

    // CRITICAL: Trust Boundary - override body employee_id
    const employee_id = req.user.employee_id;
    if (!employee_id) return res.status(403).json({ error: 'No employee ID associated with this account' });

    const result = await dbInsert('Leave_Request', {
      employee_id: employee_id, leave_type_id: d.leave_type_id,
      start_date: d.start_date, end_date: d.end_date,
      reason: d.reason, status: 'Pending',
      document_url: documentUrl,
      created_at: new Date().toISOString(),
    });
    
    // Notify HR
    const emp = await dbFetchOne('Employees', 'Full_name', { id: d.employee_id });
    const empName = emp ? emp.Full_name : 'An employee';
    await dbInsert('system_notifications', {
      recipient_role: 'hr_manager',
      title: 'New Leave Request',
      message: `${empName} has requested leave from ${d.start_date} to ${d.end_date}.`,
      link_url: '/leave',
      is_read: false,
      created_at: new Date().toISOString()
    });
    
    await dbInsert('sys_audit_logs', { user_id: req.user.id, action: 'CREATE', module: 'Leave Mgmt', details: `Submitted leave request for employee ID: ${d.employee_id}`, ip_address: req.ip || '0.0.0.0' });

    return res.json({ success: !!result, request: result });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// PUT /api/leave/:id/status  (approve/reject)
router.put('/:id/status', requireAdmin, async (req, res) => {
  try {
    const { status, e_signature } = req.body;
    
    // Whitelist Status
    const validStatuses = ['Pending', 'Approved', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status provided' });
    }
    
    const reqData = await dbFetchOne('Leave_Request', '*', { id: req.params.id });
    if (!reqData) return res.status(404).json({ error: 'Leave request not found' });
    
    // Prevent Self-Approval
    if (reqData.employee_id === req.user.employee_id) {
      return res.status(403).json({ error: 'You cannot approve or reject your own leave request.' });
    }
    
    // Deduct Leave Balance on Approval
    if (status === 'Approved' && reqData.status !== 'Approved') {
      const start = new Date(reqData.start_date);
      const end = new Date(reqData.end_date);
      const diffDays = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) + 1;
      
      const balance = await dbFetchOne('Leave_balances', '*', { 
        employee_id: reqData.employee_id, 
        leave_type_id: reqData.leave_type_id 
      });
      
      if (balance) {
        if (balance.balance < diffDays) {
          return res.status(400).json({ error: 'Insufficient leave balance.' });
        }
        await dbUpdate('Leave_balances', balance.id, { balance: balance.balance - diffDays });
      }
    }
    
    // Revert balance if moving from Approved to something else
    if (status !== 'Approved' && reqData.status === 'Approved') {
      const start = new Date(reqData.start_date);
      const end = new Date(reqData.end_date);
      const diffDays = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) + 1;
      
      const balance = await dbFetchOne('Leave_balances', '*', { 
        employee_id: reqData.employee_id, 
        leave_type_id: reqData.leave_type_id 
      });
      
      if (balance) {
        await dbUpdate('Leave_balances', balance.id, { balance: balance.balance + diffDays });
      }
    }

    await dbUpdate('Leave_Request', req.params.id, { status, e_signature });
    
    // Notify Employee
    if (reqData && reqData.employee_id) {
      const user = await dbFetchOne('sys_users', 'id', { employee_id: reqData.employee_id });
      if (user) {
        await dbInsert('system_notifications', {
          recipient_user_id: user.id,
          title: `Leave Request ${status}`,
          message: `Your leave request has been ${status.toLowerCase()}.`,
          link_url: '/portal',
          is_read: false,
          created_at: new Date().toISOString()
        });
      }
    }
    
    await dbInsert('sys_audit_logs', { user_id: req.user.id, action: 'UPDATE', module: 'Leave Mgmt', details: `Leave request ${status} for ID: ${req.params.id}`, ip_address: req.ip || '0.0.0.0' });

    let warning = null;
    if (status === 'Approved' && reqData?.employee_id) {
      warning = await getOffboardingWarningForEmployee(reqData.employee_id);
    }

    return res.json({ success: true, warning });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// DELETE /api/leave/:id
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const leave = await dbFetchOne('Leave_Request', '*', { id: req.params.id });
    if (!leave) return res.status(404).json({ error: 'Leave request not found' });

    const activeHandovers = await getActiveLinkedLeaveHandovers(leave);
    if (activeHandovers.length > 0) {
      const first = activeHandovers[0];
      return res.status(400).json({
        error: `Cannot delete leave while ${first.handover_kind || 'coverage'} handover is active (${first.status?.replace(/_/g, ' ')}). Waive or complete the handover first.`,
        active_handovers: activeHandovers.map(h => ({
          id: h.id,
          kind: h.handover_kind,
          status: h.status,
        })),
      });
    }

    await detachTerminalHandoversFromLeave(leave);
    await dbDelete('Leave_Request', req.params.id);
    await dbInsert('sys_audit_logs', { user_id: req.user.id, action: 'DELETE', module: 'Leave Mgmt', details: `Deleted leave request ID: ${req.params.id}`, ip_address: req.ip || '0.0.0.0' });
    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// GET /api/leave/types
router.get('/types', async (req, res) => {
  try {
    const types = await dbFetch('Leave_type', '*', {}, { order: 'type_name', ascending: true });
    return res.json({ types });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// POST /api/leave/types
router.post('/types', requireAdmin, async (req, res) => {
  try {
    const d = req.body;
    const result = await dbInsert('Leave_type', { type_name: d.type_name, default_days: d.default_days || 0, description: d.description || null });
    await dbInsert('sys_audit_logs', { user_id: req.user.id, action: 'CREATE', module: 'Leave Mgmt', details: `Created leave type ${d.type_name}`, ip_address: req.ip || '0.0.0.0' });
    return res.json({ success: !!result, type: result });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// PUT /api/leave/types/:id
router.put('/types/:id', requireAdmin, async (req, res) => {
  try {
    const d = req.body;
    await dbUpdate('Leave_type', req.params.id, { type_name: d.type_name, default_days: d.default_days, description: d.description });
    await dbInsert('sys_audit_logs', { user_id: req.user.id, action: 'UPDATE', module: 'Leave Mgmt', details: `Updated leave type ${d.type_name}`, ip_address: req.ip || '0.0.0.0' });
    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// DELETE /api/leave/types/:id
router.delete('/types/:id', requireAdmin, async (req, res) => {
  try {
    await dbDelete('Leave_type', req.params.id);
    await dbInsert('sys_audit_logs', { user_id: req.user.id, action: 'DELETE', module: 'Leave Mgmt', details: `Deleted leave type ID: ${req.params.id}`, ip_address: req.ip || '0.0.0.0' });
    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

export default router;
