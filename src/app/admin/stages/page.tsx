import { getDb } from "@/lib/db";
import { Plus, Edit, Trash2 } from "lucide-react";

export default async function StagesAdmin() {
  const db = await getDb();
  const stages = await db.stage.findMany({ orderBy: { sortOrder: "asc" }, include: { decisions: true, blueprints: true } });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-l)" }}>
        <div>
          <h1 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-2xs)" }}>Этапы</h1>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-s)" }}>{stages.length} этапов</p>
        </div>
        <button className="btn btn-primary"><Plus size={16} /> Добавить этап</button>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--color-bg-secondary)", borderBottom: "1px solid var(--color-border)" }}>
              {["№", "Название", "Slug", "Решений", "Blueprints", ""].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stages.map(s => (
              <tr key={s.id} style={{ borderBottom: "1px solid var(--color-border-light)" }}>
                <td style={{ padding: "12px 16px", color: "var(--color-text-tertiary)", fontSize: "var(--text-s)" }}>{s.sortOrder}</td>
                <td style={{ padding: "12px 16px", fontWeight: 600 }}>{s.title}</td>
                <td style={{ padding: "12px 16px", color: "var(--color-text-secondary)", fontSize: "var(--text-s)", fontFamily: "var(--font-mono)" }}>{s.slug}</td>
                <td style={{ padding: "12px 16px" }}><span className="badge" style={{ background: "var(--color-accent-light)", color: "var(--color-accent)" }}>{s.decisions.length}</span></td>
                <td style={{ padding: "12px 16px", color: "var(--color-text-secondary)", fontSize: "var(--text-s)" }}>{s.blueprints.length}</td>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button className="btn btn-ghost" style={{ padding: "4px 8px" }}><Edit size={14} /></button>
                    <button className="btn btn-ghost" style={{ padding: "4px 8px", color: "var(--color-error)" }}><Trash2 size={14} /></button>
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
