import { getDb } from "@/lib/db/index";
import Link from "next/link";
import { Bot, ArrowRight, GitBranch, Database, CreditCard, Brain, Smartphone, Rocket, Globe, BookOpen, MessageCircle, ShoppingCart, Lightbulb, Code2, Wrench, GraduationCap, Sparkles, Timer, Wallet } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Telegram Боты — полная экосистема AI-разработки",
  description: "Всё для создания Telegram ботов: Blueprint, AI-инструменты, готовые решения, навыки, глоссарий. От идеи до работающего бота с платежами и AI.",
};

const PHASE_ICONS: Record<string, any> = { GitBranch, Database, CreditCard, Brain, Smartphone, Rocket };

export default async function TelegramPage() {
  const db = await getDb();

  const [blueprint, tools, solutions, skills, glossary, patterns, posts] = await Promise.all([
    db.blueprint.findUnique({
      where: { slug: "telegram-bot" },
      include: { stages: { include: { stage: true }, orderBy: { sortOrder: "asc" } } },
    }),
    db.aITool.findMany({
      where: { bestFor: { contains: "telegram" }, isActive: true },
      orderBy: { sortOrder: "asc" },
      take: 6,
    }),
    db.solution.findMany({
      where: { isPublished: true, OR: [{ title: { contains: "Бот" } }, { title: { contains: "Telegram" } }, { title: { contains: "бот" } }] },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    db.skill.findMany({
      where: { isPublished: true, title: { contains: "Telegram" } },
      orderBy: { sortOrder: "asc" },
      take: 4,
    }),
    db.glossaryTerm.findMany({
      where: { isPublished: true, category: "Telegram" },
      orderBy: { sortOrder: "asc" },
      take: 12,
    }),
    db.buildPattern.findMany({
      where: { isPublished: true, OR: [{ title: { contains: "Telegram" } }, { title: { contains: "бот" } }] },
      take: 3,
    }),
    db.blogPost.findMany({
      where: { status: "published", OR: [{ title: { contains: "Telegram" } }, { title: { contains: "бот" } }] },
      orderBy: { publishedAt: "desc" },
      take: 3,
      select: { title: true, slug: true, excerpt: true, publishedAt: true },
    }),
  ]);

  const stages = blueprint?.stages || [];

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "var(--color-bg-primary)", color: "var(--color-text-primary)", minHeight: "100vh" }}>

      {/* ═══ HERO ═══ */}
      <div style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)", padding: "80px 20px 60px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 50%, rgba(0,136,204,0.15), transparent 70%)" }} />
        <div style={{ position: "relative", maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 18px", borderRadius: "var(--radius-full)", background: "rgba(0,136,204,0.2)", color: "#0af", fontSize: "var(--text-xs)", fontWeight: 700, marginBottom: "var(--space-m)" }}>
            <Bot size={16} /> Telegram Bot MAX
          </div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(32px, 6vw, 48px)", fontWeight: 800, lineHeight: 1.05, marginBottom: "var(--space-s)", letterSpacing: "-0.02em", color: "#fff" }}>
            Всё для создания<br />Telegram Ботов
          </h1>
          <p style={{ fontSize: "var(--text-l)", color: "rgba(255,255,255,0.7)", maxWidth: 520, margin: "0 auto var(--space-xl)", lineHeight: 1.7 }}>
            Blueprint, AI-инструменты, готовые решения, навыки и глоссарий — полная экосистема для создания ботов любой сложности.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/telegram-bot" style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: "var(--radius-m)", background: "var(--color-accent)", color: "#fff", textDecoration: "none", fontSize: "var(--text-s)", fontWeight: 700 }}>
              Пройти Blueprint <ArrowRight size={16} />
            </Link>
            <Link href="/ai-tools/aiogram" style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: "var(--radius-m)", background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", textDecoration: "none", fontSize: "var(--text-s)", fontWeight: 700 }}>
              Инструменты <Wrench size={16} />
            </Link>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "var(--space-xl) var(--space-m)" }}>

        {/* ═══ BLUEPRINT ROADMAP ═══ */}
        {blueprint && (
          <section style={{ marginBottom: "var(--space-xxl)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "var(--space-l)" }}>
              <div style={{ width: 48, height: 48, borderRadius: "var(--radius-m)", background: "var(--color-accent)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}><Bot size={24} /></div>
              <div>
                <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 700, margin: 0, letterSpacing: "-0.01em" }}>{blueprint.title}</h2>
                <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", margin: "4px 0 0" }}>{blueprint.description}</p>
              </div>
            </div>

            {/* Stats bar */}
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginBottom: "var(--space-l)", padding: "var(--space-m) var(--space-l)", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-m)", border: "1px solid var(--color-border)" }}>
              <Stat icon={<Timer size={16} />} label="Время" value={blueprint.timeToComplete || "2–3 недели"} />
              <Stat icon={<Sparkles size={16} />} label="XP" value={`${blueprint.totalXp} XP`} />
              <Stat icon={<GraduationCap size={16} />} label="Решений" value={String(blueprint.totalDecisions)} />
              <Stat icon={<Globe size={16} />} label="Сложность" value={blueprint.difficulty === "medium" ? "Средняя" : "Лёгкая"} />
            </div>

            {/* Phase cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "var(--space-m)" }}>
              {stages.map((bs: any, i: number) => {
                const s = bs.stage;
                const Icon = PHASE_ICONS[s.icon] || GitBranch;
                return (
                  <Link key={bs.id} href={`/${blueprint.slug}?stage=${s.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <div style={{
                      background: "var(--color-bg-primary)", border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius-m)", padding: "var(--space-l)",
                      transition: "box-shadow 0.2s, border-color 0.2s", height: "100%",
                    }} className="card-hover">
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "var(--space-s)" }}>
                        <div style={{ width: 40, height: 40, borderRadius: "var(--radius-s)", background: "var(--color-accent-light)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-accent)", flexShrink: 0 }}>
                          <Icon size={20} />
                        </div>
                        <div style={{ fontSize: "var(--text-xs)", fontWeight: 800, color: "var(--color-accent)", fontFamily: "var(--font-heading)" }}>
                          Этап {i + 1}
                        </div>
                      </div>
                      <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-s)", fontWeight: 700, margin: "0 0 6px", lineHeight: 1.3 }}>{s.title}</h3>
                      <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.6, margin: 0 }}>{s.description}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* ═══ SOLUTIONS ═══ */}
        {solutions.length > 0 && (
          <section style={{ marginBottom: "var(--space-xxl)" }}>
            <SectionHeader icon={<ShoppingCart size={20} />} title="Готовые решения" subtitle="Клонируй и запускай — код на GitHub" href="/solutions" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--space-m)" }}>
              {solutions.map((sol: any) => (
                <Link key={sol.id} href={`/solutions/${sol.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <Card>
                    <div style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-accent)", marginBottom: 4, textTransform: "uppercase" }}>{sol.productType}</div>
                    <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-s)", fontWeight: 700, margin: "0 0 6px" }}>{sol.title}</h3>
                    <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.6, margin: "0 0 10px" }}>{sol.summary || sol.description}</p>
                    <div style={{ display: "flex", gap: 12, fontSize: 11, color: "var(--color-text-secondary)", flexWrap: "wrap" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Timer size={12} /> MVP: {sol.mvpDays}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Wallet size={12} /> Сервер: {sol.costServer}</span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ═══ AI TOOLS ═══ */}
        {tools.length > 0 && (
          <section style={{ marginBottom: "var(--space-xxl)" }}>
            <SectionHeader icon={<Wrench size={20} />} title="AI-инструменты для ботов" subtitle="Фреймворки и библиотеки с русскими обзорами" href="/ai-tools" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "var(--space-m)" }}>
              {tools.map((tool: any) => (
                <Link key={tool.id} href={`/ai-tools/${tool.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <Card>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <div style={{ fontSize: "var(--text-m)", fontWeight: 800, fontFamily: "var(--font-heading)" }}>{tool.name}</div>
                      {tool.rating >= 9 && <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: "var(--radius-full)", background: "#fbbf24", color: "#000", fontWeight: 700 }}>Топ</span>}
                    </div>
                    <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.6, margin: "0 0 8px" }}>{tool.description}</p>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {tool.russianUi && <Tag text="Русский UI" color="var(--color-accent)" />}
                      {tool.russianSupport && <Tag text="Поддержка РФ" color="var(--color-accent)" />}
                      <Tag text={tool.pricingAmount} color="var(--color-text-secondary)" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ═══ SKILLS + GLOSSARY — two columns ═══ */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "var(--space-xl)", marginBottom: "var(--space-xxl)" }}>

          {/* Skills */}
          {skills.length > 0 && (
            <section>
              <SectionHeader icon={<GraduationCap size={20} />} title="Навыки" subtitle="Практические руководства" href="/skills" />
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
                {skills.map((sk: any) => (
                  <Link key={sk.id} href={`/skills/${sk.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <div style={{
                      display: "flex", alignItems: "center", gap: 12, padding: "var(--space-m)",
                      background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-m)",
                    }} className="card-hover">
                      <div style={{ width: 40, height: 40, borderRadius: "var(--radius-s)", background: "var(--color-accent-light)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Code2 size={20} style={{ color: "var(--color-accent)" }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 2 }}>{sk.title}</div>
                        <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>{sk.timeEstimate} · {sk.xpReward} XP</div>
                      </div>
                      <ArrowRight size={14} style={{ color: "var(--color-text-secondary)", flexShrink: 0 }} />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Glossary */}
          {glossary.length > 0 && (
            <section>
              <SectionHeader icon={<BookOpen size={20} />} title="Глоссарий Telegram" subtitle="Термины на понятном языке" href="/glossary" />
              <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-xs)" }}>
                {glossary.map((g: any) => (
                  <Link key={g.id} href={`/glossary/${g.slug}`} style={{ textDecoration: "none" }}>
                    <span style={{
                      display: "inline-block", padding: "6px 14px",
                      background: "var(--color-accent-light)", color: "var(--color-accent)",
                      borderRadius: "var(--radius-full)", fontSize: "var(--text-xs)", fontWeight: 600,
                      border: "1px solid transparent",
                      transition: "border-color 0.2s",
                    }} className="card-hover">
                      {g.term}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* ═══ WHY TELEGRAM ═══ */}
        <section style={{ marginBottom: "var(--space-xxl)", textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 700, marginBottom: "var(--space-l)", letterSpacing: "-0.01em" }}>
            Почему Telegram Бот?
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "var(--space-l)" }}>
            <ReasonCard icon={<Globe size={28} />} title="900M+ пользователей" desc="Telegram входит в топ-5 мессенджеров мира. В России им пользуются >60% населения." />
            <ReasonCard icon={<Wallet size={28} />} title="Встроенные платежи" desc="ЮKassa и Telegram Stars — принимай деньги прямо в чате. Без сайта, без лишних переходов." />
            <ReasonCard icon={<Smartphone size={28} />} title="Mini Apps" desc="Полноценные веб-приложения внутри Telegram. Свой магазин, CRM, панель управления." />
            <ReasonCard icon={<Bot size={28} />} title="Никаких установок" desc="Пользователь просто открывает бота. Не надо скачивать приложение или регистрироваться." />
          </div>
        </section>

        {/* ═══ CTA ═══ */}
        <section style={{ textAlign: "center", padding: "var(--space-xxl) var(--space-m)", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-l)", border: "1px solid var(--color-border)" }}>
          <Bot size={48} style={{ color: "var(--color-accent)", marginBottom: "var(--space-m)" }} />
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 700, marginBottom: "var(--space-s)", letterSpacing: "-0.01em" }}>
            Готов создать своего бота?
          </h2>
          <p style={{ fontSize: "var(--text-m)", color: "var(--color-text-secondary)", maxWidth: 480, margin: "0 auto var(--space-l)", lineHeight: 1.6 }}>
            Пройди Blueprint «Telegram Бот» — 6 этапов, 24 инженерных решения, AI-Архитектор на каждом шагу.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/telegram-bot" style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: "var(--radius-m)", background: "var(--color-accent)", color: "#fff", textDecoration: "none", fontSize: "var(--text-s)", fontWeight: 700 }}>
              Начать Blueprint <ArrowRight size={16} />
            </Link>
            <Link href="/pricing" style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: "var(--radius-m)", background: "var(--color-bg-primary)", color: "var(--color-accent)", border: "1px solid var(--color-accent)", textDecoration: "none", fontSize: "var(--text-s)", fontWeight: 700 }}>
              Pro — 300 ₽/мес
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}

// ═══ Helpers ═══
function SectionHeader({ icon, title, subtitle, href }: { icon: any; title: string; subtitle: string; href?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-l)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ color: "var(--color-accent)" }}>{icon}</div>
        <div>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-m)", fontWeight: 700, margin: 0 }}>{title}</h3>
          <p style={{ fontSize: 11, color: "var(--color-text-secondary)", margin: "2px 0 0" }}>{subtitle}</p>
        </div>
      </div>
      {href && (
        <Link href={href} style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-accent)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
          Все <ArrowRight size={14} />
        </Link>
      )}
    </div>
  );
}

function Card({ children }: { children: any }) {
  return (
    <div style={{
      background: "var(--color-bg-primary)", border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-m)", padding: "var(--space-l)", height: "100%",
      transition: "box-shadow 0.2s, border-color 0.2s",
    }} className="card-hover">
      {children}
    </div>
  );
}

function Stat({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ color: "var(--color-accent)" }}>{icon}</span>
      <div>
        <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>{label}</div>
        <div style={{ fontSize: "var(--text-xs)", fontWeight: 700 }}>{value}</div>
      </div>
    </div>
  );
}

function ReasonCard({ icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <div style={{ textAlign: "center", padding: "var(--space-l)" }}>
      <div style={{ color: "var(--color-accent)", marginBottom: "var(--space-s)", display: "inline-flex" }}>{icon}</div>
      <h4 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-s)", fontWeight: 700, marginBottom: "var(--space-xs)" }}>{title}</h4>
      <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.6, margin: 0 }}>{desc}</p>
    </div>
  );
}

function Tag({ text, color }: { text: string; color: string }) {
  return (
    <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: "var(--radius-full)", background: `${color}18`, color: color, fontWeight: 600, border: `1px solid ${color}30` }}>
      {text}
    </span>
  );
}
