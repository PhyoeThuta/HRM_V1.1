import { supabaseAdmin } from '../lib/supabase.js';
import { marked } from 'marked';

async function run() {
  try {
    console.log('Translating and refining Performance Tracker Article...');

    const myMarkdown = `
# Performance Tracker (စွမ်းဆောင်ရည် အကဲဖြတ်စနစ်)

## 1. Performance Tracker Overview (ယေဘုယျအကြောင်းအရာ)
**Performance Tracker** သည် ဝန်ထမ်းများ၏ နေ့စဉ် စွမ်းဆောင်ရည်၊ ရုံးတက်မှန်ကန်မှု နှင့် ရည်မှန်းချက် ပြည့်မီမှုများကို ပေါင်းစပ်၍ လစဉ် **စွမ်းဆောင်ရည် အမှတ် (CPI - Comprehensive Performance Index)** အဖြစ် အလိုအလျောက် တွက်ချက်ပြသပေးသော စနစ်ဖြစ်ပါသည်။
- **ဘာအတွက် အသုံးပြုသလဲ?** ဝန်ထမ်းများ၏ အလုပ်ကြိုးစားမှုကို ဘက်လိုက်မှုကင်းစွာ တွက်ချက်နိုင်ရန်နှင့် လစာ/ဆုကြေးငွေ တွက်ချက်ရာတွင် အခြေခံအချက်အဖြစ် အသုံးပြုရန် ဖြစ်ပါသည်။

---

## 2. Performance Tracker Screen (စာမျက်နှာ ဖွဲ့စည်းပုံ)

- **Filters:** လ (Month)၊ ဌာန (Department) နှင့် ဝန်ထမ်းအမည် ဖြင့် စစ်ထုတ်ရှာဖွေနိုင်ပါသည်။
- **Summary Cards:** ပျမ်းမျှ CPI အမှတ်၊ နေ့စဉ် SOP ပြီးစီးမှု ရာခိုင်နှုန်း၊ A အဆင့်ရရှိသူ အရေအတွက် နှင့် စွမ်းဆောင်ရည် ကျဆင်းနေသူ (Risk) အရေအတွက်တို့ကို ပြသထားပါသည်။
- **Charts:** ဌာနအလိုက် စွမ်းဆောင်ရည် နှိုင်းယှဉ်ချက် (Bar Chart) နှင့် လအလိုက် တိုးတက်မှု (Trend Line Chart) ကို ပြသထားပါသည်။
- **Ledger Table (ဇယား):** ဝန်ထမ်းတစ်ဦးချင်းစီ၏ အမှတ်များ (SOP, KPI, Culture, Overall CPI, Grade နှင့် Bonus %) ကို ဇယားဖြင့် အသေးစိတ် ကြည့်ရှုနိုင်ပါသည်။

---

## 3. Employee Performance Records (ဝန်ထမ်းတစ်ဦးချင်းစီ၏ စွမ်းဆောင်ရည်)

ဇယားရှိ ညာဘက်ဆုံး \`View 360°\` ခလုတ်ကို နှိပ်လိုက်ပါက **Scorecard Modal** ပွင့်လာပါမည်။
ထိုနေရာတွင် ဝန်ထမ်း၏ စွမ်းဆောင်ရည်ကို ကဏ္ဍစုံမှ (Radar Chart) ပုံစံဖြင့် အောက်ပါအတိုင်း တွေ့မြင်နိုင်ပါသည်-
- **SOP Compliance:** နေ့စဉ် အလုပ်များ ပြီးစီးမှု
- **JD / KPI Score:** လုပ်ငန်း ရည်မှန်းချက် ပြည့်မီမှု
- **Attendance & Punctuality:** ရုံးတက်မှန်ကန်မှု နှင့် အချိန်မီရောက်ရှိမှု
- **Peer Rating:** လုပ်ဖော်ကိုင်ဖက်များ၏ အကဲဖြတ်မှု

---

## 4. Performance Criteria (အကဲဖြတ်ရာတွင် ပါဝင်သော အချက်များ)

အမှတ်တွက်ချက်ရာတွင် အောက်ပါ Data များကို အခြား Module များမှ အလိုအလျောက် ရယူပါသည်-
1. **Attendance Rate:** ရုံးတက်ရမည့် နေ့ပေါင်း (၂၆ ရက်) တွင် လာရောက်သော အရေအတွက် (ခွင့်ယူထားသော ရက်များကို ရုံးတက်သကဲ့သို့ ထည့်သွင်းစဉ်းစားပေးပါသည်)။
2. **Punctuality Rate:** ရုံးတက်သော ရက်များအနက် အချိန်မီ (မနောက်ကျဘဲ) ရောက်ရှိသော ရာခိုင်နှုန်း။
3. **Daily SOP Score:** နေ့စဉ် SOP အလုပ်များအနက် ပြီးစီးအောင် အမှန်ခြစ်ခဲ့သော ရာခိုင်နှုန်း။
4. **KPI Targets Score:** Admin မှ ထည့်သွင်းပေးထားသော (Target Score) နှင့် လက်တွေ့ လုပ်ဆောင်နိုင်မှု (Actual Score) ၏ ရာခိုင်နှုန်း။
5. **Peer Voting Score:** လုပ်ဖော်ကိုင်ဖက်များ၏ မဲပေးမှု ရလဒ် (၅ မှတ်ပြည့်) ကို ရာခိုင်နှုန်း ပြောင်းလဲထားခြင်း။

---

## 5. Performance Score (စွမ်းဆောင်ရည် အမှတ် - CPI)

အထက်ပါ အချက်များကို ပေါင်းစပ်၍ **CPI (Comprehensive Performance Index)** 100% ပြည့် အမှတ်ကို တွက်ချက်ပါသည်။
- **အဆင့်များ (Grades):**
  - **A+ (Exceptional):** 95% နှင့်အထက်
  - **A (High Achiever):** 85% နှင့်အထက်
  - **B (Standard):** 75% နှင့်အထက်
  - **C (Needs Improvement):** 60% နှင့်အထက်
  - **D (Underperforming):** 60% အောက်

---

## 6. Score Calculation (အမှတ်တွက်ချက်ပုံ ဖော်မြူလာ)

- **Overall CPI Score:** Admin မှ သတ်မှတ်ထားသော အလေးပေးမှု (Weights) အတိုင်း SOP Score နှင့် KPI Target Score တို့ကို တွက်ချက်ပါသည်။ (ဥပမာ - SOP 50% + KPI 50%)။
- **Culture Score (သီးခြားအမှတ်):** \`(Attendance 50%) + (Punctuality 25%) + (Peer Voting 25%)\` ဖြင့် တွက်ချက်ပါသည်။

---

## 7. Performance ↔ Payroll (လစာနှင့် ဆက်စပ်မှု)

စာမျက်နှာ၏ ညာဘက်အပေါ်ထောင့်တွင် **"⚡ Sync to Payroll"** ခလုတ် ပါရှိပါသည်။
- **ဘာလုပ်ပေးတာလဲ?** ထိုခလုတ်ကို နှိပ်လိုက်ပါက ယခု တွက်ချက်ရရှိထားသော CPI အမှတ်များကို \`Payroll\` Module အတွင်းရှိ ထိုလ၏ လစာစာရင်းများထဲသို့ အလိုအလျောက် သွားရောက် ထည့်သွင်းပေးမည် ဖြစ်ပါသည်။
- **Bonus တွက်ချက်ခြင်း:** CPI အမှတ်ကို အခြေခံ၍ ဆုကြေး (Bonus) ကို ပြန်လည်တွက်ချက်ပြီး၊ Net Salary (အသားတင်လစာ) ကို အလိုအလျောက် Update လုပ်ပေးမည် ဖြစ်ပါသည်။

*(သတိပြုရန်: ဤခလုတ်သည် Payroll တွင် ကြိုတင်ဖန်တီးထားပြီးသော လစာမှတ်တမ်းများကိုသာ ပြင်ဆင် (Update) လုပ်ပေးခြင်း ဖြစ်ပါသည်။ Record အသစ် ဖန်တီးပေးမည် မဟုတ်ပါ။)*

---

## 8. Performance ↔ Daily SOPs

\`Daily SOPs\` တွင် အမှန်ခြစ်ပြီးစီးမှု ရာခိုင်နှုန်းသည် ဤ Performance Tracker ၏ **SOP Score** ထဲသို့ တိုက်ရိုက် ရောက်ရှိလာမည် ဖြစ်ပါသည်။

---

## 9. Performance ↔ Peer Voting

လုပ်ဖော်ကိုင်ဖက်များ၏ မဲပေးမှု ရလဒ်များသည် ဤနေရာရှိ **Culture Score** ကို အတက်အကျ ဖြစ်စေပါသည်။

---

## 10. Performance ↔ Employees

စနစ်သည် \`Employees\` ထဲရှိ တာဝန်ထမ်းဆောင်ဆဲ (Active) ဝန်ထမ်းများအတွက်သာ စွမ်းဆောင်ရည် အမှတ်ကို တွက်ချက်ပေးပါသည်။

---

## 11. လက်တွေ့ အသုံးပြုမှု (Practical Workflows)

**လကုန်ဆုံးချိန်တွင် HR လုပ်ဆောင်ရမည့် အဆင့်များ:**
1. \`Payroll\` Module သို့သွား၍ ယခုလအတွက် လစာ (Payroll) များကို Generate လုပ်ထားပါ။
2. \`Performance Tracker\` သို့ လာပါ။ ရလဒ်များ မှန်ကန်မှု ရှိ/မရှိ ဇယားတွင် စစ်ဆေးပါ။
3. အရာအားလုံး မှန်ကန်ပါက **"Sync to Payroll"** ခလုတ်ကို နှိပ်ပါ။
4. \`Payroll\` စာမျက်နှာသို့ ပြန်သွား၍ Bonus အမှတ်များ ဝင်ရောက်လာခြင်း ရှိ/မရှိ ပြန်လည်စစ်ဆေးပါ။

---

## 12. အမေးများသော မေးခွန်းများ (FAQ & Troubleshooting)

- **မေး: Sync to Payroll နှိပ်လိုက်တာ "No payroll records found" ဆိုပြီး ပေါ်လာတယ်။**
  ဖြေ: Payroll Module တွင် ယခုလအတွက် လစာ (Payroll) ကို Generate မလုပ်ရသေးသောကြောင့် ဖြစ်ပါသည်။ လစာစာရင်းကို အရင် ဖန်တီးပါ။
- **မေး: ဝန်ထမ်းတစ်ယောက်က Grade "—" (No Data) ဖြစ်နေတယ်။**
  ဖြေ: ထိုလအတွက် ထိုဝန်ထမ်း၌ SOP Data လည်းမရှိ၊ KPI Record လည်း မရှိသေးသောကြောင့် အမှတ်တွက်စရာ မရှိခြင်း ဖြစ်ပါသည်။

---

## 13. အရေးကြီး မှတ်သားရန် (Limitations)

- လစဉ် ရုံးတက်ရမည့် ရက်ပေါင်းကို လက်ရှိစနစ်တွင် (၂၆ ရက်) ဟု ပုံသေ (Hardcode) တွက်ချက်ထားပါသည်။

---

## 14. Employee Lifecycle တွင် ပါဝင်မှု

Performance Tracker သည် လုပ်ငန်းခွင်အတွင်း နေ့စဉ် ဖြတ်သန်းမှုများကို စုစည်း၍ **Monthly Review (လစဉ် သုံးသပ်ခြင်း)** ပြုလုပ်သော အရေးပါသည့် အဆင့်ဖြစ်ပါသည်။

---

## 15. ဆက်လက်ဖတ်ရှုရန် (Related Modules)

- <a href="#" data-article-title="Daily SOPs" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Daily SOPs</a>
- <a href="#" data-article-title="Peer Voting" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Peer Voting</a>
- <a href="#" data-article-title="Payroll & KPI" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Payroll & KPI</a>
- <a href="#" data-article-title="Attendance" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Attendance</a>
`;

    const enMarkdown = `
# Performance Tracker

## 1. Performance Tracker Overview
The **Performance Tracker** module automatically aggregates an employee's daily actions, attendance, and goal achievements into a single monthly **CPI (Comprehensive Performance Index)** score out of 100%.
- **Purpose:** To provide a data-driven, unbiased evaluation of an employee's work ethic and to automatically calculate performance bonuses for Payroll.

---

## 2. Performance Tracker Screen

- **Filters:** View data by Month, Department, or search for a specific employee.
- **Summary Cards:** Displays the company-wide Average CPI, Average SOP Compliance, number of Top Achievers (A+ & A), and employees at Performance Risk (C & D).
- **Charts:** A Bar Chart comparing departments side-by-side, and a Line Chart showing the 6-month CPI trend.
- **Ledger Table:** A detailed grid showing the exact breakdown of SOP, KPI, and Culture scores, leading to the final CPI, Grade, and Bonus %.

---

## 3. Employee Performance Records

Clicking \`View 360°\` on any employee opens their **Scorecard Modal**.
This modal visually maps their performance using a Radar Chart across multiple dimensions:
- **SOP Compliance:** How consistently they checked off their daily tasks.
- **JD / KPI Score:** How well they met manually entered performance targets.
- **Attendance & Punctuality:** How often they showed up, and showed up on time.
- **Peer Rating:** How their colleagues rated them.

---

## 4. Performance Criteria (Data Sources)

The system automatically fetches data from the following modules to compute the scores:
1. **Attendance Rate:** Based on a 26-day working month. *(Note: Approved leaves are counted as "attended" so employees are not penalized for taking authorized time off).*
2. **Punctuality Rate:** The percentage of check-ins that were not marked as 'Late'.
3. **Daily SOP Score:** The percentage of tasks completed in the Daily SOPs module.
4. **KPI Targets Score:** The average achievement of Actual vs. Target scores from KPI records created by Admins.
5. **Peer Voting Score:** The average out of 5 stars from peer evaluations.

---

## 5. Performance Score (CPI)

The **Comprehensive Performance Index (CPI)** is the final score (0-100%).
- **Grades:**
  - **A+ (Exceptional):** 95% and above
  - **A (High Achiever):** 85% - 94%
  - **B (Standard):** 75% - 84%
  - **C (Needs Improvement):** 60% - 74%
  - **D (Underperforming):** Below 60%

---

## 6. Score Calculation

- **Overall CPI Score:** Calculated using a weighted average defined by Admins (e.g., 50% SOP Score + 50% KPI Target Score).
- **Culture Score (Separate Metric):** Calculated as \`(50% Attendance Rate) + (25% Punctuality) + (25% Peer Voting)\`.

---

## 7. Relationship with Payroll

At the top right of the screen is a **"⚡ Sync to Payroll"** button.
- **What does it do?** Clicking this securely transmits all computed CPI scores into the \`Payroll\` module for the selected month.
- **Bonus Calculation:** It automatically recalculates the employee's Bonus using the formula: \`(Base Salary * Target Bonus %) * (CPI / 100)\`. It then updates the Net Salary.

*(Crucial Limitation: This button only **updates** existing payroll records. If you have not generated the payroll for this month in the Payroll module yet, the sync will skip that employee).*

---

## 8. Relationship with Daily SOPs

The percentage of checked boxes in the \`Daily SOPs\` module automatically feeds directly into the **SOP Score** column here.

---

## 9. Relationship with Peer Voting

Votes cast by colleagues in the Peer Voting system directly impact the **Culture Score** and the 360° Radar Chart.

---

## 10. Relationship with Employees

The system only evaluates employees whose status is set to "Active" in the \`Employees\` module.

---

## 11. Practical Workflows

**The End-of-Month HR Workflow:**
1. Go to the \`Payroll\` module and Generate payrolls for the current month.
2. Come to the \`Performance Tracker\` and review the Ledger Table for accuracy.
3. If everything looks correct, click **"Sync to Payroll"**.
4. Return to the \`Payroll\` module to finalize salaries, which now accurately reflect performance bonuses.

---

## 12. Common Questions / Troubleshooting

- **Q: Why does the Sync button say "0 records updated"?**
  A: You have not generated the base payroll records in the Payroll module for this month yet.
- **Q: Why does an employee have a Grade of "—"?**
  A: The system cannot find any Daily SOP data or KPI targets for that employee for the selected month, so a score cannot be computed.

---

## 13. Important Notes / Limitations

- **Hardcoded Working Days:** The Attendance Rate calculation currently assumes a fixed 26-day working month for all employees.

---

## 14. Employee Lifecycle Context

The Performance Tracker is the bridge between **Daily Operations** and **Compensation**, acting as the objective referee for monthly or annual reviews.

---

## 15. Related Modules

- <a href="#" data-article-title="Daily SOPs" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Daily SOPs</a>
- <a href="#" data-article-title="Peer Voting" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Peer Voting</a>
- <a href="#" data-article-title="Payroll & KPI" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Payroll & KPI</a>
- <a href="#" data-article-title="Attendance" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Attendance</a>
`;

    const myHtml = marked.parse(myMarkdown);
    const enHtml = marked.parse(enMarkdown);

    // Update in Database
    const { data: article, error } = await supabaseAdmin
      .from('hrm_manual_articles')
      .select('id, title, published_content, draft_content')
      .eq('title', 'Performance Tracker')
      .single();

    if (error || !article) {
      console.log('Performance Tracker article not found in Database!');
      return;
    }

    const payload = JSON.stringify({ my: myHtml, en: enHtml });

    await supabaseAdmin.from('hrm_manual_articles').update({
      draft_content: payload,
      published_content: payload,
      status: 'published'
    }).eq('id', article.id);

    console.log('Successfully updated Performance Tracker article with structured Burmese and English JSON!');

  } catch (err) {
    console.error('Error:', err);
  }
}

run();
