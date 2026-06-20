"use client";

import Navigation from "@/components/Navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { dishImage, menuDishForScanClass } from "@/data/dishImages";
import { RECIPE_CARDS } from "@/data/mealRecommendations";
import { dashboardApi, mealsApi } from "@/lib/api";

const WEEK_DAYS = ["Th 2", "Th 3", "Th 4", "Th 5", "Th 6", "Th 7", "CN"] as const;
const FALLBACK_HEIGHTS = [65, 80, 45, 90, 70, 55, 60];
const FALLBACK_MONTH_HEIGHTS = [72, 85, 58, 91, 67];
const CALORIE_TARGET = 2200;

type ViewMode = "week" | "month";
type MonthWeek = { label: string; dates: Date[] };
type MealNutrition = { calories?: number; protein?: number; carbs?: number; fat?: number };
type MacroTotals = {
  protein: number;
  carbs: number;
  fat: number;
  proteinTarget: number;
  carbsTarget: number;
  fatTarget: number;
};

const DEFAULT_MACROS: MacroTotals = {
  protein: 0,
  carbs: 0,
  fat: 0,
  proteinTarget: 120,
  carbsTarget: 250,
  fatTarget: 70,
};

function getTodayBarIndex(date = new Date()): number {
  const day = date.getDay();
  return day === 0 ? 6 : day - 1;
}

function getWeekDates(reference = new Date()): Date[] {
  const d = new Date(reference);
  const day = d.getDay();
  const diffToMon = day === 0 ? -6 : 1 - day;
  const monday = new Date(d);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(d.getDate() + diffToMon);
  return Array.from({ length: 7 }, (_, i) => {
    const next = new Date(monday);
    next.setDate(monday.getDate() + i);
    return next;
  });
}

function getMonthWeeks(reference = new Date()): MonthWeek[] {
  const year = reference.getFullYear();
  const month = reference.getMonth();
  const lastDay = new Date(year, month + 1, 0);

  let cursor = new Date(year, month, 1);
  const startDay = cursor.getDay();
  const diffToMon = startDay === 0 ? -6 : 1 - startDay;
  cursor.setDate(cursor.getDate() + diffToMon);

  const weeks: MonthWeek[] = [];
  let weekNum = 1;

  while (cursor <= lastDay && weekNum <= 5) {
    const dates: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(cursor);
      d.setDate(cursor.getDate() + i);
      if (d.getMonth() === month) dates.push(d);
    }
    if (dates.length > 0) {
      weeks.push({ label: `Tuần ${weekNum}`, dates });
      weekNum += 1;
    }
    cursor.setDate(cursor.getDate() + 7);
  }

  return weeks;
}

function getCurrentMonthWeekIndex(weeks: MonthWeek[], now = new Date()): number {
  const idx = weeks.findIndex((w) => w.dates.some((d) => isSameDay(d, now)));
  return idx >= 0 ? idx : Math.max(0, weeks.length - 1);
}

function isSameDay(a: Date, b: Date) {
  return a.toDateString() === b.toDateString();
}

function heightFromMeals(meals: { calories?: number }[], fallback: number) {
  const total = meals.reduce((sum, meal) => sum + (Number(meal.calories) || 0), 0);
  if (total === 0) return fallback;
  return Math.min(100, Math.max(18, Math.round((total / CALORIE_TARGET) * 100)));
}

