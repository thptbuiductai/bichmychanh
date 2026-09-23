import React from 'react';
import { Phone, MapPin, Sparkles } from 'lucide-react';
import { SchoolLogo } from './SchoolLogo';

interface SchoolBannerProps {
  onLogoClick?: () => void;
  className?: string;
}

export const SchoolBanner: React.FC<SchoolBannerProps> = ({
  onLogoClick,
  className = '',
}) => {
  return (
    <div className={`relative w-full overflow-hidden bg-white select-none ${className}`}>
      {/* Top Royal Blue Line as seen in official banner */}
      <div className="h-1.5 sm:h-2 w-full bg-gradient-to-r from-blue-700 via-sky-600 to-blue-700 border-b border-blue-800/20" />

      {/* Main Banner Container */}
      <div className="relative min-h-[120px] sm:min-h-[145px] md:min-h-[165px] lg:min-h-[185px] w-full flex items-center justify-between overflow-hidden bg-gradient-to-r from-slate-50 via-sky-50/60 to-white">
        
        {/* Background Layer 1: School Campus with Red Poinciana Flowers & Students */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-multiply pointer-events-none"
          style={{ backgroundImage: `url('/school-banner-bg.jpg')` }}
        />
        
        {/* Subtle Gradient Overlays for perfect legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none" />

        {/* ============================================================== */}
        {/* LEFT SECTION: Traditional Dong Son Bronze Drum Motif + School Logo */}
        {/* ============================================================== */}
        <div className="relative z-10 flex-shrink-0 flex items-center justify-center pl-3 sm:pl-6 md:pl-8 py-2 w-[140px] sm:w-[180px] md:w-[220px] lg:w-[260px]">
          {/* Trống Đồng Đông Sơn SVG Watermark behind the logo */}
          <div className="absolute -left-6 sm:left-1 md:left-3 w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 pointer-events-none opacity-40">
            <svg viewBox="0 0 200 200" className="w-full h-full text-sky-700 animate-[spin_120s_linear_infinite]">
              {/* Center 14-pointed Star */}
              <circle cx="100" cy="100" r="14" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="0.8" />
              <g stroke="currentColor" strokeWidth="0.8" fill="none">
                {[...Array(14)].map((_, i) => {
                  const angle = (i * 360) / 14;
                  return (
                    <polygon
                      key={i}
                      points="100,78 97,97 100,100 103,97"
                      transform={`rotate(${angle} 100 100)`}
                      fill="currentColor"
                      fillOpacity="0.25"
                    />
                  );
                })}
              </g>

              {/* Concentric rings */}
              <circle cx="100" cy="100" r="28" stroke="currentColor" strokeWidth="0.8" fill="none" strokeDasharray="1.5,1.5" />
              <circle cx="100" cy="100" r="38" stroke="currentColor" strokeWidth="1" fill="none" />
              
              {/* Flying Lac Birds / Geometric Chevron Ring */}
              <circle cx="100" cy="100" r="48" stroke="currentColor" strokeWidth="0.8" fill="none" strokeDasharray="3,2" />
              <g stroke="currentColor" strokeWidth="0.7" fill="none" opacity="0.6">
                {[...Array(8)].map((_, i) => {
                  const angle = (i * 360) / 8;
                  return (
                    <path
                      key={i}
                      d="M 94,48 Q 100,43 106,48 Q 100,53 94,48 Z"
                      transform={`rotate(${angle} 100 100)`}
                      fill="currentColor"
                      fillOpacity="0.2"
                    />
                  );
                })}
              </g>

              {/* Outer decorative bands */}
              <circle cx="100" cy="100" r="58" stroke="currentColor" strokeWidth="1" fill="none" />
              <circle cx="100" cy="100" r="66" stroke="currentColor" strokeWidth="0.8" fill="none" strokeDasharray="1.5,1.5" />
              <circle cx="100" cy="100" r="76" stroke="currentColor" strokeWidth="1.2" fill="none" />
              <circle cx="100" cy="100" r="86" stroke="currentColor" strokeWidth="0.9" fill="none" strokeDasharray="2,2" />
              <circle cx="100" cy="100" r="95" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
          </div>

          {/* Official Emblem Logo (Diamond Shape) */}
          <div className="relative z-10 transform hover:scale-105 transition-transform duration-300 drop-shadow-md">
            <SchoolLogo
              size="lg"
              showModalOnClick={true}
              shape="rounded"
              className="w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 border-2 border-white shadow-lg ring-1 ring-sky-300 cursor-pointer"
            />
          </div>
        </div>

        {/* ============================================================== */}
        {/* CENTER SECTION: School Typography & Location (Matched to Sample) */}
        {/* ============================================================== */}
        <div className="relative z-10 flex-1 px-2 sm:px-4 md:px-6 text-center flex flex-col justify-center items-center py-2">
          
          {/* Main Title: HỆ THỐNG TRỢ LÝ HỌC TẬP MÔN TIN HỌC */}
          <h1 
            className="text-base sm:text-xl md:text-2xl lg:text-3xl xl:text-[38px] font-black tracking-tight uppercase leading-snug py-0.5 sm:py-1"
            style={{
              fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
              color: '#d11a2a',
              textShadow: `
                -1.5px -1.5px 0 #fff,
                 1.5px -1.5px 0 #fff,
                -1.5px  1.5px 0 #fff,
                 1.5px  1.5px 0 #fff,
                -2px 0 0 #fff,
                 2px 0 0 #fff,
                 0 -2px 0 #fff,
                 0  2px 0 #fff,
                 0 3px 6px rgba(0, 0, 0, 0.45)
              `
            }}
          >
            HỆ THỐNG TRỢ LÝ HỌC TẬP MÔN TIN HỌC
          </h1>

          {/* School Identity & Address Line */}
          <div 
            className="mt-1 sm:mt-1.5 text-[11px] sm:text-xs md:text-sm font-bold text-slate-800 flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5"
            style={{
              textShadow: '0 0 4px #ffffff, 0 0 6px #ffffff, 0 1px 2px rgba(255,255,255,0.9)'
            }}
          >
            <span className="font-extrabold text-blue-900 uppercase">
              TRƯỜNG THPT BÙI DỤC TÀI
            </span>
            <span className="hidden sm:inline text-slate-400">•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-rose-600 flex-shrink-0" />
              <span>Thôn Đông Sơn, Xã Nam Hải Lăng, Tỉnh Quảng Trị</span>
            </span>
          </div>

          {/* Phone / Hotline & Teacher Info */}
          <div 
            className="mt-0.5 text-[10px] sm:text-xs md:text-sm font-bold text-slate-900 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-0.5"
            style={{
              textShadow: '0 0 4px #ffffff, 0 0 6px #ffffff, 0 1px 2px rgba(255,255,255,0.9)'
            }}
          >
            <div className="flex items-center gap-1">
              <Phone className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-blue-700 flex-shrink-0" />
              <a 
                href="tel:02333876253" 
                className="hover:text-blue-700 hover:underline transition-colors font-extrabold"
                title="Gọi đến trường: 02333.876.253"
              >
                SĐT 02333.876.253
              </a>
            </div>
            <span className="text-slate-400 hidden sm:inline">•</span>
            <span className="text-slate-800">
              Phụ trách: <strong className="text-blue-900">Thầy Trần Văn Bích</strong>
            </span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* RIGHT SECTION: Diagonal Clipped School Ceremony Celebration Photo */}
        {/* ============================================================== */}
        <div className="relative h-full self-stretch hidden md:block w-[180px] lg:w-[260px] xl:w-[320px] flex-shrink-0 overflow-hidden">
          {/* Angled White Separator Border */}
          <div 
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              clipPath: 'polygon(22% 0, 100% 0, 100% 100%, 0% 100%)',
              borderLeft: '4px solid #ffffff',
              filter: 'drop-shadow(-3px 0 6px rgba(0,0,0,0.25))'
            }}
          />

          {/* Ceremony Celebration Photo */}
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url('/school-ceremony.jpg')`,
              clipPath: 'polygon(22% 0, 100% 0, 100% 100%, 0% 100%)',
            }}
            title="Lễ kỷ niệm & hoạt động chào mừng tại Trường THPT Bùi Dục Tài"
          />

          {/* Decorative Corner Ribbon/Badge */}
          <div className="absolute top-2 right-2 z-20 bg-rose-600/90 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-xs backdrop-blur-xs hidden lg:flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-amber-300" />
            <span>THPT Bùi Dục Tài</span>
          </div>
        </div>

      </div>

      {/* Bottom Subtle Shadow/Border */}
      <div className="h-0.5 w-full bg-gradient-to-r from-sky-400 via-blue-600 to-sky-400 opacity-60 shadow-xs" />
    </div>
  );
};
