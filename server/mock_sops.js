import { dbFetch, dbInsert } from './lib/supabase.js';

async function seedSops() {
  console.log('Seeding daily SOPs for the last 30 days...');
  
  // 1. Get all active employees
  const employees = await dbFetch('Employees', '*');
  const activeEmployees = employees;
  
  if (!activeEmployees || activeEmployees.length === 0) {
    console.log('No active employees found.');
    return;
  }

  // 2. Prepare 30 days of SOPs for each position/department
  const today = new Date();
  const sopRecords = [];

  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    
    // Skip weekends
    if (d.getDay() === 0 || d.getDay() === 6) continue;

    const dateStr = d.toISOString().split('T')[0];

    // For each employee, create an SOP entry
    for (const emp of activeEmployees) {
      // Randomly complete some SOPs, keep recent ones pending
      const isCompleted = i > 3 ? Math.random() > 0.1 : false;

      sopRecords.push({
        employee_id: emp.id,
        assigned_date: dateStr,
        task_description: `1. Check team emails\n2. Update task tracker\n3. Attend daily standup`,
        is_completed: isCompleted,
        created_at: new Date(d.setHours(8, 0, 0, 0)).toISOString(),
      });
    }
  }

  console.log(`Prepared ${sopRecords.length} SOP records to insert. Inserting 1 by 1...`);
  
  let success = 0;
  for (const record of sopRecords) {
    const res = await dbInsert('daily_sops', record);
    if (res) success++;
  }

  console.log(`Seeding completed. Inserted ${success} records.`);
}

seedSops().then(() => process.exit(0)).catch(console.error);
