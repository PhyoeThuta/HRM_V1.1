import express from 'express';
import { dbFetch } from '../lib/supabase.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/dashboard
router.get('/', verifyToken, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const user = req.user;
    const role = user?.role || '';

    const [employees, attendance, leaveReqs, offboarding, onboarding, candidates, payrolls, rawAnnouncements] =
      await Promise.all([
        dbFetch('Employees', 'id,employee_id,Full_name,status,Dept_id'),
        dbFetch('attendance_records', 'id,employee_id,check_in,check_out,is_late'),
        dbFetch('Leave_Request', 'id,status'),
        dbFetch('corporate_offboarding', 'id,settlement_status'),
        dbFetch('employee_onboarding', 'id,status'),
        dbFetch('recruitment_candidates', 'id,status'),
        dbFetch('payrolls', 'id,payment_status,net_salary'),
        dbFetch('announcements', '*'),
      ]);

    const totalStaff = employees.length;
    const activeStaff = employees.filter(e => String(e.status || '').toLowerCase() === 'active').length;
    const onLeave = employees.filter(e => String(e.status || '').toLowerCase().includes('leave')).length;
    const todayPresent = attendance.filter(a => String(a.check_in || '').startsWith(today)).length;
    const lateToday = attendance.filter(a => a.is_late && String(a.check_in || '').startsWith(today)).length;
    const pendingLeaves = leaveReqs.filter(l => String(l.status || '').toLowerCase() === 'pending').length;
    const approvedLeaves = leaveReqs.filter(l => String(l.status || '').toLowerCase() === 'approved').length;
    const rejectedLeaves = leaveReqs.filter(l => String(l.status || '').toLowerCase() === 'rejected').length;
    const pendingClear = offboarding.filter(o => String(o.settlement_status || '').toLowerCase().startsWith('hold')).length;
    const activeOnboard = onboarding.filter(o => ['Pre-boarding', 'In Progress'].includes(o.status)).length;
    const openPositions = new Set(candidates.filter(c => ['Applied', 'Screening', 'Interview'].includes(c.status)).map(c => c.status)).size;
    const totalPayroll = payrolls.filter(p => p.payment_status === 'Paid').reduce((sum, p) => sum + parseFloat(p.net_salary || 0), 0);
    const offboardedCount = offboarding.length;
    const turnoverRate = totalStaff > 0 ? ((offboardedCount / totalStaff) * 100).toFixed(1) : '0.0';

    // Attendance chart data
    const presentOnTime = todayPresent - lateToday;
    const absentToday = Math.max(0, activeStaff - todayPresent - onLeave);
    const attChart = {
      'On Time': presentOnTime,
      'Late': lateToday,
      'On Leave': onLeave,
      'Absent': absentToday,
    };

    const leaveChart = { Pending: pendingLeaves, Approved: approvedLeaves, Rejected: rejectedLeaves };

    // Announcements with role filter
    const announcements = rawAnnouncements.filter(a => {
      const tr = a.target_role || 'All';
      if (tr === 'Pending HR Review') return false;
      if (['boss', 'hr_manager', 'admin'].includes(role)) return true;
      return ['All', role].includes(tr);
    });

    const recentEmployees = employees.slice(0, 8);

    return res.json({
      stats: {
        total_staff: totalStaff,
        active_staff: activeStaff,
        on_leave: onLeave,
        today_present: todayPresent,
        late_today: lateToday,
        total_leaves: approvedLeaves,
        pending_clearances: pendingClear,
        active_onboarding: activeOnboard,
        open_recruitment: openPositions,
        total_payroll_paid: `$${totalPayroll.toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
        turnover_rate: `${turnoverRate}%`,
      },
      att_chart: attChart,
      leave_chart: leaveChart,
      recent_employees: recentEmployees,
      ann_list: announcements,
      today: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    });
  } catch (e) {
    console.error('[DASHBOARD]', e);
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;
