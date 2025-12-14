@echo off
echo ========================================
echo    AERIX - Starting All Services
echo ========================================
echo.

echo [1/3] Starting ML Service (Port 5000)...
start "Aerix ML Service" cmd /k "cd ml && python inference.py"
timeout /t 3 /nobreak >nul

echo [2/3] Starting Backend API (Port 3000)...
start "Aerix Backend" cmd /k "cd backend && npm start"
timeout /t 3 /nobreak >nul

echo [3/3] Starting Frontend Server (Port 8080)...
start "Aerix Frontend" cmd /k "cd frontend && python -m http.server 8080"
timeout /t 2 /nobreak >nul

echo.
echo ========================================
echo    All Services Started!
echo ========================================
echo.
echo ML Service:    http://localhost:5000
echo Backend API:   http://localhost:3000
echo Frontend:      http://localhost:8080
echo.
echo Opening browser...
timeout /t 2 /nobreak >nul
start http://localhost:8080

echo.
echo Press any key to stop all services...
pause >nul

echo.
echo Stopping services...
taskkill /FI "WindowTitle eq Aerix*" /T /F >nul 2>&1

echo.
echo All services stopped.
pause
