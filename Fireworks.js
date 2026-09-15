// src/components/Fireworks.js
function Fireworks({ active, dark }) {
  const canvasRef = React.useRef(null);
  const stateRef = React.useRef({ particles: [], rockets: [], frame: 0 });

  React.useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const colors = ["#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff", "#ff85a2", "#c5e17a", "#fff", "#e8643a"];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    stateRef.current = { particles: [], rockets: [], frame: 0 };

    function explode(x, y, color) {
      const n = 55 + Math.floor(Math.random() * 25);
      for (let i = 0; i < n; i++) {
        const angle = (Math.PI * 2 * i) / n + Math.random() * 0.3;
        const speed = 1.8 + Math.random() * 5;
        stateRef.current.particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          decay: 0.01 + Math.random() * 0.012,
          color,
          size: 1.5 + Math.random() * 2.5,
        });
      }
    }

    function spawnRocket() {
      stateRef.current.rockets.push({
        x: 80 + Math.random() * (canvas.width - 160),
        y: canvas.height + 10,
        vy: -(7 + Math.random() * 5),
        targetY: 60 + Math.random() * canvas.height * 0.45,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let animId;
    const fade = dark ? "rgba(17,17,16,0.18)" : "rgba(247,246,243,0.2)";

    const loop = () => {
      const st = stateRef.current;
      st.frame++;
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = fade;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "lighter";

      if (st.frame % 12 === 0) spawnRocket();
      if (st.frame % 28 === 0 && st.frame > 20) spawnRocket();

      st.rockets = st.rockets.filter((r) => {
        r.y += r.vy;
        r.vy *= 0.98;
        ctx.beginPath();
        ctx.arc(r.x, r.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = r.color;
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(r.x, r.y);
        ctx.lineTo(r.x, r.y + 12);
        ctx.strokeStyle = r.color;
        ctx.globalAlpha = 0.5;
        ctx.stroke();
        ctx.globalAlpha = 1;
        if (r.vy >= 0 || r.y <= r.targetY) {
          explode(r.x, r.y, r.color);
          return false;
        }
        return true;
      });

      st.particles = st.particles.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04;
        p.vx *= 0.99;
        p.life -= p.decay;
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        return p.life > 0;
      });
      ctx.globalAlpha = 1;

      if (active || st.particles.length || st.rockets.length) {
        animId = requestAnimationFrame(loop);
      }
    };
    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [active, dark]);

  if (!active) return null;
  return <canvas ref={canvasRef} className="fireworks-canvas" aria-hidden="true"/>;
}
