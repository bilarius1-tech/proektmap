import { getDb } from "@/lib/db/index";
import QuestClient from "./client";
export const dynamic = "force-dynamic";
export const metadata = { title: "Сайт услуг — Карта роста", description: "Интерактивный маршрут: от идеи до запуска сайта услуг. Принимай архитектурные решения и получай готовые промпты." };

export default async function Page() {
  const db = await getDb();
  const nodes = await db.questNode.findMany({ where: { questId: "services-site" }, orderBy: { sortOrder: "asc" } });
  const edges = await db.questEdge.findMany({ where: { questId: "services-site" } });
  return <QuestClient nodes={JSON.parse(JSON.stringify(nodes))} edges={JSON.parse(JSON.stringify(edges))} />;
}
