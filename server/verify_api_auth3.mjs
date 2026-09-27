import dotenv from 'dotenv';
dotenv.config({path: './.env'});

async function testApi() {
  try {
    const loginRes = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        employee_id: process.env.TEST_EMPLOYEE_ID_ADMIN || 'EMP-BOSS',
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
    console.log('JSON returned:', JSON.stringify(json).slice(0, 500));
  } catch (e) {
    console.error('Failed:', e.message);
  }
}

testApi();
