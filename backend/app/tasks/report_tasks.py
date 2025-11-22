from app.celery_app import celery_app
from app.core.database import SessionLocal
from app.models.models import StructuredReport, ReportBatch, Template
from app.services.ai_service import ai_service
from sqlalchemy.orm import Session
import asyncio


@celery_app.task(name="process_report")
def process_report_task(report_id: int):
    """
    Celery task to process a single report asynchronously
    """
    db = SessionLocal()
    try:
        # Get the report
        report = db.query(StructuredReport).filter(StructuredReport.id == report_id).first()
        if not report:
            return {"error": "Report not found"}
        
        # Update status
        report.status = "processing"
        db.commit()
        
        # Get template
        template = db.query(Template).filter(Template.id == report.template_id).first()
        if not template:
            report.status = "failed"
            report.error_message = "Template not found"
            db.commit()
            return {"error": "Template not found"}
        
        # Process with AI
        try:
            # Run async function in sync context
            result = asyncio.run(
                ai_service.structure_report(
                    report.original_text,
                    template.structure
                )
            )
            
            report.structured_data = result["structured_data"]
            report.confidence_score = result["confidence_score"]
            report.status = "completed"
            
        except Exception as e:
            report.status = "failed"
            report.error_message = str(e)
        
        db.commit()
        
        # Update batch progress
        update_batch_progress(db, report.batch_id)
        
        return {"report_id": report_id, "status": report.status}
        
    except Exception as e:
        db.rollback()
        return {"error": str(e)}
    finally:
        db.close()


def update_batch_progress(db: Session, batch_id: int):
    """Update batch completion status"""
    batch = db.query(ReportBatch).filter(ReportBatch.id == batch_id).first()
    if not batch:
        return
    
    # Count processed reports
    processed = db.query(StructuredReport).filter(
        StructuredReport.batch_id == batch_id,
        StructuredReport.status.in_(["completed", "failed"])
    ).count()
    
    batch.processed_reports = processed
    
    # Update batch status
    if processed >= batch.total_reports:
        batch.status = "completed"
        from datetime import datetime
        batch.completed_at = datetime.utcnow()
    else:
        batch.status = "processing"
    
    db.commit()
