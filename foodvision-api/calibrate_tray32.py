"""Debug + calibrate tray-32 slots on user tray photo."""
import sys
from pathlib import Path

import cv2
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "foodvision-ml"))

ASSET = Path(
    r"C:\Users\MR ASUS\.cursor\projects\c-Users-MR-ASUS-Downloads-n-cu-i-k\assets"
    r"\c__Users_MR_ASUS_AppData_Roaming_Cursor_User_workspaceStorage_591920810a23d4520f37b0f1fdb916a3"
    r"_images_image-465bb696-9585-4c5c-9b33-2f07b4e463e4.png"
)


def imread_u(p: Path):
    arr = np.frombuffer(p.read_bytes(), np.uint8)
    return cv2.imdecode(arr, cv2.IMREAD_COLOR)


def draw_slots(img, slots, color=(0, 255, 0)):
    h, w = img.shape[:2]
    out = img.copy()
    for i, (rx, ry, rw, rh) in enumerate(slots):
        x, y = int(rx * w), int(ry * h)
        bw, bh = int(rw * w), int(rh * h)
        cv2.rectangle(out, (x, y), (x + bw, y + bh), color, 2)
        cv2.putText(out, str(i + 1), (x + 8, y + 28), cv2.FONT_HERSHEY_SIMPLEX, 0.9, color, 2)
    return out


def main():
    from tray_templates import get_tray_slots

    img = imread_u(ASSET)
    h, w = img.shape[:2]
    print("image", w, h)

    # Calibrated for khay 3+2 — ảnh chụp từ trên, khay chiếm ~85% khung
    NEW_TRAY_32 = [
        (0.055, 0.055, 0.465, 0.285),  # 1 thịt kho
        (0.055, 0.355, 0.465, 0.265),  # 2 đậu hũ chiên
        (0.055, 0.635, 0.465, 0.300),  # 3 rau luộc
        (0.545, 0.055, 0.400, 0.445),  # 4 canh
        (0.545, 0.515, 0.400, 0.420),  # 5 cơm
    ]

    _, old = get_tray_slots("tray-32")
    vis_old = draw_slots(img, old, (0, 0, 255))
    vis_new = draw_slots(img, NEW_TRAY_32, (0, 255, 0))

    out = ROOT / "foodvision-ml"
    cv2.imwrite(str(out / "debug_tray32_old.jpg"), vis_old)
    cv2.imwrite(str(out / "debug_tray32_new.jpg"), vis_new)

    for name, slots in [("old", old), ("new", NEW_TRAY_32)]:
        print(f"\n{name}:")
        for i, s in enumerate(slots):
            print(f"  slot{i+1}: {s}")

    # Save tofu crop only
    rx, ry, rw, rh = NEW_TRAY_32[1]
    x, y = int(rx * w), int(ry * h)
    tofu = img[y : y + int(rh * h), x : x + int(rw * w)]
    cv2.imwrite(str(out / "debug_tofu_crop.jpg"), tofu)
    print("\n=> saved debug_tray32_old.jpg, debug_tray32_new.jpg, debug_tofu_crop.jpg")


if __name__ == "__main__":
    main()
