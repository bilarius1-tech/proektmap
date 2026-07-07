"use client";

import { Edit, Trash2, Copy } from "lucide-react";
import Link from "next/link";
import DataTable from "@/components/admin/data-table";

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
        { key: "slug", header: "Slug", render: (r: any) => <span style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)" }}>{r.slug}</span> },
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
