import { getDb } from "@/lib/db";
import { Zap, Cpu } from "lucide-react";

export default async function AIRadarAdmin() {
  const db = await getDb();
  const models = await db.aIModel.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-l)" }}>
        <div>
          <h1 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-2xs)" }}>🤖 AI Radar</h1>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-s)" }}>{models.length} моделей — рекомендации для вайбкодеров</p>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--color-bg-secondary)", borderBottom: "1px solid var(--color-border)" }}>
              {["Модель", "Провайдер", "Код", "Сайт", "Агенты", "Скорость", "Цена/1M", "Рекомендация"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {models.map((m: any) => (
              <tr key={m.id} style={{ borderBottom: "1px solid var(--color-border-light)" }}>
                <td style={{ padding: "10px 12px", fontWeight: 600 }}>{m.name}</td>
                <td style={{ padding: "10px 12px", color: "var(--color-text-secondary)", fontSize: "var(--text-s)" }}>{m.provider}</td>
                <td style={{ padding: "10px 12px" }}><RatingBadge v={m.codeRating} /></td>
                <td style={{ padding: "10px 12px" }}><RatingBadge v={m.siteRating} /></td>
                <td style={{ padding: "10px 12px" }}><RatingBadge v={m.agentRating} /></td>
                <td style={{ padding: "10px 12px" }}><RatingBadge v={m.speedRating} /></td>
                <td style={{ padding: "10px 12px", fontSize: "var(--text-s)", fontWeight: 600, color: "var(--color-accent)" }}>{m.pricePerMillion} ₽</td>
                <td style={{ padding: "10px 12px", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>{m.bestFor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RatingBadge({ v }: { v: number }) {
  return (
    <span style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: v >= 9 ? "#22c55e" : v >= 7 ? "#f59e0b" : "#ef4444" }}>
      {v}/10
    </span>
  );
}
