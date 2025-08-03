from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from slowapi import Limiter
from slowapi.util import get_remote_address
from pydantic import BaseModel
from typing import List, Optional

from database import get_db
from models import Location, QueueEntry, User, QueueStatus
from routes.auth import get_current_user

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

class LocationCreate(BaseModel):
    name: str
    address: Optional[str] = None
    phone: Optional[str] = None

class LocationResponse(BaseModel):
    id: int
    name: str
    address: Optional[str]
    phone: Optional[str]
    qr_code_url: Optional[str]
    is_active: bool

@router.post("/locations", response_model=LocationResponse)
@limiter.limit("10/minute")
async def create_location(
    request: Request,
    location_data: LocationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    location = Location(
        name=location_data.name,
        address=location_data.address,
        phone=location_data.phone,
        owner_id=current_user.id,
        qr_code_url=f"/queue/join?location_id={location_data.name.lower().replace(' ', '-')}"
    )
    
    db.add(location)
    db.commit()
    db.refresh(location)
    
    # Update QR code URL with actual ID
    location.qr_code_url = f"/queue/join?location_id={location.id}"
    db.commit()
    
    return location

@router.get("/locations", response_model=List[LocationResponse])
async def get_user_locations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.is_admin:
        locations = db.query(Location).all()
    else:
        locations = db.query(Location).filter(Location.owner_id == current_user.id).all()
    
    return locations

@router.get("/dashboard")
async def admin_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.is_admin:
        total_locations = db.query(Location).count()
        active_queues = db.query(QueueEntry).filter(
            QueueEntry.status.in_([QueueStatus.WAITING, QueueStatus.NOTIFIED])
        ).count()
        total_customers_today = db.query(QueueEntry).filter(
            QueueEntry.created_at >= datetime.utcnow().date()
        ).count()
    else:
        user_locations = db.query(Location).filter(Location.owner_id == current_user.id).all()
        location_ids = [loc.id for loc in user_locations]
        
        total_locations = len(user_locations)
        active_queues = db.query(QueueEntry).filter(
            QueueEntry.location_id.in_(location_ids),
            QueueEntry.status.in_([QueueStatus.WAITING, QueueStatus.NOTIFIED])
        ).count()
        total_customers_today = db.query(QueueEntry).filter(
            QueueEntry.location_id.in_(location_ids),
            QueueEntry.created_at >= datetime.utcnow().date()
        ).count()
    
    return {
        "total_locations": total_locations,
        "active_queues": active_queues,
        "total_customers_today": total_customers_today,
        "is_admin": current_user.is_admin
    }