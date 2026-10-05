import * as dotenv from 'dotenv';
dotenv.config();
import { supabaseAdmin } from './lib/supabase.js';

async function check() {
  const { data, error } = await supabaseAdmin.rpc('execute_read_only_sql', {
    query_text: "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'attendance_records'"
  });
  console.log('Columns in attendance_records:', data);
  if (error) console.error('Error:', error);
}
check();
