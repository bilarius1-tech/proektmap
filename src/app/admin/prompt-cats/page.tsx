import { getDb } from "@/lib/db/index";
import AdminCatsClient from "./client";

export const dynamic = "force-dynamic";

export default async function AdminCatsPage() {
  const db = await getDb();
  const categories = await db.promptCategory.findMany({ orderBy: { sortOrder: "asc" } });
  return <AdminCatsClient categories={JSON.parse(JSON.stringify(categories))} />;
}
