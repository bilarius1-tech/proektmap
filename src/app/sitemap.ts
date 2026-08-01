import { MetadataRoute } from "next";
import { getDb } from "@/lib/db/index";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://proektmap.ru";
  
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/corporate-website`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/saas-project`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/game-dev`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/ai-tools`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/prompts`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/models`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/specialists`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/offer`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/auth`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/glossary`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/mcp`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/solutions`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/patterns`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.5 },
    { url: `${baseUrl}/demo/win98`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/quest/beginner`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/telegram`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/ai-without-vpn`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/vibecraft`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];

  // Dynamic: blog posts
  let blogUrls: MetadataRoute.Sitemap = [];
  try {
    const db = await getDb();
    const posts = await db.blogPost.findMany({ 
      where: { status: "published" },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      take: 500,
    });
    blogUrls = posts.map(p => ({
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {}

  // Dynamic: AI tools detail pages
  let aiToolUrls: MetadataRoute.Sitemap = [];
  try {
    const db = await getDb();
    const aiTools = await db.aITool.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    });
    aiToolUrls = aiTools.map(t => ({
      url: `${baseUrl}/ai-tools/${t.slug}`,
      lastModified: t.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));
  } catch {}

  // Dynamic: MCP server detail pages
  let mcpUrls: MetadataRoute.Sitemap = [];
  try {
    const db = await getDb();
    const mcps = await db.mCPServer.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    });
    mcpUrls = mcps.map(s => ({
      url: `${baseUrl}/mcp/${s.slug}`,
      lastModified: s.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));
  } catch {}

  // Dynamic: solutions
  let solutionUrls: MetadataRoute.Sitemap = [];
  try {
    const db = await getDb();
    const solutions = await db.solution.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } });
    solutionUrls = solutions.map(s => ({ url: `${baseUrl}/solutions/${s.slug}`, lastModified: s.updatedAt, changeFrequency: "monthly" as const, priority: 0.7 }));
  } catch {}

  // Dynamic: skills
  let skillUrls: MetadataRoute.Sitemap = [];
  try {
    const db = await getDb();
    const skills = await db.skill.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } });
    skillUrls = skills.map(s => ({ url: `${baseUrl}/skills/${s.slug}`, lastModified: s.updatedAt, changeFrequency: "monthly" as const, priority: 0.7 }));
  } catch {}

  // Dynamic: glossary
  let glossaryUrls: MetadataRoute.Sitemap = [];
  try {
    const db = await getDb();
    const terms = await db.glossaryTerm.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } });
    glossaryUrls = terms.map(t => ({ url: `${baseUrl}/glossary/${t.slug}`, lastModified: t.updatedAt, changeFrequency: "monthly" as const, priority: 0.6 }));
  } catch {}

  // Dynamic: patterns
  let patternUrls: MetadataRoute.Sitemap = [];
  try {
    const db = await getDb();
    const patterns = await db.buildPattern.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } });
    patternUrls = patterns.map(p => ({ url: `${baseUrl}/patterns/${p.slug}`, lastModified: p.updatedAt, changeFrequency: "monthly" as const, priority: 0.6 }));
  } catch {}

  return [...staticPages, ...blogUrls, ...aiToolUrls, ...mcpUrls, ...solutionUrls, ...skillUrls, ...glossaryUrls, ...patternUrls];
}
