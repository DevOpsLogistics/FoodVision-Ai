from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app import momo_service
from app.config import settings
from app.database import get_db
from app.models import PaymentOrder, User
from app.security import get_current_user_optional

router = APIRouter(prefix="/payments/momo", tags=["payments"])


class MomoCreateRequest(BaseModel):
    amount: int = Field(ge=1000, le=50_000_000)
    order_info: str = Field(default="Thanh toan FoodVision", max_length=200)
    scan_id: int | None = None


@router.get("/config")
def momo_config():
    return {
        "enabled": bool(settings.momo_partner_code and settings.momo_secret_key),
        "env": settings.momo_env,
        "redirect_url": settings.momo_redirect_url or f"{settings.frontend_url.rstrip('/')}/payment/result",
    }


@router.post("/create")
async def create_momo_payment(
    body: MomoCreateRequest,
    db: Session = Depends(get_db),
    user: User | None = Depends(get_current_user_optional),
):
    order_id = momo_service.new_order_id()
    try:
        result = await momo_service.create_payment(
            amount=body.amount,
            order_info=body.order_info,
            order_id=order_id,
            extra_data=str(body.scan_id or ""),
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"MoMo: {exc}") from exc

    row = PaymentOrder(
        order_id=result["order_id"],
        request_id=result["request_id"],
        user_id=user.id if user else None,
        scan_id=body.scan_id,
        amount=body.amount,
        status="pending",
        order_info=body.order_info,
    )
    db.add(row)
    db.commit()

    return {
        "order_id": result["order_id"],
        "amount": body.amount,
        "pay_url": result["pay_url"],
        "deeplink": result.get("deeplink"),
        "qr_code_url": result.get("qr_code_url"),
        "env": settings.momo_env,
    }


@router.post("/ipn")
async def momo_ipn(request: Request, db: Session = Depends(get_db)):
    payload = await request.json()
    if not isinstance(payload, dict):
        raise HTTPException(status_code=400, detail="Payload không hợp lệ")
    if not momo_service.verify_ipn_signature(payload):
        raise HTTPException(status_code=403, detail="Chữ ký IPN không hợp lệ")

    order_id = str(payload.get("orderId", ""))
    row = db.query(PaymentOrder).filter(PaymentOrder.order_id == order_id).first()
    if not row:
        return {"message": "Order not found", "resultCode": 0}

    result_code = int(payload.get("resultCode", -1))
    if result_code == 0:
        row.status = "paid"
        row.paid_at = datetime.utcnow()
        row.momo_trans_id = str(payload.get("transId") or "")
        row.result_message = str(payload.get("message") or "Thành công")
    else:
        row.status = "failed"
        row.result_message = str(payload.get("message") or "Thất bại")
    db.commit()
    return {"message": "Received", "resultCode": 0}


@router.get("/orders/{order_id}")
def get_order(order_id: str, db: Session = Depends(get_db)):
    row = db.query(PaymentOrder).filter(PaymentOrder.order_id == order_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Không tìm thấy đơn")
    return {
        "order_id": row.order_id,
        "amount": row.amount,
        "status": row.status,
        "order_info": row.order_info,
        "momo_trans_id": row.momo_trans_id,
        "result_message": row.result_message,
        "paid_at": row.paid_at.isoformat() if row.paid_at else None,
    }


@router.post("/return")
async def momo_return_confirm(request: Request, db: Session = Depends(get_db)):
    """Frontend gửi query params sau redirect để cập nhật trạng thái (demo)."""
    payload = await request.json()
    if not momo_service.verify_ipn_signature(payload):
        raise HTTPException(status_code=403, detail="Chữ ký không hợp lệ")

    order_id = str(payload.get("orderId", ""))
    row = db.query(PaymentOrder).filter(PaymentOrder.order_id == order_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Không tìm thấy đơn")

    result_code = int(payload.get("resultCode", -1))
    if result_code == 0 and row.status != "paid":
        row.status = "paid"
        row.paid_at = datetime.utcnow()
        row.momo_trans_id = str(payload.get("transId") or "")
        row.result_message = str(payload.get("message") or "Thành công")
        db.commit()
    elif result_code != 0:
        row.status = "failed"
        row.result_message = str(payload.get("message") or "Thất bại")
        db.commit()

    return {"order_id": row.order_id, "status": row.status, "result_code": result_code}
