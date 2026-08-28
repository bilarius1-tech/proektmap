import { MetadataRoute } from "next";
import { getDb } from "@/lib/db/index";
import { PUBLIC_SEO_ROUTES } from "./sitemap/site-map-data";
import { CREATIVE_TOOLS } from "@/lib/creative-library/data";
import { VIBE_KITS } from "@/lib/vibe-blocks/data";
import { CAPABILITY_SKILLS } from "@/app/skills/skills-data";

const baseUrl = "https://proektmap.ru";

function pagePriority(href: string) {
  if (href === "/") return 1;
  if (href === "/resheniya") return 0.9;
  if (href.startsWith("/resheniya/")) return href.includes("workspace") ? 0.6 : 0.8;
  if (["/blog", "/ai-tools", "/mcp", "/telegram", "/avito", "/ai-without-vpn", "/skills", "/glossary"].includes(href)) return 0.8;
  if (["/terms", "/privacy", "/offer", "/refund", "/contacts"].includes(href)) return 0.4;
  if (href === "/auth") return 0.3;
  return 0.7;
}

function pageFrequency(href: string): MetadataRoute.Sitemap[number]["changeFrequency"] {
  if (href === "/blog") return "daily";
  if (href.startsWith("/demo/") || href.startsWith("/quest/") || href === "/auth") return "monthly";
  return "weekly";
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = PUBLIC_SEO_ROUTES.map((href) => ({
    url: href === "/" ? baseUrl : `${baseUrl}${href}`,
    lastModified: new Date(),
    changeFrequency: pageFrequency(href),
    priority: pagePriority(href),
  }));

  let blogUrls: MetadataRoute.Sitemap = [];
  let aiToolUrls: MetadataRoute.Sitemap = [];
  let mcpUrls: MetadataRoute.Sitemap = [];
  let solutionUrls: MetadataRoute.Sitemap = [];
  let glossaryUrls: MetadataRoute.Sitemap = [];
  let patternUrls: MetadataRoute.Sitemap = [];
  let russianAiUrls: MetadataRoute.Sitemap = [];
  let workshopUrls: MetadataRoute.Sitemap = [];

  try {
    const db = await getDb();
    const [posts, tools, mcps, solutions, terms, patterns, russianAi, workshop] = await Promise.all([
      db.blogPost.findMany({ where: { status: "published" }, select: { slug: true, updatedAt: true }, orderBy: { updatedAt: "desc" }, take: 500 }),
      db.aITool.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
      db.mCPServer.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
      db.solution.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
      db.glossaryTerm.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
      db.buildPattern.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
      db.russianAIProject.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
      db.aiProject.findMany({ select: { slug: true, updatedAt: true } }),
    ]);

    blogUrls = posts.map((item) => ({ url: `${baseUrl}/blog/${item.slug}`, lastModified: item.updatedAt, changeFrequency: "monthly", priority: 0.7 }));
    aiToolUrls = tools.map((item) => ({ url: `${baseUrl}/ai-tools/${item.slug}`, lastModified: item.updatedAt, changeFrequency: "monthly", priority: 0.8 }));
    mcpUrls = mcps.map((item) => ({ url: `${baseUrl}/mcp/${item.slug}`, lastModified: item.updatedAt, changeFrequency: "monthly", priority: 0.8 }));
    solutionUrls = solutions.map((item) => ({ url: `${baseUrl}/solutions/${item.slug}`, lastModified: item.updatedAt, changeFrequency: "monthly", priority: 0.7 }));
    glossaryUrls = terms.map((item) => ({ url: `${baseUrl}/glossary/${item.slug}`, lastModified: item.updatedAt, changeFrequency: "monthly", priority: 0.6 }));
    patternUrls = patterns.map((item) => ({ url: `${baseUrl}/patterns/${item.slug}`, lastModified: item.updatedAt, changeFrequency: "monthly", priority: 0.6 }));
    russianAiUrls = russianAi.map((item) => ({ url: `${baseUrl}/russian-ai/${item.slug}`, lastModified: item.updatedAt, changeFrequency: "monthly", priority: 0.6 }));
    workshopUrls = workshop.map((item) => ({ url: `${baseUrl}/ai-workshop/${item.slug}`, lastModified: item.updatedAt, changeFrequency: "monthly", priority: 0.6 }));
  } catch {}

  return [
    ...staticPages,
    ...CREATIVE_TOOLS.map((tool) => ({
      url: `${baseUrl}/sandbox/creative-library/${tool.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
    ...VIBE_KITS.map((kit) => ({
      url: `${baseUrl}/sandbox/vibe-blocks/${kit.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
    ...CAPABILITY_SKILLS.map((skill) => ({
      url: `${baseUrl}/skills/${skill.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...blogUrls,
    ...aiToolUrls,
    ...mcpUrls,
    ...solutionUrls,
    ...glossaryUrls,
    ...patternUrls,
    ...russianAiUrls,
    ...workshopUrls,
  ];
}
