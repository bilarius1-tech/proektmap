import { getDb } from "@/lib/db/index";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Clock, Target, Database, CheckCircle, Wrench, Cpu, Rocket, Globe, Server, Smartphone, Gamepad2, Bot, Shield, Zap, Star, Users, BookOpen, ChevronDown, ExternalLink } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const ICON_MAP: Record<string, any> = { Globe, Server, Smartphone, Gamepad2, Bot };

// Cost estimates by category
const COST_ESTIMATES: Record<string, { dev: string; ai: string; server: string; mvp: string }> = {
  "corporate-website": { dev: "150 000 – 300 000 ₽", ai: "15 000 – 40 000 ₽", server: "400 ₽/мес", mvp: "5–10 дней" },
  "saas-project": { dev: "500 000 – 1 500 000 ₽", ai: "50 000 – 150 000 ₽", server: "1 500 ₽/мес", mvp: "2–4 недели" },
  "game-dev": { dev: "300 000 – 800 000 ₽", ai: "30 000 – 80 000 ₽", server: "800 ₽/мес", mvp: "2–3 недели" },
  "company-catalog": { dev: "200 000 – 500 000 ₽", ai: "20 000 – 60 000 ₽", server: "600 ₽/мес", mvp: "1–2 недели" },
  "telegram-bot": { dev: "80 000 – 250 000 ₽", ai: "8 000 – 25 000 ₽", server: "400 ₽/мес", mvp: "3–7 дней" },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const db = await getDb();
  const bp = await db.blueprint.findUnique({ where: { slug }, select: { title: true, description: true, goal: true } });
  if (!bp) return {};
  const title = `Как создать ${bp.title.toLowerCase()} — пошаговый Blueprint с AI`;
  return {
    title,
    description: bp.description || `Пошаговая дорожная карта создания ${bp.title.toLowerCase()}: стек технологий, этапы, AI-промпты, стоимость запуска. Создайте ${bp.title.toLowerCase()} с помощью ИИ.`,
    openGraph: {
      title,
      description: bp.goal || bp.description || "",
      images: [{ url: `https://proektmap.ru/api/og?title=${encodeURIComponent(bp.title)}&category=Blueprint&author=Пошаговая+дорoжная+карта`, width: 1200, height: 630 }],
    },
  };
}

