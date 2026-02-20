"""Billing and account routes"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, func, case
from typing import List, Optional
from datetime import date, datetime
from decimal import Decimal

from app.database import get_db
from app.models.models import Account, Transaction, Parent, User, Student
from app.schemas.schemas import AccountResponse, TransactionResponse, TransactionCreate
from app.auth import get_current_active_user, check_role

router = APIRouter(prefix="/billing", tags=["billing"])

@router.get("/account", response_model=AccountResponse)
async def get_account(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Get current parent account balance (parent or staff)"""
    if current_user.role == "parent":
        # Get parent's account
        result = await db.execute(
            select(Parent).where(Parent.user_id == current_user.id)
        )
        parent = result.scalar_one_or_none()
        
        if not parent:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Parent profile not found"
            )
        
        result = await db.execute(
            select(Account).where(Account.parent_id == parent.id)
        )
        account = result.scalar_one_or_none()
        
        if not account:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Account not found"
            )
        
        return account
    else:
        # Staff must provide parent_id
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Parent ID required for staff users"
        )

@router.get("/account/{parent_id}", response_model=AccountResponse)
async def get_account_by_parent(
    parent_id: str,
    current_user: User = Depends(check_role(["owner", "admin", "finance"])),
    db: AsyncSession = Depends(get_db)
):
    """Get account by parent ID (staff only)"""
    result = await db.execute(
        select(Account).where(Account.parent_id == parent_id)
    )
    account = result.scalar_one_or_none()
    
    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found"
        )
    
    return account

@router.get("/transactions", response_model=List[TransactionResponse])
async def get_transactions(
    skip: int = 0,
    limit: int = 100,
    transaction_type: Optional[str] = None,
    status_filter: Optional[str] = None,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Get transactions for current parent or all (staff)"""
    query = select(Transaction)
    
    if current_user.role == "parent":
        # Get parent's account
        result = await db.execute(
            select(Parent).where(Parent.user_id == current_user.id)
        )
        parent = result.scalar_one_or_none()
        
        if not parent:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Parent profile not found"
            )
        
        result = await db.execute(
            select(Account).where(Account.parent_id == parent.id)
        )
        account = result.scalar_one_or_none()
        
        if not account:
            return []
        
        query = query.where(Transaction.account_id == account.id)
    
    if transaction_type:
        query = query.where(Transaction.transaction_type == transaction_type)
    
    if status_filter:
        query = query.where(Transaction.status == status_filter)
    
    query = query.order_by(Transaction.created_at.desc()).offset(skip).limit(limit)
    
    result = await db.execute(query)
    transactions = result.scalars().all()
    return transactions

@router.get("/transactions/{account_id}", response_model=List[TransactionResponse])
async def get_transactions_by_account(
    account_id: str,
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(check_role(["owner", "admin", "finance"])),
    db: AsyncSession = Depends(get_db)
):
    """Get transactions by account ID (staff only)"""
    result = await db.execute(
        select(Transaction)
        .where(Transaction.account_id == account_id)
        .order_by(Transaction.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    transactions = result.scalars().all()
    return transactions

@router.post("/transactions", status_code=status.HTTP_201_CREATED, response_model=TransactionResponse)
async def create_transaction(
    transaction: TransactionCreate,
    current_user: User = Depends(check_role(["owner", "admin", "finance"])),
    db: AsyncSession = Depends(get_db)
):
    """Create a new transaction (staff only)"""
    # Verify account exists
    result = await db.execute(
        select(Account).where(Account.id == transaction.account_id)
    )
    account = result.scalar_one_or_none()
    
    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found"
        )
    
    # Create transaction
    new_transaction = Transaction(
        **transaction.dict(),
        created_by=current_user.id,
        status="completed"
    )
    
    db.add(new_transaction)
    
    # Update account balance
    # Positive amount = debit (owes more), Negative = credit (payment/credit)
    account.current_balance += Decimal(str(transaction.amount))
    account.updated_at = datetime.utcnow()
    
    await db.commit()
    await db.refresh(new_transaction)
    
    return new_transaction

@router.post("/payment", status_code=status.HTTP_201_CREATED)
async def make_payment(
    account_id: str,
    amount: float,
    payment_method: str,
    transaction_id: Optional[str] = None,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Make a payment (parent or staff)"""
    if current_user.role == "parent":
        # Verify account belongs to parent
        result = await db.execute(
            select(Parent).where(Parent.user_id == current_user.id)
        )
        parent = result.scalar_one_or_none()
        
        if not parent:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Parent profile not found"
            )
        
        account_result = await db.execute(
            select(Account).where(
                and_(Account.id == account_id, Account.parent_id == parent.id)
            )
        )
    else:
        account_result = await db.execute(
            select(Account).where(Account.id == account_id)
        )
    
    account = account_result.scalar_one_or_none()
    
    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found"
        )
    
    # Create payment transaction (negative amount = credit)
    payment_transaction = Transaction(
        account_id=account_id,
        amount=-amount,  # Negative for payment
        transaction_type="payment",
        description=f"Payment via {payment_method}",
        payment_method=payment_method,
        stripe_payment_id=transaction_id,
        status="completed",
        paid_date=date.today(),
        created_by=current_user.id
    )
    
    db.add(payment_transaction)
    
    # Update account balance
    account.current_balance -= Decimal(str(amount))
    account.updated_at = datetime.utcnow()
    
    await db.commit()
    
    return {"message": "Payment processed successfully", "transaction_id": str(payment_transaction.id)}

