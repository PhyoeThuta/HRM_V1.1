import { supabaseAdmin } from '../lib/supabase.js';
import { marked } from 'marked';

async function run() {
  try {
    console.log('Translating and refining Employees Article...');

    const myMarkdown = `
# Employees (ဝန်ထမ်းများ စီမံခန့်ခွဲခြင်း)

## 1. Employees Overview (ယေဘုယျအကြောင်းအရာ)
**Employees Module** သည် BBD HRM System တစ်ခုလုံး၏ အသက်သွေးကြော (Core Module) ဖြစ်ပါသည်။ ကုမ္ပဏီရှိ ဝန်ထမ်းများ၏ ကိုယ်ရေးအချက်အလက်များ၊ ရာထူးများ၊ ဌာနများနှင့် လုပ်ငန်းခွင် မှတ်တမ်းများကို စနစ်တကျ မှတ်တမ်းတင်ပေးသော နေရာဖြစ်ပါသည်။ 

**ဘာအတွက် အသုံးပြုသလဲ?**
- ဝန်ထမ်းသစ်များ စာရင်းသွင်းရန်၊ အချက်အလက် ပြင်ဆင်ရန်၊ အလုပ်ထွက်သွားသူများကို စာရင်းမှ ပယ်ဖျက်ရန် အဓိက သုံးပါသည်။

**ဘယ်သူတွေ အသုံးပြုသလဲ?**
- **Admin နှင့် HR Manager** များသည် အချက်အလက်များ ထည့်သွင်းခြင်း/ပြင်ဆင်ခြင်း/ဖျက်ခြင်း အားလုံးကို ပြုလုပ်နိုင်ပါသည်။
- သာမန် ဝန်ထမ်းများသည် အခြားဝန်ထမ်းများ၏ အခြေခံ အချက်အလက်များကိုသာ ကြည့်ရှုခွင့် (View) ရှိပါသည်။

**ဘာကြောင့် အရေးကြီးသလဲ?**
- Employee Record တစ်ခုမရှိဘဲ Attendance (ရုံးတက်ခြင်း)၊ Leave (ခွင့်ယူခြင်း)၊ Payroll (လစာတွက်ခြင်း) စသည့် အခြား မည်သည့် လုပ်ငန်းစဉ်ကိုမှ လုပ်ဆောင်၍ မရနိုင်ပါ။ 

---

## 2. Employee List (ဝန်ထမ်းစာရင်းနှင့် လုပ်ဆောင်ချက်များ)

ဝန်ထမ်းစာရင်း စာမျက်နှာတွင် အောက်ပါတို့ကို လုပ်ဆောင်နိုင်ပါသည်-

- **Search & Filters:** အမည် (သို့) Employee ID ဖြင့် ရှာဖွေနိုင်ပြီး Department (ဌာန) အလိုက် စစ်ထုတ်ကြည့်ရှုနိုင်ပါသည်။
- **Group by Department:** ဝန်ထမ်းများကို သက်ဆိုင်ရာ ဌာနအလိုက် စုစည်းပြသထားပြီး ခေါက်ထား/ဖြန့်ကြည့် (Collapse/Expand) လုပ်နိုင်ပါသည်။
- **Active Directory vs Recycle Bin:** လက်ရှိ ဝန်ထမ်းများကို "Active Directory" တွင်ပြသပြီး၊ ဖျက်ထားသော ဝန်ထမ်းများကို "Recycle Bin" တွင် ခွဲခြားပြသထားပါသည်။
- **Available Actions (လုပ်ဆောင်နိုင်သော အရာများ):**
  - **View (📄):** ဝန်ထမ်း၏ အသေးစိတ် အချက်အလက်ကို ကြည့်ရန် (အားလုံး လုပ်ဆောင်နိုင်သည်)။
  - **Edit (🖊️):** အချက်အလက်များ ပြင်ဆင်ရန် (HR/Admin သာ)။
  - **Soft Delete (🗑️):** ဝန်ထမ်းကို အလုပ်ထွက်အဖြစ် သတ်မှတ်ပြီး စာရင်းမှ ဖျောက်ရန် (Admin သာ)။
  - **Restore:** ဖျက်ထားသော ဝန်ထမ်းကို Recycle Bin မှ ပြန်လည် ဆယ်ယူရန် (Admin သာ)။
  - **Hard Delete:** Recycle Bin မှနေ၍ အပြီးအပိုင် ဖျက်ပစ်ရန် (Admin သာ လုပ်ဆောင်နိုင်ပြီး အလွန်သတိထားရန် လိုပါသည်)။

---

## 3. Add Employee (ဝန်ထမ်းသစ် ထည့်သွင်းခြင်း)

ဝန်ထမ်းသစ် ထည့်သွင်းရန် \`+ Add Employee\` ခလုတ်ကို နှိပ်ပါ။ အောက်ပါ အဓိက အချက်အလက်များကို ဖြည့်သွင်းရပါမည်-

- **Employee ID (မဖြစ်မနေ):** ကုမ္ပဏီမှ သတ်မှတ်ထားသော ဝန်ထမ်းကိုယ်ပိုင်နံပါတ် (ဥပမာ - EMP-001)။
- **Full Name (မဖြစ်မနေ):** ဝန်ထမ်း၏ အမည်အပြည့်အစုံ။
- **Email & Phone:** ဆက်သွယ်ရန် အချက်အလက်များ။
- **Department & Position:** ဝန်ထမ်း တာဝန်ထမ်းဆောင်မည့် ဌာနနှင့် ရာထူး (ရွေးချယ်ရန်)။
- **Manager (Boss):** ဤဝန်ထမ်းအား တိုက်ရိုက် အုပ်ချုပ်မည့် အထက်လူကြီး (Leave Request များ တင်ရန် အရေးကြီးပါသည်)။
- **Hire Date:** အလုပ်စတင် ဝင်ရောက်သော ရက်စွဲ။
- **Salary:** လစာပမာဏ (Payroll တွက်ချက်ရာတွင် တိုက်ရိုက် အသုံးပြုပါသည်)။
- **Employment Type:** Full-Time, Part-Time, Contract, Internship စသည်ဖြင့် ရွေးချယ်နိုင်ပါသည်။
- **Status:** Active, On Leave, Inactive ဟု သတ်မှတ်နိုင်ပါသည်။ ဝန်ထမ်းသစ်များအတွက် 'Active' အဖြစ်သာ ထားပါ။
- **National ID / Address / DOB:** အခြား ကိုယ်ရေးကိုယ်တာ အချက်အလက်များ။

*မှတ်ချက် - ဤနေရာတွင် ဖြည့်သွင်းလိုက်သော Data များသည် အခြား Module အားလုံးတွင် အလိုအလျောက် သွားရောက် ချိတ်ဆက်မည် ဖြစ်ပါသည်။*

---

## 4. Employee Details (ဝန်ထမ်း အသေးစိတ် အချက်အလက်များ)

ဝန်ထမ်းတစ်ဦးချင်းစီ၏ (View) ကို နှိပ်ပါက အောက်ပါတို့ကို အသေးစိတ် ကြည့်ရှု/စီမံနိုင်ပါသည်-

1. **Profile & Avatar:** ကိုယ်ရေးအချက်အလက်များနှင့် ပရိုဖိုင်ပုံ ပြောင်းလဲခြင်း။
2. **Quick Stats:** Peer Rating (လုပ်ဖော်ကိုင်ဖက်များ၏ မဲပေးမှုရလဒ်) နှင့် Total Paid (ပေးချေပြီးသော လစာစုစုပေါင်း) ကို အမြန်ကြည့်နိုင်ခြင်း။
3. **Career Timeline:** ရာထူးတိုးခြင်း၊ လစာတိုးခြင်း၊ သတိပေးခံရခြင်း စသည့် အရေးကြီး မှတ်တိုင် (Milestones) များကို မှတ်တမ်းတင်နိုင်ခြင်း။
4. **Attendance:** နောက်ဆုံး (၅) ရက်စာ ရုံးတက်/ဆင်း မှတ်တမ်းနှင့် အချိန်နောက်ကျမှုများ။
5. **Leave Balances:** ကျန်ရှိနေသေးသော ခွင့်ရက် အရေအတွက်များ။
6. **Handover History:** အခြားသူများထံမှ လက်ခံထားသော သို့မဟုတ် လွှဲပြောင်းပေးထားသော လုပ်ငန်းတာဝန်များ (Handovers)။
7. **KPI Records:** ပြီးစီးခဲ့သော (သို့) လုပ်ဆောင်ဆဲ Performance KPI မှတ်တမ်းများ။

---

## 5. Edit Employee (အချက်အလက် ပြင်ဆင်ခြင်း)

- **မည်သို့ပြင်ဆင်မလဲ?** ဝန်ထမ်းစာရင်းမှ \`Edit\` (🖊️) ခလုတ်ကို နှိပ်ပါ (သို့) Employee Details စာမျက်နှာရှိ \`Edit Profile\` ကို နှိပ်ပါ။
- **ဘာတွေပြင်နိုင်သလဲ?** Add Employee တွင် ထည့်သွင်းခဲ့သော အချက်အလက် အားလုံးနီးပါးကို ပြင်ဆင်နိုင်ပါသည်။
- **သက်ရောက်မှု (Impact):** Department (သို့) Position ပြောင်းလဲလိုက်ပါက \`Org Chart\` တွင် ချက်ချင်း ပြောင်းလဲသွားမည်ဖြစ်ပြီး၊ လစာ ပြင်ဆင်လိုက်ပါက နောက်လအတွက် \`Payroll\` တွက်ချက်မှုများ ပြောင်းလဲသွားပါမည်။ *(ရာထူး သို့မဟုတ် လစာ သိသိသာသာ ပြောင်းလဲပါက Career Timeline တွင် သီးသန့် Milestone တစ်ခု ထည့်သွင်းထားရန် အကြံပြုပါသည်)*

---

## 6. Delete / Soft Delete / Restore (ဖျက်ခြင်း နှင့် ဆယ်ယူခြင်း)

BBD HRM တွင် ဖျက်ခြင်း နှစ်မျိုး ရှိပါသည်။

**၁။ Soft Delete (ယာယီဖျက်ခြင်း):**
- **ပြုလုပ်ပုံ:** Active Directory မှ 🗑️ ကိုနှိပ်ခြင်း ဖြစ်ပါသည်။
- **ဘာဖြစ်သွားသလဲ?** ဝန်ထမ်း၏ Status သည် Inactive (သို့) ဖျက်ထားသည် ဟု ပြောင်းသွားပြီး စနစ်အတွင်း ဝင်ရောက်ခွင့် (Login) ပိတ်သွားပါမည်။ သို့သော် သူ၏ ယခင် Attendance, Payroll, Leave မှတ်တမ်းများအားလုံး Database တွင် ကျန်ရှိနေမည် ဖြစ်ပါသည်။

**၂။ Restore (ပြန်လည်ဆယ်ယူခြင်း):**
- **ပြုလုပ်ပုံ:** Recycle Bin ထဲသို့ဝင်၍ \`Restore\` ကို နှိပ်ခြင်း ဖြစ်ပါသည်။
- **ဘာဖြစ်သွားသလဲ?** ထိုဝန်ထမ်းသည် Active ပြန်ဖြစ်သွားပြီး Login ပြန်ဝင်နိုင်မည် ဖြစ်ပါသည်။

**၃။ Hard Delete (အပြီးတိုင်ဖျက်ခြင်း):**
- **ပြုလုပ်ပုံ:** Recycle Bin ထဲမှ \`Hard Delete\` ကို နှိပ်ခြင်း ဖြစ်ပါသည်။ Admin သာ လုပ်ခွင့်ရှိပါသည်။
- **ဘာဖြစ်သွားသလဲ?** ဝန်ထမ်းနှင့် သက်ဆိုင်သော Data အားလုံး System ထဲမှ အပြီးတိုင် ပျက်သွားပါမည်။ မှားယွင်းထည့်သွင်းမိသော အချက်အလက်များအတွက်သာ အသုံးပြုရန် အကြံပြုပါသည်။

---

## 7. Bulk Import (အများအပြား တစ်ပြိုင်နက် ထည့်သွင်းခြင်း)

- **ဘာလဲ?** ဝန်ထမ်းစာရင်း အများအပြားကို Excel (.xlsx) သို့မဟုတ် CSV ဖိုင်ဖြင့် တစ်ခါတည်း ထည့်သွင်းခြင်း ဖြစ်ပါသည်။
- **ဘယ်အချိန်သုံးသလဲ?** စနစ်စတင်သုံးစွဲချိန်တွင် ဝန်ထမ်းဟောင်းများ၏ Data အားလုံးကို အမြန်ထည့်သွင်းလိုချိန်တွင် သုံးပါသည်။
- **ပြုလုပ်ပုံ:** Admin အနေဖြင့် \`Bulk Import\` ကိုနှိပ်ပါ။ ညွှန်ကြားထားသော Column အမည်များ (Employee ID, Full Name, Salary, Email, Phone) အတိုင်း ဖိုင်ကို ပြင်ဆင်ပြီး Upload လုပ်ပါ။ အောင်မြင်ပါက ဝန်ထမ်းစာရင်းများ ချက်ချင်း ရောက်ရှိလာပါမည်။

---

## 8. သက်ဆိုင်ရာ Module များနှင့် ချိတ်ဆက်မှု (System Connections)

Employee Module သည် အောက်ပါတို့နှင့် တိုက်ရိုက် ချိတ်ဆက်ထားပါသည်-

- **→ Department & Position:** ဝန်ထမ်းတစ်ဦးကို ဖန်တီးလိုက်သည်နှင့် Org Chart တွင် မှန်ကန်သောနေရာ၌ အလိုအလျောက် ပေါ်လာပါမည်။
- **→ Manager:** Manager ကို သတ်မှတ်ပေးမှသာ ထိုဝန်ထမ်း၏ ခွင့်တင်ခြင်း (Leave) များကို Manager မှ Approve လုပ်နိုင်မည် ဖြစ်ပါသည်။
- **→ Attendance & Leave:** Employee Record ရှိမှသာ ရုံးတက်/ခွင့် မှတ်တမ်းများ ထည့်သွင်းနိုင်မည် ဖြစ်ပါသည်။
- **→ Payroll & Performance:** Employee ၏ Salary နှင့် Position ကို အခြေခံ၍ လစာနှင့် KPI များကို တွက်ချက်ပါသည်။
- **→ Onboarding / Offboarding:** ဝန်ထမ်းသစ် ဝင်ချိန်နှင့် ထွက်ချိန်များတွင် သက်ဆိုင်ရာ Task များကို ချိတ်ဆက် လုပ်ဆောင်ရပါသည်။

---

## 9. Employee Lifecycle (ဝန်ထမ်း ဘဝမှတ်တိုင်)

HRM စနစ်အတွင်း ဝန်ထမ်းတစ်ဦး၏ အဆင့်ဆင့် ဖြတ်သန်းမှုမှာ အောက်ပါအတိုင်း ဖြစ်ပါသည်-

**Recruitment** တွင် အလုပ်ခန့်ရန် ရွေးချယ်ခံရခြင်း ➔ **Employees** တွင် ကိုယ်ရေးမှတ်တမ်း ဖန်တီးခြင်း ➔ **Onboarding** ဖြင့် အလုပ်စတင်ခြင်း ➔ နေ့စဉ် **Attendance & Leave** အသုံးပြုခြင်း ➔ လစဉ် **Performance & Payroll** ဖြင့် အကဲဖြတ်/လစာပေးခြင်း ➔ အလုပ်ထွက်ပါက **Offboarding** ဖြင့် စာရင်းရှင်းခြင်း ➔ **Soft Delete** ဖြင့် စနစ်မှ ပယ်ဖျက်ခြင်း။

---

## 10. အမေးများသော မေးခွန်းများ (Common Scenarios / FAQ)

- **မေး: ဝန်ထမ်း အကောင့် Login ဝင်မရပါက ဘာလုပ်ရမလဲ?**
  ဖြေ: \`Employee Details\` တွင် Email မှန်/မမှန် စစ်ဆေးပါ။ ထို့နောက် Status သည် 'Active' ဖြစ်နေရန် သေချာစေပါ။ (Soft Delete လုပ်ထားသူများသည် Login ဝင်ခွင့်မရှိပါ)
- **မေး: ရာထူး သို့မဟုတ် လစာ ပြောင်းလဲသွားပါက ဘယ်လိုလုပ်ရမလဲ?**
  ဖြေ: \`Edit Profile\` တွင် အချက်အလက်များ သွားပြင်ပါ။ ထို့နောက် \`Employee Details > Career Timeline\` တွင် 'PROMOTION' သို့မဟုတ် 'SALARY RAISE' Milestone အဖြစ် မှတ်တမ်းတင်ထားပါ။

---

## 11. အရေးကြီး မှတ်သားရန် (Important Notes)

- **Email မှန်ကန်ရန်:** အီးမေးလ်သည် Login ဝင်ရန် အဓိကဖြစ်သောကြောင့် မှန်ကန်စွာ ဖြည့်သွင်းရန် အရေးကြီးပါသည်။
- **Soft Delete ထက် Hard Delete ကို ရှောင်ကျဉ်ပါ:** အလုပ်ထွက်သွားသော ဝန်ထမ်းများ၏ လစာနှင့် ရုံးတက်မှတ်တမ်းများ (History) ကျန်ရှိနေစေရန် အမြဲတမ်း \`Soft Delete\` ကိုသာ အသုံးပြုပါ။

---

## 12. ဆက်လက်ဖတ်ရှုရန် (Related Modules)

- <a href="#" data-article-title="HRM Overview" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">HRM Overview</a>
- <a href="#" data-article-title="Dashboard" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Dashboard</a>
- <a href="#" data-article-title="Departments" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Departments</a>
- <a href="#" data-article-title="Positions" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Positions</a>
- <a href="#" data-article-title="Attendance" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Attendance</a>
- <a href="#" data-article-title="Leave Management" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Leave Management</a>
- <a href="#" data-article-title="Payroll & KPI" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Payroll & KPI</a>
- <a href="#" data-article-title="Complete Employee Lifecycle" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Complete Employee Lifecycle</a>
`;

    const enMarkdown = `
# Employees

## 1. Employees Overview
The **Employees Module** is the core beating heart of the BBD HRM System. It is the central repository that systematically records employee personal information, positions, departments, and career history.

**What is it used for?**
- Primarily used to register new employees, update their information, and remove or deactivate employees who have resigned.

**Who uses it?**
- **Admins and HR Managers** can add, edit, and delete employee records.
- Standard employees generally only have permission to "View" basic information of their colleagues.

**Why is it so important?**
- Without an active Employee Record, an individual cannot participate in Attendance, request Leave, or be processed in Payroll. All other HRM modules depend entirely on this data.

---

## 2. Employee List & Actions

On the main Employees page, you can perform the following actions:

- **Search & Filters:** Search for employees by Name or Employee ID, and filter the view by Department.
- **Group by Department:** Employees are neatly grouped under their respective departments, which can be collapsed or expanded.
- **Active Directory vs Recycle Bin:** Currently employed staff are shown in the "Active Directory", while deleted staff are stored in the "Recycle Bin".
- **Available Actions:**
  - **View (📄):** Open the detailed profile of the employee (Available to everyone).
  - **Edit (🖊️):** Update employee information (HR/Admin only).
  - **Soft Delete (🗑️):** Mark an employee as resigned/inactive and remove them from the active list (Admin only).
  - **Restore:** Bring back a soft-deleted employee from the Recycle Bin (Admin only).
  - **Hard Delete:** Permanently erase an employee record from the Recycle Bin (Admin only - use with extreme caution).

---

## 3. Add Employee

To add a new hire, click the \`+ Add Employee\` button. You will need to fill in the following key fields:

- **Employee ID (Required):** The unique company ID assigned to the staff (e.g., EMP-001).
- **Full Name (Required):** The employee's full legal name.
- **Email & Phone:** Contact details. (Email is crucial for system login).
- **Department & Position:** The organizational unit and job title the employee will hold.
- **Manager (Boss):** The direct supervisor of the employee. (This is highly important for routing Leave requests for approval).
- **Hire Date:** The official date the employee started working.
- **Salary:** The base salary amount. (Directly used by the Payroll module).
- **Employment Type:** Select from Full-Time, Part-Time, Contract, or Internship.
- **Status:** Active, On Leave, or Inactive. (Keep it as 'Active' for new hires).
- **National ID / Address / DOB:** Additional personal details.

*Note: The data entered here automatically synchronizes across all other modules in the HRM system.*

---

## 4. Employee Details

Clicking 'View' on any employee opens their Detailed Profile, where you can manage:

1. **Profile & Avatar:** View basic information and upload a profile picture (Avatar).
2. **Quick Stats:** View 'Peer Rating' scores and 'Total Paid' compensation at a glance.
3. **Career Timeline:** Record and view important milestones such as Promotions, Salary Raises, Department Transfers, Commendations, or Warnings.
4. **Attendance:** A quick overview of their last 5 check-ins, check-outs, and late statuses.
5. **Leave Balances:** The remaining days available for various leave types.
6. **Handover History:** A log of tasks the employee has handed over to others or received from others.
7. **KPI Records:** A summary of completed or pending performance evaluations.

---

## 5. Edit Employee

- **How to Edit:** Click the \`Edit\` (🖊️) icon on the employee list, or click \`Edit Profile\` inside the Employee Details page.
- **What can be changed:** Almost all fields entered during the 'Add Employee' process can be updated.
- **Impact:** Changing the Department or Position will immediately reflect in the \`Org Chart\`. Changing the Salary will alter the calculations in next month's \`Payroll\`. *(Recommendation: If you make a significant change like a title or salary adjustment, add a manual record in the 'Career Timeline' for historical tracking).*

---

## 6. Delete / Soft Delete / Restore

BBD HRM provides different ways to handle employee removals:

**1. Soft Delete:**
- **How:** Click the 🗑️ icon in the Active Directory.
- **What happens:** The employee's status becomes 'Inactive' and they immediately lose Login access to the system. However, all their past Attendance, Leave, and Payroll history remains safely intact in the database for reporting purposes.

**2. Restore:**
- **How:** Go to the Recycle Bin tab and click \`Restore\`.
- **What happens:** The employee is moved back to the Active Directory and their Login access is reinstated.

**3. Hard Delete:**
- **How:** Click \`Hard Delete\` inside the Recycle Bin. (Admin only).
- **What happens:** The employee and all associated data are PERMANENTLY erased from the database. This should ONLY be used for test data or mistakes made during data entry.

---

## 7. Bulk Import

- **What is it?** A tool to add many employees at once using an Excel (.xlsx) or CSV file.
- **When to use it?** Highly useful during initial system setup when migrating old staff records into the BBD HRM system.
- **How to use it:** Admins can click \`Bulk Import\`. Ensure your file matches the exact required headers: \`Employee ID | Full Name | Salary | Email | Phone\`. Upload the file, and the employee records will be created instantly.

---

## 8. Connection to Other HRM Modules

The Employee record is deeply interconnected with the rest of the system:

- **→ Department & Position:** Assigning these ensures the employee appears in the correct hierarchy on the Org Chart.
- **→ Manager:** Setting a manager dictates who has the authority to approve this employee's Leave Requests.
- **→ Attendance & Leave:** You cannot track attendance or request leave without a valid active employee profile.
- **→ Payroll & Performance:** The employee's Salary and Position are the base metrics used to calculate monthly wages and KPI targets.
- **→ Onboarding / Offboarding:** Connects the employee to entry and exit workflows when they join or leave the company.

---

## 9. Employee Lifecycle Context

The typical journey of an employee record in the system flows as follows:

Selected in **Recruitment** ➔ Profile Created in **Employees** ➔ Starts work via **Onboarding** ➔ Uses daily **Attendance & Leave** ➔ Evaluated via monthly **Performance & Payroll** ➔ Resigns via **Offboarding** ➔ Deactivated via **Soft Delete**.

---

## 10. Common Scenarios & FAQ

- **Q: An employee cannot log in, what should I check?**
  A: Go to \`Employee Details\` and verify their Email is spelled correctly. Then, ensure their Status is 'Active'. (Soft Deleted employees cannot log in).
- **Q: How do I handle an employee's promotion or salary increase?**
  A: First, use \`Edit Profile\` to update their Position and Salary fields. Then, go to their \`Employee Details > Career Timeline\` and add a new Milestone labeled 'PROMOTION' or 'SALARY RAISE' to keep a permanent historical record.

---

## 11. Important Notes

- **Accurate Emails:** Ensure the email address is 100% correct, as it is the sole method for the employee to log in to the HRM portal.
- **Avoid Hard Deletes for Resignations:** NEVER use Hard Delete for an employee who has resigned. Always use \`Soft Delete\` so you don't lose their historical payroll and attendance records.

---

## 12. Related Modules

- <a href="#" data-article-title="HRM Overview" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">HRM Overview</a>
- <a href="#" data-article-title="Dashboard" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Dashboard</a>
- <a href="#" data-article-title="Departments" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Departments</a>
- <a href="#" data-article-title="Positions" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Positions</a>
- <a href="#" data-article-title="Attendance" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Attendance</a>
- <a href="#" data-article-title="Leave Management" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Leave Management</a>
- <a href="#" data-article-title="Payroll & KPI" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Payroll & KPI</a>
- <a href="#" data-article-title="Complete Employee Lifecycle" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Complete Employee Lifecycle</a>
`;

    const myHtml = marked.parse(myMarkdown);
    const enHtml = marked.parse(enMarkdown);

    // Update in Database
    const { data: article, error } = await supabaseAdmin
      .from('hrm_manual_articles')
      .select('id, title, published_content, draft_content')
      .eq('title', 'Employees')
      .single();

    if (error || !article) {
      console.log('Employees article not found in Database!');
      return;
    }

    const payload = JSON.stringify({ my: myHtml, en: enHtml });

    await supabaseAdmin.from('hrm_manual_articles').update({
      draft_content: payload,
      published_content: payload,
      status: 'published'
    }).eq('id', article.id);

    console.log('Successfully updated Employees article with structured Burmese and English JSON!');

  } catch (err) {
    console.error('Error:', err);
  }
}

run();
