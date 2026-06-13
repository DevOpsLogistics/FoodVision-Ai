"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function BannerSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const banners = [
    {
      id: 1,
      imageUrl: "/images/banners/banner1.png", 
      link: "#",
      fallbackColor: "bg-gradient-to-r from-orange-400 to-red-500",
      title: "Bữa Cơm Nhà Đậm Đà Hương Vị Việt 1"
    },
    {
      id: 2,
      imageUrl: "/images/banners/banner2.png",
      link: "#",
      fallbackColor: "bg-gradient-to-r from-orange-500 to-amber-600",
      title: "Bữa Cơm Nhà Đậm Đà Hương Vị Việt 2"
    },
    {
      id: 3,
      imageUrl: "/images/banners/banner3.png",
      link: "#",
      fallbackColor: "bg-gradient-to-r from-amber-400 to-orange-500",
      title: "Bữa Cơm Nhà Đậm Đà Hương Vị Việt 3"
    },
    {
      id: 4,
      imageUrl: "/images/banners/banner4.png",
      link: "#",
      fallbackColor: "bg-gradient-to-r from-yellow-500 to-orange-600",
      title: "Bữa Cơm Nhà Đậm Đà Hương Vị Việt 4"
    },
    {
      id: 5,
      imageUrl: "/images/banners/banner5.png",
      link: "#",
      fallbackColor: "bg-gradient-to-r from-red-500 to-orange-600",
      title: "Bữa Cơm Nhà Đậm Đà Hương Vị Việt 5"
    }
  ];

  // Tự động lướt ảnh sau 4 giây
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 4000); 
    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <div className="relative w-full overflow-hidden rounded-xl mt-6 mb-xl group shadow-sm">
      {/* Banner Container */}
      <div 
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((banner) => (
          <Link key={banner.id} href={banner.link} className="min-w-full relative aspect-[21/9] sm:aspect-[3/1] block cursor-pointer">
            <div className={`w-full h-full ${banner.fallbackColor} flex items-center justify-center text-white`}>
              <img 
                src={banner.imageUrl} 
                alt={banner.title} 
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.opacity = '0';
                }}
              />
            </div>
          </Link>
        ))}
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? "bg-white w-4" : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Navigation Buttons (Hiển thị khi hover) */}
      <button 
        onClick={() => setCurrentIndex((prevIndex) => (prevIndex === 0 ? banners.length - 1 : prevIndex - 1))}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm z-20 hover:bg-black/50"
      >
        <span className="material-symbols-outlined text-[20px]">chevron_left</span>
      </button>
      <button 
        onClick={() => setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length)}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm z-20 hover:bg-black/50"
      >
        <span className="material-symbols-outlined text-[20px]">chevron_right</span>
      </button>
    </div>
  );
}