function averageHeights(values: number[]) {
  if (values.length === 0) return 40;
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

function sumMacros(meals: MealNutrition[]) {
  return meals.reduce(
    (acc, meal) => ({
      protein: acc.protein + (Number(meal.protein) || 0),
      carbs: acc.carbs + (Number(meal.carbs) || 0),
      fat: acc.fat + (Number(meal.fat) || 0),
    }),
    { protein: 0, carbs: 0, fat: 0 },
  );
}

function macroPct(value: number, target: number) {
  if (target <= 0) return 0;
  return Math.min(100, Math.round((value / target) * 100));
}

function macroTip(protein: number, target: number, mode: ViewMode) {
  const period = mode === "week" ? "tuần này" : "tháng này";
  const ratio = target > 0 ? protein / target : 1;
  if (ratio < 0.75) {
    return `Lượng đạm của bạn hơi thấp trong ${period}. Hãy cân nhắc thêm các loại đậu hoặc thịt gia cầm nạc vào bữa trưa.`;
  }
  if (ratio > 1.1) {
    return `Lượng đạm đã vượt mục tiêu ${period}. Cân bằng thêm rau xanh và tinh bột lành mạnh.`;
  }
  return `Dinh dưỡng đạm ổn định ${period}. Tiếp tục duy trì thói quen ăn uống lành mạnh.`;
}

function getPeriodDates(mode: ViewMode, now = new Date()): Date[] {
  if (mode === "week") return getWeekDates(now);
  return getMonthWeeks(now).flatMap((w) => w.dates);
}

type FavoriteDish = {
  name: string;
  image: string;
  summary: string;
  detailIntro: string;
  detailTips: string;
  detailBullets: string[];
};

const DEFAULT_FAVORITE: FavoriteDish = {
  name: "Bánh cuốn",
  image: dishImage("banh_cuon"),
  summary:
    "Bánh cuốn nóng — bột mỏng, nhẹ bụng và phù hợp bữa sáng hoặc brunch khi bạn muốn ăn vừa đủ no.",
  detailIntro:
    "Bánh cuốn cung cấp tinh bột từ bột gạo và chút đạm từ nhân thịt, giúp nạp năng lượng ổn định.",
  detailTips: "Nên ăn kèm rau thơm và hạn chế hành phi nếu bạn theo dõi lượng mỡ trong ngày.",
  detailBullets: [
    "Calo trung bình mỗi suất: ~320 kcal",
    "Phù hợp 1–2 lần/tuần vào buổi sáng",
    "Chọn thêm trứng luộc hoặc đậu phụ nếu cần thêm đạm",
  ],
};

function imageForMealName(name: string, imageUrl?: string | null): string {
  if (imageUrl) return imageUrl;
  const lower = name.toLowerCase();
  const recipe = RECIPE_CARDS.find(
    (r) => lower.includes(r.name.toLowerCase()) || r.name.toLowerCase().includes(lower),
  );
  if (recipe) return recipe.image;

  const scanKey = Object.entries({
    "cá kho": "ca_kho",
    "ca kho": "ca_kho",
    "thịt kho": "thit_kho",
    "cơm trắng": "com_trang",
    "canh chua": "canh_chua",
    "gỏi cuốn": "goi_cuon",
    "bún bò": "bun_bo_hue",
    "gà luộc": "ga_luoc",
    "gà nướng": "ga_nuong",
  }).find(([label]) => lower.includes(label))?.[1];

  if (scanKey) return dishImage(menuDishForScanClass(scanKey));
  return DEFAULT_FAVORITE.image;
}

function buildFavoriteCopy(
  name: string,
  stats: { calories: number; protein: number; carbs: number; fat: number },
): Pick<FavoriteDish, "summary" | "detailIntro" | "detailTips" | "detailBullets"> {
  const recipe = RECIPE_CARDS.find((r) => r.name.toLowerCase() === name.toLowerCase());
  if (recipe) {
    return {
      summary: `${recipe.name} — ${recipe.description}`,
      detailIntro: `${recipe.name} khoảng ${recipe.calories} kcal/suất, phù hợp thói quen ăn uống của bạn.`,
      detailTips: "Cân bằng thêm rau xanh hoặc canh trong cùng bữa để đủ chất xơ và vi chất.",
      detailBullets: [
        `Calo tham khảo: ~${recipe.calories} kcal`,
        `Thời gian chế biến: ${recipe.time}`,
        `Trung bình bạn ghi nhận: ${Math.round(stats.calories)} kcal · ${Math.round(stats.protein)}g đạm`,
      ],
    };
  }

  return {
    summary: `Dữ liệu nhật ký cho thấy bạn thường chọn ${name}. Món này xuất hiện nhiều trong các bữa gần đây.`,
    detailIntro: `${name} trung bình ~${Math.round(stats.calories)} kcal/suất với ${Math.round(stats.protein)}g đạm, ${Math.round(stats.carbs)}g tinh bột và ${Math.round(stats.fat)}g chất béo.`,
    detailTips: "Nên kết hợp thêm rau luộc hoặc canh chua để cân bằng dinh dưỡng trong ngày.",
    detailBullets: [
      `Calo trung bình mỗi lần ghi nhận: ~${Math.round(stats.calories)} kcal`,
      `Đạm trung bình: ~${Math.round(stats.protein)}g`,
      "Theo dõi tiếp sau mỗi lần quét để cập nhật chính xác hơn",
    ],
  };
}

function pickFavoriteDish(
  meals: (MealNutrition & { name?: string; image_url?: string | null })[],
): FavoriteDish {
  if (meals.length === 0) return DEFAULT_FAVORITE;

  const byName = new Map<
    string,
    { count: number; calories: number; protein: number; carbs: number; fat: number; image_url?: string | null }
  >();

  for (const meal of meals) {
    const name = (meal.name || "Món ăn").trim();
    const cur = byName.get(name) ?? {
      count: 0,
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      image_url: meal.image_url,
    };
    cur.count += 1;
    cur.calories += Number(meal.calories) || 0;
    cur.protein += Number(meal.protein) || 0;
    cur.carbs += Number(meal.carbs) || 0;
    cur.fat += Number(meal.fat) || 0;
    if (meal.image_url) cur.image_url = meal.image_url;
    byName.set(name, cur);
  }

  const top = [...byName.entries()].sort((a, b) => b[1].count - a[1].count)[0];
  if (!top) return DEFAULT_FAVORITE;

  const [name, data] = top;
  const stats = {
    calories: data.calories / data.count,
    protein: data.protein / data.count,
    carbs: data.carbs / data.count,
    fat: data.fat / data.count,
  };
  const copy = buildFavoriteCopy(name, stats);

  return {
    name,
    image: imageForMealName(name, data.image_url),
    ...copy,
  };
}

type MicroFilterId = "vitamin-a" | "vitamin-c" | "magnesium" | "iron";

type MicroItem = {
  name: string;
  pct: number;
  status: string;
};

const MICRO_FILTERS: { id: MicroFilterId; label: string }[] = [
  { id: "vitamin-a", label: "Vitamin A" },
  { id: "vitamin-c", label: "Vitamin C" },
  { id: "magnesium", label: "Magiê" },
  { id: "iron", label: "Sắt" },
];

const MICRO_BY_FILTER: Record<MicroFilterId, MicroItem[]> = {
  "vitamin-a": [
    { name: "Vitamin A", pct: 82, status: "Đạt mục tiêu" },
    { name: "Vitamin D", pct: 88, status: "Đạt mục tiêu" },
    { name: "Beta-caroten", pct: 74, status: "Khỏe mạnh" },
    { name: "Vitamin E", pct: 69, status: "Khỏe mạnh" },
    { name: "Vitamin K", pct: 91, status: "Đạt mục tiêu" },
  ],
  "vitamin-c": [
    { name: "Vitamin C", pct: 95, status: "Đạt mục tiêu" },
    { name: "Folate (B9)", pct: 78, status: "Khỏe mạnh" },
    { name: "B6", pct: 84, status: "Đạt mục tiêu" },
    { name: "B12", pct: 105, status: "Tối ưu" },
    { name: "Biotin", pct: 72, status: "Khỏe mạnh" },
  ],
  magnesium: [
    { name: "Magiê", pct: 76, status: "Khỏe mạnh" },
    { name: "Kali", pct: 92, status: "Đạt mục tiêu" },
    { name: "Canxi", pct: 42, status: "Dưới mục tiêu" },
    { name: "Phốt pho", pct: 88, status: "Đạt mục tiêu" },
    { name: "Natri", pct: 58, status: "Theo dõi thêm" },
  ],
  iron: [
    { name: "Sắt", pct: 67, status: "Khỏe mạnh" },
    { name: "Kẽm", pct: 76, status: "Khỏe mạnh" },
    { name: "Đồng", pct: 83, status: "Đạt mục tiêu" },
    { name: "Selen", pct: 90, status: "Đạt mục tiêu" },
    { name: "Iốt", pct: 55, status: "Theo dõi thêm" },
  ],
};

const MICRO_RING_RADIUS = 28;
const MICRO_RING_C = 2 * Math.PI * MICRO_RING_RADIUS;

function MicroRing({ name, pct, status }: MicroItem) {
  const visualPct = Math.min(pct, 100);
  const offset = MICRO_RING_C - (visualPct / 100) * MICRO_RING_C;
  const low = pct < 60;

  return (
    <div className="flex flex-col items-center p-4 rounded-xl border border-outline-variant/30 hover:border-red-500/40 transition-all">
      <div className="relative w-16 h-16 mb-3 shrink-0">
        <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90" aria-hidden>
          <circle
            cx="32"
            cy="32"
            r={MICRO_RING_RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="4"
          />
          <circle
            cx="32"
            cy="32"
            r={MICRO_RING_RADIUS}
            fill="none"
            stroke={low ? "#ef4444" : "#ffffff"}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={MICRO_RING_C}
            strokeDashoffset={offset}
            className="transition-all duration-500"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-label-md text-label-md text-on-surface">
          {pct}%
        </span>
      </div>
      <span className="font-label-md text-label-md text-on-surface text-center">{name}</span>
      <span className={`font-label-sm text-label-sm text-center ${low ? "text-red-400" : "text-outline"}`}>
        {status}
      </span>
    </div>
  );
}

function MicroNutrientSection() {
  const [filter, setFilter] = useState<MicroFilterId>("vitamin-a");
  const items = MICRO_BY_FILTER[filter];

  return (
    <div className="md:col-span-12 glass-card rounded-xl p-md">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-lg gap-4">
        <h3 className="font-headline-sm text-headline-sm text-on-surface">Cân bằng Vi lượng</h3>
        <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
          {MICRO_FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={`px-4 py-1.5 rounded-full font-label-md text-label-md whitespace-nowrap transition-colors ${
                filter === item.id
                  ? "bg-red-500 text-white"
                  : "bg-surface-container-high text-on-surface-variant hover:bg-surface-variant"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-md">
        {items.map((item) => (
          <MicroRing key={`${filter}-${item.name}`} {...item} />
        ))}
      </div>
    </div>
  );
}

function FavoriteDishFlipCard() {
  const [flipped, setFlipped] = useState(false);
  const [favorite, setFavorite] = useState<FavoriteDish>(DEFAULT_FAVORITE);

  const loadFavorite = useCallback(async () => {
    const now = new Date();
    const dates = getMonthWeeks(now)
      .flatMap((w) => w.dates)
      .filter((date) => !(date > now && !isSameDay(date, now)));

    try {
      const lists = await Promise.all(
        dates.map((date) => mealsApi.list(date.toISOString().slice(0, 10))),
      );
      const meals = lists.flat() as (MealNutrition & { name?: string; image_url?: string | null })[];
      setFavorite(pickFavoriteDish(meals));
    } catch {
      setFavorite(DEFAULT_FAVORITE);
    }
  }, []);

  useEffect(() => {
    loadFavorite();
    const timer = setInterval(loadFavorite, 15_000);
    const onRefresh = () => loadFavorite();
    window.addEventListener("foodvision:meals-updated", onRefresh);
    window.addEventListener("focus", onRefresh);
    return () => {
      clearInterval(timer);
      window.removeEventListener("foodvision:meals-updated", onRefresh);
      window.removeEventListener("focus", onRefresh);
    };
  }, [loadFavorite]);

  return (
    <div className="md:col-span-12 lg:col-span-12 [perspective:1200px]">
      <div
        className={`relative w-full min-h-[300px] transition-transform duration-500 ease-in-out [transform-style:preserve-3d] ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        <div className="relative [backface-visibility:hidden] bg-tertiary-fixed-dim/20 rounded-xl overflow-hidden flex flex-col md:flex-row min-h-[300px] border border-[#F2EFE9]/20">
          <div className="md:w-1/2 p-md md:p-lg flex flex-col justify-center">
            <h4 className="font-display-lg-mobile text-display-lg-mobile text-on-surface mb-md">
              Món ăn yêu thích của bạn.
            </h4>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-lg">
              Dữ liệu của bạn cho thấy bạn rất thích món {favorite.name}. {favorite.summary}
            </p>
            <button
              type="button"
              onClick={() => setFlipped(true)}
              className="bg-red-500 text-white px-8 py-4 rounded-full font-label-md text-label-md w-fit hover:bg-red-600 transition-colors active:scale-95 shadow-sm"
            >
              Đọc Toàn bộ Phân tích
            </button>
          </div>
          <div className="md:w-1/2 h-64 md:h-auto min-h-[220px] overflow-hidden relative">
            <Image
              src={favorite.image}
              alt={favorite.name}
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-surface-container-lowest border border-red-500 rounded-xl overflow-hidden flex flex-col md:flex-row min-h-[300px]">
          <div className="md:w-1/2 p-md md:p-lg flex flex-col overflow-hidden">
            <h4 className="font-display-lg-mobile text-display-lg-mobile text-on-surface mb-md shrink-0">
              Phân tích dinh dưỡng chi tiết
            </h4>
            <div className="flex-1 min-h-0 overflow-y-auto font-body-md text-body-md text-on-surface-variant space-y-3 pr-1">
              <p>
                <strong className="text-on-surface">{favorite.name}</strong> — {favorite.detailIntro}
              </p>
              <p>{favorite.detailTips}</p>
              <ul className="list-disc list-inside space-y-1">
                {favorite.detailBullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <button
              type="button"
              onClick={() => setFlipped(false)}
              className="mt-md shrink-0 bg-red-500 text-white px-8 py-4 rounded-full font-label-md text-label-md w-fit hover:bg-red-600 transition-colors active:scale-95 shadow-sm"
            >
              Ấn để quay lại
            </button>
          </div>
          <div className="md:w-1/2 h-64 md:h-auto min-h-[220px] overflow-hidden relative">
            <Image
              src={favorite.image}
              alt={favorite.name}
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NutritionAnalytics() {
  const router = useRouter();
  const barsRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [todayIndex, setTodayIndex] = useState(getTodayBarIndex);
  const [barHeights, setBarHeights] = useState<number[]>(FALLBACK_HEIGHTS);
  const [barLabels, setBarLabels] = useState<string[]>([...WEEK_DAYS]);
  const [highlightIndex, setHighlightIndex] = useState(getTodayBarIndex);
  const [avgCalories, setAvgCalories] = useState(2140);
  const [macros, setMacros] = useState<MacroTotals>(DEFAULT_MACROS);

  const loadMacros = useCallback(async () => {
    const now = new Date();
    const dates = getPeriodDates(viewMode, now).filter(
      (date) => !(date > now && !isSameDay(date, now)),
    );

    try {
      const [summary, ...mealLists] = await Promise.all([
        dashboardApi.summary(),
        ...dates.map((date) => mealsApi.list(date.toISOString().slice(0, 10))),
      ]);

      const targets = summary.targets as { protein: number; carbs: number; fat: number };
      const allMeals = mealLists.flat() as MealNutrition[];
      const totals = sumMacros(allMeals);
      const dayCount = Math.max(1, dates.length);

      setMacros({
        protein: Math.round(totals.protein / dayCount),
        carbs: Math.round(totals.carbs / dayCount),
        fat: Math.round(totals.fat / dayCount),
        proteinTarget: targets.protein ?? DEFAULT_MACROS.proteinTarget,
        carbsTarget: targets.carbs ?? DEFAULT_MACROS.carbsTarget,
        fatTarget: targets.fat ?? DEFAULT_MACROS.fatTarget,
      });
    } catch {
      setMacros(DEFAULT_MACROS);
    }
  }, [viewMode]);

  const loadChartBars = useCallback(async () => {
    const now = new Date();

    if (viewMode === "week") {
      const dates = getWeekDates(now);
      setBarLabels([...WEEK_DAYS]);
      const active = getTodayBarIndex(now);
      setHighlightIndex(active);

      try {
        const results = await Promise.all(
          dates.map((date) => mealsApi.list(date.toISOString().slice(0, 10))),
        );

        const heights = results.map((meals, index) => {
          const date = dates[index]!;
          const isFuture = date > now && !isSameDay(date, now);
          if (isFuture) return 18;
          return heightFromMeals(meals as { calories?: number }[], FALLBACK_HEIGHTS[index] ?? 40);
        });

        const totals = results.flatMap((meals, index) => {
          const date = dates[index]!;
          if (date > now && !isSameDay(date, now)) return [];
          const total = (meals as { calories?: number }[]).reduce(
            (sum, meal) => sum + (Number(meal.calories) || 0),
            0,
          );
          return total > 0 ? [total] : [];
        });
        if (totals.length > 0) {
          setAvgCalories(Math.round(totals.reduce((a, b) => a + b, 0) / totals.length));
        }

        setBarHeights(heights);
      } catch {
        setBarHeights(FALLBACK_HEIGHTS);
      }
      return;
    }

    const weeks = getMonthWeeks(now);
    setBarLabels(weeks.map((w) => w.label));
    setHighlightIndex(getCurrentMonthWeekIndex(weeks, now));

    try {
      const weekResults = await Promise.all(
        weeks.map(async (week, weekIndex) => {
          const dayHeights: number[] = [];
          const dayTotals: number[] = [];

          for (const date of week.dates) {
            const isFuture = date > now && !isSameDay(date, now);
            if (isFuture) continue;

            const meals = (await mealsApi.list(date.toISOString().slice(0, 10))) as {
              calories?: number;
            }[];
            const total = meals.reduce((sum, meal) => sum + (Number(meal.calories) || 0), 0);
            if (total > 0) dayTotals.push(total);
            dayHeights.push(
              heightFromMeals(meals, FALLBACK_MONTH_HEIGHTS[weekIndex] ?? 40),
            );
          }

          return {
            height:
              dayHeights.length > 0
                ? averageHeights(dayHeights)
                : (FALLBACK_MONTH_HEIGHTS[weekIndex] ?? 40),
            dayTotals,
          };
        }),
      );

      const heights = weekResults.map((w) => w.height);
      const allTotals = weekResults.flatMap((w) => w.dayTotals);
      if (allTotals.length > 0) {
        setAvgCalories(Math.round(allTotals.reduce((a, b) => a + b, 0) / allTotals.length));
      }

      setBarHeights(heights);
    } catch {
      setBarHeights(FALLBACK_MONTH_HEIGHTS.slice(0, weeks.length));
    }
  }, [viewMode]);

  useEffect(() => {
    const syncToday = () => setTodayIndex(getTodayBarIndex());
    const refresh = () => {
      syncToday();
      loadChartBars();
      loadMacros();
    };

    refresh();

    const dayTimer = setInterval(syncToday, 60_000);
    const dataTimer = setInterval(refresh, 15_000);

    const onVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", refresh);
    window.addEventListener("foodvision:meals-updated", refresh);

    return () => {
      clearInterval(dayTimer);
      clearInterval(dataTimer);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", refresh);
      window.removeEventListener("foodvision:meals-updated", refresh);
    };
  }, [loadChartBars, loadMacros]);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bars = entry.target.querySelectorAll(".bar-transition");
          bars.forEach((bar, index) => {
            const htmlElement = bar as HTMLElement;
            const targetHeight = htmlElement.dataset.height;
            if (targetHeight && !htmlElement.dataset.animated) {
              htmlElement.style.height = "0";
              htmlElement.dataset.animated = "true";
              setTimeout(() => {
                htmlElement.style.height = targetHeight;
              }, index * 100);
            }
          });
        }
      });
    }, observerOptions);

    if (barsRef.current) {
      observer.observe(barsRef.current);
    }

    return () => observer.disconnect();
  }, [barHeights, viewMode]);

  const isActiveBar = (index: number) =>
    viewMode === "week" ? index === todayIndex : index === highlightIndex;

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen pb-24 md:pb-0">
      <Navigation />

      <main className="max-w-[1140px] mx-auto px-container-margin pt-32 md:pt-36 pb-12">
        {/* Header Section */}
        <section className="mb-lg">
          <div className="flex items-center justify-center mb-6 opacity-90">
            <div className="flex-1 border-t border-b border-[#b82c2a] h-1.5" />
            <h2 className="px-6 font-headline-md text-headline-md text-on-surface text-center leading-tight whitespace-nowrap">
              Thông tin Dinh dưỡng của bạn
            </h2>
            <div className="flex-1 border-t border-b border-[#b82c2a] h-1.5" />
          </div>
          <div className="flex justify-end">
            <div className="flex gap-2 bg-surface-container p-1 rounded-full w-fit">
              <button
                type="button"
                onClick={() => setViewMode("week")}
                className={`px-6 py-2 rounded-full font-label-md text-label-md transition-all ${
                  viewMode === "week"
                    ? "bg-red-500 text-white shadow-sm"
                    : "text-on-surface-variant hover:bg-surface-variant"
                }`}
              >
                Hàng tuần
              </button>
              <button
                type="button"
                onClick={() => setViewMode("month")}
                className={`px-6 py-2 rounded-full font-label-md text-label-md transition-all ${
                  viewMode === "month"
                    ? "bg-red-500 text-white shadow-sm"
                    : "text-on-surface-variant hover:bg-surface-variant"
                }`}
              >
                Hàng tháng
              </button>
            </div>
          </div>
        </section>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter" ref={barsRef}>
          {/* Main Trend Chart (Line Chart Simulation) */}
          <div className="md:col-span-8 glass-card rounded-xl p-md flex flex-col min-h-[400px]">
            <div className="flex justify-between items-start mb-lg">
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">
                  Tuân thủ Calo
                </h3>
                <p className="font-label-md text-label-md text-outline">
                  Trung bình {avgCalories.toLocaleString("vi-VN")} kcal / ngày
                </p>
              </div>
              <div className="flex items-center gap-2 text-white font-bold">
                <span className="material-symbols-outlined">trending_up</span>
                <span className="font-label-md text-label-md text-white">
                  4% so với {viewMode === "week" ? "tuần" : "tháng"} trước
                </span>
              </div>
            </div>

            <div className="flex-grow flex items-end justify-between gap-2 pt-4 relative rounded-xl bg-[#1a1c1e] px-2 pb-2 min-h-[280px]">
              {/* Synthetic Line Chart Visual */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.08] pointer-events-none rounded-xl overflow-hidden">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdBshql7855AYi4vom4RICdsUguYLnqON-tBkDMRNxKxl7IZWz88JDE_Tyf7usEGcBPTJ_PeSdYNY5Ql5cegT8pVe1eXTZIbG9SLyk-dpbFwg4bH03o13SON1XEnlprxtEu3KfASKNpGuYFBvQNNTXOWv4W2BpI2tyr8qT5PKR6XoRRKE6C8Rpb4qepZfdodvLwwU7S7vRj9UGb7_HBco-E2kwinpQW-yfoE-WbfOyuzI0xwpOVZTmyR3qaODANz-7KfLf_fxHTGhQ"
                  alt="Abstract data visualization"
                  fill
                  className="object-cover grayscale"
                />
              </div>

              {/* Column Bars */}
              {barLabels.map((label, index) => {
                const isToday = isActiveBar(index);
                const height = barHeights[index] ?? 18;

                return (
                  <div
                    key={`${viewMode}-${label}-${index}`}
                    className="flex-1 group relative h-full flex flex-col justify-end items-center min-w-0"
                  >
                    <div
                      className={`w-full max-w-[40px] rounded-t-lg bar-transition transition-all duration-300 ${
                        isToday
                          ? "bg-[#ef4444] group-hover:bg-[#dc2626] cursor-pointer hover:scale-105 shadow-[0_0_16px_rgba(239,68,68,0.45)]"
                          : "bg-[#ffffff] group-hover:bg-[#ffffff] shadow-[0_0_10px_rgba(255,255,255,0.25)]"
                      }`}
                      style={{ height: `${height}%` }}
                      data-height={`${height}%`}
                      onClick={
                        isToday ? () => router.push("/deep-nutrition-analytics") : undefined
                      }
                      role={isToday ? "button" : undefined}
                      tabIndex={isToday ? 0 : undefined}
                      onKeyDown={
                        isToday
                          ? (e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                router.push("/deep-nutrition-analytics");
                              }
                            }
                          : undefined
                      }
                    />
                    <span
                      className={`mt-4 font-label-sm text-label-sm text-center truncate w-full px-0.5 ${
                        isToday ? "text-[#ef4444] font-bold" : "text-[#ffffff]"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Macro breakdown Card */}
          <div className="md:col-span-4 glass-card rounded-xl p-md flex flex-col">
            <div className="mb-lg">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                Đa lượng
              </h3>
              <p className="font-label-sm text-label-sm text-outline mt-1">
                Trung bình {viewMode === "week" ? "tuần" : "tháng"} này · cập nhật sau mỗi lần quét
              </p>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between font-label-md text-label-md">
                  <span className="text-on-surface">Đạm</span>
                  <span className="text-outline">
                    {macros.protein}g / {macros.proteinTarget}g
                  </span>
                </div>
                <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 rounded-full transition-all duration-500"
                    style={{ width: `${macroPct(macros.protein, macros.proteinTarget)}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between font-label-md text-label-md">
                  <span className="text-on-surface">Tinh bột</span>
                  <span className="text-outline">
                    {macros.carbs}g / {macros.carbsTarget}g
                  </span>
                </div>
                <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#ffffff] rounded-full transition-all duration-500"
                    style={{ width: `${macroPct(macros.carbs, macros.carbsTarget)}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between font-label-md text-label-md">
                  <span className="text-on-surface">Chất béo</span>
                  <span className="text-outline">
                    {macros.fat}g / {macros.fatTarget}g
                  </span>
                </div>
                <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-400 rounded-full transition-all duration-500"
                    style={{ width: `${macroPct(macros.fat, macros.fatTarget)}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-auto pt-8">
              <div className="rounded-lg p-4 border border-outline-variant/40">
                <p className="font-label-sm text-label-sm leading-relaxed text-white">
                  {macroTip(macros.protein, macros.proteinTarget, viewMode)}
                </p>
              </div>
            </div>
          </div>

          <MicroNutrientSection />

          <FavoriteDishFlipCard />
        </div>
      </main>
    </div>
  );
}
