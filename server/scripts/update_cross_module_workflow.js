import { supabaseAdmin } from '../lib/supabase.js';
import { marked } from 'marked';

async function run() {
  try {
    console.log('Translating and refining Cross-Module Workflow Article...');

    const myMarkdown = `
# Cross-Module Workflow (Module များ ချိတ်ဆက် အလုပ်လုပ်ပုံ)

## 1. Cross-Module Workflow Overview (ယေဘုယျအကြောင်းအရာ)
BBD HRM စနစ်ရှိ Module များသည် သီးခြားစီ အလုပ်လုပ်ခြင်း မဟုတ်ဘဲ တစ်ခုနှင့်တစ်ခု အချက်အလက်များ (Data) ချိတ်ဆက် ဖလှယ်ကြပါသည်။ 
အချို့ချိတ်ဆက်မှုများသည် **အလိုအလျောက် (Automatic)** ဖြစ်ပြီး၊ အချို့မှာမူ အသုံးပြုသူမှ **ကိုယ်တိုင် (Manual)** ပြောင်းလဲ သတ်မှတ်ပေးရပါသည်။ ဤစာမျက်နှာတွင် ထိုချိတ်ဆက်မှုများ မည်သို့ အလုပ်လုပ်ကြောင်းကို ရှင်းလင်းထားပါသည်။

---

## 2. Employee Data Flow (ဝန်ထမ်း အချက်အလက် စီးဆင်းမှု)
\`Employees\` Module သည် စနစ်တစ်ခုလုံး၏ အသည်းနှလုံး ဖြစ်ပါသည်။ အခြား Module အားလုံးသည် Employee ID (ဝန်ထမ်း နံပါတ်) နှင့် Employee Status (Active/Inactive) ကို အခြေခံ၍ အလုပ်လုပ်ကြပါသည်။

---

## 3. Recruitment → Employees (အလုပ်ခေါ်ယူခြင်းမှ ဝန်ထမ်းစာရင်းသို့)
- **Automatic:** \`Recruitment\` တွင် Candidate တစ်ဦးကို 'Hired' ဟု သတ်မှတ်လိုက်သည်နှင့် စနစ်မှ ၎င်းအတွက် 'Employee Code' အသစ်တစ်ခုကို အလိုအလျောက် ထုတ်ပေးပါသည်။
- **Manual Action:** HR မှ \`Employees\` တွင် ထို Candidate အမည်ဖြင့် Employee Record (ကိုယ်ရေးရာဇဝင်) ကို **ကိုယ်တိုင်** ဖန်တီး (Create) ပေးရပါမည်။ Recruitment မှ Employee စာရင်းထဲသို့ အလိုအလျောက် ရောက်မလာပါ။

## 4. Employees → Departments / Positions (ဝန်ထမ်းစာရင်းမှ ဌာနနှင့် ရာထူးများသို့)
- **Shared Data:** \`Employee Details\` တွင် ဝန်ထမ်းတစ်ဦးကို Department တစ်ခု သို့မဟုတ် Position တစ်ခု ရွေးချယ် သတ်မှတ်ပေးရပါမည်။ ထိုသို့ သတ်မှတ်ရန် \`Departments\` နှင့် \`Positions\` Module များတွင် ကြိုတင် ဖန်တီးထားသော စာရင်းများကို အသုံးပြုပါသည်။
- **Status Change:** ဤချိတ်ဆက်မှုကြောင့် ဝန်ထမ်းသည် သက်ဆိုင်ရာ ဌာနအောက်သို့ ရောက်ရှိသွားပြီး \`Org Chart\` တွင် ပေါ်လာမည် ဖြစ်ပါသည်။

## 5. Employees → Onboarding (ဝန်ထမ်းစာရင်းမှ ကြိုဆိုခြင်းလုပ်ငန်းစဉ်သို့)
- **Manual Action:** HR မှ \`Onboarding\` Module သို့ သွား၍ ဝန်ထမ်းအသစ်၏ အမည်ကို ရွေးချယ်ပြီး Onboarding ကို စတင်ပေးရပါမည်။
- **Shared Data:** Employee Profile မှ နာမည်၊ Employee ID နှင့် အလုပ်စတင်သည့်ရက် (Hire Date) ကို Onboarding တွင် အလိုအလျောက် ဆွဲယူအသုံးပြုပါသည်။

## 6. Employees → Attendance (ဝန်ထမ်းစာရင်းမှ အလုပ်တက်ရောက်မှုသို့)
- **Automatic:** Active ဖြစ်နေသော ဝန်ထမ်းများအားလုံးသည် ၎င်းတို့၏ Employee Portal မှတစ်ဆင့် Attendance (Clock In / Clock Out) ကို နေ့စဉ် အသုံးပြုခွင့် ရရှိပါသည်။
- **Calculated Data:** နေ့စဉ် Attendance များကို \`Payroll & KPI\` Module တွင် လစာတွက်ချက်ရန်အတွက် အလိုအလျောက် စုစည်း တွက်ချက်ပေးပါသည်။

## 7. Employees → Leave Management (ဝန်ထမ်းစာရင်းမှ ခွင့်စီမံခန့်ခွဲမှုသို့)
- **Shared Data:** ဝန်ထမ်းတိုင်း၏ ခွင့်လက်ကျန် (Leave Balance) ကို \`Employee Details\` တွင် သတ်မှတ်ထားပြီး၊ \`Leave Management\` မှ ခွင့်တိုင်ကြားတိုင်း ယင်းလက်ကျန်ထဲမှ ခုနှိမ် (Deduct) သွားပါသည်။
- **User Decision:** Manager မှ ခွင့်ကို 'Approved' သို့မဟုတ် 'Rejected' ပြုလုပ်ပေးရပါမည်။

## 8. Leave → Handovers (ခွင့်မှ အလုပ်လွှဲပြောင်းခြင်းသို့)
- **Automatic / Manual Flow:** ခွင့်ရက် ၃ ရက်နှင့်အထက် ဖြစ်ပါက၊ ခွင့်မတင်မီ ဝန်ထမ်းမှ မိမိအလုပ်ကို အခြားသူထံ \`Handovers\` စနစ်မှတစ်ဆင့် ကြိုတင် လွှဲပြောင်းထားရန် လိုအပ်နိုင်ပါသည်။ Manager သည် Handover ပြီးဆုံးမှုကို ကြည့်၍ Leave ကို အတည်ပြုပေးရပါမည်။

## 9. Positions → Daily SOPs (ရာထူးမှ နေ့စဉ်လုပ်ငန်းစဉ်များသို့)
- **Automatic:** ဝန်ထမ်း၏ \`Position\` (ဥပမာ - Marketing Manager) အပေါ် မူတည်၍ ၎င်းလုပ်ဆောင်ရမည့် \`Daily SOPs\` (နေ့စဉ် လုပ်ငန်းစဉ်များ) ကို စနစ်မှ အလိုအလျောက် သတ်မှတ် ပြသပေးပါသည်။ 
- **Calculated Data:** SOP လုပ်ဆောင်မှု ရာခိုင်နှုန်း (Completion Rate) ကို Performance အတွက် နေ့စဉ် တွက်ချက်ပေးပါသည်။

## 10. Daily SOPs → Performance Tracker (နေ့စဉ်လုပ်ငန်းစဉ်များမှ စွမ်းဆောင်ရည် စစ်ဆေးခြင်းသို့)
- **Automatic:** ဝန်ထမ်းများ၏ Daily SOPs အမှန်ခြစ်ပြီးစီးမှု ရလဒ်များကို \`Performance Tracker\` သို့ အလိုအလျောက် ပို့ဆောင်ပေးပြီး စွမ်းဆောင်ရည် အမှတ်ပေးပါသည်။

## 11. Performance Tracker → Payroll & KPI (စွမ်းဆောင်ရည်မှ လစာနှင့် ဆုကြေးသို့)
- **Calculated Data:** \`Performance Tracker\` မှ ရရှိသော Attendance, Leave, နှင့် SOP စွမ်းဆောင်ရည် ရမှတ်များကို \`Payroll & KPI\` တွင် လစဉ် Bonus နှင့် KPI ရမှတ် တွက်ချက်ရန်အတွက် အလိုအလျောက် ပေါင်းစပ်ပေးပါသည်။
- **Manual Action:** HR မှ လကုန်တိုင်း Payroll ကို **'Generate' (တွက်ချက်ပါ)** ဟု ကိုယ်တိုင် နှိပ်ပေးရန် လိုအပ်ပါသည်။

## 12. Peer Voting → Performance / Payroll (အချင်းချင်း အကဲဖြတ်ခြင်းမှ လစာတွက်ချက်ခြင်းသို့)
- **Calculated Data:** ဝန်ထမ်းများ အချင်းချင်း မဲပေးထားသော \`Peer Voting\` ရလဒ်များကို KPI တွက်ချက်ရာတွင် နောက်ထပ် အမှတ်တစ်ခု အနေဖြင့် အလိုအလျောက် ပေါင်းထည့်ပေးပါသည်။

## 13. Document Vault → Employee Lifecycle (စာရွက်စာတမ်းခန်း)
- **Shared Data:** \`Document Vault\` သည် Employee များနှင့် တိုက်ရိုက် ချိတ်ဆက်ထားပြီး Onboarding တွင် NDA စာချုပ်များ၊ Payroll တွင် Payslip များ၊ နှင့် Offboarding တွင် နောက်ဆုံး ထွက်ခွာခွင့် စာရွက်စာတမ်းများကို သိမ်းဆည်းရန် နေရာ (Storage) အဖြစ် ဆောင်ရွက်ပေးပါသည်။

## 14. Org Chart → Employee Hierarchy (ဖွဲ့စည်းပုံ မှ ဝန်ထမ်းအဆင့်ဆင့်သို့)
- **Automatic:** \`Employee Details\` တွင် 'Direct Manager' ကို သတ်မှတ်လိုက်သည်နှင့် \`Org Chart\` တွင် ထိုမန်နေဂျာ၏ လက်အောက်သို့ ဝန်ထမ်းက အလိုအလျောက် ရောက်ရှိသွားပြီး Tree View ဖြင့် ပြသပေးပါသည်။
- **Status Change:** ဝန်ထမ်းတစ်ဦး အလုပ်ထွက်၍ (Inactive ဖြစ်သွား၍) ဖြစ်စေ၊ \`Org Chart\` မှနေ၍ Manager အသစ်ကို Reassign လုပ်၍ဖြစ်စေ ဖွဲ့စည်းပုံသည် ချက်ချင်း အလိုအလျောက် ပြောင်းလဲသွားပါသည်။

## 15. Offboarding → Handovers / Employee Exit (အလုပ်ထွက်ခွာခြင်း)
- **Automatic Block:** \`Offboarding\` တွင် နောက်ဆုံးလစာထုတ်ပေးရန် (Release Final Settlement) ခလုတ်သည် \`Handovers\` မှ အလုပ်လွှဲပြောင်းခြင်း 100% မပြီးမချင်း (သို့မဟုတ် HR မှ Waive မလုပ်မချင်း) **အလိုအလျောက် ပိတ် (Locked)** ထားပါသည်။
- **Manual Action:** Settlement ပေးပြီးပါက၊ HR သည် \`Employee Details\` သို့သွား၍ ဝန်ထမ်းကို Status = 'Inactive' (သို့) 'Offboarded' ဟု **ကိုယ်တိုင် (Manually)** ပြောင်းလဲပေးမှသာ စနစ်ဝင်ခွင့် ပိတ်သွားမည် ဖြစ်ပါသည်။ (Auto-Delete မလုပ်ပါ)။

---

## 16. End-to-End Cross-Module Example (လက်တွေ့ ချိတ်ဆက်မှု ဥပမာ)
**ခွင့်ရှည်ယူခြင်းနှင့် လစာတွက်ချက်မှု ချိတ်ဆက်ပုံ:**
1. ဝန်ထမ်းမှ ၅ ရက် ခွင့်တိုင်ကြားသည် (\`Leave Management\`)။
2. စနစ်မှ Handover တောင်းခံသဖြင့် လုပ်ဖော်ကိုင်ဖက်ထံ အလုပ်လွှဲပြောင်းသည် (\`Handovers\`)။
3. Manager မှ Handover လက်ခံပြီး ခွင့်ကို Approve လုပ်ပေးလိုက်သည်။
4. ခွင့် ၅ ရက်အတွက် Leave Balance အလိုအလျောက် လျော့ကျသွားသည် (\`Employee Details\`)။
5. လကုန်သောအခါ ၎င်းခွင့်ရက်များသည် လစာတွက်ချက်မှု စာရင်းတွင် ထည့်သွင်း တွက်ချက်ခံရသည် (\`Payroll & KPI\`)။

---

## 17. Common Integration Problems (တွေ့ကြုံရလေ့ရှိသော ချိတ်ဆက်မှု ပြဿနာများ)
- **Org Chart တွင် ဝန်ထမ်း မပေါ်ခြင်း:** \`Employee Details\` တွင် Manager သတ်မှတ်ပေးရန် မေ့ကျန်နေခြင်း။
- **SOP မပေါ်ခြင်း:** \`Positions\` Module တွင် ထိုရာထူးအတွက် SOP ထည့်သွင်းမထားခြင်း သို့မဟုတ် Employee ကို ရာထူး သတ်မှတ်မထားခြင်း။
- **Offboarding တွင် Settlement နှိပ်မရခြင်း:** \`Handovers\` မှ အလုပ်လွှဲပြောင်းမှု 100% မပြီးသေးခြင်း။

---

## 18. Important Notes (အရေးကြီး မှတ်သားဖွယ်ရာများ)
- **Manual vs Automatic:** စနစ်မှ အချက်အလက်များကို အလိုအလျောက် ချိတ်ဆက် (Flow) ပေးသော်လည်း၊ အရေးကြီးသော ဆုံးဖြတ်ချက်များ (ဥပမာ - Leave Approve လုပ်ခြင်း၊ Payroll တွက်ချက်ခြင်း၊ အလုပ်မှ ထွက်ခွာခွင့်ပြုခြင်း) ကို လူကိုယ်တိုင် (Manual) ခလုတ်နှိပ် အတည်ပြုပေးရပါသည်။
- **Data Integrity:** Module တစ်ခု (ဥပမာ - Position) တွင် အချက်အလက် မှားယွင်းဖျက်မိပါက ဆက်စပ်နေသော အခြား Module (ဥပမာ - SOPs) များတွင် ပြဿနာ ဖြစ်နိုင်ပါသည်။ သို့ဖြစ်၍ သတိထား အသုံးပြုပါ။

---

## 19. Related Modules (ဆက်စပ်သော အခန်းများ)
- <a href="#" data-article-title="Complete Employee Lifecycle" class="text-blue-600 hover:underline">Complete Employee Lifecycle</a>
- <a href="#" data-article-title="Common User Scenarios" class="text-blue-600 hover:underline">Common User Scenarios</a>
- <a href="#" data-article-title="Employees" class="text-blue-600 hover:underline">Employees</a>
`;

    const enMarkdown = `
# Cross-Module Workflow

## 1. Cross-Module Workflow Overview
Modules in the BBD HRM system do not operate in isolation; they continuously share and exchange data. 
Some of these integrations are **Automatic**, while others require a **Manual** trigger or decision from the user. This article explains exactly how these modules interact behind the scenes.

---

## 2. Employee Data Flow
The \`Employees\` module is the central hub. Almost every other module depends on the Employee ID and the current Employment Status (Active/Inactive) to function correctly.

---

## 3. Recruitment → Employees
- **Automatic:** When a candidate is marked as 'Hired' in the \`Recruitment\` module, the system automatically generates a new 'Employee Code'.
- **Manual Action:** HR must physically go to the \`Employees\` module and click 'Create Employee' to onboard them. Candidates do not auto-migrate into active employees.

## 4. Employees → Departments / Positions
- **Shared Data:** Within \`Employee Details\`, an employee is assigned to a Department and a Position. This relies on the pre-configured lists from the \`Departments\` and \`Positions\` modules.
- **Status Change:** This assignment automatically places the employee within the \`Org Chart\`.

## 5. Employees → Onboarding
- **Manual Action:** HR must manually navigate to \`Onboarding\` and initiate the process for the new hire.
- **Shared Data:** The Onboarding module automatically pulls the employee's Name, ID, and Hire Date from their Employee Profile.

## 6. Employees → Attendance
- **Automatic:** As long as an employee's status is 'Active', they automatically gain access to the Clock In/Out functionality in their portal (\`Attendance\`).
- **Calculated Data:** Daily attendance logs are automatically aggregated at the end of the month for the \`Payroll & KPI\` module.

## 7. Employees → Leave Management
- **Shared Data:** Each employee's leave balance is stored in \`Employee Details\`. When a leave is requested via \`Leave Management\`, the system checks and deducts from this balance.
- **User Decision:** Managers must manually 'Approve' or 'Reject' the requested leave.

## 8. Leave → Handovers
- **Automatic / Manual Flow:** If an employee requests leave for 3 or more days, they may be required to complete a \`Handover\` of their current tasks. Managers verify the handover status before approving the leave.

## 9. Positions → Daily SOPs
- **Automatic:** The \`Positions\` module determines exactly which \`Daily SOPs\` an employee sees in their portal. If their Position changes, their daily checklists change automatically.
- **Calculated Data:** Daily SOP completion percentages are calculated and stored for Performance reviews.

## 10. Daily SOPs → Performance Tracker
- **Automatic:** The daily completion rate of SOPs is automatically pushed to the \`Performance Tracker\`, where it constitutes a major portion of the employee's evaluation score.

## 11. Performance Tracker → Payroll & KPI
- **Calculated Data:** The \`Payroll & KPI\` module automatically pulls the final scores from the \`Performance Tracker\` (which includes Attendance, Leave, and SOPs) to calculate the monthly KPI Bonus.
- **Manual Action:** HR/Finance must manually click 'Generate Payroll' at the end of the month; it does not calculate itself silently in the background.

## 12. Peer Voting → Performance / Payroll
- **Calculated Data:** The results of the \`Peer Voting\` module are automatically factored into the overall performance score during the KPI calculation phase.

## 13. Document Vault → Employee Lifecycle
- **Shared Data:** The \`Document Vault\` acts as the central storage repository. It links to Onboarding (NDAs), Payroll (Payslips), and Offboarding (Clearance documents), keeping all files attached to the specific Employee ID.

## 14. Org Chart → Employee Hierarchy
- **Automatic:** When HR assigns a 'Direct Manager' in \`Employee Details\`, the \`Org Chart\` automatically redraws the tree hierarchy.
- **Status Change:** If an employee is marked as 'Inactive' (e.g., they resigned), they immediately and automatically disappear from the Org Chart.

## 15. Offboarding → Handovers / Employee Exit
- **Automatic Block:** In the \`Offboarding\` module, the "Release Final Settlement" button is **automatically locked** until the linked \`Handover\` is 100% complete (or explicitly waived by HR).
- **Manual Action:** Even after the settlement is released, the system does NOT auto-delete the user. HR must manually go to \`Employee Details\` and change their status to 'Inactive' to revoke system access.

---

## 16. End-to-End Cross-Module Example
**How a Long Leave affects Payroll:**
1. Employee requests 5 days off (\`Leave Management\`).
2. They are required to transfer their active projects (\`Handovers\`).
3. Manager confirms the handover and approves the leave.
4. The system automatically deducts 5 days from their balance (\`Employee Details\`).
5. At month-end, the 5 days of approved leave are factored into their salary and attendance score (\`Payroll & KPI\`).

---

## 17. Common Integration Problems
- **Employee missing from Org Chart:** HR forgot to assign them a Manager in \`Employee Details\`.
- **SOPs are empty:** The employee was not assigned a Position, or that Position has no SOPs configured.
- **Cannot release final pay:** The departing employee failed to finish their \`Handover\`.

---

## 18. Important Notes
- **Manual vs Automatic:** While data flows automatically to save time (e.g., calculating totals), critical business decisions (Approving Leave, Releasing Pay, Deactivating Users) always require a Manual click to ensure human oversight.
- **Data Integrity:** Deleting a core configuration (like a Department) can orphan employee records and break integrations. Use Soft Delete / Inactive statuses wherever possible.

---

## 19. Related Modules
- <a href="#" data-article-title="Complete Employee Lifecycle" class="text-blue-600 hover:underline">Complete Employee Lifecycle</a>
- <a href="#" data-article-title="Common User Scenarios" class="text-blue-600 hover:underline">Common User Scenarios</a>
- <a href="#" data-article-title="Employees" class="text-blue-600 hover:underline">Employees</a>
`;

    const myHtml = marked.parse(myMarkdown);
    const enHtml = marked.parse(enMarkdown);

    const { data: article, error } = await supabaseAdmin
      .from('hrm_manual_articles')
      .select('id')
      .eq('title', 'Cross-Module Workflow')
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

    console.log('Successfully updated Cross-Module Workflow article!');
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
