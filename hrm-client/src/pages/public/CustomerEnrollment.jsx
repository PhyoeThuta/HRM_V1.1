import { useState } from 'react';
import toast from 'react-hot-toast';

export default function CustomerEnrollment() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    full_name: '',
    facebook_name: '',
    age: '',
    gender: 'Female',
    email: '',
    phone: '',
    address: '',
    delivery_address: '',
    delivery_notes: '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/public/crm/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit form');
      
      setIsSuccess(true);
      toast.success('Your profile has been submitted successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to submit. Please try again.');
      console.error('[Public Enrollment]', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-black text-white p-6 flex items-center justify-center">
        <div className="bg-surface-800 p-8 rounded-3xl border border-white/10 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-brand-green/20 text-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-black mb-2">Thank You!</h2>
          <p className="text-slate-400 mb-6">Your details have been securely submitted to Busy Boss Diet. Our team will contact you shortly.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black bg-gradient-to-r from-brand-green to-emerald-400 bg-clip-text text-transparent">Busy Boss Diet</h1>
          <p className="text-slate-400 mt-2">New Customer Enrollment Form</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Basic Info Section */}
          <div className="bg-surface-800 p-6 rounded-3xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
            <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2">
              <span className="text-indigo-400">01.</span> Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Full Name *</label>
                <input required name="full_name" value={formData.full_name} onChange={handleChange} type="text" className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" placeholder="e.g. Aung Aung" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Phone Number *</label>
                <input required name="phone" value={formData.phone} onChange={handleChange} type="tel" className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" placeholder="e.g. 09123456789" />
              </div>
              <div className="grid grid-cols-2 gap-4 md:col-span-2">
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Age</label>
                  <input name="age" value={formData.age} onChange={handleChange} type="number" className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" placeholder="e.g. 28" />
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
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-400 mb-2">Delivery Address *</label>
                <textarea required name="delivery_address" value={formData.delivery_address} onChange={handleChange} rows="2" className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" placeholder="Full address for meal delivery"></textarea>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-400 mb-2">Delivery Notes (Optional)</label>
                <input name="delivery_notes" value={formData.delivery_notes} onChange={handleChange} type="text" className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" placeholder="e.g. Leave at security gate, call when arrived" />
              </div>
            </div>
          </div>

          {/* Physical & Health Section */}
          <div className="bg-surface-800 p-6 rounded-3xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
            <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2">
              <span className="text-emerald-400">02.</span> Physical & Health Profile
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Current Weight (kg) *</label>
                <input required name="current_weight" value={formData.current_weight} onChange={handleChange} type="number" step="0.1" className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Goal Weight (kg) *</label>
                <input required name="goal_weight" value={formData.goal_weight} onChange={handleChange} type="number" step="0.1" className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-400 mb-2">Height (cm) *</label>
                <input required name="height" value={formData.height} onChange={handleChange} type="number" className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Medical Conditions (If any)</label>
                <input name="medical_condition" value={formData.medical_condition} onChange={handleChange} type="text" className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" placeholder="e.g. Diabetes, Hypertension, None" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Taking any medicine? (If any)</label>
                <input name="medicine_taking" value={formData.medicine_taking} onChange={handleChange} type="text" className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" placeholder="List any medications" />
              </div>
            </div>
          </div>

          {/* Lifestyle Section */}
          <div className="bg-surface-800 p-6 rounded-3xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-500"></div>
            <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2">
              <span className="text-amber-400">03.</span> Lifestyle & Diet Prep
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
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
            </div>
          </div>

          <div className="pb-12">
            <button type="submit" disabled={isSubmitting} className="w-full py-4 rounded-xl font-black text-black bg-brand-green hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2">
              {isSubmitting ? (
                <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
              ) : 'Submit Profile'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
