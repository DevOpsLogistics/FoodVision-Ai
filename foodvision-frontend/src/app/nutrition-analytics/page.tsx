"use client";

import Navigation from "@/components/Navigation";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function NutritionAnalytics() {
  const router = useRouter();
  const barsRef = useRef<HTMLDivElement>(null);

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
            const originalHeight = htmlElement.style.height || htmlElement.dataset.height;
            if (originalHeight && !htmlElement.dataset.animated) {
              htmlElement.style.height = "0";
              htmlElement.dataset.height = originalHeight;
              htmlElement.dataset.animated = "true";
              setTimeout(() => {
                htmlElement.style.height = originalHeight;
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
  }, []);

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen pb-24 md:pb-0">
      <Navigation />

      <main className="max-w-[1140px] mx-auto px-container-margin pt-16 md:pt-24 pb-12">
        {/* Header Section */}
        <section className="mb-lg">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="font-label-md text-label-md text-primary uppercase tracking-widest mb-2 block">
                Tổng quan Hàng tháng
              </span>
              <h2 className="font-headline-md text-headline-md text-on-surface leading-tight">
                Thông tin Dinh dưỡng của bạn
              </h2>
            </div>
            <div className="flex gap-2 bg-surface-container p-1 rounded-full w-fit">
              <button className="px-6 py-2 rounded-full font-label-md text-label-md bg-primary text-on-primary transition-all shadow-sm">
                Hàng tuần
              </button>
              <button className="px-6 py-2 rounded-full font-label-md text-label-md text-on-surface-variant hover:bg-surface-variant transition-all">
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
                  Trung bình 2,140 kcal / ngày
                </p>
              </div>
              <div className="flex items-center gap-2 text-primary font-bold">
                <span className="material-symbols-outlined">trending_up</span>
                <span className="font-label-md text-label-md">
                  4% so với tuần trước
                </span>
              </div>
            </div>

            <div className="flex-grow flex items-end justify-between gap-2 pt-4 relative">
              {/* Synthetic Line Chart Visual */}
              <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdBshql7855AYi4vom4RICdsUguYLnqON-tBkDMRNxKxl7IZWz88JDE_Tyf7usEGcBPTJ_PeSdYNY5Ql5cegT8pVe1eXTZIbG9SLyk-dpbFwg4bH03o13SON1XEnlprxtEu3KfASKNpGuYFBvQNNTXOWv4W2BpI2tyr8qT5PKR6XoRRKE6C8Rpb4qepZfdodvLwwU7S7vRj9UGb7_HBco-E2kwinpQW-yfoE-WbfOyuzI0xwpOVZTmyR3qaODANz-7KfLf_fxHTGhQ"
                  alt="Abstract data visualization"
                  fill
                  className="object-cover grayscale"
                />
              </div>

              {/* Column Bars */}
              <div className="flex-1 group relative h-full flex flex-col justify-end items-center">
                <div
                  className="w-full max-w-[40px] bg-tertiary-fixed-dim rounded-t-lg bar-transition group-hover:bg-primary transition-colors"
                  style={{ height: "65%" }}
                  data-height="65%"
                ></div>
                <span className="mt-4 font-label-sm text-label-sm text-outline">
                  Th 2
                </span>
              </div>
              <div className="flex-1 group relative h-full flex flex-col justify-end items-center">
                <div
                  className="w-full max-w-[40px] bg-tertiary-fixed-dim rounded-t-lg bar-transition group-hover:bg-primary transition-colors"
                  style={{ height: "80%" }}
                  data-height="80%"
                ></div>
                <span className="mt-4 font-label-sm text-label-sm text-outline">
                  Th 3
                </span>
              </div>
              <div className="flex-1 group relative h-full flex flex-col justify-end items-center">
                <div
                  className="w-full max-w-[40px] bg-primary rounded-t-lg bar-transition group-hover:bg-primary transition-colors cursor-pointer hover:scale-105"
                  style={{ height: "45%" }}
                  data-height="45%"
                  onClick={() => router.push('/deep-nutrition-analytics')}
                ></div>
                <span className="mt-4 font-label-sm text-label-sm text-outline">
                  Th 4
                </span>
              </div>
              <div className="flex-1 group relative h-full flex flex-col justify-end items-center">
                <div
                  className="w-full max-w-[40px] bg-tertiary-fixed-dim rounded-t-lg bar-transition group-hover:bg-primary transition-colors"
                  style={{ height: "90%" }}
                  data-height="90%"
                ></div>
                <span className="mt-4 font-label-sm text-label-sm text-outline">
                  Th 5
                </span>
              </div>
              <div className="flex-1 group relative h-full flex flex-col justify-end items-center">
                <div
                  className="w-full max-w-[40px] bg-tertiary-fixed-dim rounded-t-lg bar-transition group-hover:bg-primary transition-colors"
                  style={{ height: "70%" }}
                  data-height="70%"
                ></div>
                <span className="mt-4 font-label-sm text-label-sm text-outline">
                  Th 6
                </span>
              </div>
              <div className="flex-1 group relative h-full flex flex-col justify-end items-center">
                <div
                  className="w-full max-w-[40px] bg-tertiary-fixed-dim rounded-t-lg bar-transition group-hover:bg-primary transition-colors"
                  style={{ height: "55%" }}
                  data-height="55%"
                ></div>
                <span className="mt-4 font-label-sm text-label-sm text-outline">
                  Th 7
                </span>
              </div>
              <div className="flex-1 group relative h-full flex flex-col justify-end items-center">
                <div
                  className="w-full max-w-[40px] bg-tertiary-fixed-dim rounded-t-lg bar-transition group-hover:bg-primary transition-colors"
                  style={{ height: "60%" }}
                  data-height="60%"
                ></div>
                <span className="mt-4 font-label-sm text-label-sm text-outline">
                  CN
                </span>
              </div>
            </div>
          </div>

          {/* Macro breakdown Card */}
          <div className="md:col-span-4 glass-card rounded-xl p-md flex flex-col">
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-lg">
              Đa lượng
            </h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between font-label-md text-label-md">
                  <span className="text-on-surface">Đạm</span>
                  <span className="text-outline">120g / 150g</span>
                </div>
                <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-secondary-container w-[80%] rounded-full"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between font-label-md text-label-md">
                  <span className="text-on-surface">Tinh bột</span>
                  <span className="text-outline">240g / 300g</span>
                </div>
                <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-primary-fixed-dim w-[65%] rounded-full"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between font-label-md text-label-md">
                  <span className="text-on-surface">Chất béo</span>
                  <span className="text-outline">65g / 70g</span>
                </div>
                <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-tertiary-fixed-dim w-[92%] rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-8">
              <div className="bg-surface-container-low rounded-lg p-4 border border-outline-variant/30">
                <div className="flex items-start gap-3 text-primary">
                  <span className="material-symbols-outlined mt-0.5">
                    lightbulb
                  </span>
                  <p className="font-label-sm text-label-sm leading-relaxed">
                    Lượng đạm của bạn hơi thấp trong tuần này. Hãy cân nhắc thêm
                    các loại đậu hoặc thịt gia cầm nạc vào bữa trưa.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Vitamins & Minerals Detailed Breakdown */}
          <div className="md:col-span-12 glass-card rounded-xl p-md">
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-lg gap-4">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                Cân bằng Vi lượng
              </h3>
              <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
                <span className="px-4 py-1.5 rounded-full bg-secondary-container/10 text-on-secondary-container font-label-md text-label-md whitespace-nowrap">
                  Vitamin A
                </span>
                <span className="px-4 py-1.5 rounded-full bg-primary-container/10 text-on-primary-fixed-variant font-label-md text-label-md whitespace-nowrap">
                  Vitamin C
                </span>
                <span className="px-4 py-1.5 rounded-full bg-tertiary-container/10 text-on-tertiary-fixed-variant font-label-md text-label-md whitespace-nowrap">
                  Magiê
                </span>
                <span className="px-4 py-1.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-md text-label-md whitespace-nowrap">
                  Sắt
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-md">
              {/* Micro Item */}
              <div className="flex flex-col items-center p-4 rounded-xl border border-outline-variant/30 hover:border-primary/30 transition-all group">
                <div className="w-16 h-16 rounded-full border-4 border-primary/20 flex items-center justify-center mb-3 relative">
                  <span className="font-label-md text-label-md text-on-surface">
                    88%
                  </span>
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle
                      className="text-primary"
                      cx="32"
                      cy="32"
                      fill="transparent"
                      r="28"
                      stroke="currentColor"
                      strokeDasharray="175"
                      strokeDashoffset="21"
                      strokeWidth="4"
                    ></circle>
                  </svg>
                </div>
                <span className="font-label-md text-label-md text-on-surface">
                  Vitamin D
                </span>
                <span className="font-label-sm text-label-sm text-outline">
                  Đạt mục tiêu
                </span>
              </div>
              {/* Micro Item */}
              <div className="flex flex-col items-center p-4 rounded-xl border border-outline-variant/30 hover:border-primary/30 transition-all group">
                <div className="w-16 h-16 rounded-full border-4 border-error/10 flex items-center justify-center mb-3 relative">
                  <span className="font-label-md text-label-md text-on-surface">
                    42%
                  </span>
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle
                      className="text-secondary"
                      cx="32"
                      cy="32"
                      fill="transparent"
                      r="28"
                      stroke="currentColor"
                      strokeDasharray="175"
                      strokeDashoffset="101"
                      strokeWidth="4"
                    ></circle>
                  </svg>
                </div>
                <span className="font-label-md text-label-md text-on-surface">
                  Canxi
                </span>
                <span className="font-label-sm text-label-sm text-secondary">
                  Dưới mục tiêu
                </span>
              </div>
              {/* Micro Item */}
              <div className="flex flex-col items-center p-4 rounded-xl border border-outline-variant/30 hover:border-primary/30 transition-all group">
                <div className="w-16 h-16 rounded-full border-4 border-primary/20 flex items-center justify-center mb-3 relative">
                  <span className="font-label-md text-label-md text-on-surface">
                    105%
                  </span>
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle
                      className="text-primary"
                      cx="32"
                      cy="32"
                      fill="transparent"
                      r="28"
                      stroke="currentColor"
                      strokeDasharray="175"
                      strokeDashoffset="0"
                      strokeWidth="4"
                    ></circle>
                  </svg>
                </div>
                <span className="font-label-md text-label-md text-on-surface">
                  B12
                </span>
                <span className="font-label-sm text-label-sm text-outline">
                  Tối ưu
                </span>
              </div>
              {/* Micro Item */}
              <div className="flex flex-col items-center p-4 rounded-xl border border-outline-variant/30 hover:border-primary/30 transition-all group">
                <div className="w-16 h-16 rounded-full border-4 border-primary/20 flex items-center justify-center mb-3 relative">
                  <span className="font-label-md text-label-md text-on-surface">
                    76%
                  </span>
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle
                      className="text-primary-container"
                      cx="32"
                      cy="32"
                      fill="transparent"
                      r="28"
                      stroke="currentColor"
                      strokeDasharray="175"
                      strokeDashoffset="42"
                      strokeWidth="4"
                    ></circle>
                  </svg>
                </div>
                <span className="font-label-md text-label-md text-on-surface">
                  Kẽm
                </span>
                <span className="font-label-sm text-label-sm text-outline">
                  Khỏe mạnh
                </span>
              </div>
              {/* Micro Item */}
              <div className="flex flex-col items-center p-4 rounded-xl border border-outline-variant/30 hover:border-primary/30 transition-all group">
                <div className="w-16 h-16 rounded-full border-4 border-primary/20 flex items-center justify-center mb-3 relative">
                  <span className="font-label-md text-label-md text-on-surface">
                    92%
                  </span>
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle
                      className="text-primary"
                      cx="32"
                      cy="32"
                      fill="transparent"
                      r="28"
                      stroke="currentColor"
                      strokeDasharray="175"
                      strokeDashoffset="14"
                      strokeWidth="4"
                    ></circle>
                  </svg>
                </div>
                <span className="font-label-md text-label-md text-on-surface">
                  Kali
                </span>
                <span className="font-label-sm text-label-sm text-outline">
                  Đạt mục tiêu
                </span>
              </div>
            </div>
          </div>

          {/* Asymmetric Editorial Card */}
          <div className="md:col-span-12 lg:col-span-12 bg-tertiary-fixed-dim/20 rounded-xl overflow-hidden flex flex-col md:flex-row min-h-[300px]">
            <div className="md:w-1/2 p-md md:p-lg flex flex-col justify-center">
              <h4 className="font-display-lg-mobile text-display-lg-mobile text-on-surface mb-md">
                Món ăn yêu thích của bạn.
              </h4>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-lg">
                Dữ liệu của bạn cho thấy bạn rất thích món cá hú kho. Món ăn này cung cấp nhiều đạm và chất béo tốt, rất phù hợp với chế độ dinh dưỡng của bạn.
              </p>
              <button className="bg-primary text-on-primary px-8 py-4 rounded-full font-label-md text-label-md w-fit hover:bg-primary-container transition-colors active:scale-95 shadow-sm">
                Đọc Toàn bộ Phân tích
              </button>
            </div>
            <div className="md:w-1/2 h-64 md:h-auto overflow-hidden relative">
              <Image
                src="/images/dishes/ca_hu_kho.jpg"
                alt="Cá hú kho"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
