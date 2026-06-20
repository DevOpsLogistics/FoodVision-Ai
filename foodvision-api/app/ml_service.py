"""Nhận diện món ăn — MobileNetV2 CNN local."""
from __future__ import annotations

import json
from pathlib import Path

import sys

import cv2
import numpy as np

from app import cnn_engine

NUTRITION_PATH = Path(__file__).resolve().parent / "data" / "dish_nutrition.json"

_nutrition: dict | None = None


def load_nutrition() -> dict:
    global _nutrition
    with open(NUTRITION_PATH, encoding="utf-8") as f:
        _nutrition = json.load(f)
    return _nutrition


def get_display_name(class_name: str) -> str:
    info = load_nutrition().get(class_name, {})
    return info.get("display", class_name.replace("_", " ").title())


def get_nutrition(class_name: str) -> dict:
    info = load_nutrition().get(class_name, {})
    return {
        "calories": info.get("calories", 0),
        "protein": info.get("protein", 0),
        "carbs": info.get("carbs", 0),
        "fat": info.get("fat", 0),
    }


def init_model() -> dict:
    return cnn_engine.init_engine()


def ml_status() -> dict:
    st = cnn_engine.status()
    return {"cnn": st, "engine": "MobileNetV2 CNN" if st.get("ready") else "none"}


def predict_from_bytes(image_bytes: bytes, tray_type: str | None = None) -> dict:
    if str(cnn_engine.ML_DIR) not in sys.path:
        sys.path.insert(0, str(cnn_engine.ML_DIR))
    from image_utils import fix_image_orientation, resize_for_scan

    img = fix_image_orientation(image_bytes)
    if img is None:
        raise ValueError("Không đọc được ảnh")
    img = resize_for_scan(img)

    if not cnn_engine.is_ready():
        cnn_engine.init_engine()
    if not cnn_engine.is_ready():
        st = cnn_engine.status()
        raise RuntimeError(st.get("error") or "CNN chưa sẵn sàng")

    raw = cnn_engine.predict_tray(img, tray_type=tray_type)
    items = []
    totals = {"calories": 0, "protein": 0.0, "carbs": 0.0, "fat": 0.0}
    for row in raw["items"]:
        class_name = cnn_engine._merge_label(row["class_name"])
        nut = get_nutrition(class_name)
        items.append({
            "index": row["index"],
            "slot": row["slot"],
            "class_name": class_name,
            "display_name": get_display_name(class_name),
            "confidence": row["confidence"],
            "bbox": row["bbox"],
            **nut,
        })
        totals["calories"] += nut["calories"]
        totals["protein"] += nut["protein"]
        totals["carbs"] += nut["carbs"]
        totals["fat"] += nut["fat"]
    return {"items": items, "totals": totals, "crop": raw.get("crop"), "crop_version": cnn_engine.CROP_VERSION}
