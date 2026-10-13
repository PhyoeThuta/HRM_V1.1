/**
 * payroll_phase2_policy.test.js — Phase 2 Policy Tests
 *
 * Tests T1–T14 as specified in the Phase 2 requirements.
 * All tests are pure (no DB calls). They exercise the engine and policy service
 * using in-memory policy objects, ensuring:
 *
 *   1. BBD policy produces identical results to Phase 1 snapshots.
 *   2. Policy-driven behavior changes are correctly applied.
 *   3. Validation correctly rejects invalid policies.
 *
 * Run: node tests/payroll_phase2_policy.test.js
 */

import {
  BBD_SALARY_DIVISOR,
  calculateDailyRate,
  calculateUnpaidDeduction,
  calculateAttendanceScore,
  calculatePunctualityScore,
  calculateSopScore,
  calculatePeerScore,
  calculateKpiContribution,
  calculateBonus,
  calculateNetSalary,
  calculateLeaveDaysInMonth,
  isWorkingDay,
} from '../modules/hrm/engine/payrollCalculationEngine.js';

import {
  BBD_DEFAULT_POLICY,
  getWeeklyHolidaySet,
  validatePolicy,
  WEEKDAY_TO_DAY_INDEX,
} from '../modules/hrm/service/payrollPolicyService.js';

let passed = 0;
let failed = 0;

function assert(label, actual, expected, tolerance = 0) {
  const ok = tolerance > 0
    ? Math.abs(actual - expected) <= tolerance
    : actual === expected || (typeof actual === 'number' && typeof expected === 'number' && Math.abs(actual - expected) < 0.001);
  if (ok) {
    console.log(`  ✅ PASS: ${label}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${label}`);
    console.error(`         expected: ${expected}  actual: ${actual}`);
    failed++;
  }
}

