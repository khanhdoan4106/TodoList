// src/components/SuggestionRow.js
function SuggestionRow({ text, onAdd, t }) {
  const [added, setAdded] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        display:"flex", alignItems:"center", gap:10, padding:"9px 10px",
        borderRadius:6, transition:"all 0.12s",
        border: hovered ? `1px solid ${t.border}` : "1px solid transparent",
        background: hovered ? t.surface : "transparent"
      }}>
      <div style={{ width:6, height:6, borderRadius:"50%", background:"#4f8ef7", flexShrink:0 }}/>
      <span style={{ flex:1, fontSize:13.5, color: t.muted }}>{text}</span>
      <button onClick={() => { if (!added) { onAdd(text); setAdded(true); } }}
        style={{
          fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:11, fontWeight:700,
          color: added ? "#30a46c" : "#4f8ef7",
          background: added ? t.greenBg : t.aiBg,
          border:"none", borderRadius:4, padding:"4px 9px",
          cursor: added ? "default" : "pointer",
          transition:"all 0.12s", whiteSpace:"nowrap"
        }}>
        {added ? "✓ Đã thêm" : "+ Thêm"}
      </button>
    </div>
  );
}
