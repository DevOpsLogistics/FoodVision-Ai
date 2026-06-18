"""
Cắt ngăn khay — warp phối cảnh + grid thích ứng + template.
Hỗ trợ ảnh chụp chéo / khay nghiêng.
"""
from __future__ import annotations

import cv2
import numpy as np

from crop_tray import CANON_H, CANON_W, find_tray_corners_robust, warp_tray


def _warp_box_to_original(
    box: tuple[float, float, float, float],
    M_inv: np.ndarray,
    img_w: int,
    img_h: int,
) -> tuple[int, int, int, int]:
    x, y, bw, bh = box
    pts = np.float32([
        [x * CANON_W, y * CANON_H],
        [(x + bw) * CANON_W, y * CANON_H],
        [(x + bw) * CANON_W, (y + bh) * CANON_H],
        [x * CANON_W, (y + bh) * CANON_H],
    ]).reshape(-1, 1, 2)
    mapped = cv2.perspectiveTransform(pts, M_inv).reshape(-1, 2)
    xs, ys = mapped[:, 0], mapped[:, 1]
    x0 = int(max(0, np.floor(xs.min())))
    y0 = int(max(0, np.floor(ys.min())))
    x1 = int(min(img_w, np.ceil(xs.max())))
    y1 = int(min(img_h, np.ceil(ys.max())))
    return x0, y0, max(1, x1 - x0), max(1, y1 - y0)


def _sort_slots(slots: list[tuple[float, float, float, float]]) -> list[tuple[float, float, float, float]]:
    """Sắp xếp ngăn: trái→phải, trên→dưới."""
    if not slots:
        return slots
    mid_x = np.mean([s[0] + s[2] / 2 for s in slots])
    left = sorted([s for s in slots if s[0] + s[2] / 2 < mid_x], key=lambda s: s[1])
    right = sorted([s for s in slots if s[0] + s[2] / 2 >= mid_x], key=lambda s: s[1])
    return left + right


def _blend_slots(
    grid_slots: list[tuple[float, float, float, float]],
    template_slots: list[tuple[float, float, float, float]],
    template_weight: float = 0.35,
) -> list[tuple[float, float, float, float]]:
    """Trộn vị trí grid (linh hoạt) với template (ổn định)."""
    g = _sort_slots(grid_slots)
    t = _sort_slots(template_slots)
    if len(g) != len(t) or not g:
        return g or t
    w = template_weight
    out: list[tuple[float, float, float, float]] = []
    for (gx, gy, gw, gh), (tx, ty, tw, th) in zip(g, t):
        out.append((
            gx * (1 - w) + tx * w,
            gy * (1 - w) + ty * w,
            gw * (1 - w) + tw * w,
            gh * (1 - w) + th * w,
        ))
    return out


def _crop_from_ratio_slots(
    warped: np.ndarray,
    M_inv: np.ndarray,
    slots: list[tuple[float, float, float, float]],
    original: np.ndarray,
    min_area: int,
) -> tuple[list[np.ndarray], list[tuple[int, int, int, int]]]:
    img_h, img_w = original.shape[:2]
    compartments: list[np.ndarray] = []
    bboxes: list[tuple[int, int, int, int]] = []
    for rx, ry, rw, rh in slots:
        x = max(0, int(rx * CANON_W))
        y = max(0, int(ry * CANON_H))
        bw = max(1, min(int(rw * CANON_W), CANON_W - x))
        bh = max(1, min(int(rh * CANON_H), CANON_H - y))
        if bw * bh < min_area * 0.35:
            continue
        crop = warped[y : y + bh, x : x + bw]
        if crop.size == 0:
            continue
        ox, oy, obw, obh = _warp_box_to_original((rx, ry, rw, rh), M_inv, img_w, img_h)
        compartments.append(crop.copy())
        bboxes.append((ox, oy, obw, obh))
    return compartments, bboxes


def _crop_direct(
    image_bgr: np.ndarray,
    slots: list[tuple[float, float, float, float]],
    min_area: int,
) -> tuple[list[np.ndarray], list[tuple[int, int, int, int]]]:
    h, w = image_bgr.shape[:2]
    compartments: list[np.ndarray] = []
    bboxes: list[tuple[int, int, int, int]] = []
    for rx, ry, rw, rh in slots:
        x = max(0, int(rx * w))
        y = max(0, int(ry * h))
        bw = max(1, min(int(rw * w), w - x))
        bh = max(1, min(int(rh * h), h - y))
        if bw * bh < min_area:
            continue
        crop = image_bgr[y : y + bh, x : x + bw]
        if crop.size == 0:
            continue
        compartments.append(crop.copy())
        bboxes.append((x, y, bw, bh))
    return compartments, bboxes


def crop_tray_candidates(
    image_bgr: np.ndarray,
    tray_type: str | None = None,
    min_area: int = 5000,
) -> list[tuple[list[np.ndarray], list[tuple[int, int, int, int]], str]]:
    """
    Trả về nhiều phương án cắt để engine chọn kết quả CNN tốt nhất.
    """
    from detect_tray_grid import detect_slots_auto, detect_slots_on_warped
    from tray_templates import get_tray_slots

    key, template_slots = get_tray_slots(tray_type)
    candidates: list[tuple[list[np.ndarray], list[tuple[int, int, int, int]], str]] = []

    corners = find_tray_corners_robust(image_bgr)
    if corners is not None:
        warped, M = warp_tray(image_bgr, corners)
        M_inv = cv2.invert(M)[1]

        grid_slots = detect_slots_on_warped(warped, tray_type=tray_type or key)
        tags: list[tuple[list, str]] = [
            (template_slots, f"warp-tpl-{key}"),
        ]
        # Tự phát hiện theo nội dung — tự nhận hướng vạch (dọc/ngang)
        auto_slots = detect_slots_auto(warped)
        if len(auto_slots) >= 4:
            tags.insert(0, (auto_slots, f"warp-auto-{key}"))
        if key not in ("tray-23", "tray-32u"):
            tags.insert(0, (grid_slots, f"warp-grid-{key}"))
            tags.append((_blend_slots(grid_slots, template_slots), f"warp-blend-{key}"))
        else:
            tags.insert(0, (grid_slots, f"warp-grid-{key}"))

        for slots, tag in tags:
            comps, boxes = _crop_from_ratio_slots(warped, M_inv, slots, image_bgr, min_area)
            if len(comps) >= 3:
                candidates.append((comps, boxes, tag))

    flat_comps, flat_boxes = _crop_direct(image_bgr, template_slots, min_area)
    if len(flat_comps) >= 3:
        candidates.append((flat_comps, flat_boxes, f"flat-{key}"))

    return candidates


def crop_tray_by_type(
    image_bgr: np.ndarray,
    tray_type: str | None = None,
    min_area: int = 5000,
) -> tuple[list[np.ndarray], list[tuple[int, int, int, int]], str]:
    """Cắt mặc định — ưu tiên warp+blend, fallback flat."""
    cands = crop_tray_candidates(image_bgr, tray_type=tray_type, min_area=min_area)
    if not cands:
        from tray_templates import get_tray_slots

        key, slots = get_tray_slots(tray_type)
        comps, boxes = _crop_direct(image_bgr, slots, min_area)
        return comps, boxes, f"flat-{key}"

    for comps, boxes, mode in cands:
        if "tpl" in mode or "grid" in mode:
            return comps, boxes, mode
    return cands[0]
