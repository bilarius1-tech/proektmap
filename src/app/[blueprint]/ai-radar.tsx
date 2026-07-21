"use client";

import { useState, useEffect } from "react";
import { Zap, Cpu, TrendingUp } from "lucide-react";

interface AIModel {
  id: string; name: string; provider: string;
  codeRating: number; siteRating: number; agentRating: number; speedRating: number;
  pricePerMillion: number; contextWindow: number; bestFor: string;
}

function Bar({ value, max = 10, color = "var(--color-accent)" }: { value: number; max?: number; color?: string }) {
  return (
    <div style={{ height: 6, background: "var(--color-border-light)", borderRadius: 3, overflow: "hidden", width: 80 }}>
      <div style={{ width: (value / max) * 100 + "%", height: "100%", background: color, borderRadius: 3 }} />
    </div>
  );
}

export default function AIRadar() {
  const [models, setModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/ai-radar").then(r => r.json()).then(d => {
      setModels(d.models || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div style={{ padding: "var(--space-m)", color: "var(--color-text-tertiary)", fontSize: "var(--text-s)" }}>Загрузка...</div>;
  if (!models.length) return null;

  // Найти лучшие рекомендации
  const bestBudget = models.reduce((a, b) => a.pricePerMillion < b.pricePerMillion ? a : b);
  const bestCode = models.reduce((a, b) => a.codeRating > b.codeRating ? a : b);
  const bestAllAround = models.reduce((a, b) => (a.codeRating + a.siteRating + a.agentRating) > (b.codeRating + b.siteRating + b.agentRating) ? a : b);

  return (
    <div style={{ padding: "var(--space-m)", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-l)", border: "1px solid var(--color-border-light)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-xs)", marginBottom: "var(--space-m)" }}>
        <Cpu size={16} color="var(--color-accent)" />
        <span style={{ fontWeight: 700, fontSize: "var(--text-s)", color: "var(--color-accent)" }}>AI Radar — какую модель выбрать</span>
      </div>

      {/* Quick recommendations */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))", gap: "var(--space-xs)", marginBottom: "var(--space-m)" }}>
        {[
          { label: "🏆 Для кода", model: bestCode.name, color: "#22c55e" },
          { label: "💰 Экономия", model: bestBudget.name + " (" + bestBudget.pricePerMillion + " ₽)", color: "#f59e0b" },
          { label: "🎯 Универсал", model: bestAllAround.name, color: "#3b82f6" },
        ].map(r => (
          <div key={r.label} style={{ padding: "var(--space-s)", background: "var(--color-bg-primary)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border-light)", textAlign: "center" }}>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", marginBottom: 2 }}>{r.label}</div>
            <div style={{ fontWeight: 700, fontSize: "var(--text-s)", color: r.color }}>{r.model}</div>
          </div>
        ))}
      </div>
      
      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--text-xs)" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
              {["Модель", "Код", "Сайт", "Агенты", "Скорость", "Цена/1M"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "6px 8px", color: "var(--color-text-tertiary)", fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {models.map((m: any) => (
              <tr key={m.id} style={{ borderBottom: "1px solid var(--color-border-light)" }}>
                <td style={{ padding: "8px", fontWeight: 600 }}>{m.name}<div style={{ fontSize: "10px", color: "var(--color-text-tertiary)" }}>{m.provider}</div></td>
                <td style={{ padding: "8px" }}><Bar value={m.codeRating} color={m.codeRating >= 9 ? "#22c55e" : m.codeRating >= 7 ? "#f59e0b" : "#ef4444"} /></td>
                <td style={{ padding: "8px" }}><Bar value={m.siteRating} /></td>
                <td style={{ padding: "8px" }}><Bar value={m.agentRating} /></td>
                <td style={{ padding: "8px" }}><Bar value={m.speedRating} /></td>
                <td style={{ padding: "8px", fontWeight: 700, color: "var(--color-accent)", whiteSpace: "nowrap" }}>{m.pricePerMillion} ₽</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div style={{ marginTop: "var(--space-s)", fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", textAlign: "center" }}>
        Данные обновляются. Рекомендация: начни с DeepSeek (бесплатно), переходи на GPT/Claude для сложных задач.
      </div>
    </div>
  );
}
