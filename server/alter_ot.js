import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function alterTable() {
  console.log('Altering overtime_requests table to add time columns...');
  // Since supabase-js cannot do DDL, we will use a raw RPC if available, or just instruct.
  // Actually, Supabase REST API does not allow DDL. I will print the SQL for the user to run, 
  // OR they might have a proxy. 
  console.log(`
--- PLEASE RUN THIS SQL IN YOUR SUPABASE DASHBOARD ---

ALTER TABLE public.overtime_requests 
ADD COLUMN start_time TIME,
ADD COLUMN end_time TIME,
ADD COLUMN requested_hours DECIMAL(5,2);

------------------------------------------------------
`);
}

alterTable();
