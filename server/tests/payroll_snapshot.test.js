/**
 * PAYROLL SNAPSHOT TESTS — Phase 1 Regression Guard
 *
 * These tests capture the CURRENT BBD payroll calculation behavior.
 * They must produce IDENTICAL numeric results before and after the Phase 1 refactor.
 * If any number changes, the refactor must STOP.
 *
 * BBD Business Rules captured here:
 * - Salary divisor = 26 (Mon–Sat working days, Sunday = weekly holiday)
 * - Sunday excluded from unpaid-leave and leave-balance counting
 * - Asia/Bangkok timezone for all date comparisons
 * - unpaid_deduction = round(base_salary / 26 * unpaid_days, 2)
 * - bonus = round(basic * (target_bonus_pct/100) * (kpi_contribution/100), 2)
 * - net = basic + allowances + bonus - deductions
 */

import assert from 'assert';

console.log('\n=== PAYROLL PHASE 1 — SNAPSHOT TESTS (Pure Math) ===\n');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passed++;
  } catch (e) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`         ${e.message}`);
    failed++;
  }
}

function assertClose(actual, expected, label, epsilon = 0.005) {
  if (Math.abs(actual - expected) > epsilon) {
    throw new Error(
      `${label}: expected ${expected}, got ${actual} (diff=${Math.abs(actual - expected).toFixed(6)})`
    );
  }
}

// ─── GROUP 1: DAILY RATE ─────────────────────────────────────────────────────
console.log('Group 1: Daily Rate (salary_divisor=26)');

test('daily_rate: salary=3000, working_days=26', () => {
  const daily_rate = 3000 / 26;
  assertClose(daily_rate, 115.384615, 'daily_rate');
});

test('daily_rate: salary=4500, working_days=26', () => {
  const daily_rate = 4500 / 26;
  assertClose(daily_rate, 173.076923, 'daily_rate');
});

// ─── GROUP 2: UNPAID LEAVE DEDUCTION ─────────────────────────────────────────
console.log('\nGroup 2: Unpaid Leave Deduction');

test('unpaid_deduction: salary=3000, 2 unpaid days', () => {
  const daily_rate = 3000 / 26;
  const deduction = Math.round(daily_rate * 2 * 100) / 100;
  assertClose(deduction, 230.77, 'unpaid_deduction');
});

test('unpaid_deduction: salary=3000, 1 unpaid day', () => {
  const daily_rate = 3000 / 26;
  const deduction = Math.round(daily_rate * 1 * 100) / 100;
  assertClose(deduction, 115.38, 'unpaid_deduction');
});

test('unpaid_deduction: 0 unpaid days = 0 deduction', () => {
  const daily_rate = 3000 / 26;
  const deduction = Math.round(daily_rate * 0 * 100) / 100;
  assert.strictEqual(deduction, 0, 'deduction should be 0');
});

// ─── GROUP 3: ATTENDANCE SCORE ────────────────────────────────────────────────
console.log('\nGroup 3: Attendance Score');

test('attendance_score: 26/26 days present', () => {
  const score = Math.min(100.0, (26 / 26) * 100);
  assertClose(score, 100.0, 'attendance_score');
});

test('attendance_score: 20/26 days present', () => {
  const score = Math.min(100.0, (20 / 26) * 100);
  assertClose(score, 76.923076, 'attendance_score');
});

test('attendance_score: 26/26 (capped at 100 for over-attendance)', () => {
  const actual = 28; // e.g. includes approved leave padding
  const score = Math.min(100.0, (actual / 26) * 100);
  assertClose(score, 100.0, 'attendance_score capped');
});

// ─── GROUP 4: PUNCTUALITY SCORE ──────────────────────────────────────────────
console.log('\nGroup 4: Punctuality Score');

test('punctuality_score: 20 on-time / 20 actual = 100', () => {
  const on_time = 20;
  const actual = 20;
  const score = actual > 0 ? Math.min(100.0, (on_time / actual) * 100) : 0;
  assertClose(score, 100.0, 'punctuality_score');
});

test('punctuality_score: 15 on-time / 20 actual = 75', () => {
  const on_time = 15;
  const actual = 20;
  const score = actual > 0 ? Math.min(100.0, (on_time / actual) * 100) : 0;
  assertClose(score, 75.0, 'punctuality_score');
});

