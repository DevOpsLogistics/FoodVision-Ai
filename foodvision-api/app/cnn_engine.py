"""
CNN engine — YOLO-World detect + CNN classify (mạnh nhất).
Fallback: template + SAM + CNN.
"""
from __future__ import annotations

import io
import json
import os
import shutil
import sys
import tempfile
from pathlib import Path

import cv2
import numpy as np
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / "foodvision-api" / ".env", override=True)
ML_DIR = ROOT / "foodvision-ml"
SOURCE_MODEL = ML_DIR / "food_model_best.keras"
CLASSES_PATH = ML_DIR / "class_names.json"
MODEL_CLASSES_PATH = ML_DIR / "class_names_model.json"

_model = None
_class_names: list[str] | None = None
_model_class_names: list[str] | None = None
_ready = False
_error: str | None = None
_cache_model: Path | None = None

# ca_kho bị tắt — dễ nhầm với sườn nướng (màu nâu đậm tương tự)
_DISABLED_CLASSES = frozenset({"kim_chi", "rau_xao", "rau_luoc", "mam_vung", "ca_kho"})

# Gộp nhãn: thịt kho → thịt kho trứng (cùng món, tránh tách 2 lớp)
_MERGE_MAP = {"thit_kho": "thit_kho_trung"}


def _merge_label(class_name: str) -> str:
    return _MERGE_MAP.get(class_name, class_name)

# Khay V inox — fallback school-v (template load từ tray_templates.json)
TRAY_SLOTS: list[tuple[float, float, float, float]] = [
    (0.018, 0.017, 0.525, 0.463),
    (0.018, 0.515, 0.525, 0.468),
    (0.579, 0.017, 0.403, 0.313),
    (0.579, 0.365, 0.403, 0.266),
    (0.579, 0.665, 0.403, 0.318),
]
CROP_VERSION = "warp-auto-v10"

# Không gán nhãn cứng theo vị trí — khay khác nhau có layout khác nhau
SLOT_HINTS: dict[int, str] = {}

# Món thường chỉ có 1 phần / khay
_SINGLE_SERVING = frozenset({"com_trang", "canh_rau", "canh_chua"})


def _cache_dir() -> Path:
    base = os.environ.get("LOCALAPPDATA") or os.environ.get("TEMP") or tempfile.gettempdir()
    d = Path(base) / "FoodVision"
    d.mkdir(parents=True, exist_ok=True)
    return d


def _ensure_model_file() -> Path:
    global _cache_model
    if _cache_model and _cache_model.exists():
        return _cache_model
    if not SOURCE_MODEL.exists():
        raise FileNotFoundError(f"Không tìm thấy {SOURCE_MODEL}")
    dest = _cache_dir() / "food_model_best.keras"
    if not dest.exists() or dest.stat().st_mtime < SOURCE_MODEL.stat().st_mtime:
        shutil.copy2(SOURCE_MODEL, dest)
    _cache_model = dest
    return dest


def _crop_mode() -> str:
    mode = os.environ.get("FOODVISION_CROP", "yolo").strip().lower()
    if mode in ("yolo", "yolo-world", "world"):
        return "yolo"
    if mode in ("sam", "mobile_sam", "ai"):
        return "sam"
    return "template"


def _iou(a: tuple[int, int, int, int], b: tuple[int, int, int, int]) -> float:
    ax, ay, aw, ah = a
    bx, by, bw, bh = b
    x0 = max(ax, bx)
    y0 = max(ay, by)
    x1 = min(ax + aw, bx + bw)
    y1 = min(ay + ah, by + bh)
    inter = max(0, x1 - x0) * max(0, y1 - y0)
    if inter == 0:
        return 0.0
    union = aw * ah + bw * bh - inter
    return inter / union if union > 0 else 0.0


