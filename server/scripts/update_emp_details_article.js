import { supabaseAdmin } from '../lib/supabase.js';
import { marked } from 'marked';

async function run() {
  try {
    console.log('Translating and refining Employee Details Article...');

    const myMarkdown = `
# Employee Details (ဝန်ထမ်း အသေးစိတ် အချက်အလက်များ)

## 1. Employee Details Overview (ယေဘုယျအကြောင်းအရာ)
**Employee Details** ဆိုတာ \`Employees\` စာရင်းထဲမှ ဝန်ထမ်းတစ်ဦးချင်းစီ၏ ကိုယ်ရေးအချက်အလက်၊ ရုံးတက်မှတ်တမ်း၊ ခွင့်မှတ်တမ်း နှင့် လစာစသည့် အချက်အလက် အားလုံးကို တစ်စုတစ်စည်းတည်း ကြည့်ရှုနိုင်သော စာမျက်နှာ (Profile Page) ဖြစ်ပါသည်။ 

- **ဘာအတွက် အသုံးပြုသလဲ?** ဝန်ထမ်းတစ်ဦး၏ နောက်ခံအချက်အလက်ကို အသေးစိတ် စစ်ဆေးရန်၊ အချက်အလက်များ ပြင်ဆင်ရန်နှင့် ၎င်း၏ လုပ်ငန်းခွင် မှတ်တမ်းများကို သုံးသပ်ရန် အသုံးပြုပါသည်။
- **ဘယ်သူတွေ အသုံးပြုသလဲ?** HR Manager နှင့် Admin များက အဓိက အသုံးပြုပါသည်။

**Employees List နှင့် Employee Details ဘာကွာသလဲ?**
- \`Employees List\` သည် ဝန်ထမ်း **အားလုံး** ၏ အမည်၊ ရာထူး၊ ဌာန များကို အပေါ်ယံ ဇယားဖြင့် ပြသသော နေရာဖြစ်သည်။
- \`Employee Details\` သည် ဝန်ထမ်း **တစ်ဦးချင်းစီ** ၏ အလွန် အသေးစိတ်ကျသော ရုံးတက်/ဆင်း ချိန်များ၊ ကျန်ရှိနေသော ခွင့်ရက်များ၊ Career Timeline များကိုပါ ဝင်ရောက် ကြည့်ရှုနိုင်သော နေရာဖြစ်သည်။

---

## 2. Employee Profile (ဝန်ထမ်း ပရိုဖိုင်)

Employee Details စာမျက်နှာသို့ ဝင်လိုက်သည်နှင့် ဘယ်ဘက်အခြမ်းတွင် ပရိုဖိုင်အကျဉ်းကို မြင်တွေ့ရပါမည်-

- **Avatar (ပရိုဖိုင်ပုံ):** ဝန်ထမ်း၏ ဓာတ်ပုံ။ ပုံပေါ်တွင် ကလစ်နှိပ်၍ ပုံအသစ် ပြောင်းတင် (Upload) နိုင်ပါသည်။
- **အမည် နှင့် ID:** ဝန်ထမ်း၏ အမည်အပြည့်အစုံ နှင့် Employee ID (ဥပမာ- EMP-001)။
- **Status (အခြေအနေ):** လက်ရှိ အလုပ်လုပ်နေဆဲ (Active) လား၊ အလုပ်ထွက်သွားပြီလား (Inactive) ဆိုသည်ကို ပြသပါသည်။
- **Quick Stats (အမြန် ကိန်းဂဏန်းများ):** 
  - **Peer Rating:** လုပ်ဖော်ကိုင်ဖက်များထံမှ ရရှိထားသော ပျမ်းမျှ မဲပေးမှု ရမှတ် (Peer Voting)။
  - **Total Paid (THB):** ထိုဝန်ထမ်းအား ယခုအချိန်အထိ ပေးချေထားသော စုစုပေါင်း လစာပမာဏ။

---

## 3. Employee Information (ဝန်ထမ်း အချက်အလက်များ)

ပရိုဖိုင်အောက်တွင် အောက်ပါ အခြေခံအချက်အလက်များကို ဖော်ပြထားပါသည်-

- **Department (ဌာန):** လက်ရှိ တာဝန်ထမ်းဆောင်နေသော ဌာန။
- **Position (ရာထူး):** လက်ရှိ ရာထူးအမည်။
- **Manager (အထက်လူကြီး):** ၎င်းအား တိုက်ရိုက် အုပ်ချုပ်သော Manager ၏ အမည်။ (ခွင့်တိုင်ကြားရာတွင် ဤ Manager ထံသို့ သွားပါမည်)
- **Hire Date (အလုပ်စတင်ရက်):** ကုမ္ပဏီသို့ စတင် ဝင်ရောက်ခဲ့သော ရက်စွဲ။
- **Email:** စနစ်အတွင်းသို့ Login ဝင်ရန် အသုံးပြုသော အီးမေးလ်။
- **Phone:** ဆက်သွယ်ရန် ဖုန်းနံပါတ်။

*မှတ်ချက် - ဤအချက်အလက်များမှားယွင်းနေပါက \`Edit Profile\` ကိုနှိပ်၍ ပြင်ဆင်နိုင်ပါသည်။*

---

## 4. Employee Status (ဝန်ထမ်း အခြေအနေ)

ပရိုဖိုင်အမည်၏ အောက်တွင် ဝန်ထမ်း၏ Status ကို အရောင်ဖြင့် ဖော်ပြထားပါသည်-

- **Active (အစိမ်းရောင်):** လက်ရှိ အလုပ်လုပ်ကိုင်နေသော ဝန်ထမ်းဖြစ်ပြီး စနစ်သို့ Login ဝင်ရောက်ခွင့် အပြည့်အဝ ရှိပါသည်။
- **Inactive (အနီရောင်):** အလုပ်ထွက်သွားသော (Soft Delete လုပ်ထားသော) ဝန်ထမ်းဖြစ်သည်။ Login ဝင်ခွင့်မရှိတော့ပါ။ သို့သော် ၎င်း၏ ယခင်မှတ်တမ်းများကို ဆက်လက်ကြည့်ရှုနိုင်ပါသည်။

---

## 5. Right Column Sections (အခြား မှတ်တမ်းများ)

ညာဘက်အခြမ်းတွင် အောက်ပါ အရေးကြီးသော လုပ်ငန်းခွင် မှတ်တမ်းများကို ပြသထားပါသည်-

1. **Career Timeline (လုပ်ငန်းခွင် မှတ်တိုင်များ):**
   - ရာထူးတိုးခြင်း (Promotion)၊ လစာတိုးခြင်း (Salary Raise)၊ ဌာနပြောင်းခြင်း (Department Transfer)၊ ချီးကျူးခံရခြင်း (Commendation) နှင့် သတိပေးခံရခြင်း (Warning) များကို မှတ်တမ်းတင်ထားသော နေရာဖြစ်သည်။ \`+ Add Milestone\` ကိုနှိပ်၍ အသစ်ထည့်သွင်းနိုင်ပါသည်။
2. **Attendance Overview (ရုံးတက်မှတ်တမ်း အကျဉ်း):**
   - နောက်ဆုံး (၅) ရက်စာ ရုံးတက် (Check In)၊ ရုံးဆင်း (Check Out) အချိန်များကို ပြသထားပါသည်။ နောက်ကျခြင်း (Late) ကိုလည်း အရောင်ဖြင့် ခွဲခြားပြထားပါသည်။
3. **Leave Balances (ခွင့်ရက် လက်ကျန်များ):**
   - Annual Leave, Sick Leave အစရှိသည့် ခွင့်အမျိုးအစားအလိုက် **အသုံးပြုပြီး (Used)** ရက်များနှင့် **ကျန်ရှိနေသေးသော (Remaining)** ရက်များကို ရှင်းလင်းစွာ ပြသထားပါသည်။
4. **Handover History (တာဝန်လွှဲပြောင်းမှု မှတ်တမ်း):**
   - အလုပ်ထွက်ခြင်း သို့မဟုတ် ခွင့်ရှည်ယူခြင်းတို့ကြောင့် မိမိထံမှ အခြားသူသို့ လွှဲပြောင်းပေးခဲ့သော (Outgoing) သို့မဟုတ် လက်ခံရရှိထားသော (Incoming) Handover များကို ပြသထားပါသည်။ ၎င်းကိုနှိပ်၍ အသေးစိတ်ကို ထပ်မံကြည့်ရှုနိုင်ပါသည်။
5. **KPI Records (စွမ်းဆောင်ရည် မှတ်တမ်း):**
   - Performance Tracker မှ လစဉ် အကဲဖြတ်ထားသော KPI ရမှတ်များနှင့် အခြေအနေများ (Completed / Pending) ကို ပြသထားပါသည်။

---

## 6. အချက်အလက်များ ပြောင်းလဲခြင်း၏ သက်ရောက်မှု (Impact of Changes)

\`Edit Profile\` ကိုနှိပ်၍ အချက်အလက်များ ပြင်ဆင်လိုက်ပါက System တစ်ခုလုံးသို့ ချက်ချင်း သက်ရောက်မှု ရှိပါသည်-

- **Department / Position ပြင်ဆင်ခြင်း ➔** \`Org Chart\` (ဖွဲ့စည်းပုံ) တွင် ထိုဝန်ထမ်း၏ နေရာ ချက်ချင်း ပြောင်းလဲသွားပါမည်။ လစဉ် \`Daily SOPs\` ကျလာမည့် အမျိုးအစားများလည်း ပြောင်းလဲသွားနိုင်ပါသည်။
- **Manager ပြင်ဆင်ခြင်း ➔** ဝန်ထမ်းမှ ခွင့် (Leave Request) တင်လိုက်တိုင်း ယခုပြောင်းလဲလိုက်သော Manager အသစ်ထံသို့သာ ခွင့်ပြုချက်တောင်းခံစာ (Approval) ရောက်ရှိသွားပါမည်။
- **Status ပြင်ဆင်ခြင်း (Inactive ➔ Active) ➔** Soft Delete လုပ်ထားသော ဝန်ထမ်းအား Active ပြန်ပြောင်းလိုက်ပါက ၎င်းသည် System သို့ ချက်ချင်း ပြန်လည် Login ဝင်ရောက်နိုင်မည် ဖြစ်ပါသည်။

---

## 7. အခြား Modules များနှင့် ချိတ်ဆက်မှု (Connections)

Employee Details စာမျက်နှာသည် အောက်ပါ Modules များမှ Data များကို တစ်နေရာတည်းတွင် ဆွဲယူပြသထားခြင်း (Dashboard View) ဖြစ်ပါသည်-

- **Attendance:** ရုံးတက်ချိန်များကို ဆွဲယူပြသသည်။ (Informational)
- **Leave Management:** ခွင့်လက်ကျန် (Leave Balances) များကို တွက်ချက်ပြသသည်။ (Informational)
- **Handovers:** Handover အခြေအနေများကို ပြသပြီး အသေးစိတ် (Handover Panel) ကိုပါ တိုက်ရိုက် ဖွင့်ကြည့်နိုင်ပါသည်။ (Direct Workflow)
- **Payroll & KPI:** စုစုပေါင်း ပေးချေပြီးသော လစာ (Total Paid) နှင့် KPI ရလဒ်များကို တွက်ချက်ဆွဲယူပါသည်။ (Informational)

---

## 8. လက်တွေ့ အသုံးပြုမှု (Practical Workflows)

**ဝန်ထမ်းတစ်ဦး၏ ကျန်ရှိသော ခွင့်ရက် (Leave Balances) ကို စစ်ဆေးရန်:**
1. \`Employees\` စာမျက်နှာသို့ သွားပါ။
2. မိမိရှာလိုသော ဝန်ထမ်းကို Search ဖြင့်ရှာပြီး ကလစ်နှိပ်ပါ။ (သို့မဟုတ် View ခလုတ်ကို နှိပ်ပါ)
3. ညာဘက်အခြမ်းရှိ \`Leave Balances\` အကွက်တွင် ကျန်ရှိသော ခွင့်ရက်များကို အလွယ်တကူ စစ်ဆေးကြည့်ရှုပါ။

**ရာထူးတိုးခြင်း (Promotion) အား မှတ်တမ်းတင်ရန်:**
1. ထိုဝန်ထမ်း၏ Employee Details သို့ဝင်ပါ။
2. \`Career Timeline\` ဘေးရှိ \`+ Add Milestone\` ခလုတ်ကို နှိပ်ပါ။
3. Event Type တွင် 'Promotion' ကိုရွေးပါ။ ယခင်ရာထူး နှင့် ရာထူးအသစ်၊ လစာဟောင်း နှင့် လစာသစ်တို့ကို ဖြည့်သွင်းပြီး Save လုပ်ပါ။
4. ပြီးလျှင် ဘယ်ဘက်ခြမ်းရှိ \`Edit Profile\` ကိုနှိပ်၍ လက်ရှိ Position ကို အသစ်သို့ ပြောင်းလဲသတ်မှတ်ပါ။

---

## 9. အမေးများသော မေးခွန်းများ (FAQ & Troubleshooting)

- **မေး: Career Timeline တွင် Milestone ထည့်တာနဲ့ လက်ရှိ ရာထူး အလိုလို ပြောင်းသွားသလား?**
  ဖြေ: မပြောင်းပါ။ Career Timeline သည် သမိုင်းမှတ်တမ်း (History Record) အဖြစ်သာ သိမ်းဆည်းပေးခြင်း ဖြစ်ပါသည်။ လက်ရှိ ရာထူး သို့မဟုတ် လစာကို တကယ်ပြောင်းလဲလိုပါက \`Edit Profile\` တွင် သွားရောက် ပြင်ဆင်ပေးရပါမည်။
- **မေး: Avatar ဓာတ်ပုံ တင်မရပါက ဘာလုပ်ရမလဲ?**
  ဖြေ: ပုံ၏ အရွယ်အစား (File Size) သည် 10MB အောက်သာ ရှိရပါမည်။ 10MB ထက်ကျော်လွန်ပါက Error ပြပါမည်။

---

## 10. Employee Lifecycle တွင် ပါဝင်မှု

**Employee Details** သည် Employee Lifecycle တစ်ခုလုံးတွင် အမြဲတမ်း ဝင်ရောက်ကြည့်ရှုရမည့် **"ကိုယ်ရေးဖိုင် (Master Record)"** ဖြစ်ပါသည်။
ဝန်ထမ်းအသစ် ဝင်ရောက်လာချိန် (Onboarding) မှစ၍ နေ့စဉ်အလုပ်လုပ်နေစဉ် (Attendance/Leave) နှင့် အလုပ်မှ ထွက်ခွာသွားချိန် (Offboarding) အထိ ထိုဝန်ထမ်းနှင့် သက်ဆိုင်သမျှ အရာအားလုံးကို ဤစာမျက်နှာ တစ်နေရာတည်းတွင် အလွယ်တကူ စောင့်ကြည့် စစ်ဆေးနိုင်ပါသည်။

---

## 11. ဆက်လက်ဖတ်ရှုရန် (Related Modules)

- <a href="#" data-article-title="HRM Overview" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">HRM Overview</a>
- <a href="#" data-article-title="Employees" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Employees</a>
- <a href="#" data-article-title="Departments" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Departments</a>
- <a href="#" data-article-title="Positions" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Positions</a>
- <a href="#" data-article-title="Attendance" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Attendance</a>
- <a href="#" data-article-title="Leave Management" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Leave Management</a>
- <a href="#" data-article-title="Payroll & KPI" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Payroll & KPI</a>
- <a href="#" data-article-title="Offboarding" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Offboarding</a>
`;

    const enMarkdown = `
# Employee Details

## 1. Employee Details Overview
The **Employee Details** page is the comprehensive Profile View for an individual employee. It consolidates their personal information, attendance logs, leave balances, and career history all into one single, easy-to-read page.

- **What is it used for?** It is used to deeply inspect an employee's background, update their core information, and review their work history (like KPIs or Handovers).
- **Who uses it?** Primarily utilized by HR Managers and Admins for employee management.

**Employees List vs Employee Details:**
- The \`Employees List\` is a high-level table showing basic details (Name, Position) of **all** staff.
- The \`Employee Details\` is a deep-dive into a **single** employee, showing exactly how many leaves they have left, their exact clock-in times, and their entire career milestones.

---

## 2. Employee Profile 

When you open an Employee Details page, the left column displays their Profile summary:

- **Avatar:** The employee's profile picture. Clicking on the image allows you to upload a new one.
- **Name & ID:** The full legal name and unique Employee ID (e.g., EMP-001).
- **Status:** Shows whether the employee is currently 'Active' or 'Inactive'.
- **Quick Stats:** 
  - **Peer Rating:** The average score this employee has received from co-workers via Peer Voting.
  - **Total Paid (THB):** The total sum of salary that has been historically paid out to this employee.

---

## 3. Employee Information

Below the Avatar, the system displays the core employment information:

- **Department:** The department they are currently assigned to.
- **Position:** Their official job title.
- **Manager:** The name of their direct supervisor. (This dictates who approves their leave requests).
- **Hire Date:** The official date they joined the company.
- **Email:** The email address used to log into the HRM portal.
- **Phone:** Contact number.

*Note: If any of this information is outdated, you can click \`Edit Profile\` to update it.*

---

## 4. Employee Status

Directly under the employee's name, you will see a colored badge representing their Status:

- **Active (Green):** The employee is currently employed and has full login access to the system.
- **Inactive (Red):** The employee has resigned or been Soft Deleted. They can no longer log in, but their historical data (like past attendance and payroll) remains visible here.

---

## 5. Right Column Sections (Work Records)

The right column provides detailed insights into the employee's interactions with the HRM system:

1. **Career Timeline:**
   - A historical log of important milestones such as Promotions, Salary Raises, Department Transfers, Commendations, and Warnings. Admins can click \`+ Add Milestone\` to record a new event.
2. **Attendance Overview:**
   - Shows the last 5 days of Check In and Check Out times. It also explicitly highlights if the employee was 'Late' or 'On Time'.
3. **Leave Balances:**
   - A grid displaying all eligible leave types (e.g., Annual Leave, Sick Leave). It clearly shows how many days have been **Used** and how many days are **Remaining**.
4. **Handover History:**
   - A list of tasks the employee has handed over to someone else (Outgoing) or taken over from someone else (Incoming). Clicking on an item opens the detailed Handover Panel.
5. **KPI Records:**
   - Displays recent Performance Tracker evaluations, showing the KPI title, due date, and whether it is 'Completed' or 'Pending'.

---

## 6. Impact of Information Changes

Clicking \`Edit Profile\` and updating data has an immediate, system-wide effect:

- **Changing Department / Position ➔** The employee is instantly moved to the correct node on the \`Org Chart\`. This may also change which \`Daily SOPs\` they are automatically assigned next month.
- **Changing Manager ➔** Any future Leave Requests submitted by this employee will instantly route to the new Manager for approval.
- **Changing Status (Inactive ➔ Active) ➔** If you 'Restore' an inactive employee, their system login access is instantly reactivated.

---

## 7. Connections to Other Modules

The Employee Details page acts as a read-only Dashboard pulling data from various modules:

- **Attendance:** Pulls the latest check-in records. (Informational).
- **Leave Management:** Calculates and displays remaining leave balances based on approved requests. (Informational).
- **Handovers:** Pulls handover status and allows you to open the detail modal directly. (Direct Workflow).
- **Payroll & KPI:** Aggregates the total historical salary paid and displays KPI scores. (Informational).

---

## 8. Practical Workflows

**How to check an employee's Leave Balances:**
1. Go to the \`Employees\` page.
2. Search for the employee and click on their row to open Employee Details.
3. Look at the \`Leave Balances\` section on the right side to see exactly how many days they have left.

**How to record a Promotion:**
1. Open the Employee Details page for the promoted staff.
2. Click \`+ Add Milestone\` next to the Career Timeline.
3. Select 'Promotion' as the Event Type. Fill in their previous position, new position, old salary, and new salary, then click Save.
4. Finally, click \`Edit Profile\` on the left panel to actually update their current Position field to the new title.

---

## 9. FAQ & Troubleshooting

- **Q: Does adding a 'Promotion' to the Career Timeline automatically update their actual Position or Salary in the system?**
  A: No. The Career Timeline is strictly a historical log for record-keeping. To actually change their current title or salary (so Payroll calculates it correctly), you must click \`Edit Profile\` and update the core fields.
- **Q: I can't upload an Avatar image, it shows an error.**
  A: Ensure the image file size is less than 10MB. The system rejects files larger than this limit.

---

## 10. Role in the Employee Lifecycle

The **Employee Details** page is the ultimate **"Master File"** referenced throughout the entire Employee Lifecycle. 
From the day they finish Onboarding, throughout their daily working life (Attendance/Leave), during performance reviews (KPI), and up until their eventual Offboarding, HR will constantly refer back to this page to get a complete 360-degree view of the employee's standing in the company.

---

## 11. Related Modules

- <a href="#" data-article-title="HRM Overview" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">HRM Overview</a>
- <a href="#" data-article-title="Employees" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Employees</a>
- <a href="#" data-article-title="Departments" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Departments</a>
- <a href="#" data-article-title="Positions" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Positions</a>
- <a href="#" data-article-title="Attendance" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Attendance</a>
- <a href="#" data-article-title="Leave Management" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Leave Management</a>
- <a href="#" data-article-title="Payroll & KPI" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Payroll & KPI</a>
- <a href="#" data-article-title="Offboarding" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Offboarding</a>
`;

    const myHtml = marked.parse(myMarkdown);
    const enHtml = marked.parse(enMarkdown);

    // Update in Database
    const { data: article, error } = await supabaseAdmin
      .from('hrm_manual_articles')
      .select('id, title, published_content, draft_content')
      .eq('title', 'Employee Details')
      .single();

    if (error || !article) {
      console.log('Employee Details article not found in Database!');
      return;
    }

    const payload = JSON.stringify({ my: myHtml, en: enHtml });

    await supabaseAdmin.from('hrm_manual_articles').update({
      draft_content: payload,
      published_content: payload,
      status: 'published'
    }).eq('id', article.id);

    console.log('Successfully updated Employee Details article with structured Burmese and English JSON!');

  } catch (err) {
    console.error('Error:', err);
  }
}

run();
