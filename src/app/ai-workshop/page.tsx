import { getDb } from "@/lib/db/index";
import Link from "next/link";
import { ArrowRight, Eye, Star, ExternalLink, Wrench, Cpu, Globe, Plus, Flame, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "AI Цех и Портфолио вайбкодеров — реальные проекты на AI | ProektMap",
  description: "Витрина реальных проектов, ботов, SaaS и сервисов, созданных с помощью AI: Cursor, Claude 3.7, DeepSeek. Кейсы, стек, AI-рецепты и портфолио разработчиков.",
  openGraph: {
    title: "AI Цех — портфолио вайбкодеров и AI-инженеров",
    description: "Реальные проекты от разработчиков: сайты, Telegram-боты, SaaS, игры — построенные с помощью нейросетей. Стек, инструменты, кейсы.",
    images: [{ url: "https://proektmap.ru/api/og?title=AI+Цех&category=Проекты&author=AI-проекты", width: 1200, height: 630 }],
  },
};

export default async function AiWorkshopPage({ searchParams }: { searchParams: Promise<{ lang?: string; cat?: string }> }) {
  const { lang, cat } = await searchParams;
  const db = await getDb();

  const where: any = { isPublished: true };
  if (lang && lang !== "all") where.language = lang;
  if (cat && cat !== "all") where.category = cat;

  const projects = await db.aiProject.findMany({
    where,
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    include: {
      user: {
        select: { id: true, name: true, email: true, avatar: true, status: true, headline: true },
      },
    },
  });

  const allProjects = await db.aiProject.findMany({ where: { isPublished: true }, select: { category: true, language: true } });
  const categories = [...new Set(allProjects.map((p) => p.category))];
  const languages = [...new Set(allProjects.map((p) => p.language))];
  const langLabels: Record<string, string> = { ru: "🇷🇺 Российские", en: "🇬🇧 English" };

  return (
    <div style={{ fontFamily: "var(--font-body)", background: "var(--color-bg-primary)", color: "var(--color-text-primary)", minHeight: "100vh" }}>

      {/* HERO */}
      <div style={{ padding: "var(--space-xxl) var(--space-m) var(--space-xl)", textAlign: "center", borderBottom: "1px solid var(--color-border)", background: "var(--color-surface, #fff)" }}>
        <div style={{ maxWidth: 740, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 14px", background: "rgba(15, 184, 128, 0.1)", color: "var(--color-accent)", fontSize: "var(--text-xs)", fontWeight: 700, marginBottom: "var(--space-m)", borderRadius: 20 }}>
            <Sparkles size={14} /> Витрина работ сообщества
          </div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(32px, 5vw, 46px)", fontWeight: 800, lineHeight: 1.1, margin: "0 0 var(--space-s)", letterSpacing: "-0.02em" }}>
            AI Цех & Портфолио вайбкодеров
          </h1>
          <p style={{ fontSize: "var(--text-m)", color: "var(--color-text-secondary)", lineHeight: 1.7, margin: "0 0 var(--space-l)" }}>
            Каталог работающих цифровых продуктов, созданных AI-инженерами и вайбкодерами. Изучайте AI-рецепты, архитектуру и делитесь своими работами.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/projects/new"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 28px",
                borderRadius: "var(--radius-m)",
                background: "var(--color-accent)",
                color: "#fff",
                textDecoration: "none",
                fontSize: "var(--text-s)",
                fontWeight: 700,
                boxShadow: "0 4px 14px rgba(15, 184, 128, 0.25)",
              }}
            >
              <Plus size={16} /> Опубликовать свою работу (+150 XP)
            </Link>
            <Link
              href="/specialists"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "14px 24px",
                borderRadius: "var(--radius-m)",
                background: "var(--color-bg-primary)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text-primary)",
                textDecoration: "none",
                fontSize: "var(--text-s)",
                fontWeight: 600,
              }}
            >
              Смотреть профили специалистов →
            </Link>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 var(--space-m) var(--space-xxl)" }}>

        {/* Filter Toolbar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "var(--space-xl) 0 var(--space-m)", flexWrap: "wrap", gap: 16 }}>
          
          {/* Categories */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-text-secondary)", marginRight: 4 }}>Категория:</span>
            <FilterLink href={`/ai-workshop${lang ? "?lang=" + lang : ""}`} active={!cat || cat === "all"} label="Все направления" />
            {categories.map((c) => (
              <FilterLink key={c} href={`/ai-workshop?cat=${c}${lang ? "&lang=" + lang : ""}`} active={cat === c} label={c} />
            ))}
          </div>

          {/* Languages */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-text-secondary)", marginRight: 4 }}>Язык:</span>
            <FilterLink href="/ai-workshop" active={!lang || lang === "all"} label="🌍 Все" />
            {languages.map((l) => (
              <FilterLink key={l} href={`/ai-workshop?lang=${l}${cat ? "&cat=" + cat : ""}`} active={lang === l} label={langLabels[l] || l} />
            ))}
          </div>
        </div>

        {/* Grid (Behance Style) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 24,
          }}
        >
          {projects.map((project: any) => {
            const authorName = project.user?.name || project.authorName || "Вайбкодер";
            const authorAvatar = project.user?.avatar || project.authorAvatar || "";
            const authorProfileUrl = project.userId ? `/profile/${project.userId}` : project.authorUrl || "#";
            const aiList = (project.aiTools || "").split(",").map((s: string) => s.trim()).filter(Boolean);

            return (
              <div
                key={project.id}
                style={{
                  background: "var(--color-surface, #fff)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-l)",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
              >
                {/* Screenshot Cover */}
                <Link
                  href={`/ai-workshop/${project.slug}`}
                  style={{
                    display: "block",
                    width: "100%",
                    aspectRatio: "16/10",
                    background: project.screenshot ? `url(${project.screenshot}) center/cover` : "linear-gradient(135deg, #0f172a, #1e293b)",
                    position: "relative",
                    textDecoration: "none",
                  }}
                >
                  {!project.screenshot && (
                    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.7)", textAlign: "center", padding: 16 }}>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{project.title}</div>
                    </div>
                  )}
                  <span
                    style={{
                      position: "absolute",
                      top: 10,
                      left: 10,
                      padding: "3px 8px",
                      borderRadius: 4,
                      fontSize: 10,
                      fontWeight: 700,
                      background: "rgba(0,0,0,0.75)",
                      color: "#fff",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    {project.category}
                  </span>
                  {project.timeSpent && (
                    <span
                      style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        padding: "3px 8px",
                        borderRadius: 4,
                        fontSize: 10,
                        fontWeight: 700,
                        background: "rgba(15, 184, 128, 0.85)",
                        color: "#fff",
                        backdropFilter: "blur(4px)",
                      }}
                    >
                      ⚡ {project.timeSpent}
                    </span>
                  )}
                </Link>

                {/* Body */}
                <div style={{ padding: "20px", display: "flex", flexDirection: "column", flex: 1 }}>
                  
                  <Link
                    href={`/ai-workshop/${project.slug}`}
                    style={{ textDecoration: "none", color: "inherit", marginBottom: 8 }}
                  >
                    <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-m)", fontWeight: 800, margin: 0, lineHeight: 1.3 }}>
                      {project.title}
                    </h3>
                  </Link>

                  <p style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.6, margin: "0 0 14px", flex: 1, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {project.description}
                  </p>

                  {/* AI Tools */}
                  {aiList.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 14 }}>
                      {aiList.slice(0, 3).map((t: string) => (
                        <span key={t} style={{ fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 3, background: "rgba(15, 184, 128, 0.08)", color: "var(--color-accent)" }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Author & Stats Footer */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--color-border)", paddingTop: 12, marginTop: "auto" }}>
                    <Link
                      href={authorProfileUrl}
                      style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", color: "inherit", minWidth: 0 }}
                    >
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background: authorAvatar ? `url(${authorAvatar}) center/cover` : "var(--color-bg-secondary)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 12,
                          fontWeight: 700,
                          flexShrink: 0,
                          border: "1px solid var(--color-border)",
                        }}
                      >
                        {!authorAvatar && authorName[0].toUpperCase()}
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {authorName}
                      </span>
                    </Link>

                    <div style={{ display: "flex", gap: 10, fontSize: 11, color: "var(--color-text-tertiary)", flexShrink: 0 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                        <Flame size={13} color="#ef4444" /> {project.likesCount || 0}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                        <Eye size={13} /> {project.viewCount || 0}
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {projects.length === 0 && (
          <div style={{ textAlign: "center", padding: "var(--space-xxl)", color: "var(--color-text-tertiary)", background: "var(--color-surface, #fff)", borderRadius: "var(--radius-l)", border: "1px dashed var(--color-border)", marginTop: 20 }}>
            <Globe size={48} style={{ marginBottom: "var(--space-m)", opacity: 0.3 }} />
            <p style={{ fontSize: "var(--text-l)", fontWeight: 700 }}>Нет проектов в этой категории</p>
            <p style={{ fontSize: "var(--text-s)", marginBottom: 16 }}>Будьте первым, кто опубликует работу в этой категории!</p>
            <Link
              href="/projects/new"
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", background: "var(--color-accent)", color: "#fff", textDecoration: "none", borderRadius: 6, fontSize: "var(--text-xs)", fontWeight: 700 }}
            >
              <Plus size={14} /> Добавить работу
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}

function FilterLink({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      style={{
        padding: "6px 14px",
        borderRadius: 20,
        fontSize: "var(--text-xs)",
        fontWeight: 600,
        background: active ? "var(--color-accent)" : "var(--color-surface, #fff)",
        color: active ? "#fff" : "var(--color-text-secondary)",
        border: active ? "1px solid var(--color-accent)" : "1px solid var(--color-border)",
        textDecoration: "none",
        transition: "all 0.15s",
      }}
    >
      {label}
    </Link>
  );
}
