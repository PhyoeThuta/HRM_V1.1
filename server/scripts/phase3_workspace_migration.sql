-- ============================================================
-- BBD HRM — Phase 3: Payroll Calculation Workspace
-- Migration: Add columns + duplicate check + unique constraint
--
-- INSTRUCTIONS:
--   Run STEP 1 first. If duplicates are reported, STOP.
--   Resolve duplicates manually, then run STEP 2 + STEP 3.
--   If STEP 1 reports 0 duplicates, run all steps together.
-- ============================================================

-- ─── STEP 1: Check for duplicate payroll records ─────────────────────────────
-- Run this first. If any rows are returned, duplicates exist and must be
-- resolved BEFORE running STEP 2 or STEP 3.

SELECT
  employee_id,
  month,
  COUNT(*) AS record_count,
  ARRAY_AGG(id ORDER BY created_at) AS duplicate_ids
FROM payrolls
GROUP BY employee_id, month
HAVING COUNT(*) > 1;

-- ─── STEP 2: Add new Phase 3 columns to payrolls (additive, safe) ────────────
-- Safe to run even if column already exists due to IF NOT EXISTS.

ALTER TABLE payrolls
  ADD COLUMN IF NOT EXISTS calculation_source TEXT DEFAULT 'auto',
  ADD COLUMN IF NOT EXISTS workspace_notes    TEXT DEFAULT NULL;

-- Backfill existing records with 'auto' source
UPDATE payrolls
SET calculation_source = 'auto'
WHERE calculation_source IS NULL;

-- ─── STEP 3: Add UNIQUE constraint (ONLY after Step 1 confirms 0 duplicates) ─
-- Creates a unique index so that (employee_id, month) is enforced at DB level.
-- This is the safest form: CREATE UNIQUE INDEX ... IF NOT EXISTS prevents errors on re-run.

CREATE UNIQUE INDEX IF NOT EXISTS payrolls_emp_month_unique
  ON payrolls (employee_id, month);

-- ─── Verification queries ─────────────────────────────────────────────────────
-- After running, verify:

-- 1. Confirm new columns exist and have correct defaults:
SELECT
  column_name,
  column_default,
  is_nullable,
  data_type
FROM information_schema.columns
WHERE table_name = 'payrolls'
  AND column_name IN ('calculation_source', 'workspace_notes');

-- 2. Confirm unique index was created:
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'payrolls'
  AND indexname = 'payrolls_emp_month_unique';

-- 3. Spot-check: existing payrolls should have calculation_source = 'auto'
SELECT id, employee_id, month, calculation_source, workspace_notes
FROM payrolls
LIMIT 5;
