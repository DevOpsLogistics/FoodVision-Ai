"use client";

import Navigation from "@/components/Navigation";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useUser } from "@/hooks/useUser";

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [metricUnits, setMetricUnits] = useState(true);
  const [smartCapture, setSmartCapture] = useState(true);
  const [mealReminders, setMealReminders] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [communityTips, setCommunityTips] = useState(false);

  const predefinedBanners = [
    "/images/banners/banner1.png",
    "/images/banners/banner2.png",
    "/images/banners/banner3.png",
    "/images/banners/banner4.png",
    "/images/banners/banner5.png"
  ];

  const { user, updateUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState(user);

  useEffect(() => {
    setUserInfo(user);
  }, [user]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        updateUser({ avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    updateUser(userInfo);
    setIsEditing(false);
  };

  return (
    <div className="bg-background text-on-surface min-h-screen pb-[90px] md:pb-0">
      <Navigation />

      <main className="max-w-[1140px] mx-auto px-container-margin pt-16 md:pt-24 mb-xl">
        {/* Page Title */}
        <div className="mb-lg animate-fade-in">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-2">
            Cài đặt
          </h2>
          <p className="font-body-md text-on-surface-variant">
            Quản lý hành trình dinh dưỡng và trải nghiệm ứng dụng của bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-md items-start">
          {/* Settings Categories (Bento Style) */}
          <div className="md:col-span-8 space-y-md">
            {/* Profile Section */}
            <section
              className="bg-surface-container-lowest rounded-xl border border-[#F2EFE9] animate-fade-in shadow-sm hover:-translate-y-0.5 transition-transform duration-300 overflow-hidden"
              style={{ animationDelay: "0.1s" }}
            >
              {/* Banner Area */}
              <div className="h-32 w-full relative bg-surface-variant">
                {user.banner && (
                   <img src={user.banner} alt="Profile Banner" className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>
              
              <div className="p-md pt-0">
                <div className="flex items-start gap-4 mb-6 -mt-8 relative z-10">
                  <div 
                    className="relative group shrink-0 cursor-pointer" 
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      ref={fileInputRef} 
                      onChange={handleImageChange} 
                    />
                    {user.avatar ? (
                      <img src={user.avatar} alt="Avatar" className="w-20 h-20 rounded-full object-cover border-4 border-surface-container-lowest" />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center font-bold text-3xl border-4 border-surface-container-lowest shadow-sm">
                        {user.name ? user.name.charAt(0).toUpperCase() : "K"}
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="material-symbols-outlined text-white text-[20px]">
                        edit
                      </span>
                    </div>
                  </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    {isEditing ? (
                      <div className="w-full space-y-2 pr-4">
                        <input 
                          type="text" 
                          value={userInfo.name} 
                          onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                          className="w-full bg-surface-container p-2 rounded-md font-headline-sm text-on-surface border border-outline-variant focus:outline-red-500"
                          placeholder="Họ và tên"
                        />
                        <input 
                          type="email" 
                          value={userInfo.email} 
                          onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                          className="w-full bg-surface-container p-2 rounded-md font-label-md text-on-surface-variant border border-outline-variant focus:outline-red-500"
                          placeholder="Email"
                        />
                      </div>
                    ) : (
                      <div>
                        <h3 className="font-headline-sm text-headline-sm text-on-surface">
                          {userInfo.name}
                        </h3>
                        <p className="font-label-md text-on-surface-variant mb-2">
                          {userInfo.email}
                        </p>
                      </div>
                    )}
                    
                    <button 
                      onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                      className={`px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${isEditing ? 'bg-red-500 text-white hover:bg-red-600' : 'text-red-500 hover:bg-red-500/10'}`} 
                      title={isEditing ? "Lưu" : "Chỉnh sửa hồ sơ"}
                    >
                      {isEditing ? "Lưu lại" : "Sửa"}
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 mt-2 p-3 bg-surface-container-low rounded-lg">
                    {isEditing ? (
                      <>
                        <div>
                          <span className="text-xs text-on-surface-variant block mb-1">Hotline</span>
                          <input 
                            type="text" 
                            value={userInfo.hotline} 
                            onChange={(e) => setUserInfo({...userInfo, hotline: e.target.value})}
                            className="w-full bg-surface p-1 rounded border border-outline-variant focus:outline-red-500 text-sm"
                          />
                        </div>
                        <div>
                          <span className="text-xs text-on-surface-variant block mb-1">Hỗ trợ</span>
                          <input 
                            type="text" 
                            value={userInfo.support} 
                            onChange={(e) => setUserInfo({...userInfo, support: e.target.value})}
                            className="w-full bg-surface p-1 rounded border border-outline-variant focus:outline-red-500 text-sm"
                          />
                        </div>
                        <div className="sm:col-span-2 mt-1">
                          <span className="text-xs text-on-surface-variant block mb-1">Địa chỉ</span>
                          <input 
                            type="text" 
                            value={userInfo.address} 
                            onChange={(e) => setUserInfo({...userInfo, address: e.target.value})}
                            className="w-full bg-surface p-1 rounded border border-outline-variant focus:outline-red-500 text-sm"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <span className="text-xs text-on-surface-variant block">Hotline</span>
                          <span className="font-label-md">{userInfo.hotline}</span>
                        </div>
                        <div>
                          <span className="text-xs text-on-surface-variant block">Hỗ trợ</span>
                          <span className="font-label-md">{userInfo.support}</span>
                        </div>
                        <div className="sm:col-span-2">
                          <span className="text-xs text-on-surface-variant block">Địa chỉ</span>
                          <span className="font-label-md">{userInfo.address}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-2 mt-4 px-md pb-md">
                <div className="flex items-center justify-between p-3 hover:bg-surface-container-low rounded-lg transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <span className="font-label-md">Mật khẩu & Bảo mật</span>
                  </div>
                  <span className="material-symbols-outlined text-outline group-hover:translate-x-1 transition-transform">
                    chevron_right
                  </span>
                </div>
              </div>
              </div>
            </section>

            {/* Banner Selection */}
            <section
              className="bg-surface-container-lowest p-md rounded-xl border border-[#F2EFE9] animate-fade-in shadow-sm hover:-translate-y-0.5 transition-transform duration-300"
              style={{ animationDelay: "0.15s" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <h3 className="font-headline-sm text-headline-sm">
                  Thay đổi Ảnh bìa
                </h3>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                {predefinedBanners.map((banner, index) => (
                  <div 
                    key={index}
                    onClick={() => updateUser({ banner })}
                    className={`shrink-0 w-32 h-20 rounded-lg cursor-pointer border-2 transition-all ${user.banner === banner ? 'border-red-500 scale-105 shadow-md' : 'border-transparent hover:border-outline-variant hover:opacity-80'}`}
                  >
                    <img src={banner} alt={`Banner ${index + 1}`} className="w-full h-full object-cover rounded-md" />
                  </div>
                ))}
              </div>
            </section>

            {/* Nutrition Goals */}
            <section
              className="bg-surface-container-lowest p-md rounded-xl border border-[#F2EFE9] animate-fade-in shadow-sm hover:-translate-y-0.5 transition-transform duration-300"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="flex items-center gap-2 mb-6">
                <h3 className="font-headline-sm text-headline-sm">
                  Mục tiêu Dinh dưỡng
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-surface-container-low border border-outline-variant/30">
                  <span className="font-label-sm text-on-surface-variant uppercase tracking-wider block mb-1">
                    Calo Hàng ngày
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-headline-sm">2,450</span>
                    <span className="text-on-surface-variant font-label-md">
                      kcal
                    </span>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-surface-container-low border border-outline-variant/30">
                  <span className="font-label-sm text-on-surface-variant uppercase tracking-wider block mb-1">
                    Lượng Nước uống
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-headline-sm">2.5</span>
                    <span className="text-on-surface-variant font-label-md">
                      Lít
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-outline-variant/20 flex justify-between items-center">
                <span className="font-body-md text-on-surface-variant">
                  Khu vực Tập trung
                </span>
                <span className="px-3 py-1 bg-red-500/10 text-red-500 rounded-full font-label-sm">
                  Tuổi thọ Tỉnh thức
                </span>
              </div>
            </section>

            {/* App Preferences */}
            <section
              className="bg-surface-container-lowest p-md rounded-xl border border-[#F2EFE9] animate-fade-in shadow-sm hover:-translate-y-0.5 transition-transform duration-300"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="flex items-center gap-2 mb-6">
                <h3 className="font-headline-sm text-headline-sm">
                  Tùy chọn Ứng dụng
                </h3>
              </div>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-label-md text-on-surface">
                      Chế độ Tối
                    </h4>
                    <p className="text-sm text-on-surface-variant">
                      Điều chỉnh giao diện để thoải mái hơn
                    </p>
                  </div>
                  <label className="relative inline-block w-11 h-6">
                    <input
                      type="checkbox"
                      className="opacity-0 w-0 h-0 peer"
                      checked={darkMode}
                      onChange={(e) => setDarkMode(e.target.checked)}
                    />
                    <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-surface-variant transition-colors duration-300 rounded-full peer-checked:bg-red-500 before:absolute before:content-[''] before:h-[18px] before:w-[18px] before:left-[3px] before:bottom-[3px] before:bg-white before:transition-transform before:duration-300 before:rounded-full peer-checked:before:translate-x-5"></span>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-label-md text-on-surface">
                      Hệ đo lường Mét
                    </h4>
                    <p className="text-sm text-on-surface-variant">
                      Sử dụng gam, lít, và kilôgam
                    </p>
                  </div>
                  <label className="relative inline-block w-11 h-6">
                    <input
                      type="checkbox"
                      className="opacity-0 w-0 h-0 peer"
                      checked={metricUnits}
                      onChange={(e) => setMetricUnits(e.target.checked)}
                    />
                    <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-surface-variant transition-colors duration-300 rounded-full peer-checked:bg-red-500 before:absolute before:content-[''] before:h-[18px] before:w-[18px] before:left-[3px] before:bottom-[3px] before:bg-white before:transition-transform before:duration-300 before:rounded-full peer-checked:before:translate-x-5"></span>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-label-md text-on-surface">
                      Chụp thông minh AI
                    </h4>
                    <p className="text-sm text-on-surface-variant">
                      Tự động phát hiện khẩu phần từ hình ảnh
                    </p>
                  </div>
                  <label className="relative inline-block w-11 h-6">
                    <input
                      type="checkbox"
                      className="opacity-0 w-0 h-0 peer"
                      checked={smartCapture}
                      onChange={(e) => setSmartCapture(e.target.checked)}
                    />
                    <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-surface-variant transition-colors duration-300 rounded-full peer-checked:bg-red-500 before:absolute before:content-[''] before:h-[18px] before:w-[18px] before:left-[3px] before:bottom-[3px] before:bg-white before:transition-transform before:duration-300 before:rounded-full peer-checked:before:translate-x-5"></span>
                  </label>
                </div>
              </div>
            </section>

            {/* Notifications */}
            <section
              className="bg-surface-container-lowest p-md rounded-xl border border-[#F2EFE9] animate-fade-in shadow-sm hover:-translate-y-0.5 transition-transform duration-300"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="flex items-center gap-2 mb-6">
                <h3 className="font-headline-sm text-headline-sm">Thông báo</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border-b border-outline-variant/10">
                  <span className="font-label-md">Nhắc nhở Bữa ăn</span>
                  <label className="relative inline-block w-11 h-6">
                    <input
                      type="checkbox"
                      className="opacity-0 w-0 h-0 peer"
                      checked={mealReminders}
                      onChange={(e) => setMealReminders(e.target.checked)}
                    />
                    <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-surface-variant transition-colors duration-300 rounded-full peer-checked:bg-red-500 before:absolute before:content-[''] before:h-[18px] before:w-[18px] before:left-[3px] before:bottom-[3px] before:bg-white before:transition-transform before:duration-300 before:rounded-full peer-checked:before:translate-x-5"></span>
                  </label>
                </div>
                <div className="flex items-center justify-between p-3 border-b border-outline-variant/10">
                  <span className="font-label-md">
                    Báo cáo Tiến độ Hàng tuần
                  </span>
                  <label className="relative inline-block w-11 h-6">
                    <input
                      type="checkbox"
                      className="opacity-0 w-0 h-0 peer"
                      checked={weeklyDigest}
                      onChange={(e) => setWeeklyDigest(e.target.checked)}
                    />
                    <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-surface-variant transition-colors duration-300 rounded-full peer-checked:bg-red-500 before:absolute before:content-[''] before:h-[18px] before:w-[18px] before:left-[3px] before:bottom-[3px] before:bg-white before:transition-transform before:duration-300 before:rounded-full peer-checked:before:translate-x-5"></span>
                  </label>
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="font-label-md">
                    Mẹo Sức khỏe Cộng đồng
                  </span>
                  <label className="relative inline-block w-11 h-6">
                    <input
                      type="checkbox"
                      className="opacity-0 w-0 h-0 peer"
                      checked={communityTips}
                      onChange={(e) => setCommunityTips(e.target.checked)}
                    />
                    <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-surface-variant transition-colors duration-300 rounded-full peer-checked:bg-red-500 before:absolute before:content-[''] before:h-[18px] before:w-[18px] before:left-[3px] before:bottom-[3px] before:bg-white before:transition-transform before:duration-300 before:rounded-full peer-checked:before:translate-x-5"></span>
                  </label>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar Info/Status */}
          <div className="md:col-span-4 space-y-md mt-md md:mt-0">
            <div
              className="bg-surface-container-lowest text-on-surface p-md rounded-xl border border-[#F2EFE9] animate-fade-in"
              style={{ animationDelay: "0.5s" }}
            >
              <h4 className="font-headline-sm mb-4">Gói Visionary</h4>
              <p className="text-on-surface-variant mb-6">
                Gói cao cấp của bạn sẽ gia hạn vào ngày 12 tháng 10, 2024.
              </p>
              <button className="w-full py-3 px-4 bg-red-500 text-white font-label-md rounded-lg hover:bg-red-600 transition-all">
                Quản lý Gói đăng ký
              </button>
            </div>

            <div
              className="bg-surface-container-lowest p-md rounded-xl border border-[#F2EFE9] animate-fade-in shadow-sm hover:-translate-y-0.5 transition-transform duration-300"
              style={{ animationDelay: "0.6s" }}
            >
              <h4 className="font-label-md text-on-surface-variant uppercase tracking-widest mb-4">
                Hỗ trợ
              </h4>
              <ul className="space-y-4">
                <li className="flex items-center text-on-surface hover:text-red-500 cursor-pointer transition-colors">
                  <span className="font-label-md">Trung tâm Trợ giúp</span>
                </li>
                <li className="flex items-center text-on-surface hover:text-red-500 cursor-pointer transition-colors">
                  <span className="font-label-md">Chính sách Bảo mật</span>
                </li>
                <li className="flex items-center text-on-surface hover:text-red-500 cursor-pointer transition-colors">
                  <span className="font-label-md">Điều khoản Dịch vụ</span>
                </li>
              </ul>
            </div>

            <button
              className="w-full py-4 text-error font-label-md border border-error/20 rounded-xl hover:bg-error/5 transition-colors flex items-center justify-center gap-2 animate-fade-in"
              style={{ animationDelay: "0.7s" }}
            >
              <span className="material-symbols-outlined text-[20px]">
                logout
              </span>
              Đăng xuất
            </button>
            <p className="text-center font-label-sm text-outline pt-4">
              FoodVision AI v2.4.0 (Build 4482)
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
