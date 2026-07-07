"use client";

import { Edit, Trash2, Copy } from "lucide-react";
import DataTable from "@/components/admin/data-table";

export default function SkillsTable({ skills }: { skills: any[] }) {
  return (
    <DataTable
      data={skills}
      searchFields={["title", "slug", "description"]}
      searchPlaceholder="Поиск по названию..."
      columns={[
        { key: "title", header: "Название", render: (r: any) => <span style={{ fontWeight: 600 }}>{r.title}</span> },
        { key: "slug", header: "Slug", render: (r: any) => <span style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)" }}>{r.slug}</span> },
        { key: "difficulty", header: "Сложность", render: (r: any) => <span className="badge" style={{ background: r.difficulty === "hard" ? "var(--color-error-light)" : "var(--color-accent-light)", color: r.difficulty === "hard" ? "var(--color-error)" : "var(--color-accent)" }}>{r.difficulty}</span>, width: "80px" },
        { key: "xpReward", header: "XP", render: (r: any) => <span className="badge" style={{ background: "var(--color-accent-light)", color: "var(--color-accent)" }}>+{r.xpReward}</span>, width: "60px" },
        { key: "isPublished", header: "Статус", render: (r: any) => r.isPublished ? <span className="badge" style={{ background: "var(--color-accent-light)", color: "var(--color-accent)" }}>Опубл.</span> : <span className="badge" style={{ background: "var(--color-bg-tertiary)", color: "var(--color-text-tertiary)" }}>Черновик</span>, width: "90px" },
      ]}
      actions={(r: any) => (
        <>
          <button className="btn btn-ghost" style={{ padding: "4px 8px" }}><Edit size={14} /></button>
          <button className="btn btn-ghost" style={{ padding: "4px 8px", color: "var(--color-error)" }}><Trash2 size={14} /></button>
        </>
      )}
    />
  );
}
