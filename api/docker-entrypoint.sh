#!/bin/bash
# Docker entrypoint script for backend

set -e

echo "🚀 Starting HHBC Consultancy Backend..."

# Wait for database to be ready
echo "⏳ Waiting for database..."
DB_URL="${DATABASE_URL:-consultoria.db}"
if [[ "$DB_URL" == postgresql* || "$DB_URL" == postgres* ]]; then
  python - <<'PY'
import os, time
import psycopg2
url = os.getenv('DATABASE_URL')
while True:
    try:
        conn = psycopg2.connect(url)
        conn.close()
        print("✅ Database ready!")
        break
    except Exception as e:
        print("📡 Database not ready, waiting...", str(e))
        time.sleep(2)
PY
else
  # SQLite is file-based; connection will create the file if needed
  python - <<'PY'
import os, sqlite3
db = os.getenv('DATABASE_URL', 'consultoria.db')
try:
    sqlite3.connect(db).close()
    print("✅ SQLite database ready!")
except Exception as e:
    print("📡 SQLite initialization encountered an issue:", str(e))
PY
fi

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