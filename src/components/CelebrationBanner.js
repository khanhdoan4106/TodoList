// src/components/CelebrationBanner.js
function CelebrationBanner({ dark }) {
  return (
    <div className={`celebration-banner ${dark ? "dark" : "light"}`} role="status" aria-live="polite">
      <p className="celebration-title">Chúc mừng!</p>
      <p className="celebration-sub">Bạn đã hoàn thành tất cả công việc.</p>
      <p className="celebration-rest">Hãy nghỉ ngơi đầy đủ nhé.</p>
    </div>
  );
}
