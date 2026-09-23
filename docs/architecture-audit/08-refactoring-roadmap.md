# 8. Safe Refactoring Roadmap

*Status:* INFERRED FROM CODE ARCHITECTURE

A "big bang" rewrite of a 10,000+ LOC monolithic backend is highly dangerous. The refactoring must occur in strict phases to preserve production stability.

## Phase 0: Baseline & Test Scaffolding
- **Goal**: Lock in current behavior.
- **Action**: Write End-to-End (E2E) HTTP tests for critical paths: Login, `operations/orders/auto-generate`, and `crm/customers`.
- **Rule**: Do not touch application code.

## Phase 1: Shared Infrastructure Cleanup
- **Goal**: Standardize DB and API access.
- **Action**: Extract the Supabase client, Telegram helpers, and Gemini setup into `server/infrastructure/` and `server/shared/`.
- **Action**: Standardize the JWT `verifyToken` middleware in `server/shared/auth/`.

## Phase 2: Extract the Easiest Domain (Inventory)
- **Goal**: Prove the Modular Monolith pattern.
- **Action**: Refactor `server/routes/inventory.js` into `server/modules/inventory/`.
- **Why**: It has the fewest cross-domain dependencies. It is isolated and low-risk.

## Phase 3: Extract Human Resources (HRM)
- **Goal**: Extract the foundation.
- **Action**: Split `employees.js`, `leave.js`, `attendance.js` into `server/modules/hrm/`.
- **Action**: Update `payroll_engine.js` to rely on the new `hrm.service.js` instead of raw SQL queries.

## Phase 4: Tackle the CRM Fat Controller
- **Goal**: Break down the massive `crm.js`.
- **Action**: Create `server/modules/crm/`.
- **Action**: Split into `customer.service.js`, `package.service.js`, and `webhook.service.js`.
- **Risk Mitigation**: Run exhaustive API tests before merging.

## Phase 5: Operations & Cross-Domain Resolution
- **Goal**: Remove DB coupling.
- **Action**: Refactor `operations.js` into `server/modules/operations/`.
- **Action**: Replace direct `supabaseAdmin.schema('crm')` calls with `crmService` method calls.

## Phase 6: The AI Agent & Final Cleanup
- **Goal**: Protect the Boss AI.
- **Action**: Refactor `api_boss.js` to use the newly created services instead of direct DB access. Update the System Prompt to be generated dynamically from module configurations.

## Phase 7: Production Hardening
- **Goal**: Prepare for scale.
- **Action**: Implement caching, validate mobile API readiness, and evaluate background workers (e.g., BullMQ) for heavy cron jobs.
