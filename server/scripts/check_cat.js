import { supabaseAdmin } from './lib/supabase.js';
async function test() {
  const { data } = await supabaseAdmin.from('hrm_manual_categories').select('*').order('order_index');
  console.log(data);
}
test();
