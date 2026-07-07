import Link from "next/link";
import { Globe, Smartphone, Gamepad2, Server, Camera, Package, ArrowRight } from "lucide-react";

const blueprints = [
  { slug: "corporate-website", title: "Корпоративный сайт", desc: "От покупки домена до запуска рекламы", icon: Globe, xp: 375, decisions: 21, active: true },
  { slug: "saas-project", title: "SaaS-продукт", desc: "От идеи до платежей и первых клиентов", icon: Server, xp: 0, decisions: 0 },
  { slug: "mobile-app", title: "Мобильное приложение", desc: "React Native + AI: от макета до App Store", icon: Smartphone, xp: 0, decisions: 0 },
  { slug: "game-dev", title: "Разработка игры", desc: "Unity/Godot + AI-ассистент", icon: Gamepad2, xp: 0, decisions: 0 },
  { slug: "photo-service", title: "Сервис обработки фото", desc: "AI API + загрузка + галерея", icon: Camera, xp: 0, decisions: 0 },
  { slug: "api-service", title: "Backend API", desc: "REST/GraphQL + БД + авторизация", icon: Package, xp: 0, decisions: 0 },
];

export default function Home() {
  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "var(--color-bg-secondary)", color: "var(--color-text-primary)", minHeight: "100vh" }}>
      {/* Header */}
      <header style={{ height: 72, background: "var(--color-bg-primary)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", borderBottom: "1px solid var(--color-border-light)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ fontSize: 22, fontWeight: 800 }}>
          Proekt<span style={{ color: "var(--color-accent)" }}>Map</span>
        </div>
        <span style={{ fontSize: "var(--text-s)", color: "var(--color-text-tertiary)" }}>Школа AI-инженеров</span>
      </header>

      {/* Hero */}
      <div style={{ background: "var(--color-bg-primary)", padding: "60px 20px 50px", textAlign: "center", borderBottom: "1px solid var(--color-border-light)" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 14px", borderRadius: "var(--radius-full)", background: "var(--color-accent-light)", color: "var(--color-accent)", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: "var(--space-m)" }}>
          🎓 AI Инженер
        </div>
        <h1 style={{ fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 800, lineHeight: 1.15, marginBottom: "var(--space-s)", letterSpacing: "-0.02em" }}>
          Научись создавать проекты<br />с помощью AI
        </h1>
        <p style={{ fontSize: "var(--text-l)", color: "var(--color-text-secondary)", maxWidth: 520, margin: "0 auto", lineHeight: 1.6 }}>
          Не курсы. Инженерный навигатор с готовыми промптами. Выбери шаблон и пройди путь от идеи до запуска.
        </p>
      </div>

      {/* Blueprints grid */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px 60px" }}>
        <div style={{ marginBottom: "var(--space-l)", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <h2 style={{ fontSize: "var(--text-xl)", fontWeight: 700 }}>Выберите шаблон проекта</h2>
          <span style={{ fontSize: "var(--text-s)", color: "var(--color-text-tertiary)" }}>{blueprints.length} шаблонов</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
          {blueprints.map(bp => (
            <Link key={bp.slug} href={bp.active ? `/${bp.slug}` : "#"}
              style={{
                display: "flex", alignItems: "center", gap: "var(--space-m)",
                padding: "var(--space-l)", background: "var(--color-bg-primary)",
                borderRadius: "var(--radius-l)", border: "1px solid var(--color-border-light)",
                textDecoration: "none", color: "inherit",
                opacity: bp.active ? 1 : 0.5, transition: "box-shadow var(--transition-normal)",
              }}
              className={bp.active ? "card-hover" : ""}
              onClick={e => { if (!bp.active) e.preventDefault(); }}
            >
              <div style={{ width: 48, height: 48, borderRadius: "var(--radius-m)", background: "var(--color-accent-light)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <bp.icon size={24} color="var(--color-accent)" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: "var(--text-m)", marginBottom: "var(--space-2xs)" }}>{bp.title}</div>
                <div style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)" }}>{bp.desc}</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                {bp.active ? (
                  <>
                    <div style={{ fontWeight: 700, color: "var(--color-accent)", fontSize: "var(--text-m)" }}>{bp.xp} XP</div>
                    <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>{bp.decisions} решений</div>
                  </>
                ) : (
                  <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", background: "var(--color-bg-tertiary)", padding: "4px 10px", borderRadius: "var(--radius-full)" }}>Скоро</span>
                )}
              </div>
              <ArrowRight size={18} color="var(--color-text-tertiary)" />
            </Link>
          ))}
        </div>

        {/* Memory Bank */}
        <div style={{ marginTop: "var(--space-xl)", background: "var(--color-bg-primary)", borderRadius: "var(--radius-l)", border: "2px solid var(--color-accent)", padding: "var(--space-l)", position: "relative" }}>
          <div style={{ position: "absolute", top: -12, left: 24, background: "var(--color-accent)", color: "white", padding: "4px 14px", borderRadius: "var(--radius-s)", fontSize: "var(--text-xs)", fontWeight: 700 }}>⭐ Этап 0 — обязательный</div>
          <h2 style={{ fontSize: "var(--text-l)", fontWeight: 700, marginBottom: "var(--space-xs)", marginTop: "var(--space-xs)" }}>🧠 Memory Bank</h2>
          <p style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: "var(--space-s)" }}>
            Прежде чем писать код — научись планировать. Пять файлов в папке проекта, которые AI будет читать между сессиями.
          </p>
          <div style={{ display: "flex", gap: "var(--space-xs)", flexWrap: "wrap" }}>
            {["plan.md", "tech-stack.md", "implementation.md", "progress.md", "architecture.md"].map(f => (
              <span key={f} style={{ padding: "4px 12px", background: "var(--color-accent-light)", borderRadius: "var(--radius-s)", fontSize: "var(--text-xs)", color: "var(--color-accent)", fontFamily: "var(--font-mono)" }}>{f}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ textAlign: "center", padding: "var(--space-l)", borderTop: "1px solid var(--color-border-light)", fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>
        ProektMap © 2026 · Школа AI-инженеров · Первый в России
      </footer>
    </div>
  );
}
