# Quick Start Guide

Get the Radiology Report App running in 3 commands.

## Prerequisites

- Docker & Docker Compose installed
- Anthropic API key from https://console.anthropic.com/

## Setup (First Time Only)

```bash
# 1. Create .env file
make setup

# 2. Edit .env and add your API key
# ANTHROPIC_API_KEY=sk-ant-xxx...
```

## Start the App

```bash
make start
```

Wait ~30 seconds for all services to start and health checks to pass.

## Access

- **Frontend:** http://localhost:3000
- **API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

## Daily Commands

```bash
make start     # Start all services
make stop      # Stop all services
make logs      # View logs
make status    # Check service health
```

## Common Tasks

```bash
make shell-backend  # Backend shell
make db-shell       # Database shell
make restart        # Restart services
make clean          # Stop & remove containers
make reset          # ⚠️ Full reset (deletes data)
```

## Need Help?

```bash
make help      # Show all available commands
```

See `README.md` and `SETUP_GUIDE.md` for detailed documentation.

## Troubleshooting

**Services won't start?**
```bash
make logs
```

**Port conflicts?**
```bash
make stop
# Kill conflicting processes on ports 3000, 8000, 5432, 6379
```

**Something broken?**
```bash
make reset     # Nuclear option: deletes everything
make start     # Fresh start
```
