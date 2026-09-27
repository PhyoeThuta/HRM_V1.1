import dotenv from 'dotenv';
dotenv.config({path: './.env'});

async function testApi() {
  try {
    const loginRes = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: process.env.TEST_EMPLOYEE_ID_ADMIN || 'EMP-BOSS',
        password: process.env.TEST_EMPLOYEE_PASSWORD_ADMIN || 'bbd2024'
      })
    });
    
    console.log('Login status:', loginRes.status);
    const cookie = loginRes.headers.get('set-cookie');
    
    const res = await fetch('http://localhost:8080/api/positions', {
      headers: {
        'Cookie': cookie
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
