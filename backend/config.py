from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    database_url: str = "postgresql://postgres:password@localhost:5432/prsm_db"
    redis_url: str = "redis://localhost:6379/0"
    secret_key: str = "your-secret-key-change-this-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    environment: str = "development"
    redis_password: Optional[str] = None
    
    class Config:
        env_file = ".env"

settings = Settings()