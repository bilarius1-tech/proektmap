import { getDb } from "@/lib/db/index";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import AIToolDetailClient from "./client";
import RelatedBlueprintsBlock from "@/components/layout/related-blueprints-block";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: any) {
  const { slug } = await params;
  const db = await getDb();
  const tool = await db.aITool.findUnique({ where: { slug } });
  if (!tool) return { title: "Инструмент не найден" };
  return {
    title: tool.name + " — инструкция, настройка, цена, отзывы",
    description: tool.name + ": " + (tool.shortDescription || tool.description || "").substring(0, 150) + ". Цена: " + (tool.pricingAmount || tool.pricing || "от 0") + ". Рейтинг " + tool.rating + "/10.",
    openGraph: {
      title: tool.name + " — инструкция по настройке и использованию",
      description: (tool.description || "").substring(0, 200),
      type: "article",
    },
  };
}

export default async function Page({ params }: any) {
  const { slug } = await params;
  const db = await getDb();
  const tool = await db.aITool.findUnique({ where: { slug } });
  if (!tool) notFound();

  // Fetch alternatives (same type, different slug)
  const alternatives = await db.aITool.findMany({
    where: { type: tool.type, slug: { not: slug }, isActive: true },
    take: 4,
    select: { name: true, slug: true, pricingAmount: true, rating: true },
  });

  // Build HowTo schema if steps exist
  const steps = JSON.parse(tool.howToStart || "[]");
  const howToSchema = steps.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": `Как начать работать с ${tool.name}`,
    "description": tool.description || `Пошаговая инструкция по настройке ${tool.name}`,
    "step": steps.map((s: any, i: number) => ({
      "@type": "HowStep",
      "position": i + 1,
      "name": s.title,
      "text": s.desc,
    })),
  } : null;

  const session = await auth();
  const isLoggedIn = !!session?.user;

  let related: any = { terms: [], patterns: [], mcp: [], prompts: [] };
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://proektmap.ru";
    const relatedRes = await fetch(siteUrl + "/api/graph/node?type=aitool&slug=" + slug);
    if (relatedRes.ok) related = await relatedRes.json();
  } catch {}

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: tool.name,
            description: (tool.description || "").substring(0, 200),
            applicationCategory: "DeveloperApplication",
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: tool.rating,
              bestRating: "10",
              ratingCount: 1,
            },
            offers: {
              "@type": "Offer",
              price: tool.pricingAmount || "0",
              priceCurrency: "RUB",
            },
          }),
        }}
      />
      {howToSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      )}
      <AIToolDetailClient
        tool={JSON.parse(JSON.stringify(tool))}
        related={related}
        alternatives={JSON.parse(JSON.stringify(alternatives))}
        isLoggedIn={isLoggedIn}
      />
          <RelatedBlueprintsBlock toolSlug={tool.slug} />
    </>
  );
}
