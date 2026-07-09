-- ================================================================
-- AI-Powered Inquiries Schema Migration
-- Run this in Supabase Dashboard -> SQL Editor
-- ================================================================

-- Drop existing tables to apply the new schema cleanly (Make sure this is okay in production!)
DROP TABLE IF EXISTS crm.inquiries_messages CASCADE;
DROP TABLE IF EXISTS crm.inquiries CASCADE;

-- 1. Create Enums if they don't exist
DO $$ BEGIN
    CREATE TYPE crm.inquiry_source AS ENUM ('website', 'messenger', 'telegram', 'instagram');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE crm.inquiry_status AS ENUM ('new', 'in_progress', 'converted', 'closed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE crm.feedback_type AS ENUM ('general_inquiry', 'post_purchase');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create the advanced Inquiries table
CREATE TABLE crm.inquiries (
  id                          BIGSERIAL PRIMARY KEY,
  customer_id                 BIGINT REFERENCES crm.customers(id) ON DELETE SET NULL,
  prospect_name               TEXT NOT NULL,
  prospect_contact            TEXT,
  service_interest            TEXT,
  service_interest_confidence INTEGER DEFAULT 0,
  last_analyzed_msg_count     INTEGER DEFAULT 0,
  ai_analysis_result          JSONB,
  pre_selected_branch_id      INTEGER,
  source                      crm.inquiry_source DEFAULT 'messenger',
  status                      crm.inquiry_status DEFAULT 'new',
  assigned_to                 TEXT,
  notes                       TEXT,
  created_at                  TIMESTAMPTZ DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ DEFAULT NOW(),
  created_by                  TEXT,
  updated_by                  TEXT
);

-- 3. Create the Inquiries Messages table (for the Chat Thread)
CREATE TABLE crm.inquiries_messages (
  id                  BIGSERIAL PRIMARY KEY,
  inquiry_id          BIGINT REFERENCES crm.inquiries(id) ON DELETE CASCADE,
  sender_type         TEXT CHECK (sender_type IN ('prospect', 'admin', 'ai_bot')),
  message_text        TEXT NOT NULL,
  metadata            JSONB,
  platform_message_id TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW(),
  created_by          TEXT,
  updated_by          TEXT
);

-- 4. Update the Feedbacks table
-- We'll add the new columns. If the table already exists, we use ALTER TABLE.
ALTER TABLE crm.feedbacks 
  ADD COLUMN IF NOT EXISTS inquiry_id BIGINT REFERENCES crm.inquiries(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS type crm.feedback_type DEFAULT 'post_purchase',
  ADD COLUMN IF NOT EXISTS ai_analysis_result JSONB,
  ADD COLUMN IF NOT EXISTS ai_flagged BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_by TEXT,
  ADD COLUMN IF NOT EXISTS created_by TEXT;

-- 5. Enable Row Level Security
ALTER TABLE crm.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.inquiries_messages ENABLE ROW LEVEL SECURITY;

-- 6. Grant access to service_role (Backend)
GRANT ALL ON TABLE crm.inquiries TO service_role;
GRANT ALL ON TABLE crm.inquiries_messages TO service_role;
GRANT ALL ON SEQUENCE crm.inquiries_id_seq TO service_role;
GRANT ALL ON SEQUENCE crm.inquiries_messages_id_seq TO service_role;
GRANT USAGE ON SCHEMA crm TO service_role;

-- Done!
SELECT 'AI-Powered Inquiries Schema applied successfully!' AS status;
