import { supabaseAdmin } from '../lib/supabase.js';

async function alter() {
  // If rpc doesn't exist, we can't alter table via REST API directly. But maybe we can.
  const { data, error } = await supabaseAdmin.rpc('run_sql', { 
    sql_query: `
      ALTER TABLE sys_audit_logs 
      ADD COLUMN IF NOT EXISTS user_name VARCHAR(255),
      ADD COLUMN IF NOT EXISTS user_role VARCHAR(100),
      ADD COLUMN IF NOT EXISTS device_type VARCHAR(100),
      ADD COLUMN IF NOT EXISTS os VARCHAR(100),
      ADD COLUMN IF NOT EXISTS browser VARCHAR(100),
      ADD COLUMN IF NOT EXISTS user_agent TEXT;
    ` 
  });
  console.log('Result:', data, error);
}

alter();
