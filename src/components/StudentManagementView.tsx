import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Filter, 
  GraduationCap, 
  X, 
  Check, 
  AlertCircle,
  FileSpreadsheet,
  UserCheck
} from 'lucide-react';
import { Student } from '../types';
import { audioService } from '../utils/audio';

interface StudentManagementViewProps {
  students: Student[];
  onAddStudent: (newStudent: Omit<Student, 'id' | 'avatarSeed'>) => void;
  onUpdateStudent: (updatedStudent: Student) => void;
  onDeleteStudent: (id: string) => void;
  projectorMode: boolean;
}

export const StudentManagementView: React.FC<StudentManagementViewProps> = ({
  students,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  projectorMode,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('Tất cả');
  const [selectedStatus, setSelectedStatus] = useState<string>('Tất cả');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    studentCode: '',
    name: '',
    classRoom: '10A1',
    gender: 'Nam' as 'Nam' | 'Nữ',
    status: 'Đang học' as Student['status'],
    notes: '',
  });

  // Extract available classes
  const classList = useMemo(() => {
    const set = new Set(students.map((s) => s.classRoom));
    return ['Tất cả', ...Array.from(set).sort()];
  }, [students]);

  // Filtered students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.studentCode.toLowerCase().includes(searchTerm.toLowerCase());
      const matchClass = selectedClass === 'Tất cả' || s.classRoom === selectedClass;
      const matchStatus = selectedStatus === 'Tất cả' || s.status === selectedStatus;
      return matchSearch && matchClass && matchStatus;
    });
  }, [students, searchTerm, selectedClass, selectedStatus]);

  const openAddModal = () => {
    audioService.playClick();
    // Auto-generate a student code suggestion
    const nextNum = students.length + 1;
    const padded = nextNum < 10 ? `0${nextNum}` : `${nextNum}`;
    setFormData({
      studentCode: `BDT-10${padded}`,
      name: '',
      classRoom: selectedClass !== 'Tất cả' ? selectedClass : '10A1',
      gender: 'Nam',
      status: 'Đang học',
      notes: '',
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (student: Student) => {
    audioService.playClick();
    setEditingStudent(student);
    setFormData({
      studentCode: student.studentCode,
      name: student.name,
      classRoom: student.classRoom,
      gender: student.gender,
      status: student.status,
      notes: student.notes || '',
    });
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.studentCode.trim()) return;

    onAddStudent(formData);
    audioService.playSuccess();
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent || !formData.name.trim()) return;

    onUpdateStudent({
      ...editingStudent,
      ...formData,
    });
    audioService.playSuccess();
    setEditingStudent(null);
  };

  const handleConfirmDelete = () => {
    if (!deletingStudent) return;
    onDeleteStudent(deletingStudent.id);
    audioService.playDelete();
    setDeletingStudent(null);
  };

  const getStatusBadge = (status: Student['status']) => {
    switch (status) {
      case 'Xuất sắc':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">Xuất sắc</span>;
      case 'Cần hỗ trợ':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">Cần hỗ trợ</span>;
      case 'Vắng có phép':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">Vắng có phép</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-200">Đang học</span>;
    }
  };

  return (
    <div className={`space-y-6 ${projectorMode ? 'text-base' : 'text-sm'}`}>
      
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-sky-600" />
            <span>Quản Lý Danh Sách Học Sinh</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Môn Tin học • Phụ trách: <strong>GV Trần Văn Bích</strong> • Tổng số: <strong className="text-sky-700">{students.length} học sinh</strong>
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm học sinh mới</span>
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
            placeholder="Tìm theo họ tên hoặc mã học sinh (ví dụ: An, BDT-1001)..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
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
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 cursor-pointer"
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
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 cursor-pointer"
          >
            <option value="Tất cả">Tất cả trạng thái</option>
            <option value="Đang học">Đang học</option>
            <option value="Xuất sắc">Xuất sắc</option>
            <option value="Cần hỗ trợ">Cần hỗ trợ</option>
            <option value="Vắng có phép">Vắng có phép</option>
          </select>
        </div>

      </div>

      {/* Student List Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filteredStudents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-xs font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3.5 px-4 text-center w-14">STT</th>
                  <th className="py-3.5 px-4">Mã Học Sinh</th>
                  <th className="py-3.5 px-4">Họ và Tên</th>
                  <th className="py-3.5 px-4 text-center">Lớp</th>
                  <th className="py-3.5 px-4 text-center">Giới tính</th>
                  <th className="py-3.5 px-4">Trạng thái học tập</th>
                  <th className="py-3.5 px-4">Ghi chú chuyên môn</th>
                  <th className="py-3.5 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {filteredStudents.map((st, index) => (
                  <tr key={st.id} className="hover:bg-sky-50/50 transition-colors group">
                    <td className="py-3 px-4 text-center text-slate-400 font-medium">
                      {index + 1}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-sky-800">
                      {st.studentCode}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                          {st.name.charAt(st.name.lastIndexOf(' ') + 1) || st.name.charAt(0)}
                        </div>
                        <span>{st.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-bold px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 text-xs">
                        {st.classRoom}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-slate-600">
                      {st.gender}
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(st.status)}
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate text-xs">
                      {st.notes || <span className="text-slate-300 italic">Không có ghi chú</span>}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(st)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-sky-600 hover:bg-sky-100/70 transition"
                          title="Chỉnh sửa thông tin học sinh"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            audioService.playClick();
                            setDeletingStudent(st);
                          }}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-100/70 transition"
                          title="Xóa học sinh"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 px-4 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-800">Không tìm thấy học sinh phù hợp</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Không có học sinh nào khớp với từ khóa tìm kiếm hoặc bộ lọc hiện tại. Thử chọn lại lớp hoặc đặt lại bộ lọc.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedClass('Tất cả');
                setSelectedStatus('Tất cả');
              }}
              className="mt-4 px-3 py-1.5 rounded-lg bg-sky-100 text-sky-700 text-xs font-semibold hover:bg-sky-200 transition"
            >
              Đặt lại bộ lọc
            </button>
          </div>
        )}
      </div>

      {/* Add Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-sky-600" />
                <span>Thêm Học Sinh Mới</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdd} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mã Học Sinh *</label>
                  <input
                    type="text"
                    required
                    value={formData.studentCode}
                    onChange={(e) => setFormData({ ...formData, studentCode: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    placeholder="BDT-1001"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Lớp Học *</label>
                  <input
                    type="text"
                    required
                    value={formData.classRoom}
                    onChange={(e) => setFormData({ ...formData, classRoom: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    placeholder="10A1, 10A2, 11A1..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Họ và Tên Học Sinh *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  placeholder="Ví dụ: Nguyễn Văn An"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Giới tính</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'Nam' | 'Nữ' })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Trạng thái học tập</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Student['status'] })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  >
                    <option value="Đang học">Đang học</option>
                    <option value="Xuất sắc">Xuất sắc</option>
                    <option value="Cần hỗ trợ">Cần hỗ trợ</option>
                    <option value="Vắng có phép">Vắng có phép</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ghi chú đánh giá / kỹ năng</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Ví dụ: Có năng khiếu lập trình Python, thao tác phím nhanh..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
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
                  className="px-5 py-2 text-sm font-bold bg-sky-600 hover:bg-sky-700 text-white rounded-xl shadow transition"
                >
                  Lưu học sinh
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-sky-600" />
                <span>Chỉnh Sửa Thông Tin Học Sinh</span>
              </h3>
              <button
                onClick={() => setEditingStudent(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mã Học Sinh</label>
                  <input
                    type="text"
                    required
                    value={formData.studentCode}
                    onChange={(e) => setFormData({ ...formData, studentCode: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Lớp Học</label>
                  <input
                    type="text"
                    required
                    value={formData.classRoom}
                    onChange={(e) => setFormData({ ...formData, classRoom: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Họ và Tên Học Sinh</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Giới tính</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'Nam' | 'Nữ' })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Trạng thái học tập</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Student['status'] })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  >
                    <option value="Đang học">Đang học</option>
                    <option value="Xuất sắc">Xuất sắc</option>
                    <option value="Cần hỗ trợ">Cần hỗ trợ</option>
                    <option value="Vắng có phép">Vắng có phép</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ghi chú đánh giá / kỹ năng</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold bg-sky-600 hover:bg-sky-700 text-white rounded-xl shadow transition"
                >
                  Cập nhật thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deletingStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-rose-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Xác nhận xóa học sinh</h3>
            </div>
            <p className="text-sm text-slate-600 mb-5 leading-relaxed">
              Bạn có chắc chắn muốn xóa học sinh <strong>{deletingStudent.name}</strong> (Mã HS: <strong>{deletingStudent.studentCode}</strong>, Lớp: <strong>{deletingStudent.classRoom}</strong>) khỏi hệ thống không?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeletingStudent(null)}
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
