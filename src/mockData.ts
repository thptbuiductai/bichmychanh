import { Student, Assignment, Submission, GradeRecord, ActivityLog } from './types';

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'hs-01',
    studentCode: 'BDT-1001',
    name: 'Nguyễn Văn An',
    classRoom: '10A1',
    gender: 'Nam',
    status: 'Xuất sắc',
    notes: 'Kỹ năng lập trình Python tốt, ham học hỏi',
    avatarSeed: 1
  },
  {
    id: 'hs-02',
    studentCode: 'BDT-1002',
    name: 'Lê Thị Mai',
    classRoom: '10A1',
    gender: 'Nữ',
    status: 'Đang học',
    notes: 'Chăm chỉ, thực hành máy tính đúng giờ',
    avatarSeed: 2
  },
  {
    id: 'hs-03',
    studentCode: 'BDT-1003',
    name: 'Trần Hoàng Nam',
    classRoom: '10A1',
    gender: 'Nam',
    status: 'Xuất sắc',
    notes: 'Đội tuyển HSG Tin học cấp trường',
    avatarSeed: 3
  },
  {
    id: 'hs-04',
    studentCode: 'BDT-1004',
    name: 'Phạm Minh Quân',
    classRoom: '10A1',
    gender: 'Nam',
    status: 'Cần hỗ trợ',
    notes: 'Cần hướng dẫn thêm phần thuật toán vòng lặp',
    avatarSeed: 4
  },
  {
    id: 'hs-05',
    studentCode: 'BDT-1005',
    name: 'Hoàng Thu Thảo',
    classRoom: '10A1',
    gender: 'Nữ',
    status: 'Đang học',
    notes: 'Trình bày bài thực hành rõ ràng',
    avatarSeed: 5
  },
  {
    id: 'hs-06',
    studentCode: 'BDT-1006',
    name: 'Đỗ Quang Huy',
    classRoom: '10A2',
    gender: 'Nam',
    status: 'Đang học',
    notes: 'Có tinh thần làm việc nhóm tốt',
    avatarSeed: 6
  },
  {
    id: 'hs-07',
    studentCode: 'BDT-1007',
    name: 'Võ Ngọc Linh',
    classRoom: '10A2',
    gender: 'Nữ',
    status: 'Xuất sắc',
    notes: 'Gõ phím nhanh, tiếp thu bài tốt',
    avatarSeed: 7
  },
  {
    id: 'hs-08',
    studentCode: 'BDT-1008',
    name: 'Phan Tuấn Kiệt',
    classRoom: '10A2',
    gender: 'Nam',
    status: 'Cần hỗ trợ',
    notes: 'Thường xuyên quên lưu file bài làm vào thư mục cá nhân',
    avatarSeed: 8
  },
  {
    id: 'hs-09',
    studentCode: 'BDT-1009',
    name: 'Vũ Thị Lan Anh',
    classRoom: '10A2',
    gender: 'Nữ',
    status: 'Đang học',
    notes: 'Tham gia phát biểu xây dựng bài sôi nổi',
    avatarSeed: 9
  },
  {
    id: 'hs-10',
    studentCode: 'BDT-1010',
    name: 'Bùi Quốc Anh',
    classRoom: '10A2',
    gender: 'Nam',
    status: 'Đang học',
    notes: 'Hoàn thành tốt các bài tập rẽ nhánh if-else',
    avatarSeed: 10
  },
  {
    id: 'hs-11',
    studentCode: 'BDT-1101',
    name: 'Đinh Gia Hưng',
    classRoom: '11A1',
    gender: 'Nam',
    status: 'Xuất sắc',
    notes: 'Hiểu sâu về cấu trúc mạng máy tính và IP',
    avatarSeed: 11
  },
  {
    id: 'hs-12',
    studentCode: 'BDT-1102',
    name: 'Trịnh Quỳnh Như',
    classRoom: '11A1',
    gender: 'Nữ',
    status: 'Đang học',
    notes: 'Thực hành SQL truy vấn cơ sở dữ liệu cẩn thận',
    avatarSeed: 12
  },
  {
    id: 'hs-13',
    studentCode: 'BDT-1103',
    name: 'Nguyễn Đức Bảo',
    classRoom: '11A1',
    gender: 'Nam',
    status: 'Đang học',
    notes: 'Thực hiện tốt đồ án mini website',
    avatarSeed: 13
  },
  {
    id: 'hs-14',
    studentCode: 'BDT-1104',
    name: 'Lâm Mỹ Duyên',
    classRoom: '11A1',
    gender: 'Nữ',
    status: 'Cần hỗ trợ',
    notes: 'Cần luyện tập thêm câu lệnh truy vấn có mệnh đề WHERE',
    avatarSeed: 14
  }
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'nv-01',
    title: 'Thực hành 01: Biến, Kiểu dữ liệu và Lệnh gán trong Python',
    description: 'Viết chương trình nhập vào họ tên, năm sinh học sinh. Tính tuổi hiện tại và in lời chào định dạng bằng lệnh print(). Lưu file định dạng hoten_th01.py.',
    topic: 'Lập trình Python',
    targetClass: '10A1',
    dueDate: '2026-09-30',
    status: 'Đang diễn ra',
    pointsMax: 10,
    createdAt: '2026-09-15'
  },
  {
    id: 'nv-02',
    title: 'Thực hành 02: Cấu trúc rẽ nhánh if...else (Xếp loại học lực)',
    description: 'Viết chương trình nhập điểm trung bình học kỳ của học sinh (thang điểm 10). Sử dụng cấu trúc if...elif...else để xếp loại Giỏi, Khá, Đạt, Chưa đạt và kiểm tra tính hợp lệ của dữ liệu đầu vào.',
    topic: 'Lập trình Python',
    targetClass: '10A1',
    dueDate: '2026-10-08',
    status: 'Đang diễn ra',
    pointsMax: 10,
    createdAt: '2026-09-18'
  },
  {
    id: 'nv-03',
    title: 'Thực hành 03: Vòng lặp For & While - Tính tổng chuỗi số',
    description: 'Xây dựng thuật toán và viết code Python tính tổng S = 1 + 2 + ... + N với N nguyên dương nhập từ bàn phím. Kiểm tra trường hợp N âm.',
    topic: 'Lập trình Python',
    targetClass: '10A2',
    dueDate: '2026-10-05',
    status: 'Sắp hết hạn',
    pointsMax: 10,
    createdAt: '2026-09-16'
  },
  {
    id: 'nv-04',
    title: 'Khảo sát kiến trúc Mạng máy tính & Thiết lập địa chỉ IP phòng máy',
    description: 'Quan sát sơ đồ mạng LAN phòng máy trường THPT Bùi Dục Tài. Trình bày vai trò của Switch, Router và ghi lại dải địa chỉ IP nội bộ của các máy trạm.',
    topic: 'Mạng máy tính',
    targetClass: '11A1',
    dueDate: '2026-10-02',
    status: 'Đang diễn ra',
    pointsMax: 10,
    createdAt: '2026-09-17'
  },
  {
    id: 'nv-05',
    title: 'Thực hành CSDL: Tạo bảng và truy vấn cơ bản SQL',
    description: 'Sử dụng SQLite/MySQL tạo bảng HOCSINH gồm các trường: MaHS, HoTen, NgaySinh, DiemTB. Thực hiện truy vấn danh sách học sinh có DiemTB >= 8.0 sắp xếp giảm dần.',
    topic: 'Cơ sở dữ liệu',
    targetClass: '11A1',
    dueDate: '2026-09-25',
    status: 'Đã kết thúc',
    pointsMax: 10,
    createdAt: '2026-09-10'
  }
];

