import dotenv from 'dotenv';
dotenv.config({ path: './server/.env' });
import { supabaseAdmin } from './server/lib/supabase.js';
import crypto from 'crypto';

function generateUUID() {
  return crypto.randomUUID();
}

async function run() {
  try {
    // Find daily menu for 2026-07-13 LUNCH
    const { data: dailyMenus } = await supabaseAdmin.from('operations_daily_menus')
      .select('*')
      .eq('date', '2026-07-13')
      .eq('meal_type', 'LUNCH');
      
    if (!dailyMenus || dailyMenus.length === 0) {
      console.log('No daily menu for 2026-07-13 LUNCH found!');
      return;
    }
    const dailyMenuId = dailyMenus[0].id;

    // Find the costed menu for "ပုဇွန်ငရုတ်ပွ + ထမင်း"
    const { data: menus } = await supabaseAdmin.from('operations_menus')
      .select('*')
      .like('name_mm', '%ပုဇွန်ငရုတ်ပွ%');
      
    if (!menus || menus.length === 0) {
      console.log('No costed menu found for Prawn Bell Pepper!');
      return;
    }
    const menuId = menus[0].id;

    console.log('Found Daily Menu:', dailyMenuId);
    console.log('Found Menu:', menus[0].name_en, '(', menus[0].name_mm, ')', menuId);

    // Insert into menu_types
    const newId = generateUUID();
    const { error } = await supabaseAdmin.from('operations_menu_types').insert({
      id: newId,
      menu_id: menuId,
      daily_menus_id: dailyMenuId,
      is_main: true
    });

    if (error) {
      console.error('Error inserting:', error);
    } else {
      console.log('Successfully inserted temporary menu_type:', newId);
    }
  } catch (e) {
    console.error(e);
  }
}
run();
