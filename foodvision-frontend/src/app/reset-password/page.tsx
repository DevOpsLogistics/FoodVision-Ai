"use client";

import { FormEvent, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import LoginHero from "@/components/LoginHero";
import Navigation from "@/components/Navigation";
import { authApi, ApiError } from "@/lib/api";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Mật khẩu tối thiểu 6 ký tự.");
      return;
    }
    if (password !== confirm) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    if (!token) {
      setError("Link không hợp lệ. Yêu cầu gửi lại email quên mật khẩu.");
      return;
    }
    setLoading(true);
    try {
      await authApi.resetPassword(token, password);
      setDone(true);
      setTimeout(() => router.push("/login"), 2500);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Không đặt lại được mật khẩu.");
    } finally {
      setLoading(false);
    }
  };

  if (!token && !done) {
    return (
      <div className="flex flex-col gap-sm text-center">
        <p className="text-sm text-white/80 bg-white/5 px-4 py-3 rounded-lg">
          Link thiếu mã xác thực. Mở link từ email hoặc gửi lại yêu cầu.
        </p>
        <Link href="/forgot-password" className="text-sm text-red-400 hover:text-red-300">
          Gửi lại email
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <p className="text-sm text-white/80 bg-white/5 px-4 py-3 rounded-lg text-center">
        Đặt lại mật khẩu thành công. Đang chuyển đến trang đăng nhập...
      </p>
    );
  }

  return (
    <form className="flex flex-col gap-sm" onSubmit={handleSubmit}>
      {error && (
        <p className="text-xs text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">{error}</p>
      )}
      <div className="flex flex-col gap-xs">
        <label className="uppercase tracking-widest text-[10px] text-white/80" htmlFor="password">
          Mật khẩu mới
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="editorial-input bg-transparent py-sm text-white placeholder:text-white/30 border-white/20"
          placeholder="Tối thiểu 6 ký tự"
        />
      </div>
      <div className="flex flex-col gap-xs">
        <label className="uppercase tracking-widest text-[10px] text-white/80" htmlFor="confirm">
          Xác nhận mật khẩu
        </label>
        <input
          id="confirm"
          type="password"
          required
          minLength={6}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="editorial-input bg-transparent py-sm text-white placeholder:text-white/30 border-white/20"
          placeholder="Nhập lại mật khẩu"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-red-500 text-white py-3 rounded-lg text-sm font-medium hover:bg-red-600 transition-all mt-1 disabled:opacity-60"
      >
        {loading ? "Đang lưu..." : "Đặt lại mật khẩu"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col font-body-md">
      <LoginHero />
      <Navigation />

      <main className="flex-grow flex items-center justify-center px-container-margin pt-24 md:pt-28 pb-8 relative z-10">
        <div className="w-full max-w-[340px] bg-surface/95 backdrop-blur-xl rounded-xl shadow-2xl p-6 md:p-7 flex flex-col gap-md border border-white/10">
          <div className="flex flex-col items-center text-center gap-2">
            <Image
              src="/logo.png"
              alt="Bếp Hoa"
              width={220}
              height={56}
              className="object-contain h-14 w-auto"
              priority
            />
            <h1 className="text-lg text-white">Đặt lại mật khẩu</h1>
            <p className="text-white/60 text-xs">Nhập mật khẩu mới cho tài khoản của bạn</p>
          </div>

          <Suspense fallback={<p className="text-sm text-white/60 text-center">Đang tải...</p>}>
            <ResetPasswordForm />
          </Suspense>

          <div className="flex justify-center text-xs text-white/70 pt-1 border-t border-white/10">
            <Link href="/login" className="hover:text-white transition-colors">
              Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
