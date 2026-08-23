const CATEGORY_MAP: Record<string, { name: string; slug: string }> = {
  Development: { name: "Разработка", slug: "development" },
  development: { name: "Разработка", slug: "development" },
  AI: { name: "AI", slug: "ai" },
  "AI-инжиниринг": { name: "AI-инжиниринг", slug: "ai-engineering" },
  Авито: { name: "Авито", slug: "avito" },
  Ozon: { name: "Ozon", slug: "ozon" },
  Wildberries: { name: "Wildberries", slug: "wildberries" },
  Маркетплейсы: { name: "Маркетплейсы", slug: "marketplaces" },
  "Автоматизация продаж": { name: "Автоматизация продаж", slug: "sales-automation" },
  "AI для бизнеса": { name: "AI для бизнеса", slug: "ai-for-business" },
  Дизайн: { name: "Дизайн", slug: "design" },
  Разработка: { name: "Разработка", slug: "development" },
};

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-zа-я0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50) || "ai";
}

export function mapFeedCategory(feedCategory: string): { name: string; slug: string } {
  return CATEGORY_MAP[feedCategory] || { name: feedCategory, slug: slugify(feedCategory) };
}

export async function ensureBlogCategory(db: any, feedCategory: string): Promise<{ id: string } | null> {
  const mapped = mapFeedCategory(feedCategory);
  const existing = await db.blogCategory.findFirst({
    where: {
      OR: [
        { name: mapped.name },
        { slug: mapped.slug },
        { name: feedCategory },
        { slug: slugify(feedCategory) },
      ],
    },
    select: { id: true },
  });
  if (existing) return existing;

  try {
    return await db.blogCategory.create({
      data: { name: mapped.name, slug: mapped.slug },
      select: { id: true },
    });
  } catch {
    return db.blogCategory.findFirst({
      where: { OR: [{ slug: mapped.slug }, { name: mapped.name }] },
      select: { id: true },
    });
  }
}
