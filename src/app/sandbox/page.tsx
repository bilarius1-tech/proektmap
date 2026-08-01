import { getDb } from "@/lib/db/index";
import Link from "next/link";
import { Bot, Globe, Shield, Zap, Cpu, Wrench, Lightbulb, BookOpen, Compass, Sparkles, ArrowRight, Eye, FileText, Layers, Grid3X3 } from "lucide-react";

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

interface SandboxCard {
  slug: string;
  title: string;
  desc: string;
  icon: any;
  color: string;
  bg: string;
  size: "large" | "medium" | "small";
  stat: string;
  statLabel: string;
  href: string;
}

export default async function SandboxPage() {
  const db = await getDb();
  const [blueprintCount, toolCount, solutionCount, postCount, glossaryCount] = await Promise.all([
    db.blueprint.count({ where: { isPublished: true } }),
    db.aITool.count({ where: { isActive: true } }),
    db.solution.count({ where: { isPublished: true } }),
    db.blogPost.count({ where: { status: "published" } }),
    db.glossaryTerm.count({ where: { isPublished: true } }),
  ]);

  // Stats for each hub page
  const telegramStats = await Promise.all([
    db.decision.count({ where: { slug: { contains: "tg-" } } }),
    db.aITool.count({ where: { bestFor: { contains: "telegram" } } }),
  ]);

  const vpnTools = await db.aITool.count({ where: { isActive: true, OR: [{ name: { contains: "YandexGPT" } }, { name: { contains: "GigaChat" } }, { name: { contains: "Cline" } }] } });

  const vibeTools = await db.aITool.count({ where: { isActive: true, OR: [{ name: { contains: "Cursor" } }, { name: { contains: "Windsurf" } }, { name: { contains: "Cline" } }, { name: { contains: "Bolt" } }, { name: { contains: "Lovable" } }, { name: { contains: "Aider" } }] } });

  const aiModels = await db.aITool.count({ where: { isActive: true, OR: [{ name: { contains: "YandexGPT" } }, { name: { contains: "GigaChat" } }, { name: { contains: "DeepSeek" } }, { name: { contains: "Kandinsky" } }] } });

  const cards: SandboxCard[] = [
    {
      slug: "telegram", title: "Telegram Бот MAX", desc: "Всё для создания ботов: Blueprint, фреймворки, глоссарий, готовые решения. От идеи до работающего бота с платежами и AI.",
      icon: Bot, color: "#0af", bg: "linear-gradient(135deg, #1a1a2e, #16213e)", size: "large",
      stat: String(telegramStats[0] + telegramStats[1]), statLabel: "решений и инструментов",
      href: "/telegram",
    },
    {
      slug: "vibecraft", title: "Vibe Coding", desc: "Создавай сайты без кода: Cursor, Bolt.new, Lovable, Cline. Гайд для России: оплата, хостинг, домен, почта.",
      icon: Zap, color: "#a855f7", bg: "linear-gradient(135deg, #1a0a2e, #2d1b4e)", size: "medium",
      stat: String(vibeTools), statLabel: "инструментов в обзоре",
      href: "/vibecraft",
    },
    {
      slug: "ai-without-vpn", title: "AI без VPN", desc: "Как работать с нейросетями из России: замена западных сервисов, оплата в рублях, хостинг РФ.",
      icon: Shield, color: "#f97316", bg: "linear-gradient(135deg, #0d1b2a, #1b2838)", size: "medium",
      stat: String(vpnTools), statLabel: "российских AI-сервисов",
      href: "/ai-without-vpn",
    },
    {
      slug: "russian-ai-stack", title: "Российский AI-стек", desc: "YandexGPT, GigaChat, Kandinsky, Шедеврум — обзор, цены, API, примеры кода.",
      icon: Cpu, color: "#3b82f6", bg: "linear-gradient(135deg, #0c1929, #162844)", size: "small",
      stat: String(aiModels), statLabel: "моделей в сравнении",
      href: "/russian-ai-stack",
    },
    {
      slug: "blueprints", title: "Все Blueprint'ы", desc: "Готовые дорожные карты: сайт компании, SaaS, Telegram бот, игра. Выбери свой путь.",
      icon: Compass, color: "var(--color-accent)", bg: "var(--color-bg-secondary)", size: "small",
      stat: String(blueprintCount), statLabel: "Blueprint'ов",
      href: "/blueprints",
    },
    {
      slug: "ai-tools", title: "AI-инструменты", desc: "Каталог из " + toolCount + " инструментов с русскими обзорами, рейтингами и гайдами.",
      icon: Wrench, color: "var(--color-accent)", bg: "var(--color-bg-secondary)", size: "small",
      stat: String(toolCount), statLabel: "инструментов",
      href: "/ai-tools",
    },
    {
      slug: "solutions", title: "Готовые решения", desc: "Клонируй и запускай: бот-магазин, AI-консультант, приём заказов. Код на GitHub.",
      icon: Layers, color: "var(--color-accent)", bg: "var(--color-bg-secondary)", size: "small",
      stat: String(solutionCount), statLabel: "решений",
      href: "/solutions",
    },
    {
      slug: "blog", title: "Блог", desc: "Статьи об AI-разработке, новости индустрии, гайды и туториалы. RSS, поиск, подписка.",
      icon: FileText, color: "var(--color-accent)", bg: "var(--color-bg-secondary)", size: "small",
      stat: String(postCount), statLabel: "статей",
      href: "/blog",
    },
  ];

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "var(--color-bg-primary)", color: "var(--color-text-primary)", minHeight: "100vh" }}>

      {/* HERO */}
      <div style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 30%, #0f3460 70%, #1a1a2e 100%)",
        padding: "80px 20px 70px", textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0 }}>
          <div style={{ position: "absolute", top: "10%", left: "15%", width: 300, height: 300, borderRadius: "50%", background: "rgba(59,130,246,0.08)", filter: "blur(80px)" }} />
          <div style={{ position: "absolute", bottom: "20%", right: "10%", width: 250, height: 250, borderRadius: "50%", background: "rgba(168,85,247,0.08)", filter: "blur(80px)" }} />
          <div style={{ position: "absolute", top: "50%", left: "50%", width: 200, height: 200, borderRadius: "50%", background: "rgba(249,115,22,0.06)", filter: "blur(60px)", transform: "translate(-50%, -50%)" }} />
        </div>
        <div style={{ position: "relative", maxWidth: 700, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 18px", borderRadius: "var(--radius-full)", background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)", fontSize: "var(--text-xs)", fontWeight: 700, marginBottom: "var(--space-m)" }}>
            <Grid3X3 size={14} /> Песочница
          </div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(36px, 7vw, 56px)", fontWeight: 900, lineHeight: 1.0, marginBottom: "var(--space-m)", letterSpacing: "-0.03em", color: "#fff" }}>
            Исследуй.<br />Пробуй.<br />Строй.
          </h1>
          <p style={{ fontSize: "var(--text-l)", color: "rgba(255,255,255,0.6)", maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>
            Песочница — место где ты узнаёшь что вообще можно сделать с AI, как это работает в России, и выбираешь свой путь.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1040, margin: "0 auto", padding: "var(--space-xl) var(--space-m)" }}>

        {/* PHILOSOPHY */}
        <section style={{ marginBottom: "var(--space-xxl)" }}>
          <div style={{
            background: "var(--color-bg-secondary)", borderRadius: "var(--radius-xl)",
            border: "1px solid var(--color-border)", padding: "var(--space-xxl) var(--space-xl)",
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "var(--space-xl)",
          }}>
            <div>
              <div style={{ width: 48, height: 48, borderRadius: "var(--radius-m)", background: "var(--color-accent-light)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "var(--space-m)" }}>
                <Lightbulb size={24} style={{ color: "var(--color-accent)" }} />
              </div>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-l)", fontWeight: 800, margin: "0 0 var(--space-s)", letterSpacing: "-0.01em" }}>
                Философия Песочницы
              </h2>
              <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.8 }}>
                Песочница — это <strong>не каталог и не справочник</strong>. Это место для исследования.
                Ты приходишь с вопросом из Google или Telegram-чата, а уходишь с пониманием и готовым маршрутом.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-m)" }}>
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
          gap: "var(--space-m)",
        }} className="bento-grid">
          {cards.map((card, i) => {
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
                  textDecoration: "none", color: "#fff",
                  borderRadius: "var(--radius-xl)", overflow: "hidden",
                  position: "relative",
                  background: card.bg,
                  border: card.bg.includes("var(") ? "1px solid var(--color-border)" : "none",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  display: "flex", flexDirection: "column", justifyContent: "space-between",
                }}
                className="bento-card"
              >
                {/* Gradient overlay for dark cards */}
                {!card.bg.includes("var(") && (
                  <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.05), transparent 60%)" }} />
                )}

                <div style={{ position: "relative", padding: isLarge ? "var(--space-xxl) var(--space-xl)" : "var(--space-xl)", flex: 1, display: "flex", flexDirection: "column" }}>
                  {/* Icon */}
                  <div style={{
                    width: isLarge ? 56 : 44, height: isLarge ? 56 : 44,
                    borderRadius: "var(--radius-m)", background: "rgba(255,255,255,0.12)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: "var(--space-m)",
                  }}>
                    <Icon size={isLarge ? 28 : 22} style={{ color: card.color }} />
                  </div>

                  {/* Title */}
                  <h3 style={{
                    fontFamily: "var(--font-heading)", fontSize: isLarge ? "var(--text-xl)" : "var(--text-m)",
                    fontWeight: 800, margin: "0 0 var(--space-s)", letterSpacing: "-0.01em",
                    color: card.bg.includes("var(") ? "var(--color-text-primary)" : "#fff",
                  }}>
                    {card.title}
                  </h3>

                  {/* Description */}
                  <p style={{
                    fontSize: isLarge ? "var(--text-s)" : "var(--text-xs)",
                    color: card.bg.includes("var(") ? "var(--color-text-secondary)" : "rgba(255,255,255,0.65)",
                    lineHeight: 1.7, margin: 0, flex: 1,
                  }}>
                    {card.desc}
                  </p>

                  {/* Stat */}
                  <div style={{
                    display: "flex", alignItems: "center", gap: "var(--space-s)",
                    marginTop: "var(--space-m)", paddingTop: "var(--space-m)",
                    borderTop: `1px solid ${card.bg.includes("var(") ? "var(--color-border)" : "rgba(255,255,255,0.1)"}`,
                  }}>
                    <div style={{
                      fontSize: isLarge ? "var(--text-xl)" : "var(--text-l)",
                      fontWeight: 900, fontFamily: "var(--font-heading)",
                      color: card.color,
                    }}>
                      {card.stat}
                    </div>
                    <div style={{
                      fontSize: 11,
                      color: card.bg.includes("var(") ? "var(--color-text-secondary)" : "rgba(255,255,255,0.5)",
                    }}>
                      {card.statLabel}
                    </div>
                    <ArrowRight size={16} style={{ marginLeft: "auto", color: card.color, flexShrink: 0 }} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* MOBILE: fallback to 1-col grid */}
        <style>{`
          @media (max-width: 768px) {
            .bento-grid { grid-template-columns: 1fr !important; }
            .bento-grid > * { grid-column: span 1 !important; grid-row: span 1 !important; }
          }
          .bento-card:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(0,0,0,0.15); }
        `}</style>

        {/* CTA */}
        <section style={{ marginTop: "var(--space-xxl)", textAlign: "center", padding: "var(--space-xxl) var(--space-m)", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-xl)", border: "1px solid var(--color-border)" }}>
          <Sparkles size={40} style={{ color: "var(--color-accent)", marginBottom: "var(--space-m)" }} />
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 700, marginBottom: "var(--space-s)" }}>
            Не знаешь с чего начать?
          </h2>
          <p style={{ fontSize: "var(--text-m)", color: "var(--color-text-secondary)", maxWidth: 460, margin: "0 auto var(--space-l)", lineHeight: 1.6 }}>
            Пройди квиз из 5 вопросов — и получи персональную рекомендацию Blueprint'а с учётом твоих целей и российского контекста.
          </p>
          <a href="/#quiz-section" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: "var(--radius-m)", background: "var(--color-accent)", color: "#fff", textDecoration: "none", fontSize: "var(--text-s)", fontWeight: 700 }}>
            Пройти квиз <ArrowRight size={16} />
          </a>
        </section>

      </div>
    </div>
  );
}

function PhilItem({ emoji, title, desc }: { emoji: string; title: string; desc: string }) {
  return (
    <div style={{ display: "flex", gap: 12 }}>
      <div style={{ fontSize: 24, flexShrink: 0, lineHeight: 1 }}>{emoji}</div>
      <div>
        <div style={{ fontSize: "var(--text-s)", fontWeight: 700, marginBottom: 2 }}>{title}</div>
        <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{desc}</div>
      </div>
    </div>
  );
}
