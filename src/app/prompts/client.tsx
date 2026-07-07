"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Copy, Search, ChevronDown, ChevronLeft, ChevronRight, Code, Rocket, Palette, Search as SearchIcon, Shield, Sparkles, Folder } from "lucide-react";
import { RenderTemplate, VariableLegend } from "@/components/blueprint/template-help";

interface Prompt { id: string; title: string; category: string; description: string | null; content: string; tags: string; useCount: number; }
interface Variable { name: string; label: string; description: string; example: string; category: string; }
interface Category { id: string; name: string; slug: string; icon: string; isActive?: boolean; }

const ICON_MAP: Record<string, React.ReactNode> = {
  code: <Code size={18} />, rocket: <Rocket size={18} />, palette: <Palette size={18} />,
  search: <SearchIcon size={18} />, shield: <Shield size={18} />, sparkles: <Sparkles size={18} />,
};
const DEFAULT_ICON = <Folder size={18} />;

function CatIcon({ category, categories }: { category: string; categories: Category[] }) {
  const cat = categories.find(c => c.name === category);
  if (cat) return <>{ICON_MAP[cat.icon] || DEFAULT_ICON}</>;
  return <>{DEFAULT_ICON}</>;
}

export default function PromptsPageClient({ prompts, variables, categories, total, page, perPage, currentCat }: {
  prompts: Prompt[]; variables: Variable[]; categories: Category[]; total: number; page: number; perPage: number; currentCat: string;
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const totalPages = Math.ceil(total / perPage);

  const catNames = categories.filter(c => c.isActive !== false).map(c => c.name);
  const allCats = ["all", ...catNames];

  function goCat(cat: string) {
    const params = new URLSearchParams();
    if (cat !== "all") params.set("cat", cat);
    if (search) params.set("q", search);
    router.push("/prompts?" + params.toString());
  }

  function goPage(p: number) {
    const params = new URLSearchParams(window.location.search);
    params.set("page", String(p));
    router.push("/prompts?" + params.toString());
  }

  const filtered = search
    ? prompts.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.tags.includes(search) || (p.description?.toLowerCase().includes(search.toLowerCase())))
    : prompts;

  function copy(content: string, id: string) {
    navigator.clipboard.writeText(content);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "var(--space-xl) var(--space-m)" }}>
      <div style={{ marginBottom: "var(--space-l)" }}>
        <h1 style={{ fontSize: "var(--text-xxxl)", fontWeight: 800, marginBottom: "var(--space-xs)" }}>📚 Библиотека промптов</h1>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-s)", lineHeight: 1.7 }}>
          Готовые промпты для AI-агентов. Форк{" "}
          <a href="https://github.com/yourkeychen/vibe-coding-cn" target="_blank" rel="noopener" style={{ color: "var(--color-accent)" }}>vibe-coding-cn</a>{" "}
          (22k ⭐). Всего: <b>{total}</b>.
        </p>
        <VariableLegend variables={variables} />
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: "var(--space-l)", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--color-text-tertiary)" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск..."
            style={{ width: "100%", padding: "10px 10px 10px 38px", fontSize: "var(--text-s)", borderRadius: "var(--radius-m)", border: "1px solid var(--color-border)", outline: "none" }} />
        </div>
        <div style={{ display: "flex", gap: 4, overflowX: "auto", flexWrap: "wrap" }}>
          {allCats.map(c => {
            const catObj = categories.find(x => x.name === c);
            const icon = catObj ? ICON_MAP[catObj.icon] : null;
            const active = (c === "all" && currentCat === "all") || c === currentCat;
            return (
              <button key={c} onClick={() => goCat(c)} style={{
                display: "flex", alignItems: "center", gap: 4, padding: "7px 12px", fontSize: "var(--text-xs)", fontWeight: active ? 700 : 500,
                borderRadius: "var(--radius-s)", border: active ? "1px solid var(--color-accent)" : "1px solid var(--color-border)",
                background: active ? "var(--color-accent)" : "white",
                color: active ? "white" : "var(--color-text-secondary)", cursor: "pointer", whiteSpace: "nowrap",
              }}>{icon}{c === "all" ? "Все" : c}</button>
            );
          })}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
        {filtered.map(p => (
          <div key={p.id} style={{ background: "white", borderRadius: "var(--radius-m)", border: "1px solid var(--color-border-light)" }}>
            <div onClick={() => setExpanded(expanded === p.id ? null : p.id)} style={{ display: "flex", alignItems: "center", gap: "var(--space-s)", padding: "var(--space-m)", cursor: "pointer" }}>
              <span style={{ color: "var(--color-accent)", flexShrink: 0 }}><CatIcon category={p.category} categories={categories} /></span>
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: "var(--space-xl)" }}>
          <button onClick={() => goPage(page - 1)} disabled={page <= 1}
            style={{ display: "flex", alignItems: "center", gap: 4, padding: "8px 14px", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", background: "white", cursor: page <= 1 ? "default" : "pointer", opacity: page <= 1 ? 0.4 : 1, fontSize: "var(--text-xs)" }}>
            <ChevronLeft size={14} /> Назад
          </button>
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            let pNum = i + 1;
            if (totalPages > 7 && page > 4) pNum = page - 3 + i;
            if (pNum > totalPages) return null;
            return (
              <button key={pNum} onClick={() => goPage(pNum)} style={{
                width: 36, height: 36, borderRadius: "var(--radius-s)", border: pNum === page ? "1px solid var(--color-accent)" : "1px solid var(--color-border)",
                background: pNum === page ? "var(--color-accent)" : "white", color: pNum === page ? "white" : "var(--color-text-secondary)",
                fontWeight: pNum === page ? 700 : 500, fontSize: "var(--text-xs)", cursor: "pointer",
              }}>{pNum}</button>
            );
          })}
          <button onClick={() => goPage(page + 1)} disabled={page >= totalPages}
            style={{ display: "flex", alignItems: "center", gap: 4, padding: "8px 14px", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", background: "white", cursor: page >= totalPages ? "default" : "pointer", opacity: page >= totalPages ? 0.4 : 1, fontSize: "var(--text-xs)" }}>
            Вперёд <ChevronRight size={14} />
          </button>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>{page} / {totalPages}</span>
        </div>
      )}

      <div style={{ marginTop: "var(--space-m)", textAlign: "center", fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>
        {total === 0 ? "Ничего не найдено" : `${total} промптов`}
      </div>
    </div>
  );
}
