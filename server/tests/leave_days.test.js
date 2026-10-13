import { getWorkingDays } from '../modules/hrm/service/leaveService.js';
import assert from 'assert';

console.log('\n--- 🧪 RUNNING LEAVE DAYS (WEEKEND EXCLUSION) TESTS ---');

try {
  // 1. Normal weekday leave (Wed to Fri = 3 days)
  let count = getWorkingDays('2026-09-09', '2026-09-11'); 
  assert.strictEqual(count, 3, `Expected 3 days for Wed-Fri, got ${count}`);
  console.log('✅ PASS: Normal weekday leave (Wed-Fri = 3 days)');

  // 2. Sunday only (Sun to Sun = 0 days)
  // Sept 13, 2026 is a Sunday
  count = getWorkingDays('2026-09-13', '2026-09-13');
  assert.strictEqual(count, 0, `Expected 0 days for Sunday-only leave, got ${count}`);
  console.log('✅ PASS: Sunday only (Sun = 0 days)');

  // 3. Saturday + Sunday + Monday leave (Sat to Mon = 2 days)
  // Sept 12 (Sat) to Sept 14 (Mon)
  count = getWorkingDays('2026-09-12', '2026-09-14');
  assert.strictEqual(count, 2, `Expected 2 days for Sat-Mon leave, got ${count}`);
  console.log('✅ PASS: Saturday + Sunday + Monday leave (Sat, Mon = 2 days)');

  // 4. Cross-month leave (Sep 30 to Oct 2)
  // Sep 30 (Wed), Oct 1 (Thu), Oct 2 (Fri) = 3 days
  count = getWorkingDays('2026-09-30', '2026-10-02');
  assert.strictEqual(count, 3, `Expected 3 days for cross-month (Sep 30 - Oct 2), got ${count}`);
  console.log('✅ PASS: Cross-month leave (Sep 30 Wed -> Oct 2 Fri = 3 days)');

  // 5. Cross-month spanning a weekend (Sep 25 Fri -> Oct 5 Mon)
  // Sep 25(Fri), 26(Sat), 27(Sun, SKIP), 28(Mon), 29(Tue), 30(Wed), Oct 1(Thu), 2(Fri), 3(Sat), 4(Sun, SKIP), 5(Mon)
  // Total days = 11 days. Minus 2 Sundays = 9 working days.
  count = getWorkingDays('2026-09-25', '2026-10-05');
  assert.strictEqual(count, 9, `Expected 9 days for long cross-month leave, got ${count}`);
  console.log('✅ PASS: Long cross-month spanning weekends (Sep 25 -> Oct 5 = 9 days)');

  console.log('🎉 ALL LEAVE DAYS TESTS PASSED SUCCESSFULLY!\n');
} catch (error) {
  console.error('❌ TEST FAILED:', error.message);
  process.exit(1);
}
