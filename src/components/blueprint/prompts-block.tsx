"use client";

import { useState } from "react";
import { Copy, Search, ChevronDown } from "lucide-react";
import { RenderTemplate, VariableLegend } from "./template-help";

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

export default function PromptsBlock({ prompts, variables }: { prompts: Prompt[]; variables?: Variable[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Все");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const vars = variables || [];

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
    <div style={{ marginTop: "var(--space-xl)", padding: "var(--space-l)", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-l)", border: "1px solid var(--color-border-light)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-m)", flexWrap: "wrap", gap: 8 }}>
        <h3 style={{ fontSize: "var(--text-l)", fontWeight: 800, margin: 0 }}>📚 Библиотека промптов</h3>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--color-text-tertiary)" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск..."
              style={{ padding: "6px 6px 6px 30px", fontSize: "var(--text-xs)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", background: "white", outline: "none", width: 140 }} />
          </div>
          <select value={category} onChange={e => setCategory(e.target.value)}
            style={{ padding: "6px 10px", fontSize: "var(--text-xs)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", background: "white", outline: "none" }}>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {vars.length > 0 && <VariableLegend variables={vars} />}

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)", marginTop: "var(--space-s)" }}>
        {filtered.map(p => (
          <div key={p.id} style={{ background: "white", borderRadius: "var(--radius-m)", border: "1px solid var(--color-border-light)", overflow: "hidden" }}>
            <div onClick={() => setExpanded(expanded === p.id ? null : p.id)} style={{ display: "flex", alignItems: "center", gap: "var(--space-s)", padding: "var(--space-m)", cursor: "pointer" }}>
              <span style={{ fontSize: 18 }}>{CAT_ICONS[p.category] || "📄"}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: "var(--text-s)" }}>{p.title}</div>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>{p.description}</div>
              </div>
              <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", flexShrink: 0 }}>{p.category}</span>
              <button onClick={(e) => { e.stopPropagation(); copy(p.content, p.id); }}
                style={{ background: "none", border: "none", cursor: "pointer", color: copied === p.id ? "var(--color-accent)" : "var(--color-text-tertiary)", padding: 8, minWidth: 36, minHeight: 36 }}>
                <Copy size={14} />
              </button>
              <ChevronDown size={14} style={{ color: "var(--color-text-tertiary)", transform: expanded === p.id ? "rotate(180deg)" : "", transition: "0.2s" }} />
            </div>
            {expanded === p.id && (
              <div style={{ padding: "var(--space-m)", borderTop: "1px solid var(--color-border-light)", background: "var(--color-bg-secondary)" }}>
                <div style={{ whiteSpace: "pre-wrap", fontSize: "var(--text-xs)", fontFamily: "var(--font-mono)", lineHeight: 1.7, padding: "var(--space-m)", background: "white", borderRadius: "var(--radius-s)" }}>
                  {vars.length > 0 ? <RenderTemplate text={p.content} variables={vars} /> : p.content}
                </div>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && <div style={{ textAlign: "center", padding: "var(--space-xl)", color: "var(--color-text-tertiary)", fontSize: "var(--text-s)" }}>Ничего не найдено</div>}
      </div>
      <div style={{ marginTop: "var(--space-s)", fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>{filtered.length} промптов · форк vibe-coding-cn</div>
    </div>
  );
}
