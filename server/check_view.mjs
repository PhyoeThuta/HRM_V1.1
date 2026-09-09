import dotenv from 'dotenv';
dotenv.config();
import { supabaseAdmin } from './lib/supabase.js';

async function check() {
  // Let's use postgres package to query pg_views
  import('pg').then(({ Client }) => {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    client.connect().then(() => {
      client.query("SELECT definition FROM pg_views WHERE viewname = 'operations_orders';").then(res => {
        console.log(res.rows[0]?.definition);
        client.end();
      }).catch(e => {
        console.error(e);
        client.end();
      });
    }).catch(e => console.error('conn error', e));
  });
}
check();
