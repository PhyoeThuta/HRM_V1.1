import puppeteer from 'puppeteer';

(async () => {
  console.log('Starting Puppeteer for localization verification...');
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  // Intercept network requests to mock API responses
  await page.setRequestInterception(true);
  page.on('request', request => {
    if (request.url().includes('/api/employees/form-data')) {
      request.respond({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          departments: [{ id: 1, Department_name: 'IT' }],
          positions: [{ id: 1, title: 'Engineer' }]
        })
      });
    } else if (request.url().includes('/api/employees')) {
      request.respond({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          employees: [{ id: 1, employee_id: 'EMP001', Full_name: 'John Doe', status: 'Active', dept_name: 'IT', pos_title: 'Engineer' }],
          total: 1
        })
      });
    } else if (request.url().includes('/api/leave')) {
      request.respond({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          requests: [],
          balances: [],
          leave_types: [{ id: 1, type_name: 'Annual Leave', default_days: 10 }]
        })
      });
    } else if (request.url().includes('/api/')) {
      request.respond({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({})
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
    // Go to a dummy page on localhost to set localStorage
    await page.goto('http://localhost:5174/', { waitUntil: 'networkidle0' });
    
    await page.evaluate(() => {
      localStorage.setItem('token', 'fake-jwt-token');
      localStorage.setItem('user', JSON.stringify({ id: 1, email: 'admin@bbd.com', role: 'boss', Full_name: 'Boss' }));
    });

    // Switch to EN first
    await switchLang('en');

    console.log('\n=== EN VERIFICATION ===');
    await page.goto('http://localhost:5174/employees', { waitUntil: 'networkidle0' });
    let pageHtml = await page.content();
    console.log('Employees List EN includes "Employees"?', pageHtml.includes('Employees'));
    console.log('Employees List EN includes "Active"?', pageHtml.includes('Active'));
    console.log('Employees List EN includes DB string "IT"?', pageHtml.includes('IT'));

    // Switch to MY
    await switchLang('my');

    console.log('\n=== MY VERIFICATION ===');
    await page.goto('http://localhost:5174/employees', { waitUntil: 'networkidle0' });
    pageHtml = await page.content();
    console.log('Employees List MY includes Myanmar active string?', pageHtml.includes('လက်ရှိအလုပ်လုပ်နေသူ')); 
    console.log('Employees List MY includes raw t( ?', pageHtml.includes('hrm.'));
    console.log('Employees List MY includes DB string "IT"?', pageHtml.includes('IT'));

    await page.goto('http://localhost:5174/employees/1/edit', { waitUntil: 'networkidle0' });
    let editHtml = await page.content();
    console.log('Edit Employee MY includes Myanmar translation for Full-Time?', editHtml.includes('အချိန်ပြည့်'));
    console.log('Edit Employee MY includes Myanmar translation for On Leave?', editHtml.includes('ခွင့်ယူထားသည်'));

    await page.goto('http://localhost:5174/leave', { waitUntil: 'networkidle0' });
    let leaveHtml = await page.content();
    console.log('Leave MY includes Myanmar strings?', leaveHtml.includes('ခွင့်စီမံမှု'));

  } catch(e) {
    console.error('Script Error:', e.message);
  } finally {
    await browser.close();
  }
})();
