@echo off
REM Docker deployment script for HHBC Consultancy (Windows)
REM ==============================================

echo 🚀 HHBC Consultancy - Docker Deployment Script (Windows)
echo ==============================================

REM Check if Docker is installed
where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not installed. Please install Docker first.
    exit /b 1
)

where docker-compose >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Docker Compose is not installed. Please install Docker Compose first.
    exit /b 1
)

REM Check if .env file exists
if not exist .env (
    echo [WARNING] .env file not found. Creating from .env.example...
    copy .env.example .env
    echo [WARNING] Please edit .env file with your configuration before running again.
    exit /b 1
)

REM Function to build and start services
:start_services
echo [INFO] Building Docker images...
docker-compose build --no-cache

if %errorlevel% neq 0 (
    echo [ERROR] Docker build failed.
    exit /b 1
)

echo [INFO] Starting services...
docker-compose up -d

if %errorlevel% neq 0 (
    echo [ERROR] Failed to start services.
    exit /b 1
)

echo [INFO] Waiting for services to be ready...
timeout /t 10 /nobreak >nul

REM Check if services are healthy
echo [INFO] Checking service health...

REM Check backend health
curl -f http://localhost:5000/health >nul 2>nul
if %errorlevel% equ 0 (
    echo [INFO] ✅ Backend service is healthy
) else (
    echo [ERROR] ❌ Backend service is not responding
    exit /b 1
)

REM Check frontend
curl -f http://localhost >nul 2>nul
if %errorlevel% equ 0 (
    echo [INFO] ✅ Frontend service is healthy
) else (
    echo [ERROR] ❌ Frontend service is not responding
    exit /b 1
)

echo.
echo 🎉 Deployment completed successfully!
echo 🌐 Application available at: http://localhost
echo 📊 API available at: http://localhost:5000
echo.
echo To view logs: docker-compose logs -f
echo To stop services: docker-compose down
echo.
pause
exit /b 0

REM Function to stop services
:stop_services
echo [INFO] Stopping services...
docker-compose down
exit /b 0

REM Function to show status
:show_status
echo [INFO] Service status:
docker-compose ps
exit /b 0

REM Function to view logs
:view_logs
echo [INFO] Showing logs (press Ctrl+C to exit)...
docker-compose logs -f
exit /b 0

REM Function to restart services
:restart_services
echo [INFO] Restarting services...
docker-compose restart
exit /b 0

REM Main menu
:show_menu
cls
echo.
echo HHBC Consultancy - Docker Management (Windows)
echo ========================================
echo 1. Start services
echo 2. Stop services
echo 3. Restart services
echo 4. View logs
echo 5. Show status
echo 6. Exit
echo.
set /p choice=Select an option (1-6): 

if "%choice%"=="1" goto start_services
if "%choice%"=="2" goto stop_services
if "%choice%"=="3" goto restart_services
if "%choice%"=="4" goto view_logs
if "%choice%"=="5" goto show_status
if "%choice%"=="6" exit /b 0
echo Invalid option. Please select 1-6.
timeout /t 2 /nobreak >nul
goto show_menu

REM Parse command line arguments
if "%1"=="" goto show_menu
if "%1"=="start" goto start_services
if "%1"=="stop" goto stop_services
if "%1"=="restart" goto restart_services
if "%1"=="logs" goto view_logs
if "%1"=="status" goto show_status
goto show_menu