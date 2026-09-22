# 🌾 किसान कल्याण (Kisan Kalyan)
### राष्ट्रीय कृषि खरीद एवं भंडारण प्रबंधन प्रणाली
#### National Smart Agriculture Procurement & Storage Management Portal

---

[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.4.3-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/)
[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18.x-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

---

## 📌 परिचय (Overview)

**किसान कल्याण** भारत सरकार के उपार्जन केंद्रों (APMC / Mandi Procurement Centers) के लिए विकसित एक अत्याधुनिक, पारदर्शी और स्वचालित डिजिटल प्रबंधन प्रणाली है। यह पोर्टल किसानों को घर बैठे स्लॉट आरक्षण, लाइव डिजिटल टोकन, धर्मकांटा इलेक्ट्रॉनिक तौल सत्यापन, पारदर्शी गुणवत्ता (QCI) जांच, त्वरित J-Form एवं प्रत्यक्ष लाभ हस्तांतरण (DBT) भुगतान की सुविधा प्रदान करता है।

---

## ✨ मुख्य विशेषताएँ (Key Features)

- **🌾 6-चरणीय पारदर्शी स्लॉट बुकिंग (Dynamic Multi-Counter Slot Booking)**:
  - फसल चयन (गेहूं, धान, मक्का, सरसों, चना) एवं न्यूनतम समर्थन मूल्य (MSP) गणना।
  - निकटतम उपार्जन केंद्र एवं वास्तविक समय स्लॉट आरक्षण।
  - मल्टी-काउंटर ऑटो-एलोकेशन एवं कतार प्रबंधन।
  - तुरंत डिजिटल QR पास एवं टोकन जनरेशन (Token ID & Verification Deadline)।

- **⚖️ धर्मकांटा इलेक्ट्रॉनिक तौल एवं ऑपरेटर कंसोल (Weighbridge Integration)**:
  - आगमन पर QR कोड स्कैनिंग एवं त्वरित टोकन सत्यापन।
  - सकल भार (Gross Weight), खाली वाहन भार (Tare Weight) एवं शुद्ध भार (Net Weight) स्वचालित गणना।

- **🔬 गुणवत्ता एवं नमी परीक्षण (Quality Inspection & Deductions)**:
  - QCI मानकों के अनुसार नमी (Moisture %), धूल-कचरा (Foreign Matter) आदि की जांच।
  - नियमों के अनुसार अनुमेय छूट एवं कटौती गणना।

- **📄 जे-फॉर्म एवं डीबीटी भुगतान (J-Form Generation & Direct DBT Payments)**:
  - डिजिटल हस्ताक्षरित सरकारी J-Form क्रय पर्ची जनरेशन।
  - आधार-सीडेड बैंक खाते में प्रत्यक्ष लाभ अंतरण (DBT) स्थिति ट्रैकिंग।

- **🔔 रियल-टाइम वेबसॉकेट सूचनाएं (WebSocket Real-Time Broadcasts)**:
  - STOMP/SockJS आधारित लाइव कतार अपडेट एवं टोकन कॉल सूचना।

- **🌐 सुलभता एवं द्विभाषी समर्थन (Accessibility & Bilingual)**:
  - हिंदी एवं अंग्रेज़ी (English) पूर्ण समर्थन।
  - दृष्टि सुलभता मोड (A- / A / A+) एवं उच्च कंट्रास्ट (High Contrast)।

---

## 🛠️ तकनीकी संरचना (Tech Stack)

### **Frontend**
- **Library**: React 19
- **Build Tool**: Vite 6
- **Routing**: React Router DOM v7
- **Styling**: Vanilla CSS (Government Portal Design System, Responsive)
- **Icons**: Lucide React
- **Real-time Client**: SockJS & STOMP Client
- **API Client**: Axios

### **Backend**
- **Framework**: Spring Boot 3.4.3
- **Language**: Java 21 (LTS)
- **Security**: Spring Security & JWT (JSON Web Token)
- **Data Persistence**: Spring Data JPA / Hibernate ORM
- **Messaging**: Spring WebSocket (STOMP message broker)
- **Database**: PostgreSQL 18

---

## 📂 प्रोजेक्ट डायरेक्टरी संरचना (Project Structure)

```text
c:\Kisan-Kalyan\
├── backend\                     # Spring Boot Java 21 Backend
│   ├── src\main\java\com\kisankalyan\
│   │   ├── config\              # Security, CORS, WebSocket Config
│   │   ├── controller\          # REST Controllers (Auth, Farmer, Operator, Admin)
│   │   ├── dto\                 # Request / Response Data Transfer Objects
│   │   ├── entity\              # JPA Entities (AppUser, Farmer, SlotBooking, etc.)
│   │   ├── repository\          # Spring Data JPA Repositories
│   │   ├── security\            # JWT Provider, Auth Filters
│   │   └── service\             # Core Services (Booking, Allocation, MandiProcess)
│   ├── src\main\resources\
│   │   └── application.properties
│   └── pom.xml
│
├── frontend\                    # React 19 + Vite Frontend
│   ├── src\
│   │   ├── assets\              # Logos, crop imagery, emblems
│   │   ├── components\          # Header, Navigation, Shared UI
│   │   ├── context\             # AuthContext, LanguageContext
│   │   ├── pages\               # Portal Pages (Landing, Booking, Dashboards)
│   │   ├── services\            # Axios API, WebSocket, Translations
│   │   ├── App.jsx              # Main App Router
│   │   ├── index.css            # Official Portal Design Tokens & Styles
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── deploy-cli.bat               # One-click Cloud CLI deployer
├── DEPLOYMENT.md                # Detailed production hosting guide
├── docker-compose.yml           # Docker deployment configuration
├── host-live.bat                # Instant Public HTTPS Tunnel launcher
├── run.bat                      # Start frontend + backend simultaneously
└── stop.bat                     # Terminate running servers
```

---

## 🚀 स्थानीय सेटअप एवं निष्पादन (Local Setup & Run)

### **1. आवश्यकताएं (Prerequisites)**
- **Java**: JDK 21 या उच्चतर (`java -version`)
- **Maven**: 3.9+ (`mvn -v`)
- **Node.js**: v18+ या v20+ (`node -v`)
- **PostgreSQL**: 15+ या 18+ चालू होना चाहिए

---

### **2. डेटाबेस सेटअप (PostgreSQL Database)**
PostgreSQL में डेटाबेस बनाएँ:
```sql
CREATE DATABASE kisan_kalyan_db;
```
`backend/src/main/resources/application.properties` में अपने क्रेडेंशियल्स सुनिश्चित करें:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/kisan_kalyan_db
spring.datasource.username=postgres
spring.datasource.password=Bipul0406@161
```

---

### **3. बैकएंड संकलन एवं निष्पादन (Backend Start)**
```powershell
cd backend
mvn clean package -DskipTests
java -jar target/kisan-kalyan-backend-0.0.1-SNAPSHOT.jar
```
*बैकएंड `http://localhost:8080` पर शुरू होगा।*

---

### **4. फ्रंटएंड निष्पादन (Frontend Start)**
```powershell
cd frontend
npm install
npm run dev
```
*वेबसाइट `http://localhost:5173` पर उपलब्ध होगी।*

---

### **5. एक-क्लिक निष्पादन (One-Click Run Scripts)**
- **दोनों सर्वर एक साथ चालू करने के लिए**:
  ```powershell
  .\run.bat
  ```
- **इंटरनेट पर लाइव शेयर करने के लिए (Instant Public HTTPS Tunnel)**:
  ```powershell
  .\host-live.bat
  ```
- **सभी प्रक्रियाएं रोकने के लिए**:
  ```powershell
  .\stop.bat
  ```

---

## 🔑 टेस्ट क्रेडेंशियल्स (Demo Login Credentials)

| भूमिका (Role) | उपयोगकर्ता नाम (Username) | पासवर्ड (Password) | उपलब्ध डैशबोर्ड |
| :--- | :--- | :--- | :--- |
| **किसान (Farmer)** | `ramesh.singh` | `farmer123` | `/farmer/dashboard` |
| **मंडी ऑपरेटर (Operator)** | `operator1` | `operator123` | `/operator/dashboard` |
| **प्रशासक (Admin)** | `admin` | `admin123` | `/admin/dashboard` |

---

## 📡 मुख्य API एंडपॉइंट्स (Key API Endpoints)

| Method | Endpoint | विवरण (Description) |
| :--- | :--- | :--- |
| `GET` | `/api/health` | सिस्टम स्वास्थ्य एवं डेटाबेस कनेक्टिविटी स्थिति |
| `POST` | `/api/auth/login` | JWT टोकन प्रमाणीकरण (Authentication) |
| `GET` | `/api/produce` | पंजीकृत कृषि उपजों एवं MSP दरों की सूची |
| `GET` | `/api/centers` | सक्रिय उपार्जन केंद्रों की सूची |
| `POST` | `/api/farmer/book-slot` | नया टोकन एवं स्लॉट आरक्षण |
| `GET` | `/api/farmer/bookings` | किसान के पिछले एवं सक्रिय स्लॉट बुकिंग्स |
| `POST` | `/api/operator/verify-qr` | धर्मकांटा पर QR पास आगमन सत्यापन |
| `POST` | `/api/operator/record-weight` | इलेक्ट्रॉनिक वजन (Gross / Tare) प्रविष्टि |

---

## ☁️ क्लाउड होस्टिंग (Cloud Deployment)

विस्तृत क्लाउड डिप्लॉयमेंट (Vercel, Railway, Render, Docker, AWS VPS) के लिए [DEPLOYMENT.md](file:///c:/Kisan-Kalyan/DEPLOYMENT.md) देखें।

---

## 📄 लाइसेंस (License)

Smart India Hackathon (SIH) 2024 / राष्ट्रीय कृषि खरीद प्रबंधन परियोजना • सर्वाधिकार सुरक्षित © 2026.
