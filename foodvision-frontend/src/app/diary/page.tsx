"use client";

import Navigation from "@/components/Navigation";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function MealDiary() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col font-body-md text-on-surface bg-[#FAF9F6] antialiased">
      <Navigation />

      <main className="flex-grow max-w-[1140px] w-full mx-auto px-container-margin pt-16 md:pt-base pb-32">
        {/* Date Switcher & Summary Section */}
        <section className="py-lg flex flex-col md:flex-row md:items-end justify-between gap-md mt-6">
          <div>
            <p className="font-label-md text-label-md text-outline uppercase tracking-widest mb-xs">
              Hôm nay
            </p>
            <h2 className="font-headline-md text-headline-md text-on-surface">
              24 Tháng 9
            </h2>
          </div>

          {/* Daily Nutrition Summary Bento Card */}
          <div className="bg-surface-container-lowest border border-surface-variant p-md rounded-xl flex items-center gap-lg shadow-[0_20px_30px_rgba(27,28,28,0.04)] cursor-pointer hover:bg-surface-container-high transition-colors" onClick={() => router.push('/nutrition-analytics')}>
            <div className="flex flex-col items-center">
              <span className="font-label-sm text-label-sm text-outline">
                Mục tiêu
              </span>
              <span className="font-headline-sm text-headline-sm text-primary">
                2,200
              </span>
            </div>
            <div className="w-px h-10 bg-outline-variant"></div>
            <div className="flex flex-col items-center">
              <span className="font-label-sm text-label-sm text-outline">
                Còn lại
              </span>
              <span className="font-headline-sm text-headline-sm text-secondary">
                840
              </span>
            </div>
            <button className="bg-primary hover:bg-primary-container text-white px-md py-sm rounded-lg transition-colors flex items-center gap-xs shadow-md">
              <span className="material-symbols-outlined text-[20px]">add</span>
              <span className="font-label-md text-label-md hidden sm:inline">Thêm Bữa ăn</span>
            </button>
          </div>
        </section>

        {/* Chronological Meal List */}
        <div className="space-y-lg relative">
          {/* Timeline Line (Visual) */}
          <div className="absolute left-[23px] top-0 bottom-0 w-[1px] bg-outline-variant/30 hidden md:block"></div>

          {/* Breakfast */}
          <div className="relative pl-0 md:pl-xl">
            {/* Timeline Dot */}
            <div className="absolute left-[18px] top-4 w-3 h-3 rounded-full bg-primary-fixed border-2 border-primary hidden md:block"></div>
            <div className="flex items-center justify-between mb-sm">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                Bữa sáng
              </h3>
              <span className="font-label-md text-label-md text-outline">
                08:30 AM
              </span>
            </div>
            <div className="meal-card bg-surface-container-lowest rounded-xl p-md border border-surface-variant shadow-[0_20px_30px_rgba(27,28,28,0.04)] flex flex-col sm:flex-row gap-md items-center cursor-pointer hover:scale-[0.99] active:scale-[0.98] transition-transform">
              <div className="w-full sm:w-24 h-24 rounded-lg overflow-hidden shrink-0 relative">
                <Image
                  src="/images/dishes/canh_rau.jpg"
                  alt="Canh rau"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-grow text-center sm:text-left">
                <h4 className="font-body-lg text-body-lg font-bold text-on-surface">
                  Canh rau
                </h4>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  250g Sữa chua Hy Lạp, 10g Mật ong, Quả mọng
                </p>
              </div>
              <div className="text-center sm:text-right shrink-0">
                <div className="bg-primary-fixed/30 px-sm py-xs rounded-full inline-block">
                  <span className="font-label-md text-label-md text-primary-container font-bold">
                    420 kcal
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Lunch */}
          <div className="relative pl-0 md:pl-xl" onClick={() => router.push('/deep-nutrition-analytics')}>
            <div className="absolute left-[18px] top-4 w-3 h-3 rounded-full bg-outline-variant border-2 border-outline hidden md:block"></div>
            <div className="flex items-center justify-between mb-sm">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                Bữa trưa
              </h3>
              <span className="font-label-md text-label-md text-outline">
                12:45 PM
              </span>
            </div>
            <div className="meal-card bg-surface-container-lowest rounded-xl p-md border border-surface-variant shadow-[0_20px_30px_rgba(27,28,28,0.04)] flex flex-col sm:flex-row gap-md items-center cursor-pointer hover:scale-[0.99] active:scale-[0.98] transition-transform">
              <div className="w-full sm:w-24 h-24 rounded-lg overflow-hidden shrink-0 relative">
                <Image
                  src="/images/dishes/dau_hu_sot_ca.jpg"
                  alt="Đậu hũ sốt cà"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-grow text-center sm:text-left">
                <h4 className="font-body-lg text-body-lg font-bold text-on-surface">
                  Đậu hũ sốt cà
                </h4>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Cải xoăn, Khoai lang, Đậu gà, Sốt Tahini
                </p>
              </div>
              <div className="text-center sm:text-right shrink-0">
                <div className="bg-primary-fixed/30 px-sm py-xs rounded-full inline-block">
                  <span className="font-label-md text-label-md text-primary-container font-bold">
                    580 kcal
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Snack */}
          <div className="relative pl-0 md:pl-xl">
            <div className="absolute left-[18px] top-4 w-3 h-3 rounded-full bg-tertiary-fixed border-2 border-tertiary hidden md:block"></div>
            <div className="flex items-center justify-between mb-sm">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                Bữa phụ
              </h3>
              <span className="font-label-md text-label-md text-outline">
                03:15 PM
              </span>
            </div>
            <div className="meal-card bg-surface-container-lowest rounded-xl p-md border border-surface-variant shadow-[0_20px_30px_rgba(27,28,28,0.04)] flex flex-col sm:flex-row gap-md items-center cursor-pointer hover:scale-[0.99] active:scale-[0.98] transition-transform">
              <div className="w-full sm:w-24 h-24 rounded-lg overflow-hidden shrink-0 relative">
                <Image
                  src="/images/dishes/trung_chien.jpg"
                  alt="Trứng chiên"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-grow text-center sm:text-left">
                <h4 className="font-body-lg text-body-lg font-bold text-on-surface">
                  Trứng chiên
                </h4>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Một nắm nhỏ (khoảng 15 hạt)
                </p>
              </div>
              <div className="text-center sm:text-right shrink-0">
                <div className="bg-primary-fixed/30 px-sm py-xs rounded-full inline-block">
                  <span className="font-label-md text-label-md text-primary-container font-bold">
                    160 kcal
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Dinner (Upcoming) */}
          <div className="relative pl-0 md:pl-xl opacity-60 grayscale-[0.5]">
            <div className="absolute left-[18px] top-4 w-3 h-3 rounded-full bg-outline-variant border-2 border-outline-variant hidden md:block"></div>
            <div className="flex items-center justify-between mb-sm">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                Bữa tối
              </h3>
              <span className="font-label-md text-label-md text-outline">
                Chưa ghi nhận
              </span>
            </div>
            <button className="w-full meal-card bg-surface-container-low rounded-xl p-xl border border-dashed border-outline-variant flex flex-col items-center justify-center gap-sm hover:bg-surface-variant transition-colors group">
              <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-primary">
                  restaurant
                </span>
              </div>
              <p className="font-label-md text-label-md text-outline">
                Chạm để ghi nhận bữa tối
              </p>
            </button>
          </div>
        </div>

        {/* Nutrient Progress Chips */}
        <section className="mt-xl grid grid-cols-2 md:grid-cols-4 gap-md">
          <div className="bg-surface-container-lowest p-md rounded-xl border border-surface-variant">
            <p className="font-label-sm text-label-sm text-outline mb-xs">
              Đạm
            </p>
            <div className="flex items-end gap-xs">
              <span className="font-headline-sm text-headline-sm text-on-surface">
                62g
              </span>
              <span className="font-label-sm text-label-sm text-outline mb-1">
                / 120g
              </span>
            </div>
            <div className="mt-sm h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[52%]"></div>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-md rounded-xl border border-surface-variant">
            <p className="font-label-sm text-label-sm text-outline mb-xs">
              Tinh bột
            </p>
            <div className="flex items-end gap-xs">
              <span className="font-headline-sm text-headline-sm text-on-surface">
                145g
              </span>
              <span className="font-label-sm text-label-sm text-outline mb-1">
                / 250g
              </span>
            </div>
            <div className="mt-sm h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
              <div className="h-full bg-secondary w-[58%]"></div>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-md rounded-xl border border-surface-variant">
            <p className="font-label-sm text-label-sm text-outline mb-xs">
              Chất béo
            </p>
            <div className="flex items-end gap-xs">
              <span className="font-headline-sm text-headline-sm text-on-surface">
                40g
              </span>
              <span className="font-label-sm text-label-sm text-outline mb-1">
                / 70g
              </span>
            </div>
            <div className="mt-sm h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
              <div className="h-full bg-tertiary w-[57%]"></div>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-md rounded-xl border border-surface-variant">
            <p className="font-label-sm text-label-sm text-outline mb-xs">
              Chất xơ
            </p>
            <div className="flex items-end gap-xs">
              <span className="font-headline-sm text-headline-sm text-on-surface">
                18g
              </span>
              <span className="font-label-sm text-label-sm text-outline mb-1">
                / 30g
              </span>
            </div>
            <div className="mt-sm h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
              <div className="h-full bg-primary-fixed-dim w-[60%]"></div>
            </div>
          </div>
        </section>

        {/* Floating Action Button (FAB) */}
        <button className="fixed right-6 bottom-24 w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(82,98,28,0.3)] active:scale-95 transition-transform duration-150 z-40 md:hidden">
          <span className="material-symbols-outlined text-[32px]">add</span>
        </button>
      </main>
    </div>
  );
}
