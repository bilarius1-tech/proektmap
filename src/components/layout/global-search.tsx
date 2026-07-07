"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, ArrowRight, FileText, FolderOpen, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";

interface SearchResult {
  type: "stage" | "decision" | "prompt";
  id: string; title: string; subtitle: string | null; slug: string; stage?: string;
}

export default function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (query.length < 2) { setResults([]); return; }
    const t = setTimeout(async () => {
      setLoading(true);
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.results || []);
      setLoading(false);
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function go(result: SearchResult) {
    setOpen(false); setQuery("");
    if (result.type === "prompt") { router.push("/prompts"); return; }
    if (result.type === "decision" && result.stage) {
      router.push(`/corporate-website?stage=${result.stage}`);
      return;
    }
    router.push("/corporate-website");
  }

  const icons: Record<string, any> = {
    stage: <FolderOpen size={14} style={{ color: "var(--color-accent)" }} />,
    decision: <FileText size={14} style={{ color: "var(--color-accent)" }} />,
    prompt: <BookOpen size={14} style={{ color: "var(--color-accent)" }} />,
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => setOpen(!open)} style={{
        display: "flex", alignItems: "center", gap: 6, padding: "6px 12px",
        borderRadius: "var(--radius-m)", border: "1px solid var(--color-border)",
        background: "var(--color-bg-secondary)", cursor: "pointer",
        fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)",
        minWidth: 180,
      }}>
        <Search size={14} />
        <span style={{ flex: 1, textAlign: "left" }}>Поиск...</span>
        <kbd style={{ fontSize: 10, background: "var(--color-border-light)", padding: "1px 5px", borderRadius: 3 }}>⌘K</kbd>
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)",
          marginTop: 6, width: 420, maxWidth: "90vw", background: "white",
          borderRadius: "var(--radius-l)", boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
          border: "1px solid var(--color-border)", zIndex: 300, overflow: "hidden",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderBottom: "1px solid var(--color-border-light)" }}>
            <Search size={14} style={{ color: "var(--color-text-tertiary)", flexShrink: 0 }} />
            <input
              value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Поиск по этапам, решениям, промптам..."
              autoFocus
              style={{ flex: 1, border: "none", outline: "none", fontSize: "var(--text-s)", background: "transparent" }}
            />
            {query && <button onClick={() => setQuery("")} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}><X size={14} style={{ color: "var(--color-text-tertiary)" }} /></button>}
          </div>
          <div style={{ maxHeight: 360, overflowY: "auto" }}>
            {loading && <div style={{ padding: "var(--space-m)", textAlign: "center", fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>Поиск...</div>}
            {!loading && results.length === 0 && query.length >= 2 && (
              <div style={{ padding: "var(--space-m)", textAlign: "center", fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>Ничего не найдено</div>
            )}
            {results.map(r => (
              <div key={r.id} onClick={() => go(r)} style={{
                display: "flex", alignItems: "center", gap: "var(--space-s)", padding: "10px 14px",
                cursor: "pointer", borderBottom: "1px solid var(--color-border-light)",
                transition: "background 0.1s",
              }}>
                {icons[r.type]}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "var(--text-s)", fontWeight: 600 }}>{r.title}</div>
                  {r.subtitle && <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>{r.subtitle}</div>}
                </div>
                <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 99, background: "var(--color-bg-secondary)", color: "var(--color-text-tertiary)" }}>
                  {r.type === "decision" ? "Решение" : r.type === "stage" ? "Этап" : "Промпт"}
                </span>
                <ArrowRight size={12} style={{ color: "var(--color-text-tertiary)", flexShrink: 0 }} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
