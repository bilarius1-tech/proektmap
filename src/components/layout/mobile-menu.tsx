"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";

interface MenuItem {
  id: string; label: string; href: string; children?: MenuItem[];
}

export default function MobileMenu({ items }: { items: MenuItem[] }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  function toggleParent(id: string) {
    setExpanded(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  return (
    <>
      {/* Hamburger button — visible only on mobile */}
      <button onClick={() => setOpen(!open)} className="mobile-only" style={{
        display: "none", background: "none", border: "none", padding: 8, cursor: "pointer",
        color: "var(--color-text-primary)",
      }}>
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Overlay + Panel */}
      {open && (
        <>
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 98 }} onClick={() => setOpen(false)} />
          <div style={{
            position: "fixed", top: 0, left: 0, bottom: 0, width: 300, zIndex: 99,
            background: "var(--color-bg-primary)", boxShadow: "var(--shadow-l)", padding: "var(--space-xl) var(--space-m)",
            overflowY: "auto",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-l)" }}>
              <div style={{ fontSize: 18, fontWeight: 800 }}>
                Proekt<span style={{ color: "var(--color-accent)" }}>Map</span>
              </div>
              <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", padding: 8, cursor: "pointer", color: "var(--color-text-tertiary)" }}>
                <X size={20} />
              </button>
            </div>

            <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {items.map(item => (
                <div key={item.id}>
                  {item.children && item.children.length > 0 ? (
                    <>
                      <button onClick={() => toggleParent(item.id)} style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        width: "100%", padding: "12px", border: "none", background: "transparent",
                        cursor: "pointer", fontSize: "var(--text-m)", fontWeight: 600,
                        color: "var(--color-text-primary)",
                      }}>
                        {item.label}
                        <ChevronDown size={16} style={{ transform: expanded.has(item.id) ? "rotate(180deg)" : "none", transition: "0.2s" }} />
                      </button>
                      {expanded.has(item.id) && (
                        <div style={{ paddingLeft: "var(--space-m)" }}>
                          {item.children.map(child => (
                            <Link key={child.id} href={child.href} onClick={() => setOpen(false)}
                              style={{ display: "block", padding: "10px 12px", color: "var(--color-text-secondary)", textDecoration: "none", fontSize: "var(--text-s)" }}>
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link href={item.href} onClick={() => setOpen(false)}
                      style={{ display: "block", padding: "12px", color: "var(--color-text-primary)", textDecoration: "none", fontSize: "var(--text-m)", fontWeight: 600 }}>
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </>
      )}

      {/* Show hamburger on mobile */}
      <style>{`
        @media (max-width: 768px) {
          .mobile-only { display: flex !important; }
          .hide-mobile { display: none !important; }
        }
      `}</style>
    </>
  );
}
