from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine
from app.ml_service import init_model
from app.routers import auth, dashboard, meals, ml, recipes, scan, users


@asynccontextmanager
async def lifespan(_app: FastAPI):
    Base.metadata.create_all(bind=engine)
    st = init_model()
    if st.get("ready"):
        yolo = st.get("yolo") or {}
        sam = st.get("sam") or {}
        print(f"[FoodVision] CNN ready — {st.get('class_count')} classes")
        print(f"[FoodVision] Crop: {st.get('crop', 'template-direct-v3')}")
    else:
        print(f"[FoodVision] CNN chưa sẵn sàng: {st.get('error') or 'unknown'}")
    yield


app = FastAPI(title="FoodVision API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(meals.router, prefix="/api")
app.include_router(scan.router, prefix="/api")
app.include_router(ml.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")
app.include_router(recipes.router, prefix="/api")


@app.get("/api/health")
def health():
    return {"status": "ok", "service": "foodvision-api"}
