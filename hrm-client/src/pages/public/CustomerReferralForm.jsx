import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function CustomerReferralForm() {
  const { customer_id } = useParams();

  const [referredName, setReferredName] = useState('');
  const [referredPhone, setReferredPhone] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!referredName.trim() || !referredPhone.trim()) {
      return toast.error('ကျေးဇူးပြု၍ မိတ်ဆွေ၏ အမည် နှင့် ဖုန်းနံပါတ် ဖြည့်စွက်ပေးပါ');
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/public/crm/referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referrer_customer_id: customer_id,
          referred_name: referredName.trim(),
          referred_phone: referredPhone.trim(),
          note: note.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit referral');

      setIsSuccess(true);
    } catch (err) {
      toast.error(err.message || 'Failed to submit referral. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4 font-sans">
        <div className="bg-white p-10 rounded-3xl max-w-md w-full text-center shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 space-y-4">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center text-4xl mx-auto shadow-inner">
            🎁
          </div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">ကျေးဇူးအထူးတင်ရှိပါသည်။</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            သင်၏ မိတ်ဆွေအား BBD သို့ ညွှန်းဆိုပေးသည့်အတွက် ကျေးဇူးတင်ပါသည်။ ကျွန်ုပ်တို့ BBD အဖွဲ့မှ မိတ်ဆွေထံသို့ အမြန်ဆုံး ဆက်သွယ် ဆွေးနွေးပေးပါမည်။
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-12 px-4 font-sans selection:bg-brand-green selection:text-white">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-3">
          <div className="inline-block mb-1">
            <span className="bg-emerald-500/10 text-emerald-600 text-xs font-bold px-3.5 py-1.5 rounded-full tracking-widest uppercase border border-emerald-500/20">
              BBD Referral Program 🎁
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
            မိတ်ဆွေ ညွှန်းဆိုမှု ဖောင် (Referral Form)
          </h1>
          <p className="text-slate-500 font-medium text-sm max-w-lg mx-auto">
            ကျန်းမာရေးနှင့် ကိုယ်အလေးချိန် ထိန်းသိမ်းလိုသော သင်၏ မိတ်ဆွေများအား BBD Dietary Plan များနှင့် မိတ်ဆက်ပေးပါ
          </p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] p-6 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 space-y-6">
          
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed font-medium flex items-start gap-3">
            <span className="text-xl">🎁</span>
            <div>
              <p className="font-bold">Referral Bonus Notice:</p>
              <p className="mt-0.5">မိတ်ဆွေမှ BBD Package အား ဝယ်ယူပါက ညွှန်းဆိုပေးသော သင်နှင့် မိတ်ဆွေ နှစ်ဦးစလုံး အထူး Discount Promo ခံစားခွင့် ရရှိမည်ဖြစ်သည်။</p>
            </div>
          </div>

          {/* Friend Name */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
              မိတ်ဆွေ၏ အမည် (Friend's Name) *
            </label>
            <input
              type="text"
              required
              value={referredName}
              onChange={(e) => setReferredName(e.target.value)}
              placeholder="မိတ်ဆွေ၏ အမည် ရေးသားပါ"
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all placeholder:text-slate-300"
            />
          </div>

          {/* Friend Phone */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
              မိတ်ဆွေ၏ ဖုန်းနံပါတ် (Friend's Phone Number) *
            </label>
            <input
              type="tel"
              required
              value={referredPhone}
              onChange={(e) => setReferredPhone(e.target.value)}
              placeholder="09XXXXXXXXX"
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all placeholder:text-slate-300"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
              အကြံပြုချက် သို့မဟုတ် စိတ်ဝင်စားသော Package (Notes / Goal)
            </label>
            <textarea
              rows="3"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="ဥပမာ- ဝိတ်ချချင်သူဖြစ်သည်၊ သက်သတ်လွတ် စားသူဖြစ်သည်..."
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all placeholder:text-slate-300 resize-none leading-relaxed"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 rounded-2xl font-bold text-sm text-white shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 ${
              isSubmitting
                ? 'bg-slate-300 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-brand-green to-emerald-600 hover:from-emerald-600 hover:to-teal-700 hover:-translate-y-0.5'
            }`}
          >
            {isSubmitting ? 'ပေးပို့နေပါသည်...' : 'မိတ်ဆွေ ညွှန်းဆိုမည် (Submit Referral)'}
          </button>
        </form>
      </div>
    </div>
  );
}
