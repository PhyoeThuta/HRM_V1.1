/**
 * payrollCalculationEngine.js — Pure Payroll Calculation Engine
 *
 * Phase 1 of the BBD HRM Payroll Architecture Refactor.
 *
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║  DESIGN RULES — READ BEFORE EDITING                                     ║
 * ║                                                                          ║
 * ║  1. This file contains ONLY pure functions.                              ║
 * ║  2. NO database access. NO Supabase imports. NO side effects.            ║
 * ║  3. Every function receives all required inputs as parameters.           ║
 * ║  4. Every function returns a single value or plain object.               ║
 * ║  5. All functions are independently unit-testable without mocking.       ║
 * ║  6. All BBD-specific values (e.g. 26 working days) are PRESERVED         ║
 * ║     exactly. They will be externalized into Company Policy in Phase 2.   ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 *
 * BBD Business Rules currently embedded (to be moved to Policy in Phase 2):
 *
 *   - BBD_SALARY_DIVISOR = 26
 *     BBD operates Monday–Saturday. Sunday is the weekly holiday.
 *     The salary is divided by 26 to compute the daily rate.
 *     This will become `policy.salaryDivisor` in Phase 2.
 *
 *   - Sunday (getDay() === 0) is skipped in leave and unpaid-leave counting.
 *     This will become `policy.weeklyHolidays` in Phase 2.
 *
 *   - Approved leave days count as "on-time" for punctuality score.
 *     This is a BBD HR policy: employees on approved leave are not penalised.
 *     This will become `policy.approvedLeaveCountsAsPunctual` in Phase 2.
 *
 *   - Peer score scale: 5 stars = 100%.
 *     This will become `policy.peerScoreMaxStars` in Phase 2.
 *
 *   - No-SOP-data default = 100 (full score if nothing assigned).
 *     This will become `policy.defaultSopScore` in Phase 2.
 *
 *   - No-peer-vote default = 100 (full score if no votes received).
 *     This will become `policy.defaultPeerScore` in Phase 2.
 *
 *   - Rounding: Math.round(val * 100) / 100 for all monetary values.
 */

// ─── BBD LEGACY DEFAULTS (Phase 2 will move these to Company Policy) ─────────

/**
 * BBD salary divisor: 26 working days (Mon–Sat, Sunday off).
 * INTENTIONALLY hardcoded for Phase 1. Do NOT change this value.
 * See Phase 2 for company-policy-driven configuration.
 * @type {number}
 */
export const BBD_SALARY_DIVISOR = 26;

// ─── 1. DAILY RATE ────────────────────────────────────────────────────────────

/**
 * Calculate the daily rate for salary deduction purposes.
 *
 * @param {number} baseSalary    Employee base salary (monthly)
 * @param {number} workingDays   Salary divisor (BBD default: 26)
 * @returns {number}             Daily rate (unrounded — round at deduction step)
 */
export function calculateDailyRate(baseSalary, workingDays) {
  if (!workingDays || workingDays <= 0) return 0;
  return baseSalary / workingDays;
}

// ─── 2. UNPAID LEAVE DEDUCTION ───────────────────────────────────────────────

/**
 * Calculate the monetary deduction for unpaid leave days.
 * Rounds to 2 decimal places (cents precision).
 *
 * @param {number} dailyRate     Result of calculateDailyRate()
 * @param {number} unpaidDays    Number of working days on unpaid leave
 * @returns {number}             Deduction amount, rounded to 2dp
 */
export function calculateUnpaidDeduction(dailyRate, unpaidDays) {
  return Math.round(dailyRate * (unpaidDays || 0) * 100) / 100;
}

// ─── 3. ATTENDANCE SCORE ─────────────────────────────────────────────────────

/**
 * Calculate attendance score as a percentage, capped at 100.
 * Actual attendance includes both physical present days and approved leave days.
 *
 * @param {number} actualAttendance  Present days + approved leave days
 * @param {number} workingDays       Expected working days this month
 * @returns {number}                 Score 0–100
 */
export function calculateAttendanceScore(actualAttendance, workingDays) {
  if (!workingDays || workingDays <= 0) return 0;
  return Math.min(100.0, (actualAttendance / workingDays) * 100);
}

// ─── 4. PUNCTUALITY SCORE ────────────────────────────────────────────────────

/**
 * Calculate punctuality score as a percentage, capped at 100.
 *
 * BBD Rule: approved leave days count as on-time (employees are not penalised
 * for absence on approved leave). Therefore on_time_count already includes
 * approved leave days when passed to this function (added in compensationService
 * before calling this function).
 *
 * @param {number} onTimeCount       On-time check-ins + approved leave days
 * @param {number} actualAttendance  Present days + approved leave days
 * @returns {number}                 Score 0–100
 */
export function calculatePunctualityScore(onTimeCount, actualAttendance) {
  if (!actualAttendance || actualAttendance <= 0) return 0;
  return Math.min(100.0, (onTimeCount / actualAttendance) * 100);
}

// ─── 5. SOP SCORE ────────────────────────────────────────────────────────────

