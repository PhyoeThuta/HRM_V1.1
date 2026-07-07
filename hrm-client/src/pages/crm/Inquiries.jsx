import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Inquiries() {
  const { user, isBoss } = useAuth();
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState([]);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    prospect_name: '', source: 'Facebook Messenger', service: ''
  });

  // Services State
  const [services, setServices] = useState(['1 Month Boss Diet', 'Weekly Keto', '14 Days Detox', 'General Pricing Inquiry']);
  const [showAddService, setShowAddService] = useState(false);
  const [newServiceInput, setNewServiceInput] = useState('');

  useEffect(() => {
    // Load custom packages from settings
    const storedPackages = localStorage.getItem('crm_packages');
    if (storedPackages) {
      const pkgs = JSON.parse(storedPackages);
      // Format as "PackageName - Duration"
      const formatted = pkgs.map(p => `${p.name} - ${p.duration}`);
      setServices(formatted);
    }
    // Load inquiries
    const stored = localStorage.getItem('crm_inquiries');
    if (stored) {
      setInquiries(JSON.parse(stored));
    } else {
      setInquiries([]);
      localStorage.setItem('crm_inquiries', JSON.stringify([]));
    }
  }, []);

  const handleAddService = (e) => {
    e.preventDefault();
    if (newServiceInput.trim()) {
      const updatedServices = [...services, newServiceInput.trim()];
      setServices(updatedServices);
      localStorage.setItem('crm_custom_services', JSON.stringify(updatedServices));
      setFormData({ ...formData, service: newServiceInput.trim() });
      setNewServiceInput('');
      setShowAddService(false);
      toast.success('New package added to list!');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      const newInquiry = {
        id: Date.now(),
        prospect_name: formData.prospect_name,
        source: formData.source,
        service: formData.service,
        status: 'New',
        ai_confidence: 'Pending AI Analysis',
        date: new Date().toISOString().split('T')[0]
      };
      
      const updated = [newInquiry, ...inquiries];
      setInquiries(updated);
      localStorage.setItem('crm_inquiries', JSON.stringify(updated));
      
      setShowModal(false);
      setIsSubmitting(false);
      setFormData({ prospect_name: '', source: 'Facebook Messenger', service: services[0] });
      toast.success('New lead added successfully!');
    }, 600);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'New': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Contacted': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Converted': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Lost': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <Layout title="Inquiries (Leads)" subtitle="Manage prospective customers and sales pipeline">
      
      <div className="mb-4">
        <button onClick={() => navigate('/crm')} className="text-slate-400 hover:text-white font-bold flex items-center gap-2 transition-colors">
          ← Back to Dashboard
        </button>
      </div>

      {/* Add Lead Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface-800 border border-white/10 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-indigo-500/10 to-transparent">
              <h3 className="font-black text-white text-lg flex items-center gap-2"><span>💬</span> Add New Lead</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white transition-colors">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Prospect Name *</label>
                <input required type="text" value={formData.prospect_name} onChange={e => setFormData({...formData, prospect_name: e.target.value})} className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" placeholder="e.g. Su Su" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Source *</label>
                <select value={formData.source} onChange={e => setFormData({...formData, source: e.target.value})} className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors">
                  <option>Facebook Messenger</option>
                  <option>Telegram</option>
                  <option>Viber</option>
                  <option>Website</option>
                  <option>Phone Call</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Service Interested In *</label>
                {!showAddService ? (
                  <div className="flex gap-2">
                    <select required value={formData.service} onChange={e => setFormData({...formData, service: e.target.value})} className="flex-1 bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors">
                      <option value="">Select a package...</option>
                      {services.map((s, idx) => (
                        <option key={idx} value={s}>{s}</option>
                      ))}
                    </select>
                    <button type="button" onClick={() => setShowAddService(true)} className="px-4 bg-brand-green/10 text-brand-green border border-brand-green/20 hover:bg-brand-green hover:text-black font-bold rounded-xl transition-all" title="Add New Package">
                      + Add
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input autoFocus type="text" value={newServiceInput} onChange={e => setNewServiceInput(e.target.value)} className="flex-1 bg-surface-900 border border-brand-green/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-green transition-colors" placeholder="Type new package name..." />
                    <button type="button" onClick={handleAddService} className="px-4 bg-brand-green text-black font-bold rounded-xl hover:scale-105 transition-transform">
                      Save
                    </button>
                    <button type="button" onClick={() => setShowAddService(false)} className="px-3 bg-surface-900 border border-white/10 text-slate-400 hover:text-white font-bold rounded-xl transition-colors">
                      ✕
                    </button>
                  </div>
                )}
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 rounded-xl font-black text-white bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.4)] transition-all flex items-center gap-2">
                  {isSubmitting ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : 'Save Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          {['All', 'New', 'Contacted', 'Converted', 'Lost'].map(filter => (
            <button key={filter} className="px-4 py-2 rounded-xl text-sm font-bold bg-surface-800 border border-white/5 text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
              {filter}
            </button>
          ))}
        </div>
        {user?.role !== 'marketing_junior' && (
          <button onClick={() => setShowModal(true)} className="bg-brand-green text-black px-4 py-2.5 rounded-xl text-sm font-black shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:scale-105 transition-all flex items-center gap-2">
            <span>+</span> Manual Entry
          </button>
        )}
      </div>

      <div className="rounded-3xl overflow-hidden bg-surface-800 border border-white/5 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-surface-850 border-b border-white/5">
              <tr>
                <th className="py-5 px-6 text-xs font-black text-slate-400 uppercase tracking-wider">Date / Source</th>
                <th className="py-5 px-6 text-xs font-black text-slate-400 uppercase tracking-wider">Prospect</th>
                <th className="py-5 px-6 text-xs font-black text-slate-400 uppercase tracking-wider">Interest</th>
                <th className="py-5 px-6 text-xs font-black text-slate-400 uppercase tracking-wider">Status</th>
                <th className="py-5 px-6 text-xs font-black text-slate-400 uppercase tracking-wider">AI Confidence</th>
                <th className="py-5 px-6 text-xs font-black text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {inquiries.map(inquiry => (
                <tr key={inquiry.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="py-4 px-6">
                    <p className="font-bold text-slate-300">{inquiry.date}</p>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><span>📱</span> {inquiry.source}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-white text-base group-hover:text-brand-green transition-colors">{inquiry.prospect_name}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-slate-300 font-medium">
                      {inquiry.service}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(inquiry.status)}`}>
                      {inquiry.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`font-bold ${inquiry.ai_confidence.includes('High') ? 'text-emerald-400' : inquiry.ai_confidence.includes('Low') ? 'text-rose-400' : inquiry.ai_confidence.includes('Pending') ? 'text-slate-400 animate-pulse' : 'text-amber-400'}`}>
                      {inquiry.ai_confidence}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right space-x-3">
                    <button className="text-indigo-400 hover:text-indigo-300 font-bold text-sm bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20 transition-colors">Chat</button>
                    {user?.role !== 'marketing_junior' && (
                      <button className="text-rose-400 hover:text-rose-300 font-bold text-sm">Drop</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
