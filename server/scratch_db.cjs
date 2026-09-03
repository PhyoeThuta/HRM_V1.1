require('dotenv').config({path: './.env'});
const pg = require('pg');
const { createClient } = require('@supabase/supabase-js');
const WebSocket = require('ws');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false },
  realtime: { transport: WebSocket }
});

const client = new pg.Client({
  connectionString: 'postgresql://postgres.kcswzfrwpvioaaizfpnk:PHYOEthuta123!%40%23@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres'
});

async function run() {
  try {
    // 1. Create the bucket via supabase-js
    const { data, error } = await supabase.storage.createBucket('avatars', { public: true });
    if (error) console.log('Bucket creation error (might already exist):', error.message);
    else console.log('Bucket "avatars" created!');

    // 2. Add avatar_url column to crm.customers via pg
    await client.connect();
    await client.query("ALTER TABLE crm.customers ADD COLUMN IF NOT EXISTS avatar_url TEXT;");
    console.log('Added avatar_url column to crm.customers!');

  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
}

run();