/**
 * Calculate SOP completion score as a percentage.
 * If no SOPs are assigned, defaults to 100 (BBD policy: no tasks = full score).
 *
 * @param {number} completedCount  Number of completed SOP tasks
 * @param {number} totalCount      Total number of assigned SOP tasks
 * @returns {number}               Score 0–100
 */
export function calculateSopScore(completedCount, totalCount) {
  if (!totalCount || totalCount <= 0) return 100.0;
  return (completedCount / totalCount) * 100;
}

// ─── 6. PEER SCORE ───────────────────────────────────────────────────────────

/**
 * Calculate peer review score as a percentage.
 * If no votes exist, defaults to 100 (BBD policy: no votes = full score).
 * Scale: maxStars (default 5) = 100%.
 *
 * @param {number} avgStars    Average star rating received
 * @param {number} maxStars    Maximum possible stars (BBD: 5)
 * @returns {number}           Score 0–100
 */
export function calculatePeerScore(avgStars, maxStars = 5) {
  if (avgStars === null || avgStars === undefined) return 100.0;
  return (avgStars / maxStars) * 100;
}

// ─── 7. KPI CONTRIBUTION ─────────────────────────────────────────────────────

/**
 * Calculate the composite KPI contribution from weighted sub-scores.
 * Weights are provided as percentages (0–100) that sum to 100.
 *
 * @param {object} scores   { attendance, punctuality, sop, peer } — each 0–100
 * @param {object} weights  { attendance, punctuality, sops, peer_voting } — each 0–100, sum=100
 * @returns {number}        KPI contribution 0–100
 */
export function calculateKpiContribution(scores, weights) {
  return (
    scores.attendance   * ((weights.attendance   || 0) / 100) +
    scores.punctuality  * ((weights.punctuality  || 0) / 100) +
    scores.sop          * ((weights.sops         || 0) / 100) +
    scores.peer         * ((weights.peer_voting  || 0) / 100)
  );
}

// ─── 8. BONUS ────────────────────────────────────────────────────────────────

/**
 * Calculate the performance bonus.
 * Formula: basic × (targetBonusPct / 100) × (kpiContribution / 100)
 * Rounds to 2 decimal places.
 *
 * @param {number} basicSalary       Employee base salary
 * @param {number} targetBonusPct    Target bonus as a percentage (e.g. 15 for 15%)
 * @param {number} kpiContribution   Auto KPI contribution score 0–100
 * @returns {number}                 Bonus amount, rounded to 2dp
 */
export function calculateBonus(basicSalary, targetBonusPct, kpiContribution) {
  return Math.round(basicSalary * (targetBonusPct / 100) * (kpiContribution / 100) * 100) / 100;
}

// ─── 9. NET SALARY ───────────────────────────────────────────────────────────

/**
 * Calculate the net salary payable.
 * Formula: basic + allowances + bonus - deductions
 *
 * @param {number} basic        Base salary
 * @param {number} allowances   Additional allowances
 * @param {number} bonus        Computed bonus
 * @param {number} deductions   Total deductions (including unpaid leave)
 * @returns {number}            Net salary
 */
export function calculateNetSalary(basic, allowances, bonus, deductions) {
  return basic + (allowances || 0) + (bonus || 0) - (deductions || 0);
}

// ─── 10. LEAVE–MONTH INTERSECTION ───────────────────────────────────────────

/**
 * Calculate the number of payroll-relevant working days a leave record
 * overlaps with a given payroll month. Skips Sundays (BBD weekly holiday).
 *
 * Uses noon-anchoring (setHours(12,0,0,0)) to prevent DST-related off-by-one
 * errors during day iteration. Date strings are compared as plain YYYY-MM-DD
 * strings to avoid UTC timezone shifting.
 *
 * BBD Rule: Sunday (getDay() === 0) is not counted.
 * Phase 2 will replace `getDay() !== 0` with `!policy.weeklyHolidays.includes(getDay())`.
 *
 * @param {string} leaveStartStr   Leave start date 'YYYY-MM-DD'
 * @param {string} leaveEndStr     Leave end date 'YYYY-MM-DD' (inclusive)
 * @param {string} monthStartStr   Payroll month start 'YYYY-MM-DD'
 * @param {string} monthEndStr     Payroll month end 'YYYY-MM-DD' (inclusive)
 * @returns {number}               Number of working days in the intersection
 */
export function calculateLeaveDaysInMonth(leaveStartStr, leaveEndStr, monthStartStr, monthEndStr) {
  // No overlap — fast exit
  if (leaveStartStr > monthEndStr || leaveEndStr < monthStartStr) return 0;

  const effectiveStartStr = leaveStartStr < monthStartStr ? monthStartStr : leaveStartStr;
  const effectiveEndStr   = leaveEndStr   > monthEndStr   ? monthEndStr   : leaveEndStr;

  let diffDays = 0;
  let currentDate = new Date(effectiveStartStr);
  currentDate.setHours(12, 0, 0, 0); // Noon anchor — avoids DST skips

  const effectiveEndDate = new Date(effectiveEndStr);
  effectiveEndDate.setHours(12, 0, 0, 0);

  while (currentDate <= effectiveEndDate) {
    // BBD Rule: Sunday (0) is the weekly holiday — not counted as a working day
    if (currentDate.getDay() !== 0) {
      diffDays++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return diffDays;
}
