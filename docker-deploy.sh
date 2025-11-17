#!/bin/bash
# Docker deployment script for HHBC Consultancy

set -e

echo "🚀 HHBC Consultancy - Docker Deployment Script"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi

    if command -v docker-compose &> /dev/null; then
        COMPOSE_CMD="docker-compose"
    elif docker compose version &> /dev/null; then
        COMPOSE_CMD="docker compose"
    else
        print_error "Docker Compose not found. Install docker-compose or the docker compose plugin."
        exit 1
    fi
}

# Check if .env file exists
check_env_file() {
    if [ ! -f .env ]; then
        print_warning ".env file not found. Creating from .env.example..."
        cp .env.example .env
        print_warning "Please edit .env file with your configuration before running again."
        exit 1
    fi
}

# Build and start services
start_services() {
    print_status "Building Docker images..."
    $COMPOSE_CMD build --no-cache
    
    print_status "Starting services..."
    $COMPOSE_CMD up -d
    
    print_status "Waiting for services to be ready..."
    sleep 10
    
    # Check if services are healthy
    print_status "Checking service health..."
    
    # Check backend health
    if curl -f http://localhost:5000/health > /dev/null 2>&1; then
        print_status "✅ Backend service is healthy"
    else
        print_error "❌ Backend service is not responding"
        exit 1
    fi
    
    # Check frontend
    if curl -f http://localhost > /dev/null 2>&1; then
        print_status "✅ Frontend service is healthy"
    else
        print_error "❌ Frontend service is not responding"
        exit 1
    fi
}

# Stop services
stop_services() {
    print_status "Stopping services..."
    $COMPOSE_CMD down
}

# View logs
view_logs() {
    print_status "Showing logs (press Ctrl+C to exit)..."
    $COMPOSE_CMD logs -f
}

# Restart services
restart_services() {
    print_status "Restarting services..."
    $COMPOSE_CMD restart
}

# Show status
show_status() {
    print_status "Service status:"
    $COMPOSE_CMD ps
}

# Backup database
backup_database() {
    print_status "Creating database backup..."
    mkdir -p backups
    BACKUP_FILE="backups/consultoria_backup_$(date +%Y%m%d_%H%M%S).sql"
    $COMPOSE_CMD exec db pg_dump -U consultoria_user consultoria_db > "$BACKUP_FILE"
    print_status "Database backup saved to: $BACKUP_FILE"
}

# Main menu
show_menu() {
    echo ""
    echo "HHBC Consultancy - Docker Management"
    echo "===================================="
    echo "1. Start services"
    echo "2. Stop services"
    echo "3. Restart services"
    echo "4. View logs"
    echo "5. Show status"
    echo "6. Backup database"
    echo "7. Exit"
    echo ""
}

# Main function
main() {
    check_docker
    check_env_file
    
    case "${1:-menu}" in
        "start")
            start_services
            ;;
        "stop")
            stop_services
            ;;
        "restart")
            restart_services
            ;;
        "logs")
            view_logs
            ;;
        "status")
            show_status
            ;;
        "backup")
            backup_database
            ;;
        "menu"|*)
            while true; do
                show_menu
                read -p "Select an option (1-7): " choice
                case $choice in
                    1) start_services ;;
                    2) stop_services ;;
                    3) restart_services ;;
                    4) view_logs ;;
                    5) show_status ;;
                    6) backup_database ;;
                    7) exit 0 ;;
                    *) print_error "Invalid option. Please select 1-7." ;;
                esac
            done
            ;;
    esac
}

# Run main function
main "$@"