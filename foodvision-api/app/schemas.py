from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    name: str = Field(min_length=2, max_length=255)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


class UserUpdate(BaseModel):
    name: str | None = None
    avatar: str | None = None
    banner: str | None = None
    hotline: str | None = None
    support: str | None = None
    address: str | None = None
    health_goal: str | None = None


class NutritionGoalUpdate(BaseModel):
    daily_calories: int | None = None
    protein_g: int | None = None
    carbs_g: int | None = None
    fat_g: int | None = None
    water_l: float | None = None


class MealCreate(BaseModel):
    meal_type: str = "lunch"
    name: str
    description: str = ""
    image_url: str | None = None
    calories: int = 0
    protein: float = 0
    carbs: float = 0
    fat: float = 0
    scan_id: int | None = None
    eaten_at: datetime | None = None


class MealFromScan(BaseModel):
    scan_id: int
    meal_type: str = "lunch"
