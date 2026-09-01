const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY, { auth: { persistSession: false } });

async function run() {
  const { data, error } = await sb.from('inquiries_messages').delete().like('message_text', '[Zernio Msg]%').select();
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Deleted garbage messages:', data.length);
  }
}

run();
