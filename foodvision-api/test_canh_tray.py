import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "foodvision-api"))
sys.path.insert(0, str(ROOT / "foodvision-ml"))

IMG = Path(
    r"C:\Users\MR ASUS\.cursor\projects\c-Users-MR-ASUS-Downloads-n-cu-i-k\assets"
    r"\c__Users_MR_ASUS_AppData_Roaming_Cursor_User_workspaceStorage_591920810a23d4520f37b0f1fdb916a3"
    r"_images_image-723b743f-93bd-4f2a-9d58-3dc5834f3497.png"
)


def main():
    from app.ml_service import predict_from_bytes
    from crop_tray_warp import crop_tray_candidates
    import cv2
    import numpy as np

    data = IMG.read_bytes()
    img = cv2.imdecode(np.frombuffer(data, np.uint8), cv2.IMREAD_COLOR)
    h, w = img.shape[:2]
    if w > h * 1.15:
        img = img[:, : int(w * 0.58)]

    for tt in ["tray-23", "tray-32u", "school-v"]:
        r = predict_from_bytes(data, tray_type=tt)
        print(f"\n=== {tt} crop={r.get('crop')} items={len(r['items'])} ===")
        for it in r["items"]:
            b = it["bbox"]
            print(f"  slot{it['slot']} {it['class_name']} {it['confidence']:.0%} y={b['y']:.2f}")

        cands = crop_tray_candidates(img, tray_type=tt)
        for comps, boxes, mode in cands[:2]:
            print(f"  [{mode}] {len(comps)} slots")


if __name__ == "__main__":
    main()
