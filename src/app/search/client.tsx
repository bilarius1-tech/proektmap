"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ExternalLink, BookOpen, Sparkles } from "lucide-react";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q") || "";
    if (q.length >= 2) { setQuery(q); doSearch(q); }
  }, []);

  async function doSearch(q: string) {
    if (q.length < 2) return;
    setLoading(true);
    setSearched(true);
    const res = await fetch("/api/search?q=" + encodeURIComponent(q));
    const data = await res.json();
    setResults(data.results || []);
    setLoading(false);
  }

  function handleKeyDown(e: any) {
    if (e.key === "Enter") {
      const params = new URLSearchParams(window.location.search);
      params.set("q", query);
      window.history.replaceState({}, "", "?" + params.toString());
      doSearch(query);
    }
  }

  // Group results by type
  const grouped: Record<string, any[]> = {};
  for (const r of results) {
    if (!grouped[r.typeLabel]) grouped[r.typeLabel] = [];
    grouped[r.typeLabel].push(r);
  }

  // Highlight query in text
  function highlight(text: string) {
    if (!text || !query) return text;
    const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase()
        ? <mark key={i} style={{ background: 'var(--color-accent-light)', color: 'var(--color-accent)', padding: '0 2px', borderRadius: 2 }}>{part}</mark>
        : part
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "var(--space-xl) var(--space-m)" }}>
      <div style={{ marginBottom: "var(--space-xl)" }}>
        <h1 style={{ fontSize: "var(--text-xxl)", fontWeight: 800, marginBottom: "var(--space-s)" }}>
          <Search size={28} style={{ display: "inline", marginRight: 8, verticalAlign: "middle" }} />
          Поиск по ProektMap
        </h1>
        <p style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
          Ищите по глоссарию, паттернам, MCP-серверам, инструментам, блогу, промптам и решениям.
        </p>

        <div style={{ position: "relative", marginTop: "var(--space-m)", maxWidth: 500 }}>
          <Search size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--color-text-tertiary)" }} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Например: RAG, MCP, Prisma, SEO..."
            autoFocus
            style={{
              width: "100%", padding: "14px 14px 14px 44px", fontSize: "var(--text-m)", borderRadius: 0,
              border: "2px solid var(--color-accent)", background: "var(--color-bg-primary)", outline: "none",
              boxSizing: "border-box", color: "var(--color-text-primary)",
            }}
          />
        </div>
      </div>

      {/* Results */}
      {loading && (
        <div style={{ textAlign: "center", padding: "var(--space-xl)", color: "var(--color-text-tertiary)" }}>
          <Sparkles size={24} style={{ animation: "spin 1s infinite" }} /> Ищем...
        </div>
      )}

      {!loading && searched && results.length === 0 && (
        <div style={{ textAlign: "center", padding: "var(--space-xl)", color: "var(--color-text-tertiary)" }}>
          <p style={{ fontSize: "var(--text-l)", fontWeight: 700, marginBottom: 8 }}>Ничего не найдено</p>
          <p style={{ fontSize: "var(--text-s)" }}>Попробуйте другой запрос или посмотрите <Link href="/glossary" style={{ color: "var(--color-accent)" }}>глоссарий</Link></p>
        </div>
      )}

      {!loading && Object.keys(grouped).length > 0 && (
        <div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", marginBottom: "var(--space-m)" }}>
            Найдено: {results.length} результатов
          </div>

          {Object.entries(grouped).map(([label, items]) => (
            <div key={label} style={{ marginBottom: "var(--space-l)" }}>
              <div style={{ fontSize: "var(--text-xs)", fontWeight: 800, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "var(--space-s)" }}>
                {label} ({items.length})
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
                {items.map((item: any) => (
                  <Link key={item.id || item.slug} href={item.href}
                    style={{
                      display: "block", padding: "var(--space-m)", borderRadius: 0,
                      border: "1px solid var(--color-border-light)", background: "var(--color-bg-primary)",
                      textDecoration: "none", color: "inherit",
                    }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ fontWeight: 700, fontSize: "var(--text-s)", color: "var(--color-accent)", marginBottom: 4 }}>
                        {item.term || item.title || item.name}
                      </div>
                      {(item.level || item.difficulty) && (
                        <span style={{ fontSize: 14 }}>
                          {(item.level || item.difficulty) === "beginner" ? "🟢" : (item.level || item.difficulty) === "intermediate" ? "🟡" : "🔴"}
                        </span>
                      )}
                    </div>
                    {item.snippet && (
                      <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
                        {highlight(item.snippet)}
                      </div>
                    )}
                    {item.category && (
                      <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginTop: 4 }}>
                        {item.category}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
      `}</style>
    </div>
  );
}