export const INITIAL_SUBMISSIONS: Submission[] = [
  // nv-01 (10A1)
  { id: 'sub-01', assignmentId: 'nv-01', studentId: 'hs-01', submittedAt: '2026-09-18 09:30', status: 'Đã hoàn thành', score: 10, feedback: 'Code chuẩn xác, biến đặt tên đúng chuẩn PEP8, có chú thích rõ ràng.', studentNote: 'Đã nộp file hoten_th01.py qua mạng nội bộ.' },
  { id: 'sub-02', assignmentId: 'nv-01', studentId: 'hs-02', submittedAt: '2026-09-18 10:15', status: 'Đã hoàn thành', score: 8.5, feedback: 'Chạy đúng kết quả, cần chú ý thụt lề chuẩn 4 dấu cách.', studentNote: 'Em đã nộp bài vào thư mục BaiTap_10A1.' },
  { id: 'sub-03', assignmentId: 'nv-01', studentId: 'hs-03', submittedAt: '2026-09-17 14:20', status: 'Đã hoàn thành', score: 10, feedback: 'Rất xuất sắc, có mở rộng thêm tính năng kiểm tra năm nhuận!', studentNote: 'Em có mở rộng thêm kiểm tra dữ liệu.' },
  { id: 'sub-04', assignmentId: 'nv-01', studentId: 'hs-04', submittedAt: null, status: 'Chưa hoàn thành', score: null, feedback: '', studentNote: '' },
  { id: 'sub-05', assignmentId: 'nv-01', studentId: 'hs-05', submittedAt: '2026-09-19 08:45', status: 'Đã hoàn thành', score: 9.0, feedback: 'Bài làm tốt, giao diện dòng lệnh hiển thị đẹp.', studentNote: 'Bài hoàn thành trên máy tính phòng máy số 05.' },

  // nv-02 (10A1)
  { id: 'sub-06', assignmentId: 'nv-02', studentId: 'hs-01', submittedAt: '2026-09-20 15:10', status: 'Đã hoàn thành', score: 9.5, feedback: 'Xử lý đầy đủ các điều kiện biên 0 <= điểm <= 10.', studentNote: 'Đã kiểm tra kỹ các nhánh if-elif-else.' },
  { id: 'sub-07', assignmentId: 'nv-02', studentId: 'hs-02', submittedAt: null, status: 'Đang làm', score: null, feedback: '', studentNote: 'Em đang viết phần kiểm tra điểm âm.' },
  { id: 'sub-08', assignmentId: 'nv-02', studentId: 'hs-03', submittedAt: '2026-09-19 16:30', status: 'Đã hoàn thành', score: 10, feedback: 'Thuật toán tối ưu, logic mạch lạc.', studentNote: 'Đã nộp bài đầy đủ.' },
  { id: 'sub-09', assignmentId: 'nv-02', studentId: 'hs-04', submittedAt: null, status: 'Chưa hoàn thành', score: null, feedback: '', studentNote: '' },
  { id: 'sub-10', assignmentId: 'nv-02', studentId: 'hs-05', submittedAt: '2026-09-21 11:00', status: 'Đã hoàn thành', score: 8.5, feedback: 'Tốt, chú ý định dạng float khi nhập điểm.', studentNote: 'Em đã nộp bài ạ.' },

  // nv-03 (10A2)
  { id: 'sub-11', assignmentId: 'nv-03', studentId: 'hs-06', submittedAt: '2026-09-21 14:10', status: 'Đã hoàn thành', score: 8.5, feedback: 'Vòng lặp chạy chuẩn, bài trình bày sạch sẽ.', studentNote: 'Đã test với N = 100.' },
  { id: 'sub-12', assignmentId: 'nv-03', studentId: 'hs-07', submittedAt: '2026-09-20 10:00', status: 'Đã hoàn thành', score: 9.5, feedback: 'Rất tốt, so sánh được thời gian chạy giữa vòng lặp và công thức Gauss.', studentNote: 'Em giải bằng 2 cách vòng lặp và công thức.' },
  { id: 'sub-13', assignmentId: 'nv-03', studentId: 'hs-08', submittedAt: null, status: 'Chưa hoàn thành', score: null, feedback: '', studentNote: '' },
  { id: 'sub-14', assignmentId: 'nv-03', studentId: 'hs-09', submittedAt: '2026-09-22 08:30', status: 'Đã hoàn thành', score: 8.0, feedback: 'Đạt yêu cầu bài tập.', studentNote: 'Đã lưu trong máy số 12.' },
  { id: 'sub-15', assignmentId: 'nv-03', studentId: 'hs-10', submittedAt: '2026-09-21 16:45', status: 'Đã hoàn thành', score: 9.0, feedback: 'Khá tốt, chú ý kiểm tra điều kiện N là số thực.', studentNote: 'Đã hoàn thành bài tập.' },

  // nv-04 & nv-05 (11A1)
  { id: 'sub-16', assignmentId: 'nv-04', studentId: 'hs-11', submittedAt: '2026-09-20 09:00', status: 'Đã hoàn thành', score: 9.5, feedback: 'Sơ đồ mạng vẽ rất chuẩn, phân biệt rõ router và switch.', studentNote: 'Đã chụp sơ đồ phòng máy kèm báo cáo.' },
  { id: 'sub-17', assignmentId: 'nv-04', studentId: 'hs-12', submittedAt: '2026-09-21 10:30', status: 'Đã hoàn thành', score: 8.5, feedback: 'Nắm chắc khái niệm địa chỉ IP tĩnh và DHCP.', studentNote: 'Báo cáo nộp dạng PDF.' },
  { id: 'sub-18', assignmentId: 'nv-04', studentId: 'hs-13', submittedAt: null, status: 'Đang làm', score: null, feedback: '', studentNote: 'Em đang hoàn thiện phần sơ đồ topo mạng.' },
  { id: 'sub-19', assignmentId: 'nv-04', studentId: 'hs-14', submittedAt: null, status: 'Chưa hoàn thành', score: null, feedback: '', studentNote: '' },

  { id: 'sub-20', assignmentId: 'nv-05', studentId: 'hs-11', submittedAt: '2026-09-22 11:00', status: 'Đã hoàn thành', score: 10, feedback: 'Câu lệnh SQL chuẩn, có thiết lập khóa chính PRIMARY KEY.', studentNote: 'Em đã nộp file script .sql.' },
  { id: 'sub-21', assignmentId: 'nv-05', studentId: 'hs-12', submittedAt: '2026-09-22 15:20', status: 'Đã hoàn thành', score: 9.0, feedback: 'Truy vấn ORDER BY và WHERE chính xác.', studentNote: 'Đã nộp bài đầy đủ.' },
  { id: 'sub-22', assignmentId: 'nv-05', studentId: 'hs-13', submittedAt: '2026-09-23 09:10', status: 'Đã hoàn thành', score: 8.0, feedback: 'Đạt yêu cầu tạo bảng và truy vấn.', studentNote: 'Nộp bài thực hành CSDL.' },
  { id: 'sub-23', assignmentId: 'nv-05', studentId: 'hs-14', submittedAt: '2026-09-24 14:00', status: 'Nộp muộn', score: 7.0, feedback: 'Cần chú ý mệnh đề SELECT và nộp đúng hạn.', studentNote: 'Em xin lỗi thầy vì nộp bài muộn do máy bị lỗi.' }
];

