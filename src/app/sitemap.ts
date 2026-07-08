import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Sitemap() {
  const base = "https://proektmap.ru";

  const staticPages = [
    { url: base, lastModified: new Date(), priority: 1 },
    { url: `${base}/corporate-website`, lastModified: new Date(), priority: 0.9 },
    { url: `${base}/prompts`, lastModified: new Date(), priority: 0.8 },
    { url: `${base}/privacy`, lastModified: new Date(), priority: 0.3 },
    { url: `${base}/terms`, lastModified: new Date(), priority: 0.3 },
    { url: `${base}/offer`, lastModified: new Date(), priority: 0.3 },
    { url: `${base}/refund`, lastModified: new Date(), priority: 0.3 },
    { url: `${base}/contacts`, lastModified: new Date(), priority: 0.5 },
    { url: `${base}/blog`, lastModified: new Date(), priority: 0.9 },
  ];

  return staticPages.map(p => ({
    url: p.url,
    lastModified: p.lastModified,
    changeFrequency: "weekly" as const,
    priority: p.priority,
  }));
}
