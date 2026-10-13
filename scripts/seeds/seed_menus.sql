-- Seed data generated from Costing.xlsx


-- Menu: Fried Beef with Bell Pepper
INSERT INTO operations.menus (code, name_en, name_mm, sales_prices, total_bill_of_materials)
VALUES ('FGB 0002', 'Fried Beef with Bell Pepper', 'အမဲငရုတ်ပွ + ထမင်း', 120, 397.51449999999994)
ON CONFLICT (code) DO UPDATE SET 
  name_en = EXCLUDED.name_en, 
  name_mm = EXCLUDED.name_mm, 
  sales_prices = EXCLUDED.sales_prices,
  total_bill_of_materials = EXCLUDED.total_bill_of_materials;

-- Item: Beef Lean
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-BEEF-18', 'Beef Lean', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Beef Lean')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Beef Lean'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.24534, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  100, 
  24.534
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Bell Pepper
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-BELL-8812', 'Bell Pepper', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Bell Pepper')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Bell Pepper'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.1, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  50, 
  5
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: King Rice Bran Oil 5 L
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-KING-9264', 'King Rice Bran Oil 5 L', 'RAW_MATERIAL', 'ml'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'King Rice Bran Oil 5 L')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'King Rice Bran Oil 5 L'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.047, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  15, 
  0.705
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Turmeric Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-TURME-9241', 'Turmeric Powder', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Turmeric Powder')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Turmeric Powder'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.276, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  2, 
  0.552
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chicken Seasoning Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-CHICK-4580', 'Chicken Seasoning Powder', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Chicken Seasoning Powder')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Chicken Seasoning Powder'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.07, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  5, 
  0.35000000000000003
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chili Colored Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-CHILI-366', 'Chili Colored Powder', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Chili Colored Powder')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Chili Colored Powder'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.3125, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  3, 
  0.9375
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Salt
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-SALT-5238', 'Salt', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Salt')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Salt'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.015, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  3, 
  0.045
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Garlic
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-GARLI-3212', 'Garlic', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Garlic')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Garlic'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.07, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  10, 
  0.7000000000000001
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Shallot
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-SHALL-6195', 'Shallot', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Shallot')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Shallot'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.038, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  30, 
  1.14
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Golden Mountain Soy Sauce
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-GOLDE-1063', 'Golden Mountain Soy Sauce', 'RAW_MATERIAL', 'ml'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Golden Mountain Soy Sauce')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Golden Mountain Soy Sauce'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.055, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  7, 
  0.385
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Pure Refined Sugar
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-PURE-1472', 'Pure Refined Sugar', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Pure Refined Sugar')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Pure Refined Sugar'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.027, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  3, 
  0.081
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Ginger
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-GINGE-6515', 'Ginger', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Ginger')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Ginger'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.04167, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  5, 
  0.20834999999999998
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Rice
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-RICE-6876', 'Rice', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Rice')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Rice'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.023, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  100, 
  2.3
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Grace(B002)(Rice Box / 2)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-GRACE-4596', 'Grace(B002)(Rice Box / 2)', 'RAW_MATERIAL', 'pcs'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Grace(B002)(Rice Box / 2)')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Grace(B002)(Rice Box / 2)'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 5.94, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  1, 
  5.94
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Pork Tenderloin
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-PORK-228', 'Pork Tenderloin', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Pork Tenderloin')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Pork Tenderloin'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.14152, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  100, 
  14.152000000000001
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Cauliflower
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-CAULI-5067', 'Cauliflower', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Cauliflower')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Cauliflower'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.03, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  50, 
  1.5
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: French Bean
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-FRENC-5247', 'French Bean', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'French Bean')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'French Bean'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.045, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  20, 
  0.8999999999999999
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Scallion / Spring Onion
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-SCALL-922', 'Scallion / Spring Onion', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Scallion / Spring Onion')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Scallion / Spring Onion'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.05, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  10, 
  0.5
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Carrot
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-CARRO-7436', 'Carrot', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Carrot')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Carrot'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.02188, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  20, 
  0.4376
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Ginger
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-GINGE-7115', 'Ginger', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Ginger')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Ginger'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.04167, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  5, 
  0.20834999999999998
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Garlic
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-GARLI-8448', 'Garlic', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Garlic')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Garlic'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.07, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  10, 
  0.7000000000000001
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Shallot
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-SHALL-9046', 'Shallot', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Shallot')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Shallot'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.038, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  30, 
  1.14
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Baby Corn
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-BABY-2690', 'Baby Corn', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Baby Corn')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Baby Corn'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.0625, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  20, 
  1.25
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Broccoli
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-BROCC-642', 'Broccoli', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Broccoli')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Broccoli'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.075, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  20, 
  1.5
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: King Rice Bran Oil 5 L
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-KING-3708', 'King Rice Bran Oil 5 L', 'RAW_MATERIAL', 'ml'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'King Rice Bran Oil 5 L')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'King Rice Bran Oil 5 L'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.047, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  15, 
  0.705
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Golden Mountain Soy Sauce
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-GOLDE-5129', 'Golden Mountain Soy Sauce', 'RAW_MATERIAL', 'ml'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Golden Mountain Soy Sauce')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Golden Mountain Soy Sauce'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.055, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  15, 
  0.825
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Healthy Boy Sweet Soy Sauce
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-HEALT-4583', 'Healthy Boy Sweet Soy Sauce', 'RAW_MATERIAL', 'ml'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Healthy Boy Sweet Soy Sauce')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Healthy Boy Sweet Soy Sauce'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.08857, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  7, 
  0.6199899999999999
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chicken Seasoning Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-CHICK-6836', 'Chicken Seasoning Powder', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Chicken Seasoning Powder')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Chicken Seasoning Powder'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.07, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  5, 
  0.35000000000000003
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Pure Refined Sugar
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-PURE-8178', 'Pure Refined Sugar', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Pure Refined Sugar')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Pure Refined Sugar'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.027, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  3, 
  0.081
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Black Pepper
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-BLACK-6257', 'Black Pepper', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Black Pepper')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Black Pepper'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.344, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  1, 
  0.344
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Dried Chili
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-DRIED-5252', 'Dried Chili', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Dried Chili')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Dried Chili'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.4, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  3, 
  1.2000000000000002
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Rice
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-RICE-8272', 'Rice', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Rice')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Rice'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.023, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  100, 
  2.3
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Grace(B002)(Rice Box / 2)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-GRACE-5414', 'Grace(B002)(Rice Box / 2)', 'RAW_MATERIAL', 'pcs'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Grace(B002)(Rice Box / 2)')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Grace(B002)(Rice Box / 2)'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 5.94, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  1, 
  5.94
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chicken Thigh
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-CHICK-741', 'Chicken Thigh', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Chicken Thigh')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Chicken Thigh'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.07813, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  100, 
  7.813000000000001
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Scallion / Spring Onion
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-SCALL-9893', 'Scallion / Spring Onion', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Scallion / Spring Onion')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Scallion / Spring Onion'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.05, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  5, 
  0.25
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Bell Pepper
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-BELL-9839', 'Bell Pepper', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Bell Pepper')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Bell Pepper'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.1, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  50, 
  5
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Garlic
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-GARLI-6934', 'Garlic', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Garlic')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Garlic'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.07, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  10, 
  0.7000000000000001
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Ginger
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-GINGE-2302', 'Ginger', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Ginger')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Ginger'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.04167, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  10, 
  0.41669999999999996
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Shallot
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-SHALL-6385', 'Shallot', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Shallot')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Shallot'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.038, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  30, 
  1.14
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chicken Seasoning Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-CHICK-3581', 'Chicken Seasoning Powder', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Chicken Seasoning Powder')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Chicken Seasoning Powder'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.07, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  5, 
  0.35000000000000003
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Dried Chili
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-DRIED-5783', 'Dried Chili', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Dried Chili')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Dried Chili'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.4, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  3, 
  1.2000000000000002
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Pure Refined Sugar
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-PURE-5970', 'Pure Refined Sugar', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Pure Refined Sugar')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Pure Refined Sugar'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.027, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  3, 
  0.081
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Black Pepper
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-BLACK-5659', 'Black Pepper', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Black Pepper')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Black Pepper'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.344, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  2, 
  0.688
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: King Rice Bran Oil 5 L
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-KING-6620', 'King Rice Bran Oil 5 L', 'RAW_MATERIAL', 'ml'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'King Rice Bran Oil 5 L')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'King Rice Bran Oil 5 L'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.047, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  15, 
  0.705
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Golden Mountain Soy Sauce
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-GOLDE-9035', 'Golden Mountain Soy Sauce', 'RAW_MATERIAL', 'ml'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Golden Mountain Soy Sauce')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Golden Mountain Soy Sauce'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.055, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  15, 
  0.825
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Healthy Boy Sweet Soy Sauce
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-HEALT-3569', 'Healthy Boy Sweet Soy Sauce', 'RAW_MATERIAL', 'ml'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Healthy Boy Sweet Soy Sauce')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Healthy Boy Sweet Soy Sauce'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.08857, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  7, 
  0.6199899999999999
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Rice
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-RICE-2122', 'Rice', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Rice')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Rice'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.023, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  100, 
  2.3
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Grace(B002)(Rice Box / 2)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-GRACE-9791', 'Grace(B002)(Rice Box / 2)', 'RAW_MATERIAL', 'pcs'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Grace(B002)(Rice Box / 2)')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Grace(B002)(Rice Box / 2)'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 5.94, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  1, 
  5.94
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Thin Pork Layer
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-THIN-1452', 'Thin Pork Layer', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Thin Pork Layer')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Thin Pork Layer'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.1305, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  100, 
  13.05
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Scallion / Spring Onion
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-SCALL-4893', 'Scallion / Spring Onion', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Scallion / Spring Onion')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Scallion / Spring Onion'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.05, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  30, 
  1.5
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: King Rice Bran Oil 5 L
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-KING-8781', 'King Rice Bran Oil 5 L', 'RAW_MATERIAL', 'ml'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'King Rice Bran Oil 5 L')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'King Rice Bran Oil 5 L'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.047, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  15, 
  0.705
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Garlic
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-GARLI-5245', 'Garlic', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Garlic')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Garlic'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.07, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  10, 
  0.7000000000000001
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Shallot
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-SHALL-4902', 'Shallot', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Shallot')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Shallot'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.038, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  30, 
  1.14
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Ginger
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-GINGE-7483', 'Ginger', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Ginger')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Ginger'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.04167, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  10, 
  0.41669999999999996
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chicken Seasoning Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-CHICK-5749', 'Chicken Seasoning Powder', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Chicken Seasoning Powder')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Chicken Seasoning Powder'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.07, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  5, 
  0.35000000000000003
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: White Pepper Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-WHITE-2001', 'White Pepper Powder', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'White Pepper Powder')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'White Pepper Powder'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.22857, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  5, 
  1.14285
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Golden Mountain Soy Sauce
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-GOLDE-2494', 'Golden Mountain Soy Sauce', 'RAW_MATERIAL', 'ml'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Golden Mountain Soy Sauce')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Golden Mountain Soy Sauce'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.055, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  7, 
  0.385
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Oyster Sauce
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-OYSTE-5277', 'Oyster Sauce', 'RAW_MATERIAL', 'ml'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Oyster Sauce')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Oyster Sauce'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.0712, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  7, 
  0.4984
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Healthy Boy Sweet Soy Sauce
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-HEALT-1956', 'Healthy Boy Sweet Soy Sauce', 'RAW_MATERIAL', 'ml'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Healthy Boy Sweet Soy Sauce')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Healthy Boy Sweet Soy Sauce'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.08857, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  4, 
  0.35428
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Rice
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-RICE-531', 'Rice', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Rice')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Rice'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.023, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  100, 
  2.3
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Grace(B002)(Rice Box / 2)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-GRACE-8264', 'Grace(B002)(Rice Box / 2)', 'RAW_MATERIAL', 'pcs'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Grace(B002)(Rice Box / 2)')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Grace(B002)(Rice Box / 2)'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 5.94, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  1, 
  5.94
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Shrimp
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-SHRIM-758', 'Shrimp', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Shrimp')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Shrimp'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.22667, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  100, 
  22.667
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Bell Pepper
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-BELL-821', 'Bell Pepper', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Bell Pepper')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Bell Pepper'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.1, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  50, 
  5
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Garlic
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-GARLI-7283', 'Garlic', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Garlic')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Garlic'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.07, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  10, 
  0.7000000000000001
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Ginger
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-GINGE-5267', 'Ginger', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Ginger')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Ginger'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.04167, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  10, 
  0.41669999999999996
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Shallot
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-SHALL-6526', 'Shallot', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Shallot')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Shallot'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.038, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  30, 
  1.14
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Scallion / Spring Onion
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-SCALL-5072', 'Scallion / Spring Onion', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Scallion / Spring Onion')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Scallion / Spring Onion'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.05, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  10, 
  0.5
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: King Rice Bran Oil 5 L
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-KING-5090', 'King Rice Bran Oil 5 L', 'RAW_MATERIAL', 'ml'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'King Rice Bran Oil 5 L')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'King Rice Bran Oil 5 L'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.047, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  15, 
  0.705
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chicken Seasoning Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-CHICK-2465', 'Chicken Seasoning Powder', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Chicken Seasoning Powder')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Chicken Seasoning Powder'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.07, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  5, 
  0.35000000000000003
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Pure Refined Sugar
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-PURE-4344', 'Pure Refined Sugar', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Pure Refined Sugar')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Pure Refined Sugar'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.027, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  3, 
  0.081
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Golden Mountain Soy Sauce
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-GOLDE-1501', 'Golden Mountain Soy Sauce', 'RAW_MATERIAL', 'ml'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Golden Mountain Soy Sauce')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Golden Mountain Soy Sauce'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.055, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  15, 
  0.825
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Healthy Boy Sweet Soy Sauce
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-HEALT-8826', 'Healthy Boy Sweet Soy Sauce', 'RAW_MATERIAL', 'ml'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Healthy Boy Sweet Soy Sauce')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Healthy Boy Sweet Soy Sauce'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.08857, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  7, 
  0.6199899999999999
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Black Pepper
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-BLACK-5689', 'Black Pepper', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Black Pepper')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Black Pepper'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.344, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  3, 
  1.032
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Dried Chili
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-DRIED-1670', 'Dried Chili', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Dried Chili')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Dried Chili'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.4, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  3, 
  1.2000000000000002
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Rice
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-RICE-9928', 'Rice', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Rice')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Rice'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.023, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  100, 
  2.3
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Grace(B002)(Rice Box / 2)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-GRACE-4228', 'Grace(B002)(Rice Box / 2)', 'RAW_MATERIAL', 'pcs'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Grace(B002)(Rice Box / 2)')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Grace(B002)(Rice Box / 2)'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 5.94, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  1, 
  5.94
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Pork Tenderloin
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-PORK-7986', 'Pork Tenderloin', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Pork Tenderloin')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Pork Tenderloin'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.14152, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  150, 
  21.228
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Thai Fragrant Rice
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-THAI-5772', 'Thai Fragrant Rice', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Thai Fragrant Rice')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Thai Fragrant Rice'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.023, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  140, 
  3.2199999999999998
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Carrot
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-CARRO-7652', 'Carrot', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Carrot')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Carrot'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.02188, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  20, 
  0.4376
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Baby Corn
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-BABY-9255', 'Baby Corn', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Baby Corn')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Baby Corn'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.0625, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  20, 
  1.25
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Cabbage (White Cabbage)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-CABBA-364', 'Cabbage (White Cabbage)', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Cabbage (White Cabbage)')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Cabbage (White Cabbage)'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.035, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  20, 
  0.7000000000000001
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Cauliflower
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-CAULI-8768', 'Cauliflower', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Cauliflower')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Cauliflower'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.03, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  20, 
  0.6
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Garlic
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-GARLI-3556', 'Garlic', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Garlic')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Garlic'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.07, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  5, 
  0.35000000000000003
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Corn powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-CORN-2766', 'Corn powder', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Corn powder')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Corn powder'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.1, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  7, 
  0.7000000000000001
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Quail egg
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-QUAIL-3217', 'Quail egg', 'RAW_MATERIAL', 'pcs'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Quail egg')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Quail egg'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 1.14, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  2, 
  2.28
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Snow Pear
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-SNOW-9448', 'Snow Pear', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Snow Pear')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Snow Pear'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.079, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  20, 
  1.58
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Rice
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-RICE-1804', 'Rice', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Rice')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Rice'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.023, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  100, 
  2.3
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: JH-PSB-12B(Rice Box)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-JHPS-6979', 'JH-PSB-12B(Rice Box)', 'RAW_MATERIAL', 'pcs'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'JH-PSB-12B(Rice Box)')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'JH-PSB-12B(Rice Box)'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 5.52, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  1, 
  5.52
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Squid Ring
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-SQUID-7832', 'Squid Ring', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Squid Ring')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Squid Ring'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.155, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  100, 
  15.5
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Bell Pepper
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-BELL-926', 'Bell Pepper', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Bell Pepper')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Bell Pepper'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.1, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  50, 
  5
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: King Rice Bran Oil 5 L
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-KING-8647', 'King Rice Bran Oil 5 L', 'RAW_MATERIAL', 'ml'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'King Rice Bran Oil 5 L')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'King Rice Bran Oil 5 L'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.047, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  15, 
  0.705
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Garlic
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-GARLI-1415', 'Garlic', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Garlic')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Garlic'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.07, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  10, 
  0.7000000000000001
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Ginger
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-GINGE-8495', 'Ginger', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Ginger')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Ginger'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.04167, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  10, 
  0.41669999999999996
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Oyster Sauce
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-OYSTE-9961', 'Oyster Sauce', 'RAW_MATERIAL', 'ml'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Oyster Sauce')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Oyster Sauce'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.0712, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  7, 
  0.4984
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Healthy Boy Sweet Soy Sauce
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-HEALT-7212', 'Healthy Boy Sweet Soy Sauce', 'RAW_MATERIAL', 'ml'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Healthy Boy Sweet Soy Sauce')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Healthy Boy Sweet Soy Sauce'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.08857, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  5, 
  0.44284999999999997
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Scallion / Spring Onion
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-SCALL-8022', 'Scallion / Spring Onion', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Scallion / Spring Onion')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Scallion / Spring Onion'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.05, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  10, 
  0.5
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Rice
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-RICE-8918', 'Rice', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Rice')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Rice'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.023, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  100, 
  2.3
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Grace(B002)(Rice Box / 2)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-GRACE-115', 'Grace(B002)(Rice Box / 2)', 'RAW_MATERIAL', 'pcs'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Grace(B002)(Rice Box / 2)')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Grace(B002)(Rice Box / 2)'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 5.94, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  1, 
  5.94
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Squid Ring
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-SQUID-6212', 'Squid Ring', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Squid Ring')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Squid Ring'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.155, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  100, 
  15.5
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Scallion / Spring Onion
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-SCALL-9143', 'Scallion / Spring Onion', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Scallion / Spring Onion')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Scallion / Spring Onion'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.05, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  20, 
  1
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Green Chili
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-GREEN-6914', 'Green Chili', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Green Chili')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Green Chili'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.16, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  15, 
  2.4
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Ginger
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-GINGE-1784', 'Ginger', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Ginger')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Ginger'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.04167, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  10, 
  0.41669999999999996
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Garlic
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-GARLI-8175', 'Garlic', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Garlic')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Garlic'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.07, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  10, 
  0.7000000000000001
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Shallot
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-SHALL-7766', 'Shallot', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Shallot')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Shallot'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.038, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  30, 
  1.14
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: King Rice Bran Oil 5 L
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-KING-5503', 'King Rice Bran Oil 5 L', 'RAW_MATERIAL', 'ml'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'King Rice Bran Oil 5 L')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'King Rice Bran Oil 5 L'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.047, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  15, 
  0.705
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Salt
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-SALT-3242', 'Salt', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Salt')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Salt'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.015, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  3, 
  0.045
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chicken Seasoning Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-CHICK-4812', 'Chicken Seasoning Powder', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Chicken Seasoning Powder')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Chicken Seasoning Powder'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.07, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  5, 
  0.35000000000000003
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chili Colored Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-CHILI-6996', 'Chili Colored Powder', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Chili Colored Powder')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Chili Colored Powder'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.3125, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  3, 
  0.9375
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Turmeric Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-TURME-2760', 'Turmeric Powder', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Turmeric Powder')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Turmeric Powder'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.276, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  2, 
  0.552
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Rice
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-RICE-8299', 'Rice', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Rice')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Rice'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.023, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  100, 
  2.3
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Grace(B002)(Rice Box / 2)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-GRACE-5368', 'Grace(B002)(Rice Box / 2)', 'RAW_MATERIAL', 'pcs'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Grace(B002)(Rice Box / 2)')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Grace(B002)(Rice Box / 2)'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 5.94, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  1, 
  5.94
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Pork Tenderloin
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-PORK-905', 'Pork Tenderloin', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Pork Tenderloin')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Pork Tenderloin'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.14152, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  100, 
  14.152000000000001
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Carrot
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-CARRO-3565', 'Carrot', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Carrot')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Carrot'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.02188, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  30, 
  0.6564
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Bell Pepper
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-BELL-3600', 'Bell Pepper', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Bell Pepper')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Bell Pepper'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.1, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  30, 
  3
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Snow Pear
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-SNOW-7481', 'Snow Pear', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Snow Pear')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Snow Pear'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.079, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  30, 
  2.37
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Shallot
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-SHALL-5729', 'Shallot', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Shallot')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Shallot'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.038, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  30, 
  1.14
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Garlic
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-GARLI-7075', 'Garlic', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Garlic')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Garlic'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.07, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  10, 
  0.7000000000000001
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Ginger
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-GINGE-5918', 'Ginger', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Ginger')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Ginger'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.04167, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  10, 
  0.41669999999999996
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Baby Corn
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-BABY-6860', 'Baby Corn', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Baby Corn')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Baby Corn'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.0625, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  20, 
  1.25
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: King Rice Bran Oil 5 L
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-KING-804', 'King Rice Bran Oil 5 L', 'RAW_MATERIAL', 'ml'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'King Rice Bran Oil 5 L')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'King Rice Bran Oil 5 L'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.047, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  15, 
  0.705
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Salt
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-SALT-3798', 'Salt', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Salt')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Salt'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.015, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  5, 
  0.075
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chicken Seasoning Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-CHICK-8130', 'Chicken Seasoning Powder', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Chicken Seasoning Powder')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Chicken Seasoning Powder'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.07, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  5, 
  0.35000000000000003
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Tomato
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-TOMAT-438', 'Tomato', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Tomato')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Tomato'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.03, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  30, 
  0.8999999999999999
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Golden Mountain Soy Sauce
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-GOLDE-235', 'Golden Mountain Soy Sauce', 'RAW_MATERIAL', 'ml'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Golden Mountain Soy Sauce')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Golden Mountain Soy Sauce'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.055, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  7, 
  0.385
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Oyster Sauce
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-OYSTE-3571', 'Oyster Sauce', 'RAW_MATERIAL', 'ml'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Oyster Sauce')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Oyster Sauce'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.0712, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  7, 
  0.4984
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chili Sauce
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-CHILI-809', 'Chili Sauce', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Chili Sauce')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Chili Sauce'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.0589, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  50, 
  2.945
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Corn powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-CORN-4934', 'Corn powder', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Corn powder')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Corn powder'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.1, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  10, 
  1
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Vinegar
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-VINEG-4781', 'Vinegar', 'RAW_MATERIAL', 'ml'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Vinegar')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Vinegar'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.03, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  7, 
  0.21
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Pure Refined Sugar
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-PURE-2247', 'Pure Refined Sugar', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Pure Refined Sugar')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Pure Refined Sugar'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.027, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  5, 
  0.135
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Rice
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-RICE-6185', 'Rice', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Rice')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Rice'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.023, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  100, 
  2.3
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Grace(B002)(Rice Box / 2)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-GRACE-8973', 'Grace(B002)(Rice Box / 2)', 'RAW_MATERIAL', 'pcs'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Grace(B002)(Rice Box / 2)')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Grace(B002)(Rice Box / 2)'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 5.94, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  1, 
  5.94
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Fish cake
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-FISH-263', 'Fish cake', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Fish cake')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Fish cake'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.19, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  100, 
  19
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Cabbage
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-CABBA-2817', 'Cabbage', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Cabbage')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Cabbage'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.027, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  30, 
  0.8099999999999999
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Shallot
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-SHALL-2386', 'Shallot', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Shallot')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Shallot'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.038, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  20, 
  0.76
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Garlic
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-GARLI-2143', 'Garlic', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Garlic')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Garlic'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.07, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  10, 
  0.7000000000000001
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Ginger
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-GINGE-8761', 'Ginger', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Ginger')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Ginger'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.04167, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  5, 
  0.20834999999999998
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Green Chili
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-GREEN-6994', 'Green Chili', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Green Chili')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Green Chili'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.16, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  10, 
  1.6
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: King Rice Bran Oil 5 L
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-KING-6297', 'King Rice Bran Oil 5 L', 'RAW_MATERIAL', 'ml'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'King Rice Bran Oil 5 L')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'King Rice Bran Oil 5 L'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.047, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  7, 
  0.329
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chicken Seasoning Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-CHICK-9869', 'Chicken Seasoning Powder', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Chicken Seasoning Powder')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Chicken Seasoning Powder'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.07, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  5, 
  0.35000000000000003
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Fish Sauce
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-FISH-2810', 'Fish Sauce', 'RAW_MATERIAL', 'ml'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Fish Sauce')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Fish Sauce'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.0414, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  5, 
  0.207
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Lime Juice
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-LIME-1472', 'Lime Juice', 'RAW_MATERIAL', 'ml'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Lime Juice')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Lime Juice'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.025, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  7, 
  0.17500000000000002
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Turmeric Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-TURME-4876', 'Turmeric Powder', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Turmeric Powder')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Turmeric Powder'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.276, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  2, 
  0.552
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Tomato
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-TOMAT-3063', 'Tomato', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Tomato')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Tomato'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.03, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  20, 
  0.6
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Rice
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-RICE-1210', 'Rice', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Rice')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Rice'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.023, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  100, 
  2.3
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Grace(B002)(Rice Box / 2)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-GRACE-7201', 'Grace(B002)(Rice Box / 2)', 'RAW_MATERIAL', 'pcs'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Grace(B002)(Rice Box / 2)')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Grace(B002)(Rice Box / 2)'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 5.94, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  1, 
  5.94
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Shrimp
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-SHRIM-4195', 'Shrimp', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Shrimp')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Shrimp'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.22667, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  100, 
  22.667
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Green Chili
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-GREEN-3819', 'Green Chili', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Green Chili')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Green Chili'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.16, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  50, 
  8
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Turmeric Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-TURME-6814', 'Turmeric Powder', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Turmeric Powder')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Turmeric Powder'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.276, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  2, 
  0.552
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chili Colored Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-CHILI-4960', 'Chili Colored Powder', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Chili Colored Powder')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Chili Colored Powder'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.3125, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  3, 
  0.9375
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Salt
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-SALT-2284', 'Salt', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Salt')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Salt'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.015, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  2, 
  0.03
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: King Rice Bran Oil 5 L
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-KING-6259', 'King Rice Bran Oil 5 L', 'RAW_MATERIAL', 'ml'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'King Rice Bran Oil 5 L')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'King Rice Bran Oil 5 L'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.047, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  15, 
  0.705
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Shallot
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-SHALL-6488', 'Shallot', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Shallot')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Shallot'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.038, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  30, 
  1.14
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Garlic
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-GARLI-7057', 'Garlic', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Garlic')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Garlic'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.07, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  10, 
  0.7000000000000001
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chicken Seasoning Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-CHICK-4143', 'Chicken Seasoning Powder', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Chicken Seasoning Powder')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Chicken Seasoning Powder'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.07, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  3, 
  0.21000000000000002
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: OverHead Cost
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-OVERH-4990', 'OverHead Cost', 'RAW_MATERIAL', ''
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'OverHead Cost')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'OverHead Cost'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  1, 
  0
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Rice
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-RICE-5775', 'Rice', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Rice')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Rice'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.023, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  100, 
  2.3
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Grace(B002)(Rice Box / 2)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-GRACE-1940', 'Grace(B002)(Rice Box / 2)', 'RAW_MATERIAL', 'pcs'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Grace(B002)(Rice Box / 2)')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Grace(B002)(Rice Box / 2)'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 5.94, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  1, 
  5.94
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Menu: Wa Ou Noddle
INSERT INTO operations.menus (code, name_en, name_mm, sales_prices, total_bill_of_materials)
VALUES ('FGN 0001', 'Wa Ou Noddle', 'ဝဥခေါက်ဆွဲ', 110, 204.88393000000008)
ON CONFLICT (code) DO UPDATE SET 
  name_en = EXCLUDED.name_en, 
  name_mm = EXCLUDED.name_mm, 
  sales_prices = EXCLUDED.sales_prices,
  total_bill_of_materials = EXCLUDED.total_bill_of_materials;

