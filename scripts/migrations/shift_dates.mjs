import dotenv from 'dotenv';
dotenv.config({ path: './server/.env' });
import { supabaseAdmin } from './server/lib/supabase.js';

async function run() {
  try {
    const { data, error } = await supabaseAdmin.from('operations_daily_menus').select('*');
    if (error) throw error;
    
    let updatedCount = 0;
    for (const menu of data) {
      if (menu.date && menu.date.startsWith('2026-06')) {
        // Replace 2026-06 with 2026-07
        const newDate = menu.date.replace('2026-06-', '2026-07-');
        
        const { error: updateErr } = await supabaseAdmin
          .from('operations_daily_menus')
          .update({ date: newDate })
          .eq('id', menu.id);
          
        if (updateErr) {
          console.error('Error updating menu', menu.id, updateErr);
        } else {
          updatedCount++;
        }
      }
    }
    console.log(`Successfully updated ${updatedCount} menus to July.`);
  } catch (e) {
    console.error(e);
  }
}
run();
