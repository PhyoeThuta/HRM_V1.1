# BBD Engineering Errors & Bug Log

## Purpose

This document records confirmed bugs, errors, unexpected behavior, production risks, and technical issues discovered during development, testing, refactoring, and production verification. 

This file is a **TRACKING DOCUMENT**, not an automatic fix list. It ensures that issues are logged securely so they are not forgotten during complex architectural migrations.

## Rules

* Record confirmed issues only.
* Do not invent issues.
* Do not silently fix issues that are discovered during unrelated work.
* Every issue must have a unique ID (e.g., `BUG-001`).
* Issues remain `OPEN` until explicitly assigned for fixing.
* Do not change test expectations just to remove a failure.
* Do not fix an issue unless the current task explicitly authorizes the fix.

## Status

Use the following statuses for issues:

* `OPEN — FIX LATER`
* `IN PROGRESS`
* `FIXED — NEEDS VERIFICATION`
* `VERIFIED`
* `WONT FIX`
* `DUPLICATE`

---

## Current Issues

### BUG-001 — Daily Feedback Invalid Customer ID Returns HTTP 200

* **Status**: `OPEN — FIX LATER`
* **Severity**: Low / Medium
* **Detected During**: Phase 0 automated testing.
* **Endpoint / Feature**: `GET /api/daily-feedback/:customer_id`
* **Observed Behavior**: An invalid/non-existent customer ID (e.g., `INVALID_ID`) results in `HTTP 200 OK` instead of an appropriate client error.
* **Expected Behavior**: An appropriate client error such as `400 Bad Request` or `404 Not Found`, based on the existing API conventions and the eventual approved fix.
* **Root Cause**: The Supabase `.eq()` query returns an empty array rather than throwing an exception when an invalid UUID format or non-existent ID is provided. The existing route falls back to returning catalog/menu data and responds with `200 OK`.
* **Affected Files**: `server/routes/daily_feedback.js`
* **Production Impact**: Minimal, but violates REST API conventions and could cause silent failures or confusing UI behavior if the frontend expects a hard error on invalid customer lookup.
* **Recommended Fix**: Add explicit validation of the `customer_id` format (UUID), and if the initial query returns empty, explicitly return `404 Not Found` rather than falling back to default catalog menus.
* **Verification Required**: The `fail_fast.test.js` suite should pass once the endpoint properly returns `400` or `404`.
* **Notes**: Caught by the legacy `fail_fast.test.js` test suite. Do not fix until authorized.
