// src/components/ProgressRing.js
function ProgressRing({ pct, dark }) {
  const r = 17, circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width="42" height="42" viewBox="0 0 42 42">
      <circle cx="21" cy="21" r={r} fill="none" stroke={dark ? "#2e2e2b" : "#e8e4dd"} strokeWidth="3"/>
      <circle cx="21" cy="21" r={r} fill="none" stroke="#30a46c" strokeWidth="3"
        strokeDasharray={`${circ} ${circ}`} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transform:"rotate(-90deg)", transformOrigin:"50% 50%", transition:"stroke-dashoffset 0.4s cubic-bezier(.4,0,.2,1)" }}
      />
      <text x="21" y="21" textAnchor="middle" dominantBaseline="central"
        fontSize="9" fontWeight="700" fill={dark ? "#e8e4dd" : "#1a1917"}
        fontFamily="'Plus Jakarta Sans', sans-serif">{pct}%</text>
    </svg>
  );
}
