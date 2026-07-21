"use client";

import { useState, useEffect } from "react";
import { Search, TrendingUp, TrendingDown, Zap, Eye, Brain, DollarSign, Cpu } from "lucide-react";

interface Model { id:string;name:string;provider:string;ctx:number;priceP:number;priceC:number;intel:number;code:number;arenaElo:number;vision:boolean;reason:boolean;desc:string; }

export default function ModelsClient() {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("intel");
  const [updated, setUpdated] = useState("");

  useEffect(() => {
    fetch("/api/models").then(r => r.json()).then(d => {
      setModels(d.models || []);
      setUpdated(d.updated);
      setLoading(false);
    });
  }, []);

  const sorted = [...models].sort((a, b) => {
    if (sort === "intel") return b.intel - a.intel;
    if (sort === "code") return b.code - a.code;
    if (sort === "price") return a.priceP - b.priceP;
    if (sort === "ctx") return b.ctx - a.ctx;
    if (sort === "arena") return b.arenaElo - a.arenaElo;
    return 0;
  });

  const filtered = search ? sorted.filter((m: any) => m.name.toLowerCase().includes(search.toLowerCase()) || m.provider.includes(search) || m.id.includes(search)) : sorted;
  const top10 = sorted.slice(0, 10);

  function formatPrice(p: number) { return p === 0 ? "FREE" : "$" + p.toFixed(2); }
  function formatCtx(c: number) { return c >= 1000000 ? (c/1000000).toFixed(1)+"M" : c >= 1000 ? (c/1000).toFixed(0)+"K" : c.toString(); }
  function scoreBar(s: number) { const pct = Math.min(s / 10, 1) * 100; return <div style={{width:40,height:4,background:"var(--color-border)",borderRadius:0,overflow:"hidden"}}><div style={{width:pct+"%",height:"100%",background:s>8?"var(--color-accent)":s>5?"#f59e0b":"var(--color-text-tertiary)"}} /></div>; }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "var(--space-xl) var(--space-m)" }}>
      <div style={{ marginBottom: "var(--space-xl)" }}>
        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xxxl)", fontWeight: 800, marginBottom: 8 }}>📊 Рейтинг AI-моделей</h1>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-s)", lineHeight: 1.7 }}>
          {models.length} моделей от {new Set(models.map(m=>m.provider)).size} провайдеров. Данные: OpenRouter + Artificial Analysis.
          {updated && <span style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginLeft: 8 }}>Обновлено: {new Date(updated).toLocaleTimeString("ru")}</span>}
        </p>
      </div>

      {/* TOP 3 — cards */}
      {top10.length >= 3 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-m)", marginBottom: "var(--space-xl)" }}>
          {top10.slice(0,3).map((m, i) => (
            <div key={m.id} style={{
              padding: "var(--space-l)", background: "white", borderRadius: "var(--radius-s)", border: "2px solid " + (i===0?"#f59e0b":i===1?"#94a3b8":"#d97706"),
            }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>{["🥇","🥈","🥉"][i]}</div>
              <div style={{ fontFamily:"var(--font-heading)", fontWeight:700, fontSize:"var(--text-s)", marginBottom:2 }}>{m.name}</div>
              <div style={{ fontSize:10, color:"var(--color-text-tertiary)", marginBottom:8 }}>{m.provider}</div>
              <div style={{ display:"flex", gap:16, fontSize:"var(--text-xs)" }}>
                <span>🧠 {m.intel.toFixed(1)}</span>
                <span>💻 {m.code.toFixed(1)}</span>
                <span>💵 {formatPrice(m.priceP)}/M</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Controls */}
      <div style={{ display: "flex", gap: 8, marginBottom: "var(--space-m)", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--color-text-tertiary)" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск по названию или провайдеру..." style={{ width:"100%", padding:"8px 8px 8px 32px", fontSize:"var(--text-xs)", borderRadius:"var(--radius-s)", border:"1px solid var(--color-border)", outline:"none" }} />
        </div>
        {[
          { key:"intel", label:"Интеллект" }, { key:"code", label:"Код" }, { key:"arena", label:"Арена" },
          { key:"price", label:"Цена" }, { key:"ctx", label:"Контекст" },
        ].map(s => (
          <button key={s.key} onClick={() => setSort(s.key)} style={{
            padding: "6px 12px", borderRadius: "var(--radius-s)", border: sort===s.key ? "2px solid var(--color-accent)" : "1px solid var(--color-border)",
            background: sort===s.key ? "var(--color-accent-light)" : "white", color: sort===s.key ? "var(--color-accent)" : "var(--color-text-secondary)",
            fontSize: "var(--text-xs)", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
          }}>{s.label}</button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background:"white", borderRadius:"var(--radius-s)", border:"1px solid var(--color-border)", overflow:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"var(--text-xs)" }}>
          <thead><tr style={{ background:"var(--color-bg-secondary)", borderBottom:"1px solid var(--color-border)" }}>
            {["#","Модель","Интеллект","Код","Цена/1M","Контекст",""].map(h => <th key={h} style={{ padding:"8px 12px", textAlign:"left", fontWeight:600, color:"var(--color-text-secondary)", whiteSpace:"nowrap" }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {filtered.map((m, i) => (
              <tr key={m.id} style={{ borderBottom:"1px solid var(--color-border-light)" }}>
                <td style={{ padding:"8px 12px", color:"var(--color-text-tertiary)", width:30 }}>{i+1}</td>
                <td style={{ padding:"8px 12px" }}>
                  <div style={{ fontWeight:600 }}>{m.name}</div>
                  <div style={{ fontSize:9, color:"var(--color-text-tertiary)", display:"flex", gap:4, marginTop:1 }}>
                    <span>{m.provider}</span>
                    {m.vision && <span style={{ padding:"0 4px", borderRadius:99, background:"var(--color-accent-light)", color:"var(--color-accent)", fontSize:8 }}>👁️</span>}
                    {m.reason && <span style={{ padding:"0 4px", borderRadius:99, background:"var(--color-warning-light)", color:"var(--color-warning)", fontSize:8 }}>🧠</span>}
                  </div>
                </td>
                <td style={{ padding:"8px 12px" }}><div style={{ display:"flex", alignItems:"center", gap:6 }}><span style={{ fontWeight:700, fontFamily:"var(--font-mono)", fontSize:11 }}>{m.intel.toFixed(1)}</span>{scoreBar(m.intel)}</div></td>
                <td style={{ padding:"8px 12px" }}><div style={{ display:"flex", alignItems:"center", gap:6 }}><span style={{ fontWeight:700, fontFamily:"var(--font-mono)", fontSize:11 }}>{m.code.toFixed(1)}</span>{scoreBar(m.code)}</div></td>
                <td style={{ padding:"8px 12px", fontFamily:"var(--font-mono)", fontSize:11, fontWeight:600, color:m.priceP===0?"var(--color-accent)":"var(--color-text-secondary)" }}>
                  {formatPrice(m.priceP)}
                </td>
                <td style={{ padding:"8px 12px", fontFamily:"var(--font-mono)", fontSize:11, color:"var(--color-text-tertiary)" }}>{formatCtx(m.ctx)}</td>
                <td style={{ padding:"8px 12px" }}>
                  {m.arenaElo > 0 && <span style={{ fontSize:9, padding:"2px 6px", borderRadius:99, background:"var(--color-bg-secondary)", color:"var(--color-text-tertiary)" }}>🏆 {m.arenaElo}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
