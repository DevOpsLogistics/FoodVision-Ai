"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import LoginHero from "@/components/LoginHero";
import Navigation from "@/components/Navigation";
import { authApi, ApiError } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authApi.forgotPassword(email.trim());
      setSent(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Không gửi được yêu cầu. Thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

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
            <h1 className="text-lg text-white">Quên mật khẩu</h1>
            <p className="text-white/60 text-xs">
              Nhập email đã đăng ký — mật khẩu mới sẽ được gửi về hộp thư
            </p>
          </div>

          {sent ? (
            <p className="text-sm text-white/80 bg-white/5 px-4 py-3 rounded-lg text-center">
              Nếu email tồn tại, mật khẩu mới đã được gửi. Kiểm tra hộp thư (và mục Spam).
            </p>
          ) : (
            <form className="flex flex-col gap-sm" onSubmit={handleSubmit}>
              {error && (
                <p className="text-xs text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">{error}</p>
              )}
              <div className="flex flex-col gap-xs">
                <label className="uppercase tracking-widest text-[10px] text-white/80" htmlFor="email">
                  Địa chỉ Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="editorial-input bg-transparent py-sm text-white placeholder:text-white/30 border-white/20"
                  placeholder="email@example.com"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-500 text-white py-3 rounded-lg text-sm font-medium hover:bg-red-600 transition-all mt-1 disabled:opacity-60"
              >
                {loading ? "Đang gửi..." : "Gửi mật khẩu qua email"}
              </button>
            </form>
          )}

          <div className="flex justify-center gap-4 text-xs text-white/70 pt-1 border-t border-white/10">
            <Link href="/login" className="hover:text-white transition-colors">
              Đăng nhập
            </Link>
            <span className="text-white/30">|</span>
            <Link href="/register" className="hover:text-white transition-colors">
              Đăng ký
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
