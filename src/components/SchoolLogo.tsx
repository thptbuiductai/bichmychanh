import React, { useState } from 'react';
import { School, X, ZoomIn, Award, Sparkles, BookOpen, Atom } from 'lucide-react';

export interface SchoolLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  showModalOnClick?: boolean;
  bordered?: boolean;
  shape?: 'rounded' | 'circle' | 'square';
}

const sizeClasses = {
  xs: 'w-7 h-7',
  sm: 'w-9 h-9',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
  '2xl': 'w-32 h-32',
};

export const SchoolLogo: React.FC<SchoolLogoProps> = ({
  size = 'md',
  className = '',
  showModalOnClick = false,
  bordered = true,
  shape = 'rounded',
}) => {
  const [imgError, setImgError] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const shapeClass = 
    shape === 'circle' 
      ? 'rounded-full' 
      : shape === 'square' 
      ? 'rounded-none' 
      : 'rounded-xl';

  const logoSrc = '/school-logo.jpg';

  const handleClick = () => {
    if (showModalOnClick) {
      setIsOpenModal(true);
    }
  };

  return (
    <>
      <div
        onClick={handleClick}
        className={`relative inline-flex items-center justify-center flex-shrink-0 bg-white shadow-xs overflow-hidden transition-all ${
          sizeClasses[size]
        } ${shapeClass} ${
          bordered ? 'border-2 border-white/80 ring-1 ring-slate-900/10' : ''
        } ${
          showModalOnClick ? 'cursor-pointer hover:scale-105 hover:shadow-md hover:ring-sky-400' : ''
        } ${className}`}
        title={showModalOnClick ? 'Nhấp để xem huy hiệu Trường THPT Bùi Dục Tài' : 'Huy hiệu Trường THPT Bùi Dục Tài'}
      >
        {!imgError ? (
          <img
            src={logoSrc}
            alt="Logo Trường THPT Bùi Dục Tài"
            className="w-full h-full object-contain p-0.5"
            onError={() => setImgError(true)}
            loading="eager"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-sky-500 to-blue-700 flex items-center justify-center text-white">
            <School className="w-1/2 h-1/2" />
          </div>
        )}

        {showModalOnClick && (
          <div className="absolute inset-0 bg-black/0 hover:bg-black/15 transition-colors flex items-center justify-center group">
            <ZoomIn className="w-3.5 h-3.5 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow" />
          </div>
        )}
      </div>

      {/* Lightbox / Info Modal for Official School Emblem */}
      {isOpenModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsOpenModal(false)}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 overflow-hidden relative animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setIsOpenModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center pb-4 border-b border-slate-100">
              <span className="text-xs font-bold text-sky-700 bg-sky-50 px-3 py-1 rounded-full uppercase tracking-wider">
                Huy Hiệu Chính Thức
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-2">
                TRƯỜNG THPT BÙI DỤC TÀI
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Biểu tượng tri thức, truyền thống hiếu học và công nghệ hiện đại
              </p>
            </div>

            {/* Centered High-Res Emblem */}
            <div className="my-6 flex justify-center items-center">
              <div className="w-48 h-48 sm:w-56 sm:h-56 p-2 rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 shadow-inner flex items-center justify-center">
                <img
                  src={logoSrc}
                  alt="Logo Trường THPT Bùi Dục Tài chi tiết"
                  className="w-full h-full object-contain filter drop-shadow-md"
                />
              </div>
            </div>

            {/* Meaning of Symbols */}
            <div className="space-y-2.5 text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
              <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Ý nghĩa các biểu trưng trên huy hiệu:</span>
              </div>
              <ul className="space-y-1.5 pl-1 leading-relaxed text-slate-600">
                <li>• <strong>Hình thoi vươn cao:</strong> Nền tảng phát triển vững vàng và khát vọng vươn lên.</li>
                <li>• <strong>Ngọn đuốc rực sáng & Ngôi sao vàng:</strong> Ánh sáng tri thức và truyền thống học bảng nhãn Bùi Dục Tài.</li>
                <li>• <strong>Quyển sách mở:</strong> Sự nghiệp giáo dục, giảng dạy và học tập không ngừng.</li>
                <li>• <strong>Bông lúa vàng:</strong> Gắn bó với quê hương Quảng Trị anh hùng, trù phú.</li>
                <li>• <strong>Quỹ đạo nguyên tử & Bánh răng:</strong> Tinh thần khoa học tự nhiên, kỹ thuật và tin học công nghệ.</li>
              </ul>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setIsOpenModal(false)}
                className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
