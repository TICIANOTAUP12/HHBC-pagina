#!/bin/bash
# Complete test script for HHBC Consultancy Docker deployment

set -e

echo "🧪 HHBC CONSULTANCY - DOCKER DEPLOYMENT TEST SUITE"
echo "================================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Test results
TESTS_PASSED=0
TESTS_FAILED=0

print_test() {
    echo -e "${YELLOW}[TEST]${NC} $1"
}

print_pass() {
    echo -e "${GREEN}[PASS]${NC} $1"
    ((TESTS_PASSED++))
}

print_fail() {
    echo -e "${RED}[FAIL]${NC} $1"
    ((TESTS_FAILED++))
}

print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

# Test 1: Environment file
print_test "Checking environment configuration..."
if [ -f ".env" ]; then
    print_pass ".env file exists"
    
    # Check for default passwords
    if grep -q "admin123" .env; then
        print_fail "Default admin password detected - CHANGE IT!"
    else
        print_pass "Admin password appears to be changed"
    fi
    
    if grep -q "your-super-secure" .env; then
        print_fail "Default security keys detected - GENERATE NEW ONES!"
    else
        print_pass "Security keys appear to be customized"
    fi
else
    print_fail ".env file not found - copy from .env.example"
fi

# Test 2: Docker availability
print_test "Checking Docker installation..."
if command -v docker &> /dev/null; then
    print_pass "Docker is installed"
    docker --version
else
    print_fail "Docker is not installed"
fi

if command -v docker-compose &> /dev/null; then
    print_pass "Docker Compose is installed"
    docker-compose --version
else
    print_fail "Docker Compose is not installed"
fi

# Test 3: Build test
print_test "Testing Docker build process..."
if docker-compose build --no-cache > /dev/null 2>&1; then
    print_pass "Docker images built successfully"
else
    print_fail "Docker build failed"
fi

# Test 4: Service startup
print_test "Starting services for testing..."
if docker-compose up -d > /dev/null 2>&1; then
    print_pass "Services started successfully"
    
    # Wait for services to be ready
    print_info "Waiting for services to initialize..."
    sleep 15
else
    print_fail "Failed to start services"
fi

# Test 5: Backend health check
print_test "Testing backend health endpoint..."
if curl -f http://localhost:5000/health > /dev/null 2>&1; then
    print_pass "Backend health check passed"
    
    # Test API status
    if curl -f http://localhost:5000/ > /dev/null 2>&1; then
        print_pass "Backend API is responding"
    else
        print_fail "Backend API is not responding"
    fi
else
    print_fail "Backend health check failed"
fi

# Test 6: Frontend accessibility
print_test "Testing frontend accessibility..."
if curl -f http://localhost > /dev/null 2>&1; then
    print_pass "Frontend is accessible"
else
    print_fail "Frontend is not accessible"
fi

# Test 7: Contact form API
print_test "Testing contact form submission..."
RESPONSE=$(curl -s -X POST http://localhost:5000/contact/submit \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","subject":"Test","message":"Test message"}' \
  -w "%{http_code}" -o /dev/null)

if [ "$RESPONSE" = "201" ]; then
    print_pass "Contact form submission successful"
else
    print_fail "Contact form submission failed (HTTP $RESPONSE)"
fi

# Test 8: Authentication
print_test "Testing authentication system..."
# Get admin credentials from .env
ADMIN_USER=$(grep ADMIN_USERNAME .env | cut -d'=' -f2)
ADMIN_PASS=$(grep ADMIN_PASSWORD .env | cut -d'=' -f2)

AUTH_RESPONSE=$(curl -s -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$ADMIN_USER\",\"password\":\"$ADMIN_PASS\"}" \
  -w "%{http_code}" -o /dev/null)

if [ "$AUTH_RESPONSE" = "200" ]; then
    print_pass "Authentication system working"
else
    print_fail "Authentication failed (HTTP $AUTH_RESPONSE)"
fi

# Test 9: Database connectivity
print_test "Testing database connectivity..."
if docker-compose exec -T db pg_isready -U consultoria_user > /dev/null 2>&1; then
    print_pass "Database is ready and accepting connections"
else
    print_fail "Database connectivity issues"
fi

# Test 10: Security headers
print_test "Testing security headers..."
HEADERS=$(curl -s -I http://localhost | grep -i "x-frame-options\|x-content-type-options\|x-xss-protection")

if [ -n "$HEADERS" ]; then
    print_pass "Security headers are present"
else
    print_warning "Some security headers may be missing"
fi

# Test 11: Performance test
print_test "Testing basic performance..."
START_TIME=$(date +%s%N)
curl -s http://localhost:5000/health > /dev/null
END_TIME=$(date +%s%N)
RESPONSE_TIME=$(( (END_TIME - START_TIME) / 1000000 ))  # Convert to milliseconds

if [ "$RESPONSE_TIME" -lt 1000 ]; then
    print_pass "API response time: ${RESPONSE_TIME}ms"
else
    print_warning "API response time: ${RESPONSE_TIME}ms (consider optimization)"
fi

# Test 12: Log verification
print_test "Checking application logs..."
if docker-compose logs backend | grep -q "Backend ready"; then
    print_pass "Backend logs show successful startup"
else
    print_fail "Backend logs show issues"
fi

# Cleanup
print_info "Cleaning up test deployment..."
docker-compose down > /dev/null 2>&1

# Summary
echo ""
echo "📊 TEST SUMMARY"
echo "==============="
echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"

if [ "$TESTS_FAILED" -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL TESTS PASSED! Your deployment is ready.${NC}"
    exit 0
else
    echo -e "${RED}❌ Some tests failed. Please review the issues above.${NC}"
    exit 1
fi