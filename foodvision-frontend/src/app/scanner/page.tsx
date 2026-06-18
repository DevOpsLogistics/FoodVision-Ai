"use client";

import { useEffect, useRef, useState } from "react";
import Navigation from "@/components/Navigation";
import { useRouter } from "next/navigation";
import { ApiError, scanApi } from "@/lib/api";
import Link from "next/link";

const TRAY_LABELS: Record<string, string> = {
  "school-v": "Khay V trường học",
  "tray-32": "Khay 3+2",
  "tray-23": "Khay 2+3",
  "tray-32u": "Khay 3+2 ngang",
};

export default function Scanner() {
  const [isFlashing, setIsFlashing] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const [cameraReady, setCameraReady] = useState(false);
  const [trayType, setTrayType] = useState("school-v");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const router = useRouter();

  useEffect(() => {
    const saved = sessionStorage.getItem("foodvision_tray_type");
    if (saved) setTrayType(saved);
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        if (!active) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setCameraReady(true);
        }
      } catch {
        setError("Không mở được camera. Hãy cấp quyền truy cập.");
      }
    })();
    return () => {
      active = false;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const captureFrame = (): Blob | null => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0) return null;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    sessionStorage.setItem("last_scan_image", dataUrl);
    const byteString = atob(dataUrl.split(",")[1]);
    const arr = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) arr[i] = byteString.charCodeAt(i);
    return new Blob([arr], { type: "image/jpeg" });
  };

  const handleCapture = async () => {
    if (scanning) return;
    setError("");
    setIsFlashing(true);
    setScanning(true);
    try {
      const blob = captureFrame();
      if (!blob) throw new Error("Không chụp được ảnh");
      const result = await scanApi.upload(blob, trayType);
      sessionStorage.setItem("last_scan_result", JSON.stringify(result));
      setTimeout(() => {
        setIsFlashing(false);
        router.push("/detection-result");
      }, 400);
    } catch (err) {
      setIsFlashing(false);
      setScanning(false);
      const msg = err instanceof ApiError ? err.message : "Quét thất bại. Vui lòng thử lại.";
      setError(msg);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setScanning(true);
    setError("");
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        sessionStorage.setItem("last_scan_image", reader.result as string);
        try {
          const result = await scanApi.upload(file, trayType);
          sessionStorage.setItem("last_scan_result", JSON.stringify(result));
          router.push("/detection-result");
        } catch (err) {
          setError("Quét thất bại. Vui lòng thử lại.");
          setScanning(false);
        }
      };
      reader.readAsDataURL(file);
    } catch {
      setScanning(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#2c2f2f] to-[#181a1a] text-on-background font-body-md min-h-screen overflow-x-hidden">
      <Navigation />

      <main className="relative pt-24 h-screen flex flex-col lg:flex-row overflow-hidden max-w-7xl mx-auto w-full">
        <div className="relative flex-1 flex flex-col min-w-0">
          <div className="relative flex-1 m-4 md:m-8 rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-surface-variant/30 bg-[#242626]/80">
            <video
              ref={videoRef}
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />
            {!cameraReady && !error && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
                Đang mở camera...
              </div>
            )}

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-[1.5px] border-l-[1.5px] border-primary rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-[1.5px] border-r-[1.5px] border-primary rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-[1.5px] border-l-[1.5px] border-primary rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-[1.5px] border-r-[1.5px] border-primary rounded-br-lg" />
                <div className="scanning-line" />
              </div>
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 mt-8">
                <div className="bg-surface-container-lowest/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-tertiary-fixed-dim/50 shadow-sm flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${cameraReady ? "bg-primary animate-pulse" : "bg-outline"}`} />
                  <p className="font-label-md text-label-md text-on-surface uppercase tracking-widest">
                    {scanning ? "Đang phân tích..." : cameraReady ? "Sẵn sàng" : "Chờ camera"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="px-container-margin pb-24 lg:pb-8 pt-2 flex flex-col items-center gap-4 shrink-0">
            <Link
              href="/scanner/select-tray"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-sm text-white hover:bg-white/20"
            >
              <span className="material-symbols-outlined text-base">grid_view</span>
              {TRAY_LABELS[trayType] || "Chọn loại khay"}
            </Link>
            {error && <p className="text-red-400 text-sm text-center max-w-[20rem]">{error}</p>}
            <div className="text-center space-y-1">
              <p className="font-headline-sm text-headline-sm-mobile md:text-headline-sm text-on-surface">Nhận diện Món ăn</p>
              <p className="font-body-md text-body-md text-on-surface-variant mx-auto" style={{ maxWidth: "320px" }}>
                Tập trung vào giữa đĩa thức ăn để có thông tin dinh dưỡng chính xác nhất.
              </p>
            </div>
            <div className="flex items-center gap-6">
              <label className="cursor-pointer w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <span className="material-symbols-outlined text-white">photo_library</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={scanning} />
              </label>
              <button
                onClick={handleCapture}
                disabled={!cameraReady || scanning}
                className="group relative flex items-center justify-center w-20 h-20 bg-primary hover:bg-primary-container text-white rounded-full shadow-xl transition-all duration-300 active:scale-90 disabled:opacity-50"
              >
                <div className="absolute inset-0 rounded-full border-2 border-primary group-hover:scale-110 transition-transform duration-300 opacity-30" />
                <span className="material-symbols-outlined text-[32px]">photo_camera</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {isFlashing && (
        <div className="fixed inset-0 bg-white z-[100] transition-opacity duration-500 pointer-events-none opacity-100" />
      )}
    </div>
  );
}
