"""MoMo Payment Gateway v2 — sandbox demo."""

from __future__ import annotations

import hashlib
import hmac
import json
import uuid
from typing import Any

import httpx

from app.config import settings

SANDBOX_BASE = "https://test-payment.momo.vn"
PRODUCTION_BASE = "https://payment.momo.vn"


def _base_url() -> str:
    return SANDBOX_BASE if settings.momo_env.strip().lower() != "production" else PRODUCTION_BASE


def _sign(raw: str) -> str:
    return hmac.new(
        settings.momo_secret_key.encode("utf-8"),
        raw.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()


def _create_signature(
    *,
    amount: int,
    extra_data: str,
    ipn_url: str,
    order_id: str,
    order_info: str,
    redirect_url: str,
    request_id: str,
    request_type: str = "captureWallet",
) -> str:
    raw = (
        f"accessKey={settings.momo_access_key}"
        f"&amount={amount}"
        f"&extraData={extra_data}"
        f"&ipnUrl={ipn_url}"
        f"&orderId={order_id}"
        f"&orderInfo={order_info}"
        f"&partnerCode={settings.momo_partner_code}"
        f"&redirectUrl={redirect_url}"
        f"&requestId={request_id}"
        f"&requestType={request_type}"
    )
    return _sign(raw)


def verify_ipn_signature(payload: dict[str, Any]) -> bool:
    """Xác thực chữ ký IPN / redirect từ MoMo."""
    signature = str(payload.get("signature", ""))
    if not signature:
        return False
    raw = (
        f"accessKey={settings.momo_access_key}"
        f"&amount={payload.get('amount', '')}"
        f"&extraData={payload.get('extraData', '')}"
        f"&message={payload.get('message', '')}"
        f"&orderId={payload.get('orderId', '')}"
        f"&orderInfo={payload.get('orderInfo', '')}"
        f"&orderType={payload.get('orderType', '')}"
        f"&partnerCode={payload.get('partnerCode', '')}"
        f"&payType={payload.get('payType', '')}"
        f"&requestId={payload.get('requestId', '')}"
        f"&responseTime={payload.get('responseTime', '')}"
        f"&resultCode={payload.get('resultCode', '')}"
        f"&transId={payload.get('transId', '')}"
    )
    return hmac.compare_digest(_sign(raw), signature)


def new_order_id() -> str:
    return f"FV{uuid.uuid4().hex[:16].upper()}"


def _redirect_url() -> str:
    if settings.momo_redirect_url.strip():
        return settings.momo_redirect_url.strip()
    return f"{settings.frontend_url.rstrip('/')}/payment/result"


async def create_payment(
    *,
    amount: int,
    order_info: str,
    order_id: str | None = None,
    extra_data: str = "",
) -> dict[str, Any]:
    if amount < 1000:
        raise ValueError("Số tiền tối thiểu MoMo sandbox là 1.000đ")

    order_id = order_id or new_order_id()
    request_id = str(uuid.uuid4())
    redirect_url = _redirect_url()
    ipn_url = settings.momo_ipn_url

    body = {
        "partnerCode": settings.momo_partner_code,
        "partnerName": "FoodVision",
        "storeId": "FoodVisionStore",
        "requestId": request_id,
        "amount": amount,
        "orderId": order_id,
        "orderInfo": order_info,
        "redirectUrl": redirect_url,
        "ipnUrl": ipn_url,
        "lang": "vi",
        "requestType": "captureWallet",
        "autoCapture": True,
        "extraData": extra_data,
        "signature": _create_signature(
            amount=amount,
            extra_data=extra_data,
            ipn_url=ipn_url,
            order_id=order_id,
            order_info=order_info,
            redirect_url=redirect_url,
            request_id=request_id,
        ),
    }

    url = f"{_base_url()}/v2/gateway/api/create"
    async with httpx.AsyncClient(timeout=30.0) as client:
        resp = await client.post(url, json=body)
        resp.raise_for_status()
        data = resp.json()

    if int(data.get("resultCode", -1)) != 0:
        raise RuntimeError(data.get("message") or "MoMo từ chối tạo thanh toán")

    return {
        "order_id": order_id,
        "request_id": request_id,
        "amount": amount,
        "pay_url": data.get("payUrl"),
        "deeplink": data.get("deeplink"),
        "qr_code_url": data.get("qrCodeUrl"),
        "raw": data,
    }


async def query_transaction(order_id: str, request_id: str) -> dict[str, Any]:
    raw = (
        f"accessKey={settings.momo_access_key}"
        f"&orderId={order_id}"
        f"&partnerCode={settings.momo_partner_code}"
        f"&requestId={request_id}"
    )
    body = {
        "partnerCode": settings.momo_partner_code,
        "requestId": request_id,
        "orderId": order_id,
        "lang": "vi",
        "signature": _sign(raw),
    }
    url = f"{_base_url()}/v2/gateway/api/query"
    async with httpx.AsyncClient(timeout=30.0) as client:
        resp = await client.post(url, json=body)
        resp.raise_for_status()
        return resp.json()
