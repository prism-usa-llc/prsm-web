import time
from typing import Optional
from fastapi import APIRouter, Depends, Request, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_db, ContactSubmission
import redis
import json
import hashlib
import secrets

router = APIRouter()

# Redis connection for rate limiting and form tokens
import os
redis_url = os.getenv('REDIS_URL', 'redis://localhost:6379/1')
r = redis.from_url(redis_url)

class ContactForm(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=50)
    message: str = Field(..., min_length=10, max_length=5000)
    website: Optional[str] = None  # Honeypot field
    form_token: Optional[str] = None
    form_load_time: Optional[float] = None

def generate_form_token() -> str:
    """Generate a secure form token"""
    token = secrets.token_urlsafe(32)
    token_data = {
        "created": time.time(),
        "token": token
    }
    r.setex(f"form_token:{token}", 600, json.dumps(token_data))  # 10 minute expiry
    return token

def verify_form_token(token: str) -> Optional[dict]:
    """Verify form token and return token data"""
    if not token:
        return None
    
    token_data = r.get(f"form_token:{token}")
    if not token_data:
        return None
    
    try:
        return json.loads(token_data)
    except json.JSONDecodeError:
        return None

def calculate_bot_score(form_data: ContactForm, request: Request, form_load_time: float) -> int:
    """Calculate bot detection score (0-100, higher = more likely bot)"""
    score = 0
    
    # Check honeypot field
    if form_data.website:
        score += 100  # Definite bot
        return min(score, 100)
    
    # Check form submission timing
    if form_load_time:
        submission_time = time.time() - form_load_time
        if submission_time < 3:  # Less than 3 seconds
            score += 50
        elif submission_time < 10:  # Less than 10 seconds
            score += 20
    
    # Check for suspicious patterns in message
    message_lower = form_data.message.lower()
    suspicious_words = ['viagra', 'casino', 'loan', 'bitcoin', 'click here', 'act now']
    for word in suspicious_words:
        if word in message_lower:
            score += 30
            break
    
    # Check for repeated submissions from same IP + user-agent combination
    client_fingerprint = f"{request.client.host if request.client else 'unknown'}:{hashlib.sha256(request.headers.get('user-agent', '').encode()).hexdigest()[:16]}"
    recent_submissions = r.get(f"rate_limit:{client_fingerprint}")
    if recent_submissions:
        try:
            count = int(recent_submissions)
            if count > 2:  # More than 2 submissions in the time window (approaching limit of 3)
                score += 30
        except ValueError:
            pass
    
    # Check user agent
    user_agent = request.headers.get("user-agent", "").lower()
    if not user_agent or "bot" in user_agent or "crawler" in user_agent:
        score += 30
    
    return min(score, 100)

@router.get("/form-token")
async def get_form_token():
    """Generate and return a new form token"""
    token = generate_form_token()
    return {"token": token, "timestamp": time.time()}

def check_rate_limit(client_ip: str, user_agent: str) -> bool:
    """Check if IP + user-agent combination has exceeded rate limit (3 submissions per hour)"""
    # Create a unique identifier combining IP and user-agent
    client_fingerprint = f"{client_ip}:{hashlib.sha256(user_agent.encode()).hexdigest()[:16]}"
    rate_limit_key = f"rate_limit:{client_fingerprint}"
    
    current_count = r.get(rate_limit_key)
    
    if current_count and int(current_count) >= 3:
        return False  # Rate limit exceeded (3 submissions per hour)
    
    # Increment counter
    if current_count:
        r.incr(rate_limit_key)
    else:
        r.setex(rate_limit_key, 3600, 1)  # 1 hour window (3600 seconds)
    
    return True  # Within rate limit

@router.post("/contact")
async def process_contact_submission(
    request: Request,
    form_data: ContactForm,
    db: AsyncSession = Depends(get_db)
):
    """Process contact form submission with bot detection"""
    
    client_ip = request.client.host if request.client else "unknown"
    user_agent = request.headers.get("user-agent", "")
    
    # Check rate limit based on IP + user-agent combination
    if not check_rate_limit(client_ip, user_agent):
        raise HTTPException(
            status_code=429,
            detail="Too many requests from this client. You can submit up to 3 messages per hour. Please try again later."
        )
    
    # Verify form token
    token_data = verify_form_token(form_data.form_token) if form_data.form_token else None
    form_load_time = token_data["created"] if token_data else time.time()
    
    # Calculate bot score
    bot_score = calculate_bot_score(form_data, request, form_load_time)
    
    # If honeypot field is filled, pretend success but don't save
    if form_data.website:
        # Log bot attempt
        print(f"Bot detected via honeypot from IP: {client_ip}")
        return JSONResponse(
            status_code=200,
            content={"success": True, "message": "Thank you for your message!"}
        )
    
    # Create submission record
    submission = ContactSubmission(
        name=form_data.name,
        email=form_data.email,
        phone=form_data.phone,
        message=form_data.message,
        ip_address=client_ip,
        user_agent=user_agent,
        bot_score=bot_score
    )
    
    # Flag high-risk submissions
    if bot_score >= 70:
        submission.is_flagged = True
        submission.status = 'flagged'
    elif bot_score >= 40:
        submission.status = 'review'
    else:
        submission.status = 'new'
    
    try:
        db.add(submission)
        await db.commit()
        await db.refresh(submission)
        
        # Clean up used form token
        if form_data.form_token:
            r.delete(f"form_token:{form_data.form_token}")
        
        # Log successful submission
        print(f"Contact submission received from {form_data.email} (Bot Score: {bot_score})")
        
        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "message": "Thank you for your message! We'll get back to you soon.",
                "id": submission.id
            }
        )
        
    except Exception as e:
        await db.rollback()
        print(f"Error saving contact submission: {e}")
        raise HTTPException(
            status_code=500,
            detail="An error occurred while processing your submission. Please try again."
        )

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": time.time()}

