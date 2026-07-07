import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { useAuth } from '../../context/AuthContext';

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isMarketingJunior, isBoss } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock Customer Data based on ER Diagram
  const customer = {
    id: id,
    customer_code: 'BBD-001',
    full_name: 'Aung Aung',
    facebook_name: 'Aung Aung (Gamer)',
    age: 28,
    gender: 'Male',
    email: 'aung@gmail.com',
    phone: '09123456789',
    address: 'Yangon, Myanmar',
    lifestyle: {
      food_restriction: 'No Beef, No Seafood',
      activity_level: 'Lightly Active (Office Job)',
      fasting_willingness: 'Yes, 16/8 Intermittent Fasting'
    },
    physical_status: {
      current_weight: '85 kg',
      goal_weight: '70 kg',
      height: '175 cm',
      time_frame: '3 Months'
    },
    health: {
      medical_condition: 'Mild Hypertension',
      other_condition: 'None',
      medicine_taking: 'Amlodipine 5mg',
      special_requests: 'Low sodium meals please'
    },
    packages: [
      { id: 101, name: '1 Month Boss Diet', duration: '30 Days', expires_at: '2026-08-07', meal_count: 60, meal_type: 'LUNCH, DINNER' }
    ],
    feedbacks: [
      { id: 1, type: 'post_purchase', text: 'Meals are great, but sometimes delivery is a bit late.', ai_flagged: false, date: '2026-07-01' }
    ]
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'lifestyle', label: 'Lifestyle' },
    { id: 'physical', label: 'Physical Status' },
    { id: 'health', label: 'Health' },
    { id: 'packages', label: 'Packages & Meals' },
    { id: 'feedback', label: 'Feedback' },
  ];

  return (
    <Layout title="Customer Profile" subtitle={`Details for ${customer.full_name}`}>
      
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => navigate('/crm/customers')} className="text-slate-400 hover:text-white flex items-center gap-2">
          ← Back to Customers
        </button>
        {(!isMarketingJunior() || isBoss()) && (
          <div className="flex gap-3">
            <button className="bg-surface-800 hover:bg-white/5 border border-white/10 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors">
              Edit Customer
            </button>
            <button className="bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 px-4 py-2 rounded-xl text-sm font-bold transition-colors">
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Header Card */}
      <div className="rounded-2xl p-6 bg-surface-800 border border-white/5 flex items-start gap-6 mb-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg flex-shrink-0">
          {customer.full_name.charAt(0)}
        </div>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-white">{customer.full_name}</h1>
            <span className="bg-brand-green/20 text-brand-green px-2.5 py-1 rounded-full text-xs font-bold">{customer.customer_code}</span>
          </div>
          <p className="text-slate-400 text-sm mb-4">Facebook: {customer.facebook_name}</p>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="text-slate-500">📞</span> {customer.phone}
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="text-slate-500">✉️</span> {customer.email}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-white/10 mb-6 pb-px scrollbar-hide">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-brand-green text-brand-green'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="rounded-2xl p-6 bg-surface-800 border border-white/5 min-h-[400px]">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-slate-500 mb-1">Age</p>
              <p className="text-white font-medium">{customer.age} Years</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Gender</p>
              <p className="text-white font-medium">{customer.gender}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-slate-500 mb-1">Address</p>
              <p className="text-white font-medium">{customer.address}</p>
            </div>
          </div>
        )}

        {activeTab === 'lifestyle' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <p className="text-xs text-slate-400 mb-1">Food Restrictions</p>
              <p className="text-white font-medium">{customer.lifestyle.food_restriction}</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <p className="text-xs text-slate-400 mb-1">Activity Level</p>
              <p className="text-white font-medium">{customer.lifestyle.activity_level}</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 md:col-span-2">
              <p className="text-xs text-slate-400 mb-1">Fasting Willingness</p>
              <p className="text-white font-medium">{customer.lifestyle.fasting_willingness}</p>
            </div>
          </div>
        )}

        {activeTab === 'physical' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-center">
              <p className="text-xs text-indigo-300 mb-1">Current Weight</p>
              <p className="text-2xl text-white font-bold">{customer.physical_status.current_weight}</p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
              <p className="text-xs text-emerald-300 mb-1">Goal Weight</p>
              <p className="text-2xl text-white font-bold">{customer.physical_status.goal_weight}</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
              <p className="text-xs text-slate-400 mb-1">Height</p>
              <p className="text-2xl text-white font-bold">{customer.physical_status.height}</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
              <p className="text-xs text-slate-400 mb-1">Time Frame</p>
              <p className="text-2xl text-white font-bold">{customer.physical_status.time_frame}</p>
            </div>
          </div>
        )}

        {activeTab === 'health' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
              <p className="text-xs text-rose-300 mb-1 font-bold">Medical Conditions</p>
              <p className="text-white font-medium">{customer.health.medical_condition}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <p className="text-xs text-slate-400 mb-1">Medicine Taking</p>
                <p className="text-white font-medium">{customer.health.medicine_taking}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <p className="text-xs text-slate-400 mb-1">Other Conditions</p>
                <p className="text-white font-medium">{customer.health.other_condition}</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <p className="text-xs text-amber-300 mb-1 font-bold">Special Requests (Chef Note)</p>
              <p className="text-white font-medium">{customer.health.special_requests}</p>
            </div>
          </div>
        )}

        {activeTab === 'packages' && (
          <div className="space-y-4">
            {customer.packages.map(pkg => (
              <div key={pkg.id} className="p-5 rounded-2xl bg-white/5 border border-white/10 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{pkg.name}</h3>
                  <p className="text-sm text-slate-400">Duration: {pkg.duration} • Expires: {pkg.expires_at}</p>
                </div>
                <div className="text-right">
                  <span className="bg-brand-green/20 text-brand-green px-3 py-1 rounded-full text-xs font-bold block mb-2">Active</span>
                  <p className="text-xs text-slate-300">{pkg.meal_count} Meals ({pkg.meal_type})</p>
                </div>
              </div>
            ))}
            {!isMarketingJunior() && (
              <button className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl text-slate-400 hover:text-white hover:border-white/30 transition-colors font-bold text-sm">
                + Assign New Package
              </button>
            )}
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="space-y-4">
            {customer.feedbacks.map(fb => (
              <div key={fb.id} className={`p-5 rounded-2xl border ${fb.ai_flagged ? 'bg-rose-500/10 border-rose-500/30' : 'bg-white/5 border-white/10'}`}>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs text-slate-400 uppercase font-bold">{fb.type.replace('_', ' ')}</span>
                  <span className="text-xs text-slate-500">{fb.date}</span>
                </div>
                <p className="text-white text-sm">{fb.text}</p>
                {fb.ai_flagged && <p className="text-xs font-bold text-rose-400 mt-3">⚠️ AI Flagged for Review</p>}
              </div>
            ))}
          </div>
        )}

      </div>
    </Layout>
  );
}
