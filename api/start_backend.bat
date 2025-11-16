@echo off
REM Backend startup script for HHBC Consultancy Website (Windows)

echo Starting HHBC Backend Services...

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Python is not installed. Please install Python 3.8 or higher.
    exit /b 1
)

REM Check if we're in the api directory
if not exist "app.py" (
    echo Error: app.py not found. Please run this script from the api directory.
    exit /b 1
)

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing dependencies...
pip install -r requirements.txt

REM Create logs directory
if not exist "logs" mkdir logs

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo Creating .env file from template...
    copy .env.example .env
    echo Please edit .env file with your configuration before running the server.
)

REM Initialize database
echo Initializing database...
python -c "from app import app, db; app.app_context().push(); db.create_all(); print('Database initialized successfully')"

REM Start the server
echo Starting Flask server...
echo Server will be available at: http://localhost:5000
echo API Documentation: http://localhost:5000/api/docs
echo Press Ctrl+C to stop the server

python app.py