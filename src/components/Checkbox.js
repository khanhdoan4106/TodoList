// src/components/Checkbox.js
// Ô vuông như ô đánh dấu trên giấy; tick xong thì tô mực.
function Checkbox({ checked, onChange, label, t }) {
  return (
    <label style={{ position: "relative", display: "block", width: 22, height: 22, cursor: "pointer" }}>
      <input type="checkbox" checked={checked} onChange={onChange}
        aria-label={checked ? `Bỏ đánh dấu xong: ${label}` : `Đánh dấu xong: ${label}`}
        style={{ position: "absolute", inset: 0, opacity: 0, margin: 0, cursor: "pointer" }}/>
      <span aria-hidden="true" style={{
        width: 22, height: 22, borderRadius: 4,
        border: `2px solid ${checked ? t.ink : t.faint}`,
        background: checked ? t.ink : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "background 0.15s, border-color 0.15s", pointerEvents: "none",
      }}>
        {checked && (
          <svg width="12" height="10" viewBox="0 0 10 8" fill="none">
            <path d="M1 4l3 3 5-6" stroke={t.paper} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </span>
    </label>
  );
}
