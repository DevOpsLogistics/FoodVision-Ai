"use client";

import { useEffect, useState } from "react";

const U = (id: string) =>
  `https://images.unsplash.com/${id}?q=85&w=1920&auto=format&fit=crop`;

const HERO_IMAGES = [
  U("photo-1546069901-ba9599a7e63c"),
  U("photo-1504674900247-0877df9cc836"),
  U("photo-1582878826629-29b7a2ba2d9b"),
  U("photo-1555939594-58d7cb561ad1"),
  U("photo-1498837167922-ddd27525cd58"),
];

const INTERVAL_MS = 5500;

/** Nền slideshow full màn — không chữ, không UI */
export default function LoginHero() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % HERO_IMAGES.length), INTERVAL_MS);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#1a1512]">
      {HERO_IMAGES.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-[1800ms] ease-in-out"
          style={{ opacity: i === idx ? 1 : 0 }}
          aria-hidden={i !== idx}
        >
          <img
            src={src}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover object-center login-hero-zoom ${
              i === idx ? "login-hero-zoom-active" : ""
            }`}
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-black/60 pointer-events-none" />
    </div>
  );
}