def _nms_items(items: list[dict], iou_thresh: float = 0.30) -> list[dict]:
    def _box(item: dict) -> tuple[int, int, int, int]:
        b = item["bbox"]
        return (
            int(b["x"] * 10000),
            int(b["y"] * 10000),
            int(b["w"] * 10000),
            int(b["h"] * 10000),
        )

    def _center(item: dict) -> tuple[float, float]:
        b = item["bbox"]
        return b["x"] + b["w"] / 2, b["y"] + b["h"] / 2

    kept: list[dict] = []
    for item in sorted(items, key=lambda x: x["confidence"], reverse=True):
        box = _box(item)
        cx, cy = _center(item)
        dup = False
        for k in kept:
            if _iou(box, _box(k)) >= iou_thresh:
                dup = True
                break
            kcx, kcy = _center(k)
            if abs(cx - kcx) < 0.12 and abs(cy - kcy) < 0.12:
                dup = True
                break
        if not dup:
            kept.append(item)
    for i, item in enumerate(kept):
        item["index"] = i
        # Giữ slot gốc theo vị trí ngăn khay — không gán lại 1,2,3...
    return kept


def _raw_scores(comp: np.ndarray) -> dict[str, float]:
    img_resized = cv2.resize(comp, (224, 224))
    img_rgb = cv2.cvtColor(img_resized, cv2.COLOR_BGR2RGB)
    scores = _model.predict(np.expand_dims(img_rgb, axis=0), verbose=0)[0]
    names = _model_class_names or _class_names or []
    return {names[i]: float(scores[i]) for i in range(len(names))}


def _pick_best_class(scores: dict[str, float], extra_exclude: set[str] | None = None) -> tuple[str, float]:
    skip = _DISABLED_CLASSES | (extra_exclude or set())
    for name, conf in sorted(scores.items(), key=lambda x: x[1], reverse=True):
        if name not in skip:
            return name, conf
    order = sorted(scores.keys(), key=lambda k: scores[k], reverse=True)
    return order[0], scores[order[0]]


def _looks_like_egg(crop: np.ndarray) -> bool:
    """Trứng chiên: lòng đỏ cam sáng + lòng trắng. Tránh nhầm sang thịt nâu."""
    hsv = cv2.cvtColor(cv2.resize(crop, (96, 96)), cv2.COLOR_BGR2HSV)
    h, s, v = hsv[:, :, 0], hsv[:, :, 1], hsv[:, :, 2]
    yolk = ((h >= 16) & (h <= 45) & (s > 90) & (v > 165)).mean()
    egg_white = ((s < 55) & (v > 170)).mean()
    return float(yolk) > 0.10 or (float(yolk) > 0.05 and float(egg_white) > 0.18)


def _looks_like_brown_meat(crop: np.ndarray) -> bool:
    """Thịt nâu (sườn nướng / thịt kho): nhiều vùng nâu-đỏ SẬM, ít trắng/xanh.
    Dùng để chặn nhầm sang cơm trắng / canh khi crop dính khay inox sáng.
    Loại trừ trứng (lòng đỏ cam sáng)."""
    if _looks_like_egg(crop):
        return False
    hsv = cv2.cvtColor(cv2.resize(crop, (96, 96)), cv2.COLOR_BGR2HSV)
    h, s, v = hsv[:, :, 0], hsv[:, :, 1], hsv[:, :, 2]
    # nâu-đỏ sậm: hue đỏ/nâu, độ sáng vừa-thấp (không phải cam lòng đỏ sáng)
    brown = (((h <= 18) | (h >= 168)) & (s > 60) & (v > 35) & (v < 170)).mean()
    bright_orange = ((h >= 16) & (h <= 45) & (s > 85) & (v > 165)).mean()
    white = ((s < 45) & (v > 150)).mean()
    green = ((h >= 32) & (h <= 88) & (s > 30) & (v > 35)).mean()
    return (
        float(brown) > 0.32
        and float(bright_orange) < 0.08
        and float(white) < 0.30
        and float(green) < 0.12
    )


def _looks_like_rice(crop: np.ndarray) -> bool:
    """Cơm trắng: vùng sáng, ít màu vàng/nâu (đậu hũ chiên không pass)."""
    if _looks_like_brown_meat(crop):
        return False
    hsv = cv2.cvtColor(cv2.resize(crop, (96, 96)), cv2.COLOR_BGR2HSV)
    white = ((hsv[:, :, 1] < 50) & (hsv[:, :, 2] > 125)).mean()
    golden = ((hsv[:, :, 0] >= 8) & (hsv[:, :, 0] <= 40) & (hsv[:, :, 1] > 45)).mean()
    return float(white) > 0.22 and float(golden) < 0.18


