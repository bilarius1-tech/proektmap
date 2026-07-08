export const metadata = { title: "Swiss Editorial — демо стиля" };

export default function SwissDemo() {
  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#fafaf9", color: "#1a1a1a", minHeight: "100vh" }}>
      {/* TOP BAR — minimal */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderBottom: "1px solid #e5e5e0", background: "#fff", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ fontWeight: 800, fontSize: 14, letterSpacing: "0.02em" }}>PROEKTMAP</div>
        <div style={{ display: "flex", gap: 24, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "#8c8c80" }}>
          <span>Пути</span><span>Блог</span><span>Глоссарий</span><span>Вход</span>
        </div>
      </div>

      {/* HERO — typography-driven, no cards */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px 60px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60 }}>
          <div>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "#8c8c80", marginBottom: 16 }}>Школа AI-инженеров</div>
            <h1 style={{ fontSize: 48, fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: 20, maxWidth: 450 }}>
              Карта роста<span style={{ color: "#e5533c" }}>.</span>
            </h1>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "#5c5c50", maxWidth: 380, marginBottom: 32 }}>
              Инженерный навигатор для тех кто строит проекты с помощью AI. Без курсов, без лекций — только практика и готовые промпты.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <a href="#" style={{ padding: "12px 28px", background: "#1a1a1a", color: "white", textDecoration: "none", fontSize: 12, fontWeight: 600, letterSpacing: "0.04em" }}>НАЧАТЬ ПУТЬ</a>
              <a href="#" style={{ padding: "12px 28px", border: "1px solid #d4d4cc", color: "#1a1a1a", textDecoration: "none", fontSize: 12, fontWeight: 600, letterSpacing: "0.04em" }}>PRO — 300₽/МЕС</a>
            </div>
          </div>
          {/* Asymmetric stats block */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20, paddingTop: 40 }}>
            <div style={{ display: "flex", gap: 40 }}>
              <div><div style={{ fontSize: 64, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1 }}>203</div><div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "#8c8c80", marginTop: 4 }}>Решения</div></div>
              <div><div style={{ fontSize: 64, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1 }}>2795</div><div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "#8c8c80", marginTop: 4 }}>XP</div></div>
            </div>
            <div style={{ display: "flex", gap: 40 }}>
              <div><div style={{ fontSize: 64, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1 }}>94</div><div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "#8c8c80", marginTop: 4 }}>Термина</div></div>
              <div><div style={{ fontSize: 64, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1 }}>3</div><div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "#8c8c80", marginTop: 4 }}>Blueprint'а</div></div>
            </div>
          </div>
        </div>
      </div>

      {/* BLUEPRINTS — swiss grid, no shadows, thin borders */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "#8c8c80", marginBottom: 24 }}>Пути проекта</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: "#d4d4cc" }}>
          {[
            { title: "Корпоративный сайт", desc: "От домена до запуска", xp: 1140, decs: 81 },
            { title: "SaaS-продукт", desc: "От идеи до клиентов", xp: 875, decs: 62 },
            { title: "Разработка игры", desc: "Godot + AI → Яндекс.Игры", xp: 780, decs: 60 },
          ].map(bp => (
            <div key={bp.title} style={{ background: "#fff", padding: "32px 28px" }}>
              <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 6, letterSpacing: "-0.01em" }}>{bp.title}</div>
              <div style={{ fontSize: 12, color: "#8c8c80", lineHeight: 1.5, marginBottom: 20 }}>{bp.desc}</div>
              <div style={{ display: "flex", gap: 28, fontSize: 10, color: "#b0b0a4" }}>
                <span>{bp.decs} решений</span><span>{bp.xp} XP</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER — minimal */}
      <div style={{ borderTop: "1px solid #e5e5e0", padding: "24px", textAlign: "center", fontSize: 10, color: "#8c8c80", letterSpacing: "0.06em" }}>
        PROEKTMAP · 2026 · ШКОЛА AI-ИНЖЕНЕРОВ
      </div>
    </div>
  );
}
