-- Fix the order_id column type to be UUID instead of BIGINT
DROP TABLE IF EXISTS public.operations_delivery_assignments CASCADE;

CREATE TABLE public.operations_delivery_assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID UNIQUE,
  rider_id UUID REFERENCES public.sys_users(id) ON DELETE CASCADE,
  picked_up_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR(255) DEFAULT 'ACCEPTED',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.operations_delivery_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all for operations_delivery_assignments" ON public.operations_delivery_assignments FOR ALL USING (true) WITH CHECK (true);
