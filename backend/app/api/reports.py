from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List
import os
from datetime import datetime
from app.core.database import get_db
from app.core.config import settings
from app.models.models import ReportBatch, StructuredReport, Template
from app.schemas.schemas import ReportBatchCreate, ReportBatchResponse, StructuredReportResponse
from app.tasks.report_tasks import process_report_task

router = APIRouter(prefix="/reports", tags=["reports"])


@router.post("/batches", response_model=ReportBatchResponse, status_code=201)
async def create_batch(
    name: str = Form(...),
    template_id: int = Form(...),
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db)
):
    """
    Create a new batch and upload multiple report files for processing
    """
    # Validate template exists
    template = db.query(Template).filter(Template.id == template_id).first()
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    
    # Create batch
    batch = ReportBatch(
        name=name,
        template_id=template_id,
        total_reports=len(files),
        status="pending"
    )
    db.add(batch)
    db.commit()
    db.refresh(batch)
    
    # Create upload directory if it doesn't exist
    upload_dir = os.path.join(settings.UPLOAD_DIR, str(batch.id))
    os.makedirs(upload_dir, exist_ok=True)
    
    # Process each file
    for file in files:
        # Validate file extension
        file_ext = os.path.splitext(file.filename)[1].lower()
        if file_ext not in settings.ALLOWED_EXTENSIONS:
            continue
        
        # Read file content
        content = await file.read()
        
        # For text files, decode directly
        if file_ext == ".txt":
            text_content = content.decode("utf-8")
        else:
            # For other formats (PDF, DOC), you'd need additional processing
            # For now, we'll just store as text (you can add PDF/DOC parsers)
            text_content = content.decode("utf-8", errors="ignore")
        
        # Save file
        file_path = os.path.join(upload_dir, file.filename)
        with open(file_path, "wb") as f:
            f.write(content)
        
        # Create report record
        report = StructuredReport(
            batch_id=batch.id,
            template_id=template_id,
            original_text=text_content,
            filename=file.filename,
            status="pending"
        )
        db.add(report)
        db.commit()
        db.refresh(report)
        
        # Queue processing task
        process_report_task.delay(report.id)
    
    return batch


@router.get("/batches", response_model=List[ReportBatchResponse])
def get_batches(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all report batches"""
    batches = db.query(ReportBatch).offset(skip).limit(limit).all()
    return batches


@router.get("/batches/{batch_id}", response_model=ReportBatchResponse)
def get_batch(batch_id: int, db: Session = Depends(get_db)):
    """Get a specific batch by ID"""
    batch = db.query(ReportBatch).filter(ReportBatch.id == batch_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")
    return batch


@router.get("/batches/{batch_id}/reports", response_model=List[StructuredReportResponse])
def get_batch_reports(batch_id: int, db: Session = Depends(get_db)):
    """Get all reports in a batch"""
    reports = db.query(StructuredReport).filter(
        StructuredReport.batch_id == batch_id
    ).all()
    return reports


@router.get("/{report_id}", response_model=StructuredReportResponse)
def get_report(report_id: int, db: Session = Depends(get_db)):
    """Get a specific structured report"""
    report = db.query(StructuredReport).filter(
        StructuredReport.id == report_id
    ).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report