def _pick_brown_meat(scores: dict[str, float]) -> tuple[str, float]:
    """Chọn món thịt nâu khả dĩ nhất theo điểm model."""
    candidates = {c: scores[c] for c in ("suon_nuong", "thit_kho_trung") if c in scores}
    if not candidates:
        return _pick_best_class(scores, {"com_trang", "canh_rau"})
    name = max(candidates, key=candidates.get)
    return name, max(candidates[name], 0.6)


def _looks_like_fried_tofu(crop: np.ndarray) -> bool:
    hsv = cv2.cvtColor(cv2.resize(crop, (96, 96)), cv2.COLOR_BGR2HSV)
    golden = ((hsv[:, :, 0] >= 8) & (hsv[:, :, 0] <= 38) & (hsv[:, :, 1] > 35) & (hsv[:, :, 2] > 55)).mean()
    white = ((hsv[:, :, 1] < 45) & (hsv[:, :, 2] > 140)).mean()
    return float(golden) > 0.15 and float(white) < 0.20


def _looks_like_greens(crop: np.ndarray) -> bool:
    hsv = cv2.cvtColor(cv2.resize(crop, (96, 96)), cv2.COLOR_BGR2HSV)
    green = (
        (hsv[:, :, 0] >= 32)
        & (hsv[:, :, 0] <= 88)
        & (hsv[:, :, 1] > 30)
        & (hsv[:, :, 2] > 35)
    ).mean()
    return float(green) > 0.12


def _looks_like_canh(crop: np.ndarray) -> bool:
    """Canh nước trong — sáng, ít màu, không phải cơm/rau/đậu phộng."""
    if _looks_like_rice(crop) or _looks_like_greens(crop):
        return False
    hsv = cv2.cvtColor(cv2.resize(crop, (96, 96)), cv2.COLOR_BGR2HSV)
    broth = ((hsv[:, :, 2] > 85) & (hsv[:, :, 1] < 58)).mean()
    dark = (hsv[:, :, 2] < 60).mean()
    tan = (
        (hsv[:, :, 0] >= 8)
        & (hsv[:, :, 0] <= 35)
        & (hsv[:, :, 1] > 25)
        & (hsv[:, :, 2] > 70)
    ).mean()
    if float(tan) > 0.18:
        return False
    return float(broth) > 0.26 and float(dark) < 0.35


def _looks_like_ca_kho(crop: np.ndarray) -> bool:
    hsv = cv2.cvtColor(cv2.resize(crop, (96, 96)), cv2.COLOR_BGR2HSV)
    dark = (
        (hsv[:, :, 0] >= 0)
        & (hsv[:, :, 0] <= 30)
        & (hsv[:, :, 2] < 130)
        & (hsv[:, :, 1] > 15)
    ).mean()
    return float(dark) > 0.12


def _apply_color_label(comp: np.ndarray, scores: dict[str, float]) -> tuple[str, float] | None:
    if _looks_like_rice(comp) and "com_trang" in scores:
        return "com_trang", max(scores["com_trang"], 0.85)
    if _looks_like_canh(comp) and "canh_rau" in scores:
        return "canh_rau", max(scores["canh_rau"], 0.68)
    if _looks_like_greens(comp) and "canh_rau" in scores:
        return "canh_rau", max(scores["canh_rau"], 0.62)
    return None


def _best_class_excluding(scores: dict[str, float], exclude: set[str]) -> tuple[str, float] | None:
    skip = exclude | _DISABLED_CLASSES
    for name, conf in sorted(scores.items(), key=lambda x: x[1], reverse=True):
        if name not in skip and conf >= 0.30:
            return name, conf
    return None


