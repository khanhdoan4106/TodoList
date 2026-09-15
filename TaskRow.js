// src/components/TaskRow.js
// Phụ thuộc: StarRating, Checkbox (phải load trước file này)
function TaskRow({ task, stt, onToggle, onUpdate, onSetPriority, onDelete, animating, t, dark }) {
  const displayPriority = task.priorityUserSet ? task.priority : 0;
  const nameStyle = {
    color: task.done ? t.doneTxt : t.text,
    textDecoration: task.done ? "line-through" : "none",
    textDecorationColor: task.done ? t.doneStrike : "transparent",
  };

  return (
    <tr
      className={task.done ? "task-row-done" : ""}
      style={{ animation: animating ? "fadeSlide 0.2s ease" : "none", transition:"background 0.2s" }}
    >
      <td style={{ width:40, textAlign:"center", fontWeight:700, color: t.faintTxt, fontSize:12 }}>
        {stt}
      </td>
      <td style={{ minWidth:140 }}>
        <input
          className="task-input"
          value={task.name}
          onChange={(e) => onUpdate(task.id, { name: e.target.value })}
          placeholder="Tên hoạt động"
          style={{ ...nameStyle, fontWeight:500 }}
        />
        {task.tag ? (
          <span style={{
            display:"inline-block", marginTop:4, fontSize:10, fontWeight:600,
            padding:"1px 6px", borderRadius:4, background: t.tagBg, color: t.tagTxt,
          }}>{task.tag}</span>
        ) : null}
      </td>
      <td style={{ width:108 }}>
        <StarRating
          value={displayPriority}
          onChange={(p) => onSetPriority(task.id, p)}
          dark={dark}
        />
      </td>
      <td style={{ minWidth:120 }}>
        <input
          className="task-notes"
          value={task.notes}
          onChange={(e) => onUpdate(task.id, { notes: e.target.value })}
          placeholder="Ghi chú…"
          style={{ color: t.muted, fontSize:12 }}
        />
      </td>
      <td style={{ width:52, textAlign:"center" }}>
        <Checkbox checked={task.done} onChange={() => onToggle(task.id)}/>
      </td>
      <td style={{ width:36 }}>
        <button
          type="button"
          onClick={() => onDelete(task.id)}
          title="Xóa"
          style={{
            background:"none", border:"none", cursor:"pointer", color: t.faintTxt,
            padding:4, borderRadius:4, display:"flex", alignItems:"center",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </td>
    </tr>
  );
}
