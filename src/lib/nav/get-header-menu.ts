import { getDb } from "@/lib/db";

export type HeaderMenuNode = {
  id: string;
  label: string;
  href: string;
  icon?: string | null;
  children?: HeaderMenuNode[];
};

function isLegacyBlueprintItem(item: { label?: string | null; href?: string | null }) {
  const label = String(item.label || "").toLowerCase();
  const href = String(item.href || "");
  return label === "готовые проекты" || label.includes("blueprint") || href.startsWith("/blueprints");
}

function mapVisible(item: HeaderMenuNode & { children?: HeaderMenuNode[] }): HeaderMenuNode {
  return {
    id: item.id,
    label: item.label,
    href: item.href,
    icon: item.icon,
    children: (item.children || [])
      .filter((child) => !isLegacyBlueprintItem(child))
      .map((child) => mapVisible(child)),
  };
}

/** Активные корни шапки (их рисует левая колонка и мобильный ящик). */
export async function getHeaderMenu(): Promise<HeaderMenuNode[]> {
  try {
    const db = await getDb();
    const menuItems = await db.menuItem.findMany({
      where: { parentId: null, isActive: true, location: "header" },
      orderBy: { sortOrder: "asc" },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
          include: {
            children: {
              where: { isActive: true },
              orderBy: { sortOrder: "asc" },
            },
          },
        },
      },
    });
    return menuItems.filter((item) => !isLegacyBlueprintItem(item)).map((item) => mapVisible(item));
  } catch {
    return [];
  }
}
