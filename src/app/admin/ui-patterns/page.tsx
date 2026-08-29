import { getDb } from "@/lib/db/index";
import { UI_PATTERNS } from "@/app/ui-patterns/data";
import AdminUiPatternsClient from "./client";

export const dynamic = "force-dynamic";

export default async function AdminUiPatternsPage() {
  const db = await getDb();
  const metas = await db.uiPatternMeta.findMany();
  const metaMap: Record<string, any> = {};
  (metas || []).forEach((m: any) => {
    metaMap[m.slug] = m;
  });

  // Последние добавленные всегда первые
  const patterns = [...UI_PATTERNS].reverse().map((p) => {
    const meta = metaMap[p.slug];
    return {
      slug: p.slug,
      defaultTitle: p.titleRu,
      customTitle: meta?.customTitle || "",
      title: meta?.customTitle || p.titleRu,
      defaultDesc: p.shortDescription,
      customDesc: meta?.customDesc || "",
      description: meta?.customDesc || p.shortDescription,
      category: p.category,
      screenshot: meta?.screenshot || "",
      isPro: meta?.isPro || false,
      isFeatured: meta?.isFeatured || false,
      sortOrder: meta?.sortOrder ?? 0,
    };
  });

  return <AdminUiPatternsClient initialPatterns={patterns} />;
}
