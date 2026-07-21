import { getDb } from "@/lib/db/index";
import MCPPageClient from "./client";
export const dynamic = "force-dynamic";

export default async function Page() {
  try {
    const db = await getDb();
    const servers = await db.mCPServer.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } });
    return <MCPPageClient servers={JSON.parse(JSON.stringify(servers))} />;
  } catch(e: any) {
    return <div>Error loading MCP servers: {e.message}</div>;
  }
}
