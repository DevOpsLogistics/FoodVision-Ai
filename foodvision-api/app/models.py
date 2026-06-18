from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str | None] = mapped_column(String(255), nullable=True)
    oauth_provider: Mapped[str | None] = mapped_column(String(32), nullable=True)
    oauth_id: Mapped[str | None] = mapped_column(String(255), nullable=True)
    name: Mapped[str] = mapped_column(String(255), default="Người dùng FoodVision")
    avatar: Mapped[str | None] = mapped_column(Text, nullable=True)
    banner: Mapped[str | None] = mapped_column(Text, nullable=True)
    hotline: Mapped[str] = mapped_column(String(32), default="")
    support: Mapped[str] = mapped_column(String(32), default="")
    address: Mapped[str] = mapped_column(String(255), default="")
    health_goal: Mapped[str] = mapped_column(String(64), default="maintain")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    meals: Mapped[list["Meal"]] = relationship(back_populates="user")
    scans: Mapped[list["Scan"]] = relationship(back_populates="user")
    nutrition_goal: Mapped["NutritionGoal | None"] = relationship(back_populates="user", uselist=False)


class NutritionGoal(Base):
    __tablename__ = "nutrition_goals"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True)
    daily_calories: Mapped[int] = mapped_column(Integer, default=2200)
    protein_g: Mapped[int] = mapped_column(Integer, default=120)
    carbs_g: Mapped[int] = mapped_column(Integer, default=250)
    fat_g: Mapped[int] = mapped_column(Integer, default=70)
    water_l: Mapped[float] = mapped_column(Float, default=2.5)

    user: Mapped["User"] = relationship(back_populates="nutrition_goal")


class Scan(Base):
    __tablename__ = "scans"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user: Mapped["User"] = relationship(back_populates="scans")
    compartments: Mapped[list["ScanCompartment"]] = relationship(back_populates="scan")


class ScanCompartment(Base):
    __tablename__ = "scan_compartments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    scan_id: Mapped[int] = mapped_column(ForeignKey("scans.id"), index=True)
    index: Mapped[int] = mapped_column(Integer)
    class_name: Mapped[str] = mapped_column(String(64))
    display_name: Mapped[str] = mapped_column(String(128))
    confidence: Mapped[float] = mapped_column(Float)
    bbox_x: Mapped[int] = mapped_column(Integer)
    bbox_y: Mapped[int] = mapped_column(Integer)
    bbox_w: Mapped[int] = mapped_column(Integer)
    bbox_h: Mapped[int] = mapped_column(Integer)
    calories: Mapped[int] = mapped_column(Integer, default=0)
    protein: Mapped[float] = mapped_column(Float, default=0)
    carbs: Mapped[float] = mapped_column(Float, default=0)
    fat: Mapped[float] = mapped_column(Float, default=0)

    scan: Mapped["Scan"] = relationship(back_populates="compartments")


class Meal(Base):
    __tablename__ = "meals"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    scan_id: Mapped[int | None] = mapped_column(ForeignKey("scans.id"), nullable=True)
    meal_type: Mapped[str] = mapped_column(String(32), default="lunch")
    name: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(Text, default="")
    image_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    calories: Mapped[int] = mapped_column(Integer, default=0)
    protein: Mapped[float] = mapped_column(Float, default=0)
    carbs: Mapped[float] = mapped_column(Float, default=0)
    fat: Mapped[float] = mapped_column(Float, default=0)
    eaten_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user: Mapped["User"] = relationship(back_populates="meals")
