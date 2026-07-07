import { getDb } from "@/lib/db/index";
import PromptsPageClient from "./client";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Библиотека промптов — ProektMap",
  description: "Готовые промпты для AI-агентов. Форк из vibe-coding-cn. Код, деплой, дизайн, SEO, право. С подсказками для новичков.",
};

export default async function PromptsPage({ searchParams }: { searchParams: Promise<{ page?: string; cat?: string }> }) {
  const { page: pageStr, cat } = await searchParams;
  const page = Math.max(1, parseInt(pageStr || "1"));
  const perPage = 30;

  const db = await getDb();
  const where: any = { isActive: true };
  if (cat && cat !== "all") where.category = cat;

  const [prompts, total, variables, categories] = await Promise.all([
    db.prompt.findMany({
      where,
      orderBy: [{ category: "asc" }, { title: "asc" }],
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    db.prompt.count({ where }),
    db.promptVariable.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
    db.promptCategory.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <PromptsPageClient
      prompts={JSON.parse(JSON.stringify(prompts))}
      variables={JSON.parse(JSON.stringify(variables))}
      categories={JSON.parse(JSON.stringify(categories))}
      total={total}
      page={page}
      perPage={perPage}
      currentCat={cat || "all"}
    />
  );
}
