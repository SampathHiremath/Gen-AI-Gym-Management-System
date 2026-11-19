#!/bin/sh
set -e

echo "[Pulse AI Gym Backend] Waiting for MySQL database..."
if [ "$DB_ENGINE" = "mysql" ]; then
    while ! nc -z $DB_HOST $DB_PORT; do
      sleep 1
    done
    echo "[Pulse AI Gym Backend] MySQL is up and reachable!"
fi

echo "[Pulse AI Gym Backend] Applying database migrations..."
python manage.py migrate --noinput

echo "[Pulse AI Gym Backend] Seeding gym data..."
python manage.py seed_gym_data || true

echo "[Pulse AI Gym Backend] Starting Gunicorn server on port 8000..."
exec "$@"
