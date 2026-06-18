# FoodVision API

Backend FastAPI cho FoodVision-Ai: đăng ký/đăng nhập, quét món ăn, nhật ký dinh dưỡng.

## Chạy nhanh

```bash
cd foodvision-api
py -m pip install -r requirements.txt
copy .env.example .env
py -m uvicorn app.main:app --reload --port 8000
```

Frontend cần `NEXT_PUBLIC_API_URL=http://localhost:8000` trong `.env.local`.

## Vision AI (nhận diện thông minh — ẩn code)

Thêm vào `.env` (bấm **Sao chép khóa** trên AI Studio):
```
FOODVISION_GEMINI_API_KEY=AQ.... hoặc AIzaSy...
```

Google AI Studio 2026 cấp key mới dạng **`AQ.`** (không phải `AIzaSy` nữa) — code đã hỗ trợ cả hai.

- **Frontend** chỉ gọi `POST /api/scan` — không thấy prompt, API key, hay logic AI
- **Server** gọi Gemini Vision phân tích ảnh khay cơm
- **CNN** vẫn load lúc startup làm fallback (`VISION_FALLBACK_CNN=true`)
- Kiểm tra: `GET /api/ml/status`

Dùng OpenAI thay Gemini:
```
VISION_PROVIDER=openai
OPENAI_API_KEY=sk-...
```

## CNN tự load khi bật server

Khi chạy `uvicorn`, CNN **MobileNetV2** load tự động từ `foodvision-ml/food_model_best.keras`.

Kiểm tra trạng thái:
```
GET http://localhost:8000/api/ml/status
```

Pipeline: `crop_tray.py` cắt 5 ngăn → `predict.py` CNN dự đoán từng ngăn.  
Logic CNN nằm trong `foodvision-ml/inference_engine.py`, **không hardcode** trong API.

## API chính

| Endpoint | Mô tả |
|----------|--------|
| `POST /api/auth/register` | Đăng ký email/password |
| `POST /api/auth/login` | Đăng nhập |
| `GET /api/auth/google` | Redirect OAuth Google |
| `GET /api/auth/facebook` | Redirect OAuth Facebook |
| `GET /api/users/me` | Hồ sơ (Bearer token) |
| `POST /api/scan` | Upload ảnh, nhận diện món |
| `GET /api/meals` | Nhật ký bữa ăn |
| `GET /api/dashboard/summary` | Tổng quan calo hôm nay |

## OAuth (tùy chọn)

Thêm vào `.env`:
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- `FACEBOOK_CLIENT_ID`, `FACEBOOK_CLIENT_SECRET`
- Redirect URI: `http://localhost:3000/auth/callback/google` và `/facebook`

Không cấu hình OAuth vẫn dùng được đăng ký/đăng nhập email.

## ML

Nếu không có file `foodvision-ml/food_model_best.keras`, API trả kết quả **demo** (món mẫu ngẫu nhiên).
