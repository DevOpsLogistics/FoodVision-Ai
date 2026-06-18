from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.ml_service import load_nutrition
from app.models import Meal, ScanCompartment, User
from app.security import get_current_user

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/summary")
def dashboard_summary(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    meals = db.query(Meal).filter(Meal.user_id == user.id, Meal.eaten_at >= today_start).all()

    consumed = {
        "calories": sum(m.calories for m in meals),
        "protein": sum(m.protein for m in meals),
        "carbs": sum(m.carbs for m in meals),
        "fat": sum(m.fat for m in meals),
    }
    goal = user.nutrition_goal
    targets = {
        "calories": goal.daily_calories if goal else 2200,
        "protein": goal.protein_g if goal else 120,
        "carbs": goal.carbs_g if goal else 250,
        "fat": goal.fat_g if goal else 70,
    }

    recent = db.query(Meal).filter(Meal.user_id == user.id).order_by(Meal.eaten_at.desc()).limit(6).all()

    trending = (
        db.query(ScanCompartment.class_name, func.count(ScanCompartment.id).label("cnt"))
        .join(ScanCompartment.scan)
        .group_by(ScanCompartment.class_name)
        .order_by(func.count(ScanCompartment.id).desc())
        .limit(6)
        .all()
    )
    nutrition_map = load_nutrition()
    community = [
        {
            "title": nutrition_map.get(cls, {}).get("display", cls),
            "scans": cnt,
            "class_name": cls,
        }
        for cls, cnt in trending
    ]

    return {
        "consumed": consumed,
        "targets": targets,
        "remaining_calories": max(0, targets["calories"] - consumed["calories"]),
        "recent_meals": [
            {
                "id": m.id,
                "name": m.name,
                "meal_type": m.meal_type,
                "calories": m.calories,
                "eaten_at": m.eaten_at.isoformat(),
            }
            for m in recent
        ],
        "community_trending": community,
    }
