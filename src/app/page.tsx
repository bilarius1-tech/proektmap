import AnimatedHero from "@/components/hero/animated-hero";
import HomeStartExample from "@/components/home/home-start-example";
import HomeMediaWall from "@/components/home/home-media-wall";
import HomeHubDirectory from "@/components/home/home-hub-directory";
import HomeMetricsBar from "@/components/home/home-metrics-bar";
import Link from "next/link";
import { ArrowRight, Boxes, Compass, GraduationCap, Route, Wrench } from "lucide-react";
import { HOME_LIVE_ROUTES, HOME_MORE_LAYERS, HOME_STATIONS } from "@/lib/home/stations-data";
import { getHomeMediaFeed } from "@/lib/home/media-feed";
import { getHomeHubStats } from "@/lib/home/hub-stats";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

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

export default async function Home() {
  const [mediaFeed, hubStats] = await Promise.all([
    getHomeMediaFeed(),
    getHomeHubStats(),
  ]);

  return (
    <div className="home-page" style={{ fontFamily: "Inter, sans-serif", background: "var(--color-bg-primary)", color: "var(--color-text-primary)", minHeight: "100vh" }}>
      <AnimatedHero>
        <div className="home-hero-content">
          <h1 className="home-hero-title">
            Не изучайте AI бесконечно.<br />Соберите работающий продукт
          </h1>
          <p className="home-hero-lead">
            Маршрут, стек и проверки уже выбраны.
          </p>
        </div>
      </AnimatedHero>

      <HomeMediaWall feed={mediaFeed} />

      <section className="home-hub" aria-labelledby="home-stations-title">
        <h2 id="home-stations-title">Что вы хотите сделать сегодня?</h2>
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

      <HomeHubDirectory />

      <HomeMetricsBar stats={hubStats} />

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
