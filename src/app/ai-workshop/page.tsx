import { getDb } from "@/lib/db/index";
import Link from "next/link";
import { ArrowRight, Eye, Star, ExternalLink, Wrench, Cpu, Globe } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "AI Цех — реальные проекты созданные с помощью ИИ: сайты, боты, SaaS",
  description: "Витрина реальных проектов созданных с помощью AI: сайты, Telegram-боты, SaaS, игры от российских и зарубежных разработчиков. Стек, инструменты, стоимость запуска.",
  openGraph: {
    title: "AI Цех — реальные проекты созданные с помощью ИИ",
    description: "Реальные проекты от разработчиков: сайты, Telegram-боты, SaaS, игры — построенные с помощью нейросетей. Стек, инструменты, кейсы.",
    images: [{ url: "https://proektmap.ru/api/og?title=AI+Цех&category=Проекты&author=AI-проекты", width: 1200, height: 630 }],
  },
};

export default async function AiWorkshopPage({ searchParams }: { searchParams: Promise<{ lang?: string; cat?: string }> }) {
  const { lang, cat } = await searchParams;
  const db = await getDb();

  const where: any = {};
  if (lang && lang !== "all") where.language = lang;
  if (cat && cat !== "all") where.category = cat;

  const projects = await db.aiProject.findMany({
    where,
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  const allProjects = await db.aiProject.findMany({ select: { category: true, language: true } });
  const categories = [...new Set(allProjects.map(p => p.category))];
  const languages = [...new Set(allProjects.map(p => p.language))];
  const langLabels: Record<string, string> = { ru: "🇷🇺 Российские", en: "🇬🇧 English" };

  return (
    <div style={{ fontFamily: "var(--font-body)", background: "var(--color-bg-primary)", color: "var(--color-text-primary)", minHeight: "100vh" }}>

      {/* HERO */}
      <div style={{ padding: "var(--space-xxl) var(--space-m) var(--space-xl)", textAlign: "center", borderBottom: "1px solid var(--color-border)" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-xs)", padding: "4px 14px", background: "var(--color-bg-tertiary)", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: "var(--space-m)", color: "var(--color-text-secondary)", borderRadius: 0 }}>
            🏭 AI Цех
          </div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(32px, 6vw, 48px)", fontWeight: 800, lineHeight: 1.05, margin: "0 0 var(--space-s)", letterSpacing: "-0.02em" }}>
            Проекты на AI-технологиях
          </h1>
          <p style={{ fontSize: "var(--text-m)", color: "var(--color-text-secondary)", lineHeight: 1.7, margin: 0 }}>
            {projects.length} проектов — Telegram боты, SaaS, сайты, игры. Смотри стек, вдохновляйся, строй своё.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1040, margin: "0 auto", padding: "0 var(--space-m) var(--space-xl)" }}>

        {/* Language filter */}
        <div style={{ display: "flex", gap: "var(--space-s)", margin: "var(--space-xl) 0 var(--space-s)", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-text-secondary)", marginRight: 4 }}>Язык:</span>
          <FilterLink href="/ai-workshop" active={!lang || lang === "all"} label="🌍 Все" />
          {languages.map(l => (
            <FilterLink key={l} href={`/ai-workshop?lang=${l}${cat ? '&cat=' + cat : ''}`} active={lang === l} label={langLabels[l] || l} />
          ))}
        </div>

        {/* Category filters */}
        <div style={{ display: "flex", gap: "var(--space-xs)", margin: "0 0 var(--space-xl)", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-text-secondary)", marginRight: 4 }}>Тип:</span>
          <FilterLink href={`/ai-workshop${lang ? '?lang=' + lang : ''}`} active={!cat || cat === "all"} label="Все" />
          {categories.map(c => (
            <FilterLink key={c} href={`/ai-workshop?cat=${c}${lang ? '&lang=' + lang : ''}`} active={cat === c} label={c} />
          ))}
        </div>

        {/* Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 0,
          border: "1px solid var(--color-border)",
        }}>
          {projects.map(project => (
            <Link
              key={project.id}
              href={`/ai-workshop/${project.slug}`}
              style={{
                textDecoration: "none", color: "inherit",
                background: "var(--color-bg-secondary)",
                border: "1px solid var(--color-border)",
                margin: "-1px 0 0 -1px",
                transition: "background 0.15s",
                display: "flex", flexDirection: "column",
              }}
              className="workshop-card"
            >
              {/* Screenshot */}
              {project.screenshot ? (
                <div style={{ height: 200, overflow: "hidden", background: "var(--color-bg-tertiary)", position: "relative" }}>
                  <img src={project.screenshot} alt={project.title} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 0 }} />
                  <span style={{ position: "absolute", top: 8, right: 8, padding: "2px 8px", fontSize: 10, fontWeight: 700, background: "rgba(0,0,0,0.7)", color: "#fff" }}>
                    {langLabels[project.language] || project.language}
                  </span>
                </div>
              ) : (
                <div style={{ height: 120, background: "var(--color-bg-tertiary)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  <Wrench size={32} style={{ color: "var(--color-text-tertiary)" }} />
                  <span style={{ position: "absolute", top: 8, right: 8, padding: "2px 8px", fontSize: 10, fontWeight: 700, background: "rgba(0,0,0,0.7)", color: "#fff" }}>
                    {langLabels[project.language] || project.language}
                  </span>
                </div>
              )}

              <div style={{ padding: "var(--space-l)", flex: 1, display: "flex", flexDirection: "column" }}>
                {/* Title + featured */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: "var(--space-s)" }}>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-m)", fontWeight: 700, margin: 0, letterSpacing: "-0.01em", lineHeight: 1.3 }}>
                    {project.title}
                  </h3>
                  {project.featured && <Star size={14} style={{ color: "#fbbf24", flexShrink: 0, marginTop: 3 }} />}
                </div>

                {/* Description */}
                <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.6, margin: "0 0 var(--space-m)", flex: 1 }}>
                  {project.description?.slice(0, 150)}{(project.description?.length || 0) > 150 ? "..." : ""}
                </p>

                {/* Tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: "var(--space-s)" }}>
                  {project.techStack?.split(",").filter(Boolean).slice(0, 3).map((t: string) => (
                    <span key={t} style={{ padding: "2px 8px", borderRadius: 0, fontSize: 10, background: "var(--color-bg-tertiary)", color: "var(--color-text-secondary)", fontWeight: 500 }}>{t.trim()}</span>
                  ))}
                </div>

                {/* Meta row */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "var(--space-s)", borderTop: "1px solid var(--color-border)", fontSize: 11, color: "var(--color-text-secondary)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ padding: "2px 6px", borderRadius: 0, background: "var(--color-bg-tertiary)", fontSize: 10 }}>{project.category}</span>
                    <span>{project.status}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Eye size={12} /> {project.viewCount}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {projects.length === 0 && (
          <div style={{ textAlign: "center", padding: "var(--space-xxl)", color: "var(--color-text-tertiary)" }}>
            <Globe size={48} style={{ marginBottom: "var(--space-m)", opacity: 0.3 }} />
            <p style={{ fontSize: "var(--text-l)", fontWeight: 600 }}>Нет проектов</p>
            <p style={{ fontSize: "var(--text-s)" }}>Смените фильтр или добавьте новый проект в админке.</p>
          </div>
        )}

        <style>{`.workshop-card:hover { background: var(--color-bg-tertiary); }`}</style>

      </div>
    </div>
  );
}

function FilterLink({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      style={{
        padding: "6px 14px", borderRadius: 0, fontSize: "var(--text-xs)", fontWeight: 600,
        background: active ? "var(--color-accent)" : "var(--color-bg-secondary)",
        color: active ? "#fff" : "var(--color-text-secondary)",
        border: active ? "1px solid var(--color-accent)" : "1px solid var(--color-border)",
        textDecoration: "none",
      }}
    >
      {label}
    </Link>
  );
}
