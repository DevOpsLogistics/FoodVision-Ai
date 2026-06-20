"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  EditorialCard,
  PageShell,
  SectionDivider,
} from "@/components/PageLayout";
import ContactFloat from "@/components/ContactFloat";
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

type MacroTotals = { calories: number; protein: number; carbs: number; fat: number };

const MEAL_SLOTS = [
  { id: "breakfast", label: "Bữa sáng", time: "6:00 – 9:00" },
  { id: "lunch", label: "Bữa trưa", time: "11:00 – 13:30" },
  { id: "dinner", label: "Bữa tối", time: "17:30 – 20:00" },
  { id: "snack", label: "Ăn vặt", time: "Bất kỳ lúc nào" },
] as const;

const QUICK_ACTIONS = [
  { href: "/scanner", title: "Quét món", desc: "Nhận diện khay ăn bằng AI" },
  { href: "/nutrition-analytics", title: "Phân tích", desc: "Biểu đồ calo & macro" },
  { href: "/meal-recommendations", title: "Gợi ý món", desc: "Thực đơn cân bằng" },
] as const;

function macroPct(value: number, target: number) {
  if (target <= 0) return 0;
  return Math.min(100, Math.round((value / target) * 100));
}

function CalorieRing({ consumed, target }: { consumed: number; target: number }) {
  const pct = macroPct(consumed, target);
  const r = 40;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  const ringColor = pct >= 90 ? "#FF9B85" : pct >= 70 ? "#F5A962" : "#7CB8E8";

  return (
    <div className="relative w-[104px] h-[104px] shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 96 96">
        <defs>
          <linearGradient id="calorieRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={ringColor} />
            <stop offset="100%" stopColor={pct >= 90 ? "#FF7A62" : pct >= 70 ? "#FFBC6B" : "#9AD4FF"} />
          </linearGradient>
        </defs>
        <circle cx="48" cy="48" r={r} fill="none" stroke="currentColor" strokeWidth="6" className="text-white/12" />
        <circle
          cx="48"
          cy="48"
          r={r}
          fill="none"
          stroke="url(#calorieRingGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          className="transition-all duration-700"
          style={{ filter: `drop-shadow(0 0 6px ${ringColor}66)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-headline-sm text-headline-sm text-on-surface leading-none">{pct}%</span>
        <span className="text-[10px] uppercase tracking-wider text-outline mt-1">Calo</span>
      </div>
    </div>
  );
}

const MACRO_COLORS = {
  protein: { bar: "#7CB8E8", glow: "#7CB8E866" },
  carbs: { bar: "#E8C06A", glow: "#E8C06A66" },
  fat: { bar: "#FF9B85", glow: "#FF9B8566" },
} as const;

function MacroBar({
  label,
  value,
  target,
  unit,
  colorKey,
}: {
  label: string;
  value: number;
  target: number;
  unit: string;
  colorKey: keyof typeof MACRO_COLORS;
}) {
  const pct = macroPct(value, target);
  const { bar, glow } = MACRO_COLORS[colorKey];

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-on-surface-variant">{label}</span>
        <span className="text-xs tabular-nums text-on-surface">
          {Math.round(value)}
          <span className="text-outline"> / {target}{unit}</span>
        </span>
      </div>
      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            backgroundColor: bar,
            boxShadow: `0 0 10px ${glow}`,
          }}
        />
      </div>
    </div>
  );
}

export default function MealDiary() {
  const router = useRouter();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [consumed, setConsumed] = useState<MacroTotals>({ calories: 0, protein: 0, carbs: 0, fat: 0 });
  const [targets, setTargets] = useState<MacroTotals>({ calories: 2200, protein: 120, carbs: 250, fat: 70 });
  const [remaining, setRemaining] = useState(2200);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(() => new Date());

  const today = new Date();
  const dateParam = today.toISOString().slice(0, 10);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    Promise.all([mealsApi.list(dateParam), dashboardApi.summary()])
      .then(([mealList, summary]) => {
        setMeals(mealList as Meal[]);
        const t = summary.targets as MacroTotals;
        const c = summary.consumed as MacroTotals;
        setTargets(t);
        setConsumed(c);
        setRemaining(summary.remaining_calories as number);
      })
      .finally(() => setLoading(false));
  }, [dateParam]);

  const grouped = useMemo(
    () =>
      meals.reduce<Record<string, Meal[]>>((acc, m) => {
        const key = m.meal_type || "lunch";
        acc[key] = acc[key] || [];
        acc[key].push(m);
        return acc;
      }, {}),
    [meals],
  );

  const mealCount = meals.length;
  const totalKcal = Math.round(consumed.calories);

  return (
    <PageShell mainClassName="pt-32 md:pt-36">
      <section className="mb-lg">
        <SectionDivider title="-- Nhật ký ăn uống --" />
      </section>

      <EditorialCard
        padding="p-md md:p-lg"
        className="mb-lg relative overflow-hidden bg-gradient-to-br from-surface-container-lowest via-surface-container-lowest to-white/5"
      >
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-20 -left-10 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-2">Hôm nay</p>
            <p className="font-body-md text-body-md text-on-surface-variant mb-1 capitalize" suppressHydrationWarning>
              {now.toLocaleDateString("vi-VN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <p
              className="font-headline-md text-headline-md text-on-surface tabular-nums tracking-tight"
              suppressHydrationWarning
            >
              {now.toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
              })}
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-on-surface text-xs">
                {mealCount} bữa ăn
              </span>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/15 text-on-surface-variant text-xs">
                {totalKcal.toLocaleString("vi-VN")} kcal đã nạp
              </span>
            </div>
          </div>

          <Link
            href="/scanner"
            className="bg-[#b82c2a] hover:bg-[#9a2523] text-white px-lg py-md rounded-xl transition-all flex items-center justify-center shadow-lg shrink-0 self-start lg:self-center active:scale-[0.98]"
          >
            <span className="font-label-md text-label-md">Quét món</span>
          </Link>
        </div>
      </EditorialCard>

      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-md mb-lg">
        <EditorialCard
          padding="p-md"
          className="flex items-center gap-md cursor-pointer hover:bg-surface-container-low transition-colors"
          hover
        >
          <div
            onClick={() => router.push("/nutrition-analytics")}
            onKeyDown={(e) => e.key === "Enter" && router.push("/nutrition-analytics")}
            role="button"
            tabIndex={0}
            className="flex items-center gap-md w-full"
          >
            <CalorieRing consumed={consumed.calories} target={targets.calories} />
            <div className="flex-1 min-w-0 space-y-3">
              <div>
                <p className="text-xs text-outline mb-0.5">Mục tiêu hôm nay</p>
                <p className="font-headline-sm text-headline-sm text-on-surface tabular-nums">
                  {targets.calories.toLocaleString("vi-VN")} kcal
                </p>
              </div>
              <div>
                <p className="text-xs text-outline mb-0.5">Còn lại</p>
                <p className="font-headline-sm text-headline-sm text-on-surface tabular-nums">
                  {remaining.toLocaleString("vi-VN")} kcal
                </p>
              </div>
            </div>
          </div>
        </EditorialCard>

        <EditorialCard padding="p-md" className="flex flex-col justify-center gap-4">
          <p className="text-xs uppercase tracking-widest text-outline">Macro hôm nay</p>
          <MacroBar label="Đạm" value={consumed.protein} target={targets.protein} unit="g" colorKey="protein" />
          <MacroBar label="Tinh bột" value={consumed.carbs} target={targets.carbs} unit="g" colorKey="carbs" />
          <MacroBar label="Chất béo" value={consumed.fat} target={targets.fat} unit="g" colorKey="fat" />
        </EditorialCard>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-md mb-xl">
        {QUICK_ACTIONS.map((action) => (
          <Link key={action.href} href={action.href} className="group">
            <EditorialCard padding="p-md" hover className="h-full transition-colors group-hover:border-white/25">
              <div>
                <p className="font-body-lg text-body-lg font-semibold text-on-surface">{action.title}</p>
                <p className="text-xs text-on-surface-variant mt-0.5">{action.desc}</p>
              </div>
            </EditorialCard>
          </Link>
        ))}
      </div>

      <section className="mb-lg">
        <SectionDivider title="-- Các bữa trong ngày --" />

        {loading ? (
          <p className="text-outline text-center py-12">Đang tải nhật ký...</p>
        ) : (
          <div className="space-y-md -mt-2">
            {MEAL_SLOTS.map((slot) => {
              const items = grouped[slot.id] || [];
              const slotKcal = items.reduce((s, m) => s + m.calories, 0);

              return (
                <div key={slot.id} id={`meal-${slot.id}`} className="scroll-mt-36">
                <EditorialCard padding="p-md" className="overflow-hidden">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <h3 className="font-body-lg text-body-lg font-semibold text-on-surface">{slot.label}</h3>
                      <p className="text-xs text-outline">{slot.time}</p>
                    </div>
                    {items.length > 0 ? (
                      <span className="text-xs tabular-nums text-on-surface shrink-0">{Math.round(slotKcal)} kcal</span>
                    ) : (
                      <Link href="/scanner" className="text-xs text-on-surface hover:underline shrink-0">
                        Thêm
                      </Link>
                    )}
                  </div>

                  {items.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-white/20 bg-white/5 px-4 py-5 text-center">
                      <p className="text-sm text-on-surface-variant">Chưa ghi nhận món nào</p>
                      <Link href="/scanner" className="inline-block text-xs text-[#b82c2a] hover:text-[#9a2523] mt-2 hover:underline">
                        Quét khay ăn
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {items.map((meal) => (
                        <div
                          key={meal.id}
                          className="rounded-lg bg-white/5 border border-white/10 px-3 py-2.5"
                        >
                          <h4 className="font-body-md text-body-md font-medium text-on-surface truncate">{meal.name}</h4>
                          <p className="text-xs text-outline mt-0.5">
                            {new Date(meal.eaten_at).toLocaleTimeString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                            {" · "}
                            {Math.round(meal.calories)} kcal · {Math.round(meal.protein)}g đạm
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </EditorialCard>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {!loading && mealCount === 0 && (
        <EditorialCard padding="p-md" className="bg-white/5 border-white/15">
          <p className="font-body-md text-body-md font-semibold text-on-surface mb-2">Mẹo quét nhanh</p>
          <ul className="text-sm text-on-surface-variant space-y-1.5 list-disc list-inside">
            <li>Đặt khay ăn trong khung camera, ánh sáng đều</li>
            <li>Giữ điện thoại song song mặt khay</li>
            <li>Mỗi ô món sẽ được nhận diện và tính giá tự động</li>
          </ul>
        </EditorialCard>
      )}
      <ContactFloat />
    </PageShell>
  );
}
