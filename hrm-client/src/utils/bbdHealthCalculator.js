/**
 * BBD Health Calculator — Decoupled Pure Calculation Engine
 * ─────────────────────────────────────────────────────────
 * WHO Asian Standard BMI + Activity-Level Calibration
 * Hot-swappable: Replace `computeRecommendedWeightRange()` when
 * BBD delivers their proprietary formula.
 */

// WHO Asian Standard BMI thresholds
const BMI_ASIAN = {
  UNDERWEIGHT_SEVERE: 16.0,
  UNDERWEIGHT: 18.5,
  NORMAL_MIN: 18.5,
  NORMAL_MAX: 22.9,
  OVERWEIGHT: 25.0,
  OBESE: 30.0,
};

// Activity level calibration modifiers (±% on midpoint)
const ACTIVITY_MODIFIERS = {
  'Sedentary (Little to no exercise)': 0,
  'Lightly active': 0.01,
  'Moderately active': 0.015,
  'Very active': 0.02,
};

/**
 * Convert height in any unit (cm, inches, feet+inches) to centimeters.
 * @param {number|string} value - Value in current unit (or main value)
 * @param {'cm'|'inches'|'feet'} unit - Unit mode
 * @param {number|string} [feetVal=0] - Feet value if unit is 'feet'
 * @param {number|string} [inchesVal=0] - Inches value if unit is 'feet'
 * @returns {number|null} Height in cm
 */
export function normalizeHeightToCm(value, unit = 'cm', feetVal = 0, inchesVal = 0) {
  if (unit === 'feet') {
    const ft = parseFloat(feetVal) || 0;
    const inc = parseFloat(inchesVal) || 0;
    if (ft <= 0 && inc <= 0) return null;
    const totalInches = (ft * 12) + inc;
    return Math.round(totalInches * 2.54 * 10) / 10;
  }

  const num = parseFloat(value);
  if (!num || num <= 0) return null;

  if (unit === 'inches') {
    return Math.round(num * 2.54 * 10) / 10;
  }

  // Default 'cm'
  return num;
}

/**
 * Normalize height to meters from any unit.
 * @param {number|string} value
 * @param {'cm'|'inches'|'feet'} [unit='cm']
 * @param {number|string} [feetVal=0]
 * @param {number|string} [inchesVal=0]
 * @returns {number|null} Height in meters
 */
export function normalizeHeightToMeters(value, unit = 'cm', feetVal = 0, inchesVal = 0) {
  const cm = normalizeHeightToCm(value, unit, feetVal, inchesVal);
  if (!cm || cm <= 0) return null;
  return cm / 100;
}

/**
 * Convert weight in any unit (kg, lbs) to kg.
 * @param {number|string} value
 * @param {'kg'|'lbs'} [unit='kg']
 * @returns {number|null} Weight in kg
 */
export function normalizeWeightToKg(value, unit = 'kg') {
  const num = parseFloat(value);
  if (!num || num <= 0) return null;
  if (unit === 'lbs') {
    return Math.round((num * 0.45359237) * 10) / 10;
  }
  return num;
}

/**
 * Convert kg value to target unit ('kg' or 'lbs').
 * @param {number} weightKg
 * @param {'kg'|'lbs'} unit
 * @returns {number}
 */
export function convertKgToUnit(weightKg, unit = 'kg') {
  const w = parseFloat(weightKg);
  if (!w || isNaN(w)) return 0;
  if (unit === 'lbs') {
    return Math.round((w / 0.45359237) * 10) / 10;
  }
  return Math.round(w * 10) / 10;
}

/**
 * Convert cm value to target unit format.
 * @param {number} cm
 * @param {'cm'|'inches'|'feet'} unit
 * @returns {{ cm?: number, inches?: number, feet?: number, feetInches?: { ft: number, in: number } }}
 */
export function convertCmToUnit(cm, unit = 'cm') {
  const val = parseFloat(cm);
  if (!val || isNaN(val)) return {};
  if (unit === 'inches') {
    return { inches: Math.round((val / 2.54) * 10) / 10 };
  }
  if (unit === 'feet') {
    const totalInches = val / 2.54;
    const ft = Math.floor(totalInches / 12);
    const inc = Math.round((totalInches % 12) * 10) / 10;
    return { feet: ft, inches: inc };
  }
  return { cm: Math.round(val * 10) / 10 };
}

/**
 * Compute BMI and its WHO Asian classification.
 * @param {number} weightKg - Current weight in kg
 * @param {number} heightM  - Height in meters
 * @returns {{ bmi: number, status: string, color: string }|null}
 */
