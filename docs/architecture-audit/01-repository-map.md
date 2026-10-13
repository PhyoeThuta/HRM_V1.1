# 1. Repository Map

*Status:* VERIFIED FROM CODE

## High-Level Repository Structure

The BBD Enterprise Platform is structured as a standard monolithic repository containing a React frontend and an Express/Node.js backend, wrapped in Docker for deployment.

```text
c:\Users\Phyoe\Desktop\hrm_react
│
├── hrm-client/                 # React Frontend Application (Vite)
│   ├── src/
│   │   ├── api/                # Axios API client wrappers
│   │   ├── components/         # Shared React UI components
│   │   ├── context/            # React Context (AuthContext)
│   │   ├── pages/              # View-level components grouped loosely
│   │   │   ├── crm/            # CRM specific views
│   │   │   ├── operations/     # Operations/Kitchen/Rider views
│   │   │   ├── portal/         # Employee self-service views
│   │   │   ├── inventory/      # Inventory views
│   │   │   └── public/         # Public-facing enrollment/feedback forms
│   │   ├── lib/                # Shared utilities
│   │   └── App.jsx             # Main React Router definitions
│   └── package.json            # Frontend dependencies
│
├── server/                     # Express Backend Application
│   ├── cron/                   # Node-cron background jobs
│   ├── lib/                    # Core integrations (Supabase client, Socket.io Realtime)
│   ├── middleware/             # Express middlewares (Auth, RBAC, Validation)
│   ├── routes/                 # Express controllers & business logic (FAT CONTROLLERS)
│   ├── schemas/                # Zod validation schemas
│   ├── scripts/                # Database setup scripts (create_tables.cjs)
│   ├── services/               # Specific standalone services (vectorSync.js)
│   ├── tests/                  # Extremely limited test suite (176 LOC total)
│   ├── index.js                # Express Server Entry Point
│   └── package.json            # Backend dependencies
│
├── nginx/                      # Reverse Proxy configuration
│   └── hrm.conf                # Nginx proxy pass and Socket.io upgrade configs
│
├── .github/workflows/          # GitHub Actions CI/CD
│   ├── deploy.yml              # Build Docker image & SSH deploy to GCP
│   └── auto-merge.yml          # Dependabot automation
│
├── Dockerfile                  # Multi-stage build (Vite -> Node production)
├── docker-compose.yml          # Deployment orchestration for single GCP VM
└── deploy_setup.sh             # GCP Environment setup script
```

## Architectural Observations

1. **Frontend Structure**: The frontend uses `pages/` grouped somewhat by domain (`crm/`, `operations/`), but heavily intermingles layout and business logic within the components themselves.
2. **Backend Structure**: The `server/routes/` directory acts as both the HTTP routing layer AND the core business logic layer. There is virtually no `server/services/` layer (aside from `vectorSync.js` for AI). 
3. **Missing Layers**: The repository is missing a clear separation between Domain Entities, Business Services, and Data Access Repositories.

*Conclusion:* The repository exhibits classical monolithic traits with business logic heavily concentrated in HTTP route handlers rather than standalone services.
