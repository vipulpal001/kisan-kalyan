<div align="center">

# 🌾 Kisan Kalyan

### National Smart Agriculture Procurement & Storage Management Portal

**A transparent digital workflow for agricultural procurement, slot booking, weighing, quality inspection, and payment tracking.**

<p>
  <img src="https://img.shields.io/badge/Spring%20Boot-3.4.3-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot 3.4.3" />
  <img src="https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java 21" />
  <img src="https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-6.2.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 6.2.0" />
  <img src="https://img.shields.io/badge/PostgreSQL-18.x-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL 18" />
</p>

[Overview](#-overview) · [Features](#-key-features) · [Architecture](#-architecture) · [Getting Started](#-getting-started) · [API Reference](#-api-reference)

</div>

---

## 📌 Overview

**Kisan Kalyan** is a digital procurement and storage management portal designed for agricultural procurement centres and mandi workflows. It brings key steps into one place—from crop selection and slot booking to arrival verification, weighing, quality inspection, J-Form generation, and payment-status tracking.

The project is designed around three main user roles:

| Role | Primary purpose |
|---|---|
| **Farmer** | Book procurement slots and view booking information |
| **Mandi Operator** | Verify QR passes and record weighbridge readings |
| **Administrator** | Access the administration dashboard |

> **Project note:** Government integrations, electronic signatures, DBT status, and physical weighbridge connectivity depend on the configured implementation and external systems. Do not treat this README as proof of a live government integration.

## ✨ Key Features

<table>
<tr>
<td width="50%" valign="top">

### 🌾 Slot Booking & Queue Management
- Crop selection for wheat, paddy, maize, mustard, and gram
- MSP calculation based on configured crop rates
- Procurement-centre and slot selection
- Dynamic multi-counter allocation
- Queue and token management
- Digital QR pass with token ID and verification deadline

</td>
<td width="50%" valign="top">

### ⚖️ Weighbridge Operator Console
- QR pass scanning and arrival verification
- Gross-weight and tare-weight entry
- Net-weight calculation
- Operator workflow for recording weighment details

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 🔬 Quality Inspection
- Moisture percentage recording
- Foreign-matter / dust inspection
- Configurable deduction calculations based on applicable rules

</td>
<td width="50%" valign="top">

### 📄 J-Form & Payment Tracking
- J-Form / procurement receipt generation
- Payment-status tracking workflow
- DBT status visibility where the relevant data or integration is configured

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 🔔 Real-Time Updates
- WebSocket messaging with STOMP and SockJS
- Live queue updates
- Token-call notifications

</td>
<td width="50%" valign="top">

### 🌐 Accessibility & Language
- Hindi and English interface support
- Text-size controls: A−, A, A+
- High-contrast mode
- Responsive portal styling

</td>
</tr>
</table>

## 🧰 Technology Stack

<table>
<thead>
<tr><th>Layer</th><th>Technology</th><th>Purpose</th></tr>
</thead>
<tbody>
<tr><td><strong>Frontend</strong></td><td>React 19, Vite 6</td><td>Web interface and development server</td></tr>
<tr><td><strong>Routing</strong></td><td>React Router DOM 7</td><td>Client-side navigation</td></tr>
<tr><td><strong>Styling</strong></td><td>Vanilla CSS</td><td>Responsive government-portal-inspired design</td></tr>
<tr><td><strong>Icons</strong></td><td>Lucide React</td><td>Interface icons</td></tr>
<tr><td><strong>HTTP client</strong></td><td>Axios</td><td>Frontend API requests</td></tr>
<tr><td><strong>Real-time client</strong></td><td>SockJS, STOMP client</td><td>WebSocket messaging</td></tr>
<tr><td><strong>Backend</strong></td><td>Java 21, Spring Boot 3.4.3</td><td>REST APIs and business logic</td></tr>
<tr><td><strong>Security</strong></td><td>Spring Security, JWT</td><td>Authentication and API access control</td></tr>
<tr><td><strong>Persistence</strong></td><td>Spring Data JPA, Hibernate</td><td>Object-relational persistence</td></tr>
<tr><td><strong>Database</strong></td><td>PostgreSQL</td><td>Application data storage</td></tr>
<tr><td><strong>Messaging</strong></td><td>Spring WebSocket, STOMP</td><td>Real-time server messaging</td></tr>
</tbody>
</table>

## 🏗️ Architecture

```text
┌─────────────────────────────────────┐
│          React + Vite UI            │
│  Pages · Components · Context       │
└──────────────────┬──────────────────┘
                   │ HTTP / REST
                   │ WebSocket (STOMP)
┌──────────────────▼──────────────────┐
│       Spring Boot Application       │
│ Controllers · DTOs · Services       │
│ Spring Security · JWT · WebSocket   │
└──────────────────┬──────────────────┘
                   │ Spring Data JPA
┌──────────────────▼──────────────────┐
│             PostgreSQL              │
│ Users · Farmers · Bookings · Queue  │
│ Procurement · Weighment · Payments  │
└─────────────────────────────────────┘
```

### Main application areas

- **Authentication:** login and JWT-based authentication flow
- **Farmer:** slot booking and booking history
- **Operator:** QR verification and weight recording
- **Admin:** administration dashboard
- **Shared services:** crop data, procurement centres, queue allocation, and real-time messaging

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
│   ├── src/
│   │   ├── assets/          # Logos and visual assets
│   │   ├── components/      # Shared UI components
│   │   ├── context/         # Authentication and language contexts
│   │   ├── pages/           # Landing, booking, and dashboard pages
│   │   ├── services/        # API, WebSocket, translation services
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
└── stop.bat
```

## 🚀 Getting Started

### 1. Prerequisites

Install and configure the following:

- **Java:** JDK 21 or newer
- **Maven:** 3.9+
- **Node.js:** 18+ (or a compatible version supported by the frontend dependencies)
- **PostgreSQL:** a running local instance, version 15+ recommended

Check your installations:

```powershell
java -version
mvn -v
node -v
npm -v
```

### 2. Create the database

Connect to PostgreSQL and create the project database:

```sql
CREATE DATABASE kisan_kalyan_db;
```

### 3. Configure environment variables

**Do not commit database passwords, JWT secrets, or other credentials to Git.** Configure the backend using environment variables. For example, in PowerShell for the current terminal session:

```powershell
$env:DB_URL = "jdbc:postgresql://localhost:5432/kisan_kalyan_db"
$env:DB_USERNAME = "postgres"
$env:DB_PASSWORD = "replace-with-your-local-password"
```

In `backend/src/main/resources/application.properties`, use environment-variable placeholders:

```properties
spring.datasource.url=${DB_URL:jdbc:postgresql://localhost:5432/kisan_kalyan_db}
spring.datasource.username=${DB_USERNAME:postgres}
spring.datasource.password=${DB_PASSWORD}

# Configure a strong secret through an environment variable.
# Keep the property name aligned with the application's JWT configuration.
app.jwt.secret=${JWT_SECRET}
```

**Important:** `app.jwt.secret` is an example placeholder. If the application uses a different JWT property name, retain that existing name and set the corresponding environment variable. Ensure every required property matches the actual backend configuration.

For local development, set the JWT secret in your terminal before starting the backend:

```powershell
$env:JWT_SECRET = "replace-with-a-long-random-secret"
```

Use a secret manager or your hosting provider's environment-variable settings in production. Never commit `.env` files containing real credentials.

### 4. Build and start the backend

From the project root:

```powershell
cd backend
mvn clean package -DskipTests
```

Then run the generated JAR. Confirm its exact filename in `backend/target/` if it differs:

```powershell
java -jar target/kisan-kalyan-backend-0.0.1-SNAPSHOT.jar
```

The backend is expected to listen at:

```text
http://localhost:8080
```

### 5. Start the frontend

Open a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

The Vite development server is expected at:

```text
http://localhost:5173
```

Make sure the frontend API base URL and backend CORS configuration match your local setup.

### 6. Convenience scripts

From the project root on Windows, the repository includes these scripts:

| Script | Purpose |
|---|---|
| `run.bat` | Start frontend and backend together |
| `stop.bat` | Stop project processes started by the script |
| `host-live.bat` | Launch the configured public HTTPS tunnel |
| `deploy-cli.bat` | Launch the configured cloud deployment workflow |

Review each script before running it. Public tunnels may expose your local application to the internet; use them only with appropriate security controls and non-sensitive test data.

## 🔑 Demo Login Credentials

The following credentials were listed for local demonstration. They must be verified against the current database or seed data.

| Role | Username | Password | Dashboard |
|---|---|---|---|
| Farmer | `ramesh.singh` | `farmer123` | `/farmer/dashboard` |
| Mandi Operator | `operator1` | `operator123` | `/operator/dashboard` |
| Administrator | `admin` | `admin123` | `/admin/dashboard` |

> **Security:** Demo credentials are for local testing only. Do not use them in production. Change or remove default accounts before deployment.

## 📡 API Reference

Base URL for local development: `http://localhost:8080`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | System health and database connectivity status |
| `POST` | `/api/auth/login` | Authenticate a user and obtain a JWT |
| `GET` | `/api/produce` | Retrieve registered crops and configured MSP rates |
| `GET` | `/api/centers` | Retrieve active procurement centres |
| `POST` | `/api/farmer/book-slot` | Create a slot booking and generate a token |
| `GET` | `/api/farmer/bookings` | Retrieve a farmer's active and previous bookings |
| `POST` | `/api/operator/verify-qr` | Verify a QR pass at the weighbridge |
| `POST` | `/api/operator/record-weight` | Record gross and tare weight readings |

> Request bodies, response schemas, and authorization requirements should be confirmed from the current controller and DTO implementations. This table preserves the endpoint list supplied with the project overview.

## ☁️ Deployment

See [`DEPLOYMENT.md`](DEPLOYMENT.md) for the project's deployment guidance covering Vercel, Railway, Render, Docker, and AWS VPS options.

Before deploying:

- Set database connection details and secrets as environment variables.
- Use a managed or securely configured PostgreSQL instance.
- Configure CORS and frontend API URLs for the deployed domains.
- Use HTTPS and review authentication, authorization, and logging settings.
- Do not expose real farmer, bank, identity, or procurement data in a demo environment.
- Verify all external integrations and deployment scripts in the target environment.

## 🛡️ Security Notes

- Keep credentials and signing secrets out of source control.
- Rotate any database password that has previously been committed or shared publicly.
- Store password hashes using the application's configured secure password encoder.
- Use least-privilege database credentials in deployed environments.
- Verify role-based authorization on backend endpoints; hiding a frontend route is not sufficient.
- Use synthetic data for public demos and test environments.

## 📄 Project Information

**Project:** Kisan Kalyan — National Smart Agriculture Procurement & Storage Management Portal  
**Context:** Smart India Hackathon (SIH) / agricultural procurement management project  
**Copyright:** © 2026 Kisan Kalyan project contributors. All rights reserved, unless the repository's license states otherwise.

---

<div align="center">

**Built to make procurement workflows clearer, more organized, and easier to track.**

</div>
