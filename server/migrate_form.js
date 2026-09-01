import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
});

async function run() {
  const client = await pool.connect();
  try {
    const sql = `
      CREATE TABLE IF NOT EXISTS crm.form_settings (
        id SERIAL PRIMARY KEY,
        form_name TEXT UNIQUE NOT NULL,
        schema JSONB NOT NULL DEFAULT '[]',
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      INSERT INTO crm.form_settings (form_name, schema) 
      VALUES ('enrollment', '[
        { "id": "name", "type": "text", "label": "Full Name", "required": true },
        { "id": "phone", "type": "text", "label": "Phone Number", "required": true },
        { "id": "age", "type": "number", "label": "Age", "required": true },
        { "id": "weight", "type": "number", "label": "Weight (kg)", "required": true },
        { "id": "height", "type": "number", "label": "Height (cm)", "required": true },
        { "id": "allergies", "type": "text", "label": "Food Allergies / Dislikes", "required": false },
        { "id": "activity_level", "type": "dropdown", "label": "Activity Level", "options": ["Low", "Medium", "High"], "required": true }
      ]') ON CONFLICT (form_name) DO NOTHING;

      ALTER TABLE crm.inquiries ADD COLUMN IF NOT EXISTS onboarding_token UUID DEFAULT gen_random_uuid();
      ALTER TABLE crm.inquiries ADD COLUMN IF NOT EXISTS onboarding_status TEXT DEFAULT 'pending';
      ALTER TABLE crm.inquiries ADD COLUMN IF NOT EXISTS selected_package JSONB;
    `;
    await client.query(sql);
    console.log('Migration successful');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    client.release();
    pool.end();
  }
}

run();
