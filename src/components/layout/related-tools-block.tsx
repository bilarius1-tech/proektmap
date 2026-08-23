import { getDb } from "@/lib/db";
import Link from "next/link";
import { Wrench, ArrowRight } from "lucide-react";

// Server component — fetches related AiTools for a Blueprint
export default async function RelatedToolsBlock({ blueprintSlug }: { blueprintSlug: string }) {
  let tools: any[] = [];
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://proektmap.ru";
    const res = await fetch(`${siteUrl}/api/graph/node?type=blueprint&slug=${blueprintSlug}`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      tools = data.tools || [];
    }
  } catch (e) {}

  if (tools.length === 0) return null;

  return (
    <section style={{ marginTop: "var(--space-xl)", padding: "var(--space-xl)", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-l)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-s)", marginBottom: "var(--space-m)" }}>
        <Wrench size={20} style={{ color: "var(--color-accent)" }} />
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-l)", fontWeight: 700, margin: 0 }}>
          🛠 Инструменты для этого пути
        </h2>
        <Link href="/ai-tools" style={{ marginLeft: "auto", fontSize: "var(--text-xs)", color: "var(--color-accent)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
          Все инструменты <ArrowRight size={14} />
        </Link>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "var(--space-s)" }}>
        {tools.map((t: any) => (
          <Link
            key={t.slug}
            href={`/ai-tools/${t.slug}`}
            style={{
              display: "flex", alignItems: "center", gap: "var(--space-s)",
              padding: "var(--space-m)", background: "var(--color-bg-primary)",
              border: "1px solid var(--color-border-light)", borderRadius: "var(--radius-m)",
              textDecoration: "none", color: "inherit",
              transition: "border-color 0.15s, box-shadow 0.15s",
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "var(--text-s)", fontWeight: 600 }}>{t.name}</div>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginTop: 2 }}>
                {t.type || "Инструмент"} {t.rating ? `· ★ ${t.rating}` : ""} {t.pricingAmount ? `· ${t.pricingAmount}` : ""}
              </div>
            </div>
            <ArrowRight size={14} style={{ color: "var(--color-text-tertiary)", flexShrink: 0 }} />
          </Link>
        ))}
      </div>
    </section>
  );
}
