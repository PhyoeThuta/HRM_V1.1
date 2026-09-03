import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { crmApi } from '../../api/crm';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function CustomerVoices() {
  const [voices, setVoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // ALL, FEEDBACK, REQUEST, COMPLAIN
  const { user } = useAuth();

  useEffect(() => {
    fetchVoices();
  }, []);

  const fetchVoices = async () => {
    try {
      setLoading(true);
      const data = await crmApi.getFeedbacks();
      setVoices(data || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load customer voices');
    } finally {
      setLoading(false);
    }
  };

  const getFeedbackDisplayInfo = (comment) => {
    let displayComment = comment || '';
    let type = 'FEEDBACK';
    let badgeColor = 'bg-brand-green/20 text-brand-green border-brand-green/30';
    
    if (displayComment.includes('[COMPLAIN]')) {
      type = 'COMPLAIN';
      badgeColor = 'bg-rose-500/20 text-rose-400 border-rose-500/30';
    } else if (displayComment.includes('[REQUEST]')) {
      type = 'REQUEST';
      badgeColor = 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    }

    displayComment = displayComment
      .replace(/\[GENERAL\]/g, '')
      .replace(/\[MENU\]/g, '')
      .replace(/\[FEEDBACK\]/g, '')
      .replace(/\[COMPLAIN\]/g, '')
      .replace(/\[REQUEST\]/g, '')
      .replace(/\[RESOLVED\]/g, '');
      
    // If it was a General tag, strip out the tangled up menu text from the old bug
    if (comment.includes('[GENERAL]')) {
       displayComment = displayComment.replace(/\[ဟင်းလျာ - .*?\]/g, '');
    }

    displayComment = displayComment.trim();

    return { type, displayComment, badgeColor };
  };

  const filteredVoices = voices.filter(v => {
    if (filter === 'ALL') return true;
    const { type } = getFeedbackDisplayInfo(v.comment);
    return type === filter;
  });

  return (
    <Layout title="Customer Voices" subtitle="Centralized view of all Feedbacks, Requests, and Complaints">
      <div className="flex items-center gap-4 mb-8">
        <div className="flex bg-surface-800 p-1 rounded-xl border border-white/10">
          {['ALL', 'FEEDBACK', 'REQUEST', 'COMPLAIN'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${filter === f ? 'bg-surface-900 text-brand-green shadow-sm' : 'text-slate-400 hover:text-slate-300'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="p-10 text-center text-slate-400">Loading voices...</div>
        ) : filteredVoices.length === 0 ? (
          <div className="p-10 text-center text-slate-400 bg-surface-800 rounded-3xl border border-white/5">
            No voices found for this filter.
          </div>
        ) : (
          filteredVoices.map(voice => {
            const { type, displayComment, badgeColor } = getFeedbackDisplayInfo(voice.comment);
            
            return (
              <div key={voice.id} className="p-6 rounded-3xl border bg-surface-800 border-white/10 shadow-lg relative overflow-hidden flex flex-col md:flex-row gap-6">
                <div className={`absolute top-0 left-0 w-1 h-full ${type === 'COMPLAIN' ? 'bg-rose-500' : type === 'REQUEST' ? 'bg-amber-500' : 'bg-brand-green'}`}></div>
                
                <div className="flex-1 pl-2">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border font-black text-xs tracking-wider ${badgeColor}`}>
                      {type}
                    </div>
                    {voice.rating > 0 && voice.rating !== null && (
                      <div className="flex items-center gap-1.5 bg-brand-orange/20 px-3 py-1.5 rounded-xl border border-brand-orange/30">
                        <span className="text-brand-orange font-black text-xs">{voice.rating}/5</span>
                        <svg className="w-3.5 h-3.5 text-brand-orange fill-brand-orange drop-shadow-[0_0_5px_rgba(255,119,0,0.5)]" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                      </div>
                    )}
                    <span className="text-xs font-bold text-slate-500 bg-black/50 px-3 py-1.5 rounded-xl border border-white/5">
                      {new Date(voice.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                    {displayComment || <span className="text-slate-600 italic">No comments provided.</span>}
                  </div>
                </div>

                <div className="md:w-64 flex flex-col justify-center items-end border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1">Customer</span>
                  <Link to={`/crm/customers/${voice.customer_id}`} className="font-bold text-white hover:text-brand-green transition-colors text-right truncate w-full">
                    {voice.customers?.full_name || 'Unknown Customer'}
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Layout>
  );
}
