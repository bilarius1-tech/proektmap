import SitemapClient from "./client";
import type { DynamicSiteSection } from "./client";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Карта сайта ProektMap — все разделы и страницы",
  description: "Полное древовидное меню ProektMap: готовые решения AI, инструменты, знания, каталоги, личный кабинет, документы и архивные маршруты.",
};

export default async function Page() {
  const dynamicSections: DynamicSiteSection[] = [];
  try {
    const db = await getDb();
    const [posts, terms, tools, mcps, patterns, solutions, russianAi, workshop] = await Promise.all([
      db.blogPost.findMany({ where: { status: "published" }, select: { title: true, slug: true }, orderBy: { publishedAt: "desc" }, take: 300 }),
      db.glossaryTerm.findMany({ where: { isPublished: true }, select: { term: true, slug: true }, orderBy: { term: "asc" }, take: 250 }),
      db.aITool.findMany({ where: { isActive: true }, select: { name: true, slug: true }, orderBy: { name: "asc" }, take: 150 }),
      db.mCPServer.findMany({ where: { isActive: true }, select: { name: true, slug: true }, orderBy: { name: "asc" }, take: 150 }),
      db.buildPattern.findMany({ where: { isPublished: true }, select: { title: true, slug: true }, orderBy: { title: "asc" }, take: 100 }),
      db.solution.findMany({ where: { isPublished: true }, select: { title: true, slug: true }, orderBy: { title: "asc" }, take: 100 }),
      db.russianAIProject.findMany({ where: { isPublished: true }, select: { name: true, slug: true }, orderBy: { name: "asc" }, take: 150 }),
      db.aiProject.findMany({ select: { title: true, slug: true }, orderBy: { title: "asc" }, take: 100 }),
    ]);

    dynamicSections.push(
      { id: "blog-posts", title: "Статьи блога", href: "/blog", items: posts.map((item) => ({ title: item.title, href: `/blog/${item.slug}` })) },
      { id: "glossary-terms", title: "Термины глоссария", href: "/glossary", items: terms.map((item) => ({ title: item.term, href: `/glossary/${item.slug}` })) },
      { id: "ai-tools", title: "AI-инструменты", href: "/ai-tools", items: tools.map((item) => ({ title: item.name, href: `/ai-tools/${item.slug}` })) },
      { id: "mcp-servers", title: "MCP-серверы", href: "/mcp", items: mcps.map((item) => ({ title: item.name, href: `/mcp/${item.slug}` })) },
      { id: "patterns", title: "Паттерны", href: "/patterns", items: patterns.map((item) => ({ title: item.title, href: `/patterns/${item.slug}` })) },
      { id: "community-solutions", title: "Решения сообщества", href: "/solutions", items: solutions.map((item) => ({ title: item.title, href: `/solutions/${item.slug}` })) },
      { id: "workshop", title: "Проекты AI Цеха", href: "/ai-workshop", items: workshop.map((item) => ({ title: item.title, href: `/ai-workshop/${item.slug}` })) },
      { id: "russian-ai", title: "Российские AI-проекты", href: "/russian-ai", items: russianAi.map((item) => ({ title: item.name, href: `/russian-ai/${item.slug}` })) },
    );
  } catch {}

  return <SitemapClient dynamicSections={dynamicSections} />;
}
