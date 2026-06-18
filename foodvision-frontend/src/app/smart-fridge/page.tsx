"use client";

import { useEffect, useRef, useState } from "react";
import Navigation from "@/components/Navigation";

export default function SmartFridge() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;

    async function initCamera() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError("Trình duyệt không hỗ trợ camera.");
        return;
      }

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setCameraReady(true);
        }
      } catch {
        setCameraError("Không thể mở camera. Hãy cấp quyền truy cập.");
      }
    }

    initCamera();

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const handleScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 2500);
  };

  return (
    <div className="bg-gradient-to-br from-[#2c2f2f] to-[#181a1a] text-on-background font-body-md min-h-screen overflow-x-hidden">
      <Navigation />

      <main className="relative pt-28 md:pt-32 max-w-3xl mx-auto w-full px-4 md:px-6 pb-28">
        {/* Camera viewfinder */}
        <div className="relative w-full aspect-[4/5] max-h-[min(70vh,640px)] rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-surface-variant/30 bg-[#242626] mt-4 md:mt-6 mb-6">
          {cameraReady ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#2c2f2f] to-[#181a1a]" />
          )}

          <div className="absolute inset-0 bg-black/20 pointer-events-none" />

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative w-[min(72vw,320px)] aspect-square">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary rounded-br-lg" />
              <div className="scanning-line" />
            </div>
          </div>

          <div className="absolute top-4 left-0 right-0 flex justify-center pointer-events-none">
            <div className="bg-surface-container-lowest/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-tertiary-fixed-dim/50 shadow-sm flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  isScanning
                    ? "bg-amber-400 animate-pulse"
                    : cameraReady
                      ? "bg-green-400"
                      : "bg-primary"
                }`}
              />
              <span className="font-label-md text-label-md text-on-surface uppercase tracking-widest whitespace-nowrap">
                {isScanning
                  ? "Đang quét..."
                  : cameraReady
                    ? "Sẵn sàng"
                    : "Chờ camera"}
              </span>
            </div>
          </div>

          {cameraError && (
            <p className="absolute bottom-4 left-4 right-4 text-white/70 text-sm text-center pointer-events-none">
              {cameraError}
            </p>
          )}
        </div>

        {/* Instructions + action */}
        <section className="w-full text-center mb-8">
          <h1 className="font-headline-sm text-headline-sm text-white mb-2">
            Quét nguyên liệu tủ lạnh
          </h1>
          <p className="font-body-md text-white/60 leading-relaxed mb-6">
            Hướng camera vào bên trong tủ lạnh hoặc mặt bàn bếp có nguyên liệu.
          </p>
          <button
            type="button"
            onClick={handleScan}
            disabled={isScanning}
            className="border border-white/40 text-white/90 bg-transparent hover:bg-white/10 px-8 py-3 rounded-full font-label-md transition-all active:scale-95 disabled:opacity-60"
          >
            {isScanning ? "Đang quét..." : "Bắt đầu quét"}
          </button>
        </section>

        {/* AI sidebar — full width below */}
        <aside className="w-full bg-surface-container-lowest rounded-2xl p-6 shadow-soft border border-[#F2EFE9]">
          <div className="border-b border-surface-variant/30 pb-4 mb-4">
            <h2 className="font-headline-sm text-on-surface">Đầu bếp AI</h2>
            <p className="text-sm text-on-surface-variant mt-1">
              Gợi ý món từ nguyên liệu còn lại
            </p>
          </div>
          <p className="font-body-md text-on-surface-variant leading-relaxed text-center py-4">
            {isScanning
              ? "Đang phân tích nguyên liệu..."
              : "Quét xong, danh sách nguyên liệu và gợi ý công thức sẽ hiện ở đây."}
          </p>
        </aside>
      </main>
    </div>
  );
}
