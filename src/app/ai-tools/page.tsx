import { getDb } from "@/lib/db/index";
import AIToolsPage from "./client";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "AI-инструменты для разработки — Cursor, Claude Code, Reasonix: сравнение и инструкции",
  description: "Полный каталог AI-инструментов: Cursor, Claude Code, Reasonix, Windsurf, Bolt, Lovable. Инструкции по настройке, сравнение цен, плюсы и минусы. Выбери инструмент под свою задачу.",
};

export default async function Page() {
  const db = await getDb();
  const tools = await db.aITool.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } });
  return <AIToolsPage tools={JSON.parse(JSON.stringify(tools))} />;
}
