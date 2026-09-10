import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function CustomerUpdateAddress() {
  const [searchParams] = useSearchParams();
  const customerId = searchParams.get('id') || searchParams.get('customer');
  const [customer, setCustomer] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [parsedAddress, setParsedAddress] = useState(null);
  const [isParsingAddress, setIsParsingAddress] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.removeAttribute('data-theme');

    if (!customerId) {
      setErrorMsg('Invalid or missing customer identifier.');
      setIsLoading(false);
      return;
    }

    const fetchCustomer = async () => {
      try {
        const res = await fetch(`/api/enroll/update-address/${customerId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load customer profile');

        setCustomer(data.customer);
        setDeliveryAddress(data.customer.delivery_address || data.customer.address || '');
        setDeliveryNotes(data.customer.delivery_notes || '');
      } catch (err) {
        setErrorMsg(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomer();
  }, [customerId]);

  const checkAndParseMapsLink = async (value) => {
    if (!value || typeof value !== 'string') {
      setParsedAddress(null);
      return;
    }

    const mapsUrlRegex = /https?:\/\/(www\.)?(google\.com\/maps|maps\.app\.goo\.gl|goo\.gl\/maps|g\.co\/maps)[^\s]+/i;
    const match = value.match(mapsUrlRegex);

    if (match) {
      const urlToParse = match[0];
      setIsParsingAddress(true);
      try {
        const res = await fetch('/api/enroll/parse-maps-link', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: urlToParse })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setParsedAddress({
            formatted_address: data.formatted_address,
            lat: data.lat,
            lng: data.lng,
            url: urlToParse
          });
        } else {
          setParsedAddress({ error: data.error || 'Unable to parse map link' });
        }
      } catch (err) {
        setParsedAddress({ error: 'Failed to contact geocoding service' });
      } finally {
        setIsParsingAddress(false);
      }
    } else {
      setParsedAddress(null);
    }
  };

  const handleAddressChange = (e) => {
    const val = e.target.value;
    setDeliveryAddress(val);
    checkAndParseMapsLink(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        delivery_address: parsedAddress?.formatted_address || deliveryAddress,
        delivery_notes: deliveryNotes,
        maps_url: parsedAddress?.url || (deliveryAddress.startsWith('http') ? deliveryAddress : null)
      };

      const res = await fetch(`/api/enroll/update-address/${customerId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update address');

      setIsSuccess(true);
      toast.success('Your delivery address has been updated successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to update address. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-surface-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-green/20 border-t-brand-green rounded-full animate-spin"></div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Loading Profile...</p>
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
        <div className="relative z-10 w-full max-w-md px-4">
          <div className="bg-white/90 dark:bg-surface-800/80 backdrop-blur-xl p-10 rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl text-center">
            <div className="w-20 h-20 bg-brand-green/10 text-brand-green rounded-full flex items-center justify-center mx-auto mb-6 border border-brand-green/30 shadow-[0_0_30px_rgba(163,184,31,0.3)]">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Address Updated! <br/> လိပ်စာပြင်ဆင်ပြီးပါပြီ</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-3">Your new delivery address has been updated for our Kitchen & Delivery Riders.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50 dark:bg-surface-950 py-12 px-4 flex justify-center">
      <div className="fixed w-[500px] h-[500px] rounded-full opacity-10 animate-pulse" style={{ background: '#A3B81F', filter: 'blur(120px)', top: '-20%', left: '-10%' }} />
      
      <div className="max-w-xl w-full relative z-10">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="Busy Boss Diet Logo" className="w-16 h-16 object-contain rounded-2xl shadow-[0_0_20px_rgba(163,184,31,0.3)] bg-white p-1 mx-auto mb-4" />
          <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-1">Busy Boss Diet</h1>
          <p className="text-brand-green font-bold text-xs uppercase tracking-widest mb-3">Update Delivery Address</p>
          <p className="text-slate-500 dark:text-slate-400 text-xs">
            Customer: <b className="text-slate-800 dark:text-slate-200">{customer?.full_name}</b> ({customer?.customer_code})
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/90 dark:bg-surface-800/80 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-white/10 shadow-2xl space-y-6">
          
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2 uppercase tracking-wider">
              New Delivery Address / Google Maps Link *
            </label>
            <textarea
              required
              rows="3"
              value={deliveryAddress}
              onChange={handleAddressChange}
              placeholder="Paste Google Maps Link or type full text address..."
              className="w-full bg-slate-50 dark:bg-surface-900/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green text-sm resize-none"
            />
            {isParsingAddress && (
              <div className="mt-2 flex items-center gap-2 text-xs text-brand-green font-medium animate-pulse">
                <span className="w-3 h-3 border-2 border-brand-green border-t-transparent rounded-full animate-spin"></span>
                Detecting Google Maps Link & Fetching Address Details...
              </div>
            )}
            {parsedAddress?.formatted_address && (
              <div className="mt-2.5 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
                <svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <span className="font-bold block text-emerald-900 dark:text-emerald-200 mb-0.5">Detected Map Address (အသေးစိတ်လိပ်စာ):</span>
                  <span>{parsedAddress.formatted_address}</span>
                </div>
              </div>
            )}
            {parsedAddress?.error && (
              <div className="mt-2 text-xs text-amber-500 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {parsedAddress.error}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2 uppercase tracking-wider">
              Delivery Notes (Optional)
            </label>
            <input
              type="text"
              value={deliveryNotes}
              onChange={(e) => setDeliveryNotes(e.target.value)}
              placeholder="e.g. Changed to Condo 5th floor, call when arrived"
              className="w-full bg-slate-50 dark:bg-surface-900/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-xl font-black text-black text-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 hover:scale-[1.01] active:scale-[0.99]"
            style={{ background: 'linear-gradient(135deg, #A3B81F, #829319)', boxShadow: '0 0 20px rgba(163,184,31,0.3)' }}
          >
            {isSubmitting ? 'Updating Address...' : 'Confirm Update Address'}
          </button>
        </form>
      </div>
    </div>
  );
}
