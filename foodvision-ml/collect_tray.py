"""
Thu thập ảnh train từ ảnh khay thật (crop tự động + nhãn tay).

Tạo file manifest JSON, ví dụ `samples/tray_manifest.json`:
[
  {
    "image": "path/to/tray.jpg",
    "tray_type": "tray-32u",
    "labels": ["rau_xao", "ca_kho", "ca_kho", "com_trang", "canh_rau"]
  }
]

Chạy:
  py collect_tray.py samples/tray_manifest.json
  py collect_tray.py samples/tray_manifest.json --dry-run
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

import cv2
import numpy as np

sys.stdout.reconfigure(encoding="utf-8")
ML_DIR = Path(__file__).resolve().parent
DATASET = ML_DIR / "dataset"


def imread_u(path: Path) -> np.ndarray | None:
    data = path.read_bytes()
    arr = np.frombuffer(data, dtype=np.uint8)
    return cv2.imdecode(arr, cv2.IMREAD_COLOR)


def _strip_ui_screenshot(img: np.ndarray) -> np.ndarray:
    """Ảnh chụp màn hình app — lấy vùng khay bên trái."""
    h, w = img.shape[:2]
    if w > h * 1.15:
        return img[:, : int(w * 0.58)]
    if w > 900:
        return img[int(h * 0.08) : int(h * 0.92), int(w * 0.02) : int(w * 0.55)]
    return img


def imwrite_u(path: Path, img: np.ndarray) -> bool:
    path.parent.mkdir(parents=True, exist_ok=True)
    ok, buf = cv2.imencode(".jpg", img, [int(cv2.IMWRITE_JPEG_QUALITY), 92])
    if not ok:
        return False
    path.write_bytes(buf.tobytes())
    return True


def _augment(img: np.ndarray, n: int = 6) -> list[np.ndarray]:
    out: list[np.ndarray] = []
    h, w = img.shape[:2]
    for _ in range(n):
        angle = float(np.random.uniform(-10, 10))
        scale = float(np.random.uniform(0.9, 1.08))
        M = cv2.getRotationMatrix2D((w / 2, h / 2), angle, scale)
        aug = cv2.warpAffine(img, M, (w, h), borderMode=cv2.BORDER_REFLECT)
        if np.random.rand() > 0.5:
            aug = cv2.flip(aug, 1)
        alpha = float(np.random.uniform(0.85, 1.15))
        beta = int(np.random.randint(-20, 20))
        aug = cv2.convertScaleAbs(aug, alpha=alpha, beta=beta)
        out.append(aug)
    return out


def collect_entry(entry: dict, dry_run: bool = False) -> int:
    sys.path.insert(0, str(ML_DIR))
    from crop_tray_warp import crop_tray_candidates

    img_path = Path(entry["image"])
    if not img_path.is_absolute():
        img_path = (Path.cwd() / img_path).resolve()
    tray_type = entry.get("tray_type") or "school-v"
    labels: list[str] = entry["labels"]

    img = imread_u(img_path)
    if img is None:
        print(f"  SKIP: không đọc được {img_path}")
        return 0

    img = _strip_ui_screenshot(img)

    cands = crop_tray_candidates(img, tray_type=tray_type)
    if not cands:
        print(f"  SKIP: không cắt được ngăn {img_path.name}")
        return 0

    comps, _, mode = max(cands, key=lambda c: len(c[0]))
    if len(comps) != len(labels):
        print(
            f"  WARN: {img_path.name} có {len(comps)} ngăn nhưng manifest có {len(labels)} nhãn"
        )
    n = min(len(comps), len(labels))
    saved = 0
    stem = img_path.stem
    for i in range(n):
        cls = labels[i].strip()
        crop = cv2.resize(comps[i], (224, 224))
        if dry_run:
            print(f"    [{i+1}] -> {cls} ({mode})")
            saved += 1
            continue
        dest_dir = DATASET / cls
        dest_dir.mkdir(parents=True, exist_ok=True)
        imwrite_u(dest_dir / f"real_{stem}_{i}.jpg", crop)
        saved += 1
        for j, aug in enumerate(_augment(crop, 4)):
            imwrite_u(dest_dir / f"real_{stem}_{i}_a{j}.jpg", aug)
            saved += 1
    return saved


def main() -> None:
    p = argparse.ArgumentParser(description="Thu thập crop từ ảnh khay có nhãn")
    p.add_argument("manifest", type=Path, help="JSON manifest")
    p.add_argument("--dry-run", action="store_true", help="Chỉ in, không ghi file")
    args = p.parse_args()

    entries = json.loads(args.manifest.read_text(encoding="utf-8"))
    if not isinstance(entries, list):
        entries = [entries]

    print(f"Manifest: {args.manifest} ({len(entries)} ảnh khay)")
    total = 0
    for entry in entries:
        name = Path(entry["image"]).name
        print(f"\n{name}:")
        total += collect_entry(entry, dry_run=args.dry_run)

    print(f"\n=> {'Sẽ thêm' if args.dry_run else 'Đã thêm'} {total} ảnh vào {DATASET}")
    if not args.dry_run and total:
        print("=> Train lại: py train.py --dataset dataset --fresh")


if __name__ == "__main__":
    main()
