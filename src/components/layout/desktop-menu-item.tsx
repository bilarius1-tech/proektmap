"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

export interface MenuNode {
  id: string;
  label: string;
  href: string;
  icon?: string | null;
  emoji?: string | null;
  children?: MenuNode[];
}

export default function DesktopMenuItem({ item }: { item: MenuNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const children = item.children || [];
  const hasChildren = children.length > 0;
  const hasGrandchildren = children.some((c) => (c.children?.length || 0) > 0);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  function onMouseEnter() {
    if (timer.current) clearTimeout(timer.current);
    if (hasChildren) setOpen(true);
  }
  function onMouseLeave() {
    timer.current = setTimeout(() => setOpen(false), 180);
  }

  if (!hasChildren) {
    const linkClass =
      item.href === "/resheniya"
        ? "header-solutions-link"
        : item.href === "/avito"
          ? "header-avito-link"
          : item.href === "/sitemap"
            ? "header-sitemap-link"
            : "header-menu-link";

    return (
      <Link href={item.href || "#"} className={linkClass}>
        {item.label}
      </Link>
    );
  }

  const colCount = hasGrandchildren
    ? Math.min(4, Math.max(2, children.filter((c) => (c.children?.length || 0) > 0 || c.href).length))
    : 2;

  return (
    <div
      ref={ref}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ position: "relative" }}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          color: open ? "var(--color-accent)" : "var(--color-text-secondary)",
          fontSize: "var(--text-s)",
          padding: "6px 10px",
          borderRadius: "var(--radius-s)",
          transition: "all 0.1s",
          background: open ? "var(--color-accent-light)" : "transparent",
          border: "none",
          cursor: "pointer",
          fontFamily: "inherit",
          whiteSpace: "nowrap",
          fontWeight: 600,
        }}
      >
        {item.label}
        <ChevronDown
          size={14}
          style={{
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.2s",
          }}
        />
      </button>

      {open && (
        <div
          onMouseEnter={() => {
            if (timer.current) clearTimeout(timer.current);
          }}
          onMouseLeave={onMouseLeave}
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            marginTop: 6,
            zIndex: 200,
            background: "var(--color-bg-primary)",
            border: "1px solid var(--color-border)",
            boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
            padding: hasGrandchildren ? 16 : 10,
            minWidth: hasGrandchildren ? Math.min(720, colCount * 180) : 360,
            maxWidth: "min(860px, calc(100vw - 32px))",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              marginBottom: 10,
              paddingBottom: 8,
              borderBottom: "1px solid var(--color-border-light)",
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: "var(--color-text-secondary)",
              }}
            >
              {item.label}
            </span>
            {item.href && item.href !== "#" && (
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                style={{
                  fontSize: 12,
                  color: "var(--color-accent)",
                  textDecoration: "none",
                  fontWeight: 700,
                }}
              >
                Все →
              </Link>
            )}
          </div>

          {hasGrandchildren ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${colCount}, minmax(140px, 1fr))`,
                gap: "16px 20px",
              }}
            >
              {children.map((group) => {
                const links = group.children || [];
                return (
                  <div key={group.id}>
                    {group.href && group.href !== "#" ? (
                      <Link
                        href={group.href}
                        onClick={() => setOpen(false)}
                        style={{
                          display: "block",
                          fontWeight: 800,
                          fontSize: 13,
                          color: "var(--color-text-primary)",
                          textDecoration: "none",
                          marginBottom: 8,
                        }}
                      >
                        {group.emoji ? `${group.emoji} ` : ""}
                        {group.label}
                      </Link>
                    ) : (
                      <div
                        style={{
                          fontWeight: 800,
                          fontSize: 13,
                          marginBottom: 8,
                          color: "var(--color-text-primary)",
                        }}
                      >
                        {group.emoji ? `${group.emoji} ` : ""}
                        {group.label}
                      </div>
                    )}
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      {links.length === 0 && group.href && group.href !== "#" ? (
                        <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>
                          Открыть раздел
                        </span>
                      ) : (
                        links.map((link) => (
                          <Link
                            key={link.id}
                            href={link.href}
                            onClick={() => setOpen(false)}
                            style={{
                              display: "block",
                              padding: "5px 0",
                              fontSize: 13,
                              color: "var(--color-text-secondary)",
                              textDecoration: "none",
                              lineHeight: 1.35,
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLElement).style.color = "var(--color-accent)";
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLElement).style.color =
                                "var(--color-text-secondary)";
                            }}
                          >
                            {link.label}
                          </Link>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 2,
              }}
            >
              {children.map((child) => (
                <Link
                  key={child.id}
                  href={child.href}
                  onClick={() => setOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 10px",
                    textDecoration: "none",
                    color: "var(--color-text-primary)",
                    fontSize: "var(--text-s)",
                    fontWeight: 500,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "var(--color-accent-light)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  {child.emoji ? (
                    <span style={{ fontSize: 16, flexShrink: 0, lineHeight: 1 }}>{child.emoji}</span>
                  ) : null}
                  <span style={{ lineHeight: 1.3 }}>{child.label}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
