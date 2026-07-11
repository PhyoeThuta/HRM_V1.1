import xlsx from 'xlsx';
import fs from 'fs';

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function excelDateToISO(dateCode) {
  const d = xlsx.SSF.parse_date_code(dateCode);
  return `${d.y}-${String(d.m).padStart(2,'0')}-${String(d.d).padStart(2,'0')}`;
}

function esc(str) {
  if (!str) return '';
  return str.toString().trim().replace(/'/g, "''");
}

// ==========================================
// PHASE 1: Parse Costing.xlsx
// ==========================================
function parseCosting() {
  console.log("Parsing Costing.xlsx...");
  const workbook = xlsx.readFile('Costing.xlsx');
  const sheet = workbook.Sheets['One Portion'];
  const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

  const inventoryItems = new Map();
  const menus = [];
  let itemCodeCounter = 1;

  for (let r = 0; r < data.length; r++) {
    if (!data[r]) continue;
    for (let c = 0; c < data[r].length; c++) {
      if (!data[r][c]) continue;
      
      const titleRaw = data[r][c].toString();
      const match = titleRaw.match(/^([A-Z]{2,3}\s*\d{4})\s*-\s*([^\(]+)(?:\((.+)\))?/);
      if (!match) continue;
      
      const salesPriceRaw = data[r+1] && data[r+1][c] ? data[r+1][c].toString() : '';
      const code = match[1].trim();
      const name_en = esc(match[2]);
      const name_mm = match[3] ? esc(match[3]) : '';
      
      const spMatch = salesPriceRaw.match(/([\d\.]+)/);
      const salesPrice = spMatch ? parseFloat(spMatch[1]) : 0;
      
      const menuId = generateUUID();
      const menu = { id: menuId, code, name_en, name_mm, sales_prices: salesPrice, ingredients: [], total_bom: 0 };
      
      for (let i = r + 3; i < data.length; i++) {
        const row = data[i];
        if (!row || !row[c]) continue;
        if (row[c].toString().includes('Total Bill of Materials')) break;
        
        const ingredientName = row[c].toString().trim();
        if (!ingredientName) continue;
        
        const escapedName = esc(ingredientName);
        const cost = parseFloat(row[c+1]) || 0;
        const qty = parseFloat(row[c+2]) || 0;
        const uom = row[c+3] ? row[c+3].toString().trim() : 'PCS';
        
        let itemInfo;
        if (!inventoryItems.has(ingredientName)) {
          const itemId = generateUUID();
          const itemCode = `ITM-${String(itemCodeCounter++).padStart(4,'0')}`;
          itemInfo = { id: itemId, name: escapedName, uom, cost, itemCode };
          inventoryItems.set(ingredientName, itemInfo);
        } else {
          itemInfo = inventoryItems.get(ingredientName);
        }
        
        const lineTotal = cost * qty;
        menu.ingredients.push({ item_id: itemInfo.id, qty, total: lineTotal });
        menu.total_bom += lineTotal;
      }
      
      menus.push(menu);
    }
  }
  
  console.log(`  Found ${menus.length} menus, ${inventoryItems.size} ingredients.`);
  return { menus, inventoryItems };
}

// ==========================================
// PHASE 2: Parse Book1-5-1.xlsx (Monthly Plan)
// ==========================================
// Structure: each row represents a meal option for a day
// Col 0 = Excel date code (if present = new day), Col 3+ = menu items, Col 7 = RICE/NO RICE
// Each day has 2 rows:
//   Row 1 = LUNCH option(s)
//   Row 2 = DINNER option(s) OR second lunch variant

function parseMonthlyPlan(menus) {
  console.log("Parsing Book1-5-1.xlsx (Monthly Plan)...");
  const workbook = xlsx.readFile('Book1-5-1.xlsx');
  const sheet = workbook.Sheets['Sheet1'];
  const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

  // Build a lookup map from Burmese name -> menu_id
  const menuLookup = new Map();
  for (const m of menus) {
    if (m.name_mm) menuLookup.set(m.name_mm.replace(/'/g, ''), m.id);
  }

  const dailyMenusSQL = [];
  const menuTypesSQL = [];

  let currentDate = null;
  let mealIndex = 0; // 0 = LUNCH, 1 = DINNER

  for (let r = 0; r < data.length; r++) {
    const row = data[r];
    if (!row) continue;

    const dateCode = row[0];
    if (dateCode && typeof dateCode === 'number') {
      currentDate = excelDateToISO(dateCode);
      mealIndex = 0;
    } else if (currentDate) {
      mealIndex = 1;
    }

    if (!currentDate) continue;

    const withRice = row[7] !== 'NO RICE';
    const mealType = mealIndex === 0 ? 'LUNCH' : 'DINNER';

    // Collect all menu names from this row (cols 3,4,5 can have items)
    const menuNames = [row[3], row[4], row[5]].filter(n => n && n.toString().trim() !== '');
    const soup = row[6]; // col 6 = soup/beverage

    if (menuNames.length === 0 && !soup) continue;

    const dailyMenuId = generateUUID();
    dailyMenusSQL.push(`INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('${dailyMenuId}', '${currentDate}', ${withRice}, '${mealType}') ON CONFLICT DO NOTHING;`);

    // Add each menu item as a menu_type entry (linked to a menu if we can find it)
    let isMain = true;
    for (const name of menuNames) {
      const nameClean = name.toString().trim();
      const menuId = menuLookup.get(nameClean) || null;
      const menuTypId = generateUUID();
      if (menuId) {
        menuTypesSQL.push(`INSERT INTO operations.menu_types (id, menu_id, daily_menus_id, is_main) VALUES ('${menuTypId}', '${menuId}', '${dailyMenuId}', ${isMain}) ON CONFLICT DO NOTHING;`);
      } else {
        // Menu not in Costing (it's a planned item not yet costed), still record it as reference
        menuTypesSQL.push(`-- Uncosted item: ${esc(nameClean)} for ${currentDate} ${mealType}`);
      }
      isMain = false;
    }
    // Soup as a side
    if (soup) {
      const soupClean = soup.toString().trim();
      const soupMenuId = menuLookup.get(soupClean) || null;
      const soupTypId = generateUUID();
      if (soupMenuId) {
        menuTypesSQL.push(`INSERT INTO operations.menu_types (id, menu_id, daily_menus_id, is_main) VALUES ('${soupTypId}', '${soupMenuId}', '${dailyMenuId}', false) ON CONFLICT DO NOTHING;`);
      } else {
        menuTypesSQL.push(`-- Soup/drink (uncosted): ${esc(soupClean)} for ${currentDate} ${mealType}`);
      }
    }
  }

  console.log(`  Generated ${dailyMenusSQL.length} daily menu entries, ${menuTypesSQL.length} menu_type entries.`);
  return { dailyMenusSQL, menuTypesSQL };
}

// ==========================================
// MAIN: Generate Full SQL File
// ==========================================
function main() {
  const { menus, inventoryItems } = parseCosting();
  const { dailyMenusSQL, menuTypesSQL } = parseMonthlyPlan(menus);

  let sql = `-- ============================================================
-- AUTO-GENERATED SEED FROM EXCEL (Costing.xlsx + Book1-5-1.xlsx)
-- Run this in Supabase SQL Editor
-- ============================================================

-- Step 0: Clean existing data (order matters due to FK constraints)
DELETE FROM operations.menu_types;
DELETE FROM operations.daily_menus;
DELETE FROM operations.recipes;
DELETE FROM operations.menus;
DELETE FROM inventory.balances;
DELETE FROM inventory.items;

-- Step 1: Inventory Items
`;
  for (const [, info] of inventoryItems.entries()) {
    sql += `INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('${info.id}', '${info.name}', '${info.itemCode}', 'RECIPE_INGREDIENT', '${info.uom}') ON CONFLICT DO NOTHING;\n`;
    sql += `INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('${info.id}', 0, 0, ${info.cost}) ON CONFLICT DO NOTHING;\n`;
  }

  sql += `\n-- Step 2: Master Menus\n`;
  for (const m of menus) {
    sql += `INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('${m.id}', '${m.code}', '${m.name_en}', '${m.name_mm}', ${m.sales_prices}, ${m.total_bom.toFixed(4)}) ON CONFLICT DO NOTHING;\n`;
  }

  sql += `\n-- Step 3: Recipes (Bill of Materials)\n`;
  for (const m of menus) {
    for (const ing of m.ingredients) {
      sql += `INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('${m.id}', '${ing.item_id}', ${ing.qty}, ${ing.total.toFixed(4)});\n`;
    }
  }

  sql += `\n-- Step 4: Daily Menu Plan (Monthly Calendar)\n`;
  for (const line of dailyMenusSQL) sql += line + '\n';

  sql += `\n-- Step 5: Menu Types (which menus are scheduled per daily menu)\n`;
  for (const line of menuTypesSQL) sql += line + '\n';

  fs.writeFileSync('seed_ops.sql', sql);
  const lineCount = sql.split('\n').length;
  console.log(`\nDone! seed_ops.sql generated with ${lineCount} lines.`);
  console.log(`Summary:`);
  console.log(`  - ${inventoryItems.size} Ingredients → inventory.items + inventory.balances`);
  console.log(`  - ${menus.length} Master Menus → operations.menus`);
  console.log(`  - ${menus.reduce((s,m) => s + m.ingredients.length, 0)} Recipe lines → operations.recipes`);
  console.log(`  - ${dailyMenusSQL.length} Daily Menus → operations.daily_menus`);
  console.log(`\nNext Step: Copy seed_ops.sql contents and paste into Supabase SQL Editor and run.`);
}

main();
