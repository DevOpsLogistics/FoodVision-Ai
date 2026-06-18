"""Augment mạnh class thiếu ảnh (kim_chi, mam_vung, ...)."""
from __future__ import annotations

import sys
from pathlib import Path

import cv2
import numpy as np

sys.stdout.reconfigure(encoding="utf-8")
ML_DIR = Path(__file__).resolve().parent
DATASET = ML_DIR / "dataset"

TARGET_CLASSES = ["kim_chi", "mam_vung", "ca_kho"]
TARGET_PER_CLASS = 120


def augment(img: np.ndarray, n: int) -> list[np.ndarray]:
    out: list[np.ndarray] = []
    h, w = img.shape[:2]
    for _ in range(n):
        angle = float(np.random.uniform(-15, 15))
        scale = float(np.random.uniform(0.85, 1.15))
        M = cv2.getRotationMatrix2D((w / 2, h / 2), angle, scale)
        aug = cv2.warpAffine(img, M, (w, h), borderMode=cv2.BORDER_REFLECT)
        if np.random.rand() > 0.5:
            aug = cv2.flip(aug, 1)
        alpha = float(np.random.uniform(0.7, 1.3))
        beta = int(np.random.randint(-35, 35))
        aug = cv2.convertScaleAbs(aug, alpha=alpha, beta=beta)
        if np.random.rand() > 0.6:
            k = np.random.choice([3, 5])
            aug = cv2.GaussianBlur(aug, (k, k), 0)
        out.append(aug)
    return out


def main() -> None:
    for cls in TARGET_CLASSES:
        src_dir = DATASET / cls
        if not src_dir.exists():
            print(f"skip {cls}: no folder")
            continue
        seeds = list(src_dir.glob("real_*.jpg")) + list(src_dir.glob("tray_*.jpg"))
        if not seeds:
            seeds = list(src_dir.glob("*.jpg"))[:10]
        if not seeds:
            print(f"skip {cls}: no seed images")
            continue
        existing = len(list(src_dir.glob("boost_*.jpg")))
        need = max(0, TARGET_PER_CLASS - existing)
        if need == 0:
            print(f"{cls}: already {existing} boost images")
            continue
        added = 0
        i = 0
        while added < need:
            seed_path = seeds[i % len(seeds)]
            data = seed_path.read_bytes()
            img = cv2.imdecode(np.frombuffer(data, np.uint8), cv2.IMREAD_COLOR)
            if img is None:
                i += 1
                continue
            img = cv2.resize(img, (224, 224))
            for j, aug in enumerate(augment(img, min(8, need - added))):
                out = src_dir / f"boost_{existing + added + j:04d}.jpg"
                ok, buf = cv2.imencode(".jpg", aug, [int(cv2.IMWRITE_JPEG_QUALITY), 90])
                if ok:
                    out.write_bytes(buf.tobytes())
                    added += 1
            i += 1
        print(f"{cls}: +{added} boost (total {len(list(src_dir.glob('*.jpg')))})")


if __name__ == "__main__":
    main()
