"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Login() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-body-md overflow-x-hidden">
      {/* Top Navigation Anchor */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md">
        <div className="flex justify-between items-center w-full px-container-margin h-20 md:h-24 max-w-[1140px] mx-auto">
          <Link href="/dashboard" className="flex items-center">
            <Image src="/logo.png" alt="FoodVision AI Logo" width={320} height={80} className="object-contain h-16 md:h-20 w-auto" />
          </Link>
          <div className="hidden md:flex gap-gutter items-center">
            <span className="font-label-md text-label-md text-on-surface-variant hover:text-secondary cursor-pointer transition-colors">
              Tham gia ngay
            </span>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col md:flex-row min-h-screen">
        {/* Visual Anchor: Asymmetric Imagery Section */}
        <section className="w-full md:w-1/2 relative h-[409px] md:h-screen overflow-hidden">
          <img
            alt="Artisanal kitchen scene"
            className="absolute inset-0 w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiCE1l5hgONdY9YS4Ubpcf822XuCi8C7ef2AXsgQTRmUTaW80zJ-s5Mtxui9Jse_0kPFfK26uYtm4rICTIwaIuoxA3tCl6XIW0WPYWDQr3rDes3Q2pqhtujXg-HLQ4cx0924H2PpQADcKQzTrH9BCW46RDV0gS5jSJRg18zKWlCM5eMxoe9me4t0roLHNUCR1hOAwbiAuYiiGf3Q--vmygVbggRdtWXCq2LsJ2SjRMrBcavJYuSab-yCgAmcMDGegp-5W0gk7jv28s"
          />
          <div className="absolute inset-0 hero-gradient"></div>
          {/* Mobile-only text overlap */}
          <div className="absolute bottom-10 left-container-margin md:hidden z-10">
            <h2 className="font-headline-md text-headline-md text-on-surface">
              Chào mừng bạn quay lại căn bếp.
            </h2>
          </div>
        </section>

        {/* Form Canvas */}
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
            <form className="flex flex-col gap-md" onSubmit={(e) => e.preventDefault()}>
              <div className="flex flex-col gap-xs group">
                <label
                  className="font-label-md text-label-md text-primary uppercase tracking-widest text-[10px] group-focus-within:text-secondary transition-colors"
                  htmlFor="email"
                >
                  Địa chỉ Email
                </label>
                <input
                  className="editorial-input bg-transparent py-sm font-body-md text-on-surface placeholder:text-outline/40"
                  id="email"
                  placeholder="sophie@example.com"
                  type="email"
                />
              </div>
              <div className="flex flex-col gap-xs group">
                <div className="flex justify-between items-center">
                  <label
                    className="font-label-md text-label-md text-primary uppercase tracking-widest text-[10px] group-focus-within:text-secondary transition-colors"
                    htmlFor="password"
                  >
                    Mật khẩu
                  </label>
                  <a
                    className="font-label-sm text-label-sm text-outline hover:text-secondary transition-colors font-normal italic"
                    href="#"
                  >
                    Quên mật khẩu?
                  </a>
                </div>
                <input
                  className="editorial-input bg-transparent py-sm font-body-md text-on-surface placeholder:text-outline/40"
                  id="password"
                  placeholder="••••••••"
                  type="password"
                />
              </div>
              <div className="mt-base flex flex-col gap-md">
                <Link
                  href="/dashboard"
                  className="w-full bg-primary text-on-primary py-4 rounded-lg font-label-md text-label-md hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-primary/10 flex items-center justify-center gap-base border border-primary/20"
                >
                  Vào Bếp
                  <span className="material-symbols-outlined text-[20px]">
                    arrow_right_alt
                  </span>
                </Link>
                <div className="flex items-center gap-gutter">
                  <hr className="flex-grow border-outline-variant/30" />
                  <span className="font-label-sm text-label-sm text-outline/50">
                    hoặc tiếp tục với
                  </span>
                  <hr className="flex-grow border-outline-variant/30" />
                </div>
                <div className="grid grid-cols-2 gap-gutter">
                  <button className="flex items-center justify-center gap-base py-3 border border-outline-variant/40 rounded-lg hover:bg-surface-container-low transition-colors">
                    <span className="material-symbols-outlined text-[20px]">
                      google
                    </span>
                    <span className="font-label-md text-label-md">Google</span>
                  </button>
                  <button className="flex items-center justify-center gap-base py-3 border border-outline-variant/40 rounded-lg hover:bg-surface-container-low transition-colors">
                    <span className="material-symbols-outlined text-[20px]">
                      ios
                    </span>
                    <span className="font-label-md text-label-md">Apple</span>
                  </button>
                </div>
              </div>
            </form>
            <p className="text-center font-body-md text-body-md text-outline">
              Lần đầu đến với FoodVision?{" "}
              <a className="text-primary font-bold hover:underline" href="#">
                Bắt đầu khám phá
              </a>
            </p>
          </div>
        </section>
      </main>

      {/* Subtle atmospheric effect */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-20 transition-opacity duration-500"
        style={{
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(215, 236, 149, 0.4), transparent 40%)`,
        }}
      ></div>
    </div>
  );
}
