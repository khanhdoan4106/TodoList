// src/utils.js
// Hằng số và hàm thuần (không phụ thuộc React) dùng chung trong toàn app.
// File này phải được load TRƯỚC mọi component vì chúng dùng các hàm/hằng số ở đây.

const STORAGE_KEY = "focus_tasks_v4";

function migrateTasks(raw) {
  if (!Array.isArray(raw)) return [];
  return raw.map((item, i) => {
    const userSet = !!item.priorityUserSet;
    const priority = userSet
      ? Math.min(5, Math.max(0, Number(item.priority) || 0))
      : 0;
    return {
      id: item.id ?? Date.now() + i,
      order: item.order ?? i + 1,
      name: (item.name ?? item.text ?? "").trim(),
      priority,
      priorityUserSet: userSet,
      notes: item.notes ?? "",
      done: !!item.done,
      tag: item.tag ?? null,
    };
  });
}

function sortByOrder(list) {
  return [...list].sort((a, b) => a.order - b.order);
}

const DAYS = ["Chủ nhật","Thứ hai","Thứ ba","Thứ tư","Thứ năm","Thứ sáu","Thứ bảy"];
const MONTHS = ["tháng 1","tháng 2","tháng 3","tháng 4","tháng 5","tháng 6","tháng 7","tháng 8","tháng 9","tháng 10","tháng 11","tháng 12"];

// Demo suggestions by keyword
const DEMO_SUGGESTIONS = {
  default: [
    "Xác định mục tiêu cụ thể và deadline",
    "Chia nhỏ thành các bước hành động 15-30 phút",
    "Ưu tiên theo mức độ quan trọng và khẩn cấp",
    "Loại bỏ điều gây phân tâm trong lúc làm",
    "Đặt lịch nhắc nhở và kiểm tra tiến độ"
  ],
  học: [
    "Đọc tài liệu và ghi chú nhanh ý chính",
    "Làm flashcard cho các khái niệm quan trọng",
    "Giải bài tập / bài kiểm tra thử",
    "Ôn lại sau 24h để ghi nhớ sâu hơn",
    "Giải thích lại cho người khác để kiểm tra hiểu biết"
  ],
  code: [
    "Đọc và hiểu rõ yêu cầu bài toán",
    "Phác thảo thuật toán / flow trên giấy",
    "Viết test case trước khi code",
    "Code từng phần nhỏ và test ngay",
    "Review lại code và tối ưu nếu cần"
  ],
  project: [
    "Định nghĩa rõ scope và deliverable",
    "Lên timeline với các milestone cụ thể",
    "Phân công và ước tính effort từng task",
    "Xác định rủi ro và phương án dự phòng",
    "Họp kick-off và đồng bộ với team"
  ]
};

function getDemoSuggestions(text) {
  const lower = text.toLowerCase();
  if (lower.includes("học") || lower.includes("ôn") || lower.includes("thi")) return DEMO_SUGGESTIONS.học;
  if (lower.includes("code") || lower.includes("lập trình") || lower.includes("app") || lower.includes("web")) return DEMO_SUGGESTIONS.code;
  if (lower.includes("project") || lower.includes("dự án") || lower.includes("team")) return DEMO_SUGGESTIONS.project;
  return DEMO_SUGGESTIONS.default;
}

function todayLabel() {
  const d = new Date();
  return `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

function formatSceneClock() {
  const d = new Date();
  return {
    time: d.toLocaleTimeString("vi-VN", {
      hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
    }),
    date: d.toLocaleDateString("vi-VN", {
      weekday: "short", day: "numeric", month: "short",
    }),
  };
}

const VICTORY_QUOTE = {
  text: "All we have to decide is what to do with the time that is given us.",
  author: "Gandalf",
  source: "The Lord of the Rings"
};

const FILTER_HINT = {
  active: {
    icon: "💪",
    title: "Cố lên nhé!",
    body: "Mỗi bước nhỏ đều đưa bạn gần hơn tới đích. Chọn một việc, bắt đầu ngay — bạn làm được!",
  },
  done: {
    icon: "🎉",
    title: "Chúc mừng bạn!",
    body: "Đây là những gì bạn đã chinh phục. Hãy tự hào và dành cho mình chút thời gian nghỉ ngơi xứng đáng.",
  },
};
