import { supabaseAdmin } from './lib/supabase.js';
async function check() {
  const { data, error } = await supabaseAdmin.from('operations_orders').select('*').limit(1);
  if (error) console.error(error);
  else console.log(data.length > 0 ? Object.keys(data[0]) : 'empty');
  process.exit();
}
check();
