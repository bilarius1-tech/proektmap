import { getDb } from "@/lib/db/index";
import AdminMCPClient from "./client";
export const dynamic = "force-dynamic";
export default async function Page() {
  const db = await getDb();
  const servers = await db.mCPServer.findMany({ orderBy: { sortOrder: "asc" } });
  return <AdminMCPClient servers={JSON.parse(JSON.stringify(servers))} />;
}
