#!/bin/bash
# 🚀 HHBC CONSULTANCY - ONE-CLICK DEPLOYMENT
# Complete setup script for Docker deployment

set -e

echo "🚀 HHBC CONSULTANCY - ONE-CLICK DOCKER DEPLOYMENT"
echo "================================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "Please don't run this script as root for security reasons"
   exit 1
fi

# Welcome message
echo "This script will set up your HHBC Consultancy application with Docker."
echo ""
echo "Requirements:"
echo "- Docker and Docker Compose installed"
echo "- Internet connection for downloading images"
echo "- At least 2GB RAM and 10GB disk space"
echo ""

read -p "Do you want to continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled."
    exit 0
fi

# Function to generate secure keys
generate_secure_key() {
    openssl rand -base64 32 2>/dev/null || date | md5sum | head -c 32
}

# Function to setup environment
setup_environment() {
    print_step "Setting up environment configuration..."
    
    if [ ! -f ".env" ]; then
        print_warning "Creating .env file from template..."
        cp .env.example .env
        
        # Generate secure keys
        JWT_KEY=$(generate_secure_key)
        SECRET_KEY=$(generate_secure_key)
        DB_PASSWORD=$(generate_secure_key)
        
        # Update .env file
        sed -i "s/your-super-secure-jwt-key-minimum-32-characters-long/$JWT_KEY/g" .env
        sed -i "s/your-super-secure-secret-key-minimum-32-characters-long/$SECRET_KEY/g" .env
        sed -i "s/your_secure_database_password_here/$DB_PASSWORD/g" .env
        
        # Generate random admin password
        ADMIN_PASS=$(openssl rand -base64 12 2>/dev/null || date | md5sum | head -c 12)
        sed -i "s/your_secure_admin_password_min_12_chars/$ADMIN_PASS/g" .env
        
        print_success "Environment configured with secure keys"
        print_warning "Your admin password is: $ADMIN_PASS"
        print_warning "Please save this password securely!"
        echo ""
        read -p "Press Enter to continue..."
    else
        print_success ".env file already exists"
    fi
}

# Function to check Docker
setup_docker() {
    print_step "Checking Docker installation..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        echo "Visit: https://docs.docker.com/get-docker/"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        echo "Visit: https://docs.docker.com/compose/install/"
        exit 1
    fi
    
    # Check if Docker daemon is running
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker daemon is not running. Please start Docker service."
        exit 1
    fi
    
    print_success "Docker is properly installed and running"
}

# Function to build and deploy
deploy_application() {
    print_step "Building Docker images..."
    
    if docker-compose build --no-cache; then
        print_success "Docker images built successfully"
    else
        print_error "Failed to build Docker images"
        exit 1
    fi
    
    print_step "Starting services..."
    
    if docker-compose up -d; then
        print_success "Services started successfully"
    else
        print_error "Failed to start services"
        exit 1
    fi
    
    print_step "Waiting for services to be ready..."
    sleep 10
    
    # Health checks
    print_step "Performing health checks..."
    
    # Check backend
    if curl -f http://localhost:5000/health > /dev/null 2>&1; then
        print_success "Backend service is healthy"
    else
        print_error "Backend service health check failed"
        echo "Check logs with: docker-compose logs backend"
        exit 1
    fi
    
    # Check frontend
    if curl -f http://localhost > /dev/null 2>&1; then
        print_success "Frontend service is healthy"
    else
        print_error "Frontend service health check failed"
        echo "Check logs with: docker-compose logs frontend"
        exit 1
    fi
}

# Function to test application
test_application() {
    print_step "Testing application functionality..."
    
    # Test contact form
    if curl -s -X POST http://localhost:5000/contact/submit \
        -H "Content-Type: application/json" \
        -d '{"name":"Test User","email":"test@example.com","subject":"Test Deployment","message":"This is a test of the deployment"}' \
        > /dev/null 2>&1; then
        print_success "Contact form submission test passed"
    else
        print_warning "Contact form test failed - check backend logs"
    fi
    
    # Test API endpoints
    if curl -f http://localhost:5000/ > /dev/null 2>&1; then
        print_success "API endpoints are accessible"
    else
        print_warning "API endpoints test failed"
    fi
}

# Function to display final information
show_completion_info() {
    echo ""
    echo "🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!"
    echo "====================================="
    echo ""
    echo "Your HHBC Consultancy application is now running:"
    echo ""
    echo "📱 Frontend: http://localhost"
    echo "🔧 Backend API: http://localhost:5000"
    echo "📊 API Health: http://localhost:5000/health"
    echo ""
    echo "🔑 Admin Access:"
    echo "   - Navigate to: http://localhost/login"
    echo "   - Username: admin (or check your .env file)"
    echo "   - Password: [Check the password shown above]"
    echo ""
    echo "🐳 Docker Management:"
    echo "   - View logs: docker-compose logs -f"
    echo "   - Stop services: docker-compose down"
    echo "   - Restart: docker-compose restart"
    echo "   - Status: docker-compose ps"
    echo ""
    echo "📚 Documentation:"
    echo "   - Docker Guide: DOCKER_DEPLOYMENT_GUIDE.md"
    echo "   - VPN Setup: VPN_DEPLOYMENT_GUIDE.md"
    echo "   - Full Summary: DEPLOYMENT_SUMMARY.md"
    echo ""
    echo "⚠️  IMPORTANT:"
    echo "   - Save your admin password securely!"
    echo "   - Review and update environment variables as needed"
    echo "   - Configure SSL for production use"
    echo "   - Set up regular backups"
    echo ""
    echo "🚀 Your application is ready to use!"
}

# Function to cleanup on exit
cleanup() {
    if [ $? -ne 0 ]; then
        print_error "Deployment failed. Cleaning up..."
        docker-compose down > /dev/null 2>&1 || true
    fi
}

# Set trap for cleanup
trap cleanup EXIT

# Main deployment process
main() {
    setup_docker
    setup_environment
    deploy_application
    test_application
    show_completion_info
}

# Run main function
main "$@"