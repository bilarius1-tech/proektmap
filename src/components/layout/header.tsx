import { getDb } from "@/lib/db";
import Link from "next/link";
import MobileMenu from "./mobile-menu";
import AuthBlock from "./auth-block";
import FavoritesIndicator from "./favorites-indicator";
import ThemeToggle from "./theme-toggle";
import DesktopMenuItem from "./desktop-menu-item";
import BlueprintsMenu from "./blueprints-menu";
import KnowledgeButtons from "@/components/knowledge/knowledge-buttons";

export default async function GlobalHeader() {
  let menuItems: any = [];
  let blueprints: any = [];
  try {
    const db = await getDb();
    menuItems = await db.menuItem.findMany({
      where: { parentId: null, isActive: true, location: "header" },
      orderBy: { sortOrder: "asc" },
      include: { children: { where: { isActive: true }, orderBy: { sortOrder: "asc" } } },
    });
  } catch (e) {}
  try {
    const db2 = await getDb();
    blueprints = await db2.blueprint.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: "asc" },
      select: { id: true, title: true, slug: true },
    });
  } catch (e) {}

  return (
    <header style={{
      height: 56, background: "var(--color-bg-primary)", display: "flex", alignItems: "center",
      justifyContent: "space-between", padding: "0 var(--space-m)",
      borderBottom: "1px solid var(--color-border-light)",
      position: "sticky", top: 0, zIndex: 100,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-s)" }}>
        <MobileMenu items={menuItems} blueprints={blueprints} />
        <Link href="/" className="header-logo" style={{ fontFamily: "var(--font-heading)", fontSize: 18, fontWeight: 700, textDecoration: "none", color: "inherit", whiteSpace: "nowrap" }}>
          Карта<span style={{ color: "var(--color-accent)" }}> роста</span>
        </Link>
        <nav style={{ display: "flex", gap: 4, alignItems: "center", marginLeft: "var(--space-l)" }} className="header-nav hide-mobile">
          {/* Динамическое меню Blueprint'ов — всегда актуально */}
          <BlueprintsMenu />
          {(menuItems as any[]).map((item: any) => (
            <DesktopMenuItem key={item.id} item={item} />
          ))}
        </nav>
      </div>

      <div className="header-right" style={{ display: "flex", alignItems: "center", gap: "var(--space-s)" }}>
        <KnowledgeButtons />
        <FavoritesIndicator initialCount={0} />
        <ThemeToggle />
        <AuthBlock />
      </div>
    </header>
  );
}
