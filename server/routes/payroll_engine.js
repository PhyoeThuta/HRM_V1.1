import express from 'express';
import { dbFetch, dbFetchOne, supabase, dbInsert, dbUpdate } from '../lib/supabase.js';
import { verifyToken, requireAdmin } from '../middleware/auth.js';

function getBkkDateString(dateInput) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bangkok' }).format(new Date(dateInput));
}

const defaultSettings = {
  target_bonus_percentage: 15,
  auto_weights: {
    attendance: 40,
    punctuality: 0,
    sops: 40,
    peer_voting: 20
  },
  manual_metrics: []
};

export async function getSettings() {
  try {
    const { data, error } = await supabase.from('kpi_settings').select('settings').eq('id', 1).single();
    if (error && error.code !== 'PGRST116' && error.code !== 'PGRST205') {
      throw error;
    }
    if (!data) {
      console.warn('kpi_settings table missing or empty, using defaults');
      return defaultSettings;
    }
    return data.settings;
  } catch (e) {
    console.error('Error reading settings from DB', e);
    // Even if it throws catastrophically, we MUST fallback so we don't break Recruitment and Payroll
    return defaultSettings;
  }
}

export async function saveSettings(settings) {
  try {
    const { data, error } = await supabase.from('kpi_settings').select('id').eq('id', 1).single();
    if (data) {
      await dbUpdate('kpi_settings', 1, { settings });
    } else {
      await dbInsert('kpi_settings', { id: 1, settings });
    }
  } catch (e) {
    console.error('Error saving settings to DB', e);
    throw e;
  }
}

