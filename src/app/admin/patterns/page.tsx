import { getDb } from "@/lib/db/index";
import AdminPatternsClient from "./client";
export const dynamic = "force-dynamic";
export default async function Page() {
  const db = await getDb();
  const patterns = await db.buildPattern.findMany({ orderBy: { sortOrder: "asc" } });
  return <AdminPatternsClient patterns={JSON.parse(JSON.stringify(patterns))} />;
}
