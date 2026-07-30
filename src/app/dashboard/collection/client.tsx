"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bookmark, Trash2, Eye, Calendar, FileText, Lightbulb, Zap, BookOpen, GitBranch } from "lucide-react";

const TABS = [
  { key: "all", label: "Все", icon: Bookmark },
  { key: "blog_post", label: "Блог", icon: FileText },
  { key: "solution", label: "Решения", icon: Lightbulb },
  { key: "skill", label: "Навыки", icon: Zap },
  { key: "glossary_term", label: "Глоссарий", icon: BookOpen },
  { key: "decision", label: "Решения (этапы)", icon: GitBranch },
];

export default function CollectionClient({ items, blogMap, solutionMap, skillMap, termMap, decisionMap }: any) {
  const [list, setList] = useState(items);
  const [tab, setTab] = useState("all");

  const filtered = tab === "all" ? list : list.filter((i: any) => i.entityType === tab);

  async function remove(entityType: string, entitySlug: string) {
    await fetch("/api/collection", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ entityType, entitySlug }) });
    setList(list.filter((i: any) => !(i.entityType === entityType && i.entitySlug === entitySlug)));
  }

  function getTitle(item: any): string {
    const slug = item.entitySlug;
    switch (item.entityType) {
      case "blog_post": return blogMap[slug]?.title || slug;
      case "solution": return solutionMap[slug]?.title || slug;
      case "skill": return skillMap[slug]?.title || slug;
      case "glossary_term": return termMap[slug]?.term || slug;
      case "decision": return decisionMap[slug]?.title || slug;
      default: return slug;
    }
  }

  function getLink(item: any): string {
    const slug = item.entitySlug;
    switch (item.entityType) {
      case "blog_post": return `/blog/${blogMap[slug]?.slug || slug}`;
      case "solution": return `/solutions/${slug}`;
      case "skill": return `/skills/${slug}`;
      case "glossary_term": return `/glossary/${slug}`;
      case "decision": return `/decisions#${slug}`;
      default: return "#";
    }
  }

  function getMeta(item: any): string {
    const slug = item.entitySlug;
    switch (item.entityType) {
      case "blog_post": return `${blogMap[slug]?.viewCount || 0} просмотров`;
      case "solution": return solutionMap[slug]?.summary?.slice(0, 60) || "";
      case "skill": return "Навык";
      case "glossary_term": return termMap[slug]?.simpleExplanation?.slice(0, 60) || "";
      case "decision": return "Этап";
      default: return "";
    }
  }

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "var(--space-xl) var(--space-m)" }}>
      <Link href="/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", textDecoration: "none", marginBottom: "var(--space-l)" }}>
        <ArrowLeft size={14} /> В личный кабинет
      </Link>
      <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "var(--text-xxl)", marginBottom: "var(--space-l)", display: "flex", alignItems: "center", gap: 10 }}>
        <Bookmark size={28} /> Мои закладки
      </h1>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: "var(--space-l)", flexWrap: "wrap", borderBottom: "1px solid var(--color-border)", paddingBottom: "var(--space-s)" }}>
        {TABS.map(t => {
          const count = t.key === "all" ? list.length : list.filter((i: any) => i.entityType === t.key).length;
          return (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: "6px 14px", borderRadius: "var(--radius-full)", border: "none", cursor: "pointer",
              background: tab === t.key ? "var(--color-accent)" : "transparent",
              color: tab === t.key ? "white" : "var(--color-text-secondary)",
              fontSize: "var(--text-xs)", fontWeight: 600,
              display: "flex", alignItems: "center", gap: 4,
            }}>
              <t.icon size={13} />
              {t.label}
              {count > 0 && <span style={{ fontSize: 10, opacity: 0.7 }}>{count}</span>}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "var(--space-xl)", color: "var(--color-text-tertiary)" }}>
          <div style={{ fontSize: 48, marginBottom: "var(--space-m)" }}>📑</div>
          <p>{tab === "all" ? "У вас пока нет закладок." : "В этой категории пока нет закладок."}</p>
          <p style={{ marginTop: "var(--space-s)", fontSize: "var(--text-xs)" }}>
            Нажимайте ❤️ Сохранить на страницах блога, решений, навыков и глоссария.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
          {filtered.map((item: any) => (
            <div key={item.id} style={{ display: "flex", gap: "var(--space-m)", padding: "var(--space-m)", background: "var(--color-bg-primary)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Link href={getLink(item)} style={{ textDecoration: "none", color: "inherit" }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: "var(--color-accent)", textTransform: "uppercase", marginBottom: 2 }}>
                    {TABS.find(t => t.key === item.entityType)?.label || item.entityType}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: "var(--text-s)", marginBottom: 4, lineHeight: 1.3 }}>{getTitle(item)}</div>
                  <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.4 }}>{getMeta(item)}</div>
                </Link>
              </div>
              <button onClick={() => remove(item.entityType, item.entitySlug)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-tertiary)", padding: 4, alignSelf: "flex-start" }} title="Убрать из закладок">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
