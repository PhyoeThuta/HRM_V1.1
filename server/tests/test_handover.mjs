
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), 'server', '.env') });

function login(employeeId) {
  const payload = {
    id: '999999',
    role: 'boss',
    email: 'boss@test.com',
    employee_id: employeeId || '999999'
  };
  return jwt.sign(payload, process.env.JWT_SECRET || 'secret123', { expiresIn: '1h' });
}

async function runTest(name, url, method = 'GET', body = null, token) {
  process.stdout.write(`⏳ RUNNING: ${name}... `);
  try {
    const opts = { method, headers: { Cookie: `token=${token}`, 'Content-Type': 'application/json' } };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(`http://localhost:8080${url}`, opts);
    if (!res.ok) {
        const text = await res.text();
        console.log(`❌ FAIL (${res.status}) ${text}`);
        return false;
    }
    console.log(`✅ PASS`);
    return true;
  } catch (err) {
    console.log(`❌ ERROR ${err.message}`);
    return false;
  }
}

async function main() {
  // Fetch an employee ID first using a dummy admin token
  const dummyToken = login(null);
  const empRes = await fetch('http://localhost:8080/api/employees', { headers: { Cookie: `token=${dummyToken}` }});
  const emps = await empRes.json();
  const empId = emps[0]?.id;
  
  if (!empId) {
      console.log('Failed to fetch employees');
      return;
  }
  
  const token = login(empId);
  
  await runTest('GET /api/handover', '/api/handover', 'GET', null, token);
  await runTest('GET portal outgoing', '/api/handover/portal/outgoing', 'GET', null, token);
  await runTest('GET portal incoming', '/api/handover/portal/incoming', 'GET', null, token);
  
  if (empId) {
      console.log('Got employee ID:', empId);
      const obRes = await fetch('http://localhost:8080/api/lifecycle/offboarding', {
          method: 'POST',
          headers: { Cookie: `token=${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ employee_id: empId, reason: 'test' })
      });
      const obData = await obRes.json();
      if (obData.offboarding) {
          const offboardingId = obData.offboarding.id;
          await runTest('GET handover for offboarding', `/api/handover/offboarding/${offboardingId}`, 'GET', null, token);
          
          const hRes = await fetch(`http://localhost:8080/api/handover/offboarding/${offboardingId}`, { headers: { Cookie: `token=${token}` }});
          const hData = await hRes.json();
          const hId = hData.handover?.id;
          
          if (hId) {
              await runTest('GET /api/handover/:id', `/api/handover/${hId}`, 'GET', null, token);
              await runTest('PUT /api/handover/:id/successor', `/api/handover/${hId}/successor`, 'PUT', { successor_employee_id: emps[1]?.id }, token);
              
              if (hData.items?.length > 0) {
                  const itemId = hData.items[0].id;
                  await runTest('PUT /api/handover/:id/items/:itemId', `/api/handover/${hId}/items/${itemId}`, 'PUT', { status: 'done' }, token);
                  await runTest('POST /api/handover/:id/items/:itemId/acknowledge', `/api/handover/${hId}/items/${itemId}/acknowledge`, 'POST', null, token);
              }
              
              await runTest('POST /api/handover/:id/submit (should fail due to incomplete items, but route works)', `/api/handover/${hId}/submit`, 'POST', null, token);
          }
      }
  }
}

main().catch(console.error);
