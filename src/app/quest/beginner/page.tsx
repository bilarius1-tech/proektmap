import { getDb } from "@/lib/db/index";
import BeginnerPathClient from "./client";
export const dynamic = "force-dynamic";
export const metadata = { title: "Путь новичка — Карта роста", description: "От нуля до сайта в интернете за час. Установка инструментов, первый код, Git, деплой." };
export default async function Page() {
  const db = await getDb();
  const nodes = await db.questNode.findMany({ where: { questId: "beginner-path" }, orderBy: { sortOrder: "asc" } });
  return <BeginnerPathClient nodes={JSON.parse(JSON.stringify(nodes))} />;
}
