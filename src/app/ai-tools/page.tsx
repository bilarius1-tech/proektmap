import { getDb } from "@/lib/db/index";
import AIToolsPage from "./client";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "AI-инструменты — сравнение",
  description: "Сравнение AI-инструментов для разработки: Reasonix, Cursor, Vibecraft, VS Code Copilot, Bolt, Lovable. Плюсы, минусы, цены, для кого подходит.",
};

export default async function Page() {
  const db = await getDb();
  const tools = await db.aITool.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } });
  return <AIToolsPage tools={JSON.parse(JSON.stringify(tools))} />;
}
