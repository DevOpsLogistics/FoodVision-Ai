import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "foodvision-api"))
sys.path.insert(0, str(ROOT / "foodvision-ml"))

IMG = Path(
    r"C:\Users\MR ASUS\.cursor\projects\c-Users-MR-ASUS-Downloads-n-cu-i-k\assets"
    r"\c__Users_MR_ASUS_AppData_Roaming_Cursor_User_workspaceStorage_591920810a23d4520f37b0f1fdb916a3"
    r"_images_image-1740f367-0cfd-4583-87be-5ce9b5933e68.png"
)


def main():
    from app.ml_service import predict_from_bytes

    data = IMG.read_bytes()
    for tt in [None, "school-v", "tray-32"]:
        r = predict_from_bytes(data, tray_type=tt)
        print(f"\n=== tray_type={tt} crop={r.get('crop')} items={len(r['items'])} ===")
        for it in sorted(r["items"], key=lambda x: (x["bbox"]["x"], x["bbox"]["y"])):
            b = it["bbox"]
            print(f"  slot{it['slot']} {it['class_name']:<14} {it['confidence']:.0%} "
                  f"x={b['x']:.2f} y={b['y']:.2f} w={b['w']:.2f} h={b['h']:.2f}")


if __name__ == "__main__":
    main()
