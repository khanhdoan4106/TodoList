// src/components/DemoBanner.js
// Một dòng giải thích trong khung gợi ý khi chưa có API key.
function DemoBanner({ t, onOpenKey }) {
  return (
    <p style={{ fontSize: 14, color: t.muted, padding: "0 0 8px" }}>
      Đây là gợi ý mẫu vì chưa có API key.{" "}
      <button type="button" onClick={onOpenKey}
        style={{ border: 0, background: "none", padding: 0, color: t.ink, fontWeight: 600, textDecoration: "underline", textUnderlineOffset: 3, cursor: "pointer" }}>
        Thêm API key
      </button>{" "}để dùng AI thật.
    </p>
  );
}
