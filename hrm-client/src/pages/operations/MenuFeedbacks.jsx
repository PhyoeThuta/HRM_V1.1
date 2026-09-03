import { useQuery } from '@tanstack/react-query';
import Layout from '../../components/layout/Layout';
import OpsNavBar from './OpsNavBar';
import api from '../../api/client';

export default function MenuFeedbacks() {
  const { data: feedbacks, isLoading } = useQuery({
    queryKey: ['menu-feedbacks'],
    queryFn: () => api.get('/operations/menu-feedbacks').then(res => res.data)
  });

  return (
    <Layout title="Operations Hub" subtitle="Menu specific feedback, requests, and complaints from customers">
      <OpsNavBar />
      
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Menu Feedbacks & Complaints</h2>
          <p className="text-sm text-slate-400">Direct feedback from customers about their daily meals.</p>
        </div>
      </div>

      <div className="bg-surface-800 rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 font-bold animate-pulse">Loading feedbacks...</div>
        ) : !feedbacks || feedbacks.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center text-4xl mb-4">✨</div>
            <h3 className="text-xl font-bold text-white mb-2">No Feedbacks Yet</h3>
            <p className="text-slate-400">Customers haven't submitted any feedback for specific menus recently.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {feedbacks.map((fb) => {
              const isComplain = fb.type === 'Complaint';
              const isRequest = fb.type === 'Request';
              const isFeedback = fb.type === 'Feedback';
              
              return (
                <div key={fb.id} className="p-6 hover:bg-white/[0.02] transition-colors flex gap-6">
                  {/* Status Indicator */}
                  <div className="shrink-0 flex flex-col items-center pt-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-lg border ${
                      isComplain ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 
                      isRequest ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 
                      'bg-brand-green/20 text-brand-green border-brand-green/30'
                    }`}>
                      {isComplain ? '⚠️' : isRequest ? '📝' : '⭐️'}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-lg font-bold text-white mb-1">{fb.menuName}</h4>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-fuchsia-400">{fb.customerName}</span>
                          <span className="text-xs text-slate-500">• {fb.date}</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 text-xs font-black uppercase rounded-lg border ${
                        isComplain ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' : 
                        isRequest ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 
                        'bg-brand-green/10 text-brand-green border-brand-green/30'
                      }`}>
                        {fb.type}
                      </span>
                    </div>

                    <div className="mt-4 bg-surface-900/50 rounded-xl p-4 border border-white/5 shadow-inner">
                      <p className="text-slate-300 text-sm whitespace-pre-line leading-relaxed italic">
                        "{fb.text.replace(/\[MENU\]\[.*?\]\s*\[ဟင်းလျာ - .*?\]\s*/g, '')}"
                      </p>
                    </div>

                    {isFeedback && fb.rating > 0 && (
                      <div className="mt-3 flex gap-1">
                        {[1,2,3,4,5].map(star => (
                          <span key={star} className={`text-lg ${star <= fb.rating ? 'text-brand-orange' : 'text-slate-700'}`}>★</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
