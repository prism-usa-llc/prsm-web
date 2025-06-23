from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc, and_
from database import get_db, AdminUser, ContactSubmission
from auth import (
    authenticate_user, 
    create_access_token, 
    get_current_active_user,
    get_password_hash,
    require_role,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

router = APIRouter()

class Token(BaseModel):
    access_token: str
    token_type: str

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: str = "editor"

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    is_active: bool
    role: str
    created_at: datetime

class ContactSubmissionResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str]
    message: str
    ip_address: Optional[str]
    submission_time: datetime
    is_read: bool
    is_flagged: bool
    status: str
    bot_score: int

class SubmissionUpdate(BaseModel):
    is_read: Optional[bool] = None
    is_flagged: Optional[bool] = None
    status: Optional[str] = None

class DashboardStats(BaseModel):
    total_submissions: int
    unread_submissions: int
    flagged_submissions: int
    submissions_today: int
    submissions_this_week: int
    submissions_this_month: int

@router.post("/login", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    """Authenticate admin user and return access token"""
    user = await authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Update last login
    user.last_login = datetime.utcnow()
    await db.commit()
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/users", response_model=UserResponse)
async def create_user(
    user_create: UserCreate,
    db: AsyncSession = Depends(get_db),
    current_user: AdminUser = Depends(require_role("admin"))
):
    """Create a new admin user (admin only)"""
    # Check if user already exists
    existing_user = await db.execute(
        select(AdminUser).where(AdminUser.username == user_create.username)
    )
    if existing_user.scalar_one_or_none():
        raise HTTPException(
            status_code=400,
            detail="Username already registered"
        )
    
    # Check if email already exists
    existing_email = await db.execute(
        select(AdminUser).where(AdminUser.email == user_create.email)
    )
    if existing_email.scalar_one_or_none():
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_create.password)
    db_user = AdminUser(
        username=user_create.username,
        email=user_create.email,
        password_hash=hashed_password,
        role=user_create.role
    )
    
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    
    return db_user

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: AdminUser = Depends(get_current_active_user)):
    """Get current user information"""
    return current_user

@router.get("/dashboard/stats", response_model=DashboardStats)
async def get_dashboard_stats(
    db: AsyncSession = Depends(get_db),
    current_user: AdminUser = Depends(get_current_active_user)
):
    """Get dashboard statistics"""
    now = datetime.utcnow()
    today = now.date()
    week_ago = now - timedelta(days=7)
    month_ago = now - timedelta(days=30)
    
    # Total submissions
    total_result = await db.execute(select(func.count(ContactSubmission.id)))
    total_submissions = total_result.scalar()
    
    # Unread submissions
    unread_result = await db.execute(
        select(func.count(ContactSubmission.id))
        .where(ContactSubmission.is_read == False)
    )
    unread_submissions = unread_result.scalar()
    
    # Flagged submissions
    flagged_result = await db.execute(
        select(func.count(ContactSubmission.id))
        .where(ContactSubmission.is_flagged == True)
    )
    flagged_submissions = flagged_result.scalar()
    
    # Today's submissions
    today_result = await db.execute(
        select(func.count(ContactSubmission.id))
        .where(func.date(ContactSubmission.submission_time) == today)
    )
    submissions_today = today_result.scalar()
    
    # This week's submissions
    week_result = await db.execute(
        select(func.count(ContactSubmission.id))
        .where(ContactSubmission.submission_time >= week_ago)
    )
    submissions_this_week = week_result.scalar()
    
    # This month's submissions
    month_result = await db.execute(
        select(func.count(ContactSubmission.id))
        .where(ContactSubmission.submission_time >= month_ago)
    )
    submissions_this_month = month_result.scalar()
    
    return DashboardStats(
        total_submissions=total_submissions,
        unread_submissions=unread_submissions,
        flagged_submissions=flagged_submissions,
        submissions_today=submissions_today,
        submissions_this_week=submissions_this_week,
        submissions_this_month=submissions_this_month
    )

@router.get("/submissions", response_model=List[ContactSubmissionResponse])
async def get_submissions(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    status: Optional[str] = Query(None),
    is_read: Optional[bool] = Query(None),
    is_flagged: Optional[bool] = Query(None),
    search: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user: AdminUser = Depends(get_current_active_user)
):
    """Get contact submissions with filtering and pagination"""
    query = select(ContactSubmission).order_by(desc(ContactSubmission.submission_time))
    
    # Apply filters
    conditions = []
    if status:
        conditions.append(ContactSubmission.status == status)
    if is_read is not None:
        conditions.append(ContactSubmission.is_read == is_read)
    if is_flagged is not None:
        conditions.append(ContactSubmission.is_flagged == is_flagged)
    if search:
        search_term = f"%{search}%"
        conditions.append(
            (ContactSubmission.name.ilike(search_term)) |
            (ContactSubmission.email.ilike(search_term)) |
            (ContactSubmission.message.ilike(search_term))
        )
    
    if conditions:
        query = query.where(and_(*conditions))
    
    # Apply pagination
    query = query.offset(skip).limit(limit)
    
    result = await db.execute(query)
    submissions = result.scalars().all()
    
    return submissions

@router.put("/submissions/{submission_id}", response_model=ContactSubmissionResponse)
async def update_submission(
    submission_id: int,
    submission_update: SubmissionUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: AdminUser = Depends(get_current_active_user)
):
    """Update a contact submission"""
    result = await db.execute(
        select(ContactSubmission).where(ContactSubmission.id == submission_id)
    )
    submission = result.scalar_one_or_none()
    
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    # Update fields
    if submission_update.is_read is not None:
        submission.is_read = submission_update.is_read
    if submission_update.is_flagged is not None:
        submission.is_flagged = submission_update.is_flagged
    if submission_update.status is not None:
        submission.status = submission_update.status
    
    await db.commit()
    await db.refresh(submission)
    
    return submission

@router.delete("/submissions/{submission_id}")
async def delete_submission(
    submission_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: AdminUser = Depends(require_role("admin"))
):
    """Delete a contact submission (admin only)"""
    result = await db.execute(
        select(ContactSubmission).where(ContactSubmission.id == submission_id)
    )
    submission = result.scalar_one_or_none()
    
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    await db.delete(submission)
    await db.commit()
    
    return {"message": "Submission deleted successfully"}