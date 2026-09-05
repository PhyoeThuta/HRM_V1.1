import fs from 'fs';
import pg from 'pg';
const { Client } = pg;
const client = new Client({ connectionString: 'postgresql://postgres:postgres@localhost:5432/postgres' });
async function run() {
  await client.connect();
  const sql = fs.readFileSync('scripts/add_rider_tracking.sql', 'utf8');
  await client.query(sql);
  console.log('Migration successful!');
  await client.end();
}
run().catch(console.error);
