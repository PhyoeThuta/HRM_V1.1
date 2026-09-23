# 4. Database Map

*Status:* VERIFIED FROM CODE

The database is hosted on Supabase (PostgreSQL). The repository structure strictly relies on `supabaseAdmin` for almost all data access (bypassing RLS by using the Service Role Key in the backend).

## `public` Schema (Shared & HRM)
* `sys_users`: Identity and authentication.
* `Employees`: Core employee profiles.
* `Leave_Request`: Leave applications.
* `attendance_records`: Clock in/out data.
* `boss_kpi_assignments`: Admin tasking.
* `payrolls`: Generated payrolls.
* `ai_knowledge_base`: Utilizing `pgvector` for RAG embeddings.

## `crm` Schema (Customer Domain)
* `customers`: Core profiles, delivery addresses, health, lifestyle profiles.
* `inquiries`: Active leads interacting via Facebook.
* `inquiries_messages`: Chat logs ingested from Zernio.
* `customer_packages`: Diet subscription active/expired statuses.
* `feedbacks`: Customer complaints/reviews.

## `operations` Schema (Kitchen & Delivery Domain)
* `menus`: Master list of available meals.
* `daily_menus`: Scheduled meals for specific dates.
* `orders`: Customer deliveries generated from `crm.customer_packages`.
* `recipes`: Bill of materials connecting to `inventory`.

## `inventory` Schema (Stock Domain)
* `items`: Master inventory catalog.
* `balances`: Current quantity of items.
* `transactions`: In/out ledger.

## Database Access Patterns Identified
1. **Direct Access via Supabase Client**: The backend strictly uses `@supabase/supabase-js`. Example:
   ```javascript
   const { data } = await supabaseAdmin.schema('crm').from('customers').select('*');
   ```
2. **No Repository Layer**: SQL logic and Supabase chain calls are embedded directly inside Express route handlers. 
3. **Cross-Schema Queries**: While data is cleanly separated into PostgreSQL schemas, the backend controllers ignore these boundaries, reading across schemas whenever convenient (e.g., `operations.js` directly reading `crm.customers`).
