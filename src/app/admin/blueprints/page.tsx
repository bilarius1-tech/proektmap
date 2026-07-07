import { getDb } from "@/lib/db";
import Link from "next/link";
import { Plus } from "lucide-react";
import BPTable from "./table";

export default async function BlueprintsAdmin() {
  const db = await getDb();
  const blueprints = await db.blueprint.findMany({ orderBy: { sortOrder: "asc" }, include: { stages: true } });
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-l)" }}>
        <div>
          <h1 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-2xs)" }}>Blueprints</h1>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-s)" }}>{blueprints.length} шаблонов</p>
        </div>
        <Link href="/admin/blueprints/new" className="btn btn-primary" style={{ textDecoration: "none" }}><Plus size={16} /> Добавить</Link>
      </div>
      <BPTable blueprints={JSON.parse(JSON.stringify(blueprints))} />
    </div>
  );
}
