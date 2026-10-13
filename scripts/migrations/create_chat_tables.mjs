import dotenv from 'dotenv';
dotenv.config({ path: './server/.env' });
import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function createChatTables() {
  const sql = `
    CREATE TABLE IF NOT EXISTS public.boss_chat_sessions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES public.sys_users(id) ON DELETE CASCADE,
      title TEXT NOT NULL DEFAULT 'New Chat',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS public.boss_chat_messages (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      session_id UUID REFERENCES public.boss_chat_sessions(id) ON DELETE CASCADE,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    ALTER TABLE public.boss_chat_sessions ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.boss_chat_messages ENABLE ROW LEVEL SECURITY;
    
    DROP POLICY IF EXISTS "Allow all on boss_chat_sessions" ON public.boss_chat_sessions;
    DROP POLICY IF EXISTS "Allow all on boss_chat_messages" ON public.boss_chat_messages;

    CREATE POLICY "Allow all on boss_chat_sessions" ON public.boss_chat_sessions FOR ALL USING (true) WITH CHECK (true);
    CREATE POLICY "Allow all on boss_chat_messages" ON public.boss_chat_messages FOR ALL USING (true) WITH CHECK (true);
  `;

  try {
    console.log("Running migration...");
    await pool.query(sql);
    console.log("Migration successful!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await pool.end();
  }
}

createChatTables();
