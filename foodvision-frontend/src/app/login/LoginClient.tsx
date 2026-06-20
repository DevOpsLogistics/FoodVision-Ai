"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ApiError, getOAuthUrl } from "@/lib/api";
import { FacebookIcon, GoogleIcon } from "@/components/OAuthIcons";
import LoginHero from "@/components/LoginHero";
import Navigation from "@/components/Navigation";

export default function LoginClient() {
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  const oauthError = searchParams.get("error");

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
            <h2 className="text-lg text-white">Đăng nhập</h2>
            <p className="text-white/60 text-xs">Nhập thông tin tài khoản của bạn</p>
          </div>

          {(error || oauthError) && (
            <p className="text-red-400 text-sm bg-red-500/10 px-4 py-2 rounded-lg">
              {error || oauthError}
            </p>
          )}

          <form className="flex flex-col gap-sm" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-xs">
              <label className="uppercase tracking-widest text-[10px] text-white/80" htmlFor="email">
                Địa chỉ Email
              </label>
              <input
                className="editorial-input bg-transparent py-sm text-white placeholder:text-white/30 border-white/20"
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
              />
            </div>
            <div className="flex flex-col gap-xs">
              <div className="flex justify-between items-center">
                <label className="uppercase tracking-widest text-[10px] text-white/80" htmlFor="password">
                  Mật khẩu
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] text-white/60 hover:text-white transition-colors"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <input
                className="editorial-input bg-transparent py-sm text-white placeholder:text-white/30 border-white/20"
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 text-white py-3 rounded-lg text-sm font-medium hover:bg-red-600 transition-all active:scale-[0.98] shadow-lg disabled:opacity-60 mt-1"
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>

            <div className="flex items-center gap-gutter">
              <hr className="flex-grow border-white/15" />
              <span className="text-[11px] text-white/40">hoặc tiếp tục với</span>
              <hr className="flex-grow border-white/15" />
            </div>
            <div className="grid grid-cols-2 gap-gutter">
              <button
                type="button"
                onClick={() => { window.location.href = getOAuthUrl("google"); }}
                className="flex items-center justify-center gap-2 py-2.5 border border-white/15 rounded-lg hover:bg-white/5 transition-colors text-sm text-white/80"
              >
                <GoogleIcon />
                <span>Google</span>
              </button>
              <button
                type="button"
                onClick={() => { window.location.href = getOAuthUrl("facebook"); }}
                className="flex items-center justify-center gap-2 py-2.5 border border-white/15 rounded-lg hover:bg-white/5 transition-colors text-sm text-white/80"
              >
                <FacebookIcon />
                <span>Facebook</span>
              </button>
            </div>
          </form>

          <p className="text-center text-xs text-white/60">
            Chưa có tài khoản?{" "}
            <Link href="/register" className="text-white font-medium hover:underline">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
