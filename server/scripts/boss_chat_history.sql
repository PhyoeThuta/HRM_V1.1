-- Create Chat Sessions Table
CREATE TABLE IF NOT EXISTS public.boss_chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.sys_users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'New Chat',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Chat Messages Table
CREATE TABLE IF NOT EXISTS public.boss_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.boss_chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.boss_chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boss_chat_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow all on boss_chat_sessions" ON public.boss_chat_sessions;
DROP POLICY IF EXISTS "Allow all on boss_chat_messages" ON public.boss_chat_messages;

-- Create policies for unrestricted internal access (Admin Dashboard)
CREATE POLICY "Allow all on boss_chat_sessions" ON public.boss_chat_sessions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on boss_chat_messages" ON public.boss_chat_messages FOR ALL USING (true) WITH CHECK (true);
