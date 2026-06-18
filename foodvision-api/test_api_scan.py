"""E2E POST /api/scan with reference tray image."""
import json
import uuid
import urllib.request
from pathlib import Path

BASE = "http://127.0.0.1:8000"
IMG = Path(__file__).resolve().parents[1] / "foodvision-ml" / "result_media__1781375329285.jpg"


def main() -> int:
    email = f"test_{uuid.uuid4().hex[:8]}@test.com"
    reg = json.dumps({"email": email, "password": "test123456", "name": "Test User"}).encode()
    req = urllib.request.Request(
        f"{BASE}/api/auth/register",
        data=reg,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    token = json.loads(urllib.request.urlopen(req).read())["access_token"]

    boundary = "----FoodVisionTest"
    body = b""
    body += (
        f'--{boundary}\r\nContent-Disposition: form-data; name="image"; '
        f'filename="tray.jpg"\r\nContent-Type: image/jpeg\r\n\r\n'
    ).encode()
    body += IMG.read_bytes()
    body += f"\r\n--{boundary}--\r\n".encode()

    req = urllib.request.Request(
        f"{BASE}/api/scan",
        data=body,
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": f"multipart/form-data; boundary={boundary}",
        },
        method="POST",
    )
    resp = json.loads(urllib.request.urlopen(req, timeout=180).read())
    print("scan_id", resp["scan_id"], "items", len(resp["items"]))
    ok = True
    for it in resp["items"]:
        b = it["bbox"]
        flag = "OK" if b["w"] >= 0.35 else "BAD"
        if b["w"] < 0.35:
            ok = False
        print(f"  {it['class_name']} conf={it['confidence']} w={b['w']} [{flag}]")
    if len(resp["items"]) < 4:
        ok = False
    print("PASS" if ok else "FAIL")
    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
