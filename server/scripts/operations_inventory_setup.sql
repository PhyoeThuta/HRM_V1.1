-- Enable uuid-ossp extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE SCHEMA IF NOT EXISTS inventory;
CREATE SCHEMA IF NOT EXISTS operations;

-- ==========================================
-- 1. INVENTORY MANAGEMENT TABLES
-- ==========================================

CREATE TABLE IF NOT EXISTS inventory.items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_eng VARCHAR NOT NULL,
    name_mm VARCHAR,
    item_code VARCHAR UNIQUE NOT NULL,
    category VARCHAR NOT NULL, -- e.g., 'TOOL', 'RECIPE_INGREDIENT'
    unit_of_measure VARCHAR NOT NULL, -- e.g., 'G', 'ML', 'PCS'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID,
    created_by UUID
);

CREATE TABLE IF NOT EXISTS inventory.balances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID REFERENCES inventory.items(id) ON DELETE CASCADE,
    current_quantity DECIMAL NOT NULL DEFAULT 0,
    min_quantity DECIMAL NOT NULL DEFAULT 0,
    one_unit_cost DECIMAL NOT NULL DEFAULT 0,
    last_restocked_at TIMESTAMP WITH TIME ZONE,
    closing_balance DECIMAL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID,
    created_by UUID
);

CREATE TABLE IF NOT EXISTS inventory.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID REFERENCES inventory.items(id) ON DELETE CASCADE,
    transaction_type VARCHAR NOT NULL, -- 'PURCHASE_IN', 'USAGE_OUT', 'SPOILAGE', 'ADJUSTMENT'
    quantity_change DECIMAL NOT NULL,
    unit_price_at_transaction DECIMAL,
    reference_type VARCHAR,
    reference_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID,
    created_by UUID
);

-- ==========================================
-- 2. OPERATIONS MANAGEMENT TABLES
-- ==========================================

CREATE TABLE IF NOT EXISTS operations.menus (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_en VARCHAR NOT NULL,
    name_mm VARCHAR,
    code VARCHAR UNIQUE NOT NULL,
    sales_prices DECIMAL NOT NULL DEFAULT 0,
    total_bill_of_materials DECIMAL NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID,
    created_by UUID
);

CREATE TABLE IF NOT EXISTS operations.recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    menu_id UUID REFERENCES operations.menus(id) ON DELETE CASCADE,
    inventory_item_id UUID REFERENCES inventory.items(id) ON DELETE CASCADE,
    qty DECIMAL NOT NULL,
    total DECIMAL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID,
    created_by UUID
);

CREATE TABLE IF NOT EXISTS operations.daily_menus (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    with_rice BOOLEAN DEFAULT TRUE,
    meal_type VARCHAR NOT NULL, -- 'LUNCH', 'DINNER'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID,
    created_by UUID
);

CREATE TABLE IF NOT EXISTS operations.menu_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    menu_id UUID REFERENCES operations.menus(id) ON DELETE CASCADE,
    daily_menus_id UUID REFERENCES operations.daily_menus(id) ON DELETE CASCADE,
    total_bill_of_materials DECIMAL,
    sales_price DECIMAL,
    is_main BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID,
    created_by UUID
);

CREATE TABLE IF NOT EXISTS operations.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    customer_id BIGINT REFERENCES crm.customers(id) ON DELETE CASCADE,
    daily_menu_id UUID REFERENCES operations.daily_menus(id) ON DELETE SET NULL,
    count INTEGER NOT NULL DEFAULT 1,
    special_request_override TEXT,
    delivery_status VARCHAR DEFAULT 'PENDING',
    status VARCHAR DEFAULT 'auto', -- 'manual', 'auto'
    delivered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID,
    created_by UUID
);

CREATE TABLE IF NOT EXISTS operations.skip_days (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id BIGINT REFERENCES crm.customers(id) ON DELETE CASCADE,
    skip_date DATE NOT NULL,
    skipped_meal_type VARCHAR NOT NULL, -- 'LUNCH', 'DINNER', 'ALL'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID,
    created_by UUID
);
