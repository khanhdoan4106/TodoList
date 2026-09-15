// src/components/Checkbox.js
function Checkbox({ checked, onChange }) {
  return (
    <label style={{ position:"relative", flexShrink:0, marginTop:1, cursor:"pointer" }}>
      <input type="checkbox" checked={checked} onChange={onChange}
        style={{ position:"absolute", opacity:0, width:20, height:20, cursor:"pointer", margin:0 }}/>
      <span style={{
        width:20, height:20, borderRadius:"50%",
        border: checked ? "1.8px solid #9acd32" : "1.8px solid #d5d0c8",
        background: checked ? "#9acd32" : "transparent",
        display:"flex", alignItems:"center", justifyContent:"center",
        transition:"all 0.18s cubic-bezier(.4,0,.2,1)", pointerEvents:"none"
      }}>
        {checked && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </span>
    </label>
  );
}
