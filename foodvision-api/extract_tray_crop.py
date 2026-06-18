"""Extract khay từ ảnh chụp màn hình UI (vùng ảnh trái)."""
import sys
from pathlib import Path

import cv2

ROOT = Path(__file__).resolve().parents[1]
src = ROOT / "foodvision-ml" / "tray_test_v2.png"
dst = ROOT / "foodvision-ml" / "tray_clean_v2.jpg"

img = cv2.imread(str(src))
if img is None:
    raise SystemExit("no image")
h, w = img.shape[:2]
# Ảnh khay nằm cột trái, dưới header
crop = img[int(h * 0.12) : int(h * 0.92), int(w * 0.04) : int(w * 0.58)]
cv2.imwrite(str(dst), crop)
print("saved", dst, crop.shape)
