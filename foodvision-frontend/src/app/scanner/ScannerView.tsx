"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Navigation from "@/components/Navigation";
import { SectionDivider } from "@/components/PageLayout";
import { useRouter } from "next/navigation";
import { ApiError, mealsApi, paymentsApi, scanApi, ScanResult } from "@/lib/api";
import { prepareScanImage } from "@/lib/resizeImage";
import Link from "next/link";
import {
  acquireCamera,
  attachStreamToVideo,
  cameraErrorMessage,
  releaseCamera,
  waitForVideoFrame,
} from "@/lib/cameraStream";
import { TRAY_TYPES } from "./select-tray/page";
import { dishPrice } from "@/data/dishPrices";
import { formatPrice } from "@/data/mealRecommendations";

const TRAY_LABELS: Record<string, string> = Object.fromEntries(TRAY_TYPES.map((t) => [t.id, t.name]));

const SCAN_STEPS = [
  { icon: "center_focus_strong", title: "Căn khay vào giữa", desc: "Đặt khay cơm nằm gọn trong khung vuông." },
  { icon: "photo_camera", title: "Chụp hoặc tải ảnh", desc: "Bấm nút camera hoặc chọn ảnh từ thư viện." },
  { icon: "nutrition", title: "Xem kết quả ảnh cắt", desc: "Hệ thống tự cắt từng ngăn và ánh xạ qua giá tiền." },
] as const;

type CropResult = {
  index: number;
  className: string;
  displayName: string;
  confidence: number;
  calories: number;
  price: number;
  url: string;
};

function cropFromImage(
  img: HTMLImageElement,
  bbox: { x: number; y: number; w: number; h: number },
): string {
  const sx = Math.max(0, bbox.x * img.naturalWidth);
  const sy = Math.max(0, bbox.y * img.naturalHeight);
  const sw = Math.min(img.naturalWidth - sx, bbox.w * img.naturalWidth);
  const sh = Math.min(img.naturalHeight - sy, bbox.h * img.naturalHeight);
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(sw));
  canvas.height = Math.max(1, Math.round(sh));
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.85);
}