def _enforce_unique_classes(
    items: list[dict], compartments: list[np.ndarray]
) -> list[dict]:
    """Mỗi món chỉ xuất hiện tối đa 1 lần trên khay.

    Khi hai ngăn trùng nhãn: giữ ngăn có điểm cao nhất (riêng cơm ưu tiên ngăn
    'trông giống cơm' nhất), ngăn còn lại đẩy sang lớp có điểm cao nhất CHƯA bị
    dùng. Đây là ràng buộc cứng — ổn định hơn việc lọc màu từng món."""
    if len(items) < 2:
        return items

    from collections import defaultdict

    groups: dict[str, list[dict]] = defaultdict(list)
    for it in items:
        groups[it["class_name"]].append(it)

    used: set[str] = {name for name in groups}

    for name, group in list(groups.items()):
        if len(group) < 2:
            continue
        if name == "com_trang":
            group.sort(
                key=lambda it: (
                    _looks_like_rice(compartments[it["index"]])
                    if it["index"] < len(compartments)
                    else False,
                    it["confidence"],
                ),
                reverse=True,
            )
        else:
            group.sort(key=lambda it: it["confidence"], reverse=True)

        for dup in group[1:]:
            idx = dup["index"]
            scores = _raw_scores(compartments[idx]) if idx < len(compartments) else {}
            alt = None
            for cand, conf in sorted(scores.items(), key=lambda x: x[1], reverse=True):
                if cand in _DISABLED_CLASSES or cand in used:
                    continue
                alt = (cand, conf)
                break
            if alt:
                dup["class_name"] = alt[0]
                dup["confidence"] = round(max(alt[1], 0.45), 4)
                used.add(alt[0])
    return items


def _refine_predictions(items: list[dict], compartments: list[np.ndarray]) -> list[dict]:
    """Sửa nhầm cơm / trùng món sau CNN."""
    if not items or not compartments:
        return items

    for it in items:
        idx = it["index"]
        if idx >= len(compartments):
            continue
        comp = compartments[idx]
        scores = _raw_scores(comp)

        if it["class_name"] in ("com_trang", "canh_rau") and _looks_like_brown_meat(comp):
            name, conf = _pick_brown_meat(scores)
            it["class_name"], it["confidence"] = name, round(conf, 4)
            continue

        if it["class_name"] == "com_trang" and not _looks_like_rice(comp):
            alt = _best_class_excluding(scores, {"com_trang"})
            if alt:
                it["class_name"], it["confidence"] = alt[0], round(alt[1], 4)
            elif _looks_like_fried_tofu(comp) and "dau_hu_chien" in scores:
                it["class_name"] = "dau_hu_chien"
                it["confidence"] = round(max(scores["dau_hu_chien"], 0.55), 4)

        if _looks_like_fried_tofu(comp) and it["class_name"] in ("com_trang", "trung_chien", "suon_nuong"):
            if "dau_hu_chien" in scores:
                it["class_name"] = "dau_hu_chien"
                it["confidence"] = round(max(scores["dau_hu_chien"], 0.58), 4)

        color_fix = _apply_color_label(comp, scores)
        if color_fix:
            name, conf = color_fix
            override = (
                name == "com_trang"
                or name == "canh_rau"
                or it["class_name"] in ("thit_kho", "thit_kho_trung", "canh_rau", "com_trang")
                or conf > it["confidence"] + 0.05
            )
            if override:
                it["class_name"], it["confidence"] = name, round(conf, 4)

        if _looks_like_canh(comp) and it["class_name"] == "com_trang":
            it["class_name"] = "canh_rau"
            it["confidence"] = round(max(scores.get("canh_rau", 0.5), 0.68), 4)

    for it in items:
        if it["class_name"] in _DISABLED_CLASSES:
            idx = it["index"]
            if idx < len(compartments):
                alt = _best_class_excluding(_raw_scores(compartments[idx]), set())
                if alt:
                    it["class_name"], it["confidence"] = alt[0], round(alt[1], 4)

    # Ràng buộc cứng: mỗi món chỉ xuất hiện 1 lần trên khay
    items = _enforce_unique_classes(items, compartments)

    return items


