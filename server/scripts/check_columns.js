import { supabaseAdmin } from '../lib/supabase.js';

async function run() {
  const { data } = await supabaseAdmin.from('hrm_manual_articles').select('*').limit(1);
  console.log(Object.keys(data[0]));
}
run();
