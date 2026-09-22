import express from 'express';
import { dbFetch, dbFetchOne, supabase, dbInsert, dbUpdate } from '../lib/supabase.js';
import { verifyToken, requireAdmin } from '../middleware/auth.js';
import { hrmModule } from '../modules/hrm/index.js';

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
  const context = await hrmModule.getEmployeeCompensationContext(employee_id, month, req_working_days);
  const base_salary = context.base_salary;
  const working_days = parseInt(req_working_days || 26);
  
  // Fetch Settings
  const settings = await getSettings();
  const w_att = settings.auto_weights.attendance || 0;
  const w_punct = settings.auto_weights.punctuality || 0;
  const w_sops = settings.auto_weights.sops || 0;
  const w_peer = settings.auto_weights.peer_voting || 0;
  
  const {
    actual_attendance,
    on_time_count,
    attendance_score,
    punctuality_score,
    completed_sops_count,
    total_sops_count,
    sop_score,
    peer_votes_count,
    peer_score
  } = context;
  
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