export default async function BlueprintLandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = await getDb();

  const bp = await db.blueprint.findUnique({
    where: { slug },
    include: {
      stages: { orderBy: { sortOrder: "asc" }, include: { stage: { include: { decisions: { orderBy: { sortOrder: "asc" }, take: 5 } } } } },
    },
  });
  if (!bp || !bp.isPublished) notFound();

  // Track view
  await db.blueprint.update({ where: { id: bp.id }, data: { viewCount: { increment: 1 } } }).catch(() => {});

  const Icon = ICON_MAP[bp.icon] || Globe;
  const cost = COST_ESTIMATES[slug] || COST_ESTIMATES["corporate-website"];
  const entities = safeJson(bp.entities);
  const checklist = safeJson(bp.checklist);
  const artifacts = safeJson(bp.artifacts);

  // Build HowTo schema
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": `Как создать ${bp.title.toLowerCase()}`,
    "description": bp.goal || bp.description || `Пошаговое руководство по созданию ${bp.title.toLowerCase()} с помощью AI`,
    "totalTime": bp.timeToComplete || "P2W",
    "tool": [
      { "@type": "HowToTool", "name": "Cursor" },
      { "@type": "HowToTool", "name": "Claude Code" },
      { "@type": "HowToTool", "name": "Next.js" },
      { "@type": "HowToTool", "name": "Prisma" },
    ],
    "step": bp.stages.map((bs: any, i: number) => ({
      "@type": "HowStep",
      "position": i + 1,
      "name": bs.stage.title,
      "text": bs.stage.description || `Этап ${i + 1}: ${bs.stage.title}`,
    })),
  };

  // BreadcrumbList schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Главная", "item": "https://proektmap.ru" },
      { "@type": "ListItem", "position": 2, "name": "Blueprints", "item": "https://proektmap.ru/blueprints" },
      { "@type": "ListItem", "position": 3, "name": bp.title, "item": `https://proektmap.ru/blueprints/${slug}` },
    ],
  };

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "var(--color-bg-primary)", color: "var(--color-text-primary)", minHeight: "100vh" }}>

      {/* Schema.org */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* ═══ HERO ═══ */}
      <div style={{ background: "linear-gradient(135deg, #0d1b2a 0%, #1b2838 50%, #0f3460 100%)", padding: "80px 20px 70px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        {/* Ambient glow */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 40%, rgba(15,184,128,0.12), transparent 50%), radial-gradient(circle at 70% 60%, rgba(59,130,246,0.08), transparent 50%)" }} />

        {/* Particle animation */}
        <Particles />

        <div style={{ position: "relative", maxWidth: 740, margin: "0 auto" }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: "var(--space-l)", fontSize: "var(--text-xs)", color: "rgba(255,255,255,0.5)" }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Главная</Link>
            <span>/</span>
            <Link href="/blueprints" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Blueprints</Link>
            <span>/</span>
            <span style={{ color: "rgba(255,255,255,0.8)" }}>{bp.title}</span>
          </div>

          {/* Badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 18px", borderRadius: "var(--radius-full)", background: "rgba(15,184,128,0.2)", color: "#0fb880", fontSize: "var(--text-xs)", fontWeight: 700, marginBottom: "var(--space-m)" }}>
            <Rocket size={16} /> Blueprint
          </div>

          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(32px, 6vw, 48px)", fontWeight: 800, lineHeight: 1.05, marginBottom: "var(--space-s)", letterSpacing: "-0.02em", color: "#fff" }}>
            Как создать {bp.title.toLowerCase()}
          </h1>
          <p style={{ fontSize: "var(--text-l)", color: "rgba(255,255,255,0.7)", maxWidth: 560, margin: "0 auto var(--space-m)", lineHeight: 1.7 }}>
            {bp.goal || bp.description}
          </p>

          {/* Stats row */}
          <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap", marginBottom: "var(--space-xl)", color: "rgba(255,255,255,0.6)", fontSize: "var(--text-xs)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Clock size={14} /> {bp.timeToComplete || "1–3 недели"}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><CheckCircle size={14} /> {bp.totalDecisions} этапов</span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Database size={14} /> {entities.length} сущностей</span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Star size={14} /> {bp.totalXp} XP</span>
          </div>

          {/* CTA */}
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href={`/${slug}`} style={{ display: "flex", alignItems: "center", gap: 8, padding: "16px 36px", borderRadius: "var(--radius-m)", background: "#0fb880", color: "#fff", textDecoration: "none", fontSize: "var(--text-s)", fontWeight: 700, boxShadow: "0 4px 24px rgba(15,184,128,0.3)" }}>
              Начать проект <ArrowRight size={18} />
            </Link>
            <a href="#howto" style={{ display: "flex", alignItems: "center", gap: 8, padding: "16px 36px", borderRadius: "var(--radius-m)", background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", textDecoration: "none", fontSize: "var(--text-s)", fontWeight: 700 }}>
              Как это работает <Zap size={18} />
            </a>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "var(--space-xl) var(--space-m)" }}>

        {/* ═══ Что это ═══ */}
        <section style={{ marginBottom: "var(--space-xxl)" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 700, marginBottom: "var(--space-l)", letterSpacing: "-0.01em" }}>
            Что такое Blueprint &laquo;{bp.title}&raquo;
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "var(--space-xl)" }}>
            <div>
              <p style={{ fontSize: "var(--text-s)", lineHeight: 1.8, margin: 0, color: "var(--color-text-primary)" }}>
                {bp.description || `Blueprint «${bp.title}» — это готовая дорожная карта для создания ${bp.title.toLowerCase()} с помощью AI-инструментов. Вы проходите этап за этапом, AI-консультант помогает принимать решения, а система собирает проект.`}
              </p>
              {bp.targetAudience && (
                <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.7, marginTop: "var(--space-m)" }}>
                  <strong>Для кого:</strong> {bp.targetAudience}
                </p>
              )}
            </div>
            <div style={{ background: "var(--color-bg-secondary)", borderRadius: "var(--radius-m)", border: "1px solid var(--color-border)", padding: "var(--space-xl)" }}>
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-m)", fontWeight: 700, marginBottom: "var(--space-m)" }}>Что вы получите</h3>
              <CheckItem>Готовую дорожную карту из {bp.totalDecisions} этапов</CheckItem>
              <CheckItem>AI-промпты для каждого этапа</CheckItem>
              <CheckItem>Схему базы данных ({entities.length} сущностей)</CheckItem>
              <CheckItem>Чек-лист из {checklist.length} пунктов</CheckItem>
              <CheckItem>Шаблоны артефактов: ТЗ, диаграммы, API-спеки</CheckItem>
              {bp.totalXp > 0 && <CheckItem>{bp.totalXp} XP в профиль разработчика</CheckItem>}
            </div>
          </div>
        </section>

        {/* ═══ Стоимость запуска ═══ */}
        <section style={{ marginBottom: "var(--space-xxl)" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 700, marginBottom: "var(--space-s)", letterSpacing: "-0.01em" }}>
            Стоимость запуска
          </h2>
          <p style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: "var(--space-l)" }}>
            Сравнение: классическая разработка vs создание с AI-инструментами через Blueprint.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--space-m)" }}>
            <CostCard label="Классическая разработка" value={cost.dev} icon="👨‍💻" />
            <CostCard label="С AI (Blueprint)" value={cost.ai} icon="🤖" highlight />
            <CostCard label="Хостинг" value={cost.server} icon="☁️" />
            <CostCard label="MVP за" value={cost.mvp} icon="⚡" />
          </div>
        </section>

        {/* ═══ Этапы (HowTo) ═══ */}
        <section id="howto" style={{ marginBottom: "var(--space-xxl)" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 700, marginBottom: "var(--space-s)", letterSpacing: "-0.01em" }}>
            Пошаговый план создания
          </h2>
          <p style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: "var(--space-l)" }}>
            {bp.totalDecisions} этапов — от идеи до запуска. Каждый этап содержит решения, AI-промпты и чек-листы.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
            {bp.stages.map((bs: any, i: number) => {
              const stage = bs.stage;
              const decisionCount = stage.decisions?.length || 0;
              return (
                <details key={bs.id} style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-m)", overflow: "hidden" }}>
                  <summary style={{ padding: "var(--space-l)", cursor: "pointer", display: "flex", alignItems: "center", gap: "var(--space-m)", fontFamily: "var(--font-heading)", fontSize: "var(--text-s)", fontWeight: 600, listStyle: "none" }}>
                    <span style={{ width: 36, height: 36, borderRadius: "var(--radius-m)", background: "var(--color-accent)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "var(--text-s)", fontWeight: 800, flexShrink: 0 }}>{i + 1}</span>
                    <span style={{ flex: 1 }}>{stage.title}</span>
                    <span style={{ fontSize: 11, color: "var(--color-text-tertiary)", fontWeight: 400 }}>{decisionCount} решений</span>
                    <ChevronDown size={16} style={{ color: "var(--color-accent)", flexShrink: 0 }} />
                  </summary>
                  <div style={{ padding: "0 var(--space-l) var(--space-l) var(--space-l)", marginLeft: 56 }}>
                    {stage.description && <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.7, margin: "0 0 var(--space-s)" }}>{stage.description}</p>}
                    {stage.decisions?.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {stage.decisions.map((d: any) => (
                          <span key={d.id} style={{ padding: "4px 12px", borderRadius: "var(--radius-full)", fontSize: 11, background: "var(--color-bg-tertiary)", color: "var(--color-text-secondary)", border: "1px solid var(--color-border)" }}>
                            {d.title}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </details>
              );
            })}
          </div>
        </section>

        {/* ═══ Технологии ═══ */}
        <section style={{ marginBottom: "var(--space-xxl)" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 700, marginBottom: "var(--space-l)", letterSpacing: "-0.01em" }}>
            Технологии и инструменты
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--space-m)" }}>
            <TechCard icon={<Wrench size={20} />} title="Стек технологий" items={["Next.js 16", "TypeScript", "Prisma ORM", "PostgreSQL", "Tailwind CSS", "Redis"]} color="#0fb880" />
            <TechCard icon={<Cpu size={20} />} title="AI-инструменты" items={["Cursor", "Claude Code", "Reasonix", "ChatGPT / DeepSeek", "v0.dev", "Bolt.new"]} color="#3b82f6" />
            <TechCard icon={<Server size={20} />} title="Инфраструктура" items={["TimeWeb / Beget VDS", "Docker", "GitHub Actions", "LetsEncrypt SSL", "ЮKassa / Telegram Payments", "Yandex Cloud"]} color="#f59e0b" />
          </div>
        </section>

        {/* ═══ FAQ ═══ */}
        <section style={{ marginBottom: "var(--space-xxl)" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 700, marginBottom: "var(--space-l)", letterSpacing: "-0.01em" }}>
            Часто задаваемые вопросы
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
            <FaqItem q={`Сколько времени займёт создание ${bp.title.toLowerCase()}?`} a={`С Blueprint — ${bp.timeToComplete || "1–3 недели"} при занятиях по 1–2 часа в день. AI-консультант ускоряет принятие решений: вместо дней на изучение — минуты на выбор готового варианта.`} />
            <FaqItem q="Нужно ли уметь программировать?" a="Базовые знания HTML/CSS/JavaScript желательны. Но с AI-инструментами (Cursor, Bolt) даже новичок может создать работающий прототип за несколько дней. Blueprint проведёт через все этапы." />
            <FaqItem q={`Сколько стоит запуск ${bp.title.toLowerCase()}?`} a={`Классическая разработка: ${cost.dev}. С Blueprint + AI: ${cost.ai}. Хостинг: ${cost.server}. Экономия в 5–10 раз за счёт AI-инструментов.`} />
            <FaqItem q="Что если я застрял на каком-то этапе?" a="В каждом решении есть AI-промпт — скопируйте его в Cursor/Claude, и AI поможет написать код или выбрать архитектуру. Также доступен AI-консультант в Pro-подписке." />
            <FaqItem q="Можно ли использовать этот Blueprint для коммерческого проекта?" a="Да! Все Blueprint'ы созданы на основе реальных коммерческих проектов. Вы получаете не учебный пример, а боевую архитектуру, которую можно сразу использовать для клиентов." />
          </div>
        </section>

        {/* ═══ Финальный CTA ═══ */}
        <section style={{
          textAlign: "center", padding: "var(--space-xxl) var(--space-m)",
          background: "linear-gradient(135deg, #0d1b2a 0%, #1b2838 50%, #0f3460 100%)",
          borderRadius: "var(--radius-l)", position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 50%, rgba(15,184,128,0.15), transparent 60%)" }} />
          <div style={{ position: "relative" }}>
            <Rocket size={48} style={{ color: "#0fb880", marginBottom: "var(--space-m)" }} />
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 700, marginBottom: "var(--space-s)", color: "#fff" }}>
              Готовы создать {bp.title.toLowerCase()}?
            </h2>
            <p style={{ fontSize: "var(--text-m)", color: "rgba(255,255,255,0.7)", maxWidth: 480, margin: "0 auto var(--space-l)", lineHeight: 1.6 }}>
              Запустите Blueprint прямо сейчас. AI-консультант проведёт вас через все {bp.totalDecisions} этапов.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href={`/${slug}`} style={{ display: "flex", alignItems: "center", gap: 8, padding: "16px 36px", borderRadius: "var(--radius-m)", background: "#0fb880", color: "#fff", textDecoration: "none", fontSize: "var(--text-s)", fontWeight: 700, boxShadow: "0 4px 24px rgba(15,184,128,0.3)" }}>
                Начать проект <ArrowRight size={18} />
              </Link>
              <Link href="/ai-tools" style={{ display: "flex", alignItems: "center", gap: 8, padding: "16px 36px", borderRadius: "var(--radius-m)", background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", textDecoration: "none", fontSize: "var(--text-s)", fontWeight: 700 }}>
                <Wrench size={18} /> AI-инструменты
              </Link>
            </div>
          </div>
        </section>

        {/* ═══ Похожие Blueprint'ы ═══ */}
        <section style={{ marginTop: "var(--space-xxl)", borderTop: "1px solid var(--color-border)", paddingTop: "var(--space-xl)" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-l)", fontWeight: 700, marginBottom: "var(--space-m)" }}>
            Другие Blueprint'ы
          </h2>
          <div style={{ display: "flex", gap: "var(--space-s)", flexWrap: "wrap" }}>
            <Link href="/blueprints" style={{ padding: "10px 20px", borderRadius: "var(--radius-m)", background: "var(--color-accent)", color: "#fff", textDecoration: "none", fontSize: "var(--text-xs)", fontWeight: 600 }}>
              Все Blueprint'ы
            </Link>
            <Link href="/ai-tools" style={{ padding: "10px 20px", borderRadius: "var(--radius-m)", background: "var(--color-bg-secondary)", color: "var(--color-text-secondary)", textDecoration: "none", fontSize: "var(--text-xs)", fontWeight: 600, border: "1px solid var(--color-border)" }}>
              AI-инструменты
            </Link>
            <Link href="/ai-workshop" style={{ padding: "10px 20px", borderRadius: "var(--radius-m)", background: "var(--color-bg-secondary)", color: "var(--color-text-secondary)", textDecoration: "none", fontSize: "var(--text-xs)", fontWeight: 600, border: "1px solid var(--color-border)" }}>
              AI Цех — примеры проектов
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}

// ── Components ──

function CheckItem({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "flex", gap: 8, marginBottom: "var(--space-s)", fontSize: "var(--text-xs)", lineHeight: 1.6 }}>
    <CheckCircle size={14} style={{ color: "var(--color-accent)", flexShrink: 0, marginTop: 2 }} />
    <span>{children}</span>
  </div>;
}

function CostCard({ label, value, icon, highlight }: { label: string; value: string; icon: string; highlight?: boolean }) {
  return (
    <div style={{
      padding: "var(--space-l)", borderRadius: "var(--radius-m)",
      background: highlight ? "var(--color-accent-light)" : "var(--color-bg-secondary)",
      border: highlight ? "1px solid var(--color-accent)" : "1px solid var(--color-border)",
      textAlign: "center",
    }}>
      <div style={{ fontSize: 24, marginBottom: 4 }}>{icon}</div>
      <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: "var(--text-m)", fontWeight: 800, color: highlight ? "var(--color-accent)" : "var(--color-text-primary)" }}>{value}</div>
    </div>
  );
}

