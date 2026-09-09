import { supabaseAdmin } from './lib/supabase.js';

async function check() {
  const { data: rows, error: rowError } = await supabaseAdmin
    .schema('crm')
    .from('customer_packages')
    .select('*')
    .limit(1);
  if (rows && rows.length > 0) {
    console.log("Customer Packages Columns:", Object.keys(rows[0]));
  } else {
    console.error("Error or no rows:", rowError || "No rows found");
  }
}
check();
