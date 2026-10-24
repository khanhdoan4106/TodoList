// src/components/IllustGlow.js
function IllustGlow({ dark, soft, className, style, children }) {
  const glow = dark ? (soft ? "illust-glow-cup" : "illust-glow-dark") : "";
  return (
    <div className={[glow, className].filter(Boolean).join(" ")} style={style}>
      {children}
    </div>
  );
}
