-- Migration Script to change Level Settings logic to Total Spend

-- 1. Add amount column to customer_packages
ALTER TABLE crm.customer_packages ADD COLUMN IF NOT EXISTS amount INTEGER DEFAULT 0;

-- 2. Rename required_purchases to required_spend in level_settings
ALTER TABLE crm.level_settings RENAME COLUMN required_purchases TO required_spend;

SELECT 'Migration completed successfully!' as status;
