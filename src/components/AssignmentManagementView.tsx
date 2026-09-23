import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Edit3, 
  Trash2, 
  X, 
  AlertCircle,
  FileText,
  UserCheck,
  Check,
  Award,
  ChevronDown
} from 'lucide-react';
import { Assignment, Student, Submission } from '../types';
import { audioService } from '../utils/audio';

interface AssignmentManagementViewProps {
  assignments: Assignment[];
  students: Student[];
  submissions: Submission[];
  onAddAssignment: (assignment: Omit<Assignment, 'id' | 'createdAt'>) => void;
  onUpdateAssignment: (assignment: Assignment) => void;
  onDeleteAssignment: (id: string) => void;
  onGradeSubmission: (submissionId: string, score: number, feedback: string) => void;
  projectorMode: boolean;
}

export const AssignmentManagementView: React.FC<AssignmentManagementViewProps> = ({
  assignments,
  students,
  submissions,
  onAddAssignment,
  onUpdateAssignment,
  onDeleteAssignment,
  onGradeSubmission,
  projectorMode,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('Tất cả');
  const [selectedStatus, setSelectedStatus] = useState('Tất cả');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [deletingAssignment, setDeletingAssignment] = useState<Assignment | null>(null);
  const [reviewingAssignment, setReviewingAssignment] = useState<Assignment | null>(null);

  // Grading inside review modal
  const [gradingSubId, setGradingSubId] = useState<string | null>(null);
  const [scoreInput, setScoreInput] = useState<string>('');
  const [feedbackInput, setFeedbackInput] = useState<string>('');

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    topic: 'Lập trình Python',
    targetClass: '10A1',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'Đang diễn ra' as Assignment['status'],
    pointsMax: 10,
  });

  const topics = [
    'Lập trình Python',
    'Cấu trúc dữ liệu & Thuật toán',
    'Mạng máy tính',
    'Cơ sở dữ liệu',
    'Soạn thảo & Trình chiếu',
    'Trí tuệ nhân tạo cơ bản',
  ];

  // Available classes
  const classList = useMemo(() => {
    const set = new Set(students.map((s) => s.classRoom));
    return ['Tất cả', ...Array.from(set).sort()];
  }, [students]);

  // Filtered assignments
  const filteredAssignments = useMemo(() => {
    return assignments.filter((a) => {
      const matchSearch =
        a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchClass = selectedClass === 'Tất cả' || a.targetClass === 'Tất cả' || a.targetClass === selectedClass;
      const matchStatus = selectedStatus === 'Tất cả' || a.status === selectedStatus;
      return matchSearch && matchClass && matchStatus;
    });
  }, [assignments, searchTerm, selectedClass, selectedStatus]);

  const openAddModal = () => {
    audioService.playClick();
    setFormData({
      title: '',
      description: '',
      topic: 'Lập trình Python',
      targetClass: selectedClass !== 'Tất cả' ? selectedClass : '10A1',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Đang diễn ra',
      pointsMax: 10,
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (assignment: Assignment) => {
    audioService.playClick();
    setEditingAssignment(assignment);
    setFormData({
      title: assignment.title,
      description: assignment.description,
      topic: assignment.topic,
      targetClass: assignment.targetClass,
      dueDate: assignment.dueDate,
      status: assignment.status,
      pointsMax: assignment.pointsMax,
    });
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    onAddAssignment(formData);
    audioService.playSuccess();
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAssignment || !formData.title.trim()) return;

    onUpdateAssignment({
      ...editingAssignment,
      ...formData,
    });
    audioService.playSuccess();
    setEditingAssignment(null);
  };

  const handleConfirmDelete = () => {
    if (!deletingAssignment) return;
    onDeleteAssignment(deletingAssignment.id);
    audioService.playDelete();
    setDeletingAssignment(null);
  };

  // Open review submissions drawer
  const handleOpenReview = (assignment: Assignment) => {
    audioService.playClick();
    setReviewingAssignment(assignment);
  };

  // Start grading
  const handleStartGrade = (sub: Submission) => {
    setGradingSubId(sub.id);
    setScoreInput(sub.score !== null ? String(sub.score) : '10');
    setFeedbackInput(sub.feedback || 'Bài làm đạt yêu cầu thực hành.');
  };

  const handleSaveGrade = (submissionId: string) => {
    const num = parseFloat(scoreInput);
    if (isNaN(num) || num < 0 || num > 10) return;
    onGradeSubmission(submissionId, num, feedbackInput);
    audioService.playSuccess();
    setGradingSubId(null);
  };

  const getStatusBadge = (status: Assignment['status']) => {
    switch (status) {
      case 'Đang diễn ra':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Đang diễn ra</span>;
      case 'Sắp hết hạn':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200"><Clock className="w-3 h-3" /> Sắp hết hạn</span>;
      case 'Đã kết thúc':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">Đã kết thúc</span>;
    }
  };

  return (
    <div className={`space-y-6 ${projectorMode ? 'text-base' : 'text-sm'}`}>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            <span>Quản Lý Bài Học & Nhiệm Vụ Tin Học</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Giao bài tập thực hành, chuyên đề Python, Mạng và CSDL cho học sinh Trường THPT Bùi Dục Tài
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo nhiệm vụ mới</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm bài học theo tên, nội dung hoặc chủ đề (Python, SQL...)..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
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
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
          >
            {classList.map((cls) => (
              <option key={cls} value={cls}>
                {cls === 'Tất cả' ? 'Tất cả các lớp' : `Lớp ${cls}`}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
          >
            <option value="Tất cả">Tất cả trạng thái</option>
            <option value="Đang diễn ra">Đang diễn ra</option>
            <option value="Sắp hết hạn">Sắp hết hạn</option>
            <option value="Đã kết thúc">Đã kết thúc</option>
          </select>
        </div>

      </div>

      {/* Assignment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredAssignments.map((assignment) => {
          // Calculate submissions for this assignment
          const assignedStudents = students.filter(
            (s) => assignment.targetClass === 'Tất cả' || s.classRoom === assignment.targetClass
          );
          const totalAssigned = assignedStudents.length || 1;
          const classSubmissions = submissions.filter((s) => s.assignmentId === assignment.id);
          const completedCount = classSubmissions.filter((s) => s.status === 'Đã hoàn thành').length;
          const completionPct = Math.round((completedCount / totalAssigned) * 100);

          return (
            <div
              key={assignment.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-5 space-y-3">
                {/* Badges */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {assignment.topic}
                  </span>
                  {getStatusBadge(assignment.status)}
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-indigo-600 transition-colors">
                    {assignment.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {assignment.description}
                  </p>
                </div>

                {/* Details info */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
                  <div className="flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                    <span>Lớp: <strong className="text-slate-800">{assignment.targetClass}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Hạn: <strong className="text-slate-800">{assignment.dueDate}</strong></span>
                  </div>
                </div>

                {/* Submission Progress bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-medium">Học sinh đã nộp:</span>
                    <span className="font-bold text-slate-800">
                      {completedCount} / {totalAssigned} ({completionPct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        completionPct >= 80 ? 'bg-emerald-500' : completionPct >= 50 ? 'bg-indigo-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${completionPct}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="bg-slate-50/80 px-5 py-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => handleOpenReview(assignment)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Xem nộp & Chấm</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(assignment)}
                    className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-lg transition"
                    title="Chỉnh sửa nhiệm vụ"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      audioService.playClick();
                      setDeletingAssignment(assignment);
                    }}
                    className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-white rounded-lg transition"
                    title="Xóa nhiệm vụ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {filteredAssignments.length === 0 && (
        <div className="bg-white p-12 rounded-2xl border border-slate-200/80 text-center">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-800">Không có nhiệm vụ phù hợp</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Không tìm thấy bài học hoặc nhiệm vụ nào khớp với bộ lọc. Hãy tạo bài tập mới để giao cho học sinh.
          </p>
          <button
            onClick={openAddModal}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow transition"
          >
            Tạo bài học mới
          </button>
        </div>
      )}

      {/* Review Submissions Modal */}
      {reviewingAssignment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col border border-slate-200 animate-in fade-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 flex items-start justify-between bg-slate-50/80 rounded-t-2xl">
              <div>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {reviewingAssignment.topic} • Lớp {reviewingAssignment.targetClass}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {reviewingAssignment.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Hạn nộp: {reviewingAssignment.dueDate} • Thang điểm: {reviewingAssignment.pointsMax}
                </p>
              </div>
              <button
                onClick={() => {
                  setReviewingAssignment(null);
                  setGradingSubId(null);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Submissions List */}
            <div className="p-5 overflow-y-auto space-y-3 flex-1">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Danh sách học sinh & Tình trạng nộp bài
              </div>

              {students
                .filter((s) => reviewingAssignment.targetClass === 'Tất cả' || s.classRoom === reviewingAssignment.targetClass)
                .map((student) => {
                  const sub = submissions.find(
                    (s) => s.assignmentId === reviewingAssignment.id && s.studentId === student.id
                  );
                  const isGradingThis = sub && gradingSubId === sub.id;

                  return (
                    <div
                      key={student.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-indigo-200 transition space-y-2"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-xs font-bold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded">
                            {student.studentCode}
                          </span>
                          <span className="font-semibold text-slate-900 text-sm">
                            {student.name}
                          </span>
                          <span className="text-xs text-slate-400">({student.classRoom})</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {sub && sub.status === 'Đã hoàn thành' ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                              <Check className="w-3 h-3" /> Đã nộp ({sub.submittedAt})
                            </span>
                          ) : sub && sub.status === 'Đang làm' ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                              Đang thực hiện
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                              Chưa nộp bài
                            </span>
                          )}

                          {sub && sub.score !== null && (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
                              {sub.score} / 10 điểm
                            </span>
                          )}

                          {sub && !isGradingThis && (
                            <button
                              onClick={() => handleStartGrade(sub)}
                              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 hover:bg-indigo-100 text-slate-700 hover:text-indigo-700 transition"
                            >
                              {sub.score !== null ? 'Sửa điểm' : 'Chấm điểm'}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Student submission note */}
                      {sub?.studentNote && (
                        <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <strong>Ghi chú bài nộp:</strong> {sub.studentNote}
                        </div>
                      )}

                      {/* Teacher feedback display */}
                      {sub?.feedback && !isGradingThis && (
                        <div className="text-xs text-indigo-700 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100">
                          <strong>Nhận xét của GV Trần Văn Bích:</strong> {sub.feedback}
                        </div>
                      )}

                      {/* Inline Grading Form */}
                      {isGradingThis && (
                        <div className="mt-2 p-3 bg-indigo-50/70 rounded-xl border border-indigo-200 space-y-2 animate-in fade-in">
                          <div className="flex items-center gap-3">
                            <label className="text-xs font-bold text-indigo-900">Điểm số (0 - 10):</label>
                            <input
                              type="number"
                              min={0}
                              max={10}
                              step={0.5}
                              value={scoreInput}
                              onChange={(e) => setScoreInput(e.target.value)}
                              className="w-20 px-2 py-1 bg-white border border-indigo-300 rounded-lg text-sm font-bold text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-bold text-indigo-900 block mb-1">Nhận xét bài làm:</label>
                            <input
                              type="text"
                              value={feedbackInput}
                              onChange={(e) => setFeedbackInput(e.target.value)}
                              placeholder="Ví dụ: Code chạy tốt, thuật toán tối ưu, chú thích rõ ràng..."
                              className="w-full px-3 py-1.5 bg-white border border-indigo-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>

                          <div className="flex justify-end gap-2 pt-1">
                            <button
                              onClick={() => setGradingSubId(null)}
                              className="px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-white rounded-lg transition"
                            >
                              Hủy
                            </button>
                            <button
                              onClick={() => handleSaveGrade(sub.id)}
                              className="px-3 py-1 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs transition"
                            >
                              Lưu điểm & Nhận xét
                            </button>
                          </div>
                        </div>
                      )}

                    </div>
                  );
                })}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end rounded-b-2xl">
              <button
                onClick={() => {
                  setReviewingAssignment(null);
                  setGradingSubId(null);
                }}
                className="px-5 py-2 bg-slate-800 text-white text-xs font-bold rounded-xl hover:bg-slate-900 transition"
              >
                Đóng
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Add Assignment Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-600" />
                <span>Tạo Nhiệm Vụ Học Tập Mới</span>
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tên Nhiệm Vụ / Bài Học *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ví dụ: Thực hành Python 04: Thao tác với Xâu ký tự (String)"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Chủ đề / Chuyên đề</label>
                  <select
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    {topics.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Lớp Áp Dụng</label>
                  <select
                    value={formData.targetClass}
                    onChange={(e) => setFormData({ ...formData, targetClass: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="Tất cả">Tất cả các lớp</option>
                    <option value="10A1">Lớp 10A1</option>
                    <option value="10A2">Lớp 10A2</option>
                    <option value="11A1">Lớp 11A1</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Yêu Cầu & Hướng Dẫn Thực Hành</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mô tả chi tiết nội dung học sinh cần thực hiện trên máy tính phòng máy..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hạn Hoàn Thành</label>
                  <input
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Trạng Thái</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Assignment['status'] })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="Đang diễn ra">Đang diễn ra</option>
                    <option value="Sắp hết hạn">Sắp hết hạn</option>
                    <option value="Đã kết thúc">Đã kết thúc</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow transition"
                >
                  Tạo nhiệm vụ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Assignment Modal */}
      {editingAssignment && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-indigo-600" />
                <span>Chỉnh Sửa Nhiệm Vụ</span>
              </h3>
              <button onClick={() => setEditingAssignment(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tên Nhiệm Vụ</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Chủ đề</label>
                  <select
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    {topics.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Lớp Áp Dụng</label>
                  <select
                    value={formData.targetClass}
                    onChange={(e) => setFormData({ ...formData, targetClass: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="Tất cả">Tất cả các lớp</option>
                    <option value="10A1">Lớp 10A1</option>
                    <option value="10A2">Lớp 10A2</option>
                    <option value="11A1">Lớp 11A1</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nội Dung Yêu Cầu</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hạn Hoàn Thành</label>
                  <input
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Trạng Thái</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Assignment['status'] })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="Đang diễn ra">Đang diễn ra</option>
                    <option value="Sắp hết hạn">Sắp hết hạn</option>
                    <option value="Đã kết thúc">Đã kết thúc</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingAssignment(null)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow transition"
                >
                  Cập nhật nhiệm vụ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deletingAssignment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-rose-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Xóa nhiệm vụ học tập</h3>
            </div>
            <p className="text-sm text-slate-600 mb-5 leading-relaxed">
              Bạn có chắc chắn muốn xóa nhiệm vụ: <strong>{deletingAssignment.title}</strong>? Toàn bộ dữ liệu nộp bài của nhiệm vụ này cũng sẽ bị gỡ bỏ.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeletingAssignment(null)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-sm font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow transition"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
