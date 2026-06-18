"""
Tải ảnh món ăn từ Wikimedia Commons (API — ổn định hơn URL trực tiếp).
Chạy: py download_web_images.py
"""
from __future__ import annotations

import json
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

import cv2
import numpy as np

sys.stdout.reconfigure(encoding="utf-8")
ML_DIR = Path(__file__).resolve().parent
DATASET = ML_DIR / "dataset"

# class -> từ khóa tìm trên Commons
SEARCH_QUERIES: dict[str, list[str]] = {
    "com_trang": ["steamed white rice", "bowl of rice", "Vietnamese rice"],
    "ca_kho": ["Vietnamese fish clay pot", "ca kho", "caramelized fish Vietnam"],
    "ca_hu_kho": ["catfish Vietnam food", "ca loc kho"],
    "thit_kho": ["thit kho trung", "Vietnamese braised pork eggs"],
    "thit_kho_trung": ["thit kho trung", "Vietnamese pork egg stew"],
    "canh_rau": ["Vietnamese vegetable soup", "canh rau"],
    "canh_chua_co_ca": ["canh chua", "Vietnamese sour soup fish"],
    "canh_chua_khong_ca": ["canh chua vegetarian", "Vietnamese sour soup"],
    "rau_xao": ["stir fried vegetables", "Vietnamese stir fry greens"],
    "rau_luoc": ["boiled bok choy", "boiled vegetables Asian"],
    "dau_hu_chien": ["fried tofu", "Vietnamese tofu"],
    "dau_hu_sot_ca": ["tofu tomato sauce", "dau hu sot ca"],
    "suon_nuong": ["grilled pork ribs", "Vietnamese grilled pork"],
    "trung_chien": ["fried egg sunny side", "Vietnamese egg"],
}

API = "https://commons.wikimedia.org/w/api.php"


def _api(params: dict) -> dict:
    url = API + "?" + urllib.parse.urlencode({**params, "format": "json"})
    req = urllib.request.Request(url, headers={"User-Agent": "FoodVisionBot/1.0 (education project)"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))


def search_images(query: str, limit: int = 8) -> list[str]:
    data = _api({
        "action": "query",
        "generator": "search",
        "gsrsearch": f"filetype:bitmap {query}",
        "gsrlimit": limit,
        "gsrnamespace": 6,
        "prop": "imageinfo",
        "iiprop": "url|mime|size",
        "iiurlwidth": 640,
    })
    pages = data.get("query", {}).get("pages", {})
    urls: list[str] = []
    for page in pages.values():
        infos = page.get("imageinfo") or []
        if not infos:
            continue
        info = infos[0]
        mime = info.get("mime", "")
        if not mime.startswith("image/"):
            continue
        if info.get("size", 0) < 8000:
            continue
        url = info.get("thumburl") or info.get("url")
        if url:
            urls.append(url)
    return urls


def download_url(url: str) -> np.ndarray | None:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "FoodVisionBot/1.0"})
        data = urllib.request.urlopen(req, timeout=45).read()
        arr = np.frombuffer(data, np.uint8)
        img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
        return img
    except Exception as exc:
        print(f"    fail: {exc}")
        return None


def augment(img: np.ndarray, n: int = 8) -> list[np.ndarray]:
    out: list[np.ndarray] = []
    h, w = img.shape[:2]
    for _ in range(n):
        angle = float(np.random.uniform(-12, 12))
        scale = float(np.random.uniform(0.88, 1.1))
        M = cv2.getRotationMatrix2D((w / 2, h / 2), angle, scale)
        aug = cv2.warpAffine(img, M, (w, h), borderMode=cv2.BORDER_REFLECT)
        if np.random.rand() > 0.5:
            aug = cv2.flip(aug, 1)
        alpha = float(np.random.uniform(0.8, 1.2))
        beta = int(np.random.randint(-25, 25))
        out.append(cv2.convertScaleAbs(aug, alpha=alpha, beta=beta))
    return out


def save_img(path: Path, img: np.ndarray) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    ok, buf = cv2.imencode(".jpg", img, [int(cv2.IMWRITE_JPEG_QUALITY), 90])
    if ok:
        path.write_bytes(buf.tobytes())


def main() -> None:
    print("=" * 50)
    print("Tải ảnh Wikimedia Commons")
    print("=" * 50)
    total = 0
    seen_urls: set[str] = set()

    for cls, queries in SEARCH_QUERIES.items():
        dest = DATASET / cls
        dest.mkdir(parents=True, exist_ok=True)
        n_cls = 0
        print(f"\n[{cls}]")
        for q in queries:
            if n_cls >= 15:
                break
            urls = search_images(q, limit=6)
            time.sleep(0.4)
            for url in urls:
                if url in seen_urls or n_cls >= 15:
                    continue
                seen_urls.add(url)
                img = download_url(url)
                if img is None or min(img.shape[:2]) < 80:
                    continue
                img = cv2.resize(img, (224, 224))
                fname = f"wiki_{n_cls:02d}.jpg"
                save_img(dest / fname, img)
                n_cls += 1
                total += 1
                for j, aug in enumerate(augment(img, 6)):
                    save_img(dest / f"wiki_{n_cls-1:02d}_a{j}.jpg", aug)
                    total += 1
                print(f"  + {fname} ({q[:40]})")
                time.sleep(0.3)
        print(f"  => {n_cls} ảnh gốc")

    print(f"\nTổng đã lưu: {total} ảnh (kèm augment)")
    counts = {}
    for cls in SEARCH_QUERIES:
        counts[cls] = len(list((DATASET / cls).glob("*.jpg")))
    print("\nTổng ảnh / class trong dataset:")
    for cls, n in sorted(counts.items(), key=lambda x: -x[1]):
        print(f"  {cls}: {n}")


if __name__ == "__main__":
    main()
