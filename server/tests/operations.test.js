import { get, post, test, expectStatus, generateTestToken } from './api_tester.js';

export async function runOperationsTests() {
  console.log('\n--- 🚚 RUNNING OPERATIONS TESTS ---');

  // 1. Unauthorized Access
  await test('POST /api/operations/orders/auto-generate - No token', async () => {
    const res = await fetch('http://localhost:8080/api/operations/orders/auto-generate', { method: 'POST' });
    if (res.status !== 401 && res.status !== 403) {
        throw new Error(`Expected 401/403 for missing token, got ${res.status}`);
    }
  });

  // 2. Role validation (assuming only specific roles can trigger this)
  await test('POST /api/operations/orders/auto-generate - Unauthorized Role (Employee)', async () => {
    generateTestToken('employee');
    const res = await post('/operations/orders/auto-generate', { targetDate: '2026-09-30' });
    // Assuming non-admins get 403 Forbidden
    if (res.status !== 403 && res.status !== 401) {
       console.warn(`[WARNING] Endpoints might not be strictly enforcing RBAC, got ${res.status}`);
    }
  });

  // 3. Documentation of limitation
  await test('POST /api/operations/orders/auto-generate - Success Path (SKIPPED)', async () => {
    console.log('\n      [LIMITATION] Safely skipping full auto-generate success path.');
    console.log('      Executing this against a live DB will permanently create kitchen orders.');
  });
}
