import puppeteer from 'puppeteer';

const results = [];
const errors = [];
const apiResponses = {};
let browser;

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function run() {
  console.log("Starting Puppeteer Smoke Test...");
  browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  // Intercept and record network requests/responses
  await page.setRequestInterception(true);
  page.on('request', req => {
    req.continue();
  });
  
  page.on('response', async res => {
    const url = res.url();
    const status = res.status();
    if (url.includes('/api/') && res.request().method() !== 'OPTIONS') {
      try {
        let text = await res.text();
        let body = text;
        try { body = JSON.parse(text); } catch(e) {}
        apiResponses[url] = { status, body };
        if (status >= 400) {
          console.error(`API ERROR: ${status} on ${url}`);
        }
      } catch (e) {
        // failed to read body, ignore
      }
    }
  });

  page.on('console', msg => {
    const text = msg.text();
    if (msg.type() === 'error' && !text.includes('favicon')) {
      errors.push({ type: 'CONSOLE_ERROR', url: page.url(), message: text });
    }
  });

  page.on('pageerror', err => {
    errors.push({ type: 'PAGE_ERROR', url: page.url(), message: err.toString() });
  });

  try {
    // 1. Set Cookie and Reload
    console.log("1. Setting auth cookie...");
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle2' });
    await page.setCookie({
      name: 'accessToken',
      value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTk5OSwidXNlcm5hbWUiOiJib3NzIiwicm9sZSI6ImJvc3MiLCJpYXQiOjE3OTAwOTUyMDQsImV4cCI6MTc5MDEzODQwNH0.QN4syMEc1F1i0fJGjjB1PS4H-cHYLxAPadpqM_kA-FQ',
      domain: 'localhost',
      path: '/'
    });
    // some apps use 'token'
    await page.setCookie({
      name: 'token',
      value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTk5OSwidXNlcm5hbWUiOiJib3NzIiwicm9sZSI6ImJvc3MiLCJpYXQiOjE3OTAwOTUyMDQsImV4cCI6MTc5MDEzODQwNH0.QN4syMEc1F1i0fJGjjB1PS4H-cHYLxAPadpqM_kA-FQ',
      domain: 'localhost',
      path: '/'
    });
    // set in localStorage as well just in case
    await page.evaluate(() => {
      localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTk5OSwidXNlcm5hbWUiOiJib3NzIiwicm9sZSI6ImJvc3MiLCJpYXQiOjE3OTAwOTUyMDQsImV4cCI6MTc5MDEzODQwNH0.QN4syMEc1F1i0fJGjjB1PS4H-cHYLxAPadpqM_kA-FQ');
    });

    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
    await sleep(1000);

    // 2. CRM Dashboard
    console.log("2. Navigating to CRM Dashboard...");
    await page.goto('http://localhost:5173/crm/dashboard', { waitUntil: 'networkidle2' });
    await sleep(2000);

    // 3. Customer List
    console.log("3. Navigating to Customer List...");
    await page.goto('http://localhost:5173/crm/customers', { waitUntil: 'networkidle2' });
    await sleep(2000);

    // 4. Enrollment UI
    console.log("4. Navigating to Enrollment...");
    await page.goto('http://localhost:5173/crm/enrollment', { waitUntil: 'networkidle2' });
    await sleep(2000);
    
    // 5. Operations
    console.log("5. Navigating to Operations...");
    await page.goto('http://localhost:5173/operations/dashboard', { waitUntil: 'networkidle2' });
    await sleep(2000);
    
    console.log("6. Operations Daily Menus...");
    await page.goto('http://localhost:5173/operations/daily-menus', { waitUntil: 'networkidle2' });
    await sleep(2000);

    console.log("7. Public Welcome Dossier...");
    await page.goto('http://localhost:5173/welcome/4', { waitUntil: 'networkidle2' });
    await sleep(2000);

    console.log("8. Public Enrollment Form...");
    await page.goto('http://localhost:5173/enroll', { waitUntil: 'networkidle2' });
    await sleep(2000);

  } catch (err) {
    console.error("FATAL ERROR IN SCRIPT:", err);
  } finally {
    await browser.close();
    console.log("TEST COMPLETE");
    console.log("ERRORS:", JSON.stringify(errors, null, 2));
    console.log("API RESPONSES (Summary):", JSON.stringify(
      Object.keys(apiResponses).reduce((acc, url) => {
        acc[url] = { status: apiResponses[url].status };
        return acc;
      }, {}), null, 2
    ));
  }
}

run();
