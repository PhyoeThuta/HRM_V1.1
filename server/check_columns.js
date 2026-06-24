import { supabase } from './lib/supabase.js';
async function get() {
  const { data } = await supabase.from('recruitment_candidates').select('*').limit(1);
  console.log(JSON.stringify(data));
  process.exit(0);
}
get();
