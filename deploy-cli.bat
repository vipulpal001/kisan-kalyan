@echo off
setlocal enabledelayedexpansion
title Kisan Kalyan - Direct Cloud CLI Deployment

:MENU
cls
echo ==============================================================================
echo            🌾 KISAN KALYAN - DIRECT CLOUD CLI DEPLOYMENT (NO GITHUB) 🌾
echo ==============================================================================
echo.
echo  Deploy frontend and backend directly to free/low-cost cloud providers
echo  straight from your command prompt without needing a GitHub repository!
echo.
echo  1. Deploy Frontend directly to Vercel (via Vercel CLI)
echo  2. Deploy Backend directly to Railway (via Railway CLI)
echo  3. Build All Production Assets locally (JAR & Frontend Bundle)
echo  4. Cloud PostgreSQL Setup Guide (Neon / Supabase 1-Click Free DB)
echo  5. Launch Instant Public Live Tunnel (Localtunnel)
echo  6. Exit
echo.
echo ==============================================================================
set /p CHOICE="Choose an option [1-6]: "

if "%CHOICE%"=="1" goto DEPLOY_VERCEL
if "%CHOICE%"=="2" goto DEPLOY_RAILWAY
if "%CHOICE%"=="3" goto BUILD_ALL
if "%CHOICE%"=="4" goto DB_GUIDE
if "%CHOICE%"=="5" goto RUN_TUNNEL
if "%CHOICE%"=="6" goto EXIT_PROMPT
goto MENU

:DEPLOY_VERCEL
cls
echo ==============================================================================
echo                      🚀 DEPLOY FRONTEND DIRECTLY TO VERCEL
echo ==============================================================================
echo.
echo  Prerequisites:
echo  1. A free Vercel account (https://vercel.com/signup)
echo  2. Your Backend API URL (e.g. https://your-backend.up.railway.app/api)
echo.
echo  Steps that will occur:
echo  - Vercel CLI will prompt you to log in (browser opens automatically).
echo  - Confirm project defaults (Scope, link to project, etc.).
echo  - Production build will upload directly to Vercel's global CDN!
echo.
set /p BACKEND_URL="Enter your Cloud Backend API URL (or press Enter for relative '/api'): "
if "%BACKEND_URL%"=="" set BACKEND_URL=/api

echo.
echo Building frontend with VITE_API_BASE_URL=%BACKEND_URL% ...
cd frontend
set VITE_API_BASE_URL=%BACKEND_URL%
call npm run build

echo.
echo Launching Vercel deployment...
call npx -y vercel --prod
cd ..
echo.
echo Vercel deployment completed!
pause
goto MENU

:DEPLOY_RAILWAY
cls
echo ==============================================================================
echo                      🚀 DEPLOY BACKEND DIRECTLY TO RAILWAY
echo ==============================================================================
echo.
echo  Railway allows deploying Dockerized Java apps without requiring GitHub!
echo.
echo  Prerequisites:
echo  1. A free Railway account (https://railway.com)
echo  2. PostgreSQL connection string (from Railway PostgreSQL plugin or Neon.tech)
echo.
echo  Steps:
echo  1. We will log you in to Railway CLI.
echo  2. Link or initialize a project in Railway.
echo  3. Upload and deploy your backend folder.
echo.
cd backend
echo Logging into Railway...
call npx -y @railway/cli login
echo.
echo Initializing Railway project...
call npx -y @railway/cli init
echo.
echo Deploying backend container...
call npx -y @railway/cli up
cd ..
echo.
pause
goto MENU

:BUILD_ALL
cls
echo ==============================================================================
echo                  🔨 BUILDING ALL PRODUCTION ARTIFACTS
echo ==============================================================================
echo.
echo [1/2] Building React 19 Frontend...
cd frontend
call npm run build
cd ..

echo.
echo [2/2] Packaging Spring Boot 3 Backend into Executable JAR...
cd backend
call mvn clean package -DskipTests
cd ..

echo.
echo ==============================================================================
echo  Builds completed successfully!
echo   - Frontend: frontend\dist\
echo   - Backend:  backend\target\kisan-kalyan-backend-0.0.1-SNAPSHOT.jar
echo ==============================================================================
pause
goto MENU

:DB_GUIDE
cls
echo ==============================================================================
echo              🐘 FREE CLOUD POSTGRESQL DATABASE SETUP (1-CLICK)
echo ==============================================================================
echo.
echo  Option 1: Neon.tech (Recommended - Free Serverless Postgres)
echo  -------------------------------------------------------------
echo  1. Go to https://neon.tech and create a free account.
echo  2. Click "Create Project" -> Name it: kisan-kalyan-db
echo  3. Neon displays your Connection String:
echo     postgresql://kisan_user:password@ep-xyz.us-east-2.aws.neon.tech/kisan_kalyan_db?sslmode=require
echo.
echo  Option 2: Supabase.com (Free Managed Postgres)
echo  -------------------------------------------------------------
echo  1. Go to https://supabase.com and create a free account.
echo  2. Click "New Project" -> Set Database Password.
echo  3. Under Project Settings -> Database -> Connection string:
echo     Copy the URI connection string.
echo.
echo  Configure in your Cloud Backend Environment Variables:
echo  - SPRING_DATASOURCE_URL=jdbc:postgresql://<host>:5432/<dbname>?sslmode=require
echo  - SPRING_DATASOURCE_USERNAME=<db-username>
echo  - SPRING_DATASOURCE_PASSWORD=<db-password>
echo  - SPRING_JPA_HIBERNATE_DDL_AUTO=update
echo.
pause
goto MENU

:RUN_TUNNEL
cls
call host-live.bat
goto MENU

:EXIT_PROMPT
exit