export async function calculatePayroll(employee_id, month, req_working_days = 26) {
  // Fetch employee
  const employee = await dbFetchOne('Employees', 'id, Full_name, position_id, salary', { id: employee_id });
  if (!employee) throw new Error('Employee not found');
  
  const base_salary = parseFloat(employee.salary || 3000.0);
  const working_days = parseInt(req_working_days || 26);
  
  // Fetch Settings
  const settings = await getSettings();
  const w_att = settings.auto_weights.attendance || 0;
  const w_punct = settings.auto_weights.punctuality || 0;
  const w_sops = settings.auto_weights.sops || 0;
  const w_peer = settings.auto_weights.peer_voting || 0;
  
  // Create month date range (e.g., month = '2026-09')
  const startDate = `${month}-01T00:00:00.000Z`;
  const mStart = new Date(`${month}-01`);
  const mEnd = new Date(mStart.getFullYear(), mStart.getMonth() + 1, 0, 23, 59, 59, 999);
  const endDate = mEnd.toISOString();
  
  // 1. Attendance & Leaves (Query Pattern Fixed)
  const { data: monthly_attendance, error: attError } = await supabase
    .from('attendance_records')
    .select('check_in, check_out, is_late')
    .eq('employee_id', employee_id)
    .gte('check_in', startDate)
    .lte('check_in', endDate);
    
  const valid_attendance = monthly_attendance || [];
  
  // Deduplicate dates for attendance (a punch can happen multiple times a day)
  const attendance_dates = new Set();
  let on_time_count = 0;
  
  // Only count the FIRST check-in of the day for punctuality
  const checkinByDate = {};
  
  valid_attendance.forEach(a => {
    if (!a.check_in) return;
    const dateStr = getBkkDateString(a.check_in);
    attendance_dates.add(dateStr);
    
    // Track earliest checkin for punctuality
    if (!checkinByDate[dateStr] || new Date(a.check_in) < new Date(checkinByDate[dateStr].check_in)) {
      checkinByDate[dateStr] = a;
    }
  });

  Object.values(checkinByDate).forEach(a => {
    if (a.is_late === false || a.is_late === 'false') {
      on_time_count++;
    }
  });
  
  // Fetch approved leaves
  let approved_leave_days = 0;
  try {
    const leaves = await dbFetch('Leave_Request', '*', { employee_id, status: 'Approved' });
    leaves.forEach(l => {
      // Validate dates
      const lStart = new Date(l.start_date);
      const lEnd = new Date(l.end_date);
      
      if (lStart <= mEnd && lEnd >= mStart) {
        const effectiveStart = lStart < mStart ? mStart : lStart;
        const effectiveEnd = lEnd > mEnd ? mEnd : lEnd;
        
        let diffDays = 0;
        let currentDate = new Date(effectiveStart);
        while (currentDate <= effectiveEnd) {
          // Exclude weekends (if company policy, assuming weekends are off for now, or just calendar days)
          // For simplicity and matching legacy, we just count calendar days for leaves, but we only add them 
          // if there wasn't ALREADY an attendance record for this date to prevent double counting.
          const dStr = getBkkDateString(currentDate);
          if (!attendance_dates.has(dStr)) {
             diffDays++;
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }
        approved_leave_days += diffDays;
      }
    });
  } catch(e) { 
    console.error('Leave fetch error', e); 
    throw e; 
  }

  const actual_attendance = attendance_dates.size + approved_leave_days;
  const attendance_score = Math.min(100.0, (actual_attendance / working_days) * 100);
  
  on_time_count += approved_leave_days;
  const punctuality_score = actual_attendance > 0 ? Math.min(100.0, (on_time_count / actual_attendance * 100)) : 0;
  
  // 2. SOPs (Query Pattern Fixed)
  let sop_score = 100.0;
  let completed_sops_count = 0;
  let total_sops_count = 0;
  try {
    const { data: monthly_sops } = await supabase
      .from('daily_sops')
      .select('assigned_date, is_completed, task_description, content')
      .eq('employee_id', employee_id)
      .gte('assigned_date', startDate)
      .lte('assigned_date', endDate);
      
    if (monthly_sops && monthly_sops.length > 0) {
      monthly_sops.forEach(s => {
        const tasks = (s.task_description || s.content || '').split('\n').filter(t => t.trim());
        const taskCount = Math.max(1, tasks.length);
        total_sops_count += taskCount;
        if (s.is_completed) completed_sops_count += taskCount;
      });
      
      if (total_sops_count > 0) {
        sop_score = (completed_sops_count / total_sops_count) * 100;
      }
    }
  } catch (e) {
    console.error('SOP fetch error', e);
    throw e;
  }
  
  // 3. Peer Voting
  let peer_score = 100.0;
  let peer_votes_count = 0;
  try {
    const { data: all_votes, error: peerErr } = await supabase
      .from('peer_voting_records')
      .select('*')
      .eq('nominee_id', employee_id)
      .gte('created_at', startDate)
      .lte('created_at', endDate);
      
    if (peerErr) throw peerErr;
    
    if (all_votes && all_votes.length > 0) {
      peer_votes_count = all_votes.length;
      const avg_stars = all_votes.reduce((acc, v) => acc + parseFloat(v.score || 0), 0) / all_votes.length;
      peer_score = (avg_stars / 5.0) * 100;
    }
  } catch (e) {
    console.error('Peer voting fetch error', e);
    throw e;
  }
  
  // 4. Calculate Final KPI & Salary
  const auto_kpi_contribution = (attendance_score * (w_att/100)) + (punctuality_score * (w_punct/100)) + (sop_score * (w_sops/100)) + (peer_score * (w_peer/100));
  
  return {
    success: true,
    employee_id,
    month,
    base_salary: parseFloat(base_salary.toFixed(2)),
    auto_kpi_contribution: parseFloat(auto_kpi_contribution.toFixed(2)),
    expected_working_days: working_days,
    actual_attendance,
    on_time_count,
    attendance_score: parseFloat(attendance_score.toFixed(2)),
    punctuality_score: parseFloat(punctuality_score.toFixed(2)),
    completed_sops_count,
    total_sops_count,
    sop_score: parseFloat(sop_score.toFixed(2)),
    peer_votes_count,
    peer_score: parseFloat(peer_score.toFixed(2)),
    auto_weights: settings.auto_weights,
    manual_metrics: settings.manual_metrics || [],
    target_bonus_percentage: settings.target_bonus_percentage || 15
  };
}

const router = express.Router();
router.use(verifyToken);
router.use(requireAdmin);

// GET /api/payroll-engine/settings
router.get('/settings', async (req, res) => {
  const settings = await getSettings();
  res.json(settings);
});

// POST /api/payroll-engine/settings
router.post('/settings', async (req, res) => {
  try {
    await saveSettings(req.body);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/payroll-engine/calculate/:employee_id/:month
router.get('/calculate/:employee_id/:month', async (req, res) => {
  try {
    const data = await calculatePayroll(req.params.employee_id, req.params.month, req.query.working_days);
    return res.json(data);
  } catch (e) {
    console.error('[PAYROLL ENGINE]', e);
    return res.status(500).json({ error: e.message });
  }
});

export default router;
