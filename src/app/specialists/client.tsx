"use client";

import Link from "next/link";
import { Star, FileText, Award, Medal, MessageCircle, ExternalLink } from "lucide-react";

const STATUS_ICONS: Record<string, string> = { junior: "🌱", middle: "⚡", senior: "🔥", architect: "👑" };
const STATUS_GRADIENT: Record<string, string> = {
  junior: "linear-gradient(135deg, #e2e8f0, #cbd5e1)",
  middle: "linear-gradient(135deg, #0fb880, #098a5e)",
  senior: "linear-gradient(135deg, #6c63ff, #4834d4)",
  architect: "linear-gradient(135deg, #f59e0b, #d97706)",
};

function getBadges(s: any) {
  const badges: string[] = [];
  if (s.articles >= 10) badges.push("📝 10 статей");
  if (s.articles >= 5) badges.push("✍️ 5 статей");
  if (s.xp >= 5000) badges.push("💎 5000 XP");
  if (s.xp >= 1000) badges.push("⭐ 1000 XP");
  if (s.status === "architect") badges.push("👑 Architect");
  if (s.status === "senior") badges.push("🔥 Senior");
  return badges.slice(0, 3);
}

const MEDALS = ["🥇", "🥈", "🥉"];

export default function SpecialistsClient({ specialists }: { specialists: any[] }) {
  const top3 = specialists.slice(0, 3);

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "var(--space-xl) var(--space-m)" }}>
      <div style={{ marginBottom: "var(--space-xl)" }}>
        <h1 style={{ fontSize: "var(--text-xxxl)", fontWeight: 800, marginBottom: "var(--space-xs)" }}>👥 Специалисты</h1>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-s)", lineHeight: 1.7 }}>
          Вайбкодеры и AI-инженеры. Портфолио, статьи, рейтинг. {specialists.length} специалистов.
        </p>
      </div>

      {/* LEADERBOARD — top 3 */}
      {top3.length >= 3 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-m)", marginBottom: "var(--space-xl)" }}>
          {top3.map((s, i) => (
            <Link key={s.id} href={`/blog/author/${s.email}`} style={{ textDecoration: "none", color: "inherit" }}>
              <div style={{
                padding: "var(--space-l)", background: "white", borderRadius: "var(--radius-xl)",
                border: i === 0 ? "2px solid #f59e0b" : i === 1 ? "2px solid #94a3b8" : "2px solid #d97706",
                textAlign: "center", position: "relative",
              }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>{MEDALS[i]}</div>
                <div style={{
                  width: 64, height: 64, borderRadius: "50%", margin: "0 auto 8px",
                  background: s.avatar ? `url(${s.avatar}) center/cover` : STATUS_GRADIENT[s.status],
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22, fontWeight: 800, color: "white",
                }}>
                  {!s.avatar && (s.name || s.email).slice(0, 2).toUpperCase()}
                </div>
                <div style={{ fontWeight: 700, fontSize: "var(--text-s)", marginBottom: 2 }}>{s.name || s.email?.split("@")[0]}</div>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", marginBottom: 8 }}>
                  {STATUS_ICONS[s.status]} {s.articles} статей · {s.xp} XP
                </div>
                <div style={{ fontSize: "var(--text-l)", fontWeight: 800, color: "var(--color-accent)" }}>{s.rating}</div>
                <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>рейтинг</div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Status filter */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: "var(--space-xl)" }}>
        {Object.entries({ junior: "🌱 Junior", middle: "⚡ Middle", senior: "🔥 Senior", architect: "👑 Architect" }).map(([key, label]) => (
          <div key={key} style={{
            display: "flex", alignItems: "center", gap: 4, padding: "6px 14px",
            borderRadius: "var(--radius-full)", border: "1px solid var(--color-border)",
            fontSize: "var(--text-xs)", background: "white",
          }}>{label}</div>
        ))}
      </div>

      {/* Full grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "var(--space-l)" }}>
        {specialists.map((s: any) => (
          <div key={s.id} style={{
            background: "white", borderRadius: "var(--radius-xl)", border: "1px solid var(--color-border-light)",
            overflow: "hidden", display: "flex", flexDirection: "column",
          }}>
            <div style={{ height: 80, background: STATUS_GRADIENT[s.status] || STATUS_GRADIENT.junior, position: "relative" }}>
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
                <span title={s.status} style={{ fontSize: 16 }}>{STATUS_ICONS[s.status]}</span>
              </div>

              {s.bio && <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginBottom: "var(--space-s)", lineHeight: 1.5, flex: 1 }}>{s.bio}</p>}

              {/* Badges */}
              {getBadges(s).length > 0 && (
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: "var(--space-s)" }}>
                  {getBadges(s).map(b => (
                    <span key={b} style={{ fontSize: 9, padding: "2px 7px", borderRadius: 99, background: "var(--color-warning-light)", color: "var(--color-warning)", fontWeight: 600 }}>{b}</span>
                  ))}
                </div>
              )}

              {s.skills && (
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: "var(--space-s)" }}>
                  {s.skills.split(",").slice(0, 4).map((sk: string) => (
                    <span key={sk} style={{ fontSize: 9, padding: "2px 7px", borderRadius: 99, background: "var(--color-accent-light)", color: "var(--color-accent)" }}>{sk.trim()}</span>
                  ))}
                </div>
              )}

              <div style={{ display: "flex", gap: "var(--space-m)", fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", paddingTop: "var(--space-s)", borderTop: "1px solid var(--color-border-light)", marginBottom: "var(--space-s)" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><FileText size={12} />{s.articles} статей</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Award size={12} />{s.xp} XP</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4, fontWeight: 600, color: "var(--color-accent)" }}><Star size={12} />{s.rating}</span>
              </div>

              {/* Hire button */}
              <div style={{ display: "flex", gap: 6 }}>
                <Link href={`/blog/author/${s.email}`} style={{
                  flex: 1, textAlign: "center", padding: "8px", borderRadius: "var(--radius-s)",
                  background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)",
                  fontSize: "var(--text-xs)", color: "inherit", textDecoration: "none",
                }}>📖 Блог</Link>
                {s.website && (
                  <a href={s.website} target="_blank" rel="noopener" style={{
                    flex: 1, textAlign: "center", padding: "8px", borderRadius: "var(--radius-s)",
                    background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)",
                    fontSize: "var(--text-xs)", color: "inherit", textDecoration: "none",
                  }}><ExternalLink size={12} /> Сайт</a>
                )}
                <a href={`mailto:${s.email}`} style={{
                  flex: 1, textAlign: "center", padding: "8px", borderRadius: "var(--radius-s)",
                  background: "var(--color-accent)", color: "white", border: "none",
                  fontSize: "var(--text-xs)", fontWeight: 600, textDecoration: "none",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                }}><MessageCircle size={12} /> Нанять</a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {specialists.length === 0 && (
        <div style={{ textAlign: "center", padding: "var(--space-xl)", color: "var(--color-text-tertiary)" }}>
          Пока нет специалистов. <Link href="/dashboard" style={{ color: "var(--color-accent)" }}>Станьте первым!</Link>
        </div>
      )}
    </div>
  );
}
