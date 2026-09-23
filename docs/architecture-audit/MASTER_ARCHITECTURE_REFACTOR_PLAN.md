# MASTER ARCHITECTURE REFACTOR PLAN

**Date**: 2026-09-22
**Target**: BBD Enterprise Platform (Production)

## 1. Executive Summary
The BBD Enterprise platform is a powerful, feature-rich monolithic application currently suffering from severe "Fat Controller" syndrome. All business logic, database access, and webhook handling are jammed into massive HTTP route files (e.g., `crm.js` at 2,375 lines). While the database schemas are cleanly separated into domains (`public`, `crm`, `operations`, `inventory`), the application code completely ignores these boundaries, creating a highly coupled, high-risk environment.

This plan details the safe, phased migration to a **Modular Monolith** architecture.

## 2. Current Architecture & Major Problems
* **Architecture**: Express API serving a React frontend, deployed via Docker to a GCP VM. Database is Supabase (PostgreSQL).
* **Major Problem 1 (Fat Controllers)**: `crm.js` and `operations.js` contain almost the entirety of the company's business rules mixed with raw HTTP request parsing.
* **Major Problem 2 (Direct DB Access)**: There are no Services or Repositories. Routes execute direct `supabaseAdmin` SQL queries.
* **Major Problem 3 (Testing)**: There are only 176 lines of test code. Refactoring without tests is extremely dangerous.

## 3. Major Risks
- **Boss AI God Object**: The `api_boss.js` file has raw knowledge of the entire database schema hardcoded in its prompt. Schema changes will break the AI silently.
- **Operations → CRM Coupling**: Operations accesses CRM tables directly. Changing CRM breaks Kitchen operations.

## 4. Proposed Modular Monolith
The target state moves logic out of `routes/*.js` and into isolated modules:
```text
server/modules/
  ├── identity/
  ├── hrm/
  ├── crm/
  ├── operations/
  ├── inventory/
  └── ai/
```
**Rules**:
1. Modules communicate strictly via exported `Service` methods.
2. Cross-schema database querying is strictly forbidden.

## 5. Recommended First Module: Inventory
**Why**: The Inventory domain (`inventory.items`, `inventory.balances`) is the most isolated. It does not contain complex webhook logic like CRM, and it does not drive company-wide payroll like HRM. Refactoring it first proves the `controller -> service -> repository` pattern safely.

## 6. Refactoring Order
1. **Phase 0**: Write Integration API Tests for core flows.
2. **Phase 1**: Extract shared infrastructure (Supabase client, Telegram, JWT).
3. **Phase 2**: Extract `Inventory` module.
4. **Phase 3**: Extract `HRM` module (Employees, Attendance, Leave).
5. **Phase 4**: Extract `CRM` module (Breaking up the 2.3k LOC fat controller).
6. **Phase 5**: Extract `Operations` module (Resolving cross-domain dependencies with CRM).
7. **Phase 6**: Refactor `Boss AI` to use the new module services.

## 7. Future Microservice Candidates
- **AI Worker**: Heavy PDF generation and vector sync should be moved off the main NodeJS event loop.
- **Webhook Gateway**: Facebook Messenger webhooks should be handled by an edge service and queued to prevent crashing the main app during traffic spikes.

## 8. Mobile Readiness
The architecture is generally ready for the upcoming Flutter app, but requires two immediate changes:
1. Support for `Bearer` tokens in headers (not just cookies).
2. Pagination on massive list endpoints to prevent memory exhaustion on mobile devices.

## 9. Conclusion
By following the strict phased approach outlined in this document, BBD can resolve its technical debt and safely transition to a Modular Monolith without risking production stability.
