import { supabaseAdmin } from '../lib/supabase.js';
import { marked } from 'marked';

async function run() {
  console.log('Seeding CRM and Portal manual articles...');

  const categories = ['CRM (Customer Relationship Management)', 'EMPLOYEE PORTAL (ဝန်ထမ်းပေါ်တယ်)', 'ADMINISTRATION (အက်ဒမင်)'];
  const catMap = {};

  for (let i = 0; i < categories.length; i++) {
    const { data: existingCat } = await supabaseAdmin.from('hrm_manual_categories').select('id').eq('name', categories[i]).single();
    if (existingCat) {
      catMap[categories[i]] = existingCat.id;
    } else {
      const { data, error } = await supabaseAdmin.from('hrm_manual_categories').insert({ name: categories[i], order_index: 10 + i }).select().single();
      if (error) console.error(error);
      catMap[categories[i]] = data.id;
    }
  }

  const articles = [
    // CRM
    {
      cat: 'CRM (Customer Relationship Management)', title: 'CRM Dashboard',
      en: `
# CRM Dashboard
## Overview
The CRM Dashboard provides a top-level view of sales, customers, and leads.

## How to use
1. Open CRM Dashboard.
2. View key metrics like Total Customers, Total Leads, and Recent Inquiries.
3. Click on any metric to view detailed reports.
      `,
      my: `
# CRM Dashboard (CRM ပင်မစာမျက်နှာ)
## အကျဉ်းချုပ်
CRM Dashboard သည် အရောင်းစာရင်း၊ ဖောက်သည်များနှင့် Lead များကို အပေါ်စီးမှ ကြည့်ရှုနိုင်သော နေရာဖြစ်ပါသည်။

## အသုံးပြုနည်း
၁။ CRM Dashboard ကိုဖွင့်ပါ။
၂။ Total Customers, Total Leads ကဲ့သို့သော အဓိက အချက်အလက်များကို ကြည့်ရှုပါ။
၃။ အသေးစိတ်ကြည့်လိုပါက သက်ဆိုင်ရာ ကတ် (Card) ကိုနှိပ်ပါ။
      `
    },
    {
      cat: 'CRM (Customer Relationship Management)', title: 'Customers',
      en: `
# Customers Management
## Overview
Manage all your enrolled customers and their profiles.

## How to add a customer
1. Open Customers.
2. Click Add Customer.
3. Fill in the customer details (Name, Email, Phone, Address).
4. Save the customer record.
      `,
      my: `
# Customers Management (ဖောက်သည် စီမံခန့်ခွဲမှု)
## အကျဉ်းချုပ်
ကုမ္ပဏီ၏ ဖောက်သည်များအားလုံးကို စာရင်းသွင်း သိမ်းဆည်းရန် ဖြစ်ပါသည်။

## ဖောက်သည်အသစ် ထည့်သွင်းနည်း
၁။ Customers ကိုဖွင့်ပါ။
၂။ Add Customer ကိုနှိပ်ပါ။
၃။ ဖောက်သည်၏ အချက်အလက်များ (အမည်၊ အီးမေးလ်၊ ဖုန်း၊ လိပ်စာ) ကိုဖြည့်ပါ။
၄။ Save ကိုနှိပ်၍ သိမ်းဆည်းပါ။
      `
    },
    {
      cat: 'CRM (Customer Relationship Management)', title: 'Leads Pipeline',
      en: `
# Leads Pipeline
## Overview
Track potential customers (Leads) through various stages from Inquiry to Conversion.

## How to move a lead
1. Open Leads Pipeline.
2. Drag and drop the lead card to the next stage (e.g. from New to Contacted).
3. Add comments or updates to the lead profile.
      `,
      my: `
# Leads Pipeline (Lead အဆင့်ဆင့် လုပ်ငန်းစဉ်)
## အကျဉ်းချုပ်
အလားအလာရှိသော ဖောက်သည်များ (Leads) ၏ အခြေအနေကို အဆင့်လိုက် စောင့်ကြည့်ရန် ဖြစ်ပါသည်။

## Lead အဆင့်ပြောင်းလဲနည်း
၁။ Leads Pipeline ကိုဖွင့်ပါ။
၂။ Lead ကတ်ကို ဖိဆွဲ၍ (Drag and drop) နောက်တစ်ဆင့်သို့ ပြောင်းပါ။ (ဥပမာ - New မှ Contacted သို့)
၃။ လိုအပ်ပါက မှတ်ချက်များ ထည့်သွင်းပါ။
      `
    },
    // Portal
    {
      cat: 'EMPLOYEE PORTAL (ဝန်ထမ်းပေါ်တယ်)', title: 'My Portal Dashboard',
      en: `
# My Portal Dashboard
## Overview
Your personal space to view attendance, leaves, payslips, and daily tasks.

## Features
- **Quick Check-In**: Start your day by checking in.
- **My Schedule**: View your assigned shifts and schedules.
- **Announcements**: Read the latest company news.
      `,
      my: `
# My Portal Dashboard (ဝန်ထမ်းပင်မစာမျက်နှာ)
## အကျဉ်းချုပ်
ဝန်ထမ်းများအနေဖြင့် မိမိ၏ ရုံးတက်မှတ်တမ်း၊ ခွင့်၊ လစာပြေစာနှင့် နေ့စဉ်လုပ်ဆောင်ရမည့်အရာများကို ကြည့်ရှုနိုင်သော နေရာဖြစ်ပါသည်။

## ပါဝင်သောအရာများ
- **အမြန် ရုံးတက်စာရင်းသွင်းခြင်း (Quick Check-In)**: ရုံးတက်ရန် နှိပ်ပါ။
- **မိမိ၏ အချိန်ဇယား (My Schedule)**: သတ်မှတ်ထားသော အလုပ်ချိန်များကို ကြည့်ပါ။
- **ကြေညာချက်များ (Announcements)**: ကုမ္ပဏီမှ ထုတ်ပြန်ချက်များကို ဖတ်ရှုပါ။
      `
    },
    {
      cat: 'EMPLOYEE PORTAL (ဝန်ထမ်းပေါ်တယ်)', title: 'Photo & QR Check-In',
      en: `
# Check-In (Photo & QR)
## Overview
Record your daily attendance using the camera or scanning a QR code provided by HR.

## How to use Photo Check-In
1. Open Photo Check-In.
2. Allow camera access.
3. Snap a photo to Check In or Check Out.

## How to use QR Check-In
1. Open QR Scanner.
2. Scan the HR-provided QR code.
3. Your attendance is automatically recorded.
      `,
      my: `
# ရုံးတက်စာရင်းသွင်းခြင်း (ဓာတ်ပုံ နှင့် QR)
## အကျဉ်းချုပ်
မိမိ၏ နေ့စဉ် ရုံးတက်/ဆင်း မှတ်တမ်းကို ကင်မရာ (သို့) QR ကုဒ် အသုံးပြု၍ မှတ်သားနိုင်ပါသည်။

## Photo Check-In အသုံးပြုနည်း
၁။ Photo Check-In ကိုဖွင့်ပါ။
၂။ ကင်မရာအသုံးပြုခွင့် (Allow Camera) ပေးပါ။
၃။ ဓာတ်ပုံရိုက်၍ Check In (သို့) Check Out ပြုလုပ်ပါ။

## QR Check-In အသုံးပြုနည်း
၁။ QR Scanner ကိုဖွင့်ပါ။
၂။ HR မှ ပေးထားသော QR ကုဒ်ကို ဖတ် (Scan) ပါ။
၃။ ရုံးတက်စာရင်း အလိုအလျောက် ဝင်သွားပါမည်။
      `
    },
    {
      cat: 'EMPLOYEE PORTAL (ဝန်ထမ်းပေါ်တယ်)', title: 'My Leaves',
      en: `
# My Leaves
## Overview
View your leave balances and submit new leave requests.

## How to request leave
1. Open My Leaves.
2. Click Request Leave.
3. Select Leave Type, Start Date, and End Date.
4. Provide a reason and submit.
      `,
      my: `
# မိမိ၏ ခွင့်စာရင်း (My Leaves)
## အကျဉ်းချုပ်
မိမိ၏ ရနိုင်သော ခွင့်လက်ကျန်များကို ကြည့်ရှုခြင်းနှင့် ခွင့်အသစ်တင်ခြင်းများ ပြုလုပ်နိုင်ပါသည်။

## ခွင့်တင်နည်း
၁။ My Leaves ကိုဖွင့်ပါ။
၂။ Request Leave ကိုနှိပ်ပါ။
၃။ ခွင့်အမျိုးအစား၊ စတင်မည့်ရက် နှင့် ပြီးဆုံးမည့်ရက် ကို ရွေးချယ်ပါ။
၄။ အကြောင်းပြချက်ရေး၍ Submit ကိုနှိပ်ပါ။
      `
    },
    // Admin
    {
      cat: 'ADMINISTRATION (အက်ဒမင်)', title: 'Executive Overview',
      en: `
# Executive Overview
## Overview
High-level boss dashboard showing company-wide statistics and financial summaries.

## Features
- Real-time attendance rate
- Monthly payroll burn rate
- Quick alerts for critical issues
      `,
      my: `
# အမှုဆောင် အကျဉ်းချုပ် (Executive Overview)
## အကျဉ်းချုပ်
ကုမ္ပဏီတစ်ခုလုံး၏ အခြေအနေနှင့် ဘဏ္ဍာရေး အနှစ်ချုပ်များကို ကြည့်ရှုနိုင်သော Boss/Admin သီးသန့် စာမျက်နှာဖြစ်ပါသည်။

## ပါဝင်သောအရာများ
- အချိန်နှင့်တစ်ပြေးညီ ရုံးတက်ရောက်မှု ရာခိုင်နှုန်း
- လစဉ် လစာသုံးစွဲမှု အခြေအနေ (Payroll burn rate)
- အရေးကြီးသော ကိစ္စရပ်များအတွက် သတိပေးချက်များ (Alerts)
      `
    }
  ];

  let orderIndex = 0;
  for (const art of articles) {
    const enHtml = marked.parse(art.en);
    const myHtml = marked.parse(art.my);
    const payload = JSON.stringify({ en: enHtml, my: myHtml });

    const { data: existingArt } = await supabaseAdmin.from('hrm_manual_articles').select('id').eq('title', art.title).single();

    if (existingArt) {
      await supabaseAdmin.from('hrm_manual_articles').update({
        draft_content: payload,
        published_content: payload,
        status: 'published',
        category_id: catMap[art.cat],
        order_index: orderIndex++
      }).eq('id', existingArt.id);
    } else {
      await supabaseAdmin.from('hrm_manual_articles').insert({
        title: art.title,
        draft_content: payload,
        published_content: payload,
        status: 'published',
        category_id: catMap[art.cat],
        order_index: orderIndex++
      });
    }
    console.log(`Saved: ${art.title}`);
  }
}

run();
