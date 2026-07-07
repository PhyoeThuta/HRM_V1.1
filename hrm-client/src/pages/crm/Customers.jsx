import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { useAuth } from '../../context/AuthContext';
import { crmApi } from '../../api/crm';
import toast from 'react-hot-toast';

export default function Customers() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await crmApi.getCustomers();
      setCustomers(data);
    } catch (e) {
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await crmApi.deleteCustomer(id);
      setCustomers(prev => prev.filter(c => c.id !== id));
      setDeleteConfirmId(null);
      toast.success('Customer deleted.');
    } catch (e) {
      toast.error('Failed to delete customer');
    }
  };

  const filtered = customers.filter(c =>
    (c.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.customer_code || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.phone || '').includes(searchTerm)
  );

  return (
    <Layout title="Customers" subtitle="Manage all customer profiles and data">
      {/* Delete Confirm Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface-800 border border-white/10 rounded-3xl w-full max-w-sm shadow-2xl p-8 text-center">
            <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🗑️</span>
            </div>
            <h3 className="text-xl font-black text-white mb-2">Delete Customer?</h3>
            <p className="text-slate-400 text-sm mb-6">This will permanently delete the customer and all their data.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 px-5 py-3 rounded-xl font-bold text-slate-400 bg-surface-900 border border-white/5 hover:text-white transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirmId)} className="flex-1 px-5 py-3 rounded-xl font-black text-white bg-rose-500 hover:bg-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)] transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-4">
        <button onClick={() => navigate('/crm')} className="text-slate-400 hover:text-white font-bold flex items-center gap-2 transition-colors">
          ← Back to Dashboard
        </button>
      </div>
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search by name, code, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-green transition-colors"
          />
          <svg className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        {user?.role !== 'marketing_junior' && (
          <button onClick={() => navigate('/crm/customers/new')} className="ml-4 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all flex items-center gap-2">
            <span>+</span> New Customer
          </button>
        )}
      </div>

      <div className="rounded-2xl overflow-hidden bg-surface-800 border border-white/5 shadow-xl">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-slate-400 font-medium">Loading customers...</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-slate-400 font-medium">
              {searchTerm ? 'No customers match your search.' : 'No customers yet. Add one to get started!'}
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-surface-850">
                <tr>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase">Customer</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase">Contact</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase">Facebook</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase">Gender</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase text-center">Packages</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map(customer => (
                  <tr key={customer.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6">
                      <p className="font-bold text-white text-base">{customer.full_name}</p>
                      <p className="text-xs font-bold text-brand-green mt-0.5">{customer.customer_code}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-white font-medium">{customer.phone}</p>
                      <p className="text-xs text-slate-400">{customer.email || '—'}</p>
                    </td>
                    <td className="py-4 px-6 text-slate-300 font-medium">{customer.facebook_name || '—'}</td>
                    <td className="py-4 px-6 text-slate-300 font-medium">{customer.gender}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${customer.packages > 0 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                        {customer.packages} Packages
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-4">
                      <Link to={`/crm/customers/${customer.id}`} className="text-indigo-400 hover:text-indigo-300 font-bold text-sm bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20 transition-colors">
                        View Profile
                      </Link>
                      {user?.role !== 'marketing_junior' && (
                        <button onClick={() => setDeleteConfirmId(customer.id)} className="text-rose-400 hover:text-rose-300 font-bold text-sm">
                          Delete
                        </button>
                      )}
                    </td>
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
