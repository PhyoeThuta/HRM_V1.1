import dotenv from 'dotenv';
dotenv.config();
import { supabaseAdmin } from './lib/supabase.js';

async function check() {
  const { data: customers } = await supabaseAdmin.schema('crm').from('customers').select('id, full_name');
  console.log("Customers:", customers);

  const { data: pkgs } = await supabaseAdmin.schema('crm').from('customer_packages').select('*');
  console.log("Packages:", pkgs);

  const { data: orders } = await supabaseAdmin.from('operations_orders').select('*').eq('date', new Date().toISOString().split('T')[0]);
  console.log("Orders today:", orders);
}
check();
