# Production Deployment Guide
## BBD HRM — GCP VM + Docker + Nginx + Certbot

---

## Architecture Overview

```
Internet (HTTPS :443)
         │
      Nginx  ←── Certbot manages TLS cert auto-renewal
         │
  127.0.0.1:8080
         │
   Docker Container  ← GitHub Actions deploys here
     (Express + React dist)
         │
    Supabase (cloud DB)
```

---

## Required GitHub Secrets

Set these in `GitHub → Settings → Secrets → Actions`:

| Secret | Description |
|--------|-------------|
| `GCP_VM_IP` | Public IP of the GCP VM |
| `GCP_USERNAME` | SSH user on the VM (e.g. `ubuntu`) |
| `GCP_SSH_KEY` | Private SSH key for the VM (PEM format) |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps key — injected at Docker build time |

> All other secrets (JWT_SECRET, Supabase keys, email, etc.) live in `/opt/bbd/.env.production` on the VM and are **never** passed through GitHub Actions.

---

## One-Time VM Setup

### 1. Install Docker and Docker Compose

```bash
# Install Docker
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
newgrp docker

# Verify
docker --version
docker compose version
```

### 2. Install Nginx and Certbot

```bash
sudo apt-get update
sudo apt-get install -y nginx certbot python3-certbot-nginx
```

### 3. Create the deployment directory and env file

```bash
sudo mkdir -p /opt/bbd
sudo chown $USER:$USER /opt/bbd

# Copy docker-compose.yml from the repo to the VM
scp docker-compose.yml user@YOUR_VM_IP:/opt/bbd/

# Create the production secrets file (fill in all values)
nano /opt/bbd/.env.production
```

#### `/opt/bbd/.env.production` template:

```env
NODE_ENV=production
PORT=8080

# CORS — must match your actual domain
ALLOWED_ORIGINS=https://hrm.duolinkmm.com

# Auth
JWT_SECRET=your_very_long_random_secret_here

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Email
EMAIL_USER=your@email.com
EMAIL_PASS=your_email_password

# Payments / Info
PAYMENT_INFO_TEXT=your_payment_info_here

# Telegram (optional)
TELEGRAM_BOT_TOKEN=your_token
TELEGRAM_CHAT_ID=your_chat_id

# Google AI
GOOGLE_AI_API_KEY=your_gemini_key

# Frontend onboarding
FRONTEND_ONBOARDING_URL=https://hrm.duolinkmm.com
```

```bash
# Secure the secrets file — only owner can read it
chmod 600 /opt/bbd/.env.production
```

### 4. Set up Nginx

```bash
# Copy the Nginx config from the repo
sudo cp nginx/hrm.conf /etc/nginx/sites-available/hrm.duolinkmm.com
sudo ln -s /etc/nginx/sites-available/hrm.duolinkmm.com /etc/nginx/sites-enabled/

# Get TLS certificate (first time)
# This temporarily configures Nginx for HTTP-only for the ACME challenge
sudo certbot --nginx -d hrm.duolinkmm.com

# Verify auto-renewal is configured
sudo certbot renew --dry-run

# Reload Nginx
sudo nginx -t && sudo systemctl reload nginx
```

### 5. Allow GitHub Actions to pull from GHCR on the VM

When GitHub Actions SSH into the VM, it authenticates Docker via the workflow.
No manual step needed — the workflow handles `docker login` on every deploy.

---

## Cutover Procedure (PM2 → Docker)

> ⚠️ This involves ~60 seconds of downtime. Plan during off-hours.

```bash
# 1. Pre-pull the image on the VM (do this before cutover to minimize downtime)
docker pull ghcr.io/phyoethuta/hrm_v1.1:latest

# 2. Start the Docker container
cd /opt/bbd
IMAGE_TAG=latest docker compose up -d

# 3. Verify container is healthy
docker ps
curl http://localhost:8080/api/health

# 4. Stop PM2 processes
pm2 delete hrm_react_api || true
pm2 delete hrm_react_client || true
pm2 save

# 5. Reload Nginx (now points to Docker container)
sudo nginx -t && sudo systemctl reload nginx

# 6. Verify production endpoint
curl https://hrm.duolinkmm.com/api/health
```

---

## Rollback Procedure

```bash
# Option 1: Roll back to a specific image tag
cd /opt/bbd
IMAGE_TAG=sha-abc1234 docker compose up -d --pull never

# Option 2: GitHub Actions manual deploy with a specific tag
# Go to Actions → "Build & Deploy" → "Run workflow" → enter previous tag
```

---

## Day-to-Day Operations

```bash
# View logs (last 100 lines, follow)
docker logs bbd_hrm_app -n 100 -f

# Check container status and health
docker ps
docker inspect --format='{{.State.Health.Status}}' bbd_hrm_app

# Restart the container (e.g. after config change)
cd /opt/bbd && docker compose restart app

# Pull uploads volume files (for backup)
docker cp bbd_hrm_app:/app/server/uploads ./uploads-backup
```

---

## Troubleshooting

| Problem | Check |
|---------|-------|
| Container won't start | `docker logs bbd_hrm_app` — look for missing env vars |
| Health check failing | `curl http://localhost:8080/api/health` from the VM |
| Nginx 502 Bad Gateway | Is Docker container running? `docker ps` |
| Cookie not set (login broken) | Is Nginx terminating TLS? `Secure` flag requires HTTPS |
| WebSocket disconnects | Check `/socket.io/` location block in Nginx config |
| PDF not served | Check uploads volume is mounted: `docker inspect bbd_hrm_app` |
| Puppeteer crashes | Check Chromium is installed: `docker exec bbd_hrm_app chromium --version` |
