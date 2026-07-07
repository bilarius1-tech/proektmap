import { getDb } from "@/lib/db/index";
import AdminVarsClient from "./client";

export const dynamic = "force-dynamic";

export default async function AdminVarsPage() {
  const db = await getDb();
  const variables = await db.promptVariable.findMany({ orderBy: [{ category: "asc" }, { sortOrder: "asc" }] });
  return <AdminVarsClient variables={JSON.parse(JSON.stringify(variables))} />;
}
