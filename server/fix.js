import { supabase } from './lib/supabase.js';
async function fix() {
  await supabase.from('employee_onboarding').delete().eq('employee_id', 3);
  console.log('Deleted');
  process.exit(0);
}
fix();
