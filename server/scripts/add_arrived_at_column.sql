-- Run this in Supabase Dashboard → SQL Editor
-- Add arrived_at column to track when rider arrives at pickup point
ALTER TABLE public.operations_rider_assignments 
  ADD COLUMN IF NOT EXISTS arrived_at TIMESTAMP WITH TIME ZONE;

-- Also update the status default to ASSIGNED (was ACCEPTED before)
ALTER TABLE public.operations_rider_assignments 
  ALTER COLUMN status SET DEFAULT 'ASSIGNED';
