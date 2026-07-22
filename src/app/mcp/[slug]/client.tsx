"use client";
import { Star, ExternalLink, ArrowLeft, Check, X, AlertTriangle } from "lucide-react";
import Link from "next/link";
import Breadcrumbs from "@/components/nav/breadcrumbs";

export default function MCPDetailClient({ server }: any) {
  const pros = JSON.parse(server.pros || "[]");
  const cons = JSON.parse(server.cons || "[]");
  const steps = JSON.parse(server.howToUse || "[]");

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "var(--space-xl) var(--space-m)" }}>
      <Breadcrumbs pathname={`/mcp/${server.slug}`} pageTitle={server.name} />
      <Link href="/mcp" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "var(--text-s)", color: "var(--color-text-secondary)", textDecoration: "none", marginBottom: "var(--space-l)" }}>
        <ArrowLeft size={14} /> Назад к каталогу
      </Link>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-m)" }}>
        <div>
          {server.isFeatured && <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: "var(--radius-s)", background: "var(--color-accent)", color: "white", fontSize: 10, fontWeight: 700, marginBottom: "var(--space-xs)" }}>⭐ Выбор редакции</span>}
          <h1 style={{ fontSize: "var(--text-xxl)", fontWeight: 800, margin: "var(--space-xs) 0" }}>{server.name}</h1>
          <div style={{ fontSize: "var(--text-s)", color: "var(--color-text-tertiary)" }}>{server.category} · {server.difficulty === "easy" ? "🟢 Новичок" : server.difficulty === "medium" ? "🟡 Средне" : "🔴 Сложно"}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, background: "var(--color-bg-secondary)", padding: "8px 16px", borderRadius: "var(--radius-s)" }}>
          <Star size={18} style={{ color: "var(--color-warning)", fill: "var(--color-warning)" }} />
          <span style={{ fontSize: "var(--text-xl)", fontWeight: 800 }}>{server.rating}</span>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>/10</span>
        </div>
      </div>

      {/* Badges */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: "var(--space-l)" }}>
        {server.russianDocs && <span style={{ padding: "4px 12px", borderRadius: "var(--radius-s)", background: "#ecfdf5", color: "#065f46", fontSize: 12, fontWeight: 600 }}>🇷🇺 Русская документация</span>}
        {server.requiresApiKey && <span style={{ padding: "4px 12px", borderRadius: "var(--radius-s)", background: "#fffbeb", color: "#92400e", fontSize: 12, fontWeight: 600 }}>🔑 Требуется API ключ</span>}
        {!server.requiresApiKey && <span style={{ padding: "4px 12px", borderRadius: "var(--radius-s)", background: "#ecfdf5", color: "#065f46", fontSize: 12, fontWeight: 600 }}>🆓 Бесплатно без ключа</span>}
        {server.stars > 0 && <span style={{ padding: "4px 12px", borderRadius: "var(--radius-s)", background: "#eff6ff", color: "#1e40af", fontSize: 12, fontWeight: 600 }}>⭐ {server.stars >= 1000 ? `${(server.stars/1000).toFixed(1)}k` : server.stars} звёзд</span>}
      </div>

      {/* Description */}
      <div style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)", lineHeight: 1.8, marginBottom: "var(--space-l)" }}>
        {server.longDescription}
      </div>

      {/* Pros/Cons */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-m)", marginBottom: "var(--space-l)" }}>
        <div style={{ padding: "var(--space-m)", background: "#ecfdf5", borderRadius: "var(--radius-s)", border: "1px solid #a7f3d0" }}>
          <div style={{ fontWeight: 700, fontSize: "var(--text-s)", color: "#065f46", marginBottom: "var(--space-s)" }}>✅ Плюсы</div>
          {pros.map((p: string, i: number) => (
            <div key={i} style={{ display: "flex", gap: 6, fontSize: "var(--text-xs)", color: "#065f46", marginBottom: 4 }}>
              <Check size={12} style={{ marginTop: 2, flexShrink: 0 }} /> {p}
            </div>
          ))}
        </div>
        <div style={{ padding: "var(--space-m)", background: "#fef2f2", borderRadius: "var(--radius-s)", border: "1px solid #fecaca" }}>
          <div style={{ fontWeight: 700, fontSize: "var(--text-s)", color: "#991b1b", marginBottom: "var(--space-s)" }}>❌ Минусы</div>
          {cons.map((c: string, i: number) => (
            <div key={i} style={{ display: "flex", gap: 6, fontSize: "var(--text-xs)", color: "#991b1b", marginBottom: 4 }}>
              <X size={12} style={{ marginTop: 2, flexShrink: 0 }} /> {c}
            </div>
          ))}
        </div>
      </div>

      {/* How to use */}
      {steps.length > 0 && (
        <div style={{ marginBottom: "var(--space-l)" }}>
          <h2 style={{ fontSize: "var(--text-l)", fontWeight: 700, marginBottom: "var(--space-m)" }}>🚀 Как установить</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
            {steps.map((s: any, i: number) => (
              <div key={i} style={{ display: "flex", gap: 12, padding: "var(--space-s) var(--space-m)", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border-light)", alignItems: "flex-start" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--color-accent)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "var(--text-s)", marginBottom: 2 }}>{s.title}</div>
                  <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.6, fontFamily: "monospace" }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Links */}
      <div style={{ display: "flex", gap: "var(--space-m)" }}>
        {server.githubUrl && (
          <a href={server.githubUrl} target="_blank" rel="noopener"
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", background: "white", color: "var(--color-text)", textDecoration: "none", fontSize: "var(--text-s)", fontWeight: 600 }}>
            <ExternalLink size={14} /> GitHub
          </a>
        )}
      </div>
    </div>
  );
}
