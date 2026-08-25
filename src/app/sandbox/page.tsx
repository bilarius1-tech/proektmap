import { getDb } from "@/lib/db/index";
import Link from "next/link";
import { CREATIVE_TOOLS } from "@/lib/creative-library/data";
import { Bot, Globe, Shield, Zap, Cpu, Wrench, Lightbulb, BookOpen, Compass, Sparkles, ArrowRight, Eye, FileText, Layers, Grid3X3, Clock, Palette, Library, LayoutTemplate } from "lucide-react";
import { VIBE_KITS } from "@/lib/vibe-blocks/data";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Песочница — исследуй возможности AI-разработки",
  description: "Песочница ProektMap: Telegram Боты, AI без VPN, Vibe Coding, Российский AI-стек. Исследуй, учись, выбирай свой Blueprint.",
  openGraph: {
    title: "Песочница ProektMap — исследуй AI-разработку",
    description: "Hub Pages с гайдами, инструментами и решениями для AI-разработки в России.",
    images: [{ url: "https://proektmap.ru/api/og?title=Песочница&category=ProektMap&author=Исследуй+возможности", width: 1200, height: 630 }],
  },
};

export default async function SandboxPage() {
  const db = await getDb();
  const [blueprintCount, toolCount, solutionCount, postCount] = await Promise.all([
    db.blueprint.count({ where: { isPublished: true } }),
    db.aITool.count({ where: { isActive: true } }),
    db.solution.count({ where: { isPublished: true } }),
    db.blogPost.count({ where: { status: "published" } }),
  ]);

  // Dynamic: latest content for the "New" section
  const latestBlueprints = await db.blueprint.findMany({ where: { isPublished: true }, orderBy: { createdAt: "desc" }, take: 4, select: { title: true, slug: true, difficulty: true } });
  const latestTools = await db.aITool.findMany({ where: { isActive: true }, orderBy: { createdAt: "desc" }, take: 4, select: { name: true, slug: true, type: true } });
  const latestPatterns = await db.buildPattern.findMany({ where: { isPublished: true }, orderBy: { createdAt: "desc" }, take: 4, select: { title: true, slug: true, difficulty: true } });

  const telegramDecisions = await db.decision.count({ where: { slug: { contains: "tg-" } } });
  const telegramTools = await db.aITool.count({ where: { bestFor: { contains: "telegram" } } });
  const vibeTools = await db.aITool.count({ where: { isActive: true, OR: [{ name: { contains: "Cursor" } }, { name: { contains: "Windsurf" } }, { name: { contains: "Cline" } }, { name: { contains: "Bolt" } }, { name: { contains: "Lovable" } }, { name: { contains: "Aider" } }] } });
  const vpnTools = await db.aITool.count({ where: { isActive: true, OR: [{ name: { contains: "YandexGPT" } }, { name: { contains: "GigaChat" } }, { name: { contains: "Cline" } }] } });
  const aiModels = await db.aITool.count({ where: { isActive: true, OR: [{ name: { contains: "YandexGPT" } }, { name: { contains: "GigaChat" } }, { name: { contains: "DeepSeek" } }, { name: { contains: "Kandinsky" } }] } });

  const russianAiCount = await db.russianAIProject.count({ where: { isPublished: true } });

  const cards = [
    { slug: "telegram", title: "Telegram Бот MAX", desc: "Всё для создания ботов: Blueprint, фреймворки, глоссарий, готовые решения. От идеи до работающего бота с платежами и AI.", icon: Bot, size: "large" as const, stat: String(telegramDecisions + telegramTools), statLabel: "решений и инструментов", href: "/telegram" },
    { slug: "vibecraft", title: "Vibe Coding", desc: "Создавай сайты без кода: Cursor, Bolt.new, Lovable, Cline. Гайд для России: оплата, хостинг, домен, почта.", icon: Zap, size: "medium" as const, stat: String(vibeTools), statLabel: "инструментов в обзоре", href: "/vibecraft" },
    { slug: "vaibik", title: "Вайбик: Миссия №1", desc: "Детский квест по вайбкодингу (9–12 лет): промпты, первая игра, робот Вайбик. Связка со статьёй «ИИ для детей».", icon: Sparkles, size: "medium" as const, href: "/vaibik" },
    { slug: "ai-without-vpn", title: "AI без VPN", desc: "Как работать с нейросетями из России: замена западных сервисов, оплата в рублях, хостинг РФ.", icon: Shield, size: "medium" as const, stat: String(vpnTools), statLabel: "российских AI-сервисов", href: "/ai-without-vpn" },
    { slug: "russian-ai", title: "Российский AI", desc: `Каталог из ${russianAiCount} российских AI-проектов: YandexGPT, GigaChat, Kandinsky, SpeechKit. Карта рынка с фильтрами и категориями.`, icon: Cpu, size: "small" as const, stat: String(russianAiCount), statLabel: "проектов в каталоге", href: "/russian-ai" },
    { slug: "blueprints", title: "Все Blueprint'ы", desc: "Готовые дорожные карты: сайт компании, SaaS, Telegram бот, игра. Выбери свой путь.", icon: Compass, size: "small" as const, stat: String(blueprintCount), statLabel: "Blueprint'ов", href: "/blueprints" },
    { slug: "ai-tools", title: "AI-инструменты", desc: `Каталог из ${toolCount} инструментов с русскими обзорами, рейтингами и гайдами.`, icon: Wrench, size: "small" as const, stat: String(toolCount), statLabel: "инструментов", href: "/ai-tools" },
    { slug: "solutions", title: "Готовые решения", desc: "Клонируй и запускай: бот-магазин, AI-консультант, приём заказов. Код на GitHub.", icon: Layers, size: "small" as const, stat: String(solutionCount), statLabel: "решений", href: "/solutions" },
    { slug: "creative-library", title: "Креативная библиотека", desc: "Tier 1–3: от Vanta и AutoAnimate до GSAP, Three.js, MediaPipe. Карточка + промпт для агента + FPS Killers.", icon: Library, size: "large" as const, stat: String(CREATIVE_TOOLS.length), statLabel: "инструментов", href: "/sandbox/creative-library" },
    { slug: "vibe-blocks", title: "Вайб-блоки", desc: "UI-киты как OriginKit и 21st.dev: готовые блоки, Copy prompt, MCP. Сценарии для лендинга, анимаций и AI-чата.", icon: LayoutTemplate, size: "large" as const, stat: String(VIBE_KITS.length), statLabel: "китов", href: "/sandbox/vibe-blocks" },
    { slug: "design-system", title: "Дизайн-система", desc: "Полный гайд: токены, компоненты, Atomic Design, Figma, Storybook. Почему AI-инженеру нужна дизайн-система и как её построить.", icon: Palette, size: "medium" as const, href: "/sandbox/design-system" },
    { slug: "blog", title: "Блог", desc: `Статьи об AI-разработке, новости индустрии, гайды и туториалы. ${postCount} статей, RSS, поиск.`, icon: FileText, size: "small" as const, stat: String(postCount), statLabel: "статей", href: "/blog" },
  ];

  return (
    <div style={{ fontFamily: "var(--font-body)", background: "var(--color-bg-primary)", color: "var(--color-text-primary)", minHeight: "100vh" }}>

      {/* HERO */}
      <div style={{ padding: "var(--space-xxl) var(--space-m) var(--space-xl)", textAlign: "center", borderBottom: "1px solid var(--color-border)" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-xs)", padding: "4px 14px", borderRadius: 0, background: "var(--color-bg-tertiary)", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: "var(--space-m)", color: "var(--color-text-secondary)" }}>
            <Grid3X3 size={14} /> Песочница
          </div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(36px, 7vw, 56px)", fontWeight: 900, lineHeight: 1.0, margin: "0 0 var(--space-m)", letterSpacing: "-0.03em" }}>
            Исследуй.<br />Пробуй.<br />Строй.
          </h1>
          <p style={{ fontSize: "var(--text-m)", color: "var(--color-text-secondary)", lineHeight: 1.7, margin: 0 }}>
            Песочница — место где ты узнаёшь что вообще можно сделать с AI, как это работает в России, и выбираешь свой путь.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1040, margin: "0 auto", padding: "0 var(--space-m) var(--space-xl)" }}>

        {/* PHILOSOPHY */}
        <section style={{ margin: "var(--space-xl) 0" }}>
          <div style={{
            background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)",
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          }}>
            <div style={{ padding: "var(--space-xxl) var(--space-xl)", borderRight: "1px solid var(--color-border)" }}>
              <div style={{ width: 48, height: 48, background: "var(--color-bg-tertiary)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "var(--space-m)", borderRadius: 0 }}>
                <Lightbulb size={24} style={{ color: "var(--color-accent)" }} />
              </div>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-l)", fontWeight: 800, margin: "0 0 var(--space-s)", letterSpacing: "-0.01em" }}>
                Философия Песочницы
              </h2>
              <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.8 }}>
                Песочница — это <strong>не каталог и не справочник</strong>. Это место для исследования. Ты приходишь с вопросом из Google или Telegram-чата, а уходишь с пониманием и готовым маршрутом.
              </p>
            </div>
            <div style={{ padding: "var(--space-xxl) var(--space-xl)", display: "flex", flexDirection: "column", gap: "var(--space-l)", justifyContent: "center" }}>
              <PhilItem emoji="🔍" title="Исследуй" desc="Узнай что возможно: какие инструменты работают в России, что можно построить за день, сколько это стоит." />
              <PhilItem emoji="🧪" title="Пробуй" desc="Каждая Hub Page — это не просто текст. Это квизы, калькуляторы, сравнения, примеры кода." />
              <PhilItem emoji="🚀" title="Строй" desc="Выбрал направление? Переходи к Blueprint'у — пошаговой дорожной карте с AI-архитектором." />
            </div>
          </div>
        </section>

        {/* BENTO GRID */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gridAutoRows: "minmax(180px, auto)",
          gap: 0,
          background: "var(--color-border)",
          border: "1px solid var(--color-border)",
        }} className="bento-grid">
          {cards.map((card) => {
            const Icon = card.icon;
            const isLarge = card.size === "large";
            const isMedium = card.size === "medium";
            const colSpan = isLarge ? 2 : 1;
            const rowSpan = isLarge ? 2 : isMedium ? 2 : 1;

            return (
              <Link
                key={card.slug}
                href={card.href}
                style={{
                  gridColumn: `span ${colSpan}`,
                  gridRow: `span ${rowSpan}`,
                  textDecoration: "none", color: "inherit",
                  background: "var(--color-bg-secondary)",
                  transition: "background 0.15s",
                  display: "flex", flexDirection: "column", justifyContent: "space-between",
                  outline: "1px solid var(--color-border)",
                  outlineOffset: -1,
                }}
                className="bento-card"
              >
                <div style={{ padding: isLarge ? "var(--space-xxl) var(--space-xl)" : "var(--space-xl)", flex: 1, display: "flex", flexDirection: "column" }}>
                  {/* Icon */}
                  <div style={{
                    width: isLarge ? 48 : 40, height: isLarge ? 48 : 40,
                    background: "var(--color-bg-tertiary)", display: "flex",
                    alignItems: "center", justifyContent: "center", marginBottom: "var(--space-m)", borderRadius: 0,
                  }}>
                    <Icon size={isLarge ? 24 : 20} style={{ color: "var(--color-accent)" }} />
                  </div>

                  {/* Title */}
                  <h3 style={{
                    fontFamily: "var(--font-heading)", fontSize: isLarge ? "var(--text-xl)" : "var(--text-m)",
                    fontWeight: 800, margin: "0 0 var(--space-s)", letterSpacing: "-0.01em",
                  }}>
                    {card.title}
                  </h3>

                  {/* Description */}
                  <p style={{
                    fontSize: isLarge ? "var(--text-s)" : "var(--text-xs)",
                    color: "var(--color-text-secondary)", lineHeight: 1.7, margin: 0, flex: 1,
                  }}>
                    {card.desc}
                  </p>

                  {/* Stat + arrow */}
                  <div style={{
                    display: "flex", alignItems: "center", gap: "var(--space-s)",
                    marginTop: "var(--space-m)", paddingTop: "var(--space-m)",
                    borderTop: "1px solid var(--color-border)",
                  }}>
                    <div style={{ fontSize: isLarge ? "var(--text-xl)" : "var(--text-l)", fontWeight: 900, fontFamily: "var(--font-heading)", color: "var(--color-accent)" }}>
                      {card.stat}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>
                      {card.statLabel}
                    </div>
                    <ArrowRight size={16} style={{ marginLeft: "auto", color: "var(--color-text-secondary)", flexShrink: 0 }} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* MOBILE fallback */}
        <style>{`
          @media (max-width: 768px) {
            .bento-grid { grid-template-columns: 1fr !important; }
            .bento-grid > * { grid-column: span 1 !important; grid-row: span 1 !important; }
          }
          .bento-card:hover { background: var(--color-bg-tertiary); }
        `}</style>

        {/* CTA */}
        <section style={{ marginTop: "var(--space-xl)", textAlign: "center", padding: "var(--space-xxl) var(--space-m)", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)" }}>
          <Sparkles size={40} style={{ color: "var(--color-accent)", marginBottom: "var(--space-m)" }} />
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 700, marginBottom: "var(--space-s)" }}>
            Не знаешь с чего начать?
          </h2>
          <p style={{ fontSize: "var(--text-m)", color: "var(--color-text-secondary)", maxWidth: 460, margin: "0 auto var(--space-l)", lineHeight: 1.6 }}>
            Пройди квиз из 5 вопросов — получи персональную рекомендацию Blueprint'а.
          </p>
          <Link href="/#quiz-section" style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-xs)", padding: "14px 32px", background: "var(--color-accent)", color: "#fff", textDecoration: "none", fontSize: "var(--text-s)", fontWeight: 700, borderRadius: 0 }}>
            Пройти квиз <ArrowRight size={16} />
          </Link>
        </section>

        {/* LATEST CONTENT — динамическая секция */}
        <section style={{ marginTop: "var(--space-xl)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-s)", marginBottom: "var(--space-l)" }}>
            <Clock size={20} style={{ color: "var(--color-accent)" }} />
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 700, margin: 0 }}>Новое на платформе</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-m)" }}>
            <div style={{ background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", padding: "var(--space-l)" }}>
              <h3 style={{ fontSize: "var(--text-s)", fontWeight: 700, marginBottom: "var(--space-m)", color: "var(--color-accent)" }}>Blueprint'ы</h3>
              {latestBlueprints.map((bp: any) => (
                <Link key={bp.slug} href={`/blueprints/${bp.slug}`} style={{ display: "block", padding: "8px 0", fontSize: "var(--text-s)", color: "var(--color-text-primary)", textDecoration: "none", borderBottom: "1px solid var(--color-border-light)" }}>
                  {bp.title}
                  <span style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginLeft: 8 }}>{bp.difficulty === "easy" ? "🟢" : bp.difficulty === "hard" ? "🔴" : "🟡"}</span>
                </Link>
              ))}
              <Link href="/blueprints" style={{ display: "block", marginTop: "var(--space-s)", fontSize: "var(--text-xs)", color: "var(--color-accent)", textDecoration: "none" }}>Все Blueprint'ы →</Link>
            </div>
            <div style={{ background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", padding: "var(--space-l)" }}>
              <h3 style={{ fontSize: "var(--text-s)", fontWeight: 700, marginBottom: "var(--space-m)", color: "var(--color-accent)" }}>Инструменты</h3>
              {latestTools.map((t: any) => (
                <Link key={t.slug} href={`/ai-tools/${t.slug}`} style={{ display: "block", padding: "8px 0", fontSize: "var(--text-s)", color: "var(--color-text-primary)", textDecoration: "none", borderBottom: "1px solid var(--color-border-light)" }}>
                  {t.name}
                  <span style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginLeft: 8 }}>{t.type}</span>
                </Link>
              ))}
              <Link href="/ai-tools" style={{ display: "block", marginTop: "var(--space-s)", fontSize: "var(--text-xs)", color: "var(--color-accent)", textDecoration: "none" }}>Все инструменты →</Link>
            </div>
            <div style={{ background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", padding: "var(--space-l)" }}>
              <h3 style={{ fontSize: "var(--text-s)", fontWeight: 700, marginBottom: "var(--space-m)", color: "var(--color-accent)" }}>Паттерны</h3>
              {latestPatterns.map((p: any) => (
                <Link key={p.slug} href={`/patterns/${p.slug}`} style={{ display: "block", padding: "8px 0", fontSize: "var(--text-s)", color: "var(--color-text-primary)", textDecoration: "none", borderBottom: "1px solid var(--color-border-light)" }}>
                  {p.title}
                  <span style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginLeft: 8 }}>{p.difficulty === "easy" ? "🟢" : p.difficulty === "hard" ? "🔴" : "🟡"}</span>
                </Link>
              ))}
              <Link href="/patterns" style={{ display: "block", marginTop: "var(--space-s)", fontSize: "var(--text-xs)", color: "var(--color-accent)", textDecoration: "none" }}>Все паттерны →</Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

function PhilItem({ emoji, title, desc }: { emoji: string; title: string; desc: string }) {
  return (
    <div style={{ display: "flex", gap: "var(--space-m)" }}>
      <div style={{ fontSize: 24, flexShrink: 0, lineHeight: 1 }}>{emoji}</div>
      <div>
        <div style={{ fontSize: "var(--text-s)", fontWeight: 700, marginBottom: 2 }}>{title}</div>
        <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{desc}</div>
      </div>
    </div>
  );
}