def _predict_crop(comp: np.ndarray, slot_idx: int) -> tuple[str, float]:
    """CNN — nếu confidence thấp, thử lớp thứ 2 nếu gần bằng."""
    scores = _raw_scores(comp)
    class_name, confidence = _pick_best_class(scores)
    order = sorted(
        (n for n in scores if n not in _DISABLED_CLASSES),
        key=lambda k: scores[k],
        reverse=True,
    )

    if confidence < 0.72 and len(order) > 1:
        second_name = order[1]
        second_conf = scores[second_name]
        if second_conf >= confidence - 0.18:
            if class_name in ("com_trang", "trung_chien") and second_name not in ("com_trang", "trung_chien"):
                class_name, confidence = second_name, second_conf

    if class_name == "com_trang" and not _looks_like_rice(comp):
        if _looks_like_brown_meat(comp):
            class_name, confidence = _pick_brown_meat(scores)
        elif _looks_like_canh(comp) and "canh_rau" in scores:
            class_name, confidence = "canh_rau", max(scores["canh_rau"], 0.68)
        else:
            alt = _best_class_excluding(scores, {"com_trang"})
            if alt:
                class_name, confidence = alt
            elif _looks_like_fried_tofu(comp) and "dau_hu_chien" in scores:
                class_name, confidence = "dau_hu_chien", max(scores.get("dau_hu_chien", 0.5), 0.55)

    # Thịt nâu (sườn / thịt kho) hay bị nhầm cơm/canh khi crop dính khay inox sáng
    if class_name in ("com_trang", "canh_rau") and _looks_like_brown_meat(comp):
        class_name, confidence = _pick_brown_meat(scores)

    hint = SLOT_HINTS.get(slot_idx)
    if hint and hint in scores:
        hint_conf = scores[hint]
        if hint != class_name and hint_conf >= confidence - 0.22:
            class_name, confidence = hint, hint_conf
    return class_name, confidence


def _fix_rice_soup_swap(items: list[dict]) -> list[dict]:
    return items


def _items_from_crops(
    compartments: list,
    bboxes: list,
    img_w: int,
    img_h: int,
    min_confidence: float,
    keep_all: bool = False,
) -> list[dict]:
    items = []
    for idx, (comp, bbox) in enumerate(zip(compartments, bboxes)):
        if comp is None or comp.size == 0:
            continue
        class_name, confidence = _predict_crop(comp, idx)
        if _looks_like_canh(comp) and confidence < min_confidence:
            class_name, confidence = "canh_rau", max(confidence, 0.55)
        # keep_all: ngăn đã xác thực có đồ ăn (warp-auto) — giữ nhãn đoán tốt nhất
        if not keep_all:
            if confidence < min_confidence:
                continue
            if class_name == "com_trang" and confidence < 0.60 and not _looks_like_rice(comp):
                continue
            if confidence < 0.40 and not (_looks_like_canh(comp) or _looks_like_greens(comp)):
                continue
        elif class_name == "com_trang" and not _looks_like_rice(comp):
            alt = _best_class_excluding(scores=_raw_scores(comp), exclude={"com_trang"})
            if alt:
                class_name, confidence = alt
        x, y, w, h = bbox
        items.append({
            "index": idx,
            "slot": idx + 1,
            "class_name": class_name,
            "confidence": round(confidence, 4),
            "bbox": {
                "x": round(x / img_w, 4),
                "y": round(y / img_h, 4),
                "w": round(w / img_w, 4),
                "h": round(h / img_h, 4),
            },
        })
    return _fix_rice_soup_swap(items)


def status() -> dict:
    yolo_info = {"ready": False, "error": None}
    sam_info = {"ready": False, "error": None}
    if str(ML_DIR) not in sys.path:
        sys.path.insert(0, str(ML_DIR))
    try:
        from detect_yolo import yolo_status
        yolo_info = yolo_status()
    except Exception:
        pass
    try:
        from crop_tray_sam import sam_status
        sam_info = sam_status()
    except Exception:
        pass
    return {
        "ready": _ready,
        "engine": f"MobileNetV2 + {CROP_VERSION}",
        "crop": CROP_VERSION,
        "yolo": yolo_info,
        "sam": sam_info,
        "model_path": str(_cache_model or SOURCE_MODEL),
        "model_exists": SOURCE_MODEL.exists(),
        "classes": _class_names or [],
        "class_count": len(_class_names or []),
        "error": _error,
    }


