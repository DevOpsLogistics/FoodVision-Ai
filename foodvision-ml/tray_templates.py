"""Load template khay theo loại người dùng chọn."""
from __future__ import annotations

import json
from pathlib import Path

ML_DIR = Path(__file__).resolve().parent
TEMPLATES_PATH = ML_DIR / "tray_templates.json"

_DEFAULT = "school-v"


def list_tray_types() -> list[dict]:
    data = _load_all()
    return [
        {
            "id": k,
            "name": v.get("name", k),
            "description": v.get("description", ""),
            "slot_count": len(v.get("slots") or []),
        }
        for k, v in data.items()
    ]


def _load_all() -> dict:
    if not TEMPLATES_PATH.exists():
        return {}
    with open(TEMPLATES_PATH, encoding="utf-8") as f:
        return json.load(f)


def get_tray_slots(tray_type: str | None) -> tuple[str, list[tuple[float, float, float, float]]]:
    data = _load_all()
    key = (tray_type or _DEFAULT).strip().lower()
    if key not in data:
        key = _DEFAULT
    entry = data.get(key) or data.get(_DEFAULT) or {}
    slots = entry.get("slots") or []
    ratios: list[tuple[float, float, float, float]] = []
    for s in sorted(slots, key=lambda x: x.get("id", 0)):
        ratios.append((float(s["x"]), float(s["y"]), float(s["w"]), float(s["h"])))
    return key, ratios
