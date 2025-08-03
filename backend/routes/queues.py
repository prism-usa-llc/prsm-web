from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from slowapi import Limiter
from slowapi.util import get_remote_address
from pydantic import BaseModel
from typing import List
import redis
import json

from database import get_db
from models import QueueEntry, Location, QueueStatus, User
from routes.auth import get_current_user
from config import settings

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

redis_client = redis.from_url(settings.redis_url, decode_responses=True)

class QueueEntryCreate(BaseModel):
    customer_name: str
    customer_phone: str
    location_id: int

class QueueEntryResponse(BaseModel):
    id: int
    customer_name: str
    customer_phone: str
    position: int
    status: str
    estimated_wait_time: int
    location_name: str

class QueueStatusUpdate(BaseModel):
    status: str

@router.post("/join")
@limiter.limit("3/minute")
async def join_queue(request: Request, entry_data: QueueEntryCreate, db: Session = Depends(get_db)):
    location = db.query(Location).filter(Location.id == entry_data.location_id).first()
    if not location or not location.is_active:
        raise HTTPException(status_code=404, detail="Location not found or inactive")
    
    # Check if customer already in queue
    existing_entry = db.query(QueueEntry).filter(
        QueueEntry.location_id == entry_data.location_id,
        QueueEntry.customer_phone == entry_data.customer_phone,
        QueueEntry.status == QueueStatus.WAITING
    ).first()
    
    if existing_entry:
        raise HTTPException(status_code=400, detail="Already in queue for this location")
    
    # Get current queue position
    current_position = db.query(QueueEntry).filter(
        QueueEntry.location_id == entry_data.location_id,
        QueueEntry.status.in_([QueueStatus.WAITING, QueueStatus.NOTIFIED])
    ).count() + 1
    
    queue_entry = QueueEntry(
        customer_name=entry_data.customer_name,
        customer_phone=entry_data.customer_phone,
        location_id=entry_data.location_id,
        position=current_position,
        estimated_wait_time=current_position * 5  # 5 minutes per person estimate
    )
    
    db.add(queue_entry)
    db.commit()
    db.refresh(queue_entry)
    
    # Cache in Redis for quick access
    redis_client.setex(
        f"queue_entry:{queue_entry.id}",
        3600,  # 1 hour TTL
        json.dumps({
            "id": queue_entry.id,
            "position": queue_entry.position,
            "status": queue_entry.status.value,
            "location_id": queue_entry.location_id
        })
    )
    
    return {
        "id": queue_entry.id,
        "position": queue_entry.position,
        "estimated_wait_time": queue_entry.estimated_wait_time,
        "tracking_url": f"/track/{queue_entry.id}"
    }

@router.get("/track/{entry_id}")
async def track_queue_position(entry_id: int, db: Session = Depends(get_db)):
    # Try Redis first
    cached_entry = redis_client.get(f"queue_entry:{entry_id}")
    if cached_entry:
        entry_data = json.loads(cached_entry)
        entry = db.query(QueueEntry).filter(QueueEntry.id == entry_id).first()
        if entry:
            return {
                "id": entry.id,
                "position": entry.position,
                "status": entry.status.value,
                "estimated_wait_time": entry.estimated_wait_time,
                "location_name": entry.location.name
            }
    
    entry = db.query(QueueEntry).filter(QueueEntry.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Queue entry not found")
    
    return {
        "id": entry.id,
        "position": entry.position,
        "status": entry.status.value,
        "estimated_wait_time": entry.estimated_wait_time,
        "location_name": entry.location.name
    }

@router.get("/location/{location_id}")
async def get_location_queue(location_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    location = db.query(Location).filter(Location.id == location_id).first()
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")
    
    # Check if user owns this location or is admin
    if location.owner_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Access denied")
    
    queue_entries = db.query(QueueEntry).filter(
        QueueEntry.location_id == location_id,
        QueueEntry.status.in_([QueueStatus.WAITING, QueueStatus.NOTIFIED])
    ).order_by(QueueEntry.position).all()
    
    return [
        {
            "id": entry.id,
            "customer_name": entry.customer_name,
            "position": entry.position,
            "status": entry.status.value,
            "estimated_wait_time": entry.estimated_wait_time,
            "created_at": entry.created_at
        }
        for entry in queue_entries
    ]

@router.put("/entry/{entry_id}/status")
async def update_queue_status(
    entry_id: int,
    status_update: QueueStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    entry = db.query(QueueEntry).filter(QueueEntry.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Queue entry not found")
    
    # Check if user owns this location or is admin
    if entry.location.owner_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Access denied")
    
    try:
        new_status = QueueStatus(status_update.status)
        entry.status = new_status
        
        if new_status == QueueStatus.COMPLETED:
            entry.completed_at = datetime.utcnow()
        elif new_status == QueueStatus.NOTIFIED:
            entry.notified_at = datetime.utcnow()
        
        db.commit()
        
        # Update Redis cache
        redis_client.setex(
            f"queue_entry:{entry.id}",
            3600,
            json.dumps({
                "id": entry.id,
                "position": entry.position,
                "status": entry.status.value,
                "location_id": entry.location_id
            })
        )
        
        return {"message": "Status updated successfully"}
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid status")