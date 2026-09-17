import { Client } from 'pg';

const c = new Client({
  connectionString: 'postgresql://postgres:PHYOEthuta123!%40%23@db.kcswzfrwpvioaaizfpnk.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    await c.connect();
    console.log('Connected to PostgreSQL database with SSL...');
    await c.query('ALTER TABLE crm.customers ADD COLUMN IF NOT EXISTS delivery_spot_photo_url TEXT;');
    console.log('Successfully added delivery_spot_photo_url column to crm.customers!');
  } catch (err) {
    console.error('Error adding column:', err);
  } finally {
    await c.end();
  }
}

run();