function momoQrImage(payUrl: string): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&data=${encodeURIComponent(payUrl)}`;
}

function buildCrops(scan: ScanResult, imageUrl: string): Promise<CropResult[]> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const crops = scan.items.map((item) => ({
        index: item.index,
        className: item.class_name,
        displayName:
          item.class_name === "thit_kho_trung"
            ? "Thịt kho trứng"
            : item.display_name,
        confidence: item.confidence <= 1 ? item.confidence * 100 : item.confidence,
        calories:
          item.class_name === "thit_kho_trung" ? 310 : item.calories,
        price: dishPrice(item.class_name),
        url: cropFromImage(img, item.bbox),
      }));
      resolve(crops);
    };
    img.onerror = () => resolve([]);
    img.src = imageUrl;
  });
}

export default function ScannerView() {
  const [isFlashing, setIsFlashing] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [trayType, setTrayType] = useState("school-v");
  const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [crops, setCrops] = useState<CropResult[]>([]);
  const [saving, setSaving] = useState(false);
  const [paying, setPaying] = useState(false);
  const [momoPay, setMomoPay] = useState<{
    orderId: string;
    amount: number;
    payUrl: string;
  } | null>(null);
  const [mounted, setMounted] = useState(false);
  const sessionRef = useRef(0);
  const resultsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const saved = sessionStorage.getItem("foodvision_tray_type");
    if (saved) setTrayType(saved);
  }, []);

  useEffect(() => {
    const onHide = () => releaseCamera("scanner");
    window.addEventListener("pagehide", onHide);
    return () => {
      window.removeEventListener("pagehide", onHide);
      releaseCamera("scanner");
    };
  }, []);

  useEffect(() => {
    if (!videoEl) return;

    const session = ++sessionRef.current;
    let cancelled = false;
    setCameraLoading(true);
    setCameraReady(false);
    setError("");

    (async () => {
      try {
        const stream = await acquireCamera("scanner");
        if (cancelled || session !== sessionRef.current) {
          stream.getTracks().forEach((t) => t.stop());
          releaseCamera("scanner");
          return;
        }

        await attachStreamToVideo(videoEl, stream);
        const hasFrame = await waitForVideoFrame(videoEl);
        if (cancelled || session !== sessionRef.current) return;

        if (hasFrame) {
          setCameraReady(true);
          setError("");
        } else {
          throw new Error("no-frame");
        }
      } catch (err) {
        if (cancelled || session !== sessionRef.current) return;
        releaseCamera("scanner");
        if (videoEl) videoEl.srcObject = null;
        setCameraReady(false);
        setError(cameraErrorMessage(err));
      } finally {
        if (!cancelled && session === sessionRef.current) setCameraLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      sessionRef.current += 1;
      releaseCamera("scanner");
      if (videoEl) videoEl.srcObject = null;
    };
  }, [videoEl, retryCount]);

  const captureFrame = async (): Promise<{ blob: Blob; dataUrl: string } | null> => {
    if (!videoEl || videoEl.videoWidth === 0) return null;
    const canvas = document.createElement("canvas");
    canvas.width = videoEl.videoWidth;
    canvas.height = videoEl.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(videoEl, 0, 0);
    const rawBlob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/jpeg", 0.85),
    );
    if (!rawBlob) return null;
    return prepareScanImage(rawBlob);
  };

  const showResult = async (result: ScanResult, imageUrl: string) => {
    sessionStorage.setItem("last_scan_image", imageUrl);
    sessionStorage.setItem("last_scan_result", JSON.stringify(result));
    const built = await buildCrops(result, imageUrl);
    setScanResult(result);
    setCrops(built);
    setScanning(false);
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  const handleCapture = async () => {
    if (scanning) return;
    setError("");
    setIsFlashing(true);
    setScanning(true);
    try {
      const prepared = await captureFrame();
      if (!prepared) throw new Error("Không chụp được ảnh");
      const result = await scanApi.upload(prepared.blob, trayType);
      setIsFlashing(false);
      await showResult(result, prepared.dataUrl);
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
      const prepared = await prepareScanImage(file);
      const result = await scanApi.upload(prepared.blob, trayType);
      await showResult(result, prepared.dataUrl);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Quét thất bại. Vui lòng thử lại.");
      setScanning(false);
    }
    e.target.value = "";
  };

  const handleSaveMeal = async () => {
    if (!scanResult) return;
    setSaving(true);
    try {
      await mealsApi.fromScan(scanResult.scan_id);
      window.dispatchEvent(new Event("foodvision:meals-updated"));
      router.push("/diary");
    } catch {
      setSaving(false);
    }
  };

  const handlePayMomo = async () => {
    if (!scanResult || totalPrice < 1000) return;
    setPaying(true);
    setError("");
    try {
      const dishNames = crops.map((c) => c.displayName).join(", ");
      const res = await paymentsApi.createMomo({
        amount: totalPrice,
        order_info: `FoodVision: ${dishNames}`.slice(0, 180),
        scan_id: scanResult.scan_id,
      });
      if (!res.pay_url) throw new Error("MoMo không trả link thanh toán");
      setMomoPay({
        orderId: res.order_id,
        amount: res.amount,
        payUrl: res.pay_url,
      });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Không tạo được thanh toán MoMo.");
      setPaying(false);
    }
  };

  const handleRescan = () => {
    setScanResult(null);
    setCrops([]);
    setMomoPay(null);
    setError("");
  };

  const totalPrice = crops.reduce((sum, c) => sum + c.price, 0);

  return (
    <div className="font-body-md text-body-md selection:bg-primary-fixed min-h-screen bg-background text-on-background overflow-x-hidden">
      <Navigation />

      <main className="max-w-[1140px] mx-auto px-container-margin pt-32 md:pt-36 pb-32">
        <section className="mb-lg">
          <SectionDivider title="-- Nhận diện món ăn --" />
        </section>

        <div className="relative grid grid-cols-1 md:grid-cols-[minmax(0,320px)_1fr] gap-8 lg:gap-12 items-start min-w-0">
          <div className="flex flex-col gap-4 min-w-0">
          <div className="relative aspect-square w-full max-w-[min(100%,320px)] rounded-xl overflow-hidden editorial-card border border-[#F2EFE9] bg-surface shadow-[0_20px_30px_rgba(27,28,28,0.08)]">
            <video
              ref={setVideoEl}
              autoPlay
              playsInline
              muted
              suppressHydrationWarning
              className="absolute inset-0 w-full h-full object-cover bg-black/80"
            />

            {cameraLoading && !error && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-sm z-[1]">
                Đang mở camera...
              </div>
            )}

            {!cameraLoading && !cameraReady && error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white text-xs text-center px-4 gap-2 z-[1]">
                <span className="material-symbols-outlined text-3xl text-white/80">videocam_off</span>
                <p className="leading-relaxed">{error}</p>
              </div>
            )}

            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-[10%]">
                <div className="absolute top-0 left-0 w-6 h-6 border-t-[1.5px] border-l-[1.5px] border-white/75 rounded-tl-md" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-[1.5px] border-r-[1.5px] border-white/75 rounded-tr-md" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-[1.5px] border-l-[1.5px] border-white/75 rounded-bl-md" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-[1.5px] border-r-[1.5px] border-white/75 rounded-br-md" />
                <div className="scanning-line-overlay" />
              </div>
              <div className="absolute top-3 left-1/2 -translate-x-1/2">
                <div className="bg-surface-container-lowest/80 backdrop-blur-md px-3 py-1 rounded-full border border-tertiary-fixed-dim/50 shadow-sm flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      cameraReady ? "bg-[#8A9A5B] animate-pulse" : "bg-outline"
                    }`}
                  />
                  <p className="font-label-md text-label-md text-on-surface uppercase tracking-widest whitespace-nowrap">
                    {scanning ? "Đang phân tích..." : cameraReady ? "Sẵn sàng" : "Chờ camera"}
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-4 z-10">
              <label className="cursor-pointer w-11 h-11 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-black/65 transition-colors">
                <span className="material-symbols-outlined text-white text-xl">photo_library</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={scanning} />
              </label>
              <button
                type="button"
                onClick={handleCapture}
                disabled={!cameraReady || scanning}
                className="group relative flex items-center justify-center w-16 h-16 bg-black/55 hover:bg-black/70 text-white rounded-full shadow-xl border border-white/30 transition-all duration-300 active:scale-90 disabled:opacity-50"
              >
                <div className="absolute inset-0 rounded-full border-2 border-white/40 group-hover:scale-110 transition-transform duration-300" />
                <span className="material-symbols-outlined text-[28px]">photo_camera</span>
              </button>
            </div>
          </div>

          <Link
            href="/scanner/select-tray"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-lowest border border-[#F2EFE9] text-sm text-on-surface hover:bg-surface-container-low transition-colors w-fit md:hidden"
          >
            <span className="material-symbols-outlined text-base">grid_view</span>
            {TRAY_LABELS[trayType] || "Chọn loại khay"}
          </Link>
          </div>

          <div className="flex flex-col gap-6 min-w-0 pt-2 md:pt-0 md:pr-8 lg:pr-16">
            <div>
              <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-4">Cách quét</p>
              <ol className="space-y-4">
                {SCAN_STEPS.map((step, i) => (
                  <li key={step.title} className="flex gap-4">
                    <div className="flex flex-col items-center shrink-0">
                      <div className="w-9 h-9 rounded-full bg-surface-container-high border border-outline-variant/50 flex items-center justify-center">
                        <span className="material-symbols-outlined text-on-surface-variant text-lg">{step.icon}</span>
                      </div>
                      {i < SCAN_STEPS.length - 1 && <div className="w-px flex-1 min-h-[1rem] bg-outline-variant/40 mt-2" />}
                    </div>
                    <div className="pb-1">
                      <p className="font-body-md text-body-md font-semibold text-on-surface">
                        <span className="text-on-surface-variant mr-1">{i + 1}.</span>
                        {step.title}
                      </p>
                      <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">{step.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {error && (
              <div className="rounded-xl border border-[#b82c2a]/40 bg-[#b82c2a]/10 p-4 space-y-2">
                <p className="text-[#b82c2a] text-sm leading-relaxed">{error}</p>
                <button
                  type="button"
                  onClick={() => setRetryCount((n) => n + 1)}
                  className="text-sm text-on-surface underline underline-offset-2 hover:text-[#b82c2a] transition-colors"
                >
                  Thử lại camera
                </button>
              </div>
            )}
          </div>
        </div>

        {scanResult && (
          <div ref={resultsRef} className="mt-12 scroll-mt-32">
            <SectionDivider title="-- Kết quả ảnh cắt --" />

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {crops.map((crop) => (
                <div
                  key={crop.index}
                  className="group rounded-xl overflow-hidden border border-[#F2EFE9] bg-surface-container-lowest flex flex-col transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl hover:shadow-black/25 hover:border-white/30"
                >
                  <div className="relative aspect-square bg-black/20 overflow-hidden">
                    {crop.url ? (
                      <img
                        src={crop.url}
                        alt={crop.displayName}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-on-surface-variant text-xs">
                        Không cắt được
                      </div>
                    )}
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 text-white text-[11px] font-medium">
                      {Math.round(crop.confidence)}%
                    </span>
                  </div>
                  <div className="p-3 flex flex-col gap-1">
                    <p className="font-body-md text-body-md font-semibold text-on-surface leading-tight">{crop.displayName}</p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">{Math.round(crop.calories)} kcal</p>
                    <p className="font-bold text-[#b82c2a] mt-1">{formatPrice(crop.price)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-[#F2EFE9] bg-surface-container-lowest p-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-1">Tổng tạm tính</p>
                <p className="font-headline-sm text-headline-sm font-bold text-[#b82c2a]">{formatPrice(totalPrice)}</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">
                  {crops.length} món · {Math.round(scanResult.totals.calories)} kcal · {Math.round(scanResult.totals.protein)}g đạm
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleRescan}
                  className="px-5 py-2.5 rounded-full border border-[#F2EFE9] text-sm font-semibold text-on-surface hover:bg-surface-container-low transition-colors"
                >
                  Quét lại
                </button>
                <button
                  type="button"
                  onClick={handlePayMomo}
                  disabled={paying || totalPrice < 1000}
                  className="px-5 py-2.5 rounded-full bg-[#a50064] hover:bg-[#8a0054] text-white text-sm font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {paying ? "Đang tạo QR..." : "Thanh toán MoMo"}
                </button>
                <button
                  type="button"
                  onClick={handleSaveMeal}
                  disabled={saving}
                  className="px-5 py-2.5 rounded-full bg-[#b82c2a] hover:bg-[#9a2523] text-white text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  {saving ? "Đang lưu..." : "Lưu vào Nhật ký"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {isFlashing && (
        <div className="fixed inset-0 bg-white z-[100] transition-opacity duration-500 pointer-events-none opacity-100" />
      )}

      {mounted && momoPay && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4"
          onClick={() => setMomoPay(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="relative w-[min(100vw-2rem,380px)] min-w-[300px] rounded-2xl bg-[#fcf9f8] text-[#1b1c1c] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setMomoPay(null)}
              className="absolute top-4 right-4 text-[#767869] hover:text-[#1b1c1c]"
              aria-label="Đóng"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <h3 className="text-xl font-bold mb-1 pr-8">Thanh toán MoMo</h3>
            <p className="text-sm text-[#767869] mb-3">Quét mã QR bằng app MoMo (sandbox)</p>
            <p className="font-bold text-[#a50064] text-2xl mb-4">{formatPrice(momoPay.amount)}</p>
            <div className="mx-auto w-[240px] h-[240px] rounded-xl border border-[#e4e2e1] overflow-hidden bg-white mb-4 flex items-center justify-center">
              <img
                src={momoQrImage(momoPay.payUrl)}
                alt="QR thanh toán MoMo"
                width={240}
                height={240}
                className="block"
              />
            </div>
            <a
              href={momoPay.payUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center py-3 rounded-full bg-[#a50064] hover:bg-[#8a0054] text-white text-sm font-semibold"
            >
              Hoặc mở trang MoMo
            </a>
            <p className="text-[11px] text-center text-[#767869] mt-3 break-all">
              Mã đơn: {momoPay.orderId}
            </p>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
