@echo off
title SmartQueue AI - System Launcher
echo ===================================================
echo           SMARTQUEUE AI - SYSTEM LAUNCHER          
echo ===================================================
echo.
set "PATH=C:\Users\user\.local\node\node-v20.18.0-win-x64;C:\Users\user\.local\git\cmd;%PATH%"

echo [1/2] Starting Express REST API Backend (Port 5000)...
start "SmartQueue AI Backend" cmd /k "cd /d %~dp0\backend && node server.js"

timeout /t 2 /nobreak >nul

echo [2/2] Starting Vite React Frontend (Port 3000)...
start "SmartQueue AI Frontend" cmd /k "cd /d %~dp0\frontend && npm run dev"

echo.
echo Application running at:
echo - Frontend: http://localhost:3000
echo - Backend:  http://localhost:5000
echo.
pause
