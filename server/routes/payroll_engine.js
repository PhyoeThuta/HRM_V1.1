import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dbFetch, dbFetchOne } from '../lib/supabase.js';
import { verifyToken, requireAdmin } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SETTINGS_FILE = path.join(__dirname, '../kpi_settings.json');

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

function getSettings() {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      return JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
    }
  } catch (e) { console.error('Error reading settings', e); }
  return defaultSettings;
}

function saveSettings(settings) {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
}

const router = express.Router();
router.use(verifyToken);
router.use(requireAdmin);

// GET /api/payroll-engine/settings
router.get('/settings', (req, res) => {
  res.json(getSettings());
});

// POST /api/payroll-engine/settings
router.post('/settings', (req, res) => {
  try {
    saveSettings(req.body);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/payroll-engine/calculate/:employee_id/:month
router.get('/calculate/:employee_id/:month', async (req, res) => {
  try {
    const { employee_id, month } = req.params; // month format: YYYY-MM
    
    // Fetch employee
    const employee = await dbFetchOne('Employees', 'id, Full_name, position_id, salary', { id: employee_id });
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    
    // In actual system, salary might come from position. Using employee.salary for now, fallback to 3000
    const base_salary = parseFloat(employee.salary || 3000.0);
    const working_days = 21; // Generically 21 days for the month
    
    // Fetch Settings
    const settings = getSettings();
    const w_att = settings.auto_weights.attendance || 0;
    const w_punct = settings.auto_weights.punctuality || 0;
    const w_sops = settings.auto_weights.sops || 0;
    const w_peer = settings.auto_weights.peer_voting || 0;
    
    // 1. Attendance
    const all_attendance = await dbFetch('attendance_records', '*', { employee_id });
    const monthly_attendance = all_attendance.filter(a => String(a.check_in).startsWith(month));
    const actual_attendance = monthly_attendance.length;
    const attendance_score = Math.min(100.0, (actual_attendance / working_days) * 100);
    
    let on_time_count = 0;
    monthly_attendance.forEach(a => {
      const check_in_time = a.check_in;
      if (check_in_time && check_in_time.includes('T')) {
        const time_part = check_in_time.split('T')[1];
        if (time_part <= '09:15:00') on_time_count++;
      }
    });
    const punctuality_score = actual_attendance > 0 ? (on_time_count / actual_attendance * 100) : 0;
    
    // 2. SOPs (Assuming table exists, if not just default to 100)
    let sop_score = 100.0;
    let completed_sops_count = 0;
    let total_sops_count = 0;
    try {
      const all_sops = await dbFetch('daily_sops', '*', { employee_id });
      const monthly_sops = all_sops.filter(s => String(s.assigned_date).startsWith(month));
      const completed_sops = monthly_sops.filter(s => s.is_completed);
      
      // Calculate tasks rather than just assignments for more accuracy
      monthly_sops.forEach(s => {
        const tasks = (s.task_description || s.content || '').split('\n').filter(t => t.trim());
        const taskCount = Math.max(1, tasks.length);
        total_sops_count += taskCount;
        if (s.is_completed) completed_sops_count += taskCount;
      });
      
      if (total_sops_count > 0) {
        sop_score = (completed_sops_count / total_sops_count) * 100;
      } else if (monthly_sops.length > 0) {
        // Fallback if no task_description
        total_sops_count = monthly_sops.length;
        completed_sops_count = completed_sops.length;
        sop_score = (completed_sops_count / total_sops_count) * 100;
      }
    } catch {
      // Table might not exist yet, ignore
    }
    
    // 3. Peer Voting
    let peer_score = 100.0;
    let peer_votes_count = 0;
    try {
      const all_votes = await dbFetch('peer_voting_records', '*', { nominee_id: employee_id });
      if (all_votes && all_votes.length > 0) {
        peer_votes_count = all_votes.length;
        const avg_stars = all_votes.reduce((acc, v) => acc + parseFloat(v.score || 0), 0) / all_votes.length;
        peer_score = (avg_stars / 5.0) * 100;
      }
    } catch {
      // Table might not exist yet
    }
    
    // 4. Calculate Final KPI & Salary
    const auto_kpi_contribution = (attendance_score * (w_att/100)) + (punctuality_score * (w_punct/100)) + (sop_score * (w_sops/100)) + (peer_score * (w_peer/100));
    
    return res.json({
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
    });
    
  } catch (e) {
    console.error('[PAYROLL ENGINE]', e);
    return res.status(500).json({ error: e.message });
  }
});

export default router;
