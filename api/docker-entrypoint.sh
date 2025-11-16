#!/bin/bash
# Docker entrypoint script for backend

set -e

echo "🚀 Starting HHBC Consultancy Backend..."

# Wait for database to be ready
echo "⏳ Waiting for database..."
while ! python -c "import sqlite3; sqlite3.connect('${DATABASE_URL:-consultoria.db}')" 2>/dev/null; do
  echo "📡 Database not ready, waiting..."
  sleep 2
done

echo "✅ Database ready!"

# Initialize database
echo "🔧 Initializing database..."
python -c "
import sys
sys.path.append('/app')
from app_production import init_db, create_default_admin, create_sample_data
init_db()
create_default_admin()
create_sample_data()
print('✅ Database initialization complete!')
"

echo "🌐 Starting Gunicorn WSGI server..."
exec gunicorn --bind 0.0.0.0:5000 --workers 4 --timeout 120 --access-logfile - --error-logfile - app_production:app