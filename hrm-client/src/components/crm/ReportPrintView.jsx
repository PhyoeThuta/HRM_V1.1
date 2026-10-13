import React from 'react';

export default function ReportPrintView({ data, dateRange }) {
  if (!data) return null;

  const {
    summary = {},
    menuPerformance = {},
    churnAndRenewal = {},
    leadSources = {},
    deliveryFeedback = {}
  } = data;

  const {
    popularDishes = [],
    averageDishes = [],
    unpopularDishes = [],
    bestPicksCount = {},
    worstPicksCount = {}
  } = menuPerformance;

  const { churnReasons = {}, renewalReasons = {} } = churnAndRenewal;
  const { sourcesCount = {}, referralStats = {} } = leadSources;
  const { deliveryLogs = [] } = deliveryFeedback;

  return (
    <div className="hidden print:block p-8 bg-white text-slate-900 font-sans leading-relaxed">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b-2 border-emerald-600 pb-4 mb-6">
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="Busy Boss Diet" className="w-12 h-12 object-contain" />
          <div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Busy Boss Diet</h1>
            <p className="text-xs text-slate-600 font-bold uppercase tracking-wider">
              လုပ်ငန်းဆောင်ရွက်မှု အစီရင်ခံစာနှင့် သုံးသပ်ချက် (Executive & Operational Analytics)
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold text-slate-600">ထုတ်ယူသည့် ရက်စွဲ: {new Date().toLocaleDateString('en-GB')}</p>
          {dateRange?.startDate ? (
            <p className="text-xs font-bold text-slate-800">
              ကာလ: {dateRange.startDate} ~ {dateRange.endDate || 'ယနေ့အထိ'}
            </p>
          ) : (
            <p className="text-xs font-bold text-slate-800">ကာလ: အချိန်အားလုံး (All-Time)</p>
          )}
        </div>
      </div>

      {/* SECTION 1: OVERVIEW METRICS */}
      <div className="mb-6 page-break-inside-avoid">
        <h2 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2 border-l-4 border-emerald-600 pl-2">
          ၁။ အထွေထွေ အချက်အလက်များ (Executive Overview Metrics)
        </h2>
        <div className="grid grid-cols-4 gap-3 text-center">
          <div className="p-3 border border-slate-200 rounded bg-slate-50">
            <p className="text-xl font-black text-emerald-700">{summary.totalCustomers || 0}</p>
            <p className="text-[10px] font-bold text-slate-600 uppercase">စုစုပေါင်း Customer</p>
          </div>
          <div className="p-3 border border-slate-200 rounded bg-slate-50">
            <p className="text-xl font-black text-blue-700">{summary.activePackages || 0}</p>
            <p className="text-[10px] font-bold text-slate-600 uppercase">Active Packages</p>
          </div>
          <div className="p-3 border border-slate-200 rounded bg-slate-50">
            <p className="text-xl font-black text-purple-700">{summary.leadConversionRate || 0}%</p>
            <p className="text-[10px] font-bold text-slate-600 uppercase">Lead ရောင်းအား Conversion %</p>
          </div>
          <div className="p-3 border border-slate-200 rounded bg-slate-50">
            <p className="text-xl font-black text-amber-700">{summary.avgSatisfactionScore || '0.0'} ★</p>
            <p className="text-[10px] font-bold text-slate-600 uppercase">ပျှမ်းမျှ ကျေနပ်မှု Rating</p>
          </div>
        </div>
      </div>

      {/* SECTION 2: MENU & RECIPE ANALYTICS */}
      <div className="mb-6 page-break-inside-avoid">
        <h2 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2 border-l-4 border-emerald-600 pl-2">
          ၂။ ဟင်းပွဲ Ratings၊ လူကြိုက်များမှုနှင့် မီးဖိုချောင် ပြင်ဆင်ရန် ညွှန်ကြားချက်များ (Menu Analytics)
        </h2>

        <div className="p-2 mb-3 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-900">
          <span className="font-bold">⚠️ BBD Mgt Directive:</span> BBD သည် စားသောက်ဆိုင် မဟုတ်ဘဲ Customer Feedback ကို အခြေခံ၍ ဟင်းပွဲ ချက်ပြုတ်မှု အချိုးအစားနှင့် အရသာများကို BBD မီးဖိုချောင်မှ ကိုယ်တိုင် အမြဲ ပြင်ဆင်သွားရမည်။
        </div>

        <table className="w-full border-collapse border border-slate-200 text-xs mb-4">
          <thead>
            <tr className="bg-slate-100 text-slate-700 text-left font-bold">
              <th className="p-2 border border-slate-200 w-1/4">အမျိုးအစား</th>
              <th className="p-2 border border-slate-200 w-1/3">ဟင်းလျာ အမည်</th>
              <th className="p-2 border border-slate-200 w-1/6">Avg Rating</th>
              <th className="p-2 border border-slate-200">မီးဖိုချောင် လုပ်ဆောင်ရန် ညွှန်းဆိုချက်</th>
            </tr>
          </thead>
          <tbody>
            {popularDishes.length === 0 && averageDishes.length === 0 && unpopularDishes.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-3 border border-slate-200 text-center text-slate-500">
                  ဟင်းပွဲ Rating အချက်အလက် မရှိသေးပါ
                </td>
              </tr>
            ) : (
              <>
                {popularDishes.slice(0, 5).map((d, i) => (
                  <tr key={`pop-${i}`}>
                    <td className="p-2 border border-slate-200 font-bold text-emerald-700">Popular (လူကြိုက်များ)</td>
                    <td className="p-2 border border-slate-200">{d.name_en} {d.name_mm && `(${d.name_mm})`}</td>
                    <td className="p-2 border border-slate-200 font-bold text-amber-600">{d.avgRating} ★ ({d.count})</td>
                    <td className="p-2 border border-slate-200 text-slate-600">အရသာနှင့် အရည်အသွေး ဆက်လက် ထိန်းသိမ်းရန်</td>
                  </tr>
                ))}
                {averageDishes.slice(0, 3).map((d, i) => (
                  <tr key={`avg-${i}`}>
                    <td className="p-2 border border-slate-200 font-bold text-blue-700">Average (အသင့်အတင့်)</td>
                    <td className="p-2 border border-slate-200">{d.name_en} {d.name_mm && `(${d.name_mm})`}</td>
                    <td className="p-2 border border-slate-200 font-bold text-slate-700">{d.avgRating} ★ ({d.count})</td>
                    <td className="p-2 border border-slate-200 text-slate-600">ဖောက်သည် တုံ့ပြန်ချက်များ ပိုမို စောင့်ကြည့်ရန်</td>
                  </tr>
                ))}
                {unpopularDishes.slice(0, 5).map((d, i) => (
                  <tr key={`unpop-${i}`} className="bg-rose-50">
                    <td className="p-2 border border-slate-200 font-bold text-rose-700">Unpopular (ပြင်ရန်လို)</td>
                    <td className="p-2 border border-slate-200">{d.name_en} {d.name_mm && `(${d.name_mm})`}</td>
                    <td className="p-2 border border-slate-200 font-bold text-rose-600">{d.avgRating} ★ ({d.count})</td>
                    <td className="p-2 border border-slate-200 text-rose-800 font-semibold">BBD မီးဖိုချောင်မှ အငံ/အစပ် ပြင်ဆင်ရန်</td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>

        {/* Best Picks & Worst Picks Side-by-Side Table */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <h3 className="font-bold text-emerald-800 mb-1">🏆 ဖောက်သည်များ အကြိုက်ဆုံး (Best Picks)</h3>
            <table className="w-full border-collapse border border-slate-200">
              <thead>
                <tr className="bg-slate-100 font-bold">
                  <th className="p-1.5 border border-slate-200 text-left">ဟင်းပွဲ</th>
                  <th className="p-1.5 border border-slate-200 text-right w-16">မဲ အရေအတွက်</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(bestPicksCount).length === 0 ? (
                  <tr><td colSpan="2" className="p-2 text-center text-slate-400">မရှိသေးပါ</td></tr>
                ) : (
                  Object.entries(bestPicksCount).slice(0, 5).map(([dish, count]) => (
                    <tr key={dish}>
                      <td className="p-1.5 border border-slate-200">{dish}</td>
                      <td className="p-1.5 border border-slate-200 text-right font-bold text-emerald-700">{count}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div>
            <h3 className="font-bold text-rose-800 mb-1">👎 ဖောက်သည်များ အကြိုက်နည်းဆုံး (Worst Picks)</h3>
            <table className="w-full border-collapse border border-slate-200">
              <thead>
                <tr className="bg-slate-100 font-bold">
                  <th className="p-1.5 border border-slate-200 text-left">ဟင်းပွဲ</th>
                  <th className="p-1.5 border border-slate-200 text-right w-16">မဲ အရေအတွက်</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(worstPicksCount).length === 0 ? (
                  <tr><td colSpan="2" className="p-2 text-center text-slate-400">မရှိသေးပါ</td></tr>
                ) : (
                  Object.entries(worstPicksCount).slice(0, 5).map(([dish, count]) => (
                    <tr key={dish}>
                      <td className="p-1.5 border border-slate-200">{dish}</td>
                      <td className="p-1.5 border border-slate-200 text-right font-bold text-rose-700">{count}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SECTION 3: CHURN & RENEWAL DRIVERS */}
      <div className="mb-6 page-break-inside-avoid">
        <h2 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2 border-l-4 border-emerald-600 pl-2">
          ၃။ Customer ထွက်ခွာမှု (Churn Reasons) နှင့် သက်တမ်းတိုးရသည့် အကြောင်းရင်းများ (Renewal Drivers)
        </h2>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <h3 className="font-bold text-rose-700 mb-1">🛑 မဝယ်တော့သည့် အကြောင်းရင်းများ (Churn Reasons)</h3>
            <table className="w-full border-collapse border border-slate-200">
              <thead>
                <tr className="bg-slate-100 font-bold">
                  <th className="p-1.5 border border-slate-200 text-left">အကြောင်းအရင်း</th>
                  <th className="p-1.5 border border-slate-200 text-right w-16">အရေအတွက်</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(churnReasons).length === 0 ? (
                  <tr><td colSpan="2" className="p-2 text-center text-slate-400">မှတ်တမ်း မရှိသေးပါ</td></tr>
                ) : (
                  Object.entries(churnReasons).map(([reason, count]) => (
                    <tr key={reason}>
                      <td className="p-1.5 border border-slate-200">{reason}</td>
                      <td className="p-1.5 border border-slate-200 text-right font-bold text-rose-700">{count} ယောက်</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div>
            <h3 className="font-bold text-emerald-700 mb-1">💚 သက်တမ်းတိုးရသည့် အကြောင်းရင်းများ (Renewal Drivers)</h3>
            <table className="w-full border-collapse border border-slate-200">
              <thead>
                <tr className="bg-slate-100 font-bold">
                  <th className="p-1.5 border border-slate-200 text-left">အကြောင်းအရင်း</th>
                  <th className="p-1.5 border border-slate-200 text-right w-16">အရေအတွက်</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(renewalReasons).length === 0 ? (
                  <tr><td colSpan="2" className="p-2 text-center text-slate-400">မှတ်တမ်း မရှိသေးပါ</td></tr>
                ) : (
                  Object.entries(renewalReasons).map(([reason, count]) => (
                    <tr key={reason}>
                      <td className="p-1.5 border border-slate-200">{reason}</td>
                      <td className="p-1.5 border border-slate-200 text-right font-bold text-emerald-700">{count} ယောက်</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SECTION 4: LEAD SOURCES & REFERRAL STATS */}
      <div className="mb-6 page-break-inside-avoid">
        <h2 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2 border-l-4 border-emerald-600 pl-2">
          ၄။ Lead ရရှိသည့် လမ်းကြောင်းများ (Acquisition Channels) နှင့် Referral မိတ်ဆွေ ညွှန်းဆိုမှု စာရင်း (Leads & Referrals)
        </h2>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <h3 className="font-bold text-slate-800 mb-1">📲 Acquisition Channels</h3>
            <table className="w-full border-collapse border border-slate-200">
              <thead>
                <tr className="bg-slate-100 font-bold">
                  <th className="p-1.5 border border-slate-200 text-left">လမ်းကြောင်း</th>
                  <th className="p-1.5 border border-slate-200 text-right w-16">Leads</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(sourcesCount).length === 0 ? (
                  <tr><td colSpan="2" className="p-2 text-center text-slate-400">မှတ်တမ်း မရှိသေးပါ</td></tr>
                ) : (
                  Object.entries(sourcesCount).map(([src, count]) => (
                    <tr key={src}>
                      <td className="p-1.5 border border-slate-200">{src}</td>
                      <td className="p-1.5 border border-slate-200 text-right font-bold text-emerald-700">{count}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div>
            <h3 className="font-bold text-slate-800 mb-1">🤝 Top Referrers (မိတ်ဆွေ အများဆုံး ညွှန်းဆိုသူများ)</h3>
            <p className="text-[11px] font-semibold text-emerald-700 mb-1">
              ညွှန်းဆိုမှုမှ ရရှိသော စုစုပေါင်း Customer: {referralStats.totalReferredCustomers || 0} ယောက်
            </p>
            <table className="w-full border-collapse border border-slate-200">
              <thead>
                <tr className="bg-slate-100 font-bold">
                  <th className="p-1.5 border border-slate-200 text-left">အမည်</th>
                  <th className="p-1.5 border border-slate-200 text-right w-16">ညွှန်းဆိုမှု</th>
                </tr>
              </thead>
              <tbody>
                {(!referralStats.topReferrers || referralStats.topReferrers.length === 0) ? (
                  <tr><td colSpan="2" className="p-2 text-center text-slate-400">ညွှန်းဆိုသူ မရှိသေးပါ</td></tr>
                ) : (
                  referralStats.topReferrers.map((r, i) => (
                    <tr key={i}>
                      <td className="p-1.5 border border-slate-200">{r.name}</td>
                      <td className="p-1.5 border border-slate-200 text-right font-bold text-amber-600">{r.count}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SECTION 5: DELIVERY ANALYTICS */}
      <div className="mb-6 page-break-inside-avoid">
        <h2 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2 border-l-4 border-emerald-600 pl-2">
          ၅။ ပို့ဆောင်မှု အရည်အသွေး နှင့် Feedback (Delivery Analytics)
        </h2>
        <div className="grid grid-cols-3 gap-3 text-center text-xs mb-3">
          <div className="p-2 border border-slate-200 rounded bg-slate-50">
            <p className="text-lg font-black text-emerald-700">{deliveryFeedback.onTimeRate ?? 100}%</p>
            <p className="text-[10px] text-slate-500 font-bold">အချိန်မှန် ရာခိုင်နှုန်း</p>
          </div>
          <div className="p-2 border border-slate-200 rounded bg-slate-50">
            <p className="text-lg font-black text-amber-700">{deliveryFeedback.lateDeliveries || 0}</p>
            <p className="text-[10px] text-slate-500 font-bold">နောက်ကျ ပို့ဆောင်မှု</p>
          </div>
          <div className="p-2 border border-slate-200 rounded bg-slate-50">
            <p className="text-lg font-black text-rose-700">{deliveryFeedback.packagingIssues || 0}</p>
            <p className="text-[10px] text-slate-500 font-bold">ထုပ်ပိုးမှု ဖိတ်စင်/ပျက်စီးမှု</p>
          </div>
        </div>

        {/* Delivery Complaint Logs */}
        <table className="w-full border-collapse border border-slate-200 text-xs">
          <thead>
            <tr className="bg-slate-100 font-bold text-left">
              <th className="p-1.5 border border-slate-200 w-24">ရက်စွဲ</th>
              <th className="p-1.5 border border-slate-200">တိုင်ကြားချက် / Feedback</th>
              <th className="p-1.5 border border-slate-200 w-24">အမျိုးအစား</th>
            </tr>
          </thead>
          <tbody>
            {deliveryLogs.length === 0 ? (
              <tr><td colSpan="3" className="p-2 text-center text-slate-400">ပို့ဆောင်ရေး တိုင်ကြားချက် မှတ်တမ်း မရှိပါ</td></tr>
            ) : (
              deliveryLogs.map((log) => (
                <tr key={log.id}>
                  <td className="p-1.5 border border-slate-200 text-slate-600">
                    {new Date(log.created_at).toLocaleDateString('en-GB')}
                  </td>
                  <td className="p-1.5 border border-slate-200">{log.comment}</td>
                  <td className="p-1.5 border border-slate-200 font-bold text-rose-700">{log.type || 'delivery'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <div className="mt-8 border-t border-slate-300 pt-4 text-center text-[10px] text-slate-500">
        <p>Busy Boss Diet Enterprise Management System — Confidential Executive Operational Report</p>
      </div>
    </div>
  );
}
