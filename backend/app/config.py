"""Studio4 Backend Configuration"""
import os
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # App settings
    app_name: str = "Studio4 Dance Co API"
    app_version: str = "1.0.0"
    debug: bool = True
    
    # Database
    database_url: str = "postgresql+asyncpg://postgres:${DB_PASSWORD}@localhost:5432/studio4"
    
    # JWT Authentication
    secret_key: str = "REDACTED_SECRET_KEY"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24 * 7  # 7 days
    
    # Google Gemini API
    gemini_api_key: str = ""
    
    # CORS
    cors_origins: list = ["http://localhost:3000", "http://localhost:5173", "http://localhost:8080"]
    
    # File uploads
    upload_dir: str = "/a0/usr/projects/studio4/uploads"
    max_upload_size: int = 10 * 1024 * 1024  # 10MB
    
    class Config:
        env_file = ".env"
        extra = "ignore"

@lru_cache()
def get_settings() -> Settings:
    return Settings()

# Create upload directory
os.makedirs(get_settings().upload_dir, exist_ok=True)
