import { getDb } from "@/lib/db";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Российский AI — карта проектов, моделей и сервисов",
  description: "Полный каталог российских AI-проектов: 45+ сервисов — LLM, генерация изображений, голос, код, бизнес. Карта рынка с фильтрами.",
  openGraph: {
    title: "Российский AI — 45+ проектов на карте рынка",
    description: "YandexGPT, GigaChat, Kandinsky, SpeechKit и другие российские AI-проекты.",
    images: [{ url: "https://proektmap.ru/api/og?title=Российский+AI&category=ProektMap&author=45+проектов", width: 1200, height: 630 }],
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
  free: "Бесплатно", freemium: "Freemium", paid: "Платно",
};

export default async function RussianAIPage({ searchParams }: { searchParams: Promise<{ q?: string; api?: string; oss?: string; free?: string }> }) {
  const { q, api, oss, free } = await searchParams;
  const db = await getDb();
  
  const where: any = { isPublished: true };
  if (q) where.name = { contains: q, mode: "insensitive" };
  if (api === "1") where.hasApi = true;
  if (oss === "1") where.isOpenSource = true;
  if (free === "1") where.pricing = "free";

  const projects = await db.russianAIProject.findMany({ where, orderBy: { sortOrder: "asc" } });
  const total = await db.russianAIProject.count({ where: { isPublished: true } });

  const categories = [...new Set(projects.map(p => p.category))];
  const hasFilters = !!(q || api || oss || free);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "var(--space-xl) var(--space-m)", fontFamily: "var(--font-body)" }}>
      <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(28px,5vw,40px)", fontWeight: 900, margin: "0 0 var(--space-s)" }}>
      <div style={{ background: "#f0f7ff", border: "1px solid #93c5fd", padding: "10px var(--space-m)", borderRadius: "var(--radius-m)", marginBottom: "var(--space-l)", fontSize: "var(--text-xs)", display: "inline-block" }}>📖 <a href="/russian-ai-stack" style={{ color: "#2563eb", fontWeight: 700 }}>Подробный обзор и сравнение</a> — YandexGPT vs GigaChat, цены, API, примеры кода</div><br/>
        🇷🇺 Российский AI
      </h1>
      <p style={{ fontSize: "var(--text-m)", color: "var(--color-text-secondary)", marginBottom: "var(--space-l)", maxWidth: 700 }}>
        {hasFilters ? `Найдено: ${projects.length} из ${total} проектов` : `Карта российского AI-рынка: ${total} проектов — от больших языковых моделей до промышленных решений.`}
      </p>

      {/* Search + Filters */}
      <div style={{ display: "flex", gap: "var(--space-s)", flexWrap: "wrap", marginBottom: "var(--space-xl)", alignItems: "center" }}>
        <form style={{ flex: 1, minWidth: 250, display: "flex", gap: 0 }}>
          <input name="q" defaultValue={q || ""} placeholder="Поиск по названию..."
            style={{ flex: 1, padding: "10px 16px", border: "1px solid var(--color-border)", fontSize: "var(--text-s)", borderRadius: "var(--radius-m) 0 0 var(--radius-m)", outline: "none", background: "var(--color-bg-primary)", color: "var(--color-text-primary)" }} />
          <button type="submit" style={{ padding: "10px 16px", border: "1px solid var(--color-accent)", background: "var(--color-accent)", color: "white", fontWeight: 600, fontSize: "var(--text-s)", cursor: "pointer", borderRadius: "0 var(--radius-m) var(--radius-m) 0" }}>
            🔍
          </button>
        </form>
        <a href="?api=1" style={{ padding: "8px 14px", background: api ? "var(--color-accent-light)" : "var(--color-bg-secondary)", border: `1px solid ${api ? "var(--color-accent)" : "var(--color-border)"}`, borderRadius: "var(--radius-m)", fontSize: "var(--text-xs)", textDecoration: "none", color: api ? "var(--color-accent)" : "var(--color-text-secondary)", fontWeight: 600 }}>
          {api ? "✓ API" : "API"}
        </a>
        <a href="?oss=1" style={{ padding: "8px 14px", background: oss ? "var(--color-accent-light)" : "var(--color-bg-secondary)", border: `1px solid ${oss ? "var(--color-accent)" : "var(--color-border)"}`, borderRadius: "var(--radius-m)", fontSize: "var(--text-xs)", textDecoration: "none", color: oss ? "var(--color-accent)" : "var(--color-text-secondary)", fontWeight: 600 }}>
          {oss ? "✓ Open Source" : "Open Source"}
        </a>
        <a href="?free=1" style={{ padding: "8px 14px", background: free ? "var(--color-accent-light)" : "var(--color-bg-secondary)", border: `1px solid ${free ? "var(--color-accent)" : "var(--color-border)"}`, borderRadius: "var(--radius-m)", fontSize: "var(--text-xs)", textDecoration: "none", color: free ? "var(--color-accent)" : "var(--color-text-secondary)", fontWeight: 600 }}>
          {free ? "✓ Бесплатно" : "Бесплатно"}
        </a>
        {hasFilters && <a href="/russian-ai" style={{ padding: "8px 14px", fontSize: "var(--text-xs)", color: "var(--color-error)", textDecoration: "none" }}>✕ Сбросить</a>}
      </div>

      {projects.length === 0 && (
        <div style={{ textAlign: "center", padding: "var(--space-xl)", color: "var(--color-text-tertiary)" }}>
          Ничего не найдено. <a href="/russian-ai" style={{ color: "var(--color-accent)" }}>Сбросить фильтры</a>
        </div>
      )}

      {categories.map(cat => {
        const catProjects = projects.filter(p => p.category === cat);
        const info = CATEGORIES[cat] || { emoji: "📌", label: cat };
        return (
          <section key={cat} style={{ marginBottom: "var(--space-xl)" }}>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-l)", fontWeight: 700, margin: "0 0 var(--space-m)" }}>
              {info.emoji} {info.label} <span style={{ fontSize: "var(--text-s)", color: "var(--color-text-tertiary)", fontWeight: 400 }}>({catProjects.length})</span>
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "var(--space-m)" }}>
              {catProjects.map(p => (
                <Link key={p.slug} href={`/russian-ai/${p.slug}`} style={{
                  padding: "var(--space-l)", background: "var(--color-bg-primary)",
                  border: "1px solid var(--color-border)", borderRadius: "var(--radius-l)",
                  display: "flex", flexDirection: "column", gap: "var(--space-s)",
                  textDecoration: "none", color: "inherit",
                  transition: "border-color 0.15s, box-shadow 0.15s",
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
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
