-- ================================================================
-- CRM Schema Migration
-- Run this ONCE in: Supabase Dashboard → SQL Editor → New Query
-- ================================================================

-- 1. Create the crm schema
CREATE SCHEMA IF NOT EXISTS crm;

-- 2. Customers table
CREATE TABLE IF NOT EXISTS crm.customers (
  id           BIGSERIAL PRIMARY KEY,
  customer_code TEXT NOT NULL UNIQUE,
  full_name    TEXT NOT NULL,
  facebook_name TEXT,
  age          INTEGER,
  gender       TEXT DEFAULT 'Female',
  email        TEXT,
  phone        TEXT,
  address      TEXT,
  notes        TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Customer health metrics
CREATE TABLE IF NOT EXISTS crm.customer_health (
  id                 BIGSERIAL PRIMARY KEY,
  customer_id        BIGINT REFERENCES crm.customers(id) ON DELETE CASCADE,
  current_weight     TEXT,
  goal_weight        TEXT,
  height             TEXT,
  time_frame         TEXT,
  medical_condition  TEXT DEFAULT 'None',
  other_condition    TEXT DEFAULT 'None',
  medicine_taking    TEXT DEFAULT 'None',
  special_requests   TEXT DEFAULT 'None',
  allergies          TEXT DEFAULT 'None',
  updated_at         TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Customer lifestyle
CREATE TABLE IF NOT EXISTS crm.customer_lifestyle (
  id                   BIGSERIAL PRIMARY KEY,
  customer_id          BIGINT REFERENCES crm.customers(id) ON DELETE CASCADE,
  food_restriction     TEXT DEFAULT 'None',
  activity_level       TEXT DEFAULT 'Sedentary',
  fasting_willingness  TEXT DEFAULT 'No',
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Available packages / menu
CREATE TABLE IF NOT EXISTS crm.packages (
  id         BIGSERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  duration   TEXT NOT NULL,
  price      TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Packages assigned to customers
CREATE TABLE IF NOT EXISTS crm.customer_packages (
  id          BIGSERIAL PRIMARY KEY,
  customer_id BIGINT REFERENCES crm.customers(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  duration    TEXT,
  meal_type   TEXT DEFAULT 'LUNCH, DINNER',
  meal_count  INTEGER DEFAULT 60,
  expires_at  DATE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Progress gallery photos
CREATE TABLE IF NOT EXISTS crm.gallery_photos (
  id          BIGSERIAL PRIMARY KEY,
  customer_id BIGINT REFERENCES crm.customers(id) ON DELETE CASCADE,
  type        TEXT NOT NULL CHECK (type IN ('Before', 'After')),
  url         TEXT NOT NULL,
  storage_path TEXT,
  taken_at    DATE DEFAULT CURRENT_DATE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Inquiries / Leads
CREATE TABLE IF NOT EXISTS crm.inquiries (
  id             BIGSERIAL PRIMARY KEY,
  prospect_name  TEXT NOT NULL,
  source         TEXT DEFAULT 'Facebook Messenger',
  service        TEXT,
  status         TEXT DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Converted', 'Lost')),
  notes          TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Customer feedbacks
CREATE TABLE IF NOT EXISTS crm.feedbacks (
  id          BIGSERIAL PRIMARY KEY,
  customer_id BIGINT REFERENCES crm.customers(id) ON DELETE CASCADE,
  rating      INTEGER CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Seed default packages
INSERT INTO crm.packages (name, duration, price)
VALUES
  ('Boss Diet', '1 Month', '150000'),
  ('Keto Diet', '1 Week', '45000'),
  ('Detox Plan', '14 Days', '80000')
ON CONFLICT DO NOTHING;

-- 11. Enable Row Level Security (allow backend service role full access)
ALTER TABLE crm.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.customer_health ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.customer_lifestyle ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.customer_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.feedbacks ENABLE ROW LEVEL SECURITY;

-- 12. Grant service_role full access (backend uses service key, bypasses RLS)
GRANT ALL ON ALL TABLES IN SCHEMA crm TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA crm TO service_role;
GRANT USAGE ON SCHEMA crm TO service_role;

-- Done!
SELECT 'CRM Schema created successfully!' AS status;
