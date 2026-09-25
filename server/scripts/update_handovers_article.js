import { supabaseAdmin } from '../lib/supabase.js';
import { marked } from 'marked';

async function run() {
  try {
    console.log('Translating and refining Handovers Article...');

    const myMarkdown = `
# Handovers (တာဝန်လွှဲပြောင်းခြင်း)

## 1. Handovers Overview (ယေဘုယျအကြောင်းအရာ)
**Handovers Module** သည် ဝန်ထမ်းတစ်ဦး ခွင့်ယူမည့်အချိန် သို့မဟုတ် အလုပ်မှ ထွက်မည့်အချိန်တွင် ၎င်းလုပ်ဆောင်နေသော အလုပ်တာဝန်များနှင့် ပစ္စည်းများကို အခြားဝန်ထမ်းတစ်ဦးထံသို့ စနစ်တကျ လွှဲပြောင်းပေးသော လုပ်ငန်းစဉ် (Workflow) ဖြစ်ပါသည်။
- **ဘာအတွက် အသုံးပြုသလဲ?** အလုပ်တာဝန်များ ဟာကွက်မရှိဘဲ ဆက်လက်လည်ပတ်နိုင်ရန်နှင့် ကုမ္ပဏီပိုင် ပစ္စည်းများ၊ စကားဝှက်များကို သေချာစွာ ပြန်လည်အပ်နှံစေရန် ဖြစ်ပါသည်။
- **ဘယ်သူတွေ အသုံးပြုသလဲ?** လွှဲပြောင်းပေးမည့်သူ (Outgoing)၊ လက်ခံမည့်သူ (Successor) နှင့် အတည်ပြုပေးမည့် HR/Admin တို့ အသုံးပြုပါသည်။

---

## 2. Handovers Screen (စာမျက်နှာ ဖွဲ့စည်းပုံ)

Admin များအတွက် Handover စာမျက်နှာတွင် အောက်ပါတို့ကို တွေ့ရပါမည်-
- **Filters:** အခြေအနေ (Status)၊ အမျိုးအစား (Type) နှင့် ဝန်ထမ်းအမည် (Employee) တို့ဖြင့် အလွယ်တကူ ရှာဖွေနိုင်သော နေရာ။
- **Table:** တာဝန်လွှဲပြောင်းမှု စာရင်းများ ဇယား (ဘယ်သူက ဘယ်သူ့ကို လွှဲသလဲ၊ ရာခိုင်နှုန်း ဘယ်လောက် ပြီးနေပြီလဲ ဆိုသည်ကို ပြသထားပါသည်)။

---

## 3. Types of Handovers (တာဝန်လွှဲပြောင်းခြင်း အမျိုးအစားများ)

စနစ်တွင် အလိုအလျောက် သတ်မှတ်ပေးသော အမျိုးအစား (၃) မျိုး ရှိပါသည်-
1. **Leave Coverage:** ခွင့်သွားနေစဉ် ကာလအတွင်း ယာယီ လွှဲပြောင်းပေးခြင်း။ (Leave Module မှ စတင်ပါသည်)။
2. **Return From Leave:** ခွင့်မှ ပြန်လာသောအခါ မိမိတာဝန်ကို ပြန်လည်လွှဲယူခြင်း။ (Leave Module မှ စတင်ပါသည်)။
3. **Exit Offboarding:** အလုပ်ထွက်ချိန်တွင် အပြီးတိုင် လွှဲပြောင်းပေးခြင်း။ (Offboarding Module မှ စတင်ပါသည်)။

---

## 4. Handover Workflow & Statuses (လုပ်ငန်းစဉ် အဆင့်ဆင့်)

တာဝန်လွှဲပြောင်းခြင်း တစ်ခုသည် အောက်ပါ အဆင့် (Statuses) များအတိုင်း အလုပ်လုပ်ပါသည်-

- **Pending Successor (လက်ခံမည့်သူကို စောင့်ဆိုင်းခြင်း):** လွှဲပြောင်းပေးမည့်သူ သို့မဟုတ် HR မှ အလုပ်ကို လက်ခံမည့်သူ (Successor) ကို ရွေးချယ် သတ်မှတ်ပေးရမည့် အဆင့်။
- **In Progress (လွှဲပြောင်းနေဆဲ):** Successor ကို ရွေးချယ်ပြီးပါက လုပ်ဆောင်ရမည့် အလုပ်စာရင်းများ (Items) ကို ထည့်သွင်းပြီး တစ်ခုချင်းစီ အမှန်ခြစ် (Check-off) ရမည့် အဆင့်။
- **Pending Review (အတည်ပြုရန် စောင့်ဆိုင်းခြင်း):** အလုပ်အားလုံးကို အမှန်ခြစ်ပြီးပါက အထက်လူကြီး သို့မဟုတ် HR ထံသို့ Review လုပ်ပေးရန် ရောက်ရှိသွားသော အဆင့်။
- **Completed (ပြီးစီးသွားခြင်း):** HR သို့မဟုတ် Manager မှ အားလုံးမှန်ကန်ကြောင်း အတည်ပြု (Approve) ပေးလိုက်ပါက Handover ပြီးဆုံးသွားပါမည်။
- **Waived / Cancelled:** လုပ်ဆောင်ရန် မလိုအပ်သဖြင့် HR မှ ပယ်ဖျက်လိုက်ခြင်း။

---

## 5. Handover Items (လွှဲပြောင်းရမည့် အချက်များ)

- Handover တစ်ခု \`In Progress\` ဖြစ်နေချိန်တွင်၊ **"Add Item"** ကို နှိပ်၍ လွှဲပြောင်းရမည့် အလုပ်များ (ဥပမာ - Facebook Page Admin ပေးရန်၊ Laptop အပ်ရန်၊ လစဉ် Report ဆွဲရန်) ကို စာရင်းသွင်းနိုင်ပါသည်။
- ထို့နောက် ထိုအလုပ်ကို လွှဲပြောင်းပေးလိုက်ပြီ ဖြစ်ကြောင်း ဘေးရှိ Checkbox လေးကို အမှန်ခြစ် ပေးရပါမည်။

---

## 6. Assigning a Successor (တာဝန်လက်ခံမည့်သူ သတ်မှတ်ခြင်း)

- Handovers များကို ဝန်ထမ်းကိုယ်တိုင် (သို့မဟုတ် HR မှ ကိုယ်စား) လက်ခံမည့်သူကို ရွေးချယ်နိုင်ပါသည်။ 
- လက်ခံမည့်သူသည် ထို Handover တွင် ပါဝင်လာမည်ဖြစ်ပြီး ၎င်းကိုယ်တိုင်လည်း ဝင်ရောက်ကြည့်ရှု အမှန်ခြစ်နိုင်ပါသည်။

---

## 7. Handover ↔ Leave Management (ခွင့်နှင့် ချိတ်ဆက်မှု)

- ဝန်ထမ်းတစ်ဦး ခွင့်ရက်ရှည် ယူသောအခါ၊ HR သည် \`Leave Management\` စာမျက်နှာမှနေ၍ **"Start Coverage Handover"** ကို နှိပ်လိုက်ပါက ဤ Handover Module ထဲသို့ အလိုအလျောက် Record တစ်ခု ဝင်လာမည် ဖြစ်ပါသည်။
- ခွင့်မှ ပြန်လာပါကလည်း **"Start Return Handover"** ကို နှိပ်၍ တာဝန်များကို မူလဝန်ထမ်းထံ ပြန်လွှဲပေးနိုင်ပါသည်။
- *အရေးကြီးချက်: Handover ကို Completed မလုပ်ရသေးဘဲ Leave Request ကို ဖျက် (Delete) ၍ မရပါ။*

---

## 8. Handover ↔ Offboarding (အလုပ်ထွက်ခြင်းနှင့် ချိတ်ဆက်မှု)

- ဝန်ထမ်းတစ်ဦး အလုပ်ထွက်ခွင့် တင်လိုက်သောအခါ \`Offboarding\` စနစ်မှနေ၍ **"Exit Handover"** ကို အလိုအလျောက် တောင်းဆိုနိုင်ပါသည်။
- အလုပ်မထွက်မီ လက်ကျန်လုပ်ငန်းများနှင့် ကုမ္ပဏီပိုင် ပစ္စည်းများကို သေချာစွာ ပြန်လည်အပ်နှံစေရန် ဤစနစ်ကို အသုံးပြုပါသည်။

---

## 9. လက်တွေ့ အသုံးပြုမှု (Practical Workflows)

**ခွင့်သွားမည့် ဝန်ထမ်းအတွက် Handover လုပ်နည်း:**
1. Leave Module တွင် HR က "Start Coverage Handover" ကို နှိပ်ပြီး တာဝန်ယူမည့် Successor ကို ရွေးချယ်ပါ။
2. \`Handovers\` စာမျက်နှာသို့ သွား၍ ယခု ဖန်တီးလိုက်သော Record ပေါ်တွင် \`View\` ကို နှိပ်ပါ။
3. လွှဲပြောင်းရမည့် လုပ်ငန်းများကို Add Item ဖြင့် ရိုက်ထည့်ပါ။
4. ဝန်ထမ်းနှစ်ဦးမှ အလုပ်များ လွှဲပြောင်းပြီးကြောင်း တစ်ခုချင်းစီကို Checkbox ခြစ်ပါ။
5. အားလုံး (100%) ပြီးသွားပါက "Submit for Review" ကို နှိပ်ပါ။
6. နောက်ဆုံးတွင် HR (သို့မဟုတ် Manager) မှ ဝင်ရောက်စစ်ဆေးပြီး \`Approve\` ကို နှိပ်လိုက်ပါက Handover ပြီးဆုံး (Completed) သွားပါမည်။

---

## 10. အမေးများသော မေးခွန်းများ (FAQ & Troubleshooting)

- **မေး: Items တွေ ဖြည့်လို့မရတော့ဘူး ဖြစ်နေတယ်။**
  ဖြေ: Handover သည် \`Completed\` (သို့) \`Pending Review\` အဆင့်သို့ ရောက်သွားပါက အချက်အလက်များ ထပ်ထည့်၍ မရတော့ပါ။
- **မေး: Successor (တာဝန်ယူမည့်သူ) ကို ပြောင်းလို့ ရသေးလား?**
  ဖြေ: \`Pending Successor\` သို့မဟုတ် \`In Progress\` အဆင့်တွင် ပြောင်းလဲနိုင်ပါသည်။ အတည်ပြုပြီး (Completed) ဖြစ်သွားပါက ပြောင်း၍ မရတော့ပါ။

---

## 11. အရေးကြီး မှတ်သားရန် (Important Notes)

- **တာဝန်ခံမှု:** ဤစနစ်သည် စကားဖြင့် လွှဲပြောင်းခြင်းထက် စနစ်ပေါ်တွင် အထောက်အထား (Audit Trail) ခိုင်မာစွာ ကျန်ရှိစေရန် ရည်ရွယ်ပါသည်။
- **Waived လုပ်ခြင်း:** အကယ်၍ ထိုဝန်ထမ်းတွင် လွှဲပြောင်းစရာ အလုပ်မရှိပါက (ဥပမာ - ရုံးသန့်ရှင်းရေး ဝန်ထမ်း ခွင့်ယူခြင်း) HR သည် ထို Handover ကို **"Waive (ကင်းလွတ်ခွင့်ပြုသည်)"** အဖြစ် သတ်မှတ်၍ အလွယ်တကူ ကျော်သွား (Bypass) နိုင်ပါသည်။

---

## 12. Employee Lifecycle တွင် ပါဝင်မှု

Handovers သည် ဝန်ထမ်းဘဝ (Employee Lifecycle) ၏ **Leave (ခွင့်ယူခြင်း)** ကာလ နှင့် **Offboarding (အလုပ်ထွက်ခြင်း)** ကာလများတွင် မပါမဖြစ် အရေးပါသော လုံခြုံရေးနှင့် စီမံခန့်ခွဲမှု အဆင့်တစ်ခု ဖြစ်ပါသည်။

---

## 13. ဆက်လက်ဖတ်ရှုရန် (Related Modules)

- <a href="#" data-article-title="Leave Management" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Leave Management</a>
- <a href="#" data-article-title="Offboarding" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Offboarding</a>
- <a href="#" data-article-title="Employees" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Employees</a>
`;

    const enMarkdown = `
# Handovers

## 1. Handovers Overview
The **Handovers Module** is a structured workflow designed to manage the secure and clear transfer of tasks, responsibilities, and company assets from one employee to another.
- **Purpose:** To prevent business disruption when an employee goes on leave or resigns, ensuring nothing falls through the cracks.
- **Who uses it?** The Outgoing Employee (the one leaving), the Successor (the one taking over), and HR/Admins (who review and approve the transfer).

---

## 2. Handovers Screen

For Admins, the Handovers dashboard provides a global overview:
- **Filters:** Easily filter records by Status, Trigger Type (e.g., Leave or Offboarding), and specific Employee names.
- **Table View:** Displays the Outgoing employee, their Successor, the current Status Badge, overall Progress (% completed), and a button to View the interactive Handover Panel.

---

## 3. Types of Handovers

The system automatically generates handovers based on three primary trigger events:
1. **Leave Coverage:** A temporary transfer of duties while an employee is on vacation or medical leave. (Triggered from the Leave Module).
2. **Return From Leave:** Giving the duties back to the original employee once they return. (Triggered from the Leave Module).
3. **Exit Offboarding:** A permanent transfer of duties and the return of company property when an employee resigns. (Triggered from the Offboarding Module).

---

## 4. Handover Workflow & Statuses

Every handover logically flows through these specific statuses:

- **Pending Successor:** The system is waiting for HR or the employee to designate *who* will take over the tasks.
- **In Progress:** A successor has been chosen. Employees are now actively adding checklist items and checking them off as they complete knowledge transfers.
- **Pending Review:** All checklist items are checked off (100%). The handover is locked and submitted to a Manager/HR for final review.
- **Completed:** HR has verified the transfer and formally Approved it.
- **Waived / Cancelled:** HR determined a handover was not necessary and dismissed the requirement.

---

## 5. Handover Items

- While a handover is \`In Progress\`, users interact with the **Handover Panel**.
- You can click **"Add Item"** to list specific responsibilities (e.g., "Hand over social media passwords", "Return company laptop", "Brief John on the Q3 Marketing Report").
- Beside each item is a checkbox. Once the task is explained or handed over, the checkbox must be clicked to mark it complete.

---

## 6. Assigning a Successor

- Handovers cannot progress without a Successor. 
- The Successor is granted system access to view this specific Handover Panel so they can confirm they actually received the instructions or items.

---

## 7. Relationship with Leave Management

- The Handovers module is deeply embedded into the \`Leave Management\` system.
- HR initiates a "Coverage Handover" directly from a pending Leave Request.
- **Crucial Link:** The system will physically block you from deleting a Leave Request if a Handover is attached to it, maintaining data integrity.

---

## 8. Relationship with Offboarding

- When an employee enters the \`Offboarding\` process, HR will trigger an "Exit Handover".
- This ensures that ID badges are returned, software access is revoked, and pending projects are properly assigned to remaining staff before the employee's final day.

---

## 9. Practical Workflows

**Executing a Leave Coverage Handover:**
1. In the Leave module, HR clicks "Start Coverage Handover" and selects the Successor (e.g., Mary).
2. The Outgoing employee and Mary open the \`Handovers\` page and click \`View\` on their active record.
3. They use "Add Item" to list 3 ongoing projects.
4. After discussing the projects, they check off all 3 boxes.
5. They click "Submit for Review".
6. HR opens the record, verifies the 100% completion, and clicks \`Approve\`. The status changes to \`Completed\`.

---

## 10. Common Questions / Troubleshooting

- **Q: Why is the "Add Item" button missing?**
  A: You can only add items when the handover is in the \`In Progress\` state. If it is Completed or Pending Review, it is locked.
- **Q: Can I change the Successor?**
  A: Yes, but only before the Handover is finalized. Once it is Completed, the record is permanently archived.

---

## 11. Important Notes

- **The "Waive" Function:** If an employee (like a junior assistant or cleaner) takes leave and does not have critical tasks to hand over, HR can simply click **Waive**. This bypasses the checklist requirement entirely and marks the process as finished.

---

## 12. Employee Lifecycle Context

Handovers act as the safety net during the **Leave** (temporary absence) and **Offboarding** (permanent exit) phases of the Employee Lifecycle.

---

## 13. Related Modules

- <a href="#" data-article-title="Leave Management" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Leave Management</a>
- <a href="#" data-article-title="Offboarding" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Offboarding</a>
- <a href="#" data-article-title="Employees" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Employees</a>
`;

    const myHtml = marked.parse(myMarkdown);
    const enHtml = marked.parse(enMarkdown);

    // Update in Database
    const { data: article, error } = await supabaseAdmin
      .from('hrm_manual_articles')
      .select('id, title, published_content, draft_content')
      .eq('title', 'Handovers')
      .single();

    if (error || !article) {
      console.log('Handovers article not found in Database!');
      return;
    }

    const payload = JSON.stringify({ my: myHtml, en: enHtml });

    await supabaseAdmin.from('hrm_manual_articles').update({
      draft_content: payload,
      published_content: payload,
      status: 'published'
    }).eq('id', article.id);

    console.log('Successfully updated Handovers article with structured Burmese and English JSON!');

  } catch (err) {
    console.error('Error:', err);
  }
}

run();
