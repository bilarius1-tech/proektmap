"use client";

import { Star, ExternalLink, ArrowLeft, Check, X, Download } from "lucide-react";
import Link from "next/link";
import Breadcrumbs from "@/components/nav/breadcrumbs";
import SaveButton from "@/components/layout/save-button";

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
      {[1,2,3,4,5].map(i => (
        <div key={i} style={{ width: 10, height: 10, borderRadius: 0, background: i <= Math.round(rating/2) ? "var(--color-accent)" : "var(--color-border-light)" }} />
      ))}
      <span style={{ fontSize: 12, fontWeight: 700, color: "var(--color-accent)", marginLeft: 6 }}>{rating}/10</span>
    </div>
  );
}

const typeLabels: Record<string, string> = {
  ide: "💻 IDE / Редактор",
  "no-code": "🧩 No-code конструктор",
  agent: "🤖 AI-агент",
  assistant: "💬 AI-ассистент",
};

// Friendly names for model slugs
const modelNames: Record<string, string> = {
  "gpt-5.5": "GPT-5.5",
  "claude-opus-4.8": "Claude Opus 4.8",
  "claude-sonnet-4.5": "Claude Sonnet 4.5",
  "gemini-2.5-pro": "Gemini 2.5 Pro",
  "deepseek-v3": "DeepSeek V3",
  "qwen3": "Qwen 3",
  "llama-4": "Llama 4",
  "gigachat": "GigaChat",
  "yandexgpt": "YandexGPT",
};

// Model badge colors
const modelColors: Record<string, { bg: string; text: string; border: string }> = {
  "gpt-5.5": { bg: "#f0fdf4", text: "#166534", border: "#bbf7d0" },
  "claude-opus-4.8": { bg: "#faf5ff", text: "#6b21a8", border: "#e9d5ff" },
  "claude-sonnet-4.5": { bg: "#faf5ff", text: "#7c3aed", border: "#e9d5ff" },
  "gemini-2.5-pro": { bg: "#eff6ff", text: "#1e40af", border: "#bfdbfe" },
  "deepseek-v3": { bg: "#ecfdf5", text: "#065f46", border: "#a7f3d0" },
  "qwen3": { bg: "#fff7ed", text: "#9a3412", border: "#fed7aa" },
  "llama-4": { bg: "#fef2f2", text: "#991b1b", border: "#fecaca" },
  "gigachat": { bg: "#eff6ff", text: "#1e40af", border: "#bfdbfe" },
  "yandexgpt": { bg: "#fffbeb", text: "#92400e", border: "#fcd34d" },
};

function isNew(createdAt: string): boolean {
  const created = new Date(createdAt);
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  return created > thirtyDaysAgo;
}