def init_engine() -> dict:
    global _model, _class_names, _model_class_names, _ready, _error

    if _ready and _model is not None:
        return status()

    _ready = False
    _error = None

    try:
        cache = _cache_dir()
        os.environ["TEMP"] = str(cache)
        os.environ["TMP"] = str(cache)
        os.environ.setdefault("TF_CPP_MIN_LOG_LEVEL", "2")
        os.environ.setdefault("TF_ENABLE_ONEDNN_OPTS", "0")

        import tensorflow as tf  # noqa: F401

        model_classes_file = MODEL_CLASSES_PATH if MODEL_CLASSES_PATH.exists() else CLASSES_PATH
        with open(model_classes_file, encoding="utf-8") as f:
            _model_class_names = json.load(f)
        with open(CLASSES_PATH, encoding="utf-8") as f:
            _class_names = json.load(f)

        model_path = _ensure_model_file()
        try:
            _model = tf.keras.models.load_model(str(model_path))
        except OSError:
            _model = tf.keras.models.load_model(io.BytesIO(model_path.read_bytes()))

        if str(ML_DIR) not in sys.path:
            sys.path.insert(0, str(ML_DIR))
        from predict import predict_image

        dummy = np.zeros((120, 120, 3), dtype=np.uint8)
        predict_image(_model, _model_class_names, dummy)

        mode = _crop_mode()
        if mode == "yolo":
            from detect_yolo import preload_yolo
            preload_yolo()  # tải nền, không chặn nếu lỗi
        elif mode == "sam":
            from crop_tray_sam import preload_sam
            sam = preload_sam()
            if not sam["ready"]:
                _error = f"MobileSAM: {sam['error']}"
                _ready = False
                return status()

        _ready = True
        _error = None
    except Exception as exc:
        _model = None
        _ready = False
        _error = str(exc)

    return status()


def is_ready() -> bool:
    return _ready and _model is not None


def _detect_yolo(image_bgr: np.ndarray) -> list[dict] | None:
    from detect_yolo import detect_foods_yolo

    comps, bboxes, _names, _confs = detect_foods_yolo(image_bgr)
    if len(comps) < 2:
        return None
    img_h, img_w = image_bgr.shape[:2]
    items = _items_from_crops(comps, bboxes, img_w, img_h, min_confidence=0.35)
    return _nms_items(items) if items else None


def _crop_tray_direct(
    image_bgr: np.ndarray,
    min_area: int = 5000,
    tray_type: str | None = None,
) -> tuple[list[np.ndarray], list[tuple[int, int, int, int]], str]:
    """Warp + template — hỗ trợ khay quay chéo."""
    if str(ML_DIR) not in sys.path:
        sys.path.insert(0, str(ML_DIR))
    from crop_tray_warp import crop_tray_by_type

    return crop_tray_by_type(image_bgr, tray_type=tray_type, min_area=min_area)


def _score_items(items: list[dict]) -> float:
    """Điểm cao hơn = kết quả cắt/t nhận diện tốt hơn."""
    if len(items) < 3:
        return float(len(items))
    score = 0.0
    for it in items:
        b = it["bbox"]
        area = b["w"] * b["h"]
        if area < 0.025:
            score -= 2.0
        elif area < 0.06:
            score -= 0.5
        else:
            score += min(area, 0.25) * 4
        score += float(it["confidence"]) * 0.5
    names = [_merge_label(it["class_name"]) for it in items]
    for i, a in enumerate(names):
        for b in names[i + 1 :]:
            if a == b == "com_trang":
                score -= 3.0
            elif a == b == "canh_rau":
                score -= 1.2
            elif a == b == "thit_kho_trung":
                score -= 2.0
            elif a == b:
                score -= 0.8
    if names.count("canh_rau") == 1:
        score += 1.5
    if names.count("com_trang") > 1:
        score -= 2.5
    return score


