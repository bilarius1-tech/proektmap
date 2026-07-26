import Link from "next/link";
import { Check, ArrowRight, Crown, Globe, Zap, Package, Shield, Star, Clock, DollarSign, Server, Smartphone } from "lucide-react";

export const metadata = {
  title: "Премиум Blueprint'ы — готовая архитектура проекта",
  description: "Купи готовый Blueprint: Telegram Mini App, AI-консультант, Маркетплейс, SaaS. Архитектура, сущности, промпты — всё для старта за 1 час.",
  openGraph: { title: "Премиум Blueprint'ы от 990 ₽ — готовая архитектура за 1 час", description: "Telegram Mini App, AI-консультант, Маркетплейс, SaaS. Сущности БД + промпты + стек + план." },
};

const PREMIUM = [
  {
    slug: "telegram-mini-app",
    title: "Telegram Mini App",
    price: "990 ₽",
    icon: Smartphone,
    color: "#3b82f6",
    tag: "Хит",
    desc: "Веб-приложение внутри Telegram. Каталог товаров, корзина, оплата через Telegram Stars.",
    includes: ["12 этапов от идеи до публикации", "Сущности БД: User, Product, Order, Cart", "Стек: React + Prisma + Telegram SDK", "6 готовых промптов для Cursor/Claude", "Типичные ошибки новичков", "План публикации в Telegram Store"],
  },
  {
    slug: "ai-consultant",
    title: "AI-консультант на сайт",
    price: "1 990 ₽",
    icon: Globe,
    color: "var(--color-accent)",
    tag: "Новинка",
    desc: "Виджет AI-консультанта: отвечает про услуги, собирает заявки, отправляет в Telegram. SaaS с подпиской.",
    includes: ["15 этапов: от краулера до биллинга", "Сущности: Site, ChatSession, Message, Client", "RAG-поиск по сайту + векторная БД", "8 промптов + системный промпт агента", "Telegram CRM: отвечай клиентам из Telegram", "Монетизация: подписка + лимиты"],
  },
  {
    slug: "saas-subscription",
    title: "SaaS с подпиской",
    price: "2 990 ₽",
    icon: Server,
    color: "#8b5cf6",
    desc: "Полноценный SaaS-продукт: регистрация, биллинг, дашборд, API-ключи, вебхуки.",
    includes: ["20 этапов полного цикла", "Сущности: User, Workspace, Subscription, Usage", "Stripe/ЮKassa + Webhook", "API-ключи + Rate Limiting", "Дашборд с аналитикой", "CI/CD + Docker + Мониторинг"],
  },
  {
    slug: "marketplace",
    title: "Маркетплейс услуг",
    price: "2 990 ₽",
    icon: Package,
    color: "#f59e0b",
    desc: "Платформа где исполнители создают анкеты, а заказчики находят их по фильтрам.",
    includes: ["18 этапов: от модели БД до деплоя", "Сущности: Profile, Service, Order, Review, Chat", "Поиск + фильтры + категории", "Система рейтинга и отзывов", "Админ-панель модератора", "Масштабирование: очереди + кэш"],
  },
];

const FREE_FEATURES = [
  "Blueprint Корпоративный сайт (40 решений)",
  "Blueprint SaaS-продукт (21 решение)",
  "Blueprint Разработка игры (19 решений)",
  "AI-Архитектор (3 анализа/мес)",
  "Глоссарий (113 терминов)",
  "Библиотека промптов",
  "MCP-каталог (50+ серверов)",
];

const PREMIUM_FEATURES = [
  "Все бесплатные Blueprint'ы",
  "4 премиум Blueprint'а с полной архитектурой",
  "Готовые промпты для каждого этапа",
  "Сущности БД с типами полей",
  "AI-Архитектор безлимитно",
  "Skill Passport — профиль навыков",
  "PDF-экспорт архитектуры",
  "Приоритетная поддержка в Telegram",
];

