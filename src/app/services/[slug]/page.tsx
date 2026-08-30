import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import { getMicroserviceBySlug, MICROSERVICES, normalizeMediaUrl } from "@/lib/services/data";
import ServiceDetailClient from "./client";

export const dynamic = "force-dynamic";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getMicroserviceBySlug(slug);
  if (!service) {
    return {
      title: "Микросервис не найден | ProektMap",
    };
  }

  let customTitle = service.title;
  let customDesc = service.shortDescription;
  let customCover = service.coverImage;

  try {
    const db = await getDb();
    const meta = await db.microserviceMeta.findUnique({ where: { slug } });
    if (meta?.customTitle) customTitle = meta.customTitle;
    if (meta?.customDesc) customDesc = meta.customDesc;
    if (meta?.coverImage) customCover = normalizeMediaUrl(meta.coverImage);
  } catch {}

  const title = `${customTitle} — Онлайн-утилита | ProektMap`;
  const description = `${customDesc} Бесплатная обработка прямо в браузере.`;
  const canonicalUrl = `https://proektmap.ru/services/${service.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "ProektMap",
      type: "website",
      images: customCover ? [{ url: customCover }] : undefined,
    },
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const baseService = getMicroserviceBySlug(slug);

  if (!baseService) {
    notFound();
  }

  let stats = { viewCount: 0, useCount: 0, shareCount: 0 };
  let mergedService = { ...baseService };

  try {
    const db = await getDb();
    // Increment view counter on page load
    const updated = await db.microserviceMeta.upsert({
      where: { slug },
      create: { slug, viewCount: 1 },
      update: { viewCount: { increment: 1 } },
    });
    stats = {
      viewCount: updated.viewCount,
      useCount: updated.useCount,
      shareCount: updated.shareCount,
    };
    if (updated.customTitle) mergedService.title = updated.customTitle;
    if (updated.customDesc) mergedService.shortDescription = updated.customDesc;
    if (updated.coverImage) mergedService.coverImage = normalizeMediaUrl(updated.coverImage);
  } catch (err) {
    console.error("Failed to update viewCount for microservice:", err);
  }

  // Schema.org WebApplication
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: mergedService.title,
    description: mergedService.shortDescription,
    url: `https://proektmap.ru/services/${mergedService.slug}`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "RUB",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ServiceDetailClient service={mergedService} initialStats={stats} />
    </>
  );
}
