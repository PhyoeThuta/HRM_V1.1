import puppeteer from 'puppeteer';

(async () => {
  console.log('Verifying /positions...');
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  await page.setRequestInterception(true);
  page.on('request', request => {
    if (request.url().includes('/api/positions/facebook-connection')) {
      request.respond({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ configured: true, provider: 'zernio' })
      });
    } else if (request.url().includes('/api/positions')) {
      request.respond({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          positions: [
            { id: 1, title: 'Corporate Officer', level: 'Executive', base_salary: 50000, emp_count: 2 },
            { id: 2, title: 'Head Chef', level: 'Manager', base_salary: 30000, emp_count: 5 },
            { id: 3, title: 'Video Content Creator', level: 'Mid', base_salary: 15000, emp_count: 1 },
          ]
        })
      });
    } else {
      request.continue();
    }
  });

  const switchLang = async (lang) => {
    await page.evaluate((l) => { localStorage.setItem('language', l); }, lang);
    await page.reload({ waitUntil: 'networkidle0' });
  };

  try {
    await page.goto('http://localhost:5174/', { waitUntil: 'networkidle0' });
    await page.evaluate(() => {
      localStorage.setItem('token', 'fake-jwt');
      localStorage.setItem('user', JSON.stringify({ id: 1, email: 'admin@bbd.com', role: 'boss' }));
    });

    await switchLang('en');
    await page.goto('http://localhost:5174/positions', { waitUntil: 'networkidle0' });
    let html = await page.content();
    console.log('EN Verification:');
    console.log('- Renders "Corporate Officer"?', html.includes('Corporate Officer'));
    console.log('- Renders "Head Chef"?', html.includes('Head Chef'));

    await switchLang('my');
    await page.goto('http://localhost:5174/positions', { waitUntil: 'networkidle0' });
    html = await page.content();
    console.log('\nMY Verification:');
    console.log('- Renders "ကော်ပိုရိတ်အရာရှိ"?', html.includes('ကော်ပိုရိတ်အရာရှိ'));
    console.log('- Renders "စားဖိုမှူးချုပ်"?', html.includes('စားဖိုမှူးချုပ်'));
    console.log('- Does NOT render "Corporate Officer"?', !html.includes('Corporate Officer'));

  } catch(e) {
    console.error('Error:', e);
  } finally {
    await browser.close();
  }
})();
