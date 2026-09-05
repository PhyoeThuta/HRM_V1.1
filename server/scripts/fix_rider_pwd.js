import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });
import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';
global.WebSocket = WebSocket;
const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
async function run() {
  await supabaseAdmin.from('sys_users').update({password_hash: 'MUST_CHANGE:$2a$10$LaMHwhQRi4fH4kbTH5KQGer/4G2fHGRjN//NM3bhoG4a2BYXvQJW.'}).in('username', ['rider01', 'rider02']);
  console.log('done fixing passwords');
}
run();
