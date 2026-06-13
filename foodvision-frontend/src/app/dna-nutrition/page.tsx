"use client";

import { useState, useRef } from "react";
import Navigation from "@/components/Navigation";
import { useRouter } from "next/navigation";
import dynamic from 'next/dynamic';

const DNA3D = dynamic(() => import('@/components/DNA3D'), { ssr: false });

export default function DNANutrition() {
  const router = useRouter();
  const [activeDnaCode, setActiveDnaCode] = useState("FV-DNA-8924X");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAnalyze = () => {
    if (inputRef.current && inputRef.current.value.trim() !== "") {
      setActiveDnaCode(inputRef.current.value);
    }
  };

  // Simulated genetic traits
  const geneticTraits = [
    { name: "Độ nhạy Caffein", status: "Cao", description: "Cơ thể chuyển hóa caffein chậm. Nên tránh uống cafe sau 2h chiều.", color: "text-on-surface", bg: "bg-surface-variant" },
    { name: "Phân giải Lactose", status: "Kém", description: "Nguy cơ cao bất dung nạp lactose. Ưu tiên sữa hạt hoặc sữa free-lactose.", color: "text-on-surface", bg: "bg-surface-variant" },
    { name: "Nhu cầu Vitamin D", status: "Cao", description: "Gen VDR biến thể khiến bạn cần nhiều Vitamin D hơn người bình thường.", color: "text-on-surface", bg: "bg-surface-variant" },
    { name: "Hấp thụ Tinh bột", status: "Bình thường", description: "Khả năng chuyển hóa carb tốt. Có thể duy trì tỷ lệ carb 45-50%.", color: "text-on-surface", bg: "bg-surface-variant" },
  ];

  // Simulated food matching
  const foodMatches = [
    { name: "Canh chua có cá", matchScore: 98, reason: "Cá cung cấp lượng lớn Vitamin D bù đắp cho gen VDR biến thể. Cực kỳ phù hợp với cơ địa của bạn.", image: "/images/canh_chua_co_ca.jpg" },
    { name: "Đậu hũ sốt cà", matchScore: 88, reason: "Nguồn đạm thực vật an toàn, không chứa lactose, thân thiện với hệ vi sinh ruột đang thiếu Bifidobacterium.", image: "/images/dau_hu_sot_ca.jpg" },
    { name: "Sườn nướng", matchScore: 45, reason: "Cơ địa Endomorph có quá trình trao đổi chất chậm. Nên hạn chế sườn nướng nhiều mỡ để tránh tích tụ mỡ thừa.", image: "/images/suon_nuong.jpg" },
  ];

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen overflow-x-hidden">
      <Navigation />

      <main className="relative pt-24 min-h-[calc(100vh-6rem)] max-w-[1440px] mx-auto w-full px-4 md:px-6 gap-6 pb-24">
        
        <div className="mt-8 mb-10 text-left">
          <div className="inline-flex items-center gap-2 bg-surface-variant text-on-surface px-4 py-1.5 rounded-full mb-4">
            <span className="font-label-md uppercase tracking-wider">Precision Nutrition</span>
          </div>
          <h1 className="font-display-md text-on-surface mb-2">Hồ sơ Dinh dưỡng Gen (DNA)</h1>
          <p className="text-on-surface-variant font-body-lg max-w-2xl">
            Hệ thống phân tích bộ gen và hệ vi sinh vật đường ruột để đưa ra thực đơn cá nhân hóa tuyệt đối, dành riêng cho cơ địa của bạn.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* DNA Animation & Profile Summary */}
          <div className="w-full lg:w-[400px] flex flex-col gap-6">
            {/* DNA Input & 3D Viewer */}
            <div className="bg-surface-container rounded-3xl overflow-hidden border border-surface-variant/30 flex flex-col">
              
              {/* 3D DNA Strand Animation */}
              <div className="relative h-[320px] w-full bg-transparent">
                <DNA3D dnaCode={activeDnaCode} />
              </div>
              
              {/* DNA Input */}
              <div className="p-6 bg-surface-container border-t border-surface-variant/30 text-center relative z-20 shadow-lg">
                <label className="block text-on-surface-variant font-label-sm tracking-widest uppercase mb-3">Mã định danh Gen (DNA Code)</label>
                <div className="flex gap-2">
                  <input 
                    ref={inputRef}
                    type="text" 
                    defaultValue="FV-DNA-8924X"
                    className="flex-1 min-w-0 bg-surface-variant text-on-surface px-4 py-2.5 rounded-xl border border-surface-variant/50 focus:outline-none focus:border-on-surface/50 text-center font-mono font-bold uppercase tracking-wider text-sm" 
                    placeholder="Nhập mã Gen..." 
                    onKeyDown={(e) => { if (e.key === 'Enter') handleAnalyze(); }}
                  />
                  <button 
                    onClick={handleAnalyze}
                    className="bg-on-surface text-surface px-4 py-2.5 rounded-xl font-label-md hover:opacity-90 transition-opacity whitespace-nowrap text-sm"
                  >
                    Phân tích
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-surface-container rounded-3xl p-6 border border-surface-variant/30">
              <h3 className="font-title-md mb-4 flex items-center gap-2">
                Tổng quan sinh học
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-on-surface-variant text-sm">Kiểu trao đổi chất</span>
                  <span className="font-label-md bg-surface-variant px-3 py-1 rounded-lg">Endomorph</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-on-surface-variant text-sm">Hệ vi sinh ruột</span>
                  <span className="font-label-md bg-surface-variant px-3 py-1 rounded-lg">Thiếu Bifidobacterium</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-on-surface-variant text-sm">Chỉ số viêm (hs-CRP)</span>
                  <span className="font-label-md bg-surface-variant text-on-surface px-3 py-1 rounded-lg">Thấp (Tốt)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Traits and Match Scoring */}
          <div className="flex-1 flex flex-col gap-8">
            
            {/* Traits Grid */}
            <section>
              <h2 className="font-headline-sm mb-4 flex items-center gap-2">
                Đặc điểm di truyền nổi bật
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {geneticTraits.map((trait, index) => (
                  <div key={index} className="bg-surface-container-lowest border border-surface-variant/40 rounded-2xl p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-end mb-3">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${trait.bg} ${trait.color}`}>
                        {trait.status}
                      </span>
                    </div>
                    <h3 className="font-title-md text-on-surface mb-1">{trait.name}</h3>
                    <p className="text-sm text-on-surface-variant leading-relaxed">{trait.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Food Matching Based on DNA */}
            <section className="mt-4">
              <h2 className="font-headline-sm mb-4 flex items-center gap-2">
                Độ khớp thực phẩm theo DNA
              </h2>
              <div className="flex flex-col gap-4">
                {foodMatches.map((food, index) => (
                  <div key={index} className="bg-surface-container-lowest border border-surface-variant/40 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-center">
                    <img src={food.image} alt={food.name} className="w-20 h-20 rounded-xl object-cover" />
                    
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="font-title-md text-on-surface">{food.name}</h3>
                      <p className="text-sm text-on-surface-variant mt-1">{food.reason}</p>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center shrink-0 w-24">
                      {/* Circular Progress for Score */}
                      <div className="relative w-16 h-16 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="6" className="text-surface-variant" />
                          <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="6" strokeDasharray="175.93" strokeDashoffset={175.93 - (175.93 * food.matchScore) / 100} className={`transition-all duration-1000 ${food.matchScore >= 80 ? "text-green-500" : food.matchScore >= 50 ? "text-amber-500" : "text-red-500"}`} />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                          <span className="font-bold text-lg leading-none">{food.matchScore}</span>
                          <span className="text-[10px] text-on-surface-variant leading-none">%</span>
                        </div>
                      </div>
                      <span className="text-xs font-label-sm mt-1 uppercase tracking-wider text-on-surface-variant">Độ khớp</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </div>

      </main>

      <style jsx>{`
      `}</style>
    </div>
  );
}
