import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import Layout from '../../components/layout/Layout';

const format = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + 
         d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
};

export default function WeeklyFeedbacks() {
  const { data: feedbacks, isLoading } = useQuery({
    queryKey: ['crm_weekly_feedbacks'],
    queryFn: () => api.get('/crm/weekly-feedbacks').then(res => res.data)
  });

  return (
    <Layout title="Weekly Menu Feedbacks" subtitle="Review customer ratings and comments on the menu plans">
      <div className="mb-6 flex justify-between items-center">
        <Link to="/crm" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
          ← Back to CRM
        </Link>
      </div>
      
      <div className="bg-surface-800 rounded-2xl border border-white/5 p-6 mt-6">
        {isLoading ? (
          <div className="text-center py-10 text-slate-400">Loading feedbacks...</div>
        ) : feedbacks?.length === 0 ? (
          <div className="text-center py-10 text-slate-400">No weekly menu feedbacks found yet.</div>
        ) : (
          <div className="space-y-6">
            {feedbacks?.map(fb => (
              <div key={fb.id} className="bg-surface-900 rounded-xl p-6 border border-white/5 relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-emerald-400">{fb.week_name}</h3>
                    <p className="text-slate-400 text-sm">Customer: <span className="text-white font-bold">{fb.customers?.full_name || 'Unknown'}</span></p>
                    <p className="text-slate-500 text-xs mt-1">Submitted: {format(fb.created_at)}</p>
                  </div>
                  <div className="text-right">
                    {fb.best_pick && <div className="text-sm"><span className="text-slate-400">Best Pick:</span> <span className="text-emerald-300 font-bold">{fb.best_pick}</span></div>}
                    {fb.worst_pick && <div className="text-sm mt-1"><span className="text-slate-400">Worst Pick:</span> <span className="text-rose-300 font-bold">{fb.worst_pick}</span></div>}
                  </div>
                </div>

                {/* Ratings Grid */}
                {fb.ratings_json && Object.keys(fb.ratings_json).length > 0 && (
                  <div className="bg-surface-800 rounded-lg p-4 mb-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(fb.ratings_json).map(([key, rating]) => {
                      const [date, meal] = key.split('_');
                      return (
                        <div key={key} className="flex justify-between items-center border-b border-white/5 pb-2">
                          <div>
                            <div className="text-xs text-slate-400">{date}</div>
                            <div className="text-sm font-bold text-slate-300 uppercase">{meal.replace(/[0-9]/g, '')}</div>
                          </div>
                          <div className={`font-black text-lg ${rating >= 4 ? 'text-emerald-400' : rating <= 2 ? 'text-rose-400' : 'text-amber-400'}`}>
                            {rating}/5
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Comment */}
                {fb.comment && (
                  <div className="bg-surface-800/50 rounded-lg p-4 text-slate-300 text-sm border-l-2 border-indigo-500 italic">
                    "{fb.comment}"
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
