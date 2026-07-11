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
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('7ef0bef6-a886-4f62-8514-b6abb586edbf', 'Beef Lean', 'ITM-0001', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('7ef0bef6-a886-4f62-8514-b6abb586edbf', 0, 0, 0.24534) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('0861ab2d-7ae0-44fe-b66f-6ee25494aa75', 'Bell Pepper', 'ITM-0002', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('0861ab2d-7ae0-44fe-b66f-6ee25494aa75', 0, 0, 0.1) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('56cbaaae-0a1c-4d9c-8ff9-719d576b87f0', 'King Rice Bran Oil 5 L', 'ITM-0003', 'RECIPE_INGREDIENT', 'ml') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('56cbaaae-0a1c-4d9c-8ff9-719d576b87f0', 0, 0, 0.047) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('1d837150-3d17-4adb-8953-867093882c03', 'Turmeric Powder', 'ITM-0004', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('1d837150-3d17-4adb-8953-867093882c03', 0, 0, 0.276) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('9037d54b-64df-4aad-af8b-976b82180838', 'Chicken Seasoning Powder', 'ITM-0005', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('9037d54b-64df-4aad-af8b-976b82180838', 0, 0, 0.07) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('c161a507-edb5-4053-8fc3-eb527f7f35ee', 'Chili Colored Powder', 'ITM-0006', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('c161a507-edb5-4053-8fc3-eb527f7f35ee', 0, 0, 0.3125) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('4ba47277-c602-48fd-a9b2-272cc36cf656', 'Salt', 'ITM-0007', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('4ba47277-c602-48fd-a9b2-272cc36cf656', 0, 0, 0.015) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('7470d2b7-b2e4-40d5-a5b5-6f597c9589cb', 'Garlic', 'ITM-0008', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('7470d2b7-b2e4-40d5-a5b5-6f597c9589cb', 0, 0, 0.07) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('82a87708-ee8d-4b24-8b1d-3332cf52f646', 'Shallot', 'ITM-0009', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('82a87708-ee8d-4b24-8b1d-3332cf52f646', 0, 0, 0.038) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('ba1d7ead-591d-415c-bb2e-4690e77ef4fc', 'Golden Mountain Soy Sauce', 'ITM-0010', 'RECIPE_INGREDIENT', 'ml') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('ba1d7ead-591d-415c-bb2e-4690e77ef4fc', 0, 0, 0.055) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('8618cbe3-c4d3-4c9c-b54c-0384b319faba', 'Pure Refined Sugar', 'ITM-0011', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('8618cbe3-c4d3-4c9c-b54c-0384b319faba', 0, 0, 0.027) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('9b7fdb52-245e-476e-b2ef-670ba9c87fec', 'Ginger', 'ITM-0012', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('9b7fdb52-245e-476e-b2ef-670ba9c87fec', 0, 0, 0.04167) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('5089c485-ade6-4b48-95e6-61bc473fc672', 'Rice', 'ITM-0013', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('5089c485-ade6-4b48-95e6-61bc473fc672', 0, 0, 0.023) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('38f27a00-ff8c-4d74-9ef0-e8ac77871057', 'Wa-Ooh Noodle', 'ITM-0014', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('38f27a00-ff8c-4d74-9ef0-e8ac77871057', 0, 0, 0.09) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('1f5c69ad-a2f4-44f5-8048-7d9d9a54b999', 'Peanut Butter', 'ITM-0015', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('1f5c69ad-a2f4-44f5-8048-7d9d9a54b999', 0, 0, 0.285) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('47512307-f760-42ce-b0a8-23b263bf7eb2', 'Chinese Kale', 'ITM-0016', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('47512307-f760-42ce-b0a8-23b263bf7eb2', 0, 0, 0.04167) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('4d726ebb-25e5-4409-95ca-1d85b6b4ff51', 'Mala Paste', 'ITM-0017', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('4d726ebb-25e5-4409-95ca-1d85b6b4ff51', 0, 0, 0.1) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('5fabb1f1-e5a0-4f70-88cb-fad4ca74e50c', 'Pork Soup Bone', 'ITM-0018', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('5fabb1f1-e5a0-4f70-88cb-fad4ca74e50c', 0, 0, 0.049) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('3978486a-b286-45fd-8a77-1af5801f33a7', 'Vinegar', 'ITM-0019', 'RECIPE_INGREDIENT', 'ml') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('3978486a-b286-45fd-8a77-1af5801f33a7', 0, 0, 0.03) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('ba527c0e-ccf2-44d3-8054-40dc077b7034', 'Pork Ball', 'ITM-0020', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('ba527c0e-ccf2-44d3-8054-40dc077b7034', 0, 0, 0.135) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('dd22ed64-5786-4cd2-82ba-1805467e4538', 'Carrot', 'ITM-0021', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('dd22ed64-5786-4cd2-82ba-1805467e4538', 0, 0, 0.02188) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('36609de6-4c69-4ad4-8402-3e38837c498e', 'Cabbage', 'ITM-0022', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('36609de6-4c69-4ad4-8402-3e38837c498e', 0, 0, 0.027) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('f8c9810b-9a2c-4e54-ba6c-da39aa0aa15f', 'Cauliflower', 'ITM-0023', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('f8c9810b-9a2c-4e54-ba6c-da39aa0aa15f', 0, 0, 0.03) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('a6469f04-202e-45b6-ab4a-5f4f9d043dcb', 'Baby Corn', 'ITM-0024', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('a6469f04-202e-45b6-ab4a-5f4f9d043dcb', 0, 0, 0.0625) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('0676a05f-faa5-477c-bdfc-571dff9b64bf', 'Tomato', 'ITM-0025', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('0676a05f-faa5-477c-bdfc-571dff9b64bf', 0, 0, 0.03) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('4ca1c222-bd89-4a6b-a699-078aefc5a446', 'Oyster Sauce', 'ITM-0026', 'RECIPE_INGREDIENT', 'ml') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('4ca1c222-bd89-4a6b-a699-078aefc5a446', 0, 0, 0.0712) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('3489cd3e-6918-40c2-ad89-6cc1ae2dfd6a', 'Pork Tenderloin', 'ITM-0027', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('3489cd3e-6918-40c2-ad89-6cc1ae2dfd6a', 0, 0, 0.14152) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('f2822b2b-d7ac-4793-b104-55a1bf00d348', 'French Bean', 'ITM-0028', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('f2822b2b-d7ac-4793-b104-55a1bf00d348', 0, 0, 0.045) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('e9c65007-59bf-4c21-8dd6-3f39624f07f6', 'Scallion / Spring Onion', 'ITM-0029', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('e9c65007-59bf-4c21-8dd6-3f39624f07f6', 0, 0, 0.05) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('f43001ed-7073-4236-8782-509c38cb6bd4', 'Broccoli', 'ITM-0030', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('f43001ed-7073-4236-8782-509c38cb6bd4', 0, 0, 0.075) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('680ebb95-83bd-4eb5-9732-bdd4afa533ea', 'Healthy Boy Sweet Soy Sauce', 'ITM-0031', 'RECIPE_INGREDIENT', 'ml') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('680ebb95-83bd-4eb5-9732-bdd4afa533ea', 0, 0, 0.08857) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('408115a0-4c85-46e8-89e2-3296a85001d3', 'Black Pepper', 'ITM-0032', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('408115a0-4c85-46e8-89e2-3296a85001d3', 0, 0, 0.344) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('72fa574d-07ff-4ec9-a90e-6d86ee14ca18', 'Dried Chili', 'ITM-0033', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('72fa574d-07ff-4ec9-a90e-6d86ee14ca18', 0, 0, 0.4) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('6897799d-e830-4097-b8af-819ad73e8057', 'Chicken Thigh', 'ITM-0034', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('6897799d-e830-4097-b8af-819ad73e8057', 0, 0, 0.07813) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('ec301554-7b2d-4107-b922-d46a21587b1e', 'Wheat Noodle', 'ITM-0035', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('ec301554-7b2d-4107-b922-d46a21587b1e', 0, 0, 0.068) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('29566044-91a3-4ccd-a016-00a83b965ac3', 'Chinese Celery', 'ITM-0036', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('29566044-91a3-4ccd-a016-00a83b965ac3', 0, 0, 0.03) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('6b135176-a020-4cff-a739-20231551b52e', 'Asparagus bean(Long Beans)', 'ITM-0037', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('6b135176-a020-4cff-a739-20231551b52e', 0, 0, 0.03) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('262c6655-9e03-4e54-aef3-75794030f062', 'Cabbage (White Cabbage)', 'ITM-0038', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('262c6655-9e03-4e54-aef3-75794030f062', 0, 0, 0.035) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('65edf9b9-60d4-43bb-993c-b16353f8ce12', 'Bean Sprout', 'ITM-0039', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('65edf9b9-60d4-43bb-993c-b16353f8ce12', 0, 0, 0.03) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('0d8989aa-501a-4b46-9304-5d4b643a513b', 'Rice Vermicelli Small', 'ITM-0040', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('0d8989aa-501a-4b46-9304-5d4b643a513b', 0, 0, 0.06528) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('1b13104d-cf38-433a-90ef-d059b438e529', 'Water Spinach (Morning Glory)', 'ITM-0041', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('1b13104d-cf38-433a-90ef-d059b438e529', 0, 0, 0.03) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('0ad98f40-e009-469a-a40e-c9848285219e', 'Green Chili', 'ITM-0042', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('0ad98f40-e009-469a-a40e-c9848285219e', 0, 0, 0.16) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('ff1e3a74-89ca-412a-88ae-c738822db7b2', 'Description', 'ITM-0043', 'RECIPE_INGREDIENT', 'U/M') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('ff1e3a74-89ca-412a-88ae-c738822db7b2', 0, 0, 0) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('b3c4970f-d3ad-4260-a3b1-40dbf2cb31fc', 'Thin Pork Layer', 'ITM-0044', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('b3c4970f-d3ad-4260-a3b1-40dbf2cb31fc', 0, 0, 0.1305) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('ba3eefc6-2ced-4348-a2a0-531cbe40660b', 'White Pepper Powder', 'ITM-0045', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('ba3eefc6-2ced-4348-a2a0-531cbe40660b', 0, 0, 0.22857) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('f12709f5-8f4e-44c9-9f36-61551614e0e8', 'Wood Ear Mushroom', 'ITM-0046', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('f12709f5-8f4e-44c9-9f36-61551614e0e8', 0, 0, 0.13) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('9d5b741b-54db-4ea1-a61e-955250b8815f', 'Coriander (Cilantro)', 'ITM-0047', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('9d5b741b-54db-4ea1-a61e-955250b8815f', 0, 0, 0.05) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('be37a866-377c-435e-85b3-7b993b5bf89f', 'Lime Juice', 'ITM-0048', 'RECIPE_INGREDIENT', 'ml') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('be37a866-377c-435e-85b3-7b993b5bf89f', 0, 0, 0.025) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('d1b3a7dc-b126-4be5-b4b9-73ea09c3b637', 'Shrimp', 'ITM-0049', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('d1b3a7dc-b126-4be5-b4b9-73ea09c3b637', 0, 0, 0.22667) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('22ca9759-ed9b-42d7-bb55-a8b3111f3d87', 'Bean Vermicelli', 'ITM-0050', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('22ca9759-ed9b-42d7-bb55-a8b3111f3d87', 0, 0, 0.2125) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('a9b60ee2-4116-473d-8d62-4a9967cc25ba', 'Tamarind Juice', 'ITM-0051', 'RECIPE_INGREDIENT', 'ml') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('a9b60ee2-4116-473d-8d62-4a9967cc25ba', 0, 0, 0) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('584fa510-911f-4730-93b6-f966dd406a64', 'Fish Sauce', 'ITM-0052', 'RECIPE_INGREDIENT', 'ml') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('584fa510-911f-4730-93b6-f966dd406a64', 0, 0, 0.0414) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('8cbfab94-1213-4407-a1f4-58b98b91f94a', 'Lime', 'ITM-0053', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('8cbfab94-1213-4407-a1f4-58b98b91f94a', 0, 0, 0.05) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('3feceeac-17fb-4716-8254-f982cefcf578', 'Thai Fragrant Rice', 'ITM-0054', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('3feceeac-17fb-4716-8254-f982cefcf578', 0, 0, 0.023) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('34b1cf2c-66d3-4088-a0b5-66218b298dae', 'Corn powder', 'ITM-0055', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('34b1cf2c-66d3-4088-a0b5-66218b298dae', 0, 0, 0.1) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('ff9729ab-2384-4af3-bf30-61aebf6db23a', 'Quail egg', 'ITM-0056', 'RECIPE_INGREDIENT', 'pcs') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('ff9729ab-2384-4af3-bf30-61aebf6db23a', 0, 0, 1.14) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('958f15f9-a642-46c3-aff2-3f666e707592', 'Snow Pear', 'ITM-0057', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('958f15f9-a642-46c3-aff2-3f666e707592', 0, 0, 0.079) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('114e2340-546d-4d67-8d69-67407ce9b6fa', 'Rice Noodle', 'ITM-0058', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('114e2340-546d-4d67-8d69-67407ce9b6fa', 0, 0, 0.08) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('d82f497a-3294-41e8-b561-f9ebb4c4c233', 'Bok Choy', 'ITM-0059', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('d82f497a-3294-41e8-b561-f9ebb4c4c233', 0, 0, 0.11) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('84355051-3fad-495f-a44d-1553464ff674', 'JH-PSB-26B/Big(Soup Box)', 'ITM-0060', 'RECIPE_INGREDIENT', 'pcs') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('84355051-3fad-495f-a44d-1553464ff674', 0, 0, 7.12) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('4e7cffe8-f488-4b40-958b-ef12c66614e3', 'English Gourd', 'ITM-0061', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('4e7cffe8-f488-4b40-958b-ef12c66614e3', 0, 0, 0.05) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('11932546-445f-4825-b796-5391d023e5d9', 'Squid Ring', 'ITM-0062', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('11932546-445f-4825-b796-5391d023e5d9', 0, 0, 0.155) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('2f7dc76a-0c10-4420-b698-b4a5abe86b9c', 'Chili Sauce', 'ITM-0063', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('2f7dc76a-0c10-4420-b698-b4a5abe86b9c', 0, 0, 0.0589) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('88e75e4c-5bca-44a9-bf97-46a4ff75a380', 'Fish cake', 'ITM-0064', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('88e75e4c-5bca-44a9-bf97-46a4ff75a380', 0, 0, 0.19) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('be752d45-f1ef-47bc-9ac3-a04d2a8e962e', 'OverHead Cost', 'ITM-0065', 'RECIPE_INGREDIENT', 'PCS') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('be752d45-f1ef-47bc-9ac3-a04d2a8e962e', 0, 0, 0) ON CONFLICT DO NOTHING;

-- Step 2: Master Menus
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('8aa5f0b9-287e-41a9-ae2d-46af4ecb3106', 'FGB 0002', 'Fried Beef with Bell Pepper', 'အမဲငရုတ်ပွ + ထမင်း', 120, 36.9379) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('22986eac-0db5-4cc3-8b20-bb7ef4285dd2', 'FGN 0001', 'Wa Ou Noddle', 'ဝဥခေါက်ဆွဲ', 110, 30.5668) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('be4325fa-cf4e-4196-ba57-d5be1ddab602', 'FGV 0023', 'Fried Mixed Vegetables', 'အစိမ်းကြော်', 45, 9.8808) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('9ecc0fe1-d527-4466-b98f-1254a525490a', 'FGC 0019', 'Stired Fried Chicken With Vegetables', 'ကုန်းဘောင်ကြီးကြော် + ထမင်း', 95, 28.7129) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('597b265a-b88c-4b16-b5a6-f67f63f692f1', 'FGN 0005', 'Fried Noodle With Chicken', 'ခေါက်ဆွဲကြော်', 80, 19.0686) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('752c3316-5185-4631-a5ee-2369a32b7dae', 'FGV 0022', 'Fried Chinese Cabbage', 'တရုတ်မုန်ညှင်းကြော်', 35, 7.1130) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('098881ef-4e97-4f47-bef9-00097d3ca3af', 'FGV 0019', 'Fried Bean Sprouts', 'ပဲပင်ပေါက်ကြော်', 35, 5.3050) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('11f08b6c-b831-4d76-afcf-7b8376ebb289', 'FGC 0020', 'Stired Fried Chicken With Bell Pepper', 'ကြက်ငရုတ်ပွ + ထမင်း', 80, 22.0887) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('8d243660-647a-4284-ae81-724a03b1dc77', 'FGN 0006', 'Fried Vermicelli With Chicken', 'ကြာဇံကြော်', 70, 18.9750) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('f892e1a0-871f-4ba7-bdfa-e256d3119dec', 'FGV 0017', 'Hot And Sour Fried Morning Glory', 'ကန်စွန်းရွက် ချဉ်စပ်', 45, 9.2624) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('fd3abeec-54be-413b-afe7-07d0f53ca94d', 'FGP 0012', 'Fried Thin Pork Layer With Spring Onion', 'ကြက်သွန်မြိတ်ဝက်သားပြားကြော် + ထမင်း', 0, 22.5422) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('b9650f9d-b750-471a-8bec-951fcc11577c', 'FGN 0003', 'Kyay Oh Noodle', 'Pork) ( ကြေးအိုး', 80, 18.1925) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('ea0df2a0-5f37-451a-a225-0d1bdb38f8fe', 'FGV 0013', 'Wood Ear Salad', 'ကြွက်နားရွက်မှိုသုပ်', 50, 16.8676) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('a4a05b68-bc24-4c61-8e2c-ddc3cf9a6673', 'FGSF 0019', 'Stired Fried Shrimp With Bell Pepper', 'ပုဇွန်ငရုတ်ပွ + ထမင်း', 80, 37.5367) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('2031d794-1726-4151-a28f-5939d5fc7c33', 'FGN 0004', 'Salad Shrimp and Vermicelli', 'ပုဇွန်ပဲ ကြာဇံသုပ်', 80, 20.9109) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('dafde2ba-1a67-4b01-b011-007446f1ea9c', 'FGV 0012', 'Tomato Salad', 'ခရမ်းချဉ်သီးသုပ်', 50, 7.0750) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('8e923b9a-20ab-4987-a692-b5b751bfdf35', 'FGR 0001', 'Steamed Rice', 'ထမင်းပေါင်း', 110, 34.6456) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('79293aa6-072a-4e00-906f-22b6b33b895e', 'FGN 0007', 'Myay Oh Mee Shay', 'မြေအိုး မြီးရှည်', 110, 29.7002) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('1804dd85-794d-40e5-9cf9-6ac74b221a86', 'FGV 0007', 'Fried English Gourd', 'ဂေါ်ရခါးသီးကြော်', 45, 10.7940) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('fa3f25bb-93d1-41ad-9ae3-29828fdda310', 'FGSF 0014', 'Stired fried squid with bell pepper', 'ကင်းမွန်ငရုတ်ပွ + ထမင်း', 90, 26.0629) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('c2f0d11e-1037-4ad8-8891-505ef5112519', 'FGSF 0014', 'Stired fried squid with bell pepper', 'ကင်းမွန်အစပ်ကြော် + ထမင်း', 90, 26.0462) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('0900857a-60c5-4bd2-945a-82e12f32838a', 'FGP 0002', 'Sweet and Sour Pork', 'ချိုချဉ်ကြော် + ထမင်း', 110, 33.1885) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('98af3dce-ec5c-4691-9a66-089389458727', 'FG SF 0021', 'Rakhine Style Fish Cake Salad', 'ရခိုင်ငါးဖယ်သုပ် + ထမင်း', 100, 27.5914) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('c2dcbde8-917a-41f5-9c12-c8a709117451', 'FG SF 0003', 'Shrimp with green chili', 'ပုဇွန်ငရုတ်သီးစိမ်းချက်', 120, 37.2415) ON CONFLICT DO NOTHING;

-- Step 3: Recipes (Bill of Materials)
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('8aa5f0b9-287e-41a9-ae2d-46af4ecb3106', '7ef0bef6-a886-4f62-8514-b6abb586edbf', 100, 24.5340);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('8aa5f0b9-287e-41a9-ae2d-46af4ecb3106', '0861ab2d-7ae0-44fe-b66f-6ee25494aa75', 50, 5.0000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('8aa5f0b9-287e-41a9-ae2d-46af4ecb3106', '56cbaaae-0a1c-4d9c-8ff9-719d576b87f0', 15, 0.7050);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('8aa5f0b9-287e-41a9-ae2d-46af4ecb3106', '1d837150-3d17-4adb-8953-867093882c03', 2, 0.5520);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('8aa5f0b9-287e-41a9-ae2d-46af4ecb3106', '9037d54b-64df-4aad-af8b-976b82180838', 5, 0.3500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('8aa5f0b9-287e-41a9-ae2d-46af4ecb3106', 'c161a507-edb5-4053-8fc3-eb527f7f35ee', 3, 0.9375);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('8aa5f0b9-287e-41a9-ae2d-46af4ecb3106', '4ba47277-c602-48fd-a9b2-272cc36cf656', 3, 0.0450);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('8aa5f0b9-287e-41a9-ae2d-46af4ecb3106', '7470d2b7-b2e4-40d5-a5b5-6f597c9589cb', 10, 0.7000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('8aa5f0b9-287e-41a9-ae2d-46af4ecb3106', '82a87708-ee8d-4b24-8b1d-3332cf52f646', 30, 1.1400);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('8aa5f0b9-287e-41a9-ae2d-46af4ecb3106', 'ba1d7ead-591d-415c-bb2e-4690e77ef4fc', 7, 0.3850);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('8aa5f0b9-287e-41a9-ae2d-46af4ecb3106', '8618cbe3-c4d3-4c9c-b54c-0384b319faba', 3, 0.0810);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('8aa5f0b9-287e-41a9-ae2d-46af4ecb3106', '9b7fdb52-245e-476e-b2ef-670ba9c87fec', 5, 0.2083);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('8aa5f0b9-287e-41a9-ae2d-46af4ecb3106', '5089c485-ade6-4b48-95e6-61bc473fc672', 100, 2.3000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('22986eac-0db5-4cc3-8b20-bb7ef4285dd2', '38f27a00-ff8c-4d74-9ef0-e8ac77871057', 100, 9.0000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('22986eac-0db5-4cc3-8b20-bb7ef4285dd2', '1f5c69ad-a2f4-44f5-8048-7d9d9a54b999', 15, 4.2750);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('22986eac-0db5-4cc3-8b20-bb7ef4285dd2', '47512307-f760-42ce-b0a8-23b263bf7eb2', 20, 0.8334);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('22986eac-0db5-4cc3-8b20-bb7ef4285dd2', '4d726ebb-25e5-4409-95ca-1d85b6b4ff51', 30, 3.0000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('22986eac-0db5-4cc3-8b20-bb7ef4285dd2', '5fabb1f1-e5a0-4f70-88cb-fad4ca74e50c', 50, 2.4500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('22986eac-0db5-4cc3-8b20-bb7ef4285dd2', '4ba47277-c602-48fd-a9b2-272cc36cf656', 2, 0.0300);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('22986eac-0db5-4cc3-8b20-bb7ef4285dd2', '8618cbe3-c4d3-4c9c-b54c-0384b319faba', 5, 0.1350);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('22986eac-0db5-4cc3-8b20-bb7ef4285dd2', '9037d54b-64df-4aad-af8b-976b82180838', 5, 0.3500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('22986eac-0db5-4cc3-8b20-bb7ef4285dd2', '3978486a-b286-45fd-8a77-1af5801f33a7', 15, 0.4500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('22986eac-0db5-4cc3-8b20-bb7ef4285dd2', '9b7fdb52-245e-476e-b2ef-670ba9c87fec', 5, 0.2083);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('22986eac-0db5-4cc3-8b20-bb7ef4285dd2', 'ba527c0e-ccf2-44d3-8054-40dc077b7034', 70, 9.4500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('22986eac-0db5-4cc3-8b20-bb7ef4285dd2', 'ba1d7ead-591d-415c-bb2e-4690e77ef4fc', 7, 0.3850);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('be4325fa-cf4e-4196-ba57-d5be1ddab602', 'dd22ed64-5786-4cd2-82ba-1805467e4538', 30, 0.6564);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('be4325fa-cf4e-4196-ba57-d5be1ddab602', '36609de6-4c69-4ad4-8402-3e38837c498e', 100, 2.7000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('be4325fa-cf4e-4196-ba57-d5be1ddab602', 'f8c9810b-9a2c-4e54-ba6c-da39aa0aa15f', 30, 0.9000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('be4325fa-cf4e-4196-ba57-d5be1ddab602', 'a6469f04-202e-45b6-ab4a-5f4f9d043dcb', 20, 1.2500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('be4325fa-cf4e-4196-ba57-d5be1ddab602', '0676a05f-faa5-477c-bdfc-571dff9b64bf', 10, 0.3000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('be4325fa-cf4e-4196-ba57-d5be1ddab602', '7470d2b7-b2e4-40d5-a5b5-6f597c9589cb', 10, 0.7000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('be4325fa-cf4e-4196-ba57-d5be1ddab602', '82a87708-ee8d-4b24-8b1d-3332cf52f646', 30, 1.1400);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('be4325fa-cf4e-4196-ba57-d5be1ddab602', '56cbaaae-0a1c-4d9c-8ff9-719d576b87f0', 15, 0.7050);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('be4325fa-cf4e-4196-ba57-d5be1ddab602', '4ba47277-c602-48fd-a9b2-272cc36cf656', 5, 0.0750);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('be4325fa-cf4e-4196-ba57-d5be1ddab602', '9037d54b-64df-4aad-af8b-976b82180838', 7, 0.4900);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('be4325fa-cf4e-4196-ba57-d5be1ddab602', '8618cbe3-c4d3-4c9c-b54c-0384b319faba', 3, 0.0810);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('be4325fa-cf4e-4196-ba57-d5be1ddab602', 'ba1d7ead-591d-415c-bb2e-4690e77ef4fc', 7, 0.3850);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('be4325fa-cf4e-4196-ba57-d5be1ddab602', '4ca1c222-bd89-4a6b-a699-078aefc5a446', 7, 0.4984);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('9ecc0fe1-d527-4466-b98f-1254a525490a', '3489cd3e-6918-40c2-ad89-6cc1ae2dfd6a', 100, 14.1520);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('9ecc0fe1-d527-4466-b98f-1254a525490a', 'f8c9810b-9a2c-4e54-ba6c-da39aa0aa15f', 50, 1.5000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('9ecc0fe1-d527-4466-b98f-1254a525490a', 'f2822b2b-d7ac-4793-b104-55a1bf00d348', 20, 0.9000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('9ecc0fe1-d527-4466-b98f-1254a525490a', 'e9c65007-59bf-4c21-8dd6-3f39624f07f6', 10, 0.5000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('9ecc0fe1-d527-4466-b98f-1254a525490a', 'dd22ed64-5786-4cd2-82ba-1805467e4538', 20, 0.4376);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('9ecc0fe1-d527-4466-b98f-1254a525490a', '9b7fdb52-245e-476e-b2ef-670ba9c87fec', 5, 0.2083);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('9ecc0fe1-d527-4466-b98f-1254a525490a', '7470d2b7-b2e4-40d5-a5b5-6f597c9589cb', 10, 0.7000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('9ecc0fe1-d527-4466-b98f-1254a525490a', '82a87708-ee8d-4b24-8b1d-3332cf52f646', 30, 1.1400);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('9ecc0fe1-d527-4466-b98f-1254a525490a', 'a6469f04-202e-45b6-ab4a-5f4f9d043dcb', 20, 1.2500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('9ecc0fe1-d527-4466-b98f-1254a525490a', 'f43001ed-7073-4236-8782-509c38cb6bd4', 20, 1.5000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('9ecc0fe1-d527-4466-b98f-1254a525490a', '56cbaaae-0a1c-4d9c-8ff9-719d576b87f0', 15, 0.7050);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('9ecc0fe1-d527-4466-b98f-1254a525490a', 'ba1d7ead-591d-415c-bb2e-4690e77ef4fc', 15, 0.8250);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('9ecc0fe1-d527-4466-b98f-1254a525490a', '680ebb95-83bd-4eb5-9732-bdd4afa533ea', 7, 0.6200);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('9ecc0fe1-d527-4466-b98f-1254a525490a', '9037d54b-64df-4aad-af8b-976b82180838', 5, 0.3500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('9ecc0fe1-d527-4466-b98f-1254a525490a', '8618cbe3-c4d3-4c9c-b54c-0384b319faba', 3, 0.0810);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('9ecc0fe1-d527-4466-b98f-1254a525490a', '408115a0-4c85-46e8-89e2-3296a85001d3', 1, 0.3440);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('9ecc0fe1-d527-4466-b98f-1254a525490a', '72fa574d-07ff-4ec9-a90e-6d86ee14ca18', 3, 1.2000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('9ecc0fe1-d527-4466-b98f-1254a525490a', '5089c485-ade6-4b48-95e6-61bc473fc672', 100, 2.3000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('597b265a-b88c-4b16-b5a6-f67f63f692f1', '6897799d-e830-4097-b8af-819ad73e8057', 100, 7.8130);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('597b265a-b88c-4b16-b5a6-f67f63f692f1', 'ec301554-7b2d-4107-b922-d46a21587b1e', 50, 3.4000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('597b265a-b88c-4b16-b5a6-f67f63f692f1', 'dd22ed64-5786-4cd2-82ba-1805467e4538', 20, 0.4376);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('597b265a-b88c-4b16-b5a6-f67f63f692f1', 'e9c65007-59bf-4c21-8dd6-3f39624f07f6', 10, 0.5000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('597b265a-b88c-4b16-b5a6-f67f63f692f1', '36609de6-4c69-4ad4-8402-3e38837c498e', 30, 0.8100);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('597b265a-b88c-4b16-b5a6-f67f63f692f1', '29566044-91a3-4ccd-a016-00a83b965ac3', 10, 0.3000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('597b265a-b88c-4b16-b5a6-f67f63f692f1', '7470d2b7-b2e4-40d5-a5b5-6f597c9589cb', 10, 0.7000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('597b265a-b88c-4b16-b5a6-f67f63f692f1', '82a87708-ee8d-4b24-8b1d-3332cf52f646', 30, 1.1400);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('597b265a-b88c-4b16-b5a6-f67f63f692f1', '6b135176-a020-4cff-a739-20231551b52e', 20, 0.6000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('597b265a-b88c-4b16-b5a6-f67f63f692f1', '56cbaaae-0a1c-4d9c-8ff9-719d576b87f0', 15, 0.7050);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('597b265a-b88c-4b16-b5a6-f67f63f692f1', 'ba1d7ead-591d-415c-bb2e-4690e77ef4fc', 15, 0.8250);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('597b265a-b88c-4b16-b5a6-f67f63f692f1', '680ebb95-83bd-4eb5-9732-bdd4afa533ea', 7, 0.6200);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('597b265a-b88c-4b16-b5a6-f67f63f692f1', '9037d54b-64df-4aad-af8b-976b82180838', 5, 0.3500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('597b265a-b88c-4b16-b5a6-f67f63f692f1', '4ba47277-c602-48fd-a9b2-272cc36cf656', 3, 0.0450);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('597b265a-b88c-4b16-b5a6-f67f63f692f1', '8618cbe3-c4d3-4c9c-b54c-0384b319faba', 5, 0.1350);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('597b265a-b88c-4b16-b5a6-f67f63f692f1', '408115a0-4c85-46e8-89e2-3296a85001d3', 2, 0.6880);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('752c3316-5185-4631-a5ee-2369a32b7dae', '262c6655-9e03-4e54-aef3-75794030f062', 150, 5.2500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('752c3316-5185-4631-a5ee-2369a32b7dae', '7470d2b7-b2e4-40d5-a5b5-6f597c9589cb', 10, 0.7000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('752c3316-5185-4631-a5ee-2369a32b7dae', '4ba47277-c602-48fd-a9b2-272cc36cf656', 3, 0.0450);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('752c3316-5185-4631-a5ee-2369a32b7dae', '1d837150-3d17-4adb-8953-867093882c03', 2, 0.5520);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('752c3316-5185-4631-a5ee-2369a32b7dae', '9037d54b-64df-4aad-af8b-976b82180838', 3, 0.2100);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('752c3316-5185-4631-a5ee-2369a32b7dae', '4ca1c222-bd89-4a6b-a699-078aefc5a446', 5, 0.3560);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('098881ef-4e97-4f47-bef9-00097d3ca3af', '65edf9b9-60d4-43bb-993c-b16353f8ce12', 100, 3.0000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('098881ef-4e97-4f47-bef9-00097d3ca3af', '82a87708-ee8d-4b24-8b1d-3332cf52f646', 20, 0.7600);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('098881ef-4e97-4f47-bef9-00097d3ca3af', '7470d2b7-b2e4-40d5-a5b5-6f597c9589cb', 10, 0.7000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('098881ef-4e97-4f47-bef9-00097d3ca3af', '56cbaaae-0a1c-4d9c-8ff9-719d576b87f0', 7, 0.3290);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('098881ef-4e97-4f47-bef9-00097d3ca3af', '1d837150-3d17-4adb-8953-867093882c03', 1, 0.2760);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('098881ef-4e97-4f47-bef9-00097d3ca3af', '4ba47277-c602-48fd-a9b2-272cc36cf656', 2, 0.0300);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('098881ef-4e97-4f47-bef9-00097d3ca3af', '9037d54b-64df-4aad-af8b-976b82180838', 3, 0.2100);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('11f08b6c-b831-4d76-afcf-7b8376ebb289', '6897799d-e830-4097-b8af-819ad73e8057', 100, 7.8130);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('11f08b6c-b831-4d76-afcf-7b8376ebb289', 'e9c65007-59bf-4c21-8dd6-3f39624f07f6', 5, 0.2500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('11f08b6c-b831-4d76-afcf-7b8376ebb289', '0861ab2d-7ae0-44fe-b66f-6ee25494aa75', 50, 5.0000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('11f08b6c-b831-4d76-afcf-7b8376ebb289', '7470d2b7-b2e4-40d5-a5b5-6f597c9589cb', 10, 0.7000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('11f08b6c-b831-4d76-afcf-7b8376ebb289', '9b7fdb52-245e-476e-b2ef-670ba9c87fec', 10, 0.4167);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('11f08b6c-b831-4d76-afcf-7b8376ebb289', '82a87708-ee8d-4b24-8b1d-3332cf52f646', 30, 1.1400);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('11f08b6c-b831-4d76-afcf-7b8376ebb289', '9037d54b-64df-4aad-af8b-976b82180838', 5, 0.3500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('11f08b6c-b831-4d76-afcf-7b8376ebb289', '72fa574d-07ff-4ec9-a90e-6d86ee14ca18', 3, 1.2000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('11f08b6c-b831-4d76-afcf-7b8376ebb289', '8618cbe3-c4d3-4c9c-b54c-0384b319faba', 3, 0.0810);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('11f08b6c-b831-4d76-afcf-7b8376ebb289', '408115a0-4c85-46e8-89e2-3296a85001d3', 2, 0.6880);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('11f08b6c-b831-4d76-afcf-7b8376ebb289', '56cbaaae-0a1c-4d9c-8ff9-719d576b87f0', 15, 0.7050);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('11f08b6c-b831-4d76-afcf-7b8376ebb289', 'ba1d7ead-591d-415c-bb2e-4690e77ef4fc', 15, 0.8250);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('11f08b6c-b831-4d76-afcf-7b8376ebb289', '680ebb95-83bd-4eb5-9732-bdd4afa533ea', 7, 0.6200);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('11f08b6c-b831-4d76-afcf-7b8376ebb289', '5089c485-ade6-4b48-95e6-61bc473fc672', 100, 2.3000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('8d243660-647a-4284-ae81-724a03b1dc77', '0d8989aa-501a-4b46-9304-5d4b643a513b', 50, 3.2640);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('8d243660-647a-4284-ae81-724a03b1dc77', '6897799d-e830-4097-b8af-819ad73e8057', 100, 7.8130);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('8d243660-647a-4284-ae81-724a03b1dc77', 'dd22ed64-5786-4cd2-82ba-1805467e4538', 20, 0.4376);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('8d243660-647a-4284-ae81-724a03b1dc77', '36609de6-4c69-4ad4-8402-3e38837c498e', 30, 0.8100);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('8d243660-647a-4284-ae81-724a03b1dc77', '6b135176-a020-4cff-a739-20231551b52e', 20, 0.6000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('8d243660-647a-4284-ae81-724a03b1dc77', '4ba47277-c602-48fd-a9b2-272cc36cf656', 3, 0.0450);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('8d243660-647a-4284-ae81-724a03b1dc77', '9037d54b-64df-4aad-af8b-976b82180838', 5, 0.3500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('8d243660-647a-4284-ae81-724a03b1dc77', '8618cbe3-c4d3-4c9c-b54c-0384b319faba', 5, 0.1350);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('8d243660-647a-4284-ae81-724a03b1dc77', 'ba1d7ead-591d-415c-bb2e-4690e77ef4fc', 15, 0.8250);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('8d243660-647a-4284-ae81-724a03b1dc77', '680ebb95-83bd-4eb5-9732-bdd4afa533ea', 7, 0.6200);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('8d243660-647a-4284-ae81-724a03b1dc77', '4ca1c222-bd89-4a6b-a699-078aefc5a446', 7, 0.4984);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('8d243660-647a-4284-ae81-724a03b1dc77', '56cbaaae-0a1c-4d9c-8ff9-719d576b87f0', 15, 0.7050);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('8d243660-647a-4284-ae81-724a03b1dc77', '408115a0-4c85-46e8-89e2-3296a85001d3', 3, 1.0320);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('8d243660-647a-4284-ae81-724a03b1dc77', '7470d2b7-b2e4-40d5-a5b5-6f597c9589cb', 10, 0.7000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('8d243660-647a-4284-ae81-724a03b1dc77', '82a87708-ee8d-4b24-8b1d-3332cf52f646', 30, 1.1400);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('f892e1a0-871f-4ba7-bdfa-e256d3119dec', '1b13104d-cf38-433a-90ef-d059b438e529', 150, 4.5000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('f892e1a0-871f-4ba7-bdfa-e256d3119dec', '0676a05f-faa5-477c-bdfc-571dff9b64bf', 30, 0.9000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('f892e1a0-871f-4ba7-bdfa-e256d3119dec', '0ad98f40-e009-469a-a40e-c9848285219e', 10, 1.6000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('f892e1a0-871f-4ba7-bdfa-e256d3119dec', '7470d2b7-b2e4-40d5-a5b5-6f597c9589cb', 10, 0.7000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('f892e1a0-871f-4ba7-bdfa-e256d3119dec', '9037d54b-64df-4aad-af8b-976b82180838', 5, 0.3500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('f892e1a0-871f-4ba7-bdfa-e256d3119dec', 'ba1d7ead-591d-415c-bb2e-4690e77ef4fc', 7, 0.3850);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('f892e1a0-871f-4ba7-bdfa-e256d3119dec', '4ca1c222-bd89-4a6b-a699-078aefc5a446', 7, 0.4984);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('f892e1a0-871f-4ba7-bdfa-e256d3119dec', '56cbaaae-0a1c-4d9c-8ff9-719d576b87f0', 7, 0.3290);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('fd3abeec-54be-413b-afe7-07d0f53ca94d', 'ff1e3a74-89ca-412a-88ae-c738822db7b2', 0, 0.0000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('fd3abeec-54be-413b-afe7-07d0f53ca94d', 'b3c4970f-d3ad-4260-a3b1-40dbf2cb31fc', 100, 13.0500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('fd3abeec-54be-413b-afe7-07d0f53ca94d', 'e9c65007-59bf-4c21-8dd6-3f39624f07f6', 30, 1.5000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('fd3abeec-54be-413b-afe7-07d0f53ca94d', '56cbaaae-0a1c-4d9c-8ff9-719d576b87f0', 15, 0.7050);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('fd3abeec-54be-413b-afe7-07d0f53ca94d', '7470d2b7-b2e4-40d5-a5b5-6f597c9589cb', 10, 0.7000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('fd3abeec-54be-413b-afe7-07d0f53ca94d', '82a87708-ee8d-4b24-8b1d-3332cf52f646', 30, 1.1400);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('fd3abeec-54be-413b-afe7-07d0f53ca94d', '9b7fdb52-245e-476e-b2ef-670ba9c87fec', 10, 0.4167);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('fd3abeec-54be-413b-afe7-07d0f53ca94d', '9037d54b-64df-4aad-af8b-976b82180838', 5, 0.3500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('fd3abeec-54be-413b-afe7-07d0f53ca94d', 'ba3eefc6-2ced-4348-a2a0-531cbe40660b', 5, 1.1428);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('fd3abeec-54be-413b-afe7-07d0f53ca94d', 'ba1d7ead-591d-415c-bb2e-4690e77ef4fc', 7, 0.3850);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('fd3abeec-54be-413b-afe7-07d0f53ca94d', '4ca1c222-bd89-4a6b-a699-078aefc5a446', 7, 0.4984);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('fd3abeec-54be-413b-afe7-07d0f53ca94d', '680ebb95-83bd-4eb5-9732-bdd4afa533ea', 4, 0.3543);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('fd3abeec-54be-413b-afe7-07d0f53ca94d', '5089c485-ade6-4b48-95e6-61bc473fc672', 100, 2.3000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('b9650f9d-b750-471a-8bec-951fcc11577c', 'ba527c0e-ccf2-44d3-8054-40dc077b7034', 70, 9.4500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('b9650f9d-b750-471a-8bec-951fcc11577c', '0d8989aa-501a-4b46-9304-5d4b643a513b', 50, 3.2640);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('b9650f9d-b750-471a-8bec-951fcc11577c', '5fabb1f1-e5a0-4f70-88cb-fad4ca74e50c', 50, 2.4500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('b9650f9d-b750-471a-8bec-951fcc11577c', '47512307-f760-42ce-b0a8-23b263bf7eb2', 50, 2.0835);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('b9650f9d-b750-471a-8bec-951fcc11577c', '4ba47277-c602-48fd-a9b2-272cc36cf656', 5, 0.0750);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('b9650f9d-b750-471a-8bec-951fcc11577c', '9037d54b-64df-4aad-af8b-976b82180838', 5, 0.3500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('b9650f9d-b750-471a-8bec-951fcc11577c', '8618cbe3-c4d3-4c9c-b54c-0384b319faba', 5, 0.1350);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('b9650f9d-b750-471a-8bec-951fcc11577c', 'ba1d7ead-591d-415c-bb2e-4690e77ef4fc', 7, 0.3850);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('ea0df2a0-5f37-451a-a225-0d1bdb38f8fe', 'f12709f5-8f4e-44c9-9f36-61551614e0e8', 100, 13.0000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('ea0df2a0-5f37-451a-a225-0d1bdb38f8fe', '82a87708-ee8d-4b24-8b1d-3332cf52f646', 20, 0.7600);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('ea0df2a0-5f37-451a-a225-0d1bdb38f8fe', 'dd22ed64-5786-4cd2-82ba-1805467e4538', 20, 0.4376);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('ea0df2a0-5f37-451a-a225-0d1bdb38f8fe', '9d5b741b-54db-4ea1-a61e-955250b8815f', 10, 0.5000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('ea0df2a0-5f37-451a-a225-0d1bdb38f8fe', '0ad98f40-e009-469a-a40e-c9848285219e', 10, 1.6000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('ea0df2a0-5f37-451a-a225-0d1bdb38f8fe', '4ba47277-c602-48fd-a9b2-272cc36cf656', 3, 0.0450);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('ea0df2a0-5f37-451a-a225-0d1bdb38f8fe', '9037d54b-64df-4aad-af8b-976b82180838', 5, 0.3500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('ea0df2a0-5f37-451a-a225-0d1bdb38f8fe', 'be37a866-377c-435e-85b3-7b993b5bf89f', 7, 0.1750);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('a4a05b68-bc24-4c61-8e2c-ddc3cf9a6673', 'd1b3a7dc-b126-4be5-b4b9-73ea09c3b637', 100, 22.6670);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('a4a05b68-bc24-4c61-8e2c-ddc3cf9a6673', '0861ab2d-7ae0-44fe-b66f-6ee25494aa75', 50, 5.0000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('a4a05b68-bc24-4c61-8e2c-ddc3cf9a6673', '7470d2b7-b2e4-40d5-a5b5-6f597c9589cb', 10, 0.7000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('a4a05b68-bc24-4c61-8e2c-ddc3cf9a6673', '9b7fdb52-245e-476e-b2ef-670ba9c87fec', 10, 0.4167);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('a4a05b68-bc24-4c61-8e2c-ddc3cf9a6673', '82a87708-ee8d-4b24-8b1d-3332cf52f646', 30, 1.1400);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('a4a05b68-bc24-4c61-8e2c-ddc3cf9a6673', 'e9c65007-59bf-4c21-8dd6-3f39624f07f6', 10, 0.5000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('a4a05b68-bc24-4c61-8e2c-ddc3cf9a6673', '56cbaaae-0a1c-4d9c-8ff9-719d576b87f0', 15, 0.7050);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('a4a05b68-bc24-4c61-8e2c-ddc3cf9a6673', '9037d54b-64df-4aad-af8b-976b82180838', 5, 0.3500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('a4a05b68-bc24-4c61-8e2c-ddc3cf9a6673', '8618cbe3-c4d3-4c9c-b54c-0384b319faba', 3, 0.0810);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('a4a05b68-bc24-4c61-8e2c-ddc3cf9a6673', 'ba1d7ead-591d-415c-bb2e-4690e77ef4fc', 15, 0.8250);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('a4a05b68-bc24-4c61-8e2c-ddc3cf9a6673', '680ebb95-83bd-4eb5-9732-bdd4afa533ea', 7, 0.6200);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('a4a05b68-bc24-4c61-8e2c-ddc3cf9a6673', '408115a0-4c85-46e8-89e2-3296a85001d3', 3, 1.0320);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('a4a05b68-bc24-4c61-8e2c-ddc3cf9a6673', '72fa574d-07ff-4ec9-a90e-6d86ee14ca18', 3, 1.2000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('a4a05b68-bc24-4c61-8e2c-ddc3cf9a6673', '5089c485-ade6-4b48-95e6-61bc473fc672', 100, 2.3000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('2031d794-1726-4151-a28f-5939d5fc7c33', '22ca9759-ed9b-42d7-bb55-a8b3111f3d87', 40, 8.5000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('2031d794-1726-4151-a28f-5939d5fc7c33', 'd1b3a7dc-b126-4be5-b4b9-73ea09c3b637', 50, 11.3335);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('2031d794-1726-4151-a28f-5939d5fc7c33', 'dd22ed64-5786-4cd2-82ba-1805467e4538', 20, 0.4376);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('2031d794-1726-4151-a28f-5939d5fc7c33', '9037d54b-64df-4aad-af8b-976b82180838', 5, 0.3500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('2031d794-1726-4151-a28f-5939d5fc7c33', 'a9b60ee2-4116-473d-8d62-4a9967cc25ba', 7, 0.0000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('2031d794-1726-4151-a28f-5939d5fc7c33', '584fa510-911f-4730-93b6-f966dd406a64', 7, 0.2898);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('dafde2ba-1a67-4b01-b011-007446f1ea9c', '0676a05f-faa5-477c-bdfc-571dff9b64bf', 100, 3.0000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('dafde2ba-1a67-4b01-b011-007446f1ea9c', '82a87708-ee8d-4b24-8b1d-3332cf52f646', 20, 0.7600);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('dafde2ba-1a67-4b01-b011-007446f1ea9c', '7470d2b7-b2e4-40d5-a5b5-6f597c9589cb', 1, 0.0700);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('dafde2ba-1a67-4b01-b011-007446f1ea9c', '0ad98f40-e009-469a-a40e-c9848285219e', 10, 1.6000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('dafde2ba-1a67-4b01-b011-007446f1ea9c', '9d5b741b-54db-4ea1-a61e-955250b8815f', 20, 1.0000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('dafde2ba-1a67-4b01-b011-007446f1ea9c', '9037d54b-64df-4aad-af8b-976b82180838', 5, 0.3500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('dafde2ba-1a67-4b01-b011-007446f1ea9c', '4ba47277-c602-48fd-a9b2-272cc36cf656', 3, 0.0450);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('dafde2ba-1a67-4b01-b011-007446f1ea9c', '8cbfab94-1213-4407-a1f4-58b98b91f94a', 5, 0.2500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('8e923b9a-20ab-4987-a692-b5b751bfdf35', '3489cd3e-6918-40c2-ad89-6cc1ae2dfd6a', 150, 21.2280);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('8e923b9a-20ab-4987-a692-b5b751bfdf35', '3feceeac-17fb-4716-8254-f982cefcf578', 140, 3.2200);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('8e923b9a-20ab-4987-a692-b5b751bfdf35', 'dd22ed64-5786-4cd2-82ba-1805467e4538', 20, 0.4376);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('8e923b9a-20ab-4987-a692-b5b751bfdf35', 'a6469f04-202e-45b6-ab4a-5f4f9d043dcb', 20, 1.2500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('8e923b9a-20ab-4987-a692-b5b751bfdf35', '262c6655-9e03-4e54-aef3-75794030f062', 20, 0.7000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('8e923b9a-20ab-4987-a692-b5b751bfdf35', 'f8c9810b-9a2c-4e54-ba6c-da39aa0aa15f', 20, 0.6000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('8e923b9a-20ab-4987-a692-b5b751bfdf35', '7470d2b7-b2e4-40d5-a5b5-6f597c9589cb', 5, 0.3500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('8e923b9a-20ab-4987-a692-b5b751bfdf35', '34b1cf2c-66d3-4088-a0b5-66218b298dae', 7, 0.7000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('8e923b9a-20ab-4987-a692-b5b751bfdf35', 'ff9729ab-2384-4af3-bf30-61aebf6db23a', 2, 2.2800);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('8e923b9a-20ab-4987-a692-b5b751bfdf35', '958f15f9-a642-46c3-aff2-3f666e707592', 20, 1.5800);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('8e923b9a-20ab-4987-a692-b5b751bfdf35', '5089c485-ade6-4b48-95e6-61bc473fc672', 100, 2.3000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('79293aa6-072a-4e00-906f-22b6b33b895e', '3489cd3e-6918-40c2-ad89-6cc1ae2dfd6a', 70, 9.9064);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('79293aa6-072a-4e00-906f-22b6b33b895e', '114e2340-546d-4d67-8d69-67407ce9b6fa', 50, 4.0000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('79293aa6-072a-4e00-906f-22b6b33b895e', '38f27a00-ff8c-4d74-9ef0-e8ac77871057', 20, 1.8000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('79293aa6-072a-4e00-906f-22b6b33b895e', 'dd22ed64-5786-4cd2-82ba-1805467e4538', 10, 0.2188);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('79293aa6-072a-4e00-906f-22b6b33b895e', 'f8c9810b-9a2c-4e54-ba6c-da39aa0aa15f', 10, 0.3000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('79293aa6-072a-4e00-906f-22b6b33b895e', 'a6469f04-202e-45b6-ab4a-5f4f9d043dcb', 10, 0.6250);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('79293aa6-072a-4e00-906f-22b6b33b895e', 'd82f497a-3294-41e8-b561-f9ebb4c4c233', 10, 1.1000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('79293aa6-072a-4e00-906f-22b6b33b895e', 'ff9729ab-2384-4af3-bf30-61aebf6db23a', 2, 2.2800);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('79293aa6-072a-4e00-906f-22b6b33b895e', '4d726ebb-25e5-4409-95ca-1d85b6b4ff51', 20, 2.0000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('79293aa6-072a-4e00-906f-22b6b33b895e', '9037d54b-64df-4aad-af8b-976b82180838', 5, 0.3500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('79293aa6-072a-4e00-906f-22b6b33b895e', '84355051-3fad-495f-a44d-1553464ff674', 1, 7.1200);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('1804dd85-794d-40e5-9cf9-6ac74b221a86', '4e7cffe8-f488-4b40-958b-ef12c66614e3', 200, 10.0000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('1804dd85-794d-40e5-9cf9-6ac74b221a86', '7470d2b7-b2e4-40d5-a5b5-6f597c9589cb', 1, 0.0700);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('1804dd85-794d-40e5-9cf9-6ac74b221a86', '56cbaaae-0a1c-4d9c-8ff9-719d576b87f0', 7, 0.3290);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('1804dd85-794d-40e5-9cf9-6ac74b221a86', '9037d54b-64df-4aad-af8b-976b82180838', 5, 0.3500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('1804dd85-794d-40e5-9cf9-6ac74b221a86', '4ba47277-c602-48fd-a9b2-272cc36cf656', 3, 0.0450);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('fa3f25bb-93d1-41ad-9ae3-29828fdda310', '11932546-445f-4825-b796-5391d023e5d9', 100, 15.5000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('fa3f25bb-93d1-41ad-9ae3-29828fdda310', '0861ab2d-7ae0-44fe-b66f-6ee25494aa75', 50, 5.0000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('fa3f25bb-93d1-41ad-9ae3-29828fdda310', '56cbaaae-0a1c-4d9c-8ff9-719d576b87f0', 15, 0.7050);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('fa3f25bb-93d1-41ad-9ae3-29828fdda310', '7470d2b7-b2e4-40d5-a5b5-6f597c9589cb', 10, 0.7000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('fa3f25bb-93d1-41ad-9ae3-29828fdda310', '9b7fdb52-245e-476e-b2ef-670ba9c87fec', 10, 0.4167);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('fa3f25bb-93d1-41ad-9ae3-29828fdda310', '4ca1c222-bd89-4a6b-a699-078aefc5a446', 7, 0.4984);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('fa3f25bb-93d1-41ad-9ae3-29828fdda310', '680ebb95-83bd-4eb5-9732-bdd4afa533ea', 5, 0.4428);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('fa3f25bb-93d1-41ad-9ae3-29828fdda310', 'e9c65007-59bf-4c21-8dd6-3f39624f07f6', 10, 0.5000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('fa3f25bb-93d1-41ad-9ae3-29828fdda310', '5089c485-ade6-4b48-95e6-61bc473fc672', 100, 2.3000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('c2f0d11e-1037-4ad8-8891-505ef5112519', '11932546-445f-4825-b796-5391d023e5d9', 100, 15.5000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('c2f0d11e-1037-4ad8-8891-505ef5112519', 'e9c65007-59bf-4c21-8dd6-3f39624f07f6', 20, 1.0000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('c2f0d11e-1037-4ad8-8891-505ef5112519', '0ad98f40-e009-469a-a40e-c9848285219e', 15, 2.4000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('c2f0d11e-1037-4ad8-8891-505ef5112519', '9b7fdb52-245e-476e-b2ef-670ba9c87fec', 10, 0.4167);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('c2f0d11e-1037-4ad8-8891-505ef5112519', '7470d2b7-b2e4-40d5-a5b5-6f597c9589cb', 10, 0.7000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('c2f0d11e-1037-4ad8-8891-505ef5112519', '82a87708-ee8d-4b24-8b1d-3332cf52f646', 30, 1.1400);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('c2f0d11e-1037-4ad8-8891-505ef5112519', '56cbaaae-0a1c-4d9c-8ff9-719d576b87f0', 15, 0.7050);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('c2f0d11e-1037-4ad8-8891-505ef5112519', '4ba47277-c602-48fd-a9b2-272cc36cf656', 3, 0.0450);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('c2f0d11e-1037-4ad8-8891-505ef5112519', '9037d54b-64df-4aad-af8b-976b82180838', 5, 0.3500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('c2f0d11e-1037-4ad8-8891-505ef5112519', 'c161a507-edb5-4053-8fc3-eb527f7f35ee', 3, 0.9375);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('c2f0d11e-1037-4ad8-8891-505ef5112519', '1d837150-3d17-4adb-8953-867093882c03', 2, 0.5520);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('c2f0d11e-1037-4ad8-8891-505ef5112519', '5089c485-ade6-4b48-95e6-61bc473fc672', 100, 2.3000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('0900857a-60c5-4bd2-945a-82e12f32838a', '3489cd3e-6918-40c2-ad89-6cc1ae2dfd6a', 100, 14.1520);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('0900857a-60c5-4bd2-945a-82e12f32838a', 'dd22ed64-5786-4cd2-82ba-1805467e4538', 30, 0.6564);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('0900857a-60c5-4bd2-945a-82e12f32838a', '0861ab2d-7ae0-44fe-b66f-6ee25494aa75', 30, 3.0000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('0900857a-60c5-4bd2-945a-82e12f32838a', '958f15f9-a642-46c3-aff2-3f666e707592', 30, 2.3700);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('0900857a-60c5-4bd2-945a-82e12f32838a', '82a87708-ee8d-4b24-8b1d-3332cf52f646', 30, 1.1400);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('0900857a-60c5-4bd2-945a-82e12f32838a', '7470d2b7-b2e4-40d5-a5b5-6f597c9589cb', 10, 0.7000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('0900857a-60c5-4bd2-945a-82e12f32838a', '9b7fdb52-245e-476e-b2ef-670ba9c87fec', 10, 0.4167);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('0900857a-60c5-4bd2-945a-82e12f32838a', 'a6469f04-202e-45b6-ab4a-5f4f9d043dcb', 20, 1.2500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('0900857a-60c5-4bd2-945a-82e12f32838a', '56cbaaae-0a1c-4d9c-8ff9-719d576b87f0', 15, 0.7050);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('0900857a-60c5-4bd2-945a-82e12f32838a', '4ba47277-c602-48fd-a9b2-272cc36cf656', 5, 0.0750);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('0900857a-60c5-4bd2-945a-82e12f32838a', '9037d54b-64df-4aad-af8b-976b82180838', 5, 0.3500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('0900857a-60c5-4bd2-945a-82e12f32838a', '0676a05f-faa5-477c-bdfc-571dff9b64bf', 30, 0.9000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('0900857a-60c5-4bd2-945a-82e12f32838a', 'ba1d7ead-591d-415c-bb2e-4690e77ef4fc', 7, 0.3850);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('0900857a-60c5-4bd2-945a-82e12f32838a', '4ca1c222-bd89-4a6b-a699-078aefc5a446', 7, 0.4984);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('0900857a-60c5-4bd2-945a-82e12f32838a', '2f7dc76a-0c10-4420-b698-b4a5abe86b9c', 50, 2.9450);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('0900857a-60c5-4bd2-945a-82e12f32838a', '34b1cf2c-66d3-4088-a0b5-66218b298dae', 10, 1.0000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('0900857a-60c5-4bd2-945a-82e12f32838a', '3978486a-b286-45fd-8a77-1af5801f33a7', 7, 0.2100);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('0900857a-60c5-4bd2-945a-82e12f32838a', '8618cbe3-c4d3-4c9c-b54c-0384b319faba', 5, 0.1350);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('0900857a-60c5-4bd2-945a-82e12f32838a', '5089c485-ade6-4b48-95e6-61bc473fc672', 100, 2.3000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('98af3dce-ec5c-4691-9a66-089389458727', '88e75e4c-5bca-44a9-bf97-46a4ff75a380', 100, 19.0000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('98af3dce-ec5c-4691-9a66-089389458727', '36609de6-4c69-4ad4-8402-3e38837c498e', 30, 0.8100);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('98af3dce-ec5c-4691-9a66-089389458727', '82a87708-ee8d-4b24-8b1d-3332cf52f646', 20, 0.7600);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('98af3dce-ec5c-4691-9a66-089389458727', '7470d2b7-b2e4-40d5-a5b5-6f597c9589cb', 10, 0.7000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('98af3dce-ec5c-4691-9a66-089389458727', '9b7fdb52-245e-476e-b2ef-670ba9c87fec', 5, 0.2083);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('98af3dce-ec5c-4691-9a66-089389458727', '0ad98f40-e009-469a-a40e-c9848285219e', 10, 1.6000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('98af3dce-ec5c-4691-9a66-089389458727', '56cbaaae-0a1c-4d9c-8ff9-719d576b87f0', 7, 0.3290);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('98af3dce-ec5c-4691-9a66-089389458727', '9037d54b-64df-4aad-af8b-976b82180838', 5, 0.3500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('98af3dce-ec5c-4691-9a66-089389458727', '584fa510-911f-4730-93b6-f966dd406a64', 5, 0.2070);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('98af3dce-ec5c-4691-9a66-089389458727', 'be37a866-377c-435e-85b3-7b993b5bf89f', 7, 0.1750);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('98af3dce-ec5c-4691-9a66-089389458727', '1d837150-3d17-4adb-8953-867093882c03', 2, 0.5520);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('98af3dce-ec5c-4691-9a66-089389458727', '0676a05f-faa5-477c-bdfc-571dff9b64bf', 20, 0.6000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('98af3dce-ec5c-4691-9a66-089389458727', '5089c485-ade6-4b48-95e6-61bc473fc672', 100, 2.3000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('c2dcbde8-917a-41f5-9c12-c8a709117451', 'd1b3a7dc-b126-4be5-b4b9-73ea09c3b637', 100, 22.6670);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('c2dcbde8-917a-41f5-9c12-c8a709117451', '0ad98f40-e009-469a-a40e-c9848285219e', 50, 8.0000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('c2dcbde8-917a-41f5-9c12-c8a709117451', '1d837150-3d17-4adb-8953-867093882c03', 2, 0.5520);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('c2dcbde8-917a-41f5-9c12-c8a709117451', 'c161a507-edb5-4053-8fc3-eb527f7f35ee', 3, 0.9375);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('c2dcbde8-917a-41f5-9c12-c8a709117451', '4ba47277-c602-48fd-a9b2-272cc36cf656', 2, 0.0300);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('c2dcbde8-917a-41f5-9c12-c8a709117451', '56cbaaae-0a1c-4d9c-8ff9-719d576b87f0', 15, 0.7050);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('c2dcbde8-917a-41f5-9c12-c8a709117451', '82a87708-ee8d-4b24-8b1d-3332cf52f646', 30, 1.1400);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('c2dcbde8-917a-41f5-9c12-c8a709117451', '7470d2b7-b2e4-40d5-a5b5-6f597c9589cb', 10, 0.7000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('c2dcbde8-917a-41f5-9c12-c8a709117451', '9037d54b-64df-4aad-af8b-976b82180838', 3, 0.2100);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('c2dcbde8-917a-41f5-9c12-c8a709117451', 'be752d45-f1ef-47bc-9ac3-a04d2a8e962e', 1, 0.0000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('c2dcbde8-917a-41f5-9c12-c8a709117451', '5089c485-ade6-4b48-95e6-61bc473fc672', 100, 2.3000);

-- Step 4: Daily Menu Plan (Monthly Calendar)
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('10cf95d3-ca77-4b95-853f-7d39742e05e0', '2026-06-01', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('a1e9e9ee-8ae9-4886-8d4a-3a000d18dc4d', '2026-06-01', true, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('df213922-9cfa-448b-887d-8bd9abd56384', '2026-06-02', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('1d25b349-5739-4096-b46a-f1ed1301164a', '2026-06-02', true, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('cc2c4972-68e4-4ef0-ad61-71af054b2f4b', '2026-06-03', false, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('53ca01e5-6e8b-4dca-93c6-917e79be4ec6', '2026-06-03', true, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('68d86817-eb16-4297-822a-d5fae00e531f', '2026-06-04', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('3608d2aa-c36c-49cf-a1e5-76998262f24e', '2026-06-04', true, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('9e5aea65-991d-4be8-9713-71d5718d79e9', '2026-06-05', false, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('4c35f2a0-7981-4726-9f2e-5606078e7535', '2026-06-05', true, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('1ecb158c-8958-480d-ba7c-39fe47c3968f', '2026-06-06', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('c42872f5-f8ef-415c-b92a-e508650d56c3', '2026-06-06', false, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('5bb02775-b6e4-4357-b918-616831384b4b', '2026-06-08', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('ba2ae827-7a6a-4ee3-9a70-bae53628a183', '2026-06-08', false, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('61797619-69f7-4ed1-b150-438ba616198c', '2026-06-09', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('30141b36-58fe-4e74-bb5e-41b9cc21b74d', '2026-06-09', false, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('4cdf28f9-2bc9-4796-b57a-4afb0c00f5fa', '2026-06-10', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('89b7d14b-eff7-4691-8f05-822273a08178', '2026-06-10', false, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('497fbba3-80b8-42d3-a9d9-1199585ba591', '2026-06-11', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('fd0beccd-f063-4f4a-9586-b9de8da6b658', '2026-06-11', false, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('8e744bdb-5eb4-4b70-8c80-9f0f32b8ec49', '2026-06-12', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('7bd63b35-8274-444b-b2e3-71444bab5879', '2026-06-12', false, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('012002a0-92b9-451a-bf68-f86e3aa49cd3', '2026-06-13', false, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('e3bbc663-ca69-49e0-90bd-7f5272f79526', '2026-06-13', true, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('69f58af8-01bf-4865-8c92-d07c44480977', '2026-06-15', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('f6222dbd-e451-4957-ab15-d8195eb83aba', '2026-06-15', true, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('863fc9c4-936b-4438-b7ba-25e1e49a37ad', '2026-06-16', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('6eb15994-0b75-452e-811c-3527fa42943f', '2026-06-16', false, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('ad820fe2-c923-4088-baa5-f6784bccfdd5', '2026-06-17', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('0b58563d-9635-43fc-913e-03957d6daae3', '2026-06-17', false, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('0cf9a9b4-743a-42c6-bf86-bfa84f733ffb', '2026-06-18', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('71ade3b9-2374-4f17-a17b-14e8f04359ad', '2026-06-18', false, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('ba89c903-1893-4443-bde4-e72d234279bb', '2026-06-19', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('cfa62ba0-0aae-4326-b0fa-98cdbd06f18f', '2026-06-19', true, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('0e806b79-e02d-4d9e-9c82-9a7ff492afd7', '2026-06-20', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('ccf015db-b156-4532-8430-c311ebed082d', '2026-06-20', false, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('346319ef-eeba-419b-a19d-8512bf153269', '2026-06-22', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('c50fec68-edf8-4093-81f4-f7115529fe73', '2026-06-22', false, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('a3073970-f26b-4e25-adb5-960d76642e7a', '2026-06-23', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('b223c43d-041f-4a8b-b9c9-15a410d72d21', '2026-06-23', false, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('92cacf26-9f30-4384-90e8-e781952924b7', '2026-06-24', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('70889d4e-9215-4794-a1df-954af7ac36c5', '2026-06-24', true, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('4e5f2b23-f046-4755-a528-c3472190f544', '2026-06-25', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('24696215-9fcc-4615-82bd-4e21ae969309', '2026-06-25', false, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('2999ae7f-eda6-45de-8f48-6da85bda399b', '2026-06-26', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('7937148f-50eb-42a0-acaf-ab7656571797', '2026-06-26', false, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('744a515c-46e9-4fee-92e8-8c7880ba9c08', '2026-06-27', false, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('2753da2e-aae6-4ece-904f-e768c46d8ba6', '2026-06-27', true, 'DINNER') ON CONFLICT DO NOTHING;

-- Step 5: Menu Types (which menus are scheduled per daily menu)
-- Uncosted item: ဝက်ကချင်ချက် for 2026-06-01 LUNCH
-- Uncosted item: ‌ဇူကာညွန့်ကြော်ချက် for 2026-06-01 LUNCH
-- Soup/drink (uncosted): မုန်လာရွက်ချဉ်ဟင်း for 2026-06-01 LUNCH
-- Uncosted item: ဝက်ကုန်းဘောင် for 2026-06-01 DINNER
-- Uncosted item: ‌ဇူကာညွန့်ကြော်ချက် for 2026-06-01 DINNER
-- Uncosted item: ငါးဖယ်သုပ် for 2026-06-02 LUNCH
INSERT INTO operations.menu_types (id, menu_id, daily_menus_id, is_main) VALUES ('c994c097-0483-419e-8d4d-a4c797853563', '1804dd85-794d-40e5-9cf9-6ac74b221a86', 'df213922-9cfa-448b-887d-8bd9abd56384', false) ON CONFLICT DO NOTHING;
-- Soup/drink (uncosted): ပဲနီလေးဟင်းချို for 2026-06-02 LUNCH
-- Uncosted item: ငါးဖယ်ခရမ်းချဉ်သီး for 2026-06-02 DINNER
INSERT INTO operations.menu_types (id, menu_id, daily_menus_id, is_main) VALUES ('f8498d60-0a95-49db-95ba-d5fc00b9b7fa', '1804dd85-794d-40e5-9cf9-6ac74b221a86', '1d25b349-5739-4096-b46a-f1ed1301164a', false) ON CONFLICT DO NOTHING;
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
INSERT INTO operations.menu_types (id, menu_id, daily_menus_id, is_main) VALUES ('c4bbddc7-7624-47f9-880c-8adcaa545382', '1804dd85-794d-40e5-9cf9-6ac74b221a86', '9e5aea65-991d-4be8-9713-71d5718d79e9', false) ON CONFLICT DO NOTHING;
-- Uncosted item: ငရုတ်သီးဆားထောင်း for 2026-06-05 LUNCH
-- Soup/drink (uncosted): ငါးချဉ်စပ်ဟင်းရည် for 2026-06-05 LUNCH
-- Uncosted item: ငါးထမင်းနယ် for 2026-06-05 DINNER
INSERT INTO operations.menu_types (id, menu_id, daily_menus_id, is_main) VALUES ('cc8df6a3-3ff7-4e5c-b1a8-ddf754c9e6a5', '1804dd85-794d-40e5-9cf9-6ac74b221a86', '4c35f2a0-7981-4726-9f2e-5606078e7535', false) ON CONFLICT DO NOTHING;
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
INSERT INTO operations.menu_types (id, menu_id, daily_menus_id, is_main) VALUES ('6d9530ce-e7b5-43d1-be45-fd7789b290e9', 'dafde2ba-1a67-4b01-b011-007446f1ea9c', '0cf9a9b4-743a-42c6-bf86-bfa84f733ffb', false) ON CONFLICT DO NOTHING;
-- Soup/drink (uncosted): မြင်းခွာရွက်ဟင်းခါး for 2026-06-18 LUNCH
-- Uncosted item: ခေါက်ဆွဲကြော်(ဝက်) for 2026-06-18 DINNER
INSERT INTO operations.menu_types (id, menu_id, daily_menus_id, is_main) VALUES ('32b583d5-4093-4fb0-96f1-5c8e5aa01aa6', 'dafde2ba-1a67-4b01-b011-007446f1ea9c', '71ade3b9-2374-4f17-a17b-14e8f04359ad', false) ON CONFLICT DO NOTHING;
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
INSERT INTO operations.menu_types (id, menu_id, daily_menus_id, is_main) VALUES ('086bd4a1-ca90-4db3-85db-d7c68693cbf3', 'be4325fa-cf4e-4196-ba57-d5be1ddab602', 'a3073970-f26b-4e25-adb5-960d76642e7a', false) ON CONFLICT DO NOTHING;
-- Uncosted item: ကြက်ပေါင်းခေါက်ဆွဲ for 2026-06-23 DINNER
INSERT INTO operations.menu_types (id, menu_id, daily_menus_id, is_main) VALUES ('a897e8b2-060a-41a4-8292-8f45dc61d9fd', 'be4325fa-cf4e-4196-ba57-d5be1ddab602', 'b223c43d-041f-4a8b-b9c9-15a410d72d21', false) ON CONFLICT DO NOTHING;
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
