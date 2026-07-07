import { getDb } from "@/lib/db/index";
import PromptsPageClient from "./client";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Библиотека промптов — ProektMap",
  description: "Готовые промпты для AI-агентов. Форк из vibe-coding-cn. Код, деплой, дизайн, SEO, право. С подсказками для новичков.",
};

export default async function PromptsPage() {
  const db = await getDb();
  const [prompts, variables] = await Promise.all([
    db.prompt.findMany({ where: { isActive: true }, orderBy: [{ category: "asc" }, { title: "asc" }] }),
    db.promptVariable.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
  ]);
  return <PromptsPageClient prompts={JSON.parse(JSON.stringify(prompts))} variables={JSON.parse(JSON.stringify(variables))} />;
}
