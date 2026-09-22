# Kisan Kalyan - Production Hosting & Deployment Guide

This guide covers all options for hosting and deploying the **Kisan Kalyan** full-stack platform (React 19, Spring Boot 3 + Java 21, PostgreSQL).

---

## Table of Contents
1. [Option 1: Instant Live Public URL via HTTPS Tunnel (No GitHub / Zero Setup)](#option-1-instant-live-public-url-via-https-tunnel)
2. [Option 2: Direct Local-to-Cloud CLI Deployment (Vercel + Railway + Neon, No GitHub)](#option-2-direct-local-to-cloud-cli-deployment)
3. [Option 3: Traditional Cloud Git Deployment (Vercel + Render + Neon/Supabase)](#option-3-traditional-cloud-git-deployment)
4. [Option 4: Docker Compose Deployment](#option-4-docker-compose-deployment)
5. [Option 5: Self-Hosted Cloud VPS (Ubuntu / Debian + Nginx + SSL)](#option-5-self-hosted-cloud-vps)
6. [Option 6: Local Network / LAN Mobile Access](#option-6-local-network--lan-mobile-access)
7. [Environment Variables Reference](#environment-variables-reference)

---

## Option 1: Instant Live Public URL via HTTPS Tunnel

Ideal if you want to share a live, working HTTPS link right now with reviewers, stakeholders, or farmers without setting up any cloud accounts or pushing code to GitHub.

### Quick Start (Windows)
Double-click:
```bash
host-live.bat
```
Or run in PowerShell / Command Prompt:
```powershell
.\host-live.bat
```

### What this does:
1. Automatically detects your **Local Wi-Fi IP** and **Public IP**.
2. Launches the pre-packaged Spring Boot 3 backend JAR on port `8080`.
3. Launches the React 19 Vite dev server on port `5173` with network proxying.
4. Starts a public HTTPS tunnel via `localtunnel` pointing to port `5173`.
5. Displays:
   - **Local Browser:** `http://localhost:5173`
   - **Wi-Fi Devices (Mobile/Tablet):** `http://<your-lan-ip>:5173`
   - **Worldwide Public HTTPS:** `https://<random-subdomain>.loca.lt` (Bypass password is your Public IP).

---

## Option 2: Direct Local-to-Cloud CLI Deployment

Deploy frontend to **Vercel** and backend to **Railway** directly from your local terminal without creating a GitHub repository.

Run the interactive launcher:
```powershell
.\deploy-cli.bat
```

### Step 1: Free Cloud PostgreSQL Database (1-Minute Setup)
1. Sign up for free at [Neon.tech](https://neon.tech) (Serverless PostgreSQL) or [Supabase.com](https://supabase.com).
2. Create a project named `kisan-kalyan-db`.
3. Copy your connection URI:
   ```text
   postgresql://kisan_user:password@ep-xyz.us-east-2.aws.neon.tech/kisan_kalyan_db?sslmode=require
   ```

### Step 2: Deploy Backend to Railway directly from CLI
1. Open a terminal in `backend/`:
   ```powershell
   cd backend
   npx -y @railway/cli login
   npx -y @railway/cli init
   ```
2. In the Railway dashboard for this project, set the following environment variables:
   - `SPRING_DATASOURCE_URL`: `jdbc:postgresql://<host>:5432/<dbname>?sslmode=require`
   - `SPRING_DATASOURCE_USERNAME`: `<db-username>`
   - `SPRING_DATASOURCE_PASSWORD`: `<db-password>`
   - `SPRING_JPA_HIBERNATE_DDL_AUTO`: `update`
   - `JWT_SECRET`: `<any-strong-256bit-string>`
   - `JWT_EXPIRATION_MS`: `86400000`
3. Deploy the backend code:
   ```powershell
   npx -y @railway/cli up
   ```
4. Generate a public domain under Railway Settings -> Networking (e.g. `https://kisan-backend.up.railway.app`).

### Step 3: Deploy Frontend to Vercel directly from CLI
1. Open a terminal in `frontend/`:
   ```powershell
   cd frontend
   ```
2. Build with your Railway backend API endpoint:
   ```powershell
   $env:VITE_API_BASE_URL="https://kisan-backend.up.railway.app/api"
   npm run build
   ```
3. Deploy directly with Vercel CLI:
   ```powershell
   npx -y vercel --prod
   ```
   Follow the prompts to log in; Vercel will upload and deploy the application to a free `*.vercel.app` URL immediately.

---

## Option 3: Traditional Cloud Git Deployment

If you decide to push your repository to GitHub / GitLab:

### Part A: Database (Neon or Supabase)
Follow Step 1 of Option 2 above.

### Part B: Backend Deployment on Render
1. Push your project to GitHub.
2. Log in to [Render](https://render.com).
3. Click **Blueprints** -> Connect repo -> Select `render.yaml`.
   - Or click **New Web Service** -> Docker runtime:
     - Docker Context Directory: `./backend`
     - Dockerfile Path: `./backend/Dockerfile`
     - Env variables: `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`, `JWT_SECRET`.
4. Copy your backend URL (e.g. `https://kisan-backend.onrender.com`).

### Part C: Frontend Deployment on Vercel
1. Import your GitHub repo on [Vercel](https://vercel.com).
2. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Environment Variable:
   - `VITE_API_BASE_URL`: `https://kisan-backend.onrender.com/api`
4. Deploy! `frontend/vercel.json` automatically handles SPA routing rewrites.

---

## Option 4: Docker Compose Deployment

If you have Docker Desktop installed locally or on any server:

```powershell
# Copy environment file
copy .env.example .env

# Build and start services (PostgreSQL, Spring Boot Backend, Nginx Frontend)
docker compose up -d --build

# Check status
docker compose ps

# Access:
# Frontend: http://localhost:3000
# Backend:  http://localhost:8080/api
```

---

## Option 5: Self-Hosted Cloud VPS

Host on an Ubuntu 22.04 / 24.04 LTS instance (AWS EC2, DigitalOcean, Hetzner, Linode).

### Step 1: Install Docker & Compose
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git ufw
curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

### Step 2: Run with Docker Compose
```bash
git clone <repo-url> /var/www/kisan-kalyan
cd /var/www/kisan-kalyan
cp .env.example .env
docker compose up -d --build
```

### Step 3: Domain & Free SSL (Nginx + Certbot)
```nginx
server {
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api/ {
        proxy_pass http://localhost:8080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /ws {
        proxy_pass http://localhost:8080/ws;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

Enable SSL:
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## Option 6: Local Network / LAN Mobile Access

To test on physical devices (such as Android/iOS phones, tablets) connected to the same Wi-Fi network:

1. Run `host-live.bat` or run Vite directly:
   ```bash
   cd frontend
   npm run dev -- --host 0.0.0.0 --port 5173
   ```
2. Vite displays:
   ```text
   ➜  Local:   http://localhost:5173/
   ➜  Network: http://192.168.x.x:5173/
   ```
3. Open `http://<your-lan-ip>:5173` on any mobile phone connected to the same Wi-Fi.

---

## Environment Variables Reference

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `SERVER_PORT` | `8080` | Backend listening port |
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://localhost:5432/kisan_kalyan_db` | Full JDBC database URL |
| `SPRING_DATASOURCE_USERNAME` | `postgres` | Database username |
| `SPRING_DATASOURCE_PASSWORD` | *(set securely)* | Database password |
| `SPRING_JPA_HIBERNATE_DDL_AUTO` | `update` | Hibernate schema strategy |
| `JWT_SECRET` | *(set 256-bit key)* | Signing secret for authentication tokens |
| `JWT_EXPIRATION_MS` | `86400000` | Token expiration (24h) |
| `VITE_API_BASE_URL` | `/api` | Frontend API target (relative or full URL) |
| `VITE_WS_URL` | *(auto-derived from API URL)* | WebSocket endpoint |
