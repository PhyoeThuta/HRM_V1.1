# 2. Domain Map

*Status:* VERIFIED FROM CODE

Based on the actual codebase structure and API endpoints, the BBD Enterprise Platform currently implements the following major business domains. 

## 1. Human Resource Management (HRM)
- **Responsibilities**: Employee profiles, organizational charts, recruiting, onboarding, offboarding, leave management, attendance tracking, and peer voting.
- **Important Files**: `server/routes/employees.js`, `server/routes/leave.js`, `server/routes/attendance.js`, `server/routes/lifecycle.js`, `server/routes/org.js`, `server/routes/recruitment.js`.
- **Important Tables**: `public.Employees`, `public.Leave_Request`, `public.attendance_records`.
- **External Integrations**: None.
- **Risk Level**: **HIGH**. This is the core foundational domain upon which Auth and Payroll depend.

## 2. Customer Relationship Management (CRM)
- **Responsibilities**: Lead tracking from Facebook, inquiry management, customer profiles, diet package subscriptions, feedback collection, onboarding links.
- **Important Files**: `server/routes/crm.js` (2,375 LOC), `server/routes/enroll.js`, `server/routes/daily_feedback.js`, `server/routes/public.js`.
- **Important Tables**: `crm.customers`, `crm.inquiries`, `crm.customer_packages`, `crm.inquiries_messages`, `crm.feedbacks`.
- **External Integrations**: Zernio (FB Messenger API Bridge), Telegram.
- **Incoming Dependencies**: Operations module reads `crm.customers` data.
- **Risk Level**: **CRITICAL**. The `crm.js` file is the largest God Controller in the system, heavily coupling business logic and DB access.

## 3. Operations (OpsHub) & Kitchen
- **Responsibilities**: Menu definition, daily meal scheduling, generation of kitchen orders based on active CRM packages, rider delivery assignments.
- **Important Files**: `server/routes/operations.js` (1,369 LOC), `server/cron/kitchen_alerts.js`.
- **Important Tables**: `operations.menus`, `operations.daily_menus`, `operations.orders`.
- **External Integrations**: Telegram (Chef alerts).
- **Outgoing Dependencies**: Direct cross-schema reads to `crm.customers` and `crm.customer_packages`.
- **Risk Level**: **HIGH**. High coupling with the CRM domain.

## 4. Inventory
- **Responsibilities**: Tracking raw material items, calculating balances, recording transactions.
- **Important Files**: `server/routes/inventory.js`.
- **Important Tables**: `inventory.items`, `inventory.balances`, `inventory.transactions`.
- **Risk Level**: **LOW**. This is currently the most isolated and clean domain in the system.

## 5. Payroll
- **Responsibilities**: Calculating monthly salary, applying leave deductions, late penalties, and generating payslips.
- **Important Files**: `server/routes/payroll_engine.js`, `server/routes/payroll.js`.
- **Important Tables**: `public.payrolls`.
- **Outgoing Dependencies**: Depends heavily on `HRM` (attendance, leaves) and `Administration` (kpi_assignments).
- **Risk Level**: **MEDIUM**.

## 6. Boss AI / RAG Platform
- **Responsibilities**: Natural language querying of the system database via LLM, automated pdf report generation, automated DB actions via function calling.
- **Important Files**: `server/routes/api_boss.js`, `server/services/vectorSync.js`.
- **Important Tables**: `public.ai_knowledge_base`, `public.boss_chat_sessions`.
- **External Integrations**: Google Gemini API, Puppeteer (PDF Gen).
- **Outgoing Dependencies**: Depends on *ALL* domains.
- **Risk Level**: **CRITICAL**. Extremely high capability surface; can read/write across the entire system.

## 7. Administration & Identity
- **Responsibilities**: RBAC roles, user creation, boss KPI assignments, document management, SOP tracking.
- **Important Files**: `server/routes/auth.js`, `server/routes/api_boss.js`, `server/routes/misc.js`, `server/middleware/auth.js`.
- **Important Tables**: `public.sys_users`, `public.boss_kpi_assignments`, `public.documents`.
- **Risk Level**: **MEDIUM**.
