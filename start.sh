#!/bin/bash
# Studio4 Dance Co - Start Script

echo "Starting Studio4 Dance Co..."

# Check if PostgreSQL is running
if ! pg_isready -q; then
    echo "Starting PostgreSQL..."
    service postgresql start
    sleep 2
fi

# Create database if not exists
echo "Setting up database..."
sudo -u postgres psql -c "CREATE DATABASE studio4;" 2>/dev/null || true
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';" 2>/dev/null || true

# Initialize database schema
sudo -u postgres psql -d studio4 -f /a0/usr/projects/studio4/database/schema.sql 2>/dev/null || echo "Schema may already exist"

# Start backend
echo "Starting backend API..."
cd /a0/usr/projects/studio4/backend
source /a0/venv/bin/activate
pip install -q -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend
echo "Starting frontend..."
cd /a0/usr/projects/studio4/frontend
npm install --silent
npm run dev &
FRONTEND_PID=$!

echo ""
echo "==========================================="
echo "Studio4 Dance Co is running!"
echo "==========================================="
echo "Frontend: http://localhost:5173"
echo "Backend API: http://localhost:8000"
echo "API Docs: http://localhost:8000/docs"
echo "==========================================="
echo ""
echo "Press Ctrl+C to stop"

# Wait for processes
wait $BACKEND_PID $FRONTEND_PID
