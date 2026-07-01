-- Offboarding schema to match the Node.js API expectations.
-- Per-case offboarding checklist (templates stay in offboarding_tasks)
CREATE TABLE IF NOT EXISTS public.offboarding_case_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  offboarding_id UUID NOT NULL,
  task_name TEXT NOT NULL,
  category TEXT,
  responsible TEXT,
  status TEXT NOT NULL DEFAULT 'Pending',
  due_date DATE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_offboarding_case_tasks_ob
  ON public.offboarding_case_tasks(offboarding_id);

ALTER TABLE public.offboarding_case_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all offboarding_case_tasks via Node API"
  ON public.offboarding_case_tasks FOR ALL USING (true) WITH CHECK (true);

-- ALTER TABLE public.corporate_offboarding ADD COLUMN IF NOT EXISTS last_working_day DATE;
-- UPDATE public.corporate_offboarding SET last_working_day = last_working_date WHERE last_working_day IS NULL;
