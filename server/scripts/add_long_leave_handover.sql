-- Long leave handover (temporary coverage + return)
-- Run in Supabase SQL Editor after create_handover_tables.sql

ALTER TABLE public.employee_handovers
  ADD COLUMN IF NOT EXISTS leave_request_id UUID,
  ADD COLUMN IF NOT EXISTS expected_return_date DATE,
  ADD COLUMN IF NOT EXISTS parent_handover_id UUID;

ALTER TABLE public."Leave_Request"
  ADD COLUMN IF NOT EXISTS coverage_handover_id UUID,
  ADD COLUMN IF NOT EXISTS return_handover_id UUID;

CREATE INDEX IF NOT EXISTS idx_handovers_leave_request
  ON public.employee_handovers(leave_request_id);
CREATE INDEX IF NOT EXISTS idx_handovers_parent
  ON public.employee_handovers(parent_handover_id);
