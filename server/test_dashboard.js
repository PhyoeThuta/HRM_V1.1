import { supabaseAdmin } from './lib/supabase.js';

async function testDashboard() {
  try {
    console.log('Testing dashboard...');
    const today = new Date().toISOString().split('T')[0];
    const thirtyDaysLater = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const thisMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

    const promises = [
      supabaseAdmin.schema('crm').from('customers').select('*', { count: 'exact', head: true }),
      supabaseAdmin.schema('crm').from('inquiries').select('*', { count: 'exact', head: true }).neq('status', 'Converted'),
      supabaseAdmin.schema('crm').from('inquiries').select('*', { count: 'exact' }).eq('status', 'Converted').gte('created_at', thisMonthStart),
      supabaseAdmin.schema('crm').from('customer_packages').select('*', { count: 'exact' }).gte('expires_at', today),
      supabaseAdmin.schema('crm').from('customer_packages').select('*, customers!inner(full_name, facebook_name)').gte('expires_at', today).lte('expires_at', thirtyDaysLater).order('expires_at', { ascending: true }).limit(5),
      supabaseAdmin.schema('crm').from('inquiries').select('*').order('created_at', { ascending: false }).limit(5),
    ];
    
    const results = await Promise.all(promises);
    for (let i = 0; i < results.length; i++) {
        if (results[i].error) {
            console.error(`Error in query ${i}:`, results[i].error);
        }
    }
    console.log('Done.');
  } catch (e) {
    console.error('Catch Error:', e);
  }
}

testDashboard();
