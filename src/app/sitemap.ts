import { getDb } from "@/lib/db";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://proektmap.ru";
  const entries: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: baseUrl + "/auth", lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  try {
    const db = await getDb();
    const blueprints = await db.blueprint.findMany({ where: { isPublished: true } });
    for (const bp of blueprints) {
      entries.push({
        url: baseUrl + "/" + bp.slug,
        lastModified: bp.createdAt,
        changeFrequency: "weekly",
        priority: 0.9,
      });
    }
  } catch (e) {}

  return entries;
}
