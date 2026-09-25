import { supabaseAdmin } from '../lib/supabase.js';
import { marked } from 'marked';

async function run() {
  try {
    console.log('Translating and refining Org Chart Article...');

    const myMarkdown = `
# Org Chart (အဖွဲ့အစည်း ဖွဲ့စည်းပုံ)

## 1. Org Chart Overview (ယေဘုယျအကြောင်းအရာ)
**Org Chart** စာမျက်နှာသည် ကုမ္ပဏီတစ်ခုလုံး၏ အထက်အောက် စီမံအုပ်ချုပ်မှု ဖွဲ့စည်းပုံ (Reporting Structure) ကို သစ်ပင်ပုံစံ (Tree Diagram) ဖြင့် ရှင်းလင်းစွာ မြင်တွေ့နိုင်သော စာမျက်နှာ ဖြစ်ပါသည်။

## 2. Purpose of Org Chart (ရည်ရွယ်ချက်)
- ဝန်ထမ်းတစ်ဦးချင်းစီ၏ အထက်လူကြီး (Direct Manager) သည် မည်သူဖြစ်သည်ကို တိကျစွာ သိရှိနိုင်ရန်။
- ဌာနအသီးသီး၏ ဖွဲ့စည်းပုံကို အလွယ်တကူ မြင်တွေ့နိုင်ရန်။
- အခြားသော ခွင့်တောင်းခံခြင်း (Leave Approvals) များနှင့် သက်ဆိုင်သည့် Manager Workflow ကို စနစ်တကျ သတ်မှတ်ပေးနိုင်ရန် ဖြစ်ပါသည်။

---

## 3. Org Chart Screen (စာမျက်နှာ ဖွဲ့စည်းပုံ)

စာမျက်နှာတွင်-
- အပေါ်ဆုံးတွင် အမည်၊ ရာထူး၊ ကုဒ် (ID) ဖြင့် **ရှာဖွေရန် (Search)** အကွက် ပါရှိပါသည်။
- သီးခြားဌာန (Department) တစ်ခုတည်းကိုသာ ရွေးချယ်ကြည့်ရှုရန် **Filter** ပါရှိပါသည်။
- အလယ်တွင် ဝန်ထမ်းများ၏ ကတ် (Cards) များကို Level အလိုက် ဆင်းသက်လာသော **Tree Diagram** ဖြင့် ပြသထားပါသည်။ ကတ်တစ်ခုစီတွင် အမည်၊ ရာထူး၊ ဌာန နှင့် အောက်လက်ငယ်သား အရေအတွက် (Direct Reports) များကို ပြသပေးပါသည်။

---

## 4. Organization Hierarchy (အဆင့်သတ်မှတ်ချက်များ)

ဝန်ထမ်းများကို ရာထူးအဆင့် (Level) ပေါ်မူတည်၍ အရောင်များ ခွဲခြားထားပါသည်-
- **Executive** (ရွှေဝါရောင်)
- **Senior** (လိမ္မော်ရောင်)
- **Manager** (စိမ်းဝါရောင်)
- **Supervisor** (မြစိမ်းရောင်)
- **Mid / Junior** (ခဲရောင်)

---

## 5. Employee / Manager Relationship (အထက်အောက် ဆက်စပ်မှု)

- ဤဇယားသည် \`Employees\` စာရင်းရှိ **Manager** (Manager_id) ကို အခြေခံ၍ အလိုအလျောက် ပုံဖော်ပေးခြင်း ဖြစ်ပါသည်။ 
- ဝန်ထမ်းတစ်ဦးကို Manager အဖြစ် အခြားဝန်ထမ်းတစ်ဦးအား သတ်မှတ်လိုက်သည်နှင့် တစ်ပြိုင်နက်၊ ဤဇယားတွင် ၎င်း၏ အောက်လက်ငယ်သား အဖြစ် အလိုအလျောက် ရောက်ရှိသွားပါမည်။

---

## 6. Manager Assignment (အထက်လူကြီး သတ်မှတ်ပေးခြင်း)

- ဤဇယားကို ဆွဲယူနေရာချထားခြင်း (Drag & Drop) ဖြင့် **ပြင်ဆင်၍ မရပါ**။
- ဖွဲ့စည်းပုံကို ပြင်ဆင်လိုပါက၊ ပြင်ဆင်လိုသော ဝန်ထမ်းကတ် ကို နှိပ် (Click) ပါ။ 
- ညာဘက်မှ Profile Drawer ထွက်လာပါမည်။

---

## 7. Reassigning a Manager (Manager အသစ် ပြောင်းလဲပေးခြင်း)

- (Admin များသာ) Profile Drawer အောက်ခြေရှိ **"Reassign Direct Manager"** အောက်တွင် အခြား ဝန်ထမ်းတစ်ဦး၏ အမည်ကို ရွေးချယ်၍ **"Confirm Reassignment"** ကို နှိပ်လိုက်ပါက ထိုဝန်ထမ်းသည် မန်နေဂျာအသစ်၏ အောက်သို့ ချက်ချင်း ရွှေ့ပြောင်းသွားမည် ဖြစ်ပါသည်။

---

## 8. Data / System Behavior (စနစ်၏ အလုပ်လုပ်ပုံ)

- Reassign လုပ်လိုက်သော အချက်အလက်သည် Database ထဲရှိ \`manager_id\` ကို တိုက်ရိုက် ပြောင်းလဲပေးပါသည်။ (ထို့ကြောင့် Employee Details တွင်လည်း အလိုအလျောက် ပြောင်းလဲသွားပါမည်)။

---

## 9. Org Chart ↔ Employees / Positions

- ဤ Org Chart သည် ဝန်ထမ်းများ၏ ရာထူး (Position)၊ ဌာန (Department) နှင့် Manager တို့ကို ပေါင်းစပ်ပြီး အမြင်သာဆုံး ဖြစ်အောင် ပုံဖော်ပေးသော (Visual Representation) စာမျက်နှာ ဖြစ်ပါသည်။

---

## 10. Org Chart ↔ Leave / Approval Flow

- ဤ Org Chart တွင် ဖွဲ့စည်းထားသော အထက်အောက် ဆက်ဆံရေးသည် \`Leave Management\` ကဲ့သို့သော နေရာများတွင် ခွင့်တိုင်ကြားစာများ မည်သူ့ထံ (မည်သည့် Manager ထံ) သွားမည်ကို အလိုအလျောက် သတ်မှတ်ပေးပါသည်။ (မှတ်ချက် - စနစ်တွင် Approval Inheritance သတ်မှတ်ချက် အပြည့်အစုံ ပါဝင်မှသာ သက်ရောက်ပါမည်)။

---

## 11. Practical Workflows (လက်တွေ့ အသုံးပြုမှု)

1. ဝန်ထမ်းအသစ် ဝင်လာသောအခါ HR သည် \`Org Chart\` တွင် ထိုဝန်ထမ်းကို နှိပ်၍ သက်ဆိုင်ရာ Manager ကို ရွေးချယ် (Reassign) သတ်မှတ်ပေးလိုက်ပါသည်။
2. သတ်မှတ်ပြီးသည်နှင့် ထိုဝန်ထမ်းသည် Manager ၏ အောက်ရှိ Tree Diagram ထဲတွင် မှန်ကန်စွာ ပေါ်လာမည် ဖြစ်ပါသည်။

---

## 12. Common Questions / Troubleshooting

- **မေး: Org Chart ထဲမှာ ဝန်ထမ်းအမည် မပေါ်ဘူး။ ဘာလုပ်ရမလဲ?**
  ဖြေ: ထိုဝန်ထမ်းသည် အလုပ်ထွက် (Offboard/Soft Delete) လုပ်ထားပါက ဇယားတွင် ပေါ်မည်မဟုတ်ပါ။
- **မေး: Manager မရှိတဲ့ ဝန်ထမ်းက ဘယ်ရောက်နေမလဲ?**
  ဖြေ: Manager အဖြစ် "— No Manager (Root Level) —" ဟု သတ်မှတ်ထားသော ဝန်ထမ်းများသည် ဇယား၏ အပေါ်ဆုံးအဆင့် (Root) အနေဖြင့် သီးခြားစီ ပေါ်နေမည် ဖြစ်ပါသည်။

---

## 13. Important Notes / Limitations

- Org Chart တွင် ဆွဲယူချထားခြင်း (Drag & Drop) ဖြင့် ဖွဲ့စည်းပုံ ပြင်ဆင်ခြင်း မရနိုင်ပါ။ Drawer မှတစ်ဆင့် Manager အမည်ကို ရွေးချယ်ပေးမှသာ ပြောင်းလဲမည် ဖြစ်ပါသည်။
- ဌာနတစ်ခုလုံးကို အခြားဌာနအောက်သို့ တပေါင်းတည်း ရွှေ့ပြောင်းခြင်း (Bulk Move) လုပ်၍ မရပါ။ တစ်ဦးချင်းစီသာ ရွှေ့ပြောင်းရပါမည်။

---

## 14. Employee Lifecycle Context

Org Chart သည် ဝန်ထမ်းများ အလုပ်စတင်ချိန်မှစ၍ ရာထူးတိုးခြင်း၊ ဌာနပြောင်းခြင်း၊ အထက်လူကြီး ပြောင်းလဲခြင်း စသည့် အပြောင်းအလဲများကို တိကျစွာ မှတ်တမ်းတင် ပုံဖော်ပေးသော အရေးပါသည့် အစိတ်အပိုင်း ဖြစ်ပါသည်။

---

## 15. Related Modules (ဆက်စပ်သော အခန်းများ)

- <a href="#" data-article-title="Employees" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Employees</a>
- <a href="#" data-article-title="Employee Details" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Employee Details</a>
- <a href="#" data-article-title="Departments" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Departments</a>
- <a href="#" data-article-title="Positions" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Positions</a>
`;

    const enMarkdown = `
# Org Chart

## 1. Org Chart Overview
The **Org Chart** provides a dynamic, visual tree-diagram of the entire company's reporting structure, making it easy to understand who reports to whom.

## 2. Purpose of Org Chart
- To give employees and HR a clear understanding of the company's hierarchy and departmental structures.
- To establish the exact \`manager_id\` relationships required for operational workflows, such as leave approvals and performance evaluations.

---

## 3. Org Chart Screen

The screen consists of three main areas:
- **Top Controls:** A search bar (by name, ID, or position) and a Department Filter dropdown.
- **Statistics:** A quick summary of total employees and departments.
- **Tree Diagram:** The main visual area displaying employee nodes. Nodes can be collapsed or expanded to hide or show direct reports.

---

## 4. Organization Hierarchy

Employee nodes are color-coded based on their assigned Job Level:
- **Executive** (Amber/Gold)
- **Senior** (Orange)
- **Manager** (Lime Green)
- **Supervisor** (Emerald)
- **Mid / Junior** (Slate/Gray)

---

## 5. Employee / Manager Relationship

- The structure is generated automatically based on the \`manager_id\` assigned to each employee in the database.
- If an employee has no \`manager_id\`, they are treated as a "Root" node and appear at the very top of the tree.

---

## 6. Drag & Drop Behavior

- **Important:** The Org Chart does *not* support Drag & Drop functionality for restructuring. Reassignment must be done via the Profile Drawer.

---

## 7. Reassigning a Manager

To change an employee's manager:
1. Click on the employee's node card in the tree.
2. A Profile Drawer slides out from the right.
3. (Admins only) At the bottom of the drawer, locate the **"Reassign Direct Manager"** section.
4. Select the new manager from the dropdown (or select "— No Manager (Root Level) —").
5. Click **Confirm Reassignment**.

---

## 8. Data / System Behavior

- Reassigning a manager via the drawer directly updates the \`manager_id\` in the \`Employees\` table. 
- The tree diagram instantly refreshes to reflect the new structure.

---

## 9. Org Chart ↔ Employees / Positions

- The Org Chart is a direct visual representation of the data managed within the \`Employees\`, \`Positions\`, and \`Departments\` modules.

---

## 10. Org Chart ↔ Leave / Approval Flow

- The reporting structure defined here is critical. In workflows like \`Leave Management\`, an employee's leave request is typically routed to the person set as their Manager in this Org Chart.

---

## 11. Practical Workflows

**Onboarding a new hire:**
When a new employee is added to the system, HR navigates to the Org Chart, searches for the new employee (who will appear as a root node if no manager was assigned yet), clicks their card, and assigns them to their respective team leader.

---

## 12. Common Questions / Troubleshooting

- **Q: Why is an employee missing from the chart?**
  A: Ensure they are an active employee. Offboarded or soft-deleted employees are automatically removed from the active Org Chart.
- **Q: How do I move an entire department?**
  A: There is no bulk-move feature. If a Department Head changes managers, you reassign the Department Head. Their direct reports will automatically follow them to the new location in the tree.

---

## 13. Important Notes / Limitations

- There are no advanced organizational analytics (e.g., total salary cost per branch) built into this chart. It is strictly for structural visualization and manager reassignment.

---

## 14. Employee Lifecycle Context

The Org Chart is maintained throughout the employee's active lifecycle, updated whenever there is a promotion, department transfer, or change in leadership.

---

## 15. Related Modules

- <a href="#" data-article-title="Employees" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Employees</a>
- <a href="#" data-article-title="Employee Details" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Employee Details</a>
- <a href="#" data-article-title="Departments" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Departments</a>
- <a href="#" data-article-title="Positions" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Positions</a>
`;

    const myHtml = marked.parse(myMarkdown);
    const enHtml = marked.parse(enMarkdown);

    // Update in Database
    const { data: article, error } = await supabaseAdmin
      .from('hrm_manual_articles')
      .select('id, title, published_content, draft_content')
      .eq('title', 'Org Chart')
      .single();

    if (error || !article) {
      console.log('Org Chart article not found in Database!');
      return;
    }

    const payload = JSON.stringify({ my: myHtml, en: enHtml });

    await supabaseAdmin.from('hrm_manual_articles').update({
      draft_content: payload,
      published_content: payload,
      status: 'published'
    }).eq('id', article.id);

    console.log('Successfully updated Org Chart article with structured Burmese and English JSON!');

  } catch (err) {
    console.error('Error:', err);
  }
}

run();
