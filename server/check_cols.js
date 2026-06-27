import pg from 'pg';
const { Client } = pg;
const c = new Client('postgresql://postgres:PHYOEthuta123!%40%23@db.kcswzfrwpvioaaizfpnk.supabase.co:5432/postgres');
c.connect().then(()=>c.query('SELECT * FROM public."Employees" LIMIT 1')).then(r=>{console.log(Object.keys(r.rows[0]));}).finally(()=>c.end());
