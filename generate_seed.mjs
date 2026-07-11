import fs from 'fs';

const data = JSON.parse(fs.readFileSync('parsed_costing.json', 'utf8'));
let sql = `-- Seed data generated from Costing.xlsx\n\n`;

for (const menu of data) {
  if (!menu.code || !menu.name_en) continue;

  const menuId = `gen_random_uuid()`;
  
  // Upsert Menu
  sql += `
-- Menu: ${menu.name_en}
INSERT INTO operations.menus (code, name_en, name_mm, sales_prices, total_bill_of_materials)
VALUES ('${menu.code}', '${menu.name_en.replace(/'/g, "''")}', '${menu.name_mm.replace(/'/g, "''")}', ${menu.sales_prices || 0}, ${menu.total_bill_of_materials || 0})
ON CONFLICT (code) DO UPDATE SET 
  name_en = EXCLUDED.name_en, 
  name_mm = EXCLUDED.name_mm, 
  sales_prices = EXCLUDED.sales_prices,
  total_bill_of_materials = EXCLUDED.total_bill_of_materials;
`;

  for (const ing of menu.ingredients) {
    if (!ing.name) continue;
    const itemCode = `ITM-${ing.name.substring(0, 5).toUpperCase().replace(/[^A-Z0-9]/g, '')}-${Math.floor(Math.random()*10000)}`;
    const ingName = ing.name.replace(/'/g, "''");

    sql += `
-- Item: ${ingName}
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT '${itemCode}', '${ingName}', 'RAW_MATERIAL', '${ing.unit}', ${ing.cost_per_unit}, 0
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = '${ingName}')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = '${ingName}'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = '${menu.code}'), 
  (SELECT id FROM item_id_cte), 
  ${ing.qty}, 
  '${ing.unit}', 
  ${ing.total_cost}
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = '${menu.code}')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);
`;
  }
}

fs.writeFileSync('seed_menus.sql', sql);
console.log('Created seed_menus.sql');
