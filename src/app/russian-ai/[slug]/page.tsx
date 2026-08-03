import { getDb } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { slug } = await params;
  const db = await getDb();
  const p = await db.russianAIProject.findUnique({ where: { slug } });
  if (!p) return { title: "Не найдено" };
  return {
    title: `${p.name} (${p.company}) — российский AI-проект`,
    description: p.description || `${p.name} — ${p.category} проект от ${p.company}. ${p.pricing === "free" ? "Бесплатно" : p.pricing === "freemium" ? "Freemium" : "Платно"}.`,
    openGraph: {
      title: `${p.name} — российский AI от ${p.company}`,
      description: p.description?.slice(0, 200) || "",
      images: p.logo ? [{ url: p.logo, width: 400, height: 400 }] : [],
    },
  };
}

const CATEGORIES: Record<string, { emoji: string; label: string }> = {
  LLM: { emoji: "🤖", label: "Языковые модели" },
  Image: { emoji: "🎨", label: "Изображения" },
  Voice: { emoji: "🎤", label: "Голос и речь" },
  Code: { emoji: "💻", label: "Для разработчиков" },
  Business: { emoji: "🏭", label: "AI для бизнеса" },
  OpenSource: { emoji: "🚀", label: "Open Source" },
  Assistant: { emoji: "💬", label: "Ассистенты" },
  Agent: { emoji: "🧠", label: "AI-агенты" },
};

export default async function RussianAIProjectPage({ params }: any) {
  const { slug } = await params;
  const db = await getDb();
  const p = await db.russianAIProject.findUnique({ where: { slug } });
  if (!p) notFound();

  const info = CATEGORIES[p.category] || { emoji: "📌", label: p.category };
  const useCases: string[] = parseField(p.useCases);
  const howToStart: string[] = parseField(p.howToStart);
  const related = await db.russianAIProject.findMany({
    where: { category: p.category, slug: { not: slug }, isPublished: true },
    take: 4,
    select: { name: true, slug: true, company: true },
  });

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "var(--space-xl) var(--space-m)", fontFamily: "var(--font-body)" }}>
      <Link href="/russian-ai" style={{ fontSize: "var(--text-xs)", color: "var(--color-accent)", textDecoration: "none" }}>← Все проекты</Link>
      
      <div style={{ display: "flex", gap: "var(--space-l)", marginTop: "var(--space-l)", marginBottom: "var(--space-xl)", alignItems: "flex-start" }}>
        <div style={{ width: 80, height: 80, background: "var(--color-bg-secondary)", borderRadius: "var(--radius-l)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, flexShrink: 0, border: "1px solid var(--color-border)" }}>
          {p.logo ? <img src={p.logo} alt="" style={{ width: 64, height: 64, objectFit: "contain" }} /> : info.emoji}
        </div>
        <div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(24px,4vw,36px)", fontWeight: 900, margin: "0 0 var(--space-s)" }}>
            {p.name}
          </h1>
          <div style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)", marginBottom: "var(--space-s)" }}>
            {p.company} · {info.emoji} {info.label}
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: "var(--text-xs)", padding: "4px 12px", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-m)", fontWeight: 600 }}>
              {p.pricing === "free" ? "🆓 Бесплатно" : p.pricing === "freemium" ? "🔄 Freemium" : "💳 Платно"}
            </span>
            {p.hasApi && <span style={{ fontSize: "var(--text-xs)", padding: "4px 12px", background: "var(--color-accent-light)", borderRadius: "var(--radius-m)", color: "var(--color-accent)", fontWeight: 600 }}>🔌 API</span>}
            {p.isOpenSource && <span style={{ fontSize: "var(--text-xs)", padding: "4px 12px", background: "#fef3c7", borderRadius: "var(--radius-m)", color: "#92400e", fontWeight: 600 }}>📖 Open Source</span>}
            <span style={{ fontSize: "var(--text-xs)", padding: "4px 12px", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-m)" }}>★ {p.rating}/10</span>
          </div>
        </div>
      </div>

      {p.description && (
        <p style={{ fontSize: "var(--text-m)", lineHeight: 1.8, color: "var(--color-text-secondary)", marginBottom: "var(--space-xl)" }}>
          {p.description}
        </p>
      )}

      {p.website && (
        <a href={p.website} target="_blank" rel="noopener" style={{
          display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px",
          background: "var(--color-accent)", color: "white", textDecoration: "none",
          fontWeight: 700, fontSize: "var(--text-s)", borderRadius: "var(--radius-m)",
          marginBottom: "var(--space-xl)",
        }}>
          {p.website.replace("https://", "").split("/")[0]} →
        </a>
      )}

      {useCases.length > 0 && (
        <div style={{ marginBottom: "var(--space-xl)" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-l)", fontWeight: 700, marginBottom: "var(--space-m)" }}>Где используется</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-s)" }}>
            {useCases.map((u: string, i: number) => (
              <span key={i} style={{ padding: "8px 16px", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border-light)", borderRadius: "var(--radius-m)", fontSize: "var(--text-xs)" }}>
                {u}
              </span>
            ))}
          </div>
        </div>
      )}

      {howToStart.length > 0 && (
        <div style={{ marginBottom: "var(--space-xl)", padding: "var(--space-l)", background: "var(--color-accent-light)", border: "1px solid var(--color-accent)", borderRadius: "var(--radius-l)" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-l)", fontWeight: 700, marginBottom: "var(--space-m)" }}>🚀 Как начать</h2>
          <ol style={{ margin: 0, paddingLeft: 20, fontSize: "var(--text-s)", lineHeight: 2 }}>
            {howToStart.map((s: string, i: number) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </div>
      )}

      {related.length > 0 && (
        <div style={{ paddingTop: "var(--space-xl)", borderTop: "1px solid var(--color-border)" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-m)", fontWeight: 700, marginBottom: "var(--space-m)" }}>Похожие проекты</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "var(--space-s)" }}>
            {related.map(r => (
              <Link key={r.slug} href={`/russian-ai/${r.slug}`} style={{
                padding: "var(--space-m)", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border-light)",
                borderRadius: "var(--radius-m)", textDecoration: "none", color: "inherit", fontSize: "var(--text-xs)",
              }}>
                <div style={{ fontWeight: 600 }}>{r.name}</div>
                <div style={{ color: "var(--color-text-tertiary)", fontSize: 11 }}>{r.company}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function parseField(val: string): string[] {
  if (!val || val === "[]") return [];
  try {
    const parsed = JSON.parse(val);
    if (Array.isArray(parsed)) return parsed;
    return [String(parsed)];
  } catch {
    return val.split(/[→•\n,;]/).map(s => s.trim()).filter(Boolean);
  }
}
