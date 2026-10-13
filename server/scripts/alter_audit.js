import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });const { Pool } = pg;

async function alter() {
  const connectionString = 'postgresql://postgres:PHYOEthuta123!%40%23@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?options=reference%3Dkcswzfrwpvioaaizfpnk';
  const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });
  try {
    await pool.query(`
      ALTER TABLE sys_audit_logs 
      ADD COLUMN IF NOT EXISTS user_name VARCHAR(255),
      ADD COLUMN IF NOT EXISTS user_role VARCHAR(100),
      ADD COLUMN IF NOT EXISTS device_type VARCHAR(100),
      ADD COLUMN IF NOT EXISTS os VARCHAR(100),
      ADD COLUMN IF NOT EXISTS browser VARCHAR(100),
      ADD COLUMN IF NOT EXISTS user_agent TEXT;
    `);
    await pool.query(`NOTIFY pgrst, 'reload schema'`);
    console.log('✅ Altered sys_audit_logs');
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

alter();
