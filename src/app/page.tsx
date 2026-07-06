import Link from "next/link";

export default function Home() {
  const levels = [
    {
      slug: "novice",
      title: "🚀 Новичок",
      subtitle: "Никогда не делал сайты",
      color: "#0FB880",
      bg: "#eef9f4",
      features: ["Установка инструментов", "Первый промпт", "Первый сайт за час"],
      stages: 4,
      xp: 100,
    },
    {
      slug: "practitioner",
      title: "⚡ Практик",
      subtitle: "Уже пробовал, хочу глубже",
      color: "#3b82f6",
      bg: "#eef3ff",
      features: ["Дизайн-система", "База данных", "Деплой на сервер"],
      stages: 3,
      xp: 250,
    },
    {
      slug: "builder",
      title: "🏗 Строитель",
      subtitle: "Создаю проекты на заказ",
      color: "#8b5cf6",
      bg: "#f5f3ff",
      features: ["SEO и аналитика", "Приём платежей", "Запуск рекламы"],
      stages: 3,
      xp: 400,
    },
  ];

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#fafafa", color: "#222", minHeight: "100vh" }}>
      {/* Header */}
      <header style={{ height: 72, background: "white", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", borderBottom: "1px solid #ececec", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ fontSize: 22, fontWeight: 800 }}>
          Engineering <span style={{ color: "#0FB880" }}>Blueprint</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 13, color: "#888" }}>Школа вайбкодинга в России</span>
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#e5e7eb" }} />
        </div>
      </header>

      {/* Hero */}
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "60px 20px 40px", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 14px", borderRadius: 30, background: "#eef9f4", color: "#0FB880", fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
          🎓 Школа вайбкодинга
        </div>
        <h1 style={{ fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 800, lineHeight: 1.15, marginBottom: 12, color: "#111" }}>
          Научись создавать сайты<br />с помощью AI
        </h1>
        <p style={{ fontSize: 17, color: "#666", lineHeight: 1.6, maxWidth: 480, margin: "0 auto 8px" }}>
          От установки VS Code до запуска рекламы. Не курсы — инженерный навигатор с AI-консультантом.
        </p>
        <p style={{ fontSize: 14, color: "#aaa" }}>Первый в России. Бесплатно.</p>
      </div>

      {/* Memory Bank */}
      <div style={{ maxWidth: 700, margin: "0 auto 40px", padding: "0 20px" }}>
        <div style={{ background: "white", borderRadius: 18, border: "2px solid #0FB880", padding: "24px 28px", position: "relative" }}>
          <div style={{ position: "absolute", top: -12, left: 24, background: "#0FB880", color: "white", padding: "4px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700 }}>
            ⭐ Этап 0 — обязательный
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, marginTop: 4 }}>🧠 Memory Bank</h2>
          <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6, marginBottom: 12 }}>
            Прежде чем писать код — научись планировать. 5 файлов в папке проекта, которые AI будет читать между сессиями.
            Это методология, которую используют профи.
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["plan.md", "tech-stack.md", "implementation.md", "progress.md", "architecture.md"].map(f => (
              <span key={f} style={{ padding: "4px 12px", background: "#f0fdf6", borderRadius: 8, fontSize: 12, color: "#0FB880", fontFamily: "monospace", border: "1px solid #d1fae5" }}>{f}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Levels */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 20px 60px" }}>
        <h2 style={{ textAlign: "center", fontSize: 22, fontWeight: 700, marginBottom: 24, color: "#333" }}>Выбери свой уровень</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
          {levels.map(lv => (
            <Link key={lv.slug} href={`/corporate-website?level=${lv.slug}`}
              style={{
                display: "block", padding: "28px 24px", borderRadius: 18,
                background: lv.bg, border: `2px solid ${lv.color}20`,
                textDecoration: "none", color: "#222", transition: "all 0.2s",
              }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{lv.title.split(" ")[0]}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4, color: lv.color }}>{lv.title}</h3>
              <p style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>{lv.subtitle}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
                {lv.features.map(f => (
                  <span key={f} style={{ fontSize: 13, color: "#555" }}>✓ {f}</span>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "#aaa" }}>{lv.stages} этапов</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: lv.color }}>{lv.xp} XP</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer style={{ textAlign: "center", padding: "24px", borderTop: "1px solid #ececec", fontSize: 13, color: "#aaa" }}>
        Engineering Blueprint © 2026 · Первая школа вайбкодинга в России
      </footer>
    </div>
  );
}
