import { getDb } from "@/lib/db";
import Link from "next/link";
import { Compass, ArrowRight } from "lucide-react";

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "#0FB880",
  medium: "#F59E0B",
  hard: "#EF4444",
};

// Server component — fetches related Blueprints for a Tool
export default async function RelatedBlueprintsBlock({ toolSlug }: { toolSlug: string }) {
  let blueprints: any[] = [];
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://proektmap.ru";
    const res = await fetch(`${siteUrl}/api/graph/node?type=aitool&slug=${toolSlug}`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      blueprints = data.blueprints || [];
    }
  } catch (e) {}

  if (blueprints.length === 0) return null;

  return (
    <section style={{ marginTop: "var(--space-xl)", padding: "var(--space-xl)", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-l)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-s)", marginBottom: "var(--space-m)" }}>
        <Compass size={20} style={{ color: "var(--color-accent)" }} />
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-l)", fontWeight: 700, margin: 0 }}>
          🗺 В каких путях используется
        </h2>
        <Link href="/blueprints" style={{ marginLeft: "auto", fontSize: "var(--text-xs)", color: "var(--color-accent)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
          Все Blueprint'ы <ArrowRight size={14} />
        </Link>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "var(--space-s)" }}>
        {blueprints.map((bp: any) => (
          <Link
            key={bp.slug}
            href={`/blueprints/${bp.slug}`}
            style={{
              display: "flex", alignItems: "center", gap: "var(--space-s)",
              padding: "var(--space-m)", background: "var(--color-bg-primary)",
              border: "1px solid var(--color-border-light)", borderRadius: "var(--radius-m)",
              textDecoration: "none", color: "inherit",
              transition: "border-color 0.15s, box-shadow 0.15s",
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "var(--text-s)", fontWeight: 600 }}>{bp.title}</div>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginTop: 2, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{
                  display: "inline-block", width: 8, height: 8, borderRadius: "50%",
                  background: DIFFICULTY_COLORS[bp.difficulty] || "#999",
                }} />
                {bp.difficulty === "easy" ? "Лёгкий" : bp.difficulty === "hard" ? "Сложный" : "Средний"}
              </div>
            </div>
            <ArrowRight size={14} style={{ color: "var(--color-text-tertiary)", flexShrink: 0 }} />
          </Link>
        ))}
      </div>
    </section>
  );
}
