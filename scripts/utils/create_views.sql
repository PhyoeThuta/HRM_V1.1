-- Bypass PostgREST Schema Bug by creating views in the 'public' schema

-- Operations Views
CREATE OR REPLACE VIEW public.operations_menus AS SELECT * FROM operations.menus;
CREATE OR REPLACE VIEW public.operations_recipes AS SELECT * FROM operations.recipes;
CREATE OR REPLACE VIEW public.operations_daily_menus AS SELECT * FROM operations.daily_menus;
CREATE OR REPLACE VIEW public.operations_menu_types AS SELECT * FROM operations.menu_types;
CREATE OR REPLACE VIEW public.operations_orders AS SELECT * FROM operations.orders;

-- Inventory Views
CREATE OR REPLACE VIEW public.inventory_items AS SELECT * FROM inventory.items;
CREATE OR REPLACE VIEW public.inventory_balances AS SELECT * FROM inventory.balances;
CREATE OR REPLACE VIEW public.inventory_transactions AS SELECT * FROM inventory.transactions;

-- Grant access to public role so API can read/write them
GRANT ALL PRIVILEGES ON public.operations_menus TO anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON public.operations_recipes TO anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON public.operations_daily_menus TO anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON public.operations_menu_types TO anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON public.operations_orders TO anon, authenticated, service_role;

GRANT ALL PRIVILEGES ON public.inventory_items TO anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON public.inventory_balances TO anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON public.inventory_transactions TO anon, authenticated, service_role;

-- Important: Views are not automatically updatable if they use JOINs, but these are direct SELECT *, so they are updatable!
