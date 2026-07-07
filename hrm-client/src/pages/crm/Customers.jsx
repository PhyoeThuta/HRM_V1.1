import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { useAuth } from '../../context/AuthContext';

const INITIAL_MOCK = [
  { id: 1, customer_code: 'BBD-001', full_name: 'Aung Aung', email: 'aung@gmail.com', phone: '09123456789', gender: 'Male', packages: 1 },
  { id: 2, customer_code: 'BBD-002', full_name: 'Mya Mya', email: 'mya@gmail.com', phone: '09876543210', gender: 'Female', packages: 2 },
  { id: 3, customer_code: 'BBD-003', full_name: 'Zaw Zaw', email: 'zaw@gmail.com', phone: '09777777777', gender: 'Male', packages: 0 },
];

export default function Customers() {
  const { user, isBoss } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    // Load from local storage or set initial mock
    const stored = localStorage.getItem('crm_customers');
    if (stored) {
      setCustomers(JSON.parse(stored));
    } else {
      setCustomers(INITIAL_MOCK);
      localStorage.setItem('crm_customers', JSON.stringify(INITIAL_MOCK));
    }
  }, []);

  return (
    <Layout title="Customers" subtitle="Manage all customer profiles and data">
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
          <button onClick={() => navigate('/crm/customers/new')} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all flex items-center gap-2">
            <span>+</span> New Customer
          </button>
        )}
      </div>

      <div className="rounded-2xl overflow-hidden bg-surface-800 border border-white/5 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-surface-850">
              <tr>
                <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase">Customer</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase">Contact</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase">Gender</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase text-center">Active Packages</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {customers.filter(c => c.full_name.toLowerCase().includes(searchTerm.toLowerCase())).map(customer => (
                <tr key={customer.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 px-6">
                    <p className="font-bold text-white text-base">{customer.full_name}</p>
                    <p className="text-xs font-bold text-brand-green mt-0.5">{customer.customer_code}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-white font-medium">{customer.phone}</p>
                    <p className="text-xs text-slate-400">{customer.email}</p>
                  </td>
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
                      <button className="text-rose-400 hover:text-rose-300 font-bold text-sm">Delete</button>
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
