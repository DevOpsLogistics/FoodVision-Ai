"use client";

import { useState } from "react";
import Navigation from "@/components/Navigation";
import { useRouter } from "next/navigation";

export default function SmartFridge() {
  const router = useRouter();
  const [isScanned, setIsScanned] = useState(false);
  const [isCookingMode, setIsCookingMode] = useState(false);

  const handleScan = () => {
    setIsScanned(true);
  };

  const startCooking = () => {
    setIsCookingMode(true);
  };

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen overflow-x-hidden">
      <Navigation />

      <main className="relative pt-24 min-h-[calc(100vh-6rem)] flex flex-col lg:flex-row overflow-hidden max-w-[1440px] mx-auto w-full px-4 md:px-6 gap-6 pb-24">
        {/* Camera / AR Viewfinder Section */}
        <div className="relative flex-1 flex flex-col min-w-0 h-[600px] lg:h-[800px]">
          <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.15)] border border-surface-variant/30 bg-[#242626]">
            
            {/* The Background Image (Fridge or Cutting Board) */}
            <div 
              className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ${isCookingMode ? 'scale-105' : 'scale-100'}`}
              style={{
                backgroundImage: isCookingMode 
                  ? "url('https://images.unsplash.com/photo-1556910103-1c02745a872e?auto=format&fit=crop&q=80&w=2070')" // Cutting board
                  : "url('https://images.unsplash.com/photo-1584286595398-a59f21d313f5?auto=format&fit=crop&q=80&w=2070')"  // Fridge inside
              }}
            >
              {/* Dark overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
            </div>

            {/* Scanning State (Initial) */}
            {!isScanned && !isCookingMode && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="relative w-64 h-64 md:w-96 md:h-96">
                  {/* Corner Brackets */}
                  <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-primary rounded-tl-xl opacity-80"></div>
                  <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-primary rounded-tr-xl opacity-80"></div>
                  <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-primary rounded-bl-xl opacity-80"></div>
                  <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-primary rounded-br-xl opacity-80"></div>
                  {/* Animated scanning line */}
                  <div className="scanning-line"></div>
                </div>
                <div className="absolute bottom-12 flex flex-col items-center gap-4">
                  <p className="text-white font-label-lg tracking-wider uppercase text-shadow">Hướng camera vào tủ lạnh</p>
                  <button onClick={handleScan} className="bg-primary hover:bg-primary-container text-white px-8 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(159,64,45,0.5)] active:scale-95 transition-all flex items-center gap-2">
                    <span className="material-symbols-outlined">qr_code_scanner</span>
                    Bắt đầu Quét
                  </button>
                </div>
              </div>
            )}

            {/* Scanned Results State (Detected Ingredients) */}
            {isScanned && !isCookingMode && (
              <>
                <div className="absolute top-6 left-6 bg-surface-container-lowest/80 backdrop-blur-md px-4 py-2 rounded-full border border-outline-variant/30 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="font-label-md text-on-surface">Đã nhận diện 6 nguyên liệu</span>
                </div>

                {/* AR Floating Labels */}
                <div className="absolute top-[30%] left-[20%] animate-float">
                  <div className="w-4 h-4 rounded-full border-2 border-white bg-primary/80 shadow-[0_0_15px_rgba(255,255,255,0.5)]"></div>
                  <div className="mt-2 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg border border-white/20 text-sm whitespace-nowrap">
                    Trứng gà (4 quả)
                  </div>
                </div>

                <div className="absolute top-[45%] right-[25%] animate-float" style={{ animationDelay: '0.5s' }}>
                  <div className="w-4 h-4 rounded-full border-2 border-white bg-tertiary/80 shadow-[0_0_15px_rgba(255,255,255,0.5)]"></div>
                  <div className="mt-2 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg border border-white/20 text-sm whitespace-nowrap">
                    Cà chua (3 quả)
                  </div>
                </div>

                <div className="absolute bottom-[35%] left-[35%] animate-float" style={{ animationDelay: '1s' }}>
                  <div className="w-4 h-4 rounded-full border-2 border-white bg-secondary/80 shadow-[0_0_15px_rgba(255,255,255,0.5)]"></div>
                  <div className="mt-2 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg border border-white/20 text-sm whitespace-nowrap">
                    Cải xanh (1 bó)
                  </div>
                </div>
              </>
            )}

            {/* AR Cooking Mode State */}
            {isCookingMode && (
              <>
                <div className="absolute top-6 right-6 bg-red-600/90 text-white px-4 py-2 rounded-full font-label-md shadow-[0_0_20px_rgba(220,38,38,0.6)] flex items-center gap-2 animate-pulse">
                  <span className="material-symbols-outlined text-[18px]">radio_button_checked</span>
                  AR Live
                </div>

                {/* AR Projection Graphics */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 pointer-events-none">
                  {/* Virtual cutting lines */}
                  <svg width="100%" height="100%" viewBox="0 0 100 100" className="opacity-80">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="4 4" className="animate-spin-slow" />
                    <circle cx="50" cy="50" r="30" fill="none" stroke="#bbcf7c" strokeWidth="2" strokeDasharray="5 5" />
                    <line x1="20" y1="50" x2="80" y2="50" stroke="#9f402d" strokeWidth="2" />
                    <line x1="50" y1="20" x2="50" y2="80" stroke="#9f402d" strokeWidth="2" />
                  </svg>
                  <div className="absolute top-[10%] right-[-10%] bg-surface-container-lowest/90 text-on-surface px-4 py-3 rounded-xl shadow-xl border-l-4 border-l-primary backdrop-blur-md">
                    <p className="font-label-md mb-1 text-primary">Bước 1: Sơ chế</p>
                    <p className="text-sm">Thái cà chua hạt lựu. Cắt đều tay.</p>
                  </div>
                </div>

                {/* Virtual floating timer */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 flex items-center gap-4 text-white">
                  <span className="material-symbols-outlined text-[24px] text-tertiary">timer</span>
                  <span className="font-headline-md font-mono tracking-wider">03:45</span>
                  <button className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Sidebar: AI Suggestions */}
        <aside className="w-full lg:w-[400px] flex flex-col gap-4">
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-soft border border-[#F2EFE9] h-full flex flex-col">
            <div className="flex items-center gap-3 mb-6 border-b border-surface-variant/30 pb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined">auto_awesome</span>
              </div>
              <div>
                <h2 className="font-headline-sm text-on-surface">Đầu bếp AI</h2>
                <p className="text-sm text-on-surface-variant">Sáng tạo từ nguyên liệu của bạn</p>
              </div>
            </div>

            {!isScanned ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-outline opacity-60">
                <span className="material-symbols-outlined text-[48px] mb-4">kitchen</span>
                <p>Hãy quét nguyên liệu trong tủ lạnh hoặc trên bàn bếp để nhận gợi ý món ăn ngay lập tức.</p>
              </div>
            ) : !isCookingMode ? (
              <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
                <p className="font-label-sm text-on-surface-variant uppercase tracking-widest mb-2">3 Công thức phù hợp</p>
                
                {/* Recipe 1 */}
                <div className="bg-surface-container-lowest border border-primary/30 rounded-xl p-4 hover:bg-primary/5 transition-colors cursor-pointer group" onClick={startCooking}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-title-md text-on-surface group-hover:text-primary transition-colors">Trứng sốt cà chua cay</h3>
                    <span className="bg-primary text-white text-[10px] px-2 py-1 rounded-full font-bold">LỰA CHỌN TỐT</span>
                  </div>
                  <p className="text-sm text-on-surface-variant mb-3 line-clamp-2">Sử dụng: Trứng gà, Cà chua, Hành tím. Giàu protein và Lycopene.</p>
                  <div className="flex items-center justify-between text-xs text-outline">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">schedule</span> 15 phút</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">local_fire_department</span> 320 kcal</span>
                  </div>
                </div>

                {/* Recipe 2 */}
                <div className="bg-surface-container-lowest border border-surface-variant/50 rounded-xl p-4 hover:border-surface-variant transition-colors cursor-pointer">
                  <h3 className="font-title-md text-on-surface mb-2">Canh cải xanh thịt băm</h3>
                  <p className="text-sm text-on-surface-variant mb-3 line-clamp-2">Sử dụng: Cải xanh. Thêm ít thịt (nếu có). Cung cấp nhiều chất xơ.</p>
                  <div className="flex items-center justify-between text-xs text-outline">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">schedule</span> 20 phút</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">local_fire_department</span> 150 kcal</span>
                  </div>
                </div>

              </div>
            ) : (
              <div className="flex-1 flex flex-col">
                <p className="font-label-sm text-primary uppercase tracking-widest mb-4">Trạng thái: Đang nấu AR</p>
                <div className="bg-primary-container/20 rounded-xl p-4 border border-primary-container/30 mb-6">
                  <h3 className="font-title-md text-on-surface mb-2">Trứng sốt cà chua</h3>
                  <div className="w-full bg-surface-variant h-2 rounded-full overflow-hidden">
                    <div className="bg-primary w-1/3 h-full rounded-full transition-all duration-1000"></div>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-2 text-right">Bước 1/3</p>
                </div>
                
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 opacity-50">
                    <span className="material-symbols-outlined text-primary">check_circle</span>
                    <p className="text-sm line-through decoration-2">Rửa sạch cà chua và thái lựu.</p>
                  </li>
                  <li className="flex items-start gap-3 bg-surface-container p-3 rounded-lg border-l-2 border-primary">
                    <span className="material-symbols-outlined text-outline animate-spin-slow">sync</span>
                    <div>
                      <p className="text-sm font-bold text-on-surface">Đánh trứng với gia vị.</p>
                      <p className="text-xs text-on-surface-variant mt-1">Dùng đũa đánh đều tay đến khi nổi bọt nhẹ.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 opacity-50">
                    <span className="material-symbols-outlined text-outline">radio_button_unchecked</span>
                    <p className="text-sm">Xào cà chua làm sốt, sau đó cho trứng vào.</p>
                  </li>
                </ul>

                <button onClick={() => setIsCookingMode(false)} className="mt-auto w-full py-3 text-red-500 font-label-md hover:bg-red-500/10 rounded-xl transition-colors">
                  Kết thúc nấu ăn
                </button>
              </div>
            )}
          </div>
        </aside>

      </main>

      <style jsx>{`
        .text-shadow {
          text-shadow: 0 2px 4px rgba(0,0,0,0.8);
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
