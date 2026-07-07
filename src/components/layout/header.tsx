import { getDb } from "@/lib/db";
import GlobalSearch from "./global-search";
import Link from "next/link";
import MobileMenu from "./mobile-menu";
import AuthBlock from "./auth-block";
import ThemeToggle from "./theme-toggle";

export default async function GlobalHeader() {
  let menuItems: any[] = [];
  try {
    const db = await getDb();
    menuItems = await db.menuItem.findMany({
      where: { parentId: null, isActive: true, location: "header" },
      orderBy: { sortOrder: "asc" },
      include: { children: { where: { isActive: true }, orderBy: { sortOrder: "asc" } } },
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
          <GlobalSearch />
        <MobileMenu items={menuItems} />
        <Link href="/" style={{ fontSize: 18, fontWeight: 800, textDecoration: "none", color: "inherit", whiteSpace: "nowrap" }}>
          Карта<span style={{ color: "var(--color-accent)" }}> роста</span>
        </Link>
        <nav style={{ display: "flex", gap: 4, alignItems: "center", marginLeft: "var(--space-l)" }} className="hide-mobile">
          {menuItems.map(item => (
            <Link key={item.id} href={item.href} style={{
              color: "var(--color-text-secondary)", fontSize: "var(--text-s)", textDecoration: "none",
              padding: "6px 12px", borderRadius: "var(--radius-s)", transition: "background 0.1s",
            }}>{item.label}</Link>
          ))}
        </nav>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-s)" }}>
          <GlobalSearch />
        <ThemeToggle />
        <AuthBlock />
      </div>
    </header>
  );
}
