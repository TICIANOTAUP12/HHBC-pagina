#!/bin/bash

# Backend startup script for HHBC Consultancy Website

echo "Starting HHBC Backend Services..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

# Check if we're in the api directory
if [ ! -f "app.py" ]; then
    echo "Error: app.py not found. Please run this script from the api directory."
    exit 1
fi

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate  # On Windows, use: venv\Scripts\activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Create logs directory
mkdir -p logs

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "Please edit .env file with your configuration before running the server."
fi

# Initialize database
echo "Initializing database..."
python -c "from app import app, db; app.app_context().push(); db.create_all(); print('Database initialized successfully')"

# Start the server
echo "Starting Flask server..."
echo "Server will be available at: http://localhost:5000"
echo "API Documentation: http://localhost:5000/api/docs"
echo "Press Ctrl+C to stop the server"

python app.py