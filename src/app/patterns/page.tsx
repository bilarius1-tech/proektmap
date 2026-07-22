import { getDb } from "@/lib/db/index";
import PatternsPageClient from "./client";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Паттерны сборки — готовые AI-бизнесы | ProektMap",
  description: "Готовые схемы для сборки AI-бизнесов. AI SEO Аудитор, AI Консультант, Telegram Support Bot. Стек, архитектура, сущности, эволюция.",
};
export default async function Page() {
  const db = await getDb();
  const patterns = await db.buildPattern.findMany({ where: { isPublished: true }, orderBy: { sortOrder: "asc" } });
  return <PatternsPageClient patterns={JSON.parse(JSON.stringify(patterns))} />;
}
