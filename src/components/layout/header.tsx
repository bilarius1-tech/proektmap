import { getDb } from "@/lib/db";
import Link from "next/link";
import MobileMenu from "./mobile-menu";
import AuthBlock from "./auth-block";
import FavoritesIndicator from "./favorites-indicator";
import ThemeToggle from "./theme-toggle";
import DesktopMenuItem from "./desktop-menu-item";
import KnowledgeButtons from "@/components/knowledge/knowledge-buttons";

export default async function GlobalHeader() {
  let menuItems: any = [];
  try {
  } catch (e) {}

  return (
    <header style={{
      height: 56, background: "var(--color-bg-primary)", display: "flex", alignItems: "center",
      justifyContent: "space-between", padding: "0 var(--space-m)",
      borderBottom: "1px solid var(--color-border-light)",
      position: "sticky", top: 0, zIndex: 100,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-s)" }}>
        <MobileMenu items={menuItems}  />
        <Link href="/" className="header-logo" style={{ fontFamily: "var(--font-heading)", fontSize: 18, fontWeight: 700, textDecoration: "none", color: "inherit", whiteSpace: "nowrap" }}>
          Карта<span style={{ color: "var(--color-accent)" }}> роста</span>
        </Link>
        <nav style={{ display: "flex", gap: 4, alignItems: "center", marginLeft: "var(--space-l)" }} className="header-nav hide-mobile">
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
