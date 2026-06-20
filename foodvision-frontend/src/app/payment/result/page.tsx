"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navigation from "@/components/Navigation";
import { SectionDivider } from "@/components/PageLayout";
import { paymentsApi } from "@/lib/api";
import { formatPrice } from "@/data/mealRecommendations";

function PaymentResultContent() {
  const params = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [message, setMessage] = useState("");
  const [amount, setAmount] = useState<number | null>(null);
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    const payload: Record<string, string> = {};
    params.forEach((value, key) => {
      payload[key] = value;
    });

    const oid = payload.orderId || "";
    setOrderId(oid);
    setAmount(payload.amount ? Number(payload.amount) : null);

    const resultCode = Number(payload.resultCode ?? -1);
    if (!oid) {
      setStatus("failed");
      setMessage("Thiếu mã đơn hàng từ MoMo.");
      return;
    }

    (async () => {
      try {
        const confirmed = await paymentsApi.confirmMomoReturn({
          ...payload,
          resultCode,
        });
        if (confirmed.status === "paid" || resultCode === 0) {
          setStatus("success");
          setMessage("Thanh toán MoMo sandbox thành công.");
        } else {
          setStatus("failed");
          setMessage(payload.message || "Thanh toán chưa hoàn tất.");
        }
      } catch {
        if (resultCode === 0) {
          setStatus("success");
          setMessage("Thanh toán MoMo sandbox thành công.");
        } else {
          setStatus("failed");
          setMessage(payload.message || "Không xác nhận được giao dịch.");
        }
      }
    })();
  }, [params]);

  return (
    <main className="max-w-lg mx-auto px-container-margin pt-32 pb-24 text-center">
      <SectionDivider title="-- Kết quả thanh toán --" />
      <div className="mt-10 rounded-2xl border border-[#F2EFE9] bg-surface p-8 shadow-sm">
        {status === "loading" && (
          <p className="text-on-surface-variant">Đang xác nhận giao dịch MoMo...</p>
        )}
        {status === "success" && (
          <>
            <span className="material-symbols-outlined text-5xl text-green-600 mb-4">check_circle</span>
            <h1 className="font-headline-sm text-headline-sm text-on-surface mb-2">Thanh toán thành công</h1>
            <p className="text-on-surface-variant mb-2">{message}</p>
            {orderId && <p className="text-sm text-on-surface-variant">Mã đơn: {orderId}</p>}
            {amount != null && (
              <p className="font-bold text-[#a50064] mt-2">{formatPrice(amount)}</p>
            )}
          </>
        )}
        {status === "failed" && (
          <>
            <span className="material-symbols-outlined text-5xl text-[#b82c2a] mb-4">error</span>
            <h1 className="font-headline-sm text-headline-sm text-on-surface mb-2">Thanh toán thất bại</h1>
            <p className="text-on-surface-variant">{message}</p>
          </>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/scanner"
            className="px-6 py-3 rounded-full bg-[#b82c2a] text-white text-sm font-semibold hover:bg-[#9a2523]"
          >
            Quét lại
          </Link>
          <Link
            href="/diary"
            className="px-6 py-3 rounded-full border border-[#F2EFE9] text-sm font-semibold text-on-surface hover:bg-surface-container-low"
          >
            Nhật ký
          </Link>
        </div>
        <p className="text-xs text-on-surface-variant mt-6">
          Demo sandbox MoMo — dùng ví test trên trang thanh toán MoMo.
        </p>
      </div>
    </main>
  );
}

export default function PaymentResultPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Suspense fallback={<div className="pt-32 text-center text-sm">Đang tải...</div>}>
        <PaymentResultContent />
      </Suspense>
    </div>
  );
}
