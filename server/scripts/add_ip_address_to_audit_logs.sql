-- BEST PRACTICE FIX: Add the missing 'ip_address' column to the sys_audit_logs table
-- Run this directly in your Supabase SQL Editor

ALTER TABLE public.sys_audit_logs 
ADD COLUMN IF NOT EXISTS ip_address VARCHAR(45) DEFAULT '0.0.0.0';

-- Reload schema cache so the API immediately recognizes the new column
NOTIFY pgrst, 'reload schema';
