"use client";

import { useState } from "react";
import Navigation from "@/components/Navigation";
import { useRouter } from "next/navigation";

export default function Scanner() {
  const [isFlashing, setIsFlashing] = useState(false);
  const router = useRouter();

  const handleCapture = () => {
    setIsFlashing(true);
    setTimeout(() => {
      setIsFlashing(false);
      // Simulate navigate to detection result
      router.push("/detection-result");
    }, 500);
  };

  return (
    <div className="bg-gradient-to-br from-[#2c2f2f] to-[#181a1a] text-on-background font-body-md min-h-screen overflow-x-hidden">
      <Navigation />

      {/* Main Content Layout */}
      <main className="relative pt-24 h-screen flex flex-col lg:flex-row overflow-hidden max-w-7xl mx-auto w-full">
        {/* Camera Viewfinder Section */}
        <div className="relative flex-1 flex flex-col min-w-0">
          <div className="relative flex-1 m-4 md:m-8 rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-surface-variant/30 bg-[#242626]/80">
            {/* Logo in Scanner */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none hidden md:block">
              <img src="/logo.png" alt="Logo" className="h-8 md:h-10 opacity-90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
            </div>
            
            {/* Scanning Overlay Layer */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              {/* Corner Brackets */}
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-[1.5px] border-l-[1.5px] border-primary rounded-tl-lg"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-[1.5px] border-r-[1.5px] border-primary rounded-tr-lg"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-[1.5px] border-l-[1.5px] border-primary rounded-bl-lg"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-[1.5px] border-r-[1.5px] border-primary rounded-br-lg"></div>
                <div className="scanning-line"></div>
              </div>
              
              {/* Floating Labels */}
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 mt-8">
                <div className="bg-surface-container-lowest/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-tertiary-fixed-dim/50 shadow-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  <p className="font-label-md text-label-md text-on-surface uppercase tracking-widest">Sẵn sàng</p>
                </div>
              </div>
              

            </div>
            
            {/* Exposure/Photography Tools Overlay */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-20 pointer-events-auto">
              <button className="group relative w-10 h-10 rounded-full bg-surface-container-lowest/20 backdrop-blur-xl flex items-center justify-center text-white border border-white/30 hover:bg-white/30 transition-all">
                <span className="material-symbols-outlined text-[20px]">center_focus_weak</span>
                <div className="absolute right-14 bg-surface-container-lowest text-on-surface text-[10px] font-medium px-2 py-1 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Chế độ Macro</div>
              </button>
              <button className="group relative w-10 h-10 rounded-full bg-surface-container-lowest/20 backdrop-blur-xl flex items-center justify-center text-white border border-white/30 hover:bg-white/30 transition-all">
                <span className="material-symbols-outlined text-[20px]">blur_on</span>
                <div className="absolute right-14 bg-surface-container-lowest text-on-surface text-[10px] font-medium px-2 py-1 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Quang phổ đồ</div>
              </button>
              <button className="w-10 h-10 rounded-full bg-surface-container-lowest/20 backdrop-blur-xl flex items-center justify-center text-white border border-white/30 hover:bg-white/30 transition-all">
                <span className="material-symbols-outlined text-[20px]">flash_off</span>
              </button>
              <button className="w-10 h-10 rounded-full bg-surface-container-lowest/20 backdrop-blur-xl flex items-center justify-center text-white border border-white/30 hover:bg-white/30 transition-all">
                <span className="material-symbols-outlined text-[20px]">hdr_on</span>
              </button>
              <div className="h-20 w-[2px] bg-white/20 mx-auto rounded-full relative mt-2">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg"></div>
              </div>
            </div>
            

          </div>
          
          {/* Bottom Action Area */}
          <div className="px-container-margin pb-24 lg:pb-8 pt-2 flex flex-col items-center gap-4 shrink-0">
            <div className="text-center space-y-1">
              <p className="font-headline-sm text-headline-sm-mobile md:text-headline-sm text-on-surface">Nhận diện Nguyên liệu</p>
              <p className="font-body-md text-body-md text-on-surface-variant mx-auto" style={{ maxWidth: '320px' }}>Tập trung vào giữa đĩa thức ăn để có được thông tin dinh dưỡng chính xác nhất.</p>
            </div>
            {/* Large Sage Action Button */}
            <button onClick={handleCapture} className="group relative flex items-center justify-center w-20 h-20 bg-primary hover:bg-primary-container text-white rounded-full shadow-xl transition-all duration-300 active:scale-90">
              <div className="absolute inset-0 rounded-full border-2 border-primary group-hover:scale-110 transition-transform duration-300 opacity-30"></div>
              <span className="material-symbols-outlined text-[32px]">photo_camera</span>
            </button>
          </div>
        </div>
        
        {/* Real-time Bio-Feedback Sidebar (Desktop/Tablet) */}
        <aside className="hidden lg:flex flex-col w-80 xl:w-96 bg-surface-container-lowest border-l border-surface-variant p-6 gap-8 overflow-y-auto shrink-0 h-full">
          <div>
            <h2 className="font-headline-sm text-on-surface mb-1">Phân tích Tác động</h2>
            <p className="text-sm text-on-surface-variant">Dự đoán sinh lý theo thời gian thực dựa trên kết quả quét.</p>
          </div>
          
          {/* Glucose Curve */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-label-md text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-tertiary">show_chart</span>
                Đường huyết Dự đoán
              </h3>
              <span className="text-[10px] bg-surface-variant px-2 py-0.5 rounded text-on-surface-variant">Trong 2 giờ</span>
            </div>
            <div className="h-32 bg-surface rounded-xl border border-outline-variant/30 relative overflow-hidden flex items-end p-4">
              {/* Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-20">
                <div className="w-full h-px bg-outline"></div>
                <div className="w-full h-px bg-outline"></div>
                <div className="w-full h-px bg-outline"></div>
              </div>
              {/* Mock Curve */}
              <svg className="w-full h-full stroke-tertiary fill-none stroke-[3px] z-10" preserveAspectRatio="none" viewBox="0 0 100 40">
                <path d="M0,38 Q20,38 35,15 T60,25 T100,32" strokeLinecap="round"></path>
              </svg>
              {/* Ideal Range Highlight */}
              <div className="absolute inset-y-1/4 inset-x-0 bg-primary/5 z-0"></div>
            </div>
            <div className="bg-surface-container-low p-3 rounded-lg flex items-start gap-3">
              <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">check_circle</span>
              <div>
                <p className="text-sm font-medium text-on-surface">Ổn định Tốt</p>
                <p className="text-xs text-on-surface-variant mt-0.5">Hàm lượng đạm và chất xơ cao sẽ ngăn ngừa đường huyết tăng đột biến.</p>
              </div>
            </div>
          </div>
          
          {/* Energy Window */}
          <div className="space-y-3">
            <h3 className="font-label-md text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-secondary">bolt</span>
              Năng lượng Duy trì
            </h3>
            <div className="bg-surface rounded-xl border border-outline-variant/30 p-5 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-container/10 mb-2">
                <span className="font-headline-md text-primary">3.5</span>
              </div>
              <p className="text-sm font-medium text-on-surface">Giờ Năng lượng Tối ưu</p>
              <p className="text-xs text-on-surface-variant mt-1 px-4">Phức hợp tiêu hóa chậm từ chất béo cá hồi và chất xơ măng tây.</p>
            </div>
          </div>
          
          {/* Macro Summary (Mini) */}
          <div className="space-y-3">
            <h3 className="font-label-md text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-primary">pie_chart</span>
              Thành phần Ước tính
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-16 text-xs text-on-surface-variant">Đạm</div>
                <div className="flex-1 h-2 bg-surface-variant rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: '45%' }}></div>
                </div>
                <div className="w-8 text-xs text-right font-medium text-on-surface">45%</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-16 text-xs text-on-surface-variant">Chất béo</div>
                <div className="flex-1 h-2 bg-surface-variant rounded-full overflow-hidden">
                  <div className="h-full bg-tertiary" style={{ width: '35%' }}></div>
                </div>
                <div className="w-8 text-xs text-right font-medium text-on-surface">35%</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-16 text-xs text-on-surface-variant">Tinh bột</div>
                <div className="flex-1 h-2 bg-surface-variant rounded-full overflow-hidden">
                  <div className="h-full bg-secondary-container" style={{ width: '20%' }}></div>
                </div>
                <div className="w-8 text-xs text-right font-medium text-on-surface">20%</div>
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* Flash Effect Layer */}
      {isFlashing && (
        <div className="fixed inset-0 bg-white z-[100] transition-opacity duration-500 pointer-events-none opacity-100"></div>
      )}
    </div>
  );
}
