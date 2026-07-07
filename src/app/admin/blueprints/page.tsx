import { getDb } from "@/lib/db";
import Link from "next/link";
import { Plus, Edit, Eye } from "lucide-react";

export default async function BlueprintsAdmin() {
  const db = await getDb();
  const blueprints = await db.blueprint.findMany({ orderBy: { sortOrder: "asc" }, include: { stages: true } });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-l)" }}>
        <div>
          <h1 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-2xs)" }}>Blueprints</h1>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-s)" }}>Шаблоны проектов</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={16} /> Добавить
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--color-bg-secondary)", borderBottom: "1px solid var(--color-border)" }}>
              {["Название", "Slug", "Этапов", "XP", "Статус", ""].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {blueprints.map(bp => (
              <tr key={bp.id} style={{ borderBottom: "1px solid var(--color-border-light)" }}>
                <td style={{ padding: "12px 16px", fontWeight: 600 }}>{bp.title}</td>
                <td style={{ padding: "12px 16px", color: "var(--color-text-secondary)", fontSize: "var(--text-s)", fontFamily: "var(--font-mono)" }}>{bp.slug}</td>
                <td style={{ padding: "12px 16px", color: "var(--color-text-secondary)", fontSize: "var(--text-s)" }}>{bp.stages.length}</td>
                <td style={{ padding: "12px 16px" }}><span className="badge" style={{ background: "var(--color-accent-light)", color: "var(--color-accent)" }}>{bp.totalXp} XP</span></td>
                <td style={{ padding: "12px 16px" }}>
                  <span className="badge" style={{ background: bp.isPublished ? "var(--color-accent-light)" : "var(--color-bg-tertiary)", color: bp.isPublished ? "var(--color-accent)" : "var(--color-text-tertiary)" }}>
                    {bp.isPublished ? "Опубл." : "Черновик"}
                  </span>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button className="btn btn-ghost" style={{ padding: "4px 8px" }}><Edit size={14} /></button>
                    <a href={`/${bp.slug}`} target="_blank" className="btn btn-ghost" style={{ padding: "4px 8px" }}><Eye size={14} /></a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
