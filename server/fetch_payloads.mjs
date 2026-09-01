import { supabaseAdmin } from './lib/supabase.js';

async function fetchPayloads() {
  try {
    const { data, error } = await supabaseAdmin
      .schema('crm')
      .from('inquiries_messages')
      .select('metadata, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) throw error;
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error:', err);
  }
}

fetchPayloads();
