import { supabaseAdmin } from './lib/supabase.js';
async function run() {
  const { data, error } = await supabaseAdmin.rpc('run_sql', { sql: 'ALTER TABLE operations_orders ADD COLUMN IF NOT EXISTS custom_delivery_address TEXT;' });
  // wait, run_sql might not exist. If it doesn't, we can just do a dummy query or tell user to run it.
  // actually I can just run it using psql or whatever.
}
run();
