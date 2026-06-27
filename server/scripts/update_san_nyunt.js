import pg from 'pg';
const { Client } = pg;
const c = new Client('postgresql://postgres:PHYOEthuta123!%40%23@db.kcswzfrwpvioaaizfpnk.supabase.co:5432/postgres');
c.connect()
  .then(() => c.query(`UPDATE public."Employees" SET position_id = 'd20e4970-4dee-4001-bb0a-17085a845061', default_shift_id = NULL WHERE "Full_name" = 'San Nyunt'`))
  .then(() => console.log("Updated San Nyunt"))
  .finally(() => c.end());
