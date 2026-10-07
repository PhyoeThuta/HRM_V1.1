import dotenv from 'dotenv';
dotenv.config({ path: './server/.env' });
import { supabaseAdmin } from './server/lib/supabase.js';

async function run() {
  try {
    const checks = [
      'operations_daily_menus',
      'operations_menu_types',
      'operations_menus',
      'operations_recipes',
      'inventory_items'
    ];
    for (const table of checks) {
      const { data, error } = await supabaseAdmin.from(table).select('*').limit(1);
      if (error) {
        console.error(`Error on ${table}:`, error);
      } else {
        console.log(`Success on ${table}: ${data.length}`);
      }
    }
  } catch (e) {
    console.error(e);
  }
}
run();
