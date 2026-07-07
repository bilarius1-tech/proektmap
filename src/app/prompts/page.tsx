import { getDb } from "@/lib/db/index";
import PromptsBlockClient from "./client";

export const dynamic = "force-dynamic";
export const metadata = { title: "Библиотека промптов — ProektMap", description: "Готовые промпты для AI-агентов. Форк из vibe-coding-cn. Код, деплой, дизайн, SEO, право." };

export default async function PromptsPage() {
  const db = await getDb(); const prompts = await db.prompt.findMany({ where: { isActive: true }, orderBy: [{ category: "asc" }, { title: "asc" }] });
  return <PromptsBlockClient prompts={JSON.parse(JSON.stringify(prompts))} />;
}
