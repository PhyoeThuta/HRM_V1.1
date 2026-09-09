import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from the server folder
dotenv.config({ path: path.resolve(process.cwd(), 'server', '.env') });

const PORT = process.env.PORT || 8080;
const BASE_URL = `http://localhost:${PORT}/api`;

let jwtToken = '';

export function generateTestToken(role = 'boss') {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is missing. Make sure .env is loaded.');
  }
  // Create a mock token for a boss to bypass login
  const payload = {
    id: 9999, // Dummy user ID
    username: 'qatest',
    role: role,
    full_name: 'QA Automation Bot',
    employee_id: 9999
  };
  jwtToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  return jwtToken;
}

export async function get(endpoint) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${jwtToken}` }
  });
  const data = await res.json().catch(() => null);
  return { status: res.status, ok: res.ok, data };
}

export async function post(endpoint, body) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${jwtToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  const data = await res.json().catch(() => null);
  return { status: res.status, ok: res.ok, data };
}

let passed = 0;
let failed = 0;

export async function test(name, fn) {
  try {
    process.stdout.write(`⏳ RUNNING: ${name}... `);
    await fn();
    console.log(`\x1b[32m✅ PASS\x1b[0m`);
    passed++;
  } catch (error) {
    console.log(`\x1b[31m❌ FAIL\x1b[0m`);
    console.log(`   └─ \x1b[31m${error.message}\x1b[0m`);
    failed++;
  }
}

export function expectStatus(response, expectedStatus) {
  if (response.status !== expectedStatus) {
    throw new Error(`Expected status ${expectedStatus}, but got ${response.status}. Data: ${JSON.stringify(response.data)}`);
  }
}

export function printSummary() {
  console.log('\n=======================================');
  console.log('🧪 TEST SUMMARY');
  console.log('=======================================');
  console.log(`Total: ${passed + failed}`);
  console.log(`\x1b[32mPassed: ${passed}\x1b[0m`);
  console.log(`\x1b[31mFailed: ${failed}\x1b[0m`);
  
  if (failed > 0) {
    console.log('\n\x1b[31m⚠️  Some tests failed. Fail-Fast system is rejecting bad state, OR there is a critical bug.\x1b[0m');
  } else {
    console.log('\n\x1b[32m🎉 All tests passed perfectly!\x1b[0m');
  }
}
