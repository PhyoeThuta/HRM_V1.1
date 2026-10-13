import { supabaseAdmin } from '../lib/supabase.js';
import { marked } from 'marked';

async function run() {
  try {
    console.log('Translating and refining Complete Employee Lifecycle Article...');

    const myMarkdown = `
# Complete Employee Lifecycle (ဝန်ထမ်းဘဝဖြစ်စဉ် အပြည့်အစုံ)

## 1. Complete Employee Lifecycle Overview (ယေဘုယျအကြောင်းအရာ)
BBD HRM စနစ်သည် ဝန်ထမ်းတစ်ဦး၏ စတင်အလုပ်လျှောက်ထားချိန်မှစ၍ အလုပ်မှထွက်ခွာသွားချိန်အထိ လုပ်ငန်းစဉ်များ (Employee Lifecycle) အားလုံးကို ချိတ်ဆက်စီမံပေးပါသည်။
အဓိက အဆင့်များမှာ-
**Recruitment → Hiring → Employee Creation → Department & Position → Onboarding → Attendance & Leave → Daily SOPs → Performance & KPI → Payroll → Offboarding → Employee Exit** ဖြစ်ပါသည်။

ဤဖြစ်စဉ်များတွင် အချို့သောအရာများသည် စနစ်မှ အလိုအလျောက် (Automatic) ချိတ်ဆက်ဆောင်ရွက်ပေးပြီး၊ အချို့မှာ HR သို့မဟုတ် Manager မှ ကိုယ်တိုင် (Manual) ရွေးချယ်ဆောင်ရွက်ပေးရပါသည်။

---

## 2. Recruitment → Hiring (အလုပ်ခေါ်ယူခြင်းမှ ခန့်အပ်ခြင်း)
- **WHAT:** အလုပ်လျှောက်ထားသူ (Candidate) များကို ခြေရာခံခြင်း၊ အင်တာဗျူးခြင်းနှင့် အလုပ်ခန့်အပ်ရန် ဆုံးဖြတ်ခြင်း။
- **WHO:** HR နှင့် Interviewer များ။
- **MODULE:** <a href="#" data-article-title="Recruitment" class="text-blue-600 hover:underline">Recruitment</a>
- **NEXT STAGE:** Candidate ၏ Status ကို 'Hired' ဟု ပြောင်းလိုက်သောအခါ စနစ်မှ "Employee Code" အသစ်တစ်ခု အလိုအလျောက် ထုတ်ပေးပြီး Employee Creation သို့ ကူးပြောင်းပါသည်။

## 3. Employee Creation (ဝန်ထမ်းအသစ် ဖန်တီးခြင်း)
- **WHAT:** Hired ဖြစ်သွားသော Candidate အား ဝန်ထမ်းအဖြစ် စနစ်တွင်းသို့ ထည့်သွင်းခြင်း။
- **WHO:** HR.
- **MODULE:** <a href="#" data-article-title="Employees" class="text-blue-600 hover:underline">Employees</a> 
- **NEXT STAGE:** ဝန်ထမ်း၏ ကိုယ်ရေးအချက်အလက်များကို ဖြည့်သွင်းပြီးပါက Department နှင့် Position သတ်မှတ်ပေးရပါမည်။

## 4. Department & Position Assignment (ဌာနနှင့် ရာထူး သတ်မှတ်ခြင်း)
- **WHAT:** ဝန်ထမ်းအား သက်ဆိုင်ရာ ဌာန (Department) နှင့် ရာထူး (Position) တွဲဖက်ပေးခြင်း။
- **WHO:** HR.
- **MODULE:** <a href="#" data-article-title="Employee Details" class="text-blue-600 hover:underline">Employee Details</a>, <a href="#" data-article-title="Departments" class="text-blue-600 hover:underline">Departments</a>, <a href="#" data-article-title="Positions" class="text-blue-600 hover:underline">Positions</a>
- **NEXT STAGE:** ဤအချက်အလက်များအပေါ် မူတည်၍ Org Chart နှင့် KPI များ ချိတ်ဆက်သွားမည်ဖြစ်ပြီး Onboarding စတင်နိုင်ပါသည်။

## 5. Onboarding (ကြိုဆိုခြင်း လုပ်ငန်းစဉ်)
- **WHAT:** ဝန်ထမ်းသစ်အား ကုမ္ပဏီအကြောင်း မိတ်ဆက်ပေးခြင်း၊ ပစ္စည်းများ ထုတ်ပေးခြင်း။
- **WHO:** HR, IT, နှင့် သက်ဆိုင်ရာ Manager.
- **MODULE:** <a href="#" data-article-title="Onboarding" class="text-blue-600 hover:underline">Onboarding</a>
- **NEXT STAGE:** Onboarding ပြီးဆုံးပါက ဝန်ထမ်းသည် ပုံမှန် လုပ်ငန်းခွင်သို့ ဝင်ရောက်မည်ဖြစ်ပြီး Attendance စတင် မှတ်သားမည် ဖြစ်ပါသည်။

## 6. Attendance (အလုပ်တက်ရောက်မှု)
- **WHAT:** နေ့စဉ် အလုပ်ဝင်/အလုပ်ဆင်း အချိန်မှတ်သားခြင်း (Clock In/Out)။
- **WHO:** ဝန်ထမ်းတိုင်း။
- **MODULE:** <a href="#" data-article-title="Attendance" class="text-blue-600 hover:underline">Attendance</a>
- **NEXT STAGE:** Attendance မှတ်တမ်းများသည် လကုန်တွင် Payroll တွက်ချက်မှုအတွက် အသုံးပြုပါသည်။

## 7. Leave Management (ခွင့်တိုင်ကြားခြင်း)
- **WHAT:** ခွင့်တိုင်ကြားခြင်းနှင့် ခွင့်ပြုခြင်း။
- **WHO:** ဝန်ထမ်း (တိုင်ကြားသူ)၊ Manager/HR (အတည်ပြုသူ)။
- **MODULE:** <a href="#" data-article-title="Leave Management" class="text-blue-600 hover:underline">Leave Management</a>
- **NEXT STAGE:** ခွင့်ရက် ၃ ရက်နှင့်အထက်ဖြစ်ပါက Handover တောင်းခံရန် လိုအပ်နိုင်ပါသည်။ ခွင့်မှတ်တမ်းများသည်လည်း Payroll သို့ သက်ရောက်မှုရှိပါသည်။

## 8. Handovers (အလုပ်လွှဲပြောင်းခြင်း)
- **WHAT:** ခွင့်ရှည်ယူခြင်း သို့မဟုတ် အလုပ်ထွက်ခြင်းတို့အတွက် မိမိ၏ တာဝန်များကို အခြားဝန်ထမ်းတစ်ဦးထံ လွှဲပြောင်းပေးခြင်း။
- **WHO:** ဝန်ထမ်း၊ Manager.
- **MODULE:** <a href="#" data-article-title="Handovers" class="text-blue-600 hover:underline">Handovers</a>
- **NEXT STAGE:** Handover ပြီးဆုံးမှသာ Leave အတည်ပြုခြင်း သို့မဟုတ် Offboarding ဆက်လက်လုပ်ဆောင်ခြင်းများကို ပြုလုပ်နိုင်ပါမည်။

## 9. Daily SOPs (နေ့စဉ် လုပ်ငန်းစဉ်များ)
- **WHAT:** မိမိရာထူးအလိုက် သတ်မှတ်ထားသော နေ့စဉ်လုပ်ဆောင်ရမည့် အလုပ်များ (SOPs) ကို လုပ်ဆောင်ပြီး မှတ်တမ်းတင်ခြင်း။
- **WHO:** ဝန်ထမ်း။
- **MODULE:** <a href="#" data-article-title="Daily SOPs" class="text-blue-600 hover:underline">Daily SOPs</a>
- **NEXT STAGE:** SOP ပြီးမြောက်မှု ရာခိုင်နှုန်းသည် လစဉ် Performance / KPI သို့ ချိတ်ဆက်သွားပါသည်။

## 10. Performance Tracker (စွမ်းဆောင်ရည် စစ်ဆေးခြင်း)
- **WHAT:** ဝန်ထမ်းများ၏ လုပ်ငန်းစွမ်းဆောင်ရည် (SOP, Attendance, Project, စသည်) ကို စောင့်ကြည့် အကဲဖြတ်ခြင်း။
- **WHO:** Manager, HR.
- **MODULE:** <a href="#" data-article-title="Performance Tracker" class="text-blue-600 hover:underline">Performance Tracker</a>
- **NEXT STAGE:** Performance ရမှတ်များသည် Payroll & KPI တွက်ချက်ရာတွင် အဓိက အထောက်အကူ ပြုပါသည်။

## 11. Peer Voting (လုပ်ဖော်ကိုင်ဖက် အကဲဖြတ်ခြင်း)
- **WHAT:** ဝန်ထမ်းအချင်းချင်း စွမ်းဆောင်ရည်နှင့် ပူးပေါင်းပါဝင်မှုများကို မဲပေး အကဲဖြတ်ခြင်း။
- **WHO:** ဝန်ထမ်းများ။
- **MODULE:** <a href="#" data-article-title="Peer Voting" class="text-blue-600 hover:underline">Peer Voting</a>
- **NEXT STAGE:** မဲရလဒ်များကို KPI တွက်ချက်မှုတွင် ထည့်သွင်းစဉ်းစားပါသည်။

## 12. Payroll & KPI (လစာနှင့် ဆုကြေး)
- **WHAT:** Attendance, Leave, Performance, SOP, နှင့် Peer Voting ရလဒ်များအားလုံးကို ပေါင်းစပ်၍ လစဉ် လစာနှင့် KPI ဘောနပ်စ်များ တွက်ချက်ခြင်း။
- **WHO:** HR, Finance, Boss.
- **MODULE:** <a href="#" data-article-title="Payroll & KPI" class="text-blue-600 hover:underline">Payroll & KPI</a>
- **NEXT STAGE:** လစာထုတ်ပေးခြင်း။

## 13. Document Vault (စာရွက်စာတမ်းများ သိမ်းဆည်းခြင်း)
- **WHAT:** ဝန်ထမ်းနှင့် သက်ဆိုင်သော စာချုပ်များ၊ လက်မှတ်များ၊ လစာရှင်းတမ်း (Payslip) စသည်တို့ကို သိမ်းဆည်းခြင်း။
- **WHO:** HR, ဝန်ထမ်း (ကြည့်ရှုရန်)။
- **MODULE:** <a href="#" data-article-title="Document Vault" class="text-blue-600 hover:underline">Document Vault</a>

## 14. Org Chart (အဖွဲ့အစည်း ဖွဲ့စည်းပုံ)
- **WHAT:** ဝန်ထမ်းများ၏ ဖွဲ့စည်းပုံ၊ အထက်လူကြီး (Manager) နှင့် လက်အောက်ငယ်သား ဆက်သွယ်မှုကို ပြသခြင်း။
- **WHO:** All Users.
- **MODULE:** <a href="#" data-article-title="Org Chart" class="text-blue-600 hover:underline">Org Chart</a>

## 15. Offboarding (အလုပ်ထွက်ခွာခြင်း)
- **WHAT:** ဝန်ထမ်းမှ အလုပ်ထွက်မည့်အခါ ပစ္စည်းများ ပြန်အပ်ခြင်း၊ အလုပ်လွှဲပြောင်းခြင်း (Handover) နှင့် နောက်ဆုံးလစာ (Final Settlement) ထုတ်ပေးရန် စစ်ဆေးခြင်း။
- **WHO:** HR, Manager, ထွက်ခွာမည့် ဝန်ထမ်း။
- **MODULE:** <a href="#" data-article-title="Offboarding" class="text-blue-600 hover:underline">Offboarding</a>
- **NEXT STAGE:** Offboarding Checklist နှင့် Handover 100% ပြီးစီးမှသာ Final Settlement ကို Release ပြုလုပ်နိုင်ပါသည်။

## 16. Employee Exit (စနစ်မှ ပယ်ဖျက်ခြင်း)
- **WHAT:** အလုပ်ထွက်ခွာပြီးသော ဝန်ထမ်းအား စနစ်ထဲသို့ ဝင်ခွင့်ပိတ်ခြင်း။
- **WHO:** HR.
- **MODULE:** <a href="#" data-article-title="Employee Details" class="text-blue-600 hover:underline">Employee Details</a>
- **NEXT STAGE:** Employee Details တွင် Status ကို "Inactive" သို့မဟုတ် "Offboarded" ပြောင်းလိုက်ပါက Org Chart မှ ပျောက်သွားမည်ဖြစ်ပြီး၊ Login ဝင်ခွင့် အလိုအလျောက် ပိတ်သွားမည် ဖြစ်ပါသည်။ (Offboarding ပြီးဆုံးရုံဖြင့် အလိုအလျောက် Inactive မဖြစ်ပါ၊ HR မှ ကိုယ်တိုင် ပြောင်းပေးရပါမည်)။

---

## 17. Lifecycle Data Flow (အချက်အလက် စီးဆင်းမှု)
Modules များသည် အောက်ပါအတိုင်း ချိတ်ဆက်ထားပါသည်-
- **Recruitment** ➝ Employee ID ဖန်တီးပေးသည်။
- **Employees** ➝ Org Chart, Leave, Attendance အစရှိသည့် Module များအားလုံး၏ အခြေခံ ဖြစ်သည်။
- **Positions** ➝ Daily SOPs နှင့် ချိတ်ဆက်သည်။
- **Attendance/Leave/SOP/Peer Voting** ➝ Payroll တွင် ပေါင်းစပ်တွက်ချက်သည်။
- **Offboarding** ➝ Handover မပြီးမချင်း Final Settlement ပိတ်ထားသည်။

---

## 18. Practical Complete Employee Example (လက်တွေ့ ဥပမာ)
1. **Candidate:** ဦးမြ သည် Recruitment တွင် 'Hired' ဖြစ်သွားသည်။
2. **Created:** HR မှ ဦးမြ ကို "Marketing Manager" (Position) အဖြစ် "Marketing Dept" (Department) သို့ ထည့်သွင်းလိုက်သည်။
3. **Onboarding:** Laptop ထုတ်ပေးပြီး NDA လက်မှတ်ထိုးသည်။
4. **Daily:** ဦးမြ သည် နေ့စဉ် Clock In (Attendance) လုပ်ပြီး၊ နေ့စဉ် Marketing SOPs များကို ဖြည့်စွက်သည်။
5. **Month End:** HR မှ သူ၏ Attendance, Leave, SOP ပြီးမြောက်မှုများကို ကြည့်၍ (Performance Tracker) Payroll တွက်ချက်သည်။
6. **Exit:** ၂ နှစ်အကြာတွင် ဦးမြ အလုပ်ထွက်သည်။ Offboarding စတင်သည်။
7. **Handover:** ဦးမြ မှ သူ၏ လုပ်ငန်းများကို လက်ထောက်ထံ Handover လုပ်သည်။
8. **Settlement:** Handover နှင့် Clearance များ ပြီးဆုံးသဖြင့် HR မှ Final Settlement ရှင်းပေးသည်။
9. **Inactive:** HR မှ Employee Details တွင် ဦးမြ ကို 'Inactive' ပြောင်းလိုက်သဖြင့် Org Chart မှ ပျောက်သွားပြီး စနစ် ဝင်ခွင့် ပိတ်သွားသည်။

---

## 19. Common Lifecycle Problems (တွေ့ကြုံရလေ့ရှိသော ပြဿနာများ)
- **Payroll တွက်မရခြင်း:** ဝန်ထမ်း၏ Attendance သို့မဟုတ် Leave မှတ်တမ်းများ မပြည့်စုံခြင်းကြောင့် ဖြစ်နိုင်ပါသည်။
- **Offboarding ပိတ်နေခြင်း:** Handover မလုပ်ထားလျှင် သို့မဟုတ် Waive မလုပ်ထားလျှင် Final Settlement နှိပ်၍ မရပါ။

---

## 20. Important Lifecycle Notes (အရေးကြီး မှတ်သားဖွယ်ရာများ)
- Status Changes (ဥပမာ - Active မှ Inactive သို့ ပြောင်းခြင်း) သည် **Manual** လုပ်ဆောင်ရခြင်း ဖြစ်သည်။ စနစ်မှ အလိုအလျောက် ပယ်ဖျက်ပေးမည် မဟုတ်ပါ။
- Data များသည် တစ်ခုနှင့်တစ်ခု ချိတ်ဆက်နေသဖြင့် အစပိုင်း (Employee Creation) တွင် အချက်အလက်များ မှန်ကန်စွာ ဖြည့်သွင်းရန် အလွန်အရေးကြီးပါသည်။

---

## 21. Related Modules (ဆက်စပ်သော အခန်းများ)
- <a href="#" data-article-title="Cross-Module Workflow" class="text-blue-600 hover:underline">Cross-Module Workflow</a>
- <a href="#" data-article-title="Common User Scenarios" class="text-blue-600 hover:underline">Common User Scenarios</a>
- <a href="#" data-article-title="Employees" class="text-blue-600 hover:underline">Employees</a>
`;

    const enMarkdown = `
# Complete Employee Lifecycle

## 1. Complete Employee Lifecycle Overview
The BBD HRM system is designed to manage the entire journey of an employee, from the moment they apply for a job to the day they leave the company. 
The core lifecycle is:
**Recruitment → Hiring → Employee Creation → Department & Position → Onboarding → Attendance & Leave → Daily SOPs → Performance & KPI → Payroll → Offboarding → Employee Exit**.

Throughout this lifecycle, some transitions and data flow automatically (Automatic), while others require deliberate approval or action from HR or Managers (Manual).

---

## 2. Recruitment → Hiring
- **WHAT:** Tracking candidates, conducting interviews, and making hiring decisions.
- **WHO:** HR and Interviewers.
- **MODULE:** <a href="#" data-article-title="Recruitment" class="text-blue-600 hover:underline">Recruitment</a>
- **NEXT STAGE:** When a candidate's status is changed to 'Hired', the system automatically generates a new "Employee Code" and prepares them for Employee Creation.

## 3. Employee Creation
- **WHAT:** Converting a hired candidate into an official system employee.
- **WHO:** HR.
- **MODULE:** <a href="#" data-article-title="Employees" class="text-blue-600 hover:underline">Employees</a>
- **NEXT STAGE:** After filling in basic details, the employee must be assigned a Department and Position.

## 4. Department & Position Assignment
- **WHAT:** Linking the employee to their structural role.
- **WHO:** HR.
- **MODULE:** <a href="#" data-article-title="Employee Details" class="text-blue-600 hover:underline">Employee Details</a>, <a href="#" data-article-title="Departments" class="text-blue-600 hover:underline">Departments</a>, <a href="#" data-article-title="Positions" class="text-blue-600 hover:underline">Positions</a>
- **NEXT STAGE:** This placement automatically updates the Org Chart, determines their Daily SOPs, and allows Onboarding to begin.

## 5. Onboarding
- **WHAT:** Welcoming the employee, assigning assets, and completing joining formalities.
- **WHO:** HR, IT, Manager.
- **MODULE:** <a href="#" data-article-title="Onboarding" class="text-blue-600 hover:underline">Onboarding</a>
- **NEXT STAGE:** Upon completion, the employee begins regular work and starts logging Attendance.

## 6. Attendance
- **WHAT:** Daily Clock In and Clock Out.
- **WHO:** All Employees.
- **MODULE:** <a href="#" data-article-title="Attendance" class="text-blue-600 hover:underline">Attendance</a>
- **NEXT STAGE:** Attendance logs are aggregated at month-end for Payroll processing.

## 7. Leave Management
- **WHAT:** Requesting and approving time off.
- **WHO:** Employee (Requests), Manager/HR (Approves).
- **MODULE:** <a href="#" data-article-title="Leave Management" class="text-blue-600 hover:underline">Leave Management</a>
- **NEXT STAGE:** Leave requests of 3+ days may trigger a Handover requirement. Leave deductions directly impact Payroll.

## 8. Handovers
- **WHAT:** Transferring tasks and responsibilities to a colleague before a long leave or resignation.
- **WHO:** Employee, Manager.
- **MODULE:** <a href="#" data-article-title="Handovers" class="text-blue-600 hover:underline">Handovers</a>
- **NEXT STAGE:** A completed Handover unlocks pending Leave approvals or the Offboarding final settlement.

## 9. Daily SOPs
- **WHAT:** Executing and recording role-specific daily standard operating procedures.
- **WHO:** Employee.
- **MODULE:** <a href="#" data-article-title="Daily SOPs" class="text-blue-600 hover:underline">Daily SOPs</a>
- **NEXT STAGE:** The completion rate of SOPs is tracked continuously and fed into the Performance Tracker and KPI.

## 10. Performance Tracker
- **WHAT:** Monitoring and evaluating employee output (SOPs, Attendance, Projects).
- **WHO:** Manager, HR.
- **MODULE:** <a href="#" data-article-title="Performance Tracker" class="text-blue-600 hover:underline">Performance Tracker</a>
- **NEXT STAGE:** These metrics are essential for calculating final KPI bonuses in Payroll.

## 11. Peer Voting
- **WHAT:** Employees evaluating their colleagues' teamwork and performance.
- **WHO:** Employees.
- **MODULE:** <a href="#" data-article-title="Peer Voting" class="text-blue-600 hover:underline">Peer Voting</a>
- **NEXT STAGE:** Results are factored into KPI calculations.

## 12. Payroll & KPI
- **WHAT:** Combining data from Attendance, Leave, SOPs, and Performance to calculate the final monthly salary and bonuses.
- **WHO:** HR, Finance, Boss.
- **MODULE:** <a href="#" data-article-title="Payroll & KPI" class="text-blue-600 hover:underline">Payroll & KPI</a>
- **NEXT STAGE:** Issuing the monthly paycheck and generating payslips.

## 13. Document Vault
- **WHAT:** Secure storage for employee contracts, NDAs, and payslips.
- **WHO:** HR, Employee (View-only).
- **MODULE:** <a href="#" data-article-title="Document Vault" class="text-blue-600 hover:underline">Document Vault</a>

## 14. Org Chart
- **WHAT:** The visual hierarchy showing reporting lines based on employee data.
- **WHO:** All Users.
- **MODULE:** <a href="#" data-article-title="Org Chart" class="text-blue-600 hover:underline">Org Chart</a>

## 15. Offboarding
- **WHAT:** The exit process requiring asset returns, knowledge transfer, and final checks before the last paycheck is released.
- **WHO:** HR, Manager, Departing Employee.
- **MODULE:** <a href="#" data-article-title="Offboarding" class="text-blue-600 hover:underline">Offboarding</a>
- **NEXT STAGE:** The "Release Final Settlement" button remains locked until the checklist and Handover are 100% complete.

## 16. Employee Exit
- **WHAT:** Revoking system access and removing the employee from active directories.
- **WHO:** HR.
- **MODULE:** <a href="#" data-article-title="Employee Details" class="text-blue-600 hover:underline">Employee Details</a>
- **NEXT STAGE:** Changing the employee status to "Inactive" or "Offboarded" automatically removes them from the Org Chart and revokes login access. (Note: Completing Offboarding does *not* do this automatically; HR must change the status manually).

---

## 17. Lifecycle Data Flow
Key connections in the system:
- **Recruitment** ➝ Generates the initial Employee ID.
- **Employees** ➝ The central hub; all other modules require an active employee profile.
- **Positions** ➝ Dictates which Daily SOPs the employee must complete.
- **Attendance/Leave/SOP/Peer Voting** ➝ All feed into Payroll.
- **Offboarding** ➝ Hard-linked to Handovers; final settlement is blocked if handover is incomplete.

---

## 18. Practical Complete Employee Example
1. **Candidate:** John is marked as 'Hired' in Recruitment.
2. **Created:** HR creates John's profile, assigning him as "Marketing Manager" in the "Marketing" Department.
3. **Onboarding:** John receives his laptop and signs his NDA via the Onboarding checklist.
4. **Daily:** John clocks in daily (Attendance) and ticks off his marketing checklists (Daily SOPs).
5. **Month End:** HR processes Payroll, automatically pulling John's perfect attendance and 95% SOP completion rate for his KPI bonus.
6. **Exit:** Two years later, John resigns. HR initiates Offboarding.
7. **Handover:** John uses the Handovers module to transfer his ongoing campaigns to his assistant.
8. **Settlement:** Once the Handover is 100% approved, HR clicks "Release Final Settlement".
9. **Inactive:** Finally, HR edits John's Employee Details, changing his status to 'Inactive', instantly locking his account and removing him from the Org Chart.

---

## 19. Common Lifecycle Problems
- **Inaccurate Payroll:** Usually caused by incomplete Attendance logs or unapproved Leaves.
- **Blocked Offboarding Settlement:** The "Release Final Settlement" button will not work if the Handover is not 100% complete (or explicitly waived by HR).

---

## 20. Important Lifecycle Notes
- **Status changes are Manual:** The system does not automatically deactivate an employee when their Offboarding is finished. HR must explicitly change their status to 'Inactive'.
- **Garbage In, Garbage Out:** Because the lifecycle is deeply interconnected, failing to assign a Department or Position during Employee Creation will break the Org Chart and Daily SOPs downstream.

---

## 21. Related Modules
- <a href="#" data-article-title="Cross-Module Workflow" class="text-blue-600 hover:underline">Cross-Module Workflow</a>
- <a href="#" data-article-title="Common User Scenarios" class="text-blue-600 hover:underline">Common User Scenarios</a>
- <a href="#" data-article-title="Employees" class="text-blue-600 hover:underline">Employees</a>
`;

    const myHtml = marked.parse(myMarkdown);
    const enHtml = marked.parse(enMarkdown);

    // Update in Database
    const { data: article, error } = await supabaseAdmin
      .from('hrm_manual_articles')
      .select('id')
      .eq('title', 'Complete Employee Lifecycle')
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

    console.log('Successfully updated Complete Employee Lifecycle article!');
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