export default function PremiumBlueprintsPage() {
  return (
    <div style={{ background: "var(--color-bg-secondary)", minHeight: "100vh", fontFamily: "var(--font-body)", color: "var(--color-text-primary)" }}>
      {/* Hero */}
      <div style={{ background: "var(--color-bg-primary)", borderBottom: "1px solid var(--color-border)", padding: "80px 20px 60px", textAlign: "center" }}>
        <div style={{ maxWidth: 650, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 16px", background: "var(--color-accent-light)", color: "var(--color-accent)", fontSize: "var(--text-xs)", fontWeight: 700, marginBottom: "var(--space-m)", borderRadius: 0 }}>
            <Star size={14} /> Премиум Blueprint'ы
          </div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 900, lineHeight: 1.05, marginBottom: "var(--space-m)", letterSpacing: "-0.02em" }}>
            Не трать неделю на <span style={{ color: "var(--color-accent)" }}>архитектуру</span>
          </h1>
          <p style={{ fontSize: "var(--text-l)", color: "var(--color-text-secondary)", lineHeight: 1.7, marginBottom: "var(--space-xl)" }}>
            Готовая карта проекта: сущности БД, стек, промпты для AI-агента, план разработки. Открой Blueprint → скопируй промпт → получи работающий код через 1 час.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#pricing" style={{ padding: "14px 32px", background: "var(--color-accent)", color: "#fff", textDecoration: "none", fontSize: "var(--text-s)", fontWeight: 700, fontFamily: "var(--font-heading)", borderRadius: 0, display: "flex", alignItems: "center", gap: 8 }}>
              Смотреть Blueprint'ы <ArrowRight size={16} />
            </a>
            <Link href="/corporate-website" style={{ padding: "14px 32px", background: "var(--color-bg-primary)", border: "1px solid var(--color-accent)", color: "var(--color-accent)", textDecoration: "none", fontSize: "var(--text-s)", fontWeight: 700, fontFamily: "var(--font-heading)", borderRadius: 0 }}>
              Попробовать бесплатно
            </Link>
          </div>
        </div>
      </div>

      {/* Premium Cards */}
      <div id="pricing" style={{ maxWidth: 1100, margin: "0 auto", padding: "var(--space-xl) var(--space-m)" }}>
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 700, textAlign: "center", marginBottom: "var(--space-xl)", letterSpacing: "-0.01em" }}>
          Премиум Blueprint'ы
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "var(--space-l)", marginBottom: "var(--space-xl)" }}>
          {PREMIUM.map(bp => (
            <div key={bp.slug} style={{
              background: "var(--color-bg-primary)", border: "2px solid var(--color-border)",
              borderTop: "4px solid " + bp.color, borderRadius: 0, padding: "var(--space-xl)",
              display: "flex", flexDirection: "column", position: "relative",
            }}>
              {bp.tag && (
                <div style={{ position: "absolute", top: -12, right: 16, padding: "3px 12px", background: bp.color, color: "#fff", fontSize: 10, fontWeight: 700, fontFamily: "var(--font-heading)", borderRadius: 0 }}>
                  {bp.tag}
                </div>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "var(--space-s)" }}>
                <div style={{ width: 40, height: 40, background: bp.color + "15", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <bp.icon size={20} style={{ color: bp.color }} />
                </div>
                <div>
                  <div style={{ fontSize: "var(--text-s)", fontWeight: 800, fontFamily: "var(--font-heading)" }}>{bp.title}</div>
                  <div style={{ fontSize: 20, fontWeight: 900, fontFamily: "var(--font-heading)", color: bp.color }}>{bp.price}</div>
                </div>
              </div>
              <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: "var(--space-m)" }}>{bp.desc}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: "var(--space-l)", flex: 1 }}>
                {bp.includes.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
                    <Check size={14} style={{ color: bp.color, flexShrink: 0, marginTop: 2 }} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <Link href={`/corporate-website`} style={{
                textAlign: "center", padding: "12px", background: bp.color, color: "#fff",
                textDecoration: "none", fontWeight: 700, fontFamily: "var(--font-heading)", fontSize: "var(--text-xs)", borderRadius: 0,
              }}>
                Купить {bp.price}
              </Link>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div style={{ marginBottom: "var(--space-xl)" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 700, textAlign: "center", marginBottom: "var(--space-l)" }}>
            Бесплатно vs Премиум
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-l)", maxWidth: 700, margin: "0 auto" }}>
            <div style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", padding: "var(--space-l)", borderRadius: 0 }}>
              <div style={{ fontSize: "var(--text-s)", fontWeight: 800, fontFamily: "var(--font-heading)", marginBottom: "var(--space-m)", textAlign: "center" }}>Бесплатно</div>
              {FREE_FEATURES.map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
                  <Check size={14} style={{ color: "var(--color-text-tertiary)", flexShrink: 0 }} /> {f}
                </div>
              ))}
            </div>
            <div style={{ background: "var(--color-accent-light)", border: "2px solid var(--color-accent)", padding: "var(--space-l)", borderRadius: 0, position: "relative" }}>
              <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", padding: "4px 16px", background: "var(--color-accent)", color: "#fff", fontSize: 10, fontWeight: 700, fontFamily: "var(--font-heading)", borderRadius: 0 }}>Pro 300 ₽/мес</div>
              <div style={{ fontSize: "var(--text-s)", fontWeight: 800, fontFamily: "var(--font-heading)", marginBottom: "var(--space-m)", marginTop: 8, textAlign: "center" }}>Pro</div>
              {PREMIUM_FEATURES.map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", fontSize: "var(--text-xs)", color: "var(--color-text-primary)" }}>
                  <Check size={14} style={{ color: "var(--color-accent)", flexShrink: 0 }} /> {f}
                </div>
              ))}
              <Link href="/pricing" style={{ display: "block", textAlign: "center", padding: "12px", background: "var(--color-accent)", color: "#fff", textDecoration: "none", fontWeight: 700, fontFamily: "var(--font-heading)", fontSize: "var(--text-xs)", borderRadius: 0, marginTop: "var(--space-m)" }}>
                Подключить Pro
              </Link>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div style={{ marginBottom: "var(--space-xl)" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 700, textAlign: "center", marginBottom: "var(--space-l)" }}>
            Как это работает
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "var(--space-m)", maxWidth: 700, margin: "0 auto" }}>
            {[
              { step: "1", title: "Выбери Blueprint", desc: "Telegram Mini App, AI-консультант или SaaS", icon: Package },
              { step: "2", title: "Изучи архитектуру", desc: "Сущности БД, стек, промпты, план", icon: Globe },
              { step: "3", title: "Скопируй промпт", desc: "Вставь в Cursor/Claude — агент пишет код", icon: Zap },
              { step: "4", title: "Запусти проект", desc: "Следуй плану, получай результат", icon: Star },
            ].map(item => (
              <div key={item.step} style={{ textAlign: "center", padding: "var(--space-m)" }}>
                <div style={{ width: 40, height: 40, background: "var(--color-accent)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16, fontFamily: "var(--font-heading)", margin: "0 auto var(--space-s)" }}>{item.step}</div>
                <div style={{ fontWeight: 700, fontSize: "var(--text-xs)", marginBottom: 4 }}>{item.title}</div>
                <div style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div style={{ maxWidth: 600, margin: "0 auto", marginBottom: "var(--space-xl)" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 700, textAlign: "center", marginBottom: "var(--space-l)" }}>Вопросы</h2>
          {[
            { q: "Чем премиум Blueprint отличается от бесплатного?", a: "Бесплатный даёт общую структуру (40 решений). Премиум включает: сущности БД с типами полей, готовые промпты для каждого этапа, рекомендации по стеку, типичные ошибки и план внедрения." },
            { q: "Я новичок. Подойдёт ли мне?", a: "Да. Каждый Blueprint начинается с этапа «Инструменты» — ты узнаешь какие программы нужны и как их настроить. Если застрял — AI-Архитектор подскажет." },
            { q: "Можно ли использовать с Claude Code / Cursor?", a: "Да. Все промпты написаны для AI-агентов. Скопировал → вставил → агент пишет код." },
          ].map((item, i) => (
            <details key={i} style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", borderRadius: 0, marginBottom: "var(--space-s)" }}>
              <summary style={{ padding: "var(--space-m)", fontSize: "var(--text-xs)", fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-heading)" }}>{item.q}</summary>
              <div style={{ padding: "0 var(--space-m) var(--space-m)", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.8 }}>{item.a}</div>
            </details>
          ))}
        </div>

        <div style={{ textAlign: "center" }}>
          <a href="#pricing" style={{ padding: "16px 36px", background: "var(--color-accent)", color: "#fff", textDecoration: "none", fontSize: "var(--text-s)", fontWeight: 700, fontFamily: "var(--font-heading)", borderRadius: 0, display: "inline-flex", alignItems: "center", gap: 8 }}>
            <Crown size={16} /> Выбрать Blueprint
          </a>
        </div>
      </div>
    </div>
  );
}
