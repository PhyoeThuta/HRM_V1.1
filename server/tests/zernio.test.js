import { get, post, test, expectStatus } from './api_tester.js';

export async function runZernioTests() {
  console.log('\n--- 🤖 RUNNING ZERNIO WEBHOOK TESTS ---');

  // Zernio webhooks are public (no JWT required) but require specific payload structures and sometimes signature verification.

  // 1. Missing payload / Invalid format
  await test('POST /api/crm/webhooks/zernio - Empty Payload', async () => {
    const res = await fetch('http://localhost:8080/api/crm/webhooks/zernio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
    });
    
    // Zernio webhook usually verifies 'hub.mode' for GET requests (challenge)
    // and expects a specific POST payload.
    // If it's an empty payload, it should not crash the server (500), it should handle it gracefully (400 or 200 with no action).
    if (res.status === 500) {
        throw new Error(`Webhook crashed on empty payload (Status 500)`);
    }
  });

  // 2. Invalid Signature (if implemented)
  await test('POST /api/crm/webhooks/zernio - Invalid Signature Check', async () => {
    const res = await fetch('http://localhost:8080/api/crm/webhooks/zernio', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'X-Hub-Signature': 'sha1=invalid_signature_hash' 
        },
        body: JSON.stringify({ entry: [{ messaging: [] }] })
    });
    
    // Expecting either 401/403 (if signature is checked) or 200/400 (if signature is ignored/missing logic)
    // We just want to ensure it doesn't 500.
    if (res.status === 500) {
        throw new Error(`Webhook crashed on invalid signature payload (Status 500)`);
    }
  });

  // 3. Documentation of limitation
  await test('POST /api/crm/webhooks/zernio - Valid Lead Injection (SKIPPED)', async () => {
    console.log('\n      [LIMITATION] Safely skipping full webhook lead injection.');
    console.log('      Executing this against a live DB will create false customer inquiries in the live CRM.');
  });
}
