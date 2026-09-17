import AnimatedHero from "@/components/hero/animated-hero";
import HomeStartExample from "@/components/home/home-start-example";
import Link from "next/link";
import { ArrowRight, Boxes, Compass, GraduationCap, Route, Wrench } from "lucide-react";
import { HOME_LIVE_ROUTES, HOME_MORE_LAYERS, HOME_STATIONS } from "@/lib/home/stations-data";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ProektMap — Карта роста и готовые AI-решения для создания продуктов",
  description: "Готовые инженерные маршруты, стек, промпты, Skills и практические шаги для создания веб-сервисов, Telegram-ботов и AI-ассистентов.",
  alternates: {
    canonical: "https://proektmap.ru",
  },
};

const STATION_ICONS = {
  route: Route,
  architect: Compass,
  tools: Wrench,
  learn: GraduationCap,
} as const;

export default function Home() {
  return (
    <div className="home-page" style={{ fontFamily: "Inter, sans-serif", background: "var(--color-bg-primary)", color: "var(--color-text-primary)", minHeight: "100vh" }}>
      <AnimatedHero>
        <div className="home-hero-content" style={{ background: "transparent", padding: "80px 20px 50px", textAlign: "center" }}>
          <div className="home-hero-badge" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 14px", borderRadius: "var(--radius-full)", background: "var(--color-accent-light)", color: "var(--color-accent)", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: "var(--space-m)" }}>
            Что сделать сегодня
          </div>
          <h1 className="home-hero-title" style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 800, lineHeight: 1.05, marginBottom: "var(--space-s)", letterSpacing: "-0.02em" }}>
            Не изучайте AI бесконечно.<br />Соберите работающий продукт
          </h1>
          <p className="home-hero-lead" style={{ fontSize: "var(--text-l)", color: "var(--color-text-secondary)", maxWidth: 520, margin: "0 auto", lineHeight: 1.6 }}>
            ProektMap уже выбрал стек, программы, модели, команды и промпты. Выберите продукт и выполняйте готовый маршрут до production.
          </p>
          <div className="home-solution-flow" aria-label="Модель готового решения">
            {["Продукт", "Рекомендация", "Команда", "Результат", "Проверка"].map((step, index) => (
              <div key={step}>
                <span>{index + 1}</span>
                <strong>{step}</strong>
                {index < 4 && <ArrowRight size={13} aria-hidden />}
              </div>
            ))}
          </div>
          <div className="home-hero-actions" style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: "var(--space-xl)", flexWrap: "wrap" }}>
            <Link href="/resheniya" className="home-hero-action home-solutions-primary" style={{ display: "flex", alignItems: "center", gap: 8, padding: "17px 34px", borderRadius: "var(--radius-m)", background: "var(--color-accent)", color: "white", textDecoration: "none", fontSize: "var(--text-m)", fontWeight: 800 }}>
              Открыть готовые решения AI <ArrowRight size={18} />
            </Link>
            <Link href="/resheniya/saas-product" className="home-hero-action" style={{ display: "flex", alignItems: "center", gap: 6, padding: "14px 28px", borderRadius: "var(--radius-m)", background: "var(--color-surface)", color: "var(--color-accent)", border: "1px solid var(--color-accent)", textDecoration: "none", fontSize: "var(--text-s)", fontWeight: 700 }}>
              Посмотреть маршрут SaaS
            </Link>
          </div>
        </div>
      </AnimatedHero>

      <div style={{ height: 1, background: "var(--color-border)" }} />

      <section className="home-hub" aria-labelledby="home-stations-title">
        <h2 id="home-stations-title">Что вы хотите сделать сегодня?</h2>
        <p className="home-hub-lead">Четыре входа. Каталоги и лаборатории живут внутри станций, а не на первом экране.</p>
        <div className="home-station-grid">
          {HOME_STATIONS.map((station) => {
            const Icon = STATION_ICONS[station.id as keyof typeof STATION_ICONS];
            return (
              <Link
                key={station.id}
                href={station.href}
                className={`home-station-card${station.primary ? " is-primary" : ""}`}
              >
                <div className="home-station-kicker">
                  <Icon size={18} />
                  <span>{station.kicker}</span>
                </div>
                <strong>{station.title}</strong>
                <p>{station.description}</p>
                <span className="home-station-cta">
                  {station.cta} <ArrowRight size={14} />
                </span>
              </Link>
            );
          })}
        </div>

        <h3 className="home-routes-title">Три живых маршрута</h3>
        <div className="home-route-grid">
          {HOME_LIVE_ROUTES.map((route) => (
            <Link key={route.href} href={route.href} className="home-route-card">
              <span>{route.duration}</span>
              <strong>{route.title}</strong>
              <p>{route.result}</p>
              <em>Открыть маршрут <ArrowRight size={14} /></em>
            </Link>
          ))}
        </div>

        <HomeStartExample />

        <Link href="/sitemap" className="home-map-link">
          <Boxes size={22} />
          <div>
            <strong>Полная карта проекта</strong>
            <span>Все разделы деревом, режим новичка и поиск по задаче. Не вместо старта — если нужен обзор.</span>
          </div>
          <ArrowRight size={18} />
        </Link>

        <nav className="home-more-layers" aria-label="Другие слои проекта">
          {HOME_MORE_LAYERS.map((item) => (
            <Link key={item.href} href={item.href}>{item.label}</Link>
          ))}
        </nav>
      </section>

      <div style={{ padding: "var(--space-xl) var(--space-m)", background: "var(--color-bg-primary)", borderTop: "1px solid var(--color-border)", textAlign: "center" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", lineHeight: 1.8 }}>
          <div style={{ fontWeight: 700, marginBottom: 4, color: "var(--color-text-secondary)" }}>Реквизиты</div>
          <div>ИП Тимофеев Алексей Геннадьевич &middot; ИНН 532002912418</div>
          <div>Email: bilariuss@yandex.ru &middot; Telegram: @bilarius</div>
          <div style={{ marginTop: "var(--space-s)", display: "flex", gap: "var(--space-m)", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/privacy" style={{ color: "var(--color-text-tertiary)" }}>Политика</Link>
            <Link href="/terms" style={{ color: "var(--color-text-tertiary)" }}>Соглашение</Link>
            <Link href="/offer" style={{ color: "var(--color-text-tertiary)" }}>Оферта</Link>
            <Link href="/refund" style={{ color: "var(--color-text-tertiary)" }}>Возврат</Link>
            <Link href="/contacts" style={{ color: "var(--color-text-tertiary)" }}>Контакты</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
