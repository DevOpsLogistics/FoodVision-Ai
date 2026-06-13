import type { Metadata } from "next";
import { DM_Sans, Libre_Caslon_Text } from "next/font/google";
import "./globals.css";
import FooterWrapper from "@/components/FooterWrapper";
import FloatingMenu from "@/components/FloatingMenu";
import AIChatBot from "@/components/AIChatBot";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
});

const libreCaslon = Libre_Caslon_Text({
  variable: "--font-libre-caslon",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "FoodVision AI",
  description: "Natural UI Redesign for FoodVision AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${libreCaslon.variable} h-full antialiased light`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <FooterWrapper />
        <FloatingMenu />
        <AIChatBot />
      </body>
    </html>
  );
}
