"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Eye,
  Star,
  Wrench,
  Cpu,
  User as UserIcon,
  Globe,
  Github,
  Send,
  Heart,
  Share2,
  Check,
  Clock,
  Sparkles,
  Layers,
  Code,
  Flame,
} from "lucide-react";

interface AiProjectDetailClientProps {
  project: any;
  authorUser?: any;
  toolMap: Record<string, string>;
  skillMap: Record<string, string>;
  related: any[];
  currentUser?: any;
  initialHasLiked?: boolean;
}

export default function AiProjectDetailClient({
  project,
  authorUser,
  toolMap,
  skillMap,
  related,
  currentUser,
  initialHasLiked = false,
}: AiProjectDetailClientProps) {
  const [likes, setLikes] = useState(project.likesCount || 0);
  const [hasLiked, setHasLiked] = useState(initialHasLiked);
  const [isLiking, setIsLiking] = useState(false);
  const [copied, setCopied] = useState(false);

  const techItems = (project.techStack || "").split(",").map((s: string) => s.trim()).filter(Boolean);
  const aiItems = (project.aiTools || "").split(",").map((s: string) => s.trim()).filter(Boolean);

  let parsedScreenshots: string[] = [];
  try {
    if (project.screenshots) {
      parsedScreenshots = typeof project.screenshots === "string" ? JSON.parse(project.screenshots) : project.screenshots;
    }
  } catch {}

  if (parsedScreenshots.length === 0 && project.screenshot) {
    parsedScreenshots = [project.screenshot];
  }

  const handleLike = async () => {
    if (!currentUser) {
      window.location.href = `/auth?callbackUrl=/ai-workshop/${project.slug}`;
      return;
    }

    if (isLiking) return;
    setIsLiking(true);

    try {
      const res = await fetch(`/api/ai-projects/${project.id}/like`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setHasLiked(data.liked);
        setLikes((prev: number) => (data.liked ? prev + 1 : Math.max(0, prev - 1)));
      }
    } catch {}
    setIsLiking(false);
  };

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : `https://proektmap.ru/ai-workshop/${project.slug}`;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {}
  };

  const authorProfileUrl = project.userId
    ? `/profile/${project.userId}`
    : authorUser?.id
    ? `/profile/${authorUser.id}`
    : project.authorUrl || "#";

  const authorAvatar = authorUser?.avatar || project.authorAvatar || "";
  const authorName = authorUser?.name || project.authorName || "Вайбкодер ProektMap";
  const authorHeadline = authorUser?.headline || (authorUser?.status === "architect" ? "👑 AI-Архитектор" : "⚡ Вайбкодер & AI-инженер");

  return (
    <div style={{ fontFamily: "var(--font-body)", background: "var(--color-bg-primary)", color: "var(--color-text-primary)", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1040, margin: "0 auto", padding: "var(--space-xl) var(--space-m)" }}>
        
        {/* Navigation & Actions Top Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-xl)", flexWrap: "wrap", gap: 12 }}>
          <Link
            href="/ai-workshop"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", textDecoration: "none", fontWeight: 600 }}
          >
            <ArrowLeft size={14} /> AI Цех и Портфолио
          </Link>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              onClick={handleShare}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                borderRadius: 6,
                background: "var(--color-surface, #fff)",
                border: "1px solid var(--color-border)",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                color: "var(--color-text-secondary)",
              }}
            >
              {copied ? <Check size={14} color="#0fb880" /> : <Share2 size={14} />}
              {copied ? "Ссылка скопирована!" : "Поделиться"}
            </button>

            <button
              onClick={handleLike}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 16px",
                borderRadius: 6,
                background: hasLiked ? "rgba(239, 68, 68, 0.1)" : "var(--color-surface, #fff)",
                border: hasLiked ? "1px solid #ef4444" : "1px solid var(--color-border)",
                color: hasLiked ? "#ef4444" : "var(--color-text-primary)",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <Flame size={16} fill={hasLiked ? "#ef4444" : "none"} color="#ef4444" />
              <span>{hasLiked ? "Респект!" : "Респект"}</span>
              <span style={{ fontSize: 11, opacity: 0.8 }}>({likes})</span>
            </button>
          </div>
        </div>

        {/* Hero Showcase Block */}
        <div style={{ background: "var(--color-surface, #fff)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-l)", padding: "32px", marginBottom: "var(--space-xl)" }}>
          
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 12 }}>
            <span style={{ padding: "4px 10px", fontSize: 11, fontWeight: 700, background: "rgba(15, 184, 128, 0.1)", color: "var(--color-accent)", borderRadius: 4 }}>
              {project.category}
            </span>
            <span style={{ padding: "4px 10px", fontSize: 11, fontWeight: 600, background: "var(--color-bg-tertiary)", color: "var(--color-text-secondary)", borderRadius: 4 }}>
              {project.status || "Запущен"}
            </span>
            {project.timeSpent && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", fontSize: 11, fontWeight: 600, background: "rgba(99, 102, 241, 0.1)", color: "#6366f1", borderRadius: 4 }}>
                <Clock size={12} /> {project.timeSpent}
              </span>
            )}
            <span style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginLeft: "auto", display: "flex", alignItems: "center", gap: 4 }}>
              <Eye size={13} /> {project.viewCount || 1} просмотров
            </span>
          </div>

          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, margin: "0 0 16px", letterSpacing: "-0.02em" }}>
            {project.title}
          </h1>

          <p style={{ fontSize: "var(--text-m)", color: "var(--color-text-secondary)", lineHeight: 1.7, margin: "0 0 24px", maxWidth: 840 }}>
            {project.description}
          </p>

          {/* Author Badge & Links Row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, borderTop: "1px solid var(--color-border)", paddingTop: 20 }}>
            
            {/* Author */}
            <Link
              href={authorProfileUrl}
              style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", color: "inherit" }}
            >
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: authorAvatar ? `url(${authorAvatar}) center/cover` : "var(--color-bg-secondary)", border: "2px solid var(--color-border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800 }}>
                {!authorAvatar && authorName.slice(0, 1).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: "var(--text-s)", fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
                  {authorName}
                </div>
                <div style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>
                  {authorHeadline} &middot; <span style={{ color: "var(--color-accent)" }}>Смотреть портфолио →</span>
                </div>
              </div>
            </Link>

            {/* CTAs */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", background: "var(--color-accent)", color: "#fff", textDecoration: "none", borderRadius: 6, fontSize: "var(--text-xs)", fontWeight: 700 }}
                >
                  <Globe size={14} /> Открыть проект <ExternalLink size={12} />
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 16px", background: "var(--color-bg-tertiary)", color: "var(--color-text-primary)", border: "1px solid var(--color-border)", textDecoration: "none", borderRadius: 6, fontSize: "var(--text-xs)", fontWeight: 600 }}
                >
                  <Github size={14} /> Код на GitHub
                </a>
              )}
              {project.telegramUrl && (
                <a
                  href={project.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 16px", background: "rgba(34, 158, 217, 0.1)", color: "#229ed9", border: "1px solid rgba(34, 158, 217, 0.25)", textDecoration: "none", borderRadius: 6, fontSize: "var(--text-xs)", fontWeight: 600 }}
                >
                  <Send size={14} /> Telegram-бот
                </a>
              )}
            </div>

          </div>
        </div>

        {/* Gallery / Visual Showcase (Behance style) */}
        {parsedScreenshots.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24, marginBottom: "var(--space-xl)" }}>
            {parsedScreenshots.map((img, i) => (
              <div
                key={i}
                style={{
                  borderRadius: "var(--radius-l)",
                  overflow: "hidden",
                  border: "1px solid var(--color-border)",
                  background: "#0f172a",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                }}
              >
                <img
                  src={img}
                  alt={`${project.title} screenshot ${i + 1}`}
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
              </div>
            ))}
          </div>
        )}

        {/* AI-Recipe & Stack Section */}
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "var(--space-xl)", marginBottom: "var(--space-xl)" }}>
          
          {/* AI Recipe Story */}
          <div style={{ background: "var(--color-surface, #fff)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-l)", padding: "28px" }}>
            <h2 style={{ fontSize: "var(--text-m)", fontWeight: 800, margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
              <Sparkles size={18} color="var(--color-accent)" /> AI-рецепт и процесс разработки
            </h2>

            {project.aiRecipe ? (
              <p style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)", lineHeight: 1.8, margin: 0, whiteSpace: "pre-line" }}>
                {project.aiRecipe}
              </p>
            ) : (
              <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", fontStyle: "italic", margin: 0 }}>
                Автор не оставил текстового описания промпт-рецепта, но указал стек и инструменты ниже.
              </p>
            )}
          </div>

          {/* Tools & Tech Chips */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            
            {/* AI Tools */}
            <div style={{ background: "var(--color-surface, #fff)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-l)", padding: "24px" }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "var(--color-accent)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                <Cpu size={14} /> AI-инструменты и модели
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {aiItems.map((tool: string) => {
                  const slug = toolMap[tool.toLowerCase()];
                  return slug ? (
                    <Link
                      key={tool}
                      href={`/ai-tools/${slug}`}
                      style={{ padding: "4px 10px", borderRadius: 4, background: "rgba(15, 184, 128, 0.08)", border: "1px solid rgba(15, 184, 128, 0.25)", color: "var(--color-accent)", fontSize: 12, fontWeight: 600, textDecoration: "none" }}
                    >
                      {tool} ↗
                    </Link>
                  ) : (
                    <span
                      key={tool}
                      style={{ padding: "4px 10px", borderRadius: 4, background: "var(--color-bg-tertiary)", color: "var(--color-text-primary)", fontSize: 12, fontWeight: 600 }}
                    >
                      {tool}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Tech Stack */}
            <div style={{ background: "var(--color-surface, #fff)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-l)", padding: "24px" }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                <Code size={14} /> Технологический стек
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {techItems.map((tech: string) => (
                  <span
                    key={tech}
                    style={{ padding: "4px 10px", borderRadius: 4, background: "rgba(99, 102, 241, 0.08)", border: "1px solid rgba(99, 102, 241, 0.2)", color: "#6366f1", fontSize: 12, fontWeight: 600 }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Related Projects */}
        {related && related.length > 0 && (
          <div>
            <h3 style={{ fontSize: "var(--text-l)", fontWeight: 800, marginBottom: 16 }}>
              Похожие проекты из AI Цеха
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
              {related.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/ai-workshop/${rel.slug}`}
                  style={{ background: "var(--color-surface, #fff)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-m)", padding: "16px", textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column" }}
                >
                  <div style={{ fontSize: 11, color: "var(--color-accent)", fontWeight: 700, marginBottom: 4 }}>
                    {rel.category}
                  </div>
                  <div style={{ fontSize: "var(--text-s)", fontWeight: 700, marginBottom: 6 }}>
                    {rel.title}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
