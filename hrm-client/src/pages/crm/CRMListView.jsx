import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { useAuth } from '../../context/AuthContext';
import { crmApi } from '../../api/crm';
import toast from 'react-hot-toast';

const SEGMENTS = {
  revenue: { title: 'Revenue Details', type: 'packages' },
  customers: { title: 'Total Customers', type: 'customers' },
  active: { title: 'Active Customers', type: 'packages' },
  churned: { title: 'Churned Customers', type: 'customers' },
  hot: { title: 'Hot Prospects', type: 'inquiries' },
  follow_up: { title: 'Follow-up Prospects', type: 'inquiries' },
  pending: { title: 'Pending Prospects', type: 'inquiries' },
  lost: { title: 'Lost Prospects', type: 'inquiries' }
};

export default function CRMListView() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const segment = searchParams.get('segment') || 'customers';
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const config = SEGMENTS[segment] || SEGMENTS.customers;

  useEffect(() => {
    fetchSegmentData();
  }, [segment]);

  const fetchSegmentData = async () => {
    setLoading(true);
    try {
      const res = await crmApi.getSegment(segment);
      setData(res || []);
    } catch (e) {
      toast.error('Failed to load ' + config.title);
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (inquiryId, newStatus) => {
    try {
      await crmApi.updateInquiry(inquiryId, { status: newStatus });
      toast.success('Status updated successfully!');
      fetchSegmentData();
    } catch (e) {
      toast.error('Failed to update status');
    }
  };

  const filteredData = data.filter(item => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    
    if (config.type === 'customers') {
      return (item.full_name?.toLowerCase().includes(term) || item.customer_code?.toLowerCase().includes(term) || item.phone?.includes(term));
    }
    if (config.type === 'inquiries') {
      return (item.prospect_name?.toLowerCase().includes(term) || item.source?.toLowerCase().includes(term));
    }
    if (config.type === 'packages') {
      return (item.customers?.full_name?.toLowerCase().includes(term) || item.name?.toLowerCase().includes(term));
    }
    return true;
  });

  return (
    <Layout title={config.title} subtitle={`Viewing detailed list for ${config.title}`}>
      <div className="mb-6 flex justify-between items-center">
        <button onClick={() => navigate('/crm')} className="text-slate-400 hover:text-white font-bold flex items-center gap-2 transition-colors">
          ← Back to Dashboard
        </button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-green transition-colors"
          />
          <svg className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden bg-surface-800 border border-white/5 shadow-xl">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-slate-400 font-medium">Loading data...</div>
          ) : filteredData.length === 0 ? (
            <div className="p-12 text-center text-slate-400 font-medium">No records found.</div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-surface-850">
                <tr>
                  {config.type === 'customers' && (
                    <>
                      <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase">Customer</th>
                      <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase">Contact</th>
                      <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase">Gender</th>
                      <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase text-right">Actions</th>
                    </>
                  )}
                  {config.type === 'packages' && (
                    <>
                      <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase">Customer</th>
                      <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase">Package</th>
                      <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase">Status</th>
                      <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase text-right">Amount</th>
                    </>
                  )}
                  {config.type === 'inquiries' && (
                    <>
                      <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase">Prospect Name</th>
                      <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase">Source</th>
                      <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase">Status</th>
                      <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase text-right">Actions</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredData.map(item => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    
                    {/* CUSTOMERS RENDER */}
                    {config.type === 'customers' && (
                      <>
                        <td className="py-4 px-6">
                          <p className="font-bold text-white text-base">{item.full_name}</p>
                          <p className="text-xs font-bold text-brand-green mt-0.5">{item.customer_code}</p>
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-white font-medium">{item.phone}</p>
                          <p className="text-xs text-slate-400">{item.facebook_name || '—'}</p>
                        </td>
                        <td className="py-4 px-6 text-slate-300 font-medium">{item.gender}</td>
                        <td className="py-4 px-6 text-right">
                          <Link to={`/crm/customers/${item.id}`} className="text-indigo-400 hover:text-indigo-300 font-bold text-sm bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20 transition-colors">
                            View Profile
                          </Link>
                        </td>
                      </>
                    )}

                    {/* PACKAGES RENDER */}
                    {config.type === 'packages' && (
                      <>
                        <td className="py-4 px-6">
                          <p className="font-bold text-white text-base">{item.customers?.full_name || 'Unknown'}</p>
                          <p className="text-xs text-slate-400">{item.customers?.phone || ''}</p>
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-white font-medium">{item.name}</p>
                          <p className="text-xs text-slate-400">Expires: {new Date(item.expires_at).toLocaleDateString()}</p>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-1 rounded-md text-xs font-bold ${item.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <span className="font-bold text-white">{new Intl.NumberFormat('th-TH').format(item.amount || 0)} ฿</span>
                        </td>
                      </>
                    )}

                    {/* INQUIRIES RENDER */}
                    {config.type === 'inquiries' && (
                      <>
                        <td className="py-4 px-6">
                          <p className="font-bold text-white text-base">{item.prospect_name}</p>
                          <p className="text-xs text-slate-400">Since: {new Date(item.created_at).toLocaleDateString()}</p>
                        </td>
                        <td className="py-4 px-6 text-slate-300 font-medium">{item.source}</td>
                        <td className="py-4 px-6">
                           <span className="px-2 py-1 rounded-md text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/20">
                            {item.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right flex justify-end gap-2">
                           <select 
                            value={item.status || ''} 
                            onChange={(e) => handleStatusChange(item.id, e.target.value)}
                            className="bg-surface-900 border border-white/10 text-white text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-brand-green"
                          >
                            <option value="hot">Move to Hot</option>
                            <option value="pending">Move to Pending</option>
                            <option value="follow_up">Move to Follow-up</option>
                            <option value="lost">Move to Lost</option>
                            <option value="converted">Convert to Customer</option>
                          </select>
                          <Link to="/crm/inquiries" className="text-emerald-400 hover:text-emerald-300 font-bold text-xs bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 transition-colors">
                            Chat
                          </Link>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Layout>
  );
}