export const INITIAL_GRADES: GradeRecord[] = [
  { id: 'gr-01', studentId: 'hs-01', tx1: 9.5, tx2: 10, practice: 10, midTerm: 9.5, finalTerm: 9.5, teacherNote: 'Xuất sắc, tư duy logic nhanh nhạy' },
  { id: 'gr-02', studentId: 'hs-02', tx1: 8.0, tx2: 8.5, practice: 8.5, midTerm: 8.0, finalTerm: 8.5, teacherNote: 'Chăm chỉ, thực hành tốt' },
  { id: 'gr-03', studentId: 'hs-03', tx1: 10, tx2: 10, practice: 10, midTerm: 10, finalTerm: 9.8, teacherNote: 'Năng khiếu tin học nổi bật, đứng đầu lớp' },
  { id: 'gr-04', studentId: 'hs-04', tx1: 5.5, tx2: 6.0, practice: 6.0, midTerm: 5.5, finalTerm: 6.0, teacherNote: 'Cần nỗ lực thêm bài tập thực hành máy tính' },
  { id: 'gr-05', studentId: 'hs-05', tx1: 8.5, tx2: 9.0, practice: 9.0, midTerm: 8.5, finalTerm: 8.8, teacherNote: 'Tiến bộ rõ rệt qua từng tuần' },
  { id: 'gr-06', studentId: 'hs-06', tx1: 8.0, tx2: 8.5, practice: 8.5, midTerm: 8.0, finalTerm: 8.2, teacherNote: 'Ý thức học tập nghiêm túc' },
  { id: 'gr-07', studentId: 'hs-07', tx1: 9.5, tx2: 9.5, practice: 9.5, midTerm: 9.0, finalTerm: 9.3, teacherNote: 'Thực hành thao tác máy nhanh và chính xác' },
  { id: 'gr-08', studentId: 'hs-08', tx1: 5.0, tx2: 5.5, practice: 6.0, midTerm: 5.0, finalTerm: 5.5, teacherNote: 'Cần chú ý hạn nộp bài và kỷ luật phòng máy' },
  { id: 'gr-09', studentId: 'hs-09', tx1: 8.0, tx2: 8.0, practice: 8.0, midTerm: 7.8, finalTerm: 8.0, teacherNote: 'Học lực Khá ổn định' },
  { id: 'gr-10', studentId: 'hs-10', tx1: 9.0, tx2: 9.0, practice: 9.0, midTerm: 8.8, finalTerm: 9.0, teacherNote: 'Lập trình tốt, bài tập làm chỉn chu' },
  { id: 'gr-11', studentId: 'hs-11', tx1: 9.5, tx2: 10, practice: 9.5, midTerm: 9.5, finalTerm: 9.6, teacherNote: 'Kiến thức mạng máy tính rất vững vàng' },
  { id: 'gr-12', studentId: 'hs-12', tx1: 8.5, tx2: 9.0, practice: 8.5, midTerm: 8.5, finalTerm: 8.6, teacherNote: 'Học tốt các nội dung CSDL' },
  { id: 'gr-13', studentId: 'hs-13', tx1: 8.0, tx2: 8.0, practice: 8.0, midTerm: 8.0, finalTerm: 8.0, teacherNote: 'Nhiệt tình hỗ trợ bạn bè trong nhóm thực hành' },
  { id: 'gr-14', studentId: 'hs-14', tx1: 6.5, tx2: 7.0, practice: 7.0, midTerm: 6.5, finalTerm: 6.8, teacherNote: 'Cần rèn luyện thêm kỹ năng truy vấn dữ liệu' }
];

