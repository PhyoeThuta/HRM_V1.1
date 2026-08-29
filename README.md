# 🚀 BBD (Busy Boss Diet) Enterprise Platform

Welcome to the **BBD Enterprise Platform** — a massive, all-in-one ecosystem custom-built for managing a Diet & Meal Delivery business. This platform unifies Human Resource Management (HRM), Customer Relationship Management (CRM), Operations, Inventory, and cutting-edge Artificial Intelligence (RAG, Chatbots) into a single, cohesive web application.

---

## 🛠️ Technology Stack & Infrastructure

This system is built for performance, scalability, and AI readiness.

- **Frontend:** React (Vite), Tailwind CSS, React Router v6, Lucide Icons (Glassmorphism & Dark Mode UI).
- **Backend:** Node.js, Express.js.
- **Database:** Supabase (PostgreSQL).
- **AI & Vector DB:** Google Gemini (`gemini-2.5-flash`), `pgvector` (Supabase extension for embeddings).
- **Real-time:** Supabase Realtime WebSockets.
- **Integrations:** Zernio API & Webhooks (for Omni-channel Facebook Messenger).
- **Deployment:** PM2, GitHub Actions (CI/CD to GCP Virtual Machine).

---

## 🧠 AI Integrations & Smart Features

The platform leverages AI not just as a gimmick, but as a core operational engine.

### 1. Retrieval-Augmented Generation (RAG) & Vector Database
- **`pgvector` Integration:** Supabase is configured with the `pgvector` extension to store multi-dimensional vector embeddings.
- **Document Chunking:** SOPs (Standard Operating Procedures) and internal HR Documents are automatically parsed, split into semantically meaningful chunks, and converted into embeddings using the Gemini API.
- **Boss Chatbot (RAG):** The Executive Dashboard features a dedicated AI Assistant. When the Boss asks a question, the system uses cosine similarity search against the `pgvector` database to retrieve the most relevant chunks, feeding them into Gemini to generate highly accurate, context-aware answers based strictly on internal company data.

### 2. Smart CRM & Omni-Channel AI
- **Real-time Intent & Sentiment Analysis:** Every message received via Facebook Messenger (routed through Zernio Webhooks) is analyzed in the background by Gemini.
- **Auto-Pipeline Updates:** AI automatically detects if a customer is `new`, `in_progress`, `converted`, or `closed`, and scores their sentiment (positive, neutral, frustrated).
- **AI Auto-Responder (Smart Deduplication):** If a customer explicitly shows purchase intent (e.g., "I want to buy a 1-week plan"), the AI generates a polite Burmese response appending the correct Payment Details (KBZ Pay, BKK Bank). The webhook engine utilizes strict deduplication logic to prevent infinite echo loops.
- **Recommended Actions:** For complex inquiries, AI suggests the best response for human admins directly in the CRM Inbox.

---

## 🌟 Comprehensive Feature Breakdown

### 👥 Human Resource Management (HRM)
The core of the internal operations, managing the employee lifecycle from hiring to retiring.

* **Employee Directory & Profiles:** Detailed records of all staff, emergency contacts, and job history.
* **Smart Attendance:** 
  * Features both **QR Code Check-in** and **Photo Check-in** via the Employee Portal.
  * Weekly Roster Planner for shift scheduling.
* **Leave Management & Overtime:** Automated leave request workflows, leave balance tracking, and overtime approvals (`OvertimeTab`).
* **Payroll Engine (`MyPayslips`):** Fully automated payroll generation, calculating base salaries, overtime pay, deductions, and distributing digital payslips.
* **Recruitment & Applicant Tracking:** 
  * Public-facing `/careers` page for applicants to submit resumes.
  * Internal Kanban board for tracking candidates through interview stages.
* **Onboarding & Offboarding Checklists:** Structured workflows for HR to ensure new hires get access and departing employees return assets.
* **Handovers:** Formal system for employees to pass ongoing tasks to successors (`Handovers.jsx`).
* **Performance & KPIs:** Boss-level dashboard to assign and track Key Performance Indicators for departments (`BossKPI.jsx`).
* **Company Culture:** Peer-to-peer voting systems (`PeerVoting.jsx`) and automated Birthday reminders (`Birthdays.jsx`).
* **Document Vault & SOPs:** Centralized storage for company policies (which feed the RAG AI).
* **Announcements:** Company-wide bulletin board.

### 💬 Customer Relationship Management (CRM)
A fully integrated sales and support hub tailored for meal plan subscriptions.

* **Omni-Channel Inbox (`Inquiries.jsx`):** A unified 2-way chat interface pulling live messages from Facebook Page via Zernio, allowing admins to chat without leaving the dashboard.
* **Customer Database (`CustomerDetail.jsx`):** Tracks contact info, delivery addresses, allergies, and complete purchase history.
* **Leads Pipeline (`LeadsPipeline.jsx`):** Visual drag-and-drop board for tracking potential customers.
* **Package Management (`Packages.jsx`):** Define diet plans (e.g., 1-Day Trial, 30-Day Keto) and pricing.
* **Customer Tiers (`LevelSettings.jsx`):** VIP / Regular status tracking.
* **Auto-Pilot Renewals (Cron Jobs):** A backend scheduled engine (`cron/customer_followups.js`) that automatically tracks when a customer's meal plan is about to expire and sends a polite follow-up message exactly on time.

### 📦 Operations & Kitchen Hub (Ops)
Daily management of food production and delivery.

* **Ops Dashboard:** Real-time overview of the day's tasks.
* **Menus Management (`MenusMgmt.jsx`):** Planning the weekly diet menus and recipes.
* **Orders & Delivery Management (`OrdersMgmt.jsx`):** Tracking which meals go to which delivery zones on a daily basis.
* **Kitchen Dashboard (`KitchenDashboard.jsx`):** A simplified, high-contrast view for kitchen staff to see total meal counts required for the day.

### 🧮 Inventory Management
* **Inventory Dashboard (`InventoryDashboard.jsx`):** Tracking raw ingredients, packaging materials, and stock levels to prevent shortages.

---

## 🔒 Security & Administration

- **Role-Based Access Control (RBAC):** Strict isolation between `Boss`, `HR`, `Finance`, `Admin`, and `Employee` roles. Employees can only access the `Portal`, while the Boss has access to everything.
- **Audit Logs (`AuditLogs.jsx`):** Immutable tracking of who changed what, ensuring accountability for payroll and CRM updates.
- **Force Password Changes:** Security measure requiring new users to change their password upon first login (`ForceChangePassword.jsx`).

---

## 💻 Getting Started (Developers)

1. **Clone & Install**
   ```bash
   git clone https://github.com/PhyoeThuta/HRM_V1.1.git
   cd HRM_V1.1
   
   # Install Client Dependencies
   cd hrm-client && npm install
   
   # Install Server Dependencies
   cd ../server && npm install
   ```

2. **Environment Configuration (`.env`)**
   Required variables for the backend:
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_service_role_key
   SESSION_SECRET_KEY=your_secret
   GEMINI_API_KEY=your_gemini_api_key
   ZERNIO_API_KEY=your_zernio_api_key
   PAYMENT_INFO_TEXT="KBZ Pay: 09XXXXX (Phyoe Thuta)"
   ```

3. **Run the Project**
   ```bash
   # Terminal 1 (Backend)
   cd server && npm run dev
   
   # Terminal 2 (Frontend)
   cd hrm-client && npm run dev
   ```

*Built to scale. Powered by AI.*
