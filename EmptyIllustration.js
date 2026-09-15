// src/components/EmptyIllustration.js
// Phụ thuộc: IllustGlow, SceneClock (components), VICTORY_QUOTE (utils.js) — phải load trước
function EmptyIllustration({ dark, variant, compact }) {
  const isVictory = variant === "victory";
  const pad = compact ? "24px 20px 28px" : "40px 24px 48px";

  return (
    <div style={{ textAlign:"center", padding: pad }}>
      {!compact && (
      <div style={{ position:"relative", width:290, height:210, margin:"0 auto 20px" }}>
        {dark && (
          <div className="dark-ambient-glow" style={{
            position:"absolute", left:"48%", top:"58%", transform:"translate(-50%,-50%)",
            width:240, height:180, borderRadius:"50%",
            background:"radial-gradient(ellipse, rgba(255, 200, 100, 0.2) 0%, rgba(255, 170, 60, 0.06) 50%, transparent 72%)",
            pointerEvents:"none", zIndex:0,
          }}/>
        )}

        {/* Window — larger, cozy night scene */}
        <IllustGlow dark={dark} className="float-c" style={{ position:"absolute", right:-4, top:-8, zIndex:1 }}>
        <svg width="138" height="158" viewBox="0 0 120 138" fill="none">
          <defs>
            {dark ? (
              <linearGradient id="nightSky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1a2848"/>
                <stop offset="100%" stopColor="#0d1528"/>
              </linearGradient>
            ) : (
              <linearGradient id="daySky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a8d4f5"/>
                <stop offset="100%" stopColor="#d4ecff"/>
              </linearGradient>
            )}
            {dark ? (
              <linearGradient id="lampGlow" x1="0.5" y1="1" x2="0.5" y2="0">
                <stop offset="0%" stopColor="#ffd080" stopOpacity="0.35"/>
                <stop offset="100%" stopColor="#ffd080" stopOpacity="0"/>
              </linearGradient>
            ) : null}
          </defs>
          {/* Outer wall frame */}
          <rect x="3" y="3" width="114" height="128" rx="8" fill={dark ? "#2a2418" : "#e8f0e8"} stroke={dark ? "#4a4030" : "#b8cfc0"} strokeWidth="2"/>
          {/* Wood inner frame */}
          <rect x="9" y="9" width="102" height="108" rx="5" fill={dark ? "#3d3224" : "#c9a66a"} stroke={dark ? "#5a4a36" : "#a07840"} strokeWidth="1.5"/>
          {/* Glass area */}
          <rect x="14" y="14" width="92" height="88" rx="4" fill={dark ? "url(#nightSky)" : "url(#daySky)"}/>
          {/* Cross mullions */}
          <line x1="60" y1="14" x2="60" y2="102" stroke={dark ? "#4a4030" : "#a07840"} strokeWidth="2.5"/>
          <line x1="14" y1="58" x2="106" y2="58" stroke={dark ? "#4a4030" : "#a07840"} strokeWidth="2.5"/>
          {/* Top-left pane — moon or clouds */}
          {dark ? (
            <g>
              <circle cx="38" cy="38" r="9" fill="#f5e6a8" opacity="0.92"/>
              <circle cx="38" cy="38" r="11" fill="#ffd080" opacity="0.12"/>
              <circle cx="22" cy="24" r="1.2" fill="#fff" opacity="0.9"/>
              <circle cx="48" cy="20" r="0.8" fill="#fff" opacity="0.7"/>
              <circle cx="30" cy="48" r="0.9" fill="#fff" opacity="0.6"/>
              <circle cx="52" cy="42" r="1" fill="#fff" opacity="0.75"/>
              <rect x="14" y="58" width="46" height="44" rx="2" fill="url(#lampGlow)"/>
            </g>
          ) : (
            <g>
              <ellipse cx="34" cy="32" rx="12" ry="6" fill="white" opacity="0.85"/>
              <ellipse cx="78" cy="28" rx="10" ry="5" fill="white" opacity="0.75"/>
            </g>
          )}
          {/* Top-right pane */}
          <rect x="62" y="14" width="44" height="44" rx="2" fill={dark ? "#152035" : "#bfdbf7"} opacity={dark ? 0.6 : 0.5}/>
          {dark ? (
            <g>
              <circle cx="88" cy="30" r="1" fill="#fff" opacity="0.8"/>
              <circle cx="72" cy="22" r="0.7" fill="#fff" opacity="0.55"/>
              <circle cx="95" cy="40" r="0.9" fill="#fff" opacity="0.65"/>
            </g>
          ) : null}
          {/* Bottom panes — garden / sill plants */}
          <rect x="14" y="62" width="92" height="40" rx="2" fill={dark ? "#1a3020" : "#b8e0b8"} opacity="0.55"/>
          <path d="M28 102 Q32 78 38 102" stroke={dark ? "#4ade80" : "#30a46c"} strokeWidth="2" fill="none" strokeLinecap="round"/>
          <path d="M58 102 Q62 76 68 102" stroke={dark ? "#4ade80" : "#30a46c"} strokeWidth="2" fill="none" strokeLinecap="round"/>
          <path d="M88 102 Q92 80 96 102" stroke={dark ? "#4ade80" : "#30a46c"} strokeWidth="2" fill="none" strokeLinecap="round"/>
          {/* Curtains (dark mode) */}
          {dark ? (
            <g>
              <path d="M14 14 L14 102 Q20 58 14 14" fill="#3d2818" opacity="0.5"/>
              <path d="M106 14 L106 102 Q100 58 106 14" fill="#3d2818" opacity="0.5"/>
            </g>
          ) : null}
          {/* Windowsill */}
          <rect x="3" y="114" width="114" height="12" rx="3" fill={dark ? "#4a4030" : "#d4a96a"}/>
          <rect x="3" y="114" width="114" height="4" rx="2" fill={dark ? "#5c5040" : "#e8c88a"} opacity="0.5"/>
          {/* Small pot on sill */}
          <rect x="52" y="106" width="16" height="10" rx="2" fill={dark ? "#5c4030" : "#c07840"}/>
          <ellipse cx="60" cy="106" rx="6" ry="3" fill={dark ? "#2d5a30" : "#4ade80"}/>
        </svg>
        </IllustGlow>

        {/* Coffee mug — warm ceramic in dark mode */}
        <IllustGlow dark={dark} soft={true} className="float-b" style={{ position:"absolute", left:4, bottom:6, zIndex:2 }}>
        <svg width="80" height="90" viewBox="0 0 80 90" fill="none">
          <defs>
            <linearGradient id="cupBody" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={dark ? "#faf3e8" : "#fff8ee"}/>
              <stop offset="55%" stopColor={dark ? "#e8dcc8" : "#f5e6cc"}/>
              <stop offset="100%" stopColor={dark ? "#d4c4a8" : "#e8d5b7"}/>
            </linearGradient>
            <linearGradient id="coffeeLiquid" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={dark ? "#8b5a2b" : "#a06840"} />
              <stop offset="100%" stopColor={dark ? "#5c3818" : "#6b4423"} />
            </linearGradient>
            <linearGradient id="cupShine" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fff" stopOpacity={dark ? "0.35" : "0.5"}/>
              <stop offset="100%" stopColor="#fff" stopOpacity="0"/>
            </linearGradient>
          </defs>
          {/* Saucer */}
          <ellipse cx="40" cy="82" rx="30" ry="7" fill={dark ? "#3d3530" : "#e8d5b7"}/>
          <ellipse cx="40" cy="81" rx="26" ry="5" fill={dark ? "#4a4238" : "#f0e0c8"}/>
          <ellipse cx="40" cy="80" rx="22" ry="4" fill={dark ? "#524a40" : "#faf3e8"} opacity="0.6"/>
          {/* Cup shadow */}
          <ellipse cx="40" cy="44" rx="20" ry="6" fill="#000" opacity={dark ? "0.15" : "0.06"}/>
          {/* Cup body */}
          <path d="M16 44 Q14 78 40 78 Q66 78 64 44 Z" fill="url(#cupBody)"/>
          <path d="M16 44 Q14 78 40 78 Q66 78 64 44 Z" stroke={dark ? "#c4b49a" : "#d4a96a"} strokeWidth="1.5" fill="none"/>
          {/* Left highlight */}
          <path d="M20 48 Q18 68 28 74 Q22 58 20 48 Z" fill="url(#cupShine)"/>
          {/* Rim */}
          <ellipse cx="40" cy="44" rx="24" ry="8" fill={dark ? "#e8dcc8" : "#f5e6cc"}/>
          <ellipse cx="40" cy="44" rx="24" ry="8" stroke={dark ? "#c4b49a" : "#d4a96a"} strokeWidth="1" fill="none"/>
          {/* Coffee surface */}
          <ellipse cx="40" cy="44" rx="19" ry="6" fill="url(#coffeeLiquid)"/>
          <ellipse cx="36" cy="42" rx="8" ry="2" fill="#fff" opacity={dark ? "0.12" : "0.2"}/>
          {/* Handle */}
          <path d="M62 50 Q78 48 78 60 Q78 72 62 70" stroke={dark ? "#d4c4a8" : "#d4a96a"} strokeWidth="4" fill="none" strokeLinecap="round"/>
          <path d="M62 50 Q78 48 78 60 Q78 72 62 70" stroke={dark ? "#faf3e8" : "#f5e6cc"} strokeWidth="2" fill="none" strokeLinecap="round"/>
          {/* Steam */}
          <path d="M30 40 Q28 28 30 16" stroke={dark ? "#ffe8b0" : "#c8b89a"} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.85"
            style={{ animation:"steam 2s ease-out infinite", transformOrigin:"30px 40px" }}/>
          <path d="M40 38 Q38 24 40 12" stroke={dark ? "#ffe8b0" : "#c8b89a"} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.9"
            style={{ animation:"steam 2s ease-out infinite 0.5s", transformOrigin:"40px 38px" }}/>
          <path d="M50 40 Q48 26 50 14" stroke={dark ? "#ffe8b0" : "#c8b89a"} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.85"
            style={{ animation:"steam 2s ease-out infinite 1s", transformOrigin:"50px 40px" }}/>
        </svg>
        </IllustGlow>

        {/* Books stack */}
        <IllustGlow dark={dark} className="float-a" style={{ position:"absolute", left:78, bottom:4, zIndex:2 }}>
        <svg width="70" height="90" viewBox="0 0 70 90" fill="none">
          {/* Book 3 (bottom) */}
          <rect x="5" y="64" width="60" height="16" rx="3" fill={dark ? "#3a2e5a" : "#9b59b6"}/>
          <rect x="5" y="64" width="60" height="5" rx="2" fill={dark ? "#4a3e6a" : "#b07cc6"}/>
          <rect x="5" y="64" width="7" height="16" rx="1" fill={dark ? "#2e2448" : "#8e44ad"}/>
          {/* Book 2 (middle) */}
          <rect x="3" y="46" width="62" height="17" rx="3" fill={dark ? "#1a3a2e" : "#27ae60"}/>
          <rect x="3" y="46" width="62" height="5" rx="2" fill={dark ? "#2a4a3e" : "#2ecc71"}/>
          <rect x="3" y="46" width="7" height="17" rx="1" fill={dark ? "#143020" : "#219a52"}/>
          {/* Book 1 (top) */}
          <rect x="7" y="30" width="56" height="15" rx="3" fill={dark ? "#2e1a1a" : "#e74c3c"}/>
          <rect x="7" y="30" width="56" height="5" rx="2" fill={dark ? "#3e2a2a" : "#ee6b6b"}/>
          <rect x="7" y="30" width="7" height="15" rx="1" fill={dark ? "#241414" : "#c0392b"}/>
          {/* Bookmark */}
          <rect x="46" y="25" width="5" height="12" rx="1" fill={dark ? "#f0c040" : "#f39c12"}/>
          <path d="M46 37 L48.5 34 L51 37" fill={dark ? "#1a3a2e" : "#27ae60"}/>
          {/* Pencil on top */}
          <rect x="15" y="22" width="40" height="7" rx="3" fill={dark ? "#e8d070" : "#f1c40f"} transform="rotate(-5 15 22)"/>
          <path d="M13 26 L10 24 L14 21 Z" fill={dark ? "#d4a020" : "#e67e22"} transform="rotate(-5 13 26)"/>
          <rect x="51" y="21" width="5" height="7" rx="1" fill={dark ? "#d44040" : "#e74c3c"} transform="rotate(-5 51 21)"/>
        </svg>
        </IllustGlow>

        <SceneClock dark={dark}/>
      </div>
      )}

      {isVictory ? (
        <div style={{
          maxWidth:400, margin: compact ? "0 auto" : "8px auto 0",
          padding: compact ? "16px 18px" : "20px 22px",
          borderRadius:12,
          border: dark ? "1px solid #3d4a28" : "1px solid #ffd93d",
          background: dark ? "rgba(45,58,30,0.55)" : "rgba(255,248,220,0.85)",
        }}>
          <p style={{
            fontSize: compact ? 14.5 : 16, fontWeight:500, fontStyle:"italic",
            color: dark ? "#e8e4dd" : "#1a1917", lineHeight:1.65, margin:0,
          }}>
            &ldquo;{VICTORY_QUOTE.text}&rdquo;
          </p>
          <p style={{
            fontSize:12, fontWeight:700, letterSpacing:"0.04em",
            color: dark ? "#c5e17a" : "#6b8e23", marginTop:12, marginBottom:0,
          }}>
            — {VICTORY_QUOTE.author}
          </p>
          <p style={{ fontSize:11, color: dark ? "#6b6660" : "#9a9590", marginTop:4 }}>
            {VICTORY_QUOTE.source}
          </p>
        </div>
      ) : (
        <div>
          <h3 style={{ fontSize:17, fontWeight:700, color: dark ? "#e8e4dd" : "#1a1917", marginBottom:6 }}>
            Bắt đầu ngày mới
          </h3>
          <p style={{ fontSize:13.5, color: dark ? "#6b6660" : "#6b6660", lineHeight:1.6 }}>
            Thêm việc cần làm ở ô phía trên.
          </p>
        </div>
      )}
    </div>
  );
}
