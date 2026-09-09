import { supabaseAdmin } from '../lib/supabase.js';

async function fixDirtyInquiries() {
  console.log('Fixing dirty inquiry statuses...');
  const { data, error } = await supabaseAdmin
    .schema('crm')
    .from('inquiries')
    .select('id, status, prospect_name, customer_id')
    .not('customer_id', 'is', null)
    .neq('status', 'converted');

  if (error) {
    console.error('Error fetching inquiries:', error);
    process.exit(1);
  }

  if (data.length === 0) {
    console.log('✅ No dirty inquiries found. Database is clean!');
    process.exit(0);
  }

  console.log(`Found ${data.length} inquiries that are linked to customers but not marked as 'converted'. Fixing...`);

  for (const inq of data) {
    const { error: updateError } = await supabaseAdmin
      .schema('crm')
      .from('inquiries')
      .update({ status: 'converted' })
      .eq('id', inq.id);

    if (updateError) {
      console.error(`❌ Error updating inquiry ${inq.id}:`, updateError);
    } else {
      console.log(`✅ Updated inquiry ${inq.id} (${inq.prospect_name}) to 'converted'`);
    }
  }

  console.log('Migration complete!');
  process.exit(0);
}

fixDirtyInquiries();
