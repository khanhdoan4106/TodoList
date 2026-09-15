// src/components/StarRating.js
function StarRating({ value, onChange, dark }) {
  const v = Math.min(5, Math.max(0, value));
  return (
    <div style={{ display:"flex", gap:1, justifyContent:"center" }} title={v === 0 ? "Chưa đặt ưu tiên" : `Ưu tiên ${v}/5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className="star-btn"
          aria-label={`${star} sao`}
          onClick={() => onChange(v === star ? 0 : star)}
          style={{ color: v > 0 && star <= v ? "#f5b800" : (dark ? "#4a4a46" : "#d5d0c8") }}
        >
          {v > 0 && star <= v ? "★" : "☆"}
        </button>
      ))}
    </div>
  );
}
