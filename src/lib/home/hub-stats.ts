import { getDb } from "@/lib/db";
import { AI_SKILLS } from "@/lib/ai-skills";
import { ARSENAL_TOOLS } from "@/lib/arsenal/tools";
import { MICROSERVICES } from "@/lib/services/data";
import { UI_PATTERNS } from "@/app/ui-patterns/data";

/** Живые guided-маршруты /resheniya (не legacy Blueprint). */
export const RESHENIYA_GUIDED_COUNT = 6;

export type HomeHubStat = {
  label: string;
  value: number;
  href: string;
};

/**
 * Счётчики главных разделов для тёмной полосы на главной.
 */
export async function getHomeHubStats(): Promise<HomeHubStat[]> {
  const db = await getDb();

  const [blogCount, videoCount, glossaryCount] = await Promise.all([
    db.blogPost.count({ where: { status: "published" } }),
    db.vkVideo.count({ where: { isPublished: true } }),
    db.glossaryTerm.count({ where: { isPublished: true } }),
  ]);

  const activeServices = MICROSERVICES.filter((s) => s.status === "active").length;

  return [
    { label: "Маршруты", value: RESHENIYA_GUIDED_COUNT, href: "/resheniya" },
    { label: "Публикации", value: blogCount, href: "/blog" },
    { label: "Видео", value: videoCount, href: "/video" },
    { label: "Микросервисы", value: activeServices, href: "/services" },
    { label: "UI-паттерны", value: UI_PATTERNS.length, href: "/ui-patterns" },
    { label: "Инструменты", value: ARSENAL_TOOLS.length, href: "/arsenal" },
    { label: "Skills", value: AI_SKILLS.length, href: "/ai-skills" },
    { label: "Глоссарий", value: glossaryCount, href: "/glossary" },
  ];
}
