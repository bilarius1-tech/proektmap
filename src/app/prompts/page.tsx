import { getDb } from "@/lib/db/index";
import PromptsPageClient from "./client";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Библиотека промптов — ProektMap",
  description: "Инженерные решения: System, Agent, MCP, Cursor Rules. RPG-статы, эволюция, совместимость.",
};

export default async function PromptsPage({ searchParams }: { searchParams: Promise<{ page?: string; cat?: string }> }) {
  const { page: pageStr, cat } = await searchParams;
  const page = Math.max(1, parseInt(pageStr || "1"));
  const perPage = 30;

  const db = await getDb();
  const where: any = { isPublished: true };
  if (cat && cat !== "all") where.category = cat;

  const [prompts, total] = await Promise.all([
    db.promptBlueprint.findMany({
      where,
      orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }],
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    db.promptBlueprint.count({ where }),
  ]);

  return (
    <PromptsPageClient
      prompts={JSON.parse(JSON.stringify(prompts))}
      total={total}
      page={page}
      perPage={perPage}
    />
  );
}
