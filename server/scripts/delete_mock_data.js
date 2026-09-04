import { supabaseAdmin } from '../lib/supabase.js';

async function cleanup() {
  console.log('Cleaning up mock CRM data...');

  // Delete inquiries with name like '[MOCK] Customer%'
  console.log('Deleting mock inquiries...');
  const { error: inqErr } = await supabaseAdmin.schema('crm')
    .from('inquiries')
    .delete()
    .like('prospect_name', '[MOCK]%');
    
  if (inqErr) console.error('Inquiries error:', inqErr.message);

  // Delete customers with name like '[MOCK] Customer%'
  // This will automatically delete customer_packages because of ON DELETE CASCADE
  console.log('Deleting mock customers (and their packages due to cascade)...');
  const { error: custErr } = await supabaseAdmin.schema('crm')
    .from('customers')
    .delete()
    .like('full_name', '[MOCK]%');
    
  if (custErr) console.error('Customers error:', custErr.message);

  console.log('Mock data cleaned up successfully!');
  process.exit(0);
}

cleanup();
