.PHONY: help dev dev-frontend dev-fastapi dev-bible-api setup-fastapi setup-frontend setup-bible-api build-frontend clean redis-start redis-stop all

# Default target
help:
	@echo "Available targets:"
	@echo "  dev           - Start all development services"
	@echo "  dev-frontend  - Start React frontend development server"
	@echo "  dev-fastapi   - Start FastAPI development server"
	@echo "  dev-bible-api - Start Go Bible API server"
	@echo "  setup-fastapi - Setup FastAPI environment and dependencies"
	@echo "  setup-frontend- Setup frontend dependencies"
	@echo "  setup-bible-api- Setup Go Bible API dependencies"
	@echo "  build-frontend- Build React frontend for production"
	@echo "  redis-start   - Start Redis server"
	@echo "  redis-stop    - Stop Redis server"
	@echo "  clean         - Clean build artifacts and virtual environments"
	@echo "  all           - Setup all services and start development"

# Start all development services
dev:
	@echo "Starting all development services..."
	@make redis-start
	@echo "Starting services in background..."
	@make dev-fastapi &
	@make dev-bible-api &
	@make dev-frontend
	
# Start React frontend development server
dev-frontend:
	@echo "Starting React frontend development server..."
	cd fe/vite-project && npm run dev

# Start FastAPI development server
dev-fastapi:
	@echo "Starting FastAPI development server..."
	cd api/fastapi && \
	if [ ! -d "venv" ]; then python3 -m venv venv; fi && \
	. venv/bin/activate && \
	pip install -r requirements.txt && \
	uvicorn main:app --reload --host 0.0.0.0 --port 8002

# Start Go Bible API server
dev-bible-api:
	@echo "Starting Go Bible API server..."
	cd api/bible_api && go run cmd/bible_api.go

# Setup FastAPI environment
setup-fastapi:
	@echo "Setting up FastAPI environment..."
	cd api/fastapi && \
	python3 -m venv venv && \
	. venv/bin/activate && \
	pip install -r requirements.txt

# Setup frontend dependencies
setup-frontend:
	@echo "Setting up frontend dependencies..."
	cd fe/vite-project && npm install

# Setup Go Bible API dependencies
setup-bible-api:
	@echo "Setting up Go Bible API dependencies..."
	cd api/bible_api && go mod download

# Build React frontend for production
build-frontend:
	@echo "Building React frontend for production..."
	cd fe/vite-project && npm run build

# Start Redis server
redis-start:
	@echo "Starting Redis server..."
	@if ! pgrep redis-server > /dev/null; then \
		redis-server --daemonize yes --port 6379; \
		echo "Redis started on port 6379"; \
	else \
		echo "Redis is already running"; \
	fi

# Stop Redis server
redis-stop:
	@echo "Stopping Redis server..."
	@pkill redis-server || echo "Redis was not running"

# Clean build artifacts and virtual environments
clean:
	@echo "Cleaning build artifacts..."
	rm -rf api/fastapi/venv
	rm -rf fe/vite-project/dist
	rm -rf fe/vite-project/node_modules
	cd api/bible_api && go clean

# Setup all services and start development
all: setup-fastapi setup-frontend setup-bible-api dev