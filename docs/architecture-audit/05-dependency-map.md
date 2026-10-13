# 5. Dependency Map

*Status:* VERIFIED FROM CODE

This map details how the various domains in the BBD Enterprise Platform currently interact. The most dangerous interactions are marked as "High Risk".

## Domain Dependency Graph

```text
Identity & Auth ──────┐
                      │
   ┌──────────────────┴──────────────────┐
   ▼                                     ▼
  HRM ◄───────────────┐                 CRM ◄─────────────┐
   │                  │                  │                │
   │                  │                  │                │
   ▼                  │                  ▼                │
Payroll ◄──────── Administration       Operations ────────┘
                      │                  │
                      │                  │
                      │                  ▼
                      └─────────────► Inventory


          AI Platform (Boss AI)
            │
            ▼ (Reads & Writes to all domains)
      [HRM, CRM, Ops, Admin]
```

## Analyzed Cross-Domain Dependencies

### 1. Operations → CRM (High Risk)
- **Dependency**: The Operations module (`server/routes/operations.js`) directly queries `crm.customers` and `crm.customer_packages` to generate daily kitchen orders.
- **Evidence**: `operations.js` Line 1450: `await supabaseAdmin.schema('crm').from('customers')`.
- **Problem**: Changing the CRM package schema will break Kitchen generation.

### 2. CRM → HRM / Employees (Medium Risk)
- **Dependency**: CRM routes often look up Employee IDs (Sales Agents, Riders).
- **Problem**: CRM depends on `public.Employees`.

### 3. Payroll → HRM (Medium Risk)
- **Dependency**: `server/routes/payroll_engine.js` aggregates attendance and leave.
- **Evidence**: It pulls from `public.attendance_records` and `public.Leave_Request`.
- **Problem**: This is a natural dependency, but the lack of a shared service means payroll recalculates attendance penalties from raw DB rows instead of querying an `AttendanceService`.

### 4. Boss AI → Everything (Critical Risk)
- **Dependency**: `server/routes/api_boss.js` orchestrates functions across the entire platform.
- **Evidence**: It explicitly references `Leave_Request`, `Employees`, `boss_kpi_assignments`, and calls CRM functions like `extend_customer_package`.
- **Problem**: The AI Agent acts as a God Module. If any domain changes its database schema, the AI's system prompt and tool definitions will break silently.

## Circular Dependencies
None identified at the import layer (since Express routes don't import each other), but at the database layer, CRM and Operations share deep conceptual coupling.
