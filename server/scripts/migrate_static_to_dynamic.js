import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function migrate() {
  console.log('Fetching active employees...');
  const { data: employees, error: empErr } = await supabase
    .from('Employees')
    .select('id, position, default_shift_id')
    .eq('status', 'Active');
    
  if (empErr) {
    console.error('Error fetching employees:', empErr);
    return;
  }
  
  const dynamicEmployees = employees.filter(e => {
    const p = (e.position || '').toLowerCase();
    return p.includes('housekeeping') || p.includes('kitchen');
  });
  
  console.log(`Found ${dynamicEmployees.length} dynamic employees (Housekeeping/Kitchen).`);
  
  if (dynamicEmployees.length === 0) {
    console.log('No employees to migrate.');
    return;
  }
  
  const entries = [];
  const today = new Date();
  today.setHours(0,0,0,0);
  
  for (let i = 0; i < 28; i++) { // Generate for 4 weeks
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    
    for (const emp of dynamicEmployees) {
      if (emp.default_shift_id) {
        entries.push({
          employee_id: emp.id,
          schedule_date: dateStr,
          shift_id: emp.default_shift_id,
          is_off_day: false
        });
      }
    }
  }
  
  console.log(`Inserting ${entries.length} schedule entries...`);
  const { error: insErr } = await supabase
    .from('employee_daily_schedules')
    .upsert(entries, { onConflict: 'employee_id,schedule_date' });
    
  if (insErr) {
    console.error('Error inserting schedules:', insErr);
  } else {
    console.log('Migration successful!');
  }
}

migrate();
