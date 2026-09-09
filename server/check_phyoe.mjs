import { supabaseAdmin } from './lib/supabase.js';

async function check() {
  console.log("Checking customer data for Phyoe Thuta...");
  const { data, error } = await supabaseAdmin
    .schema('crm')
    .from('customers')
    .select('id, full_name, platform_id, customer_packages(id, status, start_date, end_date)')
    .ilike('full_name', '%phyoe thuta%');
    
  if (error) {
    console.error("Error:", error);
  } else {
    console.log(JSON.stringify(data, null, 2));
  }
}
check();