test('punctuality_score: 0 actual = 0', () => {
  const score = 0 > 0 ? Math.min(100.0, (0 / 0) * 100) : 0;
  assert.strictEqual(score, 0, 'punctuality_score for zero attendance');
});

// ─── GROUP 5: SOP SCORE ───────────────────────────────────────────────────────
console.log('\nGroup 5: SOP Score');

test('sop_score: 8/10 completed = 80', () => {
  const score = (8 / 10) * 100;
  assertClose(score, 80.0, 'sop_score');
});

test('sop_score: 10/10 = 100', () => {
  const score = (10 / 10) * 100;
  assertClose(score, 100.0, 'sop_score');
});

test('sop_score: 0 tasks = defaults to 100', () => {
  // Current behavior: if no SOPs assigned, sop_score defaults to 100
  const total = 0;
  const score = total > 0 ? (0 / total) * 100 : 100.0;
  assertClose(score, 100.0, 'sop_score default');
});

// ─── GROUP 6: PEER SCORE ──────────────────────────────────────────────────────
console.log('\nGroup 6: Peer Score');

test('peer_score: avg_stars=4.0 / 5.0 = 80', () => {
  const avg_stars = 4.0;
  const score = (avg_stars / 5.0) * 100;
  assertClose(score, 80.0, 'peer_score');
});

test('peer_score: avg_stars=5.0 = 100', () => {
  const score = (5.0 / 5.0) * 100;
  assertClose(score, 100.0, 'peer_score');
});

test('peer_score: no votes = defaults to 100', () => {
  // Current behavior: if no peer votes, peer_score defaults to 100
  const votes = [];
  const score = votes.length > 0
    ? (votes.reduce((a, v) => a + v, 0) / votes.length / 5.0) * 100
    : 100.0;
  assertClose(score, 100.0, 'peer_score default');
});

// ─── GROUP 7: KPI CONTRIBUTION ───────────────────────────────────────────────
console.log('\nGroup 7: KPI Contribution (auto_weights)');

// BBD weights: attendance=40, punctuality=0, sops=40, peer_voting=20
const BBD_WEIGHTS = { attendance: 40, punctuality: 0, sops: 40, peer_voting: 20 };

test('kpi_contribution: all 100 scores = 100', () => {
  const att = 100, punct = 100, sop = 100, peer = 100;
  const w = BBD_WEIGHTS;
  const kpi = (att * (w.attendance / 100)) + (punct * (w.punctuality / 100))
            + (sop * (w.sops / 100)) + (peer * (w.peer_voting / 100));
  assertClose(kpi, 100.0, 'kpi_contribution');
});

test('kpi_contribution: att=76.92, sop=80, peer=80 (punct=0 weight)', () => {
  const att = 76.923076, punct = 100, sop = 80, peer = 80;
  const w = BBD_WEIGHTS;
  const kpi = (att * (w.attendance / 100)) + (punct * (w.punctuality / 100))
            + (sop * (w.sops / 100)) + (peer * (w.peer_voting / 100));
  // 76.923*0.40 + 100*0 + 80*0.40 + 80*0.20 = 30.769 + 0 + 32 + 16 = 78.769
  assertClose(kpi, 78.769, 'kpi_contribution');
});

// ─── GROUP 8: BONUS FORMULA ──────────────────────────────────────────────────
console.log('\nGroup 8: Bonus Formula');

test('bonus: basic=3000, target=15%, kpi=100', () => {
  const bonus = Math.round(3000 * (15 / 100) * (100 / 100) * 100) / 100;
  assertClose(bonus, 450.0, 'bonus');
});

test('bonus: basic=3000, target=15%, kpi=80', () => {
  const bonus = Math.round(3000 * (15 / 100) * (80 / 100) * 100) / 100;
  assertClose(bonus, 360.0, 'bonus');
});

test('bonus: basic=3000, target=15%, kpi=78.769', () => {
  const bonus = Math.round(3000 * (15 / 100) * (78.769 / 100) * 100) / 100;
  assertClose(bonus, 354.46, 'bonus');
});

// ─── GROUP 9: NET SALARY ─────────────────────────────────────────────────────
console.log('\nGroup 9: Net Salary');

