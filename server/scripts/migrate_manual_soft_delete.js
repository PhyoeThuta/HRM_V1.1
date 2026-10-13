import { supabaseAdmin } from '../lib/supabase.js';

async function run() {
  try {
    console.log('Running manual soft delete migration...');
    // We will execute raw SQL to add columns if they don't exist
    const query = `
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'hrm_manual_articles' AND column_name = 'is_deleted') THEN
          ALTER TABLE hrm_manual_articles ADD COLUMN is_deleted BOOLEAN DEFAULT false;
          ALTER TABLE hrm_manual_articles ADD COLUMN deleted_at TIMESTAMPTZ;
          ALTER TABLE hrm_manual_articles ADD COLUMN deleted_by UUID REFERENCES sys_users(id);
        END IF;
      END $$;
    `;

    // Wait, running raw SQL directly might not be exposed on supabaseAdmin.
    // Let's use supabase rpc or if that doesn't exist, we'll try a fallback.
    // If rpc 'exec_sql' doesn't exist, we can create a function.
    // Since we don't know if exec_sql exists, we'll try using supabaseAdmin.rpc('exec_sql', { sql_query: query }).
    const { data, error } = await supabaseAdmin.rpc('exec_sql', { sql: query });
    if (error) {
      console.log('Error executing raw SQL via rpc:', error);
      console.log('Please run this SQL manually in the Supabase Dashboard SQL Editor:');
      console.log(query);
    } else {
      console.log('Migration successful!');
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
