// src/components/TaskRow.js
// Một việc = một dòng: ô tick, tên (ghi chú ngay dưới), sao ưu tiên, nút xoá.
// Phụ thuộc: StarRating, Checkbox (phải load trước file này)
function TaskRow({ task, onToggle, onUpdate, onSetPriority, onDelete, animating, t }) {
  const displayPriority = task.priorityUserSet ? task.priority : 0;

  return (
    <li
      className="task-row"
      style={{
        borderTop: `1px solid ${t.rule}`,
        animation: animating ? "fadeSlide 0.2s ease" : "none",
      }}
    >
      <div style={{ paddingTop: 1 }}>
        <Checkbox checked={task.done} onChange={() => onToggle(task.id)} label={task.name} t={t}/>
      </div>
      <div className="task-body">
        <input
          className="task-input"
          value={task.name}
          onChange={(e) => onUpdate(task.id, { name: e.target.value })}
          placeholder="Tên công việc"
          aria-label="Tên công việc"
          style={{
            color: task.done ? t.muted : t.ink,
            textDecoration: task.done ? "line-through" : "none",
            textDecorationThickness: 1.5,
          }}
        />
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          {task.tag ? (
            <span style={{ fontSize: 12, fontWeight: 600, color: t.muted, flexShrink: 0 }} title="Việc do AI gợi ý">
              {task.tag}
            </span>
          ) : null}
          <input
            className="task-notes"
            value={task.notes}
            onChange={(e) => onUpdate(task.id, { notes: e.target.value })}
            placeholder="Thêm ghi chú"
            aria-label="Ghi chú"
          />
        </div>
      </div>
      <div className="task-stars"><StarRating value={displayPriority} onChange={(p) => onSetPriority(task.id, p)} t={t}/></div>
      <button type="button" className="icon-btn task-delete" onClick={() => onDelete(task.id)}
        title="Xoá việc này" aria-label={`Xoá việc ${task.name}`}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
    </li>
  );
}