-- Item: Wa-Ooh Noodle
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-WAOO-415', 'Wa-Ooh Noodle', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Wa-Ooh Noodle')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Wa-Ooh Noodle'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.09, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  100, 
  9
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Peanut Butter
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-PEANU-1344', 'Peanut Butter', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Peanut Butter')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Peanut Butter'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.285, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  15, 
  4.2749999999999995
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chinese Kale
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-CHINE-7915', 'Chinese Kale', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Chinese Kale')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Chinese Kale'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.04167, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  20, 
  0.8333999999999999
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Mala Paste
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-MALA-2054', 'Mala Paste', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Mala Paste')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Mala Paste'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.1, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  30, 
  3
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Pork Soup Bone
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-PORK-2293', 'Pork Soup Bone', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Pork Soup Bone')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Pork Soup Bone'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.049, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  50, 
  2.45
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Salt
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-SALT-8028', 'Salt', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Salt')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Salt'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.015, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  2, 
  0.03
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Pure Refined Sugar
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-PURE-5779', 'Pure Refined Sugar', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Pure Refined Sugar')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Pure Refined Sugar'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.027, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  5, 
  0.135
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chicken Seasoning Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-CHICK-4017', 'Chicken Seasoning Powder', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Chicken Seasoning Powder')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Chicken Seasoning Powder'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.07, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  5, 
  0.35000000000000003
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Vinegar
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-VINEG-6768', 'Vinegar', 'RAW_MATERIAL', 'ml'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Vinegar')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Vinegar'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.03, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  15, 
  0.44999999999999996
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Ginger
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-GINGE-9010', 'Ginger', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Ginger')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Ginger'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.04167, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  5, 
  0.20834999999999998
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Pork Ball
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-PORK-2589', 'Pork Ball', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Pork Ball')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Pork Ball'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.135, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  70, 
  9.450000000000001
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Golden Mountain Soy Sauce
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-GOLDE-6510', 'Golden Mountain Soy Sauce', 'RAW_MATERIAL', 'ml'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Golden Mountain Soy Sauce')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Golden Mountain Soy Sauce'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.055, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  7, 
  0.385
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: JH-PSB-12B(Rice Box)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-JHPS-9799', 'JH-PSB-12B(Rice Box)', 'RAW_MATERIAL', 'pcs'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'JH-PSB-12B(Rice Box)')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'JH-PSB-12B(Rice Box)'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 5.52, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  1, 
  5.52
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: JH-PSB-26B/Big(Soup Box)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-JHPS-1507', 'JH-PSB-26B/Big(Soup Box)', 'RAW_MATERIAL', 'pcs'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'JH-PSB-26B/Big(Soup Box)')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'JH-PSB-26B/Big(Soup Box)'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 7.12, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  1, 
  7.12
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chicken Thigh
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-CHICK-1530', 'Chicken Thigh', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Chicken Thigh')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Chicken Thigh'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.07813, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  100, 
  7.813000000000001
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Wheat Noodle
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-WHEAT-2142', 'Wheat Noodle', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Wheat Noodle')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Wheat Noodle'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.068, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  50, 
  3.4000000000000004
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Carrot
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-CARRO-8939', 'Carrot', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Carrot')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Carrot'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.02188, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  20, 
  0.4376
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Scallion / Spring Onion
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-SCALL-3297', 'Scallion / Spring Onion', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Scallion / Spring Onion')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Scallion / Spring Onion'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.05, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  10, 
  0.5
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Cabbage
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-CABBA-1046', 'Cabbage', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Cabbage')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Cabbage'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.027, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  30, 
  0.8099999999999999
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chinese Celery
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-CHINE-8270', 'Chinese Celery', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Chinese Celery')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Chinese Celery'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.03, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  10, 
  0.3
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Garlic
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-GARLI-4299', 'Garlic', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Garlic')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Garlic'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.07, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  10, 
  0.7000000000000001
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Shallot
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-SHALL-2322', 'Shallot', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Shallot')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Shallot'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.038, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  30, 
  1.14
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Asparagus bean(Long Beans)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-ASPAR-9223', 'Asparagus bean(Long Beans)', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Asparagus bean(Long Beans)')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Asparagus bean(Long Beans)'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.03, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  20, 
  0.6
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: King Rice Bran Oil 5 L
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-KING-775', 'King Rice Bran Oil 5 L', 'RAW_MATERIAL', 'ml'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'King Rice Bran Oil 5 L')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'King Rice Bran Oil 5 L'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.047, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  15, 
  0.705
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Golden Mountain Soy Sauce
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-GOLDE-3815', 'Golden Mountain Soy Sauce', 'RAW_MATERIAL', 'ml'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Golden Mountain Soy Sauce')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Golden Mountain Soy Sauce'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.055, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  15, 
  0.825
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Healthy Boy Sweet Soy Sauce
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-HEALT-5178', 'Healthy Boy Sweet Soy Sauce', 'RAW_MATERIAL', 'ml'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Healthy Boy Sweet Soy Sauce')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Healthy Boy Sweet Soy Sauce'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.08857, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  7, 
  0.6199899999999999
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chicken Seasoning Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-CHICK-2400', 'Chicken Seasoning Powder', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Chicken Seasoning Powder')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Chicken Seasoning Powder'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.07, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  5, 
  0.35000000000000003
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Salt
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-SALT-3691', 'Salt', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Salt')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Salt'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.015, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  3, 
  0.045
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Pure Refined Sugar
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-PURE-9018', 'Pure Refined Sugar', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Pure Refined Sugar')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Pure Refined Sugar'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.027, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  5, 
  0.135
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Black Pepper
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-BLACK-1012', 'Black Pepper', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Black Pepper')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Black Pepper'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.344, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  2, 
  0.688
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: JH-PSB-12B(Rice Box)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-JHPS-3076', 'JH-PSB-12B(Rice Box)', 'RAW_MATERIAL', 'pcs'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'JH-PSB-12B(Rice Box)')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'JH-PSB-12B(Rice Box)'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 5.52, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  1, 
  5.52
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Rice Vermicelli Small
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-RICE-4041', 'Rice Vermicelli Small', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Rice Vermicelli Small')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Rice Vermicelli Small'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.06528, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  50, 
  3.2640000000000002
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chicken Thigh
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-CHICK-501', 'Chicken Thigh', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Chicken Thigh')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Chicken Thigh'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.07813, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  100, 
  7.813000000000001
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Carrot
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-CARRO-3585', 'Carrot', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Carrot')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Carrot'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.02188, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  20, 
  0.4376
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Cabbage
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-CABBA-652', 'Cabbage', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Cabbage')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Cabbage'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.027, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  30, 
  0.8099999999999999
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Asparagus bean(Long Beans)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-ASPAR-4411', 'Asparagus bean(Long Beans)', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Asparagus bean(Long Beans)')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Asparagus bean(Long Beans)'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.03, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  20, 
  0.6
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Salt
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-SALT-810', 'Salt', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Salt')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Salt'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.015, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  3, 
  0.045
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chicken Seasoning Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-CHICK-4580', 'Chicken Seasoning Powder', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Chicken Seasoning Powder')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Chicken Seasoning Powder'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.07, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  5, 
  0.35000000000000003
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Pure Refined Sugar
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-PURE-2162', 'Pure Refined Sugar', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Pure Refined Sugar')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Pure Refined Sugar'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.027, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  5, 
  0.135
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Golden Mountain Soy Sauce
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-GOLDE-8630', 'Golden Mountain Soy Sauce', 'RAW_MATERIAL', 'ml'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Golden Mountain Soy Sauce')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Golden Mountain Soy Sauce'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.055, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  15, 
  0.825
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Healthy Boy Sweet Soy Sauce
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-HEALT-8114', 'Healthy Boy Sweet Soy Sauce', 'RAW_MATERIAL', 'ml'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Healthy Boy Sweet Soy Sauce')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Healthy Boy Sweet Soy Sauce'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.08857, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  7, 
  0.6199899999999999
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Oyster Sauce
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-OYSTE-3570', 'Oyster Sauce', 'RAW_MATERIAL', 'ml'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Oyster Sauce')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Oyster Sauce'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.0712, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  7, 
  0.4984
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: King Rice Bran Oil 5 L
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-KING-6453', 'King Rice Bran Oil 5 L', 'RAW_MATERIAL', 'ml'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'King Rice Bran Oil 5 L')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'King Rice Bran Oil 5 L'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.047, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  15, 
  0.705
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Black Pepper
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-BLACK-7282', 'Black Pepper', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Black Pepper')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Black Pepper'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.344, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  3, 
  1.032
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Garlic
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-GARLI-278', 'Garlic', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Garlic')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Garlic'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.07, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  10, 
  0.7000000000000001
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Shallot
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-SHALL-7903', 'Shallot', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Shallot')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Shallot'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.038, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  30, 
  1.14
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: JH-PSB-12B(Rice Box)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-JHPS-8857', 'JH-PSB-12B(Rice Box)', 'RAW_MATERIAL', 'pcs'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'JH-PSB-12B(Rice Box)')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'JH-PSB-12B(Rice Box)'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 5.52, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  1, 
  5.52
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Pork Ball
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-PORK-5983', 'Pork Ball', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Pork Ball')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Pork Ball'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.135, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  70, 
  9.450000000000001
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Rice Vermicelli Small
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-RICE-2777', 'Rice Vermicelli Small', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Rice Vermicelli Small')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Rice Vermicelli Small'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.06528, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  50, 
  3.2640000000000002
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Pork Soup Bone
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-PORK-5861', 'Pork Soup Bone', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Pork Soup Bone')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Pork Soup Bone'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.049, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  50, 
  2.45
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chinese Kale
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-CHINE-7450', 'Chinese Kale', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Chinese Kale')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Chinese Kale'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.04167, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  50, 
  2.0835
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Salt
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-SALT-3869', 'Salt', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Salt')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Salt'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.015, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  5, 
  0.075
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chicken Seasoning Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-CHICK-3616', 'Chicken Seasoning Powder', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Chicken Seasoning Powder')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Chicken Seasoning Powder'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.07, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  5, 
  0.35000000000000003
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Pure Refined Sugar
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-PURE-9696', 'Pure Refined Sugar', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Pure Refined Sugar')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Pure Refined Sugar'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.027, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  5, 
  0.135
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Golden Mountain Soy Sauce
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-GOLDE-3309', 'Golden Mountain Soy Sauce', 'RAW_MATERIAL', 'ml'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Golden Mountain Soy Sauce')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Golden Mountain Soy Sauce'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.055, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  7, 
  0.385
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: JH-PSB-12B(Rice Box)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-JHPS-9314', 'JH-PSB-12B(Rice Box)', 'RAW_MATERIAL', 'pcs'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'JH-PSB-12B(Rice Box)')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'JH-PSB-12B(Rice Box)'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 5.52, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  1, 
  5.52
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: JH-PSB-26B/Big(Soup Box)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-JHPS-2607', 'JH-PSB-26B/Big(Soup Box)', 'RAW_MATERIAL', 'pcs'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'JH-PSB-26B/Big(Soup Box)')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'JH-PSB-26B/Big(Soup Box)'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 7.12, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  1, 
  7.12
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: JH-PSB-2B(Sauce Box)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-JHPS-5095', 'JH-PSB-2B(Sauce Box)', 'RAW_MATERIAL', 'pcs'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'JH-PSB-2B(Sauce Box)')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'JH-PSB-2B(Sauce Box)'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 2.33, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  1, 
  2.33
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Bean Vermicelli
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-BEAN-4348', 'Bean Vermicelli', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Bean Vermicelli')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Bean Vermicelli'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.2125, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  40, 
  8.5
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Shrimp
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-SHRIM-5476', 'Shrimp', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Shrimp')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Shrimp'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.22667, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  50, 
  11.3335
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Carrot
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-CARRO-4016', 'Carrot', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Carrot')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Carrot'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.02188, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  20, 
  0.4376
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chicken Seasoning Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-CHICK-9955', 'Chicken Seasoning Powder', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Chicken Seasoning Powder')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Chicken Seasoning Powder'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.07, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  5, 
  0.35000000000000003
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Tamarind Juice
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-TAMAR-7358', 'Tamarind Juice', 'RAW_MATERIAL', 'ml'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Tamarind Juice')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Tamarind Juice'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  7, 
  0
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Fish Sauce
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-FISH-7900', 'Fish Sauce', 'RAW_MATERIAL', 'ml'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Fish Sauce')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Fish Sauce'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.0414, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  7, 
  0.2898
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: JH-PSB-12B(Rice Box)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-JHPS-4220', 'JH-PSB-12B(Rice Box)', 'RAW_MATERIAL', 'pcs'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'JH-PSB-12B(Rice Box)')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'JH-PSB-12B(Rice Box)'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 5.52, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  1, 
  5.52
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: DK 082  / 16B ( Soup Box )
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-DK08-7391', 'DK 082  / 16B ( Soup Box )', 'RAW_MATERIAL', 'pcs'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'DK 082  / 16B ( Soup Box )')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'DK 082  / 16B ( Soup Box )'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 7.12, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  1, 
  6
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: JH-PSB-2B(Sauce Box)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-JHPS-878', 'JH-PSB-2B(Sauce Box)', 'RAW_MATERIAL', 'pcs'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'JH-PSB-2B(Sauce Box)')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'JH-PSB-2B(Sauce Box)'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 2.33, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  1, 
  2.33
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Pork Tenderloin
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-PORK-2052', 'Pork Tenderloin', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Pork Tenderloin')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Pork Tenderloin'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.14152, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  70, 
  9.9064
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Rice Noodle
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-RICE-5386', 'Rice Noodle', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Rice Noodle')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Rice Noodle'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.08, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  50, 
  4
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Wa-Ooh Noodle
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-WAOO-2116', 'Wa-Ooh Noodle', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Wa-Ooh Noodle')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Wa-Ooh Noodle'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.09, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  20, 
  1.7999999999999998
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Carrot
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-CARRO-6153', 'Carrot', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Carrot')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Carrot'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.02188, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  10, 
  0.2188
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Cauliflower
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-CAULI-6367', 'Cauliflower', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Cauliflower')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Cauliflower'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.03, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  10, 
  0.3
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Baby Corn
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-BABY-9904', 'Baby Corn', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Baby Corn')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Baby Corn'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.0625, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  10, 
  0.625
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Bok Choy
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-BOKC-4667', 'Bok Choy', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Bok Choy')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Bok Choy'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.11, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  10, 
  1.1
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Quail egg
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-QUAIL-4110', 'Quail egg', 'RAW_MATERIAL', 'pcs'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Quail egg')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Quail egg'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 1.14, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  2, 
  2.28
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Mala Paste
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-MALA-5968', 'Mala Paste', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Mala Paste')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Mala Paste'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.1, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  20, 
  2
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chicken Seasoning Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-CHICK-9952', 'Chicken Seasoning Powder', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Chicken Seasoning Powder')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Chicken Seasoning Powder'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.07, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  5, 
  0.35000000000000003
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: JH-PSB-26B/Big(Soup Box)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-JHPS-8466', 'JH-PSB-26B/Big(Soup Box)', 'RAW_MATERIAL', 'pcs'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'JH-PSB-26B/Big(Soup Box)')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'JH-PSB-26B/Big(Soup Box)'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 7.12, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  1, 
  7.12
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: JH-PSB-12B(Rice Box)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-JHPS-8999', 'JH-PSB-12B(Rice Box)', 'RAW_MATERIAL', 'pcs'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'JH-PSB-12B(Rice Box)')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'JH-PSB-12B(Rice Box)'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 5.52, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  1, 
  5.52
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: DK 082  / 16B ( Soup Box )
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-DK08-463', 'DK 082  / 16B ( Soup Box )', 'RAW_MATERIAL', 'pcs'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'DK 082  / 16B ( Soup Box )')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'DK 082  / 16B ( Soup Box )'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 7.12, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  1, 
  7.12
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: JH-PSB-2B(Sauce Box)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-JHPS-9987', 'JH-PSB-2B(Sauce Box)', 'RAW_MATERIAL', 'pcs'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'JH-PSB-2B(Sauce Box)')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'JH-PSB-2B(Sauce Box)'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 2.33, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  1, 
  2.33
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Menu: Fried Mixed Vegetables
INSERT INTO operations.menus (code, name_en, name_mm, sales_prices, total_bill_of_materials)
VALUES ('FGV 0023', 'Fried Mixed Vegetables', 'အစိမ်းကြော်', 45, 122.89459999999997)
ON CONFLICT (code) DO UPDATE SET 
  name_en = EXCLUDED.name_en, 
  name_mm = EXCLUDED.name_mm, 
  sales_prices = EXCLUDED.sales_prices,
  total_bill_of_materials = EXCLUDED.total_bill_of_materials;

