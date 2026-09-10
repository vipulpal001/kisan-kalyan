# Kisan Kalyan - Production Hosting & Deployment Guide

This guide covers all options for hosting and deploying the **Kisan Kalyan** full-stack platform (React 19, Spring Boot 3 + Java 21, PostgreSQL).

---

## Table of Contents
1. [Option 1: Quickstart with Docker Compose (Recommended)](#option-1-quickstart-with-docker-compose-recommended)
2. [Option 2: Cloud Deployment (Vercel + Render + Neon/Supabase)](#option-2-cloud-deployment-vercel--render--neonsupabase)
3. [Option 3: Self-Hosted Cloud VPS (Ubuntu / Debian + Nginx + SSL)](#option-3-self-hosted-cloud-vps)
4. [Option 4: Local Network / LAN Hosting](#option-4-local-network--lan-hosting)
5. [Environment Variables Reference](#environment-variables-reference)
6. [Troubleshooting & FAQs](#troubleshooting--faqs)

---

## Option 1: Quickstart with Docker Compose (Recommended)

Ideal for hosting on any server, VM, or local environment with Docker installed.

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) & [Docker Compose](https://docs.docker.com/compose/) installed.

### Steps to Run

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd Kisan-Kalyan
   ```

2. **Prepare Environment File:**
   ```bash
   cp .env.example .env
   ```
   *(On Windows PowerShell: `copy .env.example .env`)*

3. **Build and start all services:**
   ```bash
   docker compose up -d --build
   ```

4. **Verify running containers:**
   ```bash
   docker compose ps
   ```

5. **Access the Application:**
   - **Web App (Frontend):** [http://localhost:3000](http://localhost:3000)
   - **REST API (Backend):** [http://localhost:8080/api](http://localhost:8080/api)
   - **PostgreSQL Database:** `localhost:5432`

6. **To Stop or Restart:**
   ```bash
   docker compose down          # Stop containers
   docker compose logs -f       # View live logs
   ```

---

## Option 2: Cloud Deployment (Vercel + Render + Neon/Supabase)

This provides zero-maintenance, cloud-hosted architecture.

### Part A: Database (Neon or Supabase)
1. Sign up at [Neon.tech](https://neon.tech) or [Supabase.com](https://supabase.com).
2. Create a new PostgreSQL database project.
3. Note your connection details:
   - Host, Database Name, User, Password, and Port (5432).
   - Or full JDBC URL: `jdbc:postgresql://<host>:5432/<dbname>?sslmode=require`.

### Part B: Backend Deployment on Render
1. Push your project to GitHub / GitLab.
2. Log in to [Render](https://render.com).
3. **Option 1 (Render Blueprint):**
   - Click **Blueprints** -> **New Blueprint Instance**.
   - Connect your repository; Render will detect `render.yaml` and configure the database and web service automatically.
4. **Option 2 (Manual Web Service):**
   - Click **New** -> **Web Service**.
   - Connect your repo, select **Docker** environment.
   - Set **Docker Context Directory**: `./backend`
   - Set **Dockerfile Path**: `./backend/Dockerfile`
   - Under **Environment Variables**, add:
     - `SERVER_PORT`: `8080`
     - `SPRING_DATASOURCE_URL`: `jdbc:postgresql://<db-host>:5432/<dbname>?sslmode=require`
     - `SPRING_DATASOURCE_USERNAME`: `<your-db-username>`
     - `SPRING_DATASOURCE_PASSWORD`: `<your-db-password>`
     - `SPRING_JPA_HIBERNATE_DDL_AUTO`: `update`
     - `JWT_SECRET`: `<your-256bit-secret-key>`
     - `JWT_EXPIRATION_MS`: `86400000`
5. Click **Deploy Web Service** and copy your backend URL (e.g. `https://kisan-backend.onrender.com`).

### Part C: Frontend Deployment on Vercel
1. Log in to [Vercel](https://vercel.com) and click **Add New** -> **Project**.
2. Import your GitHub repository.
3. Configure the project:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add **Environment Variable**:
   - `VITE_API_BASE_URL`: `https://<your-backend-service-url>.onrender.com/api`
5. Click **Deploy**. Vercel will automatically configure SPA rewrites based on `frontend/vercel.json`.

---

## Option 3: Self-Hosted Cloud VPS

Host on a Linux VPS (Ubuntu 22.04 / 24.04 LTS on DigitalOcean, AWS EC2, Linode, Hetzner, etc.).

### Step 1: Install Docker & Compose
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git ufw
curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

### Step 2: Clone and Start
```bash
git clone <repo-url> /var/www/kisan-kalyan
cd /var/www/kisan-kalyan
cp .env.example .env
# Edit .env with your production secrets:
nano .env
docker compose up -d --build
```

### Step 3: Domain & SSL Reverse Proxy (Nginx + Certbot)
Install Nginx on host:
```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```

Configure `/etc/nginx/sites-available/kisan.conf`:
```nginx
server {
    server_name yourdomain.com www.yourdomain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:8080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site and generate Free SSL certificate:
```bash
sudo ln -s /etc/nginx/sites-available/kisan.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## Option 4: Local Network / LAN Hosting

To test on physical devices (such as Android/iOS phones, tablets) connected to the same Wi-Fi network:

1. Find your machine's local IP address:
   - **Windows:** Run `ipconfig` (e.g. `192.168.1.15`)
   - **Linux / Mac:** Run `ip a` or `ifconfig`

2. **Frontend Dev Server:**
   `frontend/vite.config.js` is already configured with `server: { host: true, port: 5173 }`.
   Run:
   ```bash
   cd frontend
   npm run dev
   ```
   Vite will display:
   ```
   ➜  Local:   http://localhost:5173/
   ➜  Network: http://192.168.1.15:5173/
   ```

3. Open `http://<your-lan-ip>:5173` on any phone or device on the same Wi-Fi!

---

## Environment Variables Reference

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `DB_NAME` | `kisan_kalyan_db` | PostgreSQL Database name |
| `DB_USERNAME` | `postgres` | Database username |
| `DB_PASSWORD` | *(set securely)* | Database password |
| `DB_PORT` | `5432` | Exposed PostgreSQL port |
| `BACKEND_PORT` | `8080` | Exposed Spring Boot backend port |
| `SPRING_JPA_HIBERNATE_DDL_AUTO` | `update` | Auto-creates tables on fresh database deployments |
| `JWT_SECRET` | *(256-bit secret string)* | JWT HMAC-SHA key for authentication tokens |
| `JWT_EXPIRATION_MS` | `86400000` | Token expiration in milliseconds (default 24 hours) |
| `FRONTEND_PORT` | `3000` | Exposed Frontend Nginx port |
| `VITE_API_BASE_URL` | `/api` | Base URL used by Axios in the React client |

---

## Troubleshooting & FAQs

### Q1: Database connection failed on startup
- **Cause:** Spring Boot may start before PostgreSQL is ready to accept connections.
- **Fix:** In `docker-compose.yml`, the backend service is configured with `depends_on: db: condition: service_healthy` to guarantee PostgreSQL is accepting sockets before the backend starts.

### Q2: Page refresh gives 404 on Vercel or Nginx
- **Fix:** Single-page React applications require all routes to fallback to `/index.html`. This is already configured in `frontend/vercel.json` and `frontend/nginx.conf`.

### Q3: Seed data not showing up
- The Spring Boot application includes `DataInitializer.java` which automatically populates standard produce (Wheat, Rice, Maize), test centres, counters, and admin accounts if the database tables are empty on startup.