export function computeBMI(weightKg, heightM) {
  const w = parseFloat(weightKg);
  const h = parseFloat(heightM);
  if (!w || !h || w <= 0 || h <= 0) return null;

  const bmi = w / (h * h);
  const rounded = Math.round(bmi * 10) / 10;

  let status, color, statusMM;

  if (bmi < BMI_ASIAN.UNDERWEIGHT_SEVERE) {
    status = 'Severely Underweight';
    statusMM = 'ဝိတ်အလွန်ကျနေပါသည်';
    color = 'rose';
  } else if (bmi < BMI_ASIAN.UNDERWEIGHT) {
    status = 'Underweight';
    statusMM = 'ဝိတ်ကျနေပါသည်';
    color = 'amber';
  } else if (bmi <= BMI_ASIAN.NORMAL_MAX) {
    status = 'Normal (Healthy)';
    statusMM = 'ကျန်းမာသော ဝိတ်ရှိနေပါသည်';
    color = 'emerald';
  } else if (bmi < BMI_ASIAN.OVERWEIGHT) {
    status = 'Overweight';
    statusMM = 'ဝိတ်အနည်းငယ် ပိုနေပါသည်';
    color = 'amber';
  } else if (bmi < BMI_ASIAN.OBESE) {
    status = 'Obese (Class I)';
    statusMM = 'ဝိတ်ပိုနေပါသည်';
    color = 'orange';
  } else {
    status = 'Obese (Class II+)';
    statusMM = 'ဝိတ်အလွန်ပိုနေပါသည်';
    color = 'rose';
  }

  return { bmi: rounded, status, statusMM, color };
}

/**
 * ─────────────────────────────────────────────────────────
 * CORE ENGINE — HOT-SWAPPABLE FORMULA FUNCTION
 * Replace this function body when BBD delivers their formula.
 * ─────────────────────────────────────────────────────────
 *
 * @param {object} params
 * @param {number} params.heightCm - Height in cm
 * @param {number} params.currentWeightKg - Current weight in kg
 * @param {number} params.age - Age in years
 * @param {string} params.gender - 'Male' | 'Female' | 'Other'
 * @param {string} params.activityLevel - Activity level string
 * @param {string} params.fastingWillingness - Fasting preference
 * @returns {{ min: number, max: number, mid: number, heightM: number }|null}
 */
export function computeRecommendedWeightRange({
  heightCm,
  currentWeightKg,
  age,
  gender,
  activityLevel,
  fastingWillingness,
  heightUnit = 'cm',
  heightFt = 0,
  heightIn = 0,
  weightUnit = 'kg',
}) {
  const heightM = normalizeHeightToMeters(heightCm, heightUnit, heightFt, heightIn);
  if (!heightM) return null;

  // WHO Asian Standard: Healthy BMI 18.5 – 22.9
  const rawMinKg = BMI_ASIAN.NORMAL_MIN * (heightM * heightM);
  const rawMaxKg = BMI_ASIAN.NORMAL_MAX * (heightM * heightM);

  let midKg = (rawMinKg + rawMaxKg) / 2;

  // Activity Level calibration: more active → slightly higher target
  const modifier = ACTIVITY_MODIFIERS[activityLevel] ?? 0;
  midKg = midKg * (1 + modifier);

  // Gender micro-adjustment: Females typically ≈ 2% lower mid target
  if (gender === 'Female') midKg = midKg * 0.98;

  // Age adjustment: >50 allow slightly higher baseline
  const parsedAge = parseInt(age);
  if (parsedAge > 50) midKg = midKg * 1.02;

  const minKg = Math.round(rawMinKg * 10) / 10;
  const maxKg = Math.round(rawMaxKg * 10) / 10;
  const roundedMidKg = Math.round(midKg * 10) / 10;

  // Unit display values
  const minDisplay = convertKgToUnit(minKg, weightUnit);
  const maxDisplay = convertKgToUnit(maxKg, weightUnit);
  const midDisplay = convertKgToUnit(roundedMidKg, weightUnit);

  return {
    minKg,
    maxKg,
    midKg: roundedMidKg,
    minDisplay,
    maxDisplay,
    midDisplay,
    weightUnit,
    heightM,
    heightCm: Math.round(heightM * 100 * 10) / 10,
  };
}

/**
 * Evaluate the safety boundary of a user-entered target weight.
 * @param {number} targetKg
 * @param {number} rangeMin
 * @param {number} rangeMax
 * @returns {'safe'|'low'|'high'|null}
 */
export function evaluateTargetWeightBoundary(targetKg, rangeMin, rangeMax) {
  const t = parseFloat(targetKg);
  if (!t || t <= 0) return null;
  if (t < rangeMin) return 'low';
  if (t > rangeMax) return 'high';
  return 'safe';
}
