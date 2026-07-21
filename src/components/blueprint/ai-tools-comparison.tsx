"use client";

import { useState, useEffect } from "react";
import { Check, X, ExternalLink, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Tool {
  id: string; name: string; provider: string; type: string;
  pros: string; cons: string; pricing: string; url: string;
  russianUi: boolean; requiresVpn: boolean; rating: number; bestFor: string;
}

export default function AIToolsComparison() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/ai-tools").then(r => r.json()).then(d => {
      setTools(d.tools || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div style={{ padding: "var(--space-m)", color: "var(--color-text-tertiary)", fontSize: "var(--text-s)" }}>Загрузка инструментов...</div>;
  if (!tools.length) return null;

  return (
    <div style={{ padding: "var(--space-l)", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-l)", border: "1px solid var(--color-border-light)", marginTop: "var(--space-l)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-s)" }}>
        <div style={{ fontWeight: 800, fontSize: "var(--text-l)", color: "var(--color-text)" }}>
          🛠️ AI-инструменты — сравнение
        </div>
        <Link href="/ai-tools" style={{ fontSize: "var(--text-xs)", color: "var(--color-accent)", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
          Все {tools.length} инструментов <ArrowRight size={14} />
        </Link>
      </div>

      {/* Quick picks grid — 3 columns */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "var(--space-s)" }}>
        {tools.map((t: Tool) => (
          <div key={t.id} style={{ padding: "var(--space-m)", background: "var(--color-bg-primary)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border-light)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <div style={{ fontWeight: 700, fontSize: "var(--text-s)" }}>{t.name}</div>
              <div style={{ display: "flex", gap: 1 }}>
                {[1,2,3,4,5].map(i => (
                  <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: i <= Math.round(t.rating/2) ? "var(--color-accent)" : "var(--color-border-light)" }} />
                ))}
              </div>
            </div>
            <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginBottom: 6 }}>{t.provider} · {t.type === "ide" ? "IDE" : "No-code"}</div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginBottom: 8, lineHeight: 1.4 }}>{t.bestFor}</div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {t.russianUi && <span style={{ padding: "1px 6px", borderRadius: "var(--radius-s)", background: "#ecfdf5", color: "#065f46", fontSize: 9, fontWeight: 600 }}>🇷🇺</span>}
              {t.requiresVpn && <span style={{ padding: "1px 6px", borderRadius: "var(--radius-s)", background: "#fef2f2", color: "#991b1b", fontSize: 9, fontWeight: 600 }}>VPN</span>}
              {!t.requiresVpn && <span style={{ padding: "1px 6px", borderRadius: "var(--radius-s)", background: "#ecfdf5", color: "#065f46", fontSize: 9, fontWeight: 600 }}>Без VPN</span>}
              <span style={{ padding: "1px 6px", borderRadius: "var(--radius-s)", background: "var(--color-accent-light)", color: "var(--color-accent)", fontSize: 9, fontWeight: 600 }}>{t.pricing}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
