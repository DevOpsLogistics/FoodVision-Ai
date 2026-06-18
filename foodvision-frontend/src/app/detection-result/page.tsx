"use client";

import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { useRouter } from "next/navigation";
import { mealsApi, scanApi, ScanResult } from "@/lib/api";

export default function DetectionResult() {
  const router = useRouter();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [scan, setScan] = useState<ScanResult | null>(null);
  const [imageUrl, setImageUrl] = useState("/images/dishes/thit_kho.jpg");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("last_scan_result");
    const img = sessionStorage.getItem("last_scan_image");
    if (img) setImageUrl(img);
    if (!raw) {
      router.replace("/scanner");
      return;
    }
    try {
      const parsed = JSON.parse(raw) as ScanResult;
      setScan(parsed);
      if (parsed.scan_id) {
        scanApi.get(parsed.scan_id).then(setScan).catch(() => {});
      }
    } catch {
      router.replace("/scanner");
    }
  }, [router]);

  const getBoxStyle = (index: number, bbox: { x: number; y: number; w: number; h: number }) => {
    const base: React.CSSProperties = {
      top: `${bbox.y * 100}%`,
      left: `${bbox.x * 100}%`,
      width: `${bbox.w * 100}%`,
      height: `${bbox.h * 100}%`,
    };
    if (hoveredIndex === index) {
      return { ...base, borderColor: "#9f402d", transform: "scale(1.02)" };
    }
    return base;
  };

  const handleSaveMeal = async () => {
    if (!scan) return;
    setSaving(true);
    try {
      await mealsApi.fromScan(scan.scan_id);
      router.push("/diary");
    } catch {
      setSaving(false);
    }
  };

  if (!scan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-on-surface">Đang tải kết quả...</p>
      </div>
    );
  }

  const { items, totals } = scan;
  const mainName = items.map((i) => i.display_name).join(", ");

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen">
      <Navigation />

      <main className="max-w-[1140px] mx-auto px-container-margin py-lg pt-24">
        <div className="flex flex-col lg:flex-row gap-lg">
          <div className="flex-1 relative group">
            <div className="rounded-xl overflow-hidden shadow-[0_20px_30px_rgba(27,28,28,0.06)] bg-white">
              {/* w-full h-auto giữ đúng tỷ lệ ảnh gốc — bbox % khớp overlay */}
              <div className="relative w-full">
                <img alt={mainName} className="w-full h-auto block" src={imageUrl} />
                {items.map((item, idx) => (
                  <div
                    key={`${item.index}-${idx}`}
                    className="detection-box pointer-events-auto"
                    style={getBoxStyle(idx, item.bbox)}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <span className="detection-label font-label-sm text-label-sm">
                      {item.display_name} ({Math.round(item.confidence <= 1 ? item.confidence * 100 : item.confidence)}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-md flex justify-between items-center">
              <p className="font-label-md text-label-md text-outline">
                Nhận diện {items.length} thành phần
              </p>
              <button
                onClick={() => router.push("/scanner")}
                className="flex items-center gap-xs font-label-md text-label-md text-primary hover:text-secondary-container transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">refresh</span>
                Quét lại
              </button>
            </div>
          </div>

          <div className="w-full lg:w-[400px] flex flex-col gap-md">
            <section className="bg-white p-md rounded-xl shadow-[0_20px_30px_rgba(27,28,28,0.04)] border border-[#F2EFE9]">
              <div className="mb-lg">
                <h1 className="font-headline-md text-headline-md text-on-surface mb-xs">Kết quả nhận diện</h1>
                <p className="font-body-md text-body-md text-on-surface-variant">{mainName}</p>
              </div>

              <div className="flex flex-wrap gap-sm mb-lg">
                <div className="bg-secondary/10 px-4 py-2 rounded-full border border-secondary/20">
                  <span className="font-label-sm text-label-sm text-secondary">{Math.round(totals.calories)} Calo</span>
                </div>
                <div className="bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
                  <span className="font-label-sm text-label-sm text-primary">{Math.round(totals.protein)}g Đạm</span>
                </div>
                <div className="bg-tertiary/10 px-4 py-2 rounded-full border border-tertiary/20">
                  <span className="font-label-sm text-label-sm text-tertiary">{Math.round(totals.fat)}g Chất béo</span>
                </div>
              </div>

              <div className="space-y-md border-t border-[#F2EFE9] pt-md">
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center transition-colors hover:bg-surface-container-lowest p-2 -mx-2 rounded-lg cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <div>
                      <p className="font-label-md text-label-md text-on-surface">
                        {item.display_name}
                        {" "}
                        <span className="text-outline font-normal">
                          ({Math.round(item.confidence <= 1 ? item.confidence * 100 : item.confidence)}%)
                        </span>
                      </p>
                      <p className="font-label-sm text-label-sm text-outline">
                        {Math.round(item.calories)} kcal • {Math.round(item.protein)}g Đạm • {Math.round(item.carbs)}g Tinh bột
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="flex flex-col gap-sm">
              <button
                onClick={handleSaveMeal}
                disabled={saving}
                className="w-full bg-primary text-white py-4 rounded-xl font-label-md text-label-md shadow-lg active:scale-[0.98] transition-all hover:bg-primary-container disabled:opacity-60"
              >
                {saving ? "Đang lưu..." : "Lưu vào Nhật ký"}
              </button>
              <button
                onClick={() => router.push("/dashboard")}
                className="w-full bg-white border border-outline-variant text-on-surface-variant py-4 rounded-xl font-label-md text-label-md hover:bg-surface-container-low transition-colors"
              >
                Về Trang chủ
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
