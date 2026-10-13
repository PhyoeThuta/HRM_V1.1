import { supabaseAdmin } from '../lib/supabase.js';
import { marked } from 'marked';

async function run() {
  try {
    console.log('Translating and refining Birthdays Article...');

    const myMarkdown = `
# Birthdays (မွေးနေ့များ)

## 1. Birthdays Overview (ယေဘုယျအကြောင်းအရာ)
**Birthdays** စာမျက်နှာသည် ကုမ္ပဏီအတွင်းရှိ ဝန်ထမ်းများအားလုံး၏ မွေးနေ့ရက်မြတ်များကို လအလိုက် (Month-by-month) လွယ်ကူစွာ ကြည့်ရှုနိုင်သော နေရာဖြစ်ပါသည်။ 

## 2. Purpose (ရည်ရွယ်ချက်)
- လုပ်ဖော်ကိုင်ဖက် အချင်းချင်း မွေးနေ့များ သိရှိပြီး ဆုတောင်းပေးနိုင်ရန်။
- HR မှ လစဉ် မွေးနေ့ရှင်များစာရင်းကို ကြိုတင် သိရှိ၍ လိုအပ်သော အစီအစဉ်များ (ဥပမာ - မွေးနေ့ကိတ်ခွဲခြင်း) ပြင်ဆင်နိုင်ရန်။

---

## 3. Birthday Screen / Calendar / List (စာမျက်နှာ ဖွဲ့စည်းပုံ)

စာမျက်နှာတွင် အဓိကအားဖြင့် **လ (Month) ခလုတ်များ** (ဇန်နဝါရီ မှ ဒီဇင်ဘာ အထိ) ပါဝင်ပါသည်။
- ပုံသေအားဖြင့် လက်ရှိကျရောက်နေသော လ (Current Month) ကို အလိုအလျောက် ရွေးချယ်ပြသပေးထားပါမည်။
- မိမိကြည့်ရှုလိုသော လကို နှိပ်၍ ထိုလအတွင်း မွေးနေ့ကျရောက်သော ဝန်ထမ်းများ စာရင်းကို ကြည့်ရှုနိုင်ပါသည်။

---

## 4. Birthday Information (ပါဝင်သော အချက်အလက်များ)

မွေးနေ့ရှင် ကတ် (Card) တစ်ခုစီတွင် အောက်ပါ အချက်အလက်များကို မြင်တွေ့ရပါမည်-
- ဝန်ထမ်း၏ အမည်အပြည့်အစုံ (Full Name)
- ဝန်ထမ်း၏ အမည် အတိုကောက် (Avatar Initials)
- မွေးနေ့ (လ နှင့် ရက်) - *မှတ်ချက်။ ။ မွေးသက္ကရာဇ် (ခုနှစ်) ကို ဖော်ပြထားခြင်း မရှိပါ။*

---

## 5. Employee Birthday Data (အချက်အလက် ရယူခြင်း)

- မွေးနေ့ အချက်အလက်များကို သီးသန့် ထည့်သွင်းရန် မလိုပါ။ စနစ်သည် \`Employees\` Module တွင် ဝန်ထမ်းအသစ် စာရင်းသွင်းစဉ်က ထည့်သွင်းခဲ့သော \`Date of Birth\` အချက်အလက်ကို အလိုအလျောက် ရယူပြသပေးခြင်း ဖြစ်ပါသည်။

---

## 6. Search / Filter 

- လက်ရှိစနစ်တွင် အမည်ဖြင့် ရှာဖွေသော (Search) စနစ် မပါဝင်ပါ။ "လ (Month)" ခလုတ်များကို နှိပ်၍သာ စစ်ထုတ် (Filter) နိုင်ပါသည်။

---

## 7. Monthly / Upcoming Birthday Behavior 

- စနစ်သည် မွေးနေ့များကို လ (Month) အလိုက်သာ ခွဲခြားပြသပေးပြီး၊ "ယနေ့ မွေးနေ့ရှင်" (Today's Birthday) သို့မဟုတ် "မကြာမီ ကျရောက်မည့် မွေးနေ့" (Upcoming) ဟူ၍ သီးသန့် Notification သတိပေးချက်များ ပေးပို့ခြင်း မရှိပါ။

---

## 8. Birthday ↔ Employees

- Birthdays Module သည် \`Employees\` ဇယားမှ အချက်အလက်ကိုသာ (Read-only) အဖြစ် ရယူအသုံးပြုပါသည်။

---

## 9. Birthday ↔ Employee Details

- ဝန်ထမ်းတစ်ဦး၏ မွေးနေ့ မှားယွင်းနေပါက ဤ Birthdays စာမျက်နှာတွင် ပြင်ဆင်၍ မရပါ။ HR သည် \`Employee Details\` စာမျက်နှာသို့ သွားရောက်၍ Date of Birth ကို အသစ် ပြင်ဆင် (Edit) ပေးရပါမည်။

---

## 10. Practical Workflows (လက်တွေ့ အသုံးပြုမှု)

1. လဆန်းပိုင်းတွင် HR သည် Birthdays စာမျက်နှာသို့ ဝင်ရောက်၍ လက်ရှိလကို ရွေးချယ်ပါသည်။
2. ထိုလအတွင်း မွေးနေ့ကျရောက်မည့် ဝန်ထမ်းများ စာရင်းကို မှတ်သား၍ ကုမ္ပဏီ၏ မွေးနေ့ အစီအစဉ်များအတွက် ပြင်ဆင်ပါသည်။

---

## 11. Real-World HR Scenarios (လက်တွေ့ အခြေအနေများ)

- **ဝန်ထမ်းတစ်ဦးမှ ၎င်း၏ မွေးနေ့ မပေါ်ကြောင်း ပြောလာခြင်း:** HR သည် Employee Details သို့ သွား၍ ထိုဝန်ထမ်း၏ Date of Birth ထည့်သွင်းထားခြင်း ရှိမရှိ သို့မဟုတ် မှားယွင်းနေခြင်း ရှိမရှိ စစ်ဆေးရပါမည်။

---

## 12. Common Questions / Troubleshooting

- **မေး: မွေးနေ့ရှင်တွေကို စနစ်ကနေ အလိုအလျောက် Email (သို့) Notification ပို့ပေးလား?**
  ဖြေ: မပို့ပေးပါ။ လက်ရှိစနစ်သည် ကြည့်ရှုရန် သက်သက်သာ (View-only) ဖြစ်ပါသည်။
- **မေး: ဝန်ထမ်းရဲ့ အသက် (Age) ကိုပါ ပြပေးလား?**
  ဖြေ: မပြပါ။ ကိုယ်ရေးကိုယ်တာ အချက်အလက်ဖြစ်သဖြင့် လ နှင့် ရက် ကိုသာ ဖော်ပြပေးပါသည်။

---

## 13. Important Notes / Limitations

- မွေးနေ့ အလိုအလျောက် ဆုတောင်းပေးခြင်း (Automated Messages) နှင့် မွေးနေ့ ဆုကြေး (Birthday Rewards) များ စနစ်အတွင်း ထည့်သွင်းထားခြင်း **မရှိသေးပါ**။

---

## 14. Employee Lifecycle Context

Birthdays သည် ဝန်ထမ်းများ၏ လုပ်ငန်းခွင် ယဉ်ကျေးမှု (Company Culture) နှင့် အချင်းချင်း ရင်းနှီးကျွမ်းဝင်မှု (Employee Engagement) ကို မြှင့်တင်ပေးသော အစိတ်အပိုင်း တစ်ခု ဖြစ်ပါသည်။

---

## 15. Related Modules (ဆက်စပ်သော အခန်းများ)

- <a href="#" data-article-title="Employees" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Employees</a>
- <a href="#" data-article-title="Employee Details" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Employee Details</a>
`;

    const enMarkdown = `
# Birthdays

## 1. Birthdays Overview
The **Birthdays** module provides a visually appealing, month-by-month directory of all active employees' birthdays within the company.

## 2. Purpose
- To foster employee engagement by allowing team members to know and celebrate each other's birthdays.
- To help HR easily identify upcoming birthdays for a given month to prepare any cultural events (e.g., monthly cake cutting).

---

## 3. Birthday Screen / Calendar / List

The primary navigation of this screen relies on **Month Tabs** (January to December) located at the top.
- By default, the system automatically selects and displays the current calendar month.
- Users can click on any month tab to view the birthdays falling in that specific month.

---

## 4. Birthday Information

Each birthday card displays the following information:
- Employee's Full Name
- Employee's Avatar Initials
- Birthday (Month and Day) - *Note: The birth year is intentionally hidden to protect employee privacy.*

---

## 5. Employee Birthday Data

- HR does not need to input data directly into this module. The system automatically pulls the \`Date of Birth\` field from the core \`Employees\` database, which was entered during the employee's onboarding.

---

## 6. Search / Filter

- There is currently no text-based search feature. Filtering is done exclusively by selecting the desired Month tab.

---

## 7. Monthly / Upcoming Birthday Behavior

- The system strictly groups birthdays by month. It does not send out notifications for "Today's Birthdays" or "Upcoming Birthdays in 7 Days". 

---

## 8. Birthday ↔ Employees

- This module acts as a read-only presentation layer for the data stored in the central \`Employees\` table.

---

## 9. Birthday ↔ Employee Details

- If an employee's birthday is missing or incorrect on this screen, it cannot be fixed here. HR must navigate to the **Employee Details** module, click Edit, and update the employee's Date of Birth there. The change will immediately reflect on the Birthdays screen.

---

## 10. Practical Workflows

1. At the beginning of the month, HR navigates to the Birthdays screen.
2. They select the current month and review the list of birthday babies.
3. HR uses this list to plan the monthly birthday celebrations or announcements externally.

---

## 11. Real-World HR Scenarios

- **An employee complains their birthday isn't showing up:** HR checks their **Employee Details** profile and realizes the Date of Birth field was left blank during Onboarding. HR updates the field, and the employee's card instantly appears in the correct month tab.

---

## 12. Common Questions / Troubleshooting

- **Q: Does the system automatically send birthday emails or portal notifications?**
  A: No. The Birthdays module is currently a passive, view-only directory.
- **Q: Can we see how old an employee is turning?**
  A: No. The system strictly hides the birth year to maintain privacy and prevent age discrimination.

---

## 13. Important Notes / Limitations

- There are **no** automated messages, email integrations, or birthday reward/voucher systems implemented at this time. 

---

## 14. Employee Lifecycle Context

While not a core operational tool, the Birthdays module plays a vital role in the **Employee Engagement & Culture** phase of the employee lifecycle, helping to maintain a positive and inclusive workplace.

---

## 15. Related Modules

- <a href="#" data-article-title="Employees" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Employees</a>
- <a href="#" data-article-title="Employee Details" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Employee Details</a>
`;

    const myHtml = marked.parse(myMarkdown);
    const enHtml = marked.parse(enMarkdown);

    // Update in Database
    const { data: article, error } = await supabaseAdmin
      .from('hrm_manual_articles')
      .select('id, title, published_content, draft_content')
      .eq('title', 'Birthdays')
      .single();

    if (error || !article) {
      console.log('Birthdays article not found in Database!');
      return;
    }

    const payload = JSON.stringify({ my: myHtml, en: enHtml });

    await supabaseAdmin.from('hrm_manual_articles').update({
      draft_content: payload,
      published_content: payload,
      status: 'published'
    }).eq('id', article.id);

    console.log('Successfully updated Birthdays article with structured Burmese and English JSON!');

  } catch (err) {
    console.error('Error:', err);
  }
}

run();
