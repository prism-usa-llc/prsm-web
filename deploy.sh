#!/bin/bash

# PRSM USA Deployment Script
# This script helps manage the frontend and backend services

set -e

PROJECT_ROOT="/home/rmintz/github/prsm-web"
FE_DIR="$PROJECT_ROOT/fe"
API_DIR="$PROJECT_ROOT/api/fastapi"
NGINX_CONFIG="$PROJECT_ROOT/nginx/nginx.conf"
NGINX_SITE_CONFIG="$PROJECT_ROOT/fe/etc/nginx/sites-enabled/prsmusa.nginx.conf"
PRODUCTION_WEB_DIR="/var/www/prsmusa"

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

# Function to check if service is running
check_service() {
    local service_name=$1
    local port=$2

    if lsof -i :$port >/dev/null 2>&1; then
        print_status "$service_name is running on port $port"
        return 0
    else
        print_warning "$service_name is not running on port $port"
        return 1
    fi
}

# Function to start FastAPI backend
start_backend() {
    print_status "Starting FastAPI backend..."

    if check_service "FastAPI" 8002; then
        print_warning "FastAPI is already running"
        return 0
    fi

    cd "$API_DIR"

    # Check if virtual environment exists
    if [ ! -d "venv" ]; then
        print_error "Virtual environment not found. Please run 'setup' first."
        exit 1
    fi

    # Start FastAPI in background
    source venv/bin/activate
    nohup uvicorn main:app --host 127.0.0.1 --port 8002 >/tmp/fastapi.log 2>&1 &
    echo $! >/tmp/fastapi.pid

    # Wait a moment and check if it started
    sleep 2
    if check_service "FastAPI" 8002; then
        print_status "FastAPI backend started successfully"
    else
        print_error "Failed to start FastAPI backend"
        exit 1
    fi
}

# Function to stop FastAPI backend
stop_backend() {
    print_status "Stopping FastAPI backend..."

    if [ -f /tmp/fastapi.pid ]; then
        local pid=$(cat /tmp/fastapi.pid)
        if kill -0 $pid >/dev/null 2>&1; then
            kill $pid
            rm /tmp/fastapi.pid
            print_status "FastAPI backend stopped"
        else
            print_warning "FastAPI process not found"
            rm -f /tmp/fastapi.pid
        fi
    else
        # Try to kill by port
        local pid=$(lsof -ti :8002)
        if [ ! -z "$pid" ]; then
            kill $pid
            print_status "FastAPI backend stopped"
        else
            print_warning "FastAPI backend was not running"
        fi
    fi
}

# Function to setup the environment
setup_environment() {
    print_status "Setting up PRSM USA environment..."

    # Create virtual environment if it doesn't exist
    if [ ! -d "$API_DIR/venv" ]; then
        print_status "Creating virtual environment..."
        cd "$API_DIR"
        python3 -m venv venv
    fi

    # Install dependencies
    print_status "Installing Python dependencies..."
    cd "$API_DIR"
    source venv/bin/activate
    pip install --upgrade pip
    pip install -r requirements.txt

    # Set permissions for frontend
    print_status "Setting frontend permissions..."
    chmod -R 755 "$FE_DIR"

    print_status "Environment setup complete!"
}

# Function to check system status
check_status() {
    print_status "Checking PRSM USA system status..."

    echo "Frontend files:"
    ls -la "$FE_DIR" | head -10

    echo -e "\nBackend status:"
    check_service "FastAPI" 8002

    echo -e "\nNginx configuration:"
    if [ -f "$NGINX_CONFIG" ]; then
        print_status "Nginx config found at $NGINX_CONFIG"
    else
        print_error "Nginx config not found"
    fi

    echo -e "\nPython virtual environment:"
    if [ -d "$API_DIR/venv" ]; then
        print_status "Virtual environment exists"
        cd "$API_DIR"
        source venv/bin/activate
        echo "Python version: $(python --version)"
        echo "Installed packages:"
        pip list | grep -E "(fastapi|uvicorn|redis|pydantic)" || echo "Key packages not found"
    else
        print_error "Virtual environment not found"
    fi
}

