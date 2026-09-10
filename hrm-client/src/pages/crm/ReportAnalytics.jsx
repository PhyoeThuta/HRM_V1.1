import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { crmApi } from '../../api/crm';
import ReportPrintView from '../../components/crm/ReportPrintView';
import toast from 'react-hot-toast';

export default function ReportAnalytics() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);
  
  // Date Filters
  const [datePreset, setDatePreset] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchReport = async () => {
    setLoading(true);
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const data = await crmApi.getFullAnalyticsReport(params);
      setReportData(data);
    } catch (err) {
      console.error('Failed to load report analytics:', err);
      toast.error('Failed to load report analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [startDate, endDate]);

  const handlePresetChange = (preset) => {
    setDatePreset(preset);
    const today = new Date();
    if (preset === 'all') {
      setStartDate('');
      setEndDate('');
    } else if (preset === '30days') {
      const past = new Date();
      past.setDate(today.getDate() - 30);
      setStartDate(past.toISOString().split('T')[0]);
      setEndDate(today.toISOString().split('T')[0]);
    } else if (preset === 'thisMonth') {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      setStartDate(firstDay.toISOString().split('T')[0]);
      setEndDate(today.toISOString().split('T')[0]);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const {
    summary = {},
    menuPerformance = {},
    churnAndRenewal = {},
    leadSources = {},
    deliveryFeedback = {}
  } = reportData || {};

  const {
    popularDishes = [],
    averageDishes = [],
    unpopularDishes = [],
    bestPicksCount = {},
    worstPicksCount = {},
    allDishes = []
  } = menuPerformance;

  const { churnReasons = {}, renewalReasons = {} } = churnAndRenewal;
  const { sourcesCount = {}, referralStats = {} } = leadSources;

  return (
    <Layout title="Report & Analytics (အစီရင်ခံစာနှင့် သုံးသပ်ချက်)" subtitle="BBD လုပ်ငန်းဆောင်ရွက်မှု၊ ဟင်းပွဲ Ratings၊ Churn အကြောင်းရင်းများနှင့် Lead အချက်အလက်များ">
      <div className="print:hidden max-w-7xl mx-auto space-y-6">
        
        {/* TOP BAR: Title, Date Preset Filter & Print Button */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-800 p-5 rounded-2xl border border-white/5 shadow-xl">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              📊 BBD Report & Analytics (သုံးသပ်ချက် အနှစ်ချုပ်)
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              BBD လုပ်ငန်းတစ်ခုလုံး၏ အချက်အလက်များကို အသေးစိတ် သုံးသပ်နိုင်သော Executive Dashboard
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Preset Buttons */}
            <div className="flex bg-surface-900 p-1 rounded-xl border border-white/10 text-xs font-semibold">
              <button
                onClick={() => handlePresetChange('all')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${datePreset === 'all' ? 'bg-brand-green text-white font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                အချိန်အားလုံး (All Time)
              </button>
              <button
                onClick={() => handlePresetChange('thisMonth')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${datePreset === 'thisMonth' ? 'bg-brand-green text-white font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                ဒီလ (This Month)
              </button>
              <button
                onClick={() => handlePresetChange('30days')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${datePreset === '30days' ? 'bg-brand-green text-white font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                လွန်ခဲ့သော ရက် ၃၀
              </button>
            </div>

            {/* Custom Dates */}
            <input
              type="date"
              value={startDate}
              onChange={(e) => { setDatePreset('custom'); setStartDate(e.target.value); }}
              className="bg-surface-900 text-xs text-white px-3 py-1.5 rounded-xl border border-white/10 focus:outline-none focus:border-brand-green"
            />
            <span className="text-slate-500 text-xs">မှ</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => { setDatePreset('custom'); setEndDate(e.target.value); }}
              className="bg-surface-900 text-xs text-white px-3 py-1.5 rounded-xl border border-white/10 focus:outline-none focus:border-brand-green"
            />

            {/* Print / Export PDF */}
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 ml-auto md:ml-0"
            >
              <span>🖨️</span> PDF ထုတ်ယူမည် / Print
            </button>
          </div>
        </div>

        {/* 5-TAB NAVIGATION */}
        <div className="flex overflow-x-auto gap-2 border-b border-white/10 pb-2">
          {[
            { id: 'overview', label: '၁။ အထွေထွေ အနှစ်ချုပ် (Executive Overview)', icon: '📈' },
            { id: 'menu', label: '၂။ ဟင်းပွဲ သုံးသပ်ချက် (Menu Analytics)', icon: '🍲' },
            { id: 'churn', label: '၃။ ထွက်ခွာမှု နှင့် သက်တမ်းတိုးမှု (Churn & Renewal)', icon: '🔄' },
            { id: 'leads', label: '၄။ Lead နှင့် Referral အချက်အလက် (Leads & Referrals)', icon: '🎯' },
            { id: 'delivery', label: '၅။ ပို့ဆောင်မှု Feedback (Delivery Analytics)', icon: '🚚' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-brand-green text-white shadow-lg shadow-brand-green/20 scale-105'
                  : 'bg-surface-800 text-slate-400 hover:bg-surface-700 hover:text-white border border-white/5'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="p-16 text-center bg-surface-800 rounded-2xl border border-white/5">
            <div className="w-10 h-10 border-4 border-brand-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-400 text-sm font-semibold">BBD အချက်အလက်များအား တွက်ချက် စုစည်းနေပါသည်...</p>
          </div>
        ) : (
          <>
            {/* TAB 1: EXECUTIVE OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-5 rounded-2xl bg-surface-800 border border-white/5 relative overflow-hidden">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-lg mb-3">
                      👥
                    </div>
                    <p className="text-3xl font-black text-white">{summary.totalCustomers || 0}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">စုစုပေါင်း Customer</p>
                    <p className="text-[11px] text-emerald-400 mt-2 font-medium">စနစ်အတွင်း စာရင်းသွင်းထားသူ</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-surface-800 border border-white/5 relative overflow-hidden">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-lg mb-3">
                      📦
                    </div>
                    <p className="text-3xl font-black text-white">{summary.activePackages || 0}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">လက်ရှိ Active Package များ</p>
                    <p className="text-[11px] text-slate-400 mt-2 font-medium">သက်တမ်းကုန်/ရပ်နား: {summary.expiredPackages || 0}</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-surface-800 border border-white/5 relative overflow-hidden">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-lg mb-3">
                      ⚡
                    </div>
                    <p className="text-3xl font-black text-white">{summary.leadConversionRate || 0}%</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Lead ရောင်းအား ပြောင်းလဲမှု (Conversion %)</p>
                    <p className="text-[11px] text-purple-400 mt-2 font-medium">Inquiry မှ Active ဖြစ်လာသူ</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-surface-800 border border-white/5 relative overflow-hidden">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-lg mb-3">
                      ⭐
                    </div>
                    <p className="text-3xl font-black text-white">{summary.avgSatisfactionScore || '0.0'} <span className="text-amber-400 text-xl">★</span></p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">ပျှမ်းမျှ ကျေနပ်မှု Rating</p>
                    <p className="text-[11px] text-amber-400 mt-2 font-medium">{summary.satisfactionPercentage ?? 0}% ကျေနပ်မှု ရှိသူများ</p>
                  </div>
                </div>

                {/* Key Executive Insights */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-surface-800 to-surface-900 border border-white/10 shadow-xl">
                  <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                    💡 လုပ်ငန်းဆိုင်ရာ သုံးသပ်ချက် အနှစ်ချုပ်များ (Executive Takeaways)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed text-slate-300">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                      <p className="font-bold text-brand-green mb-1">🥗 ဟင်းပွဲ သုံးသပ်ချက် အနှစ်ချုပ်</p>
                      <p>
                        ထိပ်တန်း ဟင်းပွဲများ ({popularDishes.length} မျိုး) သည် ကျေနပ်မှု အလွန်မြင့်မားပါသည်။ သို့သော် Rating 3.0 အောက် ရရှိသော ဟင်းပွဲ {unpopularDishes.length} မျိုး ရှိသဖြင့် BBD မီးဖိုချောင် အဖွဲ့မှ အငံ/အစပ် သို့မဟုတ် ချက်ပြုတ်မှု အချိုးအစားများ ပြင်ဆင်ရန် လိုအပ်ပါသည်။
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                      <p className="font-bold text-sky-400 mb-1">🔄 Customer ထွက်ခွာမှု သုံးသပ်ချက်</p>
                      <p>
                        Customer မဝယ်တော့သည့် အဓိက အကြောင်းရင်းများတွင် မြို့ပြောင်းသွားခြင်း နှင့် ဝန်ဆောင်မှု/အရသာ အဆင်မပြေခြင်းများ ပါဝင်ပါသည်။ သက်တမ်းမကုန်မီ ၁၄ ရက်အလိုတွင် မေးမြန်း၍ Diet Plan များကို စိတ်ကြိုက် ပြင်ဆင်ပေးရန် အကြံပြုပါသည်။
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: MENU & RECIPE ANALYTICS */}
            {activeTab === 'menu' && (
              <div className="space-y-6">
                
                {/* Note Banner: BBD adjustment directive */}
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-3">
                  <span className="text-xl">⚠️</span>
                  <div>
                    <p className="font-bold">BBD Management Notice (ဟင်းပွဲ ပြင်ဆင်ရန် အသိပေးချက်):</p>
                    <p className="mt-0.5 text-amber-200/90">
                      BBD သည် စားသောက်ဆိုင် မဟုတ်ပါ သို့သော် ဖောက်သည်များ၏ Feedback ကို အခြေခံ၍ ဟင်းပွဲ ချက်ပြုတ်မှု အချိုးအစားနှင့် အရသာများကို BBD အဖွဲ့မှ ကိုယ်တိုင် သင့်တော်သလို အမြဲ ပြင်ဆင်သွားရမည်။
                    </p>
                  </div>
                </div>

                {/* 3 Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Popular */}
                  <div className="p-5 rounded-2xl bg-surface-800 border border-emerald-500/20">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-bold text-emerald-400 text-sm flex items-center gap-1.5">
                        <span>🔥</span> လူကြိုက်များသော ဟင်းပွဲများ ({popularDishes.length})
                      </h4>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">4.0 ★ +</span>
                    </div>
                    {popularDishes.length === 0 ? (
                      <p className="text-slate-500 text-xs py-4 text-center">Rating ရရှိထားသော ဟင်းပွဲ မရှိသေးပါ</p>
                    ) : (
                      <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                        {popularDishes.map((d, i) => (
                          <div key={i} className="p-3 rounded-xl bg-white/5 flex justify-between items-center text-xs">
                            <div>
                              <p className="font-bold text-white">{d.name_en}</p>
                              {d.name_mm && <p className="text-[11px] text-slate-400">{d.name_mm}</p>}
                            </div>
                            <div className="text-right">
                              <span className="font-black text-amber-400">{d.avgRating} ★</span>
                              <p className="text-[10px] text-slate-500">{d.count} reviews</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Average */}
                  <div className="p-5 rounded-2xl bg-surface-800 border border-blue-500/20">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-bold text-blue-400 text-sm flex items-center gap-1.5">
                        <span>⚖️</span> အသင့်အတင့် ကြိုက်နှစ်သက်သော ဟင်းပွဲများ ({averageDishes.length})
                      </h4>
                      <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-bold">3.0 ~ 3.9 ★</span>
                    </div>
                    {averageDishes.length === 0 ? (
                      <p className="text-slate-500 text-xs py-4 text-center">အသင့်အတင့် အဆင့် ဟင်းပွဲ မရှိပါ</p>
                    ) : (
                      <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                        {averageDishes.map((d, i) => (
                          <div key={i} className="p-3 rounded-xl bg-white/5 flex justify-between items-center text-xs">
                            <div>
                              <p className="font-bold text-white">{d.name_en}</p>
                              {d.name_mm && <p className="text-[11px] text-slate-400">{d.name_mm}</p>}
                            </div>
                            <div className="text-right">
                              <span className="font-black text-amber-400">{d.avgRating} ★</span>
                              <p className="text-[10px] text-slate-500">{d.count} reviews</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Unpopular / Action Needed */}
                  <div className="p-5 rounded-2xl bg-surface-800 border border-rose-500/30">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-bold text-rose-400 text-sm flex items-center gap-1.5">
                        <span>🚨</span> ပြင်ဆင်ရန် လိုအပ်သော ဟင်းပွဲများ ({unpopularDishes.length})
                      </h4>
                      <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full font-bold">3.0 ★ အောက်</span>
                    </div>
                    {unpopularDishes.length === 0 ? (
                      <p className="text-slate-400 text-xs py-4 text-center">🎉 Rating နည်းသော ဟင်းပွဲ မရှိပါ။</p>
                    ) : (
                      <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                        {unpopularDishes.map((d, i) => (
                          <div key={i} className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs">
                            <div className="flex justify-between items-center mb-1">
                              <p className="font-bold text-rose-300">{d.name_en}</p>
                              <span className="font-black text-rose-400">{d.avgRating} ★</span>
                            </div>
                            <p className="text-[10px] text-rose-200/80 font-medium">
                              🛠️ Action: BBD Chef မီးဖိုချောင်မှ အငံ/အစပ် ပြင်ဆင်ရန်
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Best Picks vs Worst Picks Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-surface-800 border border-white/5">
                    <h4 className="font-bold text-emerald-400 text-xs uppercase tracking-wider mb-3">
                      🏆 ဖောက်သည်များ အကြိုက်ဆုံး ဟင်းပွဲများ (Best Picks)
                    </h4>
                    {Object.keys(bestPicksCount).length === 0 ? (
                      <p className="text-slate-500 text-xs py-2">Weekly pick အချက်အလက် မရှိသေးပါ</p>
                    ) : (
                      <div className="space-y-2 text-xs">
                        {Object.entries(bestPicksCount).map(([dish, count]) => (
                          <div key={dish} className="flex justify-between items-center p-2 rounded-lg bg-white/5">
                            <span className="text-slate-200 font-medium">{dish}</span>
                            <span className="font-bold text-emerald-400">{count} မဲ</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="p-5 rounded-2xl bg-surface-800 border border-white/5">
                    <h4 className="font-bold text-rose-400 text-xs uppercase tracking-wider mb-3">
                      👎 ဖောက်သည်များ အကြိုက်နည်းဆုံး ဟင်းပွဲများ (Worst Picks)
                    </h4>
                    {Object.keys(worstPicksCount).length === 0 ? (
                      <p className="text-slate-500 text-xs py-2">Weekly pick အချက်အလက် မရှိသေးပါ</p>
                    ) : (
                      <div className="space-y-2 text-xs">
                        {Object.entries(worstPicksCount).map(([dish, count]) => (
                          <div key={dish} className="flex justify-between items-center p-2 rounded-lg bg-white/5">
                            <span className="text-slate-200 font-medium">{dish}</span>
                            <span className="font-bold text-rose-400">{count} မဲ</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: CHURN & RENEWAL DRIVERS */}
            {activeTab === 'churn' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Churn Reasons */}
                  <div className="p-6 rounded-2xl bg-surface-800 border border-rose-500/20">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-black text-rose-400 text-sm uppercase tracking-wider flex items-center gap-2">
                        <span>🛑</span> မဝယ်တော့သည့် အကြောင်းအရင်းများ (Churn Reasons)
                      </h3>
                      <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full">
                        {summary.expiredPackages || 0} သက်တမ်းကုန်/ထွက်ခွာ
                      </span>
                    </div>

                    <div className="space-y-3 text-xs">
                      {Object.entries(churnReasons).map(([reason, count]) => (
                        <div key={reason} className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1.5">
                          <div className="flex justify-between font-bold text-slate-200">
                            <span>{reason}</span>
                            <span className="text-rose-400">{count} ယောက်</span>
                          </div>
                          <div className="w-full bg-surface-900 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-rose-500 h-full rounded-full"
                              style={{ width: `${Math.min(100, count * 15)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Renewal Reasons */}
                  <div className="p-6 rounded-2xl bg-surface-800 border border-emerald-500/20">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-black text-emerald-400 text-sm uppercase tracking-wider flex items-center gap-2">
                        <span>💚</span> သက်တမ်းတိုးရသည့် အကြောင်းအရင်းများ (Renewal Drivers)
                      </h3>
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
                        {summary.activePackages || 0} Active Packages
                      </span>
                    </div>

                    <div className="space-y-3 text-xs">
                      {Object.entries(renewalReasons).map(([reason, count]) => (
                        <div key={reason} className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1.5">
                          <div className="flex justify-between font-bold text-slate-200">
                            <span>{reason}</span>
                            <span className="text-emerald-400">{count} ယောက်</span>
                          </div>
                          <div className="w-full bg-surface-900 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-emerald-500 h-full rounded-full"
                              style={{ width: `${Math.min(100, count * 12)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: LEAD SOURCES & REFERRALS */}
            {activeTab === 'leads' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Lead Acquisition Channels */}
                  <div className="p-6 rounded-2xl bg-surface-800 border border-white/5">
                    <h3 className="font-black text-white text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                      <span>📲</span> Lead ရရှိသည့် လမ်းကြောင်းများ (Acquisition Channels)
                    </h3>
                    <div className="space-y-3 text-xs">
                      {Object.entries(sourcesCount).map(([src, count]) => (
                        <div key={src} className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                          <span className="font-semibold text-slate-200">{src}</span>
                          <span className="font-bold text-brand-green bg-brand-green/10 px-3 py-1 rounded-full">
                            {count} leads
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Referral Program */}
                  <div className="p-6 rounded-2xl bg-surface-800 border border-white/5">
                    <h3 className="font-black text-white text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                      <span>🤝</span> Referral မိတ်ဆွေ ညွှန်းဆိုမှု စာရင်း
                    </h3>
                    <div className="p-4 rounded-xl bg-brand-green/10 border border-brand-green/20 mb-4">
                      <p className="text-2xl font-black text-brand-green">{referralStats.totalReferredCustomers || 0}</p>
                      <p className="text-xs text-slate-300 font-semibold mt-1">ညွှန်းဆိုမှုမှ ရရှိသော စုစုပေါင်း Customer</p>
                    </div>

                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">မိတ်ဆွေ အများဆုံး ညွှန်းဆိုပေးသူများ (Top Referrers)</h4>
                    {(!referralStats.topReferrers || referralStats.topReferrers.length === 0) ? (
                      <p className="text-slate-500 text-xs py-2">ညွှန်းဆိုမှု အချက်အလက် မရှိသေးပါ</p>
                    ) : (
                      <div className="space-y-2 text-xs">
                        {referralStats.topReferrers.map((r, i) => (
                          <div key={i} className="flex justify-between items-center p-2.5 rounded-lg bg-white/5">
                            <span className="font-medium text-slate-200">{r.name}</span>
                            <span className="font-bold text-amber-400">{r.count} ညွှန်းဆိုမှု</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: DELIVERY & SERVICE FEEDBACK */}
            {activeTab === 'delivery' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-surface-800 border border-white/5 text-center">
                    <p className="text-3xl font-black text-emerald-400">{deliveryFeedback.onTimeRate ?? 100}%</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">အချိန်မှန် ပို့ဆောင်နိုင်မှု ရာခိုင်နှုန်း</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-surface-800 border border-white/5 text-center">
                    <p className="text-3xl font-black text-amber-400">{deliveryFeedback.lateDeliveries || 0}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">နောက်ကျ ပို့ဆောင်မှု အရေအတွက်</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-surface-800 border border-white/5 text-center">
                    <p className="text-3xl font-black text-rose-400">{deliveryFeedback.packagingIssues || 0}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">ထုပ်ပိုးမှု ဖိတ်စင်/ပျက်စီးမှု အရေအတွက်</p>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-surface-800 border border-white/5">
                  <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-4">
                    📦 ပို့ဆောင်ရေးဆိုင်ရာ တိုင်ကြားချက် Logs
                  </h3>
                  {(!deliveryFeedback.deliveryLogs || deliveryFeedback.deliveryLogs.length === 0) ? (
                    <p className="text-slate-500 text-xs text-center py-6">တိုင်ကြားချက် မရှိပါ</p>
                  ) : (
                    <div className="space-y-3 text-xs">
                      {deliveryFeedback.deliveryLogs.map((log) => (
                        <div key={log.id} className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex justify-between items-start">
                          <div>
                            <p className="text-slate-200 font-medium">{log.comment}</p>
                            <p className="text-[10px] text-slate-500 mt-1">
                              {new Date(log.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                            {log.type || 'delivery'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Printable template for PDF Export */}
      <ReportPrintView data={reportData} dateRange={{ startDate, endDate }} />
    </Layout>
  );
}
