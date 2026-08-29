"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Search,
  Sparkles,
  Layers,
  ArrowRight,
  Copy,
  Check,
  Terminal,
  Scan,
  Compass,
  Box,
  LayoutGrid,
  Zap,
  ShieldCheck,
  Code2,
  Flame,
  Crown,
} from "lucide-react";
import { UIPattern, PatternCategoryMeta, AIModelTarget } from "./data";

interface Props {
  patterns: UIPattern[];
  categories: PatternCategoryMeta[];
}

const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  navigation: Compass,
  components: Box,
  content: LayoutGrid,
  effects: Sparkles,
  microinteractions: Zap,
  "ux-patterns": ShieldCheck,
  layouts: Layers,
};

export default function UIPatternsCatalogClient({ patterns, categories }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTarget, setSelectedTarget] = useState<AIModelTarget>("cursor");
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Filtered patterns
  const filteredPatterns = useMemo(() => {
    return patterns.filter((pattern) => {
      const matchesCategory =
        selectedCategory === "all" || pattern.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        pattern.title.toLowerCase().includes(q) ||
        pattern.titleRu.toLowerCase().includes(q) ||
        pattern.shortDescription.toLowerCase().includes(q) ||
        pattern.tags.some((t) => t.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [patterns, selectedCategory, searchQuery]);

  const handleCopyPrompt = (e: React.MouseEvent, pattern: UIPattern) => {
    e.preventDefault();
    e.stopPropagation();
    const variant = pattern.prompts.find((p) => p.target === selectedTarget) || pattern.prompts[0];
    if (variant) {
      const fullText = variant.negativePrompt
        ? `${variant.promptText}\n\n[NEGATIVE INSTRUCTIONS / ЧТО ЗАПРЕЩЕНО]:\n${variant.negativePrompt}`
        : variant.promptText;

      navigator.clipboard.writeText(fullText);
      setCopiedSlug(pattern.slug);
      setTimeout(() => setCopiedSlug(null), 2000);
    }
  };

  return (
    <div style={{ background: "var(--color-bg-primary)", color: "var(--color-text-primary)", minHeight: "100vh", paddingBottom: "var(--space-xl)" }}>
      {/* Hero Header */}
      <div
        style={{
          borderBottom: "1px solid var(--color-border)",
          background: "var(--color-bg-secondary)",
          padding: "var(--space-xl) var(--space-m)",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 12px",
              background: "var(--color-accent-light)",
              color: "var(--color-accent)",
              fontSize: "var(--text-xs)",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "var(--space-m)",
              border: "1px solid var(--color-accent)",
              borderRadius: 0,
            }}
          >
            <Sparkles size={14} />
            <span>Инженерный UI-Атлас ProektMap</span>
          </div>

          <h1
            style={{
              fontSize: "var(--text-xxl)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              marginBottom: "var(--space-s)",
              color: "var(--color-text-primary)",
            }}
          >
            Готовые секции и виджеты для сайта
          </h1>

          <p
            style={{
              fontSize: "var(--text-m)",
              color: "var(--color-text-secondary)",
              maxWidth: 760,
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Не склад случайных промптов. Изучайте анатомию и механику интерфейсов:{" "}
            <strong style={{ color: "var(--color-text-primary)" }}>Visual → Anatomy → WHY → Prompt → Code</strong>.
          </p>

          {/* Recipes Banner */}
          <div style={{ marginTop: "var(--space-m)", display: "flex", justifyContent: "center" }}>
            <Link
              href="/ui-patterns/recipes"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 16px",
                background: "var(--color-bg-primary)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text-primary)",
                fontSize: "var(--text-xs)",
                fontWeight: 600,
                textDecoration: "none",
                borderRadius: 0,
              }}
            >
              <Flame size={14} color="var(--color-warning)" />
              <span>Дизайн-Рецепты (Recipes): готовые экраны и Master-промпты</span>
              <ArrowRight size={14} color="var(--color-accent)" />
            </Link>
          </div>

          {/* Search Box */}
          <div style={{ maxWidth: 640, margin: "var(--space-l) auto 0", position: "relative" }}>
            <Search
              size={18}
              style={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--color-text-tertiary)",
              }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по паттернам, тегам (floating, social, bento, cookie)..."
              style={{
                width: "100%",
                padding: "12px 40px 12px 44px",
                background: "var(--color-bg-primary)",
                border: "1px solid var(--color-border)",
                borderRadius: 0,
                color: "var(--color-text-primary)",
                fontSize: "var(--text-s)",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  fontSize: "var(--text-xs)",
                  color: "var(--color-text-tertiary)",
                  cursor: "pointer",
                }}
              >
                Очистить
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "var(--space-l) var(--space-m)" }}>
        {/* Controls Bar: Categories and AI Target */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "var(--space-m)",
            marginBottom: "var(--space-l)",
            paddingBottom: "var(--space-m)",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          {/* Category Pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              style={{
                padding: "6px 14px",
                borderRadius: 0,
                fontSize: "var(--text-xs)",
                fontWeight: 600,
                cursor: "pointer",
                border: "1px solid",
                borderColor: selectedCategory === "all" ? "var(--color-accent)" : "var(--color-border)",
                background: selectedCategory === "all" ? "var(--color-accent)" : "var(--color-bg-secondary)",
                color: selectedCategory === "all" ? "#ffffff" : "var(--color-text-secondary)",
              }}
            >
              Все паттерны ({patterns.length})
            </button>

            {categories.map((cat) => {
              const Icon = CATEGORY_ICON_MAP[cat.id] || Layers;
              const count = patterns.filter((p) => p.category === cat.id).length;
              const isSelected = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 12px",
                    borderRadius: 0,
                    fontSize: "var(--text-xs)",
                    fontWeight: 600,
                    cursor: "pointer",
                    border: "1px solid",
                    borderColor: isSelected ? "var(--color-accent)" : "var(--color-border)",
                    background: isSelected ? "var(--color-accent)" : "var(--color-bg-secondary)",
                    color: isSelected ? "#ffffff" : "var(--color-text-secondary)",
                  }}
                >
                  <Icon size={13} />
                  <span>{cat.titleRu}</span>
                  {count > 0 && (
                    <span
                      style={{
                        fontSize: 10,
                        padding: "1px 5px",
                        background: isSelected ? "rgba(0,0,0,0.2)" : "var(--color-bg-tertiary)",
                        color: isSelected ? "#ffffff" : "var(--color-text-tertiary)",
                        borderRadius: 0,
                      }}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* AI Model Target Switcher */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: 4,
              background: "var(--color-bg-secondary)",
              border: "1px solid var(--color-border)",
              borderRadius: 0,
            }}
          >
            <span
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--color-text-tertiary)",
                padding: "0 8px",
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontWeight: 600,
              }}
            >
              <Terminal size={12} color="var(--color-accent)" />
              Промпт:
            </span>
            {(
              [
                { id: "cursor", label: "Cursor" },
                { id: "v0", label: "v0 / Lovable" },
                { id: "claude", label: "Claude" },
              ] as { id: AIModelTarget; label: string }[]
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedTarget(t.id)}
                style={{
                  padding: "4px 10px",
                  fontSize: "var(--text-xs)",
                  fontWeight: 600,
                  cursor: "pointer",
                  border: "none",
                  borderRadius: 0,
                  background: selectedTarget === t.id ? "var(--color-accent)" : "transparent",
                  color: selectedTarget === t.id ? "#ffffff" : "var(--color-text-secondary)",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Patterns Grid */}
        {filteredPatterns.length === 0 ? (
          <div
            style={{
              padding: "var(--space-xl)",
              textAlign: "center",
              background: "var(--color-bg-secondary)",
              border: "1px solid var(--color-border)",
              borderRadius: 0,
            }}
          >
            <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-s)" }}>
              Ничего не найдено по вашему запросу.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              style={{
                marginTop: "var(--space-s)",
                background: "none",
                border: "none",
                color: "var(--color-accent)",
                fontSize: "var(--text-xs)",
                fontWeight: 600,
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Сбросить фильтры
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "var(--space-l)",
            }}
          >
            {filteredPatterns.map((pattern) => {
              const isCopied = copiedSlug === pattern.slug;

              return (
                <div
                  key={pattern.id}
                  style={{
                    background: "var(--color-bg-secondary)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 0,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "border-color 0.2s ease, transform 0.2s ease",
                  }}
                >
                  <div>
                    {/* Header Thumbnail Strip */}
                    <div
                      style={{
                        padding: "var(--space-m)",
                        borderBottom: "1px solid var(--color-border)",
                        background: "var(--color-bg-tertiary)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          fontFamily: "var(--font-mono)",
                          color: "var(--color-text-secondary)",
                          background: "var(--color-bg-primary)",
                          padding: "2px 8px",
                          border: "1px solid var(--color-border)",
                          borderRadius: 0,
                        }}
                      >
                        {pattern.category}
                      </span>

                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        {pattern.isPro ? (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 3,
                              fontSize: 10,
                              fontWeight: 800,
                              background: "var(--color-accent)",
                              color: "#fff",
                              padding: "2px 6px",
                            }}
                          >
                            <Crown size={10} /> PRO
                          </span>
                        ) : (
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 800,
                              background: "rgba(34, 197, 94, 0.1)",
                              color: "var(--color-success)",
                              border: "1px solid var(--color-success)",
                              padding: "1px 6px",
                            }}
                          >
                            FREE
                          </span>
                        )}

                        {pattern.badge && (
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              background: "var(--color-accent-light)",
                              color: "var(--color-accent)",
                              padding: "2px 8px",
                              border: "1px solid var(--color-accent)",
                              borderRadius: 0,
                            }}
                          >
                            {pattern.badge}
                          </span>
                        )}
                        <span
                          style={{
                            fontSize: 10,
                            fontFamily: "var(--font-mono)",
                            color: "var(--color-text-tertiary)",
                            background: "var(--color-bg-primary)",
                            padding: "2px 6px",
                            border: "1px solid var(--color-border)",
                            borderRadius: 0,
                          }}
                        >
                          {pattern.anatomy.points.length} точек
                        </span>
                      </div>
                    </div>

                    {/* Screenshot cover image (как у новостей) */}
                    {pattern.screenshot ? (
                      <Link
                        href={`/ui-patterns/${pattern.slug}`}
                        style={{
                          display: "block",
                          width: "100%",
                          height: 160,
                          overflow: "hidden",
                          borderBottom: "1px solid var(--color-border)",
                          background: "var(--color-bg-primary)",
                        }}
                      >
                        <img
                          src={pattern.screenshot}
                          alt={pattern.titleRu}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                      </Link>
                    ) : null}

                    {/* Body */}
                    <div style={{ padding: "var(--space-m)" }}>
                      <h3 style={{ fontSize: "var(--text-m)", fontWeight: 800, margin: "0 0 4px 0", color: "var(--color-text-primary)" }}>
                        {pattern.titleRu}
                      </h3>
                      <div
                        style={{
                          fontSize: "var(--text-xs)",
                          fontFamily: "var(--font-mono)",
                          color: "var(--color-accent)",
                          marginBottom: "var(--space-s)",
                        }}
                      >
                        {pattern.title}
                      </div>
                      <p
                        style={{
                          fontSize: "var(--text-xs)",
                          color: "var(--color-text-secondary)",
                          lineHeight: 1.6,
                          margin: 0,
                        }}
                      >
                        {pattern.shortDescription}
                      </p>

                      {/* Tags */}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: "var(--space-m)" }}>
                        {pattern.tags.slice(0, 4).map((tag, idx) => (
                          <span
                            key={idx}
                            style={{
                              fontSize: 10,
                              fontFamily: "var(--font-mono)",
                              color: "var(--color-text-tertiary)",
                              background: "var(--color-bg-primary)",
                              padding: "1px 6px",
                              border: "1px solid var(--color-border-light)",
                              borderRadius: 0,
                            }}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div
                    style={{
                      padding: "var(--space-m)",
                      borderTop: "1px solid var(--color-border)",
                      background: "var(--color-bg-primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 8,
                    }}
                  >
                    <button
                      type="button"
                      onClick={(e) => handleCopyPrompt(e, pattern)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "6px 12px",
                        background: "var(--color-bg-secondary)",
                        border: "1px solid var(--color-border)",
                        borderRadius: 0,
                        color: "var(--color-text-primary)",
                        fontSize: "var(--text-xs)",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {isCopied ? (
                        <>
                          <Check size={13} color="var(--color-accent)" />
                          <span>Скопировано</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} color="var(--color-text-tertiary)" />
                          <span>Промпт</span>
                        </>
                      )}
                    </button>

                    <Link
                      href={`/ui-patterns/${pattern.slug}`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "6px 14px",
                        background: "var(--color-accent)",
                        color: "#ffffff",
                        border: "1px solid var(--color-accent)",
                        borderRadius: 0,
                        fontSize: "var(--text-xs)",
                        fontWeight: 700,
                        textDecoration: "none",
                      }}
                    >
                      <span>Разбор</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
