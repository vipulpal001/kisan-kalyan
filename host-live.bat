@echo off
setlocal enabledelayedexpansion
title Kisan Kalyan - Instant Live Public Hosting

echo ==============================================================================
echo            🌾 KISAN KALYAN - INSTANT PUBLIC HOSTING LAUNCHER 🌾
echo ==============================================================================
echo.
echo  This script launches your Kisan Kalyan platform locally and exposes it
echo  to the public internet over secure HTTPS with ZERO cloud account or GitHub setup.
echo.
echo ==============================================================================
echo.

:: 1. Detect Local IP Address for LAN devices
echo [1/4] Detecting Local Network IP address...
for /f "tokens=4" %%a in ('route print 0.0.0.0 ^| findstr "0.0.0.0" 2^>nul') do (
    if not "%%a"=="" set LOCAL_IP=%%a
)
if "%LOCAL_IP%"=="" set LOCAL_IP=localhost
echo       Local IP: %LOCAL_IP%

:: 2. Retrieve Public IP (Used as Localtunnel bypass password)
echo [2/4] Detecting your Public IP (for Tunnel authentication)...
for /f "tokens=*" %%i in ('powershell -Command "(Invoke-WebRequest -Uri 'https://api.ipify.org' -UseBasicParsing).Content" 2^>nul') do (
    set PUBLIC_IP=%%i
)
if "%PUBLIC_IP%"=="" (
    for /f "tokens=*" %%i in ('powershell -Command "(Invoke-WebRequest -Uri 'https://ifconfig.me/ip' -UseBasicParsing).Content" 2^>nul') do (
        set PUBLIC_IP=%%i
    )
)
echo       Public IP / Tunnel Password: %PUBLIC_IP%

:: 3. Launch Backend
echo.
echo [3/4] Starting Spring Boot Backend (Port 8080)...
if exist "backend\target\kisan-kalyan-backend-0.0.1-SNAPSHOT.jar" (
    echo       Using packaged production JAR...
    start "Kisan Kalyan Backend" cmd /k "cd backend && java -jar target\kisan-kalyan-backend-0.0.1-SNAPSHOT.jar"
) else (
    echo       Building and launching backend via Maven...
    start "Kisan Kalyan Backend" cmd /k "cd backend && mvn spring-boot:run"
)

echo       Waiting 8 seconds for backend to initialize...
timeout /t 8 /nobreak >nul

:: 4. Launch Frontend
echo.
echo [4/4] Starting React Frontend (Port 5173)...
start "Kisan Kalyan Frontend" cmd /k "cd frontend && npm run dev -- --host 0.0.0.0 --port 5173"

echo       Waiting 4 seconds for frontend dev server...
timeout /t 4 /nobreak >nul

:: 5. Launch Public HTTPS Tunnel
echo.
echo ==============================================================================
echo                      🚀 STARTING PUBLIC HTTPS TUNNEL 🚀
echo ==============================================================================
echo.
echo  Starting Localtunnel on Port 5173...
echo  (All frontend assets, REST API calls, and WebSocket queues are routed!)
echo.
echo  IMPORTANT:
echo  When someone visits the generated .loca.lt URL in their browser for the
echo  first time, Localtunnel may ask for a "Tunnel Password".
echo.
echo  👉 YOUR TUNNEL PASSWORD IS: %PUBLIC_IP%
echo.
echo ==============================================================================
echo.
echo  Access URLs:
echo   - Local Browser:   http://localhost:5173
echo   - Mobile / Wi-Fi:  http://%LOCAL_IP%:5173
echo   - Public Internet: (See the Live Tunnel window for your https://*.loca.lt URL)
echo.
echo ==============================================================================

start "Kisan Kalyan Public Tunnel" cmd /k "echo =================================================== & echo KISAN KALYAN PUBLIC LIVE TUNNEL & echo Tunnel Password if prompted: %PUBLIC_IP% & echo =================================================== & npx -y localtunnel --port 5173"

echo.
echo Opening local browser...
start http://localhost:5173

echo.
echo To stop everything later, close the terminal windows or double-click stop.bat
echo.
pause