export const INITIAL_ACTIVITIES: ActivityLog[] = [
  {
    id: 'act-01',
    timestamp: 'Hôm nay, 16:45',
    type: 'submission',
    title: 'Học sinh nộp bài thực hành',
    description: 'Học sinh Bùi Quốc Anh (10A2) đã nộp Thực hành 03: Vòng lặp For & While.'
  },
  {
    id: 'act-02',
    timestamp: 'Hôm nay, 15:20',
    type: 'grade',
    title: 'Cập nhật điểm kiểm tra',
    description: 'Thầy Trần Văn Bích đã chấm điểm thực hành CSDL cho học sinh Trịnh Quỳnh Như (11A1): 9.0 điểm.'
  },
  {
    id: 'act-03',
    timestamp: 'Hôm qua, 09:15',
    type: 'assignment',
    title: 'Giao nhiệm vụ học tập mới',
    description: 'Nhiệm vụ "Thực hành 02: Cấu trúc rẽ nhánh if...else" đã được giao cho lớp 10A1.'
  },
  {
    id: 'act-04',
    timestamp: '20/09, 14:00',
    type: 'student',
    title: 'Cập nhật danh sách học sinh',
    description: 'Đồng bộ danh sách học sinh khối 10 và 11 năm học 2026 - 2027.'
  }
];

