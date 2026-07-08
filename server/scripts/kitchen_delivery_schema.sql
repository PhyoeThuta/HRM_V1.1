-- Copy and paste this into your Supabase SQL Editor and click RUN

ALTER TABLE crm.customer_packages ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Active';
ALTER TABLE crm.customer_packages ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'Unpaid';
ALTER TABLE crm.customers ADD COLUMN IF NOT EXISTS delivery_address TEXT;
ALTER TABLE crm.customers ADD COLUMN IF NOT EXISTS delivery_notes TEXT;
