from fastapi import APIRouter, Depends

from app.ml_service import ml_status
from app.models import User
from app.security import get_current_user

router = APIRouter(prefix="/ml", tags=["ml"])


@router.get("/status")
def get_ml_status(_user: User = Depends(get_current_user)):
    """Chỉ dev đã đăng nhập — không hiển thị trên app."""
    return ml_status()
