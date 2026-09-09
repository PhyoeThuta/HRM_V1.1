import { generateTestToken, get, post, test, expectStatus } from './api_tester.js';

export async function runFailFastTests() {
  console.log('\n--- 🛑 RUNNING FAIL-FAST EDGE CASE TESTS ---');
  generateTestToken('boss');

  await test('POST /api/employees - Missing payload should fail cleanly (400 or 500)', async () => {
    // Send an empty object to trigger a DB/validation failure
    const res = await post('/employees', {});
    
    // It should NO LONGER return 200 { success: true } if DB fails!
    if (res.status === 200) {
      throw new Error(`System soft-failed! Expected 400 or 500 but got 200: ${JSON.stringify(res.data)}`);
    }
  });

  await test('POST /api/overtime/request - Missing start_time/end_time (400)', async () => {
    // We fixed the parsing error swallow in overtime.js
    const res = await post('/overtime/request', { employee_id: 1, ot_date: '2026-09-08' });
    if (res.status === 200) {
      throw new Error('Overtime accepted invalid request. It should have failed-fast.');
    }
  });

  await test('GET /api/daily-feedback/INVALID_ID - Non-existent ID returns 404 or 400, not 200', async () => {
    const res = await get('/daily-feedback/99999?date=2026-09-08');
    if (res.status === 200) {
      throw new Error('Expected failure for invalid customer ID, but got 200.');
    }
  });
}
