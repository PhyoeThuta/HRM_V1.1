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
      <div className="min-h-screen flex items-center justify-center overflow-hidden relative bg-surface-950">
        {/* Animated Background Orbs */}
        <div className="absolute w-96 h-96 rounded-full opacity-20 animate-pulse" style={{ background: '#A3B81F', filter: 'blur(100px)', top: '-10%', left: '-10%' }} />
        <div className="absolute w-72 h-72 rounded-full opacity-20 animate-pulse" style={{ background: '#FF7700', filter: 'blur(100px)', bottom: '-10%', right: '10%', animationDelay: '2s' }} />
        
        <div className="relative z-10 w-full max-w-md px-4">
          <div className="bg-surface-800/80 backdrop-blur-xl p-10 rounded-3xl border border-white/10 shadow-2xl text-center">
            <div className="w-20 h-20 bg-brand-green/20 text-brand-green rounded-full flex items-center justify-center mx-auto mb-6 border border-brand-green/30 shadow-[0_0_30px_rgba(163,184,31,0.3)]">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-black text-white mb-3">Welcome! <br/> ကြိုဆိုပါတယ်</h2>
            <p className="text-slate-400">Your details have been securely submitted to Busy Boss Diet. Our team will contact you shortly.</p>
          </div>
        </div>
      </div>
    );
  }

  const InputField = ({ label, name, type = "text", required, placeholder, ...props }) => (
    <div>
      <label className="block text-sm font-bold text-white mb-2 tracking-wide">{label} {required && <span className="text-brand-orange">*</span>}</label>
      <input 
        required={required} 
        name={name} 
        value={formData[name]} 
        onChange={handleChange} 
        type={type} 
        className="w-full bg-surface-900/50 border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all shadow-inner" 
        placeholder={placeholder}
        {...props}
      />
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden bg-surface-950 py-12 px-4 flex justify-center">
      
      {/* Animated Background Orbs */}
      <div className="fixed w-[500px] h-[500px] rounded-full opacity-10 animate-pulse" style={{ background: '#A3B81F', filter: 'blur(120px)', top: '-20%', left: '-10%' }} />
      <div className="fixed w-[400px] h-[400px] rounded-full opacity-10 animate-pulse" style={{ background: '#FF7700', filter: 'blur(100px)', bottom: '-10%', right: '-5%', animationDelay: '2s' }} />
      
      {/* Grid background */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg,rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="max-w-3xl w-full relative z-10">
        <div className="text-center mb-10">
          <img src="/logo.png" alt="Busy Boss Diet Logo" className="w-20 h-20 object-contain rounded-2xl shadow-[0_0_20px_rgba(163,184,31,0.3)] bg-white p-1 mx-auto mb-6" />
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Busy Boss Diet</h1>
          <p className="text-brand-green font-bold text-lg uppercase tracking-widest mb-4">Customer Enrollment</p>
          <p className="text-slate-400 text-sm">Welcome to our premium meal prep service. <br/> လူကြီးမင်း၏ အချက်အလက်များကို ဖြည့်စွက်ပေးပါ။</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Basic Info Section */}
          <div className="bg-surface-800/80 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-green via-brand-orange to-brand-green bg-[length:200%_auto] animate-gradient opacity-70 group-hover:opacity-100 transition-opacity"></div>
            
            <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-brand-green/20 text-brand-green flex items-center justify-center text-sm border border-brand-green/30 shadow-[0_0_15px_rgba(163,184,31,0.2)]">1</span>
              Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Full Name (အမည်)" name="full_name" required placeholder="e.g. Aung Aung" />
              <InputField label="Phone Number (ဖုန်းနံပါတ်)" name="phone" type="tel" required placeholder="e.g. 09123456789" />
              
              <div className="grid grid-cols-2 gap-6 md:col-span-2">
                <InputField label="Age (အသက်)" name="age" type="number" placeholder="e.g. 28" />
                <div>
                  <label className="block text-sm font-bold text-white mb-2 tracking-wide">Gender (ကျား/မ) <span className="text-brand-orange">*</span></label>
                  <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-surface-900/50 border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all shadow-inner">
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-white mb-2 tracking-wide">Delivery Address (ပို့ဆောင်ရမည့်လိပ်စာ) <span className="text-brand-orange">*</span></label>
                <textarea required name="delivery_address" value={formData.delivery_address} onChange={handleChange} rows="2" className="w-full bg-surface-900/50 border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all shadow-inner resize-none" placeholder="Full address for meal delivery"></textarea>
              </div>
              
              <div className="md:col-span-2">
                <InputField label="Delivery Notes (မှတ်ချက် - Optional)" name="delivery_notes" placeholder="e.g. Leave at security gate, call when arrived" />
              </div>
            </div>
          </div>

          {/* Physical & Health Section */}
          <div className="bg-surface-800/80 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-green via-brand-orange to-brand-green bg-[length:200%_auto] animate-gradient opacity-70 group-hover:opacity-100 transition-opacity"></div>
            
            <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-brand-green/20 text-brand-green flex items-center justify-center text-sm border border-brand-green/30 shadow-[0_0_15px_rgba(163,184,31,0.2)]">2</span>
              Physical & Health Profile
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <InputField label="Current Weight (kg)" name="current_weight" type="number" step="0.1" required />
              <InputField label="Goal Weight (kg)" name="goal_weight" type="number" step="0.1" required />
              <div className="md:col-span-2">
                <InputField label="Height (cm)" name="height" type="number" required />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <InputField label="Medical Conditions (ရောဂါအခံ ရှိ/မရှိ)" name="medical_condition" placeholder="e.g. Diabetes, Hypertension, None" />
              <InputField label="Taking any medicine? (သောက်နေသော ဆေးဝါးများ)" name="medicine_taking" placeholder="List any medications or None" />
            </div>
          </div>

          {/* Lifestyle Section */}
          <div className="bg-surface-800/80 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-green via-brand-orange to-brand-green bg-[length:200%_auto] animate-gradient opacity-70 group-hover:opacity-100 transition-opacity"></div>
            
            <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-brand-green/20 text-brand-green flex items-center justify-center text-sm border border-brand-green/30 shadow-[0_0_15px_rgba(163,184,31,0.2)]">3</span>
              Lifestyle & Diet Prep
            </h3>
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-bold text-white mb-2 tracking-wide">Food Restrictions / Allergies (မတည့်သော အစားအသောက်)</label>
                <textarea name="food_restriction" value={formData.food_restriction} onChange={handleChange} rows="2" className="w-full bg-surface-900/50 border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all shadow-inner resize-none" placeholder="e.g. No Pork, Seafood allergy"></textarea>
              </div>
              <div>
                <label className="block text-sm font-bold text-white mb-2 tracking-wide">Special Chef Requests</label>
                <textarea name="special_requests" value={formData.special_requests} onChange={handleChange} rows="2" className="w-full bg-surface-900/50 border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all shadow-inner resize-none" placeholder="e.g. Less salty, no spicy"></textarea>
              </div>
              <div>
                <label className="block text-sm font-bold text-white mb-2 tracking-wide">Activity Level</label>
                <select name="activity_level" value={formData.activity_level} onChange={handleChange} className="w-full bg-surface-900/50 border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all shadow-inner">
                  <option>Sedentary (Little to no exercise)</option>
                  <option>Lightly Active (Office Job)</option>
                  <option>Moderately Active (3-5 days/wk)</option>
                  <option>Very Active (6-7 days/wk)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 pb-12">
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full py-5 rounded-2xl font-black text-black text-xl transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #A3B81F, #829319)', boxShadow: '0 0 30px rgba(163,184,31,0.3)' }}
            >
              {isSubmitting ? (
                <>
                  <span className="w-6 h-6 border-4 border-black/20 border-t-black rounded-full animate-spin"></span>
                  Submitting Profile...
                </>
              ) : (
                <>
                  Submit Enrollment 
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
