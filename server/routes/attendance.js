import express from 'express';
import { dbFetch, dbFetchOne, dbInsert, dbUpdate, dbDelete } from '../lib/supabase.js';
import crypto from 'crypto';
import { verifyToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();
router.use(verifyToken);

async function checkIsLate(employee_id, check_in_time) {
  try {
    const dt = new Date(check_in_time);
    const todayStr = dt.toISOString().split('T')[0];
    
    // 1. Check Roster
    const rosters = await dbFetch('employee_rosters', '*', { employee_id });
    let activeShiftId = null;
    for (const r of rosters) {
      if (r.start_date <= todayStr && (!r.end_date || r.end_date >= todayStr)) {
        activeShiftId = r.shift_id;
        break;
      }
    }
    
    // 2. Check Default Shift
    if (!activeShiftId) {
      const emp = await dbFetchOne('Employees', 'default_shift_id', { id: employee_id });
      if (emp && emp.default_shift_id) {
        activeShiftId = emp.default_shift_id;
      }
    }
    
    // 3. Calculate Cutoff
    if (activeShiftId) {
      const shift = await dbFetchOne('shifts', '*', { id: activeShiftId });
      if (shift) {
        const [hours, minutes, seconds] = shift.start_time.split(':');
        const graceMins = shift.grace_period_minutes || 15;
        const cutoffDt = new Date(dt);
        cutoffDt.setHours(parseInt(hours), parseInt(minutes) + graceMins, parseInt(seconds || 0), 0);
        return dt > cutoffDt;
      }
    }
    
    // Fallback: 9:15 AM
    const fallbackDt = new Date(dt);
    fallbackDt.setHours(9, 15, 0, 0);
    return dt > fallbackDt;
  } catch (e) {
    console.error('[checkIsLate error]', e);
    return new Date(check_in_time).getHours() >= 9;
  }
}

// GET /api/attendance
router.get('/', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const [employees, records, bioDevices, bioRegs, tokens] = await Promise.all([
      dbFetch('Employees', 'id,Full_name,employee_id', { status: 'Active' }),
      dbFetch('attendance_records', '*', {}, { order: 'check_in', ascending: false }),
      dbFetch('biometric_device', '*'),
      dbFetch('biometric_employees', '*'),
      dbFetch('qr_attendance_tokens', '*', {}, { order: 'created_at', ascending: false }),
    ]);

    const empMap = Object.fromEntries(employees.map(e => [e.id, e]));

    // Enrich records
    const enriched = records.map(r => {
      const emp = empMap[r.employee_id] || {};
      let workHours = null;
      if (r.check_in && r.check_out) {
        try {
          workHours = Math.max(0, Math.round(((new Date(r.check_out) - new Date(r.check_in)) / 3600000) * 100) / 100);
        } catch {}
      }
      return { ...r, Full_name: emp.Full_name || '—', employee_code: emp.employee_id || '—', work_hours_calc: workHours };
    });

    bioRegs.forEach(reg => { reg.Full_name = (empMap[reg.employee_id] || {}).Full_name || '—'; });
    tokens.forEach(t => {
      const emp = empMap[t.employee_id] || {};
      t.Full_name = emp.Full_name || '—';
      t.emp_code = emp.employee_id || '—';
    });

    const statsPresent = enriched.filter(r => String(r.check_in || '').startsWith(today)).length;
    const statsLate = enriched.filter(r => r.is_late && String(r.check_in || '').startsWith(today)).length;
    const statsInOffice = enriched.filter(r => String(r.check_in || '').startsWith(today) && !r.check_out).length;

    return res.json({
      records: enriched, employees,
      biometric_devices: bioDevices, biometric_registrations: bioRegs,
      active_tokens: tokens,
      stats: { present: statsPresent, late: statsLate, in_office: statsInOffice, total: records.length },
      today: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// POST /api/attendance
router.post('/', async (req, res) => {
  try {
    const d = req.body;
    const now = new Date().toISOString();
    const ci = d.check_in || now;
    if (d.check_out && ci && new Date(d.check_out) < new Date(ci)) {
      return res.status(400).json({ error: 'Check-out time cannot be before check-in time' });
    }
    const result = await dbInsert('attendance_records', {
      employee_id: d.employee_id,
      check_in: ci, check_out: d.check_out || null,
      overtime_hours: d.overtime_hours ? parseFloat(d.overtime_hours) : 0,
      attendance_method: d.attendance_method || 'Manual',
      is_late: d.is_late === true || d.is_late === 'true',
      created_at: now,
    });
    return res.json({ success: !!result, record: result });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// POST /api/attendance/:id/checkout
router.post('/:id/checkout', async (req, res) => {
  try {
    await dbUpdate('attendance_records', req.params.id, { check_out: new Date().toISOString() });
    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// DELETE /api/attendance/:id
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await dbDelete('attendance_records', req.params.id);
    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// POST /api/attendance/generate-qr
router.post('/generate-qr', requireAdmin, async (req, res) => {
  try {
    const { employee_id, expires_in_minutes = 60 } = req.body;
    if (!employee_id) return res.status(400).json({ error: 'employee_id required' });
    
    const token = crypto.randomBytes(32).toString('hex');
    const expires_at = new Date(Date.now() + expires_in_minutes * 60000).toISOString();
    
    await dbInsert('qr_attendance_tokens', {
      employee_id,
      token,
      expires_at,
      used: false
    });
    
    return res.json({ success: true, token });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// POST /api/attendance/scan
router.post('/scan', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: 'Token required' });
    
    const qrData = await dbFetchOne('qr_attendance_tokens', '*', { token });
    if (!qrData) return res.status(400).json({ error: 'Invalid token' });
    if (qrData.used) return res.status(400).json({ error: 'Token already used' });
    if (new Date(qrData.expires_at) < new Date()) return res.status(400).json({ error: 'Token expired' });
    
    await dbUpdate('qr_attendance_tokens', qrData.id, { used: true });
    
    const now = new Date().toISOString();
    const today = now.split('T')[0];
    
    const openRecords = await dbFetch('attendance_records', '*', { employee_id: qrData.employee_id }, { order: 'check_in', ascending: false, limit: 10 });
    const todayOpen = openRecords.find(r => r.check_in && r.check_in.startsWith(today) && !r.check_out);
    
    if (todayOpen) {
      await dbUpdate('attendance_records', todayOpen.id, { check_out: now });
      return res.json({ success: true, message: 'QR Check-out successful' });
    } else {
      await dbInsert('attendance_records', {
        employee_id: qrData.employee_id,
        check_in: now,
        attendance_method: 'QR',
        is_late: await checkIsLate(qrData.employee_id, now)
      });
      return res.json({ success: true, message: 'QR Check-in successful' });
    }
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// POST /api/attendance/photo-checkin
router.post('/photo-checkin', async (req, res) => {
  try {
    const { employee_id, photo_base64 } = req.body;
    if (!employee_id || !photo_base64) return res.status(400).json({ error: 'employee_id and photo required' });
    
    const now = new Date().toISOString();
    const today = now.split('T')[0];
    
    const openRecords = await dbFetch('attendance_records', '*', { employee_id }, { order: 'check_in', ascending: false, limit: 10 });
    const todayOpen = openRecords.find(r => r.check_in && r.check_in.startsWith(today) && !r.check_out);
    
    if (todayOpen) {
      await dbUpdate('attendance_records', todayOpen.id, { check_out: now });
      return res.json({ success: true, message: 'Photo Check-out successful' });
    } else {
      await dbInsert('attendance_records', {
        employee_id,
        check_in: now,
        attendance_method: 'Photo',
        is_late: await checkIsLate(employee_id, now)
      });
      return res.json({ success: true, message: 'Photo Check-in successful' });
    }
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// POST /api/attendance/biometric/sync
// Publicly accessible for hardware sync (using api_key)
router.post('/biometric/sync', async (req, res) => {
  try {
    const { api_key, records } = req.body; // records: [{ fingerprint_id, timestamp, device_id }]
    const expectedKey = process.env.BIOMETRIC_API_KEY || 'zkteco-secret-key-123';
    
    if (api_key !== expectedKey) return res.status(401).json({ error: 'Unauthorized API Key' });
    if (!records || !Array.isArray(records)) return res.status(400).json({ error: 'Invalid records format' });
    
    let synced = 0;
    for (const r of records) {
      // Find employee by fingerprint_id
      const bioEmp = await dbFetchOne('biometric_employees', '*', { biometric_id: r.fingerprint_id });
      if (!bioEmp) continue; // Unknown fingerprint
      
      const empId = bioEmp.employee_id;
      const logTime = r.timestamp;
      
      // Check for exact duplicate raw time to prevent multiple inserts
      const existingLog = await dbFetchOne('biometric_logs', 'id', { employee_id: empId, raw_time: logTime });
      if (existingLog) continue;
      
      // Insert to biometric_logs
      await dbInsert('biometric_logs', {
        device_id: r.device_id || bioEmp.device_id,
        employee_id: empId,
        raw_time: logTime
      });
      
      // Insert to attendance_records
      await dbInsert('attendance_records', {
        employee_id: empId,
        check_in: logTime,
        attendance_method: 'Biometric',
        is_late: await checkIsLate(empId, logTime),
        created_at: new Date().toISOString()
      });
      
      synced++;
    }
    
    return res.json({ success: true, synced_count: synced });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// POST /api/attendance/biometric/device
router.post('/biometric/device', async (req, res) => {
  try {
    const { device_name, ip_address, port, location } = req.body;
    if (!device_name) return res.status(400).json({ error: 'device_name required' });
    const newDevice = await dbInsert('biometric_device', { device_name, ip_address, port, location });
    return res.json({ success: true, device: newDevice });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// DELETE /api/attendance/biometric/device/:id
router.delete('/biometric/device/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('biometric_device').delete().eq('id', req.params.id);
    if (error) throw error;
    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// POST /api/attendance/biometric/mapping
router.post('/biometric/mapping', async (req, res) => {
  try {
    const { employee_id, device_id, biometric_id } = req.body;
    if (!employee_id || !biometric_id) return res.status(400).json({ error: 'employee_id and biometric_id required' });
    const newMapping = await dbInsert('biometric_registrations', { employee_id, device_id, biometric_id });
    return res.json({ success: true, mapping: newMapping });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// DELETE /api/attendance/biometric/mapping/:id
router.delete('/biometric/mapping/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('biometric_registrations').delete().eq('id', req.params.id);
    if (error) throw error;
    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

export default router;
