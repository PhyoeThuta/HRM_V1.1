import pg from 'pg';
const { Client } = pg;
const c = new Client('postgresql://postgres:PHYOEthuta123!%40%23@db.kcswzfrwpvioaaizfpnk.supabase.co:5432/postgres');
c.connect()
  .then(() => c.query(`UPDATE public."Employees" SET position_id = NULL WHERE "Full_name" = 'San Nyunt'`))
  .then(() => console.log("Reverted San Nyunt position to NULL"))
  .finally(() => c.end());
