"use client";

import Navigation from "@/components/Navigation";
import { useRouter } from "next/navigation";

export default function ARVision() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col font-body-md text-body-md bg-surface-container-low">
      <Navigation />

      {/* Main Content Canvas */}
      <main className="flex-grow relative overflow-hidden bg-surface-container-low pt-16 pb-24 md:pb-8">
        {/* AR View Container */}
        <div className="absolute inset-0 w-full h-full">
          {/* Simulated Camera Feed / Meal Image */}
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDZm1Gz16m1iVW38DV4-Gwtuxzhtbc4zj5SQi2KYZMniEUHM3TQJGNjVlzSllZsGrWnJBzkpYJuOZ3KDThSjgB02b9-WLzY3bV-z9q7AGfstsEi1KEvY8zEGK9iHtcQmGvA3ZcbUKmZVzkjtlcejkthHuKpr83_BuyzaU9Kue2MVAZOQCtLihbIPyZtrwAEznZa54SIThrI0icrCviXVreDpxuZpoH85g__pEl5wyZZe7gPCs7sIDGlhoYq_yix_2N3-j3zrCCVnFLK')",
            }}
          ></div>

          {/* AR Overlay SVG */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            {/* Kale Marker */}
            <circle className="ar-marker-dot" cx="30" cy="40" r="1.5"></circle>
            <path className="ar-marker-line" d="M 30 40 L 20 20 L 10 20"></path>

            {/* Sweet Potato Marker */}
            <circle className="ar-marker-dot" cx="60" cy="60" r="1.5"></circle>
            <path className="ar-marker-line" d="M 60 60 L 70 80 L 85 80"></path>

            {/* Quinoa Marker */}
            <circle className="ar-marker-dot" cx="50" cy="30" r="1.5"></circle>
            <path className="ar-marker-line" d="M 50 30 L 60 15 L 75 15"></path>
          </svg>

          {/* AR Labels (Absolute positioned to match SVG lines approximately) */}
          <div className="absolute top-[18%] left-[5%] bg-tertiary-fixed text-on-tertiary-fixed-variant px-3 py-1 rounded-full font-label-sm text-label-sm shadow-sm border border-outline-variant/30 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">eco</span>{" "}
            Cải xoăn tươi
          </div>
          <div className="absolute top-[13%] right-[10%] bg-tertiary-fixed text-on-tertiary-fixed-variant px-3 py-1 rounded-full font-label-sm text-label-sm shadow-sm border border-outline-variant/30 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">grain</span>{" "}
            Hạt diêm mạch hữu cơ
          </div>
          <div className="absolute bottom-[18%] right-[5%] bg-tertiary-fixed text-on-tertiary-fixed-variant px-3 py-1 rounded-full font-label-sm text-label-sm shadow-sm border border-outline-variant/30 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">
              local_fire_department
            </span>{" "}
            Khoai lang nướng
          </div>
        </div>

        {/* Floating Insight Panels Container */}
        <div className="absolute inset-x-0 bottom-0 p-container-margin md:p-lg flex flex-col gap-md md:flex-row md:items-end z-10 pb-28 md:pb-lg">
          {/* Deep Nutrition Insight Card */}
          <div
            className="glass-panel rounded-xl p-md w-full md:w-1/2 lg:w-1/3 shadow-[0_8px_30px_rgba(27,28,28,0.06)] transform transition-transform hover:scale-[1.01] duration-300 cursor-pointer"
            onClick={() => router.push("/diary")}
          >
            <div className="flex items-center justify-between mb-sm">
              <h2 className="font-headline-sm text-headline-sm-mobile md:text-headline-sm text-on-surface">
                Thông tin Dinh dưỡng Chuyên sâu
              </h2>
              <span
                className="material-symbols-outlined text-primary text-[24px]"
              >
                auto_awesome
              </span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant mb-md">
              Bát ngũ cốc dinh dưỡng với Hạt diêm mạch & Rau nướng
            </p>

            <div className="space-y-sm">
              {/* Bio-Response */}
              <div className="bg-surface-bright/80 rounded-lg p-sm border border-surface-variant flex items-start gap-sm">
                <div className="bg-primary-container text-on-primary-container p-2 rounded-full flex-shrink-0">
                  <span className="material-symbols-outlined text-[20px]">
                    monitor_heart
                  </span>
                </div>
                <div>
                  <h3 className="font-label-md text-label-md text-on-surface">
                    Dự đoán Phản ứng Sinh học
                  </h3>
                  <p className="font-body-sm text-[12px] leading-[16px] text-on-surface-variant mt-1">
                    Rất tốt cho cơ thể bạn. Dự kiến giải phóng lượng đường ổn
                    định; tăng 15% năng lượng bền vững trong 3 giờ.
                  </p>
                </div>
              </div>

              {/* Sustainability */}
              <div className="bg-surface-bright/80 rounded-lg p-sm border border-surface-variant flex items-start gap-sm">
                <div className="bg-tertiary-container text-on-tertiary-container p-2 rounded-full flex-shrink-0">
                  <span className="material-symbols-outlined text-[20px]">
                    public
                  </span>
                </div>
                <div>
                  <h3 className="font-label-md text-label-md text-on-surface">
                    Điểm Bền vững
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-2 w-24 bg-surface-variant rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-[85%]"></div>
                    </div>
                    <span className="font-label-sm text-label-sm text-primary">
                      Cao (Ít Carbon)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Kitchen Assistant Bubble */}
          <div className="glass-panel rounded-xl p-sm md:p-md w-full md:w-auto md:max-w-[380px] ml-auto flex items-start gap-sm shadow-[0_4px_20px_rgba(27,28,28,0.05)] border-l-4 border-l-secondary-container">
            <div className="bg-secondary-container text-on-secondary-container p-2 rounded-full flex-shrink-0 mt-1">
              <span className="material-symbols-outlined text-[20px]">
                tips_and_updates
              </span>
            </div>
            <div>
              <h4 className="font-label-md text-label-md text-on-surface mb-1">
                Trợ lý Bếp
              </h4>
              <p className="font-body-md text-body-md text-on-surface-variant italic">
                "Hãy cân nhắc vắt thêm chút nước cốt chanh. Vitamin C sẽ làm
                tăng đáng kể khả năng hấp thụ sắt từ cải xoăn."
              </p>
            </div>
          </div>
        </div>

        {/* Scanning Reticle (Center) */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-64 h-64 border-2 border-primary/40 rounded-xl relative">
            {/* Corners */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary rounded-br-lg"></div>
          </div>
        </div>
      </main>
    </div>
  );
}
