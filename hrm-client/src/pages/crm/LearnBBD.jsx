import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import toast from 'react-hot-toast';

export default function LearnBBD() {
  const navigate = useNavigate();
  const [copiedIndex, setCopiedIndex] = useState(null);

  const sampleCustomerId = 8;
  const todayStr = new Date().toISOString().split('T')[0];
  const baseUrl = window.location.origin;

  const formsList = [
    {
      id: 'onboarding',
      title: '1. Customer Onboarding Enrollment Form',
      subtitle: 'ပိုက်ဆံလွှဲပြီးလျှင် ကျန်းမာရေး၊ Target Weight နှင့် Diet Preference များ ဖြည့်ခိုင်းသည့် Form',
      badge: 'အသစ်စတင်ချိန်',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      icon: '📝',
      linkPath: `/enroll`,
      description: 'Customer ဘက်မှ ပိုက်ဆံလွှဲပြီးပါက Admin သို့မဟုတ် AI Bot မှ Customer ထံသို့ ပို့ပေးရသော Form ဖြစ်ပါသည်။ အသက်၊ ကိုယ်အလေးချိန်၊ ပန်းတိုင်၊ ရောဂါအခံနှင့် မတည့်သော အစားအသောက်များကို အသေးစိတ် ဖြည့်စွက်ပေးရပါသည်။',
      triggerTiming: 'Payment Confirm ဖြစ်ပြီးသည်နှင့် ချက်ချင်း (၁ ကြိမ်သာ)',
      destination: 'crm.customers, crm.customer_health, crm.customer_lifestyle',
      colorGradient: 'from-emerald-500/20 to-teal-500/20'
    },
    {
      id: 'general-request-complaint',
      title: '2. Daily Post-Delivery Request & Complaint Form',
      subtitle: 'နေ့စဉ် Delivery ပို့ပြီးတိုင်း အဆင်မပြေမှု၊ အချိန်နောက်ကျမှု၊ General Request / Complaint ပေးရန် Form',
      badge: 'နေ့စဉ် Delivery အပြီး',
      badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      icon: '🚚',
      linkPath: `/feedback/${sampleCustomerId}`,
      description: 'နေ့စဉ် Delivery ပို့ဆောင်ပြီးချိန်တွင် Customer များ ပို့ဆောင်ရေး သို့မဟုတ် ထုပ်ပိုးမှုနှင့် ပတ်သက်၍ အဆင်မပြေသည်များ၊ အထွေထွေ Complaint သို့မဟုတ် အထွေထွေ တောင်းဆိုမှု (General Request/Complaint) များကို ချက်ချင်း အသိပေးနိုင်သော Form ဖြစ်ပါသည်။',
      triggerTiming: 'နေ့စဉ် Delivery ရောက်ရှိပြီးချိန်တွင် မက်ဆေ့ခ်ျနှင့်အတူ ချက်ချင်း ပို့ပေးရန်',
      destination: 'crm.feedbacks (Customer Care & Kitchen alert)',
      colorGradient: 'from-rose-500/20 to-pink-500/20'
    },
    {
      id: 'daily-night-feedback',
      title: '3. Nightly Meal Feedback & Taste Adjustment Form',
      subtitle: 'နေ့စဉ် ည ၉ နာရီတွင် ဒီနေ့စားခဲ့သော ဟင်းများ၏ အရသာ၊ အငံ/အစပ် ပြင်ဆင်ရန် အကြံပြုချက် ပေးသည့် Form',
      badge: 'နေ့စဉ် ည ၉:၀၀ နာရီ',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      icon: '🍛',
      linkPath: `/daily-feedback/${sampleCustomerId}?date=${todayStr}`,
      description: 'နေ့စဉ် ည ၉:၀၀ နာရီတွင် ဒီနေ့ စားသုံးခဲ့သော ဟင်းလျာများအတွက် 1-5 Stars Rating ပေးရန်နှင့် နောက်နေ့အတွက် အရသာ (ဥပမာ- ဆားငံလျှော့ပေးရန်၊ အစပ်လျှော့ပေးရန်) ပြင်ဆင်ချက် ရေးသားနိုင်သော Form ဖြစ်ပါသည်။ ⚠️ [အရေးကြီး စည်းမျဉ်း]: ဟင်းလျာအမျိုးအစား ပြောင်းလဲပေးရန် (Dish Swap/Change) တောင်းဆို၍ မရပါ။ အရသာနှင့် အငံ/အစပ် သာ လျှော့/တိုး တောင်းဆိုနိုင်ပါသည်။',
      triggerTiming: 'နေ့စဉ် ည ၉:၀၀ နာရီ Auto ReminderNoti ထွက်ချိန်',
      destination: 'crm.feedbacks (Kitchen Dashboard သို့ တိုက်ရိုက် ရောက်ရှိ)',
      colorGradient: 'from-amber-500/20 to-orange-500/20'
    },
    {
      id: 'monthly',
      title: '4. 1-Month Milestone Review & Dynamic Certificate Form',
      subtitle: 'ရက် ၃၀ ပြည့်တိုင်း Target Weight ထိမထိ စစ်ဆေးပေးပြီး Dynamic e-Certificate ထုတ်ပေးကာ Package သက်တမ်းတိုး Noti ပို့ပေးသည့် Form',
      badge: 'ရက် ၃၀ ပြည့်တိုင်း',
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      icon: '🏆',
      linkPath: `/monthly-review/${sampleCustomerId}`,
      description: 'Customer သည် ၁ လ (ရက် ၃၀) ပြည့်သွားချိန်တွင် Target Weight အတိုင်း ဖြစ်မဖြစ် ပြန်လည် ဆန်းစစ်ပေးခြင်း၊ Weight Loss Calculator ဖြင့် ဝိတ်ကျမှု ရာခိုင်နှုန်း တွက်ချက်ပေးခြင်း၊ **Dynamic VIP e-Certificate** ထုတ်ပေးခြင်းနှင့် Package သက်တမ်း ဆက်တိုးရန် / မတိုးရန် အရေးကြီး Noti ပို့ပေးသော စနစ်ဖြစ်ပါသည်။',
      triggerTiming: 'Package စတင်သည်မှ ရက် ၃၀ ပြည့်သွားချိန်တိုင်း (သို့မဟုတ် Admin မှ Manual ပို့ချိန်)',
      destination: 'crm.feedbacks & Customer Welcome Dossier',
      colorGradient: 'from-purple-500/20 to-pink-500/20'
    },
    {
      id: 'churn-exit',
      title: '5. Churn Customer Exit Survey Form',
      subtitle: 'မဝယ်တော့သော / သက်တမ်းကုန်သွားသော Churn Customer များထံမှ မဝယ်တော့သည့် အကြောင်းရင်း မေးမြန်းသည့် Form',
      badge: 'Churn Customer Profile',
      badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      icon: '🛑',
      linkPath: `/churn-exit/${sampleCustomerId}`,
      description: 'Churn customer များ (ဥပမာ- Hlyam ကဲ့သို့ မဝယ်တော့သည့် Customer များ) ၏ Profile တွင် သီးသန့် ပေါ်လာသော Form ဖြစ်ပါသည်။ ဘာကြောင့် ဆက်မဝယ်ဖြစ်တာလဲဆိုသည့် အကြောင်းအရင်းများ (ပြောင်းရွှေ့သွားခြင်း၊ အရသာ/ဝန်ဆောင်မှု၊ စျေးနှုန်း၊ ခရီးသွားခြင်း၊ ကျန်းမာရေးပြောင်းလဲခြင်း) ကို ကောက်ယူပေးပြီး Report & Analytics တွင် Auto-aggregate လုပ်ပေးပါသည်။',
      triggerTiming: 'Customer သက်တမ်းကုန်သွားချိန် သို့မဟုတ် Status: Churned / Inactive ဖြစ်ချိန်',
      destination: 'crm.feedbacks ([CHURN_EXIT] Tag) & Report & Analytics',
      colorGradient: 'from-rose-500/20 to-red-500/20'
    },
    {
      id: 'referral',
      title: '6. Customer Referral Program Form',
      subtitle: 'မိတ်ဆွေ/သူငယ်ချင်းများအား BBD Dietary Plan သို့ ညွှန်းဆိုပေးနိုင်သော Referral Form',
      badge: '1-Month Review / Manual',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      icon: '🎁',
      linkPath: `/referral/${sampleCustomerId}`,
      description: 'Customer များမှ မိတ်ဆွေများအား ညွှန်းဆိုပေးနိုင်မည့် Form ဖြစ်ပါသည်။ 1-Month Milestone Review Form အောက်ခြေတွင် ပူးတွဲပါဝင်သလို Admin မှလည်း Customer Profile မှတစ်ဆင့် Link Manual ကူးယူ ပို့ပေးနိုင်ပါသည်။ ဖြည့်လိုက်သမျှ Referral Leads များသည် crm.inquiries သို့ Lead အသစ်အဖြစ် Auto-register ဖြစ်ပါသည်။',
      triggerTiming: '1-Month Milestone Review ဖြည့်ပြီးချိန် သို့မဟုတ် Customer Profile မှ Link Manual ထုတ်ချိန်',
      destination: 'crm.inquiries (Source: Referral Program)',
      colorGradient: 'from-emerald-500/20 to-teal-500/20'
    }
  ];

  const handleCopyLink = (path, index) => {
    const fullUrl = `${baseUrl}${path}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedIndex(index);
    toast.success('Form Link copied to clipboard!');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <Layout title="BBD Knowledge Hub & Operations Manual" subtitle="BBD Business Model, Customer Care SOP, Meal Rules & Forms System ၏ အရာရာကို တစ်နေရာတည်းတွင် လေ့လာရန်">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900/40 via-surface-800 to-indigo-900/40 border border-white/10 p-8 mb-8 shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-brand-green/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-green/10 text-brand-green text-xs font-black uppercase tracking-wider border border-brand-green/20 mb-4">
            📚 BBD Master Knowledge Base
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-3">
            BBD Knowledge Hub & Operations Manual
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            Busy Boss Diet (BBD) ၏ Business Ecosystem တစ်ခုလုံး၊ Customer Care မူဝါဒများ၊ Kitchen & Delivery စည်းမျဉ်းများနှင့် Forms စနစ် အစရှိသော <strong className="text-brand-green font-bold">BBD ၏ အရာရာ</strong> ကို တစ်နေရာတည်းတွင် အသေးစိတ် လေ့လာနိုင်သော Master Central Hub ဖြစ်ပါသည်။
          </p>

          <div className="flex flex-wrap gap-4">
            <button onClick={() => navigate('/crm')} className="px-5 py-2.5 rounded-xl bg-brand-green text-black font-black text-xs hover:bg-emerald-400 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              ← Back to CRM Dashboard
            </button>
            <Link to="/crm/customers" className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 transition-all">
              Total Customers စာရင်း ကြည့်ရန်
            </Link>
          </div>
        </div>
      </div>

      {/* Section 1: Business & Customer Care Philosophy */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-surface-800 border border-white/5 rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-2xl font-bold mb-4">
            👑
          </div>
          <h3 className="font-extrabold text-white text-lg mb-2">Why We Call Them "Boss"</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            BBD တွင် Customer များကို မည်သည့်အခါမျှ ရိုးရိုး Customer ဟု မခေါ်ဆိုပါ။ ၎င်းတို့၏ ကျန်းမာရေးနှင့် Diet Plan ကို ဦးဆောင်ညွှန်းဆိုသူ ဖြစ်သောကြောင့် **"Boss"** ဟု လေးစားစွာ သုံးနှုန်းပါသည်။
          </p>
        </div>

        <div className="bg-surface-800 border border-white/5 rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-2xl font-bold mb-4">
            🥗
          </div>
          <h3 className="font-extrabold text-white text-lg mb-2">360° Personalised Meals</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            Boss အသီးသီး၏ မတည့်သော အစားအသောက်၊ အစားရှောင်မှု (Allergies)၊ ရောဂါအခံနှင့် အကြိုက်များကို တိုက်ရိုက် Kitchen Dashboard သို့ စနစ်တကျ ချိတ်ဆက် ပို့ဆောင်ပေးပါသည်။
          </p>
        </div>

        <div className="bg-surface-800 border border-white/5 rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center text-2xl font-bold mb-4">
            ⚠️
          </div>
          <h3 className="font-extrabold text-white text-lg mb-2">Meal Change Rule</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            <strong className="text-rose-400">ဟင်းပြောင်းပေးရန် တောင်းဆို၍ မရပါ။</strong> ဆားငံလျှော့ပေးရန် သို့မဟုတ် အစပ်လျှော့ပေးရန် စသည့် အရသာ ပြင်ဆင်ချက် (Seasoning Adjustment) သာ လက်ခံပါသည်။
          </p>
        </div>

        <div className="bg-surface-800 border border-white/5 rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-2xl font-bold mb-4">
            ⏰
          </div>
          <h3 className="font-extrabold text-white text-lg mb-2">Automated Follow-ups</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            နေ့စဉ် Delivery အပြီး General Form၊ ည ၉:၀၀ နာရီ Rating Form နှင့် ရက် ၃၀ ပြည့် Milestone Review Noti များကို System က အလိုအလျောက် ပို့ပေးပါသည်။
          </p>
        </div>
      </div>

      {/* Section 2: Complete Forms Ecosystem Section */}
      <div className="mb-8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">BBD Forms Ecosystem (Forms အမျိုးအစားများ လမ်းညွှန်)</h2>
            <p className="text-slate-400 text-xs mt-1">Customer များနှင့် ထိတွေ့ဆက်ဆံရာတွင် အသုံးပြုသော Forms များနှင့် ၎င်းတို့၏ အဓိပ္ပာယ်များ</p>
          </div>
        </div>

        <div className="space-y-6">
          {formsList.map((form, idx) => (
            <div key={form.id} className="bg-surface-800 border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden group hover:border-brand-green/30 transition-all">
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${form.colorGradient}`}></div>
              
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-surface-900 border border-white/10 flex items-center justify-center text-3xl flex-shrink-0 shadow-lg">
                    {form.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                      <h3 className="text-xl font-black text-white group-hover:text-brand-green transition-colors">{form.title}</h3>
                      <span className={`px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider border ${form.badgeColor}`}>
                        {form.badge}
                      </span>
                    </div>
                    <p className="text-slate-400 text-xs font-medium">{form.subtitle}</p>
                  </div>
                </div>

                {/* Actions: Live Test & Copy Link */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <button
                    onClick={() => handleCopyLink(form.linkPath, idx)}
                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <span>{copiedIndex === idx ? '✓ Copied' : '🔗 Copy Link'}</span>
                  </button>
                  <Link
                    to={form.linkPath}
                    target="_blank"
                    className="px-4 py-2 rounded-xl bg-brand-green/10 text-brand-green border border-brand-green/20 hover:bg-brand-green hover:text-black text-xs font-black transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                  >
                    <span>👁️ Live Preview</span>
                  </Link>
                </div>
              </div>

              {/* Detail Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/5 text-xs">
                <div className="md:col-span-2">
                  <p className="text-slate-400 font-bold uppercase text-[10px] tracking-wider mb-1">Form အသုံးပြုပုံနှင့် အဓိပ္ပာယ်</p>
                  <p className="text-slate-300 leading-relaxed font-medium">{form.description}</p>
                </div>
                <div>
                  <div className="mb-3">
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-wider mb-0.5">ပို့ဆောင်ရမည့် အချိန် (Trigger Rule)</p>
                    <p className="text-amber-400 font-bold">{form.triggerTiming}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-wider mb-0.5">Data သိမ်းဆည်းသည့် နေရာ</p>
                    <p className="text-indigo-400 font-mono text-[11px] font-bold">{form.destination}</p>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

    </Layout>
  );
}

