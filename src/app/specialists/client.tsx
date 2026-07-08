"use client";

import Link from "next/link";
import { Star, FileText, Award, Globe, ExternalLink } from "lucide-react";

const STATUS_ICONS: Record<string, string> = { junior: "🌱", middle: "⚡", senior: "🔥", architect: "👑" };
const STATUS_LABELS: Record<string, string> = { junior: "Junior", middle: "Middle", senior: "Senior", architect: "Architect" };
const STATUS_GRADIENT: Record<string, string> = {
  junior: "linear-gradient(135deg, #e2e8f0, #cbd5e1)",
  middle: "linear-gradient(135deg, #0fb880, #098a5e)",
  senior: "linear-gradient(135deg, #6c63ff, #4834d4)",
  architect: "linear-gradient(135deg, #f59e0b, #d97706)",
};

export default function SpecialistsClient({ specialists }: { specialists: any[] }) {
  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "var(--space-xl) var(--space-m)" }}>
      <div style={{ marginBottom: "var(--space-xl)" }}>
        <h1 style={{ fontSize: "var(--text-xxxl)", fontWeight: 800, marginBottom: "var(--space-xs)" }}>👥 Специалисты</h1>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-s)", lineHeight: 1.7 }}>
          Вайбкодеры и AI-инженеры. Портфолио, статьи, рейтинг. Выберите исполнителя для проекта.
        </p>
      </div>

      {/* Status filter */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: "var(--space-xl)" }}>
        {Object.entries(STATUS_LABELS).map(([key, label]) => (
          <div key={key} style={{
            display: "flex", alignItems: "center", gap: 4, padding: "6px 14px",
            borderRadius: "var(--radius-full)", border: "1px solid var(--color-border)",
            fontSize: "var(--text-xs)", background: "white",
          }}>
            {STATUS_ICONS[key]} {label}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "var(--space-l)" }}>
        {specialists.map((s: any) => (
          <div key={s.id} style={{
            background: "white", borderRadius: "var(--radius-xl)", border: "1px solid var(--color-border-light)",
            overflow: "hidden", display: "flex", flexDirection: "column",
          }}>
            {/* Gradient header */}
            <div style={{
              height: 80, background: STATUS_GRADIENT[s.status] || STATUS_GRADIENT.junior,
              position: "relative",
            }}>
              <div style={{
                position: "absolute", bottom: -30, left: 20,
                width: 64, height: 64, borderRadius: "50%", border: "3px solid white",
                background: s.avatar ? `url(${s.avatar}) center/cover` : "var(--color-bg-secondary)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, fontWeight: 800, color: "var(--color-accent)",
              }}>
                {!s.avatar && (s.name || s.email).slice(0, 2).toUpperCase()}
              </div>
            </div>

            <div style={{ padding: "36px var(--space-m) var(--space-m)", flex: 1, display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <Link href={`/blog/author/${s.email}`} style={{ fontWeight: 700, fontSize: "var(--text-s)", color: "inherit", textDecoration: "none" }}>
                  {s.name || s.email?.split("@")[0]}
                </Link>
                <span title={STATUS_LABELS[s.status]} style={{ fontSize: 16 }}>{STATUS_ICONS[s.status]}</span>
              </div>

              {s.bio && <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginBottom: "var(--space-s)", lineHeight: 1.5, flex: 1 }}>{s.bio}</p>}

              {s.skills && (
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: "var(--space-s)" }}>
                  {s.skills.split(",").slice(0, 4).map((sk: string) => (
                    <span key={sk} style={{ fontSize: 9, padding: "2px 7px", borderRadius: 99, background: "var(--color-accent-light)", color: "var(--color-accent)" }}>{sk.trim()}</span>
                  ))}
                </div>
              )}

              <div style={{ display: "flex", gap: "var(--space-m)", fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", paddingTop: "var(--space-s)", borderTop: "1px solid var(--color-border-light)" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><FileText size={12} />{s.articles} статей</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Award size={12} />{s.xp} XP</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4, fontWeight: 600, color: "var(--color-accent)" }}><Star size={12} />{s.rating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {specialists.length === 0 && (
        <div style={{ textAlign: "center", padding: "var(--space-xl)", color: "var(--color-text-tertiary)" }}>
          Пока нет специалистов с публичным профилем. <Link href="/dashboard" style={{ color: "var(--color-accent)" }}>Станьте первым!</Link>
        </div>
      )}
    </div>
  );
}
