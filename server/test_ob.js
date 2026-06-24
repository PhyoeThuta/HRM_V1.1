import { supabase, dbInsert, dbFetch } from './lib/supabase.js';
async function test() {
  const d = { employee_id: 3, status: 'Pre-boarding', start_date: '2026-06-23' };
  console.log('Inserting...');
  const result = await dbInsert('employee_onboarding', d);
  console.log('Result:', result);
  if (result) {
    const tasks = await dbFetch('onboarding_tasks', 'id,due_days_after_hire');
    console.log('Tasks fetched:', tasks);
    for (const t of tasks) {
      await dbInsert('onboarding_assignments', {
        onboarding_id: result.id,
        task_id: t.id,
        status: 'Pending',
        due_date: '2026-06-25'
      });
    }
    console.log('Done inserting tasks');
  }
  process.exit(0);
}
test();
