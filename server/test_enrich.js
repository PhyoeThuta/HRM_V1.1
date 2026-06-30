import { supabase, dbFetch } from './lib/supabase.js';

async function testEnrich() {
  try {
     const [depts, positions] = await Promise.all([
       dbFetch('Departments', 'id,Department_name'),
       dbFetch('positions', 'id,title'),
     ]);
     console.log('Depts:', depts.length);
     console.log('Positions:', positions.length);
  } catch(e) {
     console.error('Error:', e);
  }
}
testEnrich();
