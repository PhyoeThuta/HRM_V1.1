import { dbFetch, dbFetchOne, dbUpdate } from '../lib/supabase.js';

async function checkIsLate(employee_id, check_in_time) {
  try {
    const dt = new Date(check_in_time);
    const todayStr = dt.toISOString().split('T')[0];
    
    let activeShiftId = null;
    const dailySchedule = await dbFetchOne('employee_daily_schedules', 'shift_id', {
      employee_id: employee_id,
      schedule_date: todayStr,
      is_off_day: false
    });
    if (dailySchedule && dailySchedule.shift_id) {
      activeShiftId = dailySchedule.shift_id;
    }
    
    if (!activeShiftId) {
      const rosters = await dbFetch('employee_rosters', '*', { employee_id });
      for (const r of rosters) {
        if (r.start_date <= todayStr && (!r.end_date || r.end_date >= todayStr)) {
          activeShiftId = r.shift_id;
          break;
        }
      }
    }
    
    if (!activeShiftId) {
      const emp = await dbFetchOne('Employees', 'default_shift_id', { id: employee_id });
      if (emp && emp.default_shift_id) {
        activeShiftId = emp.default_shift_id;
      }
    }
    
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
    
    const fallbackDt = new Date(dt);
    fallbackDt.setHours(9, 15, 0, 0);
    return dt > fallbackDt;
  } catch (e) {
    return new Date(check_in_time).getHours() >= 9;
  }
}

async function calcOvertime(employee_id, check_out_time) {
  try {
    const dt = new Date(check_out_time);
    const todayStr = dt.toISOString().split('T')[0];
    
    let activeShiftId = null;
    const dailySchedule = await dbFetchOne('employee_daily_schedules', 'shift_id', {
      employee_id: employee_id,
      schedule_date: todayStr,
      is_off_day: false
    });
    if (dailySchedule && dailySchedule.shift_id) {
      activeShiftId = dailySchedule.shift_id;
    }
    
    if (!activeShiftId) {
      const rosters = await dbFetch('employee_rosters', '*', { employee_id });
      for (const r of rosters) {
        if (r.start_date <= todayStr && (!r.end_date || r.end_date >= todayStr)) {
          activeShiftId = r.shift_id;
          break;
        }
      }
    }
    
    if (!activeShiftId) {
      const emp = await dbFetchOne('Employees', 'default_shift_id', { id: employee_id });
      if (emp && emp.default_shift_id) activeShiftId = emp.default_shift_id;
    }
    
    if (activeShiftId) {
      const shift = await dbFetchOne('shifts', '*', { id: activeShiftId });
      if (shift && shift.end_time) {
        const [hours, minutes, seconds] = shift.end_time.split(':');
        const endDt = new Date(dt);
        endDt.setHours(parseInt(hours), parseInt(minutes), parseInt(seconds || 0), 0);
        
        const diffMs = dt - endDt;
        if (diffMs > 0) {
          const diffHours = diffMs / 3600000;
          if (diffHours >= 1) { // Only count if >= 1 hour
             return Math.round(diffHours * 10) / 10;
          }
        }
      }
    }
    return 0;
  } catch (e) {
    return 0;
  }
}

async function run() {
  const records = await dbFetch('attendance_records');
  let updated = 0;
  for (const r of records) {
    let changed = false;
    let updates = {};
    
    if (r.check_in) {
      const newLate = await checkIsLate(r.employee_id, r.check_in);
      if (newLate !== r.is_late) {
        updates.is_late = newLate;
        changed = true;
      }
    }
    
    if (r.check_out) {
      const newOt = await calcOvertime(r.employee_id, r.check_out);
      if (newOt !== (r.overtime_hours || 0)) {
        updates.overtime_hours = newOt;
        changed = true;
      }
    }
    
    if (changed) {
      await dbUpdate('attendance_records', r.id, updates);
      updated++;
      console.log(`Updated record ${r.id}: Late: ${updates.is_late}, OT: ${updates.overtime_hours}`);
    }
  }
  console.log('Total updated:', updated);
}

run().catch(console.error);
