"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ApiError, getOAuthUrl } from "@/lib/api";
import { FacebookIcon, GoogleIcon } from "@/components/OAuthIcons";

export default function LoginClient() {
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

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
    <div className="min-h-screen flex flex-col font-body-md overflow-x-hidden">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md">
        <div className="flex justify-between items-center w-full px-container-margin h-20 md:h-24 max-w-[1140px] mx-auto">
          <Link href="/dashboard" className="flex items-center">
            <Image src="/logo.png" alt="FoodVision AI Logo" width={320} height={80} className="object-contain h-16 md:h-20 w-auto" />
          </Link>
          <Link href="/register" className="font-label-md text-label-md text-on-surface-variant hover:text-secondary transition-colors">
            Tham gia ngay
          </Link>
        </div>
      </header>

      <main className="flex-grow flex flex-col md:flex-row min-h-screen">
        <section className="w-full md:w-1/2 relative h-[409px] md:h-screen overflow-hidden">
          <img
            alt="Artisanal kitchen scene"
            className="absolute inset-0 w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiCE1l5hgONdY9YS4Ubpcf822XuCi8C7ef2AXsgQTRmUTaW80zJ-s5Mtxui9Jse_0kPFfK26uYtm4rICTIwaIuoxA3tCl6XIW0WPYWDQr3rDes3Q2pqhtujXg-HLQ4cx0924H2PpQADcKQzTrH9BCW46RDV0gS5jSJRg18zKWlCM5eMxoe9me4t0roLHNUCR1hOAwbiAuYiiGf3Q--vmygVbggRdtWXCq2LsJ2SjRMrBcavJYuSab-yCgAmcMDGegp-5W0gk7jv28s"
          />
          <div className="absolute inset-0 hero-gradient" />
          <div className="absolute bottom-10 left-container-margin md:hidden z-10">
            <h2 className="font-headline-md text-headline-md text-on-surface">
              Chào mừng bạn quay lại căn bếp.
            </h2>
          </div>
        </section>

        <section className="w-full md:w-1/2 flex items-center justify-center p-container-margin md:p-xl bg-background">
          <div className="w-full max-w-[400px] flex flex-col gap-lg z-10">
            <div className="hidden md:block">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-xs">
                Chào mừng bạn quay lại căn bếp.
              </h2>
              <p className="font-body-md text-body-md text-outline">
                Tiếp tục hành trình nuôi dưỡng chánh niệm.
              </p>
            </div>

            {(error || oauthError) && (
              <p className="text-red-500 text-sm bg-red-500/10 px-4 py-2 rounded-lg">
                {error || oauthError}
              </p>
            )}

            <form className="flex flex-col gap-md" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-xs group">
                <label className="font-label-md text-label-md text-primary uppercase tracking-widest text-[10px]" htmlFor="email">
                  Địa chỉ Email
                </label>
                <input
                  className="editorial-input bg-transparent py-sm font-body-md text-on-surface placeholder:text-outline/40"
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                />
              </div>
              <div className="flex flex-col gap-xs group">
                <div className="flex justify-between items-center">
                  <label className="font-label-md text-label-md text-primary uppercase tracking-widest text-[10px]" htmlFor="password">
                    Mật khẩu
                  </label>
                  <span className="font-label-sm text-label-sm text-outline italic">Quên mật khẩu?</span>
                </div>
                <input
                  className="editorial-input bg-transparent py-sm font-body-md text-on-surface placeholder:text-outline/40"
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <div className="mt-base flex flex-col gap-md">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-on-primary py-4 rounded-lg font-label-md hover:opacity-90 transition-all active:scale-95 shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? "Đang đăng nhập..." : "Vào Bếp"}
                  <span className="material-symbols-outlined text-[20px]">arrow_right_alt</span>
                </button>
                <div className="flex items-center gap-gutter">
                  <hr className="flex-grow border-outline-variant/30" />
                  <span className="font-label-sm text-label-sm text-outline/50">hoặc tiếp tục với</span>
                  <hr className="flex-grow border-outline-variant/30" />
                </div>
                <div className="grid grid-cols-2 gap-gutter">
                  <button
                    type="button"
                    onClick={() => { window.location.href = getOAuthUrl("google"); }}
                    className="flex items-center justify-center gap-2 py-3 border border-outline-variant/40 rounded-lg hover:bg-surface-container-low transition-colors"
                  >
                    <GoogleIcon />
                    <span className="font-label-md text-label-md">Google</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { window.location.href = getOAuthUrl("facebook"); }}
                    className="flex items-center justify-center gap-2 py-3 border border-outline-variant/40 rounded-lg hover:bg-surface-container-low transition-colors"
                  >
                    <FacebookIcon />
                    <span className="font-label-md text-label-md">Facebook</span>
                  </button>
                </div>
              </div>
            </form>
            <p className="text-center font-body-md text-body-md text-outline">
              Lần đầu đến với FoodVision?{" "}
              <Link className="text-primary font-bold hover:underline" href="/register">
                Bắt đầu khám phá
              </Link>
            </p>
          </div>
        </section>
      </main>

      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-20 transition-opacity duration-500"
        style={{
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(215, 236, 149, 0.4), transparent 40%)`,
        }}
      />
    </div>
  );
}
