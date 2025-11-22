# Radiology Report Structuring - Backend

FastAPI backend for processing and structuring radiology reports using AI.

## Features

- RESTful API for report management
- AI-powered text extraction (Claude API)
- Asynchronous batch processing with Celery
- PostgreSQL database for data persistence
- Redis for task queue management

## Tech Stack

- Python 3.11+
- FastAPI
- SQLAlchemy ORM
- PostgreSQL
- Redis & Celery
- Anthropic Claude API

## Getting Started

### Prerequisites

- Python 3.11+
- PostgreSQL 15+
- Redis 7+

### Installation

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Configuration

Create a `.env` file in the backend directory:

```env
# Database
DATABASE_URL=postgresql://radiology_user:radiology_password@localhost:5432/radiology_db

# Redis
REDIS_URL=redis://localhost:6379/0

# API Keys
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Security
SECRET_KEY=your-super-secret-key-change-this

# Application
ENVIRONMENT=development
DEBUG=true
ALLOWED_ORIGINS=http://localhost:3000
```

### Database Setup

```bash
# The application will automatically create tables on startup
# Or you can use Alembic for migrations:
alembic upgrade head
```

### Running the Application

#### Start the API server:
```bash
uvicorn app.main:app --reload
```

API will be available at http://localhost:8000
API documentation: http://localhost:8000/docs

#### Start Celery worker (in a separate terminal):
```bash
celery -A app.celery_worker worker --loglevel=info
```

## Project Structure

```
app/
├── api/              # API endpoints
│   ├── templates.py  # Template CRUD operations
│   └── reports.py    # Report processing endpoints
├── core/             # Core configuration
│   ├── config.py     # Settings
│   └── database.py   # Database setup
├── models/           # SQLAlchemy models
│   └── models.py     # Database models
├── schemas/          # Pydantic schemas
│   └── schemas.py    # Request/response schemas
├── services/         # Business logic
│   └── ai_service.py # AI integration
├── tasks/            # Celery tasks
│   └── report_tasks.py # Async report processing
└── main.py          # FastAPI application
```

## API Endpoints

### Templates

- `GET /api/templates/` - List all templates
- `GET /api/templates/{id}` - Get template details
- `POST /api/templates/` - Create new template
- `PUT /api/templates/{id}` - Update template
- `DELETE /api/templates/{id}` - Delete template

### Reports

- `POST /api/reports/batches` - Upload batch of reports
- `GET /api/reports/batches` - List all batches
- `GET /api/reports/batches/{id}` - Get batch details
- `GET /api/reports/batches/{id}/reports` - Get reports in batch
- `GET /api/reports/{id}` - Get single report

## Database Models

### User
- Basic user authentication (placeholder for future auth)

### Template
- Pre-built and custom report templates
- JSON structure defining expected fields

### ReportBatch
- Container for multiple reports
- Tracks processing progress

### StructuredReport
- Individual radiology report
- Stores original text and extracted structured data

## AI Processing

The application uses the Anthropic Claude API to extract structured information from free-text radiology reports. The AI service:

1. Receives report text and template structure
2. Constructs a prompt asking Claude to extract relevant information
3. Returns structured JSON matching the template

## Development

### Running Tests

```bash
pytest
```

### Code Quality

```bash
# Format code
black app/

# Lint
flake8 app/
```

## Deployment

### Using Docker

```bash
docker-compose up --build
```

## License

MIT
