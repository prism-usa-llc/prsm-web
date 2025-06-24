SHELL := /bin/bash

.PHONY: build clean help install-backend install-frontend

# Default target
help:
	@echo "Available targets:"
	@echo "  build           - Full project setup (create .env, venvs, install deps)"
	@echo "  install-backend - Create Python venv and install backend dependencies"
	@echo "  install-frontend- Install frontend dependencies"
	@echo "  clean           - Remove generated files and environments"
	@echo "  help            - Show this help message"

# Build target - full project setup
build: install-backend install-frontend
	@echo ""
	@echo "🎯 Creating .env file from .env.example..."
	@if [ ! -f api/fastapi/.env.example ]; then \
		echo "❌ Error: .env.example file not found in api/fastapi/"; \
		exit 1; \
	fi
	@cp api/fastapi/.env.example api/fastapi/.env
	@echo "✅ .env file created successfully"
	@echo ""
	@echo "🚀 Project setup complete!"
	@echo "⚠️  Remember to update the values in api/fastapi/.env with your actual credentials"
	@echo ""
	@echo "To start development:"
	@echo "  Backend:  cd api/fastapi && source venv/bin/activate && uvicorn main:app --reload"
	@echo "  Frontend: cd fe/vite-project && npm run dev"

# Install backend dependencies
install-backend:
	@echo "🐍 Setting up Python backend environment..."
	@if [ ! -d "api/fastapi/venv" ]; then \
		echo "   Creating Python virtual environment..."; \
		cd api/fastapi && python3 -m venv venv; \
	else \
		echo "   Virtual environment already exists"; \
	fi
	@echo "   Installing Python dependencies..."
	@cd api/fastapi && source venv/bin/activate && pip install --upgrade pip
	@cd api/fastapi && source venv/bin/activate && pip install -r requirements.txt
	@echo "✅ Backend environment ready"

# Install frontend dependencies
install-frontend:
	@echo "⚛️  Setting up React frontend environment..."
	@if [ ! -d "fe/vite-project/node_modules" ]; then \
		echo "   Installing Node.js dependencies..."; \
		cd fe/vite-project && npm install; \
	else \
		echo "   Node modules already installed"; \
	fi
	@echo "✅ Frontend environment ready"

# Clean target - removes generated files and environments
clean:
	@echo "🧹 Cleaning up generated files and environments..."
	@if [ -f api/fastapi/.env ]; then \
		rm api/fastapi/.env; \
		echo "✅ Removed api/fastapi/.env"; \
	fi
	@if [ -d "api/fastapi/venv" ]; then \
		rm -rf api/fastapi/venv; \
		echo "✅ Removed Python virtual environment"; \
	fi
	@if [ -d "fe/vite-project/node_modules" ]; then \
		rm -rf fe/vite-project/node_modules; \
		echo "✅ Removed Node.js modules"; \
	fi
	@echo "🎉 Cleanup complete"
