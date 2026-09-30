import { Client } from 'pg';

const sql = `
  ALTER TABLE "Employees" 
    ADD COLUMN IF NOT EXISTS employment_status VARCHAR(50) DEFAULT 'Active',
    ADD COLUMN IF NOT EXISTS resign_code VARCHAR(50) UNIQUE,
    ADD COLUMN IF NOT EXISTS resign_date DATE,
    ADD COLUMN IF NOT EXISTS resign_reason TEXT;

  -- Create a sequence for RES-XXXX generation
  CREATE SEQUENCE IF NOT EXISTS resign_code_seq START 1;
`;

const c = new Client('postgresql://postgres:PHYOEthuta123!%40%23@db.kcswzfrwpvioaaizfpnk.supabase.co:5432/postgres');

c.connect()
  .then(() => c.query(sql))
  .then(() => console.log('Resignation schema migration completed successfully.'))
  .catch(err => console.error('Error running migration:', err))
  .finally(() => c.end());