// Helper to compute weighted average score: (TX1 + TX2 + TH + GK*2 + CK*3) / 8
export function calculateAverageGrade(gr: GradeRecord | undefined): number | null {
  if (!gr) return null;
  const weights = [
    { val: gr.tx1, w: 1 },
    { val: gr.tx2, w: 1 },
    { val: gr.practice, w: 1 },
    { val: gr.midTerm, w: 2 },
    { val: gr.finalTerm, w: 3 },
  ];

  let sum = 0;
  let totalWeight = 0;
  for (const item of weights) {
    if (item.val !== null && item.val !== undefined && !isNaN(item.val)) {
      sum += item.val * item.w;
      totalWeight += item.w;
    }
  }

  if (totalWeight === 0) return null;
  return Number((sum / totalWeight).toFixed(1));
}

export function getGradeClassification(avg: number | null): { label: string; color: string; badgeBg: string } {
  if (avg === null) return { label: 'Chưa đủ điểm', color: 'text-slate-500', badgeBg: 'bg-slate-100 text-slate-700 border-slate-200' };
  if (avg >= 8.0) return { label: 'Giỏi', color: 'text-emerald-700', badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  if (avg >= 6.5) return { label: 'Khá', color: 'text-blue-700', badgeBg: 'bg-blue-50 text-blue-700 border-blue-200' };
  if (avg >= 5.0) return { label: 'Đạt', color: 'text-amber-700', badgeBg: 'bg-amber-50 text-amber-700 border-amber-200' };
  return { label: 'Chưa đạt', color: 'text-rose-700', badgeBg: 'bg-rose-50 text-rose-700 border-rose-200' };
}
