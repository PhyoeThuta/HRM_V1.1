-- 1. Grant usage on the schemas to the API roles
GRANT USAGE ON SCHEMA operations TO anon, authenticated, service_role;
GRANT USAGE ON SCHEMA inventory TO anon, authenticated, service_role;

-- 2. Grant ALL privileges on all tables in these schemas
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA operations TO anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA inventory TO anon, authenticated, service_role;

-- 3. Grant ALL privileges on all sequences (if any)
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA operations TO anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA inventory TO anon, authenticated, service_role;

-- 4. Expose the schemas to PostgREST (Supabase API)
ALTER ROLE authenticator SET pgrst.db_extra_search_path TO public, extensions, crm, operations, inventory;
NOTIFY pgrst, 'reload schema';
