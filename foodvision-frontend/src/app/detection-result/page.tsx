"use client";

import { useState } from "react";
import Navigation from "@/components/Navigation";
import { useRouter } from "next/navigation";

export default function DetectionResult() {
  const router = useRouter();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const getBoxStyle = (index: number, baseStyle: React.CSSProperties) => {
    if (hoveredIndex === index) {
      return {
        ...baseStyle,
        borderColor: "#9f402d",
        transform: "scale(1.02)",
      };
    }
    return baseStyle;
  };

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen">
      <Navigation />

      <main className="max-w-[1140px] mx-auto px-container-margin py-lg pt-24">
        <div className="flex flex-col lg:flex-row gap-lg">
          {/* Left: Scanned Image View */}
          <div className="flex-1 relative group">
            <div className="rounded-xl overflow-hidden shadow-[0_20px_30px_rgba(27,28,28,0.06)] bg-white aspect-[4/5] md:aspect-square lg:aspect-auto h-full min-h-[400px]">
              <div className="relative w-full h-full">
                <img
                  alt="Thịt kho"
                  className="w-full h-full object-cover"
                  src="/images/dishes/thit_kho.jpg"
                />

                {/* AI Detection Overlay Boxes */}
                <div
                  className="detection-box"
                  style={getBoxStyle(0, {
                    top: "25%",
                    left: "15%",
                    width: "40%",
                    height: "50%",
                  })}
                >
                  <span className="detection-label font-label-sm text-label-sm">
                    Thịt lợn
                  </span>
                </div>
                <div
                  className="detection-box"
                  style={getBoxStyle(1, {
                    top: "35%",
                    left: "55%",
                    width: "30%",
                    height: "35%",
                  })}
                >
                  <span className="detection-label font-label-sm text-label-sm">
                    Nước màu
                  </span>
                </div>
                <div
                  className="detection-box"
                  style={getBoxStyle(2, {
                    top: "65%",
                    left: "30%",
                    width: "25%",
                    height: "20%",
                  })}
                >
                  <span className="detection-label font-label-sm text-label-sm">
                    Gia vị
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-md flex justify-between items-center">
              <p className="font-label-md text-label-md text-outline">
                Nhận diện 3 thành phần trong 0.8 giây
              </p>
              <button
                onClick={() => router.push("/scanner")}
                className="flex items-center gap-xs font-label-md text-label-md text-primary hover:text-secondary-container transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">
                  refresh
                </span>
                Quét lại
              </button>
            </div>
          </div>

          {/* Right: Nutritional Breakdown & Details */}
          <div className="w-full lg:w-[400px] flex flex-col gap-md">
            {/* Main Info Card */}
            <section className="bg-white p-md rounded-xl shadow-[0_20px_30px_rgba(27,28,28,0.04)] border border-[#F2EFE9]">
              <div className="mb-lg">
                <h1 className="font-headline-md text-headline-md text-on-surface mb-xs">
                  Kết quả nhận diện
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Chúng tôi đã nhận diện các thành phần bữa sáng của bạn.
                </p>
              </div>

              {/* Macro Breakdown Chips */}
              <div className="flex flex-wrap gap-sm mb-lg">
                <div className="bg-secondary/10 px-4 py-2 rounded-full border border-secondary/20">
                  <span className="font-label-sm text-label-sm text-secondary">
                    385 Calo
                  </span>
                </div>
                <div className="bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
                  <span className="font-label-sm text-label-sm text-primary">
                    18g Đạm
                  </span>
                </div>
                <div className="bg-tertiary/10 px-4 py-2 rounded-full border border-tertiary/20">
                  <span className="font-label-sm text-label-sm text-tertiary">
                    22g Chất béo
                  </span>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-md border-t border-[#F2EFE9] pt-md">
                <div
                  className="flex justify-between items-center transition-colors hover:bg-surface-container-lowest p-2 -mx-2 rounded-lg cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(0)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div>
                    <p className="font-label-md text-label-md text-on-surface">
                      Bơ (Nửa quả)
                    </p>
                    <p className="font-label-sm text-label-sm text-outline">
                      160 kcal • 15g Chất béo
                    </p>
                  </div>
                  <button className="material-symbols-outlined text-outline hover:text-primary transition-colors">
                    edit
                  </button>
                </div>

                <div
                  className="flex justify-between items-center transition-colors hover:bg-surface-container-lowest p-2 -mx-2 rounded-lg cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(1)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div>
                    <p className="font-label-md text-label-md text-on-surface">
                      Trứng chần (Quả lớn)
                    </p>
                    <p className="font-label-sm text-label-sm text-outline">
                      72 kcal • 6g Đạm
                    </p>
                  </div>
                  <button className="material-symbols-outlined text-outline hover:text-primary transition-colors">
                    edit
                  </button>
                </div>

                <div
                  className="flex justify-between items-center transition-colors hover:bg-surface-container-lowest p-2 -mx-2 rounded-lg cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(2)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div>
                    <p className="font-label-md text-label-md text-on-surface">
                      Rau mầm
                    </p>
                    <p className="font-label-sm text-label-sm text-outline">
                      15 kcal • 2g Chất xơ
                    </p>
                  </div>
                  <button className="material-symbols-outlined text-outline hover:text-primary transition-colors">
                    edit
                  </button>
                </div>
              </div>
            </section>

            {/* Action Buttons */}
            <div className="flex flex-col gap-sm">
              <button
                onClick={() => router.push("/ar-vision")}
                className="w-full bg-primary text-white py-4 rounded-xl font-label-md text-label-md shadow-lg active:scale-[0.98] transition-all hover:bg-primary-container"
              >
                Lưu bữa ăn
              </button>
              <button className="w-full bg-white border border-outline-variant text-on-surface-variant py-4 rounded-xl font-label-md text-label-md hover:bg-surface-container-low transition-colors">
                Chỉnh sửa
              </button>
            </div>

            {/* Insights Bento Piece */}
            <div className="bg-[#FAF9F6] p-md rounded-xl border-b-2 border-primary/20 mt-4">
              <div className="flex items-center gap-base mb-sm">
                <span className="material-symbols-outlined text-primary text-[20px]">
                  auto_awesome
                </span>
                <h3 className="font-label-md text-label-md font-bold uppercase tracking-wider text-primary">
                  Thông tin chi tiết
                </h3>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Phát hiện hàm lượng chất béo tốt cao. Bữa ăn này sẽ cung cấp năng lượng duy trì sự tập trung trong khoảng 4 giờ. Hoàn hảo cho bữa sáng của bạn.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
