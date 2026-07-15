import { useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function CustomerFeedback() {
  const { customer_id } = useParams();
  const [ratings, setRatings] = useState({ 
    taste: 0, 
    portion: 0,
    packaging: 0,
    variety: 0,
    delivery: 0, 
    service: 0,
    progress: 0
  });
  const [hoverRatings, setHoverRatings] = useState({ 
    taste: 0, 
    portion: 0,
    packaging: 0,
    variety: 0,
    delivery: 0, 
    service: 0,
    progress: 0
  });
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const setRating = (category, value) => {
    setRatings(prev => ({ ...prev, [category]: value }));
  };

  const setHoverRating = (category, value) => {
    setHoverRatings(prev => ({ ...prev, [category]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(ratings).some(val => val === 0)) {
      toast.error('Please complete all star ratings / အမှတ်အပြည့်ပေးပါ');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const averageRating = Math.round(Object.values(ratings).reduce((a, b) => a + b, 0) / Object.values(ratings).length);
      
      const formattedComment = `
အရသာ (Taste): ${ratings.taste}/5
အစားအသောက် ပမာဏ (Portion Size): ${ratings.portion}/5
ထုပ်ပိုးမှု နှင့် သန့်ရှင်းရေး (Packaging & Hygiene): ${ratings.packaging}/5
ဟင်းလျာ အမျိုးအစား စုံလင်မှု (Menu Variety): ${ratings.variety}/5
Delivery အချိန်မှန် မမှန် (Delivery Timing): ${ratings.delivery}/5
ဝန်ဆောင်မှု (Customer Service): ${ratings.service}/5
တိုးတက်မှု (Progress): ${ratings.progress}/5

${comment ? `မှတ်ချက် (Comment):\n${comment}` : ''}
      `.trim();

      const res = await fetch('/api/public/crm/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer_id, rating: averageRating, comment: formattedComment })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit feedback');
      
      setIsSuccess(true);
      toast.success('Feedback submitted successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to submit. Please try again.');
      console.error('[Public Feedback]', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRow = ({ title, myanTitle, category }) => (
    <div className="flex flex-col items-center mb-5 bg-surface-900/50 p-5 rounded-2xl border border-white/5 shadow-inner backdrop-blur-sm transition-all hover:bg-surface-900/80 hover:border-brand-green/30">
      <label className="block text-sm font-bold text-white mb-2 text-center tracking-wide">
        {myanTitle} <span className="text-brand-green font-medium ml-1">({title})</span>
      </label>
      <div className="flex gap-3 mt-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
            onMouseEnter={() => setHoverRating(category, star)}
            onMouseLeave={() => setHoverRating(category, 0)}
            onClick={() => setRating(category, star)}
          >
            <svg 
              className={`w-9 h-9 transition-all duration-300 ${star <= (hoverRatings[category] || ratings[category]) ? 'text-brand-orange fill-brand-orange drop-shadow-[0_0_12px_rgba(255,119,0,0.6)] scale-110' : 'text-slate-700/50 hover:text-slate-500'}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center overflow-hidden relative bg-surface-950">
        {/* Animated Background Orbs */}
        <div className="absolute w-96 h-96 rounded-full opacity-20 animate-pulse" style={{ background: '#A3B81F', filter: 'blur(100px)', top: '-10%', left: '-10%' }} />
        <div className="absolute w-72 h-72 rounded-full opacity-20 animate-pulse" style={{ background: '#FF7700', filter: 'blur(100px)', bottom: '-10%', right: '10%', animationDelay: '2s' }} />
        
        <div className="relative z-10 w-full max-w-md px-4">
          <div className="bg-surface-800/80 backdrop-blur-xl p-10 rounded-3xl border border-white/10 shadow-2xl text-center">
            <div className="w-20 h-20 bg-brand-green/20 text-brand-green rounded-full flex items-center justify-center mx-auto mb-6 border border-brand-green/30 shadow-[0_0_30px_rgba(163,184,31,0.3)]">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-black text-white mb-3">Thank You! <br/> ကျေးဇူးတင်ပါတယ်</h2>
            <p className="text-slate-400">Your feedback helps us improve and serve you better.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-surface-950 py-12 px-4 flex justify-center">
      
      {/* Animated Background Orbs */}
      <div className="fixed w-[500px] h-[500px] rounded-full opacity-10 animate-pulse" style={{ background: '#A3B81F', filter: 'blur(120px)', top: '-20%', left: '-10%' }} />
      <div className="fixed w-[400px] h-[400px] rounded-full opacity-10 animate-pulse" style={{ background: '#FF7700', filter: 'blur(100px)', bottom: '-10%', right: '-5%', animationDelay: '2s' }} />
      
      {/* Grid background */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg,rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="max-w-xl w-full relative z-10">
        <div className="text-center mb-10">
          <img src="/logo.png" alt="Busy Boss Diet Logo" className="w-20 h-20 object-contain rounded-2xl shadow-[0_0_20px_rgba(163,184,31,0.3)] bg-white p-1 mx-auto mb-6" />
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Busy Boss Diet</h1>
          <p className="text-brand-green font-bold text-lg uppercase tracking-widest mb-4">Customer Feedback</p>
          <p className="text-slate-400 text-sm">How was your experience with us? <br/> ကျွန်ုပ်တို့၏ ဝန်ဆောင်မှုအပေါ် အကဲဖြတ်ပေးပါ။</p>
        </div>

        <div className="bg-surface-800/80 backdrop-blur-xl p-6 md:p-10 rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden">
          {/* Top Gradient Bar */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-green via-brand-orange to-brand-green bg-[length:200%_auto] animate-gradient"></div>
          
          <form onSubmit={handleSubmit} className="space-y-6 mt-2">
            
            <div className="space-y-4">
              <StarRow myanTitle="အရသာ" title="Taste" category="taste" />
              <StarRow myanTitle="အစားအသောက် ပမာဏ" title="Portion Size" category="portion" />
              <StarRow myanTitle="ထုပ်ပိုးမှု နှင့် သန့်ရှင်းရေး" title="Packaging & Hygiene" category="packaging" />
              <StarRow myanTitle="ဟင်းလျာ အမျိုးအစား စုံလင်မှု" title="Menu Variety" category="variety" />
              <StarRow myanTitle="Delivery အချိန်မှန် မမှန်" title="Delivery Timing" category="delivery" />
              <StarRow myanTitle="ဝန်ဆောင်မှု နှင့် ဆက်ဆံရေး" title="Customer Service" category="service" />
              <StarRow myanTitle="တိုးတက်မှု" title="Progress" category="progress" />
            </div>

            <div className="mt-8">
              <label className="block text-sm font-bold text-white mb-3 tracking-wide">
                Any Comments or Suggestions? <span className="text-brand-green">(အကြံပြုချက်များ)</span>
              </label>
              <textarea 
                value={comment} 
                onChange={(e) => setComment(e.target.value)} 
                rows="4" 
                className="w-full bg-surface-900/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all resize-none shadow-inner" 
                placeholder="Tell us what you liked or how we can improve..."
              ></textarea>
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full py-4 md:py-5 rounded-2xl font-black text-black text-lg transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #A3B81F, #829319)', boxShadow: '0 0 30px rgba(163,184,31,0.3)' }}
              >
                {isSubmitting ? (
                  <>
                    <span className="w-6 h-6 border-4 border-black/20 border-t-black rounded-full animate-spin"></span>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Feedback 
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
