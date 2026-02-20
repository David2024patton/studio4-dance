"""AI chat routes with Gemini integration"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional
from datetime import datetime
import uuid

from app.database import get_db
from app.models.models import User, ChatLog, Parent, Account, Transaction, Student, Enrollment, Event, DanceClass
from app.schemas.schemas import ChatMessage, ChatResponse
from app.auth import get_current_active_user, get_current_user
from app.services.gemini_service import gemini_service

router = APIRouter(prefix="/chat", tags=["chat"])

@router.post("/", response_model=ChatResponse)
async def chat(
    message_data: ChatMessage,
    current_user: Optional[User] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Chat with AI assistant (public or authenticated)"""
    is_authenticated = current_user is not None
    session_id = message_data.session_id or str(uuid.uuid4())
    user_message = message_data.message
    
    try:
        # Build context based on user role
        context = ""
        if is_authenticated:
            context = await build_user_context(current_user, db)
        else:
            context = await build_public_context(db)
        
        # Create system prompt
        system_prompt = f"""You are a helpful assistant for Studio4 Dance Company.
You help parents, students, and visitors with questions about classes, events, billing, and general information.

{context}

Be friendly, professional, and concise. If you don't know specific details, suggest contacting the studio directly.
"""
        
        # Get response from Gemini
        ai_response = await gemini_service.generate_response(
            user_message=user_message,
            system_prompt=system_prompt,
            session_id=session_id
        )
        
        # Log the conversation
        chat_log = ChatLog(
            user_id=current_user.id if current_user else None,
            session_id=session_id,
            message=user_message,
            response=ai_response,
            is_authenticated=is_authenticated
        )
        db.add(chat_log)
        await db.commit()
        
        return ChatResponse(
            success=True,
            response=ai_response,
            session_id=session_id
        )
        
    except Exception as e:
        return ChatResponse(
            success=False,
            error=str(e),
            session_id=session_id
        )


async def build_user_context(user: User, db: AsyncSession) -> str:
    """Build context for authenticated user based on their role"""
    context_parts = [f"User: {user.first_name} {user.last_name} ({user.role})"]
    
    if user.role == "parent":
        # Get parent's students, enrollments, balance, upcoming events
        result = await db.execute(
            select(Parent).where(Parent.user_id == user.id)
        )
        parent = result.scalar_one_or_none()
        
        if parent:
            # Get students
            students_result = await db.execute(
                select(Student).where(Student.parent_id == parent.id)
            )
            students = students_result.scalars().all()
            
            if students:
                context_parts.append("\nStudents:")
                for student in students:
                    context_parts.append(f"- {student.first_name} {student.last_name}")
                
                # Get enrollments
                enrollments_result = await db.execute(
                    select(Enrollment, DanceClass)
                    .join(DanceClass, Enrollment.class_id == DanceClass.id)
                    .where(Enrollment.student_id.in_([s.id for s in students]))
                    .where(Enrollment.status == "active")
                )
                enrollments = enrollments_result.all()
                
                if enrollments:
                    context_parts.append("\nEnrolled Classes:")
                    for enrollment, dance_class in enrollments:
                        context_parts.append(f"- {dance_class.name} ({dance_class.day_of_week} at {dance_class.start_time})")
            
            # Get account balance
            account_result = await db.execute(
                select(Account).where(Account.parent_id == parent.id)
            )
            account = account_result.scalar_one_or_none()
            
            if account:
                balance_status = "owes" if account.current_balance > 0 else "has credit" if account.current_balance < 0 else "is balanced"
                context_parts.append(f"\nAccount Balance: ${abs(float(account.current_balance)):.2f} ({balance_status})")
    
    elif user.role in ["owner", "admin", "finance", "instructor"]:
        context_parts.append("\nStaff member with access to studio information.")
    
    # Get upcoming events for all users
    events_result = await db.execute(
        select(Event)
        .where(Event.is_active == True)
        .where(Event.start_date >= datetime.now().date())
        .order_by(Event.start_date)
        .limit(5)
    )
    events = events_result.scalars().all()
    
    if events:
        context_parts.append("\nUpcoming Events:")
        for event in events:
            context_parts.append(f"- {event.title} on {event.start_date}")
    
    return "\n".join(context_parts)


async def build_public_context(db: AsyncSession) -> str:
    """Build context for public/unauthenticated users"""
    context_parts = ["Public visitor"]
    
    # Get upcoming events
    events_result = await db.execute(
        select(Event)
        .where(Event.is_active == True)
        .where(Event.start_date >= datetime.now().date())
        .order_by(Event.start_date)
        .limit(5)
    )
    events = events_result.scalars().all()
    
    if events:
        context_parts.append("\nUpcoming Events:")
        for event in events:
            context_parts.append(f"- {event.title} on {event.start_date}")
    
    # Get class schedule overview
    classes_result = await db.execute(
        select(DanceClass)
        .where(DanceClass.is_active == True)
        .limit(10)
    )
    classes = classes_result.scalars().all()
    
    if classes:
        context_parts.append("\nAvailable Classes:")
        for dance_class in classes:
            context_parts.append(f"- {dance_class.name} - ${dance_class.monthly_tuition}/month")
    
    return "\n".join(context_parts)


@router.get("/history")
async def get_chat_history(
    session_id: Optional[str] = None,
    limit: int = 20,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Get chat history for authenticated user"""
    query = select(ChatLog).where(ChatLog.user_id == current_user.id)
    
    if session_id:
        query = query.where(ChatLog.session_id == session_id)
    
    query = query.order_by(ChatLog.created_at.desc()).limit(limit)
    
    result = await db.execute(query)
    logs = result.scalars().all()
    
    return [
        {
            "id": str(log.id),
            "session_id": str(log.session_id),
            "message": log.message,
            "response": log.response,
            "created_at": log.created_at.isoformat()
        }
        for log in logs
    ]


@router.delete("/history")
async def clear_chat_history(
    session_id: Optional[str] = None,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Clear chat history for authenticated user"""
    from sqlalchemy import delete
    
    query = delete(ChatLog).where(ChatLog.user_id == current_user.id)
    
    if session_id:
        query = query.where(ChatLog.session_id == session_id)
    
    await db.execute(query)
    await db.commit()
    
    return {"message": "Chat history cleared"}
