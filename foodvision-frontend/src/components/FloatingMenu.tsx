"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function FloatingMenu() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const hiddenRoutes = ["/scanner", "/scanner/select-tray", "/smart-fridge", "/ar-vision", "/detection-result"];

  // Automatically slide out when entering the website
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (hiddenRoutes.includes(pathname || "")) {
    return null;
  }

  return (
    <div
      className={`fixed top-1/2 -translate-y-1/2 right-0 z-50 transition-transform duration-700 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Container to handle the relative positioning of the avatar */}
      <div className="relative bg-[#1c1e22] text-white w-48 rounded-l-2xl shadow-2xl py-10 px-4 flex flex-col gap-8 border-y border-l border-[#2e3136]">
        
        {/* Toggle Button / Avatar */}
        <div
          className="absolute -left-[4.5rem] -top-6 cursor-pointer hover:scale-105 transition-transform"
          onClick={() => setIsOpen(!isOpen)}
        >
          <img
            src="https://s3-hcm-r2.s3cloud.vn/wibugame/migrate/wibugame/wibugame/images/avatars/PaimonPayment.png"
            alt="Paimon Toggle"
            className="w-24 h-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          />
        </div>

        {/* Menu Items */}
        <Link href="/diary" className="flex items-center gap-4 hover:text-[#ff8787] transition-colors group">
          <div className="w-10 h-10 rounded-full bg-[#2b2d31] flex items-center justify-center group-hover:bg-[#ff8787] group-hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[20px]">menu_book</span>
          </div>
          <span className="font-bold text-[15px] tracking-wide">Nhật ký</span>
        </Link>

        <Link href="/dashboard" className="flex items-center gap-4 hover:text-[#38d9a9] transition-colors group">
          <div className="w-10 h-10 rounded-full bg-[#2b2d31] flex items-center justify-center group-hover:bg-[#38d9a9] group-hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[20px]">restaurant</span>
          </div>
          <span className="font-bold text-[15px] tracking-wide">Thực đơn</span>
        </Link>

        <Link href="/dashboard" className="flex items-center gap-4 hover:text-[#ffd43b] transition-colors group">
          <div className="w-10 h-10 rounded-full bg-[#2b2d31] flex items-center justify-center group-hover:bg-[#ffd43b] group-hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[20px]">insights</span>
          </div>
          <span className="font-bold text-[15px] tracking-wide">Thống kê</span>
        </Link>

        <Link href="/dashboard" className="flex items-center gap-4 hover:text-[#4dabf7] transition-colors group">
          <div className="w-10 h-10 rounded-full bg-[#2b2d31] flex items-center justify-center group-hover:bg-[#4dabf7] group-hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[20px]">forum</span>
          </div>
          <span className="font-bold text-[15px] tracking-wide">Cộng đồng</span>
        </Link>

        <Link href="/settings" className="flex items-center gap-4 hover:text-[#eebefa] transition-colors group">
          <div className="w-10 h-10 rounded-full bg-[#2b2d31] flex items-center justify-center group-hover:bg-[#eebefa] group-hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[20px]">settings</span>
          </div>
          <span className="font-bold text-[15px] tracking-wide">Cài đặt</span>
        </Link>
      </div>
    </div>
  );
}
