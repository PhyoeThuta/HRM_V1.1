import { supabaseAdmin } from '../lib/supabase.js';
import { marked } from 'marked';

async function run() {
  try {
    console.log('Translating and refining Important Notes Article...');

    const myMarkdown = `
# Important Notes (အရေးကြီး မှတ်သားဖွယ်ရာများ)

## 1. Important Notes Overview (ယေဘုယျအကြောင်းအရာ)
ဤစာမျက်နှာသည် BBD HRM စနစ်ကို အသုံးပြုရာတွင် HR နှင့် Admin များ မဖြစ်မနေ သိရှိထားရမည့် အရေးကြီးသော အချက်အလက်များ၊ စနစ်၏ ကန့်သတ်ချက်များနှင့် အကောင်းဆုံး လုပ်ဆောင်သင့်သော နည်းလမ်း (Recommended Practices) များကို စုစည်းဖော်ပြထားပါသည်။

---

## 2. Employee Data (ဝန်ထမ်း အချက်အလက်)
- ဝန်ထမ်းတစ်ဦးအား စနစ်ထဲသို့ ထည့်သွင်းပြီးပါက၊ ၎င်း၏ Employee ID ကို ပြောင်းလဲ၍ မရပါ။ 
- စနစ်မှ အပြီးတိုင် ဖျက်ပစ်ခြင်း (Hard Delete) ကို ရှောင်ကြဉ်ပါ။ အလုပ်ထွက်သွားပါက Status ကို 'Inactive' ဟုသာ ပြောင်းလဲပါ။

## 3. Department & Position Data (ဌာနနှင့် ရာထူး)
- Department သို့မဟုတ် Position တစ်ခုကို ဖျက်လိုက်ပါက (Delete)၊ ၎င်းအောက်ရှိ ဝန်ထမ်းများ၏ အချက်အလက်များ (SOPs အပါအဝင်) လမ်းလွဲသွားနိုင်သဖြင့် မဖြစ်မနေ လိုအပ်မှသာ ဖျက်ပါ။

## 4. Attendance (အလုပ်တက်ရောက်မှု)
- Attendance မှတ်တမ်းများကို Manual (ကိုယ်တိုင်) ပြင်ဆင်ခွင့် ရှိသော်လည်း၊ Audit Logs တွင် မည်သူက ပြင်ဆင်ခဲ့ကြောင်း မှတ်တမ်းတင်ထားမည် ဖြစ်သည်။

## 5. Leave (ခွင့်)
- Approved ဖြစ်သွားသော ခွင့်များကို ဝန်ထမ်းမှ ဖျက်၍မရတော့ပါ။ HR သို့မဟုတ် Manager မှသာ Cancel လုပ်ပေးနိုင်ပါသည်။

## 6. Handovers (အလုပ်လွှဲပြောင်းခြင်း)
- Handover လုပ်ငန်းစဉ်သည် ခွင့်တင်ခြင်းနှင့် Offboarding တို့အတွက် **အလွန် အရေးကြီးပါသည်**။ Handover မပြီးမချင်း ၎င်းတို့ကို ဆက်လက် လုပ်ဆောင်၍ ရမည်မဟုတ်ပါ။ (ခြွင်းချက်အနေဖြင့် HR မှ Waive လုပ်ပေးနိုင်ပါသည်)။

## 7. Daily SOPs (နေ့စဉ် လုပ်ငန်းစဉ်များ)
- SOPs များကို နေ့စဉ် သတ်မှတ်အချိန်အတွင်းသာ Submit လုပ်ခွင့်ရှိပါသည်။ နောက်ရက်များအတွက် ကြိုတင်၍ သို့မဟုတ် ကျော်လွန်သွားသော ရက်များအတွက် နောက်ကြောင်းပြန်၍ Submit လုပ်၍ မရပါ။

## 8. Performance & KPI (စွမ်းဆောင်ရည်)
- Performance အမှတ်များသည် Attendance နှင့် SOP ပြီးမြောက်မှုများအပေါ် အလိုအလျောက် တွက်ချက်ခြင်း ဖြစ်သဖြင့် အခြေခံ အချက်အလက်များ (Data) အမြဲ မှန်ကန်ရန် လိုအပ်ပါသည်။

## 9. Payroll (လစာ)
- 'Generate Payroll' မလုပ်မီ Attendance နှင့် Leave များကို အကုန် အတည်ပြု (Approve) ပြီးဖြစ်ရန် အရေးကြီးပါသည်။

## 10. Documents (စာရွက်စာတမ်းများ)
- Document Vault သို့ တင်ထားသော ဖိုင်များ (ဥပမာ - NDA) သည် Cloud Storage တွင် လုံခြုံစွာ သိမ်းဆည်းထားပြီး၊ ဝန်ထမ်းကိုယ်တိုင် ဖျက်ပစ်ခွင့် မရှိပါ။

## 11. Org Chart (အဖွဲ့အစည်း ဖွဲ့စည်းပုံ)
- ဖွဲ့စည်းပုံ မှန်ကန်စွာ ပေါ်စေရန် ဝန်ထမ်းတိုင်းကို 'Manager' သတ်မှတ်ပေးရန် မမေ့ပါနှင့်။

## 12. Offboarding (အလုပ်ထွက်ခွာခြင်း)
- **အလွန်အရေးကြီးပါသည်:** Offboarding လုပ်ငန်းစဉ် ပြီးဆုံး၍ "Release Final Settlement" နှိပ်လိုက်ရုံဖြင့် ဝန်ထမ်းသည် စနစ်ထဲမှ အလိုအလျောက် ထွက်သွားမည် မဟုတ်ပါ။ HR သည် Employee Details သို့ သွား၍ Status ကို 'Inactive' (သို့မဟုတ်) 'Offboarded' သို့ **ကိုယ်တိုင်** ပြောင်းလဲပေးရပါမည်။

---

## 13. User Roles & Permissions (အသုံးပြုသူ အဆင့်များနှင့် အခွင့်အာဏာများ)
- **Boss / Admin:** စနစ်၏ နေရာတိုင်းကို ဝင်ရောက်ပြင်ဆင်ခွင့် ရှိသည်။ Hard Delete လုပ်ပိုင်ခွင့် ရှိသည်။
- **HR:** ဝန်ထမ်းအချက်အလက်များ၊ လစာ၊ ခွင့်၊ စသည်တို့ကို စီမံခွင့်ရှိသည်။
- **Manager:** မိမိလက်အောက်ရှိ ဝန်ထမ်းများ၏ ခွင့်နှင့် Performance ကိုသာ အတည်ပြုခွင့် ရှိသည်။
- **Employee:** မိမိ၏ ကိုယ်ပိုင် Portal ကိုသာ ကြည့်ရှု အသုံးပြုခွင့် ရှိသည်။

---

## Manual CMS (လက်စွဲစာအုပ် စီမံခန့်ခွဲမှု)

### 14. Manual CMS & 15. Draft / Publish
- Manual တွင် ပြင်ဆင်မှုများ ပြုလုပ်ပါက 'Save Draft' အရင် နှိပ်ပါ။ စိတ်ကြိုက်ပြင်ဆင်ပြီးမှသာ အခြားသူများ မြင်တွေ့နိုင်ရန် 'Publish' ကို နှိပ်ပါ။

### 16. Version History
- Publish လုပ်လိုက်တိုင်း ယခင်အချက်အလက်များကို Version အဟောင်း (History) အနေဖြင့် စနစ်က အလိုအလျောက် မှတ်သားထားပေးပါသည်။

### 17. Soft Delete & 18. Recycle Bin
- 'Delete' နှိပ်လိုက်သော ဆောင်းပါးများသည် အပြီးတိုင် ပျောက်မသွားဘဲ **Recycle Bin** ထဲသို့ (Soft Delete အနေဖြင့်) ရောက်ရှိသွားပါသည်။ သာမန် User များ မမြင်တွေ့နိုင်တော့ပါ။

### 19. Restore
- Recycle Bin ထဲရှိ ဆောင်းပါးများကို 'Restore' နှိပ်ခြင်းဖြင့် Draft အဖြစ် ပြန်လည် အသက်သွင်းနိုင်ပါသည်။

### 20. Hard Delete
- Recycle Bin ထဲမှ 'Hard Delete' နှိပ်ပါက ဆောင်းပါးနှင့်တကွ ၎င်း၏ Version History များအားလုံးကို **အပြီးတိုင် ဖျက်ပစ်မည်** ဖြစ်သည်။
- ဤလုပ်ဆောင်ချက်ကို Boss နှင့် Admin များသာ လုပ်ဆောင်ခွင့် ရှိပါသည်။

---

## 21. Data Safety & 22. Known System Limitations (လုံခြုံရေးနှင့် စနစ်၏ ကန့်သတ်ချက်များ)
- **Limitations:** လက်ရှိ BBD HRM စနစ်တွင် ဝန်ထမ်းတစ်ဦး အလုပ်ထွက်သွားပါက ၎င်း၏ Google Workspace (သို့) Microsoft 365 အီးမေးလ်များကို စနစ်မှနေ၍ အလိုအလျောက် ပိတ်ပေးနိုင်စွမ်း **မရှိသေးပါ**။ IT ဌာနမှ သီးခြား ပိတ်ပေးရပါမည်။
- အခွန်ကင်းရှင်းကြောင်း (Tax Clearance) တွက်ချက်မှုများ အလိုအလျောက် ပါဝင်ခြင်း မရှိသေးပါ။

## 23. Recommended Operating Practices (အကောင်းဆုံး အသုံးပြုနည်းများ)
- လကုန်တိုင်း Payroll မတွက်ချက်မီ Attendance နှင့် Leave များကို မှန်ကန်ကြောင်း အရင်ဆုံး စစ်ဆေး (Audit) လုပ်ပါ။
- Offboarding မလုပ်မီ Handover 100% ပြီးစီးအောင် အမြဲ ကြီးကြပ်ပါ။
- Manual CMS တွင် ပြင်ဆင်မှုများ ပြုလုပ်တိုင်း English နှင့် Myanmar နှစ်ဘာသာလုံး ပြည့်စုံစွာ ပါဝင်ရေးကို သတိပြုပါ။

---

## 24. Related Modules (ဆက်စပ်သော အခန်းများ)
- <a href="#" data-article-title="Complete Employee Lifecycle" class="text-blue-600 hover:underline">Complete Employee Lifecycle</a>
- <a href="#" data-article-title="Cross-Module Workflow" class="text-blue-600 hover:underline">Cross-Module Workflow</a>
- <a href="#" data-article-title="FAQ / Troubleshooting" class="text-blue-600 hover:underline">FAQ / Troubleshooting</a>
`;

    const enMarkdown = `
# Important Notes

## 1. Important Notes Overview
This document serves as the final operational reference for HR and Admins. It contains critical system facts, known limitations, and recommended best practices for managing the BBD HRM system safely and effectively.

---

## 2. Employee Data
- Once an employee is created, their Employee ID is permanently locked and cannot be changed.
- Avoid using 'Hard Delete' on employees. If an employee leaves, always change their Status to 'Inactive' to preserve historical data.

## 3. Department & Position Data
- Deleting a Department or Position can orphan employee records and break their Daily SOPs. Always double-check before deleting structural data.

## 4. Attendance
- While HR can manually edit Clock In/Out times, the system records the person who made the edit in the Audit Logs to prevent tampering.

## 5. Leave
- Once a leave request is 'Approved', the employee cannot cancel it themselves. Only a Manager or HR can cancel it to refund the leave balance.

## 6. Handovers
- The Handover process acts as a strict gateway. Leave approvals (for 3+ days) and Offboarding Final Settlements **cannot proceed** until the linked Handover is completed or explicitly waived by HR.

## 7. Daily SOPs
- Employees must submit their SOPs on the actual day. The system does not allow backdating or completing SOPs for future dates.

## 8. Performance & KPI
- Performance scores are driven automatically by Attendance and SOP completion. Ensure the base data is accurate, as manual overrides to the final KPI score are restricted.

## 9. Payroll
- Always ensure all leaves and overtime requests are fully approved before clicking 'Generate Payroll'.

## 10. Documents
- Files uploaded to the Document Vault (like NDAs) are stored securely in cloud buckets. Employees only have view/download access; they cannot delete official documents.

## 11. Org Chart
- The visual Org Chart depends entirely on the 'Manager' field in Employee Details. If a manager is not assigned, the employee will appear unlinked.

## 12. Offboarding
- **CRITICAL NOTE:** Releasing the Final Settlement does NOT automatically deactivate the employee. HR must manually go to Employee Details and change their status to 'Inactive' to revoke system access.

---

## 13. User Roles & Permissions
- **Boss / Admin:** Has full access to configure the system, perform Hard Deletes, and manage access.
- **HR:** Has global access to manage employees, payroll, and offboarding.
- **Manager:** Can only view and approve leave/performance for their direct subordinates.
- **Employee:** Has restricted access to their own personal portal only.

---

## Manual CMS

### 14. Manual CMS & 15. Draft / Publish
- Always use 'Save Draft' while working on articles. Only click 'Publish' when the article is ready for company-wide viewing.

### 16. Version History
- Every time you click 'Publish', the system automatically saves a backup of the previous content in the Version History.

### 17. Soft Delete & 18. Recycle Bin
- Clicking 'Delete' on an article performs a Soft Delete. The article vanishes from public view and is moved to the **Recycle Bin**.

### 19. Restore
- You can recover any soft-deleted article by clicking 'Restore' inside the Recycle Bin, returning it to Draft status.

### 20. Hard Delete
- Clicking 'Hard Delete' from the Recycle Bin **permanently destroys** the article and wipes its Version History.
- This highly destructive action is restricted solely to Boss and Admin roles.

---

## 21. Data Safety & 22. Known System Limitations
- **Limitations:** The BBD HRM system does NOT integrate directly with Google Workspace or Microsoft 365. When an employee is offboarded, IT must still manually revoke their email access.
- Automated Tax Clearance calculations are currently not supported natively.

## 23. Recommended Operating Practices
- Perform an "Attendance & Leave Audit" two days before generating the monthly Payroll.
- Treat the Offboarding Handover as a strict requirement to protect company intellectual property.
- When updating the User Manual, always ensure both English and Myanmar tabs contain matching, high-quality information.

---

## 24. Related Modules
- <a href="#" data-article-title="Complete Employee Lifecycle" class="text-blue-600 hover:underline">Complete Employee Lifecycle</a>
- <a href="#" data-article-title="Cross-Module Workflow" class="text-blue-600 hover:underline">Cross-Module Workflow</a>
- <a href="#" data-article-title="FAQ / Troubleshooting" class="text-blue-600 hover:underline">FAQ / Troubleshooting</a>
`;

    const myHtml = marked.parse(myMarkdown);
    const enHtml = marked.parse(enMarkdown);

    const { data: article, error } = await supabaseAdmin
      .from('hrm_manual_articles')
      .select('id')
      .eq('title', 'Important Notes')
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

    console.log('Successfully updated Important Notes article!');
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
