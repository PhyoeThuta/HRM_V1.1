import { supabaseAdmin } from '../lib/supabase.js';

async function addBotColumns() {
  console.log('Adding line_user_id and telegram_chat_id columns to users table...');
  
  // Since we don't have direct SQL execution privileges via the JS client for schema changes
  // on a hosted Supabase instance without RPC, we will output the SQL for the user to run
  // or use RPC if available.
  
  const sql = `
    ALTER TABLE public.users 
    ADD COLUMN IF NOT EXISTS line_user_id TEXT UNIQUE,
    ADD COLUMN IF NOT EXISTS telegram_chat_id TEXT UNIQUE,
    ADD COLUMN IF NOT EXISTS bot_linking_code TEXT UNIQUE;
    
    CREATE INDEX IF NOT EXISTS idx_users_line_user_id ON public.users(line_user_id);
    CREATE INDEX IF NOT EXISTS idx_users_telegram_chat_id ON public.users(telegram_chat_id);
    CREATE INDEX IF NOT EXISTS idx_users_bot_linking_code ON public.users(bot_linking_code);
  `;
  
  console.log('\n--- PLEASE RUN THIS SQL IN SUPABASE SQL EDITOR ---\n');
  console.log(sql);
  console.log('\n--------------------------------------------------\n');
}

addBotColumns().catch(console.error);
