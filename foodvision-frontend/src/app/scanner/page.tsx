"use client";

import dynamic from "next/dynamic";

const ScannerView = dynamic(() => import("./ScannerView"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-background flex items-center justify-center text-on-surface-variant text-sm">
      Đang tải máy quét...
    </div>
  ),
});

export default function ScannerPage() {
  return <ScannerView />;
}
