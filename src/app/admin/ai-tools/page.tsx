import { getDb } from "@/lib/db/index";
import AdminAIToolsClient from "./client";

export const dynamic = "force-dynamic";

export default async function Page() {
  const db = await getDb();
  const tools = await db.aITool.findMany({ orderBy: { sortOrder: "asc" } });
  return <AdminAIToolsClient tools={JSON.parse(JSON.stringify(tools))} />;
}
