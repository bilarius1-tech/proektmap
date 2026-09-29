"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import NavIcon from "./nav-icon";
import type { HeaderMenuNode } from "@/lib/nav/get-header-menu";

const MAP_ID = "header-sitemap";

function pathMatches(href: string, path: string) {
  if (!href || href === "#") return false;
  if (href === "/") return path === "/";
  return path === href || path.startsWith(`${href}/`);
}

function subtreeMatches(item: HeaderMenuNode, path: string): boolean {
  if (pathMatches(item.href, path)) return true;
  return (item.children || []).some((child) => subtreeMatches(child, path));
}

function collectOpen(items: HeaderMenuNode[], path: string, acc: string[] = []) {
  for (const item of items) {
    const kids = item.children || [];
    if (kids.length && subtreeMatches(item, path)) acc.push(item.id);
    collectOpen(kids, path, acc);
  }
  return acc;
}

function activeId(items: HeaderMenuNode[], path: string): string | null {
  const best = { id: null as string | null, len: -1 };
  const walk = (list: HeaderMenuNode[]) => {
    for (const item of list) {
      if (pathMatches(item.href, path) && item.href.length >= best.len) {
        best.id = item.id;
        best.len = item.href.length;
      }
      walk(item.children || []);
    }
  };
  walk(items);
  return best.id;
}

export default function HubNav({
  items,
  onNavigate,
}: {
  items: HeaderMenuNode[];
  onNavigate?: () => void;
}) {
  const pathname = usePathname() || "/";
  const stations = items.filter((item) => item.id !== MAP_ID);
  const mapLink = items.find((item) => item.id === MAP_ID) ?? null;
  const autoOpen = useMemo(
    () => new Set(collectOpen(items.filter((item) => item.id !== MAP_ID), pathname)),
    [items, pathname],
  );
  const currentId = useMemo(() => activeId(items, pathname), [items, pathname]);
  const [opened, setOpened] = useState<Set<string>>(new Set());
  const [closed, setClosed] = useState<Set<string>>(new Set());

  useEffect(() => {
    setOpened(new Set());
    setClosed(new Set());
  }, [pathname]);

  function isOpen(id: string) {
    if (closed.has(id)) return false;
    if (opened.has(id)) return true;
    return autoOpen.has(id);
  }

  function toggle(id: string) {
    if (isOpen(id)) {
      setClosed((prev) => new Set(prev).add(id));
      setOpened((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      return;
    }
    setOpened((prev) => new Set(prev).add(id));
    setClosed((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  function renderItems(list: HeaderMenuNode[], depth: number) {
    return list.map((item) => {
      const kids = item.children || [];
      const open = kids.length > 0 && isOpen(item.id);
      const active = item.id === currentId;
      return (
        <div key={item.id} className="hub-nav-node">
          <div className={`hub-nav-line depth-${depth}`}>
            <Link
              href={item.href}
              onClick={onNavigate}
              title={item.label}
              className={`hub-nav-row${active ? " is-active" : ""}${depth === 0 ? " is-station" : ""}`}
            >
              <NavIcon name={item.icon} size={depth === 0 ? 18 : 15} />
              <span>{item.label}</span>
            </Link>
            {kids.length > 0 && (
              <button
                type="button"
                className="hub-nav-chevron"
                aria-expanded={open}
                aria-label={open ? `Свернуть «${item.label}»` : `Развернуть «${item.label}»`}
                onClick={() => toggle(item.id)}
              >
                <ChevronDown size={16} style={{ transform: open ? "rotate(180deg)" : "none" }} />
              </button>
            )}
          </div>
          {open && <div className="hub-nav-children">{renderItems(kids, depth + 1)}</div>}
        </div>
      );
    });
  }

  return (
    <nav className="hub-nav" aria-label="Разделы сайта">
      {renderItems(stations, 0)}
      {mapLink && (
        <div className="hub-nav-map">
          <Link href={mapLink.href} onClick={onNavigate} className={`hub-nav-row${mapLink.id === currentId ? " is-active" : ""}`}>
            <NavIcon name={mapLink.icon || "Map"} size={16} />
            <span>{mapLink.label}</span>
          </Link>
        </div>
      )}
    </nav>
  );
}
