// src/App.js
// Phải load SAU CÙNG — dùng utils.js, theme.js và toàn bộ components/*.js ở trên.
const { useState, useEffect, useRef } = React;

function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || localStorage.getItem("focus_tasks_v3") || "[]");
      return migrateTasks(raw);
    } catch { return []; }
  });
  const [input, setInput]               = useState("");
  const [filter, setFilter]             = useState("all");
  const [aiState, setAiState]           = useState("hidden");
  const [suggestions, setSuggestions]   = useState([]);
  const [newIds, setNewIds]             = useState(new Set());
  const [apiKey, setApiKey]             = useState(() => localStorage.getItem("focus_api_key") || "");
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [dark, setDark]                 = useState(() => localStorage.getItem("focus_dark") === "1");
  const [isDemo, setIsDemo]             = useState(false);
  const [aiError, setAiError]           = useState("");
  const [addedSuggestions, setAddedSuggestions] = useState(new Set());
  const [victoryVisible, setVictoryVisible] = useState(false);
  const [celebrateShow, setCelebrateShow] = useState(false);
  const wasAllCompleteRef = useRef(false);
  const celebrateMountedRef = useRef(false);
  const inputRef = useRef(null);
  const t = useTheme(dark);

  const sorted = sortByOrder(tasks);
  const active = sorted.filter(tk => !tk.done);
  const done   = sorted.filter(tk => tk.done);
  const allComplete = tasks.length > 0 && active.length === 0 && done.length > 0;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if (done.length > 0 && active.length === 0) setVictoryVisible(true);
    if (done.length === 0) setVictoryVisible(false);
  }, [done.length, active.length]);

  useEffect(() => {
    if (!celebrateMountedRef.current) {
      celebrateMountedRef.current = true;
      wasAllCompleteRef.current = allComplete;
      return;
    }
    if (allComplete && !wasAllCompleteRef.current) {
      setCelebrateShow(true);
      const timer = setTimeout(() => setCelebrateShow(false), 3000);
      wasAllCompleteRef.current = true;
      return () => clearTimeout(timer);
    }
    if (!allComplete) {
      wasAllCompleteRef.current = false;
    }
  }, [allComplete]);

  // Đưa bảng màu lên :root để CSS (styles.css) và các component dùng chung
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(t).forEach(([key, value]) => root.style.setProperty(`--${key}`, value));
    root.style.colorScheme = dark ? "dark" : "light";
    document.body.className = dark ? "dark" : "light";
    localStorage.setItem("focus_dark", dark ? "1" : "0");
  }, [dark]);


  function addTask(text, tag) {
    const val = (text || input).trim();
    if (!val) return;
    const id = Date.now() + Math.random();
    setTasks((prev) => {
      const nextOrder = prev.length ? Math.max(...prev.map((tk) => tk.order)) + 1 : 1;
      return [...prev, {
        id,
        order: nextOrder,
        name: val,
        priority: 0,
        priorityUserSet: false,
        notes: "",
        done: false,
        tag: tag || null,
      }];
    });
    setNewIds((prev) => new Set([...prev, id]));
    setTimeout(() => setNewIds((prev) => { const n = new Set(prev); n.delete(id); return n; }), 400);
    if (!text) setInput("");
  }
  function updateTask(id, patch) {
    const { priority, priorityUserSet, ...safe } = patch;
    setTasks((prev) => prev.map((tk) => (tk.id === id ? { ...tk, ...safe } : tk)));
  }
  function setTaskPriority(id, priority) {
    const p = Math.min(5, Math.max(0, priority));
    setTasks((prev) => prev.map((tk) => (tk.id === id ? {
      ...tk,
      priority: p,
      priorityUserSet: p > 0,
    } : tk)));
  }
  function toggleTask(id) {
    setTasks((prev) => prev.map((tk) => (tk.id === id ? { ...tk, done: !tk.done } : tk)));
  }
  function deleteTask(id) {
    setTasks((prev) => {
      const next = prev.filter((tk) => tk.id !== id);
      return sortByOrder(next).map((tk, i) => ({ ...tk, order: i + 1 }));
    });
  }

  async function askAI() {
    const task = input.trim();
    if (!task) { inputRef.current?.focus(); return; }

    setAiState("loading");
    setSuggestions([]);
    setAddedSuggestions(new Set());
    setAiError("");
    setIsDemo(false);

    if (!apiKey) {
      // Demo mode
      await new Promise(r => setTimeout(r, 900));
      setSuggestions(getDemoSuggestions(task));
      setAiState("done");
      setIsDemo(true);
      return;
    }

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-calls": "true"
        },
        body: JSON.stringify({
          model: AI_MODEL,
          max_tokens: 800,
          system: "Bạn là trợ lý quản lý công việc. Chia mục tiêu thành 4-6 việc nhỏ cụ thể có thể hành động ngay. Trả lời CHỈ bằng JSON array các string ngắn gọn, không markdown, không giải thích.",
          messages: [{ role: "user", content: task }]
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(describeApiError(res.status, data?.error?.message));
      }
      const textBlock = data.content?.find(b => b.type === "text");
      const items = parseSuggestions(textBlock?.text || "");
      if (!items.length) throw new Error("AI không trả về gợi ý hợp lệ. Thử diễn đạt lại mục tiêu.");
      setSuggestions(items);
      setAiState("done");
    } catch(e) {
      console.error(e);
      setAiError(e instanceof TypeError
        ? "Không kết nối được tới API. Kiểm tra mạng và thử lại."
        : e.message);
      setAiState("error");
    }
  }

  function saveApiKey(key) {
    localStorage.setItem("focus_api_key", key);
    setApiKey(key);
    setShowKeyInput(false);
  }
  function addSuggestion(index) {
    if (addedSuggestions.has(index)) return;
    addTask(suggestions[index], "AI");
    setAddedSuggestions(prev => new Set(prev).add(index));
  }
  function addAll() {
    suggestions.forEach((s, i) => { if (!addedSuggestions.has(i)) addTask(s, "AI"); });
    setAddedSuggestions(new Set(suggestions.map((_, i) => i)));
  }
  const allSuggestionsAdded = suggestions.length > 0 && addedSuggestions.size >= suggestions.length;

  const mainItems = filter === "all"
    ? [...active, ...done]
    : filter === "done"
      ? done
      : active;
  const FILTERS = [["all", "Tất cả", tasks.length], ["active", "Chưa xong", active.length], ["done", "Đã xong", done.length]];
  const pad = "0 28px";

  const headerActions = (
    <React.Fragment>
      <button type="button" className="btn" onClick={() => setShowKeyInput(v => !v)}
        aria-expanded={showKeyInput}
        title={apiKey ? "Đã có API key, bấm để đổi" : "Chưa có API key, AI đang chạy chế độ mẫu"}
        style={{ height: 32, padding: "0 10px", fontSize: 13, color: t.muted }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="8" cy="15" r="4" stroke="currentColor" strokeWidth="2"/>
          <path d="M11 12l8-8M16 7l3 3M14 9l2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        {apiKey ? "AI đã kết nối" : "AI chế độ mẫu"}
      </button>
      <DarkToggle dark={dark} onToggle={() => setDark(d => !d)}/>
    </React.Fragment>
  );

  return (
    <React.Fragment>
    {celebrateShow && <Fireworks active={celebrateShow}/>}
    {celebrateShow && <CelebrationBanner/>}
    <main className="sheet">
      <CalendarSheet doneCount={done.length} total={tasks.length} actions={headerActions} t={t}/>

      {/* ── API key ── */}
      {showKeyInput && (
        <section style={{ margin: "8px 28px 0", padding: "14px 16px", background: t.sunken, borderRadius: 6, animation: "fadeSlide 0.2s ease" }}>
          <label htmlFor="apiKeyInput" style={{ display: "block", fontSize: 15, fontWeight: 600 }}>Anthropic API key</label>
          <p style={{ fontSize: 14, color: t.muted, margin: "2px 0 10px", lineHeight: 1.5 }}>
            Lấy key tại <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer" style={{ color: t.ink }}>console.anthropic.com</a>.
            Key chỉ lưu trong trình duyệt này. Để trống rồi bấm Lưu để quay về gợi ý mẫu.
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            <input type="password" placeholder="sk-ant-..."
              defaultValue={apiKey}
              id="apiKeyInput"
              onKeyDown={e => { if (e.key === "Enter" && !e.nativeEvent.isComposing) saveApiKey(e.currentTarget.value.trim()); }}
              style={{
                flex: 1, minWidth: 0, height: 36, padding: "0 10px", border: `1px solid ${t.rule}`,
                borderRadius: 6, outline: "none", fontFamily: "ui-monospace, monospace",
                fontSize: 14, background: t.paper, color: t.ink
              }}/>
            <button type="button" className="btn btn-ink" onClick={() => saveApiKey(document.getElementById("apiKeyInput").value.trim())}>Lưu key</button>
          </div>
        </section>
      )}

      {/* ── Thêm việc ── */}
      <div style={{ padding: pad, marginTop: 16 }}>
        <div className="add-row" style={{
          borderBottom: `2px solid ${input ? t.ink : t.rule}`, paddingBottom: 8,
          transition: "border-color 0.15s"
        }}>
          <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.nativeEvent.isComposing) addTask(); }}
            placeholder="Hôm nay cần làm gì?"
            aria-label="Công việc mới"
            className="add-input"
            style={{ color: t.ink }}/>
          <button type="button" className="btn" onClick={askAI} disabled={aiState === "loading"}
            title="AI chia mục tiêu thành các việc nhỏ">
            <svg width="13" height="13" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M6 1l1.2 3.3L11 5l-3.3 1.2L6.5 10 5.3 6.2 1 5l4.3-1.2z" fill="currentColor"/>
            </svg>
            Gợi ý AI
          </button>
          <button type="button" className="btn btn-ink" onClick={() => addTask()}>Thêm việc</button>
        </div>
      </div>

      {/* ── Gợi ý AI ── */}
      {aiState !== "hidden" && (
        <section aria-live="polite" style={{ margin: "14px 28px 0", padding: "12px 16px 10px", background: t.sunken, borderRadius: 6, animation: "fadeSlide 0.2s ease" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
              {aiState === "loading" && (
                <span aria-hidden="true" style={{ width: 14, height: 14, border: `2px solid ${t.rule}`, borderTopColor: t.ink, borderRadius: "50%", animation: "spin 0.7s linear infinite" }}/>
              )}
              {aiState === "loading" ? "Đang chia nhỏ mục tiêu" : aiState === "error" ? "Chưa tạo được gợi ý" : isDemo ? "Gợi ý mẫu" : "AI gợi ý"}
            </h2>
            <button type="button" className="icon-btn" onClick={() => setAiState("hidden")} aria-label="Đóng khung gợi ý" style={{ width: 28, height: 28 }}>
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
            </button>
          </div>

          {isDemo && aiState === "done" && <DemoBanner t={t} onOpenKey={() => setShowKeyInput(true)}/>}

          {aiState === "error" && (
            <p style={{ fontSize: 14, color: t.red, paddingBottom: 6 }}>{aiError || "Không tạo được gợi ý. Thử lại sau."}</p>
          )}
          {aiState === "done" && (
            <React.Fragment>
              <ul style={{ listStyle: "none" }}>
                {suggestions.map((s, i) => (
                  <SuggestionRow key={i} text={s} added={addedSuggestions.has(i)} onAdd={() => addSuggestion(i)} t={t}/>
                ))}
              </ul>
              <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 10, borderTop: `1px solid ${t.rule}` }}>
                <button type="button" className="btn btn-ink" onClick={addAll} disabled={allSuggestionsAdded}>
                  {allSuggestionsAdded ? "Đã thêm cả " + suggestions.length + " việc" : "Thêm cả " + suggestions.length + " việc"}
                </button>
              </div>
            </React.Fragment>
          )}
        </section>
      )}

      {/* ── Bộ lọc ── */}
      {tasks.length > 0 && (
        <nav aria-label="Lọc công việc" style={{ display: "flex", gap: 22, padding: pad, marginTop: 22 }}>
          {FILTERS.map(([f, label, count]) => (
            <button key={f} type="button" onClick={() => setFilter(f)} aria-pressed={filter === f}
              style={{
                border: 0, background: "none", cursor: "pointer", padding: "4px 0",
                fontSize: 15, fontWeight: filter === f ? 600 : 500,
                color: filter === f ? t.ink : t.muted,
                borderBottom: `2px solid ${filter === f ? t.ink : "transparent"}`,
              }}>
              {label} <span style={{ color: t.faint, fontWeight: 500 }}>{count}</span>
            </button>
          ))}
        </nav>
      )}

      <div style={{ padding: pad, marginTop: 10 }}>
        <FilterHint filter={filter} t={t} show={filter === "active" || (filter === "done" && done.length > 0)}/>

        {mainItems.length > 0 && (
          <ul style={{ listStyle: "none", borderBottom: `1px solid ${t.rule}` }}>
            {mainItems.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onUpdate={updateTask}
                onSetPriority={setTaskPriority}
                onDelete={deleteTask}
                animating={newIds.has(task.id)}
                t={t}
              />
            ))}
          </ul>
        )}
      </div>

      {/* ── Lời chúc sau khi xong hết (vẫn giữ khi thêm việc mới) ── */}
      {victoryVisible && done.length > 0 && filter !== "done" && (
        <EmptyIllustration dark={dark} variant="victory" compact={active.length > 0}/>
      )}

      {filter === "active" && active.length === 0 && done.length > 0 && (
        <p style={{ textAlign: "center", fontSize: 15, color: t.muted, padding: "8px 28px 24px" }}>
          Hết việc rồi. Thêm việc mới ở ô phía trên khi bạn sẵn sàng.
        </p>
      )}

      {tasks.length === 0 && (
        <EmptyIllustration dark={dark} variant="empty" compact={false}/>
      )}

      {filter === "done" && done.length === 0 && tasks.length > 0 && (
        <div style={{ textAlign: "center", padding: "24px 28px 32px" }}>
          <p style={{ fontSize: 17, fontWeight: 600, marginBottom: 4 }}>Chưa xong việc nào</p>
          <p style={{ fontSize: 15, color: t.muted, maxWidth: 340, margin: "0 auto", lineHeight: 1.55 }}>
            Tick vào ô vuông cạnh một việc khi làm xong, nó sẽ hiện ở đây.
          </p>
        </div>
      )}

      <div style={{ height: 36 }}/>
    </main>
    </React.Fragment>
  );
}

const rootEl = document.getElementById("root");
const appEl = React.createElement(App);
if (ReactDOM.createRoot) {
  ReactDOM.createRoot(rootEl).render(appEl);
} else {
  ReactDOM.render(appEl, rootEl);
}
