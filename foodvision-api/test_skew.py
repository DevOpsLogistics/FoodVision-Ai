"""Test crop linh hoạt trên ảnh thẳng + ảnh xoay chéo."""
import sys
from pathlib import Path

import cv2
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "foodvision-ml"))
sys.path.insert(0, str(ROOT / "foodvision-api"))

IMG = ROOT / "foodvision-ml" / "result_media__1781375329285.jpg"
ASSET = Path(
    r"C:\Users\MR ASUS\.cursor\projects\c-Users-MR-ASUS-Downloads-n-cu-i-k\assets"
    r"\c__Users_MR_ASUS_AppData_Roaming_Cursor_User_workspaceStorage_591920810a23d4520f37b0f1fdb916a3"
    r"_images_image-465bb696-9585-4c5c-9b33-2f07b4e463e4.png"
)


def _rotate(img: np.ndarray, deg: float) -> np.ndarray:
    h, w = img.shape[:2]
    M = cv2.getRotationMatrix2D((w / 2, h / 2), deg, 1.0)
    return cv2.warpAffine(img, M, (w, h), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)


def _draw_boxes(img: np.ndarray, boxes, color=(0, 255, 0)) -> np.ndarray:
    vis = img.copy()
    for i, (x, y, bw, bh) in enumerate(boxes):
        cv2.rectangle(vis, (x, y), (x + bw, y + bh), color, 2)
        cv2.putText(vis, str(i + 1), (x + 6, y + 22), cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)
    return vis


def _read_img(path: Path) -> np.ndarray | None:
    data = path.read_bytes()
    arr = np.frombuffer(data, dtype=np.uint8)
    return cv2.imdecode(arr, cv2.IMREAD_COLOR)


def test_crop_modes(path: Path, tray_type: str, label: str) -> None:
    from crop_tray_warp import crop_tray_candidates

    img = _read_img(path)
    if img is None:
        print(f"SKIP {label}: không đọc được {path}")
        return
    print(f"\n=== {label} ({tray_type}) ===")
    for comps, boxes, mode in crop_tray_candidates(img, tray_type=tray_type):
        print(f"  {mode}: {len(comps)} slots")
        out = ROOT / "foodvision-ml" / f"debug_{label}_{mode.replace('-', '_')}.jpg"
        vis = _draw_boxes(img, boxes)
        ok, buf = cv2.imencode(".jpg", vis)
        if ok:
            out.write_bytes(buf.tobytes())


def test_predict(path: Path, tray_type: str, label: str) -> None:
    from app.ml_service import predict_from_bytes

    data = path.read_bytes()
    r = predict_from_bytes(data, tray_type=tray_type)
    print(f"\n--- predict {label} crop={r.get('crop')} ---")
    for it in r["items"]:
        b = it["bbox"]
        print(f"  slot{it['slot']} {it['class_name']} {it['confidence']:.2f} w={b['w']:.3f}")


def main() -> None:
    if IMG.exists():
        img = _read_img(IMG)
        if img is None:
            print("SKIP school: decode failed")
        else:
            rot = _rotate(img, 18)
            rot_path = ROOT / "foodvision-ml" / "debug_rotated_18.jpg"
            ok, buf = cv2.imencode(".jpg", rot)
            rot_path.write_bytes(buf.tobytes())
            test_crop_modes(IMG, "school-v", "school_straight")
            test_crop_modes(rot_path, "school-v", "school_rot18")
            test_predict(IMG, "school-v", "school_straight")
            test_predict(rot_path, "school-v", "school_rot18")

    if ASSET.exists():
        img = _read_img(ASSET)
        if img is None:
            print("SKIP tray32: decode failed")
        else:
            rot = _rotate(img, -15)
            rot_path = ROOT / "foodvision-ml" / "debug_tray32_rot15.jpg"
            ok, buf = cv2.imencode(".jpg", rot)
            rot_path.write_bytes(buf.tobytes())
            test_crop_modes(ASSET, "tray-32", "tray32_straight")
            test_crop_modes(rot_path, "tray-32", "tray32_rot15")
            test_predict(ASSET, "tray-32", "tray32_straight")
            test_predict(rot_path, "tray-32", "tray32_rot15")


if __name__ == "__main__":
    main()
