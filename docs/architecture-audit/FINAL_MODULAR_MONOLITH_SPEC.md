# FINAL MODULAR MONOLITH SPECIFICATION

**Target**: BBD Enterprise Platform
**Status**: READ-ONLY ARCHITECTURE AUDIT COMPLETE
**Document Purpose**: Authoritative technical specification for the future refactoring work.

---

## 1. Current Architecture Summary
*VERIFIED FROM CODE*
The BBD Enterprise Platform is a monolith containing a React (Vite) frontend and an Express/Node.js backend, deployed via Docker. The database is hosted on Supabase (PostgreSQL) and uses schema separation (`public`, `crm`, `operations`, `inventory`). The backend connects to Supabase using the service role key, bypassing RLS. The backend acts as a collection of "fat controllers" (`server/routes/*.js`), mixing HTTP parsing, raw database queries, webhook processing, and business logic. External integrations include Google Gemini, Zernio (FB Messenger), and Telegram.

## 2. Verified Architectural Problems
*VERIFIED FROM CODE*
- **Fat Controllers**: `crm.js` (2,375 LOC) and `operations.js` (1,369 LOC) contain massive amounts of complex, unabstracted business rules.
- **Cross-Domain Database Access**: `operations.js` directly queries `crm.customers` and `crm.customer_packages`.
- **Zero Test Coverage for Core Flows**: The backend possesses only 176 lines of test code. 
- **AI Schema Coupling**: The Boss AI prompt (`api_boss.js`) hardcodes raw database table structures.
- **Missing Application Layers**: There is no distinction between HTTP routing, business services, and database repositories.

## 3. Target Architecture
*FUTURE DESIGN DECISION*
The target is a **Modular Monolith**. 
- No microservices will be extracted at this time. 
- All domains remain inside the same backend application.
- Domains communicate through public service interfaces, not cross-schema DB queries.
- HTTP routing, business logic, and database access will be split into Controllers, Services, and Repositories.

## 4. Final Module Boundaries
*INFERRED FROM CODE*
Based on actual API routes and database schemas:
1. **identity**: Auth, RBAC, User Management (`sys_users`).
2. **administration**: Documents, Announcements, KPI assignments.
3. **hrm**: Employees, Attendance, Leave.
4. **payroll**: Payroll generation.
5. **crm**: Customers, Packages, Inquiries, Webhooks, Feedback.
6. **operations**: Menus, Orders, Rider Tracking.
7. **inventory**: Items, Transactions, Balances.
8. **ai**: Boss AI chat, RAG embeddings.

## 5. Final Directory Structure
*FUTURE DESIGN DECISION*
```text
server/
├── modules/
│   ├── identity/          
│   ├── administration/    
│   ├── hrm/               
│   ├── payroll/           
│   ├── crm/               
│   ├── operations/        
│   ├── inventory/         
│   └── ai/                
│
├── shared/
│   ├── auth/              # JWT verification middleware
│   ├── db/                # Centralized Supabase Client
│   ├── errors/            # Global error handlers
│   └── utils/             # Cross-cutting utilities
│
└── infrastructure/
    ├── llm/               # Gemini wrappers
    ├── messenger/         # Zernio API clients
    └── notifications/     # Telegram integrations
```

## 6. Module Responsibilities
*INFERRED FROM CODE*
- **identity**: Authenticate users, manage JWTs, enforce roles.
- **hrm**: Employee lifecycle tracking, biometric maps, clock-in rules.
- **crm**: External customer lifecycles, Facebook leads via Zernio, diet package expiries.
- **operations**: Kitchen menu planning, order generation, delivery tracking.
- **ai**: Processing natural language, fetching RAG context, executing registered tool actions.

## 7. Module Public Interfaces
*FUTURE DESIGN DECISION*
Every module exposes a public API (typically `index.js` or `service.js`) for internal use by other modules.
- Example: `crmService.getActivePackages()`
- No module may export its Database Repository methods.

## 8. Allowed Dependencies
*FUTURE DESIGN DECISION*
- `operations` may depend on `crm` (to fetch packages).
- `payroll` may depend on `hrm` (to fetch attendance).
- `ai` may depend on all modules (to act as a universal agent).
- All modules may depend on `shared/` and `infrastructure/`.

## 9. Forbidden Dependencies
*FUTURE DESIGN DECISION*
- Circular dependencies are strictly forbidden (e.g., `crm` depending on `operations` while `operations` depends on `crm`).
- Domain modules must not depend on external SDKs directly (e.g., no `node-fetch` to Zernio inside `crm.service.js`—use `infrastructure/messenger`).

## 10. Database Access Rules
*FUTURE DESIGN DECISION*
- **Module Ownership**: A module exclusively owns its database tables. (e.g., `operations` owns the `operations` schema).
- **No Cross-Domain DB Queries**: `operations` MUST NOT query `crm.customers`. It must call `crmService.getCustomerDetails(id)`.

## 11. Controller / Service / Repository Rules
*FUTURE DESIGN DECISION*
- **Controllers (Thin)**: Handle HTTP input (`req`), perform validation, read auth context (`req.user`), call `Service`, and return HTTP JSON responses.
- **Services (Business)**: Enforce business rules, calculate data, and coordinate multiple Repositories or Infrastructure clients. Must not know about HTTP requests or responses.
- **Repositories (Data)**: The *only* layer allowed to import and use the Supabase client. Responsible solely for CRUD operations on the database.

## 12. Shared Infrastructure Rules
*FUTURE DESIGN DECISION*
Code in `infrastructure/` (Telegram, Gemini, Zernio) must be generic wrappers. They must not contain BBD-specific business logic. 

