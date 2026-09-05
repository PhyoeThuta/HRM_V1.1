import { Client } from 'pg';

const sql = `
  ALTER TABLE operations_orders ADD COLUMN IF NOT EXISTS rider_id BIGINT;
  ALTER TABLE operations_orders ADD COLUMN IF NOT EXISTS picked_up_at TIMESTAMP WITH TIME ZONE;
  
  -- Ensure that rider_id has a foreign key to the users table
  DO $$
  BEGIN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name = 'operations_orders_rider_id_fkey'
    ) THEN
      ALTER TABLE operations_orders 
      ADD CONSTRAINT operations_orders_rider_id_fkey 
      FOREIGN KEY (rider_id) REFERENCES users(id) ON DELETE SET NULL;
    END IF;
  END $$;
`;

const c = new Client('postgresql://postgres:PHYOEthuta123!%40%23@db.kcswzfrwpvioaaizfpnk.supabase.co:5432/postgres');

c.connect()
  .then(() => c.query(sql))
  .then(() => console.log('Multi-rider schema migration completed successfully.'))
  .catch(err => console.error('Error running migration:', err))
  .finally(() => c.end());
