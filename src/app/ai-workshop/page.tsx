import { getDb } from "@/lib/db/index";
import Link from "next/link";
import { ArrowRight, Eye, Star, ExternalLink, Wrench, Cpu } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "AI Цех — российские проекты на AI-технологиях",
  description: "Витрина российских проектов созданных с помощью AI: Telegram боты, SaaS, сайты, игры. Стек технологий, AI-инструменты, авторы.",
  openGraph: {
    title: "AI Цех — проекты созданные с AI в России",
    description: "Telegram боты, SaaS, сайты, игры — построенные с помощью нейросетей.",
    images: [{ url: "https://proektmap.ru/api/og?title=AI+Цех&category=Проекты&author=Российские+AI-проекты", width: 1200, height: 630 }],
  },
};

export default async function AiWorkshopPage() {
  const db = await getDb();
  const projects = await db.aiProject.findMany({ orderBy: [{ featured: "desc" }, { createdAt: "desc" }] });

  const categories = [...new Set(projects.map(p => p.category))];

  return (
    <div style={{ fontFamily: "var(--font-body)", background: "var(--color-bg-primary)", color: "var(--color-text-primary)", minHeight: "100vh" }}>

      {/* HERO */}
      <div style={{ padding: "var(--space-xxl) var(--space-m) var(--space-xl)", textAlign: "center", borderBottom: "1px solid var(--color-border)" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-xs)", padding: "4px 14px", background: "var(--color-bg-tertiary)", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: "var(--space-m)", color: "var(--color-text-secondary)", borderRadius: 0 }}>
            🏭 AI Цех
          </div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(32px, 6vw, 48px)", fontWeight: 800, lineHeight: 1.05, margin: "0 0 var(--space-s)", letterSpacing: "-0.02em" }}>
            Российские проекты<br />на AI-технологиях
          </h1>
          <p style={{ fontSize: "var(--text-m)", color: "var(--color-text-secondary)", lineHeight: 1.7, margin: 0 }}>
            {projects.length} проектов — Telegram боты, SaaS, сайты, игры. Смотри стек, вдохновляйся, строй своё.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1040, margin: "0 auto", padding: "0 var(--space-m) var(--space-xl)" }}>

        {/* Category filters */}
        <div style={{ display: "flex", gap: "var(--space-xs)", margin: "var(--space-xl) 0", flexWrap: "wrap" }}>
          <span style={{ padding: "6px 14px", borderRadius: 0, fontSize: "var(--text-xs)", fontWeight: 700, background: "var(--color-accent)", color: "#fff" }}>Все</span>
          {categories.map(cat => (
            <span key={cat} style={{ padding: "6px 14px", borderRadius: 0, fontSize: "var(--text-xs)", fontWeight: 600, background: "var(--color-bg-secondary)", color: "var(--color-text-secondary)", border: "1px solid var(--color-border)" }}>{cat}</span>
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
                <div style={{ height: 200, overflow: "hidden", background: "var(--color-bg-tertiary)" }}>
                  <img src={project.screenshot} alt={project.title} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 0 }} />
                </div>
              ) : (
                <div style={{ height: 120, background: "var(--color-bg-tertiary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Wrench size={32} style={{ color: "var(--color-text-tertiary)" }} />
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

        <style>{`.workshop-card:hover { background: var(--color-bg-tertiary); }`}</style>

      </div>
    </div>
  );
}
