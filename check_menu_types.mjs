import dotenv from 'dotenv';
dotenv.config({ path: './server/.env' });
import { supabaseAdmin } from './server/lib/supabase.js';

async function run() {
  try {
    const { data: menuTypes, error } = await supabaseAdmin.from('operations_menu_types').select('*');
    console.log('Total menu types:', menuTypes?.length);
    if (menuTypes?.length > 0) {
      console.log('First menu type:', menuTypes[0]);
    }
    
    const { data: menus, error: menusErr } = await supabaseAdmin.from('operations_menus').select('id, name_en');
    console.log('Total menus:', menus?.length);
  } catch (e) {
    console.error(e);
  }
}
run();
