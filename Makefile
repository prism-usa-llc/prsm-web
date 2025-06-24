.PHONY: build clean help

# Default target
help:
	@echo "Available targets:"
	@echo "  build  - Create .env file from .env.example"
	@echo "  clean  - Remove generated files"
	@echo "  help   - Show this help message"

# Build target - creates .env file from .env.example
build:
	@echo "Creating .env file from .env.example..."
	@if [ ! -f api/fastapi/.env.example ]; then \
		echo "Error: .env.example file not found in api/fastapi/"; \
		exit 1; \
	fi
	@cp api/fastapi/.env.example api/fastapi/.env
	@echo "✓ .env file created successfully"
	@echo "⚠️  Remember to update the values in api/fastapi/.env with your actual credentials"

# Clean target - removes generated .env file
clean:
	@echo "Cleaning up generated files..."
	@if [ -f api/fastapi/.env ]; then \
		rm api/fastapi/.env; \
		echo "✓ Removed api/fastapi/.env"; \
	else \
		echo "ℹ️  No .env file to remove"; \
	fi
