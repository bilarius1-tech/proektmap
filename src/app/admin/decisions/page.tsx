import { getDb } from "@/lib/db";
import Link from "next/link";
import { Plus, Edit, Trash2, Copy } from "lucide-react";
import DecTable from "./table";

async function deleteDecision(formData: FormData) {
  "use server";
  const db = await getDb();
  await db.decision.delete({ where: { id: formData.get("id") as string } });
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
      <DecTable decisions={JSON.parse(JSON.stringify(decisions))} />
    </div>
  );
}
