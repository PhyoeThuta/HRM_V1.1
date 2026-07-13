import dotenv from 'dotenv';
dotenv.config({ path: './server/.env' });
import { supabaseAdmin } from './server/lib/supabase.js';

async function run() {
  const { data } = await supabaseAdmin.from('inventory_items').select('*').limit(3);
  console.log(data);
}
run();
