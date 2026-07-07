import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import toast from 'react-hot-toast';

export default function CustomerForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    full_name: '',
    facebook_name: '',
    age: '',
    gender: 'Female',
    email: '',
    phone: '',
    address: '',
    // Lifestyle
    food_restriction: '',
    activity_level: 'Sedentary',
    fasting_willingness: 'No',
    // Physical
    current_weight: '',
    goal_weight: '',
    height: '',
    time_frame: '',
    // Health
    medical_condition: '',
    other_condition: '',
    medicine_taking: '',
    special_requests: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
      // 1. Get existing customers from localStorage
      const existing = JSON.parse(localStorage.getItem('crm_customers') || '[]');
      
      // 2. Format new customer matching the table/detail structure
      const newCustomer = {
        id: Date.now(),
        customer_code: `BBD-00${existing.length + 4}`,
        full_name: formData.full_name,
        facebook_name: formData.facebook_name,
        age: formData.age,
        gender: formData.gender,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        packages: 0, // Default active packages
        lifestyle: {
          food_restriction: formData.food_restriction || 'None',
          activity_level: formData.activity_level,
          fasting_willingness: formData.fasting_willingness
        },
        physical_status: {
          current_weight: `${formData.current_weight} kg`,
          goal_weight: `${formData.goal_weight} kg`,
          height: `${formData.height} cm`,
          time_frame: formData.time_frame
        },
        health: {
          medical_condition: formData.medical_condition || 'None',
          other_condition: formData.other_condition || 'None',
          medicine_taking: formData.medicine_taking || 'None',
          special_requests: formData.special_requests || 'None'
        },
        feedbacks: [],
        packages_list: []
      };

      // 3. Save back to localStorage
      localStorage.setItem('crm_customers', JSON.stringify([newCustomer, ...existing]));
      
      setIsSubmitting(false);
      toast.success('Customer profile created successfully!');
      navigate('/crm/customers');
    }, 800); // 800ms fake delay
  };

  return (
    <Layout title="Add New Customer" subtitle="Create a comprehensive CRM profile">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/crm/customers')} className="w-10 h-10 rounded-full bg-surface-800 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all">
            ←
          </button>
          <h2 className="text-xl font-bold text-white">Customer Enrollment Form</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Basic Info Section */}
          <div className="bg-surface-800 p-8 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
            <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2">
              <span className="text-indigo-400">01.</span> Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Full Name *</label>
                <input required name="full_name" value={formData.full_name} onChange={handleChange} type="text" className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" placeholder="e.g. Aung Aung" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Facebook Name</label>
                <input name="facebook_name" value={formData.facebook_name} onChange={handleChange} type="text" className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" placeholder="e.g. Aung (Gamer)" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Age *</label>
                  <input required name="age" value={formData.age} onChange={handleChange} type="number" className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" placeholder="e.g. 28" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Gender *</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors">
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Phone Number *</label>
                <input required name="phone" value={formData.phone} onChange={handleChange} type="tel" className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" placeholder="e.g. 09123456789" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-400 mb-2">Delivery Address *</label>
                <textarea required name="address" value={formData.address} onChange={handleChange} rows="2" className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" placeholder="Full address for meal delivery"></textarea>
              </div>
            </div>
          </div>

          {/* Physical & Health Section */}
          <div className="bg-surface-800 p-8 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
            <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2">
              <span className="text-emerald-400">02.</span> Physical & Health Profile
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Current Weight (kg) *</label>
                <input required name="current_weight" value={formData.current_weight} onChange={handleChange} type="number" step="0.1" className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Goal Weight (kg) *</label>
                <input required name="goal_weight" value={formData.goal_weight} onChange={handleChange} type="number" step="0.1" className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Height (cm) *</label>
                <input required name="height" value={formData.height} onChange={handleChange} type="number" className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Medical Conditions</label>
                <input name="medical_condition" value={formData.medical_condition} onChange={handleChange} type="text" className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" placeholder="e.g. Diabetes, Hypertension" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Medicine Taking</label>
                <input name="medicine_taking" value={formData.medicine_taking} onChange={handleChange} type="text" className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" placeholder="List any medications" />
              </div>
            </div>
          </div>

          {/* Lifestyle Section */}
          <div className="bg-surface-800 p-8 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-500"></div>
            <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2">
              <span className="text-amber-400">03.</span> Lifestyle & Diet Prep
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Food Restrictions / Allergies</label>
                <textarea name="food_restriction" value={formData.food_restriction} onChange={handleChange} rows="2" className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors" placeholder="e.g. No Pork, Seafood allergy"></textarea>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Special Chef Requests</label>
                <textarea name="special_requests" value={formData.special_requests} onChange={handleChange} rows="2" className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors" placeholder="e.g. Less salty, no spicy"></textarea>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Activity Level</label>
                <select name="activity_level" value={formData.activity_level} onChange={handleChange} className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors">
                  <option>Sedentary (Little to no exercise)</option>
                  <option>Lightly Active (Office Job)</option>
                  <option>Moderately Active (3-5 days/wk)</option>
                  <option>Very Active (6-7 days/wk)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Fasting Willingness</label>
                <select name="fasting_willingness" value={formData.fasting_willingness} onChange={handleChange} className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors">
                  <option>No, prefer regular meals</option>
                  <option>Yes, 12/12 Fasting</option>
                  <option>Yes, 16/8 Intermittent Fasting</option>
                  <option>Yes, OMAD (One Meal A Day)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 pb-12">
            <button type="button" onClick={() => navigate('/crm/customers')} className="px-6 py-3 rounded-xl font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-8 py-3 rounded-xl font-black text-black bg-brand-green hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center gap-2">
              {isSubmitting ? (
                <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
              ) : 'Save Customer Profile'}
            </button>
          </div>

        </form>
      </div>
    </Layout>
  );
}
