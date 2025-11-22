.PHONY: help setup start stop restart logs logs-backend logs-frontend logs-db status clean reset shell-backend shell-frontend db-shell build ps

# Default target
.DEFAULT_GOAL := help

help: ## Show this help message
	@echo "🏥 Radiology Report App - Docker Commands"
	@echo ""
	@echo "Usage: make [target]"
	@echo ""
	@echo "Available targets:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

setup: ## First-time setup - copy .env and install dependencies
	@echo "🔧 Setting up Radiology Report App..."
	@if [ ! -f .env ]; then \
		cp example.env .env; \
		echo "✅ Created .env file from example.env"; \
		echo ""; \
		echo "⚠️  IMPORTANT: Please edit .env and add your ANTHROPIC_API_KEY"; \
		echo "   You can get one at: https://console.anthropic.com/"; \
		echo ""; \
		echo "After adding your API key, run: make start"; \
	else \
		echo "✅ .env file already exists"; \
	fi

start: ## Start all services
	@echo "🚀 Starting all services..."
	@if [ ! -f .env ]; then \
		echo "❌ .env file not found. Run 'make setup' first."; \
		exit 1; \
	fi
	@docker-compose up -d
	@echo ""
	@echo "✅ Services started! Waiting for health checks..."
	@echo ""
	@echo "📡 Frontend: http://localhost:3000"
	@echo "📡 Backend API: http://localhost:8000"
	@echo "📚 API Docs: http://localhost:8000/docs"
	@echo ""
	@echo "Run 'make logs' to view logs or 'make status' to check service health"

stop: ## Stop all services
	@echo "🛑 Stopping all services..."
	@docker-compose down
	@echo "✅ All services stopped"

restart: ## Restart all services
	@echo "🔄 Restarting all services..."
	@docker-compose restart
	@echo "✅ Services restarted"

build: ## Rebuild all Docker images
	@echo "🔨 Building Docker images..."
	@docker-compose build
	@echo "✅ Build complete"

rebuild: ## Rebuild and restart all services
	@echo "🔨 Rebuilding and restarting..."
	@docker-compose up -d --build
	@echo "✅ Rebuild complete"

logs: ## View logs from all services
	@docker-compose logs -f

logs-backend: ## View backend and celery worker logs
	@docker-compose logs -f backend celery_worker

logs-frontend: ## View frontend logs
	@docker-compose logs -f frontend

logs-db: ## View database and redis logs
	@docker-compose logs -f postgres redis

status: ## Check status of all services
	@echo "📊 Service Status:"
	@docker-compose ps

ps: status ## Alias for status

shell-backend: ## Open a shell in the backend container
	@docker-compose exec backend /bin/bash

shell-frontend: ## Open a shell in the frontend container
	@docker-compose exec frontend /bin/sh

db-shell: ## Open PostgreSQL shell
	@docker-compose exec postgres psql -U radiology_user -d radiology_db

clean: ## Stop services and remove containers (keeps data)
	@echo "🧹 Cleaning up containers..."
	@docker-compose down
	@echo "✅ Containers removed (data preserved)"

reset: ## Full reset - remove everything including database
	@echo "⚠️  This will delete all data including the database!"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		echo "🧹 Performing full reset..."; \
		docker-compose down -v; \
		echo "✅ Full reset complete"; \
	else \
		echo "❌ Reset cancelled"; \
	fi

dev: start ## Alias for start (development mode)

health: ## Check health of all services
	@echo "🏥 Health Status:"
	@echo ""
	@echo "PostgreSQL:"
	@docker-compose exec -T postgres pg_isready -U radiology_user || echo "❌ PostgreSQL not ready"
	@echo ""
	@echo "Redis:"
	@docker-compose exec -T redis redis-cli ping || echo "❌ Redis not ready"
	@echo ""
	@echo "Backend:"
	@curl -sf http://localhost:8000/health || echo "❌ Backend not ready"
	@echo ""
	@echo "Frontend:"
	@curl -sf http://localhost:3000 > /dev/null && echo "✅ Frontend ready" || echo "❌ Frontend not ready"
