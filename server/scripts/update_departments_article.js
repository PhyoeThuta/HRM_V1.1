import { supabaseAdmin } from '../lib/supabase.js';
import { marked } from 'marked';

async function run() {
  try {
    console.log('Translating and refining Departments Article...');

    const myMarkdown = `
# Departments (ဌာနများ စီမံခန့်ခွဲခြင်း)

## 1. Departments Overview (ယေဘုယျအကြောင်းအရာ)
**Departments Module** ဆိုသည်မှာ ကုမ္ပဏီအတွင်းရှိ ဌာနအသီးသီး (ဥပမာ - HR, Finance, IT, Sales) ကို ဖွဲ့စည်းသတ်မှတ်ပေးသော နေရာဖြစ်ပါသည်။
- **ဘာအတွက် အသုံးပြုသလဲ?** ကုမ္ပဏီ၏ ဖွဲ့စည်းပုံကို စနစ်တကျဖြစ်စေရန်နှင့် ဝန်ထမ်းများကို သက်ဆိုင်ရာ ဌာနအလိုက် ခွဲခြားသတ်မှတ်နိုင်ရန် အသုံးပြုပါသည်။
- **ဘယ်သူတွေ အသုံးပြုသလဲ?** Admin နှင့် HR Manager များက ဌာနအသစ်များ ထည့်သွင်းခြင်းနှင့် ပြင်ဆင်ခြင်းများကို ပြုလုပ်ပါသည်။
- **ဘာကြောင့် အရေးကြီးသလဲ?** ဌာန (Department) သတ်မှတ်ထားခြင်း မရှိပါက ဝန်ထမ်းများကို နေရာချထား၍ မရနိုင်သလို Org Chart (ကုမ္ပဏီ ဖွဲ့စည်းပုံ ဇယား) လည်း အလုပ်လုပ်မည် မဟုတ်ပါ။

---

## 2. Department List (ဌာန စာရင်းများ)

Departments စာမျက်နှာတွင် ဌာနများကို ကတ် (Card) ပုံစံဖြင့် ရှင်းလင်းစွာ ပြသထားပါသည်။ ကတ်တစ်ခုစီတွင် အောက်ပါတို့ကို မြင်တွေ့ရပါမည်-

- **Department Name:** ဌာန၏ အမည် (ဥပမာ - Human Resources)။
- **Description:** ဌာန၏ လုပ်ငန်းဆောင်တာ အကျဉ်းချုပ်။
- **Employee Count:** ဤဌာနတွင် လက်ရှိ တာဝန်ထမ်းဆောင်နေသော ဝန်ထမ်း အရေအတွက်။

**လုပ်ဆောင်နိုင်သော အရာများ (Available Actions):**
- **+ Add Department:** ဌာနအသစ် ဖန်တီးရန် (Admin သာ)။
- **Edit:** ဌာနအမည်နှင့် အကြောင်းအရာကို ပြင်ဆင်ရန် (Admin သာ)။
- **Delete:** ဌာနကို ဖျက်ပစ်ရန် (Admin သာ)။

*(မှတ်ချက် - ဤစာမျက်နှာတွင် Search သို့မဟုတ် Filter ခလုတ်များ မပါဝင်ဘဲ ဌာနအားလုံးကို တစ်ပြိုင်နက်တည်း ကြည့်ရှုနိုင်ရန် စီစဉ်ထားပါသည်။)*

---

## 3. Create Department (ဌာနအသစ် ဖန်တီးခြင်း)

ဌာနအသစ် ဖန်တီးရန် လွယ်ကူပါသည်။ အောက်ပါအဆင့်များအတိုင်း လုပ်ဆောင်ပါ-

1. **Departments** စာမျက်နှာသို့ သွားပါ။
2. အပေါ်ညာဘက်ထောင့်ရှိ \`+ New Department\` ခလုတ်ကို နှိပ်ပါ။
3. အောက်ပါ အချက်အလက်များကို ဖြည့်သွင်းပါ-
   - **Name (မဖြစ်မနေ):** ဌာနအမည် အသစ် (ဥပမာ - Marketing Department)။
   - **Description (ရွေးချယ်နိုင်သည်):** ဤဌာနသည် မည်သည့်အလုပ်များကို လုပ်ဆောင်သည်ဟူသော မှတ်စု။
4. \`Save\` ကို နှိပ်ပါ။
5. ဌာနစာရင်း ကတ်များထဲတွင် ဌာနအသစ် ရောက်ရှိလာသည်ကို တွေ့ရပါမည်။

---

## 4. Edit Department (ဌာန အချက်အလက် ပြင်ဆင်ခြင်း)

- **မည်သို့ပြင်ဆင်မလဲ?** ဌာနကတ် (Card) ၏ ညာဘက်အောက်ထောင့်ရှိ \`Edit\` ကို နှိပ်ပါ။
- **ဘာတွေပြင်နိုင်သလဲ?** ဌာန၏ \`Name\` နှင့် \`Description\` ကို ပြင်ဆင်နိုင်ပါသည်။
- **သက်ရောက်မှု:** ဌာနအမည်ကို ပြင်ဆင်လိုက်ပါက၊ ထိုဌာနအောက်တွင် အလုပ်လုပ်နေသော ဝန်ထမ်းများအားလုံး၏ Profile များတွင် ဌာနအမည်သစ်သို့ ချက်ချင်း အလိုအလျောက် ပြောင်းလဲသွားမည် ဖြစ်ပါသည်။

---

## 5. Delete Department (ဌာန ဖျက်ပစ်ခြင်း)

- **ဖျက်ရန် လုပ်ဆောင်ပုံ:** ဖျက်လိုသော ဌာနကတ်ရှိ \`Delete\` ကို နှိပ်ပြီး Confirm (သေချာပါသည်) ဟု အတည်ပြုပေးရပါမည်။ Admin များသာ ဤခလုတ်ကို မြင်ရ/သုံးရပါသည်။
- **သက်ရောက်မှု (Requires Verification):** ဌာနတစ်ခုကို ဖျက်ပစ်လိုက်ပါက အပြီးတိုင်ဖျက်ခြင်း (Hard Delete) ဖြစ်သွားပါမည်။ သို့သော် ထိုဌာနအတွင်း ဝန်ထမ်းများ ရှိနေသေးပါက Database Rule အရ ဖျက်ခွင့်ပြုမည်/မပြုမည်ကို သေချာစွာ စစ်ဆေး (Verify) ရန် လိုအပ်ပါသည်။ ပြဿနာမရှိစေရန် ဖျက်လိုသော ဌာနရှိ ဝန်ထမ်းများကို အခြားဌာနများသို့ အရင်ပြောင်းရွှေ့ပေးထားရန် အကြံပြုပါသည်။

---

## 6. Department နှင့် Employees ချိတ်ဆက်မှု (Relationship)

**Department → Employees** ဆက်စပ်မှုမှာ အလွန်အရေးကြီးပါသည်။

- **ချိတ်ဆက်ပုံ:** ဝန်ထမ်းတစ်ဦးကို စတင်စာရင်းသွင်းချိန် (\`Add Employee\`) တွင် သူ၏ Department ကို မဖြစ်မနေ ရွေးချယ်ပေးရပါသည်။
- **ပြောင်းလဲပုံ:** ဝန်ထမ်းတစ်ဦး ဌာနပြောင်းသွားပါက၊ \`Employees > Edit Profile\` တွင် Department နေရာ၌ ဌာနအသစ်ကို ရွေးချယ်ပေးရပါမည်။
- **မြင်တွေ့ရပုံ:** Department ကတ်များပေါ်ရှိ ဝန်ထမ်းအရေအတွက် (Employee Count) သည် ဤရွေးချယ်ထားမှုများအပေါ် အခြေခံ၍ အလိုအလျောက် တွက်ချက်ပြသခြင်း ဖြစ်ပါသည်။

---

## 7. အခြား Modules များနှင့် ချိတ်ဆက်မှု (Connections)

Departments Module သည် အခြား Module များနှင့် အောက်ပါအတိုင်း ဆက်စပ်နေပါသည်-

- **Employees (Direct):** ဝန်ထမ်းစာရင်းများတွင် Department အလိုက် စစ်ထုတ် (Filter) နိုင်ခြင်း၊ Department အလိုက် ခွဲခြားပြသခြင်း။
- **Org Chart (Direct):** Department များကို အခြေခံ၍ ကုမ္ပဏီ၏ အထက်အောက် ဖွဲ့စည်းပုံဇယားကို ဆွဲသားပါသည်။
- **Positions (Informational):** ရာထူး (Position) များသည် သက်ဆိုင်ရာ ဌာန (Department) အောက်တွင် ရှိနေတတ်ပါသည်။
- **Performance Tracker (Indirect):** KPI အမှတ်ပေးရာတွင် Department အလိုက် သီးသန့် ရည်မှန်းချက်များ ရှိနိုင်ပါသည်။

---

## 8. လက်တွေ့ အသုံးပြုမှု (Practical Workflows)

**ဌာနရှိ ဝန်ထမ်းများကို စစ်ဆေးရန်:**
1. \`Departments\` စာမျက်နှာသို့ သွားပါ။
2. မိမိကြည့်လိုသော ဌာန၏ ကတ် (Card) ပေါ်ရှိ "ဝန်ထမ်းအရေအတွက်" (ဥပမာ - 15 Employees) ကို ကြည့်ပါ။
3. မည်သူတွေဖြစ်သည်ကို အတိအကျ သိလိုပါက \`Employees\` စာမျက်နှာသို့ သွားပြီး အပေါ်ရှိ Filter တွင် ထိုဌာနကို ရွေးချယ် (Select) ပါ။

---

## 9. အဖြစ်များသော အခြေအနေများ (Real-World Scenarios)

- **ကုမ္ပဏီ ဌာနအသစ် ဖွင့်ခြင်း:** HR သည် Departments စာမျက်နှာသို့ သွား၍ ဌာနအသစ် ဖန်တီးရမည်။ ထို့နောက် \`Employees\` စာမျက်နှာသို့ သွား၍ သက်ဆိုင်ရာ ဝန်ထမ်းများကို ထိုဌာနသစ်အောက်သို့ ပြောင်းရွှေ့ (Edit) ပေးရမည်။
- **ဌာနအမည် ပြောင်းခြင်း:** ကုမ္ပဏီမှ "Sales" ကို "Sales & Marketing" ဟု ပြောင်းလိုက်ပါက၊ HR သည် \`Departments\` သို့သွား၍ Edit လုပ်လိုက်ရုံဖြင့် လုံလောက်ပါသည်။ ဝန်ထမ်း တစ်ယောက်ချင်းစီကို လိုက်ပြောင်းရန် မလိုပါ။

---

## 10. အရေးကြီး မှတ်သားရန် နှင့် FAQ

- **အမည်တူ ဌာနများ (Duplicate Names):** ဌာနအမည်များ တူညီနေပါက မှားယွင်းမှုများ ဖြစ်နိုင်သဖြင့် နာမည်မထပ်အောင် (ဥပမာ - IT - Yangon နှင့် IT - Mandalay) သတိပြုပါ။
- **Permissions:** Admin မဟုတ်သော သာမန် ဝန်ထမ်းများသည် ဌာနများကို ဖန်တီး/ပြင်ဆင်ခွင့် မရှိဘဲ ကြည့်ရှုခွင့် (View) သာ ရရှိပါမည်။

---

## 11. Employee Lifecycle တွင် ပါဝင်မှု

Department သည် Employee Lifecycle ၏ အစောဆုံး အဆင့်များထဲမှ တစ်ခုဖြစ်ပါသည်။
ဝန်ထမ်းတစ်ဦး အလုပ်ရပြီးသည်နှင့် (\`Employee Creation\`) ၎င်းအား သင့်လျော်သော **Department** နှင့် **Position** သို့ နေရာချထားရပါသည်။ ထိုသို့ နေရာချထားမှသာ ၎င်း၏ \`Attendance\`, \`Leave\`, နှင့် \`Payroll\` လုပ်ငန်းစဉ်များ မှန်ကန်စွာ လည်ပတ်နိုင်မည် ဖြစ်ပါသည်။ ထို့ကြောင့် Department အချက်အလက်များကို အမြဲတမ်း မှန်ကန်စွာ ထိန်းသိမ်းထားရန် အလွန်အရေးကြီးပါသည်။

---

## 12. ဆက်လက်ဖတ်ရှုရန် (Related Modules)

- <a href="#" data-article-title="HRM Overview" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">HRM Overview</a>
- <a href="#" data-article-title="Employees" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Employees</a>
- <a href="#" data-article-title="Employee Details" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Employee Details</a>
- <a href="#" data-article-title="Positions" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Positions</a>
- <a href="#" data-article-title="Org Chart" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Org Chart</a>
- <a href="#" data-article-title="Complete Employee Lifecycle" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Complete Employee Lifecycle</a>
`;

    const enMarkdown = `
# Departments

## 1. Departments Overview
The **Departments Module** is where the foundational organizational units of the company (such as HR, Finance, IT, Sales) are defined and managed.
- **What is it used for?** It is used to structure the company logically and group employees into their respective working teams.
- **Who uses it?** Admins and HR Managers use this module to create or update department structures.
- **Why is it important?** Without defined Departments, you cannot properly assign employees, and visual hierarchies like the Org Chart will fail to function.

---

## 2. Department List

On the Departments page, departments are displayed cleanly as a grid of Cards. Each card shows:

- **Department Name:** The name of the department (e.g., Human Resources).
- **Description:** A brief summary of what the department does.
- **Employee Count:** The current number of employees actively assigned to this department.

**Available Actions:**
- **+ Add Department:** Create a new organizational unit (Admin only).
- **Edit:** Change the department's name or description (Admin only).
- **Delete:** Remove the department from the system (Admin only).

*(Note: There are no search or filter bars on this page; all departments are visible at a glance in the grid layout.)*

---

## 3. Create Department

Creating a new department is straightforward:

1. Open the **Departments** page.
2. Click the \`+ New Department\` button in the top right corner.
3. Fill in the required details:
   - **Name (Required):** The name of the new department (e.g., Marketing).
   - **Description (Optional):** A short note on the department's responsibilities.
4. Click \`Save\`.
5. The new department will instantly appear as a card in the grid.

---

## 4. Edit Department

- **How to Edit:** Click the \`Edit\` button on the bottom right of the specific department card.
- **What can be changed:** You can update the \`Name\` and the \`Description\`.
- **Impact:** If you change a department's name (e.g., from "Sales" to "Sales & Marketing"), the profiles of all employees working under this department are automatically updated to reflect the new name instantly.

---

## 5. Delete Department

- **How to Delete:** Click \`Delete\` on the department card and confirm the prompt. Only Admins can see and use this button.
- **Impact (Requires Verification):** Deleting a department is a permanent (Hard Delete) action. *Important Note:* If there are employees still assigned to this department, database constraints usually block the deletion to prevent data corruption (requires verification based on current SQL constraints). It is highly recommended to reassign all employees to a new department before attempting to delete an old one.

---

## 6. Department to Employee Relationship

The **Department → Employees** connection is vital.

- **How it's assigned:** When HR creates a new employee (\`Add Employee\`), they must select a Department from a dropdown list.
- **How it's changed:** If an employee transfers, HR must go to \`Employees > Edit Profile\` and select the new Department.
- **How it's displayed:** The "Employee Count" visible on each Department Card is dynamically calculated based on these exact employee assignments.

---

## 7. Connection to Other Modules

The Departments module is intrinsically linked to several other HRM features:

- **Employees (Direct):** In the Employees list, you can filter staff by Department, and the list itself is grouped by Department.
- **Org Chart (Direct):** The visual company hierarchy uses Departments as the primary structural nodes.
- **Positions (Informational):** Positions (job titles) belong logically to Departments.
- **Performance Tracker (Indirect):** Department structures often dictate how KPI goals are distributed and evaluated.

---

## 8. Practical Workflows

**How to check who is in a Department:**
1. Open the \`Departments\` page.
2. Look at the specific department card to see the total number (e.g., "15 Employees").
3. To see exactly *who* those 15 people are, navigate to the \`Employees\` page and use the Department Filter dropdown at the top to select that specific department.

---

## 9. Real-World Scenarios

- **Company opens a new branch/department:** HR navigates to the Departments page to create the new unit. Then, HR goes to the Employees page to reassign existing staff (or hire new staff) into this new department.
- **Department Rebranding:** If the company rebrands "IT Support" to "Tech Operations", HR only needs to Edit the department name once in the Departments module. Every assigned employee's profile will automatically display the new name.

---

## 10. Important Notes & FAQ

- **Duplicate Names:** Be careful not to create multiple departments with the exact same name, as it will cause confusion during employee assignment. Use distinct names (e.g., "IT - Yangon" vs "IT - Mandalay").
- **Permission Restrictions:** Standard employees cannot see the Edit, Delete, or Add buttons. They can only view the existing departments and their descriptions.

---

## 11. Role in the Employee Lifecycle

Departments come into play very early in the Employee Lifecycle.
As soon as a candidate is hired (\`Employee Creation\`), they must be slotted into a **Department** and **Position**. This foundation dictates their reporting lines, org chart placement, and operational workflows (like Attendance and Leave). Maintaining an accurate department structure is essential for the HRM system to run smoothly.

---

## 12. Related Modules

- <a href="#" data-article-title="HRM Overview" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">HRM Overview</a>
- <a href="#" data-article-title="Employees" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Employees</a>
- <a href="#" data-article-title="Employee Details" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Employee Details</a>
- <a href="#" data-article-title="Positions" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Positions</a>
- <a href="#" data-article-title="Org Chart" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Org Chart</a>
- <a href="#" data-article-title="Complete Employee Lifecycle" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Complete Employee Lifecycle</a>
`;

    const myHtml = marked.parse(myMarkdown);
    const enHtml = marked.parse(enMarkdown);

    // Update in Database
    const { data: article, error } = await supabaseAdmin
      .from('hrm_manual_articles')
      .select('id, title, published_content, draft_content')
      .eq('title', 'Departments')
      .single();

    if (error || !article) {
      console.log('Departments article not found in Database!');
      return;
    }

    const payload = JSON.stringify({ my: myHtml, en: enHtml });

    await supabaseAdmin.from('hrm_manual_articles').update({
      draft_content: payload,
      published_content: payload,
      status: 'published'
    }).eq('id', article.id);

    console.log('Successfully updated Departments article with structured Burmese and English JSON!');

  } catch (err) {
    console.error('Error:', err);
  }
}

run();
