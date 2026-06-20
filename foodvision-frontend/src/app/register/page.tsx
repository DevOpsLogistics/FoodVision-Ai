"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { ApiError, getOAuthUrl } from "@/lib/api";
import { FacebookIcon, GoogleIcon } from "@/components/OAuthIcons";
import LoginHero from "@/components/LoginHero";
import Navigation from "@/components/Navigation";

export default function Register() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(email, password, name);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Đăng ký thất bại");
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
            <h1 className="text-lg text-white">Đăng ký</h1>
            <p className="text-white/60 text-xs">Miễn phí — chỉ mất vài giây</p>
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 px-4 py-2 rounded-lg">{error}</p>
          )}

          <form className="flex flex-col gap-sm" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-xs">
              <label className="uppercase tracking-widest text-[10px] text-white/80" htmlFor="name">Họ và tên</label>
              <input id="name" required value={name} onChange={(e) => setName(e.target.value)} className="editorial-input bg-transparent py-sm text-white placeholder:text-white/30 border-white/20" placeholder="Trần Văn A" />
            </div>
            <div className="flex flex-col gap-xs">
              <label className="uppercase tracking-widest text-[10px] text-white/80" htmlFor="email">Email</label>
              <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="editorial-input bg-transparent py-sm text-white placeholder:text-white/30 border-white/20" placeholder="email@example.com" />
            </div>
            <div className="flex flex-col gap-xs">
              <label className="uppercase tracking-widest text-[10px] text-white/80" htmlFor="password">Mật khẩu</label>
              <input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="editorial-input bg-transparent py-sm text-white placeholder:text-white/30 border-white/20" placeholder="Tối thiểu 6 ký tự" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-red-500 text-white py-3 rounded-lg text-sm font-medium hover:bg-red-600 disabled:opacity-60 mt-1">
              {loading ? "Đang tạo tài khoản..." : "Đăng ký"}
            </button>
            <div className="flex items-center gap-gutter">
              <hr className="flex-grow border-white/15" />
              <span className="text-[11px] text-white/40">hoặc</span>
              <hr className="flex-grow border-white/15" />
            </div>
            <div className="grid grid-cols-2 gap-gutter">
              <button type="button" onClick={() => { window.location.href = getOAuthUrl("google"); }} className="flex items-center justify-center gap-2 py-2.5 border border-white/15 rounded-lg hover:bg-white/5 text-sm text-white/80">
                <GoogleIcon /><span>Google</span>
              </button>
              <button type="button" onClick={() => { window.location.href = getOAuthUrl("facebook"); }} className="flex items-center justify-center gap-2 py-2.5 border border-white/15 rounded-lg hover:bg-white/5 text-sm text-white/80">
                <FacebookIcon /><span>Facebook</span>
              </button>
            </div>
          </form>

          <p className="text-center text-xs text-white/60">
            Đã có tài khoản?{" "}
            <Link href="/login" className="text-white font-medium hover:underline">
              Đăng nhập
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
