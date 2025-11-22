from app.celery_app import celery_app
from app.tasks import report_tasks  # Import tasks to register them

# This file is used to run the Celery worker
# celery -A app.celery_worker worker --loglevel=info
