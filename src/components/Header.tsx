import React, { useState } from 'react';
import { 
  GraduationCap, 
  UserCheck, 
  Users, 
  Volume2, 
  VolumeX, 
  Monitor, 
  Download, 
  RotateCcw,
  Sparkles,
  School,
  Laptop
} from 'lucide-react';
import { Student, UserRole } from '../types';
import { audioService } from '../utils/audio';
import { SchoolBanner } from './SchoolBanner';

interface HeaderProps {
  role: UserRole;
  setRole: (role: UserRole) => void;
  students: Student[];
  currentStudentId: string;
  setCurrentStudentId: (id: string) => void;
  projectorMode: boolean;
  setProjectorMode: React.Dispatch<React.SetStateAction<boolean>>;
  onResetData: () => void;
  onExportHTML: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  role,
  setRole,
  students,
  currentStudentId,
  setCurrentStudentId,
  projectorMode,
  setProjectorMode,
  onResetData,
  onExportHTML,
}) => {
  const [isAudioMuted, setIsAudioMuted] = useState(audioService.getIsMuted());
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const toggleSound = () => {
    const isNowPlaying = audioService.toggleMute();
    setIsAudioMuted(!isNowPlaying);
  };

  const handleRoleChange = (newRole: UserRole) => {
    audioService.playClick();
    setRole(newRole);
  };

  return (
    <header className="w-full shadow-lg border-b border-sky-800/40 sticky top-0 z-40">
      {/* 1. Official School Header Banner matching sample */}
      <SchoolBanner />

      {/* 2. Management & Control Bar for Teacher Tran Van Bich & Students */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-blue-950 text-white border-t border-sky-600/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            
            {/* System Info & Teacher in charge */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300">
                <Laptop className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-sky-200 tracking-wide">
                    HỆ THỐNG TRỢ LÝ HỌC TẬP TIN HỌC THPT
                  </span>
                  <span className="hidden sm:inline-block text-[11px] px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-medium">
                    2026 - 2027
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Phụ trách chuyên môn: <span className="text-amber-300 font-bold">Thầy Trần Văn Bích</span> • Bộ môn Tin học
                </p>
              </div>
            </div>

            {/* Right Action Controls: Role switch, sound, projector, export */}
            <div className="flex flex-wrap items-center gap-2">
              
              {/* Role Switcher */}
              <div className="bg-slate-800/90 p-1 rounded-xl border border-sky-700/60 flex items-center shadow-inner">
                <button
                  onClick={() => handleRoleChange('teacher')}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
                    role === 'teacher'
                      ? 'bg-sky-500 text-white shadow-sm ring-1 ring-sky-300'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                  }`}
                  title="Dành cho Giáo viên Trần Văn Bích quản lý toàn diện lớp học"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>GV Trần Văn Bích</span>
                </button>

                <button
                  onClick={() => handleRoleChange('student')}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
                    role === 'student'
                      ? 'bg-emerald-500 text-white shadow-sm ring-1 ring-emerald-300'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                  }`}
                  title="Dành cho Học sinh nộp bài và xem điểm cá nhân"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Học sinh</span>
                </button>
              </div>

              {/* Student Selector if in Student Mode */}
              {role === 'student' && (
                <div className="flex items-center gap-1.5 bg-slate-800/90 px-2.5 py-1.5 rounded-xl border border-emerald-500/60 text-xs text-white">
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-slate-300 hidden sm:inline">Chọn HS:</span>
                  <select
                    value={currentStudentId}
                    onChange={(e) => {
                      audioService.playClick();
                      setCurrentStudentId(e.target.value);
                    }}
                    className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer"
                  >
                    {students.map((st) => (
                      <option key={st.id} value={st.id} className="bg-slate-800 text-white">
                        {st.name} ({st.classRoom})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Projector Mode Toggle */}
              <button
                onClick={() => {
                  audioService.playClick();
                  setProjectorMode((prev) => !prev);
                }}
                className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                  projectorMode
                    ? 'bg-amber-500/25 border-amber-400 text-amber-300 shadow-sm'
                    : 'bg-slate-800/90 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
                title="Chế độ máy chiếu (phóng to cỡ chữ và tăng độ tương phản trong lớp học)"
              >
                <Monitor className="w-4 h-4" />
                <span className="hidden md:inline">Máy chiếu</span>
              </button>

              {/* Audio Toggle */}
              <button
                onClick={toggleSound}
                className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                  !isAudioMuted
                    ? 'bg-sky-500/25 border-sky-400 text-sky-300'
                    : 'bg-slate-800/90 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700/60'
                }`}
                title={isAudioMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
              >
                {!isAudioMuted ? <Volume2 className="w-4 h-4 text-sky-400" /> : <VolumeX className="w-4 h-4" />}
                <span className="hidden md:inline">{!isAudioMuted ? 'Âm thanh' : 'Tắt âm'}</span>
              </button>

              {/* Export Standalone Offline HTML */}
              <button
                onClick={() => {
                  audioService.playSuccess();
                  onExportHTML();
                }}
                className="p-2 bg-slate-800/90 hover:bg-sky-600/40 border border-slate-700 hover:border-sky-400 text-slate-200 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                title="Tải về file HTML độc lập mở offline trên máy tính phòng máy không cần mạng internet"
              >
                <Download className="w-4 h-4 text-sky-400" />
                <span className="hidden xl:inline">Tải HTML offline</span>
              </button>

              {/* Reset Demo Data Button */}
              <button
                onClick={() => setShowConfirmReset(true)}
                className="p-2 bg-slate-800/90 hover:bg-rose-900/30 border border-slate-700 hover:border-rose-600/50 text-slate-300 hover:text-rose-300 rounded-xl text-xs font-semibold transition-all"
                title="Khôi phục lại dữ liệu mẫu chuẩn THPT Bùi Dục Tài"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Reset */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-amber-600 mb-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <RotateCcw className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Khôi phục dữ liệu mẫu?</h3>
            </div>
            <p className="text-sm text-slate-600 mb-5 leading-relaxed">
              Thao tác này sẽ đặt lại toàn bộ danh sách học sinh, bài tập nhiệm vụ và bảng điểm về dữ liệu mẫu chuẩn của Trường THPT Bùi Dục Tài.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => {
                  setShowConfirmReset(false);
                  audioService.playSuccess();
                  onResetData();
                }}
                className="px-4 py-2 text-sm font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow transition"
              >
                Đồng ý khôi phục
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
