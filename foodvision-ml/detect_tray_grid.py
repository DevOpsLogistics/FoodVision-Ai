"""
Tự phát hiện ngăn khay inox từ vạch ngăn — không phụ thuộc 1 layout cố định.
"""
from __future__ import annotations

import cv2
import numpy as np

from crop_tray import CANON_H, CANON_W, find_tray_corners_robust, warp_tray


def _cluster_lines(positions: list[float], min_gap: float) -> list[float]:
    if not positions:
        return []
    positions = sorted(positions)
    groups: list[list[float]] = [[positions[0]]]
    for p in positions[1:]:
        if p - groups[-1][-1] < min_gap:
            groups[-1].append(p)
        else:
            groups.append([p])
    return [float(np.mean(g)) for g in groups]


def _divider_peaks(region: np.ndarray, axis: int, min_rel: float = 0.07) -> list[float]:
    """axis=0: tìm vạch ngang (chia hàng), axis=1: vạch dọc."""
    gray = cv2.cvtColor(region, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (5, 5), 0)
    edges = cv2.Canny(blur, 45, 130)
    size = region.shape[0] if axis == 0 else region.shape[1]
    proj = np.mean(edges, axis=1 if axis == 0 else 0).astype(np.float64)
    k = max(5, size // 35) | 1
    kernel = np.ones(k) / k
    proj = np.convolve(proj, kernel, mode="same")
    threshold = float(np.max(proj)) * 0.42
    peaks: list[float] = []
    for i in range(1, len(proj) - 1):
        if proj[i] > threshold and proj[i] >= proj[i - 1] and proj[i] >= proj[i + 1]:
            r = i / size
            if min_rel < r < 1.0 - min_rel:
                peaks.append(r)
    return _cluster_lines(peaks, min_gap=0.06)


def _split_range(start: float, end: float, cuts: list[float]) -> list[tuple[float, float]]:
    pts = [start] + [c for c in cuts if start + 0.05 < c < end - 0.05] + [end]
    return [(pts[i], pts[i + 1]) for i in range(len(pts) - 1)]


def _find_vertical_split(warped: np.ndarray) -> float:
    """Tìm tỉ lệ x (0..1) của vạch dọc chính."""
    h, w = warped.shape[:2]
    gray = cv2.cvtColor(warped, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (5, 5), 0)
    edges = cv2.Canny(blur, 45, 130)
    proj = np.mean(edges, axis=0).astype(np.float64)
    k = max(5, w // 35) | 1
    proj = np.convolve(proj, np.ones(k) / k, mode="same")
    x0, x1 = int(w * 0.35), int(w * 0.72)
    segment = proj[x0:x1]
    if segment.size == 0:
        return 0.55
    peak = int(np.argmax(segment)) + x0
    return peak / w


def _find_vertical_split_in_region(region: np.ndarray) -> float:
    h, w = region.shape[:2]
    if w < 20:
        return 0.5
    gray = cv2.cvtColor(region, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (5, 5), 0)
    edges = cv2.Canny(blur, 45, 130)
    proj = np.mean(edges, axis=0).astype(np.float64)
    k = max(5, w // 25) | 1
    proj = np.convolve(proj, np.ones(k) / k, mode="same")
    x0, x1 = int(w * 0.38), int(w * 0.62)
    segment = proj[x0:x1]
    if segment.size == 0:
        return 0.5
    peak = int(np.argmax(segment)) + x0
    return peak / w


def _find_horizontal_split(warped: np.ndarray) -> float:
    """Tìm tỉ lệ y (0..1) của vạch ngang chính (chia hàng trên/dưới)."""
    h, w = warped.shape[:2]
    gray = cv2.cvtColor(warped, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (5, 5), 0)
    edges = cv2.Canny(blur, 45, 130)
    proj = np.mean(edges, axis=1).astype(np.float64)
    k = max(5, h // 35) | 1
    proj = np.convolve(proj, np.ones(k) / k, mode="same")
    y0, y1 = int(h * 0.38), int(h * 0.62)
    segment = proj[y0:y1]
    if segment.size == 0:
        return 0.48
    peak = int(np.argmax(segment)) + y0
    return peak / h


def _slots_horizontal_23(warped: np.ndarray) -> list[tuple[float, float, float, float]]:
    """Layout 2 ngăn trên + 3 ngăn dưới."""
    h, w = warped.shape[:2]
    mid_y = _find_horizontal_split(warped)
    if mid_y < 0.40 or mid_y > 0.58:
        mid_y = 0.48

    pad = 0.035
    top_h = mid_y - pad
    bot_y = mid_y + pad * 0.5
    bot_h = 1.0 - bot_y - pad

    top = warped[: max(1, int(mid_y * h)), :]
    top_mid = _find_vertical_split_in_region(top)
    if top_mid < 0.38 or top_mid > 0.62:
        top_mid = 0.50

    groove = 0.04
    lx, lw = pad, top_mid - groove / 2 - pad
    rx, rw = top_mid + groove / 2, 1.0 - top_mid - groove / 2 - pad

    slots: list[tuple[float, float, float, float]] = [
        (lx, pad, max(0.15, lw), top_h),
        (rx, pad, max(0.15, rw), top_h),
    ]

    third = (1.0 - 2 * pad) / 3
    for i in range(3):
        x0 = pad + i * third
        slots.append((x0, bot_y, third - groove * 0.3, bot_h))

    return slots[:5]


def _slots_horizontal_32u(warped: np.ndarray) -> list[tuple[float, float, float, float]]:
    """Layout 3 ngăn trên + 2 ngăn dưới."""
    h, w = warped.shape[:2]
    mid_y = _find_horizontal_split(warped)
    if mid_y < 0.40 or mid_y > 0.58:
        mid_y = 0.52

    pad = 0.035
    top_h = mid_y - pad
    bot_y = mid_y + pad * 0.5
    bot_h = 1.0 - bot_y - pad
    groove = 0.04

    third = (1.0 - 2 * pad) / 3
    slots: list[tuple[float, float, float, float]] = []
    for i in range(3):
        x0 = pad + i * third
        slots.append((x0, pad, third - groove * 0.3, top_h))

    bottom = warped[max(1, int(mid_y * h)) :, :]
    bot_mid = _find_vertical_split_in_region(bottom)
    if bot_mid < 0.38 or bot_mid > 0.62:
        bot_mid = 0.50

    lx, lw = pad, bot_mid - groove / 2 - pad
    rx, rw = bot_mid + groove / 2, 1.0 - bot_mid - groove / 2 - pad
    slots.append((lx, bot_y, max(0.15, lw), bot_h))
    slots.append((rx, bot_y, max(0.15, rw), bot_h))

    return slots[:5]


def _metal_mask(bgr: np.ndarray) -> np.ndarray:
    hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV)
    v, s = hsv[:, :, 2], hsv[:, :, 1]
    return ((v > 135) & (s < 55)).astype(np.float64)


def _content_profile(strip_bgr: np.ndarray, axis: int) -> np.ndarray:
    """Tỉ lệ pixel 'có đồ ăn' theo trục: màu bão hoà HOẶC cơm (sáng + gồ ghề)."""
    hsv = cv2.cvtColor(strip_bgr, cv2.COLOR_BGR2HSV)
    s, v = hsv[:, :, 1], hsv[:, :, 2]
    colored = s > 55
    gray = cv2.cvtColor(strip_bgr, cv2.COLOR_BGR2GRAY).astype(np.float64)
    lap = np.abs(cv2.Laplacian(gray, cv2.CV_64F, ksize=3))
    textured_bright = (v > 130) & (lap > 12)
    content = (colored | textured_bright).astype(np.float64)
    return content.mean(axis=1 if axis == 0 else 0)


def _segment_runs(
    strip_bgr: np.ndarray,
    axis: int,
    pad: float = 0.03,
    min_len: float = 0.09,
    thr: float = 0.30,
) -> list[tuple[float, float]]:
    """Trả về các đoạn (start, end) tỉ lệ có nhiều 'content' liên tiếp dọc theo axis."""
    size = strip_bgr.shape[0] if axis == 0 else strip_bgr.shape[1]
    prof = _content_profile(strip_bgr, axis)
    k = max(3, size // 45) | 1
    prof = np.convolve(prof, np.ones(k) / k, mode="same")
    has = prof > thr

    runs: list[tuple[float, float]] = []
    i = int(pad * size)
    end = int((1 - pad) * size)
    while i < end:
        if has[i]:
            j = i
            while j < end and has[j]:
                j += 1
            if (j - i) / size >= min_len:
                runs.append((i / size, j / size))
            i = j
        else:
            i += 1
    return runs


def _main_divider(warped: np.ndarray, axis: int) -> tuple[float, float]:
    """
    Vạch chính theo trục: axis=0 → vạch dọc (chiếu theo cột),
    axis=1 → vạch ngang (chiếu theo hàng). Trả về (vị trí 0..1, độ mạnh).
    """
    h, w = warped.shape[:2]
    mm = _metal_mask(warped)
    proj = mm.mean(axis=0 if axis == 0 else 1)
    size = len(proj)
    k = max(3, size // 60) | 1
    proj = np.convolve(proj, np.ones(k) / k, mode="same")
    lo, hi = int(size * 0.40), int(size * 0.62)
    if hi <= lo:
        return 0.5, 0.0
    seg = proj[lo:hi]
    pos = (int(np.argmax(seg)) + lo) / size
    strength = float(seg.max()) / (float(proj.mean()) + 1e-6)
    return pos, strength


def detect_slots_auto(
    warped: np.ndarray,
    pad: float = 0.025,
    groove: float = 0.015,
) -> list[tuple[float, float, float, float]]:
    """
    Tự phát hiện ngăn theo nội dung (không cần template/loại khay).
    Tự nhận hướng vạch chính (dọc hay ngang) rồi chia 2 nửa,
    mỗi nửa cắt theo đoạn có đồ ăn.
    """
    h, w = warped.shape[:2]
    vx, vstr = _main_divider(warped, axis=0)
    hy, hstr = _main_divider(warped, axis=1)
    vertical = vstr >= hstr

    slots: list[tuple[float, float, float, float]] = []
    if vertical:
        mx = vx if 0.38 <= vx <= 0.64 else 0.5
        left = warped[:, : max(1, int((mx - groove) * w))]
        right = warped[:, int((mx + groove) * w) :]
        lx, lw = pad, mx - groove - pad
        rx, rw = mx + groove, 1.0 - mx - groove - pad
        for y0, y1 in _segment_runs(left, axis=0):
            slots.append((lx, max(0.0, y0 - 0.01), max(0.12, lw), (y1 - y0) + 0.02))
        for y0, y1 in _segment_runs(right, axis=0):
            slots.append((rx, max(0.0, y0 - 0.01), max(0.12, rw), (y1 - y0) + 0.02))
    else:
        my = hy if 0.38 <= hy <= 0.64 else 0.5
        top = warped[: max(1, int((my - groove) * h)), :]
        bot = warped[int((my + groove) * h) :, :]
        ty, th = pad, my - groove - pad
        by, bh = my + groove, 1.0 - my - groove - pad
        for x0, x1 in _segment_runs(top, axis=1):
            slots.append((max(0.0, x0 - 0.01), ty, (x1 - x0) + 0.02, max(0.12, th)))
        for x0, x1 in _segment_runs(bot, axis=1):
            slots.append((max(0.0, x0 - 0.01), by, (x1 - x0) + 0.02, max(0.12, bh)))
    return slots


def _split_strength(warped: np.ndarray, axis: int) -> float:
    gray = cv2.cvtColor(warped, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (5, 5), 0)
    edges = cv2.Canny(blur, 45, 130)
    proj = np.mean(edges, axis=axis).astype(np.float64)
    size = len(proj)
    k = max(5, size // 35) | 1
    proj = np.convolve(proj, np.ones(k) / k, mode="same")
    lo, hi = int(size * 0.38), int(size * 0.62)
    segment = proj[lo:hi]
    if segment.size == 0:
        return 0.0
    return float(np.max(segment) / (np.mean(proj) + 1e-6))


def _guess_horizontal_layout(warped: np.ndarray) -> bool:
    """Khay 2 trên + 3 dưới: vạch ngang giữa khay rõ ở khoảng 42–56% chiều cao."""
    mid_y = _find_horizontal_split(warped)
    if mid_y < 0.42 or mid_y > 0.56:
        return False
    h_str = _split_strength(warped, axis=1)
    v_str = _split_strength(warped, axis=0)
    return h_str >= v_str * 0.85


def _slots_from_warped(
    warped: np.ndarray,
    tray_type: str | None = None,
) -> list[tuple[float, float, float, float]]:
    if tray_type == "tray-23":
        return _slots_horizontal_23(warped)

    if tray_type == "tray-32u":
        return _slots_horizontal_32u(warped)

    if tray_type is None and _guess_horizontal_layout(warped):
        return _slots_horizontal_23(warped)

    mid_x = _find_vertical_split(warped)
    h, w = warped.shape[:2]
    mid_px = int(mid_x * w)

    pad = 0.025
    left = warped[:, :mid_px]
    right = warped[:, mid_px:]

    left_cuts = _divider_peaks(left, axis=0)
    right_cuts = _divider_peaks(right, axis=0)

    left_rows = _split_range(pad, 1.0 - pad, left_cuts)
    right_rows = _split_range(pad, 1.0 - pad, right_cuts)

    layout = {
        "tray-32": (3, 2),
        "school-v": (2, 3),
    }.get(tray_type or "", (0, 0))
    left_n, right_n = layout

    if left_n == 3 and len(left_rows) < 3:
        left_rows = [(pad, 0.34), (0.34, 0.66), (0.66, 1.0 - pad)]
    elif left_n == 2 and len(left_rows) < 2:
        left_rows = [(pad, 0.5), (0.5, 1.0 - pad)]
    elif len(left_rows) < 2:
        left_rows = [(pad, 0.5), (0.5, 1.0 - pad)]

    if right_n == 2 and len(right_rows) < 2:
        right_rows = [(pad, 0.5), (0.5, 1.0 - pad)]
    elif right_n == 3 and len(right_rows) < 3:
        right_rows = [(pad, 0.33), (0.33, 0.66), (0.66, 1.0 - pad)]
    elif len(right_rows) < 2:
        right_rows = [(pad, 0.5), (0.5, 1.0 - pad)]

    # Khay trái 3 ngăn / phải 2 ngăn (layout phổ biến khác V-trường)
    if not tray_type and len(right_rows) == 2 and len(left_rows) <= 2:
        left_rows = [(pad, 0.34), (0.34, 0.66), (0.66, 1.0 - pad)]

    slots: list[tuple[float, float, float, float]] = []
    lx, lw = pad, max(0.12, mid_x - pad * 2)
    rx, rw = mid_x + pad, max(0.12, 1.0 - mid_x - pad * 2)

    for y0, y1 in left_rows[:left_n or len(left_rows)]:
        bh = y1 - y0
        if bh >= 0.10:
            slots.append((lx, y0, lw, bh))
    for y0, y1 in right_rows[:right_n or len(right_rows)]:
        bh = y1 - y0
        if bh >= 0.10:
            slots.append((rx, y0, rw, bh))

    expected = (left_n + right_n) if left_n and right_n else 0
    if expected and len(slots) > expected:
        slots = slots[:expected]
    return slots[:6]


def detect_slots_on_warped(
    warped: np.ndarray,
    tray_type: str | None = None,
) -> list[tuple[float, float, float, float]]:
    """Phát hiện ngăn trên ảnh đã warp — linh hoạt theo loại khay."""
    return _slots_from_warped(warped, tray_type=tray_type)


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


def _template_fallback(
    image_bgr: np.ndarray,
    min_area: int,
) -> tuple[list[np.ndarray], list[tuple[int, int, int, int]], str]:
    from crop_tray import _load_template, _ratios_to_boxes

    h, w = image_bgr.shape[:2]
    ratios = _load_template()
    compartments: list[np.ndarray] = []
    bboxes: list[tuple[int, int, int, int]] = []
    for box in _ratios_to_boxes(ratios, w, h):
        x, y, bw, bh = box
        if bw * bh < min_area:
            continue
        crop = image_bgr[y : y + bh, x : x + bw]
        if crop.size == 0:
            continue
        compartments.append(crop.copy())
        bboxes.append((x, y, bw, bh))
    return compartments, bboxes, "template-direct-v3"


def detect_tray_compartments(
    image_bgr: np.ndarray,
    min_area: int = 5000,
) -> tuple[list[np.ndarray], list[tuple[int, int, int, int]], str]:
    h, w = image_bgr.shape[:2]
    corners = find_tray_corners_robust(image_bgr)
    if corners is None:
        return _template_fallback(image_bgr, min_area)

    warped, M = warp_tray(image_bgr, corners)
    M_inv = cv2.invert(M)[1]
    ratio_slots = _slots_from_warped(warped, tray_type=None)

    if len(ratio_slots) < 3:
        return _template_fallback(image_bgr, min_area)

    compartments: list[np.ndarray] = []
    bboxes: list[tuple[int, int, int, int]] = []
    for slot in ratio_slots:
        box = _warp_box_to_original(slot, M_inv, w, h)
        x, y, bw, bh = box
        if bw * bh < min_area:
            continue
        crop = image_bgr[y : y + bh, x : x + bw]
        if crop.size == 0:
            continue
        compartments.append(crop.copy())
        bboxes.append(box)

    if len(compartments) < 3:
        return _template_fallback(image_bgr, min_area)

    return compartments, bboxes, "grid-adaptive-v1"
