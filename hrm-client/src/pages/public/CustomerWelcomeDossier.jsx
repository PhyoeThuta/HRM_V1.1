import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function CustomerWelcomeDossier() {
  const { customer_id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    fetch(`/api/public/crm/welcome-dossier/${customer_id}`)
      .then(res => {
        if (!res.ok) throw new Error('Customer record not found');
        return res.json();
      })
      .then(d => {
        if (isMounted) {
          setData(d);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0c18] flex items-center justify-center p-6 text-white font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-green/30 border-t-brand-green rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium animate-pulse">Preparing your personal BBD Health Journey...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#0a0c18] flex items-center justify-center p-6 text-white font-sans">
        <div className="bg-surface-800/80 border border-white/10 p-8 rounded-3xl max-w-md text-center shadow-2xl">
          <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            ⚠️
          </div>
          <h2 className="text-xl font-black mb-2">Welcome Link Expired or Invalid</h2>
          <p className="text-slate-400 text-sm">We couldn't retrieve this customer health record. Please contact Busy Boss Diet support.</p>
        </div>
      </div>
    );
  }

  const { customer, health, lifestyle, packages, feedbacks } = data;

  return (
    <div className="min-h-screen bg-[#070913] text-white font-sans selection:bg-brand-green selection:text-black py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
        
        {/* Surprise Header Banner */}
        <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-[#121629] via-[#0f1222] to-[#070913] border border-brand-green/30 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
          <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-brand-green/20 via-emerald-500/10 to-transparent rounded-full translate-x-24 -translate-y-24 blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-brand-green/10 border border-brand-green/30 text-brand-green px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-3 shadow-[0_0_15px_rgba(163,184,31,0.2)]">
                <span>✨</span> Welcome Back to BBD Family
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                Welcome Back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-emerald-400">{customer.full_name}</span>!
              </h1>
              <p className="text-slate-300 text-sm md:text-base mt-2 leading-relaxed max-w-xl">
                We are super excited to see you again! Here is your personalized health history & journey recap with Busy Boss Diet.
              </p>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center min-w-[130px] shadow-inner">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Customer Code</span>
              <span className="text-2xl font-black text-brand-green">{customer.customer_code}</span>
            </div>
          </div>
        </div>

        {/* Health & Metrics Showcase */}
        <div className="bg-[#0f1222]/80 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <span className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center text-xl">🩺</span>
            <div>
              <h2 className="text-xl font-black text-white">Your Health Profile & Goal</h2>
              <p className="text-xs text-slate-400">Tracked metrics & medical preferences</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl text-center">
              <span className="text-xs text-slate-400 font-bold uppercase block mb-1">Recorded Weight</span>
              <span className="text-xl font-black text-white">{health.current_weight || 'N/A'}</span>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl text-center">
              <span className="text-xs text-emerald-300 font-bold uppercase block mb-1">Goal Weight</span>
              <span className="text-xl font-black text-emerald-400">{health.goal_weight || 'N/A'}</span>
            </div>
            <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl text-center">
              <span className="text-xs text-slate-400 font-bold uppercase block mb-1">Height</span>
              <span className="text-xl font-black text-white">{health.height || 'N/A'}</span>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-2xl text-center">
              <span className="text-xs text-purple-300 font-bold uppercase block mb-1">Activity Level</span>
              <span className="text-base font-bold text-purple-200">{lifestyle.activity_level || 'Sedentary'}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl">
              <span className="text-xs text-rose-300 font-bold uppercase block mb-1">Medical Conditions</span>
              <span className="text-sm font-medium text-white">{health.medical_condition || 'None reported'}</span>
            </div>
            <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-2xl">
              <span className="text-xs text-orange-300 font-bold uppercase block mb-1">Food Allergies / Restrictions</span>
              <span className="text-sm font-medium text-white">{health.allergies || lifestyle.food_restriction || 'None reported'}</span>
            </div>
          </div>
        </div>

        {/* Past Meal Subscription History */}
        <div className="bg-[#0f1222]/80 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <span className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-xl">🍱</span>
            <div>
              <h2 className="text-xl font-black text-white">Your Diet Plans & Meals History</h2>
              <p className="text-xs text-slate-400">Total healthy meals enjoyed with BBD</p>
            </div>
          </div>

          {(!packages || packages.length === 0) ? (
            <div className="p-8 text-center bg-white/[0.01] border border-dashed border-white/10 rounded-2xl">
              <p className="text-slate-400 text-sm">No previous meal plans recorded yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {packages.map((pkg) => (
                <div key={pkg.id} className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-brand-green/40 transition-colors">
                  <div>
                    <h3 className="text-lg font-black text-white">{pkg.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {pkg.meal_count} Meals ({pkg.meal_type || 'Lunch & Dinner'}) • Duration: {pkg.duration || 'N/A'}
                    </p>
                  </div>
                  <div className="text-left md:text-right">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-brand-green/20 text-brand-green border border-brand-green/30">
                      {pkg.status || 'Active'}
                    </span>
                    <p className="text-xs text-slate-400 mt-1">Start: {pkg.start_date || 'N/A'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Customer Feedbacks Showcase */}
        <div className="bg-[#0f1222]/80 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <span className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center text-xl">⭐</span>
            <div>
              <h2 className="text-xl font-black text-white">Your Past Feedbacks & Ratings</h2>
              <p className="text-xs text-slate-400">Reviews & requests shared with BBD</p>
            </div>
          </div>

          {(!feedbacks || feedbacks.length === 0) ? (
            <div className="p-8 text-center bg-white/[0.01] border border-dashed border-white/10 rounded-2xl">
              <p className="text-slate-400 text-sm">No previous feedback entries recorded yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {feedbacks.map((fb) => (
                <div key={fb.id} className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-bold">{"⭐".repeat(fb.rating || 5)}</span>
                    <span className="text-xs text-slate-400">({fb.rating || 5}/5)</span>
                  </div>
                  <p className="text-white text-sm font-medium leading-relaxed">{fb.comment || 'No comment provided'}</p>
                  <p className="text-[11px] text-slate-500">{fb.created_at ? new Date(fb.created_at).toLocaleDateString() : ''}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Direct Action Re-order / Consultation Button */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-brand-green/20 to-emerald-500/20 border border-brand-green/40 text-center space-y-4 shadow-2xl">
          <h2 className="text-2xl font-black text-white">Ready to Restart Your Healthy Diet Journey?</h2>
          <p className="text-slate-300 text-sm max-w-lg mx-auto">
            Our BBD admin & nutritionist team is ready to personalize your next meal plan right away!
          </p>
          <a
            href={`https://m.me/${customer.facebook_name ? encodeURIComponent(customer.facebook_name) : ''}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 bg-brand-green text-black font-black text-lg px-8 py-4 rounded-2xl shadow-[0_0_30px_rgba(163,184,31,0.4)] hover:scale-105 transition-all"
          >
            <span>💬</span> Chat with BBD Admin on Messenger
          </a>
        </div>

      </div>
    </div>
  );
}
