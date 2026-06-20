"use client";

import { useEffect, useRef, useState } from "react";
import { EditorialCard, PageHeader, PageShell, PrimaryButton } from "@/components/PageLayout";
import {
  acquireCamera,
  attachStreamToVideo,
  cameraErrorMessage,
  releaseCamera,
  waitForVideoFrame,
} from "@/lib/cameraStream";

export default function SmartFridge() {
  const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const sessionRef = useRef(0);

  useEffect(() => {
    return () => releaseCamera("smart-fridge");
  }, []);

  useEffect(() => {
    if (!videoEl) return;

    const session = ++sessionRef.current;
    let cancelled = false;
    setCameraReady(false);
    setCameraError(null);

    (async () => {
      try {
        const stream = await acquireCamera("smart-fridge");
        if (cancelled || session !== sessionRef.current) {
          stream.getTracks().forEach((t) => t.stop());
          releaseCamera("smart-fridge");
          return;
        }

        await attachStreamToVideo(videoEl, stream);
        const hasFrame = await waitForVideoFrame(videoEl);
        if (cancelled || session !== sessionRef.current) return;

        if (hasFrame) {
          setCameraReady(true);
        } else {
          throw new Error("no-frame");
        }
      } catch (err) {
        if (cancelled || session !== sessionRef.current) return;
        releaseCamera("smart-fridge");
        if (videoEl) videoEl.srcObject = null;
        setCameraError(cameraErrorMessage(err));
      }
    })();

    return () => {
      cancelled = true;
      sessionRef.current += 1;
      releaseCamera("smart-fridge");
      if (videoEl) videoEl.srcObject = null;
    };
  }, [videoEl]);

  const handleScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 2500);
  };

  return (
    <PageShell mainClassName="max-w-[720px]">
      <PageHeader
        eyebrow="Tủ lạnh thông minh"
        title="Quét nguyên liệu"
        description="Hướng camera vào bên trong tủ lạnh hoặc mặt bàn bếp có nguyên liệu."
      />

      <EditorialCard padding="p-0 overflow-hidden mb-lg aspect-[4/5] max-h-[min(60vh,520px)] relative bg-surface">
        <video
          ref={setVideoEl}
          autoPlay
          playsInline
          muted
          suppressHydrationWarning
          className="absolute inset-0 w-full h-full object-cover bg-surface-variant"
        />

        <div className="absolute inset-0 bg-black/15 pointer-events-none" />

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-[min(72vw,280px)] aspect-square">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary rounded-br-lg" />
            <div className="scanning-line" />
          </div>
        </div>

        <div className="absolute top-4 left-0 right-0 flex justify-center pointer-events-none">
          <div className="bg-surface-container-lowest/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#F2EFE9] shadow-sm flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                isScanning ? "bg-amber-400 animate-pulse" : cameraReady ? "bg-primary" : "bg-outline"
              }`}
            />
            <span className="font-label-md text-label-md text-on-surface uppercase tracking-widest whitespace-nowrap">
              {isScanning ? "Đang quét..." : cameraReady ? "Sẵn sàng" : "Chờ camera"}
            </span>
          </div>
        </div>

        {cameraError && (
          <p className="absolute bottom-4 left-4 right-4 text-on-surface-variant text-sm text-center pointer-events-none">
            {cameraError}
          </p>
        )}
      </EditorialCard>

      <PrimaryButton type="button" onClick={handleScan} disabled={isScanning} className="mb-lg">
        {isScanning ? "Đang quét..." : "Bắt đầu quét"}
      </PrimaryButton>

      <EditorialCard padding="p-lg">
        <h2 className="font-headline-sm text-headline-sm text-on-surface mb-1">Đầu bếp AI</h2>
        <p className="font-label-sm text-label-sm text-outline mb-md">Gợi ý món từ nguyên liệu còn lại</p>
        <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
          {isScanning
            ? "Đang phân tích nguyên liệu..."
            : "Quét xong, danh sách nguyên liệu và gợi ý công thức sẽ hiện ở đây."}
        </p>
      </EditorialCard>
    </PageShell>
  );
}
