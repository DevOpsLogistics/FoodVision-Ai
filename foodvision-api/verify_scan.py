"""Verify template-direct-v3 crop on reference image."""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "foodvision-api"))
sys.path.insert(0, str(ROOT / "foodvision-ml"))

IMG = ROOT / "foodvision-ml" / "result_media__1781375329285.jpg"


def main() -> int:
    from app.ml_service import predict_from_bytes

    data = IMG.read_bytes()
    result = predict_from_bytes(data)
    items = result["items"]
    print(f"crop check — {len(items)} items")
    ok = True
    for it in items:
        b = it["bbox"]
        w = b["w"]
        flag = "OK" if w >= 0.35 else "BAD(small bbox)"
        if w < 0.35:
            ok = False
        print(
            f"  slot={it.get('slot')} {it['class_name']} conf={it['confidence']:.3f} "
            f"bbox w={w:.4f} h={b['h']:.4f} [{flag}]"
        )
    print("totals:", result["totals"])
    if len(items) < 4:
        ok = False
        print("FAIL: expected >= 4 items")
    if ok:
        print("PASS: full-width bboxes")
        return 0
    print("FAIL: small or missing detections")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
