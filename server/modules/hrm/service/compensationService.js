import { dbFetch, dbFetchOne, supabase } from '../../../lib/supabase.js';
import { getBkkDateString } from '../../../lib/dateUtils.js';
import {
  calculateLeaveDaysInMonth,
  calculateAttendanceScore,
  calculatePunctualityScore,
  calculateSopScore,
  calculatePeerScore,
  isWorkingDay,
} from '../engine/payrollCalculationEngine.js';
import { getPayrollPolicy, getWeeklyHolidaySet } from './payrollPolicyService.js';

export const compensationService = {
  getEmployeeCompensationContext: async (employee_id, month, req_working_days = null) => {
    const employee = await dbFetchOne('Employees', 'id, Full_name, position_id, salary', { id: employee_id });
    if (!employee) throw new Error('Employee not found');

    // Load company payroll policy (Phase 2)
    const policy = await getPayrollPolicy('bbd');
    const holidaySet = getWeeklyHolidaySet(policy);

    const base_salary  = parseFloat(employee.salary || 3000.0);
    // If caller passes explicit working_days (from payroll UI), use it.
    // Otherwise use policy.salary_divisor (Phase 2). BBD default = 26.
    const working_days = req_working_days ? parseInt(req_working_days) : policy.salary_divisor;
    
    const startDate = `${month}-01T00:00:00.000Z`;
    const mStart = new Date(`${month}-01`);
    const mEnd = new Date(mStart.getFullYear(), mStart.getMonth() + 1, 0, 23, 59, 59, 999);
    const endDate = mEnd.toISOString();
    
    // 1. Attendance & Leaves
    const { data: monthly_attendance } = await supabase
      .from('attendance_records')
      .select('check_in, check_out, is_late')
      .eq('employee_id', employee_id)
      .gte('check_in', startDate)
      .lte('check_in', endDate);
      
    const valid_attendance = monthly_attendance || [];
    const attendance_dates = new Set();
    let on_time_count = 0;
    const checkinByDate = {};
    
    valid_attendance.forEach(a => {
      if (!a.check_in) return;
      const dateStr = getBkkDateString(a.check_in);
      attendance_dates.add(dateStr);
      if (!checkinByDate[dateStr] || new Date(a.check_in) < new Date(checkinByDate[dateStr].check_in)) {
        checkinByDate[dateStr] = a;
      }
    });

    Object.values(checkinByDate).forEach(a => {
      if (a.is_late === false || a.is_late === 'false') {
        on_time_count++;
      }
    });
    
    let approved_leave_days = 0;
    let unpaid_leave_days = 0;
    try {
      const [{ data: leaveTypes }, leaves] = await Promise.all([
        supabase.from('Leave_type').select('id, is_paid'),
        dbFetch('Leave_Request', '*', { employee_id, status: 'Approved' })
      ]);
      const unpaidTypeIds = new Set((leaveTypes || []).filter(t => t.is_paid === false || t.is_paid === 'false').map(t => t.id));
      
      const mStartStr = getBkkDateString(mStart);
      const mEndStr   = getBkkDateString(mEnd);

      leaves.forEach(l => {
        // Use engine function for cross-month-safe, Sunday-skipping day count.
        // attendance_dates are excluded so leave days already present are not double-counted.
        const lStartStr = l.start_date;
        const lEndStr   = l.end_date;

      if (lStartStr <= mEndStr && lEndStr >= mStartStr) {
          // Count working days this leave overlaps with the payroll month using policy holiday set.
          const totalDays = calculateLeaveDaysInMonth(lStartStr, lEndStr, mStartStr, mEndStr, holidaySet);

          // Subtract attendance days that fall inside the leave period
          const effectiveStartStr = lStartStr < mStartStr ? mStartStr : lStartStr;
          const effectiveEndStr   = lEndStr   > mEndStr   ? mEndStr   : lEndStr;
          let attendedDuringLeave = 0;
          let cur = new Date(effectiveStartStr);
          cur.setHours(12, 0, 0, 0);
          const effEnd = new Date(effectiveEndStr);
          effEnd.setHours(12, 0, 0, 0);
          while (cur <= effEnd) {
            if (isWorkingDay(cur, holidaySet) && attendance_dates.has(getBkkDateString(cur))) {
              attendedDuringLeave++;
            }
            cur.setDate(cur.getDate() + 1);
          }

          const diffDays = totalDays - attendedDuringLeave;
          approved_leave_days += diffDays;
          if (unpaidTypeIds.has(l.leave_type_id)) {
            unpaid_leave_days += diffDays;
          }
        }
      });
    } catch(e) { 
      console.error('Leave fetch error', e); 
      throw e; 
    }

    const actual_attendance = attendance_dates.size + approved_leave_days;
    const attendance_score  = calculateAttendanceScore(actual_attendance, working_days);

    // Policy-driven punctuality rule: approved leave may count as on-time
    if (policy.approved_leave_counts_as_punctual) {
      on_time_count += approved_leave_days;
    }
    const punctuality_score = calculatePunctualityScore(on_time_count, actual_attendance);
    
    // 2. SOPs
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
        sop_score = calculateSopScore(completed_sops_count, total_sops_count, policy);
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
        peer_score = calculatePeerScore(avg_stars, policy.peer_score_max_stars, policy);
      }
    } catch (e) {
      console.error('Peer voting fetch error', e);
      throw e;
    }

    return {
      base_salary,
      actual_attendance,
      on_time_count,
      attendance_score,
      punctuality_score,
      completed_sops_count,
      total_sops_count,
      sop_score,
      peer_votes_count,
      peer_score,
      unpaid_leave_days
    };
  },
  
  getEmployeesForPayroll: async () => {
    const [employees, positions] = await Promise.all([
      dbFetch('Employees', 'id,Full_name,employee_id,position_id'),
      dbFetch('positions', 'id,title')
    ]);
    return { employees, positions };
  }
};
