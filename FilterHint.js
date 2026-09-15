// src/components/FilterHint.js
// Phụ thuộc: FILTER_HINT từ utils.js (phải load trước)
function FilterHint({ filter, t, dark, show }) {
  if (!show || (filter !== "active" && filter !== "done")) return null;
  const hint = FILTER_HINT[filter];
  const isDone = filter === "done";
  return (
    <div style={{
      margin:"0 24px 12px", padding:"14px 16px", borderRadius:12,
      border: `1px solid ${isDone ? (dark ? "#3d4a28" : "#d4e8b0") : (dark ? "#3a3530" : "#e8e4dd")}`,
      background: isDone
        ? (dark ? "rgba(45,58,30,0.45)" : "rgba(197,225,122,0.2)")
        : (dark ? "rgba(45,42,38,0.5)" : "rgba(247,246,243,0.9)"),
    }}>
      <div style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
        <span style={{ fontSize:22, lineHeight:1 }} aria-hidden="true">{hint.icon}</span>
        <div>
          <p style={{ margin:0, fontSize:14, fontWeight:700, color: isDone ? t.doneTxt : t.text }}>
            {hint.title}
          </p>
          <p style={{ margin:"6px 0 0", fontSize:13, lineHeight:1.55, color: t.muted }}>
            {hint.body}
          </p>
        </div>
      </div>
    </div>
  );
}
