"use client";

import { useMemo, useState } from "react";
import { PageShell } from "@/components/PageLayout";
import DishPhoto from "@/components/DishPhoto";
import VisitorAvatars from "@/components/VisitorAvatars";
import {
  formatPrice,
  filterRecipes,
  getVisitorsForRecipe,
  RECIPE_CARDS,
  RECIPE_FILTERS,
  shuffleRecipes,
  type RecipeCard,
  type RecipeFilterId,
} from "@/data/mealRecommendations";

const COL_SPAN: Record<number, string> = {
  4: "md:col-span-4",
  8: "md:col-span-8",
};

function AnimatedPrice({ price, className = "" }: { price: number; className?: string }) {
  return (
    <span
      className={`fv-price-pop shrink-0 font-bold text-red-500 leading-tight ${className}`}
      aria-label={`Giá ${formatPrice(price)}`}
    >
      {formatPrice(price)}
    </span>
  );
}

function RecipeBack({ recipe }: { recipe: RecipeCard }) {
  return (
    <div className="relative flex flex-col h-full p-md">
      <AnimatedPrice price={recipe.price} className="absolute top-3 right-3" />
      <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2 pr-24 shrink-0">{recipe.name}</h3>
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
      <span className="block w-full shrink-0 text-center font-label-md text-label-md text-white bg-red-500 rounded-lg py-2.5 px-4 mt-3">
        Ấn để quay lại
      </span>
    </div>
  );
}

function FlipRecipeCard({
  recipe,
  variant = "grid",
  priority = false,
}: {
  recipe: RecipeCard;
  variant?: "featured" | "grid";
  priority?: boolean;
}) {
  const [flipped, setFlipped] = useState(false);
  const isFeatured = variant === "featured";
  const colClass = COL_SPAN[isFeatured ? 8 : recipe.colSpan] ?? "md:col-span-4";

  return (
    <div className={`${colClass} h-full [perspective:1200px]`}>
      <button
        type="button"
        aria-label={flipped ? `Quay lại ${recipe.name}` : `Xem công thức ${recipe.name}`}
        aria-pressed={flipped}
        onClick={() => setFlipped((v) => !v)}
        className={`relative h-full w-full text-left rounded-xl bg-transparent shadow-tactile transition-all duration-300 hover:shadow-[0_20px_40px_rgba(27,28,28,0.06)] focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 border-2 ${
          flipped ? "border-red-500" : "border-[#F2EFE9]/40"
        }`}
      >
        <div
          className={`relative h-full w-full transition-transform duration-500 ease-in-out [transform-style:preserve-3d] ${
            flipped ? "[transform:rotateY(180deg)]" : ""
          }`}
        >
          {/* Mặt trước — relative để card tự cao theo nội dung */}
          <div className="relative h-full [backface-visibility:hidden] rounded-xl bg-surface-container-lowest overflow-hidden flex flex-col">
            <div
              className={`relative overflow-hidden bg-surface-variant w-full shrink-0 ${
                isFeatured ? "aspect-[16/9]" : "aspect-square"
              }`}
            >
              <DishPhoto
                src={recipe.image}
                alt={recipe.name}
                priority={priority}
                sizes={
                  isFeatured
                    ? "(max-width: 768px) 100vw, 66vw"
                    : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                }
                className="object-cover"
              />
            </div>
            <div className="p-md flex flex-col flex-1 relative min-h-0">
              <AnimatedPrice price={recipe.price} className="absolute top-3 right-3 z-10" />
              <h2
                className={`text-on-surface mb-base pr-28 shrink-0 ${
                  isFeatured
                    ? "font-headline-md text-headline-sm md:text-headline-md"
                    : "font-headline-sm text-headline-sm"
                }`}
              >
                {recipe.name}
              </h2>
              <div className="flex gap-4 mb-md text-outline font-label-md text-label-md flex-wrap shrink-0">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px]">schedule</span>
                  {recipe.time}
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px]">local_fire_department</span>
                  {recipe.calories} kcal
                </span>
              </div>
              <p className="text-on-surface-variant font-body-md text-body-md mb-md line-clamp-2 min-h-[3rem]">
                {recipe.description}
              </p>
              <div className="mt-auto flex flex-col gap-3 shrink-0">
                <VisitorAvatars
                  visitors={getVisitorsForRecipe(recipe.id)}
                  size={isFeatured ? "md" : "sm"}
                  showNames
                />
                <span className="block w-full text-center font-label-md text-label-md text-white bg-red-500 rounded-lg py-2.5 px-4">
                  Ấn để xem công thức
                </span>
              </div>
            </div>
          </div>

          {/* Mặt sau — cùng nền trắng, không thêm màu ô riêng */}
          <div className="absolute inset-0 h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-xl bg-surface-container-lowest overflow-hidden flex flex-col">
            <RecipeBack recipe={recipe} />
          </div>
        </div>
      </button>
    </div>
  );
}

const WELCOME_MSG = "Chào mừng bạn đến với nhóm thực đơn, mời bạn xem qua";

function buildLayout(cards: RecipeCard[]) {
  const shuffled = shuffleRecipes(cards);
  if (shuffled.length === 0) {
    return { featured: null as RecipeCard | null, grid: [] as RecipeCard[] };
  }
  return {
    featured: { ...shuffled[0], colSpan: 8 },
    grid: shuffled.slice(1),
  };
}

function WelcomeMarquee() {
  const line = (
    <span className="inline-flex items-center gap-8 px-8 font-headline-md text-headline-sm md:text-headline-md font-semibold tracking-wide whitespace-nowrap text-white">
      {WELCOME_MSG}
      <span className="text-white/70" aria-hidden>
        ✦
      </span>
    </span>
  );

  return (
    <section className="mb-lg overflow-hidden py-2" aria-label={WELCOME_MSG}>
      <div className="animate-marquee-right" style={{ animationDuration: "28s" }}>
        {line}
        {line}
      </div>
    </section>
  );
}

export default function MealRecommendations() {
  const [activeFilter, setActiveFilter] = useState<RecipeFilterId>("all");

  const { featured, grid } = useMemo(() => {
    return buildLayout(filterRecipes(RECIPE_CARDS, activeFilter));
  }, [activeFilter]);

  return (
    <PageShell>
      <WelcomeMarquee />

      <div className="flex gap-sm mb-lg overflow-x-auto hide-scrollbar pb-2">
        {RECIPE_FILTERS.map(({ id, label }) => {
          const active = activeFilter === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setActiveFilter(id)}
              className={`px-4 py-2 rounded-full font-label-md text-label-md flex-shrink-0 transition-all ${
                active
                  ? "bg-red-500 text-white shadow-sm"
                  : "bg-transparent text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {featured ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter md:gap-md items-stretch">
          <FlipRecipeCard key={`${activeFilter}-${featured.id}`} recipe={featured} variant="featured" priority />
          {grid.map((recipe) => (
            <FlipRecipeCard key={`${activeFilter}-${recipe.id}`} recipe={recipe} />
          ))}
        </div>
      ) : (
        <p className="text-center text-on-surface-variant font-body-md py-xl">
          Chưa có món phù hợp với bộ lọc này.
        </p>
      )}
    </PageShell>
  );
}
