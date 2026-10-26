// src/components/DarkToggle.js
function DarkToggle({ dark, onToggle }) {
  return (
    <button type="button" className="icon-btn" onClick={onToggle}
      title={dark ? "Chuyển sang nền sáng" : "Chuyển sang nền tối"}
      aria-label={dark ? "Chuyển sang nền sáng" : "Chuyển sang nền tối"}
      style={{ color: "var(--muted)" }}>
      {dark
        ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
        : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      }
    </button>
  );
}
