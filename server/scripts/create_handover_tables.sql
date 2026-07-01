-- Employee Handover MVP (Phase 1)

-- Main handover case (exit / offboarding linked)
CREATE TABLE IF NOT EXISTS public.employee_handovers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  outgoing_employee_id UUID NOT NULL,
  successor_employee_id UUID,
  successor_type TEXT NOT NULL DEFAULT 'existing'
    CHECK (successor_type IN ('existing', 'new_hire', 'temporary')),
  trigger_type TEXT NOT NULL DEFAULT 'exit'
    CHECK (trigger_type IN ('exit', 'role_change', 'temporary_coverage')),
  offboarding_id UUID,
  effective_date DATE,
  handover_deadline DATE,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN (
      'draft', 'pending_successor', 'in_progress', 'pending_review',
      'completed', 'cancelled', 'waived'
    )),
  completion_pct INTEGER DEFAULT 0,
  created_by_user_id UUID,
  approved_by_user_id UUID,
  approved_at TIMESTAMPTZ,
  waived_by_user_id UUID,
  waived_at TIMESTAMPTZ,
  waived_reason TEXT,
  submitted_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Checklist items
CREATE TABLE IF NOT EXISTS public.handover_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  handover_id UUID NOT NULL REFERENCES public.employee_handovers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'knowledge_transfer'
    CHECK (category IN (
      'knowledge_transfer', 'pending_work', 'clients_contacts',
      'documents', 'systems_access', 'other'
    )),
  owner_role TEXT NOT NULL DEFAULT 'outgoing'
    CHECK (owner_role IN ('outgoing', 'successor', 'manager', 'it', 'hr')),
  sort_order INTEGER DEFAULT 0,
  is_required BOOLEAN DEFAULT TRUE,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'in_progress', 'done', 'not_applicable')),
  outgoing_notes TEXT,
  evidence_url TEXT,
  successor_acknowledged BOOLEAN DEFAULT FALSE,
  successor_ack_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- File attachments
CREATE TABLE IF NOT EXISTS public.handover_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  handover_id UUID NOT NULL REFERENCES public.employee_handovers(id) ON DELETE CASCADE,
  handover_item_id UUID REFERENCES public.handover_items(id) ON DELETE SET NULL,
  uploaded_by_user_id UUID,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Extend corporate_offboarding
ALTER TABLE public.corporate_offboarding
  ADD COLUMN IF NOT EXISTS handover_id UUID,
  ADD COLUMN IF NOT EXISTS handover_required BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS handover_waived_reason TEXT,
  ADD COLUMN IF NOT EXISTS handover_waived_by UUID;

CREATE INDEX IF NOT EXISTS idx_handovers_outgoing ON public.employee_handovers(outgoing_employee_id);
CREATE INDEX IF NOT EXISTS idx_handovers_successor ON public.employee_handovers(successor_employee_id);
CREATE INDEX IF NOT EXISTS idx_handovers_offboarding ON public.employee_handovers(offboarding_id);
CREATE INDEX IF NOT EXISTS idx_handovers_status ON public.employee_handovers(status);
CREATE INDEX IF NOT EXISTS idx_handover_items_handover ON public.handover_items(handover_id);

ALTER TABLE public.employee_handovers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.handover_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.handover_attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all employee_handovers via Node API" ON public.employee_handovers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all handover_items via Node API" ON public.handover_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all handover_attachments via Node API" ON public.handover_attachments FOR ALL USING (true) WITH CHECK (true);

-- Storage bucket (create in Supabase Dashboard > Storage if not exists):
--   handover_documents (public)
