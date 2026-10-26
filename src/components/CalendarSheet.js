// src/components/CalendarSheet.js
// Đầu trang dạng tờ lịch bloc: số ngày thật lớn, thứ, tháng/năm và ngày âm lịch.
// Chủ nhật in đỏ như lịch thật. Phụ thuộc: DAYS (utils.js), lunarLabel (lunar.js).
function CalendarSheet({ doneCount, total, actions, t }) {
  const [now, setNow] = React.useState(() => new Date());

  // Sang ngày mới thì tờ lịch tự đổi
  React.useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const isSunday = now.getDay() === 0;
  const weekday = DAYS[now.getDay()].replace(/^Thứ (\S)/, (m, c) => "Thứ " + c.toUpperCase());
  const pct = total ? Math.round((doneCount / total) * 100) : 0;
  const progressText = total === 0
    ? "Chưa có việc nào cho hôm nay"
    : doneCount === total
      ? `Xong cả ${total} việc`
      : `Xong ${doneCount} trong ${total} việc`;

  return (
    <header>
      <div className="binding" aria-hidden="true"/>
      <div style={{ padding: "16px 28px 22px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: t.muted }}>
            Tháng {now.getMonth() + 1}, {now.getFullYear()}
          </span>
          <div style={{ display: "flex", gap: 6 }}>{actions}</div>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", gap: 20, marginTop: 10, flexWrap: "wrap" }}>
          <h1 className="day-number" style={{ color: isSunday ? t.red : t.ink }}
            aria-label={`Hôm nay, ${weekday} ngày ${now.getDate()} tháng ${now.getMonth() + 1}`}>
            {now.getDate()}
          </h1>
          <div style={{ flex: "1 1 160px", minWidth: 0, paddingBottom: 6 }}>
            <p style={{ fontSize: 28, fontWeight: 600, lineHeight: 1.1, color: isSunday ? t.red : t.ink }}>{weekday}</p>
            <p style={{ fontSize: 15, color: t.muted, marginTop: 4 }}>Âm lịch {lunarLabel(now)}</p>
            <div style={{ marginTop: 14 }}>
              <div style={{ height: 4, background: t.sunken, borderRadius: 2, overflow: "hidden" }}
                role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label="Tiến độ hôm nay">
                <div style={{ width: `${pct}%`, height: "100%", background: t.ink, transition: "width 0.4s ease" }}/>
              </div>
              <p style={{ fontSize: 14, color: t.muted, marginTop: 6 }}>{progressText}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="tear" aria-hidden="true"/>
    </header>
  );
}
