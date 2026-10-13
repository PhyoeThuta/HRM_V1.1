/**
 * dateUtils.js — Shared Date Utilities
 *
 * Centralised here to avoid the previous duplication across:
 *   - compensationService.js
 *   - attendanceService.js
 *   - payroll_engine.js
 *
 * All date comparisons in this HRM system use Asia/Bangkok (UTC+7).
 * BBD operates in Bangkok timezone. This must not be changed per company
 * without also adding timezone to the future Company Policy configuration.
 */

const PAYROLL_TIMEZONE = 'Asia/Bangkok';

/**
 * Returns a YYYY-MM-DD string for the given date input, interpreted in
 * Asia/Bangkok timezone (UTC+7). Safe for cross-midnight date comparisons.
 *
 * @param {Date|string|number} dateInput - Any value parseable by new Date()
 * @returns {string} YYYY-MM-DD formatted date string
 */
export function getBkkDateString(dateInput) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: PAYROLL_TIMEZONE }).format(
    new Date(dateInput)
  );
}