## 13. API Compatibility Rules
*FUTURE DESIGN DECISION*
Existing frontend behavior MUST remain compatible. Do not change JSON response structures, array structures, field names, or endpoint URLs during this structural refactor. The UI must not break.

## 14. Authentication and RBAC Rules
*VERIFIED FROM CODE*
Auth is managed via HTTP-only JWT cookies, checked via `verifyToken`, `requireAdmin`, etc.
*FUTURE DESIGN DECISION*
These middlewares must be moved to `shared/auth/` and remain unchanged in behavior to preserve API compatibility.

## 15. Error Handling Rules
*FUTURE DESIGN DECISION*
Hidden errors (swallowed exceptions) found in routes must be replaced with a unified `Next(err)` pattern leading to a centralized Express error-handling middleware in `shared/errors/`.

## 16. Logging and Observability Rules
*FUTURE DESIGN DECISION*
Implement standard JSON logging (e.g., Pino) inside the `shared/` folder to trace actions, especially critical webhook ingestion and AI tool executions.

## 17. AI / Boss AI Architecture Rules
*FUTURE DESIGN DECISION*
The Boss AI must not rely on hardcoded raw database schemas. 
- **Tool Registry**: Move function-calling logic from `api_boss.js` into an `AiToolRegistry`.
- **Domain Capabilities**: AI tools must call Domain Services (e.g., `hrmService.approveLeaveRequests()`) rather than executing raw SQL.

## 18. CRM / Operations Integration Rules
*FUTURE DESIGN DECISION*
The direct SQL queries inside `POST /api/operations/orders/auto-generate` that read `crm` tables must be extracted. The `operations.service.js` will instead request a list of daily deliverables from `crm.service.js`.

## 19. Background Jobs / Cron Rules
*VERIFIED FROM CODE*
Crons live in `server/cron/*.js`.
*FUTURE DESIGN DECISION*
Crons will become thin triggers. They will import Domain Services and execute them. Example: `customer_followups.js` will simply call `crmService.processDailyFollowups()`.

## 20. Webhook Rules
*FUTURE DESIGN DECISION*
Webhooks must return a `200 OK` to the provider (Zernio) as fast as possible to prevent retries. Heavy business logic must be passed to the Service layer asynchronously.

## 21. Realtime Rules
*VERIFIED FROM CODE*
Realtime utilizes Supabase subscriptions (`crmRealtime.js`) and Socket.io.
*FUTURE DESIGN DECISION*
These event listeners should remain structurally similar but be relocated to `infrastructure/realtime/`.

## 22. Mobile API Readiness
*FUTURE DESIGN DECISION*
Before launching the Flutter app, ensure `shared/auth` can accept `Bearer <token>` headers as a fallback to cookies. Pagination must be added to list endpoints via Service parameters, while maintaining backwards compatibility for the web frontend.

## 23. Testing Requirements Before Refactoring
*FUTURE DESIGN DECISION*
Before modifying *any* module, integration tests MUST be written for:
1. `POST /api/operations/orders/auto-generate`
2. `POST /api/crm/webhooks/zernio`
3. `GET /api/payroll-engine/calculate/:employee_id/:month`
4. Login / Authentication Flow.

## 24. Refactoring Order
*FUTURE DESIGN DECISION*
1. Write Integration Tests (Testing Gate).
2. Establish `shared/` and `infrastructure/`.
3. Extract `inventory` (Safest module).
4. Extract `hrm` and `payroll`.
5. Extract `crm`.
6. Extract `operations`.
7. Extract `ai`.

## 25. Git Branch and Commit Strategy
*FUTURE DESIGN DECISION*
Refactor one module per PR. Branch naming convention: `refactor/module-[name]`. Commits must be atomic. Do not mix feature changes with structural refactoring.

## 26. Production Safety and Rollback Strategy
*FUTURE DESIGN DECISION*
Ensure the GCP deployment pipeline remains unchanged. If a refactored module causes a production incident, rollback must be achievable by reverting the Git commit and letting `.github/workflows/deploy.yml` redeploy the previous image. 

## 27. Future Microservice Extraction Strategy
*FUTURE DESIGN DECISION*
No services will be extracted now. Future candidates for extraction (if scale requires) include:
1. **AI Worker**: Due to CPU blocking during PDF generation/vector sync.
2. **Webhook Gateway**: To buffer massive influxes of Facebook Messenger events into a message queue.

## 28. Explicit DO NOT CHANGE List
*FUTURE DESIGN DECISION*
During refactoring, the following MUST NOT CHANGE:
1. Database Schemas (`public`, `crm`, `operations`, `inventory`).
2. Express API Route URLs (e.g., `/api/crm/customers` must remain exactly the same).
3. JSON Response Payloads to the Frontend.
4. JWT Cookie implementation details.
5. The Zernio Webhook Payload Signature.

## 29. Definition of Done for Each Refactoring Phase
*FUTURE DESIGN DECISION*
A module refactoring is "Done" when:
1. The route file is deleted from the legacy `server/routes/` folder.
2. The logic is split cleanly into Controller, Service, and Repository.
3. The module passes the pre-written Integration Tests.
4. The frontend UI operates without throwing React errors.
5. Code review confirms ZERO cross-domain database queries.

---

### AUTHORITATIVE REFACTORING PRINCIPLE

The BBD Enterprise Platform will be migrated from its current monolithic/fat-controller structure into a modular monolith incrementally, preserving existing production behavior and preparing selected domains for possible future extraction. No "big bang" rewrites will occur, and API compatibility will be maintained to protect the existing frontend.
