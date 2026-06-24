import { supabase, dbInsert, dbFetch } from './lib/supabase.js';

async function fixMissingTasks() {
  console.log('Fetching all onboarding records...');
  const { data: onboardings, error } = await supabase.from('employee_onboarding').select('*');
  if (error) { console.error(error); return; }

  const defaultTasks = await dbFetch('onboarding_tasks', 'id,due_days_after_hire');
  console.log(`Found ${defaultTasks.length} default tasks`);

  let fixedCount = 0;

  for (const ob of onboardings) {
    const { data: assignments } = await supabase.from('onboarding_assignments').select('id').eq('onboarding_id', ob.id);
    if (!assignments || assignments.length === 0) {
      console.log(`Fixing tasks for onboarding ID: ${ob.id}`);
      const sd = ob.start_date || new Date().toISOString().slice(0, 10);
      
      for (const task of defaultTasks) {
        const dueDays = parseInt(task.due_days_after_hire || 1);
        const dueDate = new Date(new Date(sd).getTime() + dueDays * 24 * 60 * 60 * 1000);
        await dbInsert('onboarding_assignments', {
          onboarding_id: ob.id,
          task_id: task.id,
          status: 'Pending',
          due_date: dueDate.toISOString().slice(0, 10),
          created_at: new Date().toISOString(),
        });
      }
      fixedCount++;
    }
  }

  console.log(`Done. Fixed ${fixedCount} records.`);
  process.exit(0);
}

fixMissingTasks();
