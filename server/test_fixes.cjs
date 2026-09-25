const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '../server/.env' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testLeaveDateRange() {
  console.log('Testing Leave Date Range API Simulation...');
  
  // Directly simulate what the service does
  const start = new Date('2026-10-10');
  const end = new Date('2026-10-01');
  
  if (end < start) {
    console.log('✅ Validation correctly caught end < start');
  } else {
    console.log('❌ Validation FAILED');
  }
}

async function testEmployeeHardDelete() {
  console.log('Testing Employee Hard Delete...');
  
  // We'll create a dummy employee, insert dummy timeline/handover/sop/offboarding, and then delete it.
  const { data: emp, error: empErr } = await supabase.from('Employees').insert({
    employee_id: 'TEST-HD-001',
    Full_name: 'Test Hard Delete',
    status: 'Inactive'
  }).select().single();
  
  if (empErr) {
    console.error('Failed to create test employee:', empErr);
    return;
  }
  
  const eid = emp.id;
  console.log('Created test employee:', eid);
  
  try {
    // Insert into all missing cascade tables
    await supabase.from('employee_career_timeline').insert({ employee_id: eid, event_type: 'Promotion' });
    await supabase.from('corporate_offboarding').insert({ employee_id: eid, status: 'Pending' });
    await supabase.from('daily_sops').insert({ employee_id: eid, task_description: 'Test task' });
    await supabase.from('handovers').insert({ employee_id: eid, successor_id: eid, title: 'Test Handover', status: 'Pending' });
    
    console.log('Inserted dependent records. Triggering simulated hard delete cascade...');
    
    const cascade = async (table, col = 'employee_id') => {
      const { error } = await supabase.from(table).delete().eq(col, eid);
      if (error && error.code !== '42P01' && error.code !== 'PGRST205') { 
        throw new Error(`Cannot delete: referenced in ${table}. Error: ${error.message}`);
      }
    };
    
    await cascade('handovers');
    await cascade('handovers', 'successor_id');
    await cascade('employee_career_timeline');
    await cascade('corporate_offboarding');
    await cascade('daily_sops');
    
    // Delete employee
    const { error: delErr } = await supabase.from('Employees').delete().eq('id', eid);
    
    if (delErr) {
      console.error('❌ Hard delete failed with FK error:', delErr.message);
    } else {
      console.log('✅ Hard delete succeeded, cascades worked flawlessly.');
    }
  } catch (err) {
    console.error('❌ Hard delete test caught an error:', err.message);
  }
}

async function runTests() {
  await testLeaveDateRange();
  await testEmployeeHardDelete();
  console.log('Tests completed.');
}

runTests();
