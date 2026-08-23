import { notFound } from "next/navigation";
import { CREATIVE_TOOLS, getCreativeTool } from "@/lib/creative-library/data";
import CreativeToolDetailClient from "./client";

export function generateStaticParams() {
  return CREATIVE_TOOLS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getCreativeTool(slug);
  if (!tool) return { title: "Не найдено" };
  return {
    title: `${tool.name} — креативная библиотека | ProektMap`,
    description: tool.tagline,
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getCreativeTool(slug);
  if (!tool) notFound();
  return <CreativeToolDetailClient tool={tool} />;
}
