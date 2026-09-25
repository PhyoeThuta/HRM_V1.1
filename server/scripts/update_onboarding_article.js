import { supabaseAdmin } from '../lib/supabase.js';
import { marked } from 'marked';

async function run() {
  try {
    console.log('Translating and refining Onboarding Article...');

    const myMarkdown = `
# Onboarding (ဝန်ထမ်းသစ် အလုပ်စတင်ခြင်း)

## 1. Onboarding Overview (ယေဘုယျအကြောင်းအရာ)
**Onboarding Module** သည် BBD HRM တွင် အလုပ်ခန့်အပ်ပြီးသော ဝန်ထမ်းသစ်များအတွက် ကုမ္ပဏီနှင့် မိတ်ဆက်ပေးခြင်း၊ လိုအပ်သော ပစ္စည်းများ ထုတ်ပေးခြင်းနှင့် စာရွက်စာတမ်းများ လက်မှတ်ထိုးခြင်း စသည့် လုပ်ငန်းစဉ်များကို စနစ်တကျ မှတ်တမ်းတင်ပေးသော နေရာဖြစ်ပါသည်။
- **ဘယ်အချိန်မှာ စတင်သလဲ?** ဝန်ထမ်းသစ်တစ်ဦးကို \`Employees\` ထဲတွင် စာရင်းသွင်းပြီးသည်နှင့် ချက်ချင်း Onboarding စတင်ရမည် ဖြစ်ပါသည်။ (Recruitment နှင့် Onboarding မတူညီပါ။ Recruitment သည် လူရွေးချယ်ခြင်း ဖြစ်ပြီး၊ Onboarding သည် ရွေးချယ်ပြီးသူကို အလုပ်စတင်ခိုင်းခြင်း ဖြစ်ပါသည်)။
- **ဘယ်သူတွေ အသုံးပြုသလဲ?** HR နှင့် Admin အဖွဲ့များက အဓိက စီမံပြီး Checklist များကို အမှန်ခြစ် (Complete) ပေးရပါသည်။

---

## 2. Onboarding Screen (စာမျက်နှာ ဖွဲ့စည်းပုံ)

Onboarding စာမျက်နှာတွင် အဓိက အပိုင်း (၃) ပိုင်း ပါဝင်ပါသည်-

1. **Metric Cards (အကျဉ်းချုပ် ကိန်းဂဏန်းများ):**
   - **Pre-boarding:** အလုပ်မဆင်းမီ ပြင်ဆင်နေဆဲ အရေအတွက်။
   - **In Progress:** အလုပ်ဆင်းနေသော်လည်း Onboarding မပြီးသေးသော အရေအတွက်။
   - **Completed:** Onboarding အားလုံး ပြီးစီးသွားသော အရေအတွက်။

2. **New Hires Alert (ဝန်ထမ်းသစ် သတိပေးချက်):**
   - \`Employees\` တွင် အသစ်ထည့်ထားသော်လည်း Onboarding မစရသေးသော ဝန်ထမ်းများကို အနီရောင် (!) ဖြင့် သတိပေး ပြသထားပါသည်။ \`Start\` ကို နှိပ်ပြီး လုပ်ငန်းစဉ်ကို စတင်နိုင်ပါသည်။

3. **Active Progress Bars (လက်ရှိ လုပ်ဆောင်နေဆဲ စာရင်း):**
   - လက်ရှိ Onboarding လုပ်နေဆဲ ဝန်ထမ်းများ၏ အမည်၊ Employee Code၊ စတင်သည့်ရက်စွဲ (Start Date) နှင့် Checklist မည်မျှ ပြီးစီးနေပြီကို ရာခိုင်နှုန်း (e.g., 50%) ဖြင့် ပြသထားပါသည်။ \`View Tasks\` ကို နှိပ်၍ အသေးစိတ် ကြည့်နိုင်ပါသည်။

---

## 3. Onboarding Checklist (လုပ်ဆောင်ရမည့် စာရင်းများ)

\`View Tasks\` ကို နှိပ်လိုက်ပါက Onboarding Detail စာမျက်နှာကို ရောက်ရှိမည်ဖြစ်ပြီး အောက်ပါ ကဏ္ဍ (Categories) များအလိုက် Checklist များကို မြင်တွေ့ရပါမည်-

- **📋 Pre-boarding:** အလုပ်မဆင်းမီ ကြိုတင်ပြင်ဆင်ရမည့် ကိစ္စများ။
- **📄 Documentation:** အလုပ်ခန့်စာချုပ်၊ ကိုယ်ရေးရာဇဝင် စသည့် စာရွက်စာတမ်းများ လက်မှတ်ထိုးခြင်း။
- **💻 IT Setup:** အီးမေးလ် ဖွင့်ပေးခြင်း၊ ကွန်ပျူတာ ထုတ်ပေးခြင်း၊ စကားဝှက် ပေးခြင်း။
- **👋 Introduction:** ဌာနတွင်း မိတ်ဆက်ပေးခြင်း၊ ရုံးပတ်ဝန်းကျင်နှင့် မိတ်ဆက်ပေးခြင်း။

*မှတ်ချက်: Checklist တစ်ခုစီတွင် ပြုလုပ်ရမည့် "Task Name", "Due Date" နှင့် "Owner (တာဝန်ခံ)" အမည်များ ပါဝင်ပါသည်။*

---

## 4. Starting an Onboarding Process (လုပ်ငန်းစဉ် စတင်ခြင်း)

ဝန်ထမ်းသစ်အတွက် Onboarding စတင်ရန်-

1. \`Onboarding\` စာမျက်နှာကို ဖွင့်ပါ။
2. အလယ်တွင်ရှိသော **New Hires Alert** ကဏ္ဍတွင် စတင်လိုသော ဝန်ထမ်းသစ်၏ နာမည်ကို ရှာပါ။
3. ကတ်ပေါ်ရှိ \`Start\` ခလုတ်ကို နှိပ်ပါ။
4. စနစ်မှ အလိုအလျောက် Onboarding Record အသစ်တစ်ခု ဖန်တီးပေးပြီး၊ \`Pre-boarding\` အခြေအနေ (Status) ဖြင့် အောက်ဘက်ရှိ Active Progress စာရင်းထဲသို့ ရောက်ရှိသွားပါမည်။

---

## 5. Managing Tasks (Checklist များကို ပြီးမြောက်ကြောင်း မှတ်သားခြင်း)

Checklist များကို အမှန်ခြစ်ရန်-

1. Active Progress စာရင်းရှိ ဝန်ထမ်းကတ်ပေါ်မှ \`View Tasks\` ကို နှိပ်ပါ။
2. Task List များပေါ်လာပါမည်။
3. လုပ်ဆောင်ပြီးစီးသွားသော Task များ၏ ဘေးရှိ အဝိုင်း (Checkbox) ကို ကလစ်တစ်ချက် နှိပ်လိုက်ပါ။
4. အစိမ်းရောင် အမှန်ခြစ် ပေါ်လာပြီး စာသားများ ဖြတ်မျဉ်း (Strikethrough) တားသွားပါမည်။ ဘေးတွင် ပြီးစီးသွားသော ရက်စွဲကိုလည်း ပြသပေးပါမည်။
5. အပြင်ဘက်ရှိ Progress Bar (ရာခိုင်နှုန်း) သည် ချက်ချင်း တက်သွားမည် ဖြစ်ပါသည်။

---

## 6. Onboarding Completion (လုပ်ငန်းစဉ် ပြီးမြောက်ခြင်း)

- **မည်သို့ ပြီးမြောက်သလဲ?** Task List (Checklist) ရှိ အချက်များ အားလုံးကို အမှန်ခြစ် (Complete) ပြီးသွားပါက Onboarding ရာခိုင်နှုန်း (100%) ပြည့်သွားပါမည်။
- **သက်ရောက်မှု:** 100% ပြည့်သွားပါက ၎င်း၏ Status သည် "Completed" ဟု အစိမ်းရောင် ပြောင်းသွားမည်ဖြစ်ပြီး၊ အပြင်ဘက် Metric Card တွင်လည်း Completed အရေအတွက် (၁) ခု တိုးသွားမည် ဖြစ်ပါသည်။

---

## 7. Onboarding ↔ Recruitment (ချိတ်ဆက်မှု)

- Recruitment မှ ဝန်ထမ်းလောင်း (Candidate) ကို \`Hired\` ဟု သတ်မှတ်ပြီး "Convert to Employee" ခလုတ် နှိပ်လိုက်သည်နှင့် ၎င်းသည် ဝန်ထမ်း (Employee) အဖြစ်သို့ ပြောင်းသွားပါသည်။
- ထိုသို့ Employee ဖြစ်လာသူတိုင်းကို Onboarding စာမျက်နှာ၏ **New Hires Alert** တွင် အလိုအလျောက် (Automatic) လာရောက် ပြသပေးမည် ဖြစ်ပါသည်။ ဤသည်မှာ Recruitment နှင့် Onboarding အကြား အဓိက ချိတ်ဆက်မှု ဖြစ်ပါသည်။

---

## 8. Onboarding ↔ Employees (ချိတ်ဆက်မှု)

- Onboarding သည် \`Employees\` Module ပေါ်တွင် အခြေခံပါသည်။
- Employee Profile ထဲရှိ ဝန်ထမ်းအမည် (Name)၊ ဝန်ထမ်းကုဒ် (Code) စသည့် အချက်အလက်များကို Onboarding တွင် တိုက်ရိုက် ဆွဲယူ (Sync) အသုံးပြုထားပါသည်။

---

## 9. Onboarding ↔ Departments & Positions (ချိတ်ဆက်မှု)

- Onboarding တွင် သီးခြား Department သို့မဟုတ် Position ခွဲခြားသည့် Filter မပါဝင်ပါ။ သို့သော် ဝန်ထမ်းတစ်ဦး၏ Department နှင့် Position အလိုက် ၎င်းကို လက်တွေ့ မည်သို့ Onboarding လုပ်ရမည် (ဥပမာ - IT ဝန်ထမ်းအတွက် IT Setup သီးသန့် လုပ်ခြင်း) ကိုမူ HR မှ လက်တွေ့ ဆုံးဖြတ်ရမည် ဖြစ်ပါသည်။

---

## 10. အခြား Modules များနှင့် ချိတ်ဆက်မှု

*မှတ်ချက်: လက်ရှိ Onboarding တွင် အောက်ပါ Module များနှင့် တိုက်ရိုက် (System-level) ချိတ်ဆက်ထားခြင်း မရှိသေးပါ။ Onboarding သည် ဝန်ထမ်းသစ် နေရာချထားခြင်း (Setup) အတွက် သီးသန့် Checklist စနစ် အဖြစ်သာ အလုပ်လုပ်ပါသည်။ (ဥပမာ - Onboarding ပြီးမှ Attendance သွင်းခွင့်ရမည် ဟူသော တားမြစ်ချက် မျိုး မရှိပါ)*။

---

## 11. လက်တွေ့ အသုံးပြုမှု (Practical Workflows)

**HR တစ်ယောက်၏ လက်တွေ့ လုပ်ငန်းစဉ်:**
1. ဝန်ထမ်းအသစ် ရောက်လာသောနေ့တွင် \`Onboarding\` သို့ သွား၍ ထိုသူ၏ နာမည်ဘေးရှိ \`Start\` ကို နှိပ်လိုက်ပါ။
2. \`View Tasks\` ထဲသို့ဝင်၍ HR က လုပ်ပေးရမည့် ကိစ္စများ (ဥပမာ - စာချုပ်ချုပ်ခြင်း၊ မှတ်ပုံတင်မိတ္တူ ယူခြင်း) ကို လုပ်ဆောင်ပြီးတိုင်း အမှန်ခြစ် လိုက်ခြစ်ပါ။
3. IT သို့မဟုတ် Facility ပိုင်းဆိုင်ရာ (ဥပမာ - ကွန်ပျူတာ ပေးခြင်း၊ Uniform ပေးခြင်း) ကို သက်ဆိုင်ရာ ဌာနက လုပ်ပေးပြီးပါက ထပ်မံ၍ အမှန်ခြစ် ခြစ်ပါ။
4. အားလုံး ခြစ်ပြီး (100%) ဖြစ်သွားပါက ဤဝန်ထမ်းအတွက် Onboarding ပြီးဆုံးပါပြီ။

---

## 12. အဖြစ်များသော အခြေအနေများ (Real-World HR Scenarios)

- **ဝန်ထမ်းသစ် အလုပ်စဆင်းသည့် နေ့:** HR သည် Onboarding ကို \`In Progress\` တွင် ထားရှိပြီး ဌာနတွင်း လိုက်လံ မိတ်ဆက်ပေးခြင်း၊ စားပွဲနေရာ ချထားပေးခြင်း များကို ပြုလုပ်ကာ \`Introduction\` Task များကို အမှန်ခြစ်ပါမည်။
- **Email/Software Accounts များ ဖွင့်ပေးခြင်း:** HR သည် IT ဌာနကို အကြောင်းကြားပြီး IT မှ Software/Email များ ဖွင့်ပေးပြီးပါက HR သို့ အကြောင်းပြန်မည်။ ထို့နောက် HR က Onboarding မှ \`IT Setup\` Task ကို အမှန်ခြစ်ပေးပါမည်။

---

## 13. အမေးများသော မေးခွန်းများ (FAQ & Troubleshooting)

- **မေး: ဝန်ထမ်းအသစ် ရောက်လာပေမယ့် "New Hires Alert" မှာ သွားမပေါ်ဘူး ဖြစ်နေတယ်။**
  ဖြေ: \`Employees\` Module ထဲတွင် ထိုသူကို ဝန်ထမ်းအဖြစ် စာရင်းသွင်း (Add Employee) ပြီးပြီလား ပြန်စစ်ဆေးပါ။ စာရင်းသွင်းပြီးမှသာ Onboarding တွင် လာပေါ်မည် ဖြစ်ပါသည်။
- **မေး: Checklist အမှန်ခြစ် ခြစ်လို့မရဘူး ဖြစ်နေတယ်။**
  ဖြေ: System Connection နှေးနေ၍ ဖြစ်နိုင်ပါသည်။ Page ကို Refresh လုပ်ပြီး ပြန်ခြစ်ကြည့်ပါ။

---

## 14. အရေးကြီး မှတ်သားရန်

- **စနစ်တကျ လုပ်ဆောင်ခြင်း:** Onboarding Task များကို အလွတ်သဘော ကျော်မသွားဘဲ တစ်ခုချင်းစီ အမှန်ခြစ်ပေးခြင်းဖြင့် နောင်တစ်ချိန်တွင် Data ပြန်စစ်ဆေးသည့်အခါ (ဥပမာ - ဒီဝန်ထမ်းကို Laptop ပေးထားလား စစ်သည့်အခါ) လွယ်ကူစေပါသည်။
- **အလိုအလျောက် သတိပေးချက် မရှိခြင်း:** Task တာဝန်ခံ (Owner) ဆီသို့ Email သို့မဟုတ် Notification အလိုအလျောက် ပို့ပေးသည့် စနစ် လက်ရှိတွင် မပါဝင်သေးသဖြင့် HR ကသာ Task များကို လိုက်လံ စစ်ဆေး အမှန်ခြစ်ပေးရန် လိုအပ်ပါသည်။

---

## 15. Employee Lifecycle တွင် ပါဝင်မှု

Onboarding သည် Recruitment အပြီး ဝန်ထမ်းဘဝ (Employee Lifecycle) ၏ ဒုတိယမြောက် အရေးအကြီးဆုံး အဆင့်ဖြစ်ပါသည်။

Recruitment (Hired) ➔ Employee Creation ➔ **Onboarding (Manual Checklist Execution)** ➔ Attendance & Leave (လုပ်ငန်းခွင် ဝင်ရောက်ခြင်း) ➔ ...

---

## 16. ဆက်လက်ဖတ်ရှုရန် (Related Modules)

- <a href="#" data-article-title="Recruitment" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Recruitment</a>
- <a href="#" data-article-title="Employees" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Employees</a>
- <a href="#" data-article-title="Employee Details" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Employee Details</a>
- <a href="#" data-article-title="Complete Employee Lifecycle" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Complete Employee Lifecycle</a>
`;

    const enMarkdown = `
# Onboarding

## 1. Onboarding Overview
The **Onboarding Module** in BBD HRM is designed to ensure new employees transition smoothly into the company. It provides a structured checklist system to track everything from document signing to IT equipment setup.
- **When does it start?** Onboarding begins immediately after a candidate is converted into an Employee (or when a new employee is manually added to the system). Note: Recruitment is about *finding* the person; Onboarding is about *equipping and welcoming* them.
- **Who uses it?** Primarily HR and Admin teams, who monitor and check off the completed tasks.

---

## 2. Onboarding Screen

The main Onboarding dashboard consists of three clear sections:

1. **Metric Cards:**
   - **Pre-boarding:** Number of employees preparing to start.
   - **In Progress:** Employees currently going through their onboarding tasks.
   - **Completed:** Employees who have successfully finished 100% of their onboarding.

2. **New Hires Alert:**
   - This grid automatically flags any new employee in the system who hasn't started their onboarding process yet. A simple \`Start\` button initiates their checklist.

3. **Active Progress Bars:**
   - A list of all ongoing onboarding processes. Each card shows the employee's Avatar, Name, Employee Code, Start Date, and a dynamic Progress Bar (e.g., 50%) indicating how many tasks are completed. You can click \`View Tasks\` to open their specific checklist.

---

## 3. Onboarding Checklist

Clicking \`View Tasks\` takes you to the detailed checklist page, which categorizes tasks into logical groups:

- **📋 Pre-boarding:** Preparation before the employee's first day.
- **📄 Documentation:** Contracts, NDAs, and ID copies.
- **💻 IT Setup:** Creating email accounts, software access, and hardware (laptop) allocation.
- **👋 Introduction:** Office tours, team introductions, and basic orientation.

*Note: Each task displays the "Task Name", an optional "Due Date", and the "Owner" responsible for ensuring it gets done.*

---

## 4. Starting an Onboarding Process

To initiate onboarding for a new hire:

1. Navigate to the \`Onboarding\` page.
2. Locate the employee in the **New Hires Alert** section.
3. Click the \`Start\` button on their card.
4. The system will automatically generate their task list, assign them a \`Pre-boarding\` status, and move them down into the Active Progress list.

---

## 5. Managing Tasks (Completing the Checklist)

To mark tasks as complete:

1. Click \`View Tasks\` on the employee's progress card.
2. Review the list of tasks.
3. Once a task is done, click the circular Checkbox next to it.
4. The task will immediately turn green, strike through the text, and stamp the completion date.
5. The overall Progress Bar percentage will automatically recalculate and increase.

---

## 6. Onboarding Completion

- **How is it completed?** An onboarding process is considered complete when 100% of the checklist items are marked as done.
- **What happens?** The system will automatically change the overall status badge to green "Completed", and the Top Metric counter for Completed Onboardings will increase by 1.

---

## 7. Onboarding ↔ Recruitment Relationship

- The link between Recruitment and Onboarding is highly automated.
- When HR clicks "Convert to Employee" on a *Hired* candidate in the Recruitment module, they are instantly added to the \`Employees\` database. 
- Because they are a new employee, they will automatically appear in the **New Hires Alert** section of the Onboarding dashboard, waiting for HR to click \`Start\`.

---

## 8. Onboarding ↔ Employees Relationship

- Onboarding relies directly on the \`Employees\` database.
- It pulls the Employee Name and Employee Code directly from their profile. If you change an employee's name in their profile, it will update here as well.

---

## 9. Onboarding ↔ Departments & Positions

- Currently, the Onboarding system uses a standardized checklist for all new hires. There are no automated filters based on Department or Position. HR must manually decide which IT Setup or specific tasks are relevant based on the person's role.

---

## 10. Connection to Other HRM Modules

*Note: The Onboarding module currently acts as an isolated operational checklist. It does not strictly block or automate downstream modules (e.g., an employee can still clock their Attendance even if their Onboarding is only 50% complete).*

---

## 11. Practical Workflows

**A standard HR workflow:**
1. On the employee's first day, HR goes to the \`Onboarding\` page and clicks \`Start\` for the new hire.
2. HR opens \`View Tasks\` and completes the "Documentation" section once the employee signs their contract.
3. HR coordinates with the IT team. Once IT provides the laptop and email, HR checks off the "IT Setup" tasks.
4. Finally, HR introduces the employee to the team and checks off the "Introduction" tasks, reaching 100% completion.

---

## 12. Real-World HR Scenarios

- **Preparing IT Assets:** Before the employee arrives, HR can check the Onboarding dashboard to see who is in the "Pre-boarding" stage, reminding them to request laptops and accounts from the IT department in advance.

---

## 13. Common Questions / Troubleshooting

- **Q: A new employee started today but they aren't in the "New Hires Alert" box?**
  A: Double-check the \`Employees\` page. The person must be officially added as an Employee first before they can appear in Onboarding.
- **Q: I clicked the checkbox but it didn't save.**
  A: This is usually due to a temporary network issue. Refresh the page and click it again.

---

## 14. Important Notes

- **Data Consistency:** Do not skip checking off tasks. This digital checklist serves as your audit trail to verify that an employee received all necessary company property (like laptops or uniforms) in case it needs to be returned during offboarding.
- **Manual Tracking:** The system relies on HR to manually check off tasks; it does not automatically send email reminders to the "Owners" of the tasks.

---

## 15. Employee Lifecycle Context

Onboarding is the critical bridge between getting hired and actually working:

Recruitment ➔ Employee Creation ➔ **Onboarding (Orientation & Setup)** ➔ Attendance & Leave (Daily Operations) ➔ ...

This is a largely manual checklist execution phase to ensure the employee is fully equipped to succeed.

---

## 16. Related Modules

- <a href="#" data-article-title="Recruitment" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Recruitment</a>
- <a href="#" data-article-title="Employees" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Employees</a>
- <a href="#" data-article-title="Employee Details" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Employee Details</a>
- <a href="#" data-article-title="Complete Employee Lifecycle" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Complete Employee Lifecycle</a>
`;

    const myHtml = marked.parse(myMarkdown);
    const enHtml = marked.parse(enMarkdown);

    // Update in Database
    const { data: article, error } = await supabaseAdmin
      .from('hrm_manual_articles')
      .select('id, title, published_content, draft_content')
      .eq('title', 'Onboarding')
      .single();

    if (error || !article) {
      console.log('Onboarding article not found in Database!');
      return;
    }

    const payload = JSON.stringify({ my: myHtml, en: enHtml });

    await supabaseAdmin.from('hrm_manual_articles').update({
      draft_content: payload,
      published_content: payload,
      status: 'published'
    }).eq('id', article.id);

    console.log('Successfully updated Onboarding article with structured Burmese and English JSON!');

  } catch (err) {
    console.error('Error:', err);
  }
}

run();
