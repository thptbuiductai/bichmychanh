import React from 'react';
import { 
  Users, 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  Award, 
  ArrowRight, 
  Sparkles, 
  Calendar,
  School,
  TrendingUp,
  FileCheck,
  ChevronRight
} from 'lucide-react';
import { Student, Assignment, Submission, GradeRecord, ActivityLog } from '../types';
import { calculateAverageGrade, getGradeClassification } from '../mockData';
import { TabType } from './Navigation';
import { audioService } from '../utils/audio';
import { SchoolLogo } from './SchoolLogo';

interface DashboardViewProps {
  students: Student[];
  assignments: Assignment[];
  submissions: Submission[];
  grades: GradeRecord[];
  activities: ActivityLog[];
  onNavigate: (tab: TabType) => void;
  projectorMode: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  students,
  assignments,
  submissions,
  grades,
  activities,
  onNavigate,
  projectorMode,
}) => {
  // Compute Key Stats
  const totalStudents = students.length;
  const totalAssignments = assignments.length;
  const activeAssignments = assignments.filter((a) => a.status === 'Đang diễn ra').length;

  const completedSubmissions = submissions.filter((s) => s.status === 'Đã hoàn thành').length;
  const totalSubmissions = submissions.length || 1;
  const overallCompletionRate = Math.round((completedSubmissions / totalSubmissions) * 100);

  // Grade stats
  const validGrades = grades
    .map((g) => calculateAverageGrade(g))
    .filter((g): g is number => g !== null);
  const averageGrade =
    validGrades.length > 0
      ? Number((validGrades.reduce((a, b) => a + b, 0) / validGrades.length).toFixed(1))
      : null;

  // Grade distribution
  const gradeDistribution = {
    gioi: validGrades.filter((g) => g >= 8.0).length,
    kha: validGrades.filter((g) => g >= 6.5 && g < 8.0).length,
    dat: validGrades.filter((g) => g >= 5.0 && g < 6.5).length,
    chuaDat: validGrades.filter((g) => g < 5.0).length,
  };

  // Class stats
  const classes = ['10A1', '10A2', '11A1'];
  const classStats = classes.map((cls) => {
    const classStudents = students.filter((s) => s.classRoom === cls);
    const classStudentIds = new Set(classStudents.map((s) => s.id));
    const classSubs = submissions.filter((s) => classStudentIds.has(s.studentId));
    const completed = classSubs.filter((s) => s.status === 'Đã hoàn thành').length;
    const total = classSubs.length || 1;
    const rate = Math.round((completed / total) * 100);

    const classGrades = grades
      .filter((g) => classStudentIds.has(g.studentId))
      .map((g) => calculateAverageGrade(g))
      .filter((g): g is number => g !== null);
    const avgScore = classGrades.length
      ? Number((classGrades.reduce((a, b) => a + b, 0) / classGrades.length).toFixed(1))
      : null;

    return {
      className: cls,
      studentCount: classStudents.length,
      completionRate: rate,
      avgScore,
    };
  });

  return (
    <div className={`space-y-6 ${projectorMode ? 'text-base' : 'text-sm'}`}>
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-sky-600 via-blue-600 to-indigo-700 rounded-2xl text-white p-6 sm:p-7 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start sm:items-center gap-4">
            <SchoolLogo 
              size="lg" 
              showModalOnClick={true}
              shape="rounded"
              className="hidden sm:inline-flex ring-4 ring-white/30 shadow-lg cursor-pointer hover:scale-105 transition-transform"
            />
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-xs">
                <School className="w-3.5 h-3.5" />
                <span>Năm học 2026 - 2027 • Học kỳ I</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Bảng Quản Trị Học Tập Tin Học
              </h2>
              <p className="text-sky-100 max-w-2xl leading-relaxed text-sm sm:text-base">
                Chào mừng <strong>Thầy Trần Văn Bích</strong> đến với hệ thống theo dõi học tập và thực hành môn Tin học tại <strong>Trường THPT Bùi Dục Tài</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/15 backdrop-blur-md p-4 rounded-xl border border-white/20">
            <div className="text-right">
              <div className="text-xs text-sky-200 uppercase font-semibold tracking-wide">Điểm TB toàn môn</div>
              <div className="text-2xl sm:text-3xl font-black text-amber-300">
                {averageGrade !== null ? `${averageGrade} / 10` : 'Đang cập nhật'}
              </div>
              <div className="text-xs text-emerald-300 font-medium">Đạt chuẩn chất lượng</div>
            </div>
          </div>
        </div>
      </div>

      {/* 5 Core Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Metric 1: Students */}
        <div 
          onClick={() => { audioService.playClick(); onNavigate('students'); }}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-sky-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tổng số học sinh</span>
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{totalStudents}</span>
            <span className="text-xs text-slate-500 font-medium">học sinh</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2.5">
            <span>3 lớp (10A1, 10A2, 11A1)</span>
            <span className="text-sky-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
              Xem danh sách <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Metric 2: Assignments */}
        <div 
          onClick={() => { audioService.playClick(); onNavigate('assignments'); }}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nhiệm vụ học tập</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{totalAssignments}</span>
            <span className="text-xs text-slate-500 font-medium">chủ đề</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2.5">
            <span>Python, CSDL, Mạng</span>
            <span className="text-indigo-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
              Quản lý <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Metric 3: Active tasks */}
        <div 
          onClick={() => { audioService.playClick(); onNavigate('assignments'); }}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-amber-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Đang thực hiện</span>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-600">{activeAssignments}</span>
            <span className="text-xs text-slate-500 font-medium">bài tập đang mở</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2.5">
            <span>Đang thu nhận bài</span>
            <span className="text-amber-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
              Theo dõi <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Metric 4: Completion rate */}
        <div 
          onClick={() => { audioService.playClick(); onNavigate('progress'); }}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tỷ lệ hoàn thành</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-600">{overallCompletionRate}%</span>
            <span className="text-xs text-slate-500 font-medium">đã nộp</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2.5">
            <span>{completedSubmissions} / {totalSubmissions} lượt nộp</span>
            <span className="text-emerald-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
              Chi tiết <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

      </div>

      {/* Visual Chart & Class Progress Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Class Progress Bar Chart */}
        <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-sky-600" />
                <span>Tiến Độ Hoàn Thành Bài Tập Theo Lớp</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Tỷ lệ học sinh đã hoàn thành các bài thực hành đã giao</p>
            </div>
            <button
              onClick={() => { audioService.playClick(); onNavigate('progress'); }}
              className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1"
            >
              Xem chi tiết <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4 pt-2">
            {classStats.map((cls) => (
              <div key={cls.className} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 px-2 py-0.5 bg-slate-100 rounded-md border border-slate-200">
                      Lớp {cls.className}
                    </span>
                    <span className="text-slate-500">({cls.studentCount} học sinh)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-600 font-medium">Điểm TB: <strong className="text-sky-700">{cls.avgScore ?? '-'}</strong></span>
                    <span className="font-extrabold text-sky-700">{cls.completionRate}%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      cls.completionRate >= 80
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                        : cls.completionRate >= 60
                        ? 'bg-gradient-to-r from-sky-500 to-blue-600'
                        : 'bg-gradient-to-r from-amber-500 to-orange-500'
                    }`}
                    style={{ width: `${Math.max(cls.completionRate, 5)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Quick Access Buttons */}
          <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              onClick={() => { audioService.playClick(); onNavigate('students'); }}
              className="p-3 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-xl font-semibold text-xs flex flex-col items-center gap-1.5 transition"
            >
              <Users className="w-5 h-5 text-sky-600" />
              <span>Quản lý học sinh</span>
            </button>
            <button
              onClick={() => { audioService.playClick(); onNavigate('assignments'); }}
              className="p-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-semibold text-xs flex flex-col items-center gap-1.5 transition"
            >
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <span>Giao nhiệm vụ</span>
            </button>
            <button
              onClick={() => { audioService.playClick(); onNavigate('progress'); }}
              className="p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl font-semibold text-xs flex flex-col items-center gap-1.5 transition"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Theo dõi tiến độ</span>
            </button>
            <button
              onClick={() => { audioService.playClick(); onNavigate('grades'); }}
              className="p-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl font-semibold text-xs flex flex-col items-center gap-1.5 transition"
            >
              <BarChart3Icon className="w-5 h-5 text-purple-600" />
              <span>Nhập điểm số</span>
            </button>
          </div>
        </div>

        {/* Grade Classification Distribution */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base sm:text-lg flex items-center gap-2 mb-1">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Phân Bố Kết Quả Học Lực</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">Dựa trên điểm trung bình môn đã chấm</p>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold text-emerald-900">Giỏi (&ge; 8.0)</span>
                </div>
                <span className="text-sm font-extrabold text-emerald-700">{gradeDistribution.gioi} học sinh</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50 border border-blue-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-xs font-bold text-blue-900">Khá (6.5 - 7.9)</span>
                </div>
                <span className="text-sm font-extrabold text-blue-700">{gradeDistribution.kha} học sinh</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50 border border-amber-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-xs font-bold text-amber-900">Đạt (5.0 - 6.4)</span>
                </div>
                <span className="text-sm font-extrabold text-amber-700">{gradeDistribution.dat} học sinh</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-rose-50 border border-rose-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <span className="text-xs font-bold text-rose-900">Chưa đạt (&lt; 5.0)</span>
                </div>
                <span className="text-sm font-extrabold text-rose-700">{gradeDistribution.chuaDat} học sinh</span>
              </div>
            </div>
          </div>

          <div className="mt-5 p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-600">
            <strong>Ghi chú giáo viên:</strong> Tỷ lệ xếp loại Giỏi và Khá đạt <strong>{Math.round(((gradeDistribution.gioi + gradeDistribution.kha) / (validGrades.length || 1)) * 100)}%</strong>, đáp ứng mục tiêu chất lượng môn Tin học.
          </div>
        </div>

      </div>

      {/* Recent Activities & Teacher Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-base sm:text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-sky-600" />
              <span>Hoạt Động Gần Đây</span>
            </h3>
            <span className="text-xs text-slate-500">Cập nhật theo thời gian thực</span>
          </div>

          <div className="space-y-3">
            {activities.slice(0, 5).map((act) => (
              <div
                key={act.id}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-100 hover:bg-slate-100/80 transition"
              >
                <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">{act.title}</span>
                    <span className="text-[11px] text-slate-400 whitespace-nowrap">{act.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{act.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Teacher Memo & Lab Schedule */}
        <div className="bg-gradient-to-br from-slate-900 to-sky-950 text-white p-5 sm:p-6 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-400/30">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm sm:text-base">Thông Báo Bộ Môn</h4>
              <p className="text-xs text-sky-300">Phòng máy Tin học số 1 & 2</p>
            </div>
          </div>

          <div className="space-y-2.5 text-xs text-slate-300">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="font-semibold text-amber-300">Thứ Ba (Tiết 1 - 3):</div>
              <div>Thực hành Python Lớp 10A1 - Phòng máy 1</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="font-semibold text-sky-300">Thứ Năm (Tiết 2 - 4):</div>
              <div>Thực hành CSDL SQL Lớp 11A1 - Phòng máy 2</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="font-semibold text-emerald-300">Lưu ý an toàn:</div>
              <div>Học sinh tắt máy, sắp xếp bàn phím và kiểm tra đường truyền mạng sau mỗi buổi học.</div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

function BarChart3Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  );
}
