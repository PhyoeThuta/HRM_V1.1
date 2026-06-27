import pg from 'pg';
const { Client } = pg;
const c = new Client('postgresql://postgres:PHYOEthuta123!%40%23@db.kcswzfrwpvioaaizfpnk.supabase.co:5432/postgres');
c.connect().then(()=>c.query('SELECT e."Full_name", p.title as pos_title FROM public."Employees" e LEFT JOIN public.positions p ON e.position_id = p.id')).then(r=>{console.log(r.rows);}).finally(()=>c.end());
