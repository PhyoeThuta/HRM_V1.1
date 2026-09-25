import { supabaseAdmin } from '../lib/supabase.js';
import { marked } from 'marked';

async function run() {
  try {
    console.log('Translating and refining Positions Article...');

    const myMarkdown = `
# Positions (ရာထူးများ စီမံခန့်ခွဲခြင်း)

## 1. Positions Overview (ယေဘုယျအကြောင်းအရာ)
**Positions Module** သည် ကုမ္ပဏီအတွင်းရှိ ရာထူးများ (Job Titles) နှင့် အဆင့်များ (Levels) ကို သတ်မှတ်စီမံသော နေရာဖြစ်ပါသည်။
- **ဘာအတွက် အသုံးပြုသလဲ?** ဝန်ထမ်းများ၏ ရာထူးအမည်များကို သတ်မှတ်ရန်၊ အခြေခံလစာ (Base Salary) နှုန်းထားများ သတ်မှတ်ရန်နှင့် အလုပ်ခေါ်ယူမှု (Hiring) ကို စီမံရန် အသုံးပြုပါသည်။
- **ဘယ်သူတွေ အသုံးပြုသလဲ?** Admin နှင့် HR Manager များက ရာထူးအသစ်များ ဖန်တီးခြင်း၊ လစာနှင့် အလုပ်ခေါ်ယူမှု အခြေအနေများကို အဓိက စီမံပါသည်။
- **ဘာကြောင့် အရေးကြီးသလဲ?** ဝန်ထမ်းတစ်ဦးကို စတင်စာရင်းသွင်းရာတွင် ရာထူး (Position) ကို မဖြစ်မနေ ထည့်သွင်းရပြီး၊ ယင်းရာထူးနှင့် တွဲဖက်ထားသော အဆင့် (Level) များကို အခြေခံ၍ ကုမ္ပဏီ၏ ဖွဲ့စည်းပုံနှင့် လစာပေးချေမှုများကို တွက်ချက်ရသောကြောင့် ဖြစ်ပါသည်။

---

## 2. Position List (ရာထူး စာရင်းများ)

Positions စာမျက်နှာတွင် ရာထူးများကို အဆင့် (Level) အလိုက် အုပ်စုဖွဲ့၍ ကတ် (Card) ပုံစံဖြင့် ရှင်းလင်းစွာ ပြသထားပါသည်။

- **Search (ရှာဖွေခြင်း):** အပေါ်ဘက်ရှိ Search Bar တွင် ရာထူးအမည် (သို့မဟုတ်) Level ကို ရိုက်ထည့်၍ အလွယ်တကူ ရှာဖွေနိုင်ပါသည်။
- **Grouping:** Executive, Manager, Supervisor, Senior, Mid, Junior စသည့် အဆင့်များအလိုက် အုပ်စုခွဲ၍ ပြသထားပါသည်။

**ရာထူးကတ် (Position Card) တစ်ခုစီတွင် မြင်ရမည့်အချက်များ-**
- **Title (ရာထူးအမည်):** ဥပမာ - Senior Developer
- **Level (အဆင့်):** ဥပမာ - Senior
- **Base Salary (အခြေခံလစာ):** ထိုရာထူးအတွက် သတ်မှတ်ထားသော အခြေခံလစာ (THB)။
- **Staff (ဝန်ထမ်းအရေအတွက်):** ဤရာထူးဖြင့် လက်ရှိ အလုပ်လုပ်နေသော ဝန်ထမ်းအရေအတွက်။
- **Hiring Toggle:** အလုပ်ခေါ်ယူနေဆဲ ဟုတ်/မဟုတ် ဖွင့်/ပိတ် (Toggle) ပြုလုပ်နိုင်သော ခလုတ်။
- **Facebook Announcement (📢):** အလုပ်ခေါ်ယူနေကြောင်း Facebook သို့ တိုက်ရိုက် ကြေညာနိုင်သော ခလုတ် (Hiring အွန်ထားမှသာ ပေါ်လာပါမည်)။

---

## 3. Create a Position (ရာထူးအသစ် ဖန်တီးခြင်း)

ရာထူးအသစ် ဖန်တီးရန် (Admin သာ လုပ်ဆောင်နိုင်ပါသည်)-

1. ညာဘက်အပေါ်ထောင့်ရှိ \`+ New Position\` ကို နှိပ်ပါ။
2. အောက်ပါ အချက်အလက်များကို ဖြည့်သွင်းပါ-
   - **Title (ရာထူးအမည်) - မဖြစ်မနေ:** ဥပမာ "Marketing Executive"။
   - **Level (အဆင့်):** Executive, Manager, Supervisor, Senior, Mid, Junior ထဲမှ တစ်ခု ရွေးချယ်ပါ။ (လုပ်ပိုင်ခွင့်နှင့် Org Chart အတွက် အသုံးဝင်ပါသည်)။
   - **Base Salary (အခြေခံလစာ):** ဤရာထူးအတွက် သတ်မှတ်ထားသော ပျမ်းမျှ သို့မဟုတ် အခြေခံလစာ ပမာဏ။ (ဝန်ထမ်းသစ်များအတွက် မှီငြမ်းရန် အသုံးဝင်သည်)။
3. \`Save\` ကို နှိပ်ပါ။

---

## 4. Edit a Position (ရာထူး ပြင်ဆင်ခြင်း)

- **မည်သို့ပြင်ဆင်မလဲ?** ရာထူးကတ် (Card) ပေါ်ရှိ \`Edit\` ကို နှိပ်ပါ။
- **ဘာတွေပြင်နိုင်သလဲ?** ရာထူးအမည် (Title)၊ အဆင့် (Level) နှင့် အခြေခံလစာ (Base Salary) တို့ကို ပြင်ဆင်နိုင်ပါသည်။ ထို့အပြင် ကတ်ပေါ်ရှိ "Hiring" ခလုတ်ကို နှိပ်၍ အလုပ်ခေါ်ယူမှု အခြေအနေကိုလည်း အလွယ်တကူ ပြောင်းလဲနိုင်ပါသည်။
- **သက်ရောက်မှု:** ဤနေရာတွင် ပြင်ဆင်လိုက်ပါက၊ ထိုရာထူးကို ရယူထားသော ဝန်ထမ်းများအားလုံး၏ Profile များတွင် ချက်ချင်း အလိုအလျောက် ပြောင်းလဲသွားမည် ဖြစ်ပါသည်။

---

## 5. Delete Position (ရာထူး ဖျက်ပစ်ခြင်း)

- **ဖျက်ရန် လုပ်ဆောင်ပုံ:** ရာထူးကတ်ရှိ \`Delete\` ကို နှိပ်ပြီး၊ သတိပေးချက်ကို သေချာဖတ်၍ အတည်ပြု (Confirm) ရပါမည်။ (Admin သာ)
- **အရေးကြီးသော မှတ်ချက်:** ရာထူးတစ်ခုကို ဖျက်လိုက်ခြင်းသည် (Hard Delete) အပြီးအပိုင် ဖျက်ပစ်ခြင်း ဖြစ်ပါသည်။ ဤရာထူးတွင် လက်ရှိ တာဝန်ထမ်းဆောင်နေသော ဝန်ထမ်းများ ရှိနေသေးပါက Database တွင် ချိတ်ဆက်မှုများ မှားယွင်း (Error) ဖြစ်နိုင်သဖြင့် ဝန်ထမ်းများကို အခြားရာထူးများသို့ ဦးစွာ ပြောင်းရွှေ့ထားရန် အကြံပြုပါသည်။

---

## 6. Position နှင့် Employee ချိတ်ဆက်မှု (Relationship)

**Position ↔ Employee** သည် တိုက်ရိုက် ဆက်စပ်နေပါသည်။

- **ချိတ်ဆက်ပုံ:** ဝန်ထမ်းတစ်ဦးကို \`Employees\` တွင် စတင်ထည့်သွင်းချိန်တွင် Position ကို မဖြစ်မနေ ရွေးချယ်ပေးရပါသည်။
- **မြင်တွေ့ရပုံ:** ရာထူးတစ်ခုစီတွင် ထိုရာထူးဖြင့် အလုပ်လုပ်နေသူ ဘယ်နှစ်ဦးရှိသလဲ ဆိုသည်ကို (ဥပမာ - "5 Staff") ဟု Position ကတ်ပေါ်တွင် အလိုအလျောက် တွက်ချက်ပြသထားပါသည်။ ဝန်ထမ်းတစ်ဦး ရာထူးတိုးသွားပါက ယခင်ရာထူးမှ လူတစ်ဦး လျော့သွားပြီး ရာထူးအသစ်တွင် လူတစ်ဦး တိုးလာမည် ဖြစ်ပါသည်။

---

## 7. အခြား Modules များနှင့် ချိတ်ဆက်မှု

- **Recruitment & Facebook Integration:** Hiring ခလုတ် ဖွင့်လိုက်ပါက Facebook Page သို့ အလုပ်ခေါ်စာ (Image + Text) တိုက်ရိုက် တင်နိုင်ရန် ချိတ်ဆက်ထားပါသည်။ (Admin တွင် Facebook API ချိတ်ဆက်ထားမှသာ အလုပ်လုပ်မည်)။
- **Org Chart (Direct):** Position နှင့် Level သည် ကုမ္ပဏီ၏ ဖွဲ့စည်းပုံဇယား (Org Chart) ကို ဆွဲသားရာတွင် အဓိက အခန်းကဏ္ဍမှ ပါဝင်ပါသည်။
- **Payroll (Indirect):** Position တွင် သတ်မှတ်ထားသော Base Salary သည် ဝန်ထမ်းသစ်များ၏ လစာကို သတ်မှတ်ရာတွင် လမ်းညွှန် (Guideline) အဖြစ် အသုံးဝင်ပါသည်။

---

## 8. လက်တွေ့ အသုံးပြုမှု (Practical Workflows)

**အလုပ်ခေါ်စာ Facebook တွင် တင်ရန်:**
1. \`Positions\` စာမျက်နှာတွင် ခေါ်ယူလိုသော ရာထူးကို ရှာပါ။
2. ထိုရာထူး၏ \`Hiring\` ခလုတ်ကို ဖွင့်လိုက်ပါ။
3. ဘေးတွင် 📢 (Megaphone) ပုံစံ ခလုတ်ပေါ်လာပါမည်။ ၎င်းကိုနှိပ်ပါ။
4. Announcement Modal တွင် စာသားများရေးပြီး သင့်လျော်သော ပုံထည့်ကာ Publish လုပ်ပါ။

---

## 9. အဖြစ်များသော အခြေအနေများ (Real-World Scenarios)

- **ဝန်ထမ်းသစ် ခေါ်ယူခြင်း (Recruitment):** HR သည် ဝန်ထမ်းမခေါ်မီ ဤ Positions စာမျက်နှာတွင် လိုအပ်သော ရာထူးအသစ်ကို အရင် ဖန်တီးရပါသည်။ ပြီးမှ ထိုရာထူးကို Hiring ON ပြီး လူရှာပါသည်။
- **ဝန်ထမ်း ရာထူးတိုးခြင်း:** ဝန်ထမ်းတစ်ဦး ရာထူးတိုးပါက၊ ဤစာမျက်နှာတွင် ပြင်ဆင်ရမည် မဟုတ်ဘဲ \`Employee Details > Edit Profile\` တွင်သာ သွားရောက်၍ ၎င်း၏ ရာထူးအသစ်ကို ရွေးချယ် ပြောင်းလဲပေးရပါမည်။

---

## 10. အမေးများသော မေးခွန်းများ (FAQ & Troubleshooting)

- **မေး: Position အသစ်ဖန်တီးထားတာ ဝန်ထမ်းစာရင်းသွင်းတဲ့နေရာမှာ ရွေးလို့မရဘူး ဖြစ်နေတယ်။**
  ဖြေ: စာမျက်နှာ (Page) ကို Refresh တစ်ကြိမ် လုပ်ကြည့်ပါ။ Database မှ Data အသစ်ကို ချက်ချင်း ဆွဲယူလာပါမည်။
- **မေး: ရာထူးတစ်ခုကို ဖျက်လို့မရဘူး။ ဘာကြောင့်လဲ?**
  ဖြေ: ထိုရာထူးတွင် လက်ရှိ တာဝန်ထမ်းဆောင်နေသော ဝန်ထမ်းများ ရှိနေပါက စနစ်မှ ဖျက်ခွင့်ပြုမည် မဟုတ်ပါ။

---

## 11. အရေးကြီး မှတ်သားရန်

- **Hiring Toggles:** အလုပ်ခေါ်ယူမှု ပြီးဆုံးသွားပါက "Hiring" ခလုတ်ကို ပြန်ပိတ် (Off) ထားရန် မမေ့ပါနှင့်။

---

## 12. Employee Lifecycle တွင် ပါဝင်မှု

Positions သည် \`Recruitment\` (အလုပ်ခေါ်ယူခြင်း) အဆင့်တွင် စတင်အသက်ဝင်ပါသည်။ လိုအပ်သော ရာထူးကို သတ်မှတ်ပြီးနောက် ဝန်ထမ်းသစ် ဝင်ရောက်လာချိန် (\`Employee Creation\`) တွင် တိုက်ရိုက် ချိတ်ဆက် အသုံးပြုရပါသည်။

---

## 13. ဆက်လက်ဖတ်ရှုရန် (Related Modules)

- <a href="#" data-article-title="HRM Overview" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">HRM Overview</a>
- <a href="#" data-article-title="Departments" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Departments</a>
- <a href="#" data-article-title="Employees" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Employees</a>
- <a href="#" data-article-title="Employee Details" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Employee Details</a>
- <a href="#" data-article-title="Recruitment" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Recruitment</a>
- <a href="#" data-article-title="Org Chart" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Org Chart</a>
`;

    const enMarkdown = `
# Positions

## 1. Positions Overview
The **Positions Module** is responsible for managing Job Titles and Job Levels within the company.
- **What is a Position?** It defines the specific role (e.g., Marketing Manager) an employee holds.
- **Purpose in BBD HRM:** It is used to standardize job titles, establish baseline salaries, and manage the company's active recruitment (Hiring) statuses.
- **Employee Lifecycle Usage:** Every employee must be linked to a Position upon creation. This linkage feeds directly into the organizational hierarchy and payroll baseline checks.

---

## 2. Position List

The Positions page displays all job roles as cleanly organized Cards, grouped primarily by their organizational Level.

- **Search / Filter:** A search bar at the top allows you to quickly filter cards by typing the Position Title or the Level.
- **Grouping:** Roles are automatically sorted and grouped into specific tiers: Executive, Manager, Supervisor, Senior, Mid, and Junior.

**What you see on a Position Card:**
- **Title:** The official job title.
- **Level:** The tier/seniority of the role.
- **Base Salary:** The standard baseline salary designated for this role (in THB).
- **Staff Count:** The exact number of employees currently holding this title.
- **Hiring Toggle:** A quick on/off switch indicating if the company is actively recruiting for this role.
- **Facebook Announcement (📢):** If 'Hiring' is turned ON, an announcement button appears, allowing Admins to directly publish a job opening to the connected Facebook Page.

---

## 3. Create a Position

To create a new role (Admins only):

1. Click the \`+ New Position\` button in the top right.
2. Fill in the modal inputs:
   - **Title (Required):** The name of the role (e.g., Senior Developer).
   - **Level:** Select the appropriate hierarchy level from the dropdown.
   - **Base Salary:** An optional numeric value representing the typical salary for this role.
3. Click \`Save\`.
4. The new Position Card will immediately appear in its respective Level group.

---

## 4. Edit a Position

- **How to Edit:** Click the \`Edit\` button on any Position Card.
- **Editable Fields:** You can update the Title, Level, and Base Salary. You can also toggle the 'Hiring' status directly from the card.
- **Impact:** Any changes made to the Title or Level will instantly reflect across the profiles of all employees who are currently assigned to this position.

---

## 5. Delete / Remove Position

- **Implemented Behavior:** Clicking \`Delete\` opens a confirmation warning. Upon confirmation, the position is permanently removed (Hard Delete).
- **Important Restriction:** Deleting a position that currently has active employees assigned to it can cause data integrity issues in the system. HR must first reassign all current staff to a different role before deleting an obsolete position.

---

## 6. Position ↔ Employee Relationship

- **Assignment:** Employees are assigned a Position exclusively during the 'Add Employee' or 'Edit Profile' workflow in the Employees module.
- **Impact:** Assigning a position to an employee automatically increments the "Staff Count" badge on the Position Card. If an employee is promoted, their old position loses a headcount, and their new position gains one.

---

## 7. Position ↔ Other HRM Modules

- **Recruitment (Direct):** Turning on the 'Hiring' toggle activates the Facebook integration, allowing direct publishing of job ads using the Position Announcement feature.
- **Org Chart (Direct):** The 'Level' and 'Title' combination dictates where an employee sits within the visual Org Chart.
- **Payroll (Informational):** The Base Salary set here serves as a guideline for HR when negotiating salaries for new hires.

---

## 8. Practical Workflows

**Creating a Facebook Job Ad:**
1. Find the position you want to hire for.
2. Ensure the \`Hiring\` toggle is switched ON (green).
3. Click the 📢 (Megaphone) button that appears.
4. Use the popup modal to compose your text and attach an image, then publish directly to your configured Facebook Page.

---

## 9. Real-World HR Scenarios

- **Preparing for a New Hire:** Before recruitment even begins, HR must open the Positions module to ensure the specific job title exists. If it is a brand new role, they must Create it first, then toggle 'Hiring' ON.
- **Promoting an Employee:** Do not edit the Position Card itself (that would rename the role for everyone). Instead, go to \`Employee Details\`, click \`Edit Profile\`, and change the employee's assigned Position to their new promoted title.

---

## 10. Common Questions / Troubleshooting

- **Q: I created a new position but I don't see it when trying to add a new employee?**
  A: Try refreshing the page so the Employee creation form fetches the latest positions from the database.
- **Q: Why is the Facebook button not showing up?**
  A: The Facebook button ONLY appears if the 'Hiring' toggle is turned ON, and if the system has valid Facebook API keys configured by the Admin.

---

## 11. Important Notes

- **Hiring Toggles:** Always remember to turn OFF the 'Hiring' toggle once a candidate has been successfully recruited, so your recruitment data remains accurate.

---

## 12. Employee Lifecycle Context

Positions are the very first step in the Employee Lifecycle. A Position must exist before **Recruitment** can begin, and it forms the foundational identity for the candidate when they finally reach **Employee Creation** and **Onboarding**.

---

## 13. Related Modules

- <a href="#" data-article-title="HRM Overview" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">HRM Overview</a>
- <a href="#" data-article-title="Departments" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Departments</a>
- <a href="#" data-article-title="Employees" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Employees</a>
- <a href="#" data-article-title="Employee Details" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Employee Details</a>
- <a href="#" data-article-title="Recruitment" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Recruitment</a>
- <a href="#" data-article-title="Org Chart" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Org Chart</a>
`;

    const myHtml = marked.parse(myMarkdown);
    const enHtml = marked.parse(enMarkdown);

    // Update in Database
    const { data: article, error } = await supabaseAdmin
      .from('hrm_manual_articles')
      .select('id, title, published_content, draft_content')
      .eq('title', 'Positions')
      .single();

    if (error || !article) {
      console.log('Positions article not found in Database!');
      return;
    }

    const payload = JSON.stringify({ my: myHtml, en: enHtml });

    await supabaseAdmin.from('hrm_manual_articles').update({
      draft_content: payload,
      published_content: payload,
      status: 'published'
    }).eq('id', article.id);

    console.log('Successfully updated Positions article with structured Burmese and English JSON!');

  } catch (err) {
    console.error('Error:', err);
  }
}

run();
