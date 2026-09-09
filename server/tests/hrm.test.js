import { generateTestToken, get, post, test, expectStatus } from './api_tester.js';

export async function runHrmTests() {
  console.log('\n--- 🧑‍💼 RUNNING HRM MODULE TESTS ---');
  generateTestToken('boss'); // Login as boss

  await test('GET /api/employees - Fetch all employees', async () => {
    const res = await get('/employees');
    expectStatus(res, 200);
    if (!res.data || (!Array.isArray(res.data) && !Array.isArray(res.data.employees))) throw new Error('Expected array of employees');
  });

  await test('GET /api/attendance - Fetch attendance records', async () => {
    const res = await get('/attendance');
    expectStatus(res, 200);
    if (!res.data || (!Array.isArray(res.data) && !Array.isArray(res.data.records))) throw new Error('Expected array of attendance records');
  });

  await test('GET /api/leave - Fetch leave records', async () => {
    const res = await get('/leave');
    expectStatus(res, 200);
  });

  await test('GET /api/payroll/engine/generate-preview - Generate payroll preview for a month', async () => {
    // Generate for the current month
    const d = new Date();
    const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const res = await get(`/payroll/engine/generate-preview?month=${monthStr}`);
    
    // We expect 200 if setup is correct, or maybe a 400/404 if data is missing, but definitely NOT 500!
    if (res.status === 500) {
      throw new Error(`Payroll engine crashed (500). Fail-fast logic might have thrown: ${JSON.stringify(res.data)}`);
    }
  });
}
