import { supabaseAdmin } from './lib/supabase.js';

async function updateDB() {
  const sql = `
    ALTER TABLE crm.customer_packages ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Active';
    ALTER TABLE crm.customer_packages ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'Unpaid';
    ALTER TABLE crm.customers ADD COLUMN IF NOT EXISTS delivery_address TEXT;
    ALTER TABLE crm.customers ADD COLUMN IF NOT EXISTS delivery_notes TEXT;
  `;
  const { data, error } = await supabaseAdmin.rpc('exec_sql', { sql });
  if (error) {
    console.error('RPC exec_sql failed:', error.message);
    console.log('Ensure you have a function named exec_sql, or run this manually.');
  } else {
    console.log('DB updated successfully:', data);
  }
}

updateDB();
