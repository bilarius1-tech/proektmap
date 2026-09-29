"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Search } from "lucide-react";
import FavoritesIndicator from "./favorites-indicator";
import ThemeToggle from "./theme-toggle";
import KnowledgeButtons from "@/components/knowledge/knowledge-buttons";
import HubNav from "./hub-nav";
import type { HeaderMenuNode } from "@/lib/nav/get-header-menu";

export default function MobileMenu({ items }: { items: HeaderMenuNode[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="mobile-only"
        aria-label={open ? "Закрыть меню" : "Открыть меню"}
        aria-expanded={open}
        style={{
        width: 48, height: 48, background: "none", border: "none", padding: 8, cursor: "pointer",
        color: "var(--color-text-primary)",
      }}>
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {open && (
        <>
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 98 }} onClick={() => setOpen(false)} />
          <div className="mobile-menu-drawer" style={{
            position: "fixed", top: 0, left: 0, bottom: 0, width: 300, zIndex: 99,
            background: "var(--color-bg-primary)", boxShadow: "var(--shadow-l)", padding: "var(--space-xl) var(--space-m)",
            overflowY: "auto",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-l)" }}>
              <div style={{ fontSize: 18, fontWeight: 800 }}>
                Proekt<span style={{ color: "var(--color-accent)" }}>Map</span>
              </div>
              <button aria-label="Закрыть меню" onClick={() => setOpen(false)} style={{ width: 48, height: 48, background: "none", border: "none", padding: 8, cursor: "pointer", color: "var(--color-text-tertiary)" }}>
                <X size={20} />
              </button>
            </div>

            <HubNav items={items} onNavigate={() => setOpen(false)} />

            <div className="mobile-menu-actions">
              <div className="mobile-menu-actions-title">Быстрые действия</div>
              <Link href="/search" onClick={() => setOpen(false)} className="mobile-menu-action-row" style={{ textDecoration: "none", color: "inherit" }}>
                <Search size={16} />
                <span>Поиск</span>
              </Link>
              <KnowledgeButtons />
              <div className="mobile-menu-action-row">
                <FavoritesIndicator initialCount={0} />
                <span>Избранное</span>
              </div>
              <div className="mobile-menu-action-row">
                <ThemeToggle />
                <span>Тема оформления</span>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
