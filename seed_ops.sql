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
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('c4a1f3cc-4f00-47bf-9f2c-59d8adea08b2', 'Beef Lean', 'ITM-0001', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('c4a1f3cc-4f00-47bf-9f2c-59d8adea08b2', 0, 0, 0.24534) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('7b895bba-0f1b-43b6-9335-a1eb550428df', 'Bell Pepper', 'ITM-0002', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('7b895bba-0f1b-43b6-9335-a1eb550428df', 0, 0, 0.1) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('3023d2f9-6948-4dd7-800a-09644ec6702a', 'King Rice Bran Oil 5 L', 'ITM-0003', 'RECIPE_INGREDIENT', 'ml') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('3023d2f9-6948-4dd7-800a-09644ec6702a', 0, 0, 0.047) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('9f5eac53-56e2-4502-a8e7-58aaa40f6351', 'Turmeric Powder', 'ITM-0004', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('9f5eac53-56e2-4502-a8e7-58aaa40f6351', 0, 0, 0.276) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('545d1594-fca4-4c97-b1c2-3517979b74b0', 'Chicken Seasoning Powder', 'ITM-0005', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('545d1594-fca4-4c97-b1c2-3517979b74b0', 0, 0, 0.07) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('9d7eacd1-9035-4348-9296-3ea3dd75bdba', 'Chili Colored Powder', 'ITM-0006', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('9d7eacd1-9035-4348-9296-3ea3dd75bdba', 0, 0, 0.3125) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('d6c3dd1a-8388-44f3-8945-7abfb4dc45cc', 'Salt', 'ITM-0007', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('d6c3dd1a-8388-44f3-8945-7abfb4dc45cc', 0, 0, 0.015) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('743169d3-09f9-4f18-b2d0-06b24a6635cf', 'Garlic', 'ITM-0008', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('743169d3-09f9-4f18-b2d0-06b24a6635cf', 0, 0, 0.07) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('3c5808ee-0f35-4c5b-bbbe-15b8dbb0ee5d', 'Shallot', 'ITM-0009', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('3c5808ee-0f35-4c5b-bbbe-15b8dbb0ee5d', 0, 0, 0.038) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('3ee7861c-0bb7-4ead-a661-0b3aadd49bf0', 'Golden Mountain Soy Sauce', 'ITM-0010', 'RECIPE_INGREDIENT', 'ml') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('3ee7861c-0bb7-4ead-a661-0b3aadd49bf0', 0, 0, 0.055) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('ad4dc646-ff21-4a64-9a55-171eec0e4124', 'Pure Refined Sugar', 'ITM-0011', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('ad4dc646-ff21-4a64-9a55-171eec0e4124', 0, 0, 0.027) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('443ad6bd-deec-44c2-aa18-5d0d424318d8', 'Ginger', 'ITM-0012', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('443ad6bd-deec-44c2-aa18-5d0d424318d8', 0, 0, 0.04167) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('c0ff7acf-b0cb-48c7-8899-bfded54defbf', 'Rice', 'ITM-0013', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('c0ff7acf-b0cb-48c7-8899-bfded54defbf', 0, 0, 0.023) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('3033d6a5-9d4b-4998-9515-5fce93f9b0b0', 'Wa-Ooh Noodle', 'ITM-0014', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('3033d6a5-9d4b-4998-9515-5fce93f9b0b0', 0, 0, 0.09) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('5dda615f-4910-4c16-af79-a6cfcaa19b68', 'Peanut Butter', 'ITM-0015', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('5dda615f-4910-4c16-af79-a6cfcaa19b68', 0, 0, 0.285) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('2e30024b-87eb-4511-9aa9-a4f23be05a34', 'Chinese Kale', 'ITM-0016', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('2e30024b-87eb-4511-9aa9-a4f23be05a34', 0, 0, 0.04167) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('4feba017-01ae-4527-b65d-a5b5ccee1a9c', 'Mala Paste', 'ITM-0017', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('4feba017-01ae-4527-b65d-a5b5ccee1a9c', 0, 0, 0.1) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('7be460c5-ebea-44e2-89b2-e9e152e1ac88', 'Pork Soup Bone', 'ITM-0018', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('7be460c5-ebea-44e2-89b2-e9e152e1ac88', 0, 0, 0.049) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('fef13436-e32b-4887-9d58-b365b23d9833', 'Vinegar', 'ITM-0019', 'RECIPE_INGREDIENT', 'ml') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('fef13436-e32b-4887-9d58-b365b23d9833', 0, 0, 0.03) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('481164db-60f1-479e-964f-25ccf7e2bd4e', 'Pork Ball', 'ITM-0020', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('481164db-60f1-479e-964f-25ccf7e2bd4e', 0, 0, 0.135) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('6ccf9499-e126-4423-acdc-6991f85ec867', 'Carrot', 'ITM-0021', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('6ccf9499-e126-4423-acdc-6991f85ec867', 0, 0, 0.02188) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('607d0b1a-4cd6-4771-b2ab-d7b8a962400b', 'Cabbage', 'ITM-0022', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('607d0b1a-4cd6-4771-b2ab-d7b8a962400b', 0, 0, 0.027) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('66f6a711-3926-46e0-9c92-a00db7c29e89', 'Cauliflower', 'ITM-0023', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('66f6a711-3926-46e0-9c92-a00db7c29e89', 0, 0, 0.03) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('e425a385-71ff-4a45-8afa-1caef1d4fb7c', 'Baby Corn', 'ITM-0024', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('e425a385-71ff-4a45-8afa-1caef1d4fb7c', 0, 0, 0.0625) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('fe632b6a-f208-4613-93fb-059475359395', 'Tomato', 'ITM-0025', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('fe632b6a-f208-4613-93fb-059475359395', 0, 0, 0.03) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('69b078ed-0f2d-488e-b293-827c83afebe4', 'Oyster Sauce', 'ITM-0026', 'RECIPE_INGREDIENT', 'ml') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('69b078ed-0f2d-488e-b293-827c83afebe4', 0, 0, 0.0712) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('8a556644-7f7c-40d9-9923-65bd33cbc954', 'Pork Tenderloin', 'ITM-0027', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('8a556644-7f7c-40d9-9923-65bd33cbc954', 0, 0, 0.14152) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('623c146b-1e73-4702-adbf-5642951e2751', 'French Bean', 'ITM-0028', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('623c146b-1e73-4702-adbf-5642951e2751', 0, 0, 0.045) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('8bdbd477-11c8-4d63-b0e0-a2d96f257020', 'Scallion / Spring Onion', 'ITM-0029', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('8bdbd477-11c8-4d63-b0e0-a2d96f257020', 0, 0, 0.05) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('a73fa0e9-2dcb-4c0b-8393-f2f73a37ca01', 'Broccoli', 'ITM-0030', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('a73fa0e9-2dcb-4c0b-8393-f2f73a37ca01', 0, 0, 0.075) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('14a598c4-fbb7-48f0-826a-829170c06fa0', 'Healthy Boy Sweet Soy Sauce', 'ITM-0031', 'RECIPE_INGREDIENT', 'ml') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('14a598c4-fbb7-48f0-826a-829170c06fa0', 0, 0, 0.08857) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('2b31b744-202b-4115-8bf3-54a8c92faac0', 'Black Pepper', 'ITM-0032', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('2b31b744-202b-4115-8bf3-54a8c92faac0', 0, 0, 0.344) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('c4d1c142-c724-4d93-9ea0-7c901d50c487', 'Dried Chili', 'ITM-0033', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('c4d1c142-c724-4d93-9ea0-7c901d50c487', 0, 0, 0.4) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('068d70a3-9b22-46ab-9396-d2e0b12239c7', 'Chicken Thigh', 'ITM-0034', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('068d70a3-9b22-46ab-9396-d2e0b12239c7', 0, 0, 0.07813) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('8a1bca77-d322-4946-ba09-2f6b5d3f2f1a', 'Wheat Noodle', 'ITM-0035', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('8a1bca77-d322-4946-ba09-2f6b5d3f2f1a', 0, 0, 0.068) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('6d816d1a-64d8-4cd5-921c-1fdcfceb86b2', 'Chinese Celery', 'ITM-0036', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('6d816d1a-64d8-4cd5-921c-1fdcfceb86b2', 0, 0, 0.03) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('56a8830f-8a29-4006-aff6-6631df03590e', 'Asparagus bean(Long Beans)', 'ITM-0037', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('56a8830f-8a29-4006-aff6-6631df03590e', 0, 0, 0.03) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('633aa382-c3a2-4f1c-8e59-0478dbddfcb4', 'Cabbage (White Cabbage)', 'ITM-0038', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('633aa382-c3a2-4f1c-8e59-0478dbddfcb4', 0, 0, 0.035) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('2bf8dfed-02e5-44b9-af19-3de8054076de', 'Bean Sprout', 'ITM-0039', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('2bf8dfed-02e5-44b9-af19-3de8054076de', 0, 0, 0.03) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('27567348-2ee3-4f6d-9432-9b82d6762d34', 'Rice Vermicelli Small', 'ITM-0040', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('27567348-2ee3-4f6d-9432-9b82d6762d34', 0, 0, 0.06528) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('16ecab19-3b1c-450b-9f46-09908a7b5b23', 'Water Spinach (Morning Glory)', 'ITM-0041', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('16ecab19-3b1c-450b-9f46-09908a7b5b23', 0, 0, 0.03) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('f3750b0b-2917-42ef-a988-aa1395a0348f', 'Green Chili', 'ITM-0042', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('f3750b0b-2917-42ef-a988-aa1395a0348f', 0, 0, 0.16) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('b4f6c417-cc78-4041-8937-839bc5f79921', 'Description', 'ITM-0043', 'RECIPE_INGREDIENT', 'U/M') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('b4f6c417-cc78-4041-8937-839bc5f79921', 0, 0, 0) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('4ace7945-da8e-4561-861d-154a09ea26e1', 'Thin Pork Layer', 'ITM-0044', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('4ace7945-da8e-4561-861d-154a09ea26e1', 0, 0, 0.1305) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('73eb78e9-3558-4057-bf69-42ec76c650d6', 'White Pepper Powder', 'ITM-0045', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('73eb78e9-3558-4057-bf69-42ec76c650d6', 0, 0, 0.22857) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('4f0c7eca-3435-4e2b-b3a9-1e3d02df2e65', 'Wood Ear Mushroom', 'ITM-0046', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('4f0c7eca-3435-4e2b-b3a9-1e3d02df2e65', 0, 0, 0.13) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('0e4540d0-d3c1-4f6e-95ac-00d4e7f44082', 'Coriander (Cilantro)', 'ITM-0047', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('0e4540d0-d3c1-4f6e-95ac-00d4e7f44082', 0, 0, 0.05) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('c311a739-13ec-48da-9dbe-3064071681e3', 'Lime Juice', 'ITM-0048', 'RECIPE_INGREDIENT', 'ml') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('c311a739-13ec-48da-9dbe-3064071681e3', 0, 0, 0.025) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('563745a9-f072-45a7-ac8a-7d529666a8a1', 'Bean Vermicelli', 'ITM-0049', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('563745a9-f072-45a7-ac8a-7d529666a8a1', 0, 0, 0.2125) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('c6f7a880-8e94-4c8b-9382-81d036300c89', 'Shrimp', 'ITM-0050', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('c6f7a880-8e94-4c8b-9382-81d036300c89', 0, 0, 0.22667) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('c0ab73d1-14dd-45d1-83dd-e40453d2b04e', 'Tamarind Juice', 'ITM-0051', 'RECIPE_INGREDIENT', 'ml') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('c0ab73d1-14dd-45d1-83dd-e40453d2b04e', 0, 0, 0) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('ff6d5c13-3a36-4ae9-8759-c61079f1a5c8', 'Fish Sauce', 'ITM-0052', 'RECIPE_INGREDIENT', 'ml') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('ff6d5c13-3a36-4ae9-8759-c61079f1a5c8', 0, 0, 0.0414) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('23089957-4ae6-47cd-b86c-a4316d333b5a', 'Lime', 'ITM-0053', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('23089957-4ae6-47cd-b86c-a4316d333b5a', 0, 0, 0.05) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('e74ac435-1b98-4dac-b6b5-d3bcfcacd73e', 'Thai Fragrant Rice', 'ITM-0054', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('e74ac435-1b98-4dac-b6b5-d3bcfcacd73e', 0, 0, 0.023) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('b68b1556-620a-4e26-8d63-56cbf50d93e7', 'Corn powder', 'ITM-0055', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('b68b1556-620a-4e26-8d63-56cbf50d93e7', 0, 0, 0.1) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('a41fca0c-d131-4063-b83e-6f4d56601b29', 'Quail egg', 'ITM-0056', 'RECIPE_INGREDIENT', 'pcs') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('a41fca0c-d131-4063-b83e-6f4d56601b29', 0, 0, 1.14) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('b7d37ea6-a542-4789-9805-1fbb1a0e36c2', 'Snow Pear', 'ITM-0057', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('b7d37ea6-a542-4789-9805-1fbb1a0e36c2', 0, 0, 0.079) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('d52b6363-ec38-4878-ad0c-25be1a384d93', 'Rice Noodle', 'ITM-0058', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('d52b6363-ec38-4878-ad0c-25be1a384d93', 0, 0, 0.08) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('35f87b70-1886-4430-adb9-2816b11569a6', 'Bok Choy', 'ITM-0059', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('35f87b70-1886-4430-adb9-2816b11569a6', 0, 0, 0.11) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('2fcc0daf-83e1-46f3-acb4-c70cdf1735e8', 'JH-PSB-26B/Big(Soup Box)', 'ITM-0060', 'RECIPE_INGREDIENT', 'pcs') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('2fcc0daf-83e1-46f3-acb4-c70cdf1735e8', 0, 0, 7.12) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('48ab2f7c-9717-4a4a-a02b-c9105c446f62', 'English Gourd', 'ITM-0061', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('48ab2f7c-9717-4a4a-a02b-c9105c446f62', 0, 0, 0.05) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('1b2dd15e-fb47-4d6e-a9df-75d6299fb6a4', 'Chili Sauce', 'ITM-0062', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('1b2dd15e-fb47-4d6e-a9df-75d6299fb6a4', 0, 0, 0.0589) ON CONFLICT DO NOTHING;

-- Step 2: Master Menus
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('8a83e2fc-8ead-4332-92ea-2c34ff8c4265', 'FGB 0002', 'Fried Beef with Bell Pepper', 'အမဲငရုတ်ပွ + ထမင်း', 120, 36.9379) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('fa210d92-9db7-46f9-afaa-204d02691fbc', 'FGN 0001', 'Wa Ou Noddle', 'ဝဥခေါက်ဆွဲ', 110, 30.5668) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('ada0e0af-c14a-4219-a97e-43129c0feb59', 'FGV 0023', 'Fried Mixed Vegetables', 'အစိမ်းကြော်', 45, 9.8808) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('20da81dc-4861-4693-a0d5-ad27480749f5', 'FGC 0019', 'Stired Fried Chicken With Vegetables', 'ကုန်းဘောင်ကြီးကြော် + ထမင်း', 95, 28.7129) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('e0144eb0-6039-41a3-b683-cd2201a8671b', 'FGN 0005', 'Fried Noodle With Chicken', 'ခေါက်ဆွဲကြော်', 80, 19.0686) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('a78e2e38-f8cc-4c91-9f0d-10d71753d9f2', 'FGV 0022', 'Fried Chinese Cabbage', 'တရုတ်မုန်ညှင်းကြော်', 35, 7.1130) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('b3ee9bca-8ede-4331-a588-a803f360c361', 'FGV 0019', 'Fried Bean Sprouts', 'ပဲပင်ပေါက်ကြော်', 35, 5.3050) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('15517ecb-d934-49a3-a6be-4869eb7bcb24', 'FGC 0020', 'Stired Fried Chicken With Bell Pepper', 'ကြက်ငရုတ်ပွ + ထမင်း', 80, 22.0887) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('910aeb15-cf60-486b-82db-4d0e624fd390', 'FGN 0006', 'Fried Vermicelli With Chicken', 'ကြာဇံကြော်', 70, 18.9750) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('ede3f432-4225-4751-88dc-eee17ebd51e8', 'FGV 0017', 'Hot And Sour Fried Morning Glory', 'ကန်စွန်းရွက် ချဉ်စပ်', 45, 9.2624) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('b8efe8e3-be75-4643-9e48-4bb8eec6d9d3', 'FGP 0012', 'Fried Thin Pork Layer With Spring Onion', 'ကြက်သွန်မြိတ်ဝက်သားပြားကြော် + ထမင်း', 0, 22.5422) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('4e8016f6-274e-44a4-89ee-ccaf80848b1d', 'FGN 0003', 'Kyay Oh Noodle', 'Pork) ( ကြေးအိုး', 80, 18.1925) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('56a0b099-26f5-47fc-bd53-bf32c665532b', 'FGV 0013', 'Wood Ear Salad', 'ကြွက်နားရွက်မှိုသုပ်', 50, 16.8676) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('c25193d0-f635-4e46-97df-76f7a344dcb8', 'FGN 0004', 'Salad Shrimp and Vermicelli', 'ပုဇွန်ပဲ ကြာဇံသုပ်', 80, 20.9109) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('81656d8b-2590-400b-91c1-f985347d16e6', 'FGV 0012', 'Tomato Salad', 'ခရမ်းချဉ်သီးသုပ်', 50, 7.0750) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('6271634c-16c4-4d86-9a66-c56a9e9cf1b4', 'FGR 0001', 'Steamed Rice', 'ထမင်းပေါင်း', 110, 34.6456) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('0b211d6d-530d-4947-8d69-c3c2627e7434', 'FGN 0007', 'Myay Oh Mee Shay', 'မြေအိုး မြီးရှည်', 110, 29.7002) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('cd93403e-125a-4290-b163-d336a5635092', 'FGV 0007', 'Fried English Gourd', 'ဂေါ်ရခါးသီးကြော်', 45, 10.7940) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('224f4890-9f03-459b-9880-ddd967f04e3c', 'FGP 0002', 'Sweet and Sour Pork', 'ချိုချဉ်ကြော် + ထမင်း', 110, 33.1885) ON CONFLICT DO NOTHING;

-- Step 3: Recipes (Bill of Materials)
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('8a83e2fc-8ead-4332-92ea-2c34ff8c4265', 'c4a1f3cc-4f00-47bf-9f2c-59d8adea08b2', 100, 24.5340);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('8a83e2fc-8ead-4332-92ea-2c34ff8c4265', '7b895bba-0f1b-43b6-9335-a1eb550428df', 50, 5.0000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('8a83e2fc-8ead-4332-92ea-2c34ff8c4265', '3023d2f9-6948-4dd7-800a-09644ec6702a', 15, 0.7050);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('8a83e2fc-8ead-4332-92ea-2c34ff8c4265', '9f5eac53-56e2-4502-a8e7-58aaa40f6351', 2, 0.5520);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('8a83e2fc-8ead-4332-92ea-2c34ff8c4265', '545d1594-fca4-4c97-b1c2-3517979b74b0', 5, 0.3500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('8a83e2fc-8ead-4332-92ea-2c34ff8c4265', '9d7eacd1-9035-4348-9296-3ea3dd75bdba', 3, 0.9375);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('8a83e2fc-8ead-4332-92ea-2c34ff8c4265', 'd6c3dd1a-8388-44f3-8945-7abfb4dc45cc', 3, 0.0450);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('8a83e2fc-8ead-4332-92ea-2c34ff8c4265', '743169d3-09f9-4f18-b2d0-06b24a6635cf', 10, 0.7000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('8a83e2fc-8ead-4332-92ea-2c34ff8c4265', '3c5808ee-0f35-4c5b-bbbe-15b8dbb0ee5d', 30, 1.1400);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('8a83e2fc-8ead-4332-92ea-2c34ff8c4265', '3ee7861c-0bb7-4ead-a661-0b3aadd49bf0', 7, 0.3850);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('8a83e2fc-8ead-4332-92ea-2c34ff8c4265', 'ad4dc646-ff21-4a64-9a55-171eec0e4124', 3, 0.0810);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('8a83e2fc-8ead-4332-92ea-2c34ff8c4265', '443ad6bd-deec-44c2-aa18-5d0d424318d8', 5, 0.2083);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('8a83e2fc-8ead-4332-92ea-2c34ff8c4265', 'c0ff7acf-b0cb-48c7-8899-bfded54defbf', 100, 2.3000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('fa210d92-9db7-46f9-afaa-204d02691fbc', '3033d6a5-9d4b-4998-9515-5fce93f9b0b0', 100, 9.0000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('fa210d92-9db7-46f9-afaa-204d02691fbc', '5dda615f-4910-4c16-af79-a6cfcaa19b68', 15, 4.2750);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('fa210d92-9db7-46f9-afaa-204d02691fbc', '2e30024b-87eb-4511-9aa9-a4f23be05a34', 20, 0.8334);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('fa210d92-9db7-46f9-afaa-204d02691fbc', '4feba017-01ae-4527-b65d-a5b5ccee1a9c', 30, 3.0000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('fa210d92-9db7-46f9-afaa-204d02691fbc', '7be460c5-ebea-44e2-89b2-e9e152e1ac88', 50, 2.4500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('fa210d92-9db7-46f9-afaa-204d02691fbc', 'd6c3dd1a-8388-44f3-8945-7abfb4dc45cc', 2, 0.0300);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('fa210d92-9db7-46f9-afaa-204d02691fbc', 'ad4dc646-ff21-4a64-9a55-171eec0e4124', 5, 0.1350);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('fa210d92-9db7-46f9-afaa-204d02691fbc', '545d1594-fca4-4c97-b1c2-3517979b74b0', 5, 0.3500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('fa210d92-9db7-46f9-afaa-204d02691fbc', 'fef13436-e32b-4887-9d58-b365b23d9833', 15, 0.4500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('fa210d92-9db7-46f9-afaa-204d02691fbc', '443ad6bd-deec-44c2-aa18-5d0d424318d8', 5, 0.2083);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('fa210d92-9db7-46f9-afaa-204d02691fbc', '481164db-60f1-479e-964f-25ccf7e2bd4e', 70, 9.4500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('fa210d92-9db7-46f9-afaa-204d02691fbc', '3ee7861c-0bb7-4ead-a661-0b3aadd49bf0', 7, 0.3850);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('ada0e0af-c14a-4219-a97e-43129c0feb59', '6ccf9499-e126-4423-acdc-6991f85ec867', 30, 0.6564);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('ada0e0af-c14a-4219-a97e-43129c0feb59', '607d0b1a-4cd6-4771-b2ab-d7b8a962400b', 100, 2.7000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('ada0e0af-c14a-4219-a97e-43129c0feb59', '66f6a711-3926-46e0-9c92-a00db7c29e89', 30, 0.9000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('ada0e0af-c14a-4219-a97e-43129c0feb59', 'e425a385-71ff-4a45-8afa-1caef1d4fb7c', 20, 1.2500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('ada0e0af-c14a-4219-a97e-43129c0feb59', 'fe632b6a-f208-4613-93fb-059475359395', 10, 0.3000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('ada0e0af-c14a-4219-a97e-43129c0feb59', '743169d3-09f9-4f18-b2d0-06b24a6635cf', 10, 0.7000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('ada0e0af-c14a-4219-a97e-43129c0feb59', '3c5808ee-0f35-4c5b-bbbe-15b8dbb0ee5d', 30, 1.1400);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('ada0e0af-c14a-4219-a97e-43129c0feb59', '3023d2f9-6948-4dd7-800a-09644ec6702a', 15, 0.7050);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('ada0e0af-c14a-4219-a97e-43129c0feb59', 'd6c3dd1a-8388-44f3-8945-7abfb4dc45cc', 5, 0.0750);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('ada0e0af-c14a-4219-a97e-43129c0feb59', '545d1594-fca4-4c97-b1c2-3517979b74b0', 7, 0.4900);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('ada0e0af-c14a-4219-a97e-43129c0feb59', 'ad4dc646-ff21-4a64-9a55-171eec0e4124', 3, 0.0810);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('ada0e0af-c14a-4219-a97e-43129c0feb59', '3ee7861c-0bb7-4ead-a661-0b3aadd49bf0', 7, 0.3850);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('ada0e0af-c14a-4219-a97e-43129c0feb59', '69b078ed-0f2d-488e-b293-827c83afebe4', 7, 0.4984);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('20da81dc-4861-4693-a0d5-ad27480749f5', '8a556644-7f7c-40d9-9923-65bd33cbc954', 100, 14.1520);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('20da81dc-4861-4693-a0d5-ad27480749f5', '66f6a711-3926-46e0-9c92-a00db7c29e89', 50, 1.5000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('20da81dc-4861-4693-a0d5-ad27480749f5', '623c146b-1e73-4702-adbf-5642951e2751', 20, 0.9000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('20da81dc-4861-4693-a0d5-ad27480749f5', '8bdbd477-11c8-4d63-b0e0-a2d96f257020', 10, 0.5000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('20da81dc-4861-4693-a0d5-ad27480749f5', '6ccf9499-e126-4423-acdc-6991f85ec867', 20, 0.4376);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('20da81dc-4861-4693-a0d5-ad27480749f5', '443ad6bd-deec-44c2-aa18-5d0d424318d8', 5, 0.2083);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('20da81dc-4861-4693-a0d5-ad27480749f5', '743169d3-09f9-4f18-b2d0-06b24a6635cf', 10, 0.7000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('20da81dc-4861-4693-a0d5-ad27480749f5', '3c5808ee-0f35-4c5b-bbbe-15b8dbb0ee5d', 30, 1.1400);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('20da81dc-4861-4693-a0d5-ad27480749f5', 'e425a385-71ff-4a45-8afa-1caef1d4fb7c', 20, 1.2500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('20da81dc-4861-4693-a0d5-ad27480749f5', 'a73fa0e9-2dcb-4c0b-8393-f2f73a37ca01', 20, 1.5000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('20da81dc-4861-4693-a0d5-ad27480749f5', '3023d2f9-6948-4dd7-800a-09644ec6702a', 15, 0.7050);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('20da81dc-4861-4693-a0d5-ad27480749f5', '3ee7861c-0bb7-4ead-a661-0b3aadd49bf0', 15, 0.8250);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('20da81dc-4861-4693-a0d5-ad27480749f5', '14a598c4-fbb7-48f0-826a-829170c06fa0', 7, 0.6200);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('20da81dc-4861-4693-a0d5-ad27480749f5', '545d1594-fca4-4c97-b1c2-3517979b74b0', 5, 0.3500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('20da81dc-4861-4693-a0d5-ad27480749f5', 'ad4dc646-ff21-4a64-9a55-171eec0e4124', 3, 0.0810);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('20da81dc-4861-4693-a0d5-ad27480749f5', '2b31b744-202b-4115-8bf3-54a8c92faac0', 1, 0.3440);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('20da81dc-4861-4693-a0d5-ad27480749f5', 'c4d1c142-c724-4d93-9ea0-7c901d50c487', 3, 1.2000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('20da81dc-4861-4693-a0d5-ad27480749f5', 'c0ff7acf-b0cb-48c7-8899-bfded54defbf', 100, 2.3000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('e0144eb0-6039-41a3-b683-cd2201a8671b', '068d70a3-9b22-46ab-9396-d2e0b12239c7', 100, 7.8130);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('e0144eb0-6039-41a3-b683-cd2201a8671b', '8a1bca77-d322-4946-ba09-2f6b5d3f2f1a', 50, 3.4000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('e0144eb0-6039-41a3-b683-cd2201a8671b', '6ccf9499-e126-4423-acdc-6991f85ec867', 20, 0.4376);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('e0144eb0-6039-41a3-b683-cd2201a8671b', '8bdbd477-11c8-4d63-b0e0-a2d96f257020', 10, 0.5000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('e0144eb0-6039-41a3-b683-cd2201a8671b', '607d0b1a-4cd6-4771-b2ab-d7b8a962400b', 30, 0.8100);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('e0144eb0-6039-41a3-b683-cd2201a8671b', '6d816d1a-64d8-4cd5-921c-1fdcfceb86b2', 10, 0.3000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('e0144eb0-6039-41a3-b683-cd2201a8671b', '743169d3-09f9-4f18-b2d0-06b24a6635cf', 10, 0.7000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('e0144eb0-6039-41a3-b683-cd2201a8671b', '3c5808ee-0f35-4c5b-bbbe-15b8dbb0ee5d', 30, 1.1400);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('e0144eb0-6039-41a3-b683-cd2201a8671b', '56a8830f-8a29-4006-aff6-6631df03590e', 20, 0.6000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('e0144eb0-6039-41a3-b683-cd2201a8671b', '3023d2f9-6948-4dd7-800a-09644ec6702a', 15, 0.7050);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('e0144eb0-6039-41a3-b683-cd2201a8671b', '3ee7861c-0bb7-4ead-a661-0b3aadd49bf0', 15, 0.8250);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('e0144eb0-6039-41a3-b683-cd2201a8671b', '14a598c4-fbb7-48f0-826a-829170c06fa0', 7, 0.6200);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('e0144eb0-6039-41a3-b683-cd2201a8671b', '545d1594-fca4-4c97-b1c2-3517979b74b0', 5, 0.3500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('e0144eb0-6039-41a3-b683-cd2201a8671b', 'd6c3dd1a-8388-44f3-8945-7abfb4dc45cc', 3, 0.0450);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('e0144eb0-6039-41a3-b683-cd2201a8671b', 'ad4dc646-ff21-4a64-9a55-171eec0e4124', 5, 0.1350);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('e0144eb0-6039-41a3-b683-cd2201a8671b', '2b31b744-202b-4115-8bf3-54a8c92faac0', 2, 0.6880);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('a78e2e38-f8cc-4c91-9f0d-10d71753d9f2', '633aa382-c3a2-4f1c-8e59-0478dbddfcb4', 150, 5.2500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('a78e2e38-f8cc-4c91-9f0d-10d71753d9f2', '743169d3-09f9-4f18-b2d0-06b24a6635cf', 10, 0.7000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('a78e2e38-f8cc-4c91-9f0d-10d71753d9f2', 'd6c3dd1a-8388-44f3-8945-7abfb4dc45cc', 3, 0.0450);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('a78e2e38-f8cc-4c91-9f0d-10d71753d9f2', '9f5eac53-56e2-4502-a8e7-58aaa40f6351', 2, 0.5520);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('a78e2e38-f8cc-4c91-9f0d-10d71753d9f2', '545d1594-fca4-4c97-b1c2-3517979b74b0', 3, 0.2100);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('a78e2e38-f8cc-4c91-9f0d-10d71753d9f2', '69b078ed-0f2d-488e-b293-827c83afebe4', 5, 0.3560);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('b3ee9bca-8ede-4331-a588-a803f360c361', '2bf8dfed-02e5-44b9-af19-3de8054076de', 100, 3.0000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('b3ee9bca-8ede-4331-a588-a803f360c361', '3c5808ee-0f35-4c5b-bbbe-15b8dbb0ee5d', 20, 0.7600);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('b3ee9bca-8ede-4331-a588-a803f360c361', '743169d3-09f9-4f18-b2d0-06b24a6635cf', 10, 0.7000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('b3ee9bca-8ede-4331-a588-a803f360c361', '3023d2f9-6948-4dd7-800a-09644ec6702a', 7, 0.3290);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('b3ee9bca-8ede-4331-a588-a803f360c361', '9f5eac53-56e2-4502-a8e7-58aaa40f6351', 1, 0.2760);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('b3ee9bca-8ede-4331-a588-a803f360c361', 'd6c3dd1a-8388-44f3-8945-7abfb4dc45cc', 2, 0.0300);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('b3ee9bca-8ede-4331-a588-a803f360c361', '545d1594-fca4-4c97-b1c2-3517979b74b0', 3, 0.2100);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('15517ecb-d934-49a3-a6be-4869eb7bcb24', '068d70a3-9b22-46ab-9396-d2e0b12239c7', 100, 7.8130);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('15517ecb-d934-49a3-a6be-4869eb7bcb24', '8bdbd477-11c8-4d63-b0e0-a2d96f257020', 5, 0.2500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('15517ecb-d934-49a3-a6be-4869eb7bcb24', '7b895bba-0f1b-43b6-9335-a1eb550428df', 50, 5.0000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('15517ecb-d934-49a3-a6be-4869eb7bcb24', '743169d3-09f9-4f18-b2d0-06b24a6635cf', 10, 0.7000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('15517ecb-d934-49a3-a6be-4869eb7bcb24', '443ad6bd-deec-44c2-aa18-5d0d424318d8', 10, 0.4167);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('15517ecb-d934-49a3-a6be-4869eb7bcb24', '3c5808ee-0f35-4c5b-bbbe-15b8dbb0ee5d', 30, 1.1400);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('15517ecb-d934-49a3-a6be-4869eb7bcb24', '545d1594-fca4-4c97-b1c2-3517979b74b0', 5, 0.3500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('15517ecb-d934-49a3-a6be-4869eb7bcb24', 'c4d1c142-c724-4d93-9ea0-7c901d50c487', 3, 1.2000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('15517ecb-d934-49a3-a6be-4869eb7bcb24', 'ad4dc646-ff21-4a64-9a55-171eec0e4124', 3, 0.0810);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('15517ecb-d934-49a3-a6be-4869eb7bcb24', '2b31b744-202b-4115-8bf3-54a8c92faac0', 2, 0.6880);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('15517ecb-d934-49a3-a6be-4869eb7bcb24', '3023d2f9-6948-4dd7-800a-09644ec6702a', 15, 0.7050);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('15517ecb-d934-49a3-a6be-4869eb7bcb24', '3ee7861c-0bb7-4ead-a661-0b3aadd49bf0', 15, 0.8250);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('15517ecb-d934-49a3-a6be-4869eb7bcb24', '14a598c4-fbb7-48f0-826a-829170c06fa0', 7, 0.6200);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('15517ecb-d934-49a3-a6be-4869eb7bcb24', 'c0ff7acf-b0cb-48c7-8899-bfded54defbf', 100, 2.3000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('910aeb15-cf60-486b-82db-4d0e624fd390', '27567348-2ee3-4f6d-9432-9b82d6762d34', 50, 3.2640);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('910aeb15-cf60-486b-82db-4d0e624fd390', '068d70a3-9b22-46ab-9396-d2e0b12239c7', 100, 7.8130);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('910aeb15-cf60-486b-82db-4d0e624fd390', '6ccf9499-e126-4423-acdc-6991f85ec867', 20, 0.4376);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('910aeb15-cf60-486b-82db-4d0e624fd390', '607d0b1a-4cd6-4771-b2ab-d7b8a962400b', 30, 0.8100);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('910aeb15-cf60-486b-82db-4d0e624fd390', '56a8830f-8a29-4006-aff6-6631df03590e', 20, 0.6000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('910aeb15-cf60-486b-82db-4d0e624fd390', 'd6c3dd1a-8388-44f3-8945-7abfb4dc45cc', 3, 0.0450);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('910aeb15-cf60-486b-82db-4d0e624fd390', '545d1594-fca4-4c97-b1c2-3517979b74b0', 5, 0.3500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('910aeb15-cf60-486b-82db-4d0e624fd390', 'ad4dc646-ff21-4a64-9a55-171eec0e4124', 5, 0.1350);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('910aeb15-cf60-486b-82db-4d0e624fd390', '3ee7861c-0bb7-4ead-a661-0b3aadd49bf0', 15, 0.8250);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('910aeb15-cf60-486b-82db-4d0e624fd390', '14a598c4-fbb7-48f0-826a-829170c06fa0', 7, 0.6200);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('910aeb15-cf60-486b-82db-4d0e624fd390', '69b078ed-0f2d-488e-b293-827c83afebe4', 7, 0.4984);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('910aeb15-cf60-486b-82db-4d0e624fd390', '3023d2f9-6948-4dd7-800a-09644ec6702a', 15, 0.7050);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('910aeb15-cf60-486b-82db-4d0e624fd390', '2b31b744-202b-4115-8bf3-54a8c92faac0', 3, 1.0320);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('910aeb15-cf60-486b-82db-4d0e624fd390', '743169d3-09f9-4f18-b2d0-06b24a6635cf', 10, 0.7000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('910aeb15-cf60-486b-82db-4d0e624fd390', '3c5808ee-0f35-4c5b-bbbe-15b8dbb0ee5d', 30, 1.1400);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('ede3f432-4225-4751-88dc-eee17ebd51e8', '16ecab19-3b1c-450b-9f46-09908a7b5b23', 150, 4.5000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('ede3f432-4225-4751-88dc-eee17ebd51e8', 'fe632b6a-f208-4613-93fb-059475359395', 30, 0.9000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('ede3f432-4225-4751-88dc-eee17ebd51e8', 'f3750b0b-2917-42ef-a988-aa1395a0348f', 10, 1.6000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('ede3f432-4225-4751-88dc-eee17ebd51e8', '743169d3-09f9-4f18-b2d0-06b24a6635cf', 10, 0.7000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('ede3f432-4225-4751-88dc-eee17ebd51e8', '545d1594-fca4-4c97-b1c2-3517979b74b0', 5, 0.3500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('ede3f432-4225-4751-88dc-eee17ebd51e8', '3ee7861c-0bb7-4ead-a661-0b3aadd49bf0', 7, 0.3850);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('ede3f432-4225-4751-88dc-eee17ebd51e8', '69b078ed-0f2d-488e-b293-827c83afebe4', 7, 0.4984);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('ede3f432-4225-4751-88dc-eee17ebd51e8', '3023d2f9-6948-4dd7-800a-09644ec6702a', 7, 0.3290);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('b8efe8e3-be75-4643-9e48-4bb8eec6d9d3', 'b4f6c417-cc78-4041-8937-839bc5f79921', 0, 0.0000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('b8efe8e3-be75-4643-9e48-4bb8eec6d9d3', '4ace7945-da8e-4561-861d-154a09ea26e1', 100, 13.0500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('b8efe8e3-be75-4643-9e48-4bb8eec6d9d3', '8bdbd477-11c8-4d63-b0e0-a2d96f257020', 30, 1.5000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('b8efe8e3-be75-4643-9e48-4bb8eec6d9d3', '3023d2f9-6948-4dd7-800a-09644ec6702a', 15, 0.7050);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('b8efe8e3-be75-4643-9e48-4bb8eec6d9d3', '743169d3-09f9-4f18-b2d0-06b24a6635cf', 10, 0.7000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('b8efe8e3-be75-4643-9e48-4bb8eec6d9d3', '3c5808ee-0f35-4c5b-bbbe-15b8dbb0ee5d', 30, 1.1400);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('b8efe8e3-be75-4643-9e48-4bb8eec6d9d3', '443ad6bd-deec-44c2-aa18-5d0d424318d8', 10, 0.4167);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('b8efe8e3-be75-4643-9e48-4bb8eec6d9d3', '545d1594-fca4-4c97-b1c2-3517979b74b0', 5, 0.3500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('b8efe8e3-be75-4643-9e48-4bb8eec6d9d3', '73eb78e9-3558-4057-bf69-42ec76c650d6', 5, 1.1428);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('b8efe8e3-be75-4643-9e48-4bb8eec6d9d3', '3ee7861c-0bb7-4ead-a661-0b3aadd49bf0', 7, 0.3850);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('b8efe8e3-be75-4643-9e48-4bb8eec6d9d3', '69b078ed-0f2d-488e-b293-827c83afebe4', 7, 0.4984);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('b8efe8e3-be75-4643-9e48-4bb8eec6d9d3', '14a598c4-fbb7-48f0-826a-829170c06fa0', 4, 0.3543);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('b8efe8e3-be75-4643-9e48-4bb8eec6d9d3', 'c0ff7acf-b0cb-48c7-8899-bfded54defbf', 100, 2.3000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('4e8016f6-274e-44a4-89ee-ccaf80848b1d', '481164db-60f1-479e-964f-25ccf7e2bd4e', 70, 9.4500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('4e8016f6-274e-44a4-89ee-ccaf80848b1d', '27567348-2ee3-4f6d-9432-9b82d6762d34', 50, 3.2640);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('4e8016f6-274e-44a4-89ee-ccaf80848b1d', '7be460c5-ebea-44e2-89b2-e9e152e1ac88', 50, 2.4500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('4e8016f6-274e-44a4-89ee-ccaf80848b1d', '2e30024b-87eb-4511-9aa9-a4f23be05a34', 50, 2.0835);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('4e8016f6-274e-44a4-89ee-ccaf80848b1d', 'd6c3dd1a-8388-44f3-8945-7abfb4dc45cc', 5, 0.0750);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('4e8016f6-274e-44a4-89ee-ccaf80848b1d', '545d1594-fca4-4c97-b1c2-3517979b74b0', 5, 0.3500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('4e8016f6-274e-44a4-89ee-ccaf80848b1d', 'ad4dc646-ff21-4a64-9a55-171eec0e4124', 5, 0.1350);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('4e8016f6-274e-44a4-89ee-ccaf80848b1d', '3ee7861c-0bb7-4ead-a661-0b3aadd49bf0', 7, 0.3850);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('56a0b099-26f5-47fc-bd53-bf32c665532b', '4f0c7eca-3435-4e2b-b3a9-1e3d02df2e65', 100, 13.0000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('56a0b099-26f5-47fc-bd53-bf32c665532b', '3c5808ee-0f35-4c5b-bbbe-15b8dbb0ee5d', 20, 0.7600);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('56a0b099-26f5-47fc-bd53-bf32c665532b', '6ccf9499-e126-4423-acdc-6991f85ec867', 20, 0.4376);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('56a0b099-26f5-47fc-bd53-bf32c665532b', '0e4540d0-d3c1-4f6e-95ac-00d4e7f44082', 10, 0.5000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('56a0b099-26f5-47fc-bd53-bf32c665532b', 'f3750b0b-2917-42ef-a988-aa1395a0348f', 10, 1.6000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('56a0b099-26f5-47fc-bd53-bf32c665532b', 'd6c3dd1a-8388-44f3-8945-7abfb4dc45cc', 3, 0.0450);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('56a0b099-26f5-47fc-bd53-bf32c665532b', '545d1594-fca4-4c97-b1c2-3517979b74b0', 5, 0.3500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('56a0b099-26f5-47fc-bd53-bf32c665532b', 'c311a739-13ec-48da-9dbe-3064071681e3', 7, 0.1750);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('c25193d0-f635-4e46-97df-76f7a344dcb8', '563745a9-f072-45a7-ac8a-7d529666a8a1', 40, 8.5000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('c25193d0-f635-4e46-97df-76f7a344dcb8', 'c6f7a880-8e94-4c8b-9382-81d036300c89', 50, 11.3335);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('c25193d0-f635-4e46-97df-76f7a344dcb8', '6ccf9499-e126-4423-acdc-6991f85ec867', 20, 0.4376);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('c25193d0-f635-4e46-97df-76f7a344dcb8', '545d1594-fca4-4c97-b1c2-3517979b74b0', 5, 0.3500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('c25193d0-f635-4e46-97df-76f7a344dcb8', 'c0ab73d1-14dd-45d1-83dd-e40453d2b04e', 7, 0.0000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('c25193d0-f635-4e46-97df-76f7a344dcb8', 'ff6d5c13-3a36-4ae9-8759-c61079f1a5c8', 7, 0.2898);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('81656d8b-2590-400b-91c1-f985347d16e6', 'fe632b6a-f208-4613-93fb-059475359395', 100, 3.0000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('81656d8b-2590-400b-91c1-f985347d16e6', '3c5808ee-0f35-4c5b-bbbe-15b8dbb0ee5d', 20, 0.7600);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('81656d8b-2590-400b-91c1-f985347d16e6', '743169d3-09f9-4f18-b2d0-06b24a6635cf', 1, 0.0700);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('81656d8b-2590-400b-91c1-f985347d16e6', 'f3750b0b-2917-42ef-a988-aa1395a0348f', 10, 1.6000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('81656d8b-2590-400b-91c1-f985347d16e6', '0e4540d0-d3c1-4f6e-95ac-00d4e7f44082', 20, 1.0000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('81656d8b-2590-400b-91c1-f985347d16e6', '545d1594-fca4-4c97-b1c2-3517979b74b0', 5, 0.3500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('81656d8b-2590-400b-91c1-f985347d16e6', 'd6c3dd1a-8388-44f3-8945-7abfb4dc45cc', 3, 0.0450);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('81656d8b-2590-400b-91c1-f985347d16e6', '23089957-4ae6-47cd-b86c-a4316d333b5a', 5, 0.2500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('6271634c-16c4-4d86-9a66-c56a9e9cf1b4', '8a556644-7f7c-40d9-9923-65bd33cbc954', 150, 21.2280);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('6271634c-16c4-4d86-9a66-c56a9e9cf1b4', 'e74ac435-1b98-4dac-b6b5-d3bcfcacd73e', 140, 3.2200);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('6271634c-16c4-4d86-9a66-c56a9e9cf1b4', '6ccf9499-e126-4423-acdc-6991f85ec867', 20, 0.4376);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('6271634c-16c4-4d86-9a66-c56a9e9cf1b4', 'e425a385-71ff-4a45-8afa-1caef1d4fb7c', 20, 1.2500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('6271634c-16c4-4d86-9a66-c56a9e9cf1b4', '633aa382-c3a2-4f1c-8e59-0478dbddfcb4', 20, 0.7000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('6271634c-16c4-4d86-9a66-c56a9e9cf1b4', '66f6a711-3926-46e0-9c92-a00db7c29e89', 20, 0.6000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('6271634c-16c4-4d86-9a66-c56a9e9cf1b4', '743169d3-09f9-4f18-b2d0-06b24a6635cf', 5, 0.3500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('6271634c-16c4-4d86-9a66-c56a9e9cf1b4', 'b68b1556-620a-4e26-8d63-56cbf50d93e7', 7, 0.7000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('6271634c-16c4-4d86-9a66-c56a9e9cf1b4', 'a41fca0c-d131-4063-b83e-6f4d56601b29', 2, 2.2800);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('6271634c-16c4-4d86-9a66-c56a9e9cf1b4', 'b7d37ea6-a542-4789-9805-1fbb1a0e36c2', 20, 1.5800);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('6271634c-16c4-4d86-9a66-c56a9e9cf1b4', 'c0ff7acf-b0cb-48c7-8899-bfded54defbf', 100, 2.3000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('0b211d6d-530d-4947-8d69-c3c2627e7434', '8a556644-7f7c-40d9-9923-65bd33cbc954', 70, 9.9064);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('0b211d6d-530d-4947-8d69-c3c2627e7434', 'd52b6363-ec38-4878-ad0c-25be1a384d93', 50, 4.0000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('0b211d6d-530d-4947-8d69-c3c2627e7434', '3033d6a5-9d4b-4998-9515-5fce93f9b0b0', 20, 1.8000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('0b211d6d-530d-4947-8d69-c3c2627e7434', '6ccf9499-e126-4423-acdc-6991f85ec867', 10, 0.2188);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('0b211d6d-530d-4947-8d69-c3c2627e7434', '66f6a711-3926-46e0-9c92-a00db7c29e89', 10, 0.3000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('0b211d6d-530d-4947-8d69-c3c2627e7434', 'e425a385-71ff-4a45-8afa-1caef1d4fb7c', 10, 0.6250);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('0b211d6d-530d-4947-8d69-c3c2627e7434', '35f87b70-1886-4430-adb9-2816b11569a6', 10, 1.1000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('0b211d6d-530d-4947-8d69-c3c2627e7434', 'a41fca0c-d131-4063-b83e-6f4d56601b29', 2, 2.2800);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('0b211d6d-530d-4947-8d69-c3c2627e7434', '4feba017-01ae-4527-b65d-a5b5ccee1a9c', 20, 2.0000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('0b211d6d-530d-4947-8d69-c3c2627e7434', '545d1594-fca4-4c97-b1c2-3517979b74b0', 5, 0.3500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('0b211d6d-530d-4947-8d69-c3c2627e7434', '2fcc0daf-83e1-46f3-acb4-c70cdf1735e8', 1, 7.1200);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('cd93403e-125a-4290-b163-d336a5635092', '48ab2f7c-9717-4a4a-a02b-c9105c446f62', 200, 10.0000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('cd93403e-125a-4290-b163-d336a5635092', '743169d3-09f9-4f18-b2d0-06b24a6635cf', 1, 0.0700);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('cd93403e-125a-4290-b163-d336a5635092', '3023d2f9-6948-4dd7-800a-09644ec6702a', 7, 0.3290);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('cd93403e-125a-4290-b163-d336a5635092', '545d1594-fca4-4c97-b1c2-3517979b74b0', 5, 0.3500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('cd93403e-125a-4290-b163-d336a5635092', 'd6c3dd1a-8388-44f3-8945-7abfb4dc45cc', 3, 0.0450);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('224f4890-9f03-459b-9880-ddd967f04e3c', '8a556644-7f7c-40d9-9923-65bd33cbc954', 100, 14.1520);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('224f4890-9f03-459b-9880-ddd967f04e3c', '6ccf9499-e126-4423-acdc-6991f85ec867', 30, 0.6564);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('224f4890-9f03-459b-9880-ddd967f04e3c', '7b895bba-0f1b-43b6-9335-a1eb550428df', 30, 3.0000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('224f4890-9f03-459b-9880-ddd967f04e3c', 'b7d37ea6-a542-4789-9805-1fbb1a0e36c2', 30, 2.3700);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('224f4890-9f03-459b-9880-ddd967f04e3c', '3c5808ee-0f35-4c5b-bbbe-15b8dbb0ee5d', 30, 1.1400);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('224f4890-9f03-459b-9880-ddd967f04e3c', '743169d3-09f9-4f18-b2d0-06b24a6635cf', 10, 0.7000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('224f4890-9f03-459b-9880-ddd967f04e3c', '443ad6bd-deec-44c2-aa18-5d0d424318d8', 10, 0.4167);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('224f4890-9f03-459b-9880-ddd967f04e3c', 'e425a385-71ff-4a45-8afa-1caef1d4fb7c', 20, 1.2500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('224f4890-9f03-459b-9880-ddd967f04e3c', '3023d2f9-6948-4dd7-800a-09644ec6702a', 15, 0.7050);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('224f4890-9f03-459b-9880-ddd967f04e3c', 'd6c3dd1a-8388-44f3-8945-7abfb4dc45cc', 5, 0.0750);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('224f4890-9f03-459b-9880-ddd967f04e3c', '545d1594-fca4-4c97-b1c2-3517979b74b0', 5, 0.3500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('224f4890-9f03-459b-9880-ddd967f04e3c', 'fe632b6a-f208-4613-93fb-059475359395', 30, 0.9000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('224f4890-9f03-459b-9880-ddd967f04e3c', '3ee7861c-0bb7-4ead-a661-0b3aadd49bf0', 7, 0.3850);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('224f4890-9f03-459b-9880-ddd967f04e3c', '69b078ed-0f2d-488e-b293-827c83afebe4', 7, 0.4984);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('224f4890-9f03-459b-9880-ddd967f04e3c', '1b2dd15e-fb47-4d6e-a9df-75d6299fb6a4', 50, 2.9450);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('224f4890-9f03-459b-9880-ddd967f04e3c', 'b68b1556-620a-4e26-8d63-56cbf50d93e7', 10, 1.0000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('224f4890-9f03-459b-9880-ddd967f04e3c', 'fef13436-e32b-4887-9d58-b365b23d9833', 7, 0.2100);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('224f4890-9f03-459b-9880-ddd967f04e3c', 'ad4dc646-ff21-4a64-9a55-171eec0e4124', 5, 0.1350);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('224f4890-9f03-459b-9880-ddd967f04e3c', 'c0ff7acf-b0cb-48c7-8899-bfded54defbf', 100, 2.3000);

-- Step 4: Daily Menu Plan (Monthly Calendar)
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('bba3ca6d-9755-4f97-a555-2fe31967a7cf', '2026-06-01', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('fc596084-fe77-493d-84ac-380a1f70285b', '2026-06-01', true, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('4ef5f232-1ab9-46e2-8d47-c599e0624853', '2026-06-02', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('19080734-6418-4298-aecf-53329ba11571', '2026-06-02', true, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('55a6826f-919a-416f-9aee-779073727f1c', '2026-06-03', false, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('7530483c-4166-43cd-a312-e9cc241568d3', '2026-06-03', true, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('bd621227-2d08-48be-8b05-9274dd01eb5e', '2026-06-04', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('375540cd-6ffd-4507-8ec4-d6e08d611f37', '2026-06-04', true, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('d168dade-9d44-458a-80d7-5dca65ff938d', '2026-06-05', false, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('b62be10a-11ea-427d-9d41-099041f9411c', '2026-06-05', true, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('86d7a22e-6cf7-4ad4-b80a-28613f968254', '2026-06-06', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('6fc189df-fa36-4bc2-9ac3-8b9d16fedd3f', '2026-06-06', false, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('c6c1e994-daef-40d4-ae34-5edf8b51c55a', '2026-06-08', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('a34c533a-a30b-455c-aae5-36919bf86dc4', '2026-06-08', false, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('bc20a4cb-f664-4fc2-b30e-801fc8b46680', '2026-06-09', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('f0ec2669-492c-4e37-96f1-b0b2f15112dd', '2026-06-09', false, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('1377d248-bcc0-4af5-80b1-0345719166c9', '2026-06-10', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('fec5e9af-1acc-4afe-a888-c26bd5d26383', '2026-06-10', false, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('3f114ada-eda2-448c-8ddf-f332dacbf9a1', '2026-06-11', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('b7d638c6-1a9f-4766-8dab-135f1f5753c8', '2026-06-11', false, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('3cecc047-2426-455e-9ee6-a93d91e60d7d', '2026-06-12', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('e89c1fe7-dd44-448a-839b-73da61808e16', '2026-06-12', false, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('a13dad02-88c9-44e7-b028-98f19fae8b11', '2026-06-13', false, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('858026cf-a15a-4e98-b315-96d5d4f25d2a', '2026-06-13', true, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('32ae35c7-b54f-491a-ae56-bbd27d057743', '2026-06-15', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('500d15e9-e556-4b23-98d8-1c2977b3cbf0', '2026-06-15', true, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('44be1deb-f47e-4610-b1b1-0fafa238dada', '2026-06-16', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('bc4ea303-ee58-4b22-86fe-54c938d95a7e', '2026-06-16', false, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('0c804fc4-2dd1-4280-b328-7e2e14533d2a', '2026-06-17', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('601d58b7-d15a-4e8e-8e98-eff4e5f8d549', '2026-06-17', false, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('10db109c-457a-49b8-8c32-1412483897be', '2026-06-18', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('064d882b-6f9a-4529-bb15-46d2d6a068ef', '2026-06-18', false, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('60465d49-f4b7-4a49-b33f-4fbffe53d670', '2026-06-19', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('16854bbb-7e8e-4d24-8847-425b046b3999', '2026-06-19', true, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('c4800213-7866-474b-906e-ec3d03e6095a', '2026-06-20', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('b0b75292-9766-4519-b8c5-b68c5880d3e6', '2026-06-20', false, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('c2139477-1e70-4ea1-a984-acaf307ed9e8', '2026-06-22', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('231fd36c-8994-4b7a-94af-8ebb37b124b5', '2026-06-22', false, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('10925ad0-e81c-451d-92ce-c15914b55b46', '2026-06-23', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('794259ce-dd20-4f63-9ad4-84155877f624', '2026-06-23', false, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('4553de1a-d418-488e-99ec-34b9840e11a7', '2026-06-24', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('80287184-ea50-4c2a-9f77-8a3a9e6f7594', '2026-06-24', true, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('633e43d7-8afa-4d34-bca3-a92fb25c8ade', '2026-06-25', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('b7b8c241-4a25-4d57-8c13-d6e437129400', '2026-06-25', false, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('20977bec-2db6-409a-abbf-276a330f5192', '2026-06-26', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('41fef039-af30-4142-9e19-2c22506813a2', '2026-06-26', false, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('4043656d-2d0a-4206-92db-2b32bc1b83b2', '2026-06-27', false, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('d7d41043-6e73-46ad-8a24-ac76af130df2', '2026-06-27', true, 'DINNER') ON CONFLICT DO NOTHING;

-- Step 5: Menu Types (which menus are scheduled per daily menu)
-- Uncosted item: ဝက်ကချင်ချက် for 2026-06-01 LUNCH
-- Uncosted item: ‌ဇူကာညွန့်ကြော်ချက် for 2026-06-01 LUNCH
-- Soup/drink (uncosted): မုန်လာရွက်ချဉ်ဟင်း for 2026-06-01 LUNCH
-- Uncosted item: ဝက်ကုန်းဘောင် for 2026-06-01 DINNER
-- Uncosted item: ‌ဇူကာညွန့်ကြော်ချက် for 2026-06-01 DINNER
-- Uncosted item: ငါးဖယ်သုပ် for 2026-06-02 LUNCH
INSERT INTO operations.menu_types (id, menu_id, daily_menus_id, is_main) VALUES ('b19d2c35-55c0-4a0a-a4ba-03afb1effa53', 'cd93403e-125a-4290-b163-d336a5635092', '4ef5f232-1ab9-46e2-8d47-c599e0624853', false) ON CONFLICT DO NOTHING;
-- Soup/drink (uncosted): ပဲနီလေးဟင်းချို for 2026-06-02 LUNCH
-- Uncosted item: ငါးဖယ်ခရမ်းချဉ်သီး for 2026-06-02 DINNER
INSERT INTO operations.menu_types (id, menu_id, daily_menus_id, is_main) VALUES ('06610d07-53e6-4e75-bdbe-0d845c59c3e7', 'cd93403e-125a-4290-b163-d336a5635092', '19080734-6418-4298-aecf-53329ba11571', false) ON CONFLICT DO NOTHING;
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
INSERT INTO operations.menu_types (id, menu_id, daily_menus_id, is_main) VALUES ('97fee4c7-9fa6-4f35-a1af-19875bff27d4', 'cd93403e-125a-4290-b163-d336a5635092', 'd168dade-9d44-458a-80d7-5dca65ff938d', false) ON CONFLICT DO NOTHING;
-- Uncosted item: ငရုတ်သီးဆားထောင်း for 2026-06-05 LUNCH
-- Soup/drink (uncosted): ငါးချဉ်စပ်ဟင်းရည် for 2026-06-05 LUNCH
-- Uncosted item: ငါးထမင်းနယ် for 2026-06-05 DINNER
INSERT INTO operations.menu_types (id, menu_id, daily_menus_id, is_main) VALUES ('1511ea92-136f-45fa-a209-1f3b1721bfc4', 'cd93403e-125a-4290-b163-d336a5635092', 'b62be10a-11ea-427d-9d41-099041f9411c', false) ON CONFLICT DO NOTHING;
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
INSERT INTO operations.menu_types (id, menu_id, daily_menus_id, is_main) VALUES ('2c66e047-29b2-4c2c-9e1b-090f8ecc9cc6', '81656d8b-2590-400b-91c1-f985347d16e6', '10db109c-457a-49b8-8c32-1412483897be', false) ON CONFLICT DO NOTHING;
-- Soup/drink (uncosted): မြင်းခွာရွက်ဟင်းခါး for 2026-06-18 LUNCH
-- Uncosted item: ခေါက်ဆွဲကြော်(ဝက်) for 2026-06-18 DINNER
INSERT INTO operations.menu_types (id, menu_id, daily_menus_id, is_main) VALUES ('36deaaa5-d6e6-4a7c-83f1-56456ac4fcab', '81656d8b-2590-400b-91c1-f985347d16e6', '064d882b-6f9a-4529-bb15-46d2d6a068ef', false) ON CONFLICT DO NOTHING;
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
INSERT INTO operations.menu_types (id, menu_id, daily_menus_id, is_main) VALUES ('9dcb56ba-54c6-4003-911c-e2981dd9d911', 'ada0e0af-c14a-4219-a97e-43129c0feb59', '10925ad0-e81c-451d-92ce-c15914b55b46', false) ON CONFLICT DO NOTHING;
-- Uncosted item: ကြက်ပေါင်းခေါက်ဆွဲ for 2026-06-23 DINNER
INSERT INTO operations.menu_types (id, menu_id, daily_menus_id, is_main) VALUES ('9b142a81-22cd-44f2-8bbb-8f6a885816bf', 'ada0e0af-c14a-4219-a97e-43129c0feb59', '794259ce-dd20-4f63-9ad4-84155877f624', false) ON CONFLICT DO NOTHING;
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
