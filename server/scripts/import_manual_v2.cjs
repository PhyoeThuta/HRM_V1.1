const fs = require('fs');
const dotenv = require('dotenv');
const path = require('path');
const pg = require('pg');

const env = dotenv.parse(fs.readFileSync(path.resolve(__dirname, '../.env')));
const client = new pg.Client({
  connectionString: env.SUPABASE_DB_URL || 'postgresql://postgres:PHYOEthuta123!%40%23@db.kcswzfrwpvioaaizfpnk.supabase.co:5432/postgres'
});

async function run() {
  try {
    await client.connect();
    
    console.log('Starting Migration of Burmese HRM Manual...');

    // 1. Setup Categories
    const categories = [
      'OVERVIEW',
      'EMPLOYEE MANAGEMENT',
      'ATTENDANCE & LEAVE',
      'PAYROLL & PERFORMANCE',
      'ORGANIZATION & OPERATIONS',
      'WORKFLOWS & HELP'
    ];

    const catMap = {};
    for (let i = 0; i < categories.length; i++) {
      let res = await client.query('SELECT id FROM hrm_manual_categories WHERE name = $1', [categories[i]]);
      if (res.rows.length === 0) {
        res = await client.query('INSERT INTO hrm_manual_categories (name, order_index) VALUES ($1, $2) RETURNING id', [categories[i], i]);
      } else {
        await client.query('UPDATE hrm_manual_categories SET order_index = $1 WHERE id = $2', [i, res.rows[0].id]);
      }
      catMap[categories[i]] = res.rows[0].id;
    }

    // Also get the old 'Overview' category if it exists to clean it up or migrate
    const oldRes = await client.query("SELECT id FROM hrm_manual_categories WHERE name = 'Overview'");
    if (oldRes.rows.length > 0) {
      // Just map old overview articles to new OVERVIEW
      await client.query("UPDATE hrm_manual_articles SET category_id = $1 WHERE category_id = $2", [catMap['OVERVIEW'], oldRes.rows[0].id]);
      await client.query("DELETE FROM hrm_manual_categories WHERE id = $1", [oldRes.rows[0].id]);
    }

    // Clean up empty drafts
    await client.query("DELETE FROM hrm_manual_articles WHERE title = 'New Article (Draft)' AND (draft_content = '' OR draft_content = '<p><br></p>' OR draft_content IS NULL)");

    // 2. Read and parse markdown
    const mdPath = 'C:/Users/Phyoe/.gemini/antigravity-ide/brain/9d779bf0-4985-4320-9412-eaedf7064d63/burmese_hrm_user_manual_v2.md';
    const content = fs.readFileSync(mdPath, 'utf8');

    // Simple parser
    const extractSection = (header) => {
      const idx = content.indexOf(header);
      if (idx === -1) return '';
      
      let endIdx = -1;
      const h3Idx = content.indexOf('\n### ', idx + header.length);
      const h2Idx = content.indexOf('\n## ', idx + header.length);
      
      if (h3Idx !== -1 && h2Idx !== -1) endIdx = Math.min(h3Idx, h2Idx);
      else if (h3Idx !== -1) endIdx = h3Idx;
      else if (h2Idx !== -1) endIdx = h2Idx;
      
      if (endIdx === -1) endIdx = content.length;
      return content.substring(idx + header.length, endIdx).trim();
    };

    const convertToHTML = (text) => {
      // basic markdown to html for the editor
      let html = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n- (.*?)/g, '<br>• $1')
        .replace(/\n\d+\. (.*?)/g, '<br><strong>$1</strong>');
      return `<p>${html}</p>`;
    };

    const sections = [
      { cat: 'OVERVIEW', title: 'HRM Overview', header: '## အပိုင်း (က) - Upgraded Burmese HRM User Manual', matchOld: 'Welcome to BBD HRM User Manual' },
      { cat: 'OVERVIEW', title: 'Dashboard', header: '### 1. Dashboard' },
      { cat: 'EMPLOYEE MANAGEMENT', title: 'Employees', header: '### 2. Employees' },
      { cat: 'EMPLOYEE MANAGEMENT', title: 'Employee Details', header: '### 3. Employee Details' },
      { cat: 'EMPLOYEE MANAGEMENT', title: 'Departments', header: '### 4. Departments' },
      { cat: 'EMPLOYEE MANAGEMENT', title: 'Positions', header: '### 5. Positions' },
      { cat: 'EMPLOYEE MANAGEMENT', title: 'Recruitment', header: '### 6. Recruitment' },
      { cat: 'EMPLOYEE MANAGEMENT', title: 'Onboarding', header: '### 7. Onboarding' },
      { cat: 'ATTENDANCE & LEAVE', title: 'Attendance', header: '### 8. Attendance' },
      { cat: 'ATTENDANCE & LEAVE', title: 'Leave Management', header: '### 9. Leave Management' },
      { cat: 'ATTENDANCE & LEAVE', title: 'Handovers', header: '### 10. Handovers' },
      { cat: 'PAYROLL & PERFORMANCE', title: 'Daily SOPs', header: '### 11. Daily SOPs' },
      { cat: 'PAYROLL & PERFORMANCE', title: 'Performance Tracker', header: '### 12. Performance Tracker' },
      { cat: 'PAYROLL & PERFORMANCE', title: 'Peer Voting', header: '### 13. Peer Voting' },
      { cat: 'PAYROLL & PERFORMANCE', title: 'Payroll & KPI', header: '### 14. Payroll & KPI' },
      { cat: 'ORGANIZATION & OPERATIONS', title: 'Document Vault', header: '### 15. Document Vault' },
      { cat: 'ORGANIZATION & OPERATIONS', title: 'Birthdays', header: '### 16. Birthdays' },
      { cat: 'ORGANIZATION & OPERATIONS', title: 'Org Chart', header: '### 17. Org Chart' },
      { cat: 'ORGANIZATION & OPERATIONS', title: 'Offboarding', header: '### 18. Offboarding' },
      { cat: 'WORKFLOWS & HELP', title: 'Complete Employee Lifecycle', header: '## အပိုင်း (ဃ) - Employee Lifecycle Procedure (ဝန်ထမ်းတစ်ဦး၏ လုပ်ငန်းစဉ် အစအဆုံး)' },
      { cat: 'WORKFLOWS & HELP', title: 'Cross-Module Workflow', header: '## အပိုင်း (င) - Cross-Module Workflow Guide' },
      { cat: 'WORKFLOWS & HELP', title: 'Common User Scenarios', header: '## အပိုင်း (ဂ) - Role-Based Procedure Guide' },
      { cat: 'WORKFLOWS & HELP', title: 'FAQ / Troubleshooting', header: '## အပိုင်း (စ) - Needs UI / Code Verification' },
      { cat: 'WORKFLOWS & HELP', title: 'Important Notes', header: '## အပိုင်း (ခ) - Complete Screenshot Checklist' }
    ];

    let orderIdx = 0;
    for (const sec of sections) {
      let rawText = extractSection(sec.header);
      if (!rawText) {
        console.warn('Could not find header: ' + sec.header);
        continue;
      }
      
      let htmlContent = convertToHTML(rawText);
      let htmlTitle = `<h2>${sec.title}</h2>`;
      let fullHtml = htmlTitle + htmlContent;

      let artRes = await client.query('SELECT id FROM hrm_manual_articles WHERE title = $1', [sec.title]);
      if (artRes.rows.length === 0 && sec.matchOld) {
         artRes = await client.query('SELECT id FROM hrm_manual_articles WHERE title = $1', [sec.matchOld]);
      }

      if (artRes.rows.length > 0) {
        await client.query(`
          UPDATE hrm_manual_articles 
          SET title = $1, draft_content = $2, published_content = $3, status = 'published', category_id = $4, order_index = $5
          WHERE id = $6
        `, [sec.title, fullHtml, fullHtml, catMap[sec.cat], orderIdx++, artRes.rows[0].id]);
      } else {
        await client.query(`
          INSERT INTO hrm_manual_articles (category_id, title, draft_content, published_content, status, order_index)
          VALUES ($1, $2, $3, $4, 'published', $5)
        `, [catMap[sec.cat], sec.title, fullHtml, fullHtml, orderIdx++]);
      }
    }

    console.log('Migration completed successfully.');
  } catch (e) {
    console.error('Error during migration:', e);
  } finally {
    client.end();
  }
}

run();
