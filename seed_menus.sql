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
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-BEEF-7236', 'Beef Lean', 'RAW_MATERIAL', 'g', 0.24534, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  100, 
  'g', 
  24.534
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Bell Pepper
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-BELL-53', 'Bell Pepper', 'RAW_MATERIAL', 'g', 0.1, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  50, 
  'g', 
  5
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: King Rice Bran Oil 5 L
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-KING-6525', 'King Rice Bran Oil 5 L', 'RAW_MATERIAL', 'ml', 0.047, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  15, 
  'ml', 
  0.705
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Turmeric Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-TURME-2099', 'Turmeric Powder', 'RAW_MATERIAL', 'g', 0.276, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  2, 
  'g', 
  0.552
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chicken Seasoning Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-CHICK-1280', 'Chicken Seasoning Powder', 'RAW_MATERIAL', 'g', 0.07, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  5, 
  'g', 
  0.35000000000000003
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chili Colored Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-CHILI-265', 'Chili Colored Powder', 'RAW_MATERIAL', 'g', 0.3125, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  3, 
  'g', 
  0.9375
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Salt
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-SALT-7523', 'Salt', 'RAW_MATERIAL', 'g', 0.015, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  3, 
  'g', 
  0.045
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Garlic
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-GARLI-6798', 'Garlic', 'RAW_MATERIAL', 'g', 0.07, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  10, 
  'g', 
  0.7000000000000001
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Shallot
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-SHALL-6612', 'Shallot', 'RAW_MATERIAL', 'g', 0.038, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  30, 
  'g', 
  1.14
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Golden Mountain Soy Sauce
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-GOLDE-9828', 'Golden Mountain Soy Sauce', 'RAW_MATERIAL', 'ml', 0.055, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  7, 
  'ml', 
  0.385
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Pure Refined Sugar
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-PURE-9193', 'Pure Refined Sugar', 'RAW_MATERIAL', 'g', 0.027, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  3, 
  'g', 
  0.081
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Ginger
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-GINGE-2894', 'Ginger', 'RAW_MATERIAL', 'g', 0.04167, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  5, 
  'g', 
  0.20834999999999998
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Rice
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-RICE-1988', 'Rice', 'RAW_MATERIAL', 'g', 0.023, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  100, 
  'g', 
  2.3
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Grace(B002)(Rice Box / 2)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-GRACE-7326', 'Grace(B002)(Rice Box / 2)', 'RAW_MATERIAL', 'pcs', 5.94, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  1, 
  'pcs', 
  5.94
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Pork Tenderloin
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-PORK-7344', 'Pork Tenderloin', 'RAW_MATERIAL', 'g', 0.14152, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  100, 
  'g', 
  14.152000000000001
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Cauliflower
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-CAULI-2533', 'Cauliflower', 'RAW_MATERIAL', 'g', 0.03, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  50, 
  'g', 
  1.5
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: French Bean
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-FRENC-730', 'French Bean', 'RAW_MATERIAL', 'g', 0.045, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  20, 
  'g', 
  0.8999999999999999
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Scallion / Spring Onion
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-SCALL-4276', 'Scallion / Spring Onion', 'RAW_MATERIAL', 'g', 0.05, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  10, 
  'g', 
  0.5
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Carrot
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-CARRO-875', 'Carrot', 'RAW_MATERIAL', 'g', 0.02188, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  20, 
  'g', 
  0.4376
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Ginger
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-GINGE-3963', 'Ginger', 'RAW_MATERIAL', 'g', 0.04167, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  5, 
  'g', 
  0.20834999999999998
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Garlic
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-GARLI-1119', 'Garlic', 'RAW_MATERIAL', 'g', 0.07, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  10, 
  'g', 
  0.7000000000000001
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Shallot
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-SHALL-5968', 'Shallot', 'RAW_MATERIAL', 'g', 0.038, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  30, 
  'g', 
  1.14
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Baby Corn
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-BABY-7636', 'Baby Corn', 'RAW_MATERIAL', 'g', 0.0625, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  20, 
  'g', 
  1.25
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Broccoli
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-BROCC-4111', 'Broccoli', 'RAW_MATERIAL', 'g', 0.075, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  20, 
  'g', 
  1.5
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: King Rice Bran Oil 5 L
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-KING-5063', 'King Rice Bran Oil 5 L', 'RAW_MATERIAL', 'ml', 0.047, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  15, 
  'ml', 
  0.705
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Golden Mountain Soy Sauce
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-GOLDE-153', 'Golden Mountain Soy Sauce', 'RAW_MATERIAL', 'ml', 0.055, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  15, 
  'ml', 
  0.825
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Healthy Boy Sweet Soy Sauce
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-HEALT-3871', 'Healthy Boy Sweet Soy Sauce', 'RAW_MATERIAL', 'ml', 0.08857, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  7, 
  'ml', 
  0.6199899999999999
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chicken Seasoning Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-CHICK-7722', 'Chicken Seasoning Powder', 'RAW_MATERIAL', 'g', 0.07, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  5, 
  'g', 
  0.35000000000000003
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Pure Refined Sugar
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-PURE-2065', 'Pure Refined Sugar', 'RAW_MATERIAL', 'g', 0.027, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  3, 
  'g', 
  0.081
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Black Pepper
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-BLACK-8357', 'Black Pepper', 'RAW_MATERIAL', 'g', 0.344, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  1, 
  'g', 
  0.344
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Dried Chili
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-DRIED-8385', 'Dried Chili', 'RAW_MATERIAL', 'g', 0.4, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  3, 
  'g', 
  1.2000000000000002
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Rice
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-RICE-763', 'Rice', 'RAW_MATERIAL', 'g', 0.023, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  100, 
  'g', 
  2.3
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Grace(B002)(Rice Box / 2)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-GRACE-5552', 'Grace(B002)(Rice Box / 2)', 'RAW_MATERIAL', 'pcs', 5.94, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  1, 
  'pcs', 
  5.94
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chicken Thigh
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-CHICK-7382', 'Chicken Thigh', 'RAW_MATERIAL', 'g', 0.07813, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  100, 
  'g', 
  7.813000000000001
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Scallion / Spring Onion
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-SCALL-9890', 'Scallion / Spring Onion', 'RAW_MATERIAL', 'g', 0.05, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  5, 
  'g', 
  0.25
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Bell Pepper
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-BELL-4967', 'Bell Pepper', 'RAW_MATERIAL', 'g', 0.1, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  50, 
  'g', 
  5
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Garlic
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-GARLI-1281', 'Garlic', 'RAW_MATERIAL', 'g', 0.07, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  10, 
  'g', 
  0.7000000000000001
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Ginger
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-GINGE-2054', 'Ginger', 'RAW_MATERIAL', 'g', 0.04167, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  10, 
  'g', 
  0.41669999999999996
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Shallot
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-SHALL-3241', 'Shallot', 'RAW_MATERIAL', 'g', 0.038, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  30, 
  'g', 
  1.14
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chicken Seasoning Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-CHICK-2229', 'Chicken Seasoning Powder', 'RAW_MATERIAL', 'g', 0.07, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  5, 
  'g', 
  0.35000000000000003
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Dried Chili
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-DRIED-2623', 'Dried Chili', 'RAW_MATERIAL', 'g', 0.4, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  3, 
  'g', 
  1.2000000000000002
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Pure Refined Sugar
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-PURE-1923', 'Pure Refined Sugar', 'RAW_MATERIAL', 'g', 0.027, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  3, 
  'g', 
  0.081
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Black Pepper
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-BLACK-5071', 'Black Pepper', 'RAW_MATERIAL', 'g', 0.344, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  2, 
  'g', 
  0.688
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: King Rice Bran Oil 5 L
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-KING-5575', 'King Rice Bran Oil 5 L', 'RAW_MATERIAL', 'ml', 0.047, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  15, 
  'ml', 
  0.705
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Golden Mountain Soy Sauce
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-GOLDE-1100', 'Golden Mountain Soy Sauce', 'RAW_MATERIAL', 'ml', 0.055, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  15, 
  'ml', 
  0.825
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Healthy Boy Sweet Soy Sauce
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-HEALT-561', 'Healthy Boy Sweet Soy Sauce', 'RAW_MATERIAL', 'ml', 0.08857, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  7, 
  'ml', 
  0.6199899999999999
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Rice
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-RICE-1729', 'Rice', 'RAW_MATERIAL', 'g', 0.023, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  100, 
  'g', 
  2.3
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Grace(B002)(Rice Box / 2)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-GRACE-4639', 'Grace(B002)(Rice Box / 2)', 'RAW_MATERIAL', 'pcs', 5.94, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  1, 
  'pcs', 
  5.94
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Thin Pork Layer
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-THIN-5172', 'Thin Pork Layer', 'RAW_MATERIAL', 'g', 0.1305, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  100, 
  'g', 
  13.05
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Scallion / Spring Onion
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-SCALL-6669', 'Scallion / Spring Onion', 'RAW_MATERIAL', 'g', 0.05, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  30, 
  'g', 
  1.5
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: King Rice Bran Oil 5 L
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-KING-1994', 'King Rice Bran Oil 5 L', 'RAW_MATERIAL', 'ml', 0.047, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  15, 
  'ml', 
  0.705
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Garlic
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-GARLI-9918', 'Garlic', 'RAW_MATERIAL', 'g', 0.07, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  10, 
  'g', 
  0.7000000000000001
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Shallot
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-SHALL-1365', 'Shallot', 'RAW_MATERIAL', 'g', 0.038, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  30, 
  'g', 
  1.14
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Ginger
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-GINGE-8295', 'Ginger', 'RAW_MATERIAL', 'g', 0.04167, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  10, 
  'g', 
  0.41669999999999996
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chicken Seasoning Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-CHICK-8533', 'Chicken Seasoning Powder', 'RAW_MATERIAL', 'g', 0.07, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  5, 
  'g', 
  0.35000000000000003
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: White Pepper Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-WHITE-1094', 'White Pepper Powder', 'RAW_MATERIAL', 'g', 0.22857, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  5, 
  'g', 
  1.14285
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Golden Mountain Soy Sauce
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-GOLDE-4457', 'Golden Mountain Soy Sauce', 'RAW_MATERIAL', 'ml', 0.055, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  7, 
  'ml', 
  0.385
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Oyster Sauce
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-OYSTE-4471', 'Oyster Sauce', 'RAW_MATERIAL', 'ml', 0.0712, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  7, 
  'ml', 
  0.4984
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Healthy Boy Sweet Soy Sauce
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-HEALT-7949', 'Healthy Boy Sweet Soy Sauce', 'RAW_MATERIAL', 'ml', 0.08857, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  4, 
  'ml', 
  0.35428
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Rice
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-RICE-3707', 'Rice', 'RAW_MATERIAL', 'g', 0.023, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  100, 
  'g', 
  2.3
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Grace(B002)(Rice Box / 2)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-GRACE-2758', 'Grace(B002)(Rice Box / 2)', 'RAW_MATERIAL', 'pcs', 5.94, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  1, 
  'pcs', 
  5.94
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Shrimp
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-SHRIM-1852', 'Shrimp', 'RAW_MATERIAL', 'g', 0.22667, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  100, 
  'g', 
  22.667
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Bell Pepper
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-BELL-6404', 'Bell Pepper', 'RAW_MATERIAL', 'g', 0.1, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  50, 
  'g', 
  5
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Garlic
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-GARLI-9278', 'Garlic', 'RAW_MATERIAL', 'g', 0.07, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  10, 
  'g', 
  0.7000000000000001
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Ginger
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-GINGE-424', 'Ginger', 'RAW_MATERIAL', 'g', 0.04167, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  10, 
  'g', 
  0.41669999999999996
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Shallot
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-SHALL-6671', 'Shallot', 'RAW_MATERIAL', 'g', 0.038, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  30, 
  'g', 
  1.14
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Scallion / Spring Onion
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-SCALL-2049', 'Scallion / Spring Onion', 'RAW_MATERIAL', 'g', 0.05, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  10, 
  'g', 
  0.5
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: King Rice Bran Oil 5 L
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-KING-4857', 'King Rice Bran Oil 5 L', 'RAW_MATERIAL', 'ml', 0.047, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  15, 
  'ml', 
  0.705
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chicken Seasoning Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-CHICK-9562', 'Chicken Seasoning Powder', 'RAW_MATERIAL', 'g', 0.07, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  5, 
  'g', 
  0.35000000000000003
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Pure Refined Sugar
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-PURE-9008', 'Pure Refined Sugar', 'RAW_MATERIAL', 'g', 0.027, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  3, 
  'g', 
  0.081
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Golden Mountain Soy Sauce
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-GOLDE-4342', 'Golden Mountain Soy Sauce', 'RAW_MATERIAL', 'ml', 0.055, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  15, 
  'ml', 
  0.825
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Healthy Boy Sweet Soy Sauce
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-HEALT-1819', 'Healthy Boy Sweet Soy Sauce', 'RAW_MATERIAL', 'ml', 0.08857, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  7, 
  'ml', 
  0.6199899999999999
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Black Pepper
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-BLACK-9885', 'Black Pepper', 'RAW_MATERIAL', 'g', 0.344, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  3, 
  'g', 
  1.032
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Dried Chili
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-DRIED-2612', 'Dried Chili', 'RAW_MATERIAL', 'g', 0.4, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  3, 
  'g', 
  1.2000000000000002
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Rice
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-RICE-7684', 'Rice', 'RAW_MATERIAL', 'g', 0.023, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  100, 
  'g', 
  2.3
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Grace(B002)(Rice Box / 2)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-GRACE-5956', 'Grace(B002)(Rice Box / 2)', 'RAW_MATERIAL', 'pcs', 5.94, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  1, 
  'pcs', 
  5.94
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Pork Tenderloin
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-PORK-9500', 'Pork Tenderloin', 'RAW_MATERIAL', 'g', 0.14152, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  150, 
  'g', 
  21.228
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Thai Fragrant Rice
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-THAI-976', 'Thai Fragrant Rice', 'RAW_MATERIAL', 'g', 0.023, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  140, 
  'g', 
  3.2199999999999998
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Carrot
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-CARRO-6527', 'Carrot', 'RAW_MATERIAL', 'g', 0.02188, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  20, 
  'g', 
  0.4376
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Baby Corn
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-BABY-2731', 'Baby Corn', 'RAW_MATERIAL', 'g', 0.0625, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  20, 
  'g', 
  1.25
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Cabbage (White Cabbage)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-CABBA-83', 'Cabbage (White Cabbage)', 'RAW_MATERIAL', 'g', 0.035, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  20, 
  'g', 
  0.7000000000000001
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Cauliflower
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-CAULI-9534', 'Cauliflower', 'RAW_MATERIAL', 'g', 0.03, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  20, 
  'g', 
  0.6
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Garlic
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-GARLI-9042', 'Garlic', 'RAW_MATERIAL', 'g', 0.07, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  5, 
  'g', 
  0.35000000000000003
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Corn powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-CORN-623', 'Corn powder', 'RAW_MATERIAL', 'g', 0.1, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  7, 
  'g', 
  0.7000000000000001
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Quail egg
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-QUAIL-5291', 'Quail egg', 'RAW_MATERIAL', 'pcs', 1.14, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  2, 
  'pcs', 
  2.28
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Snow Pear
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-SNOW-3182', 'Snow Pear', 'RAW_MATERIAL', 'g', 0.079, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  20, 
  'g', 
  1.58
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Rice
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-RICE-1928', 'Rice', 'RAW_MATERIAL', 'g', 0.023, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  100, 
  'g', 
  2.3
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: JH-PSB-12B(Rice Box)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-JHPS-4271', 'JH-PSB-12B(Rice Box)', 'RAW_MATERIAL', 'pcs', 5.52, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  1, 
  'pcs', 
  5.52
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Squid Ring
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-SQUID-2458', 'Squid Ring', 'RAW_MATERIAL', 'g', 0.155, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  100, 
  'g', 
  15.5
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Bell Pepper
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-BELL-1647', 'Bell Pepper', 'RAW_MATERIAL', 'g', 0.1, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  50, 
  'g', 
  5
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: King Rice Bran Oil 5 L
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-KING-5549', 'King Rice Bran Oil 5 L', 'RAW_MATERIAL', 'ml', 0.047, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  15, 
  'ml', 
  0.705
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Garlic
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-GARLI-2472', 'Garlic', 'RAW_MATERIAL', 'g', 0.07, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  10, 
  'g', 
  0.7000000000000001
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Ginger
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-GINGE-5789', 'Ginger', 'RAW_MATERIAL', 'g', 0.04167, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  10, 
  'g', 
  0.41669999999999996
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Oyster Sauce
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-OYSTE-5229', 'Oyster Sauce', 'RAW_MATERIAL', 'ml', 0.0712, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  7, 
  'ml', 
  0.4984
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Healthy Boy Sweet Soy Sauce
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-HEALT-9847', 'Healthy Boy Sweet Soy Sauce', 'RAW_MATERIAL', 'ml', 0.08857, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  5, 
  'ml', 
  0.44284999999999997
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Scallion / Spring Onion
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-SCALL-5131', 'Scallion / Spring Onion', 'RAW_MATERIAL', 'g', 0.05, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  10, 
  'g', 
  0.5
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Rice
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-RICE-4381', 'Rice', 'RAW_MATERIAL', 'g', 0.023, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  100, 
  'g', 
  2.3
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Grace(B002)(Rice Box / 2)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-GRACE-8114', 'Grace(B002)(Rice Box / 2)', 'RAW_MATERIAL', 'pcs', 5.94, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  1, 
  'pcs', 
  5.94
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Squid Ring
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-SQUID-4042', 'Squid Ring', 'RAW_MATERIAL', 'g', 0.155, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  100, 
  'g', 
  15.5
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Scallion / Spring Onion
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-SCALL-4033', 'Scallion / Spring Onion', 'RAW_MATERIAL', 'g', 0.05, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  20, 
  'g', 
  1
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Green Chili
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-GREEN-7283', 'Green Chili', 'RAW_MATERIAL', 'g', 0.16, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  15, 
  'g', 
  2.4
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Ginger
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-GINGE-9285', 'Ginger', 'RAW_MATERIAL', 'g', 0.04167, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  10, 
  'g', 
  0.41669999999999996
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Garlic
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-GARLI-9379', 'Garlic', 'RAW_MATERIAL', 'g', 0.07, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  10, 
  'g', 
  0.7000000000000001
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Shallot
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-SHALL-6057', 'Shallot', 'RAW_MATERIAL', 'g', 0.038, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  30, 
  'g', 
  1.14
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: King Rice Bran Oil 5 L
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-KING-2517', 'King Rice Bran Oil 5 L', 'RAW_MATERIAL', 'ml', 0.047, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  15, 
  'ml', 
  0.705
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Salt
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-SALT-5307', 'Salt', 'RAW_MATERIAL', 'g', 0.015, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  3, 
  'g', 
  0.045
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chicken Seasoning Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-CHICK-8812', 'Chicken Seasoning Powder', 'RAW_MATERIAL', 'g', 0.07, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  5, 
  'g', 
  0.35000000000000003
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chili Colored Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-CHILI-5728', 'Chili Colored Powder', 'RAW_MATERIAL', 'g', 0.3125, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  3, 
  'g', 
  0.9375
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Turmeric Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-TURME-1587', 'Turmeric Powder', 'RAW_MATERIAL', 'g', 0.276, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  2, 
  'g', 
  0.552
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Rice
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-RICE-575', 'Rice', 'RAW_MATERIAL', 'g', 0.023, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  100, 
  'g', 
  2.3
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Grace(B002)(Rice Box / 2)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-GRACE-9224', 'Grace(B002)(Rice Box / 2)', 'RAW_MATERIAL', 'pcs', 5.94, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  1, 
  'pcs', 
  5.94
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Pork Tenderloin
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-PORK-2254', 'Pork Tenderloin', 'RAW_MATERIAL', 'g', 0.14152, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  100, 
  'g', 
  14.152000000000001
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Carrot
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-CARRO-8845', 'Carrot', 'RAW_MATERIAL', 'g', 0.02188, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  30, 
  'g', 
  0.6564
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Bell Pepper
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-BELL-5121', 'Bell Pepper', 'RAW_MATERIAL', 'g', 0.1, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  30, 
  'g', 
  3
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Snow Pear
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-SNOW-1769', 'Snow Pear', 'RAW_MATERIAL', 'g', 0.079, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  30, 
  'g', 
  2.37
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Shallot
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-SHALL-3348', 'Shallot', 'RAW_MATERIAL', 'g', 0.038, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  30, 
  'g', 
  1.14
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Garlic
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-GARLI-5091', 'Garlic', 'RAW_MATERIAL', 'g', 0.07, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  10, 
  'g', 
  0.7000000000000001
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Ginger
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-GINGE-4107', 'Ginger', 'RAW_MATERIAL', 'g', 0.04167, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  10, 
  'g', 
  0.41669999999999996
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Baby Corn
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-BABY-3952', 'Baby Corn', 'RAW_MATERIAL', 'g', 0.0625, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  20, 
  'g', 
  1.25
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: King Rice Bran Oil 5 L
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-KING-3824', 'King Rice Bran Oil 5 L', 'RAW_MATERIAL', 'ml', 0.047, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  15, 
  'ml', 
  0.705
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Salt
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-SALT-7200', 'Salt', 'RAW_MATERIAL', 'g', 0.015, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  5, 
  'g', 
  0.075
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chicken Seasoning Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-CHICK-9205', 'Chicken Seasoning Powder', 'RAW_MATERIAL', 'g', 0.07, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  5, 
  'g', 
  0.35000000000000003
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Tomato
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-TOMAT-1476', 'Tomato', 'RAW_MATERIAL', 'g', 0.03, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  30, 
  'g', 
  0.8999999999999999
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Golden Mountain Soy Sauce
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-GOLDE-4788', 'Golden Mountain Soy Sauce', 'RAW_MATERIAL', 'ml', 0.055, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  7, 
  'ml', 
  0.385
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Oyster Sauce
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-OYSTE-1112', 'Oyster Sauce', 'RAW_MATERIAL', 'ml', 0.0712, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  7, 
  'ml', 
  0.4984
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chili Sauce
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-CHILI-7475', 'Chili Sauce', 'RAW_MATERIAL', 'g', 0.0589, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  50, 
  'g', 
  2.945
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Corn powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-CORN-641', 'Corn powder', 'RAW_MATERIAL', 'g', 0.1, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  10, 
  'g', 
  1
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Vinegar
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-VINEG-7367', 'Vinegar', 'RAW_MATERIAL', 'ml', 0.03, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  7, 
  'ml', 
  0.21
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Pure Refined Sugar
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-PURE-3600', 'Pure Refined Sugar', 'RAW_MATERIAL', 'g', 0.027, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  5, 
  'g', 
  0.135
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Rice
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-RICE-4764', 'Rice', 'RAW_MATERIAL', 'g', 0.023, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  100, 
  'g', 
  2.3
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Grace(B002)(Rice Box / 2)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-GRACE-3244', 'Grace(B002)(Rice Box / 2)', 'RAW_MATERIAL', 'pcs', 5.94, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  1, 
  'pcs', 
  5.94
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Fish cake
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-FISH-6914', 'Fish cake', 'RAW_MATERIAL', 'g', 0.19, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  100, 
  'g', 
  19
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Cabbage
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-CABBA-1254', 'Cabbage', 'RAW_MATERIAL', 'g', 0.027, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  30, 
  'g', 
  0.8099999999999999
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Shallot
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-SHALL-9202', 'Shallot', 'RAW_MATERIAL', 'g', 0.038, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  20, 
  'g', 
  0.76
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Garlic
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-GARLI-5435', 'Garlic', 'RAW_MATERIAL', 'g', 0.07, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  10, 
  'g', 
  0.7000000000000001
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Ginger
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-GINGE-8721', 'Ginger', 'RAW_MATERIAL', 'g', 0.04167, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  5, 
  'g', 
  0.20834999999999998
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Green Chili
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-GREEN-8783', 'Green Chili', 'RAW_MATERIAL', 'g', 0.16, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  10, 
  'g', 
  1.6
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: King Rice Bran Oil 5 L
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-KING-6844', 'King Rice Bran Oil 5 L', 'RAW_MATERIAL', 'ml', 0.047, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  7, 
  'ml', 
  0.329
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chicken Seasoning Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-CHICK-8044', 'Chicken Seasoning Powder', 'RAW_MATERIAL', 'g', 0.07, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  5, 
  'g', 
  0.35000000000000003
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Fish Sauce
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-FISH-1050', 'Fish Sauce', 'RAW_MATERIAL', 'ml', 0.0414, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  5, 
  'ml', 
  0.207
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Lime Juice
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-LIME-9779', 'Lime Juice', 'RAW_MATERIAL', 'ml', 0.025, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  7, 
  'ml', 
  0.17500000000000002
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Turmeric Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-TURME-7741', 'Turmeric Powder', 'RAW_MATERIAL', 'g', 0.276, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  2, 
  'g', 
  0.552
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Tomato
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-TOMAT-5637', 'Tomato', 'RAW_MATERIAL', 'g', 0.03, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  20, 
  'g', 
  0.6
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Rice
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-RICE-4687', 'Rice', 'RAW_MATERIAL', 'g', 0.023, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  100, 
  'g', 
  2.3
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Grace(B002)(Rice Box / 2)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-GRACE-1910', 'Grace(B002)(Rice Box / 2)', 'RAW_MATERIAL', 'pcs', 5.94, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  1, 
  'pcs', 
  5.94
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Shrimp
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-SHRIM-7937', 'Shrimp', 'RAW_MATERIAL', 'g', 0.22667, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  100, 
  'g', 
  22.667
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Green Chili
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-GREEN-4522', 'Green Chili', 'RAW_MATERIAL', 'g', 0.16, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  50, 
  'g', 
  8
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Turmeric Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-TURME-4498', 'Turmeric Powder', 'RAW_MATERIAL', 'g', 0.276, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  2, 
  'g', 
  0.552
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chili Colored Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-CHILI-4385', 'Chili Colored Powder', 'RAW_MATERIAL', 'g', 0.3125, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  3, 
  'g', 
  0.9375
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Salt
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-SALT-611', 'Salt', 'RAW_MATERIAL', 'g', 0.015, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  2, 
  'g', 
  0.03
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: King Rice Bran Oil 5 L
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-KING-3281', 'King Rice Bran Oil 5 L', 'RAW_MATERIAL', 'ml', 0.047, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  15, 
  'ml', 
  0.705
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Shallot
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-SHALL-7734', 'Shallot', 'RAW_MATERIAL', 'g', 0.038, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  30, 
  'g', 
  1.14
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Garlic
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-GARLI-7078', 'Garlic', 'RAW_MATERIAL', 'g', 0.07, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  10, 
  'g', 
  0.7000000000000001
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chicken Seasoning Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-CHICK-295', 'Chicken Seasoning Powder', 'RAW_MATERIAL', 'g', 0.07, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  3, 
  'g', 
  0.21000000000000002
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: OverHead Cost
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-OVERH-4293', 'OverHead Cost', 'RAW_MATERIAL', '', 0, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  1, 
  '', 
  0
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Rice
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-RICE-1654', 'Rice', 'RAW_MATERIAL', 'g', 0.023, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  100, 
  'g', 
  2.3
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGB 0002')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Grace(B002)(Rice Box / 2)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-GRACE-5318', 'Grace(B002)(Rice Box / 2)', 'RAW_MATERIAL', 'pcs', 5.94, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGB 0002'), 
  (SELECT id FROM item_id_cte), 
  1, 
  'pcs', 
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
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-WAOO-1998', 'Wa-Ooh Noodle', 'RAW_MATERIAL', 'g', 0.09, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  100, 
  'g', 
  9
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Peanut Butter
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-PEANU-3666', 'Peanut Butter', 'RAW_MATERIAL', 'g', 0.285, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  15, 
  'g', 
  4.2749999999999995
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chinese Kale
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-CHINE-9283', 'Chinese Kale', 'RAW_MATERIAL', 'g', 0.04167, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  20, 
  'g', 
  0.8333999999999999
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Mala Paste
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-MALA-2517', 'Mala Paste', 'RAW_MATERIAL', 'g', 0.1, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  30, 
  'g', 
  3
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Pork Soup Bone
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-PORK-4711', 'Pork Soup Bone', 'RAW_MATERIAL', 'g', 0.049, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  50, 
  'g', 
  2.45
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Salt
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-SALT-923', 'Salt', 'RAW_MATERIAL', 'g', 0.015, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  2, 
  'g', 
  0.03
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Pure Refined Sugar
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-PURE-8150', 'Pure Refined Sugar', 'RAW_MATERIAL', 'g', 0.027, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  5, 
  'g', 
  0.135
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chicken Seasoning Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-CHICK-7629', 'Chicken Seasoning Powder', 'RAW_MATERIAL', 'g', 0.07, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  5, 
  'g', 
  0.35000000000000003
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Vinegar
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-VINEG-6363', 'Vinegar', 'RAW_MATERIAL', 'ml', 0.03, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  15, 
  'ml', 
  0.44999999999999996
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Ginger
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-GINGE-4514', 'Ginger', 'RAW_MATERIAL', 'g', 0.04167, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  5, 
  'g', 
  0.20834999999999998
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Pork Ball
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-PORK-7592', 'Pork Ball', 'RAW_MATERIAL', 'g', 0.135, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  70, 
  'g', 
  9.450000000000001
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Golden Mountain Soy Sauce
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-GOLDE-627', 'Golden Mountain Soy Sauce', 'RAW_MATERIAL', 'ml', 0.055, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  7, 
  'ml', 
  0.385
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: JH-PSB-12B(Rice Box)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-JHPS-8797', 'JH-PSB-12B(Rice Box)', 'RAW_MATERIAL', 'pcs', 5.52, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  1, 
  'pcs', 
  5.52
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: JH-PSB-26B/Big(Soup Box)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-JHPS-5174', 'JH-PSB-26B/Big(Soup Box)', 'RAW_MATERIAL', 'pcs', 7.12, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  1, 
  'pcs', 
  7.12
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chicken Thigh
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-CHICK-9324', 'Chicken Thigh', 'RAW_MATERIAL', 'g', 0.07813, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  100, 
  'g', 
  7.813000000000001
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Wheat Noodle
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-WHEAT-1769', 'Wheat Noodle', 'RAW_MATERIAL', 'g', 0.068, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  50, 
  'g', 
  3.4000000000000004
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Carrot
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-CARRO-5022', 'Carrot', 'RAW_MATERIAL', 'g', 0.02188, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  20, 
  'g', 
  0.4376
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Scallion / Spring Onion
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-SCALL-3266', 'Scallion / Spring Onion', 'RAW_MATERIAL', 'g', 0.05, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  10, 
  'g', 
  0.5
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Cabbage
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-CABBA-9068', 'Cabbage', 'RAW_MATERIAL', 'g', 0.027, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  30, 
  'g', 
  0.8099999999999999
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chinese Celery
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-CHINE-6502', 'Chinese Celery', 'RAW_MATERIAL', 'g', 0.03, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  10, 
  'g', 
  0.3
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Garlic
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-GARLI-781', 'Garlic', 'RAW_MATERIAL', 'g', 0.07, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  10, 
  'g', 
  0.7000000000000001
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Shallot
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-SHALL-7970', 'Shallot', 'RAW_MATERIAL', 'g', 0.038, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  30, 
  'g', 
  1.14
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Asparagus bean(Long Beans)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-ASPAR-2433', 'Asparagus bean(Long Beans)', 'RAW_MATERIAL', 'g', 0.03, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  20, 
  'g', 
  0.6
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: King Rice Bran Oil 5 L
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-KING-5183', 'King Rice Bran Oil 5 L', 'RAW_MATERIAL', 'ml', 0.047, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  15, 
  'ml', 
  0.705
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Golden Mountain Soy Sauce
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-GOLDE-3786', 'Golden Mountain Soy Sauce', 'RAW_MATERIAL', 'ml', 0.055, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  15, 
  'ml', 
  0.825
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Healthy Boy Sweet Soy Sauce
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-HEALT-2400', 'Healthy Boy Sweet Soy Sauce', 'RAW_MATERIAL', 'ml', 0.08857, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  7, 
  'ml', 
  0.6199899999999999
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chicken Seasoning Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-CHICK-818', 'Chicken Seasoning Powder', 'RAW_MATERIAL', 'g', 0.07, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  5, 
  'g', 
  0.35000000000000003
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Salt
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-SALT-4910', 'Salt', 'RAW_MATERIAL', 'g', 0.015, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  3, 
  'g', 
  0.045
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Pure Refined Sugar
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-PURE-7242', 'Pure Refined Sugar', 'RAW_MATERIAL', 'g', 0.027, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  5, 
  'g', 
  0.135
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Black Pepper
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-BLACK-2195', 'Black Pepper', 'RAW_MATERIAL', 'g', 0.344, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  2, 
  'g', 
  0.688
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: JH-PSB-12B(Rice Box)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-JHPS-9852', 'JH-PSB-12B(Rice Box)', 'RAW_MATERIAL', 'pcs', 5.52, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  1, 
  'pcs', 
  5.52
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Rice Vermicelli Small
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-RICE-8480', 'Rice Vermicelli Small', 'RAW_MATERIAL', 'g', 0.06528, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  50, 
  'g', 
  3.2640000000000002
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chicken Thigh
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-CHICK-9434', 'Chicken Thigh', 'RAW_MATERIAL', 'g', 0.07813, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  100, 
  'g', 
  7.813000000000001
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Carrot
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-CARRO-6210', 'Carrot', 'RAW_MATERIAL', 'g', 0.02188, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  20, 
  'g', 
  0.4376
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Cabbage
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-CABBA-301', 'Cabbage', 'RAW_MATERIAL', 'g', 0.027, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  30, 
  'g', 
  0.8099999999999999
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Asparagus bean(Long Beans)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-ASPAR-5933', 'Asparagus bean(Long Beans)', 'RAW_MATERIAL', 'g', 0.03, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  20, 
  'g', 
  0.6
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Salt
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-SALT-1993', 'Salt', 'RAW_MATERIAL', 'g', 0.015, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  3, 
  'g', 
  0.045
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chicken Seasoning Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-CHICK-1340', 'Chicken Seasoning Powder', 'RAW_MATERIAL', 'g', 0.07, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  5, 
  'g', 
  0.35000000000000003
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Pure Refined Sugar
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-PURE-3584', 'Pure Refined Sugar', 'RAW_MATERIAL', 'g', 0.027, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  5, 
  'g', 
  0.135
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Golden Mountain Soy Sauce
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-GOLDE-3092', 'Golden Mountain Soy Sauce', 'RAW_MATERIAL', 'ml', 0.055, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  15, 
  'ml', 
  0.825
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Healthy Boy Sweet Soy Sauce
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-HEALT-4850', 'Healthy Boy Sweet Soy Sauce', 'RAW_MATERIAL', 'ml', 0.08857, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  7, 
  'ml', 
  0.6199899999999999
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Oyster Sauce
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-OYSTE-6132', 'Oyster Sauce', 'RAW_MATERIAL', 'ml', 0.0712, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  7, 
  'ml', 
  0.4984
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: King Rice Bran Oil 5 L
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-KING-7081', 'King Rice Bran Oil 5 L', 'RAW_MATERIAL', 'ml', 0.047, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  15, 
  'ml', 
  0.705
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Black Pepper
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-BLACK-1280', 'Black Pepper', 'RAW_MATERIAL', 'g', 0.344, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  3, 
  'g', 
  1.032
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Garlic
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-GARLI-3045', 'Garlic', 'RAW_MATERIAL', 'g', 0.07, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  10, 
  'g', 
  0.7000000000000001
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Shallot
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-SHALL-899', 'Shallot', 'RAW_MATERIAL', 'g', 0.038, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  30, 
  'g', 
  1.14
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: JH-PSB-12B(Rice Box)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-JHPS-2278', 'JH-PSB-12B(Rice Box)', 'RAW_MATERIAL', 'pcs', 5.52, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  1, 
  'pcs', 
  5.52
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Pork Ball
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-PORK-7182', 'Pork Ball', 'RAW_MATERIAL', 'g', 0.135, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  70, 
  'g', 
  9.450000000000001
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Rice Vermicelli Small
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-RICE-1178', 'Rice Vermicelli Small', 'RAW_MATERIAL', 'g', 0.06528, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  50, 
  'g', 
  3.2640000000000002
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Pork Soup Bone
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-PORK-5640', 'Pork Soup Bone', 'RAW_MATERIAL', 'g', 0.049, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  50, 
  'g', 
  2.45
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chinese Kale
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-CHINE-5476', 'Chinese Kale', 'RAW_MATERIAL', 'g', 0.04167, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  50, 
  'g', 
  2.0835
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Salt
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-SALT-5025', 'Salt', 'RAW_MATERIAL', 'g', 0.015, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  5, 
  'g', 
  0.075
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chicken Seasoning Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-CHICK-697', 'Chicken Seasoning Powder', 'RAW_MATERIAL', 'g', 0.07, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  5, 
  'g', 
  0.35000000000000003
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Pure Refined Sugar
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-PURE-9128', 'Pure Refined Sugar', 'RAW_MATERIAL', 'g', 0.027, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  5, 
  'g', 
  0.135
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Golden Mountain Soy Sauce
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-GOLDE-8728', 'Golden Mountain Soy Sauce', 'RAW_MATERIAL', 'ml', 0.055, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  7, 
  'ml', 
  0.385
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: JH-PSB-12B(Rice Box)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-JHPS-7101', 'JH-PSB-12B(Rice Box)', 'RAW_MATERIAL', 'pcs', 5.52, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  1, 
  'pcs', 
  5.52
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: JH-PSB-26B/Big(Soup Box)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-JHPS-5027', 'JH-PSB-26B/Big(Soup Box)', 'RAW_MATERIAL', 'pcs', 7.12, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  1, 
  'pcs', 
  7.12
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: JH-PSB-2B(Sauce Box)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-JHPS-2008', 'JH-PSB-2B(Sauce Box)', 'RAW_MATERIAL', 'pcs', 2.33, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  1, 
  'pcs', 
  2.33
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Bean Vermicelli
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-BEAN-6235', 'Bean Vermicelli', 'RAW_MATERIAL', 'g', 0.2125, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  40, 
  'g', 
  8.5
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Shrimp
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-SHRIM-914', 'Shrimp', 'RAW_MATERIAL', 'g', 0.22667, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  50, 
  'g', 
  11.3335
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Carrot
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-CARRO-6293', 'Carrot', 'RAW_MATERIAL', 'g', 0.02188, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  20, 
  'g', 
  0.4376
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chicken Seasoning Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-CHICK-2306', 'Chicken Seasoning Powder', 'RAW_MATERIAL', 'g', 0.07, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  5, 
  'g', 
  0.35000000000000003
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Tamarind Juice
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-TAMAR-870', 'Tamarind Juice', 'RAW_MATERIAL', 'ml', 0, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  7, 
  'ml', 
  0
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Fish Sauce
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-FISH-3953', 'Fish Sauce', 'RAW_MATERIAL', 'ml', 0.0414, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  7, 
  'ml', 
  0.2898
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: JH-PSB-12B(Rice Box)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-JHPS-2271', 'JH-PSB-12B(Rice Box)', 'RAW_MATERIAL', 'pcs', 5.52, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  1, 
  'pcs', 
  5.52
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: DK 082  / 16B ( Soup Box )
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-DK08-1767', 'DK 082  / 16B ( Soup Box )', 'RAW_MATERIAL', 'pcs', 7.12, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  1, 
  'pcs', 
  6
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: JH-PSB-2B(Sauce Box)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-JHPS-1692', 'JH-PSB-2B(Sauce Box)', 'RAW_MATERIAL', 'pcs', 2.33, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  1, 
  'pcs', 
  2.33
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Pork Tenderloin
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-PORK-8650', 'Pork Tenderloin', 'RAW_MATERIAL', 'g', 0.14152, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  70, 
  'g', 
  9.9064
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Rice Noodle
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-RICE-2799', 'Rice Noodle', 'RAW_MATERIAL', 'g', 0.08, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  50, 
  'g', 
  4
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Wa-Ooh Noodle
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-WAOO-1755', 'Wa-Ooh Noodle', 'RAW_MATERIAL', 'g', 0.09, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  20, 
  'g', 
  1.7999999999999998
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Carrot
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-CARRO-9379', 'Carrot', 'RAW_MATERIAL', 'g', 0.02188, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  10, 
  'g', 
  0.2188
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Cauliflower
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-CAULI-1400', 'Cauliflower', 'RAW_MATERIAL', 'g', 0.03, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  10, 
  'g', 
  0.3
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Baby Corn
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-BABY-7910', 'Baby Corn', 'RAW_MATERIAL', 'g', 0.0625, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  10, 
  'g', 
  0.625
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Bok Choy
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-BOKC-8946', 'Bok Choy', 'RAW_MATERIAL', 'g', 0.11, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  10, 
  'g', 
  1.1
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Quail egg
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-QUAIL-2323', 'Quail egg', 'RAW_MATERIAL', 'pcs', 1.14, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  2, 
  'pcs', 
  2.28
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Mala Paste
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-MALA-1556', 'Mala Paste', 'RAW_MATERIAL', 'g', 0.1, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  20, 
  'g', 
  2
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chicken Seasoning Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-CHICK-8582', 'Chicken Seasoning Powder', 'RAW_MATERIAL', 'g', 0.07, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  5, 
  'g', 
  0.35000000000000003
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: JH-PSB-26B/Big(Soup Box)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-JHPS-7739', 'JH-PSB-26B/Big(Soup Box)', 'RAW_MATERIAL', 'pcs', 7.12, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  1, 
  'pcs', 
  7.12
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: JH-PSB-12B(Rice Box)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-JHPS-5715', 'JH-PSB-12B(Rice Box)', 'RAW_MATERIAL', 'pcs', 5.52, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  1, 
  'pcs', 
  5.52
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: DK 082  / 16B ( Soup Box )
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-DK08-919', 'DK 082  / 16B ( Soup Box )', 'RAW_MATERIAL', 'pcs', 7.12, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  1, 
  'pcs', 
  7.12
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGN 0001')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: JH-PSB-2B(Sauce Box)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-JHPS-8631', 'JH-PSB-2B(Sauce Box)', 'RAW_MATERIAL', 'pcs', 2.33, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGN 0001'), 
  (SELECT id FROM item_id_cte), 
  1, 
  'pcs', 
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
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-CARRO-8935', 'Carrot', 'RAW_MATERIAL', 'g', 0.02188, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  30, 
  'g', 
  0.6564
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Cabbage
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-CABBA-6372', 'Cabbage', 'RAW_MATERIAL', 'g', 0.027, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  100, 
  'g', 
  2.7
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Cauliflower
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-CAULI-5349', 'Cauliflower', 'RAW_MATERIAL', 'g', 0.03, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  30, 
  'g', 
  0.8999999999999999
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Baby Corn
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-BABY-2204', 'Baby Corn', 'RAW_MATERIAL', 'g', 0.0625, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  20, 
  'g', 
  1.25
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Tomato
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-TOMAT-3879', 'Tomato', 'RAW_MATERIAL', 'g', 0.03, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  10, 
  'g', 
  0.3
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Garlic
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-GARLI-4644', 'Garlic', 'RAW_MATERIAL', 'g', 0.07, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  10, 
  'g', 
  0.7000000000000001
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Shallot
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-SHALL-8877', 'Shallot', 'RAW_MATERIAL', 'g', 0.038, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  30, 
  'g', 
  1.14
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: King Rice Bran Oil 5 L
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-KING-2869', 'King Rice Bran Oil 5 L', 'RAW_MATERIAL', 'ml', 0.047, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  15, 
  'ml', 
  0.705
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Salt
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-SALT-8992', 'Salt', 'RAW_MATERIAL', 'g', 0.015, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  5, 
  'g', 
  0.075
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chicken Seasoning Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-CHICK-800', 'Chicken Seasoning Powder', 'RAW_MATERIAL', 'g', 0.07, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  7, 
  'g', 
  0.49000000000000005
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Pure Refined Sugar
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-PURE-9813', 'Pure Refined Sugar', 'RAW_MATERIAL', 'g', 0.027, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  3, 
  'g', 
  0.081
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Golden Mountain Soy Sauce
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-GOLDE-8307', 'Golden Mountain Soy Sauce', 'RAW_MATERIAL', 'ml', 0.055, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  7, 
  'ml', 
  0.385
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Oyster Sauce
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-OYSTE-5325', 'Oyster Sauce', 'RAW_MATERIAL', 'ml', 0.0712, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  7, 
  'ml', 
  0.4984
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: JH-PSB-12B(Side Dish Box)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-JHPS-1452', 'JH-PSB-12B(Side Dish Box)', 'RAW_MATERIAL', 'pcs', 5.52, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  1, 
  'pcs', 
  5.52
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Cabbage (White Cabbage)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-CABBA-2464', 'Cabbage (White Cabbage)', 'RAW_MATERIAL', 'g', 0.035, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  150, 
  'g', 
  5.250000000000001
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Garlic
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-GARLI-4624', 'Garlic', 'RAW_MATERIAL', 'g', 0.07, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  10, 
  'g', 
  0.7000000000000001
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Salt
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-SALT-5301', 'Salt', 'RAW_MATERIAL', 'g', 0.015, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  3, 
  'g', 
  0.045
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Turmeric Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-TURME-9176', 'Turmeric Powder', 'RAW_MATERIAL', 'g', 0.276, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  2, 
  'g', 
  0.552
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chicken Seasoning Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-CHICK-2993', 'Chicken Seasoning Powder', 'RAW_MATERIAL', 'g', 0.07, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  3, 
  'g', 
  0.21000000000000002
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Oyster Sauce
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-OYSTE-5095', 'Oyster Sauce', 'RAW_MATERIAL', 'ml', 0.0712, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  5, 
  'ml', 
  0.356
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: JH-PSB-12B(Side Dish Box)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-JHPS-2062', 'JH-PSB-12B(Side Dish Box)', 'RAW_MATERIAL', 'pcs', 5.52, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  1, 
  'pcs', 
  5.52
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Bean Sprout
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-BEAN-8945', 'Bean Sprout', 'RAW_MATERIAL', 'g', 0.03, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  100, 
  'g', 
  3
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Shallot
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-SHALL-262', 'Shallot', 'RAW_MATERIAL', 'g', 0.038, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  20, 
  'g', 
  0.76
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Garlic
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-GARLI-519', 'Garlic', 'RAW_MATERIAL', 'g', 0.07, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  10, 
  'g', 
  0.7000000000000001
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: King Rice Bran Oil 5 L
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-KING-909', 'King Rice Bran Oil 5 L', 'RAW_MATERIAL', 'ml', 0.047, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  7, 
  'ml', 
  0.329
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Turmeric Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-TURME-2353', 'Turmeric Powder', 'RAW_MATERIAL', 'g', 0.276, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  1, 
  'g', 
  0.276
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Salt
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-SALT-3537', 'Salt', 'RAW_MATERIAL', 'g', 0.015, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  2, 
  'g', 
  0.03
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chicken Seasoning Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-CHICK-4455', 'Chicken Seasoning Powder', 'RAW_MATERIAL', 'g', 0.07, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  3, 
  'g', 
  0.21000000000000002
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: JH-PSB-12B(Side Dish Box)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-JHPS-124', 'JH-PSB-12B(Side Dish Box)', 'RAW_MATERIAL', 'pcs', 5.52, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  1, 
  'pcs', 
  5.52
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Water Spinach (Morning Glory)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-WATER-3606', 'Water Spinach (Morning Glory)', 'RAW_MATERIAL', 'g', 0.03, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  150, 
  'g', 
  4.5
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Tomato
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-TOMAT-2436', 'Tomato', 'RAW_MATERIAL', 'g', 0.03, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  30, 
  'g', 
  0.8999999999999999
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Green Chili
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-GREEN-8224', 'Green Chili', 'RAW_MATERIAL', 'g', 0.16, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  10, 
  'g', 
  1.6
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Garlic
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-GARLI-9378', 'Garlic', 'RAW_MATERIAL', 'g', 0.07, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  10, 
  'g', 
  0.7000000000000001
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chicken Seasoning Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-CHICK-1348', 'Chicken Seasoning Powder', 'RAW_MATERIAL', 'g', 0.07, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  5, 
  'g', 
  0.35000000000000003
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Golden Mountain Soy Sauce
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-GOLDE-3935', 'Golden Mountain Soy Sauce', 'RAW_MATERIAL', 'ml', 0.055, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  7, 
  'ml', 
  0.385
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Oyster Sauce
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-OYSTE-5405', 'Oyster Sauce', 'RAW_MATERIAL', 'ml', 0.0712, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  7, 
  'ml', 
  0.4984
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: King Rice Bran Oil 5 L
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-KING-3363', 'King Rice Bran Oil 5 L', 'RAW_MATERIAL', 'ml', 0.047, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  7, 
  'ml', 
  0.329
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: JH-PSB-12B(Side Dish Box)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-JHPS-651', 'JH-PSB-12B(Side Dish Box)', 'RAW_MATERIAL', 'pcs', 5.52, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  1, 
  'pcs', 
  5.52
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chinese Kale
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-CHINE-7005', 'Chinese Kale', 'RAW_MATERIAL', 'g', 0.04167, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  200, 
  'g', 
  8.334
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Oyster Sauce
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-OYSTE-4032', 'Oyster Sauce', 'RAW_MATERIAL', 'ml', 0.0712, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  34, 
  'ml', 
  2.4208
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Garlic
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-GARLI-5362', 'Garlic', 'RAW_MATERIAL', 'g', 0.07, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  10, 
  'g', 
  0.7000000000000001
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Pure Refined Sugar
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-PURE-8612', 'Pure Refined Sugar', 'RAW_MATERIAL', 'g', 0.027, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  6, 
  'g', 
  0.162
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chicken Seasoning Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-CHICK-2877', 'Chicken Seasoning Powder', 'RAW_MATERIAL', 'g', 0.07, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  3, 
  'g', 
  0.21000000000000002
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Golden Mountain Soy Sauce
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-GOLDE-4927', 'Golden Mountain Soy Sauce', 'RAW_MATERIAL', 'ml', 0.055, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  5, 
  'ml', 
  0.275
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: King Rice Bran Oil 5 L
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-KING-5903', 'King Rice Bran Oil 5 L', 'RAW_MATERIAL', 'ml', 0.047, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  7, 
  'ml', 
  0.329
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: JH-PSB-12B(Side Dish Box)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-JHPS-297', 'JH-PSB-12B(Side Dish Box)', 'RAW_MATERIAL', 'pcs', 5.52, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  1, 
  'pcs', 
  5.52
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Wood Ear Mushroom
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-WOOD-1275', 'Wood Ear Mushroom', 'RAW_MATERIAL', 'g', 0.13, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  100, 
  'g', 
  13
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Shallot
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-SHALL-7611', 'Shallot', 'RAW_MATERIAL', 'g', 0.038, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  20, 
  'g', 
  0.76
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Carrot
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-CARRO-4112', 'Carrot', 'RAW_MATERIAL', 'g', 0.02188, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  20, 
  'g', 
  0.4376
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Coriander (Cilantro)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-CORIA-8793', 'Coriander (Cilantro)', 'RAW_MATERIAL', 'g', 0.05, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  10, 
  'g', 
  0.5
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Green Chili
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-GREEN-288', 'Green Chili', 'RAW_MATERIAL', 'g', 0.16, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  10, 
  'g', 
  1.6
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Salt
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-SALT-8868', 'Salt', 'RAW_MATERIAL', 'g', 0.015, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  3, 
  'g', 
  0.045
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chicken Seasoning Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-CHICK-2490', 'Chicken Seasoning Powder', 'RAW_MATERIAL', 'g', 0.07, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  5, 
  'g', 
  0.35000000000000003
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Lime Juice
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-LIME-7016', 'Lime Juice', 'RAW_MATERIAL', 'ml', 0.025, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  7, 
  'ml', 
  0.17500000000000002
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: JH-PSB-12B(Side Dish Box)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-JHPS-7145', 'JH-PSB-12B(Side Dish Box)', 'RAW_MATERIAL', 'pcs', 5.52, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  1, 
  'pcs', 
  5.52
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Tomato
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-TOMAT-5824', 'Tomato', 'RAW_MATERIAL', 'g', 0.03, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  100, 
  'g', 
  3
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Shallot
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-SHALL-6046', 'Shallot', 'RAW_MATERIAL', 'g', 0.038, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  20, 
  'g', 
  0.76
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Garlic
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-GARLI-8774', 'Garlic', 'RAW_MATERIAL', 'g', 0.07, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  1, 
  'g', 
  0.07
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Green Chili
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-GREEN-5829', 'Green Chili', 'RAW_MATERIAL', 'g', 0.16, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  10, 
  'g', 
  1.6
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Coriander (Cilantro)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-CORIA-5059', 'Coriander (Cilantro)', 'RAW_MATERIAL', 'g', 0.05, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  20, 
  'g', 
  1
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chicken Seasoning Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-CHICK-4218', 'Chicken Seasoning Powder', 'RAW_MATERIAL', 'g', 0.07, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  5, 
  'g', 
  0.35000000000000003
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Salt
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-SALT-316', 'Salt', 'RAW_MATERIAL', 'g', 0.015, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  3, 
  'g', 
  0.045
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Lime
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-LIME-9179', 'Lime', 'RAW_MATERIAL', 'g', 0.05, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  5, 
  'g', 
  0.25
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: JH-PSB-12B(Side Dish Box)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-JHPS-8070', 'JH-PSB-12B(Side Dish Box)', 'RAW_MATERIAL', 'pcs', 5.52, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  1, 
  'pcs', 
  5.52
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: English Gourd
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-ENGLI-7687', 'English Gourd', 'RAW_MATERIAL', 'g', 0.05, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  200, 
  'g', 
  10
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Garlic
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-GARLI-1232', 'Garlic', 'RAW_MATERIAL', 'g', 0.07, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  1, 
  'g', 
  0.07
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: King Rice Bran Oil 5 L
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-KING-6111', 'King Rice Bran Oil 5 L', 'RAW_MATERIAL', 'ml', 0.047, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  7, 
  'ml', 
  0.33
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Chicken Seasoning Powder
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-CHICK-7213', 'Chicken Seasoning Powder', 'RAW_MATERIAL', 'g', 0.07, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  5, 
  'g', 
  0.35
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: Salt
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-SALT-6273', 'Salt', 'RAW_MATERIAL', 'g', 0.015, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  3, 
  'g', 
  0.05
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);

-- Item: JH-PSB-12B(Side Dish Box)
WITH new_item AS (
    INSERT INTO inventory.items (item_code, name_eng, category, unit_of_measure, cost_per_unit, min_quantity)
    SELECT 'ITM-JHPS-4714', 'JH-PSB-12B(Side Dish Box)', 'RAW_MATERIAL', 'pcs', 5.52, 0
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
    INSERT INTO inventory.balances (item_id, current_quantity)
    SELECT id, 0 FROM item_id_cte
    WHERE NOT EXISTS (SELECT 1 FROM inventory.balances WHERE item_id = (SELECT id FROM item_id_cte))
)
-- Insert Recipe link
INSERT INTO operations.recipes (menu_id, inventory_item_id, quantity, unit_of_measure, estimated_cost)
SELECT 
  (SELECT id FROM operations.menus WHERE code = 'FGV 0023'), 
  (SELECT id FROM item_id_cte), 
  1, 
  'pcs', 
  5.52
WHERE NOT EXISTS (
  SELECT 1 FROM operations.recipes 
  WHERE menu_id = (SELECT id FROM operations.menus WHERE code = 'FGV 0023')
  AND inventory_item_id = (SELECT id FROM item_id_cte)
);
