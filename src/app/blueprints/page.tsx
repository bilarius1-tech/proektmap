import { getDb } from "@/lib/db/index";
import Link from "next/link";
import { Clock, Target, Database, CheckCircle, Package, ArrowRight, Eye, Globe, Server, Smartphone, Gamepad2 } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Blueprint'ы — готовая дорожная карта проекта",
  description: "Выбери Blueprint под свой проект. Каждый содержит: цель, сущности БД, навыки, чек-лист, артефакты и AI-промпты для каждого этапа.",
};

const ICON_MAP: Record<string, any> = { Globe, Server, Smartphone, Gamepad2 };

export default async function BlueprintsPage() {
  const db = await getDb();
  const blueprints = await db.blueprint.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "var(--space-xl) var(--space-m)", fontFamily: "var(--font-body)" }}>
      <div style={{ textAlign: "center", marginBottom: "var(--space-xl)" }}>
        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(28px, 5vw, 38px)", fontWeight: 800, marginBottom: "var(--space-s)", letterSpacing: "-0.02em" }}>
          Выбери свой Blueprint
        </h1>
        <p style={{ fontSize: "var(--text-m)", color: "var(--color-text-secondary)", maxWidth: 560, margin: "0 auto", lineHeight: 1.6 }}>
          Готовая дорожная карта проекта. Каждый Blueprint — это цель, сущности БД, навыки, чек-лист и AI-промпты для каждого этапа.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "var(--space-l)" }}>
        {blueprints.map((bp: any) => {
          const Icon = ICON_MAP[bp.icon] || Globe;
          const entities = safeJson(bp.entities);
          const skills = safeJson(bp.skills || "[]");
          
          return (
            <Link key={bp.id} href={`/${bp.slug}`} style={{
              textDecoration: "none", color: "inherit",
              background: "var(--color-bg-primary)", border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-m)", overflow: "hidden",
              display: "flex", flexDirection: "column",
              transition: "box-shadow 0.2s, border-color 0.2s",
            }}
            className="card-hover"
            >
              {/* Cover image */}
              {bp.coverImage && (
                <div style={{ height: 180, overflow: "hidden" }}>
                  <img src={bp.coverImage} alt={bp.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              )}
              {/* Header */}
              <div style={{
                padding: bp.coverImage ? "var(--space-l)" : "var(--space-xl) var(--space-l) var(--space-m)",
                background: bp.coverImage ? "var(--color-bg-primary)" : "linear-gradient(135deg, var(--color-accent-light), var(--color-bg-primary))",
                display: "flex", alignItems: "flex-start", gap: "var(--space-m)",
              }}>
                <div style={{
                  width: 56, height: 56, borderRadius: "var(--radius-m)",
                  background: "var(--color-accent)", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  color: "white", flexShrink: 0,
                }}>
                  <Icon size={28} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-accent)",
                    textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4,
                  }}>
                    {bp.difficulty === "easy" ? "Для новичков" : bp.difficulty === "medium" ? "Средний" : "Продвинутый"}
                  </div>
                  <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-l)", fontWeight: 700, margin: 0, lineHeight: 1.2 }}>
                    {bp.title}
                  </h2>
                </div>
              </div>

              {/* Goal */}
              {bp.goal && (
                <div style={{ padding: "0 var(--space-l) var(--space-s)", display: "flex", gap: 8 }}>
                  <Target size={16} style={{ color: "var(--color-accent)", flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.5 }}>{bp.goal}</span>
                </div>
              )}

              {/* Stats */}
              <div style={{ padding: "var(--space-s) var(--space-l)", display: "flex", gap: "var(--space-m)", flexWrap: "wrap" }}>
                {bp.timeToComplete && (
                  <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>
                    <Clock size={14} /> {bp.timeToComplete}
                  </span>
                )}
                <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>
                  <Database size={14} /> {entities.length} сущностей
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>
                  <CheckCircle size={14} /> {bp.totalXp} XP
                </span>
                {bp.viewCount > 0 && <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>
                  <Eye size={14} /> {bp.viewCount}
                </span>}
              </div>

              {/* Bottom */}
              <div style={{
                marginTop: "auto", padding: "var(--space-m) var(--space-l)",
                borderTop: "1px solid var(--color-border)",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <span style={{ fontSize: "var(--text-xs)", color: "var(--color-accent)", fontWeight: 600 }}>
                  {bp.totalDecisions} этапов
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-accent)" }}>
                  Начать путь <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {blueprints.length === 0 && (
        <div style={{ textAlign: "center", padding: "var(--space-xl)", color: "var(--color-text-tertiary)" }}>
          Blueprint'ы скоро появятся. Следите за обновлениями.
        </div>
      )}

      {/* Premium CTA */}
      <div style={{ marginTop: "var(--space-xl)", textAlign: "center" }}>
        <Link href="/blueprints-premium" style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "12px 24px", borderRadius: "var(--radius-m)",
          background: "var(--color-accent-light)", color: "var(--color-accent)",
          textDecoration: "none", fontSize: "var(--text-s)", fontWeight: 600,
          border: "1px solid var(--color-accent)",
        }}>
          <Package size={16} /> Премиум Blueprint'ы — от 990 ₽
        </Link>
      </div>
    </div>
  );
}

function safeJson(s: string): any[] {
  try { return JSON.parse(s); } catch { return []; }
}
