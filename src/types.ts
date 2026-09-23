export interface Student {
  id: string;
  studentCode: string;
  name: string;
  classRoom: string;
  gender: 'Nam' | 'Nữ';
  status: 'Đang học' | 'Cần hỗ trợ' | 'Xuất sắc' | 'Vắng có phép';
  notes?: string;
  avatarSeed: number;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  topic: string;
  targetClass: string; // 'Tất cả' | '10A1' | '10A2' | '11A1' | '12A1'
  dueDate: string; // YYYY-MM-DD
  status: 'Đang diễn ra' | 'Sắp hết hạn' | 'Đã kết thúc';
  pointsMax: number;
  createdAt: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  submittedAt: string | null;
  status: 'Đã hoàn thành' | 'Chưa hoàn thành' | 'Đang làm' | 'Nộp muộn';
  score: number | null;
  feedback?: string;
  studentNote?: string;
}

export interface GradeRecord {
  id: string;
  studentId: string;
  tx1: number | null; // Điểm kiểm tra thường xuyên 1
  tx2: number | null; // Điểm kiểm tra thường xuyên 2
  practice: number | null; // Điểm thực hành phòng máy
  midTerm: number | null; // Điểm giữa kỳ (hệ số 2)
  finalTerm: number | null; // Điểm cuối kỳ (hệ số 3)
  teacherNote?: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  type: 'student' | 'assignment' | 'grade' | 'submission';
  title: string;
  description: string;
}

export type UserRole = 'teacher' | 'student';
