"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Archive,
  BookOpen,
  Bot,
  Boxes,
  ChevronDown,
  CircleUserRound,
  FileText,
  FolderTree,
  Hammer,
  Landmark,
  Search,
  Sparkles,
  Wrench,
} from "lucide-react";
import { SITE_TREE } from "./site-map-data";
import type { SiteTreeGroup, SiteTreeItem } from "./site-map-data";

export type DynamicSiteSection = {
  id: string;
  title: string;
  href: string;
  items: Array<{ title: string; href: string }>;
};

const GROUP_ICONS = {
  start: Sparkles,
  design: Hammer,
  tools: Wrench,
  russia: Landmark,
  knowledge: BookOpen,
  account: CircleUserRound,
  service: FileText,
  legacy: Archive,
} as const;

function filterItems(items: SiteTreeItem[], query: string): SiteTreeItem[] {
  if (!query) return items;
  return items.flatMap((item) => {
    const children = filterItems(item.children || [], query);
    const matches = `${item.title} ${item.description || ""} ${item.href || ""}`.toLowerCase().includes(query);
    if (!matches && children.length === 0) return [];
    return [{ ...item, children }];
  });
}

function TreeBranch({ item, level = 0 }: { item: SiteTreeItem; level?: number }) {
  const hasChildren = Boolean(item.children?.length);
  const content = (
    <>
      <span className="site-tree-node-dot" aria-hidden />
      <span className="site-tree-node-copy">
        <strong>{item.title}</strong>
        {item.description && <small>{item.description}</small>}
      </span>
      {item.status === "planned" && <span className="site-tree-badge is-planned">Скоро</span>}
      {item.status === "legacy" && <span className="site-tree-badge is-legacy">Архив</span>}
      {item.href && <code>{item.href}</code>}
    </>
  );

  return (
    <li className="site-tree-node" data-level={level}>
      <div className={`site-tree-node-row ${!item.href ? "is-static" : ""}`}>
        {item.href ? <Link href={item.href}>{content}</Link> : <div>{content}</div>}
      </div>
      {hasChildren && (
        <ul className="site-tree-children">
          {item.children!.map((child) => (
            <TreeBranch key={`${child.title}-${child.href || "planned"}`} item={child} level={level + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function SitemapClient({ dynamicSections }: { dynamicSections: DynamicSiteSection[] }) {
  const [query, setQuery] = useState("");
  const [openMap, setOpenMap] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(SITE_TREE.map((group) => [group.id, group.id !== "legacy"])),
  );
  const normalizedQuery = query.trim().toLowerCase();

  function setAllOpen(open: boolean) {
    setOpenMap((previous) => {
      const next = { ...previous };
      for (const group of SITE_TREE) next[group.id] = open;
      for (const section of dynamicSections) next[section.id] = open;
      return next;
    });
  }

  function toggleOpen(id: string, open: boolean) {
    setOpenMap((previous) => ({ ...previous, [id]: open }));
  }

  const groups = useMemo(
    () => SITE_TREE.map((group) => ({ ...group, items: filterItems(group.items, normalizedQuery) }))
      .filter((group) => group.items.length > 0),
    [normalizedQuery],
  );
  const filteredDynamic = useMemo(
    () => dynamicSections.map((section) => ({
      ...section,
      items: normalizedQuery
        ? section.items.filter((item) => `${item.title} ${item.href}`.toLowerCase().includes(normalizedQuery))
        : section.items,
    })).filter((section) => !normalizedQuery || section.items.length > 0 || section.title.toLowerCase().includes(normalizedQuery)),
    [dynamicSections, normalizedQuery],
  );
  const staticCount = SITE_TREE.reduce((total, group) => total + countItems(group.items), 0);
  const dynamicCount = dynamicSections.reduce((total, section) => total + section.items.length, 0);

  return (
    <div className="site-tree-page">
      <header className="site-tree-hero">
        <div className="site-tree-hero-icon"><FolderTree size={28} /></div>
        <span>Навигация без лабиринта</span>
        <h1>Карта сайта ProektMap</h1>
        <p>
          Обычное дерево всех публичных разделов: открывайте ветки, находите страницу
          по названию или URL и сразу переходите по ссылке.
        </p>
        <div className="site-tree-stats">
          <div><strong>{staticCount}</strong><span>страниц и разделов</span></div>
          <div><strong>{dynamicCount}</strong><span>материалов в каталогах</span></div>
          <div><strong>{SITE_TREE.length}</strong><span>главных веток</span></div>
        </div>
      </header>

      <main className="site-tree-shell">
        <section className="site-tree-toolbar" aria-label="Поиск и управление деревом">
          <label>
            <Search size={18} />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Найти раздел, страницу или URL…"
              aria-label="Найти раздел, страницу или URL"
            />
          </label>
          <div>
            <button type="button" onClick={() => setAllOpen(true)}>Развернуть всё</button>
            <button type="button" onClick={() => setAllOpen(false)}>Свернуть всё</button>
          </div>
        </section>

        {groups.length === 0 && filteredDynamic.length === 0 ? (
          <div className="site-tree-empty">
            <Search size={24} />
            <strong>Ничего не найдено</strong>
            <span>Попробуйте название раздела или часть URL.</span>
          </div>
        ) : (
          <div className="site-tree-layout">
            <section className="site-tree-groups" aria-label="Основные разделы сайта">
              {groups.map((group) => (
                <TreeGroup
                  key={group.id}
                  group={group}
                  open={Boolean(normalizedQuery) || (openMap[group.id] ?? group.id !== "legacy")}
                  onOpenChange={(open) => toggleOpen(group.id, open)}
                />
              ))}
            </section>

            {filteredDynamic.length > 0 && (
              <aside className="site-tree-catalogs">
                <div className="site-tree-catalogs-heading">
                  <Boxes size={20} />
                  <div><strong>Все материалы каталогов</strong><span>Данные обновляются из базы автоматически</span></div>
                </div>
                {filteredDynamic.map((section) => (
                  <details
                    key={section.id}
                    open={Boolean(normalizedQuery) || Boolean(openMap[section.id])}
                  >
                    <summary
                      onClick={(event) => {
                        event.preventDefault();
                        toggleOpen(section.id, !(Boolean(normalizedQuery) || Boolean(openMap[section.id])));
                      }}
                    >
                      <span>{section.title}</span>
                      <small>{section.items.length}</small>
                      <ChevronDown size={16} />
                    </summary>
                    <div>
                      <Link href={section.href} className="site-tree-catalog-all">Открыть весь каталог</Link>
                      {section.items.map((item) => (
                        <Link href={item.href} key={item.href}>{item.title}<code>{item.href}</code></Link>
                      ))}
                    </div>
                  </details>
                ))}
              </aside>
            )}
          </div>
        )}

        <section className="site-tree-note">
          <Bot size={20} />
          <div>
            <strong>Карта показывает публичную часть проекта.</strong>
            <span>API, административные и персональные динамические URL намеренно не публикуются. Новые страницы добавляются в единый реестр, а материалы каталогов подтягиваются автоматически.</span>
          </div>
        </section>
      </main>
    </div>
  );
}

function TreeGroup({
  group,
  open,
  onOpenChange,
}: {
  group: SiteTreeGroup;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const Icon = GROUP_ICONS[group.id as keyof typeof GROUP_ICONS] || FolderTree;
  return (
    <details className="site-tree-group" open={open}>
      <summary onClick={(event) => { event.preventDefault(); onOpenChange(!open); }}>
        <span className="site-tree-group-icon"><Icon size={20} /></span>
        <span><strong>{group.title}</strong><small>{group.description}</small></span>
        <span className="site-tree-group-count">{countItems(group.items)}</span>
        <ChevronDown size={18} />
      </summary>
      <ul className="site-tree-list">
        {group.items.map((item) => <TreeBranch key={`${item.title}-${item.href || "group"}`} item={item} />)}
      </ul>
    </details>
  );
}

function countItems(items: SiteTreeItem[]): number {
  return items.reduce((total, item) => total + 1 + countItems(item.children || []), 0);
}
