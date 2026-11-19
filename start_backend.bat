@echo off
title Pulse AI Gym - Django Backend
echo ========================================================
echo Starting Pulse AI Gym Backend on http://127.0.0.1:8000
echo ========================================================
cd /d "%~dp0\backend"
call ..\venv\Scripts\activate.bat
python manage.py runserver 127.0.0.1:8000
pause
