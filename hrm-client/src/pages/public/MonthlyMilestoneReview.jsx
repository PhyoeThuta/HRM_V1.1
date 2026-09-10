import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function MonthlyMilestoneReview() {
  const { customer_id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form State
  const [currentWeightInput, setCurrentWeightInput] = useState('');
  const [activeFeeling, setActiveFeeling] = useState('Very Active & Energetic (ပေါ့ပါးလန်းဆန်းသည်)');
  const [healthImprovements, setHealthImprovements] = useState('');
  const [feedbackComment, setFeedbackComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Certificate Display State
  const [certificateData, setCertificateData] = useState(null);
  const certRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    fetch(`/api/public/crm/monthly-review/${customer_id}`)
      .then(res => {
        if (!res.ok) throw new Error('Customer milestone record not found');
        return res.json();
      })
      .then(d => {
        if (isMounted) {
          setData(d);
          // Parse starting weight number if available
          const rawWeight = d.health?.current_weight || '';
          const match = rawWeight.match(/[\d.]+/);
          if (match) {
            setCurrentWeightInput(match[0]);
          }
          setLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => { isMounted = false; };
  }, [customer_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentWeightInput || isNaN(parseFloat(currentWeightInput))) {
      return toast.error('Please enter a valid current weight (လက်ရှိ ကိုယ်အလေးချိန် ထည့်ပေးပါ)');
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/public/crm/monthly-review/${customer_id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_weight: parseFloat(currentWeightInput),
          active_feeling: activeFeeling,
          health_improvements: healthImprovements,
          feedback_comment: feedbackComment
        })
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Failed to submit milestone review');

      // Generate e-Certificate Data with Dual Mode (Weight Loss vs Health & Vitality)
      const startWeightVal = parseFloat((data.health?.current_weight || '').replace(/[^\d.]/g, '')) || parseFloat(currentWeightInput);
      const goalWeightVal = parseFloat((data.health?.goal_weight || '').replace(/[^\d.]/g, '')) || null;
      const currentWeightVal = parseFloat(currentWeightInput);
      const weightDiff = (startWeightVal - currentWeightVal).toFixed(1);
      const hasSignificantWeightLoss = parseFloat(weightDiff) > 0.5;

      setCertificateData({
        customerName: data.customer.full_name,
        customerCode: data.customer.customer_code,
        startWeight: `${startWeightVal} kg`,
        currentWeight: `${currentWeightVal} kg`,
        targetWeight: goalWeightVal ? `${goalWeightVal} kg` : 'N/A',
        weightLoss: weightDiff > 0 ? `-${weightDiff} kg` : (weightDiff < 0 ? `+${Math.abs(weightDiff)} kg` : '0 kg'),
        hasSignificantWeightLoss,
        activeFeeling,
        healthImprovements: healthImprovements || 'ခန္ဓာကိုယ် ပေါ့ပါးလန်းဆန်း၍ ကျန်းမာရေး သိသိသာသာ တိုးတက်လာခြင်း',
        certTypeTitle: hasSignificantWeightLoss ? 'Certificate of Weight Loss Achievement' : 'Certificate of Health & Vitality Honor',
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      });

      toast.success('Congratulations! Achievement milestone saved 🎉');
    } catch (err) {
      toast.error(err.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070913] flex items-center justify-center p-6 text-white font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-green/30 border-t-brand-green rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium animate-pulse">Loading BBD Monthly Milestone Review...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#070913] flex items-center justify-center p-6 text-white font-sans">
        <div className="bg-surface-800/80 border border-white/10 p-8 rounded-3xl max-w-md text-center shadow-2xl">
          <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            ⚠️
          </div>
          <h2 className="text-xl font-black mb-2">Milestone Review Link Invalid</h2>
          <p className="text-slate-400 text-sm">We couldn't load this customer review link. Please contact Busy Boss Diet support.</p>
        </div>
      </div>
    );
  }

  const { customer, health, package: activePkg } = data;

  return (
    <div className="min-h-screen bg-[#070913] text-white font-sans py-10 px-4 selection:bg-brand-green selection:text-black">
      <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-300">
        
        {/* Top Header */}
        <div className="text-center space-y-3">
          <span className="bg-brand-green/10 border border-brand-green/30 text-brand-green text-xs font-black px-4 py-1.5 rounded-full tracking-wider uppercase inline-block shadow-[0_0_15px_rgba(163,184,31,0.2)]">
            🌟 1-Month Milestone Review
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Greetings, Boss <span className="text-brand-green">{customer.full_name}</span>!
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-md mx-auto leading-relaxed">
            ၁ လပြည့်မြောက်သွားပြီဖြစ်တဲ့အတွက် Boss ရဲ့ ရည်မှန်းချက် Target Weight ရောက်ရှိမှုနဲ့ ကျန်းမာရေး တိုးတက်မှု အခြေအနေများကို အတူတကွ လေ့လာကြည့်ရအောင်ခင်ဗျာ။
          </p>
        </div>

        {/* Dynamic e-Certificate Modal / Card (If submitted) */}
        {certificateData ? (
          <div className="space-y-6">
            {/* Official Premium BBD e-Certificate Badge (MyDay Share Ready) */}
            <div 
              ref={certRef} 
              className="relative rounded-3xl p-8 md:p-12 bg-gradient-to-b from-[#0f172a] via-[#090d16] to-[#03050a] border-4 border-amber-400/60 shadow-[0_0_60px_rgba(251,191,36,0.3)] text-center overflow-hidden"
            >
              {/* Luxury Certificate Background Flourishes */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl translate-x-20 -translate-y-20 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl -translate-x-20 translate-y-20 pointer-events-none"></div>
              
              {/* Decorative Corner Borders */}
              <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-amber-400/80"></div>
              <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-amber-400/80"></div>
              <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-amber-400/80"></div>
              <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-amber-400/80"></div>

              <div className="relative z-10 space-y-6">
                
                {/* Official BBD Logo */}
                <div className="flex flex-col items-center justify-center">
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-white p-2 border-4 border-amber-400/80 shadow-[0_0_30px_rgba(251,191,36,0.4)] flex items-center justify-center mb-2">
                    <img 
                      src="/logo.png" 
                      alt="Busy Boss Diet Logo" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-[0.25em] text-amber-400 drop-shadow">
                    ★ BUSY BOSS DIET ENTERPRISE ★
                  </span>
                </div>

                {/* Main Heading */}
                <div>
                  <h2 className="text-2xl md:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 drop-shadow-md uppercase">
                    {certificateData.certTypeTitle}
                  </h2>
                  <p className="text-slate-300 text-xs md:text-sm tracking-widest font-semibold uppercase mt-1">
                    {certificateData.hasSignificantWeightLoss ? 'Official Weight Milestone Completed' : 'Official Health & Vitality Milestone Honor'}
                  </p>
                </div>

                {/* Recipient Customer Name */}
                <div className="py-6 border-y border-amber-400/20 max-w-lg mx-auto space-y-2">
                  <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">This Certificate is Proudly Awarded to</p>
                  <h3 className="text-2xl md:text-4xl font-black text-white tracking-wide text-brand-green">
                    Boss {certificateData.customerName}
                  </h3>
                  <p className="text-xs text-amber-300/80 font-mono font-bold tracking-wider">
                    Customer Code: {certificateData.customerCode}
                  </p>
                  <p className="text-xs text-slate-300 italic pt-2 max-w-md mx-auto leading-relaxed">
                    {certificateData.hasSignificantWeightLoss
                      ? '"For outstanding discipline, dedication, and inspirational weight loss progress with Busy Boss Diet."'
                      : '"For outstanding dedication to daily wellness, energetic lifestyle, and personal vitality with Busy Boss Diet."'}
                  </p>
                </div>

                {/* Key Metrics Stats Banner - Dynamic Dual Mode */}
                {certificateData.hasSignificantWeightLoss ? (
                  <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-amber-500/10 border border-amber-400/30 p-4 rounded-2xl shadow-inner">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Start Weight</span>
                      <span className="text-base md:text-lg font-black text-white">{certificateData.startWeight}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-400 font-bold uppercase block tracking-wider">Current Weight</span>
                      <span className="text-base md:text-lg font-black text-amber-300">{certificateData.currentWeight}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-400 font-bold uppercase block tracking-wider">Weight Loss</span>
                      <span className="text-base md:text-lg font-black text-emerald-400">{certificateData.weightLoss}</span>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-teal-500/10 border border-emerald-400/30 p-4 rounded-2xl shadow-inner text-left">
                    <div>
                      <span className="text-[10px] text-emerald-400 font-bold uppercase block tracking-wider mb-1">⚡ Energy & Vitality</span>
                      <span className="text-xs md:text-sm font-bold text-white block">{certificateData.activeFeeling}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-400 font-bold uppercase block tracking-wider mb-1">🌿 Health Impact</span>
                      <span className="text-xs md:text-sm font-bold text-amber-200 block truncate">{certificateData.healthImprovements}</span>
                    </div>
                  </div>
                )}

                {/* Signatures & Verification Footer */}
                <div className="pt-4 border-t border-white/10 flex justify-between items-end max-w-lg mx-auto text-left">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Issue Date</p>
                    <p className="text-xs font-bold text-slate-200">{certificateData.date}</p>
                  </div>

                  <div className="text-center">
                    <div className="inline-block px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[10px] font-black uppercase tracking-wider mb-1">
                      VERIFIED VIP BOSS
                    </div>
                    <p className="text-[10px] text-slate-400 block font-serif italic">Busy Boss Diet Official Seal</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => window.print()}
                className="flex-1 py-4 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black rounded-2xl shadow-[0_0_25px_rgba(251,191,36,0.4)] hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 text-base"
              >
                <span>📥</span> Save / Download Certificate (MyDay Ready)
              </button>
              <a
                href={`https://m.me/${customer.facebook_name ? encodeURIComponent(customer.facebook_name) : ''}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-4 bg-surface-800 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-base"
              >
                <span>💬</span> Renew Next Month Package
              </a>
            </div>
          </div>
        ) : (
          /* Form for Entering Current Weight & Health Impact */
          <form onSubmit={handleSubmit} className="bg-[#0f1222]/90 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
            
            {/* Baseline Info Cards */}
            <div className="grid grid-cols-2 gap-4 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
              <div>
                <span className="text-xs text-slate-400 font-bold uppercase block mb-1">Starting Weight</span>
                <span className="text-lg font-black text-white">{health.current_weight || 'N/A'}</span>
              </div>
              <div>
                <span className="text-xs text-brand-green font-bold uppercase block mb-1">Target Weight</span>
                <span className="text-lg font-black text-brand-green">{health.goal_weight || 'N/A'}</span>
              </div>
            </div>

            {/* Input 1: Current Weight */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-white">
                ၁။ လက်ရှိ ရောက်ရှိနေသည့် Weight (kg) ကို ထည့်ပေးပါ *
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={currentWeightInput}
                onChange={e => setCurrentWeightInput(e.target.value)}
                placeholder="e.g. 62.5"
                className="w-full bg-surface-900 border-2 border-white/10 rounded-2xl px-5 py-4 text-white font-bold text-lg focus:outline-none focus:border-brand-green transition-colors"
              />
            </div>

            {/* Input 2: Daily Life / Active Feeling */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-white">
                ၂။ BBD Diet စားသုံးပြီးနောက် နေရထိုင်ရ ပေါ့ပါး လန်းဆန်းမှု ရှိမရှိ *
              </label>
              <select
                value={activeFeeling}
                onChange={e => setActiveFeeling(e.target.value)}
                className="w-full bg-surface-900 border-2 border-white/10 rounded-2xl px-5 py-4 text-white font-medium focus:outline-none focus:border-brand-green transition-colors"
              >
                <option value="Very Active & Energetic (ပေါ့ပါးလန်းဆန်းသည်)">Very Active & Energetic (အလွန် ပေါ့ပါးလန်းဆန်းသည်)</option>
                <option value="Moderately Active (အသင့်အတင့် အဆင်ပြေသည်)">Moderately Active (အသင့်အတင့် အဆင်ပြေသည်)</option>
                <option value="Slight Change (အနည်းငယ် ပြောင်းလဲသည်)">Slight Change (အနည်းငယ် ပြောင်းလဲသည်)</option>
              </select>
            </div>

            {/* Input 3: Health Improvements (Diabetic/BP/Daily Life) */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-white">
                ၃။ ဆီးချို / သွေးတိုး သို့မဟုတ် အခြား ကျန်းမာရေး တိုးတက်ပြောင်းလဲမှုများ (ရှိပါက ရေးပေးပါ)
              </label>
              <input
                type="text"
                value={healthImprovements}
                onChange={e => setHealthImprovements(e.target.value)}
                placeholder="e.g. ဆီးချိုထိန်းရတာ ပိုအဆင်ပြေလာတယ်၊ နေရထိုင်ရ သက်သောင့်သက်သာရှိတယ်"
                className="w-full bg-surface-900 border-2 border-white/10 rounded-2xl px-5 py-4 text-white font-medium focus:outline-none focus:border-brand-green transition-colors placeholder:text-slate-500 text-sm"
              />
            </div>

            {/* Input 4: Additional Comment */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-white">
                ၄။ BBD သို့ အကြံပြုချက် သို့မဟုတ် သတင်းစကား
              </label>
              <textarea
                rows="3"
                value={feedbackComment}
                onChange={e => setFeedbackComment(e.target.value)}
                placeholder="Boss ၏ အကြံပြုချက်များကို ရေးသားပေးပါ..."
                className="w-full bg-surface-900 border-2 border-white/10 rounded-2xl px-5 py-4 text-white font-medium focus:outline-none focus:border-brand-green transition-colors placeholder:text-slate-500 text-sm resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl font-black text-black bg-brand-green hover:bg-emerald-400 shadow-[0_0_25px_rgba(163,184,31,0.3)] transition-all flex items-center justify-center gap-2 text-lg disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                  Submitting Review...
                </>
              ) : (
                'Submit Review & Get Achievement Certificate 🎉'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
