import dotenv from 'dotenv';
dotenv.config({ path: './server/.env' });
import { supabaseAdmin } from './server/lib/supabase.js';

async function run() {
  const { data } = await supabaseAdmin.from('operations_menus').select('name_en, name_mm');
  console.log(data);
}
run();
