import express from 'express';
import multer from 'multer';
import { supabase, dbFetch, dbFetchOne, dbInsert, dbUpdate, dbDelete } from '../lib/supabase.js';
import { verifyToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();
router.use(verifyToken);

// GET /api/leave
router.get('/', async (req, res) => {
  try {
    const [requests, leaveTypes, employees, balances] = await Promise.all([
      dbFetch('Leave_Request', '*', {}, { order: 'created_at', ascending: false }),
      dbFetch('Leave_type', '*'),
      dbFetch('Employees', 'id,Full_name,employee_id', { status: 'Active' }),
      dbFetch('Leave_balances', '*'),
    ]);
    const ltMap = Object.fromEntries(leaveTypes.map(t => [t.id, t.type_name]));
    const empMap = Object.fromEntries(employees.map(e => [e.id, e]));
    
    // Filter balances to only include active employees
    const activeBalances = balances.filter(b => empMap[b.employee_id]);
    
    requests.forEach(r => {
      r.type_name = ltMap[r.leave_type_id] || '—';
      const emp = empMap[r.employee_id] || {};
      r.employee_name = emp.Full_name || '—';
      r.employee_code = emp.employee_id || '—';
    });
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
      } else {
        const { data: pubData } = supabase.storage.from('leave_documents').getPublicUrl(fileName);
        documentUrl = pubData.publicUrl;
      }
    }

    const result = await dbInsert('Leave_Request', {
      employee_id: d.employee_id, leave_type_id: d.leave_type_id,
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

    return res.json({ success: !!result, request: result });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// PUT /api/leave/:id/status  (approve/reject)
router.put('/:id/status', requireAdmin, async (req, res) => {
  try {
    const { status, e_signature } = req.body;
    await dbUpdate('Leave_Request', req.params.id, { status, e_signature });
    
    // Notify Employee
    const reqData = await dbFetchOne('Leave_Request', 'employee_id', { id: req.params.id });
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

    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// DELETE /api/leave/:id
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await dbDelete('Leave_Request', req.params.id);
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
    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// DELETE /api/leave/types/:id
router.delete('/types/:id', requireAdmin, async (req, res) => {
  try {
    await dbDelete('Leave_type', req.params.id);
    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

export default router;
