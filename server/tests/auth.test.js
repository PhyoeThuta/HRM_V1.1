import { get, post, test, expectStatus, generateTestToken } from './api_tester.js';

export async function runAuthTests() {
  console.log('\n--- 🔐 RUNNING AUTHENTICATION TESTS ---');

  // 1. Missing credentials
  await test('POST /api/auth/login - Missing credentials', async () => {
    const res = await post('/auth/login', {});
    expectStatus(res, 400); // Expecting Bad Request or similar
  });

  // 2. Invalid credentials
  await test('POST /api/auth/login - Invalid credentials', async () => {
    const res = await post('/auth/login', { username: 'invalid_user', password: 'wrongpassword' });
    expectStatus(res, 401); // Expecting Unauthorized
  });

  // 3. Unauthorized request (No Token)
  await test('GET /api/employees - No token (Unauthorized)', async () => {
    const res = await fetch('http://localhost:8080/api/employees', { method: 'GET' });
    if (res.status !== 401 && res.status !== 403) {
        throw new Error(`Expected 401/403 for missing token, got ${res.status}`);
    }
  });

  // 4. Authenticated request
  await test('GET /api/employees - Authenticated (Boss)', async () => {
    generateTestToken('boss');
    const res = await get('/employees');
    expectStatus(res, 200);
  });
}
