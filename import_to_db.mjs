import dotenv from 'dotenv';
dotenv.config({ path: './server/.env' });

import { supabaseAdmin } from './server/lib/supabase.js';
import fs from 'fs';

async function run() {
  console.log('Reading parsed_costing.json...');
  const data = JSON.parse(fs.readFileSync('parsed_costing.json', 'utf8'));
  
  let insertedItems = 0;
  let insertedMenus = 0;
  let insertedRecipes = 0;

  for (const menu of data) {
    if (!menu.code || !menu.name_en) continue;

    console.log(`Processing Menu: ${menu.code} - ${menu.name_en}`);

    // 1. Insert Menu
    const { data: menuData, error: menuErr } = await supabaseAdmin.schema('operations').from('menus').upsert({
      code: menu.code,
      name_en: menu.name_en,
      name_mm: menu.name_mm,
      sales_prices: menu.sales_prices || 0,
      total_bill_of_materials: menu.total_bill_of_materials || 0
    }, { onConflict: 'code' }).select().single();

    if (menuErr) {
      console.error(`Error inserting menu ${menu.code}:`, menuErr.message);
      continue;
    }
    insertedMenus++;

    // 2. Process Ingredients
    for (const ing of menu.ingredients) {
      if (!ing.name) continue;

      // Upsert Inventory Item (Use name as item_code for now if unique)
      const itemCode = `ITM-${ing.name.substring(0, 5).toUpperCase().replace(/[^A-Z0-9]/g, '')}-${Math.floor(Math.random()*10000)}`;
      
      let { data: existingItems } = await supabaseAdmin.schema('inventory').from('items').select('*').ilike('name_eng', ing.name);
      
      let itemId = null;
      if (existingItems && existingItems.length > 0) {
        itemId = existingItems[0].id;
      } else {
        const { data: newItem, error: itemErr } = await supabaseAdmin.schema('inventory').from('items').insert({
          item_code: itemCode,
          name_eng: ing.name,
          category: 'RAW_MATERIAL',
          unit_of_measure: ing.unit,
          cost_per_unit: ing.cost_per_unit,
          min_quantity: 0
        }).select().single();

        if (itemErr) {
          console.error(`Error inserting item ${ing.name}:`, itemErr.message);
          continue;
        }
        itemId = newItem.id;
        insertedItems++;

        // Add initial balance 0
        await supabaseAdmin.schema('inventory').from('balances').insert({
          item_id: itemId,
          current_quantity: 0
        });
      }

      // 3. Insert Recipe (BOM)
      await supabaseAdmin.schema('operations').from('recipes')
        .delete()
        .eq('menu_id', menuData.id)
        .eq('inventory_item_id', itemId);

      const { error: recipeErr } = await supabaseAdmin.schema('operations').from('recipes').insert({
        menu_id: menuData.id,
        inventory_item_id: itemId,
        quantity: ing.qty,
        unit_of_measure: ing.unit,
        estimated_cost: ing.total_cost
      });

      if (recipeErr) {
        console.error(`Error inserting recipe for ${ing.name}:`, recipeErr.message);
      } else {
        insertedRecipes++;
      }
    }
  }

  console.log(`\nImport Complete!`);
  console.log(`Menus inserted/updated: ${insertedMenus}`);
  console.log(`Inventory Items created: ${insertedItems}`);
  console.log(`Recipe/BOM links created: ${insertedRecipes}`);
}

run();
