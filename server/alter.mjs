import dotenv from 'dotenv';
dotenv.config();
import pg from 'pg';
const { Client } = pg;
const client = new Client({ connectionString: process.env.DATABASE_URL });
client.connect().then(() => client.query('ALTER TABLE operations_orders ADD COLUMN IF NOT EXISTS custom_delivery_address TEXT;')).then(() => { console.log('success'); client.end(); }).catch(e => { console.error(e); process.exit(1); });
