-- Create new table to replace the buggy delivery_assignments table
-- We use a new name to avoid "deadlock" errors with currently running apps
CREATE TABLE IF NOT EXISTS public.operations_rider_assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID UNIQUE,
  rider_id UUID REFERENCES public.sys_users(id) ON DELETE CASCADE,
  picked_up_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR(255) DEFAULT 'ACCEPTED',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.operations_rider_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all for operations_rider_assignments" ON public.operations_rider_assignments FOR ALL USING (true) WITH CHECK (true);
