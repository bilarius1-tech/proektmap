"use client";

import { useRef, useEffect, useCallback } from "react";

// Simplified Russia outline — major polygon points (normalized 0-1000)
const RUSSIA_OUTLINE: [number, number][] = [
  [120,80],[180,50],[280,30],[380,20],[480,15],[580,20],[650,30],[720,25],[780,35],[820,50],[850,60],
  [880,70],[900,90],[920,110],[930,140],[940,170],[950,200],[960,230],[960,260],[950,300],
  [930,340],[910,370],[880,400],[850,420],[820,440],[780,460],[750,480],[720,500],[680,520],
  [640,540],[600,560],[560,580],[520,600],[500,620],[520,640],[550,650],[600,660],[650,670],
  [700,690],[750,710],[800,720],[850,700],[880,660],[900,620],[920,580],[940,550],[950,520],
  [940,500],[900,480],[850,470],[800,460],[750,440],[700,420],[650,400],[600,380],[550,370],
  [500,380],[450,390],[400,370],[350,350],[300,330],[250,310],[200,290],[150,270],[130,250],
  [120,220],[110,190],[110,160],[115,130],[118,100],
];

// Major tech cities with normalized coordinates
const CITIES: { name: string; x: number; y: number; size: number }[] = [
  { name: "Москва", x: 180, y: 320, size: 5 },
  { name: "СПб", x: 160, y: 220, size: 4 },
  { name: "Казань", x: 250, y: 350, size: 3 },
  { name: "Новосибирск", x: 520, y: 440, size: 3.5 },
  { name: "Екатеринбург", x: 320, y: 380, size: 3 },
  { name: "Калининград", x: 60, y: 300, size: 2.5 },
  { name: "Владивосток", x: 900, y: 500, size: 3 },
  { name: "Краснодар", x: 150, y: 480, size: 2.5 },
  { name: "Нижний Новгород", x: 220, y: 310, size: 2.5 },
  { name: "Красноярск", x: 580, y: 400, size: 2.5 },
];

// Connections between cities (indices into CITIES array)
const CONNECTIONS: [number, number][] = [
  [0,1],[0,2],[0,8],[0,3],[0,4],[0,5],  // Moscow hub
  [1,2],[2,4],[4,3],[3,9],[3,6],          // East-west
  [7,0],[7,1],                              // South
];

interface Particle {
  x: number; y: number; vx: number; vy: number;
  size: number; alpha: number; life: number; maxLife: number;
}

