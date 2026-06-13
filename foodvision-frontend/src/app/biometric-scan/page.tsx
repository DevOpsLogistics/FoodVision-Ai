"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { useRouter } from "next/navigation";

export default function BiometricScan() {
  const router = useRouter();
  const [scanStatus, setScanStatus] = useState<"idle" | "scanning" | "analyzing" | "completed">("idle");
  const [progress, setProgress] = useState(0);

  // Simulated live data
  const [heartRate, setHeartRate] = useState(0);
  const [stressLevel, setStressLevel] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (scanStatus === "scanning" || scanStatus === "analyzing") {
      // Simulate changing heart rate and stress
      interval = setInterval(() => {
        setHeartRate(Math.floor(Math.random() * (85 - 75 + 1) + 75));
        setStressLevel(Math.floor(Math.random() * (65 - 55 + 1) + 55));
      }, 500);

      // Progress bar logic
      if (progress < 100) {
        setTimeout(() => setProgress(prev => Math.min(prev + 2, 100)), 100);
      } else if (progress === 100 && scanStatus === "scanning") {
        setScanStatus("analyzing");
        setTimeout(() => setScanStatus("completed"), 2000);
      }
    }

    return () => clearInterval(interval);
  }, [scanStatus, progress]);

  const startScan = () => {
    setScanStatus("scanning");
    setProgress(0);
  };

  return (
    <div className="bg-[#0f1115] text-on-background font-body-md min-h-screen overflow-x-hidden">
      <Navigation />

      <main className="relative pt-24 min-h-[calc(100vh-6rem)] flex flex-col lg:flex-row overflow-hidden max-w-[1440px] mx-auto w-full px-4 md:px-6 gap-6 pb-24">
        
        {/* Face Scanner UI */}
        <div className="relative flex-1 flex flex-col min-w-0 h-[600px] lg:h-[800px] bg-[#1a1d24] rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
          
          {/* Simulated Webcam Feed */}
          <div className="absolute inset-0 bg-cover bg-center opacity-80"
               style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=1288')" }}>
            <div className="absolute inset-0 bg-black/40"></div>
          </div>

          {/* Header Info */}
          <div className="absolute top-6 left-0 right-0 px-8 flex justify-between items-center z-10">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-red-500">vital_signs</span>
              <span className="text-white font-label-lg tracking-wider">FOODVISION r-PPG SCAN</span>
            </div>
            {scanStatus === "scanning" && (
              <div className="flex items-center gap-2 bg-red-500/20 text-red-500 px-4 py-1.5 rounded-full border border-red-500/50 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                <span className="text-sm font-bold uppercase tracking-wider">Live</span>
              </div>
            )}
          </div>

          {/* Central Face Mesh / Reticle */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {scanStatus === "idle" ? (
              <div className="w-64 h-80 border-2 border-dashed border-white/50 rounded-[40%] flex items-center justify-center">
                <p className="text-white/60 text-sm tracking-widest uppercase">Đưa khuôn mặt vào khung</p>
              </div>
            ) : (
              <div className="relative w-72 h-96">
                {/* SVG Face Mesh Simulation */}
                <svg viewBox="0 0 100 130" className="w-full h-full opacity-60">
                  <path d="M 50 10 C 20 10 10 40 10 60 C 10 90 30 120 50 120 C 70 120 90 90 90 60 C 90 40 80 10 50 10 Z" fill="none" stroke="#4ade80" strokeWidth="0.5" strokeDasharray="2 2" className="animate-spin-slow" />
                  <path d="M 30 50 Q 50 70 70 50" fill="none" stroke="#4ade80" strokeWidth="0.5" />
                  <line x1="50" y1="10" x2="50" y2="120" stroke="#4ade80" strokeWidth="0.2" />
                  <line x1="10" y1="60" x2="90" y2="60" stroke="#4ade80" strokeWidth="0.2" />
                  {/* Glowing dots at key facial points */}
                  <circle cx="35" cy="55" r="1.5" fill="#4ade80" className="animate-pulse" />
                  <circle cx="65" cy="55" r="1.5" fill="#4ade80" className="animate-pulse" />
                  <circle cx="50" cy="80" r="1.5" fill="#4ade80" className="animate-pulse" />
                </svg>
                {/* Scanning Laser Line */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-green-400 shadow-[0_0_15px_#4ade80] scanning-laser"></div>
              </div>
            )}
          </div>

          {/* Live Data Overlays */}
          {scanStatus !== "idle" && (
            <>
              <div className="absolute top-1/4 right-8 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-4 w-40 text-white transform translate-x-0 transition-transform duration-500">
                <p className="text-xs text-white/60 uppercase tracking-widest mb-1">Nhịp tim</p>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-light">{heartRate}</span>
                  <span className="text-sm mb-1 text-red-400">BPM</span>
                </div>
                {/* Mini chart simulation */}
                <svg width="100%" height="20" className="mt-2" preserveAspectRatio="none">
                  <polyline points="0,10 10,10 15,2 20,18 25,10 40,10" fill="none" stroke="#f87171" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
              </div>

              <div className="absolute bottom-1/4 left-8 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-4 w-40 text-white">
                <p className="text-xs text-white/60 uppercase tracking-widest mb-1">Căng thẳng</p>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-light">{stressLevel}</span>
                  <span className="text-sm mb-1 text-orange-400">/100</span>
                </div>
                <div className="w-full bg-white/20 h-1.5 mt-3 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-400 to-orange-500" style={{ width: `${stressLevel}%` }}></div>
                </div>
              </div>
            </>
          )}

          {/* Status / Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-[#1a1d24] to-transparent flex flex-col items-center">
            {scanStatus === "idle" ? (
              <button onClick={startScan} className="bg-primary hover:bg-primary-container text-white px-10 py-4 rounded-full font-bold tracking-wide transition-transform active:scale-95 shadow-[0_10px_30px_rgba(159,64,45,0.4)]">
                Bắt đầu Quét Sinh Trắc
              </button>
            ) : scanStatus !== "completed" ? (
              <div className="w-full max-w-md">
                <div className="flex justify-between text-sm text-white/80 mb-2 font-mono">
                  <span>{scanStatus === "scanning" ? "ĐANG PHÂN TÍCH r-PPG..." : "ĐANG TỔNG HỢP KẾT QUẢ..."}</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-green-400 shadow-[0_0_10px_#4ade80] transition-all duration-100 ease-out" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Results / Mood-based Nutrition Panel */}
        <aside className={`w-full lg:w-[450px] flex flex-col gap-4 transition-all duration-700 transform ${scanStatus === "completed" ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0 pointer-events-none"}`}>
          <div className="bg-[#1a1d24] rounded-2xl p-6 shadow-2xl border border-white/10 h-full flex flex-col text-white">
            
            <div className="flex items-center justify-center gap-3 mb-6 pb-6 border-b border-white/10">
              <span className="material-symbols-outlined text-[32px] text-green-400">check_circle</span>
              <h2 className="text-xl font-bold tracking-wider">PHÂN TÍCH HOÀN TẤT</h2>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                <span className="material-symbols-outlined text-red-400 mb-2">favorite</span>
                <p className="text-xs text-white/60 uppercase tracking-widest mb-1">Nhịp tim TB</p>
                <p className="text-2xl font-light">{heartRate} <span className="text-sm">BPM</span></p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                <span className="material-symbols-outlined text-orange-400 mb-2">psychology</span>
                <p className="text-xs text-white/60 uppercase tracking-widest mb-1">Căng thẳng</p>
                <p className="text-2xl font-light">{stressLevel} <span className="text-sm">Mức Khá</span></p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm text-white/60 uppercase tracking-widest mb-2">Chẩn đoán AI</p>
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                <p className="text-orange-300 font-medium mb-1">Phát hiện dấu hiệu mệt mỏi & stress nhẹ</p>
                <p className="text-sm text-white/70">Nhịp tim hơi cao và sắc mặt cho thấy bạn có thể đang thiếu ngủ hoặc căng thẳng công việc. Cần bổ sung Magie và Tryptophan.</p>
              </div>
            </div>

            <div className="flex-1">
              <p className="text-sm text-green-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">restaurant</span>
                Thực đơn chữa lành đề xuất
              </p>
              
              <div className="flex flex-col gap-3">
                <div className="bg-white/5 hover:bg-white/10 transition-colors border border-white/10 rounded-xl p-4 flex gap-4 cursor-pointer">
                  <div className="w-16 h-16 rounded-lg bg-cover bg-center shrink-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400')" }}></div>
                  <div>
                    <h3 className="font-bold text-white mb-1">Salad Bơ Trứng Cá Hồi</h3>
                    <p className="text-xs text-white/60 mb-2 line-clamp-1">Giàu Omega-3 & Magie giúp giảm hormone cortisol.</p>
                    <span className="text-xs bg-green-400/20 text-green-400 px-2 py-0.5 rounded-full">+ Hỗ trợ giấc ngủ</span>
                  </div>
                </div>

                <div className="bg-white/5 hover:bg-white/10 transition-colors border border-white/10 rounded-xl p-4 flex gap-4 cursor-pointer">
                  <div className="w-16 h-16 rounded-lg bg-cover bg-center shrink-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=400')" }}></div>
                  <div>
                    <h3 className="font-bold text-white mb-1">Trà Hoa Cúc Mật Ong</h3>
                    <p className="text-xs text-white/60 mb-2 line-clamp-1">Chứa apigenin làm dịu hệ thần kinh trung ương.</p>
                    <span className="text-xs bg-blue-400/20 text-blue-400 px-2 py-0.5 rounded-full">+ Giảm căng thẳng</span>
                  </div>
                </div>
              </div>
            </div>

            <button onClick={() => setScanStatus("idle")} className="w-full mt-6 py-3 border border-white/20 text-white/80 font-label-md hover:bg-white/5 rounded-xl transition-colors uppercase tracking-widest">
              Quét lại
            </button>

          </div>
        </aside>

      </main>

      <style jsx>{`
        .scanning-laser {
          animation: laser-scan 3s ease-in-out infinite alternate;
        }
        @keyframes laser-scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(384px); } /* h-96 is 384px */
        }
        .animate-spin-slow {
          animation: spin 10s linear infinite;
          transform-origin: 50px 65px;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
