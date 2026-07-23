"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, MessageSquare, Package, Plug, Trash2, Heart } from "lucide-react";

const TYPE_ICONS: Record<string, any> = {
  glossary: BookOpen, prompt: MessageSquare, pattern: Package, mcp: Plug,
};
const TYPE_LABELS: Record<string, string> = {
  glossary: "Глоссарий", prompt: "Промпты", pattern: "Паттерны", mcp: "MCP-серверы",
};

export default function CollectionPageClient({ items }: any) {
  const [list, setList] = useState(items || []);

  async function remove(entityType: string, entitySlug: string) {
    await fetch("/api/collection", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entityType, entitySlug }),
    });
    setList((prev: any[]) => prev.filter((i: any) => !(i.entityType === entityType && i.entitySlug === entitySlug)));
  }

  // Group by type
  const grouped: Record<string, any[]> = {};
  for (const item of list) {
    if (!grouped[item.entityType]) grouped[item.entityType] = [];
    grouped[item.entityType].push(item);
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "var(--space-xl) var(--space-m)" }}>
      <div style={{ marginBottom: "var(--space-xl)" }}>
        <h1 style={{ fontSize: "var(--text-xxl)", fontWeight: 800, marginBottom: 8 }}>❤️ Моя карта знаний</h1>
        <p style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)" }}>
          {list.length === 0 ? "Вы пока ничего не сохранили. Нажимайте ❤️ на страницах терминов, промптов, паттернов и MCP." : `Сохранено: ${list.length} материалов`}
        </p>
      </div>

      {list.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: "var(--color-text-tertiary)" }}>
          <Heart size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
          <div style={{ fontSize: "var(--text-m)", fontWeight: 700, marginBottom: 8 }}>Пока пусто</div>
          <div style={{ fontSize: "var(--text-s)" }}>
            Начните с <Link href="/glossary" style={{ color: "var(--color-accent)" }}>глоссария</Link> или <Link href="/patterns" style={{ color: "var(--color-accent)" }}>паттернов</Link>
          </div>
        </div>
      ) : (
        Object.entries(grouped).map(([type, typeItems]) => {
          const Icon = TYPE_ICONS[type] || BookOpen;
          return (
            <div key={type} style={{ marginBottom: "var(--space-l)" }}>
              <div style={{ fontSize: "var(--text-xs)", fontWeight: 800, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "var(--space-s)", display: "flex", alignItems: "center", gap: 6 }}>
                <Icon size={14} /> {TYPE_LABELS[type] || type} ({typeItems.length})
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {typeItems.map((item: any) => (
                  <div key={item.id} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "10px 14px", background: "var(--color-bg-primary)",
                    border: "1px solid var(--color-border-light)", borderRadius: 0,
                  }}>
                    <Link href={item.href} style={{ flex: 1, textDecoration: "none", color: "inherit" }}>
                      <div style={{ fontWeight: 700, fontSize: "var(--text-s)", color: "var(--color-accent)" }}>{item.title}</div>
                      {item.subtitle && <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>{item.subtitle}</div>}
                    </Link>
                    <button onClick={() => remove(item.entityType, item.entitySlug)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-tertiary)", padding: 4 }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
