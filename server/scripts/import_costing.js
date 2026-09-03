import xlsx from 'xlsx';
import { supabaseAdmin } from '../lib/supabase.js';
import dotenv from 'dotenv';
dotenv.config();

async function importCosting() {
  console.log('Loading Costing.xlsx...');
  const workbook = xlsx.readFile('C:/Users/Phyoe/Desktop/hrm_react/Costing.xlsx');
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

  const headers = data[0];
  const menus = [];

  // Find all menus based on headers
  for (let col = 0; col < headers.length; col++) {
    const headerText = headers[col];
    if (headerText && typeof headerText === 'string' && headerText.includes('-')) {
      // It's a menu header!
      // Example: 'FGB 0002 - Fried Beef with Bell Pepper (အမဲငရုတ်ပွ + ထမင်း)'
      const parts = headerText.split('-');
      const code = parts[0].trim();
      const nameFull = parts.slice(1).join('-').trim();
      
      let nameEn = nameFull;
      let nameMm = nameFull;
      
      const mmMatch = nameFull.match(/\((.*?)\)/);
      if (mmMatch) {
        nameMm = mmMatch[1].trim();
        nameEn = nameFull.replace(/\(.*?\)/, '').trim();
      }

      const menu = {
        code,
        name_en: nameEn,
        name_mm: nameMm,
        colIndex: col,
        ingredients: []
      };
      menus.push(menu);
    }
  }

  // Parse ingredients
  for (let row = 3; row < data.length; row++) {
    const rowData = data[row];
    if (!rowData || rowData.length === 0) continue;

    for (const menu of menus) {
      const descCol = menu.colIndex;
      const qtyCol = menu.colIndex + 2;
      const umCol = menu.colIndex + 3;

      const desc = rowData[descCol];
      const qty = rowData[qtyCol];
      const um = rowData[umCol];

      if (desc && qty) {
        menu.ingredients.push({ name: desc.trim(), quantity: parseFloat(qty), unit: (um || '').trim() });
      }
    }
  }

  console.log(`Found ${menus.length} menus with recipes.`);

  // Insert into DB
  for (const menu of menus) {
    console.log(`Processing Menu: ${menu.name_en}`);
    
    // 1. Insert/Update Menu
    const { data: insertedMenu, error: menuErr } = await supabaseAdmin
      .from('operations_menus')
      .upsert({
        code: menu.code,
        name_en: menu.name_en,
        name_mm: menu.name_mm,
        category: 'Main Dish',
        meal_type: 'LUNCH,DINNER'
      }, { onConflict: 'code' })
      .select('id')
      .single();

    if (menuErr) {
      console.error('Menu Insert Error:', menuErr);
      continue;
    }
    const menuId = insertedMenu.id;

    // 2. Process Ingredients
    for (const ing of menu.ingredients) {
      // Upsert Inventory Item
      const { data: invItem, error: invErr } = await supabaseAdmin
        .from('inventory_items')
        .upsert({
          item_code: `INV-${ing.name.substring(0, 5).toUpperCase()}-${Math.floor(Math.random()*1000)}`,
          name_eng: ing.name,
          name_mm: ing.name,
          unit_of_measure: ing.unit,
          stock_level: 1000, // Seed with 1000 so we can deduct
          min_stock_level: 100
        }, { onConflict: 'name_eng', ignoreDuplicates: true })
        .select('id')
        .single();
        
      let itemId;
      if (invErr && invErr.code === '23505') {
         // Duplicate name_eng, fetch it
         const { data: existing } = await supabaseAdmin.from('inventory_items').select('id').eq('name_eng', ing.name).single();
         if (existing) itemId = existing.id;
      } else if (invItem) {
         itemId = invItem.id;
      }

      if (itemId) {
        // 3. Upsert Recipe
        await supabaseAdmin
          .from('operations_recipes')
          .upsert({
            menu_id: menuId,
            item_id: itemId,
            quantity_required: ing.quantity
          }, { onConflict: 'menu_id,item_id' });
      }
    }
    console.log(`  -> Added ${menu.ingredients.length} ingredients to recipe.`);
  }

  console.log('✅ Real Costing Data Import Complete!');
}

importCosting();
