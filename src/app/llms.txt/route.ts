import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = await getDb();
  const baseUrl = "https://proektmap.ru";

  // Get latest blog posts
  const posts = await db.blogPost.findMany({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
    take: 30,
    select: { title: true, slug: true, excerpt: true },
  });

  // Get blueprints
  const blueprints = await db.blueprint.findMany({
    where: { isPublished: true },
    select: { title: true, slug: true, description: true },
  });

  const lines = [
    `# ProektMap — Карта роста`,
    `> AI-инженерный навигатор для русскоязычных разработчиков.`,
    ``,
    `## Основные разделы`,
    `- [Главная](${baseUrl})`,
    `- [Блог](${baseUrl}/blog)`,
    `- [Blueprint'ы](${baseUrl}/blueprints)`,
    `- [AI-инструменты](${baseUrl}/ai-tools)`,
    `- [Глоссарий](${baseUrl}/glossary)`,
    `- [Промпты](${baseUrl}/prompts)`,
    `- [MCP серверы](${baseUrl}/mcp)`,
    `- [Решения](${baseUrl}/solutions)`,
    `- [Telegram Боты](${baseUrl}/telegram)`,
    `- [AI без VPN](${baseUrl}/ai-without-vpn)`,
    `- [Vibe Coding](${baseUrl}/vibecraft)`,
    ``,
    `## Blueprint'ы (маршруты разработки)`,
    ...blueprints.map(bp => `- [${bp.title}](${baseUrl}/${bp.slug}): ${bp.description || ""}`),
    ``,
    `## Последние статьи блога`,
    ...posts.map(p => `- [${p.title}](${baseUrl}/blog/${p.slug}): ${(p.excerpt || "").slice(0, 120)}`),
    ``,
    `## Для AI-агентов`,
    `- Sitemap: ${baseUrl}/sitemap.xml`,
    `- RSS: ${baseUrl}/blog/rss.xml`,
    `- API документация в /docs`,
    ``,
    `## Контакты`,
    `- Email: bilariuss@yandex.ru`,
    `- GitHub: https://github.com/bilarius1-tech/proektmap`,
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
