import React, { useState, useEffect } from 'react';
import { 
  Student, 
  Assignment, 
  Submission, 
  GradeRecord, 
  ActivityLog, 
  UserRole 
} from './types';
import { 
  loadAllState, 
  saveAllState, 
  resetToDefaultState, 
  exportStandaloneHTML 
} from './utils/storage';
import { audioService } from './utils/audio';
import { Header } from './components/Header';
import { Navigation, TabType } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { StudentManagementView } from './components/StudentManagementView';
import { AssignmentManagementView } from './components/AssignmentManagementView';
import { ProgressTrackingView } from './components/ProgressTrackingView';
import { GradesView } from './components/GradesView';
import { StudentPortalView } from './components/StudentPortalView';
import { ToastContainer, ToastMessage } from './components/Toast';
import { SchoolLogo } from './components/SchoolLogo';

export default function App() {
  // Load initial state from LocalStorage or Fallback
  const [data, setData] = useState(() => loadAllState());
  const [role, setRole] = useState<UserRole>('teacher');
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [currentStudentId, setCurrentStudentId] = useState<string>(() => {
    const initialData = loadAllState();
    return initialData.students[0]?.id || '';
  });
  const [projectorMode, setProjectorMode] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Automatically persist changes to localStorage
  useEffect(() => {
    saveAllState(data);
  }, [data]);

  // Toast Helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Add Log Entry
  const addActivity = (type: ActivityLog['type'], title: string, description: string) => {
    const newAct: ActivityLog = {
      id: `act-${Date.now()}`,
      timestamp: 'Vừa xong',
      type,
      title,
      description,
    };
    setData((prev) => ({
      ...prev,
      activities: [newAct, ...prev.activities.slice(0, 19)],
    }));
  };

  // Student CRUD
  const handleAddStudent = (newStudentData: Omit<Student, 'id' | 'avatarSeed'>) => {
    const newId = `hs-${Date.now().toString().slice(-4)}`;
    const newStudent: Student = {
      ...newStudentData,
      id: newId,
      avatarSeed: Math.floor(Math.random() * 100),
    };

    // Also create initial grade record for this student
    const newGrade: GradeRecord = {
      id: `gr-${newId}`,
      studentId: newId,
      tx1: null,
      tx2: null,
      practice: null,
      midTerm: null,
      finalTerm: null,
      teacherNote: 'Học sinh mới nhập học',
    };

    setData((prev) => ({
      ...prev,
      students: [...prev.students, newStudent],
      grades: [...prev.grades, newGrade],
    }));

    addActivity('student', 'Thêm học sinh mới', `Đã thêm học sinh ${newStudent.name} (${newStudent.classRoom}) vào danh sách.`);
    showToast(`Đã thêm học sinh ${newStudent.name} thành công!`);
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    setData((prev) => ({
      ...prev,
      students: prev.students.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)),
    }));
    addActivity('student', 'Cập nhật học sinh', `Đã cập nhật thông tin học sinh ${updatedStudent.name}.`);
    showToast(`Đã cập nhật học sinh ${updatedStudent.name}!`);
  };

  const handleDeleteStudent = (id: string) => {
    const student = data.students.find((s) => s.id === id);
    setData((prev) => ({
      ...prev,
      students: prev.students.filter((s) => s.id !== id),
      submissions: prev.submissions.filter((sub) => sub.studentId !== id),
      grades: prev.grades.filter((g) => g.studentId !== id),
    }));
    if (student) {
      addActivity('student', 'Xóa học sinh', `Đã xóa học sinh ${student.name} khỏi hệ thống.`);
      showToast(`Đã xóa học sinh ${student.name}!`, 'info');
    }
    if (currentStudentId === id && data.students.length > 1) {
      setCurrentStudentId(data.students[0].id);
    }
  };

  // Assignment CRUD
  const handleAddAssignment = (assignmentData: Omit<Assignment, 'id' | 'createdAt'>) => {
    const newId = `nv-${Date.now().toString().slice(-4)}`;
    const newAssignment: Assignment = {
      ...assignmentData,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setData((prev) => ({
      ...prev,
      assignments: [newAssignment, ...prev.assignments],
    }));

    addActivity('assignment', 'Giao nhiệm vụ mới', `Nhiệm vụ "${newAssignment.title}" đã được giao cho lớp ${newAssignment.targetClass}.`);
    showToast(`Đã giao nhiệm vụ: ${newAssignment.title}!`);
  };

  const handleUpdateAssignment = (updatedAssignment: Assignment) => {
    setData((prev) => ({
      ...prev,
      assignments: prev.assignments.map((a) => (a.id === updatedAssignment.id ? updatedAssignment : a)),
    }));
    addActivity('assignment', 'Chỉnh sửa nhiệm vụ', `Đã cập nhật nội dung nhiệm vụ "${updatedAssignment.title}".`);
    showToast(`Đã cập nhật nhiệm vụ thành công!`);
  };

  const handleDeleteAssignment = (id: string) => {
    const assignment = data.assignments.find((a) => a.id === id);
    setData((prev) => ({
      ...prev,
      assignments: prev.assignments.filter((a) => a.id !== id),
      submissions: prev.submissions.filter((sub) => sub.assignmentId !== id),
    }));
    if (assignment) {
      addActivity('assignment', 'Xóa nhiệm vụ', `Đã xóa nhiệm vụ "${assignment.title}".`);
      showToast(`Đã xóa nhiệm vụ "${assignment.title}"!`, 'info');
    }
  };

  // Grade Submission
  const handleGradeSubmission = (submissionId: string, score: number, feedback: string) => {
    setData((prev) => ({
      ...prev,
      submissions: prev.submissions.map((s) => {
        if (s.id === submissionId) {
          return {
            ...s,
            score,
            feedback,
            status: 'Đã hoàn thành',
          };
        }
        return s;
      }),
    }));
    addActivity('grade', 'Chấm bài thực hành', `Thầy Trần Văn Bích đã chấm ${score} điểm cho bài thực hành.`);
    showToast(`Đã lưu điểm ${score} và nhận xét bài nộp!`);
  };

  // Student Submit Assignment
  const handleStudentSubmit = (assignmentId: string, studentId: string, note: string) => {
    const student = data.students.find((s) => s.id === studentId);
    const existingIndex = data.submissions.findIndex(
      (s) => s.assignmentId === assignmentId && s.studentId === studentId
    );

    const nowFormatted = new Date().toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

    if (existingIndex >= 0) {
      setData((prev) => {
        const next = [...prev.submissions];
        next[existingIndex] = {
          ...next[existingIndex],
          submittedAt: nowFormatted,
          status: 'Đã hoàn thành',
          studentNote: note,
        };
        return { ...prev, submissions: next };
      });
    } else {
      const newSub: Submission = {
        id: `sub-${Date.now()}`,
        assignmentId,
        studentId,
        submittedAt: nowFormatted,
        status: 'Đã hoàn thành',
        score: null,
        studentNote: note,
      };
      setData((prev) => ({
        ...prev,
        submissions: [...prev.submissions, newSub],
      }));
    }

    addActivity('submission', 'Học sinh nộp bài', `Học sinh ${student?.name || 'HS'} (${student?.classRoom}) vừa nộp bài thực hành.`);
    showToast(`Chúc mừng em đã nộp bài thực hành thành công!`);
  };

  // Grade Update from Grade Table
  const handleUpdateGrade = (grade: GradeRecord) => {
    const student = data.students.find((s) => s.id === grade.studentId);
    setData((prev) => ({
      ...prev,
      grades: prev.grades.some((g) => g.studentId === grade.studentId)
        ? prev.grades.map((g) => (g.studentId === grade.studentId ? grade : g))
        : [...prev.grades, grade],
    }));

    addActivity('grade', 'Cập nhật điểm số', `Đã cập nhật bảng điểm môn Tin học cho học sinh ${student?.name || ''}.`);
    showToast(`Đã lưu điểm cho học sinh ${student?.name || ''}!`);
  };

  // Reset to default
  const handleResetData = () => {
    const defaultData = resetToDefaultState();
    setData(defaultData);
    if (defaultData.students[0]) {
      setCurrentStudentId(defaultData.students[0].id);
    }
    showToast(`Đã khôi phục dữ liệu mẫu của THPT Bùi Dục Tài!`);
  };

  // Export HTML
  const handleExportHTML = () => {
    exportStandaloneHTML(data);
    showToast(`Đã xuất file HTML độc lập để chạy offline!`);
  };

  // Send reminder nudge
  const handleSendReminder = (studentName: string) => {
    showToast(`Đã gửi thông báo nhắc nhở nộp bài đến học sinh ${studentName}!`, 'info');
  };

  // Current student object for student portal
  const currentStudent = data.students.find((s) => s.id === currentStudentId) || data.students[0];
  const currentStudentGrade = data.grades.find((g) => g.studentId === currentStudent?.id);

  return (
    <div className={`min-h-screen bg-slate-50 flex flex-col font-sans transition-all ${projectorMode ? 'text-lg leading-relaxed' : ''}`}>
      
      {/* Top Header */}
      <Header
        role={role}
        setRole={setRole}
        students={data.students}
        currentStudentId={currentStudentId}
        setCurrentStudentId={setCurrentStudentId}
        projectorMode={projectorMode}
        setProjectorMode={setProjectorMode}
        onResetData={handleResetData}
        onExportHTML={handleExportHTML}
      />

      {/* Main Navigation (Visible in Teacher mode) */}
      {role === 'teacher' && (
        <Navigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          studentsCount={data.students.length}
          assignmentsCount={data.assignments.length}
          projectorMode={projectorMode}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* If in Student Mode, show dedicated Student Portal */}
        {role === 'student' ? (
          currentStudent ? (
            <StudentPortalView
              currentStudent={currentStudent}
              assignments={data.assignments}
              submissions={data.submissions}
              gradeRecord={currentStudentGrade}
              onSubmitAssignment={handleStudentSubmit}
              projectorMode={projectorMode}
            />
          ) : (
            <div className="bg-white p-8 rounded-2xl text-center">
              <p>Chưa có thông tin học sinh. Vui lòng chuyển sang chế độ Giáo viên để thêm học sinh.</p>
            </div>
          )
        ) : (
          /* Teacher Mode - 5 Core Features */
          <>
            {activeTab === 'dashboard' && (
              <DashboardView
                students={data.students}
                assignments={data.assignments}
                submissions={data.submissions}
                grades={data.grades}
                activities={data.activities}
                onNavigate={setActiveTab}
                projectorMode={projectorMode}
              />
            )}

            {activeTab === 'students' && (
              <StudentManagementView
                students={data.students}
                onAddStudent={handleAddStudent}
                onUpdateStudent={handleUpdateStudent}
                onDeleteStudent={handleDeleteStudent}
                projectorMode={projectorMode}
              />
            )}

            {activeTab === 'assignments' && (
              <AssignmentManagementView
                assignments={data.assignments}
                students={data.students}
                submissions={data.submissions}
                onAddAssignment={handleAddAssignment}
                onUpdateAssignment={handleUpdateAssignment}
                onDeleteAssignment={handleDeleteAssignment}
                onGradeSubmission={handleGradeSubmission}
                projectorMode={projectorMode}
              />
            )}

            {activeTab === 'progress' && (
              <ProgressTrackingView
                students={data.students}
                assignments={data.assignments}
                submissions={data.submissions}
                onSendReminder={handleSendReminder}
                projectorMode={projectorMode}
              />
            )}

            {activeTab === 'grades' && (
              <GradesView
                students={data.students}
                grades={data.grades}
                onUpdateGrade={handleUpdateGrade}
                projectorMode={projectorMode}
              />
            )}
          </>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <SchoolLogo size="xs" showModalOnClick={true} shape="rounded" />
            <span className="font-bold text-slate-700">TRỢ LÝ HỌC TẬP TIN HỌC THPT BÙI DỤC TÀI</span>
            <span>•</span>
            <span>Giáo viên phụ trách: <strong>Trần Văn Bích</strong></span>
          </div>
          <div>
            Trường THPT Bùi Dục Tài • Bộ môn Tin học THPT • Năm học 2026 - 2027
          </div>
        </div>
      </footer>

      {/* Floating Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />

    </div>
  );
}
