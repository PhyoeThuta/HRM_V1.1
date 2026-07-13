import dotenv from 'dotenv';
dotenv.config({ path: './server/.env' });
import { supabaseAdmin } from './server/lib/supabase.js';
import xlsx from 'xlsx';
import crypto from 'crypto';

function generateUUID() {
  return crypto.randomUUID();
}

function excelDateToISO(dateCode) {
  const d = xlsx.SSF.parse_date_code(dateCode);
  return `${d.y}-${String(d.m).padStart(2,'0')}-${String(d.d).padStart(2,'0')}`;
}

async function run() {
  try {
    const { data: menus } = await supabaseAdmin.from('operations_menus').select('*');
    const { data: dailyMenus } = await supabaseAdmin.from('operations_daily_menus').select('*');
    
    const wb = xlsx.readFile('Book1-5-1.xlsx');
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
    
    let currentDate = null;
    let mealIndex = 0;
    
    let dummyMenusInserted = 0;
    let menuTypesInserted = 0;

    for (let r = 0; r < data.length; r++) {
      const row = data[r];
      if (!row) continue;

      const dateCode = row[0];
      if (dateCode && typeof dateCode === 'number') {
        const origDate = excelDateToISO(dateCode);
        currentDate = origDate.replace('2026-06-', '2026-07-');
        mealIndex = 0;
      } else if (currentDate) {
        mealIndex = 1;
      }

      if (!currentDate) continue;

      const mealType = mealIndex === 0 ? 'LUNCH' : 'DINNER';
      const menuNames = [row[3], row[4], row[5]].filter(n => n && n.toString().trim() !== '');

      if (menuNames.length === 0) continue;

      const dailyMenu = dailyMenus.find(dm => dm.date === currentDate && dm.meal_type === mealType);
      if (!dailyMenu) continue;

      for (const name of menuNames) {
        const cleanName = name.toString().trim();
        if (!cleanName) continue;

        // Try to find an existing menu
        let existingMenu = menus.find(m => 
          (m.name_mm && m.name_mm.includes(cleanName)) || 
          (m.name_en && m.name_en.includes(cleanName)) ||
          cleanName.includes(m.name_mm)
        );

        // If not found, create a dummy menu!
        if (!existingMenu) {
          const newMenuId = generateUUID();
          existingMenu = {
            id: newMenuId,
            code: 'AUTO-' + Math.floor(Math.random()*10000),
            name_en: cleanName,
            name_mm: cleanName,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          
          await supabaseAdmin.from('operations_menus').insert(existingMenu);
          menus.push(existingMenu);
          dummyMenusInserted++;
        }

        // Link it in menu_types
        const { data: existingLink } = await supabaseAdmin.from('operations_menu_types')
          .select('id')
          .eq('menu_id', existingMenu.id)
          .eq('daily_menus_id', dailyMenu.id);
          
        if (!existingLink || existingLink.length === 0) {
          await supabaseAdmin.from('operations_menu_types').insert({
            id: generateUUID(),
            menu_id: existingMenu.id,
            daily_menus_id: dailyMenu.id,
            is_main: true
          });
          menuTypesInserted++;
        }
      }
    }
    
    console.log(`Created ${dummyMenusInserted} new menus.`);
    console.log(`Linked ${menuTypesInserted} menu_types.`);
  } catch (e) {
    console.error(e);
  }
}
run();
