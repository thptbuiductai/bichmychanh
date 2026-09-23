import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  Search, 
  Filter, 
  Clock, 
  AlertTriangle, 
  X, 
  Eye, 
  Send, 
  Check, 
  Award,
  ChevronRight,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { Student, Assignment, Submission } from '../types';
import { audioService } from '../utils/audio';

interface ProgressTrackingViewProps {
  students: Student[];
  assignments: Assignment[];
  submissions: Submission[];
  onSendReminder: (studentName: string) => void;
  projectorMode: boolean;
}

export const ProgressTrackingView: React.FC<ProgressTrackingViewProps> = ({
  students,
  assignments,
  submissions,
  onSendReminder,
  projectorMode,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('Tất cả');
  const [sortBy, setSortBy] = useState<'rateDesc' | 'rateAsc' | 'name'>('rateDesc');
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<Student | null>(null);

  // Class list
  const classList = useMemo(() => {
    const set = new Set(students.map((s) => s.classRoom));
    return ['Tất cả', ...Array.from(set).sort()];
  }, [students]);

  // Overall class cards data
  const classOverviews = useMemo(() => {
    const classes = ['10A1', '10A2', '11A1'];
    return classes.map((cls) => {
      const clsStudents = students.filter((s) => s.classRoom === cls);
      const studentIds = new Set(clsStudents.map((s) => s.id));
      const clsTasks = assignments.filter((a) => a.targetClass === 'Tất cả' || a.targetClass === cls);
      const totalPossibleTasks = clsStudents.length * clsTasks.length || 1;

      const clsSubs = submissions.filter(
        (s) => studentIds.has(s.studentId) && s.status === 'Đã hoàn thành'
      );
      const rate = Math.round((clsSubs.length / totalPossibleTasks) * 100);

      return {
        className: cls,
        studentCount: clsStudents.length,
        taskCount: clsTasks.length,
        completedCount: clsSubs.length,
        totalPossibleTasks,
        rate,
      };
    });
  }, [students, assignments, submissions]);

  // Individual Student Progress items
  const studentProgressList = useMemo(() => {
    return students
      .map((student) => {
        const applicableAssignments = assignments.filter(
          (a) => a.targetClass === 'Tất cả' || a.targetClass === student.classRoom
        );
        const totalAssigned = applicableAssignments.length;

        const studentSubs = submissions.filter(
          (s) => s.studentId === student.id && s.status === 'Đã hoàn thành'
        );
        const completedCount = studentSubs.length;
        const uncompletedCount = Math.max(0, totalAssigned - completedCount);
        const completionRate = totalAssigned > 0 ? Math.round((completedCount / totalAssigned) * 100) : 0;

        return {
          student,
          applicableAssignments,
          totalAssigned,
          completedCount,
          uncompletedCount,
          completionRate,
        };
      })
      .filter((item) => {
        const matchSearch =
          item.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.student.studentCode.toLowerCase().includes(searchTerm.toLowerCase());
        const matchClass = selectedClass === 'Tất cả' || item.student.classRoom === selectedClass;
        return matchSearch && matchClass;
      })
      .sort((a, b) => {
        if (sortBy === 'rateDesc') return b.completionRate - a.completionRate;
        if (sortBy === 'rateAsc') return a.completionRate - b.completionRate;
        return a.student.name.localeCompare(b.student.name);
      });
  }, [students, assignments, submissions, searchTerm, selectedClass, sortBy]);

  const handleOpenStudentDetail = (st: Student) => {
    audioService.playClick();
    setSelectedStudentDetail(st);
  };

  return (
    <div className={`space-y-6 ${projectorMode ? 'text-base' : 'text-sm'}`}>
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            <span>Theo Dõi Tiến Độ Học Tập Tin Học</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Theo dõi tỷ lệ hoàn thành nhiệm vụ thực hành và bài tập lập trình của từng học sinh
          </p>
        </div>
      </div>

      {/* Class Level Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {classOverviews.map((c) => (
          <div
            key={c.className}
            className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-base text-slate-800 px-3 py-1 bg-slate-100 rounded-xl">
                Lớp {c.className}
              </span>
              <span className="text-2xl font-black text-emerald-600">
                {c.rate}%
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Tiến độ toàn lớp:</span>
                <span>{c.completedCount} / {c.totalPossibleTasks} bài nộp</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-700"
                  style={{ width: `${c.rate}%` }}
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-between text-xs text-slate-500">
              <span>Sĩ số: <strong>{c.studentCount} HS</strong></span>
              <span>Đã giao: <strong>{c.taskCount} bài</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên học sinh hoặc mã số..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
            <Filter className="w-3.5 h-3.5" />
            <span>Lớp:</span>
          </div>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            {classList.map((cls) => (
              <option key={cls} value={cls}>
                {cls === 'Tất cả' ? 'Tất cả các lớp' : `Lớp ${cls}`}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="rateDesc">Tỷ lệ: Cao đến thấp</option>
            <option value="rateAsc">Tỷ lệ: Thấp đến cao</option>
            <option value="name">Sắp xếp theo tên</option>
          </select>
        </div>

      </div>

      {/* Student Progress Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-xs font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-4 text-center w-14">STT</th>
                <th className="py-3.5 px-4">Mã HS</th>
                <th className="py-3.5 px-4">Họ và Tên</th>
                <th className="py-3.5 px-4 text-center">Lớp</th>
                <th className="py-3.5 px-4 text-center">Đã giao</th>
                <th className="py-3.5 px-4 text-center">Đã nộp</th>
                <th className="py-3.5 px-4 text-center">Chưa nộp</th>
                <th className="py-3.5 px-4" style={{ minWidth: '180px' }}>Tỷ lệ hoàn thành</th>
                <th className="py-3.5 px-4 text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {studentProgressList.map((item, index) => (
                <tr key={item.student.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 text-center text-slate-400 font-medium">
                    {index + 1}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-sky-800">
                    {item.student.studentCode}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {item.student.name}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-bold px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 text-xs">
                      {item.student.classRoom}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-semibold text-slate-700">
                    {item.totalAssigned}
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-emerald-600">
                    {item.completedCount}
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-rose-600">
                    {item.uncompletedCount}
                  </td>
                  <td className="py-3 px-4">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-700">{item.completionRate}%</span>
                        {item.completionRate === 100 ? (
                          <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5">
                            <Check className="w-3 h-3" /> Hoàn tất
                          </span>
                        ) : item.uncompletedCount > 0 ? (
                          <span className="text-[11px] text-amber-600 font-medium">
                            Còn {item.uncompletedCount} bài
                          </span>
                        ) : null}
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            item.completionRate >= 80
                              ? 'bg-emerald-500'
                              : item.completionRate >= 50
                              ? 'bg-sky-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${item.completionRate}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {item.uncompletedCount > 0 && (
                        <button
                          onClick={() => {
                            audioService.playClick();
                            onSendReminder(item.student.name);
                          }}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition"
                          title="Gửi tin nhắn nhắc nhở nộp bài tập"
                        >
                          Nhắc nhở
                        </button>
                      )}
                      <button
                        onClick={() => handleOpenStudentDetail(item.student)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition"
                        title="Xem chi tiết các bài tập của học sinh"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Progress Detail Modal */}
      {selectedStudentDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">
                  Lớp {selectedStudentDetail.classRoom} • Mã HS: {selectedStudentDetail.studentCode}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  Hồ Sơ Tiến Độ: {selectedStudentDetail.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Đánh giá chi tiết các bài thực hành đã giao và tình trạng nộp bài
                </p>
              </div>
              <button
                onClick={() => setSelectedStudentDetail(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List of assignments for this student */}
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {assignments
                .filter(
                  (a) => a.targetClass === 'Tất cả' || a.targetClass === selectedStudentDetail.classRoom
                )
                .map((a) => {
                  const sub = submissions.find(
                    (s) => s.assignmentId === a.id && s.studentId === selectedStudentDetail.id
                  );
                  const isCompleted = sub && sub.status === 'Đã hoàn thành';

                  return (
                    <div
                      key={a.id}
                      className={`p-3.5 rounded-xl border transition ${
                        isCompleted
                          ? 'border-emerald-200 bg-emerald-50/40'
                          : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                              {a.topic}
                            </span>
                            <span className="text-xs text-slate-400">Hạn: {a.dueDate}</span>
                          </div>
                          <h4 className="font-bold text-sm text-slate-900">{a.title}</h4>
                          <p className="text-xs text-slate-600">{a.description}</p>
                        </div>

                        <div>
                          {isCompleted ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 shadow-2xs">
                              <Check className="w-3.5 h-3.5" /> Đã nộp
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-white px-2.5 py-1 rounded-lg border border-rose-200 shadow-2xs">
                              <Clock className="w-3.5 h-3.5" /> Chưa nộp
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Score and notes */}
                      {sub?.score !== null && sub?.score !== undefined && (
                        <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                          <span className="text-slate-600 font-medium">Điểm đánh giá:</span>
                          <span className="font-extrabold text-indigo-700 text-sm">{sub.score} / 10</span>
                        </div>
                      )}

                      {sub?.feedback && (
                        <div className="mt-1 text-xs text-indigo-700 bg-white/80 p-2 rounded-lg border border-indigo-100">
                          <strong>GV Trần Văn Bích:</strong> {sub.feedback}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedStudentDetail(null)}
                className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-xl hover:bg-slate-900 transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
