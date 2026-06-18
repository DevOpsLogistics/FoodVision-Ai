from fastapi import APIRouter

from app.ml_service import load_nutrition

router = APIRouter(prefix="/recipes", tags=["recipes"])

RECIPES = [
    {
        "id": 1,
        "name": "Canh chua không cá",
        "class_name": "canh_chua_khong_ca",
        "time_minutes": 25,
        "featured": True,
        "tags": ["vegetarian"],
        "reason": "Giàu tinh bột phức hợp và gia vị chống viêm.",
    },
    {
        "id": 2,
        "name": "Cơm trắng",
        "class_name": "com_trang",
        "time_minutes": 15,
        "featured": False,
        "tags": ["quick"],
        "reason": "Nguồn năng lượng ổn định cho bữa trưa.",
    },
    {
        "id": 3,
        "name": "Đậu hũ sốt cà",
        "class_name": "dau_hu_sot_ca",
        "time_minutes": 20,
        "featured": False,
        "tags": ["protein"],
        "reason": "Protein thực vật, phù hợp chế độ eat clean.",
    },
    {
        "id": 4,
        "name": "Rau xào",
        "class_name": "rau_xao",
        "time_minutes": 10,
        "featured": False,
        "tags": ["quick", "fiber"],
        "reason": "Chất xơ cao, hỗ trợ tiêu hóa.",
    },
    {
        "id": 5,
        "name": "Trứng chiên",
        "class_name": "trung_chien",
        "time_minutes": 5,
        "featured": False,
        "tags": ["quick", "protein"],
        "reason": "Bữa phụ nhanh, giàu protein.",
    },
]


@router.get("")
def list_recipes():
    nutrition = load_nutrition()
    out = []
    for r in RECIPES:
        nut = nutrition.get(r["class_name"], {})
        out.append({**r, "calories": nut.get("calories", 0), "protein": nut.get("protein", 0)})
    return out
