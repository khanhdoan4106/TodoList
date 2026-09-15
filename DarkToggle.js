// src/components/DarkToggle.js
function DarkToggle({ dark, onToggle }) {
  return (
    <button onClick={onToggle} title={dark ? "Chế độ sáng" : "Chế độ tối"}
      style={{
        background: dark ? "#2e2e2b" : "#e8e4dd",
        border:"none", borderRadius:20, padding:"6px 10px",
        cursor:"pointer", display:"flex", alignItems:"center", gap:5,
        transition:"all 0.2s", flexShrink:0
      }}>
      {dark
        ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="5" stroke="#e8e4dd" strokeWidth="2"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="#e8e4dd" strokeWidth="1.8" strokeLinecap="round"/></svg>
        : <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="#6b6660" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      }
    </button>
  );
}
