import { supabaseAdmin } from '../lib/supabase.js';

async function seedLost() {
  console.log('Seeding 30 lost mock inquiries...');

  const sources = ['Facebook Messenger'];
  const inquiries = [];
  const now = new Date();

  for (let i = 1; i <= 30; i++) {
    const source = sources[Math.floor(Math.random() * sources.length)];
    // Random date within last 6 months
    const created_at = new Date(now.getTime() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString();

    inquiries.push({
      prospect_name: `[MOCK] Lost Customer ${i}`,
      status: 'lost',
      notes: 'This is a mock record for testing ML features',
      created_at
    });
  }

  const { error: inqErr } = await supabaseAdmin.schema('crm').from('inquiries').insert(inquiries);
  if (inqErr) {
    console.error('Inquiries error:', inqErr.message);
  } else {
    console.log(`Successfully inserted ${inquiries.length} lost inquiries!`);
  }

  process.exit(0);
}

seedLost();
