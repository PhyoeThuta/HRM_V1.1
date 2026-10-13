import { supabaseAdmin } from '../lib/supabase.js';
import { marked } from 'marked';

async function run() {
  try {
    console.log('Translating and refining Payroll & KPI Article...');

    const myMarkdown = `
# Payroll & KPI (လစာနှင့် ရည်မှန်းချက် စီမံခန့်ခွဲမှု)

## 1. Payroll & KPI Overview (ယေဘုယျအကြောင်းအရာ)
**Payroll & KPI** Module သည် ဝန်ထမ်းများ၏ လစဉ် လစာစာရင်းများကို အခြားသော စွမ်းဆောင်ရည် အမှတ်များ (SOP, Attendance, Peer Voting) များနှင့် အလိုအလျောက် ချိတ်ဆက် တွက်ချက်ပေးသော စနစ်ဖြစ်ပါသည်။
- **ဘာအတွက် အသုံးပြုသလဲ?** စွမ်းဆောင်ရည်ပေါ် မူတည်၍ ဆုကြေး (Bonus) နှင့် ဒဏ်ကြေး (Deduction) များကို တိကျမြန်ဆန်စွာ တွက်ချက်နိုင်ရန်နှင့် လစာထုတ်ပေးမှု မှတ်တမ်းများကို သိမ်းဆည်းရန် ဖြစ်ပါသည်။
- **ဘယ်သူတွေ အသုံးပြုသလဲ?** HR နှင့် Admin များသာ အသုံးပြုခွင့် ရှိပါသည်။

---

## 2. Payroll Screen (စာမျက်နှာ ဖွဲ့စည်းပုံ)

စာမျက်နှာတွင် အဓိက အစိတ်အပိုင်း (၃) ခု ပါဝင်ပါသည်-
1. **Total Paid Amount:** ယခုအချိန်ထိ ထုတ်ပေးပြီးသော စုစုပေါင်း လစာ ပမာဏ။
2. **Payroll Records ဇယား:** ဝန်ထမ်းအမည်၊ လ၊ အခြေခံလစာ၊ ထောက်ပံ့ကြေး၊ ဖြတ်တောက်ငွေ၊ ဆုကြေး၊ အသားတင်လစာ နှင့် KPI Score များကို ပြသထားသော ဇယား။ (Excel သို့ Export ထုတ်နိုင်ပါသည်)။
3. **KPI Adjustments ဇယား:** Admin မှ ကိုယ်တိုင် (Manual) သတ်မှတ်ပေးထားသော KPI Target များနှင့် ပြီးမြောက်မှု ရလဒ်များ မှတ်တမ်း။

---

## 3. KPI Settings (အမှတ်ပေး စနစ် သတ်မှတ်ခြင်း)

\`KPI Settings\` ခလုတ်ကို နှိပ်၍ Admin သည် လစာနှင့် စွမ်းဆောင်ရည် ချိတ်ဆက်မည့် အချိုးအစားကို ကြိုတင် သတ်မှတ်ထားနိုင်ပါသည်။
- **Target Bonus Percentage (%):** လစာ၏ မည်မျှရာခိုင်နှုန်းကို KPI ဖြင့် ချိတ်ဆက်မည်ကို သတ်မှတ်ခြင်း။ (ဥပမာ - ၁၅% ဟု သတ်မှတ်ပါက၊ 100% KPI ပြည့်မီမှသာ ထို ၁၅% ကို အပြည့်ရမည် ဖြစ်သည်)။
- **Auto Weights:** စနစ်မှ အလိုအလျောက် ရယူမည့် အမှတ်များကို ရာခိုင်နှုန်း ခွဲဝေပေးခြင်း။ (ဥပမာ - Attendance 40%, SOPs 40%, Peer Voting 20%)။
- **Manual Metrics:** HR မှ လကုန်မှသာ ကိုယ်တိုင် အမှတ်ပေးလိုသော အချက်များ ထပ်ထည့်နိုင်ပါသည်။ (ဥပမာ - Sales Target 20%)။

---

## 4. လစာ တွက်ချက်ခြင်း (Auto-Calculate Payroll)

\`+ Add Payroll\` ကိုနှိပ်၍ လစာစာရင်း သွင်းရာတွင်-
1. ဝန်ထမ်းအမည်၊ လ (Month) နှင့် အလုပ်ဆင်းရမည့် ရက် (Working Days) ကို ရွေးချယ်ပါ။
2. **"Auto Calculate"** ကို နှိပ်လိုက်ပါက၊ စနစ်သည် ထိုဝန်ထမ်း၏ Attendance, SOP, Peer Voting အမှတ်များကို \`Performance Tracker\` မှ အလိုအလျောက် ဆွဲယူလာပါမည်။
3. Manual Metrics များ ရှိပါက ယခုအချိန်တွင် အမှတ် (100 ပြည့်) ထည့်ပေးရပါမည်။
4. **Final KPI Score** ကို ချက်ချင်း ပေါင်းပြပေးမည် ဖြစ်ပါသည်။

---

## 5. Bonus / Deduction တွက်ချက်ပုံ (Calculation Formula)

စနစ်သည် **Final KPI Score** ပေါ်မူတည်၍ အောက်ပါအတိုင်း အလိုအလျောက် တွက်ချက်ပေးပါသည်-
- **Target Bonus Amount** = အခြေခံလစာ × Target Bonus %
- **KPI 100% မပြည့်ပါက (Deduction):** လိုအပ်နေသော ရာခိုင်နှုန်း အချိုးအစားအတိုင်း Target Bonus Amount ထဲမှ ဖြတ်တောက် (Deduction) ပါမည်။
- **KPI 100% ကျော်လွန်ပါက (Bonus):** ကျော်လွန်သွားသော ရာခိုင်နှုန်း အချိုးအစားအတိုင်း Target Bonus Amount အပေါ်တွင် အပိုဆုကြေး (Over-achievement Bonus) ထပ်ဆောင်းပေးပါမည်။
- **Net Salary:** \`(Basic + Allowances + Bonus) - Deductions\` ဖြင့် အသားတင် လစာကို ပြသပေးပါသည်။

---

## 6. Payroll ↔ Performance Tracker (စွမ်းဆောင်ရည်နှင့် ဆက်စပ်မှု)

- လစာတွက်ချက်ရာတွင် **Auto Calculate** မလုပ်လိုပါက၊ \`Performance Tracker\` စာမျက်နှာရှိ **"Sync to Payroll"** ခလုတ်ကို အသုံးပြု၍လည်း တွက်ချက်ပြီးသား CPI အမှတ်များကို ဤ Payroll ဇယားထဲသို့ တိုက်ရိုက် ထည့်သွင်းနိုင်ပါသည်။
- Performance Tracker မှ Sync လုပ်ရန်အတွက် ဤ Payroll Module တွင် သက်ဆိုင်ရာလအတွက် လစာမှတ်တမ်း (Record) ကို ကြိုတင် ဖန်တီးထားရန် လိုအပ်ပါသည်။

---

## 7. အမေးများသော မေးခွန်းများ (FAQ & Troubleshooting)

- **မေး: Export to Excel နှိပ်လို့ မရဘူး။**
  ဖြေ: ဇယားထဲတွင် Data တစ်ခုမှ မရှိသေးလျှင် Export လုပ်၍ မရပါ။
- **မေး: Payment Status က Pending ဖြစ်နေတယ်။**
  ဖြေ: လစာတွက်ချက်ထားပြီးသော်လည်း ငွေမလွှဲရသေးပါက \`Pending\` အဖြစ် ထားရှိနိုင်ပါသည်။ ငွေထုတ်ပေးပြီးပါက \`Paid\` သို့ ပြောင်းလဲပေးရပါမည်။

---

## 8. Employee Lifecycle တွင် ပါဝင်မှု

Payroll & KPI သည် Employee Lifecycle ၏ နောက်ဆုံးနှင့် အရေးအကြီးဆုံး အဆင့်ဖြစ်သော **Compensation & Reward (လစာနှင့် ဆုကြေးပေးခြင်း)** ကဏ္ဍ ဖြစ်ပါသည်။

---

## 9. ဆက်လက်ဖတ်ရှုရန် (Related Modules)

- <a href="#" data-article-title="Performance Tracker" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Performance Tracker</a>
- <a href="#" data-article-title="Daily SOPs" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Daily SOPs</a>
`;

    const enMarkdown = `
# Payroll & KPI

## 1. Payroll & KPI Overview
The **Payroll & KPI** module is a smart compensation system that automatically links employee salaries to their actual performance data (Attendance, SOPs, Peer Voting).
- **Purpose:** To eliminate manual spreadsheet calculations, ensure fair and transparent performance-based pay, and securely store historical payroll records.
- **Who uses it?** Restricted to HR and Admins.

---

## 2. Payroll Screen

The dashboard is divided into three main sections:
1. **Total Paid:** A summary card showing the total monetary value of all processed payrolls.
2. **Payroll Records Table:** A comprehensive grid displaying the Employee, Month, Basic Salary, Allowances, Deductions, Bonus, Net Salary, and Payment Status. Includes an "Export to Excel" feature.
3. **KPI Adjustments Table:** A log of any manually added KPI targets and actual scores.

---

## 3. KPI Settings

Clicking the \`KPI Settings\` button allows Admins to configure the performance formula for the entire company:
- **Target Bonus Percentage (%):** Determines what portion of the base salary is tied to performance. (e.g., If set to 15%, an employee must score 100% KPI to earn this full 15%).
- **Auto Weights:** Allocates percentage weights to data automatically fetched from other modules: Attendance, Punctuality, SOPs, and Peer Voting.
- **Manual Metrics:** HR can add custom metrics (e.g., "Sales Target - 20%") that will require manual input during the payroll generation.

---

## 4. Auto-Calculate Payroll Workflow

When HR clicks \`+ Add Payroll\`:
1. Select the Employee, Month, and confirm the Working Days.
2. Click **"Auto Calculate"**.
3. The system instantly queries the database to fetch the employee's Attendance rate, SOP compliance rate, and Peer Voting score for that specific month.
4. If HR defined Manual Metrics in the settings, they input the score (out of 100) into the provided fields now.
5. The system displays a live **Final KPI Score** breakdown.

---

## 5. Bonus / Deduction Formula

Based on the Final KPI Score, the system automatically calculates the financial impact:
- **Target Bonus Amount** = Basic Salary × Target Bonus %
- **Missed KPI (Deduction):** If the Final KPI is under 100%, a proportionate deduction is applied to the Target Bonus Amount.
- **Over-achievement (Bonus):** If the Final KPI is over 100%, a proportionate bonus is added on top of the Target Bonus Amount.
- **Net Salary Calculation:** The system finalizes the math: \`(Basic + Allowances + Bonus) - Deductions\`.

---

## 6. Relationship with Performance Tracker

- Alternatively, HR can bulk-update payrolls. First, generate the basic payroll records here. Then, navigate to the \`Performance Tracker\` module and click **"Sync to Payroll"**. This will override the KPI scores here with the finalized Comprehensive Performance Index (CPI) scores computed there.

---

## 7. Common Questions / Troubleshooting

- **Q: Why are the Auto Calculate scores showing 0%?**
  A: Ensure the correct Month is selected. If the employee did not check in, did not complete any SOPs, and received no Peer Votes for that month, the scores will be 0.
- **Q: Can I process payroll without calculating KPIs?**
  A: Yes. You can simply fill out the Basic Salary, Allowances, and Deductions fields manually and hit Save without clicking Auto Calculate.

---

## 8. Employee Lifecycle Context

Payroll & KPI represents the **Compensation & Reward** phase of the employee lifecycle, directly linking their daily operational output to their financial compensation.

---

## 9. Related Modules

- <a href="#" data-article-title="Performance Tracker" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Performance Tracker</a>
- <a href="#" data-article-title="Daily SOPs" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Daily SOPs</a>
`;

    const myHtml = marked.parse(myMarkdown);
    const enHtml = marked.parse(enMarkdown);

    // Update in Database
    const { data: article, error } = await supabaseAdmin
      .from('hrm_manual_articles')
      .select('id, title, published_content, draft_content')
      .eq('title', 'Payroll & KPI')
      .single();

    if (error || !article) {
      console.log('Payroll & KPI article not found in Database!');
      return;
    }

    const payload = JSON.stringify({ my: myHtml, en: enHtml });

    await supabaseAdmin.from('hrm_manual_articles').update({
      draft_content: payload,
      published_content: payload,
      status: 'published'
    }).eq('id', article.id);

    console.log('Successfully updated Payroll & KPI article with structured Burmese and English JSON!');

  } catch (err) {
    console.error('Error:', err);
  }
}

run();