export default function AIToolDetailClient({ tool, related, isLoggedIn }: any) {
  const prosArr = JSON.parse(tool.pros || "[]");
  const consArr = JSON.parse(tool.cons || "[]");
  const steps = JSON.parse(tool.howToStart || "[]");
  const faq = JSON.parse(tool.faqItems || "[]");
  const supportedModels = JSON.parse(tool.supportedModels || "[]");
  const showEditorChoice = tool.rating >= 9;
  const showNew = isNew(tool.createdAt);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "var(--space-xl) var(--space-m)" }}>
      <Breadcrumbs pathname={"/ai-tools/" + tool.slug} pageTitle={tool.name} />
      <Link href="/ai-tools" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "var(--text-s)", color: "var(--color-text-secondary)", textDecoration: "none", marginBottom: "var(--space-l)" }}>
        <ArrowLeft size={14} /> Назад к каталогу
      </Link>

      {/* Hero */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-l)", flexWrap: "wrap", gap: "var(--space-m)" }}>
        <div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: "var(--space-xs)", alignItems: "center" }}>
            <span style={{ padding: "3px 10px", borderRadius: 0, background: "var(--color-accent)", color: "white", fontSize: 10, fontWeight: 700 }}>
              {typeLabels[tool.type] || tool.type}
            </span>
            {tool.russianUi ? (
              <span style={{ padding: "3px 10px", borderRadius: 0, background: "#ecfdf5", color: "#065f46", fontSize: 10, fontWeight: 700 }}>🇷🇺 Российский</span>
            ) : (
              <span style={{ padding: "3px 10px", borderRadius: 0, background: "#eff6ff", color: "#1e40af", fontSize: 10, fontWeight: 700 }}>🌍 Международный</span>
            )}
            {tool.requiresVpn && (
              <span style={{ padding: "3px 10px", borderRadius: 0, background: "#fef2f2", color: "#991b1b", fontSize: 10, fontWeight: 700 }}>🔐 Нужен VPN</span>
            )}
            {tool.requiresForeignCard && (
              <span style={{ padding: "3px 10px", borderRadius: 0, background: "#fffbeb", color: "#92400e", fontSize: 10, fontWeight: 700 }}>💳 Иностранная карта</span>
            )}
            {showEditorChoice && (
              <span style={{ padding: "3px 10px", borderRadius: 0, background: "#fef3c7", color: "#92400e", fontSize: 10, fontWeight: 700 }}>⭐ Выбор редакции</span>
            )}
            {showNew && (
              <span style={{ padding: "3px 10px", borderRadius: 0, background: "#dbeafe", color: "#1e40af", fontSize: 10, fontWeight: 700 }}>🆕 Новинка</span>
            )}
          </div>
          <h1 style={{
            fontSize: "var(--text-xxl)", fontWeight: 900, margin: "var(--space-xs)" 0,
            fontFamily: "var(--font-heading)", letterSpacing: "-0.02em",
            display: "flex", alignItems: "center", gap: 12
          }}>
            <img src={"/uploads/tools/" + tool.slug + ".png"} alt={tool.name}
              style={{ width: 40, height: 40 }}
              onError={(e: any) => {{ e.target.style.display = "none" }} }} />
            {{tool.name}}
          </h1>
          <div style={{ fontSize: "var(--text-s)", color: "var(--color-text-tertiary)", display: "flex", gap: "var(--space-m)", alignItems: "center" }}>
            <span>{tool.provider}</span>
            <SaveButton entityType="ai-tool" entitySlug={tool.slug} isLoggedIn={isLoggedIn} />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "12px 20px", background: "var(--color-bg-secondary)", borderRadius: 0 }}>
          <StarRating rating={tool.rating} />
          {tool.pricingAmount && (
            <span style={{ fontSize: "var(--text-m)", fontWeight: 800, color: "var(--color-accent)" }}>{tool.pricingAmount}</span>
          )}
          {tool.pricing && !tool.pricingAmount && (
            <span style={{ fontSize: "var(--text-m)", fontWeight: 800, color: "var(--color-accent)" }}>{tool.pricing}</span>
          )}
        </div>
      </div>

      {/* Description */}
      {tool.detailDescription ? (
        <div style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)", lineHeight: 1.8, marginBottom: "var(--space-l)", whiteSpace: "pre-wrap" }}>
          {tool.detailDescription}
        </div>
      ) : tool.description ? (
        <div style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)", lineHeight: 1.8, marginBottom: "var(--space-l)" }}>
          {tool.description}
        </div>
      ) : null}

      {/* Grid: BestFor + CodeOwnership */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-m)", marginBottom: "var(--space-l)" }}>
        <div style={{ padding: "var(--space-m)", background: "#eff6ff", borderRadius: 0, border: "1px solid #bfdbfe" }}>
          <div style={{ fontWeight: 700, fontSize: "var(--text-s)", color: "#1e40af", marginBottom: "var(--space-s)" }}>🎯 Для кого</div>
          <div style={{ fontSize: "var(--text-xs)", color: "#1e40af", lineHeight: 1.7 }}>{tool.bestFor || "Универсальный инструмент"}</div>
        </div>
        <div style={{ padding: "var(--space-m)", background: tool.codeOwnership ? "#ecfdf5" : "#fef2f2", borderRadius: 0, border: tool.codeOwnership ? "1px solid #a7f3d0" : "1px solid #fecaca" }}>
          <div style={{ fontWeight: 700, fontSize: "var(--text-s)", color: tool.codeOwnership ? "#065f46" : "#991b1b", marginBottom: "var(--space-s)" }}>📦 Код — ваш?</div>
          <div style={{ fontSize: "var(--text-xs)", color: tool.codeOwnership ? "#065f46" : "#991b1b", lineHeight: 1.7 }}>
            {tool.codeOwnership ? "✅ Да, вы получаете полный контроль над кодом." : "❌ Код может быть закрыт или привязан к платформе."}
          </div>
        </div>
      </div>

      {/* Supported Models */}
      {supportedModels.length > 0 && (
        <div style={{ marginBottom: "var(--space-l)", padding: "var(--space-l)", background: "var(--color-bg-secondary)", borderRadius: 0, border: "1px solid var(--color-border-light)" }}>
          <h2 style={{ fontSize: "var(--text-m)", fontWeight: 700, marginBottom: "var(--space-m)", fontFamily: "var(--font-heading)" }}>🤖 Поддерживаемые модели</h2>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {supportedModels.map((slug: string) => {
              const colors = modelColors[slug] || { bg: "#f8fafc", text: "#475569", border: "#e2e8f0" };
              return (
                <Link key={slug} href={"/models?q=" + slug}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 0,
                    background: colors.bg,
                    color: colors.text,
                    border: "1px solid " + colors.border,
                    fontSize: "var(--text-xs)",
                    fontWeight: 600,
                    textDecoration: "none",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  {modelNames[slug] || slug}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Pros / Cons */}
      {(prosArr.length > 0 || consArr.length > 0) && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-m)", marginBottom: "var(--space-l)" }}>
          <div style={{ padding: "var(--space-m)", background: "#ecfdf5", borderRadius: 0, border: "1px solid #a7f3d0" }}>
            <div style={{ fontWeight: 700, fontSize: "var(--text-s)", color: "#065f46", marginBottom: "var(--space-s)" }}>✅ Плюсы</div>
            {prosArr.map((p: string, i: number) => (
              <div key={i} style={{ display: "flex", gap: 6, fontSize: "var(--text-xs)", color: "#065f46", marginBottom: 6, lineHeight: 1.5 }}>
                <Check size={12} style={{ marginTop: 2, flexShrink: 0 }} /> {p}
              </div>
            ))}
          </div>
          <div style={{ padding: "var(--space-m)", background: "#fef2f2", borderRadius: 0, border: "1px solid #fecaca" }}>
            <div style={{ fontWeight: 700, fontSize: "var(--text-s)", color: "#991b1b", marginBottom: "var(--space-s)" }}>❌ Минусы</div>
            {consArr.map((c: string, i: number) => (
              <div key={i} style={{ display: "flex", gap: 6, fontSize: "var(--text-xs)", color: "#991b1b", marginBottom: 6, lineHeight: 1.5 }}>
                <X size={12} style={{ marginTop: 2, flexShrink: 0 }} /> {c}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* How to start */}
      {steps.length > 0 && (
        <div style={{ marginBottom: "var(--space-l)" }}>
          <h2 style={{ fontSize: "var(--text-l)", fontWeight: 700, marginBottom: "var(--space-m)", fontFamily: "var(--font-heading)" }}>🚀 Как начать</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
            {steps.map((s: any, i: number) => (
              <div key={i} style={{ display: "flex", gap: 14, padding: "var(--space-m)", background: "var(--color-bg-secondary)", borderRadius: 0, border: "1px solid var(--color-border-light)", alignItems: "flex-start" }}>
                <div style={{ width: 28, height: 28, borderRadius: 0, background: "var(--color-accent)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "var(--text-s)", marginBottom: 4 }}>{s.title}</div>
                  <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hidden Features */}
      {tool.hiddenFeatures && (
        <div style={{ marginBottom: "var(--space-l)", padding: "var(--space-m)", background: "#faf5ff", borderRadius: 0, border: "1px solid #e9d5ff" }}>
          <h2 style={{ fontSize: "var(--text-l)", fontWeight: 700, marginBottom: "var(--space-s)", fontFamily: "var(--font-heading)", color: "#7c3aed" }}>🔮 Скрытые возможности</h2>
          <div style={{ fontSize: "var(--text-s)", color: "#5b21b6", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{tool.hiddenFeatures}</div>
        </div>
      )}

      {/* Our Take */}
      {tool.ourTake && (
        <div style={{ marginBottom: "var(--space-l)", padding: "var(--space-m)", background: "#fff7ed", borderRadius: 0, border: "1px solid #fed7aa" }}>
          <h2 style={{ fontSize: "var(--text-l)", fontWeight: 700, marginBottom: "var(--space-s)", fontFamily: "var(--font-heading)", color: "#c2410c" }}>💡 Наша рекомендация</h2>
          <div style={{ fontSize: "var(--text-s)", color: "#9a3412", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{tool.ourTake}</div>
        </div>
      )}

      {/* Detail Comparison */}
      {tool.detailComparison && (
        <div style={{ marginBottom: "var(--space-l)", padding: "var(--space-m)", background: "#f0fdf4", borderRadius: 0, border: "1px solid #bbf7d0" }}>
          <h2 style={{ fontSize: "var(--text-l)", fontWeight: 700, marginBottom: "var(--space-s)", fontFamily: "var(--font-heading)", color: "#166534" }}>🔄 Чем отличается от других</h2>
          <div style={{ fontSize: "var(--text-s)", color: "#15803d", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{tool.detailComparison}</div>
        </div>
      )}

      {/* FAQ */}
      {faq.length > 0 && (
        <div style={{ marginBottom: "var(--space-l)" }}>
          <h2 style={{ fontSize: "var(--text-l)", fontWeight: 700, marginBottom: "var(--space-m)", fontFamily: "var(--font-heading)" }}>❓ FAQ</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
            {faq.map((item: any, i: number) => (
              <details key={i} style={{ padding: "var(--space-s) var(--space-m)", background: "var(--color-bg-secondary)", borderRadius: 0, border: "1px solid var(--color-border-light)", cursor: "pointer" }}>
                <summary style={{ fontWeight: 600, fontSize: "var(--text-s)", padding: "4px 0" }}>{item.q}</summary>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.7, marginTop: "var(--space-xs)" }}>{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      )}

      {/* Links */}
      <div style={{ display: "flex", gap: "var(--space-m)", flexWrap: "wrap", marginBottom: "var(--space-xl)", paddingTop: "var(--space-l)", borderTop: "1px solid var(--color-border-light)" }}>
        {tool.url && (
          <a href={tool.url} target="_blank" rel="noopener"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 0, background: "var(--color-accent)", color: "white", textDecoration: "none", fontSize: "var(--text-s)", fontWeight: 700 }}>
            <ExternalLink size={16} /> Открыть сайт
          </a>
        )}
        {tool.downloadUrl && (
          <a href={tool.downloadUrl} target="_blank" rel="noopener"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 0, background: "var(--color-bg-secondary)", color: "var(--color-text)", textDecoration: "none", fontSize: "var(--text-s)", fontWeight: 700, border: "2px solid var(--color-accent)" }}>
            <Download size={16} /> Скачать
          </a>
        )}
      </div>

      {/* Related Content */}
      {(related?.terms?.length > 0 || related?.patterns?.length > 0 || related?.mcp?.length > 0 || related?.prompts?.length > 0) && (
        <div style={{ padding: "var(--space-l)", background: "var(--color-bg-secondary)", borderRadius: 0, border: "1px solid var(--color-border-light)" }}>
          <h2 style={{ fontSize: "var(--text-m)", fontWeight: 700, marginBottom: "var(--space-m)", fontFamily: "var(--font-heading)" }}>🔗 Связанные материалы</h2>
          <div style={{ display: "flex", gap: "var(--space-m)", flexWrap: "wrap" }}>
            {related.terms?.map((t: any) => (
              <Link key={t.slug} href={"/glossary/" + t.slug}
                style={{ padding: "6px 14px", borderRadius: 0, background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", textDecoration: "none", fontWeight: 600 }}>
                📚 {t.term}
              </Link>
            ))}
            {related.patterns?.map((p: any) => (
              <Link key={p.slug} href={"/patterns/" + p.slug}
                style={{ padding: "6px 14px", borderRadius: 0, background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", textDecoration: "none", fontWeight: 600 }}>
                📦 {p.title}
              </Link>
            ))}
            {related.prompts?.map((p: any) => (
              <Link key={p.slug} href={"/prompts"}
                style={{ padding: "6px 14px", borderRadius: 0, background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", textDecoration: "none", fontWeight: 600 }}>
                💬 {p.title}
              </Link>
            ))}
            {related.mcp?.map((m: any) => (
              <Link key={m.slug} href={"/mcp/" + m.slug}
                style={{ padding: "6px 14px", borderRadius: 0, background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", textDecoration: "none", fontWeight: 600 }}>
                🔌 {m.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
