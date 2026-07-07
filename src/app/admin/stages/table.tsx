"use client";

import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import DataTable from "@/components/admin/data-table";

export default function StageTable({ stages }: { stages: any[] }) {
  return (
    <DataTable
      data={stages}
      searchFields={["title", "slug"]}
      searchPlaceholder="Поиск по названию этапа..."
      columns={[
        { key: "sortOrder", header: "№", render: (r: any) => <span style={{ color: "var(--color-text-tertiary)" }}>{r.sortOrder}</span>, width: "50px" },
        { key: "title", header: "Название", render: (r: any) => <span style={{ fontWeight: 600 }}>{r.title}</span> },
        { key: "slug", header: "Slug", render: (r: any) => <span style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)" }}>{r.slug}</span> },
        { key: "decisions", header: "Решений", render: (r: any) => <span className="badge" style={{ background: "var(--color-accent-light)", color: "var(--color-accent)" }}>{r.decisions?.length || 0}</span>, width: "80px" },
        { key: "blueprints", header: "В Blueprint'ах", render: (r: any) => <span style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-xs)" }}>{r.blueprints?.map((b: any) => b.blueprint?.title).join(", ") || "—"}</span> },
      ]}
      actions={(r: any) => (
        <>
          <Link href={`/admin/stages/${r.id}`} className="btn btn-ghost" style={{ padding: "4px 8px" }}><Edit size={14} /></Link>
          <form onSubmit={async (e) => { e.preventDefault(); if (!confirm("Удалить?")) return; await fetch("/api/admin/stages?id=" + r.id, { method: "DELETE" }); location.reload(); }} style={{ display: "inline" }}>
            <button type="submit" className="btn btn-ghost" style={{ padding: "4px 8px", color: "var(--color-error)" }}><Trash2 size={14} /></button>
          </form>
        </>
      )}
    />
  );
}
