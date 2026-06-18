from urllib.parse import urlencode

import httpx
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models import NutritionGoal, User
from app.schemas import AuthResponse, LoginRequest, RegisterRequest
from app.security import create_access_token, hash_password, user_to_dict, verify_password

router = APIRouter(prefix="/auth", tags=["auth"])


def _create_user_response(user: User, db: Session) -> AuthResponse:
    if not user.nutrition_goal:
        db.add(NutritionGoal(user_id=user.id))
        db.commit()
        db.refresh(user)
    token = create_access_token(user.id)
    return AuthResponse(access_token=token, user=user_to_dict(user))


@router.post("/register", response_model=AuthResponse)
def register(body: RegisterRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == body.email).first():
        raise HTTPException(status_code=400, detail="Email đã được sử dụng")
    user = User(
        email=body.email.lower(),
        password_hash=hash_password(body.password),
        name=body.name,
        banner="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    db.add(NutritionGoal(user_id=user.id))
    db.commit()
    db.refresh(user)
    return _create_user_response(user, db)


@router.post("/login", response_model=AuthResponse)
def login(body: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email.lower()).first()
    if not user or not verify_password(body.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Email hoặc mật khẩu không đúng")
    return _create_user_response(user, db)


@router.get("/google")
def google_login():
    if not settings.google_client_id:
        raise HTTPException(
            status_code=501,
            detail="Chưa cấu hình GOOGLE_CLIENT_ID. Thêm vào file .env của foodvision-api.",
        )
    params = urlencode({
        "client_id": settings.google_client_id,
        "redirect_uri": f"{settings.frontend_url}/auth/callback/google",
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
        "prompt": "consent",
    })
    return RedirectResponse(f"https://accounts.google.com/o/oauth2/v2/auth?{params}")


@router.get("/facebook")
def facebook_login():
    if not settings.facebook_client_id:
        raise HTTPException(
            status_code=501,
            detail="Chưa cấu hình FACEBOOK_CLIENT_ID. Thêm vào file .env của foodvision-api.",
        )
    params = urlencode({
        "client_id": settings.facebook_client_id,
        "redirect_uri": f"{settings.frontend_url}/auth/callback/facebook",
        "scope": "email,public_profile",
        "response_type": "code",
    })
    return RedirectResponse(f"https://www.facebook.com/v19.0/dialog/oauth?{params}")


@router.post("/oauth/google", response_model=AuthResponse)
async def google_callback(code: str = Query(...), db: Session = Depends(get_db)):
    if not settings.google_client_id or not settings.google_client_secret:
        raise HTTPException(status_code=501, detail="Google OAuth chưa được cấu hình")
    async with httpx.AsyncClient() as client:
        token_res = await client.post(
            "https://oauth2.googleapis.com/token",
            data={
                "code": code,
                "client_id": settings.google_client_id,
                "client_secret": settings.google_client_secret,
                "redirect_uri": f"{settings.frontend_url}/auth/callback/google",
                "grant_type": "authorization_code",
            },
        )
        if token_res.status_code != 200:
            raise HTTPException(status_code=400, detail="Không lấy được token Google")
        access = token_res.json().get("access_token")
        profile_res = await client.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            headers={"Authorization": f"Bearer {access}"},
        )
    profile = profile_res.json()
    return _oauth_upsert(db, "google", profile.get("id", ""), profile.get("email", ""), profile.get("name", "Google User"), profile.get("picture"))


@router.post("/oauth/facebook", response_model=AuthResponse)
async def facebook_callback(code: str = Query(...), db: Session = Depends(get_db)):
    if not settings.facebook_client_id or not settings.facebook_client_secret:
        raise HTTPException(status_code=501, detail="Facebook OAuth chưa được cấu hình")
    async with httpx.AsyncClient() as client:
        token_res = await client.get(
            "https://graph.facebook.com/v19.0/oauth/access_token",
            params={
                "client_id": settings.facebook_client_id,
                "client_secret": settings.facebook_client_secret,
                "redirect_uri": f"{settings.frontend_url}/auth/callback/facebook",
                "code": code,
            },
        )
        if token_res.status_code != 200:
            raise HTTPException(status_code=400, detail="Không lấy được token Facebook")
        access = token_res.json().get("access_token")
        profile_res = await client.get(
            "https://graph.facebook.com/me",
            params={"fields": "id,name,email,picture", "access_token": access},
        )
    profile = profile_res.json()
    picture = profile.get("picture", {}).get("data", {}).get("url")
    return _oauth_upsert(db, "facebook", profile.get("id", ""), profile.get("email") or f"{profile.get('id')}@facebook.local", profile.get("name", "Facebook User"), picture)


def _oauth_upsert(db: Session, provider: str, oauth_id: str, email: str, name: str, avatar: str | None) -> AuthResponse:
    user = db.query(User).filter(User.oauth_provider == provider, User.oauth_id == oauth_id).first()
    if not user and email:
        user = db.query(User).filter(User.email == email.lower()).first()
    if not user:
        user = User(
            email=email.lower(),
            oauth_provider=provider,
            oauth_id=oauth_id,
            name=name,
            avatar=avatar,
            banner="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop",
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        db.add(NutritionGoal(user_id=user.id))
        db.commit()
    else:
        user.name = name or user.name
        if avatar:
            user.avatar = avatar
        user.oauth_provider = provider
        user.oauth_id = oauth_id
        db.commit()
        db.refresh(user)
    return _create_user_response(user, db)
