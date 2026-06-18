from datetime import date, datetime

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Meal, Scan, ScanCompartment, User
from app.schemas import MealCreate, MealFromScan
from app.security import get_current_user

router = APIRouter(prefix="/meals", tags=["meals"])


def _meal_dict(meal: Meal) -> dict:
    return {
        "id": meal.id,
        "meal_type": meal.meal_type,
        "name": meal.name,
        "description": meal.description,
        "image_url": meal.image_url,
        "calories": meal.calories,
        "protein": meal.protein,
        "carbs": meal.carbs,
        "fat": meal.fat,
        "scan_id": meal.scan_id,
        "eaten_at": meal.eaten_at.isoformat(),
    }


@router.get("")
def list_meals(
    date_str: str | None = Query(None, alias="date"),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    q = db.query(Meal).filter(Meal.user_id == user.id)
    if date_str:
        try:
            d = date.fromisoformat(date_str)
            start = datetime.combine(d, datetime.min.time())
            end = datetime.combine(d, datetime.max.time())
            q = q.filter(Meal.eaten_at >= start, Meal.eaten_at <= end)
        except ValueError as exc:
            raise HTTPException(status_code=400, detail="Ngày không hợp lệ (YYYY-MM-DD)") from exc
    meals = q.order_by(Meal.eaten_at.desc()).all()
    return [_meal_dict(m) for m in meals]


@router.post("")
def create_meal(body: MealCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    meal = Meal(
        user_id=user.id,
        scan_id=body.scan_id,
        meal_type=body.meal_type,
        name=body.name,
        description=body.description,
        image_url=body.image_url,
        calories=body.calories,
        protein=body.protein,
        carbs=body.carbs,
        fat=body.fat,
        eaten_at=body.eaten_at or datetime.utcnow(),
    )
    db.add(meal)
    db.commit()
    db.refresh(meal)
    return _meal_dict(meal)


@router.post("/from-scan")
def create_meal_from_scan(body: MealFromScan, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    scan = db.query(Scan).filter(Scan.id == body.scan_id, Scan.user_id == user.id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Không tìm thấy kết quả quét")
    comps = db.query(ScanCompartment).filter(ScanCompartment.scan_id == scan.id).all()
    if not comps:
        raise HTTPException(status_code=400, detail="Kết quả quét trống")
    name = ", ".join(c.display_name for c in comps[:3])
    calories = sum(c.calories for c in comps)
    protein = sum(c.protein for c in comps)
    carbs = sum(c.carbs for c in comps)
    fat = sum(c.fat for c in comps)
    meal = Meal(
        user_id=user.id,
        scan_id=scan.id,
        meal_type=body.meal_type,
        name=name,
        description="Tự động từ quét AI",
        calories=calories,
        protein=protein,
        carbs=carbs,
        fat=fat,
    )
    db.add(meal)
    db.commit()
    db.refresh(meal)
    return _meal_dict(meal)


@router.delete("/{meal_id}")
def delete_meal(meal_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    meal = db.query(Meal).filter(Meal.id == meal_id, Meal.user_id == user.id).first()
    if not meal:
        raise HTTPException(status_code=404, detail="Không tìm thấy bữa ăn")
    db.delete(meal)
    db.commit()
    return {"ok": True}
