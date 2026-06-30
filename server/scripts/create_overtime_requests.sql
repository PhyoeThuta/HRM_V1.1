CREATE TABLE public.overtime_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES public."Employees"(id) ON DELETE CASCADE,
    ot_date DATE NOT NULL,
    reason TEXT,
    requested_by TEXT NOT NULL CHECK (requested_by IN ('employee', 'hr_boss')),
    status TEXT NOT NULL DEFAULT 'Pending_Boss_Approval' CHECK (status IN ('Pending_Boss_Approval', 'Pending_Employee_Acceptance', 'Approved', 'Rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- RLS Policies (if RLS is enabled)
ALTER TABLE public.overtime_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all authenticated users" 
ON public.overtime_requests FOR SELECT USING (true);

CREATE POLICY "Enable insert for all authenticated users" 
ON public.overtime_requests FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all authenticated users" 
ON public.overtime_requests FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all authenticated users" 
ON public.overtime_requests FOR DELETE USING (true);
