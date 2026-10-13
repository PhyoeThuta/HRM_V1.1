# 6. Spaghetti Risk Report

*Status:* VERIFIED FROM CODE

Based on the inspection of the Express backend and React frontend, here is the concrete evidence of architectural "spaghetti" patterns that pose severe risks.

## A. Fat Controllers
**Problem**: Controllers/routes containing massive amounts of business logic.
**File**: `server/routes/crm.js`
**Evidence**: This single file is 2,375 lines of code (105 KB). It contains over 45 endpoints.
**Why it is risky**: It mixes authentication checks, raw database queries, business rules (calculating package expiries), and webhook handling. Changing one CRM feature risks breaking others.
**Suggested direction**: Extract into `server/modules/crm/services/`.
**Priority**: CRITICAL

## B. Direct Cross-Domain Database Access
**Problem**: One module directly manipulating another module's internal tables.
**File**: `server/routes/operations.js` (1,369 lines)
**Evidence**: `await supabaseAdmin.schema('crm').from('customers')` occurs repeatedly.
**Why it is risky**: Operations should not need to know the database structure of CRM. This prevents extracting CRM or Operations into independent services.
**Suggested direction**: Create a `CustomerService.getCustomersForOrders()` interface.
**Priority**: HIGH

## C. Zero Test Coverage for Critical Logic
**Problem**: The entire backend has less than 200 lines of test code.
**File**: `server/tests/`
**Evidence**: `hrm.test.js`, `crm_ops.test.js` contain almost nothing.
**Why it is risky**: Refactoring Fat Controllers will almost certainly break production without unit tests covering the complex SQL logic.
**Suggested direction**: Implement smoke tests and integration tests for critical flows (like `POST /api/operations/orders/auto-generate`) *before* refactoring.
**Priority**: CRITICAL

## D. The God AI Controller
**Problem**: The AI Agent controller knows too much.
**File**: `server/routes/api_boss.js` (735 lines)
**Evidence**: The system prompt hardcodes the exact PostgreSQL table structures (e.g., `- crm.customers (id, full_name...)`).
**Why it is risky**: When developers add or rename a column in the database, the AI will fail at runtime because the prompt is disconnected from the actual schema definition.
**Suggested direction**: Dynamically generate the AI prompt schema definitions from the ORM / Service layer.
**Priority**: HIGH

## E. Frontend is Relatively Clean
**Status**: VERIFIED.
**Evidence**: `hrm-client/src/App.jsx` handles routing correctly with protected routes. Components rely heavily on API calls rather than trying to access the Supabase DB directly.
**Risk**: LOW. The frontend does not need a massive architectural overhaul, only minor cleanup to align with the backend's future modularity.