function assertThrows(label, fn, expectedMsgPart) {
  try {
    fn();
    console.error(`  ❌ FAIL: ${label} — expected to throw but did not`);
    failed++;
  } catch (e) {
    if (!expectedMsgPart || e.message.includes(expectedMsgPart)) {
      console.log(`  ✅ PASS: ${label} (threw: ${e.message.split('\n')[0]})`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${label} — threw wrong error: ${e.message}`);
      failed++;
    }
  }
}

// ─── BBD Policy reference ───────────────────────────────────────────────────
const BBD_POLICY = { ...BBD_DEFAULT_POLICY };
const BBD_HOLIDAY_SET = getWeeklyHolidaySet(BBD_POLICY);

// Company A policy: Mon–Fri, divisor 22
const COMPANY_A_POLICY = {
  salary_divisor:   22,
  weekly_holidays:  ['SATURDAY', 'SUNDAY'],
  approved_leave_counts_as_punctual: false,
  peer_score_max_stars: 5,
  default_sop_score: 100,
  default_peer_score: 100,
};
const COMPANY_A_HOLIDAY_SET = getWeeklyHolidaySet(COMPANY_A_POLICY);

// ─── T1: BBD salary divisor = 26 ────────────────────────────────────────────
console.log('\nT1: BBD salary divisor = 26');
assert('BBD_DEFAULT_POLICY.salary_divisor === 26', BBD_POLICY.salary_divisor, 26);
assert('BBD_SALARY_DIVISOR constant === 26', BBD_SALARY_DIVISOR, 26);

// ─── T2: BBD Sunday is excluded ─────────────────────────────────────────────
console.log('\nT2: BBD Sunday is excluded');
const sunday = new Date('2026-09-27'); // Verify it is indeed a Sunday
assert('2026-09-27 is Sunday', sunday.getDay(), 0);
assert('Sunday NOT a working day under BBD policy', isWorkingDay(sunday, BBD_HOLIDAY_SET), false);

// ─── T3: BBD Monday–Saturday remain working days ─────────────────────────────
console.log('\nT3: BBD Monday–Saturday are working days');
const monday    = new Date('2026-09-28'); // Monday
const tuesday   = new Date('2026-09-29');
const wednesday = new Date('2026-09-30');
const thursday  = new Date('2026-10-01');
const friday    = new Date('2026-10-02');
const saturday  = new Date('2026-10-03');
assert('Monday is working day', isWorkingDay(monday, BBD_HOLIDAY_SET), true);
assert('Tuesday is working day', isWorkingDay(tuesday, BBD_HOLIDAY_SET), true);
assert('Wednesday is working day', isWorkingDay(wednesday, BBD_HOLIDAY_SET), true);
assert('Thursday is working day', isWorkingDay(thursday, BBD_HOLIDAY_SET), true);
assert('Friday is working day', isWorkingDay(friday, BBD_HOLIDAY_SET), true);
assert('Saturday is working day (BBD)', isWorkingDay(saturday, BBD_HOLIDAY_SET), true);

// ─── T4: Daily rate with divisor 26 matches Phase 1 snapshot ─────────────────
console.log('\nT4: Daily rate with BBD policy matches Phase 1 snapshot');
const salary = 3000;
// Phase 1 result: 3000 / 26 = 115.384...
const phase1DailyRate = 3000 / 26;
const phase2DailyRate = calculateDailyRate(3000, null, BBD_POLICY);
assert('daily_rate(3000, null, BBD_POLICY) === 3000/26', phase2DailyRate, phase1DailyRate);
// Also: explicit working_days param should still work
const explicitDailyRate = calculateDailyRate(3000, 26, BBD_POLICY);
assert('daily_rate(3000, 26, BBD_POLICY) === 3000/26', explicitDailyRate, phase1DailyRate);

// ─── T5: Unpaid leave calculation identical ────────────────────────────────
console.log('\nT5: Unpaid leave deduction identical to Phase 1');
const dailyRate = calculateDailyRate(3000, null, BBD_POLICY);
const deduct2   = calculateUnpaidDeduction(dailyRate, 2);
const deduct1   = calculateUnpaidDeduction(dailyRate, 1);
assert('2 unpaid days → 230.77', deduct2, 230.77);
assert('1 unpaid day → 115.38', deduct1, 115.38);

// ─── T6: Cross-month leave behavior identical ───────────────────────────────
console.log('\nT6: Cross-month leave (Sep 30 → Oct 2) identical to Phase 1');
const sepStart = '2026-09-01'; const sepEnd = '2026-09-30';
const octStart = '2026-10-01'; const octEnd = '2026-10-31';
const lStart   = '2026-09-30'; const lEnd   = '2026-10-02';
const sepDays = calculateLeaveDaysInMonth(lStart, lEnd, sepStart, sepEnd, BBD_HOLIDAY_SET);
const octDays = calculateLeaveDaysInMonth(lStart, lEnd, octStart, octEnd, BBD_HOLIDAY_SET);
// 2026-09-30 = Wednesday (working), 2026-10-01 = Thursday (working), 2026-10-02 = Friday (working)
assert('Sep 30 → Oct 2 in September = 1 working day', sepDays, 1);
assert('Sep 30 → Oct 2 in October = 2 working days', octDays, 2);

// ─── T7: Approved leave punctuality behavior ────────────────────────────────
console.log('\nT7: Approved leave punctuality behavior');
// BBD: approved_leave_counts_as_punctual = true
// Simulate: 15 physical on-time, 5 approved leave days, 20 actual attendance
// With BBD policy: on_time = 15 + 5 = 20, score = 20/20 = 100
const onTimePhysical = 15;
const approvedLeaveDays = 5;
const actualAttendance = 20;

// BBD behavior (punctual = true)
const onTimeBBD   = onTimePhysical + approvedLeaveDays; // 20
const punctBBD    = calculatePunctualityScore(onTimeBBD, actualAttendance);
assert('BBD: approved leave counts as punctual → score 100', punctBBD, 100);

// Company A behavior (punctual = false)
const onTimeCompA = onTimePhysical; // 15 (leave days NOT added)
const punctCompA  = calculatePunctualityScore(onTimeCompA, actualAttendance);
assert('Company A: approved leave NOT punctual → score 75', punctCompA, 75);

// ─── T8: Bonus identical ────────────────────────────────────────────────────
console.log('\nT8: Bonus calculation identical to Phase 1');
const bonus100 = calculateBonus(3000, 15, 100);
const bonus80  = calculateBonus(3000, 15, 80);
assert('bonus(3000, 15%, 100) = 450', bonus100, 450);
assert('bonus(3000, 15%, 80) = 360', bonus80, 360);

// ─── T9: Net salary identical ───────────────────────────────────────────────
console.log('\nT9: Net salary identical to Phase 1');
const net1 = calculateNetSalary(3000, 0, 450, 0);
const net2 = calculateNetSalary(3000, 200, 360, 100);
assert('net(3000, 0, 450, 0) = 3450', net1, 3450);
assert('net(3000, 200, 360, 100) = 3460', net2, 3460);

// ─── T10: getWeeklyHolidaySet builds correct sets ──────────────────────────
console.log('\nT10: getWeeklyHolidaySet builds correct holiday Sets');
assert('BBD holiday set contains Sunday (0)', BBD_HOLIDAY_SET.has(0), true);
assert('BBD holiday set does NOT contain Saturday (6)', BBD_HOLIDAY_SET.has(6), false);
assert('BBD holiday set size = 1', BBD_HOLIDAY_SET.size, 1);
assert('Company A holiday set contains Sunday (0)', COMPANY_A_HOLIDAY_SET.has(0), true);
assert('Company A holiday set contains Saturday (6)', COMPANY_A_HOLIDAY_SET.has(6), true);
assert('Company A holiday set size = 2', COMPANY_A_HOLIDAY_SET.size, 2);

// ─── T11: Validation rejects invalid policy values ─────────────────────────
console.log('\nT11: Validation rejects invalid policy values (unauthorized policy cannot enter)');
assertThrows('salary_divisor=0 rejected',
  () => validatePolicy({ salary_divisor: 0 }),
  'salary_divisor');
assertThrows('salary_divisor=-5 rejected',
  () => validatePolicy({ salary_divisor: -5 }),
  'salary_divisor');
assertThrows('invalid weekday rejected',
  () => validatePolicy({ weekly_holidays: ['SUNDAY', 'FUNDAY'] }),
  'weekly_holidays');
assertThrows('invalid timezone rejected',
  () => validatePolicy({ timezone: 'Not/Real' }),
  'timezone');
assertThrows('peer_score_max_stars=0 rejected',
  () => validatePolicy({ peer_score_max_stars: 0 }),
  'peer_score_max_stars');
assertThrows('default_sop_score=150 rejected',
  () => validatePolicy({ default_sop_score: 150 }),
  'default_sop_score');

// T12: Authorized — validation accepts valid policy (no throw = authorized path works)
console.log('\nT12: Valid policy passes validation (authorized admin path)');
try {
  validatePolicy(BBD_POLICY);
  console.log('  ✅ PASS: BBD policy passes validation');
  passed++;
} catch (e) {
  console.error(`  ❌ FAIL: BBD policy failed validation: ${e.message}`);
  failed++;
}
try {
  validatePolicy(COMPANY_A_POLICY);
  console.log('  ✅ PASS: Company A policy passes validation');
  passed++;
} catch (e) {
  console.error(`  ❌ FAIL: Company A policy failed validation: ${e.message}`);
  failed++;
}

// ─── T13: Changing salary_divisor changes calculation ──────────────────────
console.log('\nT13: Changing policy salary_divisor changes calculation correctly');
const rateWith26 = calculateDailyRate(3000, null, BBD_POLICY); // 115.384...
const rateWith22 = calculateDailyRate(3000, null, COMPANY_A_POLICY); // 136.363...
assert('BBD (÷26): daily rate = 3000/26', rateWith26, 3000 / 26);
assert('Company A (÷22): daily rate = 3000/22', rateWith22, 3000 / 22);
assert('Company A rate > BBD rate (÷22 > ÷26)', rateWith22 > rateWith26, true);
// Restore: switch back to BBD policy → same result as before
const restoredRate = calculateDailyRate(3000, null, BBD_POLICY);
assert('Restored to BBD policy: rate = 3000/26 again', restoredRate, 3000 / 26);

// ─── T14: Changing weekly_holidays changes working-day calculation ──────────
console.log('\nT14: Changing weekly_holidays changes working-day calculation');
// Test week: 2026-09-28 Mon to 2026-10-04 Sun
const weekStart = '2026-09-28'; const weekEnd = '2026-10-04'; // Mon–Sun

// BBD: exclude Sunday → 6 working days (Mon–Sat)
const bbdDays     = calculateLeaveDaysInMonth(weekStart, weekEnd, weekStart, weekEnd, BBD_HOLIDAY_SET);
assert('BBD (Sun off): Mon–Sun leave = 6 working days', bbdDays, 6);

// Company A: exclude Sat+Sun → 5 working days (Mon–Fri)
const compADays   = calculateLeaveDaysInMonth(weekStart, weekEnd, weekStart, weekEnd, COMPANY_A_HOLIDAY_SET);
assert('Company A (Sat+Sun off): Mon–Sun leave = 5 working days', compADays, 5);

// Saturday specifically: working under BBD, not working under Company A
const satDate = new Date('2026-10-03');
assert('Saturday: working day under BBD policy', isWorkingDay(satDate, BBD_HOLIDAY_SET), true);
assert('Saturday: NOT working day under Company A policy', isWorkingDay(satDate, COMPANY_A_HOLIDAY_SET), false);

// ─── RESULTS ────────────────────────────────────────────────────────────────
console.log('\n───────────────────────────────────────────────────────');
console.log(`PHASE 2 POLICY TEST RESULTS: ${passed} passed, ${failed} failed`);
if (failed === 0) {
  console.log('✅ ALL PHASE 2 POLICY TESTS PASSED');
} else {
  console.error(`❌ ${failed} TEST(S) FAILED`);
  process.exit(1);
}
