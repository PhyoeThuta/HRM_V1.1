-- 1. Enable pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Create the unified knowledge base table
CREATE TABLE IF NOT EXISTS public.ai_knowledge_base (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_table TEXT NOT NULL,          -- e.g. 'crm.customers'
    source_id TEXT NOT NULL,             -- ID of the original record
    content TEXT NOT NULL,               -- The text representation for the AI
    embedding vector(768),               -- Gemini models use 768 dimensions
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (source_table, source_id)
);

-- 3. Enable RLS but allow service_role to bypass
ALTER TABLE public.ai_knowledge_base ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all on ai_knowledge_base" ON public.ai_knowledge_base;
CREATE POLICY "Allow all on ai_knowledge_base" ON public.ai_knowledge_base FOR ALL USING (true) WITH CHECK (true);

-- 4. Create the match function for semantic search
-- Drop it first in case it already exists with a different signature
DROP FUNCTION IF EXISTS public.match_knowledge;

CREATE OR REPLACE FUNCTION public.match_knowledge(
    query_embedding vector(768),
    match_threshold float,
    match_count int
)
RETURNS TABLE (
    id UUID,
    source_table TEXT,
    source_id TEXT,
    content TEXT,
    similarity float
)
LANGUAGE sql STABLE
AS $$
    SELECT
        ai_knowledge_base.id,
        ai_knowledge_base.source_table,
        ai_knowledge_base.source_id,
        ai_knowledge_base.content,
        1 - (ai_knowledge_base.embedding <=> query_embedding) AS similarity
    FROM
        public.ai_knowledge_base
    WHERE
        1 - (ai_knowledge_base.embedding <=> query_embedding) > match_threshold
    ORDER BY
        ai_knowledge_base.embedding <=> query_embedding
    LIMIT match_count;
$$;
