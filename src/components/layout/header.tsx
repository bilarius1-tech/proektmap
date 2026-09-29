import Link from "next/link";
import { Search } from "lucide-react";
import MobileMenu from "./mobile-menu";
import AuthBlock from "./auth-block";
import FavoritesIndicator from "./favorites-indicator";
import ThemeToggle from "./theme-toggle";
import KnowledgeButtons from "@/components/knowledge/knowledge-buttons";
import { getHeaderMenu } from "@/lib/nav/get-header-menu";

/**
 * Верхняя полоска: логотип, поиск, вход.
 * Разделы — в левой колонке (HubSidebar) из таблицы MenuItem.
 */
export default async function GlobalHeader() {
  const visibleMenuItems = await getHeaderMenu();

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
      </div>

      <div className="header-right" style={{ display: "flex", alignItems: "center", gap: "var(--space-s)" }}>
        <Link
          href="/search"
          className="header-search-link hide-mobile"
          aria-label="Поиск по проекту"
          title="Поиск"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 36,
            height: 36,
            color: "var(--color-text-secondary)",
            textDecoration: "none",
          }}
        >
          <Search size={16} />
        </Link>
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
