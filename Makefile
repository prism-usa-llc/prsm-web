# Makefile for prsm-web

# Build the docker images
build:
	docker compose build

# Start the docker containers
up:
	docker compose up -d

# Stop and remove the docker containers
down:
	docker compose down

# Build and start the docker containers
all: build up