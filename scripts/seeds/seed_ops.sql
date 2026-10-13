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
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('aea9ee43-d7d8-44ac-a958-4ccc86cebaf2', 'Beef Lean', 'ITM-0001', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('aea9ee43-d7d8-44ac-a958-4ccc86cebaf2', 0, 0, 0.24534) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('ef92db27-5fc5-4c9f-8094-0e778cf80cda', 'Bell Pepper', 'ITM-0002', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('ef92db27-5fc5-4c9f-8094-0e778cf80cda', 0, 0, 0.1) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('fa269676-1518-4d1a-a896-66fe642034d7', 'King Rice Bran Oil 5 L', 'ITM-0003', 'RECIPE_INGREDIENT', 'ml') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('fa269676-1518-4d1a-a896-66fe642034d7', 0, 0, 0.047) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('d9ec474a-aab0-44f8-8ad9-01828a5edb8d', 'Turmeric Powder', 'ITM-0004', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('d9ec474a-aab0-44f8-8ad9-01828a5edb8d', 0, 0, 0.276) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('f63275ac-7797-4b15-8263-ccf4364a400c', 'Chicken Seasoning Powder', 'ITM-0005', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('f63275ac-7797-4b15-8263-ccf4364a400c', 0, 0, 0.07) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('73fe83a8-c0df-4655-a4ce-6df5d5960141', 'Chili Colored Powder', 'ITM-0006', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('73fe83a8-c0df-4655-a4ce-6df5d5960141', 0, 0, 0.3125) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('25c8cbd5-4279-403c-b187-29f376f53256', 'Salt', 'ITM-0007', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('25c8cbd5-4279-403c-b187-29f376f53256', 0, 0, 0.015) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('606bdb8f-2b96-434e-9e3d-4aee23fe785f', 'Garlic', 'ITM-0008', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('606bdb8f-2b96-434e-9e3d-4aee23fe785f', 0, 0, 0.07) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('637b5394-84f6-471b-a205-ba486d30b4a9', 'Shallot', 'ITM-0009', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('637b5394-84f6-471b-a205-ba486d30b4a9', 0, 0, 0.038) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('f4788e03-d79f-4bd5-bc45-6ab8545e8546', 'Golden Mountain Soy Sauce', 'ITM-0010', 'RECIPE_INGREDIENT', 'ml') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('f4788e03-d79f-4bd5-bc45-6ab8545e8546', 0, 0, 0.055) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('f03c74fd-5c1b-4d4b-be1c-b57a51a8c974', 'Pure Refined Sugar', 'ITM-0011', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('f03c74fd-5c1b-4d4b-be1c-b57a51a8c974', 0, 0, 0.027) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('f93f9199-955c-4609-a27c-7917e9c8f02f', 'Ginger', 'ITM-0012', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('f93f9199-955c-4609-a27c-7917e9c8f02f', 0, 0, 0.04167) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('cbcd6a90-88a1-47e7-8598-5f99350ab7a7', 'Rice', 'ITM-0013', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('cbcd6a90-88a1-47e7-8598-5f99350ab7a7', 0, 0, 0.023) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('8d0e2d51-316a-4900-9d96-0d313c895c5f', 'Wa-Ooh Noodle', 'ITM-0014', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('8d0e2d51-316a-4900-9d96-0d313c895c5f', 0, 0, 0.09) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('f5bffba3-f309-4ef5-8ce8-711e74b4856a', 'Peanut Butter', 'ITM-0015', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('f5bffba3-f309-4ef5-8ce8-711e74b4856a', 0, 0, 0.285) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('00be9bc9-01bb-49cb-be7b-8a0f565cf904', 'Chinese Kale', 'ITM-0016', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('00be9bc9-01bb-49cb-be7b-8a0f565cf904', 0, 0, 0.04167) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('5cee3592-2b71-4cfc-ad05-f29a1144bd36', 'Mala Paste', 'ITM-0017', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('5cee3592-2b71-4cfc-ad05-f29a1144bd36', 0, 0, 0.1) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('899432dd-954b-41ca-98f8-1e503687cc42', 'Pork Soup Bone', 'ITM-0018', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('899432dd-954b-41ca-98f8-1e503687cc42', 0, 0, 0.049) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('d463c1de-f3ad-4be1-bc61-e5cab0a45729', 'Vinegar', 'ITM-0019', 'RECIPE_INGREDIENT', 'ml') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('d463c1de-f3ad-4be1-bc61-e5cab0a45729', 0, 0, 0.03) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('a3b497aa-4654-456f-a195-d0a4b450a070', 'Pork Ball', 'ITM-0020', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('a3b497aa-4654-456f-a195-d0a4b450a070', 0, 0, 0.135) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('2e67cf39-bdef-4e1e-8e66-ff62a004f2d0', 'Carrot', 'ITM-0021', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('2e67cf39-bdef-4e1e-8e66-ff62a004f2d0', 0, 0, 0.02188) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('2cabfb9e-7bbe-40c2-8950-2a5c32e525d3', 'Cabbage', 'ITM-0022', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('2cabfb9e-7bbe-40c2-8950-2a5c32e525d3', 0, 0, 0.027) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('1ec3cb4e-bb8e-4165-869e-03a9d014c9ed', 'Cauliflower', 'ITM-0023', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('1ec3cb4e-bb8e-4165-869e-03a9d014c9ed', 0, 0, 0.03) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('3341203d-2e8c-4b55-85d9-7399bbc91d37', 'Baby Corn', 'ITM-0024', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('3341203d-2e8c-4b55-85d9-7399bbc91d37', 0, 0, 0.0625) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('673cb007-8879-4b9a-a55a-917282dcca0c', 'Tomato', 'ITM-0025', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('673cb007-8879-4b9a-a55a-917282dcca0c', 0, 0, 0.03) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('19015638-8d43-44c9-a8f0-150ee22e957c', 'Oyster Sauce', 'ITM-0026', 'RECIPE_INGREDIENT', 'ml') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('19015638-8d43-44c9-a8f0-150ee22e957c', 0, 0, 0.0712) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('3f1d67ec-8287-468a-9458-007bbc1d8bb5', 'Pork Tenderloin', 'ITM-0027', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('3f1d67ec-8287-468a-9458-007bbc1d8bb5', 0, 0, 0.14152) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('f263e9aa-0d20-45a3-90ba-14ab2f75cee9', 'French Bean', 'ITM-0028', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('f263e9aa-0d20-45a3-90ba-14ab2f75cee9', 0, 0, 0.045) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('8f9136b6-e837-4697-ac34-6d4d96622e5b', 'Scallion / Spring Onion', 'ITM-0029', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('8f9136b6-e837-4697-ac34-6d4d96622e5b', 0, 0, 0.05) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('3ba2227f-ea14-45aa-900e-048e50238353', 'Broccoli', 'ITM-0030', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('3ba2227f-ea14-45aa-900e-048e50238353', 0, 0, 0.075) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('2f46bb98-36ee-4ab7-83fb-7ba8accad04e', 'Healthy Boy Sweet Soy Sauce', 'ITM-0031', 'RECIPE_INGREDIENT', 'ml') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('2f46bb98-36ee-4ab7-83fb-7ba8accad04e', 0, 0, 0.08857) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('0605fbd2-7825-47f1-a70b-698714119081', 'Black Pepper', 'ITM-0032', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('0605fbd2-7825-47f1-a70b-698714119081', 0, 0, 0.344) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('9a8053b1-8ba6-4984-b1d2-0a9c5f5ee62c', 'Dried Chili', 'ITM-0033', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('9a8053b1-8ba6-4984-b1d2-0a9c5f5ee62c', 0, 0, 0.4) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('563703a0-7cc4-476d-8b3b-5d96869ca7b2', 'Chicken Thigh', 'ITM-0034', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('563703a0-7cc4-476d-8b3b-5d96869ca7b2', 0, 0, 0.07813) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('04ef9339-7a4a-45c3-bce8-30498e077fcb', 'Wheat Noodle', 'ITM-0035', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('04ef9339-7a4a-45c3-bce8-30498e077fcb', 0, 0, 0.068) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('8a346a64-7947-4e44-a67e-443957c21832', 'Chinese Celery', 'ITM-0036', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('8a346a64-7947-4e44-a67e-443957c21832', 0, 0, 0.03) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('95cf0740-b736-4ae8-9f28-1152ecff95a3', 'Asparagus bean(Long Beans)', 'ITM-0037', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('95cf0740-b736-4ae8-9f28-1152ecff95a3', 0, 0, 0.03) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('e739869a-25e1-48d9-a26c-3478451f615d', 'Cabbage (White Cabbage)', 'ITM-0038', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('e739869a-25e1-48d9-a26c-3478451f615d', 0, 0, 0.035) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('f510faa0-18b1-46fb-8430-3741c8dda4a0', 'Bean Sprout', 'ITM-0039', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('f510faa0-18b1-46fb-8430-3741c8dda4a0', 0, 0, 0.03) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('08b4762d-fc4e-446b-8c2b-e56cedc4f6b5', 'Rice Vermicelli Small', 'ITM-0040', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('08b4762d-fc4e-446b-8c2b-e56cedc4f6b5', 0, 0, 0.06528) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('d5fb2586-4888-44ae-9b8a-c7f6d32baec3', 'Water Spinach (Morning Glory)', 'ITM-0041', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('d5fb2586-4888-44ae-9b8a-c7f6d32baec3', 0, 0, 0.03) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('f773e3e6-b069-4405-8c21-553513114c92', 'Green Chili', 'ITM-0042', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('f773e3e6-b069-4405-8c21-553513114c92', 0, 0, 0.16) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('0f4ff5a6-4341-45ff-8175-b7dc5ab43b16', 'Description', 'ITM-0043', 'RECIPE_INGREDIENT', 'U/M') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('0f4ff5a6-4341-45ff-8175-b7dc5ab43b16', 0, 0, 0) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('e5b7ba80-e871-446d-abf9-044b5851a0c6', 'Thin Pork Layer', 'ITM-0044', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('e5b7ba80-e871-446d-abf9-044b5851a0c6', 0, 0, 0.1305) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('713f3d33-8e4d-4dce-bc64-59aac4e0ce13', 'White Pepper Powder', 'ITM-0045', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('713f3d33-8e4d-4dce-bc64-59aac4e0ce13', 0, 0, 0.22857) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('adbff815-57b1-4eb3-8c0c-e665a052c9bf', 'Wood Ear Mushroom', 'ITM-0046', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('adbff815-57b1-4eb3-8c0c-e665a052c9bf', 0, 0, 0.13) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('745e00e7-1df2-4ae1-a4ce-ec5d6d117f9e', 'Coriander (Cilantro)', 'ITM-0047', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('745e00e7-1df2-4ae1-a4ce-ec5d6d117f9e', 0, 0, 0.05) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('2263cbb7-f7a5-4bfa-8bf3-47d3a0497243', 'Lime Juice', 'ITM-0048', 'RECIPE_INGREDIENT', 'ml') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('2263cbb7-f7a5-4bfa-8bf3-47d3a0497243', 0, 0, 0.025) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('8110550a-9e4b-4991-9de7-fce4c95fb888', 'Shrimp', 'ITM-0049', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('8110550a-9e4b-4991-9de7-fce4c95fb888', 0, 0, 0.22667) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('4789b69d-bb8d-49ff-ad21-e4094f6166c9', 'Bean Vermicelli', 'ITM-0050', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('4789b69d-bb8d-49ff-ad21-e4094f6166c9', 0, 0, 0.2125) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('3b38ffd6-943c-4bcb-bdf7-31b5460ee535', 'Tamarind Juice', 'ITM-0051', 'RECIPE_INGREDIENT', 'ml') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('3b38ffd6-943c-4bcb-bdf7-31b5460ee535', 0, 0, 0) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('d1352d4a-f655-47d5-9530-01ee77882fe4', 'Fish Sauce', 'ITM-0052', 'RECIPE_INGREDIENT', 'ml') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('d1352d4a-f655-47d5-9530-01ee77882fe4', 0, 0, 0.0414) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('bd200607-d091-4979-af16-0a6fbfb17d79', 'Lime', 'ITM-0053', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('bd200607-d091-4979-af16-0a6fbfb17d79', 0, 0, 0.05) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('b3637e29-0c0f-4f95-8869-977a13d47738', 'Thai Fragrant Rice', 'ITM-0054', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('b3637e29-0c0f-4f95-8869-977a13d47738', 0, 0, 0.023) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('da0cf6f2-bd84-40c7-be86-c42a2b03d59d', 'Corn powder', 'ITM-0055', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('da0cf6f2-bd84-40c7-be86-c42a2b03d59d', 0, 0, 0.1) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('64ba15d9-50ed-4250-8111-fe3b17cf9ddb', 'Quail egg', 'ITM-0056', 'RECIPE_INGREDIENT', 'pcs') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('64ba15d9-50ed-4250-8111-fe3b17cf9ddb', 0, 0, 1.14) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('11c31386-0fc3-47c8-a2fa-215b28524b5e', 'Snow Pear', 'ITM-0057', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('11c31386-0fc3-47c8-a2fa-215b28524b5e', 0, 0, 0.079) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('d66cadd9-b46f-4fc4-a290-975d8293ef69', 'Rice Noodle', 'ITM-0058', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('d66cadd9-b46f-4fc4-a290-975d8293ef69', 0, 0, 0.08) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('e14657f7-e179-428c-b2f0-8d7a4489f72e', 'Bok Choy', 'ITM-0059', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('e14657f7-e179-428c-b2f0-8d7a4489f72e', 0, 0, 0.11) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('08ac9493-9bfb-40bd-890f-b4dd46ee4f18', 'JH-PSB-26B/Big(Soup Box)', 'ITM-0060', 'RECIPE_INGREDIENT', 'pcs') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('08ac9493-9bfb-40bd-890f-b4dd46ee4f18', 0, 0, 7.12) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('aec08630-7c27-4274-8b2e-032a5f573220', 'English Gourd', 'ITM-0061', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('aec08630-7c27-4274-8b2e-032a5f573220', 0, 0, 0.05) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('2739de43-268a-4e35-99fa-dd101289d48d', 'Squid Ring', 'ITM-0062', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('2739de43-268a-4e35-99fa-dd101289d48d', 0, 0, 0.155) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('549cfd06-6129-4cc5-8682-9f199fd0539c', 'Chili Sauce', 'ITM-0063', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('549cfd06-6129-4cc5-8682-9f199fd0539c', 0, 0, 0.0589) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('5f9794c6-89d9-44cb-b8c5-a07b75bfea7e', 'Fish cake', 'ITM-0064', 'RECIPE_INGREDIENT', 'g') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('5f9794c6-89d9-44cb-b8c5-a07b75bfea7e', 0, 0, 0.19) ON CONFLICT DO NOTHING;
INSERT INTO inventory.items (id, name_eng, item_code, category, unit_of_measure) VALUES ('e357047d-0ed6-41fa-9756-b305b9bb92e2', 'OverHead Cost', 'ITM-0065', 'RECIPE_INGREDIENT', 'PCS') ON CONFLICT DO NOTHING;
INSERT INTO inventory.balances (item_id, current_quantity, min_quantity, one_unit_cost) VALUES ('e357047d-0ed6-41fa-9756-b305b9bb92e2', 0, 0, 0) ON CONFLICT DO NOTHING;

-- Step 2: Master Menus
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('5a660898-fdde-4ce1-a9a5-bd4606dba434', 'FGB 0002', 'Fried Beef with Bell Pepper', 'အမဲငရုတ်ပွ + ထမင်း', 120, 36.9379) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('84782a27-08e5-45c7-815b-6b0eb3f9da19', 'FGN 0001', 'Wa Ou Noddle', 'ဝဥခေါက်ဆွဲ', 110, 30.5668) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('ccdc0dc4-d363-4ad9-90b3-69afc2eafa4d', 'FGV 0023', 'Fried Mixed Vegetables', 'အစိမ်းကြော်', 45, 9.8808) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('443a6c34-7e1c-4e39-b1fe-eb26caadd1be', 'FGC 0019', 'Stired Fried Chicken With Vegetables', 'ကုန်းဘောင်ကြီးကြော် + ထမင်း', 95, 28.7129) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('75166087-fedb-4249-bc13-8d2c2db00cc1', 'FGN 0005', 'Fried Noodle With Chicken', 'ခေါက်ဆွဲကြော်', 80, 19.0686) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('34a26b4c-c48b-4b1e-bf02-96d810ac19d4', 'FGV 0022', 'Fried Chinese Cabbage', 'တရုတ်မုန်ညှင်းကြော်', 35, 7.1130) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('cdb14f67-57dc-4a85-924c-0e1960d8658a', 'FGV 0019', 'Fried Bean Sprouts', 'ပဲပင်ပေါက်ကြော်', 35, 5.3050) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('6d1f8a93-da58-4539-b784-3587353403dc', 'FGC 0020', 'Stired Fried Chicken With Bell Pepper', 'ကြက်ငရုတ်ပွ + ထမင်း', 80, 22.0887) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('c087bfa4-ed4d-441b-bb2f-c905d74a1965', 'FGN 0006', 'Fried Vermicelli With Chicken', 'ကြာဇံကြော်', 70, 18.9750) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('49f65c77-f14c-47e8-a26a-1d3fd94aec76', 'FGV 0017', 'Hot And Sour Fried Morning Glory', 'ကန်စွန်းရွက် ချဉ်စပ်', 45, 9.2624) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('01f00848-e10e-45c6-8a89-e20d1ed6861e', 'FGP 0012', 'Fried Thin Pork Layer With Spring Onion', 'ကြက်သွန်မြိတ်ဝက်သားပြားကြော် + ထမင်း', 0, 22.5422) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('3077fe96-6cb4-47f9-bf61-7b77537d0fc4', 'FGN 0003', 'Kyay Oh Noodle', 'Pork) ( ကြေးအိုး', 80, 18.1925) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('22b0b907-aeea-47cb-8538-fc0a0a0fc0ee', 'FGV 0013', 'Wood Ear Salad', 'ကြွက်နားရွက်မှိုသုပ်', 50, 16.8676) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('cb8054dc-f19e-432a-b905-addbe89353ee', 'FGSF 0019', 'Stired Fried Shrimp With Bell Pepper', 'ပုဇွန်ငရုတ်ပွ + ထမင်း', 80, 37.5367) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('3e2f3586-062f-40a6-83cc-e274a1ecce65', 'FGN 0004', 'Salad Shrimp and Vermicelli', 'ပုဇွန်ပဲ ကြာဇံသုပ်', 80, 20.9109) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('84f80e62-bb5a-48e6-b564-ab64e21fdf38', 'FGV 0012', 'Tomato Salad', 'ခရမ်းချဉ်သီးသုပ်', 50, 7.0750) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('7304e895-75f6-41c9-8f6f-4da122fefa11', 'FGR 0001', 'Steamed Rice', 'ထမင်းပေါင်း', 110, 34.6456) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('1257c95b-4fe6-4308-a22c-aec6aaad6be2', 'FGN 0007', 'Myay Oh Mee Shay', 'မြေအိုး မြီးရှည်', 110, 29.7002) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('3a7295d8-0932-4b13-ab19-2605b65022d1', 'FGV 0007', 'Fried English Gourd', 'ဂေါ်ရခါးသီးကြော်', 45, 10.7940) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('3423d117-12c3-42ef-8b83-abe72a3490f1', 'FGSF 0014', 'Stired fried squid with bell pepper', 'ကင်းမွန်ငရုတ်ပွ + ထမင်း', 90, 26.0629) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('74a12515-68c0-4231-b118-38207d3286c3', 'FGSF 0014-2', 'Stired fried squid with bell pepper', 'ကင်းမွန်အစပ်ကြော် + ထမင်း', 90, 26.0462) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('86628b9b-364b-4db7-b700-252bfe417c55', 'FGP 0002', 'Sweet and Sour Pork', 'ချိုချဉ်ကြော် + ထမင်း', 110, 33.1885) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('dc50ca58-5143-42d0-b8ec-de9d95cfa2a7', 'FG SF 0021', 'Rakhine Style Fish Cake Salad', 'ရခိုင်ငါးဖယ်သုပ် + ထမင်း', 100, 27.5914) ON CONFLICT DO NOTHING;
INSERT INTO operations.menus (id, code, name_en, name_mm, sales_prices, total_bill_of_materials) VALUES ('ee923679-de77-4e0c-a66b-850b0c6cdecb', 'FG SF 0003', 'Shrimp with green chili', 'ပုဇွန်ငရုတ်သီးစိမ်းချက်', 120, 37.2415) ON CONFLICT DO NOTHING;

-- Step 3: Recipes (Bill of Materials)
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('5a660898-fdde-4ce1-a9a5-bd4606dba434', 'aea9ee43-d7d8-44ac-a958-4ccc86cebaf2', 100, 24.5340);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('5a660898-fdde-4ce1-a9a5-bd4606dba434', 'ef92db27-5fc5-4c9f-8094-0e778cf80cda', 50, 5.0000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('5a660898-fdde-4ce1-a9a5-bd4606dba434', 'fa269676-1518-4d1a-a896-66fe642034d7', 15, 0.7050);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('5a660898-fdde-4ce1-a9a5-bd4606dba434', 'd9ec474a-aab0-44f8-8ad9-01828a5edb8d', 2, 0.5520);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('5a660898-fdde-4ce1-a9a5-bd4606dba434', 'f63275ac-7797-4b15-8263-ccf4364a400c', 5, 0.3500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('5a660898-fdde-4ce1-a9a5-bd4606dba434', '73fe83a8-c0df-4655-a4ce-6df5d5960141', 3, 0.9375);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('5a660898-fdde-4ce1-a9a5-bd4606dba434', '25c8cbd5-4279-403c-b187-29f376f53256', 3, 0.0450);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('5a660898-fdde-4ce1-a9a5-bd4606dba434', '606bdb8f-2b96-434e-9e3d-4aee23fe785f', 10, 0.7000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('5a660898-fdde-4ce1-a9a5-bd4606dba434', '637b5394-84f6-471b-a205-ba486d30b4a9', 30, 1.1400);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('5a660898-fdde-4ce1-a9a5-bd4606dba434', 'f4788e03-d79f-4bd5-bc45-6ab8545e8546', 7, 0.3850);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('5a660898-fdde-4ce1-a9a5-bd4606dba434', 'f03c74fd-5c1b-4d4b-be1c-b57a51a8c974', 3, 0.0810);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('5a660898-fdde-4ce1-a9a5-bd4606dba434', 'f93f9199-955c-4609-a27c-7917e9c8f02f', 5, 0.2083);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('5a660898-fdde-4ce1-a9a5-bd4606dba434', 'cbcd6a90-88a1-47e7-8598-5f99350ab7a7', 100, 2.3000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('84782a27-08e5-45c7-815b-6b0eb3f9da19', '8d0e2d51-316a-4900-9d96-0d313c895c5f', 100, 9.0000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('84782a27-08e5-45c7-815b-6b0eb3f9da19', 'f5bffba3-f309-4ef5-8ce8-711e74b4856a', 15, 4.2750);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('84782a27-08e5-45c7-815b-6b0eb3f9da19', '00be9bc9-01bb-49cb-be7b-8a0f565cf904', 20, 0.8334);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('84782a27-08e5-45c7-815b-6b0eb3f9da19', '5cee3592-2b71-4cfc-ad05-f29a1144bd36', 30, 3.0000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('84782a27-08e5-45c7-815b-6b0eb3f9da19', '899432dd-954b-41ca-98f8-1e503687cc42', 50, 2.4500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('84782a27-08e5-45c7-815b-6b0eb3f9da19', '25c8cbd5-4279-403c-b187-29f376f53256', 2, 0.0300);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('84782a27-08e5-45c7-815b-6b0eb3f9da19', 'f03c74fd-5c1b-4d4b-be1c-b57a51a8c974', 5, 0.1350);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('84782a27-08e5-45c7-815b-6b0eb3f9da19', 'f63275ac-7797-4b15-8263-ccf4364a400c', 5, 0.3500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('84782a27-08e5-45c7-815b-6b0eb3f9da19', 'd463c1de-f3ad-4be1-bc61-e5cab0a45729', 15, 0.4500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('84782a27-08e5-45c7-815b-6b0eb3f9da19', 'f93f9199-955c-4609-a27c-7917e9c8f02f', 5, 0.2083);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('84782a27-08e5-45c7-815b-6b0eb3f9da19', 'a3b497aa-4654-456f-a195-d0a4b450a070', 70, 9.4500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('84782a27-08e5-45c7-815b-6b0eb3f9da19', 'f4788e03-d79f-4bd5-bc45-6ab8545e8546', 7, 0.3850);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('ccdc0dc4-d363-4ad9-90b3-69afc2eafa4d', '2e67cf39-bdef-4e1e-8e66-ff62a004f2d0', 30, 0.6564);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('ccdc0dc4-d363-4ad9-90b3-69afc2eafa4d', '2cabfb9e-7bbe-40c2-8950-2a5c32e525d3', 100, 2.7000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('ccdc0dc4-d363-4ad9-90b3-69afc2eafa4d', '1ec3cb4e-bb8e-4165-869e-03a9d014c9ed', 30, 0.9000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('ccdc0dc4-d363-4ad9-90b3-69afc2eafa4d', '3341203d-2e8c-4b55-85d9-7399bbc91d37', 20, 1.2500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('ccdc0dc4-d363-4ad9-90b3-69afc2eafa4d', '673cb007-8879-4b9a-a55a-917282dcca0c', 10, 0.3000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('ccdc0dc4-d363-4ad9-90b3-69afc2eafa4d', '606bdb8f-2b96-434e-9e3d-4aee23fe785f', 10, 0.7000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('ccdc0dc4-d363-4ad9-90b3-69afc2eafa4d', '637b5394-84f6-471b-a205-ba486d30b4a9', 30, 1.1400);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('ccdc0dc4-d363-4ad9-90b3-69afc2eafa4d', 'fa269676-1518-4d1a-a896-66fe642034d7', 15, 0.7050);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('ccdc0dc4-d363-4ad9-90b3-69afc2eafa4d', '25c8cbd5-4279-403c-b187-29f376f53256', 5, 0.0750);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('ccdc0dc4-d363-4ad9-90b3-69afc2eafa4d', 'f63275ac-7797-4b15-8263-ccf4364a400c', 7, 0.4900);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('ccdc0dc4-d363-4ad9-90b3-69afc2eafa4d', 'f03c74fd-5c1b-4d4b-be1c-b57a51a8c974', 3, 0.0810);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('ccdc0dc4-d363-4ad9-90b3-69afc2eafa4d', 'f4788e03-d79f-4bd5-bc45-6ab8545e8546', 7, 0.3850);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('ccdc0dc4-d363-4ad9-90b3-69afc2eafa4d', '19015638-8d43-44c9-a8f0-150ee22e957c', 7, 0.4984);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('443a6c34-7e1c-4e39-b1fe-eb26caadd1be', '3f1d67ec-8287-468a-9458-007bbc1d8bb5', 100, 14.1520);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('443a6c34-7e1c-4e39-b1fe-eb26caadd1be', '1ec3cb4e-bb8e-4165-869e-03a9d014c9ed', 50, 1.5000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('443a6c34-7e1c-4e39-b1fe-eb26caadd1be', 'f263e9aa-0d20-45a3-90ba-14ab2f75cee9', 20, 0.9000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('443a6c34-7e1c-4e39-b1fe-eb26caadd1be', '8f9136b6-e837-4697-ac34-6d4d96622e5b', 10, 0.5000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('443a6c34-7e1c-4e39-b1fe-eb26caadd1be', '2e67cf39-bdef-4e1e-8e66-ff62a004f2d0', 20, 0.4376);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('443a6c34-7e1c-4e39-b1fe-eb26caadd1be', 'f93f9199-955c-4609-a27c-7917e9c8f02f', 5, 0.2083);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('443a6c34-7e1c-4e39-b1fe-eb26caadd1be', '606bdb8f-2b96-434e-9e3d-4aee23fe785f', 10, 0.7000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('443a6c34-7e1c-4e39-b1fe-eb26caadd1be', '637b5394-84f6-471b-a205-ba486d30b4a9', 30, 1.1400);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('443a6c34-7e1c-4e39-b1fe-eb26caadd1be', '3341203d-2e8c-4b55-85d9-7399bbc91d37', 20, 1.2500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('443a6c34-7e1c-4e39-b1fe-eb26caadd1be', '3ba2227f-ea14-45aa-900e-048e50238353', 20, 1.5000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('443a6c34-7e1c-4e39-b1fe-eb26caadd1be', 'fa269676-1518-4d1a-a896-66fe642034d7', 15, 0.7050);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('443a6c34-7e1c-4e39-b1fe-eb26caadd1be', 'f4788e03-d79f-4bd5-bc45-6ab8545e8546', 15, 0.8250);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('443a6c34-7e1c-4e39-b1fe-eb26caadd1be', '2f46bb98-36ee-4ab7-83fb-7ba8accad04e', 7, 0.6200);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('443a6c34-7e1c-4e39-b1fe-eb26caadd1be', 'f63275ac-7797-4b15-8263-ccf4364a400c', 5, 0.3500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('443a6c34-7e1c-4e39-b1fe-eb26caadd1be', 'f03c74fd-5c1b-4d4b-be1c-b57a51a8c974', 3, 0.0810);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('443a6c34-7e1c-4e39-b1fe-eb26caadd1be', '0605fbd2-7825-47f1-a70b-698714119081', 1, 0.3440);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('443a6c34-7e1c-4e39-b1fe-eb26caadd1be', '9a8053b1-8ba6-4984-b1d2-0a9c5f5ee62c', 3, 1.2000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('443a6c34-7e1c-4e39-b1fe-eb26caadd1be', 'cbcd6a90-88a1-47e7-8598-5f99350ab7a7', 100, 2.3000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('75166087-fedb-4249-bc13-8d2c2db00cc1', '563703a0-7cc4-476d-8b3b-5d96869ca7b2', 100, 7.8130);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('75166087-fedb-4249-bc13-8d2c2db00cc1', '04ef9339-7a4a-45c3-bce8-30498e077fcb', 50, 3.4000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('75166087-fedb-4249-bc13-8d2c2db00cc1', '2e67cf39-bdef-4e1e-8e66-ff62a004f2d0', 20, 0.4376);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('75166087-fedb-4249-bc13-8d2c2db00cc1', '8f9136b6-e837-4697-ac34-6d4d96622e5b', 10, 0.5000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('75166087-fedb-4249-bc13-8d2c2db00cc1', '2cabfb9e-7bbe-40c2-8950-2a5c32e525d3', 30, 0.8100);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('75166087-fedb-4249-bc13-8d2c2db00cc1', '8a346a64-7947-4e44-a67e-443957c21832', 10, 0.3000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('75166087-fedb-4249-bc13-8d2c2db00cc1', '606bdb8f-2b96-434e-9e3d-4aee23fe785f', 10, 0.7000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('75166087-fedb-4249-bc13-8d2c2db00cc1', '637b5394-84f6-471b-a205-ba486d30b4a9', 30, 1.1400);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('75166087-fedb-4249-bc13-8d2c2db00cc1', '95cf0740-b736-4ae8-9f28-1152ecff95a3', 20, 0.6000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('75166087-fedb-4249-bc13-8d2c2db00cc1', 'fa269676-1518-4d1a-a896-66fe642034d7', 15, 0.7050);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('75166087-fedb-4249-bc13-8d2c2db00cc1', 'f4788e03-d79f-4bd5-bc45-6ab8545e8546', 15, 0.8250);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('75166087-fedb-4249-bc13-8d2c2db00cc1', '2f46bb98-36ee-4ab7-83fb-7ba8accad04e', 7, 0.6200);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('75166087-fedb-4249-bc13-8d2c2db00cc1', 'f63275ac-7797-4b15-8263-ccf4364a400c', 5, 0.3500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('75166087-fedb-4249-bc13-8d2c2db00cc1', '25c8cbd5-4279-403c-b187-29f376f53256', 3, 0.0450);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('75166087-fedb-4249-bc13-8d2c2db00cc1', 'f03c74fd-5c1b-4d4b-be1c-b57a51a8c974', 5, 0.1350);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('75166087-fedb-4249-bc13-8d2c2db00cc1', '0605fbd2-7825-47f1-a70b-698714119081', 2, 0.6880);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('34a26b4c-c48b-4b1e-bf02-96d810ac19d4', 'e739869a-25e1-48d9-a26c-3478451f615d', 150, 5.2500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('34a26b4c-c48b-4b1e-bf02-96d810ac19d4', '606bdb8f-2b96-434e-9e3d-4aee23fe785f', 10, 0.7000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('34a26b4c-c48b-4b1e-bf02-96d810ac19d4', '25c8cbd5-4279-403c-b187-29f376f53256', 3, 0.0450);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('34a26b4c-c48b-4b1e-bf02-96d810ac19d4', 'd9ec474a-aab0-44f8-8ad9-01828a5edb8d', 2, 0.5520);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('34a26b4c-c48b-4b1e-bf02-96d810ac19d4', 'f63275ac-7797-4b15-8263-ccf4364a400c', 3, 0.2100);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('34a26b4c-c48b-4b1e-bf02-96d810ac19d4', '19015638-8d43-44c9-a8f0-150ee22e957c', 5, 0.3560);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('cdb14f67-57dc-4a85-924c-0e1960d8658a', 'f510faa0-18b1-46fb-8430-3741c8dda4a0', 100, 3.0000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('cdb14f67-57dc-4a85-924c-0e1960d8658a', '637b5394-84f6-471b-a205-ba486d30b4a9', 20, 0.7600);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('cdb14f67-57dc-4a85-924c-0e1960d8658a', '606bdb8f-2b96-434e-9e3d-4aee23fe785f', 10, 0.7000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('cdb14f67-57dc-4a85-924c-0e1960d8658a', 'fa269676-1518-4d1a-a896-66fe642034d7', 7, 0.3290);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('cdb14f67-57dc-4a85-924c-0e1960d8658a', 'd9ec474a-aab0-44f8-8ad9-01828a5edb8d', 1, 0.2760);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('cdb14f67-57dc-4a85-924c-0e1960d8658a', '25c8cbd5-4279-403c-b187-29f376f53256', 2, 0.0300);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('cdb14f67-57dc-4a85-924c-0e1960d8658a', 'f63275ac-7797-4b15-8263-ccf4364a400c', 3, 0.2100);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('6d1f8a93-da58-4539-b784-3587353403dc', '563703a0-7cc4-476d-8b3b-5d96869ca7b2', 100, 7.8130);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('6d1f8a93-da58-4539-b784-3587353403dc', '8f9136b6-e837-4697-ac34-6d4d96622e5b', 5, 0.2500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('6d1f8a93-da58-4539-b784-3587353403dc', 'ef92db27-5fc5-4c9f-8094-0e778cf80cda', 50, 5.0000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('6d1f8a93-da58-4539-b784-3587353403dc', '606bdb8f-2b96-434e-9e3d-4aee23fe785f', 10, 0.7000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('6d1f8a93-da58-4539-b784-3587353403dc', 'f93f9199-955c-4609-a27c-7917e9c8f02f', 10, 0.4167);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('6d1f8a93-da58-4539-b784-3587353403dc', '637b5394-84f6-471b-a205-ba486d30b4a9', 30, 1.1400);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('6d1f8a93-da58-4539-b784-3587353403dc', 'f63275ac-7797-4b15-8263-ccf4364a400c', 5, 0.3500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('6d1f8a93-da58-4539-b784-3587353403dc', '9a8053b1-8ba6-4984-b1d2-0a9c5f5ee62c', 3, 1.2000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('6d1f8a93-da58-4539-b784-3587353403dc', 'f03c74fd-5c1b-4d4b-be1c-b57a51a8c974', 3, 0.0810);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('6d1f8a93-da58-4539-b784-3587353403dc', '0605fbd2-7825-47f1-a70b-698714119081', 2, 0.6880);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('6d1f8a93-da58-4539-b784-3587353403dc', 'fa269676-1518-4d1a-a896-66fe642034d7', 15, 0.7050);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('6d1f8a93-da58-4539-b784-3587353403dc', 'f4788e03-d79f-4bd5-bc45-6ab8545e8546', 15, 0.8250);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('6d1f8a93-da58-4539-b784-3587353403dc', '2f46bb98-36ee-4ab7-83fb-7ba8accad04e', 7, 0.6200);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('6d1f8a93-da58-4539-b784-3587353403dc', 'cbcd6a90-88a1-47e7-8598-5f99350ab7a7', 100, 2.3000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('c087bfa4-ed4d-441b-bb2f-c905d74a1965', '08b4762d-fc4e-446b-8c2b-e56cedc4f6b5', 50, 3.2640);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('c087bfa4-ed4d-441b-bb2f-c905d74a1965', '563703a0-7cc4-476d-8b3b-5d96869ca7b2', 100, 7.8130);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('c087bfa4-ed4d-441b-bb2f-c905d74a1965', '2e67cf39-bdef-4e1e-8e66-ff62a004f2d0', 20, 0.4376);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('c087bfa4-ed4d-441b-bb2f-c905d74a1965', '2cabfb9e-7bbe-40c2-8950-2a5c32e525d3', 30, 0.8100);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('c087bfa4-ed4d-441b-bb2f-c905d74a1965', '95cf0740-b736-4ae8-9f28-1152ecff95a3', 20, 0.6000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('c087bfa4-ed4d-441b-bb2f-c905d74a1965', '25c8cbd5-4279-403c-b187-29f376f53256', 3, 0.0450);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('c087bfa4-ed4d-441b-bb2f-c905d74a1965', 'f63275ac-7797-4b15-8263-ccf4364a400c', 5, 0.3500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('c087bfa4-ed4d-441b-bb2f-c905d74a1965', 'f03c74fd-5c1b-4d4b-be1c-b57a51a8c974', 5, 0.1350);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('c087bfa4-ed4d-441b-bb2f-c905d74a1965', 'f4788e03-d79f-4bd5-bc45-6ab8545e8546', 15, 0.8250);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('c087bfa4-ed4d-441b-bb2f-c905d74a1965', '2f46bb98-36ee-4ab7-83fb-7ba8accad04e', 7, 0.6200);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('c087bfa4-ed4d-441b-bb2f-c905d74a1965', '19015638-8d43-44c9-a8f0-150ee22e957c', 7, 0.4984);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('c087bfa4-ed4d-441b-bb2f-c905d74a1965', 'fa269676-1518-4d1a-a896-66fe642034d7', 15, 0.7050);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('c087bfa4-ed4d-441b-bb2f-c905d74a1965', '0605fbd2-7825-47f1-a70b-698714119081', 3, 1.0320);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('c087bfa4-ed4d-441b-bb2f-c905d74a1965', '606bdb8f-2b96-434e-9e3d-4aee23fe785f', 10, 0.7000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('c087bfa4-ed4d-441b-bb2f-c905d74a1965', '637b5394-84f6-471b-a205-ba486d30b4a9', 30, 1.1400);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('49f65c77-f14c-47e8-a26a-1d3fd94aec76', 'd5fb2586-4888-44ae-9b8a-c7f6d32baec3', 150, 4.5000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('49f65c77-f14c-47e8-a26a-1d3fd94aec76', '673cb007-8879-4b9a-a55a-917282dcca0c', 30, 0.9000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('49f65c77-f14c-47e8-a26a-1d3fd94aec76', 'f773e3e6-b069-4405-8c21-553513114c92', 10, 1.6000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('49f65c77-f14c-47e8-a26a-1d3fd94aec76', '606bdb8f-2b96-434e-9e3d-4aee23fe785f', 10, 0.7000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('49f65c77-f14c-47e8-a26a-1d3fd94aec76', 'f63275ac-7797-4b15-8263-ccf4364a400c', 5, 0.3500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('49f65c77-f14c-47e8-a26a-1d3fd94aec76', 'f4788e03-d79f-4bd5-bc45-6ab8545e8546', 7, 0.3850);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('49f65c77-f14c-47e8-a26a-1d3fd94aec76', '19015638-8d43-44c9-a8f0-150ee22e957c', 7, 0.4984);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('49f65c77-f14c-47e8-a26a-1d3fd94aec76', 'fa269676-1518-4d1a-a896-66fe642034d7', 7, 0.3290);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('01f00848-e10e-45c6-8a89-e20d1ed6861e', '0f4ff5a6-4341-45ff-8175-b7dc5ab43b16', 0, 0.0000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('01f00848-e10e-45c6-8a89-e20d1ed6861e', 'e5b7ba80-e871-446d-abf9-044b5851a0c6', 100, 13.0500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('01f00848-e10e-45c6-8a89-e20d1ed6861e', '8f9136b6-e837-4697-ac34-6d4d96622e5b', 30, 1.5000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('01f00848-e10e-45c6-8a89-e20d1ed6861e', 'fa269676-1518-4d1a-a896-66fe642034d7', 15, 0.7050);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('01f00848-e10e-45c6-8a89-e20d1ed6861e', '606bdb8f-2b96-434e-9e3d-4aee23fe785f', 10, 0.7000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('01f00848-e10e-45c6-8a89-e20d1ed6861e', '637b5394-84f6-471b-a205-ba486d30b4a9', 30, 1.1400);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('01f00848-e10e-45c6-8a89-e20d1ed6861e', 'f93f9199-955c-4609-a27c-7917e9c8f02f', 10, 0.4167);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('01f00848-e10e-45c6-8a89-e20d1ed6861e', 'f63275ac-7797-4b15-8263-ccf4364a400c', 5, 0.3500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('01f00848-e10e-45c6-8a89-e20d1ed6861e', '713f3d33-8e4d-4dce-bc64-59aac4e0ce13', 5, 1.1428);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('01f00848-e10e-45c6-8a89-e20d1ed6861e', 'f4788e03-d79f-4bd5-bc45-6ab8545e8546', 7, 0.3850);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('01f00848-e10e-45c6-8a89-e20d1ed6861e', '19015638-8d43-44c9-a8f0-150ee22e957c', 7, 0.4984);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('01f00848-e10e-45c6-8a89-e20d1ed6861e', '2f46bb98-36ee-4ab7-83fb-7ba8accad04e', 4, 0.3543);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('01f00848-e10e-45c6-8a89-e20d1ed6861e', 'cbcd6a90-88a1-47e7-8598-5f99350ab7a7', 100, 2.3000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('3077fe96-6cb4-47f9-bf61-7b77537d0fc4', 'a3b497aa-4654-456f-a195-d0a4b450a070', 70, 9.4500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('3077fe96-6cb4-47f9-bf61-7b77537d0fc4', '08b4762d-fc4e-446b-8c2b-e56cedc4f6b5', 50, 3.2640);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('3077fe96-6cb4-47f9-bf61-7b77537d0fc4', '899432dd-954b-41ca-98f8-1e503687cc42', 50, 2.4500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('3077fe96-6cb4-47f9-bf61-7b77537d0fc4', '00be9bc9-01bb-49cb-be7b-8a0f565cf904', 50, 2.0835);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('3077fe96-6cb4-47f9-bf61-7b77537d0fc4', '25c8cbd5-4279-403c-b187-29f376f53256', 5, 0.0750);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('3077fe96-6cb4-47f9-bf61-7b77537d0fc4', 'f63275ac-7797-4b15-8263-ccf4364a400c', 5, 0.3500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('3077fe96-6cb4-47f9-bf61-7b77537d0fc4', 'f03c74fd-5c1b-4d4b-be1c-b57a51a8c974', 5, 0.1350);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('3077fe96-6cb4-47f9-bf61-7b77537d0fc4', 'f4788e03-d79f-4bd5-bc45-6ab8545e8546', 7, 0.3850);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('22b0b907-aeea-47cb-8538-fc0a0a0fc0ee', 'adbff815-57b1-4eb3-8c0c-e665a052c9bf', 100, 13.0000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('22b0b907-aeea-47cb-8538-fc0a0a0fc0ee', '637b5394-84f6-471b-a205-ba486d30b4a9', 20, 0.7600);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('22b0b907-aeea-47cb-8538-fc0a0a0fc0ee', '2e67cf39-bdef-4e1e-8e66-ff62a004f2d0', 20, 0.4376);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('22b0b907-aeea-47cb-8538-fc0a0a0fc0ee', '745e00e7-1df2-4ae1-a4ce-ec5d6d117f9e', 10, 0.5000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('22b0b907-aeea-47cb-8538-fc0a0a0fc0ee', 'f773e3e6-b069-4405-8c21-553513114c92', 10, 1.6000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('22b0b907-aeea-47cb-8538-fc0a0a0fc0ee', '25c8cbd5-4279-403c-b187-29f376f53256', 3, 0.0450);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('22b0b907-aeea-47cb-8538-fc0a0a0fc0ee', 'f63275ac-7797-4b15-8263-ccf4364a400c', 5, 0.3500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('22b0b907-aeea-47cb-8538-fc0a0a0fc0ee', '2263cbb7-f7a5-4bfa-8bf3-47d3a0497243', 7, 0.1750);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('cb8054dc-f19e-432a-b905-addbe89353ee', '8110550a-9e4b-4991-9de7-fce4c95fb888', 100, 22.6670);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('cb8054dc-f19e-432a-b905-addbe89353ee', 'ef92db27-5fc5-4c9f-8094-0e778cf80cda', 50, 5.0000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('cb8054dc-f19e-432a-b905-addbe89353ee', '606bdb8f-2b96-434e-9e3d-4aee23fe785f', 10, 0.7000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('cb8054dc-f19e-432a-b905-addbe89353ee', 'f93f9199-955c-4609-a27c-7917e9c8f02f', 10, 0.4167);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('cb8054dc-f19e-432a-b905-addbe89353ee', '637b5394-84f6-471b-a205-ba486d30b4a9', 30, 1.1400);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('cb8054dc-f19e-432a-b905-addbe89353ee', '8f9136b6-e837-4697-ac34-6d4d96622e5b', 10, 0.5000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('cb8054dc-f19e-432a-b905-addbe89353ee', 'fa269676-1518-4d1a-a896-66fe642034d7', 15, 0.7050);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('cb8054dc-f19e-432a-b905-addbe89353ee', 'f63275ac-7797-4b15-8263-ccf4364a400c', 5, 0.3500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('cb8054dc-f19e-432a-b905-addbe89353ee', 'f03c74fd-5c1b-4d4b-be1c-b57a51a8c974', 3, 0.0810);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('cb8054dc-f19e-432a-b905-addbe89353ee', 'f4788e03-d79f-4bd5-bc45-6ab8545e8546', 15, 0.8250);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('cb8054dc-f19e-432a-b905-addbe89353ee', '2f46bb98-36ee-4ab7-83fb-7ba8accad04e', 7, 0.6200);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('cb8054dc-f19e-432a-b905-addbe89353ee', '0605fbd2-7825-47f1-a70b-698714119081', 3, 1.0320);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('cb8054dc-f19e-432a-b905-addbe89353ee', '9a8053b1-8ba6-4984-b1d2-0a9c5f5ee62c', 3, 1.2000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('cb8054dc-f19e-432a-b905-addbe89353ee', 'cbcd6a90-88a1-47e7-8598-5f99350ab7a7', 100, 2.3000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('3e2f3586-062f-40a6-83cc-e274a1ecce65', '4789b69d-bb8d-49ff-ad21-e4094f6166c9', 40, 8.5000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('3e2f3586-062f-40a6-83cc-e274a1ecce65', '8110550a-9e4b-4991-9de7-fce4c95fb888', 50, 11.3335);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('3e2f3586-062f-40a6-83cc-e274a1ecce65', '2e67cf39-bdef-4e1e-8e66-ff62a004f2d0', 20, 0.4376);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('3e2f3586-062f-40a6-83cc-e274a1ecce65', 'f63275ac-7797-4b15-8263-ccf4364a400c', 5, 0.3500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('3e2f3586-062f-40a6-83cc-e274a1ecce65', '3b38ffd6-943c-4bcb-bdf7-31b5460ee535', 7, 0.0000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('3e2f3586-062f-40a6-83cc-e274a1ecce65', 'd1352d4a-f655-47d5-9530-01ee77882fe4', 7, 0.2898);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('84f80e62-bb5a-48e6-b564-ab64e21fdf38', '673cb007-8879-4b9a-a55a-917282dcca0c', 100, 3.0000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('84f80e62-bb5a-48e6-b564-ab64e21fdf38', '637b5394-84f6-471b-a205-ba486d30b4a9', 20, 0.7600);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('84f80e62-bb5a-48e6-b564-ab64e21fdf38', '606bdb8f-2b96-434e-9e3d-4aee23fe785f', 1, 0.0700);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('84f80e62-bb5a-48e6-b564-ab64e21fdf38', 'f773e3e6-b069-4405-8c21-553513114c92', 10, 1.6000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('84f80e62-bb5a-48e6-b564-ab64e21fdf38', '745e00e7-1df2-4ae1-a4ce-ec5d6d117f9e', 20, 1.0000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('84f80e62-bb5a-48e6-b564-ab64e21fdf38', 'f63275ac-7797-4b15-8263-ccf4364a400c', 5, 0.3500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('84f80e62-bb5a-48e6-b564-ab64e21fdf38', '25c8cbd5-4279-403c-b187-29f376f53256', 3, 0.0450);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('84f80e62-bb5a-48e6-b564-ab64e21fdf38', 'bd200607-d091-4979-af16-0a6fbfb17d79', 5, 0.2500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('7304e895-75f6-41c9-8f6f-4da122fefa11', '3f1d67ec-8287-468a-9458-007bbc1d8bb5', 150, 21.2280);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('7304e895-75f6-41c9-8f6f-4da122fefa11', 'b3637e29-0c0f-4f95-8869-977a13d47738', 140, 3.2200);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('7304e895-75f6-41c9-8f6f-4da122fefa11', '2e67cf39-bdef-4e1e-8e66-ff62a004f2d0', 20, 0.4376);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('7304e895-75f6-41c9-8f6f-4da122fefa11', '3341203d-2e8c-4b55-85d9-7399bbc91d37', 20, 1.2500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('7304e895-75f6-41c9-8f6f-4da122fefa11', 'e739869a-25e1-48d9-a26c-3478451f615d', 20, 0.7000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('7304e895-75f6-41c9-8f6f-4da122fefa11', '1ec3cb4e-bb8e-4165-869e-03a9d014c9ed', 20, 0.6000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('7304e895-75f6-41c9-8f6f-4da122fefa11', '606bdb8f-2b96-434e-9e3d-4aee23fe785f', 5, 0.3500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('7304e895-75f6-41c9-8f6f-4da122fefa11', 'da0cf6f2-bd84-40c7-be86-c42a2b03d59d', 7, 0.7000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('7304e895-75f6-41c9-8f6f-4da122fefa11', '64ba15d9-50ed-4250-8111-fe3b17cf9ddb', 2, 2.2800);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('7304e895-75f6-41c9-8f6f-4da122fefa11', '11c31386-0fc3-47c8-a2fa-215b28524b5e', 20, 1.5800);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('7304e895-75f6-41c9-8f6f-4da122fefa11', 'cbcd6a90-88a1-47e7-8598-5f99350ab7a7', 100, 2.3000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('1257c95b-4fe6-4308-a22c-aec6aaad6be2', '3f1d67ec-8287-468a-9458-007bbc1d8bb5', 70, 9.9064);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('1257c95b-4fe6-4308-a22c-aec6aaad6be2', 'd66cadd9-b46f-4fc4-a290-975d8293ef69', 50, 4.0000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('1257c95b-4fe6-4308-a22c-aec6aaad6be2', '8d0e2d51-316a-4900-9d96-0d313c895c5f', 20, 1.8000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('1257c95b-4fe6-4308-a22c-aec6aaad6be2', '2e67cf39-bdef-4e1e-8e66-ff62a004f2d0', 10, 0.2188);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('1257c95b-4fe6-4308-a22c-aec6aaad6be2', '1ec3cb4e-bb8e-4165-869e-03a9d014c9ed', 10, 0.3000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('1257c95b-4fe6-4308-a22c-aec6aaad6be2', '3341203d-2e8c-4b55-85d9-7399bbc91d37', 10, 0.6250);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('1257c95b-4fe6-4308-a22c-aec6aaad6be2', 'e14657f7-e179-428c-b2f0-8d7a4489f72e', 10, 1.1000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('1257c95b-4fe6-4308-a22c-aec6aaad6be2', '64ba15d9-50ed-4250-8111-fe3b17cf9ddb', 2, 2.2800);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('1257c95b-4fe6-4308-a22c-aec6aaad6be2', '5cee3592-2b71-4cfc-ad05-f29a1144bd36', 20, 2.0000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('1257c95b-4fe6-4308-a22c-aec6aaad6be2', 'f63275ac-7797-4b15-8263-ccf4364a400c', 5, 0.3500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('1257c95b-4fe6-4308-a22c-aec6aaad6be2', '08ac9493-9bfb-40bd-890f-b4dd46ee4f18', 1, 7.1200);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('3a7295d8-0932-4b13-ab19-2605b65022d1', 'aec08630-7c27-4274-8b2e-032a5f573220', 200, 10.0000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('3a7295d8-0932-4b13-ab19-2605b65022d1', '606bdb8f-2b96-434e-9e3d-4aee23fe785f', 1, 0.0700);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('3a7295d8-0932-4b13-ab19-2605b65022d1', 'fa269676-1518-4d1a-a896-66fe642034d7', 7, 0.3290);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('3a7295d8-0932-4b13-ab19-2605b65022d1', 'f63275ac-7797-4b15-8263-ccf4364a400c', 5, 0.3500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('3a7295d8-0932-4b13-ab19-2605b65022d1', '25c8cbd5-4279-403c-b187-29f376f53256', 3, 0.0450);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('3423d117-12c3-42ef-8b83-abe72a3490f1', '2739de43-268a-4e35-99fa-dd101289d48d', 100, 15.5000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('3423d117-12c3-42ef-8b83-abe72a3490f1', 'ef92db27-5fc5-4c9f-8094-0e778cf80cda', 50, 5.0000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('3423d117-12c3-42ef-8b83-abe72a3490f1', 'fa269676-1518-4d1a-a896-66fe642034d7', 15, 0.7050);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('3423d117-12c3-42ef-8b83-abe72a3490f1', '606bdb8f-2b96-434e-9e3d-4aee23fe785f', 10, 0.7000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('3423d117-12c3-42ef-8b83-abe72a3490f1', 'f93f9199-955c-4609-a27c-7917e9c8f02f', 10, 0.4167);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('3423d117-12c3-42ef-8b83-abe72a3490f1', '19015638-8d43-44c9-a8f0-150ee22e957c', 7, 0.4984);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('3423d117-12c3-42ef-8b83-abe72a3490f1', '2f46bb98-36ee-4ab7-83fb-7ba8accad04e', 5, 0.4428);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('3423d117-12c3-42ef-8b83-abe72a3490f1', '8f9136b6-e837-4697-ac34-6d4d96622e5b', 10, 0.5000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('3423d117-12c3-42ef-8b83-abe72a3490f1', 'cbcd6a90-88a1-47e7-8598-5f99350ab7a7', 100, 2.3000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('74a12515-68c0-4231-b118-38207d3286c3', '2739de43-268a-4e35-99fa-dd101289d48d', 100, 15.5000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('74a12515-68c0-4231-b118-38207d3286c3', '8f9136b6-e837-4697-ac34-6d4d96622e5b', 20, 1.0000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('74a12515-68c0-4231-b118-38207d3286c3', 'f773e3e6-b069-4405-8c21-553513114c92', 15, 2.4000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('74a12515-68c0-4231-b118-38207d3286c3', 'f93f9199-955c-4609-a27c-7917e9c8f02f', 10, 0.4167);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('74a12515-68c0-4231-b118-38207d3286c3', '606bdb8f-2b96-434e-9e3d-4aee23fe785f', 10, 0.7000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('74a12515-68c0-4231-b118-38207d3286c3', '637b5394-84f6-471b-a205-ba486d30b4a9', 30, 1.1400);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('74a12515-68c0-4231-b118-38207d3286c3', 'fa269676-1518-4d1a-a896-66fe642034d7', 15, 0.7050);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('74a12515-68c0-4231-b118-38207d3286c3', '25c8cbd5-4279-403c-b187-29f376f53256', 3, 0.0450);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('74a12515-68c0-4231-b118-38207d3286c3', 'f63275ac-7797-4b15-8263-ccf4364a400c', 5, 0.3500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('74a12515-68c0-4231-b118-38207d3286c3', '73fe83a8-c0df-4655-a4ce-6df5d5960141', 3, 0.9375);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('74a12515-68c0-4231-b118-38207d3286c3', 'd9ec474a-aab0-44f8-8ad9-01828a5edb8d', 2, 0.5520);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('74a12515-68c0-4231-b118-38207d3286c3', 'cbcd6a90-88a1-47e7-8598-5f99350ab7a7', 100, 2.3000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('86628b9b-364b-4db7-b700-252bfe417c55', '3f1d67ec-8287-468a-9458-007bbc1d8bb5', 100, 14.1520);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('86628b9b-364b-4db7-b700-252bfe417c55', '2e67cf39-bdef-4e1e-8e66-ff62a004f2d0', 30, 0.6564);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('86628b9b-364b-4db7-b700-252bfe417c55', 'ef92db27-5fc5-4c9f-8094-0e778cf80cda', 30, 3.0000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('86628b9b-364b-4db7-b700-252bfe417c55', '11c31386-0fc3-47c8-a2fa-215b28524b5e', 30, 2.3700);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('86628b9b-364b-4db7-b700-252bfe417c55', '637b5394-84f6-471b-a205-ba486d30b4a9', 30, 1.1400);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('86628b9b-364b-4db7-b700-252bfe417c55', '606bdb8f-2b96-434e-9e3d-4aee23fe785f', 10, 0.7000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('86628b9b-364b-4db7-b700-252bfe417c55', 'f93f9199-955c-4609-a27c-7917e9c8f02f', 10, 0.4167);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('86628b9b-364b-4db7-b700-252bfe417c55', '3341203d-2e8c-4b55-85d9-7399bbc91d37', 20, 1.2500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('86628b9b-364b-4db7-b700-252bfe417c55', 'fa269676-1518-4d1a-a896-66fe642034d7', 15, 0.7050);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('86628b9b-364b-4db7-b700-252bfe417c55', '25c8cbd5-4279-403c-b187-29f376f53256', 5, 0.0750);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('86628b9b-364b-4db7-b700-252bfe417c55', 'f63275ac-7797-4b15-8263-ccf4364a400c', 5, 0.3500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('86628b9b-364b-4db7-b700-252bfe417c55', '673cb007-8879-4b9a-a55a-917282dcca0c', 30, 0.9000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('86628b9b-364b-4db7-b700-252bfe417c55', 'f4788e03-d79f-4bd5-bc45-6ab8545e8546', 7, 0.3850);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('86628b9b-364b-4db7-b700-252bfe417c55', '19015638-8d43-44c9-a8f0-150ee22e957c', 7, 0.4984);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('86628b9b-364b-4db7-b700-252bfe417c55', '549cfd06-6129-4cc5-8682-9f199fd0539c', 50, 2.9450);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('86628b9b-364b-4db7-b700-252bfe417c55', 'da0cf6f2-bd84-40c7-be86-c42a2b03d59d', 10, 1.0000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('86628b9b-364b-4db7-b700-252bfe417c55', 'd463c1de-f3ad-4be1-bc61-e5cab0a45729', 7, 0.2100);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('86628b9b-364b-4db7-b700-252bfe417c55', 'f03c74fd-5c1b-4d4b-be1c-b57a51a8c974', 5, 0.1350);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('86628b9b-364b-4db7-b700-252bfe417c55', 'cbcd6a90-88a1-47e7-8598-5f99350ab7a7', 100, 2.3000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('dc50ca58-5143-42d0-b8ec-de9d95cfa2a7', '5f9794c6-89d9-44cb-b8c5-a07b75bfea7e', 100, 19.0000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('dc50ca58-5143-42d0-b8ec-de9d95cfa2a7', '2cabfb9e-7bbe-40c2-8950-2a5c32e525d3', 30, 0.8100);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('dc50ca58-5143-42d0-b8ec-de9d95cfa2a7', '637b5394-84f6-471b-a205-ba486d30b4a9', 20, 0.7600);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('dc50ca58-5143-42d0-b8ec-de9d95cfa2a7', '606bdb8f-2b96-434e-9e3d-4aee23fe785f', 10, 0.7000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('dc50ca58-5143-42d0-b8ec-de9d95cfa2a7', 'f93f9199-955c-4609-a27c-7917e9c8f02f', 5, 0.2083);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('dc50ca58-5143-42d0-b8ec-de9d95cfa2a7', 'f773e3e6-b069-4405-8c21-553513114c92', 10, 1.6000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('dc50ca58-5143-42d0-b8ec-de9d95cfa2a7', 'fa269676-1518-4d1a-a896-66fe642034d7', 7, 0.3290);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('dc50ca58-5143-42d0-b8ec-de9d95cfa2a7', 'f63275ac-7797-4b15-8263-ccf4364a400c', 5, 0.3500);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('dc50ca58-5143-42d0-b8ec-de9d95cfa2a7', 'd1352d4a-f655-47d5-9530-01ee77882fe4', 5, 0.2070);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('dc50ca58-5143-42d0-b8ec-de9d95cfa2a7', '2263cbb7-f7a5-4bfa-8bf3-47d3a0497243', 7, 0.1750);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('dc50ca58-5143-42d0-b8ec-de9d95cfa2a7', 'd9ec474a-aab0-44f8-8ad9-01828a5edb8d', 2, 0.5520);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('dc50ca58-5143-42d0-b8ec-de9d95cfa2a7', '673cb007-8879-4b9a-a55a-917282dcca0c', 20, 0.6000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('dc50ca58-5143-42d0-b8ec-de9d95cfa2a7', 'cbcd6a90-88a1-47e7-8598-5f99350ab7a7', 100, 2.3000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('ee923679-de77-4e0c-a66b-850b0c6cdecb', '8110550a-9e4b-4991-9de7-fce4c95fb888', 100, 22.6670);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('ee923679-de77-4e0c-a66b-850b0c6cdecb', 'f773e3e6-b069-4405-8c21-553513114c92', 50, 8.0000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('ee923679-de77-4e0c-a66b-850b0c6cdecb', 'd9ec474a-aab0-44f8-8ad9-01828a5edb8d', 2, 0.5520);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('ee923679-de77-4e0c-a66b-850b0c6cdecb', '73fe83a8-c0df-4655-a4ce-6df5d5960141', 3, 0.9375);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('ee923679-de77-4e0c-a66b-850b0c6cdecb', '25c8cbd5-4279-403c-b187-29f376f53256', 2, 0.0300);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('ee923679-de77-4e0c-a66b-850b0c6cdecb', 'fa269676-1518-4d1a-a896-66fe642034d7', 15, 0.7050);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('ee923679-de77-4e0c-a66b-850b0c6cdecb', '637b5394-84f6-471b-a205-ba486d30b4a9', 30, 1.1400);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('ee923679-de77-4e0c-a66b-850b0c6cdecb', '606bdb8f-2b96-434e-9e3d-4aee23fe785f', 10, 0.7000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('ee923679-de77-4e0c-a66b-850b0c6cdecb', 'f63275ac-7797-4b15-8263-ccf4364a400c', 3, 0.2100);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('ee923679-de77-4e0c-a66b-850b0c6cdecb', 'e357047d-0ed6-41fa-9756-b305b9bb92e2', 1, 0.0000);
INSERT INTO operations.recipes (menu_id, inventory_item_id, qty, total) VALUES ('ee923679-de77-4e0c-a66b-850b0c6cdecb', 'cbcd6a90-88a1-47e7-8598-5f99350ab7a7', 100, 2.3000);

-- Step 4: Daily Menu Plan (Monthly Calendar)
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('557e94a8-1c60-4c49-8288-322055c1cf7c', '2026-06-01', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('e1ca69fd-3146-4df4-8da0-81a2e99b10f9', '2026-06-01', true, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('187011bb-f902-49b9-ab2c-0b193974f793', '2026-06-02', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('159ce1be-6dd5-4da6-b9ca-913cb792d129', '2026-06-02', true, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('e9a19103-d5bf-49bf-8c9e-c99170149fa8', '2026-06-03', false, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('18642edd-b18e-46c7-b6b5-bf42e3d679e9', '2026-06-03', true, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('f9c068a9-aaa6-478a-ad82-a3aba6dfe824', '2026-06-04', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('f1c5da89-2e97-446b-81ec-245411f6268c', '2026-06-04', true, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('87ebf058-0df5-4c24-a17b-1984b615432c', '2026-06-05', false, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('2058ae1d-7f2e-4b9a-a2d6-bf88b650bda3', '2026-06-05', true, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('edb1b4ed-9755-4195-81d0-e94ba586f1ba', '2026-06-06', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('48919aa3-aaf9-4ae8-a98c-9167930e2c65', '2026-06-06', false, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('ef8ae010-8da7-43b2-8f43-e2837fc70db3', '2026-06-08', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('d0c597c6-2390-4c4c-9a40-2d99d3e79dda', '2026-06-08', false, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('b57ed031-ee8f-4bb2-b9ae-1c308721700b', '2026-06-09', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('7a218151-2529-46af-9610-40ae696823f2', '2026-06-09', false, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('dc4ffb71-0e26-47d8-8672-e8c9c1f09d99', '2026-06-10', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('b38a7cad-e5a2-4e45-93a1-2066f5cbb136', '2026-06-10', false, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('430d313d-87cf-44d9-8147-c334fed38f77', '2026-06-11', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('8c71752c-a597-44da-8534-07208c1aa99d', '2026-06-11', false, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('34a1806b-c739-441b-993c-729ee92d8ada', '2026-06-12', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('e2fe7400-0ba3-4c7f-a42b-d369109d3cff', '2026-06-12', false, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('d8c8120a-6bd5-40bd-a775-0ba3b9ee6a59', '2026-06-13', false, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('71dd131b-55c6-492f-8320-25aa95b2339b', '2026-06-13', true, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('3cb8ffca-aa9b-433b-8b41-7129c3d11b51', '2026-06-15', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('45cd0a7f-5b32-4ea6-8ddd-62093f877246', '2026-06-15', true, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('5e87901b-3eff-4fd3-805b-7f27b59d9373', '2026-06-16', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('6f0ee1fe-69c7-4a06-83b3-46f013a7a8dd', '2026-06-16', false, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('1bbbfbdf-6a29-498d-85f5-dc1b7d0ee35e', '2026-06-17', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('8bb386c7-8806-4127-81aa-3b8830c99af6', '2026-06-17', false, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('fc4c5cd1-259e-4dd6-8675-5595d798da66', '2026-06-18', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('969fbeb8-6481-4e6b-a94b-f11ce9d6fc5e', '2026-06-18', false, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('95771c37-be9a-48ea-9228-5e4068e87901', '2026-06-19', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('a825dfbf-e2a1-45f5-9f6a-91abe77b461b', '2026-06-19', true, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('51fc1235-0564-4d39-b2f2-dd13b494e921', '2026-06-20', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('73a35e13-d4ed-4dde-9587-53066e92a79d', '2026-06-20', false, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('a542d1dc-e735-4317-b6ff-37e3afa601c4', '2026-06-22', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('b75b32ab-eec8-462d-9f5c-f46f6404afbb', '2026-06-22', false, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('0af28fc6-e0d5-422c-83a2-8fc8cf48cabb', '2026-06-23', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('d063e72a-1351-4ac1-ae8c-8748973bd96e', '2026-06-23', false, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('8f984ce2-8f70-46a4-b200-defa80abea3f', '2026-06-24', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('20dbd137-aaf3-4e21-8650-20c179cc6841', '2026-06-24', true, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('29001bd4-76bb-4e59-a192-519d738eecaa', '2026-06-25', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('9aab9393-873d-4dea-93f6-b4c81d30c137', '2026-06-25', false, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('c14b6d70-5362-4416-9993-7245ea17d1b5', '2026-06-26', true, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('245e2c4b-f15a-43aa-92cd-a113cdf8df6a', '2026-06-26', false, 'DINNER') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('180d6035-0698-4bc5-989f-4dd6fb35eab3', '2026-06-27', false, 'LUNCH') ON CONFLICT DO NOTHING;
INSERT INTO operations.daily_menus (id, date, with_rice, meal_type) VALUES ('bce0adf7-74c5-4ae5-8879-2a50b90a3626', '2026-06-27', true, 'DINNER') ON CONFLICT DO NOTHING;

-- Step 5: Menu Types (which menus are scheduled per daily menu)
-- Uncosted item: ဝက်ကချင်ချက် for 2026-06-01 LUNCH
-- Uncosted item: ‌ဇူကာညွန့်ကြော်ချက် for 2026-06-01 LUNCH
-- Soup/drink (uncosted): မုန်လာရွက်ချဉ်ဟင်း for 2026-06-01 LUNCH
-- Uncosted item: ဝက်ကုန်းဘောင် for 2026-06-01 DINNER
-- Uncosted item: ‌ဇူကာညွန့်ကြော်ချက် for 2026-06-01 DINNER
-- Uncosted item: ငါးဖယ်သုပ် for 2026-06-02 LUNCH
INSERT INTO operations.menu_types (id, menu_id, daily_menus_id, is_main) VALUES ('c53af038-9757-460a-bcc3-718d537b4550', '3a7295d8-0932-4b13-ab19-2605b65022d1', '187011bb-f902-49b9-ab2c-0b193974f793', false) ON CONFLICT DO NOTHING;
-- Soup/drink (uncosted): ပဲနီလေးဟင်းချို for 2026-06-02 LUNCH
-- Uncosted item: ငါးဖယ်ခရမ်းချဉ်သီး for 2026-06-02 DINNER
INSERT INTO operations.menu_types (id, menu_id, daily_menus_id, is_main) VALUES ('4389da0e-fdd4-4ef7-88c7-fcf2d1cb8a96', '3a7295d8-0932-4b13-ab19-2605b65022d1', '159ce1be-6dd5-4da6-b9ca-913cb792d129', false) ON CONFLICT DO NOTHING;
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
INSERT INTO operations.menu_types (id, menu_id, daily_menus_id, is_main) VALUES ('6e0e361e-d0a7-4e8a-85f9-6ce65ac80f47', '3a7295d8-0932-4b13-ab19-2605b65022d1', '87ebf058-0df5-4c24-a17b-1984b615432c', false) ON CONFLICT DO NOTHING;
-- Uncosted item: ငရုတ်သီးဆားထောင်း for 2026-06-05 LUNCH
-- Soup/drink (uncosted): ငါးချဉ်စပ်ဟင်းရည် for 2026-06-05 LUNCH
-- Uncosted item: ငါးထမင်းနယ် for 2026-06-05 DINNER
INSERT INTO operations.menu_types (id, menu_id, daily_menus_id, is_main) VALUES ('b4b33514-83c1-4ce3-9192-3ae928ef9faf', '3a7295d8-0932-4b13-ab19-2605b65022d1', '2058ae1d-7f2e-4b9a-a2d6-bf88b650bda3', false) ON CONFLICT DO NOTHING;
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
INSERT INTO operations.menu_types (id, menu_id, daily_menus_id, is_main) VALUES ('f1c14dc3-56bd-4e4f-9c0a-9416415b92c3', '84f80e62-bb5a-48e6-b564-ab64e21fdf38', 'fc4c5cd1-259e-4dd6-8675-5595d798da66', false) ON CONFLICT DO NOTHING;
-- Soup/drink (uncosted): မြင်းခွာရွက်ဟင်းခါး for 2026-06-18 LUNCH
-- Uncosted item: ခေါက်ဆွဲကြော်(ဝက်) for 2026-06-18 DINNER
INSERT INTO operations.menu_types (id, menu_id, daily_menus_id, is_main) VALUES ('5fa00259-14f7-4c3d-bedf-cad978c84f8a', '84f80e62-bb5a-48e6-b564-ab64e21fdf38', '969fbeb8-6481-4e6b-a94b-f11ce9d6fc5e', false) ON CONFLICT DO NOTHING;
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
INSERT INTO operations.menu_types (id, menu_id, daily_menus_id, is_main) VALUES ('4c4b3ea8-4ebb-45d7-9513-1970d12f0d38', 'ccdc0dc4-d363-4ad9-90b3-69afc2eafa4d', '0af28fc6-e0d5-422c-83a2-8fc8cf48cabb', false) ON CONFLICT DO NOTHING;
-- Uncosted item: ကြက်ပေါင်းခေါက်ဆွဲ for 2026-06-23 DINNER
INSERT INTO operations.menu_types (id, menu_id, daily_menus_id, is_main) VALUES ('2972faa2-8dd8-43e7-8bfd-6abdea33a3c7', 'ccdc0dc4-d363-4ad9-90b3-69afc2eafa4d', 'd063e72a-1351-4ac1-ae8c-8748973bd96e', false) ON CONFLICT DO NOTHING;
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
