"""Pydantic schemas for API validation"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime, date, time
from uuid import UUID

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    first_name: str = Field(..., min_length=1, max_length=100)
    last_name: str = Field(..., min_length=1, max_length=100)
    phone: Optional[str] = None

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)
    role: str = "parent"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: UUID
    role: str
    is_active: bool
    email_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

# Parent Schemas
class ParentBase(BaseModel):
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    address_line1: Optional[str] = None
    address_line2: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None

class ParentCreate(ParentBase):
    pass

class ParentResponse(ParentBase):
    id: UUID
    user_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

# Student Schemas
class StudentBase(BaseModel):
    first_name: str
    last_name: str
    date_of_birth: Optional[date] = None
    gender: Optional[str] = None
    school_grade: Optional[str] = None
    medical_notes: Optional[str] = None
    photo_release: bool = False

class StudentCreate(StudentBase):
    pass

class StudentResponse(StudentBase):
    id: UUID
    parent_id: UUID
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Class Schemas
class DanceClassBase(BaseModel):
    name: str
    description: Optional[str] = None
    day_of_week: Optional[int] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    studio_room: Optional[str] = None
    max_capacity: int = 20
    monthly_tuition: float = 0.00

class DanceClassCreate(DanceClassBase):
    style_id: Optional[UUID] = None
    level_id: Optional[UUID] = None
    instructor_id: Optional[UUID] = None

class DanceClassResponse(DanceClassBase):
    id: UUID
    style_id: Optional[UUID]
    level_id: Optional[UUID]
    instructor_id: Optional[UUID]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Event Schemas
class EventBase(BaseModel):
    title: str
    description: Optional[str] = None
    event_type: Optional[str] = None
    location: Optional[str] = None
    venue_address: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    registration_deadline: Optional[date] = None
    entry_fee: Optional[float] = None
    notes: Optional[str] = None

class EventCreate(EventBase):
    pass

class EventResponse(EventBase):
    id: UUID
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Transaction Schemas
class TransactionBase(BaseModel):
    amount: float
    transaction_type: str
    description: Optional[str] = None
    payment_method: Optional[str] = None
    due_date: Optional[date] = None

class TransactionCreate(TransactionBase):
    account_id: UUID
    student_id: Optional[UUID] = None

class TransactionResponse(TransactionBase):
    id: UUID
    account_id: UUID
    student_id: Optional[UUID]
    status: str
    paid_date: Optional[date]
    created_at: datetime

    class Config:
        from_attributes = True

# Account/Balance Schemas
class AccountResponse(BaseModel):
    id: UUID
    parent_id: UUID
    current_balance: float
    updated_at: datetime

    class Config:
        from_attributes = True

class DashboardResponse(BaseModel):
    """Parent dashboard response with all relevant data"""
    user: UserResponse
    parent: Optional[ParentResponse]
    students: List[StudentResponse]
    account: Optional[AccountResponse]
    transactions: List[TransactionResponse]
    upcoming_events: List[EventResponse]
    enrollments: List[dict]

# Chat Schemas
class ChatMessage(BaseModel):
    message: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    success: bool
    response: Optional[str] = None
    error: Optional[str] = None
    session_id: str
