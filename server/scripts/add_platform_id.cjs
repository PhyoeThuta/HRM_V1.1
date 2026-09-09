const pg = require('pg');

const client = new pg.Client({
  host: 'db.kcswzfrwpvioaaizfpnk.supabase.co',
  port: 5432,
  user: 'postgres',
  password: 'PHYOEthuta123!@#',
  database: 'postgres',
});

async function run() {
  await client.connect();
  
  try {
    await client.query(`
      ALTER TABLE crm.customers ADD COLUMN IF NOT EXISTS platform_id VARCHAR(255);
    `);
    console.log('Successfully added platform_id to crm.customers');
  } catch (e) {
    console.error('Error adding platform_id:', e);
  }

  await client.end();
}
run().catch(console.error);
