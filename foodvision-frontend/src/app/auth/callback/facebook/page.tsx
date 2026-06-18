"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/lib/api";

function FacebookCallbackInner() {
  const searchParams = useSearchParams();
  const { completeOAuth } = useAuth();
  const [error, setError] = useState("");

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) {
      setError("Không nhận được mã xác thực từ Facebook");
      return;
    }
    completeOAuth("facebook", code).catch((err) => {
      setError(err instanceof ApiError ? err.message : "Đăng nhập Facebook thất bại");
    });
  }, [searchParams, completeOAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <p className="text-on-surface">{error || "Đang đăng nhập bằng Facebook..."}</p>
    </div>
  );
}

export default function FacebookCallback() {
  return (
    <Suspense>
      <FacebookCallbackInner />
    </Suspense>
  );
}
