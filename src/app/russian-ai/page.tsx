import { getDb } from "@/lib/db";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Российский AI — карта проектов, моделей и сервисов",
  description: "Полный каталог российских AI-проектов: YandexGPT, GigaChat, Kandinsky, SpeechKit и другие. LLM, генерация изображений, голос, код, бизнес — всё на одной карте.",
  openGraph: {
    title: "Российский AI — карта проектов, моделей и сервисов",
    description: "30+ российских AI-проектов: LLM, изображения, голос, разработка, бизнес.",
    images: [{ url: "https://proektmap.ru/api/og?title=Российский+AI&category=ProektMap&author=Карта+проектов", width: 1200, height: 630 }],
  },
};

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

const PRICING_LABELS: Record<string, string> = {
  free: "Бесплатно",
  freemium: "Freemium",
  paid: "Платно",
};

export default async function RussianAIPage() {
  const db = await getDb();
  const projects = await db.russianAIProject.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: "asc" },
  });

  const categories = [...new Set(projects.map(p => p.category))];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "var(--space-xl) var(--space-m)", fontFamily: "var(--font-body)" }}>
      <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(28px,5vw,40px)", fontWeight: 900, margin: "0 0 var(--space-s)" }}>
        🇷🇺 Российский AI
      </h1>
      <p style={{ fontSize: "var(--text-m)", color: "var(--color-text-secondary)", marginBottom: "var(--space-xl)", maxWidth: 700 }}>
        Карта российского AI-рынка: {projects.length} проектов — от больших языковых моделей до промышленных решений.
      </p>

      {categories.map(cat => {
        const catProjects = projects.filter(p => p.category === cat);
        const info = CATEGORIES[cat] || { emoji: "📌", label: cat };
        return (
          <section key={cat} style={{ marginBottom: "var(--space-xl)" }}>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-l)", fontWeight: 700, margin: "0 0 var(--space-m)" }}>
              {info.emoji} {info.label}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "var(--space-m)" }}>
              {catProjects.map(p => (
                <div key={p.slug} style={{
                  padding: "var(--space-l)", background: "var(--color-bg-primary)",
                  border: "1px solid var(--color-border)", borderRadius: "var(--radius-l)",
                  display: "flex", flexDirection: "column", gap: "var(--space-s)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-s)" }}>
                    <div style={{ width: 40, height: 40, background: "var(--color-bg-secondary)", borderRadius: "var(--radius-m)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                      {p.logo ? <img src={p.logo} alt="" style={{ width: 32, height: 32, objectFit: "contain" }} /> : info.emoji}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: "var(--text-s)" }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>{p.company}</div>
                    </div>
                  </div>
                  {p.description && <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.6, margin: 0 }}>{p.description.slice(0, 120)}</p>}
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 10, padding: "2px 8px", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-s)", color: "var(--color-text-secondary)" }}>
                      {PRICING_LABELS[p.pricing] || p.pricing}
                    </span>
                    {p.hasApi && <span style={{ fontSize: 10, padding: "2px 8px", background: "var(--color-accent-light)", borderRadius: "var(--radius-s)", color: "var(--color-accent)", fontWeight: 600 }}>API</span>}
                    {p.isOpenSource && <span style={{ fontSize: 10, padding: "2px 8px", background: "#fef3c7", borderRadius: "var(--radius-s)", color: "#92400e", fontWeight: 600 }}>Open Source</span>}
                    <span style={{ fontSize: 10, padding: "2px 8px", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-s)", color: "var(--color-text-tertiary)" }}>★ {p.rating}</span>
                  </div>
                  {p.website && (
                    <a href={p.website} target="_blank" rel="noopener" style={{ fontSize: "var(--text-xs)", color: "var(--color-accent)", textDecoration: "none", fontWeight: 600 }}>
                      {p.website.replace("https://", "").split("/")[0]} →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
