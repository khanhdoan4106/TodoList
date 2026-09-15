// src/theme.js
// Phải load sau utils.js, trước mọi component dùng useTheme().

function noteGridStyle(dark) {
  const line = dark ? "#2e2e2b" : "#e8e4dd";
  return {
    backgroundImage: `linear-gradient(${line} 1px, transparent 1px), linear-gradient(90deg, ${line} 1px, transparent 1px)`,
    backgroundSize: "22px 22px",
  };
}

function useTheme(dark) {
  return {
    bg:       dark ? "#1c1c1a" : "#fff",
    pageBg:   dark ? "#111110" : "#f7f6f3",
    noteGrid: noteGridStyle(dark),
    surface:  dark ? "#252523" : "#f7f6f3",
    border:   dark ? "#2e2e2b" : "#e8e4dd",
    text:     dark ? "#e8e4dd" : "#1a1917",
    muted:    dark ? "#6b6660" : "#6b6660",
    faint:    dark ? "#3a3a36" : "#e8e4dd",
    faintTxt: dark ? "#b0aba3" : "#b0aba3",
    pill:     dark ? "#2e2e2b" : "#e8e4dd",
    inputBg:  dark ? "#252523" : "#f7f6f3",
    tagBg:    dark ? "#2d1f1a" : "#fdf0ec",
    tagTxt:   dark ? "#e8643a" : "#e8643a",
    aiBg:     dark ? "#1a1f2e" : "#eef4ff",
    aiTxt:    "#4f8ef7",
    greenBg:  dark ? "#132419" : "#e8f7ef",
    greenTxt: "#30a46c",
    warnBg:   dark ? "#2d1f1a" : "#fdf0ec",
    warnBorder:dark ? "#5a2e1a" : "#f5c4b0",
    warnTxt:  dark ? "#e8643a" : "#b05020",
    doneTxt:  dark ? "#c5e17a" : "#6b8e23",
    doneStrike: dark ? "#b8d94e" : "#9acd32",
    frameOuter: dark ? "#3d3d38" : "#ddd8ce",
    frameInner: dark ? "#2a2a26" : "#f5f2ec",
    frameRing:  dark ? "#1a1917" : "#ebe6dc",
    listBorder: dark ? "#353532" : "#e8e4dd",
    listInner:  dark ? "#2e2e2b" : "#faf8f5",
  };
}
