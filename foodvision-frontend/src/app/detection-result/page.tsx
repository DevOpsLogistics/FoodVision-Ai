"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  EditorialCard,
  PageHeader,
  PageShell,
  PrimaryButton,
  SecondaryButton,
  SectionDivider,
  StatPill,
} from "@/components/PageLayout";
import { mealsApi, scanApi, ScanResult } from "@/lib/api";
import { dishImage } from "@/data/dishImages";

export default function DetectionResult() {
  const router = useRouter();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [scan, setScan] = useState<ScanResult | null>(null);
  const [imageUrl, setImageUrl] = useState(dishImage("goi_cuon"));
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
      window.dispatchEvent(new Event("foodvision:meals-updated"));
      router.push("/diary");
    } catch {
      setSaving(false);
    }
  };

  if (!scan) {
    return (
      <PageShell>
        <p className="text-on-surface-variant text-center py-24">Đang tải kết quả...</p>
      </PageShell>
    );
  }

  const { items, totals } = scan;
  const mainName = items.map((i) => i.display_name).join(", ");

  return (
    <PageShell>
      <PageHeader
        eyebrow="Máy quét"
        title="Kết quả nhận diện"
        description={`Phát hiện ${items.length} thành phần · ${mainName}`}
        action={
          <button
            type="button"
            onClick={() => router.push("/scanner")}
            className="flex items-center gap-xs font-label-md text-label-md text-primary hover:text-secondary transition-colors shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            Quét lại
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-md">
        <div className="md:col-span-5">
          <EditorialCard padding="p-0 overflow-hidden">
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
                    {item.display_name} (
                    {Math.round(item.confidence <= 1 ? item.confidence * 100 : item.confidence)}%)
                  </span>
                </div>
              ))}
            </div>
          </EditorialCard>
        </div>

        <div className="md:col-span-7 flex flex-col gap-md">
          <EditorialCard padding="p-lg">
            <SectionDivider title="Dinh dưỡng bữa ăn" />
            <div className="flex flex-wrap gap-sm mb-lg -mt-2">
              <StatPill tone="secondary" value={`${Math.round(totals.calories)}`} label="Calo" />
              <StatPill tone="primary" value={`${Math.round(totals.protein)}g`} label="Đạm" />
              <StatPill tone="tertiary" value={`${Math.round(totals.fat)}g`} label="Chất béo" />
            </div>

            <div className="space-y-md border-t border-[#F2EFE9] pt-md">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center transition-colors hover:bg-surface-container-low p-3 -mx-3 rounded-lg cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div>
                    <p className="font-label-md text-label-md text-on-surface">
                      {item.display_name}{" "}
                      <span className="text-outline font-normal">
                        ({Math.round(item.confidence <= 1 ? item.confidence * 100 : item.confidence)}%)
                      </span>
                    </p>
                    <p className="font-label-sm text-label-sm text-outline">
                      {Math.round(item.calories)} kcal · {Math.round(item.protein)}g đạm ·{" "}
                      {Math.round(item.carbs)}g tinh bột
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </EditorialCard>

          <div className="flex flex-col gap-sm">
            <PrimaryButton onClick={handleSaveMeal} disabled={saving}>
              {saving ? "Đang lưu..." : "Lưu vào Nhật ký"}
            </PrimaryButton>
            <SecondaryButton onClick={() => router.push("/dashboard")}>
              Về Bảng điều khiển
            </SecondaryButton>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
