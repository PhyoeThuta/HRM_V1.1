import { supabase } from '../lib/supabase.js';

async function run() {
  const sql = `
    CREATE TABLE IF NOT EXISTS kpi_settings (
      id SERIAL PRIMARY KEY,
      settings JSONB NOT NULL
    );
    INSERT INTO kpi_settings (id, settings) 
    VALUES (1, '{"target_bonus_percentage": 15, "auto_weights": {"attendance": 40, "punctuality": 0, "sops": 40, "peer_voting": 20}, "manual_metrics": []}') 
    ON CONFLICT (id) DO NOTHING;
  `;
  const { error } = await supabase.rpc('execute_sql', { sql });
  console.log(error || 'Table created');
}

run().catch(console.error);
