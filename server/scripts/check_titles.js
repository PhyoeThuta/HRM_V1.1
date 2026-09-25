import { supabaseAdmin } from '../lib/supabase.js';

async function run() {
  const { data } = await supabaseAdmin.from('hrm_manual_articles').select('title');
  console.log(data.map(d => d.title).join('\n'));
}
run();
