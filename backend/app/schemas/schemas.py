from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Dict, Any, List
from datetime import datetime


# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


# Template Schemas
class TemplateBase(BaseModel):
    name: str
    description: Optional[str] = None
    template_type: str
    structure: Dict[str, Any]  # JSON structure defining fields
    is_public: bool = False


class TemplateCreate(TemplateBase):
    pass


class TemplateUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    structure: Optional[Dict[str, Any]] = None


class TemplateResponse(TemplateBase):
    id: int
    owner_id: Optional[int]
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True


# Report Batch Schemas
class ReportBatchCreate(BaseModel):
    name: str
    template_id: int


class ReportBatchResponse(BaseModel):
    id: int
    name: str
    status: str
    total_reports: int
    processed_reports: int
    template_id: int
    created_at: datetime
    completed_at: Optional[datetime]
    
    class Config:
        from_attributes = True


# Structured Report Schemas
class StructuredReportResponse(BaseModel):
    id: int
    batch_id: int
    template_id: int
    original_text: str
    structured_data: Optional[Dict[str, Any]]
    confidence_score: Optional[int]
    status: str
    error_message: Optional[str]
    filename: Optional[str]
    created_at: datetime
    processed_at: Optional[datetime]
    
    class Config:
        from_attributes = True


# Auth Schemas
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None
