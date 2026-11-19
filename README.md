
# PULSE AI GYM & ATHLETIC PERFORMANCE PLATFORM

> **Forged by Iron. Powered by Generative AI.**  
> A full-stack, fully deployable web application combining React 19, Django REST Framework, MySQL 8.0, and Google Gemini AI.

---

## Highlights & Features

- **GenAI Workout Routine Generator**:
  - Automatically synthesizes custom periodized routines (PPL, Upper/Lower, Full Body) based on goals, experience level, equipment, muscle targets, and physical limitations.
  - Generates warmups, sets, reps, rest intervals, RPE intensity targets, and cooldowns.
  - Option to supply custom Google Gemini API key or use built-in Titan Sports Science engine.
- **AI Macronutrient & Caloric Matrix**:
  - Calculates BMR & TDEE using the Mifflin-St Jeor equation.
  - Generates meal-by-meal athletic recipes (High Protein, Keto, Vegan) with precise macro breakdowns and grocery list.
- **24/7 PulseCoach AI Conversational Agent**:
  - Real-time fitness, recovery, and supplement coach providing science-backed advice on creatine, breaking plateaus, DOMS soreness, and nutrition.
- **Biomechanical Exercise Form & Cue Guide**:
  - Interactive breakdown of key compound lifts (Squat, Deadlift, Bench Press, OHP, Pull-up, Barbell Row) with setup cues, execution steps, and common mistakes.
- **Daily Biofeedback & CNS Readiness Calculator**:
  - Calculates daily strain recovery score (0-100) and recommends optimal training intensity.
- **Class Timetable & Live Capacity Reservation**:
  - Interactive schedule across all 7 days with filter by discipline (Strength, HIIT, Yoga, Boxing, CrossFit, Cycling).
  - Instant spot reservation and capacity tracker.
- **Membership Management**:
  - Bronze Starter, Silver Performance, Gold Championship, and Titan GenAI VIP tiers with Monthly/Annual discount toggles.
- **Athlete Dashboard**:
  - Save AI workouts and meal plans directly to profile.
  - Track active class reservations and biometric telemetry.
  - 1-Click "Demo Athlete Mode" (Alex Mercer) to test drive all features instantly.
- **Production & MySQL Ready**:
  - Configured for MySQL 8.0 (with automated fallback to SQLite in local dev if credentials are not set).
  - Multi-stage Dockerfile and Docker Compose orchestration.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, Lucide Icons, Canvas Confetti, Modern Dark CSS |
| **Backend API** | Django 6, Django REST Framework, django-cors-headers |
| **Database** | MySQL 8.0 / PyMySQL (with SQLite zero-config fallback) |
| **Gen AI** | Google Gemini 1.5 Flash API + Titan Sports Science Rule Engine |
| **Deployment** | Docker, Docker Compose, Nginx, Gunicorn |

---

## Quick Start (Local Development)

### 1. Launch with Master Batch Script (Windows)
Double-click:
```
run_dev.bat
```
This automatically starts:
- **Backend API**: `http://127.0.0.1:8001/api/`
- **Frontend App**: `http://localhost:5173/`

### 2. Manual Launch
**Backend**:
```bash
cd backend
..\venv\Scripts\activate
python manage.py migrate
python manage.py seed_gym_data
python manage.py runserver 127.0.0.1:8001
```

**Frontend**:
```bash
cd frontend
npm install
npm run dev
```

---

## Production Docker Deployment

Deploy the entire stack (MySQL 8.0 + Django + React + Nginx) with one command:

```bash
docker compose up -d --build
```

Access the live application at `http://localhost/` or `http://your-server-ip/`.

---

## Database Configuration

Update `backend/.env` with your MySQL credentials:
```ini
DB_ENGINE=mysql
DB_NAME=gym_db
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_HOST=127.0.0.1
DB_PORT=3306
```

---

## API Endpoints Overview

- `GET /api/` - API health check and feature matrix
- `POST /api/accounts/demo-login/` - Instant 1-click test drive login
- `POST /api/accounts/login/` & `register/` - User authentication
- `POST /api/ai/generate-workout/` - AI workout routine periodization
- `POST /api/ai/generate-meal-plan/` - AI caloric & macronutrient meal matrix
- `POST /api/ai/chat/` - Conversational 24/7 PulseCoach AI
- `GET /api/ai/form-advisor/` - Biomechanical cues for major lifts
- `POST /api/ai/readiness/` - CNS recovery & readiness score calculator
- `GET /api/classes/` & `GET /api/classes/schedules/` - Class directory & schedule
- `POST /api/classes/book/` - Reserve a spot in a class session
- `GET /api/memberships/plans/` - List membership tiers

# Gen-AI-Gym-Management-System
AI-Powered Gym Management System with Django, React and AI Services.
ba6c9154b560aadff38a85ea38b8f461db317d73
