import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const errors = [];
  const networkErrors = [];

  page.on('pageerror', (err) => {
    errors.push({ type: 'pageerror', url: page.url(), message: err.toString() });
  });

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push({ type: 'console', url: page.url(), message: msg.text() });
    }
  });

  page.on('response', async (response) => {
    if (!response.ok() && response.status() >= 400 && response.url().includes('localhost')) {
      networkErrors.push({ url: response.url(), status: response.status() });
    }
  });

  console.log('Navigating to login...');
  await page.goto('http://localhost:5174/login', { waitUntil: 'networkidle0' });
  
  // Login
  try {
    await page.type('input[type="text"]', 'admin@bbd.com');
    await page.type('input[type="password"]', 'password123'); // assuming standard login
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    console.log('Logged in successfully!');
  } catch(e) {
    console.log('Login failed', e.message);
  }

  const routes = [
    '/employees',
    '/employees/new',
    // We can't know ID easily without API, let's just visit main pages
    '/attendance',
    '/leave',
    '/payroll',
    '/recruitment',
    '/user-accounts',
    '/dashboard',
    '/portal',
    '/user-manual',
    '/documents',
    '/boss-dashboard',
    '/boss-kpi',
    '/careers',
    '/org-chart',
    '/offboarding',
    '/sops',
    '/positions',
  ];

  for (let r of routes) {
    console.log(`Testing ${r}...`);
    try {
      await page.goto(`http://localhost:5174${r}`, { waitUntil: 'networkidle0', timeout: 5000 });
      // wait a bit for any react rendering errors to trigger
      await new Promise(r => setTimeout(r, 1000));
    } catch(e) {
      console.log(`Failed to load ${r}:`, e.message);
    }
  }

  console.log('\n--- RESULTS ---');
  console.log('Errors:', JSON.stringify(errors, null, 2));
  console.log('Network Errors:', JSON.stringify(networkErrors, null, 2));
  await browser.close();
})();
