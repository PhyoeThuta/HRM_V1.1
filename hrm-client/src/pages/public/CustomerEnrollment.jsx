import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function CustomerEnrollment() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [inquiry, setInquiry] = useState(null);
  const [schema, setSchema] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    // Remove the forced dark mode hack to respect the user's system theme and BBD brand colors
    document.documentElement.classList.remove('dark');
    document.documentElement.removeAttribute('data-theme');
    
    if (!token) {
      setErrorMsg('Invalid or missing token.');
      setIsLoading(false);
      return;
    }

    const fetchForm = async () => {
      try {
        const res = await fetch(`/api/enroll/${token}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load form');

        setInquiry(data.inquiry);
        setSchema(data.schema || []);
        
        const initialData = {};
        if (data.inquiry?.prospect_name) initialData.name = data.inquiry.prospect_name;
        
        // Initialize dropdowns with first option if required and no placeholder fallback
        (data.schema || []).forEach(field => {
            if (field.type === 'dropdown' && field.options?.length > 0 && field.required && !field.placeholder) {
                initialData[field.id] = field.options[0];
            }
        });
        
        setFormData(initialData);
      } catch (err) {
        setErrorMsg(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchForm();
  }, [token]);

  const handleChange = (id, value) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/enroll/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit enrollment');
      
      setIsSuccess(true);
      toast.success('Your profile has been submitted successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-surface-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-green/20 border-t-brand-green rounded-full animate-spin"></div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Loading Form...</p>
        </div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-surface-950 p-4">
        <div className="bg-white dark:bg-surface-800 p-8 rounded-2xl max-w-md w-full text-center border border-red-100 dark:border-red-900/30 shadow-xl">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Error</h2>
          <p className="text-slate-500 dark:text-slate-400">{errorMsg}</p>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center overflow-hidden relative bg-slate-50 dark:bg-surface-950">
        <div className="absolute w-96 h-96 rounded-full opacity-20 animate-pulse" style={{ background: '#A3B81F', filter: 'blur(100px)', top: '-10%', left: '-10%' }} />
        <div className="absolute w-72 h-72 rounded-full opacity-20 animate-pulse" style={{ background: '#FF7700', filter: 'blur(100px)', bottom: '-10%', right: '10%', animationDelay: '2s' }} />
        
        <div className="relative z-10 w-full max-w-md px-4">
          <div className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-xl p-10 rounded-3xl border border-white/50 dark:border-white/10 shadow-2xl text-center">
            <div className="w-20 h-20 bg-brand-green/10 dark:bg-brand-green/20 text-brand-green rounded-full flex items-center justify-center mx-auto mb-6 border border-brand-green/30 shadow-[0_0_30px_rgba(163,184,31,0.3)]">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-3">Welcome! <br/> ကြိုဆိုပါတယ်</h2>
            <p className="text-slate-500 dark:text-slate-400">Your details have been securely submitted. You are now officially enrolled in our program.</p>
          </div>
        </div>
      </div>
    );
  }

  const renderField = (field) => {
    const commonClasses = "w-full bg-slate-50 dark:bg-surface-900/50 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 text-sm shadow-sm dark:shadow-inner";
    
    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            required={field.required}
            value={formData[field.id] || ''}
            onChange={e => handleChange(field.id, e.target.value)}
            rows="2"
            placeholder={field.placeholder || ''}
            className={`${commonClasses} resize-none`}
          />
        );
      case 'dropdown':
        return (
          <select
            required={field.required}
            value={formData[field.id] || ''}
            onChange={e => handleChange(field.id, e.target.value)}
            className={`${commonClasses} appearance-none`}
          >
            <option value="" disabled hidden>{field.placeholder || 'Select an option'}</option>
            {field.options?.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
          </select>
        );
      case 'checkbox':
        return (
          <div className="flex items-center gap-3 mt-2">
            <input
              type="checkbox"
              required={field.required}
              checked={formData[field.id] || false}
              onChange={e => handleChange(field.id, e.target.checked)}
              className="w-5 h-5 text-brand-green bg-white dark:bg-surface-900 border-slate-300 dark:border-white/10 rounded focus:ring-brand-green focus:ring-offset-2 dark:focus:ring-offset-surface-900 transition-all"
            />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Yes, I agree</span>
          </div>
        );
      case 'date':
        return (
          <input
            type="date"
            required={field.required}
            value={formData[field.id] || ''}
            onChange={e => handleChange(field.id, e.target.value)}
            className={`${commonClasses} dark:[color-scheme:dark]`}
          />
        );
      default: // text, number
        return (
          <input
            type={field.type}
            required={field.required}
            value={formData[field.id] || ''}
            onChange={e => handleChange(field.id, e.target.value)}
            placeholder={field.placeholder || ''}
            className={commonClasses}
          />
        );
    }
  };

  // Group schema fields by section
  const groupedSchema = schema.reduce((acc, field) => {
    const section = field.section || '01. General';
    if (!acc[section]) acc[section] = [];
    acc[section].push(field);
    return acc;
  }, {});

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50 dark:bg-surface-950 py-12 px-4 flex justify-center">
      
      {/* Animated Background Orbs */}
      <div className="fixed w-[500px] h-[500px] rounded-full opacity-10 animate-pulse" style={{ background: '#A3B81F', filter: 'blur(120px)', top: '-20%', left: '-10%' }} />
      <div className="fixed w-[400px] h-[400px] rounded-full opacity-10 animate-pulse" style={{ background: '#FF7700', filter: 'blur(100px)', bottom: '-10%', right: '-5%', animationDelay: '2s' }} />
      
      {/* Grid background */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg,rgba(0,0,0,1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none hidden dark:block" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg,rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="max-w-3xl w-full relative z-10">
        <div className="text-center mb-10">
          <img src="/logo.png" alt="Busy Boss Diet Logo" className="w-20 h-20 object-contain rounded-2xl shadow-[0_0_20px_rgba(163,184,31,0.3)] bg-white p-1 mx-auto mb-6" />
          <h1 className="text-4xl font-black text-slate-800 dark:text-white mb-2 tracking-tight">Busy Boss Diet</h1>
          <p className="text-brand-green font-bold text-lg uppercase tracking-widest mb-4">Customer Enrollment</p>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Hi <b className="text-slate-700 dark:text-slate-200">{inquiry?.prospect_name || 'Customer'}</b>,<br/>
            Please fill out your details to finalize your enrollment for <b className="text-slate-700 dark:text-slate-200">{inquiry?.package?.name || 'the package'}</b>.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {Object.entries(groupedSchema).map(([sectionName, fields], sectionIndex) => {
            // Accent colors based on screenshot: Yellow, Green, Orange
            const colors = ['bg-[#fbbf24]', 'bg-[#34d399]', 'bg-[#f97316]'];
            const borderColor = colors[sectionIndex % colors.length];

            const [sectionNum, ...sectionTitleParts] = sectionName.split('.');
            const sectionTitle = sectionTitleParts.join('.').trim() || sectionNum;

            return (
              <div key={sectionName} className="bg-white/90 dark:bg-surface-800/80 backdrop-blur-xl rounded-xl overflow-hidden shadow-2xl relative border border-slate-200 dark:border-white/5">
                <div className={`absolute top-0 left-0 w-full h-[5px] ${borderColor}`}></div>
                
                <div className="p-6 sm:p-8">
                  <h3 className="text-lg font-black text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                    <span className={borderColor.replace('bg-', 'text-')}>{sectionNum}.</span>
                    {sectionTitle}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                    {fields.map((field) => {
                      let colSpan = 'md:col-span-12';
                      if (field.width === 'half') colSpan = 'md:col-span-6';
                      else if (field.width === 'third') colSpan = 'md:col-span-4';

                      return (
                        <div key={field.id} className={`col-span-1 ${colSpan}`}>
                          <label className="block text-xs font-bold text-slate-500 dark:text-[#8b9bc1] mb-2 tracking-wide">
                            {field.label} {field.required && <span className="text-brand-orange">*</span>}
                          </label>
                          {renderField(field)}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}

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
