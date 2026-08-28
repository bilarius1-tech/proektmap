"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Globe,
  Mail,
  CheckCircle,
  Plus,
  Flame,
  Eye,
  Send,
  Github,
  Sparkles,
  Layers,
  FileText,
  Award,
  ExternalLink,
  Code,
} from "lucide-react";

interface ProfileClientProps {
  user: any;
  aiProjects: any[];
  posts: any[];
  isOwner: boolean;
  activeSub: any;
}

const STATUS_LABELS: Record<string, string> = {
  junior: "🌱 Junior Вайбкодер",
  middle: "⚡ Middle AI-инженер",
  senior: "🔥 Senior AI-разработчик",
  architect: "👑 AI-Архитектор",
  lead: "💼 Lead AI-инженер",
};

export default function ProfileClient({
  user,
  aiProjects,
  posts,
  isOwner,
  activeSub,
}: ProfileClientProps) {
  const [activeTab, setActiveTab] = useState<"portfolio" | "posts" | "skills">("portfolio");

  const avatar = user.avatar;
  const name = user.name || user.email.split("@")[0];
  const headline = user.headline || STATUS_LABELS[user.status] || "Вайбкодер & AI-инженер";

  const totalLikes = aiProjects.reduce((acc, p) => acc + (p.likesCount || 0), 0);
  const totalViews = aiProjects.reduce((acc, p) => acc + (p.viewCount || 0), 0);

  return (
    <div style={{ maxWidth: 1040, margin: "0 auto", padding: "40px 20px 80px", fontFamily: "var(--font-body)" }}>
      
      {/* Profile Header Hero */}
      <div
        style={{
          background: "var(--color-surface, #fff)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-l)",
          padding: "36px 32px",
          marginBottom: "var(--space-xl)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
          
          {/* Avatar */}
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: avatar ? `url(${avatar}) center/cover` : "var(--color-bg-secondary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              fontWeight: 800,
              flexShrink: 0,
              border: "3px solid var(--color-border)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            }}
          >
            {!avatar && name[0].toUpperCase()}
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 260 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
              <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(24px, 3.5vw, 32px)", fontWeight: 800, margin: 0 }}>
                {name}
              </h1>
              {user.emailVerified && (
                <span title="Подтверждённый профиль">
                  <CheckCircle size={20} color="var(--color-accent)" />
                </span>
              )}
              {activeSub && (
                <span style={{ padding: "3px 8px", background: "rgba(15, 184, 128, 0.1)", color: "var(--color-accent)", fontSize: 11, fontWeight: 700, borderRadius: 4 }}>
                  👑 PRO
                </span>
              )}
            </div>

            <div style={{ fontSize: "var(--text-s)", color: "var(--color-accent)", fontWeight: 700, marginBottom: 8 }}>
              {headline}
            </div>

            {user.bio && (
              <p style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)", lineHeight: 1.6, margin: "0 0 16px", maxWidth: 640 }}>
                {user.bio}
              </p>
            )}

            {/* Social & Contact links */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
              {user.telegram && (
                <a
                  href={`https://t.me/${user.telegram.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 20, background: "rgba(34, 158, 217, 0.1)", color: "#229ed9", fontSize: 12, fontWeight: 600, textDecoration: "none" }}
                >
                  <Send size={12} /> @{user.telegram.replace("@", "")}
                </a>
              )}

              {user.github && (
                <a
                  href={`https://github.com/${user.github.replace("https://github.com/", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 20, background: "var(--color-bg-tertiary)", color: "var(--color-text-primary)", fontSize: 12, fontWeight: 600, textDecoration: "none", border: "1px solid var(--color-border)" }}
                >
                  <Github size={12} /> GitHub
                </a>
              )}

              {user.website && (
                <a
                  href={user.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 20, background: "var(--color-bg-tertiary)", color: "var(--color-accent)", fontSize: 12, fontWeight: 600, textDecoration: "none", border: "1px solid var(--color-border)" }}
                >
                  <Globe size={12} /> {user.website.replace("https://", "").replace("http://", "")}
                </a>
              )}

              {isOwner && (
                <Link
                  href="/dashboard"
                  style={{ fontSize: 12, color: "var(--color-text-tertiary)", textDecoration: "underline", marginLeft: "auto" }}
                >
                  Редактировать профиль
                </Link>
              )}
            </div>

          </div>

        </div>

        {/* Stats Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 12, marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--color-border)" }}>
          <div style={{ padding: "12px", background: "var(--color-bg-primary)", borderRadius: 8, textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "var(--font-heading)" }}>{aiProjects.length}</div>
            <div style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>Кейсов в портфолио</div>
          </div>
          <div style={{ padding: "12px", background: "var(--color-bg-primary)", borderRadius: 8, textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "var(--font-heading)", color: "#ef4444" }}>{totalLikes}</div>
            <div style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>🔥 Респектов</div>
          </div>
          <div style={{ padding: "12px", background: "var(--color-bg-primary)", borderRadius: 8, textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "var(--font-heading)" }}>{totalViews}</div>
            <div style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>Просмотров</div>
          </div>
          <div style={{ padding: "12px", background: "var(--color-bg-primary)", borderRadius: 8, textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "var(--font-heading)", color: "var(--color-accent)" }}>{user.xp || 0}</div>
            <div style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>XP опыта</div>
          </div>
        </div>

      </div>

      {/* Tabs bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, borderBottom: "1px solid var(--color-border)", paddingBottom: 12 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => setActiveTab("portfolio")}
            style={{
              padding: "8px 16px",
              borderRadius: 6,
              border: "none",
              background: activeTab === "portfolio" ? "var(--color-accent)" : "transparent",
              color: activeTab === "portfolio" ? "#fff" : "var(--color-text-secondary)",
              fontSize: "var(--text-s)",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Layers size={15} /> Портфолио ({aiProjects.length})
          </button>

          {posts.length > 0 && (
            <button
              onClick={() => setActiveTab("posts")}
              style={{
                padding: "8px 16px",
                borderRadius: 6,
                border: "none",
                background: activeTab === "posts" ? "var(--color-accent)" : "transparent",
                color: activeTab === "posts" ? "#fff" : "var(--color-text-secondary)",
                fontSize: "var(--text-s)",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <FileText size={15} /> Статьи ({posts.length})
            </button>
          )}

          {user.skills && (
            <button
              onClick={() => setActiveTab("skills")}
              style={{
                padding: "8px 16px",
                borderRadius: 6,
                border: "none",
                background: activeTab === "skills" ? "var(--color-accent)" : "transparent",
                color: activeTab === "skills" ? "#fff" : "var(--color-text-secondary)",
                fontSize: "var(--text-s)",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Code size={15} /> Стек и навыки
            </button>
          )}
        </div>

        {isOwner && (
          <Link
            href="/projects/new"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              borderRadius: 6,
              background: "var(--color-accent)",
              color: "#fff",
              textDecoration: "none",
              fontSize: "var(--text-xs)",
              fontWeight: 700,
            }}
          >
            <Plus size={14} /> Добавить работу
          </Link>
        )}
      </div>

      {/* Tab: Portfolio (Behance grid) */}
      {activeTab === "portfolio" && (
        <div>
          {aiProjects.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", background: "var(--color-surface, #fff)", border: "1px dashed var(--color-border)", borderRadius: "var(--radius-l)" }}>
              <Layers size={36} color="var(--color-text-tertiary)" style={{ margin: "0 auto 12px" }} />
              <h3 style={{ fontSize: "var(--text-m)", fontWeight: 700, marginBottom: 6 }}>
                В портфолио пока нет опубликованных кейсов
              </h3>
              <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", maxWidth: 400, margin: "0 auto 16px" }}>
                {isOwner
                  ? "Загрузите свой первый проект, покажите AI-стек и рецепт разработки!"
                  : "Автор ещё не добавил работы в своё портфолио."}
              </p>
              {isOwner && (
                <Link
                  href="/projects/new"
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", background: "var(--color-accent)", color: "#fff", textDecoration: "none", borderRadius: 6, fontSize: "var(--text-xs)", fontWeight: 700 }}
                >
                  <Plus size={14} /> Опубликовать работу
                </Link>
              )}
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))", gap: 24 }}>
              {aiProjects.map((proj) => {
                const aiList = (proj.aiTools || "").split(",").map((s: string) => s.trim()).filter(Boolean);
                return (
                  <Link
                    key={proj.id}
                    href={`/ai-workshop/${proj.slug}`}
                    style={{
                      background: "var(--color-surface, #fff)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius-l)",
                      overflow: "hidden",
                      textDecoration: "none",
                      color: "inherit",
                      display: "flex",
                      flexDirection: "column",
                      transition: "transform 0.2s, box-shadow 0.2s",
                    }}
                  >
                    {/* Cover */}
                    <div
                      style={{
                        width: "100%",
                        aspectRatio: "16/10",
                        background: proj.screenshot ? `url(${proj.screenshot}) center/cover` : "linear-gradient(135deg, #0f172a, #1e293b)",
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {!proj.screenshot && (
                        <div style={{ color: "rgba(255,255,255,0.7)", textAlign: "center", padding: 20 }}>
                          <Sparkles size={28} color="var(--color-accent)" style={{ margin: "0 auto 6px" }} />
                          <div style={{ fontSize: 13, fontWeight: 700 }}>{proj.title}</div>
                        </div>
                      )}
                      <span
                        style={{
                          position: "absolute",
                          top: 10,
                          left: 10,
                          padding: "3px 8px",
                          borderRadius: 4,
                          fontSize: 10,
                          fontWeight: 700,
                          background: "rgba(0,0,0,0.65)",
                          color: "#fff",
                          backdropFilter: "blur(4px)",
                        }}
                      >
                        {proj.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", flex: 1 }}>
                      <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-m)", fontWeight: 800, margin: "0 0 6px", lineHeight: 1.3 }}>
                        {proj.title}
                      </h3>

                      <p style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.5, margin: "0 0 14px", flex: 1, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {proj.description}
                      </p>

                      {/* AI Tools Pills */}
                      {aiList.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 14 }}>
                          {aiList.slice(0, 3).map((tool: string) => (
                            <span
                              key={tool}
                              style={{
                                fontSize: 10,
                                fontWeight: 600,
                                padding: "2px 6px",
                                borderRadius: 3,
                                background: "rgba(15, 184, 128, 0.08)",
                                color: "var(--color-accent)",
                              }}
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Footer Stats */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--color-border)", paddingTop: 12, fontSize: 11, color: "var(--color-text-tertiary)" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <Flame size={13} color="#ef4444" /> {proj.likesCount || 0}
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <Eye size={13} /> {proj.viewCount || 0}
                        </span>
                        <span style={{ color: "var(--color-accent)", fontWeight: 600 }}>
                          Кейс ↗
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab: Posts */}
      {activeTab === "posts" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          {posts.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              style={{ background: "var(--color-surface, #fff)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-m)", padding: "20px", textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column" }}
            >
              <div style={{ fontSize: 11, color: "var(--color-accent)", fontWeight: 700, marginBottom: 6 }}>
                {p.category?.name || "Статья"}
              </div>
              <h3 style={{ fontSize: "var(--text-s)", fontWeight: 700, margin: "0 0 6px" }}>
                {p.title}
              </h3>
              <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: "auto" }}>
                {new Date(p.publishedAt || p.createdAt).toLocaleDateString("ru")} &middot; {p.viewCount || 0} просмотров
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Tab: Skills */}
      {activeTab === "skills" && user.skills && (
        <div style={{ background: "var(--color-surface, #fff)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-l)", padding: "28px" }}>
          <h2 style={{ fontSize: "var(--text-m)", fontWeight: 800, marginBottom: 16 }}>
            Стек технологий и компетенции
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {user.skills.split(",").filter(Boolean).map((s: string, i: number) => (
              <span
                key={i}
                style={{ padding: "6px 14px", background: "rgba(15, 184, 128, 0.08)", border: "1px solid rgba(15, 184, 128, 0.2)", borderRadius: 20, fontSize: "var(--text-xs)", color: "var(--color-accent)", fontWeight: 600 }}
              >
                {s.trim()}
              </span>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
