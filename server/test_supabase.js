import { supabase } from './lib/supabase.js';
async function test() {
  const { data, error } = await supabase.from('leave_balances').delete().eq('employee_id', '123');
  console.log('leave_balances:', error);
  const { error: e2 } = await supabase.from('Leave_balances').delete().eq('employee_id', '123');
  console.log('Leave_balances:', e2);
}
test();
