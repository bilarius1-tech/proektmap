import { getDb } from "@/lib/db";
import RefTable from "./table";

export default async function AdminReferralsPage() {
  const db = await getDb();
  const refs = await db.referralLink.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-l)" }}>
        <div>
          <h1 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-2xs)" }}>Реферальные ссылки</h1>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-s)" }}>{refs.length} сервисов — авто-вставка в контент</p>
        </div>
      </div>
      <RefTable refs={JSON.parse(JSON.stringify(refs))} />
    </div>
  );
}