@router.post("/charge", status_code=status.HTTP_201_CREATED)
async def create_charge(
    account_id: str,
    amount: float,
    description: str,
    student_id: Optional[str] = None,
    due_date: Optional[date] = None,
    current_user: User = Depends(check_role(["owner", "admin", "finance"])),
    db: AsyncSession = Depends(get_db)
):
    """Create a charge (staff only)"""
    # Verify account exists
    result = await db.execute(
        select(Account).where(Account.id == account_id)
    )
    account = result.scalar_one_or_none()
    
    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found"
        )
    
    # If student_id provided, verify exists
    if student_id:
        student_result = await db.execute(
            select(Student).where(Student.id == student_id)
        )
        if not student_result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student not found"
            )
    
    # Create charge transaction (positive amount = debit)
    charge_transaction = Transaction(
        account_id=account_id,
        student_id=student_id,
        amount=amount,
        transaction_type="charge",
        description=description,
        status="completed",
        due_date=due_date,
        created_by=current_user.id
    )
    
    db.add(charge_transaction)
    
    # Update account balance
    account.current_balance += Decimal(str(amount))
    account.updated_at = datetime.utcnow()
    
    await db.commit()
    
    return {"message": "Charge created successfully", "transaction_id": str(charge_transaction.id)}

@router.get("/summary/{parent_id}")
async def get_billing_summary(
    parent_id: str,
    current_user: User = Depends(check_role(["owner", "admin", "finance"])),
    db: AsyncSession = Depends(get_db)
):
    """Get billing summary for parent (staff only)"""
    # Get account
    account_result = await db.execute(
        select(Account).where(Account.parent_id == parent_id)
    )
    account = account_result.scalar_one_or_none()
    
    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found"
        )
    
    # Get total charges and payments
    result = await db.execute(
        select(
            func.sum(
                case((Transaction.transaction_type == "charge", Transaction.amount), else_=0)
            ).label("total_charges"),
            func.sum(
                case((Transaction.transaction_type == "payment", Transaction.amount), else_=0)
            ).label("total_payments")
        ).where(Transaction.account_id == account.id)
    )
    
    summary = result.first()
    
    return {
        "account_id": str(account.id),
        "current_balance": float(account.current_balance),
        "total_charges": float(summary.total_charges or 0),
        "total_payments": float(abs(summary.total_payments or 0)),
        "status": "credit" if account.current_balance < 0 else "due" if account.current_balance > 0 else "balanced"
    }
