"use client";

import Navigation from "@/components/Navigation";
import Image from "next/image";

export default function FarmToTable() {
  return (
    <div className="bg-background text-on-background min-h-screen pb-[90px] md:pb-0">
      <Navigation />

      {/* Main Content Canvas */}
      <main className="max-w-[1140px] mx-auto px-container-margin md:mt-lg mb-xl pt-16 md:pt-4">
        {/* Context Header / Breadcrumb */}
        <div className="mb-lg pt-md">
          <div className="flex items-center gap-xs text-on-surface-variant mb-xs">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-outline">
              Bản quét Bữa ăn #4812
            </span>
            <span className="material-symbols-outlined text-[16px] text-outline-variant">
              chevron_right
            </span>
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary">
              Nguồn gốc Nguyên liệu
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-md">
            <div>
              <h1 className="font-headline-md text-headline-md text-on-background mb-xs">
                Hạt diêm mạch hữu cơ
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-[672px]">
                Bắt nguồn từ vùng cao nguyên Andes. Đã được chứng nhận hữu cơ,
                thương mại công bằng và canh tác tái sinh.
              </p>
            </div>
            <div className="flex items-center gap-sm">
              <div className="flex flex-col items-end">
                <span className="font-label-sm text-label-sm text-outline uppercase tracking-wide">
                  Độ tin cậy
                </span>
                <span className="font-body-lg text-body-lg text-primary font-bold">
                  99.8%
                </span>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary-container">
                <span
                  className="material-symbols-outlined"
                  data-weight="fill"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bento Grid Layout for Traceability Data */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-md md:gap-lg">
          {/* Left Column: The Journey Map (Spans 8 cols on desktop) */}
          <div className="md:col-span-8 flex flex-col gap-md">
            {/* Map / Hero Visual */}
            <div className="relative w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-tactile border border-surface-variant/50">
              {/* Map placeholder image */}
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAV0gYNohcPbTzvsm5FSO2gtjg4shryNNWT183uU8JRSkquTRFeZvnklSSDaExJCAxrulwhdDTBqtIOIYQXu06xgHgmmrm6RFUPl2Nf9HnSTBwD0gZoTgW7EPfVKbo456nnzd4XFfaDIjkcMIcdBSvOp-LSs9mkIP-HwmGfPC8LCb07F7DC1WORGXUrRvZJFWp7v9-FP1hou3YxLv3gv1KFTOgB9LdNKc3xgA0pLItT7h2FebT902kq5KuizbQ2bwDwSBNraaUQTnvp"
                alt="Satellite view of Andean highlands"
                fill
                className="object-cover"
              />
              {/* Overlay Map Markers (Simulated) */}
              <div className="absolute inset-0 bg-gradient-to-t from-on-background/40 to-transparent"></div>
              <div className="absolute bottom-md left-md right-md flex items-end justify-between">
                <div className="bg-surface-container-lowest/90 backdrop-blur-sm px-sm py-xs rounded-lg border border-surface-variant flex items-center gap-xs">
                  <span className="material-symbols-outlined text-secondary text-[18px]">
                    location_on
                  </span>
                  <div>
                    <p className="font-label-sm text-label-sm text-on-surface">
                      Điểm xuất xứ
                    </p>
                    <p className="font-body-md text-body-md font-medium text-on-background">
                      Vùng Puno, Peru
                    </p>
                  </div>
                </div>
                <div className="bg-primary/90 backdrop-blur-sm px-sm py-xs rounded-lg flex items-center gap-xs text-on-primary shadow-lg">
                  <span className="material-symbols-outlined text-[18px]">
                    distance
                  </span>
                  <div>
                    <p className="font-label-sm text-label-sm text-primary-fixed opacity-80">
                      Quãng đường Vận chuyển
                    </p>
                    <p className="font-body-md text-body-md font-medium">
                      4,210 mi
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* The Timeline */}
            <div className="bg-surface-container-lowest rounded-xl p-md md:p-lg shadow-tactile border border-surface-variant/50">
              <h2 className="font-headline-sm text-headline-sm text-on-background mb-lg flex items-center gap-sm">
                <span className="material-symbols-outlined text-tertiary">
                  route
                </span>
                Hành trình Chuỗi Cung ứng
              </h2>
              <div className="relative">
                {/* Step 1: Farm */}
                <div className="timeline-item relative flex gap-md mb-lg">
                  <div className="timeline-line relative flex flex-col items-center z-10">
                    <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center border-4 border-surface-container-lowest shadow-sm z-10">
                      <span className="material-symbols-outlined text-primary text-[20px]">
                        agriculture
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 pt-1 pb-md">
                    <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider block mb-xs">
                      Bước 01 • Thu hoạch
                    </span>
                    <h3 className="font-body-lg text-body-lg font-medium text-on-background mb-xs">
                      Hợp tác xã Valle Sagrado
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-sm">
                      Thu hoạch thủ công theo phương pháp truyền thống để giữ
                      gìn tính toàn vẹn của đất và chất lượng hạt.
                    </p>
                    <div className="flex flex-wrap gap-xs">
                      <span className="px-xs py-[2px] bg-tertiary-fixed/30 text-tertiary text-label-sm font-label-sm rounded-full border border-tertiary-fixed">
                        12 Thg 10, 2023
                      </span>
                      <span className="px-xs py-[2px] bg-secondary-fixed/30 text-secondary text-label-sm font-label-sm rounded-full border border-secondary-fixed">
                        Lô #Q-882
                      </span>
                    </div>
                  </div>
                </div>

                {/* Step 2: Processing */}
                <div className="timeline-item relative flex gap-md mb-lg">
                  <div className="timeline-line relative flex flex-col items-center z-10">
                    <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center border-4 border-surface-container-lowest shadow-sm z-10">
                      <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
                        factory
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 pt-1 pb-md">
                    <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider block mb-xs">
                      Bước 02 • Sơ chế & Xay xát
                    </span>
                    <h3 className="font-body-lg text-body-lg font-medium text-on-background mb-xs">
                      Cơ sở Andean Naturals
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-sm">
                      Loại bỏ saponin qua phương pháp ma sát khô tiết kiệm
                      nước, tiếp theo là phân loại quang học.
                    </p>
                    <span className="px-xs py-[2px] bg-surface-variant text-on-surface-variant text-label-sm font-label-sm rounded-full border border-outline-variant inline-block">
                      05 Thg 11, 2023
                    </span>
                  </div>
                </div>

                {/* Step 3: Distribution */}
                <div className="timeline-item relative flex gap-md mb-lg">
                  <div className="timeline-line relative flex flex-col items-center z-10">
                    <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center border-4 border-surface-container-lowest shadow-sm z-10">
                      <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
                        local_shipping
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 pt-1 pb-md">
                    <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider block mb-xs">
                      Bước 03 • Vận chuyển
                    </span>
                    <h3 className="font-body-lg text-body-lg font-medium text-on-background mb-xs">
                      Vận tải biển đến Cảng LA
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-sm">
                      Vận chuyển qua các đối tác bù trừ carbon để giảm thiểu tác
                      động môi trường.
                    </p>
                    <span className="px-xs py-[2px] bg-surface-variant text-on-surface-variant text-label-sm font-label-sm rounded-full border border-outline-variant inline-block">
                      14 Thg 12, 2023
                    </span>
                  </div>
                </div>

                {/* Step 4: Retail/Plate */}
                <div className="timeline-item relative flex gap-md">
                  <div className="timeline-line relative flex flex-col items-center z-10">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center border-4 border-surface-container-lowest shadow-sm z-10">
                      <span className="material-symbols-outlined text-on-primary text-[20px]">
                        restaurant
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 pt-1">
                    <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider block mb-xs">
                      Bước 04 • Đĩa ăn của bạn
                    </span>
                    <h3 className="font-body-lg text-body-lg font-medium text-on-background mb-xs">
                      Mua tại Chợ Địa phương
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Được quét hôm nay trong bữa ăn của bạn.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Grower Profile & Metrics (Spans 4 cols on desktop) */}
          <div className="md:col-span-4 flex flex-col gap-md">
            {/* Grower Profile Card */}
            <div className="bg-surface-container-lowest rounded-xl shadow-tactile border border-surface-variant/50 overflow-hidden flex flex-col h-full">
              <div className="h-48 relative">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuASz6xOySxuST677cF2DJx9r-ys8xJ1V_mAQUk-i52bfmCpYb361RvUeZfPZ5gkkn5YoJpNEvkBbRZxbY95o9BN6irjcMLPqPttMZFwyi2jMQFw2S3Lpc9looyaVXHvNQ-d1bpJ84kMgkHgLAa5xuDdSA0SxPPyRPPf21LZJeeumtUgbsrkHMkDUZHhDYMjEUgPYEoyn_ULu1tXxLt-9QdXIh0sfsRJAsbuhhaYY1tYOTKIajPTSxSRUw9JK-EyxaTswL4GbgXrx9gb"
                  alt="Portrait of farmer"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-md bg-gradient-to-t from-on-background/80 to-transparent">
                  <span className="font-label-sm text-label-sm text-primary-fixed uppercase tracking-wider block mb-xs drop-shadow-md">
                    Người Nông dân
                  </span>
                  <h3 className="font-headline-sm text-headline-sm text-on-primary drop-shadow-md">
                    Nông trại Gia đình Mamani
                  </h3>
                </div>
              </div>
              <div className="p-md flex-1 flex flex-col justify-between">
                <div>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-md italic">
                    "Chúng tôi đã canh tác mảnh đất này qua năm thế hệ, tôn
                    trọng đất đai và thời tiết giống như tổ tiên của chúng tôi."
                  </p>
                  <div className="space-y-sm mb-md">
                    <div className="flex items-center gap-sm">
                      <span className="material-symbols-outlined text-outline text-[20px]">
                        eco
                      </span>
                      <span className="font-body-md text-body-md text-on-background">
                        Phương pháp Tái sinh
                      </span>
                    </div>
                    <div className="flex items-center gap-sm">
                      <span className="material-symbols-outlined text-outline text-[20px]">
                        groups
                      </span>
                      <span className="font-body-md text-body-md text-on-background">
                        Thành viên Hợp tác xã từ 1998
                      </span>
                    </div>
                    <div className="flex items-center gap-sm">
                      <span className="material-symbols-outlined text-outline text-[20px]">
                        water_drop
                      </span>
                      <span className="font-body-md text-body-md text-on-background">
                        Tưới tiêu nhờ nước mưa
                      </span>
                    </div>
                  </div>
                </div>

                {/* Certifications */}
                <div className="border-t border-surface-variant/50 pt-md mt-sm">
                  <h4 className="font-label-sm text-label-sm text-outline uppercase tracking-wider mb-sm">
                    Chứng nhận
                  </h4>
                  <div className="flex gap-sm">
                    <div
                      className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center border border-outline-variant/30"
                      title="USDA Organic"
                    >
                      <span className="font-headline-sm text-[10px] font-bold text-primary text-center leading-tight">
                        USDA
                        <br />
                        ORG
                      </span>
                    </div>
                    <div
                      className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center border border-outline-variant/30"
                      title="Fair Trade Certified"
                    >
                      <span className="font-headline-sm text-[10px] font-bold text-on-background text-center leading-tight">
                        FAIR
                        <br />
                        TRADE
                      </span>
                    </div>
                    <div
                      className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center border border-outline-variant/30"
                      title="Non-GMO Project Verified"
                    >
                      <span className="font-headline-sm text-[10px] font-bold text-secondary text-center leading-tight">
                        NON
                        <br />
                        GMO
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sustainability Metrics (Mini Bento) */}
            <div className="grid grid-cols-2 gap-md">
              {/* Carbon Footprint */}
              <div className="bg-surface-container-lowest rounded-xl p-md shadow-tactile border border-surface-variant/50 flex flex-col justify-center items-center text-center">
                <span className="material-symbols-outlined text-primary text-[28px] mb-xs">
                  co2
                </span>
                <h4 className="font-headline-md text-[24px] text-on-background font-bold mb-xs">
                  1.2
                  <span className="text-label-md text-on-surface-variant font-normal">
                    kg
                  </span>
                </h4>
                <p className="font-label-sm text-label-sm text-outline">
                  CO₂e mỗi kg
                </p>
                <div className="w-full bg-surface-variant h-1 mt-sm rounded-full overflow-hidden">
                  <div className="bg-primary w-[30%] h-full rounded-full"></div>
                </div>
                <p className="font-label-sm text-[10px] text-on-surface-variant mt-1">
                  Thấp hơn 70% so với trung bình
                </p>
              </div>

              {/* Water Usage */}
              <div className="bg-surface-container-lowest rounded-xl p-md shadow-tactile border border-surface-variant/50 flex flex-col justify-center items-center text-center">
                <span className="material-symbols-outlined text-[#4A90E2] text-[28px] mb-xs">
                  water
                </span>
                <h4 className="font-headline-md text-[24px] text-on-background font-bold mb-xs">
                  Thấp
                </h4>
                <p className="font-label-sm text-label-sm text-outline">
                  Tác động Nước
                </p>
                <p className="font-label-sm text-[10px] text-on-surface-variant mt-sm px-2">
                  100% chu kỳ cây trồng dựa vào nước mưa
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
