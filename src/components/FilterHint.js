// src/components/FilterHint.js
// Lời động viên ngắn ở tab Chưa xong / Đã xong.
// Phụ thuộc: FILTER_HINT từ utils.js (phải load trước)
function FilterHint({ filter, t, show }) {
  if (!show || (filter !== "active" && filter !== "done")) return null;
  const hint = FILTER_HINT[filter];
  return (
    <p style={{ fontSize: 14, lineHeight: 1.55, color: t.muted, padding: "4px 0 12px" }}>
      <strong style={{ color: t.ink, fontWeight: 600 }}>{hint.title}</strong> {hint.body}
    </p>
  );
}
