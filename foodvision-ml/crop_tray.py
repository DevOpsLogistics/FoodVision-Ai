"""
Cắt khay inox — MobileSAM (AI segment) mặc định.

Pipeline:
  1. Tìm 4 góc khay → chỉnh phối cảnh
  2. Bbox gợi ý từ tray_template.json
  3. MobileSAM segment từng ngăn → crop ôm sát đồ ăn

Fallback template thường nếu SAM lỗi hoặc FOODVISION_CROP=template.
"""
from __future__ import annotations

import json
import os
from pathlib import Path

import cv2
import numpy as np

ML_DIR = Path(__file__).resolve().parent
TEMPLATE_PATH = ML_DIR / "tray_template.json"

CANON_W = 1000
CANON_H = 820
CANON_DST = np.float32([
    [0, 0],
    [CANON_W - 1, 0],
    [CANON_W - 1, CANON_H - 1],
    [0, CANON_H - 1],
])

# Fallback nếu thiếu file template
_DEFAULT_SLOTS: list[tuple[float, float, float, float]] = [
    (0.018, 0.017, 0.525, 0.463),
    (0.018, 0.515, 0.525, 0.468),
    (0.579, 0.017, 0.403, 0.313),
    (0.579, 0.365, 0.403, 0.266),
    (0.579, 0.665, 0.403, 0.318),
]


def _load_template() -> list[tuple[float, float, float, float]]:
    if not TEMPLATE_PATH.exists():
        return _DEFAULT_SLOTS
    with open(TEMPLATE_PATH, encoding="utf-8") as f:
        data = json.load(f)
    slots = data.get("slots") or []
    out: list[tuple[float, float, float, float]] = []
    for s in sorted(slots, key=lambda x: x.get("id", 0)):
        out.append((float(s["x"]), float(s["y"]), float(s["w"]), float(s["h"])))
    return out or _DEFAULT_SLOTS


def _order_corners(pts: np.ndarray) -> np.ndarray:
    pts = pts.reshape(4, 2).astype(np.float32)
    s = pts.sum(axis=1)
    d = np.diff(pts, axis=1).reshape(-1)
    ordered = np.zeros((4, 2), dtype=np.float32)
    ordered[0] = pts[np.argmin(s)]
    ordered[2] = pts[np.argmax(s)]
    ordered[1] = pts[np.argmin(d)]
    ordered[3] = pts[np.argmax(d)]
    return ordered


def _score_quad(approx: np.ndarray, img_area: float) -> float:
    pts = approx.reshape(4, 2).astype(np.float32)
    area = cv2.contourArea(pts)
    if area < img_area * 0.12:
        return 0.0
    rect = cv2.minAreaRect(pts)
    rw, rh = rect[1]
    if rw < 1 or rh < 1:
        return 0.0
    area_ratio = area / img_area
    if area_ratio > 0.95:
        return 0.0
    return area_ratio * (area / (rw * rh))


