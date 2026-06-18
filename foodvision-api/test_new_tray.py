import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "foodvision-api"))
sys.path.insert(0, str(ROOT / "foodvision-ml"))

IMG = Path(
    r"C:\Users\MR ASUS\.cursor\projects\c-Users-MR-ASUS-Downloads-n-cu-i-k\assets"
    r"\c__Users_MR_ASUS_AppData_Roaming_Cursor_User_workspaceStorage_591920810a23d4520f37b0f1fdb916a3"
    r"_images_image-c54b5113-779d-4033-991a-490a684cf543.png"
)


def main():
    import cv2
    import numpy as np
    from app.ml_service import predict_from_bytes
    from crop_tray_warp import crop_tray_candidates

    data = IMG.read_bytes()
    arr = np.frombuffer(data, dtype=np.uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_COLOR)

    for tt in [None, "school-v", "tray-32", "tray-23"]:
        r = predict_from_bytes(data, tray_type=tt)
        print(f"=== tray_type={tt} crop={r.get('crop')} ===")
        for it in r["items"]:
            b = it["bbox"]
            print(
                f"  slot{it['slot']} {it['class_name']} {it['confidence']:.2f}"
                f" w={b['w']:.3f} h={b['h']:.3f}"
            )

    print("\n--- crop candidates (no tray_type) ---")
    for comps, boxes, mode in crop_tray_candidates(img):
        print(f"  {mode}: {len(comps)} slots")


if __name__ == "__main__":
    main()
