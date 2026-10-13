import { supabaseAdmin } from '../lib/supabase.js';

async function checkTables() {
  const tables = [
    'hrm_manual_categories',
    'hrm_manual_articles',
    'hrm_manual_versions',
    'hrm_manual_permissions'
  ];

  for (const table of tables) {
    const { data, error } = await supabaseAdmin.from(table).select('id').limit(1);
    if (error) {
      console.log(`Table ${table} check failed:`, error.message);
    } else {
      console.log(`Table ${table} exists.`);
    }
  }
}

checkTables();
