# 🏢 HRM Pro — AI-Powered Human Resource Management System (V1.1)

A full-featured, production-ready **Human Resource Management System** built with **React, Vite, Node.js (Express), and Supabase**, enhanced with **Google Gemini AI** for an omniscient HR Executive Assistant.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React (Vite), TailwindCSS, JavaScript |
| **Backend** | Node.js, Express.js |
| **Database** | Supabase (PostgreSQL) |
| **AI** | Google Gemini 2.5 Pro |
| **Auth** | JWT Token-based authentication via Supabase/Express |

---

## ✨ Features

- **Omniscient AI Assistant (Boss Chat):** The Boss can chat with an AI that knows every piece of data in the company (Attendance, Payroll, Leaves, SOPs, KPIs).
- **Employee Portal:** Employees can log in, view payslips, execute daily SOPs, scan QR codes for attendance, and request leaves.
- **Biometric Integration:** Syncs with ZKTeco fingerprint devices for accurate attendance tracking.
- **Automated Payroll Engine:** Automatically generates payroll based on base salary, late deductions, and KPI scores.
- **Recruitment & Onboarding:** Manage job postings, applicants, and onboarding checklists.

---

## 🚀 Getting Started

### 1. Backend (Node.js)
```bash
cd server
npm install
node index.js # Runs on port 8080
```
Make sure you have a `.env` file in the `server` directory with `SUPABASE_URL`, `SUPABASE_KEY`, and `GEMINI_API_KEY`.

### 2. Frontend (React)
```bash
cd hrm-client
npm install
npm run dev # Runs on port 5173
```

---

## 📁 Project Structure

```
HRM_V1.1/
├── hrm-client/             # React (Vite) Frontend
├── server/                 # Node.js (Express) Backend
├── zk_agent.py             # ZKTeco Biometric background sync script
├── Legacy_Python_Scripts_Archive/  # Archived legacy Python v1 codebase
└── README.md
```
