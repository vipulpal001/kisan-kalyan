<div align="center">

# 🌾 Kisan Kalyan

### National Smart Agriculture Procurement & Storage Management Portal

**A transparent digital workflow for agricultural procurement, slot booking, weighing, quality inspection, and payment tracking.**

<p>
  <img src="https://img.shields.io/badge/Spring%20Boot-3.4.3-6DB33F?style=for-the-badge&logo=spring&logoColor=white" alt="Spring Boot 3.4.3" />
  <img src="https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java 21" />
  <img src="https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-8.2.2-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 8.2.2" />
  <img src="https://img.shields.io/badge/PostgreSQL-16%2B-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
</p>

[Overview](#overview) · [Features](#key-features) · [Technology Stack](#technology-stack) · [Architecture](#architecture) · [Getting Started](#getting-started) · [API Reference](#api-reference) · [Deployment](#deployment)

</div>

---

## 📌 Overview

**Kisan Kalyan** is a digital procurement and storage management portal designed for agricultural procurement centres and mandi workflows. It brings key steps into one place—from crop selection and slot booking to arrival verification, weighing, quality inspection, J-Form generation, and payment-status tracking.

The project is designed around three main user roles:

| Role | Primary purpose |
|---|---|
| **Farmer** | Book procurement slots, track live mandi queues, and view digital J-Forms |
| **Mandi Operator** | Verify QR passes, record weighbridge readings, and manage queue counters |
| **Administrator** | Access the administration dashboard, monitor center analytics, and audit records |

> **Project note:** Government integrations, electronic signatures, DBT status, and physical weighbridge connectivity depend on the configured implementation and external systems. Do not treat this README as proof of a live government integration.

## ✨ Key Features

<table>
<tr>
<td width="50%" valign="top">

### 🌾 Slot Booking & Queue Management
- Crop selection for wheat, paddy, maize, mustard, and gram
- Real-time MSP calculation based on configured crop rates
- Procurement-centre and dynamic rolling calendar selection
- Capacity-aware multi-counter allocation
- Real-time queue and token lifecycle management
- Digital QR pass with token ID and verification deadline

</td>
<td width="50%" valign="top">

### ⚖️ Weighbridge Operator Console
- QR pass scanning and gate arrival verification
- Gross-weight and tare-weight entry
- Automatic net-weight calculation
- Direct workflow for recording Legal Metrology weighment details
- Capacity monitoring for active procurement counters

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 🔬 Quality Inspection
- Electronic moisture percentage recording (FAQ guidelines)
- Foreign-matter and dust inspection recording
- Configurable deduction calculations based on applicable standards
- Quality inspection certification workflow

</td>
<td width="50%" valign="top">

### 📄 J-Form & Payment Tracking
- Digital J-Form / official procurement receipt generation
- Direct Benefit Transfer (DBT) payment-status tracking
- Downloadable J-Form receipts with authorized signature data
- PFMS / Treasury integration status visibility

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 🔔 Real-Time Updates & PWA
- WebSocket messaging with STOMP and SockJS
- Real-time live queue counter updates
- Token-call notifications and announcements
- Progressive Web App (PWA) with offline fallback support

</td>
<td width="50%" valign="top">

### 🌐 Accessibility & 13 Indian Languages
- Full 13-language i18n support (Hindi, English, Bengali, Telugu, Marathi, Tamil, Gujarati, Kannada, Malayalam, Punjabi, Odia, Assamese, Urdu)
- Web Speech API audio voice assistance
- Accessibility controls: text scaling (A−, A, A+) and high-contrast dark mode
- Mobile-responsive navigation drawer and bottom navigation bar

</td>
</tr>
</table>

## 🧰 Technology Stack

<table>
<thead>
<tr><th>Layer</th><th>Technology</th><th>Purpose</th></tr>
</thead>
<tbody>
<tr><td><strong>Frontend</strong></td><td>React 19, Vite</td><td>Web interface, component lifecycle, and development server</td></tr>
<tr><td><strong>Routing</strong></td><td>React Router DOM 7</td><td>Client-side single-page navigation</td></tr>
<tr><td><strong>Styling</strong></td><td>Vanilla CSS</td><td>Government-portal-grade responsive design system</td></tr>
<tr><td><strong>Icons</strong></td><td>Lucide React</td><td>Interface iconography</td></tr>
<tr><td><strong>HTTP Client</strong></td><td>Axios</td><td>Frontend API requests and interceptors</td></tr>
<tr><td><strong>Real-Time Client</strong></td><td>SockJS, STOMP Client</td><td>WebSocket messaging for live queues</td></tr>
<tr><td><strong>PWA</strong></td><td>Service Worker, Web Manifest</td><td>Offline resilience and installable application experience</td></tr>
<tr><td><strong>Backend</strong></td><td>Java 21, Spring Boot 3.4.3</td><td>Enterprise REST APIs and business logic</td></tr>
<tr><td><strong>Security</strong></td><td>Spring Security, JJWT</td><td>Stateless JWT authentication and role-based access control</td></tr>
<tr><td><strong>Persistence</strong></td><td>Spring Data JPA, Hibernate</td><td>Object-relational mapping and entity persistence</td></tr>
<tr><td><strong>Database</strong></td><td>PostgreSQL</td><td>Relational application data storage</td></tr>
<tr><td><strong>Messaging</strong></td><td>Spring WebSocket, STOMP Broker</td><td>Real-time queue and notification broadcasting</td></tr>
</tbody>
</table>

## 🏗️ Architecture

```text
┌───────────────────────────────────────────────┐
│              React 19 + Vite UI               │
│  Pages · Components · Contexts · PWA Worker   │
└───────────────────────┬───────────────────────┘
                        │ HTTP / REST
                        │ WebSocket (STOMP via SockJS)
┌───────────────────────▼───────────────────────┐
│            Spring Boot Application            │
│ Controllers · DTOs · Services · Repositories  │
│ Spring Security · JWT Provider · STOMP Broker │
└───────────────────────┬───────────────────────┘
                        │ Spring Data JPA / Hibernate
┌───────────────────────▼───────────────────────┐
│                  PostgreSQL                   │
│ Users · Farmers · Bookings · Queue Status     │
│ Procurement Entries · J-Forms · Payments      │
└───────────────────────────────────────────────┘
```

### Main application modules

- **Authentication:** Login and JWT-based authentication flow with user roles (`FARMER`, `OPERATOR`, `ADMIN`).
- **Farmer Module:** Multi-step slot booking, booking history, live queue tracker, and DBT payment ledger.
- **Operator Console:** QR verification, electronic weighbridge readings, quality control inspection, and J-Form issuance.
- **Admin Dashboard:** Procurement analytics, mandi arrival summaries, and storage warehouse capacity tracking.
- **Shared Services:** Produce master rates, procurement centres, dynamic queue allocation, and WebSocket broadcasting.

## 📂 Project Structure

```text
Kisan-Kalyan/
├── backend/
│   ├── src/main/java/com/kisankalyan/
│   │   ├── config/          # Security, CORS, WebSocket configuration
│   │   ├── controller/      # Auth, farmer, operator, admin controllers
│   │   ├── dto/             # Request and response DTOs
│   │   ├── entity/          # JPA entities
│   │   ├── repository/      # Spring Data repositories
│   │   ├── security/        # JWT provider and authentication filters
│   │   └── service/         # Booking, allocation, mandi process logic
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
├── frontend/
│   ├── public/              # PWA manifest, service worker, icons
│   ├── src/
│   │   ├── assets/          # Logos and visual assets
│   │   ├── components/      # Shared UI components & navigation
│   │   ├── context/         # Auth, language, and booking contexts
│   │   ├── pages/           # Landing, booking, and dashboard pages
│   │   ├── services/        # API, WebSocket, translation dictionaries
│   │   ├── styles/          # Modular CSS stylesheets
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── docker-compose.yml
├── DEPLOYMENT.md
├── deploy-cli.bat
├── host-live.bat
├── run.bat
├── stop.bat
└── vercel.json
```

## 🚀 Getting Started

### 1. Prerequisites

Install and configure the following:

- **Java:** JDK 21 or newer (`java -version`)
- **Maven:** 3.9+ (`mvn -v`)
- **Node.js:** 18+ or 20+ (`node -v`, `npm -v`)
- **PostgreSQL:** Version 15+ or 16+ running locally

### 2. Create the database

Connect to PostgreSQL and create the project database:

```sql
CREATE DATABASE kisan_kalyan_db;
```

### 3. Configure environment variables

**Do not commit database passwords or JWT secrets to Git.** Configure the backend using environment variables. For example, in PowerShell for your local session:

```powershell
$env:DB_HOST = "localhost"
$env:DB_PORT = "5432"
$env:DB_NAME = "kisan_kalyan_db"
$env:DB_USERNAME = "postgres"
$env:DB_PASSWORD = "replace-with-your-local-password"
$env:JWT_SECRET = "replace-with-a-long-random-secret-key-minimum-256-bits"
```

The application's `backend/src/main/resources/application.properties` reads these environment variables:

```properties
# Server Port
server.port=${SERVER_PORT:8080}

# PostgreSQL Database Connection
spring.datasource.url=${SPRING_DATASOURCE_URL:jdbc:postgresql://${DB_HOST:localhost}:${DB_PORT:5432}/${DB_NAME:kisan_kalyan_db}}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME:${DB_USERNAME:postgres}}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD:${DB_PASSWORD}}
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA / Hibernate
spring.jpa.hibernate.ddl-auto=${SPRING_JPA_HIBERNATE_DDL_AUTO:update}

# JWT Security
app.jwt.secret=${JWT_SECRET}
app.jwt.expiration-ms=${JWT_EXPIRATION_MS:86400000}
```

### 4. Build and start the backend

From the project root:

```powershell
cd backend
mvn clean package -DskipTests
java -jar target/kisan-kalyan-backend-0.0.1-SNAPSHOT.jar
```

The backend starts at:

```text
http://localhost:8080
```

### 5. Start the frontend

Open a second terminal window:

```powershell
cd frontend
npm install
npm run dev
```

The Vite development server is available at:

```text
http://localhost:5173
```

### 6. Windows convenience scripts

From the project root on Windows, the repository includes ready-to-run automation scripts:

| Script | Purpose |
|---|---|
| `run.bat` | Starts Spring Boot backend and React frontend together with one double-click |
| `stop.bat` | Terminates all running project processes cleanly |
| `host-live.bat` | Launches a local HTTPS tunnel for instant public mobile/remote testing |
| `deploy-cli.bat` | Automated CLI deployment helper for cloud environments |

## 🔑 Demo Login Credentials

The following credentials are provided for local testing and evaluation:

| Role | Username | Password | Dashboard URL |
|---|---|---|---|
| **Farmer** | `ramesh.singh` | `farmer123` | `/farmer/dashboard` |
| **Mandi Operator** | `operator1` | `operator123` | `/operator/dashboard` |
| **Administrator** | `admin` | `admin123` | `/admin/dashboard` |

> **Security Note:** Demo credentials are for local testing only. Always change or disable default accounts before deploying to production.

## 📡 API Reference

Base URL for local development: `http://localhost:8080`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | System health check and database connectivity status |
| `POST` | `/api/auth/login` | Authenticate user credentials and return a signed JWT |
| `GET` | `/api/produce` | Retrieve registered crops and official MSP rates |
| `GET` | `/api/centers` | Retrieve list of active APMC procurement centres |
| `POST` | `/api/farmer/book-slot` | Book an appointment slot and generate a digital QR token |
| `GET` | `/api/farmer/bookings` | Retrieve a farmer's active, scheduled, and past bookings |
| `POST` | `/api/operator/verify-qr` | Verify farmer QR pass at the procurement centre gate |
| `POST` | `/api/operator/record-weight` | Record electronic gross and tare weighbridge readings |

## ☁️ Deployment

See [`DEPLOYMENT.md`](DEPLOYMENT.md) for production hosting guidelines covering:
- **Vercel** (Frontend single-page application hosting with root `vercel.json`)
- **Render / Railway** (Spring Boot Docker container hosting with managed PostgreSQL)
- **Docker Compose** (`docker-compose up` for local full-stack containerization)
- **AWS / VPS** (Linux deployment with Nginx reverse proxy and Systemd services)

## 🛡️ Security Notes

- **Secrets Management:** Keep passwords, database URIs, and JWT signing keys out of source control. Use environment variables.
- **Authentication:** Stateless authentication using cryptographically signed JSON Web Tokens (JJWT) with configurable expiration.
- **Authorization:** Spring Security enforces role-based authorization on all backend `/api/**` endpoints.
- **CORS:** Controlled cross-origin access configuration to prevent unauthorized browser-based requests.

## 📄 Project Information

**Project:** Kisan Kalyan — National Smart Agriculture Procurement & Storage Management Portal  
**Context:** Smart India Hackathon (SIH) / Agricultural Procurement & Supply Chain Innovation  
**Copyright:** © 2026 Kisan Kalyan contributors. All rights reserved.

---

<div align="center">

**Built to make procurement workflows transparent, efficient, and farmer-friendly.**

</div>
