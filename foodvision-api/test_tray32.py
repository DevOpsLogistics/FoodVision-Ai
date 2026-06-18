import sys
from pathlib import Path

import cv2
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "foodvision-api"))
sys.path.insert(0, str(ROOT / "foodvision-ml"))

ASSET = Path(
    r"C:\Users\MR ASUS\.cursor\projects\c-Users-MR-ASUS-Downloads-n-cu-i-k\assets"
    r"\c__Users_MR_ASUS_AppData_Roaming_Cursor_User_workspaceStorage_591920810a23d4520f37b0f1fdb916a3"
    r"_images_image-465bb696-9585-4c5c-9b33-2f07b4e463e4.png"
)


def main():
    from app.ml_service import predict_from_bytes
    from tray_templates import get_tray_slots

    data = ASSET.read_bytes()
    r = predict_from_bytes(data, tray_type="tray-32")
    print("items", len(r["items"]))
    for it in r["items"]:
        b = it["bbox"]
        print(f"  slot{it['slot']} {it['class_name']} {it['confidence']:.2f} w={b['w']:.3f}")

    img = cv2.imdecode(np.frombuffer(data, np.uint8), cv2.IMREAD_COLOR)
    _, slots = get_tray_slots("tray-32")
    h, w = img.shape[:2]
    vis = img.copy()
    for i, (rx, ry, rw, rh) in enumerate(slots):
        x, y = int(rx * w), int(ry * h)
        bw, bh = int(rw * w), int(rh * h)
        cv2.rectangle(vis, (x, y), (x + bw, y + bh), (0, 255, 0), 2)
        cv2.putText(vis, str(i + 1), (x + 6, y + 24), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
    out = ROOT / "foodvision-ml" / "debug_tray32_calibrated.jpg"
    ok, buf = cv2.imencode(".jpg", vis)
    out.write_bytes(buf.tobytes())
    print("saved", out)


if __name__ == "__main__":
    main()
