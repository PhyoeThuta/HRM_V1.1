import { dbFetch } from './lib/supabase.js';

async function verify() {
  console.log("=== RUNNING RUNTIME VERIFICATION ===");
  const [positions, employees] = await Promise.all([
    dbFetch('positions', '*', {}, { order: 'title', ascending: true }),
    dbFetch('Employees', 'id,position_id,Full_name,employee_id,avatar_url', { status: 'Active' }),
  ]);
  const empsMap = {};
  employees.forEach(e => { 
    if (!empsMap[e.position_id]) empsMap[e.position_id] = [];
    empsMap[e.position_id].push(e);
  });
  
  let zeroCount = 0;
  let singleCount = 0;
  let multipleCount = 0;

  positions.forEach(p => { 
    p.staff = empsMap[p.id] || [];
    p.emp_count = p.staff.length; 
    if (p.emp_count === 0) zeroCount++;
    else if (p.emp_count === 1) singleCount++;
    else if (p.emp_count > 1) multipleCount++;
  });

  console.log(`\nVerified GET /api/positions structure:`);
  console.log(`Total Positions: ${positions.length}`);
  console.log(`Positions with 0 STAFF: ${zeroCount} -> Expected to show Localized Empty State`);
  console.log(`Positions with 1 STAFF: ${singleCount} -> Expected to show 1 Employee Row`);
  console.log(`Positions with Multiple STAFF: ${multipleCount} -> Expected to show N Employee Rows`);

  const pZero = positions.find(p => p.emp_count === 0);
  if (pZero) console.log(`\nSample (0 STAFF): ${pZero.title} -> staff array length: ${pZero.staff.length}`);

  const pSingle = positions.find(p => p.emp_count === 1);
  if (pSingle) {
    console.log(`\nSample (1 STAFF): ${pSingle.title}`);
    console.log(`- ${pSingle.staff[0].Full_name} (${pSingle.staff[0].employee_id})`);
  }

  const pMulti = positions.find(p => p.emp_count > 1);
  if (pMulti) {
    console.log(`\nSample (Multiple STAFF): ${pMulti.title} (${pMulti.emp_count} STAFF)`);
    pMulti.staff.forEach(s => console.log(`- ${s.Full_name} (${s.employee_id})`));
  }
}

verify().catch(console.error);
