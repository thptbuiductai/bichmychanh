import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  CheckCircle2, 
  BarChart3 
} from 'lucide-react';
import { audioService } from '../utils/audio';

export type TabType = 'dashboard' | 'students' | 'assignments' | 'progress' | 'grades';

interface NavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  studentsCount: number;
  assignmentsCount: number;
  projectorMode: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  studentsCount,
  assignmentsCount,
  projectorMode,
}) => {
  const tabs = [
    {
      id: 'dashboard' as TabType,
      label: '1. Dashboard Tổng quan',
      shortLabel: 'Tổng quan',
      icon: LayoutDashboard,
      color: 'sky',
    },
    {
      id: 'students' as TabType,
      label: '2. Quản lý học sinh',
      shortLabel: 'Học sinh',
      icon: Users,
      badge: studentsCount,
      color: 'blue',
    },
    {
      id: 'assignments' as TabType,
      label: '3. Quản lý nhiệm vụ',
      shortLabel: 'Nhiệm vụ',
      icon: BookOpen,
      badge: assignmentsCount,
      color: 'indigo',
    },
    {
      id: 'progress' as TabType,
      label: '4. Theo dõi tiến độ',
      shortLabel: 'Tiến độ',
      icon: CheckCircle2,
      color: 'emerald',
    },
    {
      id: 'grades' as TabType,
      label: '5. Điểm & Kết quả',
      shortLabel: 'Bảng điểm',
      icon: BarChart3,
      color: 'purple',
    },
  ];

  return (
    <nav className="bg-white border-b border-slate-200/80 shadow-xs sticky top-[73px] z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  audioService.playClick();
                  setActiveTab(tab.id);
                }}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                  projectorMode ? 'text-base sm:text-lg' : 'text-xs sm:text-sm'
                } ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/20 translate-y-[-1px]'
                    : 'text-slate-600 hover:text-sky-700 hover:bg-sky-50/70'
                }`}
              >
                <Icon className={`${projectorMode ? 'w-5 h-5' : 'w-4 h-4'} ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-sky-600'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                      isActive
                        ? 'bg-white/25 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
