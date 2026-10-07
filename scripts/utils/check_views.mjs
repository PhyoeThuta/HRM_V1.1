import dotenv from 'dotenv';
dotenv.config({ path: './server/.env' });
import { supabaseAdmin } from './server/lib/supabase.js';

async function run() {
  try {
    const { data, error } = await supabaseAdmin.from('operations_daily_menus').select('id').limit(1);
    if (error) {
      console.log('View does not exist or error:', error);
    } else {
      console.log('View exists!', data);
    }
  } catch (e) {
    console.error(e);
  }
}
run();
