@echo off
echo ===================================================
echo Starting Kisan Kalyan Full-Stack Application...
echo ===================================================

echo [1/2] Launching Spring Boot Backend on port 8080...
start "Kisan Kalyan Backend" cmd /k "cd backend && mvn spring-boot:run"

timeout /t 5 /nobreak >nul

echo [2/2] Launching React Frontend on port 5173...
start "Kisan Kalyan Frontend" cmd /k "cd frontend && npm run dev"

timeout /t 3 /nobreak >nul

echo Opening browser at http://localhost:5173 ...
start http://localhost:5173

echo ===================================================
echo Kisan Kalyan is now running!
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:8080/api
echo ===================================================
pause
