import { getDb } from "@/lib/db";
import Link from "next/link";
import { Plus, Edit, Trash2, Copy } from "lucide-react";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function deleteDecision(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  if (!id) return;
  const db = await getDb();
  await db.decision.delete({ where: { id } });
  revalidatePath("/admin/decisions");
}

export default async function DecisionsAdmin() {
  const db = await getDb();
  const decisions = await db.decision.findMany({ orderBy: { sortOrder: "asc" }, include: { stage: true } });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-l)" }}>
        <div>
          <h1 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-2xs)" }}>Решения</h1>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-s)" }}>{decisions.length} решений</p>
        </div>
        <Link href="/admin/decisions/new" className="btn btn-primary" style={{ textDecoration: "none" }}><Plus size={16} /> Добавить</Link>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--color-bg-secondary)", borderBottom: "1px solid var(--color-border)" }}>
              {["Этап", "Название", "Slug", "XP", "Промпт", ""].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {decisions.map(d => (
              <tr key={d.id} style={{ borderBottom: "1px solid var(--color-border-light)" }}>
                <td style={{ padding: "12px 16px", fontSize: "var(--text-s)", color: "var(--color-text-secondary)" }}>{d.stage?.title || "—"}</td>
                <td style={{ padding: "12px 16px", fontWeight: 600 }}>{d.title}</td>
                <td style={{ padding: "12px 16px", color: "var(--color-text-secondary)", fontSize: "var(--text-s)", fontFamily: "var(--font-mono)" }}>{d.slug}</td>
                <td style={{ padding: "12px 16px" }}><span className="badge" style={{ background: "var(--color-accent-light)", color: "var(--color-accent)" }}>+{d.xpReward}</span></td>
                <td style={{ padding: "12px 16px" }}>{d.promptTemplate ? <span className="badge" style={{ background: "var(--color-accent-light)", color: "var(--color-accent)" }}><Copy size={10} /> шаблон</span> : <span style={{ color: "var(--color-text-tertiary)", fontSize: "var(--text-xs)" }}>—</span>}</td>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", gap: 4 }}>
                    <Link href={`/admin/decisions/${d.id}`} className="btn btn-ghost" style={{ padding: "4px 8px" }}><Edit size={14} /></Link>
                    <form action={deleteDecision} style={{ display: "inline" }}>
                      <input type="hidden" name="id" value={d.id} />
                      <button type="submit" className="btn btn-ghost" style={{ padding: "4px 8px", color: "var(--color-error)" }}><Trash2 size={14} /></button>
                    </form>
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
