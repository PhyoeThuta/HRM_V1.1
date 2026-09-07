import pg from 'pg';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL
});

async function run() {
  try {
    await client.connect();
    const sql = fs.readFileSync('./scripts/add_daily_feedbacks.sql', 'utf8');
    await client.query(sql);
    console.log('Success! Table created.');
    await client.end();
  } catch (err) {
    console.error('Error running script:', err);
    await client.end();
  }
}

run();
