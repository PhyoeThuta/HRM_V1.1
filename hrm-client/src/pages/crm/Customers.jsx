import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { useAuth } from '../../context/AuthContext';
import { crmApi } from '../../api/crm';
import toast from 'react-hot-toast';

export default function Customers() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters state initialized from URL search params
  const initialStatus = searchParams.get('status') || 'all';
  const initialLevel = searchParams.get('level') || 'all';
  const initialPackage = searchParams.get('package') || 'all';

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialStatus); // 'all', 'active', 'inactive'
  const [levelFilter, setLevelFilter] = useState(initialLevel); // 'all' or level_name
  const [packageFilter, setPackageFilter] = useState(initialPackage); // 'all' or package_id / name

  const [customers, setCustomers] = useState([]);
  const [levels, setLevels] = useState([]);
  const [availablePackages, setAvailablePackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  // Update URL search params when filters change
  useEffect(() => {
    const params = {};
    if (statusFilter !== 'all') params.status = statusFilter;
    if (levelFilter !== 'all') params.level = levelFilter;
    if (packageFilter !== 'all') params.package = packageFilter;
    setSearchParams(params, { replace: true });
  }, [statusFilter, levelFilter, packageFilter, setSearchParams]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [custData, levelData, pkgData] = await Promise.all([
        crmApi.getCustomers(),
        crmApi.getLevelSettings(),
        crmApi.getPackages()
      ]);
      setCustomers(custData || []);
      setLevels(levelData || []);
      setAvailablePackages(pkgData || []);
    } catch (e) {
      toast.error('Failed to load customers & filter data');
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

  // Multi-dimensional filtering logic
  const filtered = customers.filter(c => {
    // 1. Text search (Name, Customer Code, Phone)
    const matchesSearch = 
      (c.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.customer_code || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.phone || '').includes(searchTerm);

    // 2. Active / Inactive Status filter
    let matchesStatus = true;
    if (statusFilter === 'active') {
      matchesStatus = c.is_active === true;
    } else if (statusFilter === 'inactive') {
      matchesStatus = c.is_active === false;
    }

    // 3. Level filter
    let matchesLevel = true;
    if (levelFilter !== 'all') {
      matchesLevel = (c.level?.level_name || '') === levelFilter;
    }

    // 4. Package filter
    let matchesPackage = true;
    if (packageFilter !== 'all') {
      // Check if customer has an assigned package matching the selected package name or ID
      const hasPkg = (c.package_names || []).some(pkgName => 
        pkgName.toLowerCase().includes(packageFilter.toLowerCase())
      ) || (c.customer_packages || []).some(p => String(p.package_id) === String(packageFilter));

      matchesPackage = hasPkg;
    }

    return matchesSearch && matchesStatus && matchesLevel && matchesPackage;
  });

  return (
    <Layout title="Total Customers" subtitle="Multi-dimensional customer directory with live package & tier filters">
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

      {/* Multi-Dimensional Filter Control Bar */}
      <div className="bg-surface-800 border border-white/10 rounded-2xl p-5 mb-6 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by name, customer code, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-brand-green transition-colors"
            />
            <svg className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Action Button */}
          {user?.role !== 'marketing_junior' && (
            <button onClick={() => navigate('/crm/customers/new')} className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all flex items-center justify-center gap-2 whitespace-nowrap">
              <span>+</span> Add New Customer
            </button>
          )}
        </div>

        {/* Filter Pills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-white/5">
          {/* Status Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Account Status</label>
            <div className="flex rounded-xl bg-surface-900 border border-white/5 p-1">
              <button
                onClick={() => setStatusFilter('all')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${statusFilter === 'all' ? 'bg-white text-black shadow' : 'text-slate-400 hover:text-white'}`}
              >
                All ({customers.length})
              </button>
              <button
                onClick={() => setStatusFilter('active')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${statusFilter === 'active' ? 'bg-emerald-500 text-black shadow' : 'text-slate-400 hover:text-white'}`}
              >
                Active ({customers.filter(c => c.is_active).length})
              </button>
              <button
                onClick={() => setStatusFilter('inactive')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${statusFilter === 'inactive' ? 'bg-rose-500 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              >
                Inactive ({customers.filter(c => !c.is_active).length})
              </button>
            </div>
          </div>

          {/* Package Filter Dropdown */}
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Filter by Package</label>
            <select
              value={packageFilter}
              onChange={(e) => setPackageFilter(e.target.value)}
              className="w-full bg-surface-900 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-brand-green"
            >
              <option value="all">All Packages</option>
              {availablePackages.map(pkg => (
                <option key={pkg.id} value={pkg.name}>
                  {pkg.name} ({pkg.duration_days} Days)
                </option>
              ))}
            </select>
          </div>

          {/* Customer Level Filter Dropdown */}
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Filter by Level</label>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="w-full bg-surface-900 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-brand-green"
            >
              <option value="all">All Customer Levels</option>
              {levels.map(lvl => (
                <option key={lvl.id} value={lvl.level_name}>
                  {lvl.level_name} Tier
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl overflow-hidden bg-surface-800 border border-white/5 shadow-xl">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-slate-400 font-medium">Loading total customers data...</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-slate-400 font-medium">
              {searchTerm || statusFilter !== 'all' || levelFilter !== 'all' || packageFilter !== 'all' 
                ? 'No customers match the selected filter criteria.' 
                : 'No customers found in database.'}
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-surface-850">
                <tr>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase">Customer & Tier</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase">Contact</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase">Status</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase">Assigned Packages</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map(customer => (
                  <tr key={customer.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-white text-base">{customer.full_name}</p>
                        {customer.level ? (
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                            customer.level.color === 'blue' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                            customer.level.color === 'green' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            customer.level.color === 'purple' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                            customer.level.color === 'amber' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                            customer.level.color === 'rose' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                            'bg-slate-500/10 text-slate-400 border-slate-500/20'
                          }`}>
                            {customer.level.level_name}
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border bg-white/5 text-slate-400 border-white/10">
                            Member
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-bold text-brand-green mt-0.5">{customer.customer_code}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-white font-medium">{customer.phone}</p>
                      <p className="text-xs text-slate-400">{customer.email || customer.facebook_name || '—'}</p>
                    </td>
                    <td className="py-4 px-6">
                      {customer.is_active ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-500/10 text-slate-400 border border-white/10">
                          <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      {customer.package_names && customer.package_names.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {customer.package_names.map((pkgName, i) => (
                            <span key={i} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/5 text-slate-300 border border-white/5">
                              {pkgName}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500 italic">No Active Plan</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right space-x-3 whitespace-nowrap">
                      <Link to={`/crm/customers/${customer.id}`} className="text-indigo-400 hover:text-indigo-300 font-bold text-xs bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20 transition-colors">
                        View Profile
                      </Link>
                      {user?.role !== 'marketing_junior' && (
                        <button onClick={() => setDeleteConfirmId(customer.id)} className="text-rose-400 hover:text-rose-300 font-bold text-xs">
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
