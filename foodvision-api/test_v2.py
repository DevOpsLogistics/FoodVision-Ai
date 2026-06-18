"""Test pipeline v2 on tray images."""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "foodvision-api"))
sys.path.insert(0, str(ROOT / "foodvision-ml"))

ASSET = Path(
    r"C:\Users\MR ASUS\.cursor\projects\c-Users-MR-ASUS-Downloads-n-cu-i-k\assets"
    r"\c__Users_MR_ASUS_AppData_Roaming_Cursor_User_workspaceStorage_591920810a23d4520f37b0f1fdb916a3"
    r"_images_image-fae2d083-9ab0-417e-bce5-6b3988070c16.png"
)

IMAGES = [
    ROOT / "foodvision-ml" / "result_media__1781375329285.jpg",
    ROOT / "foodvision-ml" / "tray_test_new.png",
    ASSET,
]


def main() -> int:
    import cv2
    from app.ml_service import predict_from_bytes

    ok = True
    for img in IMAGES:
        if not img.exists():
            print("SKIP", img)
            continue
        data = img.read_bytes()
        # crop tray from UI screenshot
        if "image-fae2d083" in img.name:
            import numpy as np
            arr = np.frombuffer(data, np.uint8)
            frame = cv2.imdecode(arr, cv2.IMREAD_COLOR)
            h, w = frame.shape[:2]
            frame = frame[int(h * 0.12) : int(h * 0.92), int(w * 0.04) : int(w * 0.58)]
            _, buf = cv2.imencode(".jpg", frame)
            data = buf.tobytes()

        result = predict_from_bytes(data)
        print(f"\n=== {img.name} ===")
        com = 0
        for it in result["items"]:
            print(f"  {it['class_name']} {it['confidence']:.2f}")
            if it["class_name"] == "com_trang":
                com += 1
        print(f"  items={len(result['items'])} com_trang={com} cal={result['totals']['calories']}")
        if com > 1:
            ok = False
            print("  FAIL: duplicate com_trang")
    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
