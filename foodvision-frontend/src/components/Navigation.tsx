"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useUser } from "@/hooks/useUser";

export default function Navigation() {
  const pathname = usePathname();
  const { user } = useUser();

  const mainNavItems = [
    { name: "Bảng điều khiển", icon: "grid_view", path: "/dashboard" },
    { name: "Máy quét", icon: "center_focus_strong", path: "/scanner" },
    { name: "Thực đơn", icon: "restaurant_menu", path: "/meal-recommendations" },
    { name: "Nhật ký", icon: "auto_stories", path: "/diary" },
    { name: "Cộng đồng", icon: "groups", path: "/community" },
  ];

  const extendedNavItems = [
    { name: "Phân tích", icon: "analytics", path: "/nutrition-analytics" },
    { name: "Thử thách", icon: "emoji_events", path: "/challenges" },
    { name: "Cửa hàng", icon: "storefront", path: "/store" },
    { name: "Cài đặt", icon: "settings", path: "/settings" },
    { name: "Tủ lạnh thông minh", icon: "kitchen", path: "/smart-fridge" },
    { name: "Đo sinh trắc học", icon: "vital_signs", path: "/biometric-scan" },
    { name: "Cỗ máy sức khỏe", icon: "timelapse", path: "/health-timelapse" },
    { name: "Dinh dưỡng DNA", icon: "genetics", path: "/dna-nutrition" },
  ];

  // Mobile nav shows main items + a 'Menu' button that links to settings or a menu page for now
  const mobileNavItems = [
    { name: "Trang chủ", icon: "grid_view", path: "/dashboard" },
    { name: "Máy quét", icon: "center_focus_strong", path: "/scanner" },
    { name: "Nhật ký", icon: "auto_stories", path: "/diary" },
    { name: "Mở rộng", icon: "menu", path: "#" }, // Placeholder for mobile menu drawer
  ];

  return (
    <>
      {/* TopAppBar */}
      <header className="bg-surface fixed top-0 left-0 right-0 z-50 shadow-sm border-b border-surface-variant/20">
        <nav className="flex items-center w-full px-6 md:px-12 h-20 md:h-24 gap-8">
          <Link href="/dashboard" className="flex items-center shrink-0">
            <Image src="/logo.png" alt="FoodVision AI Logo" width={320} height={80} className="object-contain h-16 md:h-20 w-auto" />
          </Link>
          {/* Desktop Nav Links */}
          <div className="hidden md:flex flex-1 justify-evenly items-center px-4 lg:px-12">


            {/* Dropdown Menu - Features */}
            <div className="relative group py-4">
              <button className={`flex items-center gap-2 font-label-md transition-colors ${
                  extendedNavItems.some(item => pathname === item.path)
                    ? "text-on-surface font-bold"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}>
                <span className="material-symbols-outlined">menu</span>
                Danh mục
              </button>
              
              {/* Dropdown Content */}
              <div className="absolute top-[80%] left-0 w-64 bg-surface-container border border-surface-variant/30 rounded-xl shadow-xl overflow-hidden invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 z-50 flex flex-col py-2">
                {extendedNavItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                      pathname === item.path
                        ? "text-on-surface bg-surface-variant/50 font-bold"
                        : "text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface"
                    }`}
                  >
                    <span className="font-label-md">{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {mainNavItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`font-label-md text-label-md transition-colors active:scale-95 duration-150 ${
                  pathname === item.path
                    ? "text-red-500 font-bold"
                    : "text-on-surface-variant hover:text-red-400"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <Link href="/settings" className="hidden md:flex items-center gap-3 pl-6 border-l border-surface-variant/30 shrink-0 cursor-pointer group ml-auto">
            <div className="w-10 h-10 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center font-bold text-lg group-hover:bg-red-500/30 transition-colors overflow-hidden shrink-0">
              {user.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                user.name ? user.name.charAt(0).toUpperCase() : "K"
              )}
            </div>
            <div className="flex flex-col max-w-[150px]">
              <span className="font-label-md text-on-surface group-hover:text-red-500 transition-colors truncate">
                {user.name}
              </span>
              <span className="text-xs text-on-surface-variant truncate">Thành viên Bạc</span>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-red-500 transition-colors ml-1 shrink-0">expand_more</span>
          </Link>
        </nav>
      </header>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 pb-safe bg-surface-container-lowest shadow-lg rounded-t-xl border-t border-surface-variant/20">
        {mobileNavItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center justify-center transition-all duration-200 px-4 py-1 ${
                isActive
                  ? "text-red-500 bg-red-500/10 rounded-full active:scale-90"
                  : "text-on-surface-variant hover:bg-surface-container-high rounded-xl"
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              <span className="font-label-sm text-label-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
