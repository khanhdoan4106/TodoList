// src/components/DemoBanner.js
function DemoBanner({ t }) {
  const [closed, setClosed] = React.useState(false);
  if (closed) return null;
  return (
    <div style={{
      margin:"8px 24px 0", padding:"10px 14px",
      background: t.aiBg, borderRadius:10,
      border:`1px solid ${t.border}`, animation:"fadeSlide 0.2s ease",
      display:"flex", alignItems:"flex-start", gap:10
    }}>
      <span style={{ fontSize:16, flexShrink:0, marginTop:1 }}>✨</span>
      <div style={{ flex:1 }}>
        <p style={{ fontSize:12.5, color: t.aiTxt, fontWeight:700, marginBottom:3 }}>Chế độ Demo AI</p>
        <p style={{ fontSize:12, color: t.muted, lineHeight:1.5 }}>
          Đây là gợi ý mẫu. Để dùng AI thật, thêm API Key từ{" "}
          <a href="https://console.anthropic.com" target="_blank" style={{ color: t.aiTxt }}>console.anthropic.com</a>
          {" "}(miễn phí $5 credit khi đăng ký).
        </p>
      </div>
      <button onClick={() => setClosed(true)}
        style={{ background:"none", border:"none", cursor:"pointer", color: t.muted, fontSize:16, lineHeight:1, flexShrink:0 }}>×</button>
    </div>
  );
}
