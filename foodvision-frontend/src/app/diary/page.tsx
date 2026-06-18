"use client";

import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { dashboardApi, mealsApi } from "@/lib/api";

type Meal = {
  id: number;
  meal_type: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  eaten_at: string;
  image_url?: string;
};

const MEAL_LABELS: Record<string, string> = {
  breakfast: "Bữa sáng",
  lunch: "Bữa trưa",
  dinner: "Bữa tối",
  snack: "Ăn vặt",
};

export default function MealDiary() {
  const router = useRouter();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [remaining, setRemaining] = useState(2200);
  const [target, setTarget] = useState(2200);
  const [loading, setLoading] = useState(true);

  const today = new Date();
  const dateLabel = today.toLocaleDateString("vi-VN", { day: "numeric", month: "long" });
  const dateParam = today.toISOString().slice(0, 10);

  useEffect(() => {
    Promise.all([mealsApi.list(dateParam), dashboardApi.summary()])
      .then(([mealList, summary]) => {
        setMeals(mealList as Meal[]);
        setRemaining(summary.remaining_calories as number);
        setTarget((summary.targets as { calories: number }).calories);
      })
      .finally(() => setLoading(false));
  }, [dateParam]);

  const grouped = meals.reduce<Record<string, Meal[]>>((acc, m) => {
    const key = m.meal_type || "lunch";
    acc[key] = acc[key] || [];
    acc[key].push(m);
    return acc;
  }, {});

  return (
    <div className="min-h-screen flex flex-col font-body-md text-on-surface bg-[#FAF9F6] antialiased">
      <Navigation />

      <main className="flex-grow max-w-[1140px] w-full mx-auto px-container-margin pt-16 md:pt-base pb-32">
        <section className="py-lg flex flex-col md:flex-row md:items-end justify-between gap-md mt-6">
          <div>
            <p className="font-label-md text-label-md text-outline uppercase tracking-widest mb-xs">Hôm nay</p>
            <h2 className="font-headline-md text-headline-md text-on-surface">{dateLabel}</h2>
          </div>

          <div
            className="bg-surface-container-lowest border border-surface-variant p-md rounded-xl flex items-center gap-lg shadow-[0_20px_30px_rgba(27,28,28,0.04)] cursor-pointer hover:bg-surface-container-high transition-colors"
            onClick={() => router.push("/nutrition-analytics")}
          >
            <div className="flex flex-col items-center">
              <span className="font-label-sm text-label-sm text-outline">Mục tiêu</span>
              <span className="font-headline-sm text-headline-sm text-primary">{target.toLocaleString("vi-VN")}</span>
            </div>
            <div className="w-px h-10 bg-outline-variant" />
            <div className="flex flex-col items-center">
              <span className="font-label-sm text-label-sm text-outline">Còn lại</span>
              <span className="font-headline-sm text-headline-sm text-secondary">{remaining.toLocaleString("vi-VN")}</span>
            </div>
            <Link
              href="/scanner"
              className="bg-primary hover:bg-primary-container text-white px-md py-sm rounded-lg transition-colors flex items-center gap-xs shadow-md"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              <span className="font-label-md text-label-md hidden sm:inline">Quét món</span>
            </Link>
          </div>
        </section>

        {loading ? (
          <p className="text-outline text-center py-12">Đang tải nhật ký...</p>
        ) : meals.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-surface-variant">
            <span className="material-symbols-outlined text-5xl text-outline mb-4">restaurant</span>
            <p className="text-on-surface-variant mb-4">Chưa có bữa ăn nào hôm nay.</p>
            <Link href="/scanner" className="text-primary font-label-md hover:underline">
              Quét món ăn đầu tiên
            </Link>
          </div>
        ) : (
          <div className="space-y-lg">
            {Object.entries(grouped).map(([type, items]) => (
              <div key={type}>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-sm">
                  {MEAL_LABELS[type] || type}
                </h3>
                <div className="space-y-md">
                  {items.map((meal) => (
                    <div
                      key={meal.id}
                      className="meal-card bg-surface-container-lowest rounded-xl p-md border border-surface-variant shadow-sm flex gap-md items-center"
                    >
                      <div className="w-20 h-20 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-primary text-3xl">lunch_dining</span>
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-body-lg font-bold text-on-surface">{meal.name}</h4>
                        <p className="text-sm text-outline">
                          {new Date(meal.eaten_at).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                          {" · "}
                          {Math.round(meal.calories)} kcal · {Math.round(meal.protein)}g đạm
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
