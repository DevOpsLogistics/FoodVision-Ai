"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import BannerSlider from "@/components/BannerSlider";
import { useUser } from "@/hooks/useUser";

const COMMUNITY_ITEMS = [
  { title: "Cá hú kho", scans: 320, image: "/images/dishes/ca_hu_kho.jpg" },
  { title: "Canh chua cá", scans: 215, image: "/images/dishes/canh_chua_co_ca.jpg" },
  { title: "Sườn nướng", scans: 189, image: "/images/dishes/suon_nuong.jpg" },
  { title: "Thịt kho trứng", scans: 150, image: "/images/dishes/thit_kho_trung.jpg" },
  { title: "Đậu hũ sốt cà", scans: 120, image: "/images/dishes/dau_hu_sot_ca.jpg" },
  { title: "Trứng chiên", scans: 95, image: "/images/dishes/trung_chien.jpg" },
];

export default function Dashboard() {
  const { user } = useUser();
  const [greeting, setGreeting] = useState("Chào bạn");

  useEffect(() => {
    // Determine greeting based on current time
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 12) {
      setGreeting("Chào buổi sáng");
    } else if (hour >= 12 && hour < 14) {
      setGreeting("Chào buổi trưa");
    } else if (hour >= 14 && hour < 18) {
      setGreeting("Chào buổi chiều");
    } else {
      setGreeting("Chào buổi tối");
    }

    // Micro-interaction for the macro rings
    const rings = document.querySelectorAll<SVGElement>(".macro-ring");
    rings.forEach((ring) => {
      const targetOffset = ring.getAttribute("stroke-dashoffset");
      ring.style.strokeDashoffset = "283"; // Initial state
      setTimeout(() => {
        if (targetOffset) ring.style.strokeDashoffset = targetOffset;
      }, 300);
    });
  }, []);

  return (
    <div className="font-body-md text-body-md selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-32 px-container-margin max-w-[1140px] mx-auto">
        {/* Banner Slider */}
        <BannerSlider />

        {/* Welcome Header */}
        <section className="mb-lg">
          <h1 className="font-headline-md text-headline-md mb-xs">
            {greeting}, {user.name}
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Tổng quan ngày của bạn.
          </p>
        </section>

        {/* Nutrition Summary Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-md mb-xl">
          {/* Main Calorie Card */}
          <div className="md:col-span-8 bg-surface-container-lowest editorial-card rounded-xl p-lg flex flex-col md:flex-row items-center gap-lg border border-[#F2EFE9]">
            <div className="relative w-48 h-48">
              <svg
                className="w-full h-full transform -rotate-90"
                viewBox="0 0 100 100"
              >
                <circle
                  className="text-surface-container"
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="8"
                ></circle>
                <circle
                  className="text-yellow-400 macro-ring transition-[stroke-dashoffset] duration-1000 ease-out"
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="45"
                  stroke="currentColor"
                  strokeDasharray="283"
                  strokeDashoffset="70"
                  strokeWidth="8"
                ></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-headline-sm text-headline-sm text-on-surface">
                  1,420
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  kcal còn lại
                </span>
              </div>
            </div>
            <div className="flex-1 space-y-md w-full">
              <h2 className="font-headline-sm text-headline-sm">
                Dinh dưỡng hằng ngày
              </h2>
              <div className="space-y-sm">
                <div className="flex justify-between items-center">
                  <span className="font-label-md text-label-md flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm shadow-rose-500/30"></span>{" "}
                    Đạm (Protein)
                  </span>
                  <span className="font-body-md text-body-md">45g / 120g</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-label-md text-label-md flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-500/30"></span>{" "}
                    Tinh bột (Carbs)
                  </span>
                  <span className="font-body-md text-body-md">180g / 250g</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-label-md text-label-md flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500 shadow-sm shadow-blue-500/30"></span>{" "}
                    Chất béo (Fats)
                  </span>
                  <span className="font-body-md text-body-md">32g / 70g</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mini Highlight Cards */}
          <div className="md:col-span-4 grid grid-cols-2 gap-md">
            {/* Water */}
            <div className="bg-surface-container-lowest rounded-xl p-md flex flex-col justify-center items-start gap-sm border border-surface-variant/30">
              <div>
                <p className="font-label-sm text-label-sm text-on-surface-variant">Lượng nước</p>
                <p className="font-headline-sm text-headline-sm text-on-surface">1.2/2.5L</p>
              </div>
            </div>
            {/* Calories Burned */}
            <div className="bg-surface-container-lowest rounded-xl p-md flex flex-col justify-center items-start gap-sm border border-surface-variant/30">
              <div>
                <p className="font-label-sm text-label-sm text-on-surface-variant">Đã đốt</p>
                <p className="font-headline-sm text-headline-sm text-on-surface">450 kcal</p>
              </div>
            </div>
            {/* Steps */}
            <div className="bg-surface-container-lowest rounded-xl p-md flex flex-col justify-center items-start gap-sm border border-surface-variant/30">
              <div>
                <p className="font-label-sm text-label-sm text-on-surface-variant">Bước chân</p>
                <p className="font-headline-sm text-headline-sm text-on-surface">4,230</p>
              </div>
            </div>
            {/* Streaks */}
            <div className="bg-surface-container-lowest rounded-xl p-md flex flex-col justify-center items-start gap-sm border border-surface-variant/30">
              <div>
                <p className="font-label-sm text-label-sm text-on-surface-variant">Chuỗi ngày</p>
                <p className="font-headline-sm text-headline-sm text-on-surface">7 Ngày</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Insights Section */}
        <section className="mb-xl">
          <div className="flex items-center justify-center mb-6 mt-8 opacity-90">
            <div className="flex-1 border-t border-b border-[#b82c2a] h-1.5"></div>
            <h2 className="px-6 font-bold text-lg md:text-xl text-on-surface uppercase tracking-widest text-center whitespace-nowrap">
              Phân tích thông minh
            </h2>
            <div className="flex-1 border-t border-b border-[#b82c2a] h-1.5"></div>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-lg border border-surface-variant/30 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 text-yellow-500 opacity-10">
              <span className="material-symbols-outlined text-[120px]">psychology</span>
            </div>
            <div className="flex items-start gap-4 relative z-10">
              <div>
                <h3 className="font-title-md text-title-md text-on-surface mb-2">Nhận xét từ FoodVision AI</h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Dựa trên các bữa ăn gần đây, bạn đang tiêu thụ khá nhiều chất béo (đã đạt 85% giới hạn ngày). Gợi ý: Bữa tối hãy ưu tiên rau xanh và thực phẩm hấp luộc để cân bằng nhé!
                </p>
                <button className="mt-4 text-yellow-500 font-label-md text-label-md hover:underline flex items-center gap-1">
                  Xem chi tiết phân tích <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Reminders / Timeline Section */}
        <section className="mb-xl">
          <div className="flex items-center justify-center mb-6 mt-8 opacity-90">
            <div className="flex-1 border-t border-b border-[#b82c2a] h-1.5"></div>
            <h2 className="px-6 font-bold text-lg md:text-xl text-on-surface uppercase tracking-widest text-center whitespace-nowrap">
              Lịch trình hôm nay
            </h2>
            <div className="flex-1 border-t border-b border-[#b82c2a] h-1.5"></div>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-lg border border-surface-variant/30 flex flex-col gap-6">
            <div className="flex gap-4 items-center">
              <div className="text-on-surface-variant font-label-md w-16 text-right">08:00</div>
              <div className="w-3 h-3 rounded-full bg-yellow-500 shrink-0"></div>
              <div className="flex-1 bg-surface-container-lowest p-3 rounded-lg border border-surface-variant/20 flex justify-between items-center">
                <span className="font-body-md">Bữa sáng (Yến mạch)</span>
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <div className="text-on-surface-variant font-label-md w-16 text-right">12:30</div>
              <div className="w-3 h-3 rounded-full bg-yellow-500 shrink-0 relative">
                <span className="absolute w-3 h-3 rounded-full bg-yellow-500 animate-ping opacity-75"></span>
              </div>
              <div className="flex-1 bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/20 flex justify-between items-center text-yellow-500">
                <span className="font-body-md font-bold">Bữa trưa - Cần ghi nhận</span>
              </div>
            </div>
            <div className="flex gap-4 items-center opacity-50">
              <div className="text-on-surface-variant font-label-md w-16 text-right">15:00</div>
              <div className="w-3 h-3 rounded-full bg-surface-variant shrink-0"></div>
              <div className="flex-1 bg-surface-container-lowest p-3 rounded-lg border border-surface-variant/20 flex justify-between items-center">
                <span className="font-body-md">Giờ uống nước (500ml)</span>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Meals Section */}
        <section className="mb-xl">
          <div className="flex items-center justify-center mb-6 mt-8 opacity-90">
            <div className="flex-1 border-t border-b border-[#b82c2a] h-1.5"></div>
            <h2 className="px-6 font-bold text-lg md:text-xl text-on-surface uppercase tracking-widest text-center whitespace-nowrap">
              Bữa ăn gần đây
            </h2>
            <div className="flex-1 border-t border-b border-[#b82c2a] h-1.5"></div>
          </div>
          <div className="flex justify-end mb-md">
            <Link href="/diary" className="font-label-md text-label-md text-red-500 hover:text-red-400 hover:underline transition-all">
              Xem nhật ký
            </Link>
          </div>
          <div className="flex overflow-x-auto gap-md pb-4 hide-scrollbar snap-x">
            {/* Meal Card 1 */}
            <div className="bg-surface-container-lowest rounded-xl overflow-hidden editorial-card border border-[#F2EFE9] min-w-[280px] shrink-0 snap-start">
              <img
                className="w-full h-48 object-cover"
                alt="Canh chua cá"
                src="/images/dishes/canh_chua_co_ca.jpg"
              />
              <div className="p-md">
                <div className="flex justify-between items-start mb-xs">
                  <h3 className="font-label-md text-label-md text-on-surface">
                    Canh chua có cá
                  </h3>
                  <span className="font-label-sm text-label-sm px-2 py-1 bg-primary/10 text-primary rounded-full whitespace-nowrap ml-2">
                    Bữa trưa
                  </span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant mb-md">
                  Cá hú, bạc hà, đậu bắp, cà chua
                </p>
                <div className="flex justify-between items-center text-on-surface">
                  <span className="font-label-sm text-label-sm">540 kcal</span>
                  <span className="material-symbols-outlined text-[20px]">
                    chevron_right
                  </span>
                </div>
              </div>
            </div>

            {/* Meal Card 2 */}
            <div className="bg-surface-container-lowest rounded-xl overflow-hidden editorial-card border border-[#F2EFE9] min-w-[280px] shrink-0 snap-start">
              <img
                className="w-full h-48 object-cover"
                alt="Thịt kho trứng"
                src="/images/dishes/thit_kho_trung.jpg"
              />
              <div className="p-md">
                <div className="flex justify-between items-start mb-xs">
                  <h3 className="font-label-md text-label-md text-on-surface">
                    Thịt kho trứng
                  </h3>
                  <span className="font-label-sm text-label-sm px-2 py-1 bg-tertiary/10 text-tertiary rounded-full whitespace-nowrap ml-2">
                    Bữa sáng
                  </span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant mb-md">
                  Thịt ba chỉ, trứng vịt, nước dừa
                </p>
                <div className="flex justify-between items-center text-on-surface">
                  <span className="font-label-sm text-label-sm">310 kcal</span>
                  <span className="material-symbols-outlined text-[20px]">
                    chevron_right
                  </span>
                </div>
              </div>
            </div>

            {/* Meal Card 3 */}
            <div className="bg-surface-container-lowest rounded-xl overflow-hidden editorial-card border border-[#F2EFE9] min-w-[280px] shrink-0 snap-start">
              <img
                className="w-full h-48 object-cover"
                alt="Đậu hũ sốt cà"
                src="/images/dishes/dau_hu_sot_ca.jpg"
              />
              <div className="p-md">
                <div className="flex justify-between items-start mb-xs">
                  <h3 className="font-label-md text-label-md text-on-surface">
                    Đậu hũ sốt cà
                  </h3>
                  <span className="font-label-sm text-label-sm px-2 py-1 bg-green-500/10 text-green-600 rounded-full whitespace-nowrap ml-2">
                    Bữa tối
                  </span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant mb-md">
                  Đậu hũ non, cà chua, hành lá
                </p>
                <div className="flex justify-between items-center text-on-surface">
                  <span className="font-label-sm text-label-sm">220 kcal</span>
                  <span className="material-symbols-outlined text-[20px]">
                    chevron_right
                  </span>
                </div>
              </div>
            </div>

            {/* Meal Card 4 */}
            <div className="bg-surface-container-lowest rounded-xl overflow-hidden editorial-card border border-[#F2EFE9] min-w-[280px] shrink-0 snap-start">
              <img
                className="w-full h-48 object-cover"
                alt="Sườn nướng"
                src="/images/dishes/suon_nuong.jpg"
              />
              <div className="p-md">
                <div className="flex justify-between items-start mb-xs">
                  <h3 className="font-label-md text-label-md text-on-surface">
                    Sườn nướng
                  </h3>
                  <span className="font-label-sm text-label-sm px-2 py-1 bg-primary/10 text-primary rounded-full whitespace-nowrap ml-2">
                    Bữa trưa
                  </span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant mb-md">
                  Sườn non, mật ong, tiêu xanh
                </p>
                <div className="flex justify-between items-center text-on-surface">
                  <span className="font-label-sm text-label-sm">450 kcal</span>
                  <span className="material-symbols-outlined text-[20px]">
                    chevron_right
                  </span>
                </div>
              </div>
            </div>

            {/* Add New Action */}
            <div className="bg-surface-container-low rounded-xl border-2 border-dashed border-outline-variant flex flex-col items-center justify-center min-w-[280px] shrink-0 snap-start cursor-pointer hover:bg-surface-container transition-colors active:scale-95 duration-200">
              <span className="material-symbols-outlined text-48 text-outline mb-sm text-[48px]">
                add_circle
              </span>
              <p className="font-label-md text-label-md text-outline">
                Thêm bữa ăn
              </p>
            </div>
          </div>
        </section>

        {/* Recommendations */}
        <section>
          <div className="flex items-center justify-center mb-8 mt-8 opacity-90">
            <div className="flex-1 border-t border-b border-[#b82c2a] h-1.5"></div>
            <h2 className="px-6 font-bold text-lg md:text-xl text-on-surface uppercase tracking-widest text-center whitespace-nowrap">
              Gợi ý hôm nay
            </h2>
            <div className="flex-1 border-t border-b border-[#b82c2a] h-1.5"></div>
          </div>
          <div className="bg-surface-container-lowest text-on-surface border border-surface-variant/30 rounded-xl p-lg flex flex-col md:flex-row gap-lg items-center relative overflow-hidden">
            {/* Decorative background shape */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-surface-variant opacity-10 rounded-full -mr-20 -mt-20"></div>
            <div className="flex-1 z-10">
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant mb-base block">
                Lựa chọn của đầu bếp
              </span>
              <h3 className="font-headline-md text-headline-md mb-sm">
                Sườn nướng
              </h3>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-md" style={{ maxWidth: '500px' }}>
                Món sườn nướng thơm lừng, đậm đà gia vị truyền thống, gợi nhớ hương vị bữa cơm gia đình.
              </p>
              <button className="bg-surface-container-high text-on-surface border border-surface-variant px-lg py-md rounded-lg font-label-md text-label-md hover:bg-surface-container-highest transition-colors active:scale-95">
                Xem công thức
              </button>
            </div>
            <div className="w-full md:w-1/3 h-64 rounded-xl overflow-hidden z-10 border border-surface-variant/30 shadow-lg relative">
              <img
                className="absolute inset-0 w-full h-full object-cover"
                alt="Grilled salmon fillet"
                src="/images/dishes/suon_nuong.jpg"
              />
            </div>
          </div>
        </section>

        {/* Community Trends Section */}
        <section className="mt-xl mb-12 overflow-hidden">
          <style>{`
            @keyframes marquee-scroll-right {
              0% { transform: translateX(-50%); }
              100% { transform: translateX(0%); }
            }
            .marquee-container {
              display: flex;
              width: max-content;
              animation: marquee-scroll-right 30s linear infinite;
            }
            .marquee-container:hover {
              animation-play-state: paused;
            }
          `}</style>
          <div className="flex items-center justify-center mb-6 mt-8 opacity-90">
            <div className="flex-1 border-t border-b border-[#b82c2a] h-1.5"></div>
            <h2 className="px-6 font-bold text-lg md:text-xl text-on-surface uppercase tracking-widest text-center whitespace-nowrap">
              Cộng đồng
            </h2>
            <div className="flex-1 border-t border-b border-[#b82c2a] h-1.5"></div>
          </div>
          <div className="relative w-full">
            <div className="marquee-container gap-4">
              {/* First Set of Items */}
              {COMMUNITY_ITEMS.map((item, idx) => (
                <div key={`set1-${idx}`} className="w-[180px] shrink-0 bg-surface-container-lowest border border-surface-variant/30 rounded-xl p-3 flex flex-col gap-3 hover:bg-surface-container-low transition-colors cursor-pointer">
                  <div className="w-full aspect-square rounded-lg bg-surface-variant overflow-hidden shrink-0">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-center">
                    <h4 className="font-title-sm text-on-surface line-clamp-1">{item.title}</h4>
                    <p className="font-body-sm text-on-surface-variant">{item.scans} lượt quét</p>
                  </div>
                </div>
              ))}
              {/* Second Set of Items (Duplicate for seamless loop) */}
              {COMMUNITY_ITEMS.map((item, idx) => (
                <div key={`set2-${idx}`} className="w-[180px] shrink-0 bg-surface-container-lowest border border-surface-variant/30 rounded-xl p-3 flex flex-col gap-3 hover:bg-surface-container-low transition-colors cursor-pointer">
                  <div className="w-full aspect-square rounded-lg bg-surface-variant overflow-hidden shrink-0">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-center">
                    <h4 className="font-title-sm text-on-surface line-clamp-1">{item.title}</h4>
                    <p className="font-body-sm text-on-surface-variant">{item.scans} lượt quét</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Floating Action Button (Only on Mobile Dashboard) */}
      <button className="md:hidden fixed right-6 bottom-24 bg-primary text-on-primary w-14 h-14 rounded-full shadow-xl flex items-center justify-center active:scale-95 transition-transform z-40">
        <span className="material-symbols-outlined text-[32px]">camera</span>
      </button>
    </div>
  );
}
