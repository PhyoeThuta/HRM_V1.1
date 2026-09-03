const fs = require('fs');
const dotenv = require('dotenv');
const path = require('path');
const pg = require('pg');

const env = dotenv.parse(fs.readFileSync(path.resolve(__dirname, '.env')));
const client = new pg.Client({
  connectionString: 'postgresql://postgres:PHYOEthuta123!%40%23@db.kcswzfrwpvioaaizfpnk.supabase.co:5432/postgres'
});

async function run() {
  await client.connect();
  
  // 1. operations.menu_plans
  await client.query(`
    CREATE TABLE IF NOT EXISTS operations_menu_plans (
      id SERIAL PRIMARY KEY,
      date DATE NOT NULL,
      main_dish_1 VARCHAR(255),
      main_dish_2 VARCHAR(255),
      side_dish_1 VARCHAR(255),
      side_dish_2 VARCHAR(255),
      soup VARCHAR(255),
      dessert VARCHAR(255),
      has_rice VARCHAR(50),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(date)
    );
  `);
  console.log('Created operations_menu_plans');

  // 2. crm.menu_feedbacks
  await client.query(`
    CREATE TABLE IF NOT EXISTS crm_menu_feedbacks (
      id SERIAL PRIMARY KEY,
      customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
      week_name VARCHAR(255) NOT NULL,
      ratings_json JSONB NOT NULL DEFAULT '{}'::jsonb,
      best_pick VARCHAR(255),
      worst_pick VARCHAR(255),
      comment TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  console.log('Created crm_menu_feedbacks');

  await client.end();
}
run().catch(console.error);
