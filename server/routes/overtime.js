import express from 'express';
import { supabase, dbFetch, dbInsert, dbUpdate } from '../lib/supabase.js';
import { verifyToken, requireAdmin } from '../middleware/auth.js';
import { sendNotification } from './misc.js'; // Assuming we can use this for system notifications

const router = express.Router();

router.use(verifyToken);

// GET /api/overtime - Admin list all OT requests
router.get('/', requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('overtime_requests')
      .select('*, employee:employee_id(full_name, position_id), position:employee_id(Positions!inner(title))')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Formatting response to match usual nested relationships structure
    const formatted = data.map(r => ({
      ...r,
      employee_name: r.employee?.full_name || 'Unknown',
      position_name: r.employee?.Positions?.title || 'Unknown'
    }));

    res.json(formatted);
  } catch (error) {
    console.error('[GET /api/overtime]', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/overtime/my - Employee list their OT requests
router.get('/my', async (req, res) => {
  try {
    // If not standard setup, extract employee_id from user
    const { data: emp } = await supabase.from('Employees').select('id').eq('user_id', req.user.id).single();
    if (!emp) return res.status(404).json({ error: 'Employee profile not found' });

    const requests = await dbFetch('overtime_requests', '*', { employee_id: emp.id }, { order: 'created_at', ascending: false });
    res.json(requests);
  } catch (error) {
    console.error('[GET /api/overtime/my]', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/overtime/request - Create a new OT request
router.post('/request', async (req, res) => {
  try {
    const { employee_id, ot_date, reason, requested_by } = req.body;
    
    if (!employee_id || !ot_date || !requested_by) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const status = requested_by === 'hr_boss' ? 'Pending_Employee_Acceptance' : 'Pending_Boss_Approval';

    const newRequest = await dbInsert('overtime_requests', {
      employee_id,
      ot_date,
      reason,
      requested_by,
      status
    });

    if (!newRequest) throw new Error('Failed to create overtime request');

    res.json(newRequest);
  } catch (error) {
    console.error('[POST /api/overtime/request]', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/overtime/:id/status - Update OT status
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'Approved', 'Rejected', etc.

    if (!['Pending_Boss_Approval', 'Pending_Employee_Acceptance', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updated = await dbUpdate('overtime_requests', id, { status, updated_at: new Date().toISOString() });
    
    if (!updated) throw new Error('Failed to update overtime request status');

    res.json({ success: true, message: `Status updated to ${status}` });
  } catch (error) {
    console.error(`[PUT /api/overtime/${req.params.id}/status]`, error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
