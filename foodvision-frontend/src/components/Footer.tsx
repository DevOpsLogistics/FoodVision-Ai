"use client";

import Link from "next/link";
import Image from "next/image";
import { SOCIAL } from "@/data/socialLinks";

export default function Footer() {
  return (
    <footer className="bg-[#242626] text-[#f3f0f0] border-t border-surface-variant/30 mt-auto">
      <div className="max-w-[1140px] mx-auto px-container-margin py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo */}
          <div className="flex justify-center md:justify-start items-start">
            <div className="bg-surface-container-lowest/10 p-4 rounded-full inline-block backdrop-blur-sm">
              <Image src="/logo.png" alt="FoodVision AI Logo" width={100} height={100} className="object-contain h-16 w-auto drop-shadow-md brightness-200" />
            </div>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="font-label-md font-bold text-red-500 mb-1 uppercase tracking-wider text-xs">Địa chỉ</h3>
              <p className="text-sm font-body-md text-surface-container-highest">
                đông thạnh, hooc môn hcm
              </p>
            </div>
            <div>
              <h3 className="font-label-md font-bold text-red-500 mb-1 uppercase tracking-wider text-xs">Hotline</h3>
              <p className="text-sm font-body-md text-surface-container-highest">0869 233 973</p>
            </div>
            <div>
              <h3 className="font-label-md font-bold text-red-500 mb-1 uppercase tracking-wider text-xs">Phản ánh chất lượng</h3>
              <p className="text-sm font-body-md text-surface-container-highest">0329 511 628</p>
            </div>
          </div>

          {/* Hours & Email */}
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="font-label-md font-bold text-red-500 mb-1 uppercase tracking-wider text-xs">Giờ mở cửa</h3>
              <p className="text-sm font-body-md text-surface-container-highest">9h00 - 19h00, hàng ngày</p>
            </div>
            <div>
              <h3 className="font-label-md font-bold text-red-500 mb-1 uppercase tracking-wider text-xs">Email</h3>
              <p className="text-sm font-body-md text-surface-container-highest">trantrungkien20012006@gmail.com</p>
            </div>
          </div>

          {/* Socials */}
          <div className="flex flex-col items-center md:items-end gap-4">
            <h3 className="font-label-md font-bold text-red-500 mb-1 uppercase tracking-wider text-xs hidden md:block opacity-0">Kết nối</h3>
            <div className="flex gap-3">
              <a
                href={SOCIAL.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full overflow-hidden shadow-md hover:scale-105 transition-transform"
                aria-label="Zalo"
              >
                <Image src="/logos/zalo.svg" alt="Zalo" width={44} height={44} className="w-full h-full object-cover" />
              </a>
              <a
                href={SOCIAL.facebookProfile}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full overflow-hidden shadow-md hover:scale-105 transition-transform"
                aria-label="Facebook"
              >
                <Image src="/logos/facebook.svg" alt="Facebook" width={44} height={44} className="w-full h-full object-cover" />
              </a>
            </div>
          </div>
        </div>

        <hr className="border-surface-variant/50 mb-8" />

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap gap-4 text-sm font-medium text-surface-container-highest">
              <p>© 2026 FoodVision AI</p>
              <span className="hidden md:block">|</span>
              <Link href="#" className="hover:text-red-500 transition-colors">Chính sách hoạt động</Link>
              <span className="hidden md:block">|</span>
              <Link href="#" className="hover:text-red-500 transition-colors">Chính sách bảo mật thông tin</Link>
            </div>
            
            <div className="text-xs text-outline-variant space-y-1">
              <p className="font-bold text-surface-container-highest">CÔNG TY TNHH THỰC PHẨM FOODVISION AI</p>
              <p>Địa chỉ: đông thạnh, hooc môn hcm</p>
              <p>Số GCN đăng ký kinh doanh: 0109537931 | Ngày cấp: 04/03/2026 | Nơi cấp: Sở Kế hoạch và Đầu tư thành phố Hồ Chí Minh</p>
              <p>Số GCN an toàn thực phẩm: 239 Ngày cấp: 12/04/2026 Nơi cấp: Sở Y tế Tp. Hồ Chí Minh</p>
            </div>
          </div>

          <div className="flex-shrink-0 bg-white p-2 rounded-xl">
            {/* Mock "Đã thông báo bộ công thương" badge */}
            <div className="flex items-center gap-2 border-2 border-blue-500 rounded-lg px-3 py-1">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-[20px]">check</span>
              </div>
              <div className="text-blue-500 font-bold leading-tight">
                <span className="block text-[10px] uppercase">Đã thông báo</span>
                <span className="block text-xs uppercase">Bộ Công Thương</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
