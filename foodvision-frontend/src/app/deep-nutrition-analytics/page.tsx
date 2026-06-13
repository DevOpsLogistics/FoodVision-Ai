"use client";

import Navigation from "@/components/Navigation";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function DeepNutritionAnalytics() {
  const router = useRouter();

  return (
    <div className="text-on-background bg-[#FAF9F6] antialiased min-h-screen flex flex-col pb-24 md:pb-0">
      <Navigation />

      <main className="flex-grow w-full max-w-[1140px] mx-auto px-container-margin py-lg flex flex-col gap-xl pt-16 md:pt-24">
        {/* Header Section */}
        <section className="max-w-[672px] relative z-10">
          <p className="font-label-md text-label-md text-tertiary uppercase tracking-widest mb-sm">
            Phân tích Chuyên sâu
          </p>
          <h1 className="font-headline-sm text-headline-sm-mobile md:font-headline-md md:text-headline-md text-on-surface mb-md">
            Sự đồng vận & Hấp thụ Dinh dưỡng
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
            Các thói quen ăn uống gần đây của bạn cho thấy sự tối ưu hóa vượt
            trội trong việc hấp thụ sắt, chủ yếu là do bạn thường xuyên kết hợp
            các loại rau xanh đậm với trái cây họ cam quýt. Cách tiếp cận kết
            hợp nguyên liệu khéo léo này làm tăng đáng kể khả năng sử dụng
            khoáng chất thiết yếu của cơ thể.
          </p>
        </section>

        {/* Bento Grid Layout */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-md auto-rows-min">
          {/* Synergy Highlight Card (Span 8) */}
          <div className="md:col-span-8 bg-surface-container-lowest rounded-xl shadow-soft p-lg border border-[#F2EFE9] flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-start mb-lg relative z-10">
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface">
                  Đồng vận Sắt + Vitamin C
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
                  Hệ số hấp thụ quan sát được
                </p>
              </div>
              <div className="bg-primary-container/20 text-primary-container px-4 py-2 rounded-full font-label-md text-label-md flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-sm"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  trending_up
                </span>
                Tăng 2.4x
              </div>
            </div>

            {/* Chart Area */}
            <div className="flex-grow min-h-[240px] relative w-full mt-md z-10 flex items-end pb-8">
              {/* Custom SVG "hand-drawn" chart */}
              <svg
                className="w-full h-full absolute inset-0 overflow-visible"
                preserveAspectRatio="none"
                viewBox="0 0 100 100"
              >
                <defs>
                  <linearGradient
                    id="sageGrad"
                    x1="0%"
                    x2="0%"
                    y1="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#bbcf7c" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#bbcf7c" stopOpacity="0.4" />
                  </linearGradient>
                </defs>
                {/* Baseline */}
                <path
                  d="M0,80 Q20,85 40,75 T100,80"
                  fill="none"
                  stroke="#767869"
                  strokeDasharray="2 2"
                  strokeWidth="0.5"
                />
                {/* Synergy Area */}
                <path
                  d="M0,100 L0,70 Q20,60 40,40 T80,20 L100,15 L100,100 Z"
                  fill="url(#sageGrad)"
                  opacity="0.8"
                />
                {/* Synergy Line */}
                <path
                  className="path-organic"
                  d="M0,70 Q20,60 40,40 T80,20 L100,15"
                  fill="none"
                  stroke="#52621c"
                  strokeLinecap="round"
                  strokeWidth="2"
                />
                {/* Data Points */}
                <circle cx="40" cy="40" fill="#9f402d" r="2" />
                <circle cx="80" cy="20" fill="#9f402d" r="2" />
              </svg>
              {/* Overlay Labels */}
              <div className="absolute left-[35%] top-[25%] bg-surface-container-lowest/90 backdrop-blur-sm border border-outline-variant px-3 py-1.5 rounded-lg text-xs font-label-sm shadow-sm cursor-pointer" onClick={() => router.push('/farm-to-table')}>
                Thêm Cải xoăn + Chanh
              </div>
            </div>

            {/* Decorative element reflecting "nature/organic" */}
            <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
              <span className="material-symbols-outlined text-[200px]">eco</span>
            </div>
          </div>

          {/* Nutrient Density Score (Span 4) */}
          <div className="md:col-span-4 bg-primary text-on-primary rounded-xl shadow-soft p-lg flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-label-md text-label-md uppercase tracking-wider text-primary-fixed-dim opacity-90">
                Điểm Mật độ Cá nhân hóa
              </h3>
              <div className="mt-xl flex items-baseline gap-2">
                <span className="font-display-lg text-display-lg">94</span>
                <span className="font-body-md text-body-md text-primary-fixed-dim">
                  /100
                </span>
              </div>
              <p className="font-body-md text-body-md mt-sm opacity-80">
                Top 5% cho hồ sơ trao đổi chất của bạn.
              </p>
            </div>
            <div className="mt-xl relative z-10 border-t border-primary-fixed-dim/30 pt-md">
              <p className="font-label-sm text-label-sm text-primary-fixed-dim mb-2">
                Yếu tố chính
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm font-body-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed"></span>{" "}
                  Sinh khả dụng Magiê cao
                </li>
                <li className="flex items-center gap-2 text-sm font-body-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary-fixed"></span>{" "}
                  Tỷ lệ Omega-3 tối ưu
                </li>
              </ul>
            </div>
            {/* Abstract shape in background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-surface-tint rounded-full mix-blend-multiply filter blur-3xl opacity-50 transform translate-x-1/3 -translate-y-1/3"></div>
          </div>

          {/* Metabolic Impact Text/Editorial (Span 6) */}
          <div className="md:col-span-6 bg-surface-container-lowest rounded-xl shadow-soft p-lg border border-[#F2EFE9]">
            <div className="flex items-center gap-3 mb-md border-editorial pb-sm">
              <span
                className="material-symbols-outlined text-secondary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                vital_signs
              </span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                Phân tích Đường cong Trao đổi chất
              </h3>
            </div>
            <div className="prose prose-stone">
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-4">
                Việc tích hợp tinh bột phức hợp cùng với protein thực vật chất
                lượng cao đã làm phẳng đáng kể phản ứng glucose sau ăn của bạn.
                Không còn các 'cú sốc' đặc trưng của những bữa ăn đơn giản, thay
                vào đó là một đường cong nhẹ nhàng, ổn định.
              </p>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Điều này cho thấy hệ tiêu hóa của bạn đang điều chỉnh tốc độ
                phân giải dinh dưỡng một cách hiệu quả, đảm bảo giải phóng năng
                lượng ổn định và giảm thiểu sự mệt mỏi do insulin.
              </p>
            </div>
            <button className="mt-lg w-full bg-primary text-on-primary py-4 px-6 rounded-lg font-label-md text-label-md border border-[#3d4c05] hover:bg-surface-tint transition-colors flex items-center justify-center gap-2">
              Xem Nhật ký Chi tiết{" "}
              <span className="material-symbols-outlined text-sm">
                arrow_forward
              </span>
            </button>
          </div>

          {/* Absorption Micro-Interactions (Span 6) */}
          <div className="md:col-span-6 bg-surface-container-lowest rounded-xl shadow-soft p-lg border border-[#F2EFE9]">
            <h3 className="font-label-md text-label-md uppercase text-tertiary tracking-wider mb-lg">
              Con đường Vi chất Dinh dưỡng
            </h3>
            <div className="space-y-6">
              {/* Pathway Item */}
              <div className="group cursor-pointer">
                <div className="flex justify-between items-end mb-2">
                  <span className="font-body-lg text-body-lg text-on-surface font-medium flex items-center gap-2">
                    Canxi{" "}
                    <span className="material-symbols-outlined text-sm text-outline">
                      sync_alt
                    </span>{" "}
                    Vitamin D
                  </span>
                  <span className="font-label-sm text-label-sm text-secondary">
                    Tối ưu hóa
                  </span>
                </div>
                <div className="h-2 w-full bg-surface-variant rounded-full overflow-hidden">
                  <div className="h-full bg-secondary w-[85%] rounded-full group-hover:bg-secondary-container transition-colors duration-300"></div>
                </div>
              </div>

              {/* Pathway Item */}
              <div className="group cursor-pointer">
                <div className="flex justify-between items-end mb-2">
                  <span className="font-body-lg text-body-lg text-on-surface font-medium flex items-center gap-2">
                    Curcumin{" "}
                    <span className="material-symbols-outlined text-sm text-outline">
                      sync_alt
                    </span>{" "}
                    Piperine
                  </span>
                  <span className="font-label-sm text-label-sm text-primary">
                    Hoạt động cao
                  </span>
                </div>
                <div className="h-2 w-full bg-surface-variant rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[92%] rounded-full group-hover:bg-surface-tint transition-colors duration-300"></div>
                </div>
              </div>

              {/* Pathway Item */}
              <div className="group cursor-pointer">
                <div className="flex justify-between items-end mb-2">
                  <span className="font-body-lg text-body-lg text-on-surface font-medium flex items-center gap-2">
                    Kẽm{" "}
                    <span className="material-symbols-outlined text-sm text-outline">
                      sync_alt
                    </span>{" "}
                    Đồng
                  </span>
                  <span className="font-label-sm text-label-sm text-outline">
                    Cân bằng
                  </span>
                </div>
                <div className="h-2 w-full bg-surface-variant rounded-full overflow-hidden">
                  <div className="h-full bg-tertiary w-[60%] rounded-full group-hover:bg-tertiary-container transition-colors duration-300"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ingredient Spotlight (Image Section) */}
        <section className="mt-lg grid grid-cols-1 md:grid-cols-2 gap-md items-center bg-surface-container-low rounded-xl p-md md:p-lg border border-[#F2EFE9] shadow-soft">
          <div className="order-2 md:order-1">
            <span className="inline-block px-3 py-1 bg-tertiary-fixed/30 text-tertiary rounded-full font-label-sm text-label-sm mb-md">
              Tiêu điểm Nguyên liệu
            </span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-sm">
              Chất xúc tác Cam quýt
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-md">
              Các bữa ăn gần đây của bạn thường xuyên có vỏ chanh tươi. Axit
              ascorbic hiện diện hoạt động như một chất khử mạnh, chuyển đổi sắt
              non-heme từ các nguồn thực vật thành dạng mà cơ thể bạn có thể dễ
              dàng hấp thụ.
            </p>
          </div>
          <div className="order-1 md:order-2 rounded-lg overflow-hidden h-64 relative bg-surface-variant">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJMPOSGWq72c9-20uZoi70IrvP3BKwwu42i5dpzDAmxseluGiS7LXGCl59ucrfYdEQA48NAfCysrMWwbuJ6mDqV5GG3olcXMhMbcELNP3rOZbZVlQ5q4XpFmyGUDtMrZZiSPXBqYapU19Li9v18JJIqSJIEvNrkbPaN_NjE_BvBX-48pcZ3Dh8X5hgLnXpZ62Bpymt7dsEzRzxdknSUgsyiBLY03i2uhthkPlT_k3a6jt8sgZMgxz-i8H27FCTdzcF9r2kMww3kKWZ"
              alt="Fresh lemon and kale"
              fill
              className="object-cover opacity-90 mix-blend-multiply filter contrast-125"
            />
          </div>
        </section>
      </main>
    </div>
  );
}
