"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { ApiError, getOAuthUrl } from "@/lib/api";
import { FacebookIcon, GoogleIcon } from "@/components/OAuthIcons";

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
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md">
        <div className="flex justify-between items-center w-full px-container-margin h-20 md:h-24 max-w-[1140px] mx-auto">
          <Link href="/" className="flex items-center">
            <Image src="/logo.png" alt="FoodVision AI Logo" width={320} height={80} className="object-contain h-16 md:h-20 w-auto" />
          </Link>
          <Link href="/login" className="font-label-md text-on-surface-variant hover:text-secondary">
            Đã có tài khoản?
          </Link>
        </div>
      </header>

      <main className="flex-grow flex flex-col md:flex-row min-h-screen pt-20">
        <section className="hidden md:block md:w-1/2 relative">
          <img
            className="absolute inset-0 w-full h-full object-cover"
            alt="Healthy food"
            src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1200&auto=format&fit=crop"
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute bottom-12 left-12 text-white max-w-md">
            <h2 className="font-headline-md mb-2">Bắt đầu hành trình dinh dưỡng</h2>
            <p className="text-white/80">Quét món ăn, theo dõi calo và nhận gợi ý thực đơn cá nhân.</p>
          </div>
        </section>

        <section className="w-full md:w-1/2 flex items-center justify-center p-container-margin md:p-xl bg-background">
          <div className="w-full max-w-[400px] flex flex-col gap-lg">
            <div>
              <h1 className="font-headline-md text-on-surface mb-xs">Tạo tài khoản</h1>
              <p className="text-outline">Miễn phí — chỉ mất vài giây.</p>
            </div>

            {error && (
              <p className="text-red-500 text-sm bg-red-500/10 px-4 py-2 rounded-lg">{error}</p>
            )}

            <form className="flex flex-col gap-md" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-xs">
                <label className="font-label-md text-primary uppercase text-[10px] tracking-widest" htmlFor="name">Họ và tên</label>
                <input id="name" required value={name} onChange={(e) => setName(e.target.value)} className="editorial-input bg-transparent py-sm" placeholder="Trần Văn A" />
              </div>
              <div className="flex flex-col gap-xs">
                <label className="font-label-md text-primary uppercase text-[10px] tracking-widest" htmlFor="email">Email</label>
                <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="editorial-input bg-transparent py-sm" placeholder="email@example.com" />
              </div>
              <div className="flex flex-col gap-xs">
                <label className="font-label-md text-primary uppercase text-[10px] tracking-widest" htmlFor="password">Mật khẩu</label>
                <input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="editorial-input bg-transparent py-sm" placeholder="Tối thiểu 6 ký tự" />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-primary text-on-primary py-4 rounded-lg font-label-md hover:opacity-90 disabled:opacity-60 mt-2">
                {loading ? "Đang tạo tài khoản..." : "Đăng ký"}
              </button>
              <div className="flex items-center gap-gutter">
                <hr className="flex-grow border-outline-variant/30" />
                <span className="font-label-sm text-outline/50">hoặc</span>
                <hr className="flex-grow border-outline-variant/30" />
              </div>
              <div className="grid grid-cols-2 gap-gutter">
                <button type="button" onClick={() => { window.location.href = getOAuthUrl("google"); }} className="flex items-center justify-center gap-2 py-3 border border-outline-variant/40 rounded-lg hover:bg-surface-container-low">
                  <GoogleIcon /><span className="font-label-md">Google</span>
                </button>
                <button type="button" onClick={() => { window.location.href = getOAuthUrl("facebook"); }} className="flex items-center justify-center gap-2 py-3 border border-outline-variant/40 rounded-lg hover:bg-surface-container-low">
                  <FacebookIcon /><span className="font-label-md">Facebook</span>
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
