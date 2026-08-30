import { Metadata } from "next";
import { getDb } from "@/lib/db";
import { MICROSERVICES, MICROSERVICE_CATEGORIES, normalizeMediaUrl } from "@/lib/services/data";
import ServicesCatalogClient from "./client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Микросервисы и онлайн-утилиты для AI и Авито | ProektMap",
  description:
    "Каталог бесплатных онлайн-микросервисов ProektMap: уникализатор фото для Авито, калькулятор токенов LLM, SVG-конвертеры и утилиты для разработки.",
  alternates: {
    canonical: "https://proektmap.ru/services",
  },
  openGraph: {
    title: "Микросервисы и онлайн-утилиты | ProektMap",
    description:
      "Бесплатные изолированные онлайн-инструменты для AI-инженеров, вайбкодеров и продавцов. Работают прямо в браузере.",
    url: "https://proektmap.ru/services",
    siteName: "ProektMap",
    type: "website",
  },
};

export default async function ServicesPage() {
  const statsMap: Record<string, { viewCount: number; useCount: number; shareCount: number }> = {};
  const metaMap: Record<string, any> = {};

  try {
    const db = await getDb();
    const metas = await db.microserviceMeta.findMany();
    metas.forEach((m) => {
      statsMap[m.slug] = {
        viewCount: m.viewCount,
        useCount: m.useCount,
        shareCount: m.shareCount,
      };
      metaMap[m.slug] = m;
    });
  } catch (err) {
    console.error("Failed to load microservice stats:", err);
  }

  const mergedServices = MICROSERVICES.map((s) => {
    const meta = metaMap[s.slug];
    return {
      ...s,
      title: meta?.customTitle || s.title,
      shortDescription: meta?.customDesc || s.shortDescription,
      coverImage: normalizeMediaUrl(meta?.coverImage || s.coverImage || ""),
      isFeatured: meta?.isFeatured ?? s.isFeatured,
    };
  });

  return (
    <ServicesCatalogClient
      services={mergedServices}
      categories={MICROSERVICE_CATEGORIES}
      statsMap={statsMap}
    />
  );
}
