import dotenv from 'dotenv';
dotenv.config({path: './.env'});
import { generateTestToken } from './tests/api_tester.js';

async function testApi() {
  const token = generateTestToken({ id: 1, role: 'admin' });
  const res = await fetch('http://localhost:8080/api/positions', {
    headers: { 'Authorization': 'Bearer ' + token }
  });
  const json = await res.json();
  const p1 = json.positions.find(p => p.emp_count === 1);
  const pMulti = json.positions.find(p => p.emp_count > 1);
  
  console.log('--- API VERIFICATION AFTER BACKEND RESTART ---');
  console.log('ID:', p1?.id);
  console.log('Title:', p1?.title);
  console.log('Emp Count:', p1?.emp_count);
  console.log('Staff Array:', JSON.stringify(p1?.staff, null, 2));

  console.log('\n--- MULTIPLE STAFF ---');
  console.log('Title:', pMulti?.title);
  console.log('Staff Array:', JSON.stringify(pMulti?.staff, null, 2));
}

testApi().catch(console.error);
