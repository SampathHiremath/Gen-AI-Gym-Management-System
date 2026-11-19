@echo off
title Pulse AI Gym - Launch Development Stack
echo ========================================================
echo Launching Pulse AI Gym Full Stack (Django + React)
echo ========================================================

start "Pulse AI Backend (Port 8000)" cmd /k "%~dp0\start_backend.bat"
timeout /t 3 /nobreak >nul
start "Pulse AI Frontend (Port 5173)" cmd /k "%~dp0\start_frontend.bat"

echo.
echo Both servers are launching!
echo Backend API:     http://127.0.0.1:8000/api/
echo Gym Website UI:  http://localhost:5173/
echo.
