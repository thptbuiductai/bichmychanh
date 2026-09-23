import React, { useState } from 'react';
import { 
  UserCheck, 
  BookOpen, 
  CheckCircle2, 
  BarChart3, 
  Clock, 
  Send, 
  Award, 
  Check, 
  FileText,
  AlertCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { Student, Assignment, Submission, GradeRecord } from '../types';
import { calculateAverageGrade, getGradeClassification } from '../mockData';
import { audioService } from '../utils/audio';
import { SchoolLogo } from './SchoolLogo';

interface StudentPortalViewProps {
  currentStudent: Student;
  assignments: Assignment[];
  submissions: Submission[];
  gradeRecord: GradeRecord | undefined;
  onSubmitAssignment: (assignmentId: string, studentId: string, note: string) => void;
  projectorMode: boolean;
}

export const StudentPortalView: React.FC<StudentPortalViewProps> = ({
  currentStudent,
  assignments,
  submissions,
  gradeRecord,
  onSubmitAssignment,
  projectorMode,
}) => {
  const [submittingTaskId, setSubmittingTaskId] = useState<string | null>(null);
  const [studentNoteInput, setStudentNoteInput] = useState('');

  // Assignments for this student
  const studentTasks = assignments.filter(
    (a) => a.targetClass === 'Tất cả' || a.targetClass === currentStudent.classRoom
  );

  const completedSubs = submissions.filter(
    (s) => s.studentId === currentStudent.id && s.status === 'Đã hoàn thành'
  );
  const completedCount = completedSubs.length;
  const totalTasks = studentTasks.length || 1;
  const progressPct = Math.round((completedCount / totalTasks) * 100);

  // Grade calculation
  const avgScore = calculateAverageGrade(gradeRecord);
  const classification = getGradeClassification(avgScore);

  const handleOpenSubmitModal = (assignmentId: string) => {
    audioService.playClick();
    const existing = submissions.find(
      (s) => s.assignmentId === assignmentId && s.studentId === currentStudent.id
    );
    setStudentNoteInput(existing?.studentNote || '');
    setSubmittingTaskId(assignmentId);
  };

  const handleConfirmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingTaskId) return;

    onSubmitAssignment(submittingTaskId, currentStudent.id, studentNoteInput.trim());
    audioService.playSuccess();
    setSubmittingTaskId(null);
    setStudentNoteInput('');
  };

  return (
    <div className={`space-y-6 ${projectorMode ? 'text-base' : 'text-sm'}`}>
      
      {/* Student Profile Card */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-700 text-white p-6 sm:p-7 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start sm:items-center gap-4">
            <SchoolLogo 
              size="lg" 
              showModalOnClick={true}
              shape="rounded"
              className="hidden sm:inline-flex ring-4 ring-white/30 shadow-lg cursor-pointer hover:scale-105 transition-transform"
            />
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold">
                <UserCheck className="w-3.5 h-3.5" />
                <span>Giao diện Học sinh • THPT Bùi Dục Tài</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black">
                Xin chào, {currentStudent.name}!
              </h2>
              <p className="text-emerald-100 text-sm">
                Lớp: <strong className="text-white">{currentStudent.classRoom}</strong> • Mã học sinh: <strong className="text-white font-mono">{currentStudent.studentCode}</strong> • GV phụ trách: <strong>Thầy Trần Văn Bích</strong>
              </p>
            </div>
          </div>

          <div className="bg-white/15 backdrop-blur-md p-4 rounded-xl border border-white/20 text-right">
            <div className="text-xs text-emerald-100 uppercase font-semibold">Tiến độ bài tập</div>
            <div className="text-3xl font-black text-amber-300">
              {progressPct}%
            </div>
            <div className="text-xs text-emerald-100 font-medium">
              Đã nộp {completedCount} / {studentTasks.length} nhiệm vụ
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Layout: Tasks & Personal Grade */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: My Assignments */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <span>Nhiệm Vụ Học Tập Được Giao ({studentTasks.length})</span>
            </h3>
            <span className="text-xs text-slate-500">Môn Tin học THPT</span>
          </div>

          <div className="space-y-4">
            {studentTasks.map((task) => {
              const sub = submissions.find(
                (s) => s.assignmentId === task.id && s.studentId === currentStudent.id
              );
              const isCompleted = sub && sub.status === 'Đã hoàn thành';

              return (
                <div
                  key={task.id}
                  className={`bg-white rounded-2xl border p-5 transition-all shadow-xs ${
                    isCompleted ? 'border-emerald-200' : 'border-slate-200/80 hover:border-sky-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
                          {task.topic}
                        </span>
                        <span className="text-xs text-slate-400">
                          Hạn chót: <strong className="text-slate-700">{task.dueDate}</strong>
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-base">{task.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{task.description}</p>
                    </div>

                    <div className="flex-shrink-0">
                      {isCompleted ? (
                        <div className="text-right">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <Check className="w-3.5 h-3.5" /> Đã hoàn thành
                          </span>
                          {sub?.submittedAt && (
                            <div className="text-[11px] text-slate-400 mt-1">
                              Nộp lúc: {sub.submittedAt}
                            </div>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => handleOpenSubmitModal(task.id)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Nộp bài thực hành</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Submission note & Teacher feedback if any */}
                  {sub?.studentNote && (
                    <div className="mt-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600">
                      <strong>Bài nộp của em:</strong> {sub.studentNote}
                    </div>
                  )}

                  {sub?.score !== null && sub?.score !== undefined && (
                    <div className="mt-3 p-3 bg-amber-50/80 rounded-xl border border-amber-200 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-amber-900">Điểm đánh giá: </span>
                        <strong className="text-base text-amber-800">{sub.score} / 10</strong>
                      </div>
                      {sub.feedback && (
                        <div className="text-amber-800 italic">
                          "{sub.feedback}" - Thầy Trần Văn Bích
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: My Grade Report Card */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-600" />
            <span>Kết Quả Học Tập Cá Nhân</span>
          </h3>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            
            {/* GPA Big Circle */}
            <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-100">
              <div className="text-xs font-bold text-purple-600 uppercase tracking-wider">Điểm Trung Bình Môn</div>
              <div className="text-4xl font-black text-purple-900 mt-1">
                {avgScore !== null ? avgScore : 'Chưa đủ'}
              </div>
              <div className="mt-2">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${classification.badgeBg}`}>
                  Xếp loại: {classification.label}
                </span>
              </div>
            </div>

            {/* Individual score rows */}
            <div className="space-y-2 text-xs divide-y divide-slate-100">
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Kiểm tra thường xuyên 1 (HS 1):</span>
                <span className="font-bold text-slate-800">{gradeRecord?.tx1 ?? '-'}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Kiểm tra thường xuyên 2 (HS 1):</span>
                <span className="font-bold text-slate-800">{gradeRecord?.tx2 ?? '-'}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Thực hành phòng máy (HS 1):</span>
                <span className="font-bold text-slate-800">{gradeRecord?.practice ?? '-'}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Kiểm tra Giữa kỳ (HS 2):</span>
                <span className="font-bold text-slate-800">{gradeRecord?.midTerm ?? '-'}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Kiểm tra Cuối kỳ (HS 3):</span>
                <span className="font-bold text-slate-800">{gradeRecord?.finalTerm ?? '-'}</span>
              </div>
            </div>

            {/* Teacher Remarks */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-700">
              <strong className="block text-slate-900 mb-1">Nhận xét của GV Trần Văn Bích:</strong>
              {gradeRecord?.teacherNote || 'Em tiếp tục phát huy tinh thần tự học và thực hành chăm chỉ nhé!'}
            </div>

            <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 text-xs text-sky-800">
              <strong>Ghi chú:</strong> Khi gặp khó khăn trong quá trình làm bài thực hành Python hoặc CSDL, em hãy trao đổi trực tiếp với thầy trong giờ thực hành phòng máy hoặc gửi phản hồi qua hệ thống.
            </div>

          </div>
        </div>

      </div>

      {/* Submit Assignment Modal */}
      {submittingTaskId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Send className="w-5 h-5 text-emerald-600" />
              <span>Nộp Bài Thực Hành</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Ghi lại thông tin bài làm, tên file đã lưu trên máy phòng máy hoặc ghi chú kết quả chạy chương trình
            </p>

            <form onSubmit={handleConfirmSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nội dung báo cáo nộp bài *
                </label>
                <textarea
                  rows={4}
                  required
                  value={studentNoteInput}
                  onChange={(e) => setStudentNoteInput(e.target.value)}
                  placeholder="Ví dụ: Em đã hoàn thành bài tập Python. Đã lưu file baitap_th01.py vào thư mục D:\BaiTap_10A1 trên máy tính số 08 phòng máy..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSubmittingTaskId(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow transition"
                >
                  Xác nhận nộp bài
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
