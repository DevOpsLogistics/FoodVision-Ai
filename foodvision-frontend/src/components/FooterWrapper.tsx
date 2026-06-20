"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function FooterWrapper() {
  const pathname = usePathname();
  
  // Hide footer on full-screen/camera pages
  const hiddenRoutes = ["/ar-vision", "/detection-result"];
  if (hiddenRoutes.includes(pathname || "")) {
    return null;
  }

  return <Footer />;
}
