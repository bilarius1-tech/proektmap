"use client";

import { Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import DataTable from "@/components/admin/data-table";

export default function BPTable({ blueprints }: { blueprints: any[] }) {
  return (
    <DataTable
      data={blueprints}
      searchFields={["title", "slug", "description"]}
      searchPlaceholder="Поиск по названию или slug..."
      columns={[
        { key: "title", header: "Название", render: (r: any) => <span style={{ fontWeight: 600 }}>{r.title}</span> },
        { key: "slug", header: "Slug", render: (r: any) => <span style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)" }}>{r.slug}</span> },
        { key: "stages", header: "Этапов", render: (r: any) => <span className="badge" style={{ background: "var(--color-accent-light)", color: "var(--color-accent)" }}>{r.stages?.length || 0}</span>, width: "80px" },
        { key: "totalXp", header: "XP", render: (r: any) => <span className="badge" style={{ background: "var(--color-accent-light)", color: "var(--color-accent)" }}>{r.totalXp}</span>, width: "70px" },
        { key: "isPublished", header: "Статус", render: (r: any) => r.isPublished
          ? <span className="badge" style={{ background: "var(--color-accent-light)", color: "var(--color-accent)" }}>Опубл.</span>
          : <span className="badge" style={{ background: "var(--color-bg-tertiary)", color: "var(--color-text-tertiary)" }}>Черновик</span>, width: "100px" },
      ]}
      actions={(r: any) => (
        <>
          <Link href={`/admin/blueprints/${r.id}`} className="btn btn-ghost" style={{ padding: "4px 8px" }}><Edit size={14} /></Link>
          <a href={`/${r.slug}`} target="_blank" className="btn btn-ghost" style={{ padding: "4px 8px" }}><Eye size={14} /></a>
          <form onSubmit={async (e) => { e.preventDefault(); if (!confirm("Удалить?")) return; await fetch("/api/admin/blueprints?id=" + r.id, { method: "DELETE" }); location.reload(); }} style={{ display: "inline" }}>
            <button type="submit" className="btn btn-ghost" style={{ padding: "4px 8px", color: "var(--color-error)" }}><Trash2 size={14} /></button>
          </form>
        </>
      )}
    />
  );
}
