import { getDb } from "@/lib/db/index";
import { notFound } from "next/navigation";
import AIToolDetailClient from "./client";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: any) {
  const { slug } = await params;
  const db = await getDb();
  const tool = await db.aITool.findUnique({ where: { slug } });
  if (!tool) return { title: "Инструмент не найден" };
  return {
    title: tool.name + " — обзор AI-инструмента",
    description: tool.name + ": " + (tool.description || "").substring(0, 150) + ". " + tool.pricing + ". Рейтинг " + tool.rating + "/10.",
    openGraph: {
      title: tool.name + " — обзор AI-инструмента | Карта роста",
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

  let related: any = { terms: [], patterns: [], mcp: [] };
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
      <AIToolDetailClient
        tool={JSON.parse(JSON.stringify(tool))}
        related={related}
      />
    </>
  );
}
