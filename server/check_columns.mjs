import { supabaseAdmin } from './lib/supabase.js';

async function check() {
  const { data, error } = await supabaseAdmin.rpc('get_customer_columns');
  
  if (error) {
    // Fallback: fetch one row and get keys
    const { data: rows, error: rowError } = await supabaseAdmin
      .schema('crm')
      .from('customers')
      .select('*')
      .limit(1);
    if (rows && rows.length > 0) {
      console.log("Customer Columns:", Object.keys(rows[0]));
    } else {
      console.error(rowError || "No rows found");
    }
  } else {
    console.log(data);
  }
}
check();
