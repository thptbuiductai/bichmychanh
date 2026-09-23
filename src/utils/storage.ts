import { Student, Assignment, Submission, GradeRecord, ActivityLog } from '../types';
import { INITIAL_STUDENTS, INITIAL_ASSIGNMENTS, INITIAL_SUBMISSIONS, INITIAL_GRADES, INITIAL_ACTIVITIES } from '../mockData';

const STORAGE_KEYS = {
  STUDENTS: 'bdt_tin_hoc_students_v1',
  ASSIGNMENTS: 'bdt_tin_hoc_assignments_v1',
  SUBMISSIONS: 'bdt_tin_hoc_submissions_v1',
  GRADES: 'bdt_tin_hoc_grades_v1',
  ACTIVITIES: 'bdt_tin_hoc_activities_v1',
};

export function loadData<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`Failed to parse storage key ${key}:`, err);
    return fallback;
  }
}

export function saveData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Failed to save to storage key ${key}:`, err);
  }
}

export function loadAllState() {
  return {
    students: loadData<Student[]>(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS),
    assignments: loadData<Assignment[]>(STORAGE_KEYS.ASSIGNMENTS, INITIAL_ASSIGNMENTS),
    submissions: loadData<Submission[]>(STORAGE_KEYS.SUBMISSIONS, INITIAL_SUBMISSIONS),
    grades: loadData<GradeRecord[]>(STORAGE_KEYS.GRADES, INITIAL_GRADES),
    activities: loadData<ActivityLog[]>(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES),
  };
}

export function saveAllState(state: {
  students: Student[];
  assignments: Assignment[];
  submissions: Submission[];
  grades: GradeRecord[];
  activities: ActivityLog[];
}) {
  saveData(STORAGE_KEYS.STUDENTS, state.students);
  saveData(STORAGE_KEYS.ASSIGNMENTS, state.assignments);
  saveData(STORAGE_KEYS.SUBMISSIONS, state.submissions);
  saveData(STORAGE_KEYS.GRADES, state.grades);
  saveData(STORAGE_KEYS.ACTIVITIES, state.activities);
}

export function resetToDefaultState() {
  localStorage.removeItem(STORAGE_KEYS.STUDENTS);
  localStorage.removeItem(STORAGE_KEYS.ASSIGNMENTS);
  localStorage.removeItem(STORAGE_KEYS.SUBMISSIONS);
  localStorage.removeItem(STORAGE_KEYS.GRADES);
  localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
  return {
    students: [...INITIAL_STUDENTS],
    assignments: [...INITIAL_ASSIGNMENTS],
    submissions: [...INITIAL_SUBMISSIONS],
    grades: [...INITIAL_GRADES],
    activities: [...INITIAL_ACTIVITIES],
  };
}

export function clearAllStorageData() {
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.GRADES, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify([]));
  return {
    students: [],
    assignments: [],
    submissions: [],
    grades: [],
    activities: [],
  };
}

export function exportStandaloneHTML(state: {
  students: Student[];
  assignments: Assignment[];
  submissions: Submission[];
  grades: GradeRecord[];
}) {
  const studentsJson = JSON.stringify(state.students);
  const assignmentsJson = JSON.stringify(state.assignments);
  const submissionsJson = JSON.stringify(state.submissions);
  const gradesJson = JSON.stringify(state.grades);

  const htmlContent = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TRỢ LÝ HỌC TẬP TIN HỌC THPT BÙI DỤC TÀI - GV TRẦN VĂN BÍCH</title>
  <style>
    :root {
      --primary: #0284c7;
      --primary-dark: #0369a1;
      --bg: #f8fafc;
      --card-bg: #ffffff;
      --text: #0f172a;
      --text-muted: #64748b;
      --border: #e2e8f0;
      --success: #10b981;
      --warning: #f59e0b;
      --danger: #ef4444;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.5;
      padding-bottom: 50px;
    }
    header {
      background: linear-gradient(135deg, #0f172a 0%, #0369a1 100%);
      color: white;
      padding: 24px 20px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 16px; }
    .badge { display: inline-block; padding: 3px 10px; border-radius: 9999px; font-size: 12px; font-weight: 600; }
    .badge-blue { background: #e0f2fe; color: #0284c7; }
    .badge-green { background: #d1fae5; color: #059669; }
    .badge-amber { background: #fef3c7; color: #d97706; }
    .badge-red { background: #fee2e2; color: #dc2626; }
    .nav-tabs { display: flex; gap: 8px; margin: 20px 0; border-bottom: 2px solid var(--border); padding-bottom: 8px; flex-wrap: wrap; }
    .tab-btn {
      background: none; border: none; padding: 10px 18px; font-size: 14px; font-weight: 600; cursor: pointer;
      border-radius: 8px; color: var(--text-muted); transition: all 0.2s;
    }
    .tab-btn.active { background: var(--primary); color: white; }
    .grid { display: grid; gap: 16px; }
    .grid-4 { grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
    .card { background: var(--card-bg); border-radius: 12px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); border: 1px solid var(--border); }
    .stat-number { font-size: 32px; font-weight: 800; color: var(--primary-dark); }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 14px; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid var(--border); }
    th { background: #f1f5f9; font-weight: 700; color: var(--text-muted); }
    tr:hover { background: #f8fafc; }
    .progress-bar-bg { background: #e2e8f0; border-radius: 999px; height: 10px; overflow: hidden; }
    .progress-bar-fill { background: var(--primary); height: 100%; transition: width 0.3s; }
    .filter-bar { display: flex; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; }
    .filter-bar input, .filter-bar select { padding: 8px 14px; border: 1px solid var(--border); border-radius: 6px; font-size: 14px; }
    .footer { text-align: center; margin-top: 40px; color: var(--text-muted); font-size: 13px; }
    @media print {
      header, .nav-tabs, .filter-bar { display: none !important; }
      body { background: white; }
      .card { border: none; box-shadow: none; }
    }
  </style>
</head>
<body>
  <header style="background: white; border-top: 5px solid #0050a0; border-bottom: 2px solid #e2e8f0; padding: 16px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
    <div class="container" style="display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap;">
      <div style="display: flex; align-items: center; gap: 16px;">
        <img src="./school-logo.jpg" alt="Logo THPT Bùi Dục Tài" style="width: 64px; height: 64px; border-radius: 12px; background: white; padding: 2px; object-fit: contain; border: 2px solid #e0f2fe; box-shadow: 0 2px 6px rgba(0,0,0,0.1);" onerror="this.style.display='none'">
        <div>
          <h1 style="font-size: 22px; font-weight: 900; color: #d11a2a; margin: 2px 0 4px; text-transform: uppercase; letter-spacing: -0.5px;">HỆ THỐNG TRỢ LÝ HỌC TẬP MÔN TIN HỌC</h1>
          <div style="font-size: 12px; color: #334155; font-weight: 700;"><span style="color: #0047a5;">TRƯỜNG THPT BÙI DỤC TÀI</span> • Thôn Đông Sơn, Xã Nam Hải Lăng, Tỉnh Quảng Trị • SĐT: 02333.876.253</div>
        </div>
      </div>
      <div style="background: #f8fafc; border: 1px solid #cbd5e1; padding: 8px 14px; border-radius: 10px; font-size: 12px; text-align: right;">
        <div style="font-weight: 800; color: #0f172a;">HỆ THỐNG TRỢ LÝ HỌC TẬP TIN HỌC THPT</div>
        <div style="color: #475569;">Phụ trách: <strong>Thầy Trần Văn Bích</strong> • Năm học 2026 - 2027</div>
      </div>
    </div>
  </header>

  <main class="container">
    <div class="nav-tabs">
      <button class="tab-btn active" onclick="switchTab('dashboard')">1. Tổng Quan</button>
      <button class="tab-btn" onclick="switchTab('students')">2. Quản Lý Học Sinh</button>
      <button class="tab-btn" onclick="switchTab('tasks')">3. Quản Lý Nhiệm Vụ</button>
      <button class="tab-btn" onclick="switchTab('progress')">4. Theo Dõi Tiến Độ</button>
      <button class="tab-btn" onclick="switchTab('grades')">5. Bảng Điểm & Kết Quả</button>
      <button class="tab-btn" style="margin-left: auto; background: #059669; color: white;" onclick="window.print()">In Báo Cáo / Xuất PDF</button>
    </div>

    <!-- TAB 1: DASHBOARD -->
    <div id="tab-dashboard" class="tab-content">
      <div class="grid grid-4" style="margin-bottom: 20px;">
        <div class="card">
          <div style="color: var(--text-muted); font-size: 13px; font-weight: 600;">Tổng số học sinh</div>
          <div class="stat-number" id="dash-total-students">0</div>
          <div style="font-size: 12px; color: var(--text-muted);">Khối 10 & Khối 11</div>
        </div>
        <div class="card">
          <div style="color: var(--text-muted); font-size: 13px; font-weight: 600;">Tổng số nhiệm vụ</div>
          <div class="stat-number" id="dash-total-tasks">0</div>
          <div style="font-size: 12px; color: var(--text-muted);">Bài tập thực hành & lý thuyết</div>
        </div>
        <div class="card">
          <div style="color: var(--text-muted); font-size: 13px; font-weight: 600;">Nhiệm vụ đang thực hiện</div>
          <div class="stat-number" id="dash-active-tasks">0</div>
          <div style="font-size: 12px; color: var(--text-muted);">Đang mở cho học sinh nộp</div>
        </div>
        <div class="card">
          <div style="color: var(--text-muted); font-size: 13px; font-weight: 600;">Tỷ lệ hoàn thành bài tập</div>
          <div class="stat-number" id="dash-completion-rate">0%</div>
          <div style="font-size: 12px; color: #059669;">Tổng hợp toàn bộ học sinh</div>
        </div>
      </div>

      <div class="card" style="margin-bottom: 20px;">
        <h3 style="margin-bottom: 12px;">Thông tin Giáo viên & Phòng máy Tin học</h3>
        <p>• <strong>Giáo viên phụ trách:</strong> Trần Văn Bích</p>
        <p>• <strong>Đơn vị:</strong> Trường THPT Bùi Dục Tài</p>
        <p>• <strong>Môn học:</strong> Tin học THPT (Lập trình Python, CSDL SQL, Mạng máy tính)</p>
        <p>• <strong>Ghi chú phòng máy:</strong> Học sinh thực hành xong lưu file vào thư mục cá nhân theo định dạng [MãHS_Tên_BaiTap] trên máy chủ nội bộ.</p>
      </div>
    </div>

    <!-- TAB 2: STUDENTS -->
    <div id="tab-students" class="tab-content" style="display: none;">
      <div class="card">
        <div class="filter-bar">
          <input type="text" id="student-search" placeholder="Tìm theo tên hoặc mã HS..." oninput="renderStudents()">
          <select id="student-class-filter" onchange="renderStudents()">
            <option value="">Tất cả các lớp</option>
            <option value="10A1">Lớp 10A1</option>
            <option value="10A2">Lớp 10A2</option>
            <option value="11A1">Lớp 11A1</option>
          </select>
        </div>
        <div style="overflow-x: auto;">
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Mã HS</th>
                <th>Họ và Tên</th>
                <th>Lớp</th>
                <th>Giới tính</th>
                <th>Trạng thái học tập</th>
                <th>Ghi chú</th>
              </tr>
            </thead>
            <tbody id="students-tbody"></tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- TAB 3: TASKS -->
    <div id="tab-tasks" class="tab-content" style="display: none;">
      <div class="card">
        <h3 style="margin-bottom: 16px;">Danh Sách Bài Học & Nhiệm Vụ Tin Học</h3>
        <div id="tasks-list" class="grid" style="grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));"></div>
      </div>
    </div>

    <!-- TAB 4: PROGRESS -->
    <div id="tab-progress" class="tab-content" style="display: none;">
      <div class="card">
        <h3 style="margin-bottom: 16px;">Tiến Độ Học Tập Chi Tiết Từng Học Sinh</h3>
        <div style="overflow-x: auto;">
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Mã HS</th>
                <th>Họ và Tên</th>
                <th>Lớp</th>
                <th>Đã giao</th>
                <th>Đã nộp</th>
                <th>Chưa hoàn thành</th>
                <th>Tỉ lệ hoàn thành</th>
              </tr>
            </thead>
            <tbody id="progress-tbody"></tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- TAB 5: GRADES -->
    <div id="tab-grades" class="tab-content" style="display: none;">
      <div class="card">
        <h3 style="margin-bottom: 16px;">Bảng Điểm Môn Tin Học - THPT Bùi Dục Tài</h3>
        <div style="overflow-x: auto;">
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Mã HS</th>
                <th>Họ và Tên</th>
                <th>Lớp</th>
                <th>TX 1</th>
                <th>TX 2</th>
                <th>Thực hành</th>
                <th>Giữa kỳ</th>
                <th>Cuối kỳ</th>
                <th>Điểm TB</th>
                <th>Xếp loại</th>
              </tr>
            </thead>
            <tbody id="grades-tbody"></tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="footer">
      Trường THPT Bùi Dục Tài • Bản quyền chuyên môn: Thầy Trần Văn Bích • Hệ thống Trợ lý học tập Tin học THPT
    </div>
  </main>

  <script>
    const students = ${studentsJson};
    const assignments = ${assignmentsJson};
    const submissions = ${submissionsJson};
    const grades = ${gradesJson};

    function calculateAverage(gr) {
      if (!gr) return null;
      const weights = [
        { v: gr.tx1, w: 1 }, { v: gr.tx2, w: 1 }, { v: gr.practice, w: 1 },
        { v: gr.midTerm, w: 2 }, { v: gr.finalTerm, w: 3 }
      ];
      let sum = 0, totalW = 0;
      for (const item of weights) {
        if (item.v !== null && item.v !== undefined && !isNaN(item.v)) {
          sum += item.v * item.w;
          totalW += item.w;
        }
      }
      return totalW ? (sum / totalW).toFixed(1) : null;
    }

    function switchTab(tabId) {
      document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
      document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
      document.getElementById('tab-' + tabId).style.display = 'block';
      event.target.classList.add('active');
    }

    function renderDashboard() {
      document.getElementById('dash-total-students').innerText = students.length;
      document.getElementById('dash-total-tasks').innerText = assignments.length;
      document.getElementById('dash-active-tasks').innerText = assignments.filter(a => a.status === 'Đang diễn ra').length;
      
      const completedSubs = submissions.filter(s => s.status === 'Đã hoàn thành').length;
      const totalPossible = submissions.length || 1;
      const rate = Math.round((completedSubs / totalPossible) * 100);
      document.getElementById('dash-completion-rate').innerText = rate + '%';
    }

    function renderStudents() {
      const q = (document.getElementById('student-search')?.value || '').toLowerCase();
      const cls = document.getElementById('student-class-filter')?.value || '';
      const tbody = document.getElementById('students-tbody');
      
      const filtered = students.filter(s => {
        const matchesQ = s.name.toLowerCase().includes(q) || s.studentCode.toLowerCase().includes(q);
        const matchesCls = !cls || s.classRoom === cls;
        return matchesQ && matchesCls;
      });

      tbody.innerHTML = filtered.map((s, idx) => \`
        <tr>
          <td>\${idx + 1}</td>
          <td><strong>\${s.studentCode}</strong></td>
          <td>\${s.name}</td>
          <td><span class="badge badge-blue">\${s.classRoom}</span></td>
          <td>\${s.gender}</td>
          <td><span class="badge \${s.status === 'Xuất sắc' ? 'badge-green' : s.status === 'Cần hỗ trợ' ? 'badge-amber' : 'badge-blue'}">\${s.status}</span></td>
          <td style="color: var(--text-muted); font-size: 13px;">\${s.notes || '-'}</td>
        </tr>
      \`).join('');
    }

    function renderTasks() {
      const container = document.getElementById('tasks-list');
      container.innerHTML = assignments.map(a => {
        const classSubs = submissions.filter(s => s.assignmentId === a.id);
        const completed = classSubs.filter(s => s.status === 'Đã hoàn thành').length;
        const total = classSubs.length || 1;
        const pct = Math.round((completed / total) * 100);

        return \`
          <div class="card" style="border-top: 4px solid var(--primary);">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
              <span class="badge badge-blue">\${a.topic}</span>
              <span class="badge \${a.status === 'Đang diễn ra' ? 'badge-green' : a.status === 'Sắp hết hạn' ? 'badge-amber' : 'badge-red'}">\${a.status}</span>
            </div>
            <h4 style="font-size: 16px; margin-bottom: 6px;">\${a.title}</h4>
            <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 12px;">\${a.description}</p>
            <div style="font-size: 12px; margin-bottom: 8px;">
              <strong>Lớp:</strong> \${a.targetClass} • <strong>Hạn nộp:</strong> \${a.dueDate}
            </div>
            <div style="margin-top: 10px;">
              <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
                <span>Tiến độ nộp bài:</span>
                <strong>\${completed}/\${total} (\${pct}%)</strong>
              </div>
              <div class="progress-bar-bg">
                <div class="progress-bar-fill" style="width: \${pct}%;"></div>
              </div>
            </div>
          </div>
        \`;
      }).join('');
    }

    function renderProgress() {
      const tbody = document.getElementById('progress-tbody');
      tbody.innerHTML = students.map((s, idx) => {
        const studentTasks = assignments.filter(a => a.targetClass === 'Tất cả' || a.targetClass === s.classRoom);
        const totalAssigned = studentTasks.length;
        const studentSubs = submissions.filter(sub => sub.studentId === s.id && sub.status === 'Đã hoàn thành');
        const completed = studentSubs.length;
        const uncompleted = Math.max(0, totalAssigned - completed);
        const pct = totalAssigned ? Math.round((completed / totalAssigned) * 100) : 0;

        return \`
          <tr>
            <td>\${idx + 1}</td>
            <td><strong>\${s.studentCode}</strong></td>
            <td>\${s.name}</td>
            <td><span class="badge badge-blue">\${s.classRoom}</span></td>
            <td>\${totalAssigned}</td>
            <td style="color: #059669; font-weight: 600;">\${completed}</td>
            <td style="color: #dc2626; font-weight: 600;">\${uncompleted}</td>
            <td style="min-width: 140px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <div class="progress-bar-bg" style="flex: 1;">
                  <div class="progress-bar-fill" style="width: \${pct}%;"></div>
                </div>
                <span style="font-size: 12px; font-weight: 700; width: 35px;">\${pct}%</span>
              </div>
            </td>
          </tr>
        \`;
      }).join('');
    }

    function renderGrades() {
      const tbody = document.getElementById('grades-tbody');
      tbody.innerHTML = students.map((s, idx) => {
        const gr = grades.find(g => g.studentId === s.id);
        const avg = calculateAverage(gr);
        let rank = 'Chưa đủ';
        let badgeCls = 'badge-blue';
        if (avg !== null) {
          if (avg >= 8.0) { rank = 'Giỏi'; badgeCls = 'badge-green'; }
          else if (avg >= 6.5) { rank = 'Khá'; badgeCls = 'badge-blue'; }
          else if (avg >= 5.0) { rank = 'Đạt'; badgeCls = 'badge-amber'; }
          else { rank = 'Chưa đạt'; badgeCls = 'badge-red'; }
        }

        return \`
          <tr>
            <td>\${idx + 1}</td>
            <td><strong>\${s.studentCode}</strong></td>
            <td>\${s.name}</td>
            <td><span class="badge badge-blue">\${s.classRoom}</span></td>
            <td>\${gr?.tx1 ?? '-'}</td>
            <td>\${gr?.tx2 ?? '-'}</td>
            <td>\${gr?.practice ?? '-'}</td>
            <td>\${gr?.midTerm ?? '-'}</td>
            <td>\${gr?.finalTerm ?? '-'}</td>
            <td><strong style="font-size: 15px; color: var(--primary-dark);">\${avg ?? '-'}</strong></td>
            <td><span class="badge \${badgeCls}">\${rank}</span></td>
          </tr>
        \`;
      }).join('');
    }

    // Init all tabs
    renderDashboard();
    renderStudents();
    renderTasks();
    renderProgress();
    renderGrades();
  </script>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Tro_Ly_Tin_Hoc_Bui_Duc_Tai_Offline.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
