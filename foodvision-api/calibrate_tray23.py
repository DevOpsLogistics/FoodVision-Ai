"""Calibrate tray-23 (2 top + 3 bottom) on user image."""
import sys
from pathlib import Path

import cv2
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "foodvision-ml"))

IMG = Path(
    r"C:\Users\MR ASUS\.cursor\projects\c-Users-MR-ASUS-Downloads-n-cu-i-k\assets"
    r"\c__Users_MR_ASUS_AppData_Roaming_Cursor_User_workspaceStorage_591920810a23d4520f37b0f1fdb916a3"
    r"_images_image-c54b5113-779d-4033-991a-490a684cf543.png"
)


def main():
    from crop_tray import CANON_H, CANON_W, find_tray_corners_robust, warp_tray
    from detect_tray_grid import detect_slots_on_warped

    data = IMG.read_bytes()
    img = cv2.imdecode(np.frombuffer(data, np.uint8), cv2.IMREAD_COLOR)
    corners = find_tray_corners_robust(img)
    warped, _ = warp_tray(img, corners)

    cv2.imwrite(str(ROOT / "foodvision-ml" / "debug_tray23_warped.jpg"), warped)

    for tt in [None, "tray-23"]:
        slots = detect_slots_on_warped(warped, tray_type=tt)
        vis = warped.copy()
        for i, (rx, ry, rw, rh) in enumerate(slots):
            x, y = int(rx * CANON_W), int(ry * CANON_H)
            bw, bh = int(rw * CANON_W), int(rh * CANON_H)
            cv2.rectangle(vis, (x, y), (x + bw, y + bh), (0, 255, 0), 2)
            cv2.putText(vis, str(i + 1), (x + 8, y + 28), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
        out = ROOT / "foodvision-ml" / f"debug_tray23_slots_{tt or 'auto'}.jpg"
        cv2.imwrite(str(out), vis)
        print(tt or "auto", len(slots), "slots ->", out.name)
        for i, s in enumerate(slots):
            print(f"  {i+1}: x={s[0]:.3f} y={s[1]:.3f} w={s[2]:.3f} h={s[3]:.3f}")


if __name__ == "__main__":
    main()