export default function AnimatedHero({ children }: { children: React.ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const frameRef = useRef(0);
  const dimsRef = useRef({ w: 0, h: 0, scale: 1, ox: 0, oy: 0 });

  const spawnParticle = useCallback((cx: number, cy: number) => {
    return {
      x: cx, y: cy,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8 - 0.5,
      size: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.8 + 0.2,
      life: 0,
      maxLife: 60 + Math.random() * 120,
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const dpr = devicePixelRatio || 1;

    // Initialize particles
    const particles: Particle[] = [];
    for (let i = 0; i < 30; i++) {
      const ci = CITIES[Math.floor(Math.random() * CITIES.length)];
      particles.push(spawnParticle(ci.x, ci.y));
    }
    particlesRef.current = particles;

    function resize() {
      if (!canvas) return;
      const parent = canvas.parentElement;
      if (!parent) return;
      const w = parent.offsetWidth;
      const h = parent.offsetHeight || 520;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Scale map to fit
      const mapW = 900;
      const mapH = 600;
      const padding = 40;
      const scaleX = (w - padding * 2) / mapW;
      const scaleY = (h - padding * 2) / mapH;
      const scale = Math.min(scaleX, scaleY);
      const ox = (w - mapW * scale) / 2;
      const oy = (h - mapH * scale) / 2;
      dimsRef.current = { w, h, scale, ox, oy };
    }

    function draw() {
      frameRef.current++;
      const t = frameRef.current * 0.005;
      const { w, h, scale, ox, oy } = dimsRef.current;
      if (!scale) return;

      // Smooth mouse
      mouseRef.current.tx += (mouseRef.current.x - mouseRef.current.tx) * 0.04;
      mouseRef.current.ty += (mouseRef.current.y - mouseRef.current.ty) * 0.04;

      ctx!.clearRect(0, 0, w, h);

      const tx = (x: number) => x * scale + ox;
      const ty = (y: number) => y * scale + oy;

      // ---- Grid background ----
      ctx!.strokeStyle = "rgba(15,184,128,0.04)";
      ctx!.lineWidth = 0.5;
      const gs = 30;
      ctx!.beginPath();
      for (let x = gs; x < w; x += gs) { ctx!.moveTo(x, 0); ctx!.lineTo(x, h); }
      for (let y = gs; y < h; y += gs) { ctx!.moveTo(0, y); ctx!.lineTo(w, y); }
      ctx!.stroke();

      // ---- Russia outline ----
      ctx!.save();
      ctx!.strokeStyle = "rgba(15,184,128,0.25)";
      ctx!.lineWidth = 1.5;
      ctx!.fillStyle = "rgba(15,184,128,0.04)";
      ctx!.beginPath();
      ctx!.moveTo(tx(RUSSIA_OUTLINE[0][0]), ty(RUSSIA_OUTLINE[0][1]));
      for (let i = 1; i < RUSSIA_OUTLINE.length; i++) {
        ctx!.lineTo(tx(RUSSIA_OUTLINE[i][0]), ty(RUSSIA_OUTLINE[i][1]));
      }
      ctx!.closePath();
      ctx!.fill();
      ctx!.stroke();

      // Second outline — thinner, more transparent
      ctx!.strokeStyle = "rgba(15,184,128,0.12)";
      ctx!.lineWidth = 0.5;
      ctx!.stroke();
      ctx!.restore();

      // ---- Connection lines ----
      for (const [a, b] of CONNECTIONS) {
        const ca = CITIES[a];
        const cb = CITIES[b];
        const pulse = Math.sin(t * 2 + a + b) * 0.3 + 0.5;
        ctx!.strokeStyle = `rgba(15,184,128,${0.08 + pulse * 0.1})`;
        ctx!.lineWidth = 0.6 + pulse * 0.4;
        ctx!.beginPath();
        ctx!.moveTo(tx(ca.x), ty(ca.y));
        ctx!.lineTo(tx(cb.x), ty(cb.y));
        ctx!.stroke();

        // Traveling dot
        const dotT = ((t * 0.4 + a * 1.3) % 1.5) / 1.5;
        const dx = ca.x + (cb.x - ca.x) * dotT;
        const dy = ca.y + (cb.y - ca.y) * dotT;
        const dotAlpha = dotT < 0.1 ? dotT * 10 : dotT > 0.9 ? (1 - dotT) * 10 : 1;
        if (dotAlpha > 0) {
          ctx!.fillStyle = `rgba(15,184,128,${dotAlpha * 0.7})`;
          ctx!.beginPath();
          ctx!.arc(tx(dx), ty(dy), 2.5, 0, Math.PI * 2);
          ctx!.fill();
        }
      }

      // ---- Cities ----
      for (const city of CITIES) {
        const pulse = Math.sin(t * 3 + city.x * 0.01) * 0.5 + 0.5;
        const cx = tx(city.x);
        const cy = ty(city.y);

        // Glow
        for (let r = 3; r >= 1; r--) {
          const alpha = (0.12 + pulse * 0.08) / r;
          const grad = ctx!.createRadialGradient(cx, cy, 0, cx, cy, city.size * r * 3);
          grad.addColorStop(0, `rgba(15,184,128,${alpha})`);
          grad.addColorStop(1, "rgba(15,184,128,0)");
          ctx!.fillStyle = grad;
          ctx!.beginPath();
          ctx!.arc(cx, cy, city.size * r * 3, 0, Math.PI * 2);
          ctx!.fill();
        }

        // Core dot
        ctx!.fillStyle = `rgba(15,184,128,${0.6 + pulse * 0.4})`;
        ctx!.beginPath();
        ctx!.arc(cx, cy, city.size, 0, Math.PI * 2);
        ctx!.fill();

        // Label (only major cities on desktop)
        if (city.size >= 4 && w > 600) {
          ctx!.fillStyle = `rgba(15,184,128,0.5)`;
          ctx!.font = "9px Inter, sans-serif";
          ctx!.textAlign = "center";
          ctx!.fillText(city.name, cx, cy - city.size - 8);
        }
      }

      // ---- Particles ----
      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        if (p.life > p.maxLife) {
          const ci = CITIES[Math.floor(Math.random() * CITIES.length)];
          Object.assign(p, spawnParticle(ci.x, ci.y));
        }
        const fade = p.life < 20 ? p.life / 20 : p.life > p.maxLife - 20 ? (p.maxLife - p.life) / 20 : 1;
        ctx!.fillStyle = `rgba(15,184,128,${p.alpha * fade * 0.6})`;
        ctx!.beginPath();
        ctx!.arc(tx(p.x), ty(p.y), p.size, 0, Math.PI * 2);
        ctx!.fill();
      }

      // Spawn new particles periodically
      if (frameRef.current % 8 === 0 && particlesRef.current.length < 40) {
        const ci = CITIES[Math.floor(Math.random() * CITIES.length)];
        particlesRef.current.push(spawnParticle(ci.x, ci.y));
      }

      animId = requestAnimationFrame(draw);
    }

    function onMouseMove(e: MouseEvent) {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    }

    resize();
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [spawnParticle]);

  return (
    <div style={{ position: "relative", overflow: "hidden", minHeight: 420 }}>
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute", inset: 0, zIndex: 0,
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}
