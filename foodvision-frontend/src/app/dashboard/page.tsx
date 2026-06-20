"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import BannerSlider from "@/components/BannerSlider";
import TodayTimeline from "@/components/TodayTimeline";
import RecentMealsSection, { type RecentMealItem } from "@/components/RecentMealsSection";
import { useUser } from "@/hooks/useUser";
import VisitorAvatars from "@/components/VisitorAvatars";
import DishPhoto from "@/components/DishPhoto";
import { visitorsForDish } from "@/data/communityVisitors";
import { menuDishForScanClass } from "@/data/dishImages";
import { formatPrice, RECIPE_CARDS, type RecipeCard } from "@/data/mealRecommendations";
import { dashboardApi } from "@/lib/api";

type CommunityItem = {
  id: string;
  title: string;
  scans: number;
  image: string;
};

const DEFAULT_SCANS = [320, 215, 189, 150, 120, 95, 80, 70, 60];

function buildCommunityItems(
  trending?: Array<{ class_name?: string; scans: number }>,
): CommunityItem[] {
  const byId = new Map<string, CommunityItem>(
    RECIPE_CARDS.map((recipe, i) => [
      recipe.id,
      {
        id: recipe.id,
        title: recipe.name,
        image: recipe.image,
        scans: DEFAULT_SCANS[i] ?? 50,
      },
    ]),
  );

  if (trending?.length) {
    for (const row of trending) {
      if (!row.class_name) continue;
      const menuId = menuDishForScanClass(row.class_name);
      const item = byId.get(menuId);
      if (item) item.scans += row.scans;
    }
  }

  return [...byId.values()].sort((a, b) => b.scans - a.scans).slice(0, 6);
}

const CHEF_PICK = RECIPE_CARDS.find((r) => r.id === "goi_cuon") ?? RECIPE_CARDS[0];

