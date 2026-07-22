import { getDb } from "@/lib/db/index";
import { notFound } from "next/navigation";
import PatternDetailClient from "./client";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: any) {
  const { slug } = await params;
  const db = await getDb();
  const pattern = await db.buildPattern.findUnique({ where: { slug } });
  if (!pattern) return { title: "Не найдено" };
  return {
    title: `${pattern.title} — паттерн сборки | ProektMap`,
    description: pattern.description,
  };
}

export default async function Page({ params }: any) {
  const { slug } = await params;
  const db = await getDb();
  const pattern = await db.buildPattern.findUnique({ where: { slug } });
  if (!pattern) notFound();

  // Get linked blueprint
  let blueprint = null;
  if (pattern.blueprintId) {
    blueprint = await db.blueprint.findUnique({
      where: { id: pattern.blueprintId },
      select: { id: true, title: true, slug: true },
    });
  }

  // Get all blueprints for the "Собрать" selector
  const blueprints = await db.blueprint.findMany({
    where: { isPublished: true },
    select: { id: true, title: true, slug: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <PatternDetailClient
      pattern={JSON.parse(JSON.stringify(pattern))}
      blueprint={blueprint ? JSON.parse(JSON.stringify(blueprint)) : null}
      blueprints={JSON.parse(JSON.stringify(blueprints))}
    />
  );
}
