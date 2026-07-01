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

// GET /api/audit-logs
router.get('/audit-logs', requireAdmin, async (req, res) => {
  try {
    const logs = await dbFetch('sys_audit_logs', '*', {}, { order: 'created_at', ascending: false });
    return res.json(logs);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

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

// POST /api/notifications/read-all
router.post('/notifications/read-all', async (req, res) => {
  try {
    const uid = req.user.id;
    const role = req.user.role;
    const { data } = await supabase
      .from('system_notifications')
      .select('id')
      .or(`recipient_user_id.eq.${uid},recipient_role.eq.${role},recipient_role.eq.All`)
      .eq('is_read', false);
    
    if (data && data.length > 0) {
      await Promise.all(data.map(n => dbUpdate('system_notifications', n.id, { is_read: true })));
    }
    return res.json({ success: true });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

// DELETE /api/notifications/:id
router.delete('/notifications/:id', async (req, res) => {
  try {
    await dbDelete('system_notifications', req.params.id);
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
    const today = new Date().toISOString().split('T')[0];
    
    const parsedAnnouncements = announcements.map(a => {
      let content = a.content || '';
      let expiry = null;
      const expIndex = content.indexOf('___EXPIRY:');
      if (expIndex !== -1) {
        expiry = content.substring(expIndex + 10).trim();
        content = content.substring(0, expIndex);
      }
      return { ...a, content, expiry_date: expiry };
    });

    const filteredAnn = parsedAnnouncements.filter(a => {
      const tr = a.target_role || 'All';
      if (tr === 'Pending HR Review') return false;
      if (!['All', role].includes(tr)) return false;
      
      // Filter out expired announcements for employees
      if (a.expiry_date && a.expiry_date < today) return false;
      
      return true;
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

// ─── SOP TEMPLATES ───────────────────────────────────────────────

// GET /api/sops/templates — Get all SOP templates with position info
router.get('/sops/templates', async (req, res) => {
  try {
    const { data: templates, error } = await supabase
      .from('sop_templates')
      .select('id, position_id, task_description, updated_at');
    if (error) throw error;
    const positions = await dbFetch('positions', 'id,title');
    const result = templates.map(t => ({
      ...t,
      position_title: positions.find(p => p.id === t.position_id)?.title || 'Unknown'
    }));
    return res.json({ success: true, templates: result });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

// POST /api/sops/templates — Create or update (upsert) a template for a position
router.post('/sops/templates', requireAdmin, async (req, res) => {
  try {
    const { position_id, task_description } = req.body;
    if (!position_id || !task_description) return res.status(400).json({ error: 'position_id and task_description required' });

    // Check if template exists for this position
    const { data: existing } = await supabase.from('sop_templates').select('id').eq('position_id', position_id).single();
    if (existing) {
      await supabase.from('sop_templates').update({ task_description, updated_at: new Date().toISOString() }).eq('id', existing.id);
      await dbInsert('sys_audit_logs', { user_id: req.user.id, action: 'UPDATE', module: 'SOPs', details: `Updated SOP template for position ${position_id}`, ip_address: req.ip || '0.0.0.0' });
    } else {
      await supabase.from('sop_templates').insert({ position_id, task_description });
      await dbInsert('sys_audit_logs', { user_id: req.user.id, action: 'CREATE', module: 'SOPs', details: `Created SOP template for position ${position_id}`, ip_address: req.ip || '0.0.0.0' });
    }
    return res.json({ success: true });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

// DELETE /api/sops/templates/:id
router.delete('/sops/templates/:id', requireAdmin, async (req, res) => {
  try {
    await supabase.from('sop_templates').delete().eq('id', req.params.id);
    await dbInsert('sys_audit_logs', { user_id: req.user.id, action: 'DELETE', module: 'SOPs', details: `Deleted SOP template ID: ${req.params.id}`, ip_address: req.ip || '0.0.0.0' });
    return res.json({ success: true });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

// POST /api/sops/auto-assign — Auto-assign all templates for every day in a month
router.post('/sops/auto-assign', requireAdmin, async (req, res) => {
  try {
    const { month } = req.body; // 'YYYY-MM'
    if (!month) return res.status(400).json({ error: 'month required' });

    const [year, monthStr] = month.split('-');
    const lastDay = new Date(parseInt(year), parseInt(monthStr), 0).getDate();

    // Get all templates
    const { data: templates, error: tErr } = await supabase.from('sop_templates').select('*');
    if (tErr) throw tErr;
    if (!templates || templates.length === 0) return res.status(400).json({ error: 'No SOP templates found. Please set up templates first.' });

    // Get all active employees
    const { data: employees, error: eErr } = await supabase.from('Employees').select('id, position_id').eq('status', 'Active');
    if (eErr) throw eErr;

    let totalCreated = 0;
    let totalSkipped = 0;
    const records = [];

    for (const template of templates) {
      const positionEmployees = employees.filter(e => e.position_id === template.position_id);
      if (positionEmployees.length === 0) continue;

      for (let day = 1; day <= lastDay; day++) {
        const dateStr = `${year}-${monthStr}-${String(day).padStart(2, '0')}T06:00:00.000Z`;

        for (const emp of positionEmployees) {
          // Check if record already exists for this employee on this day
          const dayDate = `${year}-${monthStr}-${String(day).padStart(2, '0')}`;
          const { data: existing } = await supabase
            .from('daily_sops')
            .select('id')
            .eq('employee_id', emp.id)
            .gte('created_at', `${dayDate}T00:00:00`)
            .lte('created_at', `${dayDate}T23:59:59`)
            .single();

          if (existing) {
            totalSkipped++;
            continue;
          }

          records.push({
            employee_id: emp.id,
            task_description: template.task_description,
            is_completed: false,
            created_at: dateStr
          });
          totalCreated++;
        }
      }
    }

    // Bulk insert
    if (records.length > 0) {
      const { error: insertErr } = await supabase.from('daily_sops').insert(records);
      if (insertErr) throw insertErr;
      await dbInsert('sys_audit_logs', { user_id: req.user.id, action: 'CREATE', module: 'SOPs', details: `Auto-assigned ${totalCreated} SOPs for month ${month}`, ip_address: req.ip || '0.0.0.0' });
    }

    return res.json({ success: true, created: totalCreated, skipped: totalSkipped });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

// GET /api/sops/report — Fetch SOPs grouped by month for HR Tracking
router.get('/sops/report', async (req, res) => {
  try {
    const { month, position_id } = req.query; // month format: 'YYYY-MM'
    if (!month) return res.status(400).json({ error: 'Month is required' });

    const [year, monthStr] = month.split('-');
    const startDate = `${month}-01`;
    const lastDay = new Date(year, parseInt(monthStr), 0).getDate();
    const endDate = `${month}-${lastDay}T23:59:59`;

    // Fetch active employees (filtered by position if provided)
    let empQuery = supabase.from('Employees').select('id, Full_name, position_id').eq('status', 'Active');
    if (position_id) empQuery = empQuery.eq('position_id', position_id);
    const { data: employees, error: empError } = await empQuery;
    if (empError) throw empError;

    // Fetch daily_sops for that month (include task_description to show missed tasks)
    const { data: sops, error: sopError } = await supabase
      .from('daily_sops')
      .select('id, employee_id, is_completed, proof_video_url, created_at, task_description')
      .gte('created_at', startDate)
      .lte('created_at', endDate);
    if (sopError) throw sopError;

    return res.json({ success: true, employees, sops });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
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
    
    if (!department_id && !position_id) {
      return res.status(400).json({ error: 'Please select a Position or Department to assign the SOP.' });
    }

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
    await dbInsert('sys_audit_logs', { user_id: req.user.id, action: 'CREATE', module: 'SOPs', details: `Assigned SOP "${title || 'Daily Task'}" to ${employees.length} employees`, ip_address: req.ip || '0.0.0.0' });
    return res.json({ success: true, assigned_count: employees.length });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

// PATCH /api/sops/bulk-update — Update task_description for a group of SOP IDs
router.patch('/sops/bulk-update', requireAdmin, async (req, res) => {
  try {
    const { ids, task_description } = req.body;
    if (!Array.isArray(ids) || !task_description) return res.status(400).json({ error: 'ids and task_description required' });
    for (const id of ids) {
      await dbUpdate('daily_sops', id, { task_description });
    }
    await dbInsert('sys_audit_logs', { user_id: req.user.id, action: 'UPDATE', module: 'SOPs', details: `Bulk updated ${ids.length} SOPs`, ip_address: req.ip || '0.0.0.0' });
    return res.json({ success: true });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

// DELETE /api/sops/:id
router.delete('/sops/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await dbDelete('daily_sops', id);
    await dbInsert('sys_audit_logs', { user_id: req.user.id, action: 'DELETE', module: 'SOPs', details: `Deleted SOP ID: ${id}`, ip_address: req.ip || '0.0.0.0' });
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
    await dbInsert('sys_audit_logs', { user_id: req.user.id, action: 'DELETE', module: 'SOPs', details: `Bulk deleted ${ids.length} SOPs`, ip_address: req.ip || '0.0.0.0' });
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
    await dbInsert('sys_audit_logs', { user_id: req.user.id, action: 'UPDATE', module: 'SOPs', details: `SOP marked as completed by employee (ID: ${id})`, ip_address: req.ip || '0.0.0.0' });
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
      v.voter_name = 'Anonymous Peer';
      delete v.voter_id; // Delete from payload for true anonymity
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
    
    // Average out the 5 parameters to get an integer score out of 5
    const total = parseFloat(attendance) + parseFloat(punctuality) + parseFloat(sops) + parseFloat(peer) + parseFloat(initiative);
    const score = Math.round(total / 5);
    
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
    
    await dbInsert('sys_audit_logs', { user_id: req.user.id, action: 'CREATE', module: 'Peer Voting', details: `Submitted peer vote for employee ID: ${nominee_id}`, ip_address: req.ip || '0.0.0.0' });
    
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
    
    // Default to 7 days if no expiry date provided
    let expiry = d.expiry_date;
    if (!expiry) {
      const dt = new Date();
      dt.setDate(dt.getDate() + 7);
      expiry = dt.toISOString().split('T')[0];
    }
    
    const finalContent = `${d.content || ''}___EXPIRY:${expiry}`;

    const result = await dbInsert('announcements', {
      title: d.title, content: finalContent,
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
      
      // Send to Telegram if configured
      if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
        try {
          const dateStr = new Date().toISOString().split('T')[0];
          const prioEmoji = d.priority === 'Urgent' ? '🚨' : d.priority === 'High' ? '🔴' : '🟡';
          const text = `🏢 *CORPHRM ANNOUNCEMENT* 🏢\n➖➖➖➖➖➖➖➖➖➖➖➖\n📌 *Subject:* ${d.title}\n${prioEmoji} *Priority:* ${d.priority || 'Medium'}\n📅 *Date:* ${dateStr}\n\n💬 *Message:*\n${d.content}\n➖➖➖➖➖➖➖➖➖➖➖➖`;
          fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: process.env.TELEGRAM_CHAT_ID,
              text: text,
              parse_mode: 'Markdown'
            })
          }).catch(err => console.error('Telegram API error:', err));
        } catch (err) {
          console.error('Failed to send Telegram message:', err);
        }
      }
      await dbInsert('sys_audit_logs', { user_id: req.user.id, action: 'CREATE', module: 'Announcements', details: `Created announcement "${d.title}"`, ip_address: req.ip || '0.0.0.0' });
    }

    return res.json({ success: !!result, announcement: result });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

router.delete('/boss/announcements/:id', requireAdmin, async (req, res) => {
  try {
    await dbDelete('announcements', req.params.id);
    await dbInsert('sys_audit_logs', { user_id: req.user.id, action: 'DELETE', module: 'Announcements', details: `Deleted announcement ID: ${req.params.id}`, ip_address: req.ip || '0.0.0.0' });
    return res.json({ success: true });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

router.put('/boss/announcements/:id/publish', requireAdmin, async (req, res) => {
  try {
    await dbUpdate('announcements', req.params.id, { target_role: 'All' });
    await dbInsert('sys_audit_logs', { user_id: req.user.id, action: 'UPDATE', module: 'Announcements', details: `Published announcement ID: ${req.params.id}`, ip_address: req.ip || '0.0.0.0' });
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
