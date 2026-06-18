"""
Thu thập dataset train CNN — tải ảnh mẫu + crop từ ảnh khay + augment.
Chạy: py prepare_dataset.py
"""
from __future__ import annotations

import json
import sys
import urllib.request
from pathlib import Path

import cv2
import numpy as np

sys.stdout.reconfigure(encoding="utf-8")

ML_DIR = Path(__file__).resolve().parent
DATASET = ML_DIR / "dataset"


def imread_u(path: Path) -> np.ndarray | None:
    data = path.read_bytes()
    arr = np.frombuffer(data, np.uint8)
    return cv2.imdecode(arr, cv2.IMREAD_COLOR)


def imwrite_u(path: Path, img: np.ndarray) -> bool:
    path.parent.mkdir(parents=True, exist_ok=True)
    ok, buf = cv2.imencode(".jpg", img)
    if not ok:
        return False
    path.write_bytes(buf.tobytes())
    return True
CLASSES = [
    "ca_hu_kho",
    "ca_kho",
    "canh_chua_co_ca",
    "canh_chua_khong_ca",
    "canh_rau",
    "com_trang",
    "dau_hu_chien",
    "dau_hu_sot_ca",
    "kim_chi",
    "mam_vung",
    "rau_luoc",
    "rau_xao",
    "suon_nuong",
    "thit_kho",
    "thit_kho_trung",
    "trung_chien",
]

# Ảnh mẫu Wikimedia Commons (public domain / CC)
SAMPLE_URLS: dict[str, list[str]] = {
    "com_trang": [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/White_rice_%28PSF%29.png/440px-White_rice_%28PSF%29.png",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Steamed_rice_%28cropped%29.jpg/440px-Steamed_rice_%28cropped%29.jpg",
    ],
    "thit_kho": [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Thit_kho_trung.jpg/440px-Thit_kho_trung.jpg",
    ],
    "canh_rau": [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Vietnamese_canh_chua.jpg/440px-Vietnamese_canh_chua.jpg",
    ],
    "rau_xao": [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Stir_fried_water_spinach.jpg/440px-Stir_fried_water_spinach.jpg",
    ],
    "dau_hu_sot_ca": [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Tofu_with_tomato_sauce.jpg/440px-Tofu_with_tomato_sauce.jpg",
    ],
    "trung_chien": [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Fried_egg%2C_sunny_side_up.jpg/440px-Fried_egg%2C_sunny_side_up.jpg",
    ],
    "suon_nuong": [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Pork_ribs_on_grill.jpg/440px-Pork_ribs_on_grill.jpg",
    ],
}

# Crop từ ảnh khay có sẵn (ảnh, tray_type, [(slot_index, class_name), ...])
ASSETS = Path(
    r"C:\Users\MR ASUS\.cursor\projects\c-Users-MR-ASUS-Downloads-n-cu-i-k\assets"
)

TRAY_CROPS = [
    (
        ML_DIR / "result_media__1781375329285.jpg",
        "school-v",
        [(0, "com_trang"), (1, "canh_rau"), (2, "rau_xao"), (4, "thit_kho")],
    ),
    (
        ASSETS / "c__Users_MR_ASUS_AppData_Roaming_Cursor_User_workspaceStorage_591920810a23d4520f37b0f1fdb916a3_images_image-fae2d083-9ab0-417e-bce5-6b3988070c16.png",
        "tray-32",
        [(0, "thit_kho"), (1, "dau_hu_chien"), (2, "rau_luoc"), (3, "canh_rau"), (4, "com_trang")],
    ),
    (
        ASSETS / "c__Users_MR_ASUS_AppData_Roaming_Cursor_User_workspaceStorage_591920810a23d4520f37b0f1fdb916a3_images_image-465bb696-9585-4c5c-9b33-2f07b4e463e4.png",
        "tray-32",
        [(0, "thit_kho"), (1, "dau_hu_chien"), (2, "rau_luoc"), (3, "canh_rau"), (4, "com_trang")],
    ),
    (
        ASSETS / "c__Users_MR_ASUS_AppData_Roaming_Cursor_User_workspaceStorage_591920810a23d4520f37b0f1fdb916a3_images_image-c54b5113-779d-4033-991a-490a684cf543.png",
        "tray-23",
        [(0, "canh_rau"), (1, "com_trang"), (2, "trung_chien"), (3, "rau_luoc"), (4, "thit_kho")],
    ),
    (
        ASSETS / "c__Users_MR_ASUS_AppData_Roaming_Cursor_User_workspaceStorage_591920810a23d4520f37b0f1fdb916a3_images_image-d48f111c-9916-4164-a83d-b3570335909c.png",
        "tray-32u",
        [(0, "rau_xao"), (1, "ca_kho"), (2, "ca_kho"), (3, "com_trang"), (4, "canh_rau")],
    ),
]


def _download(url: str, dest: Path) -> bool:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "FoodVision/1.0"})
        data = urllib.request.urlopen(req, timeout=30).read()
        arr = np.frombuffer(data, np.uint8)
        img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
        if img is None:
            return False
        if not imwrite_u(dest, img):
            return False
        return True
    except Exception as exc:
        print(f"  skip {url[:60]}... ({exc})")
        return False


