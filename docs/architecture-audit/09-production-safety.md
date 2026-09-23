# 9. Production Safety Plan

*Status:* VERIFIED FROM CODE

During the refactoring phases, the following production systems and behaviors MUST be preserved and protected. Breaking any of these will result in immediate business impact.

## "DO NOT BREAK" List

### 1. The Zernio Webhook Pipeline
- **Endpoint**: `POST /api/crm/webhooks/zernio`
- **Why**: This receives live leads and messages from Facebook. If this breaks, sales teams lose visibility into new leads instantly. 
- **Rule**: Never change the request payload signature.

### 2. Automated Follow-up Crons
- **Files**: `server/cron/customer_followups.js`
- **Why**: This job runs at 10:00 AM daily to ping customers whose diet packages are expiring. It relies on specific database states in `crm.customer_packages`.
- **Rule**: If the CRM schema or service changes, ensure this cron job is thoroughly tested.

### 3. Kitchen Orders Auto-Generation
- **Endpoint**: `POST /api/operations/orders/auto-generate`
- **Why**: This single endpoint bridges CRM subscriptions to physical Kitchen deliveries. If this calculation is slightly off, customers do not get their meals.
- **Rule**: This logic must be locked down with Snapshot Tests before it is refactored out of `operations.js`.

### 4. Database RLS and Schema Access
- **Current State**: The backend uses the Supabase Service Role key (Admin).
- **Rule**: Do not accidentally swap the Service Role key for the Anon key in the backend, as the entire system currently bypasses Row Level Security (RLS).

### 5. Frontend API Contracts
- **Why**: The React frontend relies heavily on exactly formatted JSON arrays returned by the Express routes.
- **Rule**: When moving to `modules/`, the `controller.js` must map the domain entity back to the EXACT JSON format the legacy `routes/*.js` previously returned. Do not change object keys.
