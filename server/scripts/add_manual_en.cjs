const fs = require('fs');
const dotenv = require('dotenv');
const path = require('path');
const pg = require('pg');

const env = dotenv.parse(fs.readFileSync(path.resolve(__dirname, '../.env')));
const client = new pg.Client({
  connectionString: 'postgresql://postgres:PHYOEthuta123!%40%23@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres'
});

async function run() {
  try {
    await client.connect();
    
    console.log('Adding English translation columns to HRM Manual tables...');
    
    await client.query(`
      ALTER TABLE hrm_manual_articles 
      ADD COLUMN IF NOT EXISTS draft_content_en TEXT,
      ADD COLUMN IF NOT EXISTS published_content_en TEXT;
      
      ALTER TABLE hrm_manual_versions
      ADD COLUMN IF NOT EXISTS content_en TEXT;
    `);

    console.log('Columns added successfully.');
  } catch (err) {
    console.error('Error running migration:', err);
  } finally {
    await client.end();
  }
}

run();
