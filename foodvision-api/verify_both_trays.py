"""Test grid-adaptive crop on both tray images."""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "foodvision-api"))
sys.path.insert(0, str(ROOT / "foodvision-ml"))

IMAGES = [
    ROOT / "foodvision-ml" / "result_media__1781375329285.jpg",
    ROOT / "foodvision-ml" / "tray_test_new.png",
]


def main() -> int:
    from app.ml_service import predict_from_bytes

    ok = True
    for img in IMAGES:
        if not img.exists():
            print(f"SKIP {img.name} (missing)")
            continue
        result = predict_from_bytes(img.read_bytes())
        print(f"\n=== {img.name} ===")
        for it in result["items"]:
            b = it["bbox"]
            flag = "OK" if b["w"] >= 0.15 else "BAD"
            if b["w"] < 0.15:
                ok = False
            print(
                f"  slot={it['slot']} {it['class_name']} {it['confidence']:.2f} "
                f"w={b['w']:.3f} [{flag}]"
            )
        print(f"  items={len(result['items'])} cal={result['totals']['calories']}")
        if len(result["items"]) < 3:
            ok = False
            print("  FAIL: < 3 items")
    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
