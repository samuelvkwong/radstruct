# Radiology Report Structuring App - Setup Guide

Complete guide to setting up and running the radiology report structuring application.

## Quick Start with Docker

### Prerequisites
- Docker and Docker Compose installed
- Anthropic API key ([get one here](https://console.anthropic.com/))

### Steps

1. **Setup (one-time)**
```bash
make setup
```
This creates your `.env` file. Edit it and add your `ANTHROPIC_API_KEY`:
```env
ANTHROPIC_API_KEY=your_api_key_here
SECRET_KEY=change-this-to-a-random-string
```

2. **Start the application**
```bash
make start
```

That's it! The database will be automatically seeded with default templates.

3. **Access the application**
- 🌐 Frontend: http://localhost:3000
- 📡 Backend API: http://localhost:8000
- 📚 API Documentation: http://localhost:8000/docs

### Useful Commands

```bash
make help          # Show all available commands
make logs          # View logs from all services
make logs-backend  # View backend and worker logs only
make stop          # Stop all services
make restart       # Restart all services
make shell-backend # Open a shell in backend container
make db-shell      # Open PostgreSQL shell
make status        # Check health of all services
make clean         # Stop and remove containers (keeps data)
make reset         # Full reset including database (⚠️ deletes all data)
```

## Usage Guide

### 1. Uploading Reports

**Using Pre-built Templates:**
1. Go to "Upload Reports" tab
2. Select a template (e.g., "Chest X-Ray", "CT Brain")
3. Enter a batch name (e.g., "Morning Reports - Jan 15")
4. Drag and drop your report files (.txt, .pdf, .doc, .docx)
5. Click "Upload and Process Reports"

**Example Report Text:**
```text
CLINICAL INDICATION: Shortness of breath

TECHNIQUE: PA and lateral chest radiographs

FINDINGS:
The lungs are clear without focal consolidation, pleural effusion, or pneumothorax.
The cardiac silhouette is normal in size.
The mediastinal contours are unremarkable.
No acute osseous abnormalities.

IMPRESSION: Normal chest radiograph.
```

### 2. Viewing Results

1. Navigate to "View Batches" tab
2. Select a batch from the list
3. Monitor processing progress
4. Click on individual reports to see:
   - Structured data extracted by AI
   - Original report text
   - Processing status and confidence score

### 3. Creating Custom Templates

1. Go to "Design Template" tab
2. Enter template information:
   - Name: e.g., "Custom Cardiac MRI"
   - Description: Brief description
   - Template Type: e.g., "cardiac_mri"
3. Add fields:
   - Click "+ Add Field"
   - Enter field name (e.g., "clinical_indication")
   - Choose type (Text or Object)
   - Add description
   - For Object type, add subfields
4. Click "Create Template"

**Example Custom Template Structure:**
```json
{
  "patient_info": {
    "age": "Patient age",
    "gender": "Patient gender"
  },
  "clinical_indication": "Reason for scan",
  "findings": {
    "heart": "Cardiac findings",
    "vessels": "Vascular findings"
  },
  "impression": "Final impression"
}
```

## API Testing

Use the interactive API documentation at http://localhost:8000/docs

### Example: Create a batch via API

```bash
curl -X POST "http://localhost:8000/api/reports/batches" \
  -H "Content-Type: multipart/form-data" \
  -F "name=Test Batch" \
  -F "template_id=1" \
  -F "files=@report1.txt" \
  -F "files=@report2.txt"
```

### Example: Get templates

```bash
curl "http://localhost:8000/api/templates/"
```

## Troubleshooting

### Service Health

**Check if all services are running**
```bash
make status    # View status of all containers
make health    # Run health checks on all services
```

### Common Issues

**Services won't start**
```bash
# View logs to see what's wrong
make logs

# Or view specific service logs
make logs-backend
make logs-frontend
```

**Backend/Celery issues**
```bash
# Check backend and worker logs
make logs-backend

# Common issues:
# - Missing ANTHROPIC_API_KEY in .env
# - Invalid API key or no credits
# - Database not ready (wait for health checks)
```

**Frontend not loading**
```bash
# Check frontend logs
make logs-frontend

# Ensure backend is healthy first
make health
```

**Database connection issues**
```bash
# Check database logs
make logs-db

# Access database shell to debug
make db-shell
```

**"Port already in use" errors**
```bash
# Stop any conflicting services
make stop

# Or kill specific ports (example):
# lsof -ti:8000 | xargs kill -9  # Backend
# lsof -ti:3000 | xargs kill -9  # Frontend
```

**Need to reset everything**
```bash
# Full reset (⚠️ deletes all data)
make reset

# Then restart
make start
```

## Default Templates

The application comes with 4 pre-built templates:

1. **Chest X-Ray** - Standard chest radiograph
2. **CT Brain** - CT scan of brain
3. **Abdominal CT** - CT abdomen and pelvis
4. **MRI Spine** - Spine MRI examination

## Architecture Overview

```
┌─────────────┐
│   React     │
│  Frontend   │
└──────┬──────┘
       │ HTTP
       ▼
┌─────────────┐
│   FastAPI   │
│   Backend   │
└──────┬──────┘
       │
       ├──────► PostgreSQL (Data storage)
       │
       └──────► Redis ──► Celery Workers
                            │
                            ▼
                       Claude API
                    (AI processing)
```

## Performance Tips

- **Batch Size**: Upload 10-50 reports per batch for optimal processing
- **File Format**: .txt files process fastest; PDFs require extraction
- **Concurrent Processing**: Celery processes reports in parallel
- **Template Design**: Simpler templates = faster processing

## Security Notes

- Never commit .env files with real API keys
- Use strong SECRET_KEY in production
- Enable HTTPS in production
- Implement user authentication for production use
- Follow HIPAA guidelines if handling real patient data

## Next Steps

1. Add user authentication (JWT)
2. Implement role-based access control
3. Add export functionality (CSV, Excel)
4. Support for PDF/DOCX parsing
5. Enhanced error handling and validation
6. Audit logging for compliance
7. Batch export and reporting features

## Support

For issues or questions:
- Check the API docs: http://localhost:8000/docs
- Review backend logs
- Check Celery worker output
- Verify all services are running

## License

MIT
