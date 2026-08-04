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
    glossary: <BookOpen size={14} className="text-accent" />,
    pattern: <FolderOpen size={14} className="text-accent" />,
    mcp: <FileText size={14} className="text-accent" />,
    tool: <FileText size={14} className="text-accent" />,
    blog: <FileText size={14} className="text-accent" />,
    decision: <FileText size={14} className="text-accent" />,
    prompt: <BookOpen size={14} className="text-accent" />,
    aiProject: <Factory size={14} className="text-accent" />,
  };

  return (
    <div ref={ref} className="relative">
      {/* Search trigger button */}
      <button
        onClick={() => { setOpen(!open); setTimeout(() => inputRef.current?.focus(), 50); }}
        className="flex items-center gap-1.5 py-[6px] px-3 rounded-m border border-border bg-bg-secondary cursor-pointer text-xs text-text-tertiary min-w-[180px]"
      >
        <Search size={14} />
        <span className="flex-1 text-left">Поиск...</span>
        <kbd className="text-[10px] bg-border-light px-[5px] py-px rounded-[3px]">⌘K</kbd>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full right-0 mt-1.5 w-[440px] max-w-[90vw] bg-white rounded-l border border-border z-[300] overflow-hidden"
          style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.15)" }}>
          {/* Search input */}
          <div className="flex items-center gap-2 px-[14px] py-[10px] border-b border-border-light">
            <Search size={14} className="text-text-tertiary shrink-0" />
            <input
              ref={inputRef}
              value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Поиск по всему сайту..."
              className="flex-1 border-0 outline-none text-s bg-transparent"
            />
            {query && (
              <button onClick={() => setQuery("")} className="bg-transparent border-0 cursor-pointer p-0.5">
                <X size={14} className="text-text-tertiary" />
              </button>
            )}
          </div>

          {/* Results */}
          <div className="max-h-[360px] overflow-y-auto">
            {loading && <div className="p-m text-center text-xs text-text-tertiary">Поиск...</div>}
            {!loading && results.length === 0 && query.length >= 2 && (
              <div className="p-m text-center text-xs text-text-tertiary">Ничего не найдено</div>
            )}
            {results.map((r, i) => (
              <div
                key={r.id || i}
                onClick={() => go(r)}
                className="flex items-center gap-s px-[14px] py-[10px] cursor-pointer border-b border-border-light"
              >
                {typeIcons[r.type] || <FileText size={14} className="text-text-tertiary" />}
                <div className="flex-1 min-w-0">
                  <div className="text-s font-semibold">{r.title}</div>
                  {r.subtitle && <div className="text-[10px] text-text-tertiary">{r.subtitle}</div>}
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded-[99px] bg-bg-secondary text-text-tertiary shrink-0">
                  {r.typeLabel || r.type}
                </span>
                <ArrowRight size={12} className="text-text-tertiary shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
