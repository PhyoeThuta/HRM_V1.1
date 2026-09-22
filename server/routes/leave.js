import express from 'express';
import multer from 'multer';
import { supabase, dbInsert } from '../lib/supabase.js';
import { verifyToken, requireAdmin } from '../middleware/auth.js';
import { leaveService } from '../modules/hrm/service/leaveService.js';

const router = express.Router();
router.use(verifyToken);

// GET /api/leave
router.get('/', async (req, res) => {
  try {
    const adminRoles = ['boss', 'hr_manager', 'general_manager', 'admin'];
    const isAdmin = adminRoles.includes(req.user.role);
    const result = await leaveService.getLeaveOverview(isAdmin, req.user.employee_id);
    return res.json(result);
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

    const employee_id = req.user.employee_id;
    if (!employee_id) return res.status(403).json({ error: 'No employee ID associated with this account' });

    const result = await leaveService.createLeaveRequest({ ...d, employee_id }, documentUrl);
    
    // Notify HR
    const { dbFetchOne } = await import('../lib/supabase.js');
    const emp = await dbFetchOne('Employees', 'Full_name', { id: employee_id });
    const empName = emp ? emp.Full_name : 'An employee';
    await leaveService.createNotification({
      recipient_role: 'hr_manager',
      title: 'New Leave Request',
      message: `${empName} has requested leave from ${d.start_date} to ${d.end_date}.`,
      link_url: '/leave',
      is_read: false,
      created_at: new Date().toISOString()
    });
    
    await dbInsert('sys_audit_logs', { user_id: req.user.id, action: 'CREATE', module: 'Leave Mgmt', details: `Submitted leave request for employee ID: ${employee_id}`, ip_address: req.ip || '0.0.0.0' });

    return res.json({ success: !!result, request: result });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// PUT /api/leave/:id/status  (approve/reject)
router.put('/:id/status', requireAdmin, async (req, res) => {
  try {
    const { status, e_signature } = req.body;
    const validStatuses = ['Pending', 'Approved', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status provided' });
    }
    
    const { reqData, warning } = await leaveService.updateLeaveStatus(req.params.id, status, e_signature, req.user.employee_id);
    
    // Notify Employee
    if (reqData && reqData.employee_id) {
      const { dbFetchOne } = await import('../lib/supabase.js');
      const user = await dbFetchOne('sys_users', 'id', { employee_id: reqData.employee_id });
      if (user) {
        await leaveService.createNotification({
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

    return res.json({ success: true, warning });
  } catch (e) {
    if (e.active_handovers) {
      return res.status(400).json({ error: e.message, active_handovers: e.active_handovers });
    }
    return res.status(e.message.includes('not found') ? 404 : (e.message.includes('own') || e.message.includes('balance') ? 400 : 500)).json({ error: e.message });
  }
});

// DELETE /api/leave/:id
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await leaveService.deleteLeaveRequest(req.params.id);
    await dbInsert('sys_audit_logs', { user_id: req.user.id, action: 'DELETE', module: 'Leave Mgmt', details: `Deleted leave request ID: ${req.params.id}`, ip_address: req.ip || '0.0.0.0' });
    return res.json({ success: true });
  } catch (e) {
    if (e.active_handovers) {
      return res.status(400).json({ error: e.message, active_handovers: e.active_handovers });
    }
    return res.status(e.message.includes('not found') ? 404 : 500).json({ error: e.message });
  }
});

// GET /api/leave/types
router.get('/types', async (req, res) => {
  try {
    const types = await leaveService.getLeaveTypes();
    return res.json({ types });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// POST /api/leave/types
router.post('/types', requireAdmin, async (req, res) => {
  try {
    const d = req.body;
    const result = await leaveService.createLeaveType({ type_name: d.type_name, default_days: d.default_days || 0, description: d.description || null });
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
    await leaveService.updateLeaveType(req.params.id, { type_name: d.type_name, default_days: d.default_days, description: d.description });
    await dbInsert('sys_audit_logs', { user_id: req.user.id, action: 'UPDATE', module: 'Leave Mgmt', details: `Updated leave type ${d.type_name}`, ip_address: req.ip || '0.0.0.0' });
    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// DELETE /api/leave/types/:id
router.delete('/types/:id', requireAdmin, async (req, res) => {
  try {
    await leaveService.deleteLeaveType(req.params.id);
    await dbInsert('sys_audit_logs', { user_id: req.user.id, action: 'DELETE', module: 'Leave Mgmt', details: `Deleted leave type ID: ${req.params.id}`, ip_address: req.ip || '0.0.0.0' });
    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

export default router;
