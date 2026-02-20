"""Events and competitions routes"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from typing import List, Optional
from datetime import date, datetime

from app.database import get_db
from app.models.models import Event, EventParticipant, Student, Parent, User
from app.schemas.schemas import EventResponse, EventCreate
from app.auth import get_current_active_user, check_role

router = APIRouter(prefix="/events", tags=["events"])

@router.get("/", response_model=List[EventResponse])
async def list_events(
    event_type: Optional[str] = None,
    upcoming_only: bool = False,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """List all events with optional filters"""
    query = select(Event).where(Event.is_active == True)
    
    if event_type:
        query = query.where(Event.event_type == event_type)
    
    if upcoming_only:
        query = query.where(Event.start_date >= date.today())
    
    query = query.order_by(Event.start_date)
    
    result = await db.execute(query)
    events = result.scalars().all()
    return events

@router.get("/{event_id}", response_model=EventResponse)
async def get_event(
    event_id: str,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Get specific event details"""
    result = await db.execute(select(Event).where(Event.id == event_id))
    event = result.scalar_one_or_none()
    
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    
    return event

@router.post("/{event_id}/register/{student_id}", status_code=status.HTTP_201_CREATED)
async def register_for_event(
    event_id: str,
    student_id: str,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Register a student for an event (parent or admin)"""
    # Verify student exists
    result = await db.execute(select(Student).where(Student.id == student_id))
    student = result.scalar_one_or_none()
    
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )
    
    # Check authorization - parents can only register their own students
    if current_user.role == "parent":
        parent_result = await db.execute(
            select(Parent).where(Parent.user_id == current_user.id)
        )
        parent = parent_result.scalar_one_or_none()
        
        if not parent or student.parent_id != parent.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to register this student"
            )
    
    # Verify event exists
    event_result = await db.execute(
        select(Event).where(Event.id == event_id)
    )
    event = event_result.scalar_one_or_none()
    
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    
    # Check if registration is still open
    if event.registration_deadline and date.today() > event.registration_deadline:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Registration deadline has passed"
        )
    
    # Check if already registered
    existing_participant = await db.execute(
        select(EventParticipant).where(
            and_(
                EventParticipant.event_id == event_id,
                EventParticipant.student_id == student_id
            )
        )
    )
    if existing_participant.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Student already registered for this event"
        )
    
    # Create registration
    new_participant = EventParticipant(
        event_id=event_id,
        student_id=student_id,
        registration_date=date.today(),
        fee_paid=False
    )
    
    db.add(new_participant)
    await db.commit()
    
    return {"message": "Student registered for event successfully"}

@router.get("/{event_id}/participants", response_model=List[dict])
async def get_event_participants(
    event_id: str,
    current_user: User = Depends(check_role(["owner", "admin", "instructor", "finance"])),
    db: AsyncSession = Depends(get_db)
):
    """Get all participants for an event (staff only)"""
    # Verify event exists
    event_result = await db.execute(select(Event).where(Event.id == event_id))
    event = event_result.scalar_one_or_none()
    
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    
    # Get participants with student info
    query = (
        select(EventParticipant, Student, Parent, User)
        .join(Student, EventParticipant.student_id == Student.id)
        .join(Parent, Student.parent_id == Parent.id)
        .join(User, Parent.user_id == User.id)
        .where(EventParticipant.event_id == event_id)
        .order_by(Student.last_name, Student.first_name)
    )
    
    result = await db.execute(query)
    rows = result.all()
    
    participants = []
    for participant, student, parent, user in rows:
        participants.append({
            "participant_id": str(participant.id),
            "student_id": str(student.id),
            "student_name": f"{student.first_name} {student.last_name}",
            "parent_name": f"{user.first_name} {user.last_name}",
            "parent_email": user.email,
            "registration_date": participant.registration_date.isoformat(),
            "fee_paid": participant.fee_paid,
            "notes": participant.notes
        })
    
    return participants

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_event(
    event: EventCreate,
    current_user: User = Depends(check_role(["owner", "admin"])),
    db: AsyncSession = Depends(get_db)
):
    """Create a new event (owner/admin only)"""
    new_event = Event(**event.dict())
    db.add(new_event)
    await db.commit()
    await db.refresh(new_event)
    
    return {"id": str(new_event.id), "message": "Event created successfully"}

@router.put("/{event_id}", response_model=EventResponse)
async def update_event(
    event_id: str,
    event_update: EventCreate,
    current_user: User = Depends(check_role(["owner", "admin"])),
    db: AsyncSession = Depends(get_db)
):
    """Update an event (owner/admin only)"""
    result = await db.execute(select(Event).where(Event.id == event_id))
    event = result.scalar_one_or_none()
    
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    
    update_data = event_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(event, key, value)
    
    await db.commit()
    await db.refresh(event)
    
    return event

@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_event(
    event_id: str,
    current_user: User = Depends(check_role(["owner"])),
    db: AsyncSession = Depends(get_db)
):
    """Delete an event (owner only - soft delete)"""
    result = await db.execute(select(Event).where(Event.id == event_id))
    event = result.scalar_one_or_none()
    
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    
    event.is_active = False
    await db.commit()
