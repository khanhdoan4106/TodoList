// src/theme.js
// Bảng màu lấy từ lịch bloc (lịch xé): giấy trắng, mực đen, đỏ cho Chủ nhật.
// Màu đỏ chỉ dùng cho Chủ nhật, mức ưu tiên và lỗi; phần còn lại là mực và giấy.
// Phải load sau utils.js, trước mọi component dùng useTheme().

function useTheme(dark) {
  return dark
    ? {
        desk:   "#121417",
        paper:  "#1b1e22",
        sunken: "#23272c",
        ink:    "#eceef0",
        muted:  "#9aa1a9",
        faint:  "#5e656d",
        rule:   "#2b3036",
        red:    "#ff6066",
        redBg:  "rgba(255, 96, 102, 0.12)",
      }
    : {
        desk:   "#e9ebee",
        paper:  "#ffffff",
        sunken: "#f3f4f6",
        ink:    "#16181b",
        muted:  "#5d636b",
        faint:  "#a3a9b0",
        rule:   "#e1e4e8",
        red:    "#c8102e",
        redBg:  "rgba(200, 16, 46, 0.07)",
      };
}