function TechCard({ icon, title, items, color }: { icon: React.ReactNode; title: string; items: string[]; color: string }) {
  return (
    <div style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-m)", padding: "var(--space-xl)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "var(--space-m)" }}>
        <div style={{ color, width: 36, height: 36, borderRadius: "var(--radius-m)", background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>
        <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-s)", fontWeight: 700, margin: 0 }}>{title}</h3>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {items.map(item => (
          <span key={item} style={{ padding: "4px 12px", borderRadius: "var(--radius-full)", fontSize: 11, background: "var(--color-bg-tertiary)", color: "var(--color-text-secondary)", border: "1px solid var(--color-border)" }}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-m)", overflow: "hidden" }}>
      <summary style={{ padding: "var(--space-l)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: "var(--font-heading)", fontSize: "var(--text-s)", fontWeight: 600, listStyle: "none" }}>
        {q}
        <ChevronDown size={18} style={{ color: "var(--color-accent)", flexShrink: 0 }} />
      </summary>
      <div style={{ padding: "0 var(--space-l) var(--space-l)", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.8 }}>{a}</div>
    </details>
  );
}

function Particles() {
  return (
    <>
      <style>{`
        @keyframes float1 {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          25% { transform: translateY(-20px) translateX(10px); opacity: 0.6; }
          50% { transform: translateY(-10px) translateX(-5px); opacity: 0.2; }
          75% { transform: translateY(-30px) translateX(15px); opacity: 0.5; }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.2; }
          33% { transform: translateY(-25px) translateX(-15px); opacity: 0.5; }
          66% { transform: translateY(-15px) translateX(10px); opacity: 0.3; }
        }
        @keyframes float3 {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.25; }
          50% { transform: translateY(-35px) translateX(-20px); opacity: 0.55; }
        }
        @keyframes float4 {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.2; }
          50% { transform: translateY(-28px) scale(1.3); opacity: 0.5; }
        }
        .particle { position: absolute; border-radius: 50%; pointer-events: none; }
      `}</style>
      <div className="particle" style={{ width: 3, height: 3, background: "#0fb880", top: "20%", left: "15%", animation: "float1 6s ease-in-out infinite" }} />
      <div className="particle" style={{ width: 2, height: 2, background: "#3b82f6", top: "60%", left: "25%", animation: "float2 8s ease-in-out infinite" }} />
      <div className="particle" style={{ width: 4, height: 4, background: "#0fb880", top: "30%", right: "20%", animation: "float3 7s ease-in-out infinite" }} />
      <div className="particle" style={{ width: 2, height: 2, background: "#f59e0b", top: "70%", right: "30%", animation: "float4 9s ease-in-out infinite" }} />
      <div className="particle" style={{ width: 3, height: 3, background: "rgba(15,184,128,0.6)", top: "45%", left: "60%", animation: "float1 5s ease-in-out infinite 1s" }} />
      <div className="particle" style={{ width: 2, height: 2, background: "rgba(59,130,246,0.7)", top: "15%", right: "40%", animation: "float2 7s ease-in-out infinite 2s" }} />
      <div className="particle" style={{ width: 5, height: 5, background: "rgba(15,184,128,0.3)", top: "80%", left: "45%", animation: "float3 10s ease-in-out infinite 0.5s" }} />
      <div className="particle" style={{ width: 2, height: 2, background: "rgba(245,158,11,0.5)", top: "55%", right: "15%", animation: "float4 6s ease-in-out infinite 1.5s" }} />
    </>
  );
}

function safeJson(s: string): any[] {
  try { return JSON.parse(s); } catch { return []; }
}
