import { notFound } from "next/navigation";
import { getPatternBySlug, UI_PATTERNS } from "../data";
import PatternViewClient from "./client";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const pattern = getPatternBySlug(slug);
  if (!pattern) {
    return { title: "Паттерн не найден | ProektMap" };
  }
  return {
    title: `${pattern.titleRu} (${pattern.title}) — UI Паттерн и Промпт | ProektMap`,
    description: `${pattern.shortDescription} Анатомия вёрстки, готовые промпты для Cursor/v0/Claude и чистый код.`,
    alternates: {
      canonical: `https://proektmap.ru/ui-patterns/${pattern.slug}`,
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pattern = getPatternBySlug(slug);

  if (!pattern) {
    notFound();
  }

  return <PatternViewClient pattern={pattern} allPatterns={UI_PATTERNS} />;
}
