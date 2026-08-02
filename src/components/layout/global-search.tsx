"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, ArrowRight, FileText, FolderOpen, BookOpen, Factory } from "lucide-react";

interface SearchResult {
  type: string;
  id: string; title: string; subtitle?: string; slug?: string; href?: string;
  snippet?: string; typeLabel?: string; stage?: string; category?: string; language?: string;
}

export default function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (query.length < 2) { setResults([]); return; }
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
      } catch {}
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

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  function go(result: SearchResult) {
    setOpen(false);
    setQuery("");
    if (result.href) {
      window.location.href = result.href;
      return;
    }
    if (result.type === "prompt") {
      window.location.href = "/prompts";
      return;
    }
    if (result.type === "decision" && result.stage) {
      window.location.href = `/corporate-website?stage=${result.stage}`;
      return;
    }
    if (result.type === "tool") {
      window.location.href = "/ai-tools";
      return;
    }
    window.location.href = "/corporate-website";
  }

  const typeIcons: Record<string, any> = {
    glossary: <BookOpen size={14} style={{ color: "var(--color-accent)" }} />,
    pattern: <FolderOpen size={14} style={{ color: "var(--color-accent)" }} />,
    mcp: <FileText size={14} style={{ color: "var(--color-accent)" }} />,
    tool: <FileText size={14} style={{ color: "var(--color-accent)" }} />,
    blog: <FileText size={14} style={{ color: "var(--color-accent)" }} />,
    decision: <FileText size={14} style={{ color: "var(--color-accent)" }} />,
    prompt: <BookOpen size={14} style={{ color: "var(--color-accent)" }} />,
    aiProject: <Factory size={14} style={{ color: "var(--color-accent)" }} />,
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => { setOpen(!open); setTimeout(() => inputRef.current?.focus(), 50); }} style={{
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
          position: "absolute", top: "100%", right: 0,
          marginTop: 6, width: 440, maxWidth: "90vw", background: "white",
          borderRadius: "var(--radius-l)", boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
          border: "1px solid var(--color-border)", zIndex: 300, overflow: "hidden",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderBottom: "1px solid var(--color-border-light)" }}>
            <Search size={14} style={{ color: "var(--color-text-tertiary)", flexShrink: 0 }} />
            <input
              ref={inputRef}
              value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Поиск по всему сайту..."
              style={{ flex: 1, border: "none", outline: "none", fontSize: "var(--text-s)", background: "transparent" }}
            />
            {query && <button onClick={() => setQuery("")} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}><X size={14} style={{ color: "var(--color-text-tertiary)" }} /></button>}
          </div>
          <div style={{ maxHeight: 360, overflowY: "auto" }}>
            {loading && <div style={{ padding: "var(--space-m)", textAlign: "center", fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>Поиск...</div>}
            {!loading && results.length === 0 && query.length >= 2 && (
              <div style={{ padding: "var(--space-m)", textAlign: "center", fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>Ничего не найдено</div>
            )}
            {results.map((r, i) => (
              <div key={r.id || i} onClick={() => go(r)} style={{
                display: "flex", alignItems: "center", gap: "var(--space-s)", padding: "10px 14px",
                cursor: "pointer", borderBottom: "1px solid var(--color-border-light)",
              }}>
                {typeIcons[r.type] || <FileText size={14} style={{ color: "var(--color-text-tertiary)" }} />}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "var(--text-s)", fontWeight: 600 }}>{r.title}</div>
                  {r.subtitle && <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>{r.subtitle}</div>}
                </div>
                <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 99, background: "var(--color-bg-secondary)", color: "var(--color-text-tertiary)", flexShrink: 0 }}>
                  {r.typeLabel || r.type}
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
