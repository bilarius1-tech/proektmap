"use client";

import { Edit, Trash2, Copy } from "lucide-react";
import Link from "next/link";
import DataTable from "@/components/admin/data-table";

const DEPTH_FIELDS = ["problem", "why", "context", "constraints", "recommended", "content", "tradeoffs", "whenNotUse", "mistakes", "validation", "iteration", "promptTemplate"];

function completeness(d: any) {
  const filled = DEPTH_FIELDS.filter(f => d[f]?.trim()).length;
  const pct = Math.round((filled / DEPTH_FIELDS.length) * 100);
  const color = pct === 100 ? "var(--color-accent)" : pct >= 50 ? "#f59e0b" : "var(--color-error)";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ width: 48, height: 5, borderRadius: 3, background: "var(--color-border-light)", overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 3, transition: "width 0.3s" }} />
      </div>
      <span style={{ fontSize: "var(--text-xs)", color, fontWeight: 600, minWidth: 28 }}>{filled}/12</span>
    </div>
  );
}

export default function DecTable({ decisions }: { decisions: any[] }) {
  return (
    <DataTable
      data={decisions}
      searchFields={["title", "slug", "problem"]}
      searchPlaceholder="Поиск по названию, slug или проблеме..."
      pageSize={15}
      columns={[
        { key: "stage", header: "Этап", render: (r: any) => <span style={{ color: "var(--color-text-secondary)" }}>{r.stage?.title || "—"}</span> },
        { key: "title", header: "Название", render: (r: any) => <span style={{ fontWeight: 600 }}>{r.title}</span> },
        { key: "completeness", header: "Заполнено", render: (r: any) => completeness(r), width: "120px" },
        { key: "xpReward", header: "XP", render: (r: any) => <span className="badge" style={{ background: "var(--color-accent-light)", color: "var(--color-accent)" }}>+{r.xpReward}</span>, width: "80px" },
        { key: "promptTemplate", header: "Промпт", render: (r: any) => r.promptTemplate ? <span className="badge" style={{ background: "var(--color-accent-light)", color: "var(--color-accent)" }}><Copy size={10} /> шаблон</span> : <span style={{ color: "var(--color-text-tertiary)", fontSize: "var(--text-xs)" }}>—</span>, width: "100px" },
      ]}
      actions={(r: any) => (
        <>
          <Link href={`/admin/decisions/${r.id}`} className="btn btn-ghost" style={{ padding: "4px 8px" }}><Edit size={14} /></Link>
          <form action={async (fd: FormData) => { await fetch("/api/admin/decisions?id=" + fd.get("id"), { method: "DELETE" }); location.reload(); }} style={{ display: "inline" }}>
            <input type="hidden" name="id" value={r.id} />
            <button type="submit" onClick={e => { if (!confirm("Удалить?")) e.preventDefault(); }} className="btn btn-ghost" style={{ padding: "4px 8px", color: "var(--color-error)" }}><Trash2 size={14} /></button>
          </form>
        </>
      )}
    />
  );
}
