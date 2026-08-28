import { getDb } from "@/lib/db/index";
import MCPPageClient from "./client";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Каталог MCP-серверов — готовые интеграции для AI | ProektMap",
  description: "Каталог Model Context Protocol (MCP) серверов: подключение баз данных, файлов, API и внешних сервисов к вашим AI-ассистентам и агентам.",
  alternates: {
    canonical: "https://proektmap.ru/mcp",
  },
};

export default async function Page() {
  try {
    const db = await getDb();
    const servers = await db.mCPServer.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } });
    return <MCPPageClient servers={JSON.parse(JSON.stringify(servers))} />;
  } catch(e: any) {
    return <div>Error loading MCP servers: {e.message}</div>;
  }
}
