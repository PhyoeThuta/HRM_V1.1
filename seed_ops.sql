-- ============================================================
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
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('839c909e-96f7-47b3-8893-d77b86d682d1', 'Beef Lean', 'ITM-0001', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('839c909e-96f7-47b3-8893-d77b86d682d1', 0, 0, 0.24534) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('8965ba18-4356-4f1c-8eda-9f2795681e66', 'Bell Pepper', 'ITM-0002', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('8965ba18-4356-4f1c-8eda-9f2795681e66', 0, 0, 0.1) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('2bdb248d-8f35-4c45-a1e1-3dea762bcd94', 'King Rice Bran Oil 5 L', 'ITM-0003', 'RECIPE_INGREDIENT', 'ml') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('2bdb248d-8f35-4c45-a1e1-3dea762bcd94', 0, 0, 0.047) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('a0ad392c-3b7f-4217-a3b4-22fedcc2bc99', 'Turmeric Powder', 'ITM-0004', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('a0ad392c-3b7f-4217-a3b4-22fedcc2bc99', 0, 0, 0.276) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('c01fe50f-26ad-46b6-972b-27ecec429ee1', 'Chicken Seasoning Powder', 'ITM-0005', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('c01fe50f-26ad-46b6-972b-27ecec429ee1', 0, 0, 0.07) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('f8fdabc0-cffc-4c7a-b286-f6392af090b0', 'Chili Colored Powder', 'ITM-0006', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('f8fdabc0-cffc-4c7a-b286-f6392af090b0', 0, 0, 0.3125) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('cc2d53ee-f138-4bdb-95db-1e40679823bc', 'Salt', 'ITM-0007', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('cc2d53ee-f138-4bdb-95db-1e40679823bc', 0, 0, 0.015) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('2b661e27-86ae-4c6a-ae13-b98c047eaecc', 'Garlic', 'ITM-0008', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('2b661e27-86ae-4c6a-ae13-b98c047eaecc', 0, 0, 0.07) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('8bb99af8-f9e1-4608-aeb7-ad57cef4285f', 'Shallot', 'ITM-0009', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('8bb99af8-f9e1-4608-aeb7-ad57cef4285f', 0, 0, 0.038) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('5946adc7-8d68-40c0-93e4-eea19d293fed', 'Golden Mountain Soy Sauce', 'ITM-0010', 'RECIPE_INGREDIENT', 'ml') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('5946adc7-8d68-40c0-93e4-eea19d293fed', 0, 0, 0.055) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('51becdbb-ac1c-4f7c-a0c2-1ec23118cefc', 'Pure Refined Sugar', 'ITM-0011', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('51becdbb-ac1c-4f7c-a0c2-1ec23118cefc', 0, 0, 0.027) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('7423dfaa-f6fa-4ea3-8cb6-a0d0612c69ce', 'Ginger', 'ITM-0012', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('7423dfaa-f6fa-4ea3-8cb6-a0d0612c69ce', 0, 0, 0.04167) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('a654af6f-2afe-44b4-ab5d-9640b931b0e8', 'Rice', 'ITM-0013', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('a654af6f-2afe-44b4-ab5d-9640b931b0e8', 0, 0, 0.023) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('cc389a08-a88e-4f22-88de-25edab243484', 'Wa-Ooh Noodle', 'ITM-0014', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('cc389a08-a88e-4f22-88de-25edab243484', 0, 0, 0.09) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('a8b564ad-1ded-4fe9-a3b3-685686bceaa2', 'Peanut Butter', 'ITM-0015', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('a8b564ad-1ded-4fe9-a3b3-685686bceaa2', 0, 0, 0.285) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('35fcde15-6f41-4405-862f-b680b91acb87', 'Chinese Kale', 'ITM-0016', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('35fcde15-6f41-4405-862f-b680b91acb87', 0, 0, 0.04167) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('3908853d-cc15-4c72-943d-1a5f16793795', 'Mala Paste', 'ITM-0017', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('3908853d-cc15-4c72-943d-1a5f16793795', 0, 0, 0.1) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('18ccd0e1-2ac3-4d33-bd55-fe5ecf8b744f', 'Pork Soup Bone', 'ITM-0018', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('18ccd0e1-2ac3-4d33-bd55-fe5ecf8b744f', 0, 0, 0.049) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('e10b0819-1f8e-4c69-9840-05b5c42b88b3', 'Vinegar', 'ITM-0019', 'RECIPE_INGREDIENT', 'ml') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('e10b0819-1f8e-4c69-9840-05b5c42b88b3', 0, 0, 0.03) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('3c2943fc-9bf9-4209-950a-d656a94946fc', 'Pork Ball', 'ITM-0020', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('3c2943fc-9bf9-4209-950a-d656a94946fc', 0, 0, 0.135) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('c4b0b47e-b8f0-4657-84a9-98bbba3906c2', 'Carrot', 'ITM-0021', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('c4b0b47e-b8f0-4657-84a9-98bbba3906c2', 0, 0, 0.02188) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('bd7a57e2-fc33-4dcd-962f-1174965cf8b9', 'Cabbage', 'ITM-0022', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('bd7a57e2-fc33-4dcd-962f-1174965cf8b9', 0, 0, 0.027) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('4a943432-6954-463a-9690-3b8cbeb1f534', 'Cauliflower', 'ITM-0023', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('4a943432-6954-463a-9690-3b8cbeb1f534', 0, 0, 0.03) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('3f02c835-3c42-447e-b3d9-1d914c7d45f7', 'Baby Corn', 'ITM-0024', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('3f02c835-3c42-447e-b3d9-1d914c7d45f7', 0, 0, 0.0625) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('6829e5fe-fe69-4691-aba7-a38cce8c91e2', 'Tomato', 'ITM-0025', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('6829e5fe-fe69-4691-aba7-a38cce8c91e2', 0, 0, 0.03) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('6f0678ae-440b-41b2-a550-aaa383d14ff1', 'Oyster Sauce', 'ITM-0026', 'RECIPE_INGREDIENT', 'ml') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('6f0678ae-440b-41b2-a550-aaa383d14ff1', 0, 0, 0.0712) ON CONFLICT DO NOTHING;

-- Step 2: Master Menus
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('a76ba521-b711-4ddf-83cc-e5f3da416b8b', 'FGB 0002', 'Fried Beef with Bell Pepper', 'အမဲငရုတ်ပွ + ထမင်း', 120, 36.9379) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('92830642-24b9-4eb7-851a-ad3c8f401adf', 'FGN 0001', 'Wa Ou Noddle', 'ဝဥခေါက်ဆွဲ', 110, 30.5668) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('658d31b9-c32d-4805-b8df-84383c607d80', 'FGV 0023', 'Fried Mixed Vegetables', 'အစိမ်းကြော်', 45, 9.8808) ON CONFLICT DO NOTHING;

-- Step 3: Recipes (Bill of Materials)
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('a76ba521-b711-4ddf-83cc-e5f3da416b8b', '839c909e-96f7-47b3-8893-d77b86d682d1', 100, 24.5340);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('a76ba521-b711-4ddf-83cc-e5f3da416b8b', '8965ba18-4356-4f1c-8eda-9f2795681e66', 50, 5.0000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('a76ba521-b711-4ddf-83cc-e5f3da416b8b', '2bdb248d-8f35-4c45-a1e1-3dea762bcd94', 15, 0.7050);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('a76ba521-b711-4ddf-83cc-e5f3da416b8b', 'a0ad392c-3b7f-4217-a3b4-22fedcc2bc99', 2, 0.5520);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('a76ba521-b711-4ddf-83cc-e5f3da416b8b', 'c01fe50f-26ad-46b6-972b-27ecec429ee1', 5, 0.3500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('a76ba521-b711-4ddf-83cc-e5f3da416b8b', 'f8fdabc0-cffc-4c7a-b286-f6392af090b0', 3, 0.9375);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('a76ba521-b711-4ddf-83cc-e5f3da416b8b', 'cc2d53ee-f138-4bdb-95db-1e40679823bc', 3, 0.0450);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('a76ba521-b711-4ddf-83cc-e5f3da416b8b', '2b661e27-86ae-4c6a-ae13-b98c047eaecc', 10, 0.7000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('a76ba521-b711-4ddf-83cc-e5f3da416b8b', '8bb99af8-f9e1-4608-aeb7-ad57cef4285f', 30, 1.1400);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('a76ba521-b711-4ddf-83cc-e5f3da416b8b', '5946adc7-8d68-40c0-93e4-eea19d293fed', 7, 0.3850);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('a76ba521-b711-4ddf-83cc-e5f3da416b8b', '51becdbb-ac1c-4f7c-a0c2-1ec23118cefc', 3, 0.0810);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('a76ba521-b711-4ddf-83cc-e5f3da416b8b', '7423dfaa-f6fa-4ea3-8cb6-a0d0612c69ce', 5, 0.2083);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('a76ba521-b711-4ddf-83cc-e5f3da416b8b', 'a654af6f-2afe-44b4-ab5d-9640b931b0e8', 100, 2.3000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('92830642-24b9-4eb7-851a-ad3c8f401adf', 'cc389a08-a88e-4f22-88de-25edab243484', 100, 9.0000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('92830642-24b9-4eb7-851a-ad3c8f401adf', 'a8b564ad-1ded-4fe9-a3b3-685686bceaa2', 15, 4.2750);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('92830642-24b9-4eb7-851a-ad3c8f401adf', '35fcde15-6f41-4405-862f-b680b91acb87', 20, 0.8334);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('92830642-24b9-4eb7-851a-ad3c8f401adf', '3908853d-cc15-4c72-943d-1a5f16793795', 30, 3.0000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('92830642-24b9-4eb7-851a-ad3c8f401adf', '18ccd0e1-2ac3-4d33-bd55-fe5ecf8b744f', 50, 2.4500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('92830642-24b9-4eb7-851a-ad3c8f401adf', 'cc2d53ee-f138-4bdb-95db-1e40679823bc', 2, 0.0300);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('92830642-24b9-4eb7-851a-ad3c8f401adf', '51becdbb-ac1c-4f7c-a0c2-1ec23118cefc', 5, 0.1350);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('92830642-24b9-4eb7-851a-ad3c8f401adf', 'c01fe50f-26ad-46b6-972b-27ecec429ee1', 5, 0.3500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('92830642-24b9-4eb7-851a-ad3c8f401adf', 'e10b0819-1f8e-4c69-9840-05b5c42b88b3', 15, 0.4500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('92830642-24b9-4eb7-851a-ad3c8f401adf', '7423dfaa-f6fa-4ea3-8cb6-a0d0612c69ce', 5, 0.2083);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('92830642-24b9-4eb7-851a-ad3c8f401adf', '3c2943fc-9bf9-4209-950a-d656a94946fc', 70, 9.4500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('92830642-24b9-4eb7-851a-ad3c8f401adf', '5946adc7-8d68-40c0-93e4-eea19d293fed', 7, 0.3850);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('658d31b9-c32d-4805-b8df-84383c607d80', 'c4b0b47e-b8f0-4657-84a9-98bbba3906c2', 30, 0.6564);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('658d31b9-c32d-4805-b8df-84383c607d80', 'bd7a57e2-fc33-4dcd-962f-1174965cf8b9', 100, 2.7000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('658d31b9-c32d-4805-b8df-84383c607d80', '4a943432-6954-463a-9690-3b8cbeb1f534', 30, 0.9000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('658d31b9-c32d-4805-b8df-84383c607d80', '3f02c835-3c42-447e-b3d9-1d914c7d45f7', 20, 1.2500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('658d31b9-c32d-4805-b8df-84383c607d80', '6829e5fe-fe69-4691-aba7-a38cce8c91e2', 10, 0.3000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('658d31b9-c32d-4805-b8df-84383c607d80', '2b661e27-86ae-4c6a-ae13-b98c047eaecc', 10, 0.7000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('658d31b9-c32d-4805-b8df-84383c607d80', '8bb99af8-f9e1-4608-aeb7-ad57cef4285f', 30, 1.1400);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('658d31b9-c32d-4805-b8df-84383c607d80', '2bdb248d-8f35-4c45-a1e1-3dea762bcd94', 15, 0.7050);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('658d31b9-c32d-4805-b8df-84383c607d80', 'cc2d53ee-f138-4bdb-95db-1e40679823bc', 5, 0.0750);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('658d31b9-c32d-4805-b8df-84383c607d80', 'c01fe50f-26ad-46b6-972b-27ecec429ee1', 7, 0.4900);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('658d31b9-c32d-4805-b8df-84383c607d80', '51becdbb-ac1c-4f7c-a0c2-1ec23118cefc', 3, 0.0810);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('658d31b9-c32d-4805-b8df-84383c607d80', '5946adc7-8d68-40c0-93e4-eea19d293fed', 7, 0.3850);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('658d31b9-c32d-4805-b8df-84383c607d80', '6f0678ae-440b-41b2-a550-aaa383d14ff1', 7, 0.4984);

-- Step 4: Daily Menu Plan (Monthly Calendar)
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('ab98e366-5364-437c-a13e-5d2fad8ab542', '2026-06-01', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('11295c7e-48ec-4df9-b505-6f1ed1d1d4a0', '2026-06-01', true, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('dd20cb9b-8f99-4180-8a55-d0f6ce7c50ef', '2026-06-02', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('7c4498c0-3184-41eb-a756-3c4323fc7657', '2026-06-02', true, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('94c06c9d-2956-462a-afce-fe5f4da0fb7e', '2026-06-03', false, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('839febf8-1be4-43f8-93e8-ef590fe13a78', '2026-06-03', true, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('2811f730-aea0-4ece-b3c7-be02807422b4', '2026-06-04', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('7c739c5f-8007-4ed3-903f-0918233ca33e', '2026-06-04', true, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('ef4f8d1d-86d8-43e4-bdb4-8a333b3c3b66', '2026-06-05', false, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('4e1e79dd-611c-47f1-9e51-e0b4893dcc0a', '2026-06-05', true, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('68e0d408-199b-4671-9a2b-08ab01203da6', '2026-06-06', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('da5f6e7f-98d9-4e05-a3a8-d56670cf8e2c', '2026-06-06', false, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('41863eb2-e9f5-4e7f-b922-639ed58690d6', '2026-06-08', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('300c0139-e072-4599-91b1-19cfa68fe991', '2026-06-08', false, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('31781280-5686-4d76-be47-6828fad8cb0c', '2026-06-09', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('cc4cefcf-93ea-4fbf-9a2f-2c95877cb854', '2026-06-09', false, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('f318cc6e-e64f-48de-8717-2466c5319917', '2026-06-10', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('946aa0c8-82be-47c3-b4c0-1cff23da9775', '2026-06-10', false, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('e77546dc-a1c4-4a71-bf2e-64f49f90b9df', '2026-06-11', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('5fd38567-5361-45cd-84d8-c565b899ceb6', '2026-06-11', false, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('1d3ef040-a5ed-45bf-b4a1-ae196b8ab21e', '2026-06-12', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('9c3d26ec-de3a-4b00-a534-bdee139b3e23', '2026-06-12', false, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('7fba652a-1fa7-4631-b63b-b83b62cd0db7', '2026-06-13', false, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('67fdaae9-70fc-40d8-8f49-3b9224a19ea6', '2026-06-13', true, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('749cc2da-1e7e-4868-b9b5-a92873c4a7f6', '2026-06-15', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('acf1e59e-2d3a-4870-804f-501603071742', '2026-06-15', true, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('c3049786-4f4c-4c8b-bb3d-580cb12c253b', '2026-06-16', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('3951aed8-ca81-46f3-a38c-f38a483e8559', '2026-06-16', false, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('d122f956-5334-4cc2-9bd7-49bd8078b2f4', '2026-06-17', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('a1813eae-6b09-4b42-a4af-9d5b3cba915b', '2026-06-17', false, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('ca853c81-597b-43ac-9fc7-5ab7cedef3bc', '2026-06-18', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('da741dc0-01ef-484f-94aa-82e2008404f1', '2026-06-18', false, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('1510b336-b4ab-4389-83e3-0610229530c7', '2026-06-19', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('e45c6937-916e-49d6-ac31-ef96bedd6615', '2026-06-19', true, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('cbb6d052-f85c-4e82-a342-05172d4a4cab', '2026-06-20', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('c1ebc8e2-a403-43d2-997e-071fe6365326', '2026-06-20', false, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('9d2378c8-f474-42ea-8b46-dfd8d498f777', '2026-06-22', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('bf04e61a-726a-4da8-bdf3-87521328ac83', '2026-06-22', false, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('500a6345-18eb-431c-b369-8aea8961775f', '2026-06-23', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('7773d846-bfe8-42ca-8f96-a28ebf62add2', '2026-06-23', false, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('d4714397-5531-4312-b841-1a89cfd37356', '2026-06-24', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('f90a09fe-2153-4558-ad6d-93b5d2c11e5f', '2026-06-24', true, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('7b2958ba-a8a4-410e-a8ca-d8311b1a639f', '2026-06-25', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('48ebe04e-255f-486f-a89f-7b606ef52c87', '2026-06-25', false, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('edcf0d34-d5c2-4a20-8613-fbfcab35211a', '2026-06-26', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('a6ed9423-2a45-45dd-a6a1-461d3347a58c', '2026-06-26', false, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('0f357f71-4fc3-46e1-bf32-bd6921ea180d', '2026-06-27', false, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('fd5dd806-75b6-403f-86ec-667f3581a361', '2026-06-27', true, 'DINNER') ON CONFLICT DO NOTHING;

-- Step 5: Menu Types (which menus are scheduled per daily menu)
-- Uncosted item: ဝက်ကချင်ချက် for 2026-06-01 LUNCH
-- Uncosted item: ‌ဇူကာညွန့်ကြော်ချက် for 2026-06-01 LUNCH
-- Soup/drink (uncosted): မုန်လာရွက်ချဉ်ဟင်း for 2026-06-01 LUNCH
-- Uncosted item: ဝက်ကုန်းဘောင် for 2026-06-01 DINNER
-- Uncosted item: ‌ဇူကာညွန့်ကြော်ချက် for 2026-06-01 DINNER
-- Uncosted item: ငါးဖယ်သုပ် for 2026-06-02 LUNCH
-- Uncosted item: ဂေါ်ရခါးသီးကြော် for 2026-06-02 LUNCH
-- Soup/drink (uncosted): ပဲနီလေးဟင်းချို for 2026-06-02 LUNCH
-- Uncosted item: ငါးဖယ်ခရမ်းချဉ်သီး for 2026-06-02 DINNER
-- Uncosted item: ဂေါ်ရခါးသီးကြော် for 2026-06-02 DINNER
-- Uncosted item: ကြက်ပေါင်း for 2026-06-03 LUNCH
-- Uncosted item: Cesar Salad for 2026-06-03 LUNCH
-- Uncosted item: ဖရုံသီးမုန့် for 2026-06-03 LUNCH
-- Uncosted item: ကြက်ကင်ထောင်း for 2026-06-03 DINNER
-- Uncosted item: Cesar Salad for 2026-06-03 DINNER
-- Uncosted item: ဖရုံသီးမုန့် for 2026-06-03 DINNER
-- Soup/drink (uncosted): ကြက်ရိုးမှိုဟင်းရည် for 2026-06-03 DINNER
-- Uncosted item: ပုဇွန်မဆလာချက် for 2026-06-04 LUNCH
-- Uncosted item: ခရမ်းသီးနှပ် for 2026-06-04 LUNCH
-- Soup/drink (uncosted): မြင်းခွာရွက်ဟင်းခါး for 2026-06-04 LUNCH
-- Uncosted item: ပုဇွန်ငရုတ်ပွ for 2026-06-04 DINNER
-- Uncosted item: ခရမ်းသီးနှပ် for 2026-06-04 DINNER
-- Uncosted item: ငါးကင် for 2026-06-05 LUNCH
-- Uncosted item: ဂေါ်ရခါးသီးကြော် for 2026-06-05 LUNCH
-- Uncosted item: ငရုတ်သီးဆားထောင်း for 2026-06-05 LUNCH
-- Soup/drink (uncosted): ငါးချဉ်စပ်ဟင်းရည် for 2026-06-05 LUNCH
-- Uncosted item: ငါးထမင်းနယ် for 2026-06-05 DINNER
-- Uncosted item: ဂေါ်ရခါးသီးကြော် for 2026-06-05 DINNER
-- Uncosted item: ငရုတ်သီးဆားထောင်း for 2026-06-05 DINNER
-- Uncosted item: ကင်းမွန်မဆလာ for 2026-06-06 LUNCH
-- Uncosted item: မြင်းခွာရွက်သုပ် for 2026-06-06 LUNCH
-- Uncosted item: Oats ဆနွင်းမကင်း for 2026-06-06 LUNCH
-- Soup/drink (uncosted): တုန်ယမ်းဟင်းရည် for 2026-06-06 LUNCH
-- Uncosted item: ကင်းမွန်ငရုတ်ပွ for 2026-06-06 DINNER
-- Uncosted item: မြင်းခွာရွက်သုပ် for 2026-06-06 DINNER
-- Uncosted item: Oats ဆနွင်းမကင်း for 2026-06-06 DINNER
-- Uncosted item: ကြက်သား+ဘူးသီး for 2026-06-08 LUNCH
-- Uncosted item: ကန်စွန်းရွက်ကြော် for 2026-06-08 LUNCH
-- Uncosted item: ငရုတ်သီးထောင်း for 2026-06-08 LUNCH
-- Uncosted item: ကြက်သားကြာဇံချက် for 2026-06-08 DINNER
-- Uncosted item: ကန်စွန်းရွက်ကြော် for 2026-06-08 DINNER
-- Uncosted item: ဝက်သားမျှစ်ချို for 2026-06-09 LUNCH
-- Uncosted item: ဆလပ်ရွက်သုပ် for 2026-06-09 LUNCH
-- Soup/drink (uncosted): ပဲပင်ပေါက်ဟင်းခါး for 2026-06-09 LUNCH
-- Uncosted item: ဝက်သားလုံးကြေးအိုး for 2026-06-09 DINNER
-- Uncosted item: ဆလပ်ရွက်သုပ် for 2026-06-09 DINNER
-- Uncosted item: ငါးမန်ကျည်းရွက်ချဉ်ဟင်း for 2026-06-10 LUNCH
-- Uncosted item: ‌ဇူကာညွန့်ကြော်ချက် for 2026-06-10 LUNCH
-- Uncosted item: ဂျုံကြက်ဉလိပ် for 2026-06-10 LUNCH
-- Soup/drink (uncosted): ငါးချဉ်စပ်ဟင်းရည် for 2026-06-10 LUNCH
-- Uncosted item: ငါးသံပုရာပေါင်း for 2026-06-10 DINNER
-- Uncosted item: ‌ဇူကာညွန့်ကြော်ချက် for 2026-06-10 DINNER
-- Uncosted item: ဂျုံကြက်ဉလိပ် for 2026-06-10 DINNER
-- Uncosted item: ရေဘဝဲချဉ်စပ် for 2026-06-11 LUNCH
-- Uncosted item: ပန်းဂေါ်ဖီကြော် for 2026-06-11 LUNCH
-- Soup/drink (uncosted): ဂေါ်ဖီဟင်းခါး for 2026-06-11 LUNCH
-- Uncosted item: ပင်လယ်စာပဲကြာဇံသုပ် for 2026-06-11 DINNER
-- Uncosted item: ပန်းဂေါ်ဖီကြော် for 2026-06-11 DINNER
-- Uncosted item: ကြက်သားမဆလာချက် for 2026-06-12 LUNCH
-- Uncosted item: ကိုက်လန်ခရုဆီ for 2026-06-12 LUNCH
-- Soup/drink (uncosted): မှိုချဉ်စပ်ဟင်းရည် for 2026-06-12 LUNCH
-- Uncosted item: Chicken Steak with Vegetables for 2026-06-12 DINNER
-- Uncosted item: ကိုက်လန်ခရုဆီ for 2026-06-12 DINNER
-- Uncosted item: ပုဇွန်ကင် for 2026-06-13 LUNCH
-- Uncosted item: ဥနီသုပ် for 2026-06-13 LUNCH
-- Uncosted item: သာ‌‌ခွေယိုင် for 2026-06-13 LUNCH
-- Uncosted item: ပုဇွန်ချဉ်စပ် for 2026-06-13 DINNER
-- Uncosted item: ဥနီသုပ် for 2026-06-13 DINNER
-- Uncosted item: သာ‌‌ခွေယိုင် for 2026-06-13 DINNER
-- Soup/drink (uncosted): ဝက်ရိုးချဉ်စပ် for 2026-06-13 DINNER
-- Uncosted item: ဝက်ချိုချဉ် for 2026-06-15 LUNCH
-- Uncosted item: ပန်းဂေါ်ဖီကြော် for 2026-06-15 LUNCH
-- Soup/drink (uncosted): ဝက်ရိုးချဉ်စပ် for 2026-06-15 LUNCH
-- Uncosted item: ဝက်သားထမင်းပေါင်း for 2026-06-15 DINNER
-- Uncosted item: ပန်းဂေါ်ဖီကြော် for 2026-06-15 DINNER
-- Uncosted item: ကြက်ကုန်းဘောင် for 2026-06-16 LUNCH
-- Uncosted item: မြင်းခွာရွက်သုပ် for 2026-06-16 LUNCH
-- Uncosted item: ငရုတ်သီးဆားထောင်း for 2026-06-16 LUNCH
-- Soup/drink (uncosted): ကြက်ရိုးမှိုဟင်းရည် for 2026-06-16 LUNCH
-- Uncosted item: ကြက်ပဲရည်သုပ် for 2026-06-16 DINNER
-- Uncosted item: မြင်းခွာရွက်သုပ် for 2026-06-16 DINNER
-- Uncosted item: ငါးပေါင်း(ကကတစ်) for 2026-06-17 LUNCH
-- Uncosted item: ထိုင်ဝမ်မုန်ညှင်းကြော် for 2026-06-17 LUNCH
-- Uncosted item: ကန်စွန်းဥသာကူ for 2026-06-17 LUNCH
-- Soup/drink (uncosted): ငါးချဉ်စပ်ဟင်းရည် for 2026-06-17 LUNCH
-- Uncosted item: ငါး+မုန်လာဉချဉ်ဟင်း for 2026-06-17 DINNER
-- Uncosted item: ထိုင်ဝမ်မုန်ညှင်းကြော် for 2026-06-17 DINNER
-- Uncosted item: ကန်စွန်းဥသာကူ for 2026-06-17 DINNER
-- Uncosted item: ဝက်ချိုချက် for 2026-06-18 LUNCH
-- Uncosted item: ခရမ်းချဉ်သီးသုပ် for 2026-06-18 LUNCH
-- Soup/drink (uncosted): မြင်းခွာရွက်ဟင်းခါး for 2026-06-18 LUNCH
-- Uncosted item: ခေါက်ဆွဲကြော်(ဝက်) for 2026-06-18 DINNER
-- Uncosted item: ခရမ်းချဉ်သီးသုပ် for 2026-06-18 DINNER
-- Uncosted item: ကင်းမွန်ကွင်းသုပ် for 2026-06-19 LUNCH
-- Uncosted item: ခရမ်းသီးနှပ် for 2026-06-19 LUNCH
-- Soup/drink (uncosted): ငါးခေါင်းချဉ်စပ်ဟင်းရည် for 2026-06-19 LUNCH
-- Uncosted item: ပင်လယ်စာစုံထောင်း for 2026-06-19 DINNER
-- Uncosted item: ခရမ်းသီးနှပ် for 2026-06-19 DINNER
-- Uncosted item: ထမင်းသုပ်+ကြက်ကင် for 2026-06-20 LUNCH
-- Uncosted item: ဂေါ်ဖီ+ဥနီကြော် for 2026-06-20 LUNCH
-- Uncosted item: ငှက်ပျောပေါင်း for 2026-06-20 LUNCH
-- Soup/drink (uncosted): ကန်စွန်းရွက်ချဉ်ဟင်း for 2026-06-20 LUNCH
-- Uncosted item: ပဲကြာဇံကြက်ပေါင်း for 2026-06-20 DINNER
-- Uncosted item: ဂေါ်ဖီ+ဥနီကြော် for 2026-06-20 DINNER
-- Uncosted item: ငှက်ပျောပေါင်း for 2026-06-20 DINNER
-- Uncosted item: ဝက်သားသရက်သီးချက် for 2026-06-22 LUNCH
-- Uncosted item: ခရမ်းသီးမီးဖုတ်သုပ် for 2026-06-22 LUNCH
-- Soup/drink (uncosted): ပဲနီလေးဟင်းချို for 2026-06-22 LUNCH
-- Uncosted item: ဝက်သားကြာဇံကြော် for 2026-06-22 DINNER
-- Uncosted item: ခရမ်းသီးမီးဖုတ်သုပ် for 2026-06-22 DINNER
-- Uncosted item: ကြက်သားပိန္နဲသီးချက် for 2026-06-23 LUNCH
INSERT INTO operations.menu_types (id, menu_id, daily_menus_id, is_main) VALUES ('4fdda3fa-eb27-48d5-b2a6-ad6d46229f6f', '658d31b9-c32d-4805-b8df-84383c607d80', '500a6345-18eb-431c-b369-8aea8961775f', false) ON CONFLICT DO NOTHING;
-- Uncosted item: ကြက်ပေါင်းခေါက်ဆွဲ for 2026-06-23 DINNER
INSERT INTO operations.menu_types (id, menu_id, daily_menus_id, is_main) VALUES ('9829d6e0-7f6b-41f4-9f2f-a8691635724e', '658d31b9-c32d-4805-b8df-84383c607d80', '7773d846-bfe8-42ca-8f96-a28ebf62add2', false) ON CONFLICT DO NOTHING;
-- Uncosted item: ပုဇွန်ကြက်ဉချက် for 2026-06-24 LUNCH
-- Uncosted item: ဂေါ်ဖီ+ဥနီကြော် for 2026-06-24 LUNCH
-- Uncosted item: Oats ဆနွင်းမကင်း for 2026-06-24 LUNCH
-- Soup/drink (uncosted): တုန်ယမ်းဟင်းရည် for 2026-06-24 LUNCH
-- Uncosted item: ပုဇွန်ငရုတ်သီးစိမ်း for 2026-06-24 DINNER
-- Uncosted item: ဂေါ်ဖီ+ဥနီကြော် for 2026-06-24 DINNER
-- Uncosted item: Oats ဆနွင်းမကင်း for 2026-06-24 DINNER
-- Uncosted item: ငါးခရမ်းချဉ်သီးငပိချက် for 2026-06-25 LUNCH
-- Uncosted item: ကိုက်လန်ခရုဆီ for 2026-06-25 LUNCH
-- Soup/drink (uncosted): မှိုဟင်းရည် for 2026-06-25 LUNCH
-- Uncosted item: Baked fish with vegetables for 2026-06-25 DINNER
-- Uncosted item: ကိုက်လန်ခရုဆီ for 2026-06-25 DINNER
-- Uncosted item: ဝက်သားအိုးကြီးချက် for 2026-06-26 LUNCH
-- Uncosted item: မှိုအစပ်ကြော် for 2026-06-26 LUNCH
-- Uncosted item: - for 2026-06-26 LUNCH
-- Soup/drink (uncosted): စွန်တန်ဟင်းရည် for 2026-06-26 LUNCH
-- Uncosted item: Grilled Pork with Vegetables for 2026-06-26 DINNER
-- Uncosted item: မှိုအစပ်ကြော် for 2026-06-26 DINNER
-- Uncosted item: - for 2026-06-26 DINNER
-- Soup/drink (uncosted): စွန်တန်ဟင်းရည် for 2026-06-26 DINNER
-- Uncosted item: ကြက်သားမျှစ်ချိုချက် for 2026-06-27 LUNCH
-- Uncosted item: သရက်သီးသုပ် for 2026-06-27 LUNCH
-- Uncosted item: မုန့်ဦးနှောက် for 2026-06-27 LUNCH
-- Soup/drink (uncosted): ကြက်ရိုးမှိုဟင်းရည် for 2026-06-27 LUNCH
-- Uncosted item: ကြက်သားဒံပေါက် for 2026-06-27 DINNER
-- Uncosted item: သရက်သီးသုပ် for 2026-06-27 DINNER
-- Uncosted item: မုန့်ဦးနှောက် for 2026-06-27 DINNER
