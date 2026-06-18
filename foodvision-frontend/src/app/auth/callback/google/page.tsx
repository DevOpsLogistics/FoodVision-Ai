"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/lib/api";

function GoogleCallbackInner() {
  const searchParams = useSearchParams();
  const { completeOAuth } = useAuth();
  const [error, setError] = useState("");

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) {
      setError("Không nhận được mã xác thực từ Google");
      return;
    }
    completeOAuth("google", code).catch((err) => {
      setError(err instanceof ApiError ? err.message : "Đăng nhập Google thất bại");
    });
  }, [searchParams, completeOAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <p className="text-on-surface">{error || "Đang đăng nhập bằng Google..."}</p>
    </div>
  );
}

export default function GoogleCallback() {
  return (
    <Suspense>
      <GoogleCallbackInner />
    </Suspense>
  );
}
