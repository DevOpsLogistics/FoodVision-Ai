"use client";

import Link from "next/link";
import DishPhoto from "@/components/DishPhoto";
import { dishImage } from "@/data/dishImages";
import { RECIPE_CARDS } from "@/data/mealRecommendations";

export type RecentMealItem = {
  id: number | string;
  name: string;
  meal_type: string;
  calories: number;
  description?: string;
  image?: string;
  eaten_at?: string;
};

const MEAL_LABELS: Record<string, string> = {
  breakfast: "Bữa sáng",
  lunch: "Bữa trưa",
  dinner: "Bữa tối",
  snack: "Ăn vặt",
};

const MEAL_TAG_CLASS: Record<string, string> = {
  breakfast: "bg-tertiary/10 text-tertiary",
  lunch: "bg-primary/10 text-primary",
  dinner: "bg-green-500/10 text-green-600",
  snack: "bg-white/10 text-on-surface-variant",
};

const FALLBACK_MEALS: RecentMealItem[] = [
  {
    id: "goi_cuon",
    name: "Gỏi cuốn",
    meal_type: "lunch",
    calories: 280,
    description: "Tôm thịt, bún, rau sống — chấm tương đậu phộng",
    image: dishImage("goi_cuon"),
  },
  {
    id: "banh_cuon",
    name: "Bánh cuốn",
    meal_type: "breakfast",
    calories: 320,
    description: "Bột mỏng, nhân thịt, hành phi — nóng hổi",
    image: dishImage("banh_cuon"),
  },
  {
    id: "ga_nuong",
    name: "Gà nướng",
    meal_type: "dinner",
    calories: 220,
    description: "Gà nướng mật ong — da sánh, thịt mềm",
    image: dishImage("ga_nuong"),
  },
  {
    id: "bun_bo_hue",
    name: "Bún bò Huế",
    meal_type: "lunch",
    calories: 510,
    description: "Bún bò Huế cay nồng — nước lèo đậm đà",
    image: dishImage("bun_bo_hue"),
  },
];

function recipeMeta(name: string) {
  const normalized = name.toLowerCase();
  return RECIPE_CARDS.find(
    (r) =>
      normalized.includes(r.name.toLowerCase()) ||
      r.name.toLowerCase().includes(normalized.split(",")[0]?.trim() ?? ""),
  );
}

function enrichMeal(raw: RecentMealItem): RecentMealItem {
  const recipe = recipeMeta(raw.name);
  return {
    ...raw,
    description: raw.description ?? recipe?.description ?? "Xem chi tiết trong nhật ký",
    image: raw.image ?? recipe?.image ?? dishImage("goi_cuon"),
    calories: raw.calories || recipe?.calories || 0,
  };
}

function diaryHref(mealType: string) {
  const key = mealType || "lunch";
  return `/diary#meal-${key}`;
}

type RecentMealsSectionProps = {
  meals?: RecentMealItem[];
};

export default function RecentMealsSection({ meals }: RecentMealsSectionProps) {
  const list = (meals?.length ? meals : FALLBACK_MEALS).map(enrichMeal);

  return (
    <section className="mb-xl">
      <div className="flex items-center justify-center mb-6 mt-8 opacity-90">
        <div className="flex-1 border-t border-b border-[#b82c2a] h-1.5" />
        <h2 className="px-6 font-bold text-lg md:text-xl text-on-surface uppercase tracking-widest text-center whitespace-nowrap">
          Bữa ăn gần đây
        </h2>
        <div className="flex-1 border-t border-b border-[#b82c2a] h-1.5" />
      </div>
      <div className="flex justify-end mb-md">
        <Link href="/diary" className="font-label-md text-label-md text-red-500 hover:text-red-400 hover:underline transition-all">
          Xem nhật ký
        </Link>
      </div>
      <div className="flex overflow-x-auto gap-md pb-4 hide-scrollbar snap-x">
        {list.map((meal) => {
          const mealType = meal.meal_type || "lunch";
          const tagClass = MEAL_TAG_CLASS[mealType] ?? MEAL_TAG_CLASS.lunch;

          return (
            <Link
              key={meal.id}
              href={diaryHref(mealType)}
              className="bg-surface-container-lowest rounded-xl overflow-hidden editorial-card border border-[#F2EFE9] min-w-[280px] shrink-0 snap-start block hover:border-white/30 transition-colors active:scale-[0.98]"
            >
              <div className="relative w-full h-48 bg-surface-variant">
                <DishPhoto src={meal.image!} alt={meal.name} sizes="280px" />
              </div>
              <div className="p-md">
                <div className="flex justify-between items-start mb-xs">
                  <h3 className="font-label-md text-label-md text-on-surface line-clamp-1">{meal.name}</h3>
                  <span className={`font-label-sm text-label-sm px-2 py-1 rounded-full whitespace-nowrap ml-2 shrink-0 ${tagClass}`}>
                    {MEAL_LABELS[mealType] || mealType}
                  </span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant mb-md line-clamp-2">{meal.description}</p>
                <div className="flex justify-between items-center text-on-surface">
                  <span className="font-label-sm text-label-sm">{Math.round(meal.calories)} kcal</span>
                  <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                </div>
              </div>
            </Link>
          );
        })}

        <Link
          href="/scanner"
          className="bg-surface-container-low rounded-xl border-2 border-dashed border-outline-variant flex flex-col items-center justify-center min-w-[280px] shrink-0 snap-start hover:bg-surface-container transition-colors active:scale-95 duration-200"
        >
          <span className="material-symbols-outlined text-outline mb-sm text-[48px]">add_circle</span>
          <p className="font-label-md text-label-md text-outline">Thêm bữa ăn</p>
        </Link>
      </div>
    </section>
  );
}
