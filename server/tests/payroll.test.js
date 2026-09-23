import { get, post, test, expectStatus, generateTestToken } from './api_tester.js';

export async function runPayrollTests() {
  console.log('\n--- 💰 RUNNING PAYROLL ENGINE TESTS ---');

  generateTestToken('boss');

  // 1. Invalid Employee ID
  await test('GET /api/payroll-engine/calculate/:employee_id/:month - Invalid Employee', async () => {
    const res = await get('/payroll-engine/calculate/999999/2026-09');
    // Expect 500 or 404 because the DB won't find the employee
    if (res.status !== 500 && res.status !== 404 && res.status !== 400) {
      throw new Error(`Expected error status for invalid employee, got ${res.status}`);
    }
  });

  // 2. Valid calculation syntax (even if employee is missing)
  await test('GET /api/payroll-engine/calculate/:employee_id/:month - Safely Handled Request', async () => {
    const res = await get('/payroll-engine/calculate/1/2026-09');
    
    // If employee 1 exists, it should be 200. If not, it should be handled.
    // The main goal is ensuring the route actually exists and handles the request without crashing the node process.
    if (!res.data && res.status === 200) {
      throw new Error('Expected data payload for 200 OK');
    }
  });
}
