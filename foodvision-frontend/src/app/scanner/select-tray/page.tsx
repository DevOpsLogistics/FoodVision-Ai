"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EditorialCard, PageShell, PrimaryButton, SectionDivider } from "@/components/PageLayout";

export const TRAY_TYPES = [
  {
    id: "school-v",
    name: "Khay V trường học",
    description: "2 ngăn trái lớn · 3 ngăn phải",
  },
  {
    id: "tray-32",
    name: "Khay 3+2",
    description: "3 ngăn trái · 2 ngăn phải",
  },
  {
    id: "tray-23",
    name: "Khay 2+3",
    description: "2 ngăn trên · 3 ngăn dưới",
  },
  {
    id: "tray-32u",
    name: "Khay 3+2 ngang",
    description: "3 ngăn trên · 2 ngăn dưới",
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
    <PageShell mainClassName="max-w-[640px] !pt-32 md:!pt-36">
      <section className="mb-lg mt-2">
        <SectionDivider title="-- Chọn khay của bạn --" />
      </section>

      <div className="space-y-md mb-lg">
        {TRAY_TYPES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setSelected(t.id)}
            className={`w-full text-left transition-all ${
              selected === t.id ? "ring-2 ring-red-500 rounded-xl" : ""
            }`}
          >
            <EditorialCard
              padding="p-md"
              hover={selected !== t.id}
              className={
                selected === t.id ? "border-red-500 bg-red-500/10 shadow-[0_0_0_1px_rgba(239,68,68,0.35)]" : ""
              }
            >
              <div className="min-w-0">
                <p className="font-body-lg text-body-lg font-bold text-on-surface">{t.name}</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">{t.description}</p>
              </div>
            </EditorialCard>
          </button>
        ))}
      </div>

      <PrimaryButton
        type="button"
        onClick={handleContinue}
        className="bg-red-500 hover:bg-red-600"
      >
        Tiếp tục quét
      </PrimaryButton>

      <div className="flex justify-end mt-md">
        <Link
          href="/scanner"
          className="inline-flex items-center gap-1 font-label-sm text-label-sm text-red-400 hover:text-red-300 transition-colors"
        >
          Bỏ qua
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </Link>
      </div>
    </PageShell>
  );
}
