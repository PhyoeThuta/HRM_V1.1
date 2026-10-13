# 3. API Map

*Status:* VERIFIED FROM CODE

The backend uses Express to route requests. Most business logic is implemented directly inside these route handlers.

## Identity & Auth API
* **Controller**: `server/routes/auth.js`
* `POST /api/auth/login`: Authenticates against `sys_users` (bcrypt) and generates HTTP-only JWTs.
* `POST /api/auth/refresh`: Generates new access token from refresh token.
* `POST /api/auth/logout`: Clears cookies.
* `POST /api/auth/change-password`: Force-password change enforcement.

## Administration API
* **Controller**: `server/routes/api_boss.js`, `server/routes/misc.js`
* `POST /api/boss/users/add`: Create sys_user.
* `GET /api/misc/documents`: Fetch documents.
* `POST /api/misc/boss/announcements`: Global announcements.

## CRM API (The Fat Controller)
* **Controller**: `server/routes/crm.js`
* `GET /api/crm/customers`: Fetches customer data.
* `POST /api/crm/customers`: Creates a customer.
* `GET /api/crm/packages`: Fetches diet packages.
* `POST /api/crm/customers/:id/renew`: Renews a diet package.
* `POST /api/crm/webhooks/zernio`: Public webhook for receiving Facebook messages.
* **Risks**: This file contains 45+ endpoints mixed with heavy DB access.

## Public / Enrollment API
* **Controller**: `server/routes/enroll.js`, `server/routes/public.js`
* `GET /api/enroll/:token`: Serves customer enrollment form.
* `POST /api/enroll/:token`: Submits health, lifestyle, and package selection.
* `POST /api/public/crm/feedback`: Submits customer feedback.
* **Integrations**: Heavily accesses `crm` schema directly.

## Operations API
* **Controller**: `server/routes/operations.js`
* `GET /api/operations/orders`: Fetches kitchen/delivery orders.
* `POST /api/operations/orders/auto-generate`: Massive DB transaction to map active `crm` packages to daily deliveries.
* `PUT /api/operations/orders/:id/rider-status`: Rider delivery updates.

## HRM & Payroll API
* **Controllers**: `employees.js`, `attendance.js`, `leave.js`, `payroll_engine.js`
* `POST /api/attendance/checkin`: Records attendance.
* `POST /api/leave/request`: Employee leave request.
* `GET /api/payroll-engine/calculate/:employee_id/:month`: Dynamically calculates salary based on attendance penalties.

## AI API
* **Controller**: `server/routes/api_boss.js`
* `POST /api/boss/chat`: Handles Gemini LLM interaction, RAG context injection, and Function Calling (executing actions).

## API Architecture Flaws Identified
1. **Duplicate Validation**: Request body validation is scattered; some routes use a unified `validate.js` middleware, while others manually check `if (!req.body.x) return res.status(400)`.
2. **Business Logic in HTTP Layer**: The routes are not thin wrappers. For example, `POST /api/operations/orders/auto-generate` contains hundreds of lines of direct SQL/Supabase logic.
