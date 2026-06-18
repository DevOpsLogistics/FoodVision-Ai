from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import NutritionGoal, User
from app.schemas import NutritionGoalUpdate, UserUpdate
from app.security import get_current_user, user_to_dict

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me")
def get_me(user: User = Depends(get_current_user)):
    return user_to_dict(user)


@router.patch("/me")
def update_me(body: UserUpdate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(user, field, value)
    db.commit()
    db.refresh(user)
    return user_to_dict(user)


@router.patch("/me/nutrition-goal")
def update_nutrition_goal(
    body: NutritionGoalUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    goal = user.nutrition_goal
    if not goal:
        goal = NutritionGoal(user_id=user.id)
        db.add(goal)
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(goal, field, value)
    db.commit()
    db.refresh(user)
    return user_to_dict(user)
