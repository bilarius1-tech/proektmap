import { getDb } from "@/lib/db";
import Link from "next/link";
import MobileMenu from "./mobile-menu";
import AuthBlock from "./auth-block";
import FavoritesIndicator from "./favorites-indicator";
import ThemeToggle from "./theme-toggle";
import DesktopMenuItem from "./desktop-menu-item";
import KnowledgeButtons from "@/components/knowledge/knowledge-buttons";

/**
 * Пункты меню берутся ТОЛЬКО из БД (админка /admin/menu).
 * Не хардкодить ссылки здесь — см. .cursor/rules/menu.mdc
 */
export default async function GlobalHeader() {
  let menuItems: any[] = [];
  try {
    const db = await getDb();
    menuItems = await db.menuItem.findMany({
      where: { parentId: null, isActive: true, location: "header" },
      orderBy: { sortOrder: "asc" },
      include: { children: { where: { isActive: true }, orderBy: { sortOrder: "asc" } } },
    });
  } catch {}

  const isLegacyBlueprintItem = (item: any) => {
    const label = String(item.label || "").toLowerCase();
    const href = String(item.href || "");
    return label === "готовые проекты" || label.includes("blueprint") || href.startsWith("/blueprints");
  };

  const visibleMenuItems = menuItems
    .filter((item) => !isLegacyBlueprintItem(item))
    .map((item) => ({
      ...item,
      children: item.children?.filter((child: any) => !isLegacyBlueprintItem(child)),
    }));

  return (
    <header
      style={{
        height: 56,
        background: "var(--color-bg-primary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 var(--space-m)",
        borderBottom: "1px solid var(--color-border-light)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-s)" }}>
        <MobileMenu items={visibleMenuItems} />
        <Link
          href="/"
          className="header-logo"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 18,
            fontWeight: 700,
            textDecoration: "none",
            color: "inherit",
            whiteSpace: "nowrap",
          }}
        >
          Карта<span style={{ color: "var(--color-accent)" }}> роста</span>
        </Link>
        <nav
          style={{ display: "flex", gap: 4, alignItems: "center", marginLeft: "var(--space-l)" }}
          className="header-nav hide-mobile"
        >
          {visibleMenuItems.map((item: any) => (
            <DesktopMenuItem key={item.id} item={item} />
          ))}
        </nav>
      </div>

      <div className="header-right" style={{ display: "flex", alignItems: "center", gap: "var(--space-s)" }}>
        <div className="header-knowledge">
          <KnowledgeButtons />
        </div>
        <div className="header-favorites">
          <FavoritesIndicator initialCount={0} />
        </div>
        <div className="header-theme">
          <ThemeToggle />
        </div>
        <AuthBlock />
      </div>
    </header>
  );
}
