import { generateTestToken, get, post, test, expectStatus } from './api_tester.js';

export async function runCrmOpsTests() {
  console.log('\n--- 🤝 RUNNING CRM & OPS MODULE TESTS ---');
  generateTestToken('boss');

  await test('GET /api/crm/customers - Fetch all customers', async () => {
    const res = await get('/crm/customers');
    expectStatus(res, 200);
  });

  await test('GET /api/crm/packages - Fetch active packages', async () => {
    const res = await get('/crm/packages');
    expectStatus(res, 200);
  });

  await test('GET /api/operations/daily-menus - Fetch daily menus', async () => {
    const res = await get('/operations/daily-menus');
    expectStatus(res, 200);
  });

  await test('GET /api/operations/orders - Fetch operations orders', async () => {
    const d = new Date().toISOString().split('T')[0];
    const res = await get(`/operations/orders`);
    expectStatus(res, 200);
  });

  await test('GET /api/inventory/items - Fetch inventory items', async () => {
    const res = await get('/inventory/items');
    expectStatus(res, 200);
  });
}
