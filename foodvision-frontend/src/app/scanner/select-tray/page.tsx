"use client";

import Navigation from "@/components/Navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const TRAY_TYPES = [
  {
    id: "school-v",
    name: "Khay V trường học",
    description: "2 ngăn trái lớn (cơm + canh) · 3 ngăn phải",
    icon: "school",
  },
  {
    id: "tray-32",
    name: "Khay 3+2",
    description: "3 ngăn trái (thịt, đậu, rau) · 2 ngăn phải (canh, cơm)",
    icon: "grid_view",
  },
  {
    id: "tray-23",
    name: "Khay 2+3",
    description: "2 ngăn trên (canh, cơm) · 3 ngăn dưới",
    icon: "view_module",
  },
  {
    id: "tray-32u",
    name: "Khay 3+2 ngang",
    description: "3 ngăn trên · 2 ngăn dưới (canh, cơm, món)",
    icon: "dashboard",
  },
] as const;

export type TrayTypeId = (typeof TRAY_TYPES)[number]["id"];

export default function SelectTrayPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<TrayTypeId>("school-v");

  const handleContinue = () => {
    sessionStorage.setItem("foodvision_tray_type", selected);
    router.push("/scanner");
  };

  return (
    <div className="bg-background text-on-background min-h-screen w-full font-body-md text-body-md">
      <Navigation />
      <main className="w-full max-w-[560px] mx-auto px-container-margin pt-28 pb-28 md:pb-12">
        <h1 className="font-headline-md text-headline-md mb-2">Chọn loại khay</h1>
        <p className="text-on-surface-variant mb-8 leading-relaxed">
          Chọn đúng kiểu khay trước khi quét. Hệ thống tự chỉnh góc chéo — chụp hơi nghiêng vẫn được.
        </p>

        <div className="space-y-4 mb-8">
          {TRAY_TYPES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelected(t.id)}
              className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${
                selected === t.id
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-outline-variant/30 bg-surface-container-low hover:border-primary/40"
              }`}
            >
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-3xl text-primary shrink-0">{t.icon}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-body-lg text-body-lg font-bold">{t.name}</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">{t.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleContinue}
          className="w-full py-4 bg-primary text-white rounded-xl font-label-md text-label-md hover:bg-primary-container transition-colors"
        >
          Tiếp tục quét
        </button>

        <p className="text-center mt-4 text-sm text-on-surface-variant">
          <Link href="/scanner" className="underline">
            Bỏ qua (tự động)
          </Link>
        </p>
      </main>
    </div>
  );
}