-- Item: Carrot
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-CARRO-804', 'Carrot', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Carrot')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Carrot'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.02188, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  30, 
  0.6564
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Cabbage
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-CABBA-4805', 'Cabbage', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Cabbage')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Cabbage'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.027, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  100, 
  2.7
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Cauliflower
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-CAULI-1602', 'Cauliflower', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Cauliflower')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Cauliflower'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.03, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  30, 
  0.8999999999999999
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Baby Corn
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-BABY-5772', 'Baby Corn', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Baby Corn')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Baby Corn'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.0625, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  20, 
  1.25
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Tomato
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-TOMAT-3152', 'Tomato', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Tomato')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Tomato'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.03, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  10, 
  0.3
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Garlic
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-GARLI-6032', 'Garlic', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Garlic')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Garlic'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.07, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  10, 
  0.7000000000000001
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Shallot
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-SHALL-6016', 'Shallot', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Shallot')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Shallot'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.038, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  30, 
  1.14
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: King Rice Bran Oil 5 L
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-KING-9381', 'King Rice Bran Oil 5 L', 'RAW_MATERIAL', 'ml'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'King Rice Bran Oil 5 L')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'King Rice Bran Oil 5 L'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.047, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  15, 
  0.705
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Salt
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-SALT-2266', 'Salt', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Salt')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Salt'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.015, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  5, 
  0.075
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chicken Seasoning Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-CHICK-5906', 'Chicken Seasoning Powder', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Chicken Seasoning Powder')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Chicken Seasoning Powder'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.07, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  7, 
  0.49000000000000005
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Pure Refined Sugar
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-PURE-9534', 'Pure Refined Sugar', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Pure Refined Sugar')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Pure Refined Sugar'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.027, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  3, 
  0.081
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Golden Mountain Soy Sauce
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-GOLDE-3491', 'Golden Mountain Soy Sauce', 'RAW_MATERIAL', 'ml'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Golden Mountain Soy Sauce')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Golden Mountain Soy Sauce'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.055, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  7, 
  0.385
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Oyster Sauce
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-OYSTE-6896', 'Oyster Sauce', 'RAW_MATERIAL', 'ml'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Oyster Sauce')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Oyster Sauce'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.0712, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  7, 
  0.4984
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: JH-PSB-12B(Side Dish Box)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-JHPS-9375', 'JH-PSB-12B(Side Dish Box)', 'RAW_MATERIAL', 'pcs'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'JH-PSB-12B(Side Dish Box)')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'JH-PSB-12B(Side Dish Box)'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 5.52, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  1, 
  5.52
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Cabbage (White Cabbage)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-CABBA-7434', 'Cabbage (White Cabbage)', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Cabbage (White Cabbage)')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Cabbage (White Cabbage)'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.035, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  150, 
  5.250000000000001
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Garlic
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-GARLI-4418', 'Garlic', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Garlic')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Garlic'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.07, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  10, 
  0.7000000000000001
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Salt
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-SALT-7883', 'Salt', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Salt')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Salt'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.015, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  3, 
  0.045
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Turmeric Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-TURME-5309', 'Turmeric Powder', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Turmeric Powder')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Turmeric Powder'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.276, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  2, 
  0.552
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chicken Seasoning Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-CHICK-3704', 'Chicken Seasoning Powder', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Chicken Seasoning Powder')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Chicken Seasoning Powder'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.07, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  3, 
  0.21000000000000002
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Oyster Sauce
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-OYSTE-2164', 'Oyster Sauce', 'RAW_MATERIAL', 'ml'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Oyster Sauce')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Oyster Sauce'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.0712, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  5, 
  0.356
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: JH-PSB-12B(Side Dish Box)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-JHPS-3017', 'JH-PSB-12B(Side Dish Box)', 'RAW_MATERIAL', 'pcs'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'JH-PSB-12B(Side Dish Box)')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'JH-PSB-12B(Side Dish Box)'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 5.52, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  1, 
  5.52
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Bean Sprout
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-BEAN-1945', 'Bean Sprout', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Bean Sprout')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Bean Sprout'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.03, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  100, 
  3
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Shallot
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-SHALL-131', 'Shallot', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Shallot')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Shallot'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.038, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  20, 
  0.76
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Garlic
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-GARLI-7506', 'Garlic', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Garlic')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Garlic'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.07, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  10, 
  0.7000000000000001
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: King Rice Bran Oil 5 L
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-KING-1271', 'King Rice Bran Oil 5 L', 'RAW_MATERIAL', 'ml'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'King Rice Bran Oil 5 L')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'King Rice Bran Oil 5 L'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.047, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  7, 
  0.329
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Turmeric Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-TURME-5489', 'Turmeric Powder', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Turmeric Powder')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Turmeric Powder'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.276, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  1, 
  0.276
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Salt
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-SALT-4517', 'Salt', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Salt')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Salt'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.015, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  2, 
  0.03
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chicken Seasoning Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-CHICK-7654', 'Chicken Seasoning Powder', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Chicken Seasoning Powder')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Chicken Seasoning Powder'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.07, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  3, 
  0.21000000000000002
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: JH-PSB-12B(Side Dish Box)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-JHPS-5892', 'JH-PSB-12B(Side Dish Box)', 'RAW_MATERIAL', 'pcs'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'JH-PSB-12B(Side Dish Box)')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'JH-PSB-12B(Side Dish Box)'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 5.52, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  1, 
  5.52
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Water Spinach (Morning Glory)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-WATER-8477', 'Water Spinach (Morning Glory)', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Water Spinach (Morning Glory)')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Water Spinach (Morning Glory)'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.03, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  150, 
  4.5
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Tomato
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-TOMAT-5827', 'Tomato', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Tomato')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Tomato'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.03, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  30, 
  0.8999999999999999
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Green Chili
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-GREEN-3570', 'Green Chili', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Green Chili')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Green Chili'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.16, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  10, 
  1.6
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Garlic
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-GARLI-5162', 'Garlic', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Garlic')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Garlic'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.07, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  10, 
  0.7000000000000001
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chicken Seasoning Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-CHICK-893', 'Chicken Seasoning Powder', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Chicken Seasoning Powder')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Chicken Seasoning Powder'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.07, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  5, 
  0.35000000000000003
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Golden Mountain Soy Sauce
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-GOLDE-2321', 'Golden Mountain Soy Sauce', 'RAW_MATERIAL', 'ml'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Golden Mountain Soy Sauce')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Golden Mountain Soy Sauce'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.055, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  7, 
  0.385
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Oyster Sauce
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-OYSTE-6028', 'Oyster Sauce', 'RAW_MATERIAL', 'ml'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Oyster Sauce')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Oyster Sauce'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.0712, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  7, 
  0.4984
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: King Rice Bran Oil 5 L
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-KING-949', 'King Rice Bran Oil 5 L', 'RAW_MATERIAL', 'ml'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'King Rice Bran Oil 5 L')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'King Rice Bran Oil 5 L'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.047, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  7, 
  0.329
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: JH-PSB-12B(Side Dish Box)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-JHPS-8911', 'JH-PSB-12B(Side Dish Box)', 'RAW_MATERIAL', 'pcs'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'JH-PSB-12B(Side Dish Box)')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'JH-PSB-12B(Side Dish Box)'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 5.52, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  1, 
  5.52
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chinese Kale
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-CHINE-4730', 'Chinese Kale', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Chinese Kale')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Chinese Kale'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.04167, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  200, 
  8.334
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Oyster Sauce
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-OYSTE-2186', 'Oyster Sauce', 'RAW_MATERIAL', 'ml'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Oyster Sauce')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Oyster Sauce'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.0712, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  34, 
  2.4208
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Garlic
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-GARLI-3285', 'Garlic', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Garlic')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Garlic'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.07, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  10, 
  0.7000000000000001
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Pure Refined Sugar
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-PURE-3641', 'Pure Refined Sugar', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Pure Refined Sugar')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Pure Refined Sugar'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.027, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  6, 
  0.162
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chicken Seasoning Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-CHICK-6042', 'Chicken Seasoning Powder', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Chicken Seasoning Powder')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Chicken Seasoning Powder'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.07, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  3, 
  0.21000000000000002
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Golden Mountain Soy Sauce
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-GOLDE-5281', 'Golden Mountain Soy Sauce', 'RAW_MATERIAL', 'ml'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Golden Mountain Soy Sauce')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Golden Mountain Soy Sauce'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.055, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  5, 
  0.275
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: King Rice Bran Oil 5 L
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-KING-6330', 'King Rice Bran Oil 5 L', 'RAW_MATERIAL', 'ml'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'King Rice Bran Oil 5 L')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'King Rice Bran Oil 5 L'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.047, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  7, 
  0.329
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: JH-PSB-12B(Side Dish Box)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-JHPS-7262', 'JH-PSB-12B(Side Dish Box)', 'RAW_MATERIAL', 'pcs'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'JH-PSB-12B(Side Dish Box)')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'JH-PSB-12B(Side Dish Box)'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 5.52, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  1, 
  5.52
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Wood Ear Mushroom
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-WOOD-5517', 'Wood Ear Mushroom', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Wood Ear Mushroom')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Wood Ear Mushroom'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.13, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  100, 
  13
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Shallot
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-SHALL-480', 'Shallot', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Shallot')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Shallot'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.038, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  20, 
  0.76
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Carrot
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-CARRO-5449', 'Carrot', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Carrot')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Carrot'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.02188, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  20, 
  0.4376
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Coriander (Cilantro)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-CORIA-6109', 'Coriander (Cilantro)', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Coriander (Cilantro)')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Coriander (Cilantro)'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.05, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  10, 
  0.5
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Green Chili
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-GREEN-3338', 'Green Chili', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Green Chili')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Green Chili'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.16, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  10, 
  1.6
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Salt
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-SALT-6431', 'Salt', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Salt')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Salt'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.015, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  3, 
  0.045
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chicken Seasoning Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-CHICK-8549', 'Chicken Seasoning Powder', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Chicken Seasoning Powder')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Chicken Seasoning Powder'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.07, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  5, 
  0.35000000000000003
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Lime Juice
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-LIME-5201', 'Lime Juice', 'RAW_MATERIAL', 'ml'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Lime Juice')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Lime Juice'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.025, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  7, 
  0.17500000000000002
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: JH-PSB-12B(Side Dish Box)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-JHPS-5839', 'JH-PSB-12B(Side Dish Box)', 'RAW_MATERIAL', 'pcs'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'JH-PSB-12B(Side Dish Box)')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'JH-PSB-12B(Side Dish Box)'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 5.52, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  1, 
  5.52
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Tomato
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-TOMAT-8958', 'Tomato', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Tomato')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Tomato'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.03, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  100, 
  3
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Shallot
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-SHALL-311', 'Shallot', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Shallot')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Shallot'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.038, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  20, 
  0.76
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Garlic
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-GARLI-3840', 'Garlic', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Garlic')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Garlic'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.07, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  1, 
  0.07
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Green Chili
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-GREEN-4731', 'Green Chili', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Green Chili')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Green Chili'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.16, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  10, 
  1.6
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Coriander (Cilantro)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-CORIA-7821', 'Coriander (Cilantro)', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Coriander (Cilantro)')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Coriander (Cilantro)'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.05, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  20, 
  1
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chicken Seasoning Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-CHICK-382', 'Chicken Seasoning Powder', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Chicken Seasoning Powder')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Chicken Seasoning Powder'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.07, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  5, 
  0.35000000000000003
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Salt
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-SALT-635', 'Salt', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Salt')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Salt'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.015, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  3, 
  0.045
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Lime
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-LIME-4545', 'Lime', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Lime')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Lime'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.05, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  5, 
  0.25
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: JH-PSB-12B(Side Dish Box)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-JHPS-5558', 'JH-PSB-12B(Side Dish Box)', 'RAW_MATERIAL', 'pcs'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'JH-PSB-12B(Side Dish Box)')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'JH-PSB-12B(Side Dish Box)'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 5.52, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  1, 
  5.52
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: English Gourd
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-ENGLI-2984', 'English Gourd', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'English Gourd')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'English Gourd'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.05, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  200, 
  10
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Garlic
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-GARLI-7248', 'Garlic', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Garlic')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Garlic'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.07, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  1, 
  0.07
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: King Rice Bran Oil 5 L
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-KING-628', 'King Rice Bran Oil 5 L', 'RAW_MATERIAL', 'ml'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'King Rice Bran Oil 5 L')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'King Rice Bran Oil 5 L'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.047, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  7, 
  0.33
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chicken Seasoning Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-CHICK-8', 'Chicken Seasoning Powder', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Chicken Seasoning Powder')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Chicken Seasoning Powder'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.07, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  5, 
  0.35
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Salt
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-SALT-9927', 'Salt', 'RAW_MATERIAL', 'g'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'Salt')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'Salt'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 0.015, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  3, 
  0.05
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: JH-PSB-12B(Side Dish Box)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure)
    SELECT 'ITM-JHPS-1506', 'JH-PSB-12B(Side Dish Box)', 'RAW_MATERIAL', 'pcs'
    WHERE NOT EXISTS (SELECT 1 FROM inventory.items WHERE name_eng = 'JH-PSB-12B(Side Dish Box)')
    RETURNING id
),
existing_item AS (
    SELECT id FROM inventory.items WHERE name_eng = 'JH-PSB-12B(Side Dish Box)'
),
item_id_cte AS (
    SELECT id FROM new_item UNION ALL SELECT id FROM existing_item LIMIT 1
),
-- Ensure balance exists
balance_insert AS (
    INSERT INTO inventory.balances (item_id, current_quantity, one_unit_cost, min_quantity)
    SELECT id, 0, 5.52, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  1, 
  5.52
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);
