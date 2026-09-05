import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';
global.WebSocket = WebSocket;

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function createRiders() {
  console.log('=== CREATING 2 TEST RIDERS ===');

  const ridersToCreate = [
    {
      username: 'rider01',
      full_name: 'Delivery Man 1',
      role: 'rider',
      password_hash: 'MUST_CHANGE:password123',
      is_active: true
    },
    {
      username: 'rider02',
      full_name: 'Delivery Man 2',
      role: 'rider',
      password_hash: 'MUST_CHANGE:password123',
      is_active: true
    }
  ];

  for (const r of ridersToCreate) {
    const { data: existing } = await supabaseAdmin.from('sys_users').select('id').eq('username', r.username).single();
    
    if (existing) {
      console.log(`✅ ${r.username} already exists (ID: ${existing.id})`);
    } else {
      const { error } = await supabaseAdmin.from('sys_users').insert(r);
      if (error) {
        console.error(`❌ Error creating ${r.username}:`, error);
      } else {
        console.log(`🎉 Created ${r.username} successfully!`);
      }
    }
  }
  console.log('✅ All done! You can now use these riders.');
}

createRiders();
