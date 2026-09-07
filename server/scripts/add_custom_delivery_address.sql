-- The operations_orders exposed to the API is a VIEW in the public schema.
-- The actual base table is operations.orders.
-- We must add the column to the base table, and then recreate the view.

ALTER TABLE operations.orders ADD COLUMN IF NOT EXISTS custom_delivery_address TEXT;

-- Drop the view and recreate it to reflect the new column
DROP VIEW IF EXISTS public.operations_orders;

CREATE OR REPLACE VIEW public.operations_orders AS 
SELECT * FROM operations.orders;
