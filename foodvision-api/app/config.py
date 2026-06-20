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
    # MoMo sandbox demo (https://developers.momo.vn)
    momo_partner_code: str = "MOMO"
    momo_access_key: str = "F8BBA842ECF85"
    momo_secret_key: str = "K951B6PE1waDMi640xX08PD3vg6EkVlz"
    momo_env: str = "sandbox"
    momo_redirect_url: str = ""
    momo_ipn_url: str = "http://127.0.0.1:8000/api/payments/momo/ipn"
    # Email (Gmail App Password) — quên mật khẩu
    smtp_host: str = "smtp.gmail.com"
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    smtp_from: str = ""


settings = Settings()
