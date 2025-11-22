# Radiology Report Structuring Application

A web application for batch processing free-text radiology reports and structuring them according to customizable templates.

## Features

- 📤 Batch upload of radiology reports
- 🤖 AI-powered text extraction and structuring
- 📋 Pre-built radiology template formats
- ✏️ Custom template designer
- 📊 Export structured data

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS
- React Hook Form
- React Dropzone
- TanStack Table

### Backend
- Python 3.11+
- FastAPI
- PostgreSQL
- Redis (for Celery)
- Celery (async task processing)
- SQLAlchemy ORM

## Project Structure

```
radiology-report-app/
├── frontend/           # React frontend application
├── backend/            # FastAPI backend application
└── docker-compose.yml  # Docker orchestration
```

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Anthropic API key ([Get one here](https://console.anthropic.com/))

### Getting Started (3 commands)

1. **First-time setup**
   ```bash
   make setup
   ```
   This creates your `.env` file. Edit it and add your `ANTHROPIC_API_KEY`.

2. **Start the application**
   ```bash
   make start
   ```

3. **Access the application**
   - 🌐 Frontend: http://localhost:3000
   - 📡 Backend API: http://localhost:8000
   - 📚 API Documentation: http://localhost:8000/docs

That's it! The database will be automatically seeded with default templates.

### Common Commands

```bash
make help          # Show all available commands
make logs          # View logs from all services
make stop          # Stop all services
make restart       # Restart all services
make shell-backend # Open backend shell
make db-shell      # Open database shell
make status        # Check service status
make clean         # Stop and remove containers
```

### What's Running?

The application runs 5 Docker containers:
- **Frontend** (React) - Port 3000
- **Backend** (FastAPI) - Port 8000
- **Celery Worker** (async tasks)
- **PostgreSQL** (database) - Port 5432
- **Redis** (task queue) - Port 6379

All services include health checks and will auto-restart if they fail.

## License

MIT
