from pathlib import Path

from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict

load_dotenv(Path(__file__).resolve().parent.parent / ".env", override=True)


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    secret_key: str = "foodvision-dev-secret-change-in-production"
    database_url: str = "sqlite:///./foodvision.db"
    frontend_url: str = "http://localhost:3000"
    access_token_expire_minutes: int = 60 * 24 * 7
    google_client_id: str = ""
    google_client_secret: str = ""
    facebook_client_id: str = ""
    facebook_client_secret: str = ""


settings = Settings()
