import Link from "next/link";
import { Globe, BookOpen, Plug, Wrench, Package, MessageSquare, Newspaper, Search, Compass, Cpu, Zap, Play, Crown, Home, GitBranch, Lightbulb } from "lucide-react";

export const metadata = {
  title: "Карта сайта — ProektMap",
  description: "Полная карта сайта ProektMap: все страницы и разделы. AI-инструменты, MCP-серверы, глоссарий, паттерны, промпты, блог, Blueprint.",
};

const sections = [
  {
    title: "Главные страницы",
    icon: Home,
    color: "var(--color-accent)",
    links: [
      { href: "/", label: "Главная", desc: "Поиск, блог, глоссарий" },
      { href: "/decisions", label: "Методология", desc: "ПОНЯТЬ → ВЫБРАТЬ → ПРОВЕРИТЬ" },
      { href: "/quest/beginner", label: "Путь новичка", desc: "8 шагов до сайта в интернете" },
      { href: "/architect", label: "AI-Архитектор", desc: "Идея → карта проекта" },
      { href: "/pricing", label: "Тарифы", desc: "Бесплатно и Pro 300/мес" },
      { href: "/search", label: "Поиск", desc: "Поиск по всей экосистеме" },
    ],
  },
  {
    title: "Конструктор проектов",
    icon: Compass,
    color: "#3b82f6",
    links: [
      { href: "/corporate-website", label: "Корпоративный сайт", desc: "40 решений, 710 XP" },
      { href: "/saas-project", label: "SaaS-продукт", desc: "21 решение, 445 XP" },
      { href: "/game-dev", label: "Разработка игры", desc: "19 решений, 350 XP" },
      { href: "/mobile-app", label: "Мобильное приложение", desc: "Скоро" },
      { href: "/photo-service", label: "Сервис обработки фото", desc: "Скоро" },
      { href: "/api-service", label: "Backend API", desc: "Скоро" },
    ],
  },
  {
    title: "Каталоги",
    icon: Wrench,
    color: "#f59e0b",
    links: [
      { href: "/ai-tools", label: "AI-инструменты", desc: "31 инструмент с логотипами" },
      { href: "/mcp", label: "MCP-серверы", desc: "50+ серверов Model Context Protocol" },
      { href: "/glossary", label: "Глоссарий", desc: "113 терминов AI-разработки" },
      { href: "/patterns", label: "Паттерны сборки", desc: "7 бизнес-схем" },
      { href: "/prompts", label: "Промпты", desc: "Библиотека с категориями" },
      { href: "/models", label: "AI-модели", desc: "Сравнение и рейтинг" },
    ],
  },
  {
    title: "Контент",
    icon: Newspaper,
    color: "#8b5cf6",
    links: [
      { href: "/blog", label: "Блог", desc: "Новости AI и разработки" },
      { href: "/vibecraft", label: "VibeCraft KB", desc: "База знаний по VibeCraft" },
      { href: "/sitemap", label: "Карта сайта", desc: "Визуальная карта (эта страница)" },
    ],
  },
  {
    title: "Личный кабинет",
    icon: BookOpen,
    color: "#ef4444",
    links: [
      { href: "/dashboard", label: "Дашборд", desc: "Прогресс и статистика" },
      { href: "/dashboard/collection", label: "Избранное", desc: "Сохранённые материалы" },
      { href: "/dashboard/billing", label: "Биллинг", desc: "Управление подпиской" },
    ],
  },
  {
    title: "Правовая информация",
    icon: Globe,
    color: "var(--color-text-tertiary)",
    links: [
      { href: "/privacy", label: "Политика конфиденциальности" },
      { href: "/terms", label: "Пользовательское соглашение" },
      { href: "/offer", label: "Оферта" },
      { href: "/refund", label: "Возврат" },
      { href: "/contacts", label: "Контакты" },
    ],
  },
];

export default function SitemapPage() {
  return (
    <div style={{ background: "var(--color-bg-secondary)", minHeight: "100vh", fontFamily: "var(--font-body)", color: "var(--color-text-primary)" }}>
      <div style={{ background: "var(--color-bg-primary)", borderBottom: "1px solid var(--color-border)", padding: "60px 20px 40px", textAlign: "center" }}>
        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 900, marginBottom: "var(--space-s)", letterSpacing: "-0.02em" }}>
          Карта сайта
        </h1>
        <p style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)", maxWidth: 500, margin: "0 auto" }}>
          Все страницы ProektMap — от AI-инструментов до правовой информации
        </p>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "var(--space-xl) var(--space-m)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "var(--space-l)" }}>
          {sections.map(section => (
            <div key={section.title} style={{
              background: "var(--color-bg-primary)", border: "1px solid var(--color-border)",
              borderTop: "3px solid " + section.color, borderRadius: 0, padding: "var(--space-l)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "var(--space-m)" }}>
                <section.icon size={16} style={{ color: section.color }} />
                <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-s)", fontWeight: 700, margin: 0 }}>{section.title}</h2>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {section.links.map(link => (
                  <Link key={link.href} href={link.href}
                    style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "8px 10px", textDecoration: "none", color: "inherit",
                      background: "var(--color-bg-secondary)", borderRadius: 0,
                    }}>
                    <div>
                      <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-text-primary)" }}>{link.label}</div>
                      {link.desc && <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginTop: 2 }}>{link.desc}</div>}
                    </div>
                    <span style={{ color: "var(--color-text-tertiary)", fontSize: 12 }}>→</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "var(--space-xl)", fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>
          <Link href="/" style={{ color: "var(--color-accent)", textDecoration: "none" }}>← На главную</Link>
        </div>
      </div>
    </div>
  );
}