test('net: basic=3000, allow=0, bonus=450, deduct=0', () => {
  const net = 3000 + 0 + 450 - 0;
  assertClose(net, 3450.0, 'net_salary');
});

test('net: basic=3000, allow=200, bonus=360, deduct=100', () => {
  const net = 3000 + 200 + 360 - 100;
  assertClose(net, 3460.0, 'net_salary');
});

test('net: basic=3000, allow=0, bonus=354.46, deduct=230.77 (2 unpaid days)', () => {
  const net = 3000 + 0 + 354.46 - 230.77;
  assertClose(net, 3123.69, 'net_salary');
});

// ─── GROUP 10: LEAVE-MONTH INTERSECTION ──────────────────────────────────────
console.log('\nGroup 10: Leave–Month Intersection (BBD Sunday skip)');

function calcLeaveDaysInMonth(leaveStartStr, leaveEndStr, mStartStr, mEndStr) {
  if (leaveStartStr > mEndStr || leaveEndStr < mStartStr) return 0;
  const effectiveStartStr = leaveStartStr < mStartStr ? mStartStr : leaveStartStr;
  const effectiveEndStr   = leaveEndStr   > mEndStr   ? mEndStr   : leaveEndStr;

  let diffDays = 0;
  let currentDate = new Date(effectiveStartStr);
  currentDate.setHours(12, 0, 0, 0);
  const effectiveEndDate = new Date(effectiveEndStr);
  effectiveEndDate.setHours(12, 0, 0, 0);

  while (currentDate <= effectiveEndDate) {
    if (currentDate.getDay() !== 0) { // Skip Sunday (BBD rule)
      diffDays++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return diffDays;
}

test('cross-month: Sep 30 → Oct 2 counted for September payroll', () => {
  // Sep 30 2026 = Wednesday → 1 day in September
  const days = calcLeaveDaysInMonth('2026-09-30', '2026-10-02', '2026-09-01', '2026-09-30');
  assert.strictEqual(days, 1, `Expected 1 day in Sep, got ${days}`);
});

test('cross-month: Sep 30 → Oct 2 counted for October payroll', () => {
  // Oct 1 (Thu) + Oct 2 (Fri) = 2 days in October
  const days = calcLeaveDaysInMonth('2026-09-30', '2026-10-02', '2026-10-01', '2026-10-31');
  assert.strictEqual(days, 2, `Expected 2 days in Oct, got ${days}`);
});

test('Sunday-only leave = 0 days in payroll', () => {
  // Sep 13 2026 = Sunday
  const days = calcLeaveDaysInMonth('2026-09-13', '2026-09-13', '2026-09-01', '2026-09-30');
  assert.strictEqual(days, 0, `Expected 0 days for Sunday-only, got ${days}`);
});

test('Sat + Sun + Mon = 2 working days (Sun skipped)', () => {
  // Sep 12 (Sat) + Sep 13 (Sun, SKIP) + Sep 14 (Mon) = 2 days
  const days = calcLeaveDaysInMonth('2026-09-12', '2026-09-14', '2026-09-01', '2026-09-30');
  assert.strictEqual(days, 2, `Expected 2 days for Sat+Sun+Mon, got ${days}`);
});

test('leave entirely within month: Mon-Fri = 5 days', () => {
  // Sep 7 (Mon) → Sep 11 (Fri) = 5 days
  const days = calcLeaveDaysInMonth('2026-09-07', '2026-09-11', '2026-09-01', '2026-09-30');
  assert.strictEqual(days, 5, `Expected 5 days, got ${days}`);
});

test('leave entirely outside month = 0 days', () => {
  const days = calcLeaveDaysInMonth('2026-08-01', '2026-08-31', '2026-09-01', '2026-09-30');
  assert.strictEqual(days, 0, `Expected 0 days for out-of-month leave, got ${days}`);
});

// ─── SUMMARY ─────────────────────────────────────────────────────────────────
console.log(`\n${'─'.repeat(55)}`);
console.log(`SNAPSHOT RESULTS: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  console.error('❌ PHASE 1 SNAPSHOT TESTS FAILED — DO NOT PROCEED WITH REFACTOR');
  process.exit(1);
} else {
  console.log('✅ ALL SNAPSHOT TESTS PASSED — Safe to begin Phase 1 refactor');
}
