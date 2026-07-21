import { getDb } from "@/lib/db/index";
import MCPPageClient from "./client";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "MCP-серверы — каталог",
  description: "Первый русскоязычный каталог MCP-серверов. 34+ серверов: поиск, категории, рейтинг. Model Context Protocol для AI-инструментов.",
};
export default async function Page() {
  const db = await getDb();
  const servers = await db.mCPServer.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } });
  return <MCPPageClient servers={JSON.parse(JSON.stringify(servers))} />;
}
