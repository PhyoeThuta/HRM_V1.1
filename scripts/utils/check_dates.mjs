import dotenv from 'dotenv';
dotenv.config({ path: './server/.env' });
import { supabaseAdmin } from './server/lib/supabase.js';

async function run() {
  try {
    const { data, error } = await supabaseAdmin
      .from('operations_daily_menus')
      .select('*')
      .order('date', { ascending: true });
    
    if (error) {
      console.error(error);
    } else {
      console.log(`Found ${data.length} daily menus.`);
      if (data.length > 0) {
        console.log('First 5 dates:', data.slice(0, 5).map(d => d.date).join(', '));
        console.log('Is 2026-07-13 present?', data.some(d => d.date === '2026-07-13'));
      }
    }
  } catch (e) {
    console.error(e);
  }
}
run();
