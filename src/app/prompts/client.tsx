"use client";

import { Copy, Search, ChevronDown } from "lucide-react";
import { useState } from "react";
import { RenderTemplate, VariableLegend } from "@/components/blueprint/template-help";

interface Prompt {
  id: string; title: string; category: string;
  description: string | null; content: string; tags: string;
  useCount: number;
}
interface Variable {
  name: string; label: string; description: string; example: string; category: string;
}

const CAT_ICONS: Record<string, string> = {
  "Код": "💻", "Деплой": "🚀", "Дизайн": "🎨",
  "SEO": "🔍", "Право": "⚖️", "AI": "🤖",
};

export default function PromptsPageClient({ prompts, variables }: { prompts: Prompt[]; variables: Variable[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Все");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const categories = ["Все", ...Array.from(new Set(prompts.map(p => p.category)))];
  const filtered = prompts.filter(p => {
    const m = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.tags.includes(search) || (p.description?.toLowerCase().includes(search.toLowerCase()));
    return m && (category === "Все" || p.category === category);
  });

  function copy(content: string, id: string) {
    navigator.clipboard.writeText(content);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "var(--space-xl) var(--space-m)" }}>
      <div style={{ marginBottom: "var(--space-l)" }}>
        <h1 style={{ fontSize: "var(--text-xxxl)", fontWeight: 800, marginBottom: "var(--space-xs)" }}>📚 Библиотека промптов</h1>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-s)", lineHeight: 1.7 }}>
          Готовые промпты для AI-агентов. Форк из{" "}
          <a href="https://github.com/yourkeychen/vibe-coding-cn" target="_blank" rel="noopener" style={{ color: "var(--color-accent)" }}>vibe-coding-cn</a>{" "}
          (22k ⭐). Адаптированы под русский рынок и российские сервисы.
        </p>
        <VariableLegend variables={variables} />
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: "var(--space-l)", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--color-text-tertiary)" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск по названию, тегам, описанию..."
            style={{ width: "100%", padding: "10px 10px 10px 38px", fontSize: "var(--text-s)", borderRadius: "var(--radius-m)", border: "1px solid var(--color-border)", outline: "none" }} />
        </div>
        <div style={{ display: "flex", gap: 4, overflowX: "auto" }}>
          {categories.map(c => (
            <button key={c} onClick={() => setCategory(c)} style={{
              padding: "8px 14px", fontSize: "var(--text-xs)", fontWeight: category === c ? 700 : 500,
              borderRadius: "var(--radius-s)", border: category === c ? "1px solid var(--color-accent)" : "1px solid var(--color-border)",
              background: category === c ? "var(--color-accent)" : "white",
              color: category === c ? "white" : "var(--color-text-secondary)", cursor: "pointer", whiteSpace: "nowrap",
            }}>{c}</button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
        {filtered.map(p => (
          <div key={p.id} style={{ background: "white", borderRadius: "var(--radius-m)", border: "1px solid var(--color-border-light)", overflow: "hidden" }}>
            <div onClick={() => setExpanded(expanded === p.id ? null : p.id)} style={{ display: "flex", alignItems: "center", gap: "var(--space-s)", padding: "var(--space-m)", cursor: "pointer" }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>{CAT_ICONS[p.category] || "📄"}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: "var(--text-s)" }}>{p.title}</div>
                {p.description && <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", marginTop: 2 }}>{p.description}</div>}
              </div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", flexShrink: 0 }}>
                {p.tags.split(",").filter(Boolean).slice(0, 3).map(t => (
                  <span key={t} style={{ padding: "2px 8px", fontSize: 10, background: "var(--color-bg-secondary)", borderRadius: 99, color: "var(--color-text-tertiary)" }}>{t.trim()}</span>
                ))}
              </div>
              <button onClick={(e) => { e.stopPropagation(); copy(p.content, p.id); }} style={{ background: "none", border: "none", cursor: "pointer", color: copied === p.id ? "var(--color-accent)" : "var(--color-text-tertiary)", padding: 8, minWidth: 36, minHeight: 36, flexShrink: 0 }}>
                <Copy size={16} />
              </button>
              <ChevronDown size={16} style={{ color: "var(--color-text-tertiary)", transform: expanded === p.id ? "rotate(180deg)" : "", transition: "0.2s", flexShrink: 0 }} />
            </div>
            {expanded === p.id && (
              <div style={{ padding: "var(--space-m)", borderTop: "1px solid var(--color-border-light)", background: "var(--color-bg-secondary)" }}>
                <div style={{ whiteSpace: "pre-wrap", fontSize: "var(--text-xs)", fontFamily: "var(--font-mono)", lineHeight: 1.8, padding: "var(--space-m)", background: "white", borderRadius: "var(--radius-m)", border: "1px solid var(--color-border-light)" }}>
                  <RenderTemplate text={p.content} variables={variables} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={{ marginTop: "var(--space-m)", textAlign: "center", fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>{filtered.length} из {prompts.length} промптов</div>
    </div>
  );
}
