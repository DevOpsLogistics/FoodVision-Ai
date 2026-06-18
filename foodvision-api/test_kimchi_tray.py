import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "foodvision-api"))
sys.path.insert(0, str(ROOT / "foodvision-ml"))

IMG = Path(
    r"C:\Users\MR ASUS\.cursor\projects\c-Users-MR-ASUS-Downloads-n-cu-i-k\assets"
    r"\c__Users_MR_ASUS_AppData_Roaming_Cursor_User_workspaceStorage_591920810a23d4520f37b0f1fdb916a3"
    r"_images_image-2ebc89ba-f13a-4f88-b513-24d54b29654a.png"
)


def main():
    from app.ml_service import predict_from_bytes

    r = predict_from_bytes(IMG.read_bytes(), tray_type="tray-23")
    print("crop:", r.get("crop"))
    for it in r["items"]:
        print(f"  slot{it['slot']} {it['display_name']} ({it['class_name']}) {it['confidence']:.0%}")


if __name__ == "__main__":
    main()
