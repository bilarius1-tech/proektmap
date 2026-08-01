import { getDb } from "@/lib/db/index";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ExternalLink, Eye, Star, Wrench, Cpu, User, Tag, Calendar, Globe } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = await getDb();
  const project = await db.aiProject.findUnique({ where: { slug } });
  if (!project) return {};
  return {
    title: `${project.title} — AI Цех`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: project.screenshot ? [{ url: project.screenshot, width: 1200, height: 630 }] : [],
    },
  };
}

export default async function AiProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = await getDb();
  const project = await db.aiProject.findUnique({ where: { slug } });
  if (!project) notFound();

  // Increment views
  await db.aiProject.update({ where: { id: project.id }, data: { viewCount: { increment: 1 } } }).catch(() => {});

  const techItems = (project.techStack || "").split(",").map(s => s.trim()).filter(Boolean);
  const aiItems = (project.aiTools || "").split(",").map(s => s.trim()).filter(Boolean);

  // Find matching tools in DB for links
  const matchingTools = aiItems.length > 0
    ? await db.aITool.findMany({ where: { name: { in: aiItems }, isActive: true }, select: { name: true, slug: true } })
    : [];
  const toolMap = new Map(matchingTools.map(t => [t.name.toLowerCase(), t.slug]));

  // Find matching skills
  const matchingSkills = techItems.length > 0
    ? await db.skill.findMany({ where: { slug: { in: techItems.map(t => t.toLowerCase().replace(/\s+/g, "-")) }, isPublished: true }, select: { title: true, slug: true } })
    : [];
  const skillMap = new Map(matchingSkills.map(s => [s.title.toLowerCase(), s.slug]));

  // Related projects (same category)
  const related = await db.aiProject.findMany({
    where: { category: project.category, id: { not: project.id } },
    take: 3, orderBy: { viewCount: "desc" },
    select: { id: true, title: true, slug: true, screenshot: true, category: true },
  });

  return (
    <div style={{ fontFamily: "var(--font-body)", background: "var(--color-bg-primary)", color: "var(--color-text-primary)", minHeight: "100vh" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "var(--space-xl) var(--space-m)" }}>

        {/* Back */}
        <Link href="/ai-workshop" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", textDecoration: "none", marginBottom: "var(--space-l)" }}>
          ← AI Цех
        </Link>

        {/* Header */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-xl)", marginBottom: "var(--space-xl)" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "var(--space-s)" }}>
              <span style={{ padding: "3px 10px", fontSize: 11, fontWeight: 600, background: "var(--color-bg-tertiary)", color: "var(--color-text-secondary)" }}>{project.category}</span>
              <span style={{ padding: "3px 10px", fontSize: 11, fontWeight: 600, background: project.status === "Запущен" ? "var(--color-accent-light)" : "var(--color-bg-tertiary)", color: project.status === "Запущен" ? "var(--color-accent)" : "var(--color-text-secondary)" }}>{project.status}</span>
              {project.featured && <span style={{ color: "#fbbf24" }}><Star size={16} /></span>}
            </div>
            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(28px, 5vw, 36px)", fontWeight: 800, margin: "0 0 var(--space-m)", letterSpacing: "-0.02em" }}>{project.title}</h1>
            <p style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)", lineHeight: 1.8, margin: "0 0 var(--space-m)" }}>{project.description}</p>

            {/* Author */}
            {project.authorName && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "var(--space-m)", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
                <User size={14} />
                {project.authorUrl ? <a href={project.authorUrl} target="_blank" style={{ color: "var(--color-accent)", textDecoration: "none" }}>{project.authorName}</a> : <span>{project.authorName}</span>}
              </div>
            )}

            {/* Visit */}
            {project.url && (
              <a href={project.url} target="_blank" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", background: "var(--color-accent)", color: "#fff", textDecoration: "none", fontSize: "var(--text-s)", fontWeight: 600 }}>
                <Globe size={16} /> Перейти к проекту <ExternalLink size={14} />
              </a>
            )}
          </div>

          {/* Screenshot */}
          {project.screenshot && (
            <div style={{ background: "var(--color-bg-tertiary)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", border: "1px solid var(--color-border)" }}>
              <img src={project.screenshot} alt={project.title} style={{ width: "100%", height: "auto", objectFit: "cover", borderRadius: 0 }} />
            </div>
          )}
        </div>

        {/* Tech Stack */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-xl)", marginBottom: "var(--space-xxl)" }}>
          <div style={{ border: "1px solid var(--color-border)", padding: "var(--space-xl)" }}>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-m)", fontWeight: 700, margin: "0 0 var(--space-m)", display: "flex", alignItems: "center", gap: 8 }}>
              <Wrench size={18} style={{ color: "var(--color-accent)" }} /> Технологический стек
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {techItems.map(t => {
                const skillSlug = skillMap.get(t.toLowerCase());
                return skillSlug ? (
                  <Link key={t} href={`/glossary/${skillSlug}`} style={{ padding: "6px 14px", fontSize: "var(--text-xs)", fontWeight: 600, background: "var(--color-bg-tertiary)", color: "var(--color-accent)", textDecoration: "none" }}>{t}</Link>
                ) : (
                  <span key={t} style={{ padding: "6px 14px", fontSize: "var(--text-xs)", fontWeight: 600, background: "var(--color-bg-tertiary)", color: "var(--color-text-secondary)" }}>{t}</span>
                );
              })}
            </div>
          </div>

          <div style={{ border: "1px solid var(--color-border)", padding: "var(--space-xl)" }}>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-m)", fontWeight: 700, margin: "0 0 var(--space-m)", display: "flex", alignItems: "center", gap: 8 }}>
              <Cpu size={18} style={{ color: "var(--color-accent)" }} /> AI-инструменты
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {aiItems.map(t => {
                const toolSlug = toolMap.get(t.toLowerCase());
                return toolSlug ? (
                  <Link key={t} href={`/ai-tools/${toolSlug}`} style={{ padding: "6px 14px", fontSize: "var(--text-xs)", fontWeight: 600, background: "var(--color-bg-tertiary)", color: "var(--color-accent)", textDecoration: "none" }}>{t}</Link>
                ) : (
                  <span key={t} style={{ padding: "6px 14px", fontSize: "var(--text-xs)", fontWeight: 600, background: "var(--color-bg-tertiary)", color: "var(--color-text-secondary)" }}>{t}</span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section style={{ borderTop: "1px solid var(--color-border)", paddingTop: "var(--space-xl)" }}>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-l)", fontWeight: 700, marginBottom: "var(--space-l)" }}>Похожие проекты</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 0, border: "1px solid var(--color-border)" }}>
              {related.map(r => (
                <Link key={r.id} href={"/ai-workshop/" + r.slug} style={{ textDecoration: "none", color: "inherit", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", margin: "-1px 0 0 -1px", padding: "var(--space-l)", transition: "background 0.15s" }} className="workshop-card">
                  <div style={{ fontWeight: 600, fontSize: "var(--text-xs)", marginBottom: 4 }}>{r.title}</div>
                  <span style={{ padding: "2px 6px", fontSize: 10, background: "var(--color-bg-tertiary)" }}>{r.category}</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
