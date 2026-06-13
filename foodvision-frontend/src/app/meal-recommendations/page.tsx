"use client";

import Navigation from "@/components/Navigation";
import Image from "next/image";

export default function MealRecommendations() {
  return (
    <div className="bg-background text-on-background min-h-screen pb-[90px] md:pb-0">
      <Navigation />

      <main className="max-w-[1140px] mx-auto px-container-margin pt-16 md:pt-24 mb-xl">
        {/* Editorial Header */}
        <section className="mb-lg">
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg mb-xs">
            Dành riêng cho bạn
          </h1>
          <p className="font-body-lg text-body-lg text-outline max-w-[672px]">
            Khám phá các bữa ăn dinh dưỡng được điều chỉnh theo hồ sơ sinh trắc
            học và mục tiêu bền vững của bạn. Sự lựa chọn tinh tế cho một ngày
            trọn vẹn.
          </p>
        </section>

        {/* Category Chips */}
        <div className="flex gap-sm mb-lg overflow-x-auto hide-scrollbar pb-2">
          <button className="bg-primary-container text-on-primary-container px-4 py-2 rounded-full font-label-md text-label-md flex-shrink-0 transition-all hover:bg-primary-container/90">
            Tất cả công thức
          </button>
          <button className="bg-surface-container-low text-on-surface-variant px-4 py-2 rounded-full font-label-md text-label-md flex-shrink-0 transition-all hover:bg-surface-container-high border border-outline-variant/30">
            Nguồn gốc thực vật
          </button>
          <button className="bg-surface-container-low text-on-surface-variant px-4 py-2 rounded-full font-label-md text-label-md flex-shrink-0 transition-all hover:bg-surface-container-high border border-outline-variant/30">
            Giàu Protein
          </button>
          <button className="bg-surface-container-low text-on-surface-variant px-4 py-2 rounded-full font-label-md text-label-md flex-shrink-0 transition-all hover:bg-surface-container-high border border-outline-variant/30">
            Ít đường huyết
          </button>
          <button className="bg-surface-container-low text-on-surface-variant px-4 py-2 rounded-full font-label-md text-label-md flex-shrink-0 transition-all hover:bg-surface-container-high border border-outline-variant/30">
            Chuẩn bị nhanh
          </button>
        </div>

        {/* Recipe Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter md:gap-md">
          {/* Featured Card (Large) */}
          <div className="bento-card md:col-span-8 group relative bg-surface-container-lowest rounded-xl overflow-hidden shadow-tactile border border-[#F2EFE9] transition-all hover:shadow-[0_20px_40px_rgba(27,28,28,0.06)] flex flex-col">
            <div className="aspect-[16/9] relative overflow-hidden bg-surface-variant">
              <Image
                src="/images/dishes/canh_chua_khong_ca.jpg"
                alt="Canh chua không cá"
                fill
                className="object-cover transition-transform duration-[800ms] group-hover:scale-105 ease-[cubic-bezier(0.16,1,0.3,1)]"
              />
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-secondary-container/90 backdrop-blur-md text-on-secondary-container px-3 py-1 rounded-full font-label-sm text-label-sm uppercase tracking-wider shadow-sm">
                  Lựa chọn của Đầu bếp
                </span>
              </div>
            </div>
            <div className="p-md flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-base">
                <h2 className="font-headline-md text-headline-sm md:text-headline-md text-on-surface">
                  Canh chua không cá
                </h2>
                <button className="text-outline hover:text-secondary transition-colors">
                  <span className="material-symbols-outlined">bookmark</span>
                </button>
              </div>
              <div className="flex gap-md mb-md text-outline font-label-md text-label-md">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px]">
                    schedule
                  </span>{" "}
                  25 phút
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px]">
                    local_fire_department
                  </span>{" "}
                  480 kcal
                </span>
              </div>
              <div className="bg-surface-container-low p-4 rounded-lg mb-md flex-1">
                <p className="font-body-md text-body-md text-on-surface-variant italic">
                  <span className="font-bold text-primary mr-1">
                    Tại sao món này tốt cho bạn:
                  </span>
                  Giàu tinh bột phức hợp và các gia vị chống viêm giúp duy trì
                  năng lượng bền bỉ suốt buổi chiều.
                </p>
              </div>
              <div className="flex justify-between items-center pt-2">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-surface-container-lowest bg-tertiary-fixed flex items-center justify-center text-[10px] font-bold text-on-tertiary-fixed shadow-sm">
                    V
                  </div>
                  <div className="w-8 h-8 rounded-full border-2 border-surface-container-lowest bg-primary-fixed flex items-center justify-center text-[10px] font-bold text-on-primary-fixed shadow-sm">
                    GF
                  </div>
                </div>
                <button className="bg-primary text-on-primary px-6 py-3 rounded-full font-label-md text-label-md hover:bg-surface-tint transition-all active:scale-95 shadow-sm">
                  Nấu ngay
                </button>
              </div>
            </div>
          </div>

          {/* Side Card 1 */}
          <div className="bento-card md:col-span-4 group bg-surface-container-lowest rounded-xl overflow-hidden shadow-tactile border border-[#F2EFE9] transition-all hover:shadow-[0_20px_40px_rgba(27,28,28,0.06)] flex flex-col">
            <div className="aspect-square relative overflow-hidden bg-surface-variant">
              <Image
                src="/images/dishes/com_trang.jpg"
                alt="Cơm trắng"
                fill
                className="object-cover transition-transform duration-[800ms] group-hover:scale-105 ease-[cubic-bezier(0.16,1,0.3,1)]"
              />
            </div>
            <div className="p-md flex-1 flex flex-col">
              <h2 className="font-headline-sm text-headline-sm text-on-surface mb-base">
                Cơm trắng
              </h2>
              <div className="flex gap-4 mb-md text-outline font-label-md text-label-md">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px]">
                    schedule
                  </span>{" "}
                  15p
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px]">
                    local_fire_department
                  </span>{" "}
                  320 kcal
                </span>
              </div>
              <p className="text-on-surface-variant font-body-md text-body-md mb-md line-clamp-2 flex-1">
                Giàu Vitamin K và chất chống oxy hóa giúp tăng cường hệ miễn dịch.
              </p>
              <button className="w-full border border-primary text-primary px-6 py-2 rounded-full font-label-md text-label-md hover:bg-primary/5 transition-all">
                Xem chi tiết
              </button>
            </div>
          </div>

          {/* Grid Card 3 */}
          <div className="bento-card md:col-span-4 group bg-surface-container-lowest rounded-xl overflow-hidden shadow-tactile border border-[#F2EFE9] transition-all hover:shadow-[0_20px_40px_rgba(27,28,28,0.06)] flex flex-col">
            <div className="aspect-square relative overflow-hidden bg-surface-variant">
              <Image
                src="/images/dishes/dau_hu_sot_ca.jpg"
                alt="Đậu hũ sốt cà"
                fill
                className="object-cover transition-transform duration-[800ms] group-hover:scale-105 ease-[cubic-bezier(0.16,1,0.3,1)]"
              />
            </div>
            <div className="p-md flex-1 flex flex-col">
              <h2 className="font-headline-sm text-headline-sm text-on-surface mb-base">
                Đậu hũ sốt cà
              </h2>
              <div className="flex gap-4 mb-md text-outline font-label-md text-label-md">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px]">
                    schedule
                  </span>{" "}
                  20p
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px]">
                    local_fire_department
                  </span>{" "}
                  510 kcal
                </span>
              </div>
              <p className="text-on-surface-variant font-body-md text-body-md mb-md line-clamp-2 flex-1">
                Axit béo Omega-3 giúp tăng cường sức khỏe nhận thức và tim mạch.
              </p>
              <button className="w-full border border-primary text-primary px-6 py-2 rounded-full font-label-md text-label-md hover:bg-primary/5 transition-all">
                Xem chi tiết
              </button>
            </div>
          </div>

          {/* Grid Card 4 */}
          <div className="bento-card md:col-span-4 group bg-surface-container-lowest rounded-xl overflow-hidden shadow-tactile border border-[#F2EFE9] transition-all hover:shadow-[0_20px_40px_rgba(27,28,28,0.06)] flex flex-col">
            <div className="aspect-square relative overflow-hidden bg-surface-variant">
              <Image
                src="/images/dishes/rau_xao.jpg"
                alt="Rau xào"
                fill
                className="object-cover transition-transform duration-[800ms] group-hover:scale-105 ease-[cubic-bezier(0.16,1,0.3,1)]"
              />
            </div>
            <div className="p-md flex-1 flex flex-col">
              <h2 className="font-headline-sm text-headline-sm text-on-surface mb-base">
                Rau xào
              </h2>
              <div className="flex gap-4 mb-md text-outline font-label-md text-label-md">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px]">
                    schedule
                  </span>{" "}
                  10p
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px]">
                    local_fire_department
                  </span>{" "}
                  410 kcal
                </span>
              </div>
              <p className="text-on-surface-variant font-body-md text-body-md mb-md line-clamp-2 flex-1">
                Chất xơ thực vật giúp cải thiện tiêu hóa và sức khỏe trao đổi chất.
              </p>
              <button className="w-full border border-primary text-primary px-6 py-2 rounded-full font-label-md text-label-md hover:bg-primary/5 transition-all">
                Xem chi tiết
              </button>
            </div>
          </div>

          {/* Grid Card 5 */}
          <div className="bento-card md:col-span-4 group bg-surface-container-lowest rounded-xl overflow-hidden shadow-tactile border border-[#F2EFE9] transition-all hover:shadow-[0_20px_40px_rgba(27,28,28,0.06)] flex flex-col">
            <div className="aspect-square relative overflow-hidden bg-surface-variant">
              <Image
                src="/images/dishes/trung_chien.jpg"
                alt="Trứng chiên"
                fill
                className="object-cover transition-transform duration-[800ms] group-hover:scale-105 ease-[cubic-bezier(0.16,1,0.3,1)]"
              />
            </div>
            <div className="p-md flex-1 flex flex-col">
              <h2 className="font-headline-sm text-headline-sm text-on-surface mb-base">
                Trứng chiên
              </h2>
              <div className="flex gap-4 mb-md text-outline font-label-md text-label-md">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px]">
                    schedule
                  </span>{" "}
                  5p
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px]">
                    local_fire_department
                  </span>{" "}
                  220 kcal
                </span>
              </div>
              <p className="text-on-surface-variant font-body-md text-body-md mb-md line-clamp-2 flex-1">
                Cung cấp chất điện giải và chất béo lành mạnh giúp làn da rạng rỡ.
              </p>
              <button className="w-full border border-primary text-primary px-6 py-2 rounded-full font-label-md text-label-md hover:bg-primary/5 transition-all">
                Xem chi tiết
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
