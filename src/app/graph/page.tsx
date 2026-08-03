"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import Link from "next/link";

// Dynamic import for ForceGraph2D to avoid SSR issues
let ForceGraph2D: any = null;

const COLORS: Record<string, string> = {
  Blueprint: "#0FB880",
  "Инструмент": "#3B82F6",
  "РФ AI": "#EF4444",
};

const NODE_SIZES: Record<string, number> = {
  Blueprint: 8,
  "Инструмент": 5,
  "РФ AI": 6,
};

export default function GraphPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<{ nodes: any[]; links: any[] } | null>(null);
  const [selected, setSelected] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ForceGraph, setForceGraph] = useState<any>(null);

  useEffect(() => {
    import("react-force-graph-2d").then(m => setForceGraph(() => m.default));
    fetch("/api/graph/full")
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(e => { setError("Ошибка загрузки графа"); setLoading(false); });
  }, []);

  const handleNodeClick = useCallback((node: any) => {
    setSelected(node);
  }, []);

  if (loading) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: "var(--color-text-tertiary)" }}>Загрузка графа...</div>;
  if (error) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: "var(--color-error)" }}>{error}</div>;
  if (!ForceGraph || !data) return null;

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh", background: "#0a0a1a" }}>
      {/* Header */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10, padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(10,10,26,0.9)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <div>
          <span style={{ fontSize: "var(--text-l)", fontWeight: 800, color: "white", fontFamily: "var(--font-heading)" }}>🔗 Граф связей</span>
          <span style={{ marginLeft: 12, fontSize: "var(--text-xs)", color: "rgba(255,255,255,0.5)" }}>{data.nodes.length} узлов · {data.links.length} связей</span>
        </div>
        <Link href="/" style={{ fontSize: "var(--text-xs)", color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>← На главную</Link>
      </div>

      {/* Legend */}
      <div style={{ position: "absolute", bottom: 20, left: 20, zIndex: 10, display: "flex", gap: 16, background: "rgba(10,10,26,0.8)", padding: "8px 14px", borderRadius: "var(--radius-m)", border: "1px solid rgba(255,255,255,0.1)" }}>
        {Object.entries(COLORS).map(([group, color]) => (
          <div key={group} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "rgba(255,255,255,0.7)" }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: color }} />
            {group}
          </div>
        ))}
      </div>

      {/* Selected node card */}
      {selected && (
        <div style={{ position: "absolute", top: 70, right: 20, zIndex: 10, background: "rgba(10,10,26,0.95)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "var(--radius-l)", padding: "var(--space-l)", minWidth: 240, maxWidth: 300, color: "white" }}>
          <div style={{ fontSize: 11, color: COLORS[selected.group] || "#999", textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>{selected.group}</div>
          <div style={{ fontSize: "var(--text-s)", fontWeight: 700, marginBottom: 4 }}>{selected.name}</div>
          {selected.type === "blueprint" && (
            <Link href={`/blueprints/${selected.id}`} style={{ fontSize: 11, color: "#0FB880", textDecoration: "none" }}>Открыть Blueprint →</Link>
          )}
          {selected.type === "aitool" && (
            <Link href={`/ai-tools/${selected.id}`} style={{ fontSize: 11, color: "#3B82F6", textDecoration: "none" }}>Открыть инструмент →</Link>
          )}
          {selected.type === "russian-ai" && (
            <Link href={`/russian-ai/${selected.id.replace("ru-", "")}`} style={{ fontSize: 11, color: "#EF4444", textDecoration: "none" }}>Открыть проект →</Link>
          )}
          <button onClick={() => setSelected(null)} style={{ display: "block", marginTop: 8, fontSize: 10, color: "rgba(255,255,255,0.5)", background: "none", border: "none", cursor: "pointer" }}>✕ Закрыть</button>
        </div>
      )}

      {/* Graph */}
      <ForceGraph
        graphData={data}
        width={typeof window !== "undefined" ? window.innerWidth : 1200}
        height={typeof window !== "undefined" ? window.innerHeight : 800}
        nodeColor={(n: any) => COLORS[n.group] || "#999"}
        nodeVal={(n: any) => NODE_SIZES[n.group] || 4}
        linkColor={() => "rgba(255,255,255,0.15)"}
        linkWidth={1}
        backgroundColor="#0a0a1a"
        onNodeClick={handleNodeClick}
        nodeLabel={(n: any) => `${n.group}: ${n.name}`}
        cooldownTicks={100}
        enableNodeDrag={false}
      />
    </div>
  );
}