def _augment(img: np.ndarray, n: int = 12) -> list[np.ndarray]:
    out = [img]
    for i in range(n):
        h, w = img.shape[:2]
        angle = np.random.uniform(-12, 12)
        scale = np.random.uniform(0.88, 1.12)
        M = cv2.getRotationMatrix2D((w / 2, h / 2), angle, scale)
        aug = cv2.warpAffine(img, M, (w, h), borderMode=cv2.BORDER_REFLECT)
        if np.random.rand() > 0.5:
            aug = cv2.flip(aug, 1)
        alpha = np.random.uniform(0.75, 1.25)
        beta = np.random.randint(-25, 25)
        aug = cv2.convertScaleAbs(aug, alpha=alpha, beta=beta)
        out.append(aug)
    return out


def _extract_tray_crops() -> int:
    sys.path.insert(0, str(ML_DIR))
    from crop_tray_warp import crop_tray_candidates

    count = 0
    for img_path, tray_type, labels in TRAY_CROPS:
        if not img_path.exists():
            print(f"skip tray {img_path.name}")
            continue
        img = imread_u(img_path)
        if img is None:
            continue
        # Screenshot UI — lấy vùng khay bên trái
        if img.shape[1] > img.shape[0] * 1.15:
            img = img[:, : int(img.shape[1] * 0.58)]
        elif img.shape[1] > 900:
            h, w = img.shape[:2]
            img = img[int(h * 0.12) : int(h * 0.92), int(w * 0.04) : int(w * 0.58)]
        cands = crop_tray_candidates(img, tray_type=tray_type)
        if not cands:
            print(f"skip crop {img_path.name}")
            continue
        comps, _, _ = max(cands, key=lambda c: len(c[0]))
        for slot_idx, class_name in labels:
            if slot_idx >= len(comps):
                continue
            crop = cv2.resize(comps[slot_idx], (224, 224))
            dest_dir = DATASET / class_name
            dest_dir.mkdir(parents=True, exist_ok=True)
            for j, aug in enumerate(_augment(crop, 15)):
                imwrite_u(dest_dir / f"tray_{img_path.stem}_{slot_idx}_{j}.jpg", aug)
                count += 1
    return count


def main() -> None:
    print("=" * 50)
    print("FoodVision — chuẩn bị dataset")
    print("=" * 50)

    for cls in CLASSES:
        (DATASET / cls).mkdir(parents=True, exist_ok=True)

    n_dl = 0
    for cls, urls in SAMPLE_URLS.items():
        dest_dir = DATASET / cls
        for i, url in enumerate(urls):
            dest = dest_dir / f"web_{i}.jpg"
            if _download(url, dest):
                img = imread_u(dest)
                if img is not None:
                    img = cv2.resize(img, (224, 224))
                    for j, aug in enumerate(_augment(img, 20)):
                        imwrite_u(dest_dir / f"web_{i}_aug_{j}.jpg", aug)
                        n_dl += 1
                n_dl += 1

    # Sinh ảnh synthetic cho class thiếu URL (màu đặc trưng + noise)
    synth_specs = {
        "com_trang": (220, 220, 220),
        "canh_rau": (100, 180, 200),
        "thit_kho": (70, 90, 150),
        "rau_xao": (60, 140, 60),
        "dau_hu_chien": (20, 140, 180),
        "dau_hu_sot_ca": (40, 120, 200),
        "kim_chi": (180, 120, 80),
        "mam_vung": (140, 110, 90),
        "rau_luoc": (80, 160, 80),
        "ca_hu_kho": (60, 100, 180),
        "ca_kho": (55, 95, 170),
        "canh_chua_co_ca": (100, 180, 200),
        "canh_chua_khong_ca": (90, 170, 190),
        "thit_kho_trung": (75, 95, 145),
        "suon_nuong": (80, 100, 160),
        "trung_chien": (30, 180, 240),
    }
    n_syn = 0
    for cls, color in synth_specs.items():
        dest_dir = DATASET / cls
        for i in range(25):
            base = np.full((224, 224, 3), color, dtype=np.uint8)
            noise = np.random.randint(-30, 30, base.shape, dtype=np.int16)
            img = np.clip(base.astype(np.int16) + noise, 0, 255).astype(np.uint8)
            imwrite_u(dest_dir / f"synth_{i}.jpg", img)
            for j, aug in enumerate(_augment(img, 8)):
                imwrite_u(dest_dir / f"synth_{i}_a{j}.jpg", aug)
                n_syn += 1

    n_tray = _extract_tray_crops()

    counts = {cls: len(list((DATASET / cls).glob("*.jpg"))) for cls in CLASSES}
    print(f"\nTải web: {n_dl}, synthetic: {n_syn}, tray crops: {n_tray}")
    print("Số ảnh / class:")
    for cls, n in counts.items():
        print(f"  {cls}: {n}")

    with open(ML_DIR / "class_names.json", "w", encoding="utf-8") as f:
        json.dump(CLASSES, f, ensure_ascii=False, indent=4)
    print(f"\n=> Dataset: {DATASET}")
    print("=> Chạy: py train.py --dataset dataset --fresh")


if __name__ == "__main__":
    main()
