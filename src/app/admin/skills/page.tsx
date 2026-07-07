import { getDb } from "@/lib/db";
import SkillsTable from "./table";

export default async function AdminSkillsPage() {
  const db = await getDb();
  const skills = await db.skill.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-l)" }}>
        <div>
          <h1 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-2xs)" }}>Skills</h1>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-s)" }}>{skills.length} навыков — переиспользуемые модули</p>
        </div>
      </div>
      <SkillsTable skills={JSON.parse(JSON.stringify(skills))} />
    </div>
  );
}
