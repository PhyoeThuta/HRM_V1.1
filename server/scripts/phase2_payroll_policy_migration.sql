-- ============================================================
-- BBD HRM — Phase 2: Company Payroll Policy Configuration
-- Migration: Create company_payroll_policy table
-- Safe to run on existing production database.
-- Additive only — no existing tables modified.
-- ============================================================

-- NOTE: BBD does not yet have a dedicated company/tenant table.
--       The current system is single-company (BBD).
--       This table uses company_id = 'bbd' as a stable slug.
--       When multi-company is introduced (Phase 5+), company_id
--       can be changed to a FK to a companies table.

CREATE TABLE IF NOT EXISTS company_payroll_policy (
  id                              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id                      TEXT        NOT NULL UNIQUE,  -- 'bbd' for the current single tenant

  -- Salary / Working Days
  salary_divisor                  INTEGER     NOT NULL DEFAULT 26
                                  CHECK (salary_divisor > 0 AND salary_divisor <= 365),

  -- Weekly holidays stored as an array of weekday names
  -- Valid values: 'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'
  weekly_holidays                 TEXT[]      NOT NULL DEFAULT ARRAY['SUNDAY']
                                  CHECK (
                                    array_length(weekly_holidays, 1) >= 0 AND
                                    weekly_holidays <@ ARRAY['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY']::TEXT[]
                                  ),

  -- Timezone (IANA timezone string)
  timezone                        TEXT        NOT NULL DEFAULT 'Asia/Bangkok',

  -- Punctuality policy
  approved_leave_counts_as_punctual  BOOLEAN NOT NULL DEFAULT TRUE,

  -- Peer review scoring
  peer_score_max_stars            INTEGER     NOT NULL DEFAULT 5
                                  CHECK (peer_score_max_stars > 0 AND peer_score_max_stars <= 100),

  -- Default scores (when no data exists for the period)
  default_sop_score               NUMERIC(5,2) NOT NULL DEFAULT 100.00
                                  CHECK (default_sop_score >= 0 AND default_sop_score <= 100),

  default_peer_score              NUMERIC(5,2) NOT NULL DEFAULT 100.00
                                  CHECK (default_peer_score >= 0 AND default_peer_score <= 100),

  -- Audit columns
  created_by_user_id              UUID,
  updated_by_user_id              UUID,
  created_at                      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Seed the initial BBD policy (matches current production behavior) ──────────
INSERT INTO company_payroll_policy (
  company_id,
  salary_divisor,
  weekly_holidays,
  timezone,
  approved_leave_counts_as_punctual,
  peer_score_max_stars,
  default_sop_score,
  default_peer_score,
  created_at,
  updated_at
) VALUES (
  'bbd',
  26,
  ARRAY['SUNDAY'],
  'Asia/Bangkok',
  TRUE,
  5,
  100.00,
  100.00,
  NOW(),
  NOW()
)
ON CONFLICT (company_id) DO NOTHING;
-- ON CONFLICT DO NOTHING ensures safe re-runs of this migration.
