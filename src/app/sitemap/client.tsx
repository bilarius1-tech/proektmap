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
import {
  BEGINNER_HIDDEN_GROUPS,
  SITE_TASK_HINTS,
  SITE_TREE,
  filterBeginnerItems,
  matchTaskHints,
} from "./site-map-data";
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

function filterItems(items: SiteTreeItem[], query: string, extraHrefs: Set<string>): SiteTreeItem[] {
  if (!query && extraHrefs.size === 0) return items;
  return items.flatMap((item) => {
    const children = filterItems(item.children || [], query, extraHrefs);
    const haystack = `${item.title} ${item.description || ""} ${item.href || ""}`.toLowerCase();
    const matches = (query && haystack.includes(query)) || Boolean(item.href && extraHrefs.has(item.href));
    if (!matches && children.length === 0) return [];
    return [{ ...item, children }];
  });
}

function TreeBranch({ item, level = 0, highlightHref }: { item: SiteTreeItem; level?: number; highlightHref?: string }) {
  const hasChildren = Boolean(item.children?.length);
  const isHit = Boolean(highlightHref && item.href === highlightHref);
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
      <div className={`site-tree-node-row ${!item.href ? "is-static" : ""}${isHit ? " is-task-hit" : ""}`}>
        {item.href ? <Link href={item.href}>{content}</Link> : <div>{content}</div>}
      </div>
      {hasChildren && (
        <ul className="site-tree-children">
          {item.children!.map((child) => (
            <TreeBranch
              key={`${child.title}-${child.href || "planned"}`}
              item={child}
              level={level + 1}
              highlightHref={highlightHref}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function SitemapClient({ dynamicSections }: { dynamicSections: DynamicSiteSection[] }) {
  const [query, setQuery] = useState("");
  const [beginner, setBeginner] = useState(true);
  const [openMap, setOpenMap] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(SITE_TREE.map((group) => [group.id, group.id !== "legacy" && group.id !== "service"])),
  );
  const normalizedQuery = query.trim().toLowerCase();
  const matchedHints = useMemo(() => matchTaskHints(normalizedQuery), [normalizedQuery]);
  const extraHrefs = useMemo(() => new Set(matchedHints.map((hint) => hint.href)), [matchedHints]);
  const showFullTree = !beginner || Boolean(normalizedQuery);

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

  const groups = useMemo(() => {
    return SITE_TREE.filter((group) => showFullTree || !BEGINNER_HIDDEN_GROUPS.has(group.id))
      .map((group) => {
        const scopedItems = showFullTree ? group.items : filterBeginnerItems(group.items);
        return { ...group, items: filterItems(scopedItems, normalizedQuery, extraHrefs) };
      })
      .filter((group) => group.items.length > 0);
  }, [normalizedQuery, extraHrefs, showFullTree]);

  const filteredDynamic = useMemo(() => {
    if (beginner && !normalizedQuery) return [];
    return dynamicSections.map((section) => ({
      ...section,
      items: normalizedQuery
        ? section.items.filter((item) => `${item.title} ${item.href}`.toLowerCase().includes(normalizedQuery))
        : section.items,
    })).filter((section) => !normalizedQuery || section.items.length > 0 || section.title.toLowerCase().includes(normalizedQuery));
  }, [dynamicSections, normalizedQuery, beginner]);

  const visibleTree = showFullTree ? SITE_TREE : SITE_TREE.filter((group) => !BEGINNER_HIDDEN_GROUPS.has(group.id));
  const staticCount = visibleTree.reduce(
    (total, group) => total + countItems(showFullTree ? group.items : filterBeginnerItems(group.items)),
    0,
  );
  const dynamicCount = beginner && !normalizedQuery
    ? 0
    : dynamicSections.reduce((total, section) => total + section.items.length, 0);
  const highlightHref = matchedHints[0]?.href;

  return (
    <div className="site-tree-page">
      <header className="site-tree-hero">
        <div className="site-tree-hero-icon"><FolderTree size={28} /></div>
        <span>Полная карта, не первый шаг</span>
        <h1>Карта сайта ProektMap</h1>
        <p>
          Здесь лежит вся вселенная разделов. Новичку достаточно режима «Новичок» и задачи вроде
          «запустить магазин». Если нужен продукт сегодня — начните с готового маршрута.
        </p>
        <div className="site-tree-stats">
          <div><strong>{staticCount}</strong><span>страниц в этом режиме</span></div>
          <div><strong>{dynamicCount}</strong><span>материалов в каталогах</span></div>
          <div><strong>{groups.length}</strong><span>видимых веток</span></div>
        </div>
      </header>

      <main className="site-tree-shell">
        <section className="site-tree-toolbar" aria-label="Поиск и режим карты">
          <label>
            <Search size={18} />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Хочу запустить магазин, собрать SaaS, сделать бота…"
              aria-label="Найти раздел по задаче, названию или URL"
            />
          </label>
          <div>
            <button
              type="button"
              className={beginner ? "is-active" : undefined}
              onClick={() => setBeginner(true)}
            >
              Новичок
            </button>
            <button
              type="button"
              className={!beginner ? "is-active" : undefined}
              onClick={() => setBeginner(false)}
            >
              Вся карта
            </button>
            <button type="button" onClick={() => setAllOpen(true)}>Развернуть всё</button>
            <button type="button" onClick={() => setAllOpen(false)}>Свернуть всё</button>
          </div>
        </section>

        <section className="site-tree-tasks" aria-label="Поиск по задаче">
          {SITE_TASK_HINTS.map((hint) => (
            <button
              key={hint.id}
              type="button"
              className={query === hint.query ? "is-active" : undefined}
              onClick={() => setQuery(hint.query)}
            >
              {hint.label}
            </button>
          ))}
          <Link href="/resheniya" className="site-tree-start-link">Начать с маршрута →</Link>
        </section>

        {matchedHints.length > 0 && (
          <div className="site-tree-task-hits">
            {matchedHints.map((hint) => (
              <Link key={hint.id} href={hint.href}>
                Задача: {hint.label}
                <code>{hint.href}</code>
              </Link>
            ))}
          </div>
        )}

        {groups.length === 0 && filteredDynamic.length === 0 ? (
          <div className="site-tree-empty">
            <Search size={24} />
            <strong>Ничего не найдено</strong>
            <span>Попробуйте задачу: магазин, SaaS, бот — или часть URL.</span>
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
                  highlightHref={highlightHref}
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
            <strong>Карта инвентаризует, главная маршрутизирует.</strong>
            <span>Режим «Новичок» прячет архив, лаборатории и planned-страницы. Новые разделы добавляются спицей в существующий хаб, а не отдельной вселенной.</span>
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
  highlightHref,
}: {
  group: SiteTreeGroup;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  highlightHref?: string;
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
        {group.items.map((item) => (
          <TreeBranch key={`${item.title}-${item.href || "group"}`} item={item} highlightHref={highlightHref} />
        ))}
      </ul>
    </details>
  );
}

function countItems(items: SiteTreeItem[]): number {
  return items.reduce((total, item) => total + 1 + countItems(item.children || []), 0);
}
