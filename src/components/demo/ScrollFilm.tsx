"use client";

import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import {
  ChevronsDown,
  Clapperboard,
  Compass,
  Map,
  Sparkles,
  Layers,
  Rocket,
  BookOpen,
  Brain,
  Trophy,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollFilm() {
  const filmRef = useRef<HTMLDivElement>(null);
  const [scene, setScene] = useState(1);
  const [progress, setProgress] = useState(0);
  const [hint, setHint] = useState(true);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenis.on("scroll", ScrollTrigger.update);
    const ticker = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      const s1 = ".sf-s1";
      const s2 = ".sf-s2";
      const s3 = ".sf-s3";
      const s4 = ".sf-s4";
      const s5 = ".sf-s5";

      gsap.set([s1, s2, s3, s4, s5], { opacity: 0, y: 36, scale: 0.96 });
      gsap.set(s1, { opacity: 1, y: 0, scale: 1 });
      gsap.set(".sf-card-chaos", { opacity: 0, x: -36, rotate: -4 });
      gsap.set(".sf-card-map", { opacity: 0, x: 40, rotate: 3 });
      gsap.set(".sf-path-card", { opacity: 0, y: 50, scale: 0.92 });
      gsap.set(".sf-stat", { opacity: 0, y: 28 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: filmRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.7,
          onUpdate: (self) => {
            const p = self.progress;
            setProgress(p);
            setHint(p < 0.05);
            let n = 1;
            if (p > 0.18) n = 2;
            if (p > 0.38) n = 3;
            if (p > 0.58) n = 4;
            if (p > 0.78) n = 5;
            setScene(n);
          },
        },
      });

      tl.to(".sf-cam", { y: -48, scale: 1.05, ease: "none" }, 0);
      tl.to(".sf-orb-a", { x: 70, y: 50, scale: 1.12, ease: "none" }, 0);
      tl.to(".sf-orb-b", { x: -50, y: -30, scale: 1.18, ease: "none" }, 0);

      // 1 → out
      tl.to(".sf-card-chaos", { opacity: 1, x: 0, rotate: 0, duration: 0.1, ease: "none" }, 0.03);
      tl.to(s1, { opacity: 0, y: -28, scale: 1.05, duration: 0.12, ease: "none" }, 0.14);
      tl.to(".sf-card-chaos", { opacity: 0, x: -24, duration: 0.08, ease: "none" }, 0.16);

      // 2
      tl.fromTo(s2, { opacity: 0, y: 48, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.12, ease: "none" }, 0.18);
      tl.to(".sf-card-map", { opacity: 1, x: 0, rotate: 0, duration: 0.12, ease: "none" }, 0.22);
      tl.to(s2, { opacity: 0, y: -32, scale: 1.04, duration: 0.12, ease: "none" }, 0.34);
      tl.to(".sf-card-map", { opacity: 0, x: 36, duration: 0.08, ease: "none" }, 0.36);

      // 3
      tl.fromTo(s3, { opacity: 0, y: 44, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.12, ease: "none" }, 0.38);
      tl.to(".sf-path-card", { opacity: 1, y: 0, scale: 1, stagger: 0.03, duration: 0.14, ease: "none" }, 0.42);
      tl.to(s3, { opacity: 0, y: -28, scale: 1.04, duration: 0.12, ease: "none" }, 0.54);
      tl.to(".sf-path-card", { opacity: 0, y: -20, duration: 0.08, ease: "none" }, 0.56);

      // 4
      tl.fromTo(s4, { opacity: 0, y: 40, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.12, ease: "none" }, 0.58);
      tl.to(".sf-stat", { opacity: 1, y: 0, stagger: 0.04, duration: 0.12, ease: "none" }, 0.62);
      tl.to(s4, { opacity: 0, y: -30, scale: 1.04, duration: 0.12, ease: "none" }, 0.74);
      tl.to(".sf-stat", { opacity: 0, y: -16, duration: 0.08, ease: "none" }, 0.76);

      // 5
      tl.fromTo(s5, { opacity: 0, y: 48, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 0.14, ease: "none" }, 0.78);
      tl.to({}, { duration: 0.1 }, 0.94);
    }, filmRef);

    return () => {
      ctx.revert();
      gsap.ticker.remove(ticker);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div ref={filmRef} className="sf-film" style={{ height: "600vh", position: "relative", background: "#07110e" }}>
      {/* HUD */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: 3,
          width: `${(progress * 100).toFixed(2)}%`,
          background: "linear-gradient(90deg, #0a5c44, #0fb880, #7dffc8)",
          zIndex: 300,
          boxShadow: "0 0 12px rgba(15,184,128,.45)",
        }}
      />
      <div
        style={{
          position: "fixed",
          top: 14,
          right: 16,
          zIndex: 300,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#8bbfad",
          border: "1px solid rgba(15,184,128,.25)",
          padding: "6px 10px",
          borderRadius: 999,
          background: "rgba(7,17,14,.75)",
          backdropFilter: "blur(8px)",
        }}
      >
        Сцена {scene} / 5
      </div>
      <Link
        href="/"
        style={{
          position: "fixed",
          top: 14,
          left: 16,
          zIndex: 300,
          fontSize: 12,
          fontWeight: 700,
          color: "#e8fff6",
          textDecoration: "none",
          border: "1px solid rgba(15,184,128,.25)",
          padding: "6px 12px",
          borderRadius: 999,
          background: "rgba(7,17,14,.75)",
        }}
      >
        Карта<span style={{ color: "#0fb880" }}> роста</span>
      </Link>
      <div
        style={{
          position: "fixed",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 300,
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "#0fb880",
          opacity: hint ? 0.85 : 0,
          transition: "opacity .4s",
          pointerEvents: "none",
        }}
      >
        <ChevronsDown size={14} /> скролльте — пульт камеры
      </div>

      {/* Stage */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          width: "100%",
          overflow: "hidden",
          background:
            "radial-gradient(900px 500px at 15% 0%, rgba(15,184,128,.16), transparent 55%), radial-gradient(700px 420px at 90% 90%, rgba(10,92,68,.14), transparent 50%), #07110e",
        }}
      >
        <div className="sf-orb-a" aria-hidden style={orbStyle(true)} />
        <div className="sf-orb-b" aria-hidden style={orbStyle(false)} />

        <div className="sf-cam" style={{ position: "absolute", inset: 0, willChange: "transform" }}>
          {/* Scene 1 */}
          <section className="sf-s1" style={sceneStyle}>
            <div style={panelStyle}>
              <div style={eyebrowStyle}>
                <Clapperboard size={14} /> scroll-фильм · proektmap
              </div>
              <h1 style={h1Style}>AI вокруг — шум. Вам нужна карта.</h1>
              <p style={leadStyle}>
                Сотни инструментов, советов и «просто спроси ChatGPT». Мы превращаем хаос в{" "}
                <strong style={{ color: "#e8fff6" }}>понятный путь проекта</strong> — сцена за сценой, как фильм.
              </p>
            </div>
            <div className="sf-card-chaos" style={{ ...floatCard, top: "20%", left: "6%" }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#ff8a7a", lineHeight: 1 }}>∞</div>
              <div style={{ marginTop: 6, fontSize: 13, color: "#9bb5ab" }}>тулзы, чаты, туториалы — без маршрута</div>
            </div>
          </section>

          {/* Scene 2 */}
          <section className="sf-s2" style={sceneStyle}>
            <div style={panelStyle}>
              <div style={eyebrowStyle}>
                <Compass size={14} /> сцена 02
              </div>
              <h2 style={h2Style}>Без карты вы топчете на месте</h2>
              <p style={leadStyle}>
                Не потому что «мало стараетесь». Потому что нет последовательности решений:
                что строить → чем → в каком порядке → как не сломать.
              </p>
            </div>
            <div className="sf-card-map" style={{ ...floatCard, top: "26%", right: "6%" }}>
              <Map size={28} color="#0fb880" />
              <div style={{ marginTop: 8, fontSize: 15, fontWeight: 700, color: "#e8fff6" }}>Нужна навигация</div>
              <div style={{ marginTop: 4, fontSize: 13, color: "#9bb5ab" }}>не ещё один курс лекций</div>
            </div>
          </section>

          {/* Scene 3 */}
          <section className="sf-s3" style={sceneStyle}>
            <div style={panelStyle}>
              <div style={eyebrowStyle}>
                <Layers size={14} /> сцена 03
              </div>
              <h2 style={h2Style}>Карта роста — путь, а не лента</h2>
              <p style={leadStyle}>
                Blueprint&apos;ы, этапы и готовые решения. Вы идёте по маршруту AI-инженера — от идеи до запуска.
              </p>
            </div>
            <div
              style={{
                position: "absolute",
                bottom: "12%",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                justifyContent: "center",
                width: "min(900px, 94%)",
              }}
            >
              {[
                { t: "Корп. сайт", d: "от домена до запуска" },
                { t: "SaaS", d: "от идеи до клиентов" },
                { t: "Игра", d: "Godot + AI → сторы" },
              ].map((p) => (
                <div key={p.t} className="sf-path-card" style={pathCard}>
                  <div style={{ fontWeight: 800, color: "#e8fff6", marginBottom: 4 }}>{p.t}</div>
                  <div style={{ fontSize: 12, color: "#9bb5ab" }}>{p.d}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Scene 4 */}
          <section className="sf-s4" style={sceneStyle}>
            <div style={panelStyle}>
              <div style={eyebrowStyle}>
                <Sparkles size={14} /> сцена 04
              </div>
              <h2 style={h2Style}>Практика вместо теории</h2>
              <p style={leadStyle}>
                Промпты, решения, глоссарий, XP. Открыли шаг — сделали — пошли дальше. Как в хорошей игре, только для проектов.
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 12,
                  marginTop: 28,
                  maxWidth: 520,
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                {[
                  { icon: BookOpen, n: "промпты", l: "готовые к делу" },
                  { icon: Brain, n: "решения", l: "что выбрать и почему" },
                  { icon: Trophy, n: "рост", l: "XP и ясный прогресс" },
                ].map((s) => (
                  <div key={s.n} className="sf-stat" style={statCard}>
                    <s.icon size={18} color="#0fb880" />
                    <div style={{ fontWeight: 800, marginTop: 8, color: "#e8fff6" }}>{s.n}</div>
                    <div style={{ fontSize: 12, color: "#9bb5ab", marginTop: 2 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Scene 5 CTA */}
          <section className="sf-s5" style={sceneStyle}>
            <div style={{ ...panelStyle, pointerEvents: "auto" }}>
              <div style={eyebrowStyle}>
                <Rocket size={14} /> финал
              </div>
              <h2 style={h2Style}>Начните путь сегодня</h2>
              <p style={leadStyle}>Бесплатный вход в карту. Pro — 300 ₽/мес, если нужен AI-консультант и полный доступ.</p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 24 }}>
                <Link href="/auth" style={btnPrimary}>
                  Начать путь
                </Link>
                <Link href="/pricing" style={btnGhost}>
                  Pro — 300 ₽/мес
                </Link>
              </div>
              <form
                onSubmit={(e: FormEvent) => {
                  e.preventDefault();
                  setSent(true);
                }}
                style={formStyle}
              >
                <label style={labelStyle}>Или оставьте контакт — напишем в Telegram</label>
                <input
                  name="contact"
                  placeholder="@username или телефон"
                  style={inputStyle}
                  required
                />
                <button type="submit" style={{ ...btnPrimary, width: "100%", marginTop: 10, border: 0, cursor: "pointer" }}>
                  {sent ? "✓ Принято (демо)" : "Хочу консультацию"}
                </button>
                <p style={{ marginTop: 8, fontSize: 12, color: "#6f8f82", textAlign: "center" }}>
                  {sent
                    ? "В бою форма уйдёт в CRM/Telegram. Здесь — UX финала сцены."
                    : "Демо scroll-лендинга · Next.js + GSAP + Lenis"}
                </p>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function orbStyle(a: boolean): CSSProperties {
  return {
    position: "absolute",
    width: a ? 420 : 360,
    height: a ? 420 : 360,
    top: a ? -80 : undefined,
    left: a ? -60 : undefined,
    bottom: a ? undefined : -100,
    right: a ? undefined : -40,
    borderRadius: "50%",
    background: a
      ? "radial-gradient(circle at 30% 30%, rgba(125,255,200,.22), rgba(15,184,128,.05) 55%, transparent)"
      : "radial-gradient(circle at 30% 30%, rgba(15,184,128,.18), transparent 60%)",
    pointerEvents: "none",
    willChange: "transform",
  };
}

const sceneStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "2rem 1.25rem",
  opacity: 0,
};

const panelStyle: CSSProperties = {
  width: "min(680px, 100%)",
  textAlign: "center",
  position: "relative",
  zIndex: 2,
};

const eyebrowStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  color: "#0fb880",
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  marginBottom: 14,
};

const h1Style: CSSProperties = {
  fontFamily: "Montserrat, Inter, sans-serif",
  fontSize: "clamp(2rem, 5.5vw, 3.3rem)",
  fontWeight: 800,
  lineHeight: 1.08,
  letterSpacing: "-0.02em",
  color: "#e8fff6",
  maxWidth: "15ch",
  margin: "0 auto",
};

const h2Style: CSSProperties = {
  ...h1Style,
  fontSize: "clamp(1.7rem, 4.5vw, 2.7rem)",
  maxWidth: "16ch",
};

const leadStyle: CSSProperties = {
  margin: "14px auto 0",
  color: "#9bb5ab",
  fontSize: 16,
  lineHeight: 1.55,
  maxWidth: "34rem",
};

const floatCard: CSSProperties = {
  position: "absolute",
  width: "min(240px, 42vw)",
  padding: "16px 18px",
  borderRadius: 16,
  background: "rgba(10, 28, 22, 0.9)",
  border: "1px solid rgba(15,184,128,.28)",
  boxShadow: "0 28px 60px rgba(0,0,0,.45)",
  textAlign: "left",
  zIndex: 1,
};

const pathCard: CSSProperties = {
  flex: "1 1 160px",
  maxWidth: 220,
  padding: "16px 18px",
  borderRadius: 14,
  background: "rgba(10, 28, 22, 0.92)",
  border: "1px solid rgba(15,184,128,.28)",
  textAlign: "left",
};

const statCard: CSSProperties = {
  padding: "14px 12px",
  borderRadius: 14,
  background: "rgba(10, 28, 22, 0.9)",
  border: "1px solid rgba(15,184,128,.25)",
};

const btnPrimary: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "12px 22px",
  borderRadius: 12,
  background: "linear-gradient(90deg, #0fb880, #0a9a6a)",
  color: "#04140f",
  fontWeight: 800,
  textDecoration: "none",
  fontSize: 15,
  boxShadow: "0 12px 32px rgba(15,184,128,.3)",
};

const btnGhost: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "12px 22px",
  borderRadius: 12,
  border: "1px solid rgba(15,184,128,.35)",
  color: "#e8fff6",
  fontWeight: 700,
  textDecoration: "none",
  fontSize: 15,
  background: "rgba(15,184,128,.06)",
};

const formStyle: CSSProperties = {
  margin: "28px auto 0",
  maxWidth: 400,
  textAlign: "left",
  padding: 18,
  borderRadius: 16,
  background: "rgba(10, 28, 22, 0.95)",
  border: "1px solid rgba(15,184,128,.3)",
};

const labelStyle: CSSProperties = {
  display: "block",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#0fb880",
  marginBottom: 8,
};

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 10,
  border: "1px solid rgba(15,184,128,.25)",
  background: "#07110e",
  color: "#e8fff6",
  fontSize: 15,
  outline: "none",
};
