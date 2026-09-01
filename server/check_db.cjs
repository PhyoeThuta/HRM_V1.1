const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY, { auth: { persistSession: false } });

async function run() {
  const { data, error } = await sb.from('inquiries_messages').select('*').order('created_at', { ascending: false }).limit(20);
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Recent messages:', JSON.stringify(data, null, 2));
  }
}

run();
