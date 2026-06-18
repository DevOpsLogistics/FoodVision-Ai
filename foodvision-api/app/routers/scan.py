from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.database import get_db
from app.ml_service import predict_from_bytes
from app.models import Scan, ScanCompartment, User
from app.security import get_current_user

router = APIRouter(prefix="/scan", tags=["scan"])


@router.get("/tray-types")
def list_tray_types():
    import sys

    from app import cnn_engine

    ml = cnn_engine.ML_DIR
    if str(ml) not in sys.path:
        sys.path.insert(0, str(ml))
    from tray_templates import list_tray_types as _list

    return {"types": _list()}


def _public_scan_response(scan: Scan, items: list, totals: dict) -> dict:
    """Chỉ trả dữ liệu hiển thị — không lộ engine/model/backend."""
    return {
        "scan_id": scan.id,
        "items": [
            {
                "index": item["index"],
                "class_name": item["class_name"],
                "display_name": item["display_name"],
                "confidence": item["confidence"],
                "bbox": item["bbox"],
                "calories": item["calories"],
                "protein": item["protein"],
                "carbs": item["carbs"],
                "fat": item["fat"],
            }
            for item in items
        ],
        "totals": totals,
        "created_at": scan.created_at.isoformat(),
    }


@router.post("")
async def scan_food(
    image: UploadFile = File(...),
    tray_type: str | None = Form(default=None),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not image.content_type or not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File phải là ảnh")
    data = await image.read()
    if len(data) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Ảnh quá lớn (tối đa 10MB)")

    try:
        result = predict_from_bytes(data, tray_type=tray_type)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except RuntimeError:
        raise HTTPException(
            status_code=503,
            detail="Không thể phân tích ảnh. Vui lòng thử lại sau.",
        ) from None
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Không thể phân tích ảnh. Vui lòng thử lại.",
        ) from None

    scan = Scan(user_id=user.id)
    db.add(scan)
    db.flush()

    for item in result["items"]:
        bbox = item["bbox"]
        db.add(ScanCompartment(
            scan_id=scan.id,
            index=item["index"],
            class_name=item["class_name"],
            display_name=item["display_name"],
            confidence=item["confidence"],
            bbox_x=bbox["x"],
            bbox_y=bbox["y"],
            bbox_w=bbox["w"],
            bbox_h=bbox["h"],
            calories=item["calories"],
            protein=item["protein"],
            carbs=item["carbs"],
            fat=item["fat"],
        ))
    db.commit()
    db.refresh(scan)
    return _public_scan_response(scan, result["items"], result["totals"])


@router.get("/{scan_id}")
def get_scan(scan_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    scan = db.query(Scan).filter(Scan.id == scan_id, Scan.user_id == user.id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Không tìm thấy kết quả quét")
    comps = db.query(ScanCompartment).filter(ScanCompartment.scan_id == scan.id).order_by(ScanCompartment.index).all()
    items = [{
        "index": c.index,
        "class_name": c.class_name,
        "display_name": c.display_name,
        "confidence": c.confidence,
        "bbox": {"x": c.bbox_x, "y": c.bbox_y, "w": c.bbox_w, "h": c.bbox_h},
        "calories": c.calories,
        "protein": c.protein,
        "carbs": c.carbs,
        "fat": c.fat,
    } for c in comps]
    totals = {
        "calories": sum(c.calories for c in comps),
        "protein": sum(c.protein for c in comps),
        "carbs": sum(c.carbs for c in comps),
        "fat": sum(c.fat for c in comps),
    }
    return _public_scan_response(scan, items, totals)
