import { supabase } from './lib/supabase.js';
async function check() {
  const { data, error } = await supabase.from('recruitment_candidates').select('*');
  console.log(JSON.stringify(data, null, 2));
  console.error(error);
  process.exit(0);
}
check();
