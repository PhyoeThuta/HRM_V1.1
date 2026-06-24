import express from 'express';
import { dbFetch, dbFetchOne, dbInsert, dbUpdate, dbDelete } from '../lib/supabase.js';
import { verifyToken, requireAdmin } from '../middleware/auth.js';
import { supabase } from '../lib/supabase.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();
router.use(verifyToken);

// Multer config for SOP video uploads to Supabase
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// GET /api/notifications
router.get('/notifications', async (req, res) => {
  try {
    const uid = req.user.id;
    const role = req.user.role;
    const { data, error } = await supabase
      .from('system_notifications')
      .select('*')
      .or(`recipient_user_id.eq.${uid},recipient_role.eq.${role},recipient_role.eq.All`)
      .order('created_at', { ascending: false })
      .limit(20);
    if (error) throw error;
    
    const unreadCount = data ? data.filter(n => !n.is_read).length : 0;
    return res.json({ notifications: data || [], unread_count: unreadCount });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

// POST /api/notifications/:id/read
router.post('/notifications/:id/read', async (req, res) => {
  try {
    await dbUpdate('system_notifications', req.params.id, { is_read: true });
    return res.json({ success: true });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

// GET /api/portal — Employee self-service data
router.get('/portal', async (req, res) => {
  try {
    const empId = req.user.employee_id;
    if (!empId) return res.json({ emp: null });

    const [emp, attRecs, leaveReqs, payslips, votes, leaveBals, announcements, leaveTypes, qr_token_records] = await Promise.all([
      dbFetchOne('Employees', '*', { id: empId }),
      dbFetch('attendance_records', '*', { employee_id: empId }, { order: 'check_in', ascending: false }),
      dbFetch('Leave_Request', '*', { employee_id: empId }, { order: 'created_at', ascending: false }),
      dbFetch('payrolls', '*', { employee_id: empId }, { order: 'month', ascending: false }),
      dbFetch('peer_voting_records', '*', { nominee_id: empId }),
      dbFetch('Leave_balances', '*', { employee_id: empId }),
      dbFetch('announcements', '*'),
      dbFetch('Leave_type', '*'),
      dbFetch('qr_attendance_tokens', '*', { employee_id: empId, used: false }, { order: 'created_at', ascending: false, limit: 1 }),
    ]);

    if (emp) {
      const [depts, positions] = await Promise.all([
        dbFetch('Departments', 'id,Department_name'),
        dbFetch('positions', 'id,title'),
      ]);
      const deptMap = Object.fromEntries(depts.map(d => [d.id, d.Department_name]));
      const posMap = Object.fromEntries(positions.map(p => [p.id, p.title]));
      emp.dept_name = deptMap[emp.Dept_id] || '—';
      emp.pos_title = posMap[emp.position_id] || '—';
    }

    if (leaveBals && leaveTypes) {
      const ltMap = Object.fromEntries(leaveTypes.map(t => [t.id, t.type_name]));
      leaveBals.forEach(b => { b.type_name = ltMap[b.leave_type_id] || '—'; });
    }

    const voteCount = votes.length;
    const voteTotal = votes.reduce((s, v) => s + parseInt(v.score || 0), 0);
    const voteAvg = voteCount > 0 ? Math.round((voteTotal / voteCount) * 10) / 10 : 0;

    const isOffboarding = !!(await dbFetchOne('corporate_offboarding', 'id', { employee_id: empId }));

    // Filter announcements
    const role = req.user.role;
    const filteredAnn = announcements.filter(a => {
      const tr = a.target_role || 'All';
      if (tr === 'Pending HR Review') return false;
      return ['All', role].includes(tr);
    });

    return res.json({
      emp, is_offboarding: isOffboarding,
      att_count: attRecs.length,
      leave_count: leaveReqs.length,
      payslip_count: payslips.length,
      vote_avg: voteAvg, vote_count: voteCount,
      leave_bals: leaveBals,
      ann_list: filteredAnn.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
      attendance_records: attRecs,
      leave_requests: leaveReqs,
      payslips,
      leave_types: leaveTypes,
      qr_token: (qr_token_records && qr_token_records.length > 0 && new Date(qr_token_records[0].expires_at) > new Date()) ? qr_token_records[0].token : null,
    });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

// GET /api/sops — Daily SOPs
router.get('/sops', async (req, res) => {
  try {
    const sops = await dbFetch('daily_sops', '*', {}, { order: 'created_at', ascending: false });
    const employees = await dbFetch('Employees', 'id,Full_name,position_id');
    const positions = await dbFetch('positions', 'id,title');
    
    // Attach employee name and position title
    const enhancedSops = sops.map(s => {
      const emp = employees.find(e => e.id === s.employee_id);
      const pos = emp?.position_id ? positions.find(p => p.id === emp.position_id) : null;
      return {
        ...s,
        employee_name: emp?.Full_name || 'Unknown',
        position_title: pos?.title || 'No Position'
      };
    });

    return res.json({ sops: enhancedSops });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

// POST /api/sops - Create SOP for Employees
router.post('/sops', requireAdmin, async (req, res) => {
  try {
    const { title, content, department_id, position_id } = req.body;
    
    let query = {};
    if (department_id) query.Dept_id = department_id;
    if (position_id) query.position_id = position_id;
    
    // Fetch target employees based on filters
    const employees = await dbFetch('Employees', 'id', query);
    
    if (employees.length === 0) {
      return res.status(400).json({ error: 'No employees found matching the selected Department or Position.' });
    }

    const task_desc = title ? `${title}\n\n${content}` : content;
    
    // Insert SOP for each employee
    for (const emp of employees) {
      await dbInsert('daily_sops', {
        employee_id: emp.id,
        task_description: task_desc,
        assigned_by: req.user.employee_id || null
      });
      
      const user = await dbFetchOne('sys_users', 'id', { employee_id: emp.id });
      if (user) {
        await dbInsert('system_notifications', {
          recipient_user_id: user.id,
          title: 'New SOP Assigned',
          message: `You have been assigned a new SOP: ${title || 'Daily Task'}`,
          link_url: '/portal',
          is_read: false,
          created_at: new Date().toISOString()
        });
      }
    }

    return res.json({ success: true, assigned_count: employees.length });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

// DELETE /api/sops/:id
router.delete('/sops/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await dbDelete('daily_sops', id);
    return res.json({ success: true });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

// POST /api/sops/bulk-delete
router.post('/sops/bulk-delete', requireAdmin, async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids)) return res.status(400).json({ error: 'ids must be an array' });
    for (const id of ids) {
      await dbDelete('daily_sops', id);
    }
    return res.json({ success: true });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

// POST /api/sops/:id/complete
router.post('/sops/:id/complete', upload.single('video'), async (req, res) => {
  try {
    const { id } = req.params;
    
    let videoUrl = null;
    if (req.file) {
      // Upload to Supabase Storage
      const ext = path.extname(req.file.originalname);
      const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}${ext}`;
      
      const { data, error } = await supabase.storage
        .from('sop_videos')
        .upload(filename, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: false
        });
        
      if (error) {
        console.error("Supabase upload error:", error);
        throw new Error("Failed to upload video to storage");
      }
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('sop_videos')
        .getPublicUrl(filename);
        
      videoUrl = publicUrlData.publicUrl;
    }
    
    await dbUpdate('daily_sops', id, { 
      is_completed: true, 
      completed_at: new Date().toISOString(),
      ...(videoUrl && { proof_video_url: videoUrl })
    });
    
    // Notify Boss and HR
    const sop = await dbFetchOne('daily_sops', '*', { id });
    if (sop) {
      const emp = await dbFetchOne('Employees', 'Full_name', { id: sop.employee_id });
      const empName = emp ? emp.Full_name : 'An employee';
      await dbInsert('system_notifications', {
        recipient_role: 'boss',
        title: 'SOP Completed',
        message: `${empName} has completed their assigned SOP.`,
        link_url: '/sops',
        is_read: false,
        created_at: new Date().toISOString()
      });
      await dbInsert('system_notifications', {
        recipient_role: 'hr_manager',
        title: 'SOP Completed',
        message: `${empName} has completed their assigned SOP.`,
        link_url: '/sops',
        is_read: false,
        created_at: new Date().toISOString()
      });
    }

    return res.json({ success: true, message: 'SOP marked as completed' });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

// GET /api/birthdays
router.get('/birthdays', async (req, res) => {
  try {
    const employees = await dbFetch('Employees', 'id,Full_name,employee_id,date_of_birth,Dept_id', { status: 'Active' });
    const today = new Date();
    const upcoming = employees
      .filter(e => e.date_of_birth)
      .map(e => {
        const dob = new Date(e.date_of_birth);
        const thisYear = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
        if (thisYear < today) thisYear.setFullYear(today.getFullYear() + 1);
        const daysUntil = Math.ceil((thisYear - today) / 86400000);
        return { ...e, days_until: daysUntil, birth_month: dob.getMonth() + 1, birth_day: dob.getDate() };
      })
      .sort((a, b) => a.days_until - b.days_until)
      .slice(0, 30);
    return res.json({ birthdays: upcoming });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

// GET /api/peer-voting
router.get('/peer-voting', async (req, res) => {
  try {
    const [votes, employees] = await Promise.all([
      dbFetch('peer_voting_records', '*', {}, { order: 'created_at', ascending: false }),
      dbFetch('Employees', 'id,Full_name,employee_id', { status: 'Active' }),
    ]);
    const empMap = Object.fromEntries(employees.map(e => [e.id, e]));
    votes.forEach(v => {
      v.nominee_name = (empMap[v.nominee_id] || {}).Full_name || '—';
      v.voter_name = (empMap[v.voter_id] || {}).Full_name || '—';
    });
    return res.json({ votes, employees });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

// POST /api/peer-voting/submit
router.post('/peer-voting/submit', async (req, res) => {
  try {
    const { nominee_id, attendance, punctuality, sops, peer, initiative, comment } = req.body;
    const voter_id = req.user.employee_id;
    
    if (!voter_id) return res.status(400).json({ error: 'You must be linked to an employee profile to vote' });
    if (!nominee_id) return res.status(400).json({ error: 'Nominee required' });
    
    // Average out the 5 parameters to get a score out of 5
    const total = parseFloat(attendance) + parseFloat(punctuality) + parseFloat(sops) + parseFloat(peer) + parseFloat(initiative);
    const score = (total / 5).toFixed(1);
    
    await dbInsert('peer_voting_records', {
      voter_id,
      nominee_id,
      score,
      comment,
      created_at: new Date().toISOString()
    });
    
    // Notify the Nominee
    const user = await dbFetchOne('sys_users', 'id', { employee_id: nominee_id });
    if (user) {
      await dbInsert('system_notifications', {
        recipient_user_id: user.id,
        title: 'New Peer Vote Received',
        message: `You received a peer vote with a score of ${score}/5.0`,
        link_url: '/portal',
        is_read: false,
        created_at: new Date().toISOString()
      });
    }
    
    return res.json({ success: true, message: 'Vote submitted successfully' });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

// GET /api/boss/users — Admin user management
router.get('/boss/users', requireAdmin, async (req, res) => {
  try {
    const users = await dbFetch('sys_users', 'id,username,role,full_name,employee_id,created_at,is_active');
    return res.json({ users });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

// POST /api/boss/announcements
router.post('/boss/announcements', requireAdmin, async (req, res) => {
  try {
    const d = req.body;
    const result = await dbInsert('announcements', {
      title: d.title, content: d.content,
      priority: d.priority || 'Medium',
      target_role: d.target_role || 'All',
      is_pinned: d.is_pinned || false,
      created_at: new Date().toISOString(),
    });
    
    // Create notification
    if (result && result.id) {
      await dbInsert('system_notifications', {
        recipient_role: d.target_role || 'All',
        title: `📢 New Announcement: ${d.title}`,
        message: d.content,
        link_url: '/portal',
        is_read: false,
        created_at: new Date().toISOString()
      });
    }

    return res.json({ success: !!result, announcement: result });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

router.delete('/boss/announcements/:id', requireAdmin, async (req, res) => {
  try {
    await dbDelete('announcements', req.params.id);
    return res.json({ success: true });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

router.put('/boss/announcements/:id/publish', requireAdmin, async (req, res) => {
  try {
    await dbUpdate('announcements', req.params.id, { target_role: 'All' });
    return res.json({ success: true });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

// GET /api/documents
router.get('/documents', async (req, res) => {
  try {
    const [docs, employees] = await Promise.all([
      dbFetch('documents', '*', {}, { order: 'created_at', ascending: false }),
      dbFetch('Employees', 'id,Full_name,employee_id'),
    ]);
    const empMap = Object.fromEntries(employees.map(e => [e.id, e]));
    docs.forEach(d => {
      const emp = empMap[d.employee_id] || {};
      d.employee_name = emp.Full_name || '—';
    });
    return res.json({ documents: docs, employees });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

export default router;
