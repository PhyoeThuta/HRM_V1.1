import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  computeBMI,
  computeRecommendedWeightRange,
  evaluateTargetWeightBoundary,
  normalizeHeightToCm,
  normalizeHeightToMeters,
  normalizeWeightToKg,
  convertKgToUnit,
  convertCmToUnit,
} from '../../utils/bbdHealthCalculator';

// ─────────────────────────────────────────────────────────────
// BBD Health Advisor Card (Live Reactive Component)
// ─────────────────────────────────────────────────────────────
function BBDHealthAdvisorCard({ formData, heightUnit, weightUnit, heightFt, heightIn, onUseRecommended }) {
  const calc = useMemo(() => {
    const { height, current_weight, age, gender, activity_level, fasting_willingness } = formData;
    
    const heightCm = normalizeHeightToCm(height, heightUnit, heightFt, heightIn);
    const currentWeightKg = normalizeWeightToKg(current_weight, weightUnit);

    if (!heightCm || !currentWeightKg) return null;

    const range = computeRecommendedWeightRange({
      heightCm,
      currentWeightKg,
      age,
      gender,
      activityLevel: activity_level,
      fastingWillingness: fasting_willingness,
      heightUnit,
      heightFt,
      heightIn,
      weightUnit,
    });
    if (!range) return null;

    const bmiInfo = computeBMI(currentWeightKg, range.heightM);
    
    const goalWeightInUnit = parseFloat(formData.goal_weight);
    const boundary = evaluateTargetWeightBoundary(goalWeightInUnit, range.minDisplay, range.maxDisplay);

    return { range, bmiInfo, boundary };
  }, [
    formData.height,
    formData.current_weight,
    formData.age,
    formData.gender,
    formData.activity_level,
    formData.fasting_willingness,
    formData.goal_weight,
    heightUnit,
    weightUnit,
    heightFt,
    heightIn,
  ]);

  const hasData = useMemo(() => {
    const cm = normalizeHeightToCm(formData.height, heightUnit, heightFt, heightIn);
    const kg = normalizeWeightToKg(formData.current_weight, weightUnit);
    return cm && kg;
  }, [formData.height, formData.current_weight, heightUnit, weightUnit, heightFt, heightIn]);

  // Not enough data to compute
  if (!hasData) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 dark:border-white/10 p-5 flex items-center gap-3 bg-slate-50/50 dark:bg-white/[0.02]">
        <span className="text-2xl">🥗</span>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
          Height နှင့် Current Weight ဖြည့်လိုက်ပါ — BBD Recommended Target Weight Range ကို တွက်ချပြပေးပါမည်။
        </p>
      </div>
    );
  }

  if (!calc) return null;

  const { range, bmiInfo, boundary } = calc;
  const unitLabel = weightUnit.toLowerCase();

  const colorMap = {
    emerald: {
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/10',
      border: 'border-emerald-400/30',
      badge: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300',
      glow: '0 0 30px rgba(16,185,129,0.12)',
      dot: 'bg-emerald-400',
    },
    amber: {
      bg: 'bg-amber-500/10 dark:bg-amber-500/8',
      border: 'border-amber-400/30',
      badge: 'bg-amber-500/20 text-amber-700 dark:text-amber-300',
      glow: '0 0 30px rgba(245,158,11,0.12)',
      dot: 'bg-amber-400',
    },
    orange: {
      bg: 'bg-orange-500/10',
      border: 'border-orange-400/30',
      badge: 'bg-orange-500/20 text-orange-700 dark:text-orange-300',
      glow: '0 0 30px rgba(249,115,22,0.12)',
      dot: 'bg-orange-400',
    },
    rose: {
      bg: 'bg-rose-500/10',
      border: 'border-rose-400/30',
      badge: 'bg-rose-500/20 text-rose-700 dark:text-rose-300',
      glow: '0 0 30px rgba(244,63,94,0.12)',
      dot: 'bg-rose-400',
    },
  };

  const color = colorMap[bmiInfo?.color] || colorMap.emerald;

  return (
    <div
      className={`rounded-2xl border ${color.border} ${color.bg} p-5 transition-all duration-500 space-y-4`}
      style={{ boxShadow: color.glow }}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xl">🥗</span>
          <span className="text-sm font-black text-slate-800 dark:text-white">BBD Smart Health Advisor</span>
        </div>
        <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${color.badge} ${color.border}`}>
          WHO Asian Standard
        </span>
      </div>

      {/* BMI Row */}
      {bmiInfo && (
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold mb-0.5">လက်ရှိ BMI</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-800 dark:text-white">{bmiInfo.bmi}</span>
              <span className="text-xs text-slate-400">kg/m²</span>
            </div>
          </div>
          <div className="flex-1 min-w-[160px]">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black ${color.badge} border ${color.border}`}>
              <span className={`w-2 h-2 rounded-full ${color.dot}`}></span>
              {bmiInfo.status}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{bmiInfo.statusMM}</p>
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-white/10 dark:border-white/5"></div>

      {/* Recommended Range */}
      <div>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold mb-2">
          🎯 BBD Recommended Healthy Target Weight Range ({weightUnit.toUpperCase()})
        </p>
        <div className="flex items-center gap-3">
          <div className="flex-1 rounded-xl bg-white/60 dark:bg-white/5 border border-white/20 dark:border-white/10 px-4 py-3 text-center">
            <p className="text-[10px] text-slate-400 mb-0.5">Min</p>
            <p className="text-xl font-black text-slate-800 dark:text-white">{range.minDisplay} <span className="text-xs font-normal">{unitLabel}</span></p>
          </div>
          <span className="text-slate-400 font-black text-lg">–</span>
          <div className="flex-1 rounded-xl bg-white/60 dark:bg-white/5 border border-white/20 dark:border-white/10 px-4 py-3 text-center">
            <p className="text-[10px] text-slate-400 mb-0.5">Max</p>
            <p className="text-xl font-black text-slate-800 dark:text-white">{range.maxDisplay} <span className="text-xs font-normal">{unitLabel}</span></p>
          </div>
          <div className="flex-1 rounded-xl border-2 border-dashed border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-center">
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mb-0.5 font-bold">Ideal ✨</p>
            <p className="text-xl font-black text-emerald-700 dark:text-emerald-300">{range.midDisplay} <span className="text-xs font-normal">{unitLabel}</span></p>
          </div>
        </div>
      </div>

      {/* Use Recommended Button */}
      <button
        type="button"
        onClick={() => onUseRecommended(range.midDisplay, range.weightUnit)}
        className="w-full py-3 rounded-xl font-black text-sm transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
        style={{ background: 'linear-gradient(135deg, #A3B81F, #829319)', color: '#000', boxShadow: '0 4px 15px rgba(163,184,31,0.25)' }}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Use BBD Recommended Weight ({range.midDisplay} {unitLabel})
      </button>

      {/* Safety Warning when target_weight is out of range */}
      {boundary === 'low' && formData.goal_weight && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-400/30 text-xs text-rose-700 dark:text-rose-300">
          <span className="text-base mt-0.5">⚠️</span>
          <p>
            <span className="font-black">Boss ဖြည့်ထားသော Target Weight ({formData.goal_weight} {unitLabel})</span> သည် တွက်ချက်ထားသော
            Recommended Range ({range.minDisplay}–{range.maxDisplay} {unitLabel}) ထက် <span className="font-black">လျော့နည်းနေပါသည်</span>
            — Underweight Risk ရှိနိုင်ပါသည်။ BBD Nutritionist နှင့် တိုင်ပင်ဆွေးနွေးရန် အကြံပြုပါသည်။
          </p>
        </div>
      )}
      {boundary === 'high' && formData.goal_weight && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-400/30 text-xs text-amber-700 dark:text-amber-300">
          <span className="text-base mt-0.5">⚠️</span>
          <p>
            <span className="font-black">Boss ဖြည့်ထားသော Target Weight ({formData.goal_weight} {unitLabel})</span> သည်
            Recommended Range ({range.minDisplay}–{range.maxDisplay} {unitLabel}) ထက် <span className="font-black">ပိုများနေပါသည်</span>
            — BBD Nutritionist မှ ပြန်လည် သုံးသပ်ပေးပါမည်။
          </p>
        </div>
      )}

      {/* Tip */}
      <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center leading-relaxed">
        * WHO Asian Standard BMI (18.5–22.9) အပေါ် အခြေခံပြီး Activity Level, Gender, Age တို့ပါ ထည့်တွက်ထားပါသည်
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────
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
  const [parsedAddresses, setParsedAddresses] = useState({});
  const [isParsingAddress, setIsParsingAddress] = useState({});

  // Unit State Management
  const [heightUnit, setHeightUnit] = useState('cm'); // 'cm' | 'inches' | 'feet'
  const [weightUnit, setWeightUnit] = useState('kg'); // 'kg' | 'lbs'
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');
  const [isUploadingSpotPhoto, setIsUploadingSpotPhoto] = useState(false);

  // ── Drop-off Spot Photo Upload Handler ─────────────────────
  const handleSpotPhotoSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size must be less than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result;
      setIsUploadingSpotPhoto(true);
      try {
        const res = await fetch('/api/enroll/upload-spot-photo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64Data })
        });
        const data = await res.json();
        if (!res.ok || !data.url) throw new Error(data.error || 'Failed to upload photo');

        setFormData(prev => ({ ...prev, delivery_spot_photo_url: data.url }));
        toast.success('Drop-off spot photo uploaded successfully! 📸');
      } catch (err) {
        toast.error(err.message || 'Failed to upload photo');
      } finally {
        setIsUploadingSpotPhoto(false);
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
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
        if (data.inquiry?.prospect_name) {
          initialData.name = data.inquiry.prospect_name;
          initialData.fb_name = data.inquiry.prospect_name;
        }
        
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

  const checkAndParseMapsLink = async (fieldId, value) => {
    if (!value || typeof value !== 'string') {
      setParsedAddresses(prev => ({ ...prev, [fieldId]: null }));
      return;
    }

    const mapsUrlRegex = /https?:\/\/(www\.)?(google\.com\/maps|maps\.app\.goo\.gl|goo\.gl\/maps|g\.co\/maps)[^\s]+/i;
    const match = value.match(mapsUrlRegex);

    if (match) {
      const urlToParse = match[0];
      setIsParsingAddress(prev => ({ ...prev, [fieldId]: true }));
      try {
        const res = await fetch('/api/enroll/parse-maps-link', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: urlToParse })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setParsedAddresses(prev => ({
            ...prev,
            [fieldId]: {
              formatted_address: data.formatted_address,
              lat: data.lat,
              lng: data.lng,
              url: urlToParse
            }
          }));
        } else {
          setParsedAddresses(prev => ({ ...prev, [fieldId]: { error: data.error || 'Unable to parse map link' } }));
        }
      } catch (err) {
        setParsedAddresses(prev => ({ ...prev, [fieldId]: { error: 'Failed to contact geocoding service' } }));
      } finally {
        setIsParsingAddress(prev => ({ ...prev, [fieldId]: false }));
      }
    } else {
      setParsedAddresses(prev => ({ ...prev, [fieldId]: null }));
    }
  };

  const handleChange = (id, value) => {
    setFormData(prev => ({ ...prev, [id]: value }));
    if (id === 'home_address' || id === 'delivery_address') {
      checkAndParseMapsLink(id, value);
    }
  };

  // ── Unit Switching & Auto-conversion handlers ──────────────
  const handleHeightUnitChange = (newUnit) => {
    if (newUnit === heightUnit) return;

    const cm = normalizeHeightToCm(formData.height, heightUnit, heightFt, heightIn);
    setHeightUnit(newUnit);

    if (!cm) return;

    if (newUnit === 'cm') {
      setFormData(prev => ({ ...prev, height: String(Math.round(cm * 10) / 10) }));
    } else if (newUnit === 'inches') {
      const inc = Math.round((cm / 2.54) * 10) / 10;
      setFormData(prev => ({ ...prev, height: String(inc) }));
    } else if (newUnit === 'feet') {
      const totalInches = cm / 2.54;
      const ft = Math.floor(totalInches / 12);
      const inc = Math.round((totalInches % 12) * 10) / 10;
      setHeightFt(String(ft || ''));
      setHeightIn(String(inc || ''));
      setFormData(prev => ({ ...prev, height: String(Math.round(cm * 10) / 10) }));
    }
  };

  const handleFeetChange = (ftStr, inStr) => {
    setHeightFt(ftStr);
    setHeightIn(inStr);
    const cm = normalizeHeightToCm(null, 'feet', ftStr, inStr);
    setFormData(prev => ({ ...prev, height: cm ? String(cm) : '' }));
  };

  const handleWeightUnitChange = (newUnit) => {
    if (newUnit === weightUnit) return;

    const curKg = normalizeWeightToKg(formData.current_weight, weightUnit);
    const goalKg = normalizeWeightToKg(formData.goal_weight, weightUnit);

    setWeightUnit(newUnit);

    setFormData(prev => {
      const next = { ...prev };
      if (curKg) next.current_weight = String(convertKgToUnit(curKg, newUnit));
      if (goalKg) next.goal_weight = String(convertKgToUnit(goalKg, newUnit));
      return next;
    });
  };

  // ── One-click: fill goal_weight with BBD recommended midpoint ──
  const handleUseRecommended = (midVal, unit) => {
    setFormData(prev => ({ ...prev, goal_weight: String(midVal) }));
    toast.success(`BBD Recommended Weight (${midVal} ${unit}) ကို Target Weight အဖြစ် သတ်မှတ်လိုက်ပြီ! ✅`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const heightCm = normalizeHeightToCm(formData.height, heightUnit, heightFt, heightIn);
      const currentWeightKg = normalizeWeightToKg(formData.current_weight, weightUnit);
      const goalWeightKg = normalizeWeightToKg(formData.goal_weight, weightUnit);

      const heightM = heightCm ? heightCm / 100 : null;
      const bmiInfo = (currentWeightKg && heightM) ? computeBMI(currentWeightKg, heightM) : null;
      const range = (heightCm && currentWeightKg) ? computeRecommendedWeightRange({
        heightCm,
        currentWeightKg,
        age: formData.age,
        gender: formData.gender,
        activityLevel: formData.activity_level,
        fastingWillingness: formData.fasting_willingness,
        heightUnit,
        heightFt,
        heightIn,
        weightUnit,
      }) : null;

      const payload = {
        ...formData,
        height: heightCm ? String(heightCm) : formData.height,
        current_weight: currentWeightKg ? String(currentWeightKg) : formData.current_weight,
        goal_weight: goalWeightKg ? String(goalWeightKg) : formData.goal_weight,
        height_unit: heightUnit,
        weight_unit: weightUnit,
        delivery_spot_photo_url: formData.delivery_spot_photo_url || null,
        home_address_parsed: parsedAddresses.home_address?.formatted_address || null,
        delivery_address_parsed: parsedAddresses.delivery_address?.formatted_address || null,
        delivery_address_url: parsedAddresses.delivery_address?.url || (formData.delivery_address?.startsWith('http') ? formData.delivery_address : null),
        bmi_at_enrollment: bmiInfo?.bmi ?? null,
        recommended_weight_min: range?.minKg ?? null,
        recommended_weight_max: range?.maxKg ?? null,
      };

      const res = await fetch(`/api/enroll/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
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

  // ── Loading / Error / Success States ──────────────────────
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

  // ── Field Renderer ─────────────────────────────────────────
  const commonClasses = "w-full bg-slate-50 dark:bg-surface-900/50 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 text-sm shadow-sm dark:shadow-inner";

  const renderField = (field) => {
    // ── Custom Unit Selection Controls for Height & Weight ──
    if (field.id === 'height') {
      return (
        <div>
          <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
            <label className="text-xs font-bold text-slate-500 dark:text-[#8b9bc1]">
              Height (အရပ်) {field.required && <span className="text-brand-orange">*</span>}
            </label>
            <div className="flex items-center bg-slate-100 dark:bg-surface-900/80 p-0.5 rounded-lg border border-slate-200 dark:border-white/10">
              {[
                { id: 'cm', label: 'CM' },
                { id: 'inches', label: 'Inches' },
                { id: 'feet', label: 'Feet (ft/in)' },
              ].map(u => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleHeightUnitChange(u.id)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                    heightUnit === u.id
                      ? 'bg-brand-green text-black shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  {u.label}
                </button>
              ))}
            </div>
          </div>

          {heightUnit === 'feet' ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <input
                  type="number"
                  required={field.required}
                  value={heightFt}
                  onChange={e => handleFeetChange(e.target.value, heightIn)}
                  placeholder="e.g. 5"
                  step="1"
                  min="1"
                  max="8"
                  className={commonClasses}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">ft</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  required={field.required}
                  value={heightIn}
                  onChange={e => handleFeetChange(heightFt, e.target.value)}
                  placeholder="e.g. 7"
                  step="0.1"
                  min="0"
                  max="11.9"
                  className={commonClasses}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">in</span>
              </div>
            </div>
          ) : (
            <div className="relative">
              <input
                type="number"
                step="0.1"
                required={field.required}
                value={formData[field.id] || ''}
                onChange={e => handleChange(field.id, e.target.value)}
                placeholder={heightUnit === 'cm' ? 'e.g. 168' : 'e.g. 66'}
                className={commonClasses}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                {heightUnit === 'cm' ? 'cm' : 'in'}
              </span>
            </div>
          )}
        </div>
      );
    }

    if (field.id === 'current_weight' || field.id === 'goal_weight') {
      const isCurrent = field.id === 'current_weight';
      const labelText = isCurrent ? 'Current Weight (လက်ရှိ အလေးချိန်)' : 'Target Weight (ရည်မှန်းထားသော အလေးချိန်)';

      return (
        <div>
          <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
            <label className="text-xs font-bold text-slate-500 dark:text-[#8b9bc1]">
              {labelText} {field.required && <span className="text-brand-orange">*</span>}
            </label>
            <div className="flex items-center bg-slate-100 dark:bg-surface-900/80 p-0.5 rounded-lg border border-slate-200 dark:border-white/10">
              {['kg', 'lbs'].map(u => (
                <button
                  key={u}
                  type="button"
                  onClick={() => handleWeightUnitChange(u)}
                  className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all ${
                    weightUnit === u
                      ? 'bg-brand-green text-black shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  {u.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <input
              type="number"
              step="0.1"
              required={field.required}
              value={formData[field.id] || ''}
              onChange={e => handleChange(field.id, e.target.value)}
              placeholder={weightUnit === 'kg' ? (isCurrent ? 'e.g. 65' : 'e.g. 58') : (isCurrent ? 'e.g. 143' : 'e.g. 128')}
              className={commonClasses}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
              {weightUnit}
            </span>
          </div>
        </div>
      );
    }

    if (field.id === 'delivery_notes') {
      return (
        <div className="space-y-3">
          <input
            type="text"
            required={field.required}
            value={formData[field.id] || ''}
            onChange={e => handleChange(field.id, e.target.value)}
            placeholder={field.placeholder || 'e.g. Leave at security gate, call when arrived'}
            className={commonClasses}
          />

          {/* Drop-off Location Spot Photo Upload Box */}
          <div className="rounded-xl border border-dashed border-slate-300 dark:border-white/15 p-4 bg-slate-50/50 dark:bg-white/[0.02]">
            <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-lg">📸</span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  Drop-off Spot Photo (ဟင်းဗူး ထားခဲ့ရမည့်နေရာ ပုံ)
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-slate-400">
                Optional / စိတ်ကြိုက် (မဖြစ်မနေ တင်ရန်မလိုပါ)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
              Condo Reception စားပွဲ၊ ခြံဝင်း တံခါး၊ သို့မဟုတ် ဖိနပ်စင် နေရာအား ဓာတ်ပုံရိုက်ပြီး တင်ထားနိုင်ပါသည် (Rider မှ အလွယ်တကူ ရှာဖွေနိုင်ရန်)
            </p>

            {formData.delivery_spot_photo_url ? (
              <div className="relative rounded-xl overflow-hidden border border-emerald-500/30 bg-emerald-500/5 p-2 flex items-center gap-3">
                <img
                  src={formData.delivery_spot_photo_url}
                  alt="Drop-off spot preview"
                  className="w-16 h-16 object-cover rounded-lg border border-white/20"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 truncate">Photo Uploaded ✅</p>
                  <p className="text-[10px] text-slate-400">Rider App တွင် ထိုပုံအား ပြသပေးပါမည်</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, delivery_spot_photo_url: null }))}
                  className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-xs font-bold transition-all shrink-0"
                >
                  🗑️ Remove
                </button>
              </div>
            ) : (
              <label className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-dashed border-brand-green/40 hover:border-brand-green bg-brand-green/5 hover:bg-brand-green/10 text-brand-green font-bold text-xs cursor-pointer transition-all">
                {isUploadingSpotPhoto ? (
                  <>
                    <span className="w-4 h-4 border-2 border-brand-green border-t-transparent rounded-full animate-spin"></span>
                    Uploading Spot Photo...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Take Photo / Upload Spot Photo</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleSpotPhotoSelect}
                  disabled={isUploadingSpotPhoto}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>
      );
    }

    switch (field.type) {
      case 'textarea':
        return (
          <div>
            <textarea
              required={field.required}
              value={formData[field.id] || ''}
              onChange={e => handleChange(field.id, e.target.value)}
              rows="2"
              placeholder={field.placeholder || (field.id.includes('address') ? 'Enter text address or paste Google Maps link...' : '')}
              className={`${commonClasses} resize-none`}
            />
            {isParsingAddress[field.id] && (
              <div className="mt-2 flex items-center gap-2 text-xs text-brand-green font-medium animate-pulse">
                <span className="w-3 h-3 border-2 border-brand-green border-t-transparent rounded-full animate-spin"></span>
                Detecting Google Maps Link & Fetching Address Details...
              </div>
            )}
            {parsedAddresses[field.id]?.formatted_address && (
              <div className="mt-2.5 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
                <svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <span className="font-bold block text-emerald-900 dark:text-emerald-200 mb-0.5">Detected Map Address (အသေးစိတ်လိပ်စာ):</span>
                  <span>{parsedAddresses[field.id].formatted_address}</span>
                </div>
              </div>
            )}
            {parsedAddresses[field.id]?.error && (
              <div className="mt-2 text-xs text-amber-500 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {parsedAddresses[field.id].error}
              </div>
            )}
          </div>
        );
      case 'dropdown':
        return (
          <select
            required={field.required}
            value={formData[field.id] || ''}
            onChange={e => handleChange(field.id, e.target.value)}
            className={`${commonClasses} appearance-none`}
            disabled={field.readonly}
          >
            <option value="" disabled hidden>{field.placeholder || 'Select an option'}</option>
            {field.options?.map((opt, i) => {
              const val = typeof opt === 'object' ? opt.value : opt;
              const lbl = typeof opt === 'object' ? opt.label : opt;
              return <option key={i} value={val}>{lbl}</option>;
            })}
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
              disabled={field.readonly}
              className="w-5 h-5 text-brand-green bg-white dark:bg-surface-900 border-slate-300 dark:border-white/10 rounded focus:ring-brand-green focus:ring-offset-2 dark:focus:ring-offset-surface-900 transition-all disabled:opacity-50"
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
            min={new Date().toISOString().split('T')[0]}
            disabled={field.readonly}
            className={`${commonClasses} dark:[color-scheme:dark] disabled:opacity-70 disabled:bg-slate-100 disabled:cursor-not-allowed`}
          />
        );
      default:
        return (
          <input
            type={field.type}
            required={field.required}
            value={formData[field.id] || ''}
            onChange={e => handleChange(field.id, e.target.value)}
            placeholder={field.placeholder || ''}
            readOnly={field.readonly}
            className={`${commonClasses} ${field.readonly ? 'opacity-70 bg-slate-100 dark:bg-surface-800 cursor-not-allowed' : ''}`}
          />
        );
    }
  };

  const groupedSchema = schema.reduce((acc, field) => {
    const section = field.section || '01. General';
    if (!acc[section]) acc[section] = [];
    acc[section].push(field);
    return acc;
  }, {});

  const sectionColors = ['bg-[#fbbf24]', 'bg-[#34d399]', 'bg-[#f97316]'];

  const HEALTH_SECTION_KEY = '02. Physical & Health Profile';

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50 dark:bg-surface-950 py-12 px-4 flex justify-center">
      <div className="fixed w-[500px] h-[500px] rounded-full opacity-10 animate-pulse" style={{ background: '#A3B81F', filter: 'blur(120px)', top: '-20%', left: '-10%' }} />
      <div className="fixed w-[400px] h-[400px] rounded-full opacity-10 animate-pulse" style={{ background: '#FF7700', filter: 'blur(100px)', bottom: '-10%', right: '-5%', animationDelay: '2s' }} />
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg,rgba(0,0,0,1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="max-w-3xl w-full relative z-10">
        {/* Header */}
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
            const borderColor = sectionColors[sectionIndex % sectionColors.length];
            const [sectionNum, ...sectionTitleParts] = sectionName.split('.');
            const sectionTitle = sectionTitleParts.join('.').trim() || sectionNum;
            const isHealthSection = sectionName === HEALTH_SECTION_KEY;

            // Split fields: before goal_weight and at/after goal_weight for card injection
            const fieldsBeforeGoalWeight = isHealthSection
              ? fields.filter(f => f.id !== 'goal_weight')
              : fields;
            const goalWeightField = isHealthSection ? fields.find(f => f.id === 'goal_weight') : null;

            return (
              <div key={sectionName} className="bg-white/90 dark:bg-surface-800/80 backdrop-blur-xl rounded-xl overflow-hidden shadow-2xl relative border border-slate-200 dark:border-white/5">
                <div className={`absolute top-0 left-0 w-full h-[5px] ${borderColor}`}></div>
                
                <div className="p-6 sm:p-8">
                  <h3 className="text-lg font-black text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                    <span className={borderColor.replace('bg-', 'text-')}>{sectionNum}.</span>
                    {sectionTitle}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                    {/* All fields except goal_weight (if health section) */}
                    {fieldsBeforeGoalWeight.map((field) => {
                      let colSpan = 'md:col-span-12';
                      if (field.width === 'half') colSpan = 'md:col-span-6';
                      else if (field.width === 'third') colSpan = 'md:col-span-4';

                      const hasCustomHeader = ['height', 'current_weight', 'goal_weight'].includes(field.id);

                      return (
                        <div key={field.id} className={`col-span-1 ${colSpan}`}>
                          {!hasCustomHeader && (
                            <label className="block text-xs font-bold text-slate-500 dark:text-[#8b9bc1] mb-2 tracking-wide">
                              {field.label} {field.required && <span className="text-brand-orange">*</span>}
                            </label>
                          )}
                          {renderField(field)}
                        </div>
                      );
                    })}
                  </div>

                  {/* ─── BBD Health Advisor Card ─── inject before goal_weight ─── */}
                  {isHealthSection && (
                    <div className="mt-6 space-y-5">
                      <BBDHealthAdvisorCard
                        formData={formData}
                        heightUnit={heightUnit}
                        weightUnit={weightUnit}
                        heightFt={heightFt}
                        heightIn={heightIn}
                        onUseRecommended={handleUseRecommended}
                      />

                      {/* goal_weight field rendered after the card */}
                      {goalWeightField && (
                        <div>
                          {renderField(goalWeightField)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Submit */}
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
