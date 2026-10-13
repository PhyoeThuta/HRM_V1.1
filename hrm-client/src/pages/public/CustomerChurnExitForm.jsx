import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function CustomerChurnExitForm() {
  const { customer_id } = useParams();

  const [reasonCategory, setReasonCategory] = useState('Moved to another city (တခြားမြို့သို့ ပြောင်းရွှေ့သွားခြင်း)');
  const [comments, setComments] = useState('');
  const [wouldRecommend, setWouldRecommend] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const reasons = [
    { label: 'တခြားမြို့သို့ ပြောင်းရွှေ့သွားခြင်း (Moved to another city)', value: 'Moved to another city (တခြားမြို့သို့ ပြောင်းရွှေ့သွားခြင်း)' },
    { label: 'Customer Service / Quality / အရသာ အဆင်မပြေခြင်း (Quality / Service issue)', value: 'Customer Service / Quality Issue (ဝန်ဆောင်မှု/အရသာ အဆင်မပြေခြင်း)' },
    { label: 'စျေးနှုန်း ခက်ခဲခြင်း (Price / Budget constraints)', value: 'Price / Budget (စျေးနှုန်း ခက်ခဲခြင်း)' },
    { label: 'ခရီးသွားခြင်း / ခဏနားခြင်း (Temporary Travel / Break)', value: 'Temporary Travel / Break (ခရီးသွား/ခဏနားခြင်း)' },
    { label: 'ကျန်းမာရေး / Diet စည်းကမ်း ပြောင်းလဲခြင်း (Medical / Diet Change)', value: 'Dietary / Medical Reason (ကျန်းမာရေး/အစားအသောက် စည်းကမ်းပြောင်းခြင်း)' },
    { label: 'အခြား အကြောင်းပြချက်များ (Other Reason)', value: 'Other Reason (အခြား အကြောင်းပြချက်)' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/public/crm/churn-exit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id,
          reason_category: reasonCategory,
          comments,
          would_recommend: wouldRecommend
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit survey');

      setIsSuccess(true);
    } catch (err) {
      toast.error(err.message || 'Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4 font-sans">
        <div className="bg-white p-10 rounded-3xl max-w-md w-full text-center shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 space-y-4">
          <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center text-4xl mx-auto shadow-inner">
            💌
          </div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">ကျေးဇူးတင်ပါသည်။</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            BBD အား အားပေးခဲ့မှုအတွက် ကျေးဇူးအထူးတင်ရှိပါသည်။ သင်၏ အကြံပြုချက်များကို တန်ဖိုးထား၍ ဝန်ဆောင်မှုများကို ဆက်လက် တိုးတက်အောင် ပြုလုပ်သွားပါမည်။
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-12 px-4 font-sans selection:bg-rose-500 selection:text-white">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-3">
          <div className="inline-block mb-1">
            <span className="bg-rose-500/10 text-rose-600 text-xs font-bold px-3.5 py-1.5 rounded-full tracking-widest uppercase">
              BBD Exit Feedback Survey
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
            ဆက်လက် မဝယ်ယူဖြစ်သည့် အကြောင်းအရင်း မေးခွန်းဖောင်
          </h1>
          <p className="text-slate-500 font-medium text-sm max-w-lg mx-auto">
            BBD ဝန်ဆောင်မှုကို ခေတ္တ ရပ်နားရသည့် အကြောင်းအရင်းအား ဖြည့်စွက်ပေးပါရန် မေတ္တာရပ်ခံအပ်ပါသည်။
          </p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] p-6 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 space-y-8">
          
          {/* Reason Category Selection */}
          <div className="space-y-4">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">
              ၁။ ဆက်လက် မဝယ်ယူဖြစ်သည့် အဓိက အကြောင်းအရင်း ကို ရွေးချယ်ပေးပါ
            </label>
            <div className="space-y-2.5">
              {reasons.map((r) => (
                <label
                  key={r.value}
                  className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    reasonCategory === r.value
                      ? 'border-rose-500 bg-rose-50/50 text-rose-900 font-bold shadow-sm'
                      : 'border-slate-100 hover:border-slate-200 text-slate-700 font-medium'
                  }`}
                >
                  <input
                    type="radio"
                    name="reasonCategory"
                    value={r.value}
                    checked={reasonCategory === r.value}
                    onChange={(e) => setReasonCategory(e.target.value)}
                    className="w-4 h-4 text-rose-600 focus:ring-rose-500"
                  />
                  <span className="text-xs leading-snug">{r.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Detailed Comments */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">
              ၂။ ထပ်မံ ဖြည့်စွက် အကြံပြုလိုသည့် အချက်များ (အသေးစိတ် ရေးသားရန်)
            </label>
            <textarea
              rows="4"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="အသေးစိတ် အကြောင်းအရာများရှိပါက ဤနေရာတွင် ရေးသားပေးပါ..."
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-xs font-medium text-slate-800 focus:outline-none focus:border-rose-500/50 focus:bg-white transition-all placeholder:text-slate-300 resize-none leading-relaxed"
            />
          </div>

          {/* Recommend to Friend toggle */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">
              ၃။ နောင်တစ်ချိန်တွင် BBD အား မိတ်ဆွေများထံ ညွှန်းဆိုပေးမည်လား။
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setWouldRecommend(true)}
                className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all border-2 ${
                  wouldRecommend
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
                    : 'border-slate-100 text-slate-400 hover:bg-slate-50'
                }`}
              >
                👍 ညွှန်းဆိုပေးပါမည် (Yes)
              </button>
              <button
                type="button"
                onClick={() => setWouldRecommend(false)}
                className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all border-2 ${
                  !wouldRecommend
                    ? 'border-rose-500 bg-rose-50 text-rose-700 shadow-sm'
                    : 'border-slate-100 text-slate-400 hover:bg-slate-50'
                }`}
              >
                👎 မညွှန်းဆိုပါ (No)
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 rounded-2xl font-bold text-sm text-white shadow-lg shadow-rose-500/20 transition-all flex items-center justify-center gap-2 ${
              isSubmitting
                ? 'bg-slate-300 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 hover:-translate-y-0.5'
            }`}
          >
            {isSubmitting ? 'ပေးပို့နေပါသည်...' : 'ပေးပို့မည် (Submit Survey)'}
          </button>
        </form>
      </div>
    </div>
  );
}
