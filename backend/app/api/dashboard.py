"""Parent dashboard routes - aggregate data for logged-in parent"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_
from typing import List
from datetime import date, datetime

from app.database import get_db
from app.models.models import (
    User, Parent, Student, Enrollment, DanceClass, 
    Account, Transaction, Event, EventParticipant, DanceStyle, ClassLevel
)
from app.schemas.schemas import DashboardResponse, StudentResponse, EventResponse, AccountResponse, TransactionResponse
from app.auth import get_current_active_user

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/parent", response_model=dict)
async def get_parent_dashboard(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Get comprehensive dashboard data for logged-in parent"""
    # Verify user is a parent
    if current_user.role != "parent":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Dashboard only available for parent accounts"
        )
    
    # Get parent profile
    parent_result = await db.execute(
        select(Parent).where(Parent.user_id == current_user.id)
    )
    parent = parent_result.scalar_one_or_none()
    
    if not parent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Parent profile not found"
        )
    
    # Get students
    students_result = await db.execute(
        select(Student).where(Student.parent_id == parent.id)
    )
    students = students_result.scalars().all()
    
    # Get account and balance
    account_result = await db.execute(
        select(Account).where(Account.parent_id == parent.id)
    )
    account = account_result.scalar_one_or_none()
    
    balance_info = None
    if account:
        balance_status = "owes" if account.current_balance > 0 else "has credit" if account.current_balance < 0 else "balanced"
        balance_info = {
            "id": str(account.id),
            "current_balance": float(account.current_balance),
            "status": balance_status,
            "updated_at": account.updated_at.isoformat()
        }
    
    # Get recent transactions
    transactions = []
    if account:
        transactions_result = await db.execute(
            select(Transaction)
            .where(Transaction.account_id == account.id)
            .order_by(Transaction.created_at.desc())
            .limit(10)
        )
        transactions_data = transactions_result.scalars().all()
        
        for t in transactions_data:
            transactions.append({
                "id": str(t.id),
                "amount": float(t.amount),
                "transaction_type": t.transaction_type,
                "description": t.description,
                "status": t.status,
                "created_at": t.created_at.isoformat()
            })
    
    # Get enrollments with class details
    enrollments = []
    if students:
        student_ids = [s.id for s in students]
        enrollments_result = await db.execute(
            select(Enrollment, DanceClass, DanceStyle, ClassLevel)
            .join(DanceClass, Enrollment.class_id == DanceClass.id)
            .outerjoin(DanceStyle, DanceClass.style_id == DanceStyle.id)
            .outerjoin(ClassLevel, DanceClass.level_id == ClassLevel.id)
            .where(
                and_(
                    Enrollment.student_id.in_(student_ids),
                    Enrollment.status == "active"
                )
            )
        )
        enrollments_data = enrollments_result.all()
        
        for enrollment, dance_class, style, level in enrollments_data:
            # Find student name
            student_name = next(
                (f"{s.first_name} {s.last_name}" for s in students if s.id == enrollment.student_id),
                "Unknown"
            )
            
            enrollments.append({
                "id": str(enrollment.id),
                "student_name": student_name,
                "class_name": dance_class.name,
                "style": style.name if style else None,
                "level": level.name if level else None,
                "day_of_week": dance_class.day_of_week,
                "start_time": str(dance_class.start_time),
                "end_time": str(dance_class.end_time),
                "studio_room": dance_class.studio_room,
                "instructor_id": str(dance_class.instructor_id),
                "monthly_tuition": float(dance_class.monthly_tuition),
                "enrollment_date": enrollment.enrollment_date.isoformat() if enrollment.enrollment_date else None
            })
    
    # Get upcoming events
    events_result = await db.execute(
        select(Event)
        .where(
            and_(
                Event.is_active == True,
                Event.start_date >= date.today()
            )
        )
        .order_by(Event.start_date)
        .limit(10)
    )
    events_data = events_result.scalars().all()
    
    events = []
    for event in events_data:
        # Check if any of parent's students are registered
        is_registered = False
        if students:
            student_ids = [s.id for s in students]
            participant_result = await db.execute(
                select(EventParticipant).where(
                    and_(
                        EventParticipant.event_id == event.id,
                        EventParticipant.student_id.in_(student_ids)
                    )
                )
            is_registered = participant_result.scalar_one_or_none() is not None
        
        events.append({
            "id": str(event.id),
            "title": event.title,
            "event_type": event.event_type,
            "location": event.location,
            "start_date": event.start_date.isoformat() if event.start_date else None,
            "end_date": event.end_date.isoformat() if event.end_date else None,
            "registration_deadline": event.registration_deadline.isoformat() if event.registration_deadline else None,
            "entry_fee": float(event.entry_fee) if event.entry_fee else None,
            "is_registered": is_registered
        })
    
    # Compile dashboard data
    dashboard_data = {
        "user": {
            "id": str(current_user.id),
            "email": current_user.email,
            "first_name": current_user.first_name,
            "last_name": current_user.last_name,
            "role": current_user.role,
            "phone": current_user.phone
        },
        "parent": {
            "id": str(parent.id),
            "emergency_contact_name": parent.emergency_contact_name,
            "emergency_contact_phone": parent.emergency_contact_phone,
            "address_line1": parent.address_line1,
            "city": parent.city,
            "state": parent.state,
            "zip_code": parent.zip_code
        },
        "students": [
            {
                "id": str(s.id),
                "first_name": s.first_name,
                "last_name": s.last_name,
                "date_of_birth": s.date_of_birth.isoformat() if s.date_of_birth else None,
                "school_grade": s.school_grade,
                "is_active": s.is_active
            }
            for s in students
        ],
        "account": balance_info,
        "transactions": transactions,
        "enrollments": enrollments,
        "upcoming_events": events,
        "summary": {
            "total_students": len(students),
            "active_enrollments": len(enrollments),
            "upcoming_events_count": len(events),
            "recent_transactions_count": len(transactions)
        }
    }
    
    return dashboard_data


@router.get("/student/{student_id}")
async def get_student_details(
    student_id: str,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Get detailed information for a specific student"""
    # Verify user is a parent and student belongs to them
    parent_result = await db.execute(
        select(Parent).where(Parent.user_id == current_user.id)
    )
    parent = parent_result.scalar_one_or_none()
    
    if not parent:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only parents can access student details"
        )
    
    # Get student
    student_result = await db.execute(
        select(Student).where(
            and_(Student.id == student_id, Student.parent_id == parent.id)
        )
    )
    student = student_result.scalar_one_or_none()
    
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found or not authorized"
        )
    
    # Get enrollments
    enrollments_result = await db.execute(
        select(Enrollment, DanceClass)
        .join(DanceClass, Enrollment.class_id == DanceClass.id)
        .where(
            and_(
                Enrollment.student_id == student_id,
                Enrollment.status == "active"
            )
        )
    )
    enrollments_data = enrollments_result.all()
    
    enrollments_list = []
    for enrollment, dance_class in enrollments_data:
        enrollments_list.append({
            "id": str(enrollment.id),
            "class_name": dance_class.name,
            "day_of_week": dance_class.day_of_week,
            "start_time": str(dance_class.start_time),
            "end_time": str(dance_class.end_time),
            "studio_room": dance_class.studio_room,
            "monthly_tuition": float(dance_class.monthly_tuition),
            "enrollment_date": enrollment.enrollment_date.isoformat() if enrollment.enrollment_date else None
        })
    
    # Get event registrations
    events_result = await db.execute(
        select(EventParticipant, Event)
        .join(Event, EventParticipant.event_id == Event.id)
        .where(EventParticipant.student_id == student_id)
        .order_by(Event.start_date.desc())
    )
    events_data = events_result.all()
    
    events_list = []
    for participant, event in events_data:
        events_list.append({
            "id": str(participant.id),
            "event_title": event.title,
            "event_type": event.event_type,
            "start_date": event.start_date.isoformat() if event.start_date else None,
            "location": event.location,
            "registration_date": participant.registration_date.isoformat() if participant.registration_date else None,
            "fee_paid": participant.fee_paid
        })
    
    return {
        "student": {
            "id": str(student.id),
            "first_name": student.first_name,
            "last_name": student.last_name,
            "date_of_birth": student.date_of_birth.isoformat() if student.date_of_birth else None,
            "gender": student.gender,
            "school_grade": student.school_grade,
            "medical_notes": student.medical_notes,
            "photo_release": student.photo_release,
            "is_active": student.is_active,
            "created_at": student.created_at.isoformat()
        },
        "enrollments": enrollments_list,
        "events": events_list,
        "total_active_enrollments": len(enrollments_list),
        "total_events": len(events_list)
    }


@router.get("/announcements")
async def get_announcements(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Get announcements for the current user"""
    from app.models.models import Announcement
    
    query = select(Announcement).where(
        and_(
            Announcement.is_active == True,
            or_(
                Announcement.target_roles.is_(None),
                Announcement.target_roles.contains([current_user.role]),
                Announcement.target_roles == []
            ),
            or_(
                Announcement.expire_date.is_(None),
                Announcement.expire_date >= date.today()
            )
        )
    ).order_by(Announcement.is_pinned.desc(), Announcement.publish_date.desc())
    
    result = await db.execute(query)
    announcements = result.scalars().all()
    
    return [
        {
            "id": str(a.id),
            "title": a.title,
            "content": a.content,
            "is_pinned": a.is_pinned,
            "publish_date": a.publish_date.isoformat() if a.publish_date else None
        }
        for a in announcements
    ]
