import dotenv from 'dotenv';
dotenv.config({path: './.env'});
import { test } from './tests/api_tester.js';
import axios from 'axios';

async function testApi() {
  try {
    const loginRes = await axios.post('http://localhost:8080/api/auth/login', {
      employee_id: process.env.TEST_EMPLOYEE_ID_ADMIN || 'EMP-BOSS',
      password: process.env.TEST_EMPLOYEE_PASSWORD_ADMIN || 'bbd2024'
    });
    
    const cookie = loginRes.headers['set-cookie'];
    
    const res = await axios.get('http://localhost:8080/api/positions', {
      headers: {
        'Cookie': cookie
      }
    });

    const json = res.data;
    const p1 = json.positions.find(p => p.emp_count === 1);
    
    console.log('--- API RESPONSE IN LIVE BACKEND ---');
    console.log('ID:', p1?.id);
    console.log('Title:', p1?.title);
    console.log('Emp Count:', p1?.emp_count);
    console.log('Staff Array is undefined?:', p1?.staff === undefined);
    console.log('Staff Array:', JSON.stringify(p1?.staff, null, 2));

  } catch (e) {
    console.error('Failed:', e.response?.data || e.message);
  }
}

testApi();
