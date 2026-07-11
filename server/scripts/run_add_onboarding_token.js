import fs from 'fs';
import { Client } from 'pg';

const sql = fs.readFileSync('./scripts/add_onboarding_token.sql', 'utf-8');
const c = new Client('postgresql://postgres:PHYOEthuta123!%40%23@db.kcswzfrwpvioaaizfpnk.supabase.co:5432/postgres');

c.connect()
  .then(() => c.query(sql))
  .then(() => console.log('Successfully added onboarding_token to crm.inquiries.'))
  .catch(err => console.error('Error altering table:', err))
  .finally(() => c.end());