def _detect_from_compartments(
    image_bgr: np.ndarray,
    min_confidence: float,
    compartments: list,
    bboxes: list,
    keep_all: bool = False,
) -> list[dict]:
    img_h, img_w = image_bgr.shape[:2]
    items = _items_from_crops(compartments, bboxes, img_w, img_h, min_confidence, keep_all=keep_all)
    items = _refine_predictions(items, compartments)
    return _nms_items(items)


def _detect_template(
    image_bgr: np.ndarray,
    min_confidence: float,
    tray_type: str | None = None,
) -> tuple[list[dict], str]:
    if str(ML_DIR) not in sys.path:
        sys.path.insert(0, str(ML_DIR))
    from crop_tray_warp import crop_tray_candidates

    candidates: list[tuple[list, list, str]] = []

    if tray_type:
        candidates.extend(crop_tray_candidates(image_bgr, tray_type=tray_type))
    else:
        # Không biết loại khay — thử mọi layout, chọn kết quả CNN tốt nhất.
        # Ưu tiên crop tất định (tách khay theo màu → warp → chọn layout theo vị trí cơm).
        from detect_tray_grid import detect_tray_compartments
        from crop_tray_warp import crop_tray_auto
        from tray_templates import list_tray_types

        auto_comps, auto_boxes, auto_type = crop_tray_auto(image_bgr)
        if len(auto_comps) >= 3:
            candidates.append((auto_comps, auto_boxes, f"auto-det-{auto_type}"))

        grid_comps, grid_boxes, grid_mode = detect_tray_compartments(image_bgr)
        candidates.append((grid_comps, grid_boxes, grid_mode))
        for t in list_tray_types():
            candidates.extend(crop_tray_candidates(image_bgr, tray_type=t["id"]))

    best_items: list[dict] = []
    best_mode = "flat-school-v"
    best_score = -999.0

    for comps, boxes, mode in candidates:
        if len(comps) < 3:
            continue
        is_auto = "warp-auto" in mode
        is_det = mode.startswith("auto-det-")
        items = _detect_from_compartments(
            image_bgr, min_confidence, comps, boxes, keep_all=is_auto or is_det
        )
        score = _score_items(items)
        if not is_auto and not is_det and len(comps) >= 5 and len(items) < 5:
            score -= 4.0
        if is_det:
            # crop tất định theo hình học khay — đáng tin nhất, thưởng mạnh
            score += 8.0 + len(items) * 0.6
        elif is_auto:
            # ngăn cắt theo nội dung thật — thưởng theo độ phủ
            score += 5.0 + len(items) * 0.6
        elif "warp-grid" in mode:
            score += 3.0
        elif "warp" in mode:
            score += 2.0
        if mode.startswith("flat-"):
            score -= 2.5
        if os.environ.get("FOODVISION_DEBUG"):
            print(f"[score] {mode}: comps={len(comps)} items={len(items)} score={score:.2f} "
                  f"-> {[it['class_name'] for it in items]}")
        if score > best_score:
            best_score = score
            best_items = items
            best_mode = mode

    if best_items:
        return best_items, best_mode

    tpl_comps, tpl_boxes, tpl_mode = _crop_tray_direct(image_bgr, tray_type=tray_type)
    items = _detect_from_compartments(image_bgr, min_confidence, tpl_comps, tpl_boxes)
    return items, tpl_mode


def predict_tray(
    image_bgr: np.ndarray,
    min_confidence: float = 0.35,
    tray_type: str | None = None,
) -> dict:
    if not is_ready():
        init_engine()
    if not is_ready():
        raise RuntimeError(_error or "CNN chưa sẵn sàng")

    if str(ML_DIR) not in sys.path:
        sys.path.insert(0, str(ML_DIR))

    img_h, img_w = image_bgr.shape[:2]
    items, crop_mode = _detect_template(image_bgr, min_confidence, tray_type=tray_type)
    return {"items": items, "image_size": {"w": img_w, "h": img_h}, "crop": crop_mode}
