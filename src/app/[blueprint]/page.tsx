import { getDb } from "@/lib/db";
export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import BlueprintPageClient from "./client";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ blueprint: string }> }): Promise<Metadata> {
  const { blueprint: slug } = await params;
  try {
    const db = await getDb();
    const bp = await db.blueprint.findUnique({ where: { slug }, select: { title: true, description: true } });
    if (!bp) return {};
    return {
      title: `${bp.title} — ProektMap`,
      description: bp.description || `Пройдите путь создания ${bp.title.toLowerCase()} с AI-консультантом. Готовые промпты, методология, пошаговые решения.`,
    };
  } catch { return {}; }
}

export default async function BlueprintPage({ params }: { params: Promise<{ blueprint: string }> }) {
  const { blueprint: slug } = await params;
  const db = await getDb();
  const bp = await db.blueprint.findUnique({
    where: { slug },
    include: { stages: { orderBy: { sortOrder: "asc" }, include: { stage: { include: { decisions: { orderBy: { sortOrder: "asc" } } } } } } },
  });
  if (!bp) notFound();
  const [prompts, variables, categories] = await Promise.all([
    db.prompt.findMany({ where: { isActive: true }, orderBy: [{ category: "asc" }, { title: "asc" }], take: 30 }),
    db.promptVariable.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
    db.promptCategory.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
  ]);
  return <BlueprintPageClient blueprint={JSON.parse(JSON.stringify(bp))} />;
}
