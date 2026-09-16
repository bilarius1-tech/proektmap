import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPack, getPackTasks, getPromptsByPack, getPublishedPacks } from "@/lib/shpargalka";
import ShpargalkaPackClient from "./pack-client";

type Params = { slug: string };

export function generateStaticParams() {
  return getPublishedPacks().map((pack) => ({ slug: pack.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const pack = getPack(slug);
  if (!pack || pack.status !== "published") {
    return { title: "Пак не найден | ProektMap" };
  }
  const count = getPromptsByPack(slug).length;
  return {
    title: `${pack.title}: ${count} промптов ChatGPT — шпаргалка | ProektMap`,
    description: `${pack.summary} Готовые русские шаблоны с копированием и фильтрами по задаче.`,
    alternates: {
      canonical: `https://proektmap.ru/shpargalka/${slug}`,
    },
  };
}

export default async function ShpargalkaPackPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const pack = getPack(slug);
  if (!pack || pack.status !== "published") notFound();
  const prompts = getPromptsByPack(slug);
  const tasks = getPackTasks(slug);

  return <ShpargalkaPackClient pack={pack} prompts={prompts} tasks={tasks} />;
}
