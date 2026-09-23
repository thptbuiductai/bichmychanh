import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Search, 
  Filter, 
  Edit3, 
  Printer, 
  Award, 
  Check, 
  X, 
  TrendingUp, 
  GraduationCap,
  Save,
  HelpCircle
} from 'lucide-react';
import { Student, GradeRecord } from '../types';
import { calculateAverageGrade, getGradeClassification } from '../mockData';
import { audioService } from '../utils/audio';
import { SchoolLogo } from './SchoolLogo';

interface GradesViewProps {
  students: Student[];
  grades: GradeRecord[];
  onUpdateGrade: (grade: GradeRecord) => void;
  projectorMode: boolean;
}

export const GradesView: React.FC<GradesViewProps> = ({
  students,
  grades,
  onUpdateGrade,
  projectorMode,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('Tất cả');
  const [editingGrade, setEditingGrade] = useState<{ student: Student; grade: GradeRecord } | null>(null);

  // Edit form state
  const [gradeForm, setGradeForm] = useState<{
    tx1: string;
    tx2: string;
    practice: string;
    midTerm: string;
    finalTerm: string;
    teacherNote: string;
  }>({
    tx1: '',
    tx2: '',
    practice: '',
    midTerm: '',
    finalTerm: '',
    teacherNote: '',
  });

  // Available classes
  const classList = useMemo(() => {
    const set = new Set(students.map((s) => s.classRoom));
    return ['Tất cả', ...Array.from(set).sort()];
  }, [students]);

  // Combined student + grade records
  const studentGradesList = useMemo(() => {
    return students
      .map((student) => {
        const gradeRecord = grades.find((g) => g.studentId === student.id) || {
          id: `gr-${student.id}`,
          studentId: student.id,
          tx1: null,
          tx2: null,
          practice: null,
          midTerm: null,
          finalTerm: null,
          teacherNote: '',
        };
        const avg = calculateAverageGrade(gradeRecord);
        const classification = getGradeClassification(avg);

        return {
          student,
          gradeRecord,
          avg,
          classification,
        };
      })
      .filter((item) => {
        const matchSearch =
          item.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.student.studentCode.toLowerCase().includes(searchTerm.toLowerCase());
        const matchClass = selectedClass === 'Tất cả' || item.student.classRoom === selectedClass;
        return matchSearch && matchClass;
      });
  }, [students, grades, searchTerm, selectedClass]);

  // Summary Metrics for current filtered view
  const summaryMetrics = useMemo(() => {
    const validScores = studentGradesList
      .map((i) => i.avg)
      .filter((s): s is number => s !== null);

    if (validScores.length === 0) {
      return { avg: null, max: null, min: null, passRate: 0, total: 0 };
    }

    const sum = validScores.reduce((a, b) => a + b, 0);
    const avg = Number((sum / validScores.length).toFixed(1));
    const max = Math.max(...validScores);
    const min = Math.min(...validScores);
    const passCount = validScores.filter((s) => s >= 5.0).length;
    const passRate = Math.round((passCount / validScores.length) * 100);

    return { avg, max, min, passRate, total: validScores.length };
  }, [studentGradesList]);

  const openEditModal = (student: Student, grade: GradeRecord) => {
    audioService.playClick();
    setEditingGrade({ student, grade });
    setGradeForm({
      tx1: grade.tx1 !== null ? String(grade.tx1) : '',
      tx2: grade.tx2 !== null ? String(grade.tx2) : '',
      practice: grade.practice !== null ? String(grade.practice) : '',
      midTerm: grade.midTerm !== null ? String(grade.midTerm) : '',
      finalTerm: grade.finalTerm !== null ? String(grade.finalTerm) : '',
      teacherNote: grade.teacherNote || '',
    });
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGrade) return;

    const parseScore = (val: string) => {
      if (val === '' || val.trim() === '') return null;
      const num = parseFloat(val);
      if (isNaN(num)) return null;
      return Math.max(0, Math.min(10, num));
    };

    const updated: GradeRecord = {
      ...editingGrade.grade,
      tx1: parseScore(gradeForm.tx1),
      tx2: parseScore(gradeForm.tx2),
      practice: parseScore(gradeForm.practice),
      midTerm: parseScore(gradeForm.midTerm),
      finalTerm: parseScore(gradeForm.finalTerm),
      teacherNote: gradeForm.teacherNote.trim(),
    };

    onUpdateGrade(updated);
    audioService.playSuccess();
    setEditingGrade(null);
  };

  const handlePrint = () => {
    audioService.playClick();
    window.print();
  };

  return (
    <div className={`space-y-6 ${projectorMode ? 'text-base' : 'text-sm'}`}>
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <SchoolLogo 
            size="md" 
            showModalOnClick={true}
            shape="rounded"
            className="cursor-pointer hover:scale-105 transition-transform"
          />
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-purple-600" />
              <span>Bảng Điểm & Kết Quả Học Tập Tin Học</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Trường THPT Bùi Dục Tài • Giáo viên phụ trách: <strong>Trần Văn Bích</strong> • Đánh giá theo quy chế THPT
            </p>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition"
          title="In bảng điểm ra giấy hoặc xuất PDF"
        >
          <Printer className="w-4 h-4" />
          <span>In bảng điểm / PDF</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Điểm Trung Bình Lớp</div>
          <div className="mt-2 text-3xl font-black text-purple-700">
            {summaryMetrics.avg !== null ? summaryMetrics.avg : '-'}
          </div>
          <div className="text-xs text-slate-400 mt-1">Thang điểm 10 chuẩn</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Điểm Cao Nhất</div>
          <div className="mt-2 text-3xl font-black text-emerald-600">
            {summaryMetrics.max !== null ? summaryMetrics.max : '-'}
          </div>
          <div className="text-xs text-slate-400 mt-1">Thành tích cao nhất</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Điểm Thấp Nhất</div>
          <div className="mt-2 text-3xl font-black text-slate-700">
            {summaryMetrics.min !== null ? summaryMetrics.min : '-'}
          </div>
          <div className="text-xs text-slate-400 mt-1">Cần hỗ trợ ôn luyện</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tỷ Lệ Đạt (&ge; 5.0)</div>
          <div className="mt-2 text-3xl font-black text-blue-600">
            {summaryMetrics.passRate}%
          </div>
          <div className="text-xs text-slate-400 mt-1">{summaryMetrics.total} học sinh đã có điểm</div>
        </div>

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
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
          />
        </div>

        {/* Filter by class */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
            <Filter className="w-3.5 h-3.5" />
            <span>Lọc lớp:</span>
          </div>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          >
            {classList.map((cls) => (
              <option key={cls} value={cls}>
                {cls === 'Tất cả' ? 'Tất cả các lớp' : `Lớp ${cls}`}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Grade Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-xs font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-3 text-center w-12">STT</th>
                <th className="py-3.5 px-3">Mã HS</th>
                <th className="py-3.5 px-3">Họ và Tên</th>
                <th className="py-3.5 px-3 text-center">Lớp</th>
                <th className="py-3.5 px-3 text-center" title="Kiểm tra thường xuyên 1 (Hệ số 1)">TX 1</th>
                <th className="py-3.5 px-3 text-center" title="Kiểm tra thường xuyên 2 (Hệ số 1)">TX 2</th>
                <th className="py-3.5 px-3 text-center" title="Thực hành phòng máy (Hệ số 1)">Thực hành</th>
                <th className="py-3.5 px-3 text-center" title="Điểm giữa kỳ (Hệ số 2)">Giữa kỳ</th>
                <th className="py-3.5 px-3 text-center" title="Điểm cuối kỳ (Hệ số 3)">Cuối kỳ</th>
                <th className="py-3.5 px-3 text-center font-black text-purple-900 bg-purple-50/50">Điểm TB</th>
                <th className="py-3.5 px-3 text-center">Xếp loại</th>
                <th className="py-3.5 px-3 text-right">Nhập điểm</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {studentGradesList.map((item, index) => (
                <tr key={item.student.id} className="hover:bg-purple-50/30 transition-colors group">
                  <td className="py-3 px-3 text-center text-slate-400 font-medium">
                    {index + 1}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-sky-800">
                    {item.student.studentCode}
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-900">
                    {item.student.name}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="font-bold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 text-xs">
                      {item.student.classRoom}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-medium text-slate-700">
                    {item.gradeRecord.tx1 !== null ? item.gradeRecord.tx1 : <span className="text-slate-300">-</span>}
                  </td>
                  <td className="py-3 px-3 text-center font-medium text-slate-700">
                    {item.gradeRecord.tx2 !== null ? item.gradeRecord.tx2 : <span className="text-slate-300">-</span>}
                  </td>
                  <td className="py-3 px-3 text-center font-medium text-slate-700">
                    {item.gradeRecord.practice !== null ? item.gradeRecord.practice : <span className="text-slate-300">-</span>}
                  </td>
                  <td className="py-3 px-3 text-center font-medium text-slate-700">
                    {item.gradeRecord.midTerm !== null ? item.gradeRecord.midTerm : <span className="text-slate-300">-</span>}
                  </td>
                  <td className="py-3 px-3 text-center font-medium text-slate-700">
                    {item.gradeRecord.finalTerm !== null ? item.gradeRecord.finalTerm : <span className="text-slate-300">-</span>}
                  </td>
                  <td className="py-3 px-3 text-center bg-purple-50/40">
                    {item.avg !== null ? (
                      <strong className="text-purple-800 font-black text-sm">{item.avg}</strong>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${item.classification.badgeBg}`}>
                      {item.classification.label}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => openEditModal(item.student, item.gradeRecord)}
                      className="px-2.5 py-1 text-xs font-bold rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 transition inline-flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Sửa điểm</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grade Calculation Formula Info */}
      <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
        <HelpCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-slate-800 text-sm">Công thức tính điểm môn Tin học THPT Bùi Dục Tài:</div>
          <p>
            • <strong>Điểm Trung Bình (ĐTB)</strong> = (TX1 + TX2 + Thực hành + Giữa kỳ × 2 + Cuối kỳ × 3) / 8.
          </p>
          <p>
            • <strong>Xếp loại:</strong> Giỏi (&ge; 8.0) | Khá (6.5 - 7.9) | Đạt (5.0 - 6.4) | Chưa đạt (&lt; 5.0).
          </p>
        </div>
      </div>

      {/* Edit Grade Modal */}
      {editingGrade && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-purple-600" />
                  <span>Nhập Điểm: {editingGrade.student.name}</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Lớp: {editingGrade.student.classRoom} • Mã HS: {editingGrade.student.studentCode}
                </p>
              </div>
              <button
                onClick={() => setEditingGrade(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGrade} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">TX 1 (Hệ số 1)</label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    step={0.1}
                    value={gradeForm.tx1}
                    onChange={(e) => setGradeForm({ ...gradeForm, tx1: e.target.value })}
                    placeholder="0 - 10"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-center focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">TX 2 (Hệ số 1)</label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    step={0.1}
                    value={gradeForm.tx2}
                    onChange={(e) => setGradeForm({ ...gradeForm, tx2: e.target.value })}
                    placeholder="0 - 10"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-center focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Thực hành (HS 1)</label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    step={0.1}
                    value={gradeForm.practice}
                    onChange={(e) => setGradeForm({ ...gradeForm, practice: e.target.value })}
                    placeholder="0 - 10"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-center focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Giữa kỳ (Hệ số 2)</label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    step={0.1}
                    value={gradeForm.midTerm}
                    onChange={(e) => setGradeForm({ ...gradeForm, midTerm: e.target.value })}
                    placeholder="0 - 10"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-center focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Cuối kỳ (Hệ số 3)</label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    step={0.1}
                    value={gradeForm.finalTerm}
                    onChange={(e) => setGradeForm({ ...gradeForm, finalTerm: e.target.value })}
                    placeholder="0 - 10"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-center focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nhận xét của GV Trần Văn Bích</label>
                <textarea
                  rows={2}
                  value={gradeForm.teacherNote}
                  onChange={(e) => setGradeForm({ ...gradeForm, teacherNote: e.target.value })}
                  placeholder="Ghi nhận sự tiến bộ hoặc nhắc nhở học sinh..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingGrade(null)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow transition"
                >
                  Lưu điểm số
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