def find_tray_corners(img: np.ndarray) -> np.ndarray | None:
    h, w = img.shape[:2]
    img_area = h * w
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (7, 7), 0)
    candidates: list[tuple[float, np.ndarray]] = []

    for low, high in [(30, 100), (50, 150), (70, 200)]:
        edges = cv2.Canny(blur, low, high)
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 5))
        edges = cv2.dilate(edges, kernel, iterations=2)
        edges = cv2.morphologyEx(edges, cv2.MORPH_CLOSE, kernel, iterations=2)
        contours, _ = cv2.findContours(edges, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
        for cnt in sorted(contours, key=cv2.contourArea, reverse=True)[:20]:
            peri = cv2.arcLength(cnt, True)
            for eps in (0.015, 0.02, 0.025, 0.03):
                approx = cv2.approxPolyDP(cnt, eps * peri, True)
                if len(approx) == 4 and cv2.isContourConvex(approx):
                    score = _score_quad(approx, img_area)
                    if score > 0.05:
                        candidates.append((score, _order_corners(approx)))

    if not candidates:
        _, bright = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        bright = cv2.morphologyEx(bright, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8), 2)
        contours, _ = cv2.findContours(bright, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        for cnt in sorted(contours, key=cv2.contourArea, reverse=True)[:10]:
            approx = cv2.approxPolyDP(cnt, 0.02 * cv2.arcLength(cnt, True), True)
            if len(approx) == 4:
                score = _score_quad(approx, img_area)
                if score > 0.05:
                    candidates.append((score, _order_corners(approx)))

    if not candidates:
        return None
    candidates.sort(key=lambda x: x[0], reverse=True)
    return candidates[0][1]


def find_tray_corners_robust(img: np.ndarray) -> np.ndarray | None:
    """Tìm 4 góc khay — hỗ trợ ảnh chụp chéo (nhiều fallback)."""
    h, w = img.shape[:2]
    img_area = h * w
    candidates: list[tuple[float, np.ndarray]] = []

    def _add(corners: np.ndarray | None, bonus: float = 0.0) -> None:
        if corners is None:
            return
        score = _score_quad(corners.reshape(-1, 1, 2), img_area) + bonus
        if score > 0.04:
            candidates.append((score, corners))

    _add(find_tray_corners(img), bonus=0.02)

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (7, 7), 0)

    for thresh_fn in (
        lambda g: cv2.Canny(g, 40, 120),
        lambda g: cv2.adaptiveThreshold(g, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 21, 4),
    ):
        edges = thresh_fn(blur)
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 5))
        edges = cv2.morphologyEx(edges, cv2.MORPH_CLOSE, kernel, iterations=2)
        contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        for cnt in sorted(contours, key=cv2.contourArea, reverse=True)[:8]:
            area = cv2.contourArea(cnt)
            if area < img_area * 0.12 or area > img_area * 0.93:
                continue
            rect = cv2.minAreaRect(cnt)
            box = cv2.boxPoints(rect)
            _add(_order_corners(box.astype(np.float32)))

    # Khay inox sáng hơn nền — contour vùng sáng trung tâm
    _, bright = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    bright = cv2.morphologyEx(bright, cv2.MORPH_CLOSE, np.ones((11, 11), np.uint8), 2)
    contours, _ = cv2.findContours(bright, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    for cnt in sorted(contours, key=cv2.contourArea, reverse=True)[:5]:
        area = cv2.contourArea(cnt)
        if area < img_area * 0.15 or area > img_area * 0.92:
            continue
        peri = cv2.arcLength(cnt, True)
        for eps in (0.02, 0.03, 0.04):
            approx = cv2.approxPolyDP(cnt, eps * peri, True)
            if len(approx) == 4 and cv2.isContourConvex(approx):
                _add(_order_corners(approx))
                break
        else:
            rect = cv2.minAreaRect(cnt)
            _add(_order_corners(cv2.boxPoints(rect).astype(np.float32)))

    if not candidates:
        return None
    candidates.sort(key=lambda x: x[0], reverse=True)
    return candidates[0][1]


def warp_tray(img: np.ndarray, corners: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    M = cv2.getPerspectiveTransform(corners, CANON_DST)
    warped = cv2.warpPerspective(img, M, (CANON_W, CANON_H))
    return warped, M


def _ratios_to_boxes(
    ratios: list[tuple[float, float, float, float]],
    width: int,
    height: int,
) -> list[tuple[int, int, int, int]]:
    boxes = []
    for rx, ry, rw, rh in ratios:
        x = int(rx * width)
        y = int(ry * height)
        bw = int(rw * width)
        bh = int(rh * height)
        x = max(0, min(x, width - 1))
        y = max(0, min(y, height - 1))
        bw = max(1, min(bw, width - x))
        bh = max(1, min(bh, height - y))
        boxes.append((x, y, bw, bh))
    return boxes


def _crop_mode() -> str:
    mode = os.environ.get("FOODVISION_CROP", "sam").strip().lower()
    if mode in ("sam", "mobile_sam", "ai"):
        return "sam"
    return "template"


def _crop_with_sam(
    warped: np.ndarray,
    hint_boxes: list[tuple[int, int, int, int]],
) -> tuple[list[np.ndarray], list[tuple[int, int, int, int]]] | None:
    try:
        from crop_tray_sam import segment_tray_with_sam
        crops, boxes = segment_tray_with_sam(warped, hint_boxes)
        if crops:
            return crops, boxes
    except Exception:
        pass
    return None


def _bbox_warp_to_original(
    box: tuple[int, int, int, int],
    M_inv: np.ndarray,
    img_w: int,
    img_h: int,
) -> tuple[int, int, int, int]:
    x, y, bw, bh = box
    corners = np.float32([
        [x, y], [x + bw, y], [x + bw, y + bh], [x, y + bh],
    ]).reshape(-1, 1, 2)
    mapped = cv2.perspectiveTransform(corners, M_inv).reshape(-1, 2)
    xs, ys = mapped[:, 0], mapped[:, 1]
    x0 = int(max(0, np.floor(xs.min())))
    y0 = int(max(0, np.floor(ys.min())))
    x1 = int(min(img_w, np.ceil(xs.max())))
    y1 = int(min(img_h, np.ceil(ys.max())))
    return x0, y0, max(1, x1 - x0), max(1, y1 - y0)


def crop_tray_compartments_from_array(
    img: np.ndarray,
    min_area: int = 5000,
) -> tuple[np.ndarray, list[np.ndarray], list[tuple[int, int, int, int]], str]:
    if img is None or img.size == 0:
        raise ValueError("Ảnh không hợp lệ")

    original = img.copy()
    img_h, img_w = img.shape[:2]
    compartments: list[np.ndarray] = []
    bounding_boxes: list[tuple[int, int, int, int]] = []
    ratios = _load_template()

    # Cắt thẳng trên ảnh gốc — ổn định với ảnh chụp từ trên (không warp)
    mode = "template-direct"
    for box in _ratios_to_boxes(ratios, img_w, img_h):
        x, y, w, h = box
        crop = original[y : y + h, x : x + w]
        if crop.size == 0 or w * h < min_area:
            continue
        compartments.append(crop)
        bounding_boxes.append(box)

    return original, compartments, bounding_boxes, mode


def crop_tray_compartments(image_path: str, min_area: int = 5000):
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError(f"Không thể đọc ảnh từ {image_path}")
    original, compartments, bounding_boxes, _mode = crop_tray_compartments_from_array(
        img, min_area=min_area
    )
    return original, compartments, bounding_boxes
