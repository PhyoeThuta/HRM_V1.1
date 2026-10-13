import dotenv from 'dotenv';
dotenv.config({ path: './server/.env' });
import { supabaseAdmin } from './server/lib/supabase.js';
import xlsx from 'xlsx';

function excelDateToISO(dateCode) {
  const d = xlsx.SSF.parse_date_code(dateCode);
  return `${d.y}-${String(d.m).padStart(2,'0')}-${String(d.d).padStart(2,'0')}`;
}

async function run() {
  try {
    // 1. Fetch all menus to build a robust lookup
    const { data: menus } = await supabaseAdmin.from('operations_menus').select('*');
    const menuLookup = new Map();
    
    menus.forEach(m => {
      if (m.name_en) menuLookup.set(m.name_en.toLowerCase().trim(), m.id);
      if (m.name_mm) menuLookup.set(m.name_mm.toLowerCase().trim(), m.id);
      // Also try to strip out words like "1 portion" if they exist
    });
    
    // Add manual fallbacks if needed, based on common typos
    // Let's just rely on exact mm or en matching for now, stripping spaces.

    // 2. Fetch daily menus to map date -> daily_menus_id
    const { data: dailyMenus } = await supabaseAdmin.from('operations_daily_menus').select('*');
    
    // 3. Read Book1-5-1.xlsx
    const wb = xlsx.readFile('Book1-5-1.xlsx');
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
    
    let currentDate = null;
    let mealIndex = 0; // 0 = LUNCH, 1 = DINNER
    
    let insertedCount = 0;

    for (let r = 0; r < data.length; r++) {
      const row = data[r];
      if (!row) continue;

      const dateCode = row[0];
      if (dateCode && typeof dateCode === 'number') {
        const origDate = excelDateToISO(dateCode);
        // We shifted the database dates to July, so we must lookup using July!
        currentDate = origDate.replace('2026-06-', '2026-07-');
        mealIndex = 0;
      } else if (currentDate) {
        mealIndex = 1;
      }

      if (!currentDate) continue;

      const mealType = mealIndex === 0 ? 'LUNCH' : 'DINNER';
      const menuNames = [row[3], row[4], row[5]].filter(n => n && n.toString().trim() !== '');

      if (menuNames.length === 0) continue;

      // Find the daily_menus_id
      const dailyMenu = dailyMenus.find(dm => dm.date === currentDate && dm.meal_type === mealType);
      if (!dailyMenu) continue;

      for (const name of menuNames) {
        const cleanName = name.toString().toLowerCase().trim();
        const menuId = menuLookup.get(cleanName);
        
        if (menuId) {
          // Check if it already exists
          const { data: existing } = await supabaseAdmin.from('operations_menu_types')
            .select('id')
            .eq('menu_id', menuId)
            .eq('daily_menus_id', dailyMenu.id);
            
          if (!existing || existing.length === 0) {
            await supabaseAdmin.from('operations_menu_types').insert({
              menu_id: menuId,
              daily_menus_id: dailyMenu.id,
              is_main: true
            });
            insertedCount++;
          }
        } else {
          console.log('Could not find match for:', name);
        }
      }
    }
    
    console.log(`Successfully inserted ${insertedCount} missing menu_types!`);
  } catch (e) {
    console.error(e);
  }
}
run();
