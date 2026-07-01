import express from 'express';
import { supabase, dbFetch, dbInsert, dbUpdate } from '../lib/supabase.js';
import { verifyToken, requireAdmin } from '../middleware/auth.js';


const router = express.Router();

router.use(verifyToken);

// GET /api/overtime - Admin list all OT requests
router.get('/', requireAdmin, async (req, res) => {
  try {
    const requests = await dbFetch('overtime_requests', '*', {}, { order: 'created_at', ascending: false });
    const employees = await dbFetch('Employees', 'id,Full_name,position_id');
    const positions = await dbFetch('positions', 'id,title');

    const empMap = Object.fromEntries(employees.map(e => [e.id, e]));
    const posMap = Object.fromEntries(positions.map(p => [p.id, p.title]));

    const formatted = requests.map(r => {
      const emp = empMap[r.employee_id] || {};
      return {
        ...r,
        employee_name: emp.Full_name || 'Unknown',
        position_name: posMap[emp.position_id] || 'Unknown'
      };
    });

    res.json(formatted);
  } catch (error) {
    console.error('[GET /api/overtime]', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/overtime/my - Employee list their OT requests
router.get('/my', async (req, res) => {
  try {
    const empId = req.user.employee_id;
    if (!empId) return res.status(404).json({ error: 'Employee profile not found' });

    const requests = await dbFetch('overtime_requests', '*', { employee_id: empId }, { order: 'created_at', ascending: false });
    res.json(requests);
  } catch (error) {
    console.error('[GET /api/overtime/my]', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/overtime/request - Create a new OT request
router.post('/request', async (req, res) => {
  try {
    const { employee_id, ot_date, start_time, end_time, reason, requested_by } = req.body;
    
    if (!employee_id || !ot_date || !start_time || !end_time || !requested_by) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let requested_hours = 0;
    try {
      const start = new Date(`1970-01-01T${start_time}:00Z`);
      const end = new Date(`1970-01-01T${end_time}:00Z`);
      requested_hours = (end - start) / 3600000;
      if (requested_hours < 0) requested_hours += 24; // Handle overnight shift
    } catch (e) {
      console.error(e);
    }

    const status = requested_by === 'hr_boss' ? 'Pending_Employee_Acceptance' : 'Pending_Boss_Approval';

    const newRequest = await dbInsert('overtime_requests', {
      employee_id,
      ot_date,
      start_time,
      end_time,
      requested_hours,
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
