import fs from 'fs';
import { Client } from 'pg';

const sql = fs.readFileSync('./scripts/add_deleted_at_to_employees.sql', 'utf-8');
const c = new Client('postgresql://postgres:PHYOEthuta123!%40%23@db.kcswzfrwpvioaaizfpnk.supabase.co:5432/postgres');

c.connect()
  .then(() => c.query(sql))
  .then(() => console.log('added deleted_at to Employees successfully.'))
  .catch(err => console.error('Error:', err))
  .finally(() => c.end());
