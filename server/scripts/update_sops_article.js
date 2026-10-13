import { supabaseAdmin } from '../lib/supabase.js';
import { marked } from 'marked';

async function run() {
  try {
    console.log('Translating and refining Daily SOPs Article...');

    const myMarkdown = `
# Daily SOPs (နေ့စဉ် လုပ်ငန်းစဉ်များ)

## 1. Daily SOPs Overview (ယေဘုယျအကြောင်းအရာ)
**Daily SOPs (Standard Operating Procedures) Module** သည် ဝန်ထမ်းများ နေ့စဉ် မဖြစ်မနေ လုပ်ဆောင်ရမည့် လုပ်ငန်းစဉ်များကို စနစ်တကျ သတ်မှတ်ပေးခြင်းနှင့် ၎င်းတို့ကို ပြီးစီးကြောင်း စစ်ဆေးမှတ်တမ်းတင်သော စနစ်ဖြစ်ပါသည်။
- **ဘာအတွက် အသုံးပြုသလဲ?** လုပ်ငန်းခွင်အတွင်း အမှားအယွင်း ကင်းရှင်းစေရန်၊ အရည်အသွေး ထိန်းသိမ်းရန်နှင့် ဝန်ထမ်းများ၏ နေ့စဉ် စွမ်းဆောင်ရည်ကို တိုင်းတာရန် ဖြစ်ပါသည်။
- **ဘယ်သူတွေ အသုံးပြုသလဲ?** Admin များက SOP Template များ ဖန်တီး၍ တာဝန်ချထားပေးပြီး၊ ဝန်ထမ်းများက နေ့စဉ် အလုပ်လုပ်ရာတွင် အသုံးပြုပါသည်။

---

## 2. Daily SOP Screen (Admin စာမျက်နှာ ဖွဲ့စည်းပုံ)

Admin များအတွက် စာမျက်နှာတွင် အဓိက Tab (၂) ခု ပါဝင်ပါသည်-
1. **Assign & Verify:** SOP Template များ ဖန်တီးခြင်း၊ လစဉ် Auto-Assign လုပ်ခြင်း၊ နှင့် ဝန်ထမ်းများ လုပ်ဆောင်ပြီးစီးမှုကို နေ့အလိုက် ဝင်ရောက်စစ်ဆေးခြင်း ပြုလုပ်နိုင်သော နေရာ။
2. **Tracking Report:** ဝန်ထမ်းများ၏ SOP ပြီးစီးမှု ရာခိုင်နှုန်း (Completion Rate) ကို ရာထူးအလိုက် အသေးစိတ် ကြည့်ရှုနိုင်သော နေရာ။

---

## 3. SOP Templates (ပုံသေလုပ်ငန်းစဉ်များ)

- **Template ဆိုတာဘာလဲ?** ရာထူး (Position) တစ်ခုချင်းစီအတွက် နေ့စဉ် လုပ်ဆောင်ရမည့် အလုပ်စာရင်းများ (Task Lists) ကို ကြိုတင် သတ်မှတ်ပေးထားခြင်း ဖြစ်ပါသည်။
- **ဖန်တီးခြင်း:** Admin သည် \`+ New Template\` ကို နှိပ်၍ သက်ဆိုင်ရာ **Position** ကို ရွေးချယ်ပြီး၊ နေ့စဉ် အလုပ်များကို စာကြောင်း တစ်ကြောင်းချင်းစီ (ဥပမာ - ၁။ ဆိုင်ခန်းရှင်းလင်းရန်၊ ၂။ မီးပိတ်ရန်) ရိုက်ထည့်နိုင်ပါသည်။

---

## 4. SOP Assignment (အလိုအလျောက် တာဝန်ချထားခြင်း)

- SOP များကို နေ့စဉ် လူကိုယ်တိုင် လိုက်လံ Assign လုပ်ပေးရန် မလိုပါ။
- **Monthly Auto-Assign:** Admin သည် လတစ်လ (ဥပမာ - 2023 October) ကို ရွေးချယ်ပြီး **Auto-Assign** ခလုတ်ကို နှိပ်လိုက်ပါက၊ ထိုလ၏ ရက်တိုင်းအတွက် သက်ဆိုင်ရာ Position ရှိ ဝန်ထမ်းများအားလုံးထံသို့ SOP Tasks များကို စနစ်မှ အလိုအလျောက် ဖန်တီး ချထားပေးမည် ဖြစ်ပါသည်။

---

## 5. Completing Daily SOPs (ဝန်ထမ်းများမှ SOP ပြီးစီးကြောင်း တင်ပြခြင်း)

ဝန်ထမ်းများသည် ၎င်းတို့၏ Employee Portal ရှိ **"SOP Execution"** စာမျက်နှာမှ တစ်ဆင့် အောက်ပါအတိုင်း လုပ်ဆောင်ရပါမည်-
1. **Checklist အမှန်ခြစ်ခြင်း:** နေ့စဉ် အလုပ်စာရင်းများကို ဖတ်၍ တစ်ခုချင်းစီ ပြီးစီးပါက Checkbox ကို အမှန်ခြစ် (Check-off) ရပါမည်။
2. **Video / Image အထောက်အထား (Proof):** အလုပ်ပြီးစီးကြောင်း သက်သေအဖြစ် Live Video ရိုက်ကူးခြင်း (သို့) ဖုန်းထဲရှိ ဓာတ်ပုံ/ဗီဒီယို ဖိုင်ကို ရွေးချယ် တင်ပြနိုင်ပါသည်။
3. **Manual Report (ခြွင်းချက်):** အလုပ်အားလုံးကို အမှန်ခြစ် မခြစ်နိုင်ခဲ့ပါက (ဥပမာ - ပစ္စည်းပြတ်နေ၍ မလုပ်လိုက်ရပါက) Manual Report Box တွင် အကြောင်းရင်းကို စာရေးပြီး ဓာတ်ပုံ သက်သေပြ၍လည်း Upload လုပ်နိုင်ပါသည်။
4. **Upload & Complete:** အားလုံးပြည့်စုံပါက ခလုတ်ကိုနှိပ်၍ Submit လုပ်ရပါမည်။ (အစိမ်းရောင် ဖြင့် ပြီးစီးကြောင်း ပေါ်လာပါမည်)။

*(မှတ်ချက်: ယခင်ရက်များတွင် ရုံးမတက်ခဲ့ပါက "Absent" ဟု အလိုအလျောက် ပေါ်နေမည်ဖြစ်ပြီး အမှန်ခြစ်၍ မရတော့ပါ။)*

---

## 6. SOP Performance Tracking (စွမ်းဆောင်ရည် တိုင်းတာခြင်း)

- Admin သည် **Tracking Report** Tab သို့ ဝင်ရောက်၍ ဝန်ထမ်းတစ်ဦးချင်းစီ၏ SOP ပြီးစီးမှု ရာခိုင်နှုန်းကို စစ်ဆေးနိုင်ပါသည်။
- သက်သေအဖြစ် တင်ထားသော ဗီဒီယိုများကိုလည်း \`View Video\` နှိပ်၍ ပြန်လည်ကြည့်ရှု စစ်ဆေးနိုင်ပါသည်။

---

## 7. Daily SOPs ↔ Employees (ဝန်ထမ်းများနှင့် ဆက်စပ်မှု)

SOP များကို \`Employees\` Module တွင် စာရင်းသွင်းထားသော လက်ရှိ တာဝန်ထမ်းဆောင်ဆဲ ဝန်ထမ်းများအတွက်သာ Auto-assign ပြုလုပ်ပေးပါသည်။

---

## 8. Daily SOPs ↔ Positions (ရာထူးများနှင့် ဆက်စပ်မှု)

SOP Template များကို ဝန်ထမ်းတစ်ဦးချင်းစီအတွက် မဟုတ်ဘဲ **Position (ရာထူး)** ကို အခြေခံ၍ သတ်မှတ်ပေးခြင်း ဖြစ်ပါသည်။ ဥပမာ - Cashier ရာထူး ရှိသူတိုင်းသည် Cashier SOP ကို အလိုအလျောက် ရရှိပါမည်။

---

## 9. Daily SOPs ↔ Performance Tracker (စွမ်းဆောင်ရည်နှင့် ဆက်စပ်မှု)

ဝန်ထမ်းတစ်ဦး၏ SOP ကို ပုံမှန် ပြီးစီးအောင် လုပ်ဆောင်မှု (Consistency) နှင့် သက်သေဗီဒီယိုများ၏ အရည်အသွေးကို HR မှ ကြည့်ရှု၍ \`Performance Tracker\` တွင် အမှတ်ပေး အကဲဖြတ်ရန်အတွက် ခိုင်လုံသော အထောက်အထားအဖြစ် အသုံးပြုပါသည်။ (လက်ရှိစနစ်တွင် SOP အမှန်ခြစ် ရာခိုင်နှုန်းကို Performance Score ထဲသို့ အလိုအလျောက် ပေါင်းထည့်တွက်ချက်ခြင်း မျိုး မပါဝင်သေးပါ။ HR မှ ကိုယ်တိုင် ပြန်လည်သုံးသပ်ရပါမည်)။

---

## 10. Daily SOPs ↔ Payroll & KPI (လစာနှင့် ဆက်စပ်မှု)

SOP ပြီးစီးမှု ရလဒ်များကို HR မှ လစဉ် KPI အမှတ်များအဖြစ် အသွင်ပြောင်း၍ အကဲဖြတ်ပြီးမှသာ \`Payroll\` တွင် Bonus သို့မဟုတ် ဒဏ်ကြေး အဖြစ် အသုံးပြုလေ့ရှိပါသည်။ (SOP မှ လစာထဲသို့ တိုက်ရိုက် အလိုအလျောက် ချိတ်ဆက်ဖြတ်တောက်ခြင်း မရှိပါ)။

---

## 11. လက်တွေ့ အသုံးပြုမှု (Practical Workflows)

1. လဆန်းတိုင်းတွင် Admin သည် **Auto-Assign** ကို နှိပ်၍ ထိုလအတွက် SOP များကို ကြိုတင် ဖန်တီးထားပါသည်။
2. ဝန်ထမ်းများသည် နေ့စဉ် အလုပ်ဆင်းချိန်တွင် Portal သို့ဝင်၍ မိမိ၏ SOP ကို အမှန်ခြစ်ပြီး ဗီဒီယိုတင်ကာ Submit လုပ်ပါသည်။
3. နောက်တစ်နေ့ မနက်တွင် Admin က ယမန်နေ့အတွက် View Date ကို ရွေး၍ ဘယ်သူတွေ Video မတင်ခဲ့လဲ ဆိုသည်ကို စစ်ဆေးပါသည်။

---

## 12. အမေးများသော မေးခွန်းများ (FAQ & Troubleshooting)

- **မေး: မနေ့က SOP တွေက Absent လို့ ပေါ်နေတယ်၊ ပြန်ခြစ်လို့ ရလား?**
  ဖြေ: မရပါ။ Attendance (ရုံးတက်စာရင်း) မရှိဘဲ၊ သို့မဟုတ် နေ့ရက် ကျော်လွန်သွားပါက စနစ်မှ အလိုအလျောက် "Absent" သို့မဟုတ် ပိတ်ပင် (Disable) လိုက်မည် ဖြစ်ပါသည်။
- **မေး: SOP ကို Submit နှိပ်လို့ မရဘူး။**
  ဖြေ: အချက်အားလုံးကို Checkbox ခြစ်ထားခြင်း ရှိ/မရှိ စစ်ဆေးပါ။ အကယ်၍ အကုန်မခြစ်နိုင်ပါက Manual Report (အကြောင်းပြချက်) ရေးပြီး ဗီဒီယို/ဓာတ်ပုံ တွဲတင်မှသာ Submit နှိပ်၍ ရပါမည်။

---

## 13. အရေးကြီး မှတ်သားရန် (Limitations & Precautions)

- **Storage:** ဝန်ထမ်းတိုင်း နေ့စဉ် Video တင်ရမည် ဖြစ်သဖြင့် Server Storage ပြည့်လွယ်နိုင်ပါသည်။ ဗီဒီယို ဖိုင်ဆိုဒ်ကို ကန့်သတ်ထားရန် သို့မဟုတ် သတ်မှတ်ကာလ ကျော်လွန်သော ဗီဒီယိုများကို ရှင်းလင်းရန် HR မှ သတိပြုသင့်ပါသည်။
- **Position ပြောင်းလဲခြင်း:** ဝန်ထမ်းတစ်ဦး ရာထူးပြောင်းသွားပါက၊ လာမည့်လအတွက် Auto-Assign လုပ်သောအခါမှသာ SOP အသစ်ကို ရရှိမည် ဖြစ်ပါသည်။

---

## 14. Employee Lifecycle တွင် ပါဝင်မှု

Daily SOP သည် ဝန်ထမ်းဘဝ (Employee Lifecycle) ၏ **လုပ်ငန်းခွင် လည်ပတ်မှု (Daily Operations)** ကဏ္ဍတွင် အဓိကကျသော လုပ်ငန်းစဉ် ဖြစ်ပါသည်။

---

## 15. ဆက်လက်ဖတ်ရှုရန် (Related Modules)

- <a href="#" data-article-title="Positions" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Positions</a>
- <a href="#" data-article-title="Performance Tracker" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Performance Tracker</a>
- <a href="#" data-article-title="Employees" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Employees</a>
`;

    const enMarkdown = `
# Daily SOPs

## 1. Daily SOPs Overview
The **Daily SOPs (Standard Operating Procedures) Module** is a compliance and tracking system that ensures employees complete their mandatory daily routines.
- **Purpose:** To maintain operational quality, reduce errors, and provide HR with tangible data regarding daily employee consistency.
- **Who uses it?** Admins/HR create the templates and assign them, while Employees interact with the system daily to prove they completed their tasks.

---

## 2. Daily SOP Screen

The Admin dashboard is split into two primary tabs:
1. **Assign & Verify:** The core area where Admins manage Templates, trigger the monthly Auto-Assign feature, and review daily completions grouped by Position.
2. **Tracking Report:** An analytical view displaying the completion rates (%) of employees across different positions.

---

## 3. SOP Templates

- **What is a Template?** A predefined checklist of tasks bound to a specific **Position** rather than a specific employee.
- **Creation:** Admins click \`+ New Template\`, select a Position (e.g., Kitchen Staff), and type out the step-by-step tasks required every day (e.g., "1. Clean the grill").

---

## 4. SOP Assignment

- Handoff assignments are heavily automated.
- **Monthly Auto-Assign:** By selecting a month and clicking the **Auto-Assign** button, the system dynamically creates an SOP record for *every single day of that month* for every active employee, based entirely on their current Position's template.

---

## 5. Completing Daily SOPs (Employee Workflow)

Employees use the **"My Tasks" (SOP Execution)** portal on their mobile or desktop devices:
1. **Checklist:** The employee reads the daily tasks and checks the boxes as they complete them.
2. **Media Proof:** To ensure accountability, employees must attach a Live Video recording via webcam/phone camera, or upload a photo/video file.
3. **Manual Report:** If an employee cannot complete every task (e.g., a machine is broken), the system prevents normal submission. They must write a "Manual Report" explaining the issue and attach media to unlock the Submit button.
4. **Completion:** Upon successful upload, the record is marked \`Done\` (Green).

*(Note: The system automatically hides future SOPs. Past SOPs on days where the employee did not check into the Attendance system are permanently locked and marked as "Absent").*

---

## 6. SOP Performance Tracking

- In the **Tracking Report** and the Daily View, Admins can quickly see how many tasks were assigned versus completed.
- Admins can click \`View Video\` to watch the employee's submitted proof to ensure quality standards are being met, rather than just blindly accepting checkboxes.

---

## 7. Relationship with Employees

The system dynamically pulls active profiles from the \`Employees\` module during the Auto-Assign phase. Terminated employees are automatically excluded.

---

## 8. Relationship with Positions

SOPs are strictly bound to \`Positions\`. If a new employee is hired as a Cashier, they inherit the Cashier SOP Template automatically during the next Auto-Assign cycle.

---

## 9. Relationship with Performance Tracker

Daily SOP completion data is vital evidence for HR during performance appraisals. Admins review the SOP \`Tracking Report\` to accurately gauge an employee's daily reliability. *(Note: Currently, SOP completion percentages do not automatically calculate into the numeric Performance Tracker score; HR reviews the data and manually adjusts the KPI scores).*

---

## 10. Relationship with Payroll & KPI

Consistent failure to complete Daily SOPs often results in HR lowering the employee's KPI score, which may subsequently affect performance bonuses in the \`Payroll\` module.

---

## 11. Practical Workflows

1. **End of Month:** HR generates SOPs for the upcoming month using the Auto-Assign feature.
2. **Daily:** Employees open the portal at the end of their shift, check off their tasks, record a 10-second video of their clean workstation, and submit.
3. **Audit:** Managers log in the next morning, set the \`View Date\` to yesterday, and randomly audit 5 videos to ensure cleanliness standards.

---

## 12. Common Questions / Troubleshooting

- **Q: Why is the Submit button disabled for an employee?**
  A: They must either check ALL task boxes OR write a Manual Report. Furthermore, they must attach a video/image. Without these, submission is blocked.
- **Q: Can an employee complete yesterday's SOP?**
  A: If they checked in (Attendance) but forgot to submit the SOP, it remains \`Pending\` and they can theoretically submit it. However, if they were absent, it is locked as \`Absent\`.

---

## 13. Important Notes / Limitations

- **Storage Considerations:** Video uploads consume server space rapidly. It is recommended to compress videos or instruct staff to record brief (5-10 second) clips.
- **Position Changes:** If an employee is promoted to a new Position mid-month, their pre-assigned SOPs for that month remain unchanged. The new Position's SOP will take effect during the next month's Auto-Assign batch.

---

## 14. Employee Lifecycle Context

Daily SOPs represent the core **Operational execution** phase of an employee's lifecycle, serving as a daily touchpoint between the employee's output and management's expectations.

---

## 15. Related Modules

- <a href="#" data-article-title="Positions" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Positions</a>
- <a href="#" data-article-title="Performance Tracker" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Performance Tracker</a>
- <a href="#" data-article-title="Employees" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Employees</a>
`;

    const myHtml = marked.parse(myMarkdown);
    const enHtml = marked.parse(enMarkdown);

    // Update in Database
    const { data: article, error } = await supabaseAdmin
      .from('hrm_manual_articles')
      .select('id, title, published_content, draft_content')
      .eq('title', 'Daily SOPs')
      .single();

    if (error || !article) {
      console.log('Daily SOPs article not found in Database!');
      return;
    }

    const payload = JSON.stringify({ my: myHtml, en: enHtml });

    await supabaseAdmin.from('hrm_manual_articles').update({
      draft_content: payload,
      published_content: payload,
      status: 'published'
    }).eq('id', article.id);

    console.log('Successfully updated Daily SOPs article with structured Burmese and English JSON!');

  } catch (err) {
    console.error('Error:', err);
  }
}

run();
