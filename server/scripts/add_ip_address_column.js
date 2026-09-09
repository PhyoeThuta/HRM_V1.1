import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

async function addIpAddressColumn() {
  const connectionString = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
  
  if (!connectionString) {
    console.error('No DATABASE_URL or SUPABASE_DB_URL found in .env');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Connecting to database...');
    // Add column if it doesn't exist
    await pool.query(`
      ALTER TABLE sys_audit_logs 
      ADD COLUMN IF NOT EXISTS ip_address VARCHAR(45) DEFAULT '0.0.0.0';
    `);
    
    // Refresh PostgREST schema cache so the API immediately recognizes the new column
    await pool.query(`NOTIFY pgrst, 'reload schema'`);
    
    console.log('✅ Successfully added ip_address column to sys_audit_logs and reloaded schema cache.');
  } catch (err) {
    console.error('❌ Error executing schema change:', err);
  } finally {
    await pool.end();
  }
}

addIpAddressColumn();
