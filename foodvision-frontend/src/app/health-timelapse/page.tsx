"use client";

import { useState } from "react";
import Navigation from "@/components/Navigation";
import { useRouter } from "next/navigation";

export default function HealthTimelapse() {
  const router = useRouter();
  const [timelineYears, setTimelineYears] = useState(0); // 0 to 10 years
  const [dietMode, setDietMode] = useState<"unhealthy" | "healthy">("healthy");

  // Images for simulation. In a real app, these would be AI-generated from the user's face.
  const baseImage = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800"; // Base face
  const healthyImage = "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800"; // Healthy, bright face
  const unhealthyImage = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800"; // Tired, aged face

  const currentOverlayImage = dietMode === "healthy" ? healthyImage : unhealthyImage;
  // Calculate opacity based on years (0 years = 0 opacity, 10 years = 1 opacity)
  const overlayOpacity = timelineYears / 10;

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen overflow-x-hidden">
      <Navigation />

      <main className="relative pt-24 min-h-[calc(100vh-6rem)] max-w-[1200px] mx-auto w-full px-4 md:px-6 pb-24 flex flex-col items-center">
        
        <div className="text-center mb-10">
          <h1 className="font-display-md text-primary mb-2">Cỗ Máy Thời Gian Sức Khỏe</h1>
          <p className="text-on-surface-variant max-w-2xl mx-auto">
            Dự đoán sự thay đổi của cơ thể và khuôn mặt bạn sau 10 năm dựa trên thói quen dinh dưỡng hàng ngày nhờ AI.
          </p>
        </div>

        <div className="w-full flex flex-col lg:flex-row gap-10 items-center justify-center">
          
          {/* Controls Panel */}
          <div className="w-full lg:w-[400px] bg-surface-container rounded-3xl p-8 shadow-soft border border-surface-variant/30 flex flex-col gap-8">
            
            {/* Diet Mode Switcher */}
            <div>
              <p className="font-label-lg mb-4 text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined">restaurant_menu</span>
                Mô phỏng chế độ ăn
              </p>
              <div className="flex bg-surface-variant/50 p-1 rounded-xl">
                <button 
                  onClick={() => setDietMode("healthy")}
                  className={`flex-1 py-3 rounded-lg font-label-md transition-all ${dietMode === "healthy" ? "bg-white shadow-sm text-green-600" : "text-on-surface-variant hover:bg-white/50"}`}
                >
                  Dinh dưỡng FoodVision
                </button>
                <button 
                  onClick={() => setDietMode("unhealthy")}
                  className={`flex-1 py-3 rounded-lg font-label-md transition-all ${dietMode === "unhealthy" ? "bg-white shadow-sm text-red-500" : "text-on-surface-variant hover:bg-white/50"}`}
                >
                  Thức ăn nhanh / Đường
                </button>
              </div>
            </div>

            {/* Effects Explanation */}
            <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30">
              <h3 className="font-title-md mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">info</span>
                Tác động dài hạn
              </h3>
              {dietMode === "healthy" ? (
                <ul className="space-y-2 text-sm text-on-surface-variant">
                  <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span> Collagen được bảo vệ, da sáng và săn chắc.</li>
                  <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span> Duy trì tỷ lệ mỡ cơ thể ở mức lý tưởng.</li>
                  <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span> Giảm thiểu nếp nhăn và quầng thâm mắt.</li>
                </ul>
              ) : (
                <ul className="space-y-2 text-sm text-on-surface-variant">
                  <li className="flex items-start gap-2"><span className="text-red-500 font-bold">✕</span> Quá trình Glycation phá hủy Collagen gây chảy xệ.</li>
                  <li className="flex items-start gap-2"><span className="text-red-500 font-bold">✕</span> Tích tụ mỡ nội tạng và mỡ mặt.</li>
                  <li className="flex items-start gap-2"><span className="text-red-500 font-bold">✕</span> Da sạm màu, xuất hiện bọng mắt do thiếu ngủ & stress.</li>
                </ul>
              )}
            </div>

            {/* AI Warning/Praise */}
            {dietMode === "healthy" && timelineYears > 5 && (
              <div className="bg-green-50 border border-green-200 p-4 rounded-xl text-green-800 text-sm flex gap-3 items-start animate-fade-in">
                <span className="material-symbols-outlined">auto_awesome</span>
                <p>Tuyệt vời! Chế độ ăn giàu chất chống oxy hóa giúp bạn trẻ hơn so với tuổi thật của mình trong tương lai.</p>
              </div>
            )}
            {dietMode === "unhealthy" && timelineYears > 5 && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-red-800 text-sm flex gap-3 items-start animate-fade-in">
                <span className="material-symbols-outlined">warning</span>
                <p>Cảnh báo AI: Lượng đường cao sẽ đẩy nhanh tốc độ lão hóa tế bào lên 150%. Bạn nên điều chỉnh sớm!</p>
              </div>
            )}
          </div>

          {/* Visualization Area */}
          <div className="flex-1 w-full max-w-[500px] flex flex-col items-center">
            
            {/* The Image Overlay (Digital Twin) */}
            <div className="relative w-full aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl border-4 border-white mb-8 group bg-surface-variant">
              
              {/* Base Image (Year 0) */}
              <img src={baseImage} alt="Base" className="absolute inset-0 w-full h-full object-cover" />
              
              {/* Overlay Image (Aged or Healthy) */}
              <img 
                src={currentOverlayImage} 
                alt="Future" 
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                style={{ opacity: overlayOpacity }}
              />

              {/* Scanning effect just for sci-fi feel */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ backgroundSize: "100% 200%", animation: "scan 3s linear infinite" }}></div>

              <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm font-label-md">
                + {timelineYears} năm
              </div>
            </div>

            {/* Timeline Slider */}
            <div className="w-full bg-surface-container p-6 rounded-3xl border border-surface-variant/30 shadow-sm">
              <div className="flex justify-between text-label-md text-on-surface-variant mb-4">
                <span>Hiện tại</span>
                <span className="font-bold text-primary">Tương lai (+10 năm)</span>
              </div>
              
              <div className="relative w-full h-12 flex items-center">
                <input 
                  type="range" 
                  min="0" 
                  max="10" 
                  step="1"
                  value={timelineYears}
                  onChange={(e) => setTimelineYears(parseInt(e.target.value))}
                  className="w-full z-10 opacity-0 cursor-pointer h-full"
                />
                
                {/* Custom Track */}
                <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-3 bg-surface-variant rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${dietMode === "healthy" ? "bg-green-400" : "bg-red-400"}`}
                    style={{ width: `${(timelineYears / 10) * 100}%` }}
                  ></div>
                </div>

                {/* Custom Thumb */}
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-md border-2 border-primary flex items-center justify-center transition-all duration-300 pointer-events-none"
                  style={{ left: `calc(${(timelineYears / 10) * 100}% - 16px)` }}
                >
                  <div className={`w-3 h-3 rounded-full ${dietMode === "healthy" ? "bg-green-500" : "bg-red-500"}`}></div>
                </div>
              </div>
              
              <div className="flex justify-center mt-4">
                <p className="text-sm font-medium text-on-surface bg-surface-variant px-4 py-1.5 rounded-full">
                  Kéo thanh trượt để xem sự thay đổi
                </p>
              </div>
            </div>

          </div>
        </div>

      </main>

      <style jsx>{`
        @keyframes scan {
          0% { background-position: 0 -100%; }
          100% { background-position: 0 200%; }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
