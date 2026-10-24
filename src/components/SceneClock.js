// src/components/SceneClock.js
// Phụ thuộc: formatSceneClock() từ utils.js (phải load trước)
function SceneClock({ dark }) {
  const [now, setNow] = React.useState(formatSceneClock);

  React.useEffect(() => {
    const tick = () => setNow(formatSceneClock());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="scene-clock float-a"
      style={{
        position: "absolute",
        left: "50%",
        bottom: 22,
        transform: "translateX(-50%)",
        zIndex: 3,
        minWidth: 88,
        padding: "8px 12px 10px",
        borderRadius: 12,
        textAlign: "center",
        border: dark ? "1.5px solid #5a4a36" : "1.5px solid #d4a96a",
        background: dark
          ? "linear-gradient(180deg, #3d3224 0%, #2a2418 100%)"
          : "linear-gradient(180deg, #faf3e8 0%, #f0e0c8 100%)",
        boxShadow: dark
          ? "0 4px 16px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,220,150,0.12)"
          : "0 4px 14px rgba(180,140,80,0.2), inset 0 1px 0 rgba(255,255,255,0.8)",
      }}
      aria-live="off"
      aria-label={`Giờ hiện tại ${now.time}`}
    >
      <div style={{
        fontSize: 9, fontWeight: 700, letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: dark ? "#c5e17a" : "#a07840",
        marginBottom: 4,
      }}>
        Bây giờ
      </div>
      <div
        className="scene-clock-time"
        style={{
          fontSize: 17, fontWeight: 700, letterSpacing: "0.06em", lineHeight: 1.1,
          color: dark ? "#ffe8b0" : "#5c4030",
          fontFamily: "'Plus Jakarta Sans', monospace",
        }}
      >
        {now.time}
      </div>
      <div style={{
        fontSize: 10, fontWeight: 500, marginTop: 5,
        color: dark ? "#b0aba3" : "#8a8078",
      }}>
        {now.date}
      </div>
    </div>
  );
}
