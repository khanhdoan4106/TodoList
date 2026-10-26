// src/components/StarRating.js
// Mức ưu tiên 0–5. Sao đã chọn in đỏ như mực đỏ đánh dấu trên lịch.
function StarRating({ value, onChange, t }) {
  const v = Math.min(5, Math.max(0, value));
  return (
    <div style={{ display: "flex", paddingTop: 2 }} role="group"
      aria-label={v === 0 ? "Chưa đặt mức ưu tiên" : `Ưu tiên ${v} trên 5`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const on = v > 0 && star <= v;
        return (
          <button
            key={star}
            type="button"
            className="star-btn"
            aria-label={v === star ? `Bỏ mức ưu tiên ${star}` : `Ưu tiên ${star} trên 5`}
            aria-pressed={on}
            onClick={() => onChange(v === star ? 0 : star)}
            style={{ color: on ? t.red : t.faint }}
          >
            {on ? "★" : "☆"}
          </button>
        );
      })}
    </div>
  );
}
