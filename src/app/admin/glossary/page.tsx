import { getDb } from "@/lib/db/index";
import AdminGlossaryClient from "./client";

export const dynamic = "force-dynamic";

export default async function AdminGlossaryPage() {
  const db = await getDb();
  const terms = await db.glossaryTerm.findMany({ orderBy: { sortOrder: "asc" } });
  return <AdminGlossaryClient terms={JSON.parse(JSON.stringify(terms))} />;
}
