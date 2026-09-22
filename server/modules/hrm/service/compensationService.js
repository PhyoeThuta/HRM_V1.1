import { dbFetch, dbFetchOne, supabase } from '../../../lib/supabase.js';

function getBkkDateString(dateInput) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bangkok' }).format(new Date(dateInput));
}

export const compensationService = {
  getEmployeeCompensationContext: async (employee_id, month, req_working_days = 26) => {
    const employee = await dbFetchOne('Employees', 'id, Full_name, position_id, salary', { id: employee_id });
    if (!employee) throw new Error('Employee not found');
    
    const base_salary = parseFloat(employee.salary || 3000.0);
    const working_days = parseInt(req_working_days || 26);
    
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
    try {
      const leaves = await dbFetch('Leave_Request', '*', { employee_id, status: 'Approved' });
      leaves.forEach(l => {
        const lStart = new Date(l.start_date);
        const lEnd = new Date(l.end_date);
        if (lStart <= mEnd && lEnd >= mStart) {
          const effectiveStart = lStart < mStart ? mStart : lStart;
          const effectiveEnd = lEnd > mEnd ? mEnd : lEnd;
          let diffDays = 0;
          let currentDate = new Date(effectiveStart);
          while (currentDate <= effectiveEnd) {
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
      peer_score
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
