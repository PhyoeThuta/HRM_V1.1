import dotenv from 'dotenv';
dotenv.config({path: './.env'});
import jwt from 'jsonwebtoken';

async function testApi() {
  try {
    const payload = {
      id: '1',
      username: 'admin',
      role: 'boss',
      full_name: 'Admin',
      employee_id: 'EMP-BOSS',
      must_change_password: false,
    };
    
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'fallback-secret-for-dev', { expiresIn: '1d' });

    const res = await fetch('http://localhost:8080/api/positions', {
      headers: {
        'Cookie': 'token=' + token
      }
    });

    console.log('Positions status:', res.status);
    const json = await res.json();
    const p1 = json.positions.find(p => p.emp_count === 1);
    
    console.log('--- API RESPONSE IN LIVE BACKEND ---');
    console.log('ID:', p1?.id);
    console.log('Title:', p1?.title);
    console.log('Emp Count:', p1?.emp_count);
    console.log('Staff Array is undefined?:', p1?.staff === undefined);
    console.log('Staff Array:', JSON.stringify(p1?.staff, null, 2));

  } catch (e) {
    console.error('Failed:', e.message);
  }
}

testApi();
