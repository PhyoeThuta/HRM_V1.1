import { supabase } from './lib/supabase.js';
async function get() {
  const table = process.argv[2] || 'positions';
  const { data } = await supabase.from(table).select('*').limit(1);
  console.log(JSON.stringify(data));
  process.exit(0);
}
get();
