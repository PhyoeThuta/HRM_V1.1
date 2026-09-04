import { supabaseAdmin } from '../lib/supabase.js';

async function seed() {
  console.log('Seeding 100 mock CRM customers and inquiries...');

  const sources = ['Facebook Messenger'];
  
  const customers = [];
  const inquiries = [];
  const packages = [];

  const now = new Date();

  for (let i = 1; i <= 100; i++) {
    // Determine status
    let status;
    const r = Math.random();
    if (r < 0.3) status = 'new';
    else if (r < 0.6) status = 'in_progress';
    else status = 'converted';

    const source = sources[Math.floor(Math.random() * sources.length)];
    // Random date within last 6 months
    const created_at = new Date(now.getTime() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString();

    inquiries.push({
      prospect_name: `[MOCK] Customer ${i}`,
      status,
      notes: 'This is a mock record for testing ML features',
      created_at
    });

    if (status === 'converted') {
      customers.push({
        full_name: `[MOCK] Customer ${i}`,
        customer_code: `MC-${1000+i}`,
        phone: `09${Math.floor(100000000 + Math.random() * 900000000)}`,
        created_at
      });
    }
  }

  console.log(`Inserting ${inquiries.length} inquiries...`);
  const { error: inqErr } = await supabaseAdmin.schema('crm').from('inquiries').insert(inquiries);
  if (inqErr) console.error('Inquiries error:', inqErr.message);

  console.log(`Inserting ${customers.length} customers...`);
  const { data: insertedCustomers, error: custErr } = await supabaseAdmin.schema('crm').from('customers').insert(customers).select('id, created_at');
  if (custErr) console.error('Customers error:', custErr.message);

  if (insertedCustomers) {
    insertedCustomers.forEach((c, idx) => {
      const isExpired = Math.random() > 0.6;
      
      const created_at = new Date(c.created_at);
      const expires_at = new Date(created_at.getTime() + 30 * 24 * 60 * 60 * 1000); // +30 days
      
      // If we want them expired, make end_date in the past
      if (isExpired) {
        expires_at.setTime(now.getTime() - Math.random() * 10 * 24 * 60 * 60 * 1000);
      } else {
        expires_at.setTime(now.getTime() + Math.random() * 15 * 24 * 60 * 60 * 1000);
      }

      packages.push({
        customer_id: c.id,
        name: 'Mock Diet Plan',
        duration: '1 Month',
        expires_at: expires_at.toISOString().split('T')[0],
        created_at: c.created_at
      });
    });

    console.log(`Inserting ${packages.length} packages...`);
    const { error: pkgErr } = await supabaseAdmin.schema('crm').from('customer_packages').insert(packages);
    if (pkgErr) console.error('Packages error:', pkgErr.message);
  }

  console.log('Mock data seeded successfully! You can refresh the dashboards now.');
  process.exit(0);
}

seed();
