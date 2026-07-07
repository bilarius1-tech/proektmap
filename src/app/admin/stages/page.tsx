import { getDb } from "@/lib/db";
import Link from "next/link";
import { Plus } from "lucide-react";
import StageTable from "./table";

export default async function StagesAdmin() {
  const db = await getDb();
  const stages = await db.stage.findMany({ orderBy: { sortOrder: "asc" }, include: { decisions: true, blueprints: { include: { blueprint: true } } } });
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-l)" }}>
        <div>
          <h1 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-2xs)" }}>Этапы</h1>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-s)" }}>{stages.length} этапов</p>
        </div>
        <Link href="/admin/stages/new" className="btn btn-primary" style={{ textDecoration: "none" }}><Plus size={16} /> Добавить</Link>
      </div>
      <StageTable stages={JSON.parse(JSON.stringify(stages))} />
    </div>
  );
}
