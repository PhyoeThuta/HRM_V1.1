CREATE TABLE public.employee_daily_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID REFERENCES public."Employees"(id) NOT NULL,
  schedule_date DATE NOT NULL,
  shift_id UUID REFERENCES public.shifts(id),
  is_off_day BOOLEAN DEFAULT FALSE,
  UNIQUE (employee_id, schedule_date)
);

-- Enable RLS
ALTER TABLE public.employee_daily_schedules ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all access for now (assuming this is managed securely)
CREATE POLICY "Enable read access for all users" ON public.employee_daily_schedules FOR SELECT USING (true);
CREATE POLICY "Enable all access for all users" ON public.employee_daily_schedules FOR ALL USING (true) WITH CHECK (true);
