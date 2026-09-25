import { supabaseAdmin } from '../lib/supabase.js';
import { marked } from 'marked';

async function run() {
  try {
    console.log('Translating and refining Common User Scenarios Article...');

    const myMarkdown = `
# Common User Scenarios (အသုံးများသော လက်တွေ့ အခြေအနေများ)

## 1. Common User Scenarios Overview (ယေဘုယျအကြောင်းအရာ)
ဤစာမျက်နှာသည် HR နှင့် Admin များ နေ့စဉ် လုပ်ငန်းခွင်တွင် အများဆုံး တွေ့ကြုံရလေ့ရှိသော အခြေအနေများ (Scenarios) ကို လက်တွေ့ ဖြေရှင်းဆောင်ရွက်ရမည့် အဆင့်များနှင့်တကွ လမ်းညွှန်ပေးထားခြင်း ဖြစ်ပါသည်။ အဆင့်တိုင်းသည် BBD HRM စနစ်၏ လက်ရှိ လုပ်ဆောင်နိုင်စွမ်းများအပေါ် အခြေခံထားပါသည်။

---

## 2. Scenario: Hire a New Employee (ဝန်ထမ်းသစ် ခေါ်ယူခြင်း)
- **Purpose:** အလုပ်လျှောက်ထားသူအား အလုပ်ခန့်အပ်ရန် အတည်ပြုခြင်း။
- **Who:** HR သို့မဟုတ် Manager.
- **Step 1:** <a href="#" data-article-title="Recruitment" class="text-blue-600 hover:underline">Recruitment</a> သို့ သွားပါ။
- **Step 2:** သက်ဆိုင်ရာ Candidate ကို ရှာဖွေပါ။
- **Step 3:** Status ကို 'Hired' သို့ ပြောင်းလဲပါ။
- **Expected Result:** စနစ်မှ Employee Code အသစ်တစ်ခု ထုတ်ပေးမည်ဖြစ်ပြီး Employee Creation သို့ ဆက်လက် သွားရောက်နိုင်ပါသည်။

## 3. Scenario: Create Employee Record (ဝန်ထမ်း မှတ်တမ်း ဖန်တီးခြင်း)
- **Purpose:** Hired ဖြစ်သွားသူကို စနစ်တွင်းသို့ အပြည့်အဝ ထည့်သွင်းခြင်း။
- **Who:** HR.
- **Step 1:** <a href="#" data-article-title="Employees" class="text-blue-600 hover:underline">Employees</a> သို့ သွား၍ 'Create Employee' ကို နှိပ်ပါ။
- **Step 2:** ကိုယ်ရေးအချက်အလက် (အမည်၊ ဖုန်း၊ အီးမေးလ်) တို့ကို ဖြည့်သွင်းပါ။
- **Step 3:** 'Save' နှိပ်ပါ။
- **Expected Result:** ဝန်ထမ်းအသစ်၏ ပရိုဖိုင် ဖန်တီးပြီးစီးမည်။

## 4. Scenario: Assign Department and Position (ဌာနနှင့် ရာထူး သတ်မှတ်ခြင်း)
- **Purpose:** ဝန်ထမ်း၏ တာဝန်နှင့် ဖွဲ့စည်းပုံ နေရာကို သတ်မှတ်ရန်။
- **Who:** HR.
- **Step 1:** <a href="#" data-article-title="Employee Details" class="text-blue-600 hover:underline">Employee Details</a> သို့ သွား၍ 'Edit' ကို နှိပ်ပါ။
- **Step 2:** Dropdown မှ Department နှင့် Position ကို ရွေးချယ်ပါ။
- **Step 3:** Manager အမည်ကို ရွေးချယ်ပြီး Save နှိပ်ပါ။
- **Expected Result:** ဝန်ထမ်းသည် \`Org Chart\` တွင် ပေါ်လာမည်ဖြစ်ပြီး ၎င်းရာထူးနှင့် သက်ဆိုင်သော \`Daily SOPs\` များ ရရှိမည် ဖြစ်သည်။

## 5. Scenario: Complete Onboarding (ကြိုဆိုခြင်းလုပ်ငန်းစဉ် ပြီးမြောက်ခြင်း)
- **Purpose:** ဝန်ထမ်းသစ်အား ပစ္စည်းများ ထုတ်ပေးခြင်းနှင့် NDA ထိုးခြင်းတို့ကို မှတ်တမ်းတင်ရန်။
- **Who:** HR နှင့် IT.
- **Step 1:** <a href="#" data-article-title="Onboarding" class="text-blue-600 hover:underline">Onboarding</a> သို့ သွား၍ ဝန်ထမ်းအမည်ကို ရွေးချယ်ပါ။
- **Step 2:** Laptop, Access Card ထုတ်ပေးခြင်းနှင့် NDA လက်မှတ်ထိုးခြင်း Task များကို အမှန်ခြစ် ပေးပါ။
- **Step 3:** အားလုံး 100% ပြီးစီးပါက Status ကို 'Completed' သို့ ပြောင်းပါ။
- **Expected Result:** ဝန်ထမ်းသစ်သည် လုပ်ငန်းခွင်သို့ အပြည့်အဝ ဝင်ရောက်နိုင်ပြီ ဖြစ်သည်။

## 6. Scenario: Record Attendance (အလုပ်တက်ရောက်မှု မှတ်တမ်းတင်ခြင်း)
- **Purpose:** အလုပ်ဝင်ချိန် နှင့် အလုပ်ဆင်းချိန် မှတ်သားရန်။
- **Who:** ဝန်ထမ်းတိုင်း။
- **Step 1:** မိမိ၏ Employee Portal သို့ ဝင်ပါ။
- **Step 2:** 'Clock In' ခလုတ်ကို နှိပ်ပါ။
- **Step 3:** အလုပ်ဆင်းချိန်တွင် 'Clock Out' ကို နှိပ်ပါ။
- **Expected Result:** အချိန်မှတ်တမ်းကို \`Attendance\` တွင် သိမ်းဆည်းပြီး လကုန် Payroll အတွက် တွက်ချက်မည် ဖြစ်သည်။

## 7. Scenario: Submit and Approve Leave (ခွင့်တင်ခြင်း နှင့် အတည်ပြုခြင်း)
- **Purpose:** ခွင့်ရက် တောင်းခံရန်နှင့် ခွင့်ပြုရန်။
- **Who:** ဝန်ထမ်း (တင်သူ)၊ Manager (အတည်ပြုသူ)။
- **Step 1:** ဝန်ထမ်းသည် Portal မှတစ်ဆင့် <a href="#" data-article-title="Leave Management" class="text-blue-600 hover:underline">Leave</a> ပုံစံကို ဖြည့်သွင်း၍ Submit လုပ်ပါ။
- **Step 2:** Manager သည် Notification လက်ခံရရှိပြီး Leave Request ကို ဖွင့်ကြည့်ပါ။
- **Step 3:** 'Approve' သို့မဟုတ် 'Reject' ကို နှိပ်ပါ။
- **Expected Result:** Approve ဖြစ်ပါက ဝန်ထမ်း၏ Leave Balance မှ အလိုအလျောက် နုတ်သွားမည် ဖြစ်သည်။

## 8. Scenario: Create Leave Handover (ခွင့်အတွက် အလုပ်လွှဲပြောင်းခြင်း)
- **Purpose:** ခွင့်ရှည်ယူမည့် ဝန်ထမ်း၏ တာဝန်များကို လွှဲပြောင်းရန်။
- **Who:** ဝန်ထမ်း၊ Manager.
- **Step 1:** ခွင့်မတင်မီ ဝန်ထမ်းသည် <a href="#" data-article-title="Handovers" class="text-blue-600 hover:underline">Handovers</a> သို့ သွား၍ လွှဲပြောင်းမည့်သူ (Assignee) နှင့် Task များကို ဖြည့်ပါ။
- **Step 2:** လွှဲပြောင်းခံရသူမှ လက်ခံကြောင်း (Acknowledge) ပြုလုပ်ပါ။
- **Step 3:** Manager မှ ထို Handover ကို 'Completed' ဟု အတည်ပြုပါ။
- **Expected Result:** Handover ပြီးဆုံးကြောင်း မှတ်တမ်းတင်ပြီး ခွင့်ပြုရန် အဆင်သင့် ဖြစ်သွားမည်။

## 9. Scenario: Manage Daily SOP (နေ့စဉ် လုပ်ငန်းစဉ်များ လုပ်ဆောင်ခြင်း)
- **Purpose:** နေ့စဉ် အလုပ်တာဝန်များ ပြီးစီးကြောင်း မှတ်တမ်းတင်ရန်။
- **Who:** ဝန်ထမ်းတိုင်း။
- **Step 1:** Portal မှတစ်ဆင့် <a href="#" data-article-title="Daily SOPs" class="text-blue-600 hover:underline">Daily SOPs</a> သို့ ဝင်ပါ။
- **Step 2:** နေ့စဉ် လုပ်ဆောင်ရမည့် Task များကို အမှန်ခြစ် (Check) လုပ်ပါ။
- **Step 3:** 'Submit' နှိပ်ပါ။
- **Expected Result:** လုပ်ဆောင်မှု ရာခိုင်နှုန်းကို Performance Tracker သို့ ပို့ဆောင်မည် ဖြစ်သည်။

## 10. Scenario: Review Employee Performance (စွမ်းဆောင်ရည် စစ်ဆေးခြင်း)
- **Purpose:** လစဉ် ဝန်ထမ်း၏ အလုပ်လုပ်နိုင်စွမ်းကို အကဲဖြတ်ရန်။
- **Who:** Manager, HR.
- **Step 1:** <a href="#" data-article-title="Performance Tracker" class="text-blue-600 hover:underline">Performance Tracker</a> သို့ ဝင်ပါ။
- **Step 2:** ဝန်ထမ်း၏ Attendance, SOP ပြီးမြောက်မှု ရာခိုင်နှုန်းများကို ကြည့်ရှုပါ။
- **Step 3:** လိုအပ်ပါက သုံးသပ်ချက် (Feedback) ရေးပါ။
- **Expected Result:** ရမှတ်များသည် လကုန် Payroll တွင် KPI အနေဖြင့် ထည့်သွင်းတွက်ချက်မည် ဖြစ်သည်။

## 11. Scenario: Peer Voting (လုပ်ဖော်ကိုင်ဖက် အကဲဖြတ်ခြင်း)
- **Purpose:** အချင်းချင်း ပူးပေါင်းပါဝင်မှုများကို အမှတ်ပေးရန်။
- **Who:** ဝန်ထမ်းတိုင်း။
- **Step 1:** သတ်မှတ်ရက်အတွင်း Portal မှတစ်ဆင့် <a href="#" data-article-title="Peer Voting" class="text-blue-600 hover:underline">Peer Voting</a> သို့ ဝင်ပါ။
- **Step 2:** လုပ်ဖော်ကိုင်ဖက်များအား အမှတ်ပေး ရွေးချယ်ပါ။
- **Step 3:** 'Submit' နှိပ်ပါ။
- **Expected Result:** ရမှတ်များကို KPI တွက်ချက်မှုတွင် ပေါင်းထည့်မည် ဖြစ်သည်။

## 12. Scenario: Prepare Monthly Payroll (လစဉ် လစာတွက်ချက်ခြင်း)
- **Purpose:** ဝန်ထမ်းများ၏ လစာနှင့် ဆုကြေးများ တွက်ချက် ထုတ်ပေးရန်။
- **Who:** HR, Finance.
- **Step 1:** <a href="#" data-article-title="Payroll & KPI" class="text-blue-600 hover:underline">Payroll & KPI</a> သို့ သွားပါ။
- **Step 2:** သက်ဆိုင်ရာ လ (Month) ကို ရွေးချယ်၍ 'Generate Payroll' ကို နှိပ်ပါ။
- **Step 3:** တွက်ချက်မှု မှန်ကန်ပါက 'Approve' လုပ်၍ Payslip များ ထုတ်ပေးပါ။
- **Expected Result:** ဝန်ထမ်းများ၏ Portal သို့ လစာရှင်းတမ်း (Payslip) များ အလိုအလျောက် ရောက်ရှိသွားမည်။

## 13. Scenario: Find Employee Documents (စာရွက်စာတမ်းများ ရှာဖွေခြင်း)
- **Purpose:** NDA စာချုပ်များ၊ လက်မှတ်များ ရှာဖွေရန်။
- **Who:** HR.
- **Step 1:** <a href="#" data-article-title="Document Vault" class="text-blue-600 hover:underline">Document Vault</a> သို့ ဝင်ပါ။
- **Step 2:** ဝန်ထမ်းအမည် ဖြင့် ရှာဖွေပါ။
- **Step 3:** လိုအပ်သော PDF ဖိုင်ကို ကြည့်ရှု (သို့) ဒေါင်းလုဒ် ရယူပါ။
- **Expected Result:** အချက်အလက်များကို လုံခြုံစွာ ကြည့်ရှုနိုင်သည်။

## 14. Scenario: Check Organization Structure (အဖွဲ့အစည်း ဖွဲ့စည်းပုံ ကြည့်ရှုခြင်း)
- **Purpose:** မည်သူက မည်သူ့ထံ သတင်းပို့ရသည်ကို သိရှိရန်။
- **Who:** All Users.
- **Step 1:** <a href="#" data-article-title="Org Chart" class="text-blue-600 hover:underline">Org Chart</a> သို့ ဝင်ပါ။
- **Step 2:** အမည် သို့မဟုတ် ဌာနပေါ် နှိပ်၍ အောက်ခြေရှိ ဝန်ထမ်းများကို ဖြန့်ကြည့်ပါ။
- **Step 3:** (HR/Admin သာလျှင်) မန်နေဂျာ ပြောင်းလိုပါက Node ကို နှိပ်၍ 'Reassign Manager' လုပ်ပါ။
- **Expected Result:** ဖွဲ့စည်းပုံ ရှင်းလင်းစွာ မြင်ရမည်။

## 15. Scenario: Handle Employee Offboarding (အလုပ်ထွက်ခွာသူကို စီမံခြင်း)
- **Purpose:** ပစ္စည်းများ ပြန်လည်သိမ်းဆည်း၍ နောက်ဆုံးလစာ ရှင်းပေးရန်။
- **Who:** HR.
- **Step 1:** <a href="#" data-article-title="Offboarding" class="text-blue-600 hover:underline">Offboarding</a> တွင် 'Initiate' နှိပ်၍ အမည်ရွေးပါ။
- **Step 2:** လက်တော့၊ သော့ ပြန်အပ်ခြင်းနှင့် Handover ပြီးစီးမှုများကို အမှန်ခြစ်ပေးပါ။
- **Step 3:** အားလုံးပြည့်စုံပါက 'Release Final Settlement' ကို နှိပ်ပါ။ ထို့နောက် Employee Details တွင် 'Inactive' ဟု သတ်မှတ်ပေးပါ။
- **Expected Result:** ဝန်ထမ်းသည် စနစ်မှ အပြည့်အဝ ထွက်ခွာသွားမည် ဖြစ်သည်။

## 16. Scenario: Restore a Deleted Manual Article (ဖျက်လိုက်သော စာမျက်နှာကို ပြန်ယူခြင်း)
- **Purpose:** မှားယွင်းဖျက်မိသော Manual Article ကို ပြန်လည်ရယူရန်။
- **Who:** Manual Editor / Admin / Boss.
- **Step 1:** <a href="#" data-article-title="HRM Overview" class="text-blue-600 hover:underline">User Manual</a> ဘယ်ဘက် ဘေးတန်းရှိ '🗑️ Recycle Bin' ကို နှိပ်ပါ။
- **Step 2:** ပြန်ယူလိုသော ဆောင်းပါးကို ရွေးချယ်ပါ။
- **Step 3:** ညာဘက်အပေါ်ရှိ '♻️ Restore' ကို နှိပ်ပါ။
- **Expected Result:** ဆောင်းပါးသည် Draft အဖြစ် နဂိုနေရာသို့ ပြန်လည်ရောက်ရှိလာမည်။

## 17. Scenario: Manage Manual Content as an Authorized Editor (စာမျက်နှာများကို ပြင်ဆင်ခြင်း)
- **Purpose:** HRM User Manual တွင် အချက်အလက်သစ်များ ထည့်သွင်းရန်။
- **Who:** Manual Editor / Admin / Boss.
- **Step 1:** ပြင်ဆင်လိုသော Article ကို ရွေးချယ်၍ 'Edit' နှိပ်ပါ။
- **Step 2:** အချက်အလက်များ ရေးသားပြီးနောက် 'Save Draft' ကို နှိပ်ပါ။
- **Step 3:** အားလုံးမှန်ကန်ပါက 'Publish' ကို နှိပ်ပါ။
- **Expected Result:** ပြင်ဆင်ချက်များသည် သာမန် User များအားလုံးထံ ချက်ချင်း ပေါ်လာမည် ဖြစ်သည်။ (မှားယွင်းဖျက်မိပါက 🗑️ Delete (Soft Delete) ကို နှိပ်၍ Recycle Bin သို့ ပို့နိုင်သည်)။

---

## 18. Common Scenario Troubleshooting (အဖြစ်များသော အခက်အခဲများ ဖြေရှင်းခြင်း)
- **Edit/Delete ခလုတ်များ မပေါ်ခြင်း:** သင့်တွင် Manual Editor သို့မဟုတ် Boss Permission မရှိ၍ ဖြစ်ပါသည်။
- **Release Final Settlement ခလုတ် ပိတ်နေခြင်း:** Offboarding Task များအားလုံး အမှန်ခြစ် မပေးရသေး၍ သို့မဟုတ် Handover မပြီးသေး၍ ဖြစ်ပါသည်။
- **Recycle Bin မှ လုံးဝ ဖျက်ပစ်ချင်ခြင်း:** ⚠️ Hard Delete ကို Boss သို့မဟုတ် Admin အဆင့်ရှိသူကသာ နှိပ်နိုင်ပါသည်။

---

## 19. Related Modules (ဆက်စပ်သော အခန်းများ)
- <a href="#" data-article-title="Complete Employee Lifecycle" class="text-blue-600 hover:underline">Complete Employee Lifecycle</a>
- <a href="#" data-article-title="FAQ / Troubleshooting" class="text-blue-600 hover:underline">FAQ / Troubleshooting</a>
`;

    const enMarkdown = `
# Common User Scenarios

## 1. Common User Scenarios Overview
This article provides step-by-step guides for the most common tasks performed by HR and Admins in their daily work. Every step is based strictly on the actual implemented functionality of the BBD HRM system.

---

## 2. Scenario: Hire a New Employee
- **Purpose:** To officially approve a candidate for employment.
- **Who:** HR or Manager.
- **Step 1:** Navigate to the <a href="#" data-article-title="Recruitment" class="text-blue-600 hover:underline">Recruitment</a> module.
- **Step 2:** Locate the desired candidate in the pipeline.
- **Step 3:** Change their status to 'Hired'.
- **Expected Result:** The system generates an Employee Code, allowing HR to proceed to Employee Creation.

## 3. Scenario: Create Employee Record
- **Purpose:** To add a hired person to the active system database.
- **Who:** HR.
- **Step 1:** Go to the <a href="#" data-article-title="Employees" class="text-blue-600 hover:underline">Employees</a> module and click 'Create Employee'.
- **Step 2:** Fill in their personal details (Name, Email, Phone).
- **Step 3:** Click 'Save'.
- **Expected Result:** The active employee profile is created.

## 4. Scenario: Assign Department and Position
- **Purpose:** To define the employee's structural role and manager.
- **Who:** HR.
- **Step 1:** Go to <a href="#" data-article-title="Employee Details" class="text-blue-600 hover:underline">Employee Details</a> and click 'Edit'.
- **Step 2:** Select the appropriate Department and Position from the dropdowns.
- **Step 3:** Select their Direct Manager and click 'Save'.
- **Expected Result:** The employee will now appear in the \`Org Chart\` under their manager and will receive the correct \`Daily SOPs\`.

## 5. Scenario: Complete Onboarding
- **Purpose:** To track asset distribution and NDA signing for new hires.
- **Who:** HR and IT.
- **Step 1:** Go to <a href="#" data-article-title="Onboarding" class="text-blue-600 hover:underline">Onboarding</a> and select the employee.
- **Step 2:** Check off tasks like assigning a laptop, access card, and signing the NDA.
- **Step 3:** Once all tasks are 100% complete, change the status to 'Completed'.
- **Expected Result:** The employee is fully onboarded and ready for normal operations.

## 6. Scenario: Record Attendance
- **Purpose:** To log daily working hours.
- **Who:** All Employees.
- **Step 1:** Log into the Employee Portal.
- **Step 2:** Click the 'Clock In' button at the start of the day.
- **Step 3:** Click 'Clock Out' at the end of the day.
- **Expected Result:** The time logs are saved in \`Attendance\` and calculated for month-end Payroll.

## 7. Scenario: Submit and Approve Leave
- **Purpose:** To request and authorize time off.
- **Who:** Employee (Requester), Manager (Approver).
- **Step 1:** The employee submits a leave request via the <a href="#" data-article-title="Leave Management" class="text-blue-600 hover:underline">Leave</a> module in their portal.
- **Step 2:** The Manager receives a notification and opens the request.
- **Step 3:** The Manager clicks 'Approve' or 'Reject'.
- **Expected Result:** If approved, the days are deducted from the employee's Leave Balance.

## 8. Scenario: Create Leave Handover
- **Purpose:** To ensure tasks are covered during an employee's absence.
- **Who:** Employee, Manager.
- **Step 1:** Before taking long leave, the employee creates a record in <a href="#" data-article-title="Handovers" class="text-blue-600 hover:underline">Handovers</a>, selecting an assignee and listing the tasks.
- **Step 2:** The assignee clicks 'Acknowledge'.
- **Step 3:** The Manager reviews and marks it as 'Completed'.
- **Expected Result:** The handover is documented, allowing the Manager to safely approve the pending leave request.

## 9. Scenario: Manage Daily SOP
- **Purpose:** To record the completion of mandatory daily procedures.
- **Who:** All Employees.
- **Step 1:** Go to <a href="#" data-article-title="Daily SOPs" class="text-blue-600 hover:underline">Daily SOPs</a> in the portal.
- **Step 2:** Check off the completed tasks for the day.
- **Step 3:** Click 'Submit'.
- **Expected Result:** The daily completion percentage is sent to the Performance Tracker.

## 10. Scenario: Review Employee Performance
- **Purpose:** To evaluate an employee's monthly output.
- **Who:** Manager, HR.
- **Step 1:** Go to the <a href="#" data-article-title="Performance Tracker" class="text-blue-600 hover:underline">Performance Tracker</a>.
- **Step 2:** Review the automatically generated scores for Attendance and SOPs.
- **Step 3:** Add managerial feedback if necessary.
- **Expected Result:** The final score is ready to be pulled by the Payroll module for KPI bonuses.

## 11. Scenario: Peer Voting
- **Purpose:** To gather 360-degree feedback from colleagues.
- **Who:** All Employees.
- **Step 1:** During the voting window, go to <a href="#" data-article-title="Peer Voting" class="text-blue-600 hover:underline">Peer Voting</a> in the portal.
- **Step 2:** Vote and score the selected colleagues.
- **Step 3:** Click 'Submit'.
- **Expected Result:** Votes are tallied and integrated into the KPI calculation.

## 12. Scenario: Prepare Monthly Payroll
- **Purpose:** To calculate salaries, deduct leaves, and add bonuses.
- **Who:** HR, Finance.
- **Step 1:** Go to <a href="#" data-article-title="Payroll & KPI" class="text-blue-600 hover:underline">Payroll & KPI</a>.
- **Step 2:** Select the current month and click 'Generate Payroll'.
- **Step 3:** Review the calculations, click 'Approve', and generate payslips.
- **Expected Result:** Payslips become instantly available in the employees' portals.

## 13. Scenario: Find Employee Documents
- **Purpose:** To retrieve signed NDAs or other records.
- **Who:** HR.
- **Step 1:** Go to the <a href="#" data-article-title="Document Vault" class="text-blue-600 hover:underline">Document Vault</a>.
- **Step 2:** Search by the employee's name.
- **Step 3:** View or download the PDF file.
- **Expected Result:** Secure access to historical employee records.

## 14. Scenario: Check Organization Structure
- **Purpose:** To visualize reporting lines.
- **Who:** All Users.
- **Step 1:** Go to the <a href="#" data-article-title="Org Chart" class="text-blue-600 hover:underline">Org Chart</a>.
- **Step 2:** Click on a department or manager to expand the tree view.
- **Step 3:** (HR/Admin only) Click a node and select 'Reassign Manager' to change reporting lines.
- **Expected Result:** A clear visual understanding of the company hierarchy.

## 15. Scenario: Handle Employee Offboarding
- **Purpose:** To cleanly and securely process a departing employee.
- **Who:** HR.
- **Step 1:** Go to <a href="#" data-article-title="Offboarding" class="text-blue-600 hover:underline">Offboarding</a>, click 'Initiate', and select the employee.
- **Step 2:** Toggle the asset returns (Laptop, Keys) and confirm the Handover is complete.
- **Step 3:** When all tasks are 100%, click 'Release Final Settlement'. Then go to Employee Details and manually change their status to 'Inactive'.
- **Expected Result:** The employee is fully offboarded and locked out of the system.

## 16. Scenario: Restore a Deleted Manual Article
- **Purpose:** To recover an article that was accidentally deleted.
- **Who:** Manual Editor / Admin / Boss.
- **Step 1:** In the <a href="#" data-article-title="HRM Overview" class="text-blue-600 hover:underline">User Manual</a>, click the '🗑️ Recycle Bin' section at the bottom of the left sidebar.
- **Step 2:** Select the deleted article.
- **Step 3:** Click the '♻️ Restore' button in the header.
- **Expected Result:** The article is restored to 'Draft' status in its original category.

## 17. Scenario: Manage Manual Content as an Authorized Editor
- **Purpose:** To update the HRM documentation.
- **Who:** Manual Editor / Admin / Boss.
- **Step 1:** Select an article and click 'Edit'.
- **Step 2:** Make text changes and click 'Save Draft'.
- **Step 3:** Once reviewed, click 'Publish' to make it live for all users. (If you want to remove it, click 'Delete' to send it to the Recycle Bin).
- **Expected Result:** The handbook is instantly updated across the company.

---

## 18. Common Scenario Troubleshooting
- **Cannot see Edit/Delete buttons in Manual:** You do not have 'Manual Editor' or 'Boss/Admin' permissions.
- **'Release Final Settlement' is grayed out:** Ensure every single task is checked, the 4 asset toggles are green, and the Handover tab shows 100% complete (or is explicitly waived).
- **Need to permanently delete an article:** The '⚠️ Hard Delete' button inside the Recycle Bin is strictly reserved for the Boss or an Admin role. 

---

## 19. Related Modules
- <a href="#" data-article-title="Complete Employee Lifecycle" class="text-blue-600 hover:underline">Complete Employee Lifecycle</a>
- <a href="#" data-article-title="FAQ / Troubleshooting" class="text-blue-600 hover:underline">FAQ / Troubleshooting</a>
`;

    const myHtml = marked.parse(myMarkdown);
    const enHtml = marked.parse(enMarkdown);

    const { data: article, error } = await supabaseAdmin
      .from('hrm_manual_articles')
      .select('id')
      .eq('title', 'Common User Scenarios')
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

    console.log('Successfully updated Common User Scenarios article!');
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
