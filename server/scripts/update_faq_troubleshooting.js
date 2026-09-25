import { supabaseAdmin } from '../lib/supabase.js';
import { marked } from 'marked';

async function run() {
  try {
    console.log('Translating and refining FAQ / Troubleshooting Article...');

    const myMarkdown = `
# FAQ / Troubleshooting (အမေးများသော မေးခွန်းများနှင့် ပြဿနာဖြေရှင်းခြင်း)

BBD HRM စနစ် အသုံးပြုရာတွင် ကြုံတွေ့ရလေ့ရှိသော အခက်အခဲများနှင့် ဖြေရှင်းနည်းများကို Module အလိုက် အောက်တွင် ဖော်ပြထားပါသည်။

---

## 1. General HRM & 2. Login / Access

**Q: ဝန်ထမ်းတစ်ဦး Login ဝင်၍ မရပါ။**
- **Answer:** ၎င်း၏ Employee Profile တွင် အီးမေးလ် သို့မဟုတ် Employee ID မှားယွင်းနေခြင်း ဖြစ်နိုင်ပါသည်။ သို့မဟုတ် ၎င်း၏ Status ကို 'Inactive' သို့ ပြောင်းထားမိခြင်း ဖြစ်နိုင်ပါသည်။
- **What to check:** <a href="#" data-article-title="Employee Details" class="text-blue-600 hover:underline">Employee Details</a> တွင် အချက်အလက်များနှင့် Status (Active) ကို စစ်ဆေးပါ။

---

## 3. Employees & 4. Departments & Positions

**Q: Org Chart တွင် ဝန်ထမ်းအမည် ပျောက်နေပါသည်။**
- **Answer:** ဝန်ထမ်းအား Direct Manager သတ်မှတ်ပေးရန် ကျန်ရှိနေခြင်းကြောင့် ဖြစ်ပါသည်။
- **What to check:** Employee Details တွင် 'Manager' dropdown အား ရွေးချယ်ပေးပါ။
- **Related Module:** <a href="#" data-article-title="Org Chart" class="text-blue-600 hover:underline">Org Chart</a>

**Q: ရာထူးအသစ် (Position) ဖန်တီးထားသော်လည်း ဝန်ထမ်းကို ရွေးပေး၍မရပါ။**
- **Answer:** ရာထူးကို Department တစ်ခုခုနှင့် ချိတ်ဆက် (Link) ရန် ကျန်နေခြင်း ဖြစ်ပါသည်။
- **What to check:** <a href="#" data-article-title="Positions" class="text-blue-600 hover:underline">Positions</a> တွင် သက်ဆိုင်ရာ Department သို့ Assign လုပ်ပေးပါ။

---

## 5. Recruitment & 6. Onboarding

**Q: Recruitment တွင် 'Hired' ပြောင်းလိုက်သော်လည်း ဝန်ထမ်းစာရင်းထဲ ရောက်မလာပါ။**
- **Answer:** Recruitment မှ Hired ပြောင်းခြင်းသည် Employee Code ကိုသာ ဖန်တီးပေးပါသည်။ ဝန်ထမ်းစာရင်းထဲသို့ အလိုအလျောက် ရောက်မလာပါ။
- **What to check:** <a href="#" data-article-title="Employees" class="text-blue-600 hover:underline">Employees</a> တွင် ကိုယ်တိုင် 'Create Employee' ပြုလုပ်ရပါမည်။

**Q: Onboarding Task များကို အမှန်ခြစ် ပေး၍မရပါ။**
- **Answer:** ၎င်း Task ကို လုပ်ဆောင်ရန် သင့်တွင် တာဝန် (Assigned Role) မရှိခြင်း ဖြစ်နိုင်ပါသည်။ (ဥပမာ IT task ကို HR မှ ခြစ်၍မရပါ)။
- **Related Module:** <a href="#" data-article-title="Onboarding" class="text-blue-600 hover:underline">Onboarding</a>

---

## 7. Attendance & 8. Leave Management

**Q: ဝန်ထမ်းတစ်ဦး Clock In/Out နှိပ်၍မရပါ။**
- **Answer:** Device ၏ GPS Location ပိတ်နေခြင်း သို့မဟုတ် IP/Location ကန့်သတ်ချက် (Geofencing) ပြင်ပသို့ ရောက်နေခြင်း ဖြစ်နိုင်ပါသည်။
- **What to check:** ဝန်ထမ်း၏ ဖုန်း Location ဖွင့်ထားခြင်း ရှိမရှိ စစ်ဆေးပါ။
- **Related Module:** <a href="#" data-article-title="Attendance" class="text-blue-600 hover:underline">Attendance</a>

**Q: Leave Balance လုံလောက်သော်လည်း ခွင့်တင်၍မရပါ။**
- **Answer:** ယခင်တင်ထားသော (Pending) ခွင့်များရှိနေခြင်းကြောင့် Balance လျော့နေခြင်း ဖြစ်နိုင်ပါသည်။
- **What to check:** <a href="#" data-article-title="Leave Management" class="text-blue-600 hover:underline">Leave Management</a> တွင် Pending ခွင့်များကို စစ်ဆေးပါ။

---

## 9. Handovers & 10. Daily SOPs

**Q: ခွင့်အတွက် Handover တောင်းခံထားသော်လည်း Manager က အတည်ပြုပေး၍မရပါ။**
- **Answer:** အလုပ်လွှဲပြောင်းခံရသူ (Assignee) မှ Acknowledge (လက်ခံကြောင်း) မနှိပ်ရသေး၍ ဖြစ်ပါသည်။
- **What to check:** <a href="#" data-article-title="Handovers" class="text-blue-600 hover:underline">Handovers</a> တွင် Assignee ၏ Status ကို ကြည့်ပါ။

**Q: ဝန်ထမ်း၏ Portal တွင် Daily SOPs များ မပေါ်ပါ။**
- **Answer:** ထိုဝန်ထမ်း၏ ရာထူး (Position) အတွက် SOPs မသတ်မှတ်ရသေးခြင်းကြောင့် ဖြစ်ပါသည်။
- **What to check:** <a href="#" data-article-title="Positions" class="text-blue-600 hover:underline">Positions</a> တွင် သက်ဆိုင်ရာရာထူး၌ SOPs ထည့်သွင်းထားခြင်း ရှိမရှိ စစ်ဆေးပါ။

---

## 11. Performance Tracker & 12. Peer Voting

**Q: လကုန်သော်လည်း Performance ရမှတ်များ မပေါ်ပါ။**
- **Answer:** Attendance သို့မဟုတ် SOP data များ တွက်ချက်မှု မပြီးသေးခြင်း ဖြစ်နိုင်ပါသည်။
- **What to check:** <a href="#" data-article-title="Performance Tracker" class="text-blue-600 hover:underline">Performance Tracker</a> တွင် Calculate ခလုတ်ရှိပါက နှိပ်ပေးပါ။

---

## 13. Payroll & KPI & 14. Document Vault

**Q: Payroll Generate လုပ်ရာတွင် အချို့ဝန်ထမ်းများ ကျန်ခဲ့ပါသည်။**
- **Answer:** ထိုဝန်ထမ်းများ၏ Status သည် 'Active' မဟုတ်ခြင်း သို့မဟုတ် အခြေခံလစာ (Basic Salary) ထည့်သွင်းမထားခြင်း ဖြစ်နိုင်ပါသည်။
- **What to check:** <a href="#" data-article-title="Employee Details" class="text-blue-600 hover:underline">Employee Details</a> ရှိ Payroll settings ကို စစ်ဆေးပါ။

---

## 15. Birthdays & 16. Org Chart

**Q: Org Chart တွင် Manager ကို ပြောင်းလဲချင်ပါသည်။**
- **Answer:** Org Chart မှ Node ကိုနှိပ်၍ 'Reassign Manager' လုပ်နိုင်သလို၊ Employee Details မှလည်း Manager ကို ပြောင်းလဲနိုင်ပါသည်။ ၎င်းတို့သည် အပြန်အလှန် ချိတ်ဆက်ထားပါသည်။
- **Related Module:** <a href="#" data-article-title="Org Chart" class="text-blue-600 hover:underline">Org Chart</a>

---

## 17. Offboarding

**Q: Offboarding တွင် 'Release Final Settlement' နှိပ်၍မရပါ။**
- **Answer:** Handover 100% မပြီးသေးခြင်း သို့မဟုတ် Task အချို့ (ဥပမာ - Laptop ပြန်အပ်ခြင်း) အမှန်ခြစ်ရန် ကျန်နေခြင်းကြောင့် ဖြစ်ပါသည်။
- **What to check:** <a href="#" data-article-title="Offboarding" class="text-blue-600 hover:underline">Offboarding</a> Details ထဲရှိ Clearance Toggles များနှင့် Handover Tab ကို စစ်ဆေးပါ။

---

## 18. User Manual / CMS & 19. Recycle Bin

**Q: Manual တွင် ဆောင်းပါး (Article) ကို မှားဖျက်မိသွားပါသည်။ ပြန်ယူ၍ ရပါသလား?**
- **Answer:** ရပါသည်။ Delete နှိပ်လိုက်သော ဆောင်းပါးများသည် ချက်ချင်း ပျောက်မသွားဘဲ Recycle Bin (Soft Delete) ထဲသို့ ရောက်သွားပါသည်။
- **What to check:**
  1. ဘယ်ဘက် Sidebar အောက်ခြေရှိ **Recycle Bin** ကို နှိပ်ပါ။
  2. ဖျက်လိုက်သော ဆောင်းပါးကို ရွေးချယ်ပါ။
  3. ညာဘက်အပေါ်ရှိ **Restore** ကို နှိပ်ခြင်းဖြင့် Draft အနေဖြင့် ပြန်လည်ရရှိပါမည်။

**Q: Recycle Bin မှ ဆောင်းပါးကို အပြီးတိုင် ဖျက်ချင်ပါသည်။ (Hard Delete)**
- **Answer:** Recycle Bin မှ 'Hard Delete' နှိပ်နိုင်ပါသည်။ သို့သော် ဤလုပ်ဆောင်ချက်ကို Boss သို့မဟုတ် Admin အဆင့်ရှိသူကသာ မြင်တွေ့နိုင်ပြီး၊ ဖျက်လိုက်ပါက Version History များပါ အပြီးတိုင် ပျောက်ဆုံးသွားမည် ဖြစ်ပါသည်။
`;

    const enMarkdown = `
# FAQ / Troubleshooting

This section covers the most common issues and solutions encountered when using the BBD HRM system, organized by module.

---

## 1. General HRM & 2. Login / Access

**Q: An employee cannot log in.**
- **Answer:** Their email or Employee ID might be entered incorrectly in their profile, or their status may have been changed to 'Inactive'.
- **What to check:** Verify their credentials and ensure their Status is 'Active' in <a href="#" data-article-title="Employee Details" class="text-blue-600 hover:underline">Employee Details</a>.

---

## 3. Employees & 4. Departments & Positions

**Q: An employee is missing from the Org Chart.**
- **Answer:** The employee has not been assigned a Direct Manager.
- **What to check:** Select a 'Manager' from the dropdown in Employee Details.
- **Related Module:** <a href="#" data-article-title="Org Chart" class="text-blue-600 hover:underline">Org Chart</a>

**Q: I created a new Position, but I can't select it for an employee.**
- **Answer:** The Position has not been linked to a Department yet.
- **What to check:** Go to <a href="#" data-article-title="Positions" class="text-blue-600 hover:underline">Positions</a> and ensure it is assigned to the relevant Department.

---

## 5. Recruitment & 6. Onboarding

**Q: I marked a candidate as 'Hired' in Recruitment, but they aren't in the Employee list.**
- **Answer:** Changing the status to 'Hired' only generates an Employee Code. It does not automatically create the employee record.
- **What to check:** You must manually click 'Create Employee' in the <a href="#" data-article-title="Employees" class="text-blue-600 hover:underline">Employees</a> module.

**Q: I cannot check off tasks in Onboarding.**
- **Answer:** You might not have the assigned role for that specific task (e.g., HR cannot check off an IT task).
- **Related Module:** <a href="#" data-article-title="Onboarding" class="text-blue-600 hover:underline">Onboarding</a>

---

## 7. Attendance & 8. Leave Management

**Q: An employee cannot Clock In/Out.**
- **Answer:** Their device's GPS location might be disabled, or they are outside the allowed Geofencing area (if configured).
- **What to check:** Ask the employee to enable Location Services on their phone.
- **Related Module:** <a href="#" data-article-title="Attendance" class="text-blue-600 hover:underline">Attendance</a>

**Q: I have enough Leave Balance, but I cannot request leave.**
- **Answer:** You likely have 'Pending' leave requests that are holding those balance days in reserve.
- **What to check:** Check for unapproved requests in <a href="#" data-article-title="Leave Management" class="text-blue-600 hover:underline">Leave Management</a>.

---

## 9. Handovers & 10. Daily SOPs

**Q: I submitted a Handover for my leave, but my Manager cannot approve it.**
- **Answer:** The person you assigned the handover to (the Assignee) has not clicked 'Acknowledge' yet.
- **What to check:** Check the Assignee's status in the <a href="#" data-article-title="Handovers" class="text-blue-600 hover:underline">Handovers</a> module.

**Q: Daily SOPs are not showing up in the Employee Portal.**
- **Answer:** The employee's Position does not have any SOPs configured.
- **What to check:** Verify that SOPs are attached to their specific role in the <a href="#" data-article-title="Positions" class="text-blue-600 hover:underline">Positions</a> module.

---

## 11. Performance Tracker & 12. Peer Voting

**Q: Monthly performance scores are not showing up.**
- **Answer:** The system may not have finished aggregating the Attendance and SOP data for the month.
- **What to check:** If there is a 'Calculate' button in the <a href="#" data-article-title="Performance Tracker" class="text-blue-600 hover:underline">Performance Tracker</a>, click it to force a refresh.

---

## 13. Payroll & KPI & 14. Document Vault

**Q: Some employees are missing when I Generate Payroll.**
- **Answer:** Those employees might be marked as 'Inactive', or they do not have a Basic Salary configured in their profile.
- **What to check:** Review the Payroll configurations in <a href="#" data-article-title="Employee Details" class="text-blue-600 hover:underline">Employee Details</a>.

---

## 15. Birthdays & 16. Org Chart

**Q: How do I change someone's manager in the Org Chart?**
- **Answer:** You can click their node in the Org Chart and select 'Reassign Manager', or you can change the manager directly in Employee Details. Both methods update the same data.
- **Related Module:** <a href="#" data-article-title="Org Chart" class="text-blue-600 hover:underline">Org Chart</a>

---

## 17. Offboarding

**Q: Why can't I click 'Release Final Settlement' in Offboarding?**
- **Answer:** The system automatically locks this button if the employee's Handover is not 100% complete, or if you have unchecked items in the Asset Clearance toggles (Laptop, Keys, etc.).
- **What to check:** Review the Clearance Checklist and the Handover Tab inside <a href="#" data-article-title="Offboarding" class="text-blue-600 hover:underline">Offboarding</a>.

---

## 18. User Manual / CMS & 19. Recycle Bin

**Q: I accidentally deleted a Manual Article. Can I get it back?**
- **Answer:** Yes. Clicking 'Delete' only performs a Soft Delete. The article is removed from normal navigation but is safely stored in the Recycle Bin.
- **What to check:**
  1. Click **Recycle Bin** at the bottom of the left sidebar.
  2. Select the deleted article.
  3. Click **Restore** in the top right to return it to 'Draft' status in its original category.

**Q: I want to permanently delete an article from the Recycle Bin. (Hard Delete)**
- **Answer:** You can click the 'Hard Delete' button inside the Recycle Bin. However, this button is restricted exclusively to the Boss or Admin roles. A confirmation warning will appear, because executing a Hard Delete will permanently destroy the article and its entire Version History.
`;

    const myHtml = marked.parse(myMarkdown);
    const enHtml = marked.parse(enMarkdown);

    const { data: article, error } = await supabaseAdmin
      .from('hrm_manual_articles')
      .select('id')
      .eq('title', 'FAQ / Troubleshooting')
      .single();

    if (error || !article) {
      console.log('Article not found in Database!');
      return;
    }

    const payload = JSON.stringify({ my: myHtml, en: enHtml });

    await supabaseAdmin.from('hrm_manual_articles').update({
      draft_content: payload,
      published_content: payload,
      status: 'published'
    }).eq('id', article.id);

    console.log('Successfully updated FAQ / Troubleshooting article!');
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
