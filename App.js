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

  useEffect(() => {
    document.body.className = dark ? "dark" : "light";
    localStorage.setItem("focus_dark", dark ? "1" : "0");
  }, [dark]);

  const pct    = tasks.length ? Math.round((done.length / tasks.length) * 100) : 0;

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
          model: "claude-sonnet-4-20250514",
          max_tokens: 800,
          system: "Bạn là trợ lý quản lý công việc. Chia mục tiêu thành 4-6 việc nhỏ cụ thể có thể hành động ngay. Trả lời CHỈ bằng JSON array các string ngắn gọn, không markdown, không giải thích.",
          messages: [{ role: "user", content: task }]
        })
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      const textBlock = data.content?.find(b => b.type === "text");
      const raw = textBlock?.text || "[]";
      const items = JSON.parse(raw.replace(/```json|```/g, "").trim());
      if (!Array.isArray(items) || !items.length) throw new Error("empty");
      setSuggestions(items);
      setAiState("done");
    } catch(e) {
      console.error(e);
      setAiState("error");
    }
  }

  function saveApiKey(key) {
    localStorage.setItem("focus_api_key", key);
    setApiKey(key);
    setShowKeyInput(false);
  }
  function addAll() { suggestions.forEach(s => addTask(s, "AI")); }

  const mainItems = filter === "all"
    ? [...active, ...done]
    : filter === "done"
      ? done
      : active;
  const sectionLabel = filter === "done"
    ? "Đã xong"
    : filter === "all"
      ? "Tất cả"
      : "Chưa xong";
  const sectionCount = filter === "done"
    ? done.length
    : filter === "all"
      ? tasks.length
      : active.length;

  return (
    <React.Fragment>
    {celebrateShow && <Fireworks active={celebrateShow} dark={dark}/>}
    {celebrateShow && <CelebrationBanner dark={dark}/>}
    <div style={{
      fontFamily:"'Plus Jakarta Sans',sans-serif",
      width:"100%", maxWidth:720, minHeight:"100vh",
      padding:5,
      borderRadius:22,
      border:`1px solid ${t.frameOuter}`,
      background:t.frameRing,
      boxShadow: dark
        ? "0 12px 40px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.04)"
        : "0 12px 40px rgba(26,25,23,0.08), 0 0 0 1px rgba(255,255,255,0.8)",
      transition:"background 0.3s, box-shadow 0.3s"
    }}>
    <div style={{
      width:"100%", minHeight:"calc(100vh - 10px)",
      borderRadius:16,
      border:`1px solid ${t.frameInner}`,
      backgroundColor:t.bg,
      ...t.noteGrid,
      display:"flex", flexDirection:"column",
      overflow:"hidden",
      transition:"background-color 0.3s, border-color 0.3s"
    }}>

      {/* ── Header ── */}
      <div style={{ display:"flex", alignItems:"center", padding:"24px 24px 0", gap:10 }}>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:22, fontWeight:700, color: t.text, letterSpacing:"-0.02em" }}>Hôm nay</div>
          <div style={{ fontSize:12, color: t.faintTxt, marginTop:1 }}>{todayLabel()}</div>
        </div>
        <DarkToggle dark={dark} onToggle={() => setDark(d => !d)}/>
        <button onClick={() => setShowKeyInput(v => !v)} title="Cài đặt API Key"
          style={{
            background: apiKey ? t.greenBg : t.warnBg,
            border:"none", borderRadius:8, padding:"6px 10px",
            cursor:"pointer", fontSize:12, fontWeight:600,
            color: apiKey ? "#30a46c" : "#e8643a",
            display:"flex", alignItems:"center", gap:5
          }}>
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
            <circle cx="5.5" cy="5.5" r="3.5" stroke="currentColor" strokeWidth="1.4"/>
            <path d="M8 8l4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          {apiKey ? "API ✓" : "API Key"}
        </button>
        <ProgressRing pct={pct} dark={dark}/>
      </div>

      {/* ── API Key Input ── */}
      {showKeyInput && (
        <div style={{
          margin:"12px 24px 0", padding:14,
          background: t.warnBg, borderRadius:10,
          border:`1px solid ${t.warnBorder}`, animation:"fadeSlide 0.2s ease"
        }}>
          <p style={{ fontSize:12, color: t.warnTxt, marginBottom:8, lineHeight:1.5 }}>
            Nhập <strong>Anthropic API Key</strong> để dùng AI thật.<br/>
            Lấy key tại <a href="https://console.anthropic.com" target="_blank" style={{ color:"#e8643a" }}>console.anthropic.com</a>
            {" "}— có <strong>$5 credit miễn phí</strong> khi đăng ký.
          </p>
          <div style={{ display:"flex", gap:8 }}>
            <input type="password" placeholder="sk-ant-..."
              defaultValue={apiKey}
              id="apiKeyInput"
              style={{
                flex:1, padding:"8px 12px", border:`1px solid ${t.warnBorder}`,
                borderRadius:7, outline:"none", fontFamily:"monospace",
                fontSize:13, background: t.bg, color: t.text
              }}/>
            <button onClick={() => saveApiKey(document.getElementById("apiKeyInput").value.trim())}
              style={{
                background:"#e8643a", color:"#fff", border:"none",
                borderRadius:7, padding:"8px 14px", cursor:"pointer",
                fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:600, fontSize:13
              }}>Lưu</button>
          </div>
        </div>
      )}

      {/* ── Filter tabs ── */}
      <div style={{ display:"flex", gap:4, padding:"16px 24px 0" }}>
        {[["all","Tất cả"],["active","Chưa xong"],["done","Đã xong"]].map(([f,label]) => (
          <button key={f} onClick={() => setFilter(f)}
            style={{
              fontSize:13, fontWeight:600, padding:"6px 14px", borderRadius:20,
              border:"none", cursor:"pointer", transition:"all 0.15s",
              background: filter===f ? (dark ? "#e8e4dd" : "#1a1917") : "transparent",
              color: filter===f ? (dark ? "#1a1917" : "#fff") : t.muted
            }}>{label}</button>
        ))}
      </div>

      {/* ── Quick add ── */}
      <div style={{
        margin:"16px 24px 0", background: t.inputBg,
        border:`1.5px solid ${input ? "#e8643a" : t.border}`,
        boxShadow: input ? "0 0 0 3px rgba(232,100,58,0.10)" : "none",
        borderRadius:12, display:"flex", alignItems:"center",
        overflow:"hidden", transition:"border-color 0.15s, box-shadow 0.15s"
      }}>
        <span style={{ padding:"0 12px 0 16px", color: t.faintTxt, display:"flex", alignItems:"center", flexShrink:0 }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M8 5v6M5 8h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </span>
        <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addTask()}
          placeholder="Thêm công việc… hoặc mô tả dự án cho AI"
          style={{
            flex:1, background:"none", border:"none", outline:"none",
            fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:14.5,
            color: t.text, padding:"13px 0", caretColor:"#e8643a"
          }}/>
        <div style={{ display:"flex", alignItems:"center", paddingRight:8, gap:4 }}>
          <button onClick={askAI} disabled={aiState === "loading"}
            style={{
              display:"flex", alignItems:"center", gap:5,
              fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:12, fontWeight:600,
              color:"#4f8ef7", background: t.aiBg, border:"none",
              borderRadius:6, padding:"6px 10px", cursor:"pointer",
              whiteSpace:"nowrap", opacity: aiState === "loading" ? 0.45 : 1
            }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1l1.2 3.3L11 5l-3.3 1.2L6.5 10 5.3 6.2 1 5l4.3-1.2z" fill="currentColor"/>
            </svg>
            AI
          </button>
          <button onClick={() => addTask()}
            style={{
              fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:13, fontWeight:700,
              color:"#fff", background:"#e8643a", border:"none",
              borderRadius:6, padding:"7px 14px", cursor:"pointer"
            }}>Thêm</button>
        </div>
      </div>

      {/* ── AI Panel ── */}
      {aiState !== "hidden" && (
        <div style={{
          margin:"12px 24px 0", border:`1.5px solid ${t.border}`,
          borderRadius:12, overflow:"hidden", animation:"fadeSlide 0.2s ease"
        }}>
          <div style={{
            display:"flex", alignItems:"center", justifyContent:"space-between",
            padding:"12px 16px", background: t.aiBg, borderBottom:`1px solid ${t.border}`
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:12, fontWeight:700, letterSpacing:"0.05em", textTransform:"uppercase", color:"#4f8ef7" }}>
              {aiState === "loading"
                ? <div style={{ width:14, height:14, border:"2px solid rgba(79,142,247,0.2)", borderTopColor:"#4f8ef7", borderRadius:"50%", animation:"spin 0.7s linear infinite" }}/>
                : <svg width="13" height="13" viewBox="0 0 12 12" fill="none"><path d="M6 1l1.2 3.3L11 5l-3.3 1.2L6.5 10 5.3 6.2 1 5l4.3-1.2z" fill="#4f8ef7"/></svg>
              }
              {aiState === "loading" ? "AI đang phân tích…" : aiState === "error" ? "Lỗi" : isDemo ? "Gợi ý Demo" : "Gợi ý từ AI"}
            </div>
            <button onClick={() => setAiState("hidden")}
              style={{ background:"none", border:"none", cursor:"pointer", color: t.faintTxt, fontSize:18, lineHeight:1 }}>×</button>
          </div>

          {(isDemo && aiState === "done") ? <DemoBanner t={t}/> : null}

          <div style={{ padding:"12px 14px", background: t.bg }}>
            {aiState === "loading" && (
              <div style={{ fontSize:13, color: t.muted, display:"flex", alignItems:"center", gap:6 }}>
                <div style={{ width:14, height:14, border:`2px solid ${t.border}`, borderTopColor: t.muted, borderRadius:"50%", animation:"spin 0.7s linear infinite", flexShrink:0 }}/>
                Đang tạo gợi ý…
              </div>
            )}
            {aiState === "error" && (
              <p style={{ fontSize:13, color:"#e8643a" }}>Không thể tạo gợi ý. Kiểm tra lại API Key và thử lại.</p>
            )}
            {aiState === "done" && (
              <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                {suggestions.map((s, i) => (
                  <SuggestionRow key={i} text={s} onAdd={tk => addTask(tk, "AI")} t={t}/>
                ))}
              </div>
            )}
          </div>

          {aiState === "done" && (
            <div style={{
              display:"flex", justifyContent:"space-between", alignItems:"center",
              padding:"10px 14px", borderTop:`1px solid ${t.border}`, background: t.surface
            }}>
              <span style={{ fontSize:12, color: t.faintTxt }}>{suggestions.length} gợi ý</span>
              <button onClick={addAll}
                style={{
                  fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:12, fontWeight:700,
                  color:"#fff", background:"#4f8ef7", border:"none",
                  borderRadius:6, padding:"7px 14px", cursor:"pointer"
                }}>Thêm tất cả</button>
            </div>
          )}
        </div>
      )}

      {/* ── Section label ── */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"20px 24px 8px" }}>
        <span style={{ fontSize:11, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color: t.faintTxt }}>
          {sectionLabel}
        </span>
        <span style={{ fontSize:12, fontWeight:600, color: t.faintTxt, background: t.pill, padding:"2px 8px", borderRadius:10 }}>
          {sectionCount}
        </span>
      </div>

      <FilterHint
        filter={filter} t={t} dark={dark}
        show={filter === "active" || (filter === "done" && done.length > 0)}
      />

      {/* ── Task table ── */}
      <div style={{ margin:"0 12px 8px", flex:1, padding:4, borderRadius:14, border:`1px solid ${t.listBorder}`, background:t.listInner }}>
        <div className="task-table-wrap" style={{
          borderRadius:10, border:`1px solid ${t.frameInner}`,
          backgroundColor: dark ? "rgba(28,28,26,0.5)" : "rgba(255,255,255,0.65)",
          minHeight: mainItems.length ? 0 : 120,
        }}>
          <table className="task-table">
            <thead>
              <tr style={{ color: t.faintTxt }}>
                <th style={{ width:40, textAlign:"center" }}>STT</th>
                <th>Tên hoạt động</th>
                <th style={{ width:108, textAlign:"center" }}>Ưu tiên</th>
                <th>Ghi chú</th>
                <th style={{ width:52, textAlign:"center" }}>Xong</th>
                <th style={{ width:36 }} aria-label="Xóa"/>
              </tr>
            </thead>
            <tbody>
              {mainItems.map((task, i) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  stt={task.order}
                  onToggle={toggleTask}
                  onUpdate={updateTask}
                  onSetPriority={setTaskPriority}
                  onDelete={deleteTask}
                  animating={newIds.has(task.id)}
                  t={t}
                  dark={dark}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Victory quote (stays after adding new tasks) ── */}
      {victoryVisible && done.length > 0 && filter !== "done" && (
        <EmptyIllustration
          dark={dark}
          variant="victory"
          compact={active.length > 0}
        />
      )}

      {/* ── Active tab: cleared queue (hint banner already shown above) ── */}
      {filter === "active" && active.length === 0 && done.length > 0 && (
        <p style={{ textAlign:"center", fontSize:13, color: t.muted, padding:"8px 24px 24px", lineHeight:1.6 }}>
          Thêm việc mới ở ô phía trên khi bạn sẵn sàng tiếp tục.
        </p>
      )}

      {/* ── Empty start (tất cả, chưa có task) ── */}
      {tasks.length === 0 && filter === "all" && (
        <EmptyIllustration dark={dark} variant="empty" compact={false}/>
      )}

      {/* ── Empty: đã xong tab ── */}
      {filter === "done" && done.length === 0 && (
        <div style={{ textAlign:"center", padding:"32px 24px 40px" }}>
          <p style={{ fontSize:15, fontWeight:600, color: t.text, marginBottom:8 }}>Chưa có việc hoàn thành</p>
          <p style={{ fontSize:13, color: t.muted, lineHeight:1.6, maxWidth:320, margin:"0 auto" }}>
            Tick xong việc ở tab Chưa xong hoặc Tất cả — lời chúc mừng sẽ hiện ở đây.
          </p>
        </div>
      )}

      <div style={{ height:40 }}/>
    </div>
    </div>
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
