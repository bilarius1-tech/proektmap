"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Flame,
  Copy,
  Check,
  Terminal,
  ChevronRight,
  Palette,
  CheckCircle2,
} from "lucide-react";
import { UIRecipe, UIPattern } from "../data";

interface Props {
  recipes: UIRecipe[];
  patterns: UIPattern[];
}

export default function RecipesClient({ recipes, patterns }: Props) {
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>(recipes[0]?.id || "");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const currentRecipe = recipes.find((r) => r.id === selectedRecipeId) || recipes[0];

  const handleCopyMasterPrompt = (prompt: string, id: string) => {
    navigator.clipboard.writeText(prompt);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div style={{ background: "var(--color-bg-primary)", color: "var(--color-text-primary)", minHeight: "100vh", paddingBottom: "var(--space-xl)" }}>
      {/* Top Header */}
      <div
        style={{
          borderBottom: "1px solid var(--color-border)",
          background: "var(--color-bg-secondary)",
          padding: "var(--space-m)",
          position: "sticky",
          top: 0,
          zIndex: 30,
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Link
              href="/ui-patterns"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 10px",
                background: "var(--color-bg-primary)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text-primary)",
                fontSize: "var(--text-xs)",
                fontWeight: 600,
                textDecoration: "none",
                borderRadius: 0,
              }}
            >
              <ArrowLeft size={13} />
              Назад в Атлас паттернов
            </Link>
            <span style={{ color: "var(--color-text-tertiary)" }}>/</span>
            <span style={{ fontSize: "var(--text-xs)", fontFamily: "var(--font-mono)", color: "var(--color-warning)", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 4 }}>
              <Flame size={13} /> Recipes (Сборки экранов)
            </span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div
        style={{
          borderBottom: "1px solid var(--color-border)",
          background: "var(--color-bg-secondary)",
          padding: "var(--space-xl) var(--space-m)",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 12px",
              background: "var(--color-warning-light)",
              color: "var(--color-warning)",
              fontSize: "var(--text-xs)",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "var(--space-s)",
              border: "1px solid var(--color-warning)",
              borderRadius: 0,
            }}
          >
            <Flame size={14} />
            <span>Комбинатор интерфейсов</span>
          </div>

          <h1
            style={{
              fontSize: "var(--text-xxl)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              marginBottom: "var(--space-xs)",
              color: "var(--color-text-primary)",
            }}
          >
            Дизайн-Рецепты &amp; Master-Промпты
          </h1>

          <p
            style={{
              fontSize: "var(--text-m)",
              color: "var(--color-text-secondary)",
              maxWidth: 720,
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Связки проверенных UI-паттернов с едиными дизайн-токенами. AI генерирует согласованный экран без визуальных конфликтов и разрозненных z-index.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "var(--space-l) var(--space-m)" }}>
        {/* Recipe Cards Selector */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "var(--space-m)", marginBottom: "var(--space-l)" }}>
          {recipes.map((recipe) => {
            const isSelected = selectedRecipeId === recipe.id;
            return (
              <div
                key={recipe.id}
                onClick={() => setSelectedRecipeId(recipe.id)}
                style={{
                  padding: "var(--space-m)",
                  background: "var(--color-bg-secondary)",
                  border: "1px solid",
                  borderColor: isSelected ? "var(--color-accent)" : "var(--color-border)",
                  borderRadius: 0,
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "border-color 0.15s ease",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
                    <span
                      style={{
                        fontSize: 10,
                        fontFamily: "var(--font-mono)",
                        textTransform: "uppercase",
                        padding: "2px 6px",
                        background: "var(--color-bg-primary)",
                        color: "var(--color-text-secondary)",
                        border: "1px solid var(--color-border)",
                      }}
                    >
                      Рецепт • {recipe.category}
                    </span>
                    {isSelected && (
                      <span style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-accent)", display: "flex", alignItems: "center", gap: 4 }}>
                        <CheckCircle2 size={13} /> Выбран
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: "var(--text-m)", fontWeight: 800, margin: "0 0 4px 0", color: "var(--color-text-primary)" }}>{recipe.titleRu}</h3>
                  <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--color-accent)", marginBottom: 8 }}>{recipe.title}</div>
                  <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.5, margin: 0 }}>
                    {recipe.description}
                  </p>
                </div>

                <div style={{ marginTop: "var(--space-m)", paddingTop: "var(--space-s)", borderTop: "1px solid var(--color-border)", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11 }}>
                  <span style={{ color: "var(--color-text-tertiary)" }}>{recipe.patternSlugs.length} паттерна в связке</span>
                  <span style={{ color: "var(--color-accent)", fontWeight: 700 }}>Смотреть сборку →</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Recipe Deep Dive */}
        {currentRecipe && (
          <div
            style={{
              padding: "var(--space-l)",
              background: "var(--color-bg-secondary)",
              border: "1px solid var(--color-border)",
              borderRadius: 0,
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-l)",
            }}
          >
            {/* Header of selected recipe */}
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <div>
                <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", textTransform: "uppercase", color: "var(--color-accent)", fontWeight: 700 }}>
                  Активная сборка экрана
                </span>
                <h2 style={{ fontSize: "var(--text-xl)", fontWeight: 800, margin: "2px 0 4px 0", color: "var(--color-text-primary)" }}>
                  {currentRecipe.titleRu}
                </h2>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
                  Кейс: <strong>{currentRecipe.useCase}</strong>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleCopyMasterPrompt(currentRecipe.masterPrompt, currentRecipe.id)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "10px 18px",
                  background: "var(--color-accent)",
                  color: "#ffffff",
                  border: "1px solid var(--color-accent)",
                  borderRadius: 0,
                  fontSize: "var(--text-xs)",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                {copiedId === currentRecipe.id ? (
                  <>
                    <Check size={14} />
                    <span>Master-промпт скопирован!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Скопировать Master-промпт для Cursor</span>
                  </>
                )}
              </button>
            </div>

            {/* Design Tokens Grid */}
            <div style={{ padding: "var(--space-m)", background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", borderRadius: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-text-primary)", marginBottom: "var(--space-s)" }}>
                <Palette size={14} color="var(--color-accent)" />
                <span>Дизайн-токены экрана (гарантия визуальной согласованности):</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 8 }}>
                <div style={{ padding: 8, background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)" }}>
                  <span style={{ fontSize: 10, color: "var(--color-text-tertiary)", display: "block" }}>Radius</span>
                  <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--color-text-primary)" }}>
                    {currentRecipe.designTokens.radius}
                  </span>
                </div>

                <div style={{ padding: 8, background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)" }}>
                  <span style={{ fontSize: 10, color: "var(--color-text-tertiary)", display: "block" }}>Background</span>
                  <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--color-text-primary)" }}>
                    {currentRecipe.designTokens.background}
                  </span>
                </div>

                <div style={{ padding: 8, background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)" }}>
                  <span style={{ fontSize: 10, color: "var(--color-text-tertiary)", display: "block" }}>Border</span>
                  <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--color-text-primary)" }}>
                    {currentRecipe.designTokens.border}
                  </span>
                </div>

                <div style={{ padding: 8, background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)" }}>
                  <span style={{ fontSize: 10, color: "var(--color-text-tertiary)", display: "block" }}>Blur Depth</span>
                  <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--color-text-primary)" }}>
                    {currentRecipe.designTokens.blur}
                  </span>
                </div>

                <div style={{ padding: 8, background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)" }}>
                  <span style={{ fontSize: 10, color: "var(--color-text-tertiary)", display: "block" }}>Accent</span>
                  <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--color-accent)" }}>
                    {currentRecipe.designTokens.accentColor}
                  </span>
                </div>

                <div style={{ padding: 8, background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)" }}>
                  <span style={{ fontSize: 10, color: "var(--color-text-tertiary)", display: "block" }}>Typography</span>
                  <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--color-text-primary)" }}>
                    {currentRecipe.designTokens.typography}
                  </span>
                </div>
              </div>
            </div>

            {/* Linked Patterns */}
            <div>
              <h4 style={{ fontSize: "var(--text-xs)", fontWeight: 800, textTransform: "uppercase", color: "var(--color-text-tertiary)", margin: "0 0 8px 0" }}>
                Входящие UI-паттерны (LEGO-блоки):
              </h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 8 }}>
                {currentRecipe.patternSlugs.map((slug) => {
                  const pat = patterns.find((p) => p.slug === slug);
                  if (!pat) return null;

                  return (
                    <Link
                      key={slug}
                      href={`/ui-patterns/${pat.slug}`}
                      style={{
                        padding: "var(--space-m)",
                        background: "var(--color-bg-primary)",
                        border: "1px solid var(--color-border)",
                        borderRadius: 0,
                        textDecoration: "none",
                        color: "inherit",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--color-accent)", textTransform: "uppercase" }}>
                          {pat.category}
                        </span>
                        <h5 style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-text-primary)", margin: "4px 0 2px 0" }}>
                          {pat.titleRu}
                        </h5>
                        <p style={{ fontSize: 11, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.4 }}>
                          {pat.shortDescription}
                        </p>
                      </div>
                      <div style={{ marginTop: 8, fontSize: 11, fontWeight: 700, color: "var(--color-accent)", display: "flex", alignItems: "center", gap: 2 }}>
                        <span>Открыть разбор</span>
                        <ChevronRight size={12} />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Master Prompt Box */}
            <div style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", borderRadius: 0, overflow: "hidden" }}>
              <div style={{ padding: "8px var(--space-m)", background: "var(--color-bg-tertiary)", borderBottom: "1px solid var(--color-border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "var(--text-xs)", fontFamily: "var(--font-mono)", color: "var(--color-text-primary)", display: "flex", alignItems: "center", gap: 6, fontWeight: 600 }}>
                  <Terminal size={13} color="var(--color-accent)" />
                  Master Prompt для Cursor Composer
                </span>
                <span style={{ fontSize: 11, color: "var(--color-accent)", fontWeight: 600 }}>
                  Исключает конфликты стилей
                </span>
              </div>
              <div style={{ padding: "var(--space-m)" }}>
                <pre
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-xs)",
                    color: "var(--color-text-primary)",
                    whiteSpace: "pre-wrap",
                    lineHeight: 1.6,
                  }}
                >
                  {currentRecipe.masterPrompt}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
