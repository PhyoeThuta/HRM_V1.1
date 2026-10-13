import { supabaseAdmin } from '../lib/supabase.js';
import { marked } from 'marked';

async function run() {
  try {
    console.log('Translating and refining Peer Voting Article...');

    const myMarkdown = `
# Peer Voting (လုပ်ဖော်ကိုင်ဖက် အကဲဖြတ်စနစ်)

## 1. Peer Voting Overview (ယေဘုယျအကြောင်းအရာ)
**Peer Voting (360° Feedback)** စနစ်သည် ဝန်ထမ်းအချင်းချင်း လုပ်ငန်းခွင်အတွင်း ပူးပေါင်းဆောင်ရွက်မှုနှင့် စိတ်ဓာတ်ပိုင်းဆိုင်ရာများကို အပြန်အလှန် အကဲဖြတ် အမှတ်ပေးသော စနစ်ဖြစ်ပါသည်။
- **ဘာအတွက် အသုံးပြုသလဲ?** မန်နေဂျာ သို့မဟုတ် HR မျက်စိအောက်တွင်သာမက၊ လက်တွေ့ အတူတကွ အလုပ်လုပ်နေသော လုပ်ဖော်ကိုင်ဖက်များ၏ အမြင်ကိုပါ ရယူ၍ ပိုမို မျှတသော စွမ်းဆောင်ရည်အမှတ် (Culture Score) တွက်ချက်ရန် ဖြစ်ပါသည်။
- **ဘယ်သူတွေ အသုံးပြုသလဲ?** ဝန်ထမ်းတိုင်းသည် မိမိ၏ Portal မှ တစ်ဆင့် အခြားလုပ်ဖော်ကိုင်ဖက်များကို အကဲဖြတ်နိုင်ပါသည်။ HR နှင့် Admin များက ထိုရလဒ်များကို ခြုံငုံကြည့်ရှုနိုင်ပါသည်။

---

## 2. Peer Voting Form (အမှတ်ပေး ဖွဲ့စည်းပုံ)

ဝန်ထမ်းများသည် ၎င်းတို့၏ **"360-Degree Feedback"** စာမျက်နှာမှ တစ်ဆင့် အောက်ပါအချက် (၅) ချက်ကို (၁ မှတ်မှ ၅ မှတ်အထိ) Slider ရွှေ့၍ အမှတ်ပေးရပါမည်-
1. **Attendance:** ရုံးမှန်မှန်တက်ခြင်း၊ ယုံကြည်အားထားရခြင်း။
2. **Punctuality:** အလုပ်ချိန် တိကျမှု၊ အချိန်မီ ရောက်ရှိမှု။
3. **SOP Adherence:** လုပ်ငန်းစဉ်နှင့် စည်းမျဉ်းများအတိုင်း တိကျစွာ လိုက်နာလုပ်ဆောင်မှု။
4. **Peer Collaboration:** အသင်းအဖွဲ့နှင့် ပူးပေါင်းဆောင်ရွက်မှု၊ ကူညီတတ်မှု။
5. **Initiative:** တာဝန်သိမှု၊ ကိုယ်တိုင် ဦးဆောင်ဖြေရှင်းနိုင်မှု။

(မှတ်ချက် - မှတ်ချက် (Comment) ကို ဆန္ဒရှိပါက အကြံပြုစာ ရေးသားနိုင်ပါသည်။ ဥပမာ - မည်သည့်အချက်ကို ကောင်းမွန်စွာ လုပ်ဆောင်နေသည်၊ မည်သည့်အချက်ကို ပြင်ဆင်သင့်သည်)။

---

## 3. အမှတ်ပေးခြင်း စည်းမျဉ်းများ (Rules & Restrictions)

- **မိမိကိုယ်ကို အမှတ်ပေးခြင်း (Self-Voting):** စနစ်မှ ခွင့်မပြုပါ။ ကိုယ်တိုင်ရွေးချယ်၍ မရပါ။
- **တစ်လ တစ်ကြိမ် (Once Per Month):** လုပ်ဖော်ကိုင်ဖက် တစ်ဦးတည်းအပေါ် တစ်လလျှင် တစ်ကြိမ်သာ အမှတ်ပေးခွင့် ရှိပါသည်။ (ဥပမာ - ဝန်ထမ်း A ကို ယခုလအတွက် အမှတ်ပေးပြီးပါက ထပ်မံပေး၍ မရတော့ပါ)။

---

## 4. ရလဒ်များ ထွက်ပေါ်လာခြင်း (Results & Calculation)

- စနစ်သည် အထက်ပါ ကဏ္ဍ (၅) ရပ်၏ အမှတ်များကို ပေါင်း၍ ပျမ်းမျှ (Average) ကို ၅ မှတ်ပြည့်ဖြင့် တွက်ချက် မှတ်တမ်းတင်ပါသည်။
- ထိုအမှတ်သည် ဝန်ထမ်း၏ **Performance Tracker** သို့ အလိုအလျောက် ရောက်ရှိသွားမည် ဖြစ်ပါသည်။

---

## 5. Peer Voting ↔ Performance Tracker (စွမ်းဆောင်ရည်နှင့် ဆက်စပ်မှု)

- Peer Voting ရလဒ်များသည် \`Performance Tracker\` ၏ **Culture Score** ထဲသို့ (25% Weight ဖြင့်) တိုက်ရိုက် သွားရောက် ပေါင်းစပ်ပါသည်။
- အကယ်၍ ဝန်ထမ်းတစ်ဦးကို မည်သူကမှ အမှတ်မပေးထားပါက (Peer Voting မရှိသေးပါက) စနစ်သည် Culture Score ကို (Attendance 67% + Punctuality 33%) ဖြင့်သာ အလိုအလျောက် အစားထိုး တွက်ချက်ပေးမည် ဖြစ်ပါသည်။

---

## 6. လက်တွေ့ အသုံးပြုမှု (Practical Workflows)

1. **ဝန်ထမ်းများ:** လကုန်ခါနီးတိုင်း Portal သို့ဝင်၍ မိမိနှင့် တွဲဖက် အလုပ်လုပ်ခဲ့သော လုပ်ဖော်ကိုင်ဖက်များကို အမှတ်ပေး အကဲဖြတ်ပါသည်။
2. **HR/Admin:** Admin Dashboard ရှိ Peer Voting စာမျက်နှာတွင် မည်သူက မည်သူ့ကို မည်မျှ အမှတ်ပေးထားသည် နှင့် ရေးသားထားသော မှတ်ချက်များကို စစ်ဆေး ကြည့်ရှုနိုင်ပါသည်။

---

## 7. အမေးများသော မေးခွန်းများ (FAQ & Troubleshooting)

- **မေး: အမှတ်ပေးလိုက်တာကို သက်ဆိုင်ရာ ဝန်ထမ်းက သိနိုင်လား?**
  ဖြေ: ထိုဝန်ထမ်းသည် ၎င်း၏ Performance ဇယားတွင် "Peer Score: ?%" အနေဖြင့် ပျမ်းမျှအမှတ် ကိုသာ မြင်ရမည်ဖြစ်ပြီး၊ မည်သူက မည်မျှပေးသည် ဟူသော အသေးစိတ်ကို HR နှင့် Admin များသာ ကြည့်ရှုခွင့် ရှိပါသည်။

---

## 8. Employee Lifecycle တွင် ပါဝင်မှု

Peer Voting သည် ဝန်ထမ်း၏ လုပ်ငန်းခွင် ယဉ်ကျေးမှု (Company Culture) တွင် အံဝင်ခွင်ကျ ဖြစ်မှုနှင့် လုပ်ဖော်ကိုင်ဖက်များအကြား ဆက်ဆံရေးကို ဖော်ပြသော **Performance Review** အစိတ်အပိုင်း တစ်ခု ဖြစ်ပါသည်။

---

## 9. ဆက်လက်ဖတ်ရှုရန် (Related Modules)

- <a href="#" data-article-title="Performance Tracker" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Performance Tracker</a>
- <a href="#" data-article-title="Daily SOPs" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Daily SOPs</a>
`;

    const enMarkdown = `
# Peer Voting

## 1. Peer Voting Overview
The **Peer Voting (360° Feedback)** module allows employees to anonymously evaluate their colleagues' performance, work ethic, and teamwork.
- **Purpose:** To ensure that performance evaluations are not solely top-down. By incorporating peer feedback, HR gains a holistic understanding of how an employee interacts with their team on a daily basis.
- **Who uses it?** All active employees can submit votes via their portal. HR and Admins can view the raw results and comments.

---

## 2. Peer Voting Form

Employees access the **"360-Degree Feedback"** screen on their portal. They must select a colleague from a dropdown menu and evaluate them on a scale of 1 to 5 across five parameters:
1. **Attendance:** Is the colleague present and reliable?
2. **Punctuality:** Do they arrive and complete tasks on time?
3. **SOP Adherence:** Do they strictly follow standard operating procedures?
4. **Peer Collaboration:** Are they a good team player?
5. **Initiative:** Are they proactive and willing to lead?

*(There is also an optional Comment box for constructive feedback).*

---

## 3. Rules & Restrictions

To maintain the integrity of the voting system, the following logic is strictly enforced:
- **No Self-Voting:** Employees are hidden from their own dropdown list. They cannot vote for themselves.
- **Once Per Month Rule:** An employee can only evaluate a specific colleague **once per calendar month**. Attempting to vote for the same person twice in one month will result in an error message.

---

## 4. Results & Calculation

- When submitted, the system averages the five slider values into a single integer score (out of 5).
- A notification may be sent to the nominee, and the score is securely logged in the database.

---

## 5. Relationship with Performance Tracker

- The average of all Peer Votes received by an employee in a given month dynamically feeds into the \`Performance Tracker\` module.
- It specifically accounts for **25% of the employee's Culture Score**.
- *(Fallback: If an employee receives zero peer votes in a month, the Performance Tracker automatically redistributes the weight to Attendance and Punctuality so their overall score isn't penalized).*

---

## 6. Practical Workflows

1. **Employees:** At the end of the month, employees log in and submit evaluations for 2 or 3 team members they worked closely with.
2. **HR / Admins:** HR reviews the Peer Voting records in the Admin Dashboard to check for abusive language in comments or to identify employees who are exceptionally helpful to their peers.

---

## 7. Common Questions / Troubleshooting

- **Q: Are votes truly anonymous?**
  A: To the person receiving the vote, yes. They only see their aggregated "Peer Score" percentage in their Performance Tracker scorecard. However, HR and Admins can see exactly who voted for whom in the backend to prevent abuse.
- **Q: Can a vote be edited?**
  A: No. Once a vote is submitted, it is locked into the system for that month.

---

## 8. Employee Lifecycle Context

Peer Voting is a critical component of the **Performance Review** and **Culture** phases of the employee lifecycle, helping HR identify future leaders and potential toxic team dynamics early on.

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
      .eq('title', 'Peer Voting')
      .single();

    if (error || !article) {
      console.log('Peer Voting article not found in Database!');
      return;
    }

    const payload = JSON.stringify({ my: myHtml, en: enHtml });

    await supabaseAdmin.from('hrm_manual_articles').update({
      draft_content: payload,
      published_content: payload,
      status: 'published'
    }).eq('id', article.id);

    console.log('Successfully updated Peer Voting article with structured Burmese and English JSON!');

  } catch (err) {
    console.error('Error:', err);
  }
}

run();
