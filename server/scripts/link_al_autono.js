import { supabaseAdmin } from '../lib/supabase.js';

async function linkAlAutono() {
  console.log('Searching for Al Autono...');
  
  // Find customer
  const { data: cust } = await supabaseAdmin.schema('crm').from('customers').select('id, full_name').ilike('full_name', '%Autono%').single();
  if (!cust) {
    console.log('Customer Al Autono not found!');
    return;
  }
  console.log('Found Customer:', cust);

  // Find inquiry
  const { data: inq } = await supabaseAdmin.schema('crm').from('inquiries').select('id, prospect_name').ilike('prospect_name', '%Autono%').is('customer_id', null).single();
  if (!inq) {
    console.log('Unlinked Inquiry Al Autono not found!');
    return;
  }
  console.log('Found Unlinked Inquiry:', inq);

  // Link them
  const { error } = await supabaseAdmin.schema('crm').from('inquiries').update({ customer_id: cust.id, status: 'converted' }).eq('id', inq.id);
  if (error) {
    console.error('Error linking:', error);
  } else {
    console.log('✅ Successfully linked Inquiry to Customer and marked as converted!');
  }
  process.exit(0);
}

linkAlAutono();
