import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { supabaseAdmin } from '../lib/supabase.js';
import { marked } from 'marked';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  try {
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
      let { data, error } = await supabaseAdmin.from('hrm_manual_categories').select('id').eq('name', categories[i]).single();
      if (!data) {
        const ins = await supabaseAdmin.from('hrm_manual_categories').insert({ name: categories[i], order_index: i }).select().single();
        catMap[categories[i]] = ins.data.id;
      } else {
        await supabaseAdmin.from('hrm_manual_categories').update({ order_index: i }).eq('id', data.id);
        catMap[categories[i]] = data.id;
      }
    }

    // Also get the old 'Overview' category if it exists to clean it up or migrate
    const { data: oldData } = await supabaseAdmin.from('hrm_manual_categories').select('id').eq('name', 'Overview').single();
    if (oldData) {
      await supabaseAdmin.from('hrm_manual_articles').update({ category_id: catMap['OVERVIEW'] }).eq('category_id', oldData.id);
      await supabaseAdmin.from('hrm_manual_categories').delete().eq('id', oldData.id);
    }

    // Clean up empty drafts
    const { data: emptyDrafts } = await supabaseAdmin.from('hrm_manual_articles').select('id').eq('title', 'New Article (Draft)');
    if (emptyDrafts && emptyDrafts.length > 0) {
      for (const draft of emptyDrafts) {
        await supabaseAdmin.from('hrm_manual_articles').delete().eq('id', draft.id);
      }
    }

    // 2. Read and parse markdown
    const mdPath = 'C:/Users/Phyoe/.gemini/antigravity-ide/brain/9d779bf0-4985-4320-9412-eaedf7064d63/burmese_hrm_user_manual_v2.md';
    const content = fs.readFileSync(mdPath, 'utf8');

    const extractSection = (header) => {
      const idx = content.indexOf(header);
      if (idx === -1) return '';
      
      let endIdx = -1;
      const h3Idx = content.indexOf('\n### ', idx + header.length);
      const h2Idx = content.indexOf('\n## ', idx + header.length);
      
      if (header === '## အပိုင်း (ဂ) - Role-Based Procedure Guide') {
        endIdx = h2Idx;
      } else {
        if (h3Idx !== -1 && h2Idx !== -1) endIdx = Math.min(h3Idx, h2Idx);
        else if (h3Idx !== -1) endIdx = h3Idx;
        else if (h2Idx !== -1) endIdx = h2Idx;
      }
      
      if (endIdx === -1) endIdx = content.length;
      return content.substring(idx + header.length, endIdx).trim();
    };

    const convertToHTML = (text) => {
      return marked.parse(text);
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

      let { data: artRes } = await supabaseAdmin.from('hrm_manual_articles').select('id').eq('title', sec.title).single();
      
      if (!artRes && sec.matchOld) {
         let { data: matchRes } = await supabaseAdmin.from('hrm_manual_articles').select('id').eq('title', sec.matchOld).single();
         artRes = matchRes;
      }

      if (artRes) {
        await supabaseAdmin.from('hrm_manual_articles').update({
          title: sec.title,
          draft_content: fullHtml,
          published_content: fullHtml,
          status: 'published',
          category_id: catMap[sec.cat],
          order_index: orderIdx++
        }).eq('id', artRes.id);
      } else {
        await supabaseAdmin.from('hrm_manual_articles').insert({
          category_id: catMap[sec.cat],
          title: sec.title,
          draft_content: fullHtml,
          published_content: fullHtml,
          status: 'published',
          order_index: orderIdx++
        });
      }
    }

    console.log('Migration completed successfully.');
  } catch (e) {
    console.error('Error during migration:', e);
  }
}

run();
