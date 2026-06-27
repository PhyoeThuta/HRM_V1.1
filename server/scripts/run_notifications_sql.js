import fs from 'fs';
import { Client } from 'pg';

const sql = fs.readFileSync('./scripts/create_notifications_table.sql', 'utf-8');
const c = new Client('postgresql://postgres:PHYOEthuta123!%40%23@db.kcswzfrwpvioaaizfpnk.supabase.co:5432/postgres');

c.connect()
  .then(() => c.query(sql))
  .then(() => console.log('Notifications table created successfully.'))
  .catch(err => console.error('Error creating table:', err))
  .finally(() => c.end());