function ChefRecommendationCard({ recipe }: { recipe: RecipeCard }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="[perspective:1200px]">
      <div
        className={`relative w-full transition-transform duration-500 ease-in-out [transform-style:preserve-3d] ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* Mặt trước */}
        <div className="relative [backface-visibility:hidden] bg-surface-container-lowest text-on-surface border border-surface-variant/30 rounded-xl p-lg flex flex-col md:flex-row gap-lg items-center overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-surface-variant opacity-10 rounded-full -mr-20 -mt-20 pointer-events-none" />
          <div className="flex-1 z-10 w-full">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant mb-base block">
              Lựa chọn của đầu bếp
            </span>
            <h3 className="font-headline-md text-headline-md mb-sm">{recipe.name}</h3>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-md max-w-[500px]">
              {recipe.description}
            </p>
            <button
              type="button"
              onClick={() => setFlipped(true)}
              className="w-full sm:w-auto bg-red-500 text-white px-lg py-md rounded-lg font-label-md text-label-md hover:bg-red-600 transition-colors active:scale-95"
            >
              Xem công thức
            </button>
          </div>
          <div className="w-full md:w-1/3 h-64 rounded-xl overflow-hidden z-10 border border-surface-variant/30 shadow-lg relative shrink-0">
            <DishPhoto src={recipe.image} alt={recipe.name} sizes="(max-width: 768px) 100vw, 33vw" />
          </div>
        </div>

        {/* Mặt sau */}
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-surface-container-lowest text-on-surface border border-red-500 rounded-xl p-lg flex flex-col overflow-hidden">
          <div className="flex items-start justify-between gap-3 mb-base shrink-0">
            <h3 className="font-headline-md text-headline-md">{recipe.name}</h3>
            <span className="shrink-0 font-bold text-red-500 text-lg">{formatPrice(recipe.price)}</span>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto">
            <p className="font-label-sm text-label-sm text-outline uppercase tracking-wider mb-1">Nguyên liệu</p>
            <ul className="font-body-md text-body-md text-on-surface-variant mb-3 list-disc list-inside space-y-0.5">
              {recipe.ingredients.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="font-label-sm text-label-sm text-outline uppercase tracking-wider mb-1">Công thức</p>
            <ol className="font-body-md text-body-md text-on-surface-variant list-decimal list-inside space-y-1">
              {recipe.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>
          <button
            type="button"
            onClick={() => setFlipped(false)}
            className="w-full shrink-0 mt-3 bg-red-500 text-white text-center font-label-md text-label-md rounded-lg py-2.5 px-4 hover:bg-red-600 transition-colors active:scale-95"
          >
            Ấn để quay lại
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useUser();
  const [greeting, setGreeting] = useState("Chào bạn");
  const [remainingCal, setRemainingCal] = useState(2200);
  const [targetCal, setTargetCal] = useState(2200);
  const [consumed, setConsumed] = useState({ protein: 0, carbs: 0, fat: 0 });
  const [targets, setTargets] = useState({ protein: 120, carbs: 250, fat: 70 });
  const [communityItems, setCommunityItems] = useState<CommunityItem[]>(() => buildCommunityItems());
  const [recentMeals, setRecentMeals] = useState<RecentMealItem[]>([]);

  useEffect(() => {
    dashboardApi.summary().then((data) => {
      setRemainingCal(data.remaining_calories as number);
      setTargetCal((data.targets as { calories: number }).calories);
      setConsumed(data.consumed as { protein: number; carbs: number; fat: number });
      setTargets(data.targets as { protein: number; carbs: number; fat: number });
      const trending = data.community_trending as Array<{
        title: string;
        scans: number;
        class_name?: string;
      }>;
      setCommunityItems(buildCommunityItems(trending));
      const raw = (data.recent_meals as Array<Record<string, unknown>>) ?? [];
      setRecentMeals(
        raw.map((m) => ({
          id: m.id as number,
          name: String(m.name ?? "Món ăn"),
          meal_type: String(m.meal_type ?? "lunch"),
          calories: Number(m.calories) || 0,
          eaten_at: m.eaten_at as string | undefined,
        })),
      );
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Chào buổi sáng");
    else if (hour < 14) setGreeting("Chào buổi trưa");
    else if (hour < 18) setGreeting("Chào buổi chiều");
    else setGreeting("Chào buổi tối");

    const rings = document.querySelectorAll<SVGElement>(".macro-ring");
    rings.forEach((ring) => {
      const targetOffset = ring.getAttribute("stroke-dashoffset");
      ring.style.strokeDashoffset = "283";
      setTimeout(() => {
        if (targetOffset) ring.style.strokeDashoffset = targetOffset;
      }, 300);
    });
  }, [remainingCal, targets]);

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
                  {remainingCal.toLocaleString("vi-VN")}
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
          <TodayTimeline />
        </section>

        <RecentMealsSection meals={recentMeals.length > 0 ? recentMeals : undefined} />

        {/* Recommendations */}
        <section>
          <div className="flex items-center justify-center mb-8 mt-8 opacity-90">
            <div className="flex-1 border-t border-b border-[#b82c2a] h-1.5"></div>
            <h2 className="px-6 font-bold text-lg md:text-xl text-on-surface uppercase tracking-widest text-center whitespace-nowrap">
              Gợi ý hôm nay
            </h2>
            <div className="flex-1 border-t border-b border-[#b82c2a] h-1.5"></div>
          </div>
          <ChefRecommendationCard recipe={CHEF_PICK} />
        </section>

        {/* Community Trends Section */}
        <section className="mt-xl mb-12 overflow-x-hidden pb-6">
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
              {communityItems.map((item) => (
                <div key={`set1-${item.id}`} className="w-[180px] shrink-0 bg-surface-container-lowest border border-surface-variant/30 rounded-xl p-3 pb-4 flex flex-col gap-3 hover:bg-surface-container-low transition-colors cursor-pointer">
                  <div className="w-full aspect-square rounded-lg bg-surface-variant overflow-hidden shrink-0 relative">
                    <DishPhoto src={item.image} alt={item.title} sizes="180px" />
                  </div>
                  <div className="text-center">
                    <h4 className="font-title-sm text-on-surface line-clamp-1">{item.title}</h4>
                    <p className="font-body-sm text-on-surface-variant mb-2">{item.scans} lượt quét</p>
                    <div className="flex justify-center">
                      <VisitorAvatars visitors={visitorsForDish(item.id, 3)} size="sm" />
                    </div>
                  </div>
                </div>
              ))}
              {/* Second Set of Items (Duplicate for seamless loop) */}
              {communityItems.map((item) => (
                <div key={`set2-${item.id}`} className="w-[180px] shrink-0 bg-surface-container-lowest border border-surface-variant/30 rounded-xl p-3 pb-4 flex flex-col gap-3 hover:bg-surface-container-low transition-colors cursor-pointer">
                  <div className="w-full aspect-square rounded-lg bg-surface-variant overflow-hidden shrink-0 relative">
                    <DishPhoto src={item.image} alt={item.title} sizes="180px" />
                  </div>
                  <div className="text-center">
                    <h4 className="font-title-sm text-on-surface line-clamp-1">{item.title}</h4>
                    <p className="font-body-sm text-on-surface-variant mb-2">{item.scans} lượt quét</p>
                    <div className="flex justify-center">
                      <VisitorAvatars visitors={visitorsForDish(item.id, 3)} size="sm" />
                    </div>
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
