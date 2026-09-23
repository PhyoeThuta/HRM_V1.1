# 11. Future Microservice Candidates

*Status:* INFERRED FROM CODE ARCHITECTURE

The current goal is a Modular Monolith. However, looking ahead, certain domains exhibit scaling characteristics that make them prime candidates for eventual extraction into independent Microservices.

## 1. The Boss AI / LLM Worker
- **Why**: AI text generation, vector embeddings (`vectorSync.js`), and PDF generation (`Puppeteer`) are CPU and memory intensive. They block the main NodeJS event loop.
- **Current Coupling**: Heavily coupled to the entire database via direct Supabase RPC calls.
- **Extraction Path**: Must be moved to a background queue (e.g., BullMQ) first. Eventually, it can be extracted to a Python or separate NodeJS worker service that only listens to queue events.

## 2. Notification & Webhook Gateway (Zernio / Telegram)
- **Why**: Webhooks (like Facebook Messenger) can experience massive, unpredictable traffic spikes that could crash the main HRM/Operations API.
- **Current Coupling**: Logic is embedded directly in `server/routes/crm.js`.
- **Extraction Path**: Standardize the webhook payload and push to a Kafka or Redis queue. A standalone microservice handles ingestion and queuing, while the main monolith acts as a consumer.

## 3. CRM (Customer Relationship Management)
- **Why**: HRM (internal employees) and CRM (external customers) scale entirely differently.
- **Current Coupling**: Operations directly reads from `crm.customers`.
- **Extraction Path**: Replace cross-schema DB reads with an internal API or event bus before extraction.

## Domains That Should NEVER be Microservices
- **Inventory & Operations**: They are too tightly coupled in real-time business logic. Splitting them would result in distributed transaction nightmares (e.g., deducting stock when creating an order). Keep them in the monolith.
