import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function CustomerEnrollment() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [schema, setSchema] = useState([]);
  const [inquiry, setInquiry] = useState(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({});

  useEffect(() => {
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
        
        setSchema(data.schema || []);
        setInquiry(data.inquiry);

        // Pre-fill initial form data based on schema defaults
        const initialData = {};
        if (data.schema) {
          data.schema.forEach(field => {
            if (field.type === 'checkbox') {
              initialData[field.id] = false;
            } else if (field.type === 'dropdown' && field.options && field.options.length > 0) {
              initialData[field.id] = field.options[0];
            } else {
              initialData[field.id] = '';
            }
          });
        }
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
      if (!res.ok) throw new Error(data.error || 'Failed to submit form');
      
      setIsSuccess(true);
      toast.success('Your profile has been submitted successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-surface-950 flex items-center justify-center text-white">Loading form...</div>;
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen bg-surface-950 flex items-center justify-center p-4">
        <div className="bg-surface-800 p-8 rounded-3xl border border-white/10 text-center max-w-md w-full shadow-2xl">
          <h2 className="text-2xl font-black text-rose-500 mb-2">Error</h2>
          <p className="text-slate-300">{errorMsg}</p>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center overflow-hidden relative bg-surface-950">
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
            <p className="text-slate-400">Your details have been securely submitted. You are now officially enrolled in our program.</p>
          </div>
        </div>
      </div>
    );
  }

  const renderField = (field) => {
    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            required={field.required}
            value={formData[field.id] || ''}
            onChange={e => handleChange(field.id, e.target.value)}
            rows="3"
            className="w-full bg-surface-900/50 border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all shadow-inner resize-none"
          />
        );
      case 'dropdown':
        return (
          <select
            required={field.required}
            value={formData[field.id] || ''}
            onChange={e => handleChange(field.id, e.target.value)}
            className="w-full bg-surface-900/50 border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all shadow-inner appearance-none"
          >
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
              className="w-5 h-5 text-brand-green bg-surface-900 border-white/10 rounded focus:ring-brand-green focus:ring-offset-surface-900 transition-all"
            />
            <span className="text-sm font-medium text-slate-300">Yes, I agree</span>
          </div>
        );
      default: // text, number
        return (
          <input
            type={field.type}
            required={field.required}
            value={formData[field.id] || ''}
            onChange={e => handleChange(field.id, e.target.value)}
            className="w-full bg-surface-900/50 border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all shadow-inner"
          />
        );
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-surface-950 py-12 px-4 flex justify-center">
      
      {/* Animated Background Orbs */}
      <div className="fixed w-[500px] h-[500px] rounded-full opacity-10 animate-pulse" style={{ background: '#A3B81F', filter: 'blur(120px)', top: '-20%', left: '-10%' }} />
      <div className="fixed w-[400px] h-[400px] rounded-full opacity-10 animate-pulse" style={{ background: '#FF7700', filter: 'blur(100px)', bottom: '-10%', right: '-5%', animationDelay: '2s' }} />
      
      {/* Grid background */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg,rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="max-w-2xl w-full relative z-10">
        <div className="text-center mb-10">
          <img src="/logo.png" alt="Busy Boss Diet Logo" className="w-20 h-20 object-contain rounded-2xl shadow-[0_0_20px_rgba(163,184,31,0.3)] bg-white p-1 mx-auto mb-6" />
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Busy Boss Diet</h1>
          <p className="text-brand-green font-bold text-lg uppercase tracking-widest mb-4">Customer Enrollment</p>
          <p className="text-slate-400 text-sm">
            Hi <b>{inquiry?.prospect_name || 'Customer'}</b>,<br/>
            Please fill out your details to finalize your enrollment for <b>{inquiry?.package?.name || 'the package'}</b>.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="bg-surface-800/80 backdrop-blur-xl p-6 sm:p-10 rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-green via-brand-orange to-brand-green bg-[length:200%_auto] animate-gradient opacity-70 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="space-y-6">
              {schema.map((field) => (
                <div key={field.id} className="w-full">
                  <label className="block text-sm font-bold text-white mb-2 tracking-wide">
                    {field.label} {field.required && <span className="text-brand-orange">*</span>}
                  </label>
                  {renderField(field)}
                </div>
              ))}
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
