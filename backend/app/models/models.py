from sqlalchemy import Column, Integer, String, Text, DateTime, JSON, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    templates = relationship("Template", back_populates="owner")
    batches = relationship("ReportBatch", back_populates="owner")


class Template(Base):
    __tablename__ = "templates"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    template_type = Column(String)  # e.g., "chest_xray", "ct_brain", "custom"
    structure = Column(JSON, nullable=False)  # JSON schema defining the template fields
    is_public = Column(Boolean, default=False)  # Pre-built templates are public
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    owner = relationship("User", back_populates="templates")
    reports = relationship("StructuredReport", back_populates="template")


class ReportBatch(Base):
    __tablename__ = "report_batches"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    status = Column(String, default="pending")  # pending, processing, completed, failed
    total_reports = Column(Integer, default=0)
    processed_reports = Column(Integer, default=0)
    owner_id = Column(Integer, ForeignKey("users.id"))
    template_id = Column(Integer, ForeignKey("templates.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)
    
    owner = relationship("User", back_populates="batches")
    reports = relationship("StructuredReport", back_populates="batch")


class StructuredReport(Base):
    __tablename__ = "structured_reports"
    
    id = Column(Integer, primary_key=True, index=True)
    batch_id = Column(Integer, ForeignKey("report_batches.id"))
    template_id = Column(Integer, ForeignKey("templates.id"))
    original_text = Column(Text, nullable=False)
    structured_data = Column(JSON)  # Extracted structured data
    confidence_score = Column(Integer)  # 0-100
    status = Column(String, default="pending")  # pending, processing, completed, failed
    error_message = Column(Text, nullable=True)
    filename = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    processed_at = Column(DateTime(timezone=True), nullable=True)
    
    batch = relationship("ReportBatch", back_populates="reports")
    template = relationship("Template", back_populates="reports")
