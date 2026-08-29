import { Metadata } from "next";
import { getDb } from "@/lib/db/index";
import { UI_PATTERNS, PATTERN_CATEGORIES } from "./data";
import UIPatternsCatalogClient from "./client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Готовые секции и виджеты для сайта | ProektMap",
  description: "Инженерная библиотека визуальных паттернов, анатомии вёрстки и готовых промптов для Cursor, v0, Lovable и Claude.",
  alternates: {
    canonical: "https://proektmap.ru/ui-patterns",
  },
};

export default async function Page() {
  const db = await getDb();
  let metas: any[] = [];
  try {
    metas = await db.uiPatternMeta.findMany();
  } catch (err) {
    console.error("Failed to load uiPatternMeta:", err);
  }

  const metaMap: Record<string, any> = {};
  metas.forEach((m: any) => {
    metaMap[m.slug] = m;
  });

  // Последние добавленные всегда первые
  const mergedPatterns = [...UI_PATTERNS].reverse().map((p) => {
    const meta = metaMap[p.slug];
    return {
      ...p,
      titleRu: meta?.customTitle || p.titleRu,
      shortDescription: meta?.customDesc || p.shortDescription,
      screenshot: meta?.screenshot || "",
      isPro: meta?.isPro ?? (p.difficulty === "advanced" || p.difficulty === "intermediate"),
      isFeatured: meta?.isFeatured ?? false,
    };
  });

  return (
    <UIPatternsCatalogClient
      patterns={mergedPatterns}
      categories={PATTERN_CATEGORIES}
    />
  );
}
