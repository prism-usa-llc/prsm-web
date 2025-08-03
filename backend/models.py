from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Text, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

Base = declarative_base()

class QueueStatus(enum.Enum):
    WAITING = "waiting"
    NOTIFIED = "notified"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    locations = relationship("Location", back_populates="owner")

class Location(Base):
    __tablename__ = "locations"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    address = Column(Text)
    phone = Column(String(20))
    qr_code_url = Column(String(255))
    owner_id = Column(Integer, ForeignKey("users.id"))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    owner = relationship("User", back_populates="locations")
    queue_entries = relationship("QueueEntry", back_populates="location")

class QueueEntry(Base):
    __tablename__ = "queue_entries"
    
    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String(100), nullable=False)
    customer_phone = Column(String(20), nullable=False)
    location_id = Column(Integer, ForeignKey("locations.id"))
    position = Column(Integer, nullable=False)
    status = Column(Enum(QueueStatus), default=QueueStatus.WAITING)
    estimated_wait_time = Column(Integer)  # in minutes
    created_at = Column(DateTime, default=datetime.utcnow)
    notified_at = Column(DateTime)
    completed_at = Column(DateTime)
    
    location = relationship("Location", back_populates="queue_entries")