# Function to test the API
test_api() {
    print_status "Testing API endpoints..."

    if ! check_service "FastAPI" 8002; then
        print_error "FastAPI is not running. Please start it first."
        exit 1
    fi

    # Test root endpoint
    echo "Testing root endpoint..."
    response=$(curl -s http://localhost:8002/)
    if echo "$response" | grep -q "this is root"; then
        print_status "Root endpoint: OK"
    else
        print_error "Root endpoint: FAILED"
    fi

    # Test contact endpoint
    echo "Testing contact endpoint..."
    response=$(curl -s -X POST http://localhost:8002/contact \
        -H "Content-Type: application/json" \
        -d '{"name":"Test","email":"test@test.com","service":"test","message":"Test message"}')

    if echo "$response" | grep -q "success"; then
        print_status "Contact endpoint: OK"
    else
        print_error "Contact endpoint: FAILED"
    fi
}

# Function to show logs
show_logs() {
    print_status "Showing FastAPI logs..."
    if [ -f /tmp/fastapi.log ]; then
        tail -f /tmp/fastapi.log
    else
        print_error "No log file found"
    fi
}

# Function to deploy to production
deploy_production() {
    print_status "Deploying PRSM USA to production..."
    
    # Check if running as root or with sudo access
    if [ "$EUID" -ne 0 ]; then
        print_error "Production deployment requires sudo access"
        print_status "Please run: sudo ./deploy.sh deploy"
        exit 1
    fi
    
    # Stop backend if running
    stop_backend
    
    # Create production web directory
    print_status "Creating production web directory..."
    mkdir -p "$PRODUCTION_WEB_DIR"
    
    # Copy frontend files to production location
    print_status "Copying frontend files to $PRODUCTION_WEB_DIR..."
    cp -r "$FE_DIR"/* "$PRODUCTION_WEB_DIR/"
    
    # Set proper ownership and permissions
    print_status "Setting proper ownership and permissions..."
    chown -R www-data:www-data "$PRODUCTION_WEB_DIR"
    chmod -R 755 "$PRODUCTION_WEB_DIR"
    
    # Copy nginx site config to sites-available
    print_status "Configuring nginx..."
    if [ -f "$NGINX_SITE_CONFIG" ]; then
        # Update the nginx config to use production path
        sed 's|/home/rmintz/github/prsm-web/fe|/var/www/prsmusa|g' "$NGINX_SITE_CONFIG" > /etc/nginx/sites-available/prsmusa
        
        # Create symlink in sites-enabled
        ln -sf /etc/nginx/sites-available/prsmusa /etc/nginx/sites-enabled/prsmusa
        
        # Remove default nginx site if it exists
        if [ -f /etc/nginx/sites-enabled/default ]; then
            rm /etc/nginx/sites-enabled/default
            print_status "Removed default nginx site"
        fi
        
        print_status "Nginx site configuration updated"
    else
        print_error "Nginx site configuration not found at $NGINX_SITE_CONFIG"
        exit 1
    fi
    
    # Test nginx configuration
    print_status "Testing nginx configuration..."
    if nginx -t; then
        print_status "Nginx configuration is valid"
    else
        print_error "Nginx configuration test failed"
        exit 1
    fi
    
    # Reload nginx
    print_status "Reloading nginx..."
    systemctl reload nginx
    
    # Start backend in production mode
    print_status "Starting backend in production mode..."
    start_backend
    
    print_status "Production deployment complete!"
    print_status "Your site should now be accessible at https://prsmusa.com"
}

# Main script logic
case "$1" in
"setup")
    setup_environment
    ;;
"start")
    start_backend
    ;;
"stop")
    stop_backend
    ;;
"restart")
    stop_backend
    sleep 2
    start_backend
    ;;
"status")
    check_status
    ;;
"test")
    test_api
    ;;
"logs")
    show_logs
    ;;
"deploy")
    deploy_production
    ;;
*)
    echo "PRSM USA Management Script"
    echo "Usage: $0 {setup|start|stop|restart|status|test|logs|deploy}"
    echo ""
    echo "Commands:"
    echo "  setup   - Set up the development environment"
    echo "  start   - Start the FastAPI backend"
    echo "  stop    - Stop the FastAPI backend"
    echo "  restart - Restart the FastAPI backend"
    echo "  status  - Check system status"
    echo "  test    - Test API endpoints"
    echo "  logs    - Show FastAPI logs"
    echo "  deploy  - Deploy to production"
    exit 1
    ;;
esac
