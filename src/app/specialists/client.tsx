"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, FileText, Award, Medal, MessageCircle, ExternalLink, Sparkles, Layers, Send, Globe, Github } from "lucide-react";

const STATUS_ICONS: Record<string, string> = {
  junior: "🌱",
  middle: "⚡",
  senior: "🔥",
  architect: "👑",
};

const STATUS_GRADIENT: Record<string, string> = {
  junior: "linear-gradient(135deg, #e2e8f0, #cbd5e1)",
  middle: "linear-gradient(135deg, #0fb880, #098a5e)",
  senior: "linear-gradient(135deg, #6c63ff, #4834d4)",
  architect: "linear-gradient(135deg, #f59e0b, #d97706)",
};

const STATUS_LABELS: Record<string, string> = {
  junior: "Junior Вайбкодер",
  middle: "Middle AI-инженер",
  senior: "Senior AI-инженер",
  architect: "AI-Архитектор",
};

const MEDALS = ["🥇", "🥈", "🥉"];

export default function SpecialistsClient({ specialists }: { specialists: any[] }) {
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filtered = specialists.filter((s: any) => {
    if (filterStatus === "all") return true;
    return s.status === filterStatus;
  });

  const top3 = specialists.slice(0, 3);

  return (
    <div style={{ maxWidth: 1040, margin: "0 auto", padding: "40px 20px 80px", fontFamily: "var(--font-body)" }}>
      
      {/* Header */}
      <div style={{ marginBottom: "var(--space-xl)", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 14px", background: "rgba(15, 184, 128, 0.1)", color: "var(--color-accent)", fontSize: "var(--text-xs)", fontWeight: 700, marginBottom: "var(--space-m)", borderRadius: 20 }}>
          <Sparkles size={14} /> Сообщество создателей цифровых продуктов
        </div>
        <h1 style={{ fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 800, margin: "0 0 10px", fontFamily: "var(--font-heading)" }}>
          👥 Вайбкодеры и AI-инженеры
        </h1>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-s)", lineHeight: 1.7, maxWidth: 600, margin: "0 auto" }}>
          Каталог специалистов нового поколения. Изучайте портфолио, кейсы, реальный стек и находите создателей для своих задач.
        </p>
      </div>

      {/* TOP 3 LEADERS */}
      {top3.length >= 3 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: "var(--space-xxl)" }}>
          {top3.map((s, i) => (
            <Link key={s.id} href={`/profile/${s.id}`} style={{ textDecoration: "none", color: "inherit" }}>
              <div
                style={{
                  padding: "24px 20px",
                  background: "var(--color-surface, #fff)",
                  borderRadius: "var(--radius-l)",
                  border: i === 0 ? "2px solid #f59e0b" : i === 1 ? "2px solid #94a3b8" : "2px solid #d97706",
                  textAlign: "center",
                  position: "relative",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 8 }}>{MEDALS[i]}</div>
                <div
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: "50%",
                    margin: "0 auto 10px",
                    background: s.avatar ? `url(${s.avatar}) center/cover` : STATUS_GRADIENT[s.status] || STATUS_GRADIENT.junior,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                    fontWeight: 800,
                    color: "white",
                    border: "3px solid #fff",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                >
                  {!s.avatar && (s.name || s.email).slice(0, 2).toUpperCase()}
                </div>
                <div style={{ fontWeight: 800, fontSize: "var(--text-m)", marginBottom: 2 }}>
                  {s.name || s.email?.split("@")[0]}
                </div>
                <div style={{ fontSize: 11, color: "var(--color-accent)", fontWeight: 700, marginBottom: 6 }}>
                  {s.headline || STATUS_LABELS[s.status] || "Вайбкодер"}
                </div>
                <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginBottom: 12 }}>
                  {s.projectsCount || 0} кейсов &middot; {s.articles || 0} статей &middot; {s.xp} XP
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "var(--color-accent)", fontFamily: "var(--font-heading)" }}>
                  {s.rating}
                  <span style={{ fontSize: 10, color: "var(--color-text-tertiary)", fontWeight: 400, marginLeft: 4 }}>рейтинг</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* FILTER TABS */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "var(--space-l)", alignItems: "center" }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: "var(--color-text-secondary)", marginRight: 4 }}>Квалификация:</span>
        <button
          onClick={() => setFilterStatus("all")}
          style={{
            padding: "6px 14px",
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 600,
            background: filterStatus === "all" ? "var(--color-accent)" : "var(--color-surface, #fff)",
            color: filterStatus === "all" ? "#fff" : "var(--color-text-secondary)",
            border: filterStatus === "all" ? "1px solid var(--color-accent)" : "1px solid var(--color-border)",
            cursor: "pointer",
          }}
        >
          Все ({specialists.length})
        </button>
        {Object.entries({
          architect: "👑 AI-Архитекторы",
          senior: "🔥 Senior",
          middle: "⚡ Middle",
          junior: "🌱 Junior",
        }).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilterStatus(key)}
            style={{
              padding: "6px 14px",
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600,
              background: filterStatus === key ? "var(--color-accent)" : "var(--color-surface, #fff)",
              color: filterStatus === key ? "#fff" : "var(--color-text-secondary)",
              border: filterStatus === key ? "1px solid var(--color-accent)" : "1px solid var(--color-border)",
              cursor: "pointer",
            }}
          >
            {label} ({specialists.filter((s: any) => s.status === key).length})
          </button>
        ))}
      </div>

      {/* GRID OF SPECIALISTS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
        {filtered.map((s: any) => (
          <Link
            key={s.id}
            href={`/profile/${s.id}`}
            style={{
              background: "var(--color-surface, #fff)",
              borderRadius: "var(--radius-l)",
              border: "1px solid var(--color-border)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              textDecoration: "none",
              color: "inherit",
              boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
          >
            {/* Header banner */}
            <div style={{ height: 64, background: STATUS_GRADIENT[s.status] || STATUS_GRADIENT.junior, position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  bottom: -24,
                  left: 20,
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  border: "3px solid white",
                  background: s.avatar ? `url(${s.avatar}) center/cover` : "var(--color-bg-secondary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  fontWeight: 800,
                  color: "var(--color-accent)",
                }}
              >
                {!s.avatar && (s.name || s.email).slice(0, 2).toUpperCase()}
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: "32px 20px 20px", flex: 1, display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 2 }}>
                <h3 style={{ fontWeight: 800, fontSize: "var(--text-s)", margin: 0 }}>
                  {s.name || s.email?.split("@")[0]}
                </h3>
                <span style={{ fontSize: 14 }}>{STATUS_ICONS[s.status]}</span>
              </div>

              <div style={{ fontSize: 11, color: "var(--color-accent)", fontWeight: 700, marginBottom: 8 }}>
                {s.headline || STATUS_LABELS[s.status] || "Вайбкодер"}
              </div>

              {s.bio && (
                <p style={{ fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 12, lineHeight: 1.5, flex: 1, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {s.bio}
                </p>
              )}

              {/* Skills */}
              {s.skills && (
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 14 }}>
                  {s.skills.split(",").slice(0, 3).map((sk: string) => (
                    <span
                      key={sk}
                      style={{ fontSize: 10, padding: "2px 6px", borderRadius: 3, background: "var(--color-bg-tertiary)", color: "var(--color-text-secondary)", fontWeight: 500 }}
                    >
                      {sk.trim()}
                    </span>
                  ))}
                </div>
              )}

              {/* Stats Footer */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--color-border)", paddingTop: 10, marginTop: "auto", fontSize: 11, color: "var(--color-text-tertiary)" }}>
                <span>📁 {s.projectsCount || 0} кейсов</span>
                <span>⚡ {s.xp} XP</span>
                <span style={{ color: "var(--color-accent)", fontWeight: 700 }}>Портфолио →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}
