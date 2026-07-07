import { getDb } from "@/lib/db";
import GlobalSearch from "./global-search";
import Link from "next/link";
import MobileMenu from "./mobile-menu";
import AuthBlock from "./auth-block";
import ThemeToggle from "./theme-toggle";
import { auth } from "@/lib/auth";

export default async function GlobalHeader() {
  let menuItems: any[] = [];
  let hasFavorites = false;
  
  try {
    const db = await getDb();
    menuItems = await db.menuItem.findMany({
      where: { parentId: null, isActive: true, location: "header" },
      orderBy: { sortOrder: "asc" },
      include: { children: { where: { isActive: true }, orderBy: { sortOrder: "asc" } } },
    });

    // Check if logged-in user has favorites
    const session = await auth();
    if (session?.user) {
      const count = await db.favorite.count({
        where: { userId: (session.user as any).id },
      });
      hasFavorites = count > 0;
    }
  } catch (e) {}

  return (
    <header style={{
      height: 56, background: "var(--color-bg-primary)", display: "flex", alignItems: "center",
      justifyContent: "space-between", padding: "0 var(--space-m)",
      borderBottom: "1px solid var(--color-border-light)",
      position: "sticky", top: 0, zIndex: 100,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-s)" }}>
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
        <a href="/dashboard/favorites" title="Избранное" style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: 36, height: 36, borderRadius: "var(--radius-m)",
          border: "1px solid var(--color-border-light)",
          textDecoration: "none", fontSize: 14,
          color: hasFavorites ? "var(--color-error)" : "var(--color-text-tertiary)",
          fontWeight: hasFavorites ? 700 : 400,
        }}>
          {hasFavorites ? "♥" : "♡"}
        </a>
        <ThemeToggle />
        <AuthBlock />
      </div>
    </header>
  );
}
