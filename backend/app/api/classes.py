"""Dance class routes"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_
from typing import List, Optional
from datetime import date

from app.database import get_db
from app.models.models import (
    DanceClass, DanceStyle, ClassLevel, Instructor,
    Enrollment, Student, Parent, User
)
from app.schemas.schemas import DanceClassResponse, DanceClassCreate
from app.auth import get_current_active_user, check_role

router = APIRouter(prefix="/classes", tags=["classes"])

@router.get("/", response_model=List[DanceClassResponse])
async def list_classes(
    style_id: Optional[str] = None,
    level_id: Optional[str] = None,
    day_of_week: Optional[int] = None,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """List all active dance classes with optional filters"""
    query = select(DanceClass).where(DanceClass.is_active == True)
    
    if style_id:
        query = query.where(DanceClass.style_id == style_id)
    if level_id:
        query = query.where(DanceClass.level_id == level_id)
    if day_of_week is not None:
        query = query.where(DanceClass.day_of_week == day_of_week)
    
    query = query.order_by(DanceClass.day_of_week, DanceClass.start_time)
    
    result = await db.execute(query)
    classes = result.scalars().all()
    return classes

@router.get("/{class_id}", response_model=DanceClassResponse)
async def get_class(
    class_id: str,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Get specific class details"""
    result = await db.execute(
        select(DanceClass).where(DanceClass.id == class_id)
    )
    dance_class = result.scalar_one_or_none()
    
    if not dance_class:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Class not found"
        )
    
    return dance_class

@router.post("/{class_id}/enroll/{student_id}", status_code=status.HTTP_201_CREATED)
async def enroll_student(
    class_id: str,
    student_id: str,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Enroll a student in a class (parent or admin)"""
    # Verify student exists and belongs to parent (if user is parent)
    result = await db.execute(select(Student).where(Student.id == student_id))
    student = result.scalar_one_or_none()
    
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )
    
    # Check authorization - parents can only enroll their own students
    if current_user.role == "parent":
        parent_result = await db.execute(
            select(Parent).where(Parent.user_id == current_user.id)
        )
        parent = parent_result.scalar_one_or_none()
        
        if not parent or student.parent_id != parent.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to enroll this student"
            )
    
    # Verify class exists
    class_result = await db.execute(
        select(DanceClass).where(DanceClass.id == class_id)
    )
    dance_class = class_result.scalar_one_or_none()
    
    if not dance_class:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Class not found"
        )
    
    # Check if already enrolled
    existing_enrollment = await db.execute(
        select(Enrollment).where(
            and_(
                Enrollment.student_id == student_id,
                Enrollment.class_id == class_id,
                Enrollment.status == "active"
            )
        )
    )
    if existing_enrollment.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Student already enrolled in this class"
        )
    
    # Check class capacity
    active_enrollments = await db.execute(
        select(Enrollment).where(
            and_(
                Enrollment.class_id == class_id,
                Enrollment.status == "active"
            )
        )
    )
    enrollment_count = len(active_enrollments.scalars().all())
    
    if enrollment_count >= dance_class.max_capacity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Class is at maximum capacity"
        )
    
    # Create enrollment
    new_enrollment = Enrollment(
        student_id=student_id,
        class_id=class_id,
        enrollment_date=date.today(),
        status="active"
    )
    
    db.add(new_enrollment)
    await db.commit()
    
    return {"message": "Student enrolled successfully"}

@router.delete("/{class_id}/enroll/{student_id}", status_code=status.HTTP_204_NO_CONTENT)
async def drop_class(
    class_id: str,
    student_id: str,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Drop a student from a class (parent or admin)"""
    # Get student
    result = await db.execute(select(Student).where(Student.id == student_id))
    student = result.scalar_one_or_none()
    
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )
    
    # Check authorization
    if current_user.role == "parent":
        parent_result = await db.execute(
            select(Parent).where(Parent.user_id == current_user.id)
        )
        parent = parent_result.scalar_one_or_none()
        
        if not parent or student.parent_id != parent.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to drop this student"
            )
    
    # Get enrollment
    enrollment_result = await db.execute(
        select(Enrollment).where(
            and_(
                Enrollment.student_id == student_id,
                Enrollment.class_id == class_id,
                Enrollment.status == "active"
            )
        )
    )
    enrollment = enrollment_result.scalar_one_or_none()
    
    if not enrollment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Active enrollment not found"
        )
    
    # Update enrollment status
    enrollment.status = "dropped"
    enrollment.drop_date = date.today()
    
    await db.commit()

@router.get("/schedule", response_model=List[dict])
async def get_schedule(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Get class schedule (public view)"""
    query = (
        select(DanceClass, DanceStyle, ClassLevel, Instructor, User)
        .join(DanceStyle, DanceClass.style_id == DanceStyle.id, isouter=True)
        .join(ClassLevel, DanceClass.level_id == ClassLevel.id, isouter=True)
        .join(Instructor, DanceClass.instructor_id == Instructor.id, isouter=True)
        .join(User, Instructor.user_id == User.id, isouter=True)
        .where(DanceClass.is_active == True)
        .order_by(DanceClass.day_of_week, DanceClass.start_time)
    )
    
    result = await db.execute(query)
    rows = result.all()
    
    schedule = []
    for dance_class, style, level, instructor, user in rows:
        schedule.append({
            "id": str(dance_class.id),
            "name": dance_class.name,
            "description": dance_class.description,
            "style": style.name if style else None,
            "level": level.name if level else None,
            "instructor": f"{user.first_name} {user.last_name}" if user else None,
            "day_of_week": dance_class.day_of_week,
            "start_time": str(dance_class.start_time),
            "end_time": str(dance_class.end_time),
            "studio_room": dance_class.studio_room,
            "monthly_tuition": float(dance_class.monthly_tuition),
            "max_capacity": dance_class.max_capacity
        })
    
    return schedule
