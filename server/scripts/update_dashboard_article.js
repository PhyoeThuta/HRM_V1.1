import { supabaseAdmin } from '../lib/supabase.js';
import { marked } from 'marked';

async function run() {
  try {
    console.log('Translating and refining Dashboard Article...');

    const myMarkdown = `
# Dashboard (ပင်မစာမျက်နှာ)

## 1. Dashboard ဆိုတာဘာလဲ? (Dashboard Overview)
**Dashboard** ဆိုတာ BBD HRM စနစ်တစ်ခုလုံးရဲ့ အရေးကြီးတဲ့ အချက်အလက်တွေကို တစ်နေရာတည်းမှာ အလွယ်တကူ စုစည်းကြည့်ရှုနိုင်တဲ့ "ပင်မထိန်းချုပ်ခန်း" (Control Center) ဖြစ်ပါတယ်။ 
BBD HRM System တွင် Dashboard ၏ အဓိက ရည်ရွယ်ချက်မှာ Module အသီးသီး (Employees, Attendance, Leave, Payroll အစရှိသည်) မှ အရေးကြီးသော Data များကို အနှစ်ချုပ်ပြီး အချိန်တိုအတွင်း ဆုံးဖြတ်ချက်ချနိုင်ရန် ဖြစ်ပါသည်။

**ဘယ်သူတွေ အသုံးပြုသလဲ?**
- **Boss / Admin / HR Manager** များသည် ကုမ္ပဏီ၏ ယေဘုယျအခြေအနေ (ဥပမာ - ရုံးတက်သူ အရေအတွက်၊ ခွင့်ယူသူ အရေအတွက်၊ လစာပေးချေမှု) ကို စောင့်ကြည့်ရန် အဓိက အသုံးပြုပါသည်။

**ဘယ်အချိန်မှာ အသုံးပြုသင့်သလဲ?**
- နေ့စဉ် မနက် ရုံးစတက်ချိန်တွင် ရုံးတက်ရောက်မှု အခြေအနေများကို အမြန်ကြည့်လိုချိန်။
- အရေးကြီးသော လုပ်ဆောင်ရန် (Pending tasks) များ ရှိမရှိ စစ်ဆေးလိုချိန်။
- Module အသီးသီးသို့ အမြန်သွားရောက်လိုချိန် (Quick Actions) တွင် အသုံးပြုပါသည်။

---

## 2. Dashboard မှာ ဘာတွေမြင်နိုင်သလဲ (What you can see)

Dashboard သည် အောက်ပါ အဓိက အပိုင်း (၆) ပိုင်း ပါဝင်ပါသည်-

1. **အဓိက အချက်အလက်များ (Primary KPIs):**
   - **Total Staff:** ကုမ္ပဏီရှိ စုစုပေါင်း ဝန်ထမ်းအရေအတွက်။
   - **Active Staff:** လက်ရှိ အလုပ်လုပ်ကိုင်နေသော (Active ဖြစ်နေသော) ဝန်ထမ်းအရေအတွက်။
   - **Present Today:** ယနေ့ ရုံးတက်ရောက်သူ အရေအတွက်။
   - **Total Leaves:** ခွင့်ယူထားသော စုစုပေါင်း အရေအတွက်။

2. **အခြား အချက်အလက်များ (Secondary KPIs):**
   - **Pending Clearances:** အလုပ်ထွက်ခွာသူများအတွက် ဆောင်ရွက်ရန်ကျန်သေးသော Offboarding အရေအတွက်။
   - **Active Onboarding:** အလုပ်စတင်ဝင်ရောက်မည့် ဝန်ထမ်းသစ်များအတွက် လုပ်ဆောင်နေဆဲ Onboarding အရေအတွက်။
   - **Open Positions:** လူသစ်ခေါ်ယူရန် ဖွင့်ထားသော (Recruitment) ရာထူးအရေအတွက်။
   - **Total Payroll Paid:** ပေးချေထားသော စုစုပေါင်း လစာပမာဏ။
   - **Turnover Rate:** အလုပ်ထွက်ခွာသူ ရာခိုင်နှုန်း။

3. **ဂရပ်များ (Charts):**
   - **Attendance Chart:** ရုံးတက်ရောက်မှု အခြေအနေများကို ဂရပ်ဖြင့် ပြသခြင်း။
   - **Leave Chart:** ခွင့်ယူမှု အခြေအနေများကို ဂရပ်ဖြင့် ပြသခြင်း။

4. **အမြန်လုပ်ဆောင်ချက်များ (Quick Actions):**
   - **Add Employee / Record Attendance / Submit Leave / Start Onboarding** စသည့် ခလုတ်များ ပါဝင်ပါသည်။

5. **ဝန်ထမ်းသစ် အချက်အလက် (Recent Employees):**
   - နောက်ဆုံး ဝင်ရောက်ထားသော ဝန်ထမ်းများ၏ ID, Name နှင့် Status တို့ကို ပြသထားသော ဇယား။

6. **ကြေညာချက်များ (Announcements):**
   - HR သို့မဟုတ် Admin မှ တင်ထားသော အရေးကြီး ကြေညာချက်များ။ (Priority နှင့် ရက်စွဲ ပါဝင်ပါသည်)

---

## 3. Screen / Button / Field ရှင်းလင်းချက် (UI Explanations)

Dashboard စာမျက်နှာရှိ အရေးကြီးသော ခလုတ်များကို နှိပ်လိုက်ပါက သက်ဆိုင်ရာ Module များသို့ အောက်ပါအတိုင်း ရောက်ရှိသွားပါမည်-

- **Total Staff Card ကိုနှိပ်လျှင်:** \`Employees\` စာမျက်နှာသို့ သွားပါမည်။
- **Active Staff Card ကိုနှိပ်လျှင်:** \`Employees\` တွင် Status = Active ဖြင့် Filter လုပ်ထားသော စာမျက်နှာသို့ သွားပါမည်။
- **Present Today Card ကိုနှိပ်လျှင်:** \`Attendance\` စာမျက်နှာသို့ သွားပါမည်။
- **Total Leaves Card ကိုနှိပ်လျှင်:** \`Leave Management\` စာမျက်နှာသို့ သွားပါမည်။
- **Pending Clearances Card ကိုနှိပ်လျှင်:** \`Offboarding\` စာမျက်နှာသို့ သွားပါမည်။
- **Turnover Rate Card ကိုနှိပ်လျှင်:** \`Employees\` တွင် Status = Inactive (အလုပ်ထွက်သွားသူများ) ဖြင့် Filter လုပ်ထားသော စာမျက်နှာသို့ သွားပါမည်။

**Quick Actions (ခလုတ် ၄ ခု):**
- **+ Add Employee:** ဝန်ထမ်းသစ် ထည့်သွင်းရန် \`Employees\` သို့သွားပါမည်။
- **📋 Record Attendance:** ရုံးတက်မှတ်တမ်းသွင်းရန် \`Attendance\` သို့သွားပါမည်။
- **📅 Submit Leave:** ခွင့်တင်ရန် \`Leave Management\` သို့သွားပါမည်။
- **🚀 Start Onboarding:** ဝန်ထမ်းသစ် ကြိုဆိုမှုလုပ်ငန်းစဉ်စရန် \`Onboarding\` သို့သွားပါမည်။

---

## 4. Dashboard ကို ဘယ်လိုအသုံးပြုမလဲ? (How to use Dashboard)

နေ့စဉ် Dashboard ကို အသုံးပြုရန် အဆင့်ဆင့်-

1. **BBD HRM သို့ Login ဝင်ပါ။** ဝင်လိုက်သည်နှင့် Dashboard ပင်မစာမျက်နှာကို ပထမဆုံး မြင်တွေ့ရပါမည်။
2. **Primary KPIs ကို စစ်ဆေးပါ။** ယနေ့ ရုံးတက်သူ (Present Today) နှင့် ခွင့်ယူထားသူ (Total Leaves) ကို ကြည့်ပြီး လူအင်အား လုံလောက်မှု ရှိမရှိ စစ်ဆေးပါ။
3. **Secondary KPIs ကို ကြည့်ပါ။** Onboarding (သို့) Offboarding တွင် ပြီးပြတ်ရန်ကျန်နေသော (Pending) အရာများ ရှိမရှိ စစ်ဆေးပါ။
4. **Announcements ကို ဖတ်ပါ။** ကုမ္ပဏီ၏ အရေးကြီးသော ကြေညာချက် အသစ်များ ရှိမရှိ ညာဘက်အောက်ထောင့်တွင် စစ်ဆေးပါ။
5. **လိုအပ်ပါက Quick Actions ကို သုံးပါ။** ဝန်ထမ်းသစ် ထည့်ရန် သို့မဟုတ် ခွင့်တင်ပေးရန် လိုအပ်ပါက Quick Actions ခလုတ်များကို နှိပ်၍ သက်ဆိုင်ရာသို့ အမြန်သွားပါ။

---

## 5. Dashboard နှင့် အချက်အလက်များ ချိတ်ဆက်မှု (System Behavior)

Dashboard ပေါ်ရှိ Data များသည် Database အတွင်းရှိ အောက်ပါ အချက်အလက်များနှင့် တိုက်ရိုက် ချိတ်ဆက် အလုပ်လုပ်ပါသည်-

- **Employee Data ပြောင်းလဲမှု:** \`Employees\` စာမျက်နှာတွင် ဝန်ထမ်းအသစ် ထည့်လိုက်ပါက (သို့) အလုပ်ထွက် (Inactive) သတ်မှတ်လိုက်ပါက Dashboard ပေါ်ရှိ Total Staff နှင့် Active Staff အရေအတွက်များ ချက်ချင်း ပြောင်းလဲသွားပါမည်။
- **Attendance Data ပြောင်းလဲမှု:** ဝန်ထမ်းများ Check-in လုပ်လိုက်သည်နှင့် Present Today ကိန်းဂဏန်းသည် အလိုအလျောက် တက်လာပါမည်။ (မှတ်ချက် - ဒေတာများကို ၆၀ စက္ကန့်လျှင် တစ်ကြိမ် အလိုအလျောက် Refresh လုပ်ပေးပါသည်)
- **Leave Data ပြောင်းလဲမှု:** Manager မှ ခွင့် (Leave Request) တစ်ခုကို Approve လုပ်လိုက်ပါက Total Leaves အရေအတွက်တွင် သွားရောက် ပေါင်းထည့်မည် ဖြစ်ပါသည်။
- **Announcements များ:** Expire Date ကျော်လွန်သွားသော ကြေညာချက်များသည် Dashboard တွင် အလိုအလျောက် ပျောက်ကွယ်သွားပါမည်။

---

## 6. Dashboard မှ အခြား Modules များသို့ ချိတ်ဆက်မှု (Dashboard + Other Modules)

Dashboard သည် ကိုယ်ပိုင် Data များ ဖန်တီးခြင်းမရှိဘဲ အခြားသော Module များမှ Data များကိုသာ ဆွဲယူပြသခြင်း ဖြစ်ပါသည်။ 

- **Dashboard → Employees:** ဝန်ထမ်း အင်အားစာရင်း နှင့် Recent Employees ဇယား ကို ဆွဲယူပါသည်။
- **Dashboard → Attendance & Leave:** ရုံးတက်သူ၊ ခွင့်ယူသူ အရေအတွက်နှင့် Charts များကို တိုက်ရိုက် ချိတ်ဆက်ထားပါသည်။
- **Dashboard → Recruitment & Onboarding:** Open Positions နှင့် Active Onboarding အရေအတွက်ကို ပြသပါသည်။
- **Dashboard → Offboarding:** လုပ်ဆောင်ရန်ကျန်နေသော Clearance အရေအတွက်ကို ဆွဲယူပြသပါသည်။
- **Dashboard → Payroll:** ပေးချေပြီးသော လစာ (Total Payroll Paid) အချက်အလက်ကို တွက်ချက်ပြသပါသည်။

---

## 7. လက်တွေ့ အသုံးပြုမှု ဥပမာ (Real User Scenario)

**မနက် ၉:၃၀ နာရီ - HR Manager ၏ မနက်ခင်း လုပ်ငန်းစဉ်:**
1. HR Manager သည် စနစ်ထဲသို့ ဝင်ဝင်ချင်း Dashboard ကို ကြည့်လိုက်ပါသည်။
2. \`Present Today\` အရေအတွက်ကို ကြည့်ပြီး ယနေ့ ရုံးတက်သူ နည်းနေသည်ကို သတိထားမိပါသည်။ \`Total Leaves\` ကို စစ်ဆေးရာ ခွင့်ယူထားသူ များနေသည်ကို တွေ့ရပါသည်။
3. \`Pending Clearances\` တွင် ဂဏန်း (၂) ခု ပေါ်နေသောကြောင့် အလုပ်ထွက်သွားသူ (၂) ဦးအတွက် Offboarding လုပ်ငန်းစဉ်များ ကျန်နေသေးကြောင်း သိလိုက်ရပါသည်။
4. ချက်ချင်းပင် \`Pending Clearances\` (သို့) \`Offboarding\` ခလုတ်ကို နှိပ်ပြီး သက်ဆိုင်ရာ စာမျက်နှာသို့ သွားရောက်ကာ ဆက်လက် ဆောင်ရွက်ပါသည်။

---

## 8. အရေးကြီး မှတ်သားရန်များ (Important Notes & FAQ)

- **Data များ ချက်ချင်း မပေါ်လာခြင်း:** Dashboard ပေါ်ရှိ အချက်အလက်များသည် (၁) မိနစ်လျှင် တစ်ကြိမ် (Auto-Refresh 60 seconds) ပြန်လည် ဆွဲယူပါသည်။ အကယ်၍ Data ချက်ချင်း မပြောင်းလဲပါက ခဏစောင့်ပေးပါ။
- **Permissions ကန့်သတ်ချက်များ:** မိမိအကောင့်၏ Permission (လုပ်ပိုင်ခွင့်) ပေါ်မူတည်၍ အချို့သော Data များ (ဥပမာ - Total Payroll Paid) ကို မြင်တွေ့ခွင့် မရှိပါက Dashboard တွင် ပေါ်မည်မဟုတ်ပါ။ အလားတူ Quick Actions များကို နှိပ်ရာတွင်လည်း Permission မရှိပါက ဝင်ရောက်နိုင်မည် မဟုတ်ပါ။
- **Empty Charts:** အကယ်၍ ဂရပ် (Charts) များတွင် Data မပေါ်ပါက ထိုလအတွက် Attendance (သို့) Leave data များ မရှိသေးသောကြောင့် ဖြစ်ပါသည်။

---

## 9. Employee Lifecycle တွင် Dashboard ၏ အခန်းကဏ္ဍ

Dashboard သည် ဝန်ထမ်းတစ်ဦး၏ Lifecycle တစ်ခုလုံးကို အပေါ်စီးမှ ခြုံငုံကြည့်ရှုနိုင်သော နေရာဖြစ်ပါသည်။
**Recruitment** (လူခေါ်ခြင်း) မှသည် **Onboarding** (အလုပ်စဝင်ခြင်း)၊ **Attendance/Leave** (ရုံးတက်/ခွင့်) နှင့် နောက်ဆုံး **Offboarding** (အလုပ်ထွက်ခြင်း) အထိ အရေးကြီးသော မှတ်တိုင် (Milestones) အားလုံး၏ အခြေအနေကို Dashboard မှတစ်ဆင့် ချက်ချင်း သိရှိနိုင်ပါသည်။ Dashboard သည် ထိုလုပ်ငန်းစဉ်များကို အစားထိုးခြင်း မဟုတ်ဘဲ အလွယ်တကူ စီမံနိုင်ရန် ကူညီပေးခြင်းသာ ဖြစ်ပါသည်။

---

## 10. ဆက်လက်ဖတ်ရှုရန် (Related Modules)

- <a href="#" data-article-title="HRM Overview" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">HRM Overview</a>
- <a href="#" data-article-title="Employees" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Employees</a>
- <a href="#" data-article-title="Attendance" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Attendance</a>
- <a href="#" data-article-title="Leave Management" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Leave Management</a>
- <a href="#" data-article-title="Recruitment" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Recruitment</a>
- <a href="#" data-article-title="Onboarding" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Onboarding</a>
- <a href="#" data-article-title="Offboarding" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Offboarding</a>
- <a href="#" data-article-title="Payroll & KPI" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Payroll & KPI</a>
- <a href="#" data-article-title="Complete Employee Lifecycle" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Complete Employee Lifecycle</a>
`;

    const enMarkdown = `
# Dashboard

## 1. What is the Dashboard? (Overview)
The **Dashboard** is the "Control Center" of the BBD HRM system, where important information from across the entire system is consolidated for easy viewing.
The primary purpose of the Dashboard in BBD HRM is to summarize critical data from various modules (Employees, Attendance, Leave, Payroll, etc.) so that management can make quick decisions.

**Who uses it?**
- **Bosses, Admins, and HR Managers** primarily use it to monitor the company's high-level status (e.g., how many people are at work, how many are on leave, total payroll paid).

**When should it be used?**
- In the morning, to quickly check daily attendance status.
- To check if there are any urgent pending tasks (like Clearances).
- To quickly navigate to specific modules using the Quick Actions.

---

## 2. What can you see on the Dashboard?

The Dashboard consists of 6 main sections:

1. **Primary KPIs:**
   - **Total Staff:** The total number of employees in the company.
   - **Active Staff:** The number of currently active employees.
   - **Present Today:** The number of employees who have checked in today.
   - **Total Leaves:** The total number of leaves taken.

2. **Secondary KPIs:**
   - **Pending Clearances:** The number of offboarding clearances that are pending completion.
   - **Active Onboarding:** The number of new employees currently in the onboarding process.
   - **Open Positions:** The number of job positions currently open for recruitment.
   - **Total Payroll Paid:** The total amount of payroll that has been paid.
   - **Turnover Rate:** The percentage of employees who have left the company.

3. **Charts:**
   - **Attendance Chart:** A visual representation of attendance trends.
   - **Leave Chart:** A visual representation of leave trends.

4. **Quick Actions:**
   - Convenient buttons like **+ Add Employee**, **Record Attendance**, **Submit Leave**, and **Start Onboarding**.

5. **Recent Employees Snapshot:**
   - A table displaying the ID, Name, and Status of the most recently added employees.

6. **Announcements:**
   - Important notices posted by HR or Admins (includes priority tags and dates).

---

## 3. Screen / Button / Field Explanations

Clicking on important elements on the Dashboard will navigate you to the respective modules:

- **Clicking 'Total Staff':** Goes to the \`Employees\` page.
- **Clicking 'Active Staff':** Goes to the \`Employees\` page filtered by Status = Active.
- **Clicking 'Present Today':** Goes to the \`Attendance\` page.
- **Clicking 'Total Leaves':** Goes to the \`Leave Management\` page.
- **Clicking 'Pending Clearances':** Goes to the \`Offboarding\` page.
- **Clicking 'Turnover Rate':** Goes to the \`Employees\` page filtered by Status = Inactive.

**Quick Actions (4 Buttons):**
- **+ Add Employee:** Goes to \`Employees\` to add a new hire.
- **📋 Record Attendance:** Goes to \`Attendance\` to record clock-ins.
- **📅 Submit Leave:** Goes to \`Leave Management\` to submit a leave request.
- **🚀 Start Onboarding:** Goes to \`Onboarding\` to start welcoming a new hire.

---

## 4. How to use the Dashboard

Step-by-step daily usage:

1. **Log in to BBD HRM.** You will immediately see the Dashboard home page.
2. **Check Primary KPIs.** Look at 'Present Today' and 'Total Leaves' to ensure you have enough manpower for the day.
3. **Check Secondary KPIs.** See if there are any pending tasks in Onboarding or Offboarding that need your attention.
4. **Read Announcements.** Check the bottom right corner for any new or pinned company announcements.
5. **Use Quick Actions.** If you need to quickly add an employee or submit a leave on someone's behalf, use the Quick Action buttons to go straight there.

---

## 5. Dashboard Data & System Behavior

The data displayed on the Dashboard is directly connected to the underlying database from other modules:

- **Employee Data Changes:** If you add a new employee or mark someone as Inactive in the \`Employees\` module, the 'Total Staff' and 'Active Staff' counts on the Dashboard will update immediately.
- **Attendance Data Changes:** As soon as employees Check-in, the 'Present Today' metric increases automatically. *(Note: The Dashboard automatically refreshes data every 60 seconds).*
- **Leave Data Changes:** When a Manager approves a Leave Request, it is added to the 'Total Leaves' count.
- **Announcements:** Announcements that have passed their Expiry Date will automatically disappear from the Dashboard.

---

## 6. Dashboard Connection to Other Modules

The Dashboard does not create its own data; it aggregates data from the rest of the system:

- **Dashboard → Employees:** Pulls the total headcount and the Recent Employees table.
- **Dashboard → Attendance & Leave:** Directly linked to attendance counts, leave counts, and charts.
- **Dashboard → Recruitment & Onboarding:** Displays 'Open Positions' and 'Active Onboarding' counts.
- **Dashboard → Offboarding:** Pulls the number of pending clearances.
- **Dashboard → Payroll:** Calculates and displays the 'Total Payroll Paid' metric.

---

## 7. Real User Scenario

**9:30 AM - HR Manager's Morning Routine:**
1. The HR Manager logs into the system and glances at the Dashboard.
2. They check the \`Present Today\` count and notice attendance is low. They look at \`Total Leaves\` and see many people are on leave.
3. Looking at \`Pending Clearances\`, they see the number "(2)", indicating that two resigned employees still need their offboarding tasks completed.
4. The HR Manager clicks directly on the \`Pending Clearances\` card, which takes them straight to the Offboarding module to finish the tasks.

---

## 8. Important Notes & FAQ

- **Data Not Refreshing Instantly:** The Dashboard automatically refetches data every 1 minute (60 seconds). If you don't see a recent change immediately, please wait a moment.
- **Permission Restrictions:** Depending on your account's permissions, you may not see certain data (e.g., Total Payroll Paid). Similarly, clicking Quick Actions without the proper module permissions will not grant you access.
- **Empty Charts:** If the graphs (Charts) are completely empty, it simply means there is no Attendance or Leave data recorded for the current month yet.

---

## 9. Role in the Employee Lifecycle

The Dashboard serves as a bird's-eye view of the entire Employee Lifecycle. 
From **Recruitment** (Open Positions) to **Onboarding** (Active Onboarding), daily **Attendance/Leave**, and final **Offboarding** (Pending Clearances), you can monitor all critical milestones instantly from the Dashboard. It does not replace these individual modules, but rather acts as a helpful command center to manage them efficiently.

---

## 10. Related Modules

- <a href="#" data-article-title="HRM Overview" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">HRM Overview</a>
- <a href="#" data-article-title="Employees" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Employees</a>
- <a href="#" data-article-title="Attendance" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Attendance</a>
- <a href="#" data-article-title="Leave Management" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Leave Management</a>
- <a href="#" data-article-title="Recruitment" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Recruitment</a>
- <a href="#" data-article-title="Onboarding" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Onboarding</a>
- <a href="#" data-article-title="Offboarding" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Offboarding</a>
- <a href="#" data-article-title="Payroll & KPI" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Payroll & KPI</a>
- <a href="#" data-article-title="Complete Employee Lifecycle" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Complete Employee Lifecycle</a>
`;

    const myHtml = marked.parse(myMarkdown);
    const enHtml = marked.parse(enMarkdown);

    // Update in Database
    const { data: article, error } = await supabaseAdmin
      .from('hrm_manual_articles')
      .select('id, title, published_content, draft_content')
      .eq('title', 'Dashboard')
      .single();

    if (error || !article) {
      console.log('Dashboard article not found in Database!');
      return;
    }

    const payload = JSON.stringify({ my: myHtml, en: enHtml });

    await supabaseAdmin.from('hrm_manual_articles').update({
      draft_content: payload,
      published_content: payload,
      status: 'published'
    }).eq('id', article.id);

    console.log('Successfully updated Dashboard article with structured Burmese and English JSON!');

  } catch (err) {
    console.error('Error:', err);
  }
}

run();
