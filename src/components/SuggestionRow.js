// src/components/SuggestionRow.js
// Trạng thái "đã thêm" do App quản lý để đồng bộ với nút "Thêm tất cả".
function SuggestionRow({ text, added, onAdd, t }) {
  return (
    <li style={{
      display: "flex", alignItems: "center", gap: 12, padding: "8px 0",
      borderTop: `1px solid ${t.rule}`,
    }}>
      <span style={{ flex: 1, fontSize: 15, color: added ? t.muted : t.ink }}>{text}</span>
      <button type="button" className="btn" onClick={() => { if (!added) onAdd(); }} disabled={added}
        style={{ height: 30, padding: "0 10px", fontSize: 13 }}>
        {added ? "Đã thêm" : "Thêm"}
      </button>
    </li>
  );
}
