# 7. Target Modular Monolith Proposal

*Status:* INFERRED FROM CODE ARCHITECTURE

Based on the current monolithic structure and the identified domain entanglements, the following target architecture is proposed. This moves the system from "Fat Controllers" to strict "Domain Modules."

## Proposed Directory Structure

```text
server/
├── modules/
│   ├── identity/          # sys_users, auth, rbac
│   ├── administration/    # kpi, documents, announcements
│   ├── hrm/               # employees, attendance, leave
│   ├── payroll/           # payroll engine
│   ├── crm/               # customers, packages, inquiries, webhooks
│   ├── operations/        # menus, daily_menus, orders
│   ├── inventory/         # items, transactions
│   └── ai/                # boss agent, vector sync
│
├── shared/
│   ├── auth/              # JWT verification middleware
│   ├── errors/            # Global error handlers
│   └── db/                # Centralized Supabase Client
│
└── infrastructure/
    ├── llm/               # Gemini API wrappers
    ├── messenger/         # Zernio API wrappers
    └── notifications/     # Telegram integrations
```

## Module Architecture (Inside a Module)

Every module in `server/modules/` MUST adhere to the following structure:

```text
modules/crm/
├── crm.controller.js      # Express Routes (HTTP Layer only)
├── crm.service.js         # Business Logic (No HTTP req/res)
├── crm.repository.js      # Database Access (Only module that imports Supabase)
└── index.js               # Public Module Interface (Exports service methods)
```

## Rules of the Modular Monolith

1. **No Cross-Schema Database Access**: `operations.repository.js` CANNOT query the `crm` schema.
2. **Strict Module Interfaces**: If Operations needs CRM data, it must call `crmService.getActivePackages()` via the `crm` module's public `index.js`.
3. **Thin Controllers**: `controller.js` must ONLY parse HTTP requests, call `service.js`, and return HTTP responses. No business logic. No database calls.
4. **Isolated Infrastructure**: External integrations (Telegram, Zernio, Gemini) must live in `infrastructure/` and be injected or called by services, preventing vendor lock-in inside domain logic.
