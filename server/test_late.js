import { dbFetch, dbFetchOne } from './lib/supabase.js';

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
        
        console.log(`[Shift Found] ${shift.shift_name} (Starts at ${shift.start_time}). Cutoff time: ${cutoffDt.toLocaleTimeString()}`);
        return dt > cutoffDt;
      }
    }
    
    // Fallback: 9:15 AM
    const fallbackDt = new Date(dt);
    fallbackDt.setHours(9, 15, 0, 0);
    console.log(`[No Shift Found] Using fallback cutoff time: 09:15 AM`);
    return dt > fallbackDt;
  } catch (e) {
    console.error('[checkIsLate error]', e);
    return new Date(check_in_time).getHours() >= 9;
  }
}

async function runTest() {
  console.log('--- Shift & Roster Logic Test ---');
  
  // Get an employee
  const emp = await dbFetchOne('Employees', 'id, Full_name', { status: 'Active' });
  if (!emp) return console.log('No active employee found.');
  const empId = emp.id;
  
  console.log(`Testing with Employee: ${emp.Full_name}`);
  
  // 1. Test Fallback (No Shift Assigned)
  const time1 = new Date();
  time1.setHours(8, 50, 0, 0); // 8:50 AM
  let late = await checkIsLate(empId, time1);
  console.log(`Check-in at 8:50 AM -> Is Late? ${late} (Expected: false)\n`);
  
  const time2 = new Date();
  time2.setHours(9, 20, 0, 0); // 9:20 AM
  late = await checkIsLate(empId, time2);
  console.log(`Check-in at 9:20 AM -> Is Late? ${late} (Expected: true)\n`);

  // 2. Assign Default Shift (Office Regular 9:00 AM)
  const shiftOffice = await dbFetchOne('shifts', 'id', { shift_name: 'Office Regular' });
  
  const { supabase } = await import('./lib/supabase.js');
  await supabase.from('Employees').update({ default_shift_id: shiftOffice.id }).eq('id', empId);
  console.log('Assigned "Office Regular" (09:00 AM) to employee as Default Shift.');
  
  late = await checkIsLate(empId, time2); // 9:20 AM
  console.log(`Check-in at 9:20 AM -> Is Late? ${late} (Expected: true, cutoff is 9:15 AM)\n`);

  // 3. Assign to Roster (Housekeeping Night 13:00 PM) overrides Default Shift
  const shiftNight = await dbFetchOne('shifts', 'id', { shift_name: 'Housekeeping Night' });
  const today = new Date().toISOString().split('T')[0];
  
  await supabase.from('employee_rosters').insert({
    employee_id: empId,
    shift_id: shiftNight.id,
    start_date: today
  });
  console.log('Assigned "Housekeeping Night" (13:00 PM) to employee in Roster for today.');
  
  // Check-in at 1:10 PM
  const time3 = new Date();
  time3.setHours(13, 10, 0, 0);
  late = await checkIsLate(empId, time3);
  console.log(`Check-in at 13:10 PM -> Is Late? ${late} (Expected: false, cutoff is 13:15 PM)\n`);
  
  // Clean up
  await supabase.from('employee_rosters').delete().eq('employee_id', empId);
  await supabase.from('Employees').update({ default_shift_id: null }).eq('id', empId);
  console.log('Test complete. Cleaned up temporary data.');
  process.exit(0);
}

runTest();
