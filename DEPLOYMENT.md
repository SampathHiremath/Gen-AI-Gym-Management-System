# Pulse AI Gym & Athletic Performance - Deployment Guide

This guide details how to deploy the **Pulse AI Gym** full-stack web application across multiple environments.

---

## Architecture Overview

- **Frontend**: React 19 + Vite + Modern CSS (Electrified Dark Gym Aesthetic)
- **Backend API**: Django 6 + Django REST Framework + CORS Headers
- **Database**: MySQL 8.0 (with automated fallback to SQLite in local dev if credentials are not set)
- **Generative AI Engine**: Google Gemini 1.5 Flash API + Built-in Titan Neural Sports Science Fallback Engine
- **Reverse Proxy / Production Server**: Nginx + Gunicorn

---

## 1. Quick Local Development (Windows / macOS / Linux)

### Prerequisites
- Python 3.10+
- Node.js 18+ & npm
- (Optional) MySQL 8.0 server running locally

### Backend Setup
1. Open terminal in `d:\gen_ai_gym\backend`:
   ```bash
   # Activate virtualenv
   ..\venv\Scripts\activate
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Run migrations
   python manage.py migrate
   
   # Seed realistic gym data (Plans, Trainers, Classes, Schedules, Demo user)
   python manage.py seed_gym_data
   
   # Start Django API server on port 8001
   python manage.py runserver 127.0.0.1:8001
   ```

### Frontend Setup
1. In a separate terminal in `d:\gen_ai_gym\frontend`:
   ```bash
   npm install
   npm run dev
   ```
2. Open your browser to **`http://localhost:5173/`**.

### 1-Click Launch on Windows
Simply double-click `run_dev.bat` in the root folder. It will launch both the backend and frontend in separate command windows.

---

## 2. Production Docker Deployment (Recommended)

The project includes production-ready `Dockerfile`s for both services and a top-level `docker-compose.yml`.

### Single Command Deployment
```bash
docker compose up -d --build
```

### What this spins up:
1. **`pulse_gym_db`**: MySQL 8.0 container on port `3307` (internal `3306`) with persistent volume `mysql_data`.
2. **`pulse_gym_backend`**: Django API with Gunicorn on port `8000`, waiting for MySQL healthcheck, auto-migrating, and seeding initial data.
3. **`pulse_gym_frontend`**: Nginx container on port `80` serving the production React bundle and proxying `/api/` calls to the backend.

### Verify Deployment:
Visit `http://your-server-ip/` or `http://localhost/` in your browser.

---

## 3. Configuring MySQL Database in `.env`

In `backend/.env`, configure your MySQL credentials:

```ini
DEBUG=False
SECRET_KEY=your-secure-random-secret-key-here
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com,127.0.0.1

DB_ENGINE=mysql
DB_NAME=gym_db
DB_USER=root
DB_PASSWORD=your_actual_mysql_password
DB_HOST=127.0.0.1
DB_PORT=3306

# Optional: Add your Google Gemini API Key for dynamic LLM workouts and coaching
GEMINI_API_KEY=AIzaSy...
```

*Note: If MySQL authentication fails or is temporarily unreachable, Django logs a helpful tip in the console and automatically uses SQLite so the development environment never crashes.*

---

## 4. Ubuntu VPS Production Deployment (Without Docker)

### Step 1: System packages & MySQL
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install python3-pip python3-venv nginx mysql-server -y

# Secure MySQL and create database
sudo mysql
mysql> CREATE DATABASE gym_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
mysql> CREATE USER 'gym_user'@'localhost' IDENTIFIED BY 'StrongPassword123!';
mysql> GRANT ALL PRIVILEGES ON gym_db.* TO 'gym_user'@'localhost';
mysql> FLUSH PRIVILEGES;
mysql> EXIT;
```

### Step 2: Configure Django Backend with Systemd
Create `/etc/systemd/system/pulse_gym.service`:
```ini
[Unit]
Description=Gunicorn instance to serve Pulse AI Gym Backend
After=network.target

[Service]
User=ubuntu
Group=www-data
WorkingDirectory=/var/www/gen_ai_gym/backend
Environment="PATH=/var/www/gen_ai_gym/venv/bin"
ExecStart=/var/www/gen_ai_gym/venv/bin/gunicorn --workers 3 --bind 127.0.0.1:8001 gym_backend.wsgi:application

[Install]
WantedBy=multi-user.target
```

Enable and start the service:
```bash
sudo systemctl start pulse_gym
sudo systemctl enable pulse_gym
```

### Step 3: Build Frontend & Configure Nginx
```bash
cd /var/www/gen_ai_gym/frontend
npm install
npm run build
```

Configure Nginx `/etc/nginx/sites-available/gym`:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    root /var/www/gen_ai_gym/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8001/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Enable site and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/gym /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

---

## 5. Free Cloud Hosting (Render / Railway)

1. **Railway**:
   - Push repository to GitHub.
   - Click "New Project" -> "Provision MySQL".
   - Add service from GitHub repo (`backend`), set env vars (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`).
   - Add service for `frontend`.

2. **Render**:
   - Deploy backend as Web Service (`python manage.py migrate && gunicorn gym_backend.wsgi`).
   - Deploy frontend as Static Site (`npm run build` with publish directory `dist`).
