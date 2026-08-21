"use client";

import { useMemo, useState } from "react";
import { Search, ExternalLink, AlertTriangle, ShieldCheck, FlaskConical, Star, Info } from "lucide-react";
import type { AvitoTool, AvitoCategory } from "./data";

const RISK_LABEL = "серая зона";
const RISK_HINT =
  "Может нарушать правила Авито (парсинг, автодействия, мультиаккаунт). Работайте аккуратно: возможен бан аккаунта. Мы предупреждаем честно, а не запрещаем.";

const CATEGORY_ICON: Record<string, string> = {
  analytics: "📊",
  parsing: "🕷",
  autoposting: "🚀",
  ai: "🤖",
  extensions: "🧩",
  crm: "💬",
  design: "🎨",
  promotion: "📈",
  integrations: "🔌",
  avitolog: "🛠",
};

export default function AvitoCatalog({ tools, categories }: { tools: AvitoTool[]; categories: AvitoCategory[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");

  const featured = useMemo(
    () => tools.filter((t) => t.featured),
    [tools],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tools.filter((t) => {
      if (t.featured) return false;
      const inCat = category === "all" || t.categories.includes(category);
      const hay = `${t.name} ${t.description} ${t.types.join(" ")} ${(t.links || []).map((l) => l.label).join(" ")}`.toLowerCase();
      const inQuery = !q || hay.includes(q);
      return inCat && inQuery;
    });
  }, [tools, query, category]);

  const featuredVisible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return featured.filter((t) => {
      const inCat = category === "all" || t.categories.includes(category);
      const inQuery =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        (t.highlight || "").toLowerCase().includes(q);
      return inCat && inQuery;
    });
  }, [featured, query, category]);

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "var(--color-bg-primary)", color: "var(--color-text-primary)", minHeight: "100vh" }}>
      <div style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)", padding: "64px 20px 48px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 50%, rgba(0,136,204,0.15), transparent 70%)" }} />
        <div style={{ position: "relative", maxWidth: 760, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 18px", borderRadius: "var(--radius-full)", background: "rgba(0,136,204,0.2)", color: "#0af", fontSize: "var(--text-xs)", fontWeight: 700, marginBottom: "var(--space-m)" }}>
            <FlaskConical size={16} /> Лаборатория Авито
          </div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 800, lineHeight: 1.1, marginBottom: "var(--space-s)", letterSpacing: "-0.02em", color: "#fff" }}>
            Все инструменты для работы с Авито
          </h1>
          <p style={{ fontSize: "var(--text-m)", color: "rgba(255,255,255,0.7)", maxWidth: 560, margin: "0 auto var(--space-l)" }}>
            Не знаешь, какой сервис выбрать? Посмотри, что используют другие продавцы и авитологи.
          </p>

          <div style={{ maxWidth: 520, margin: "0 auto", position: "relative" }}>
            <Search size={18} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "var(--color-text-tertiary)" }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Найти инструмент: аналитика, парсер, CRM…"
              style={{
                width: "100%",
                padding: "14px 16px 14px 44px",
                borderRadius: "var(--radius-m)",
                border: "1px solid var(--color-border)",
                background: "#fff",
                fontSize: "var(--text-m)",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "var(--space-l) 20px var(--space-s)" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <button onClick={() => setCategory("all")} style={chipStyle(category === "all")}>
            Все · {tools.length}
          </button>
          {categories.map((c) => (
            <button key={c.slug} onClick={() => setCategory(c.slug)} style={chipStyle(category === c.slug)}>
              {c.icon} {c.name}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "var(--space-s) 20px var(--space-xxl)" }}>
        {featuredVisible.map((t) => (
          <FeaturedCard key={t.slug} tool={t} categories={categories} />
        ))}

        {filtered.length === 0 && featuredVisible.length === 0 ? (
          <p style={{ textAlign: "center", color: "var(--color-text-secondary)", padding: "var(--space-xl) 0" }}>
            Ничего не нашлось. Попробуй другой запрос.
          </p>
        ) : filtered.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))", gap: 16 }}>
            {filtered.map((t) => (
              <ToolCard key={t.slug} tool={t} categories={categories} />
            ))}
          </div>
        ) : null}

        <p style={{ textAlign: "center", color: "var(--color-text-tertiary)", fontSize: "var(--text-xs)", marginTop: "var(--space-xl)" }}>
          Рейтинг «Проверено опытом сообщества» появится позже — сначала каталог, затем оценки авитологов.
        </p>
      </div>
    </div>
  );
}

function FeaturedCard({ tool: t, categories }: { tool: AvitoTool; categories: AvitoCategory[] }) {
  return (
    <div
      style={{
        marginBottom: 24,
        borderRadius: "var(--radius-l)",
        padding: "clamp(20px, 4vw, 28px)",
        background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 55%, #1b5e3a 100%)",
        color: "#fff",
        boxShadow: "0 12px 40px rgba(15, 52, 96, 0.35)",
        border: "1px solid rgba(255,215,0,0.35)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 85% 20%, rgba(255,215,0,0.18), transparent 45%)", pointerEvents: "none" }} />
      <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: "var(--radius-full)", background: "rgba(255,215,0,0.2)", color: "#ffe566", fontSize: "var(--text-xs)", fontWeight: 800 }}>
            <Star size={14} fill="currentColor" /> Премиум в каталоге
          </span>
          <span style={{ fontSize: "var(--text-xs)", color: "rgba(255,255,255,0.65)" }}>{t.types.join(" · ")}</span>
        </div>

        <div>
          <h2 style={{ margin: "0 0 8px", fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 800, letterSpacing: "-0.02em" }}>{t.name}</h2>
          {t.highlight && (
            <p style={{ margin: 0, fontSize: "var(--text-s)", color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>{t.highlight}</p>
          )}
        </div>

        <p style={{ margin: 0, fontSize: "var(--text-m)", color: "rgba(255,255,255,0.88)", lineHeight: 1.55, maxWidth: 720 }}>
          {t.description}
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {t.categories.map((c) => (
            <span key={c} style={{ fontSize: "var(--text-xs)", padding: "3px 10px", borderRadius: "var(--radius-full)", background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.9)" }}>
              {CATEGORY_ICON[c]} {categories.find((x) => x.slug === c)?.name}
            </span>
          ))}
          {t.risk && <RiskBadge tone="dark" />}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12, marginTop: 4 }}>
          <span style={{ fontSize: "var(--text-s)", fontWeight: 700 }}>{t.price}</span>
          <a
            href={t.website}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 18px",
              borderRadius: "var(--radius-m)",
              background: "#ffe566",
              color: "#1a1a2e",
              fontSize: "var(--text-s)",
              fontWeight: 800,
              textDecoration: "none",
              minHeight: 48,
            }}
          >
            Открыть BananLab <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}

function ToolCard({ tool: t, categories }: { tool: AvitoTool; categories: AvitoCategory[] }) {
  return (
    <div style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-l)", padding: 20, display: "flex", flexDirection: "column", gap: 12, boxShadow: "var(--shadow-s)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <h3 style={{ margin: 0, fontSize: "var(--text-l)", fontWeight: 700 }}>{t.name}</h3>
        <span style={{ fontSize: "var(--text-s)", color: "var(--color-text-tertiary)", whiteSpace: "nowrap" }}>
          {t.types.join(" · ")}
        </span>
      </div>

      <p style={{ margin: 0, fontSize: "var(--text-s)", color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
        {t.description}
      </p>

      {t.links && t.links.length > 0 && (
        <ol style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 6 }}>
          {t.links.map((link) => (
            <li key={link.url} style={{ fontSize: "var(--text-s)", lineHeight: 1.4 }}>
              <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-accent)", fontWeight: 600, textDecoration: "none" }}>
                {link.label}
              </a>
            </li>
          ))}
        </ol>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {t.categories.map((c) => (
          <span key={c} style={{ fontSize: "var(--text-xs)", padding: "2px 10px", borderRadius: "var(--radius-full)", background: "var(--color-bg-tertiary)", color: "var(--color-text-secondary)" }}>
            {CATEGORY_ICON[c]} {categories.find((x) => x.slug === c)?.name}
          </span>
        ))}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, fontSize: "var(--text-xs)" }}>
        <span style={{ ...badge, color: "#0a7d3f", background: "rgba(16,185,129,0.12)" }}>
          ✅ работает · проверено {t.lastChecked}
        </span>
        {t.api === "official" && (
          <span style={{ ...badge, color: "#0a5da0", background: "rgba(0,136,204,0.12)" }}>
            <ShieldCheck size={12} style={{ verticalAlign: "-2px" }} /> официальный Avito API
          </span>
        )}
        {t.risk && <RiskBadge tone="light" />}
      </div>

      <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <span style={{ fontSize: "var(--text-s)", fontWeight: 600 }}>{t.price}</span>
        <a
          href={t.website}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "var(--text-s)", fontWeight: 700, color: "var(--color-accent)", textDecoration: "none" }}
        >
          {t.links?.length ? "Канал в Telegram" : "Открыть сервис"} <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}

function RiskBadge({ tone }: { tone: "light" | "dark" }) {
  const [open, setOpen] = useState(false);
  const light = tone === "light";

  return (
    <span style={{ position: "relative", display: "inline-flex" }}>
      <button
        type="button"
        aria-expanded={open}
        aria-label={`${RISK_LABEL}. ${RISK_HINT}`}
        title={RISK_HINT}
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setOpen(false)}
        style={{
          ...badge,
          border: "none",
          cursor: "help",
          fontSize: "var(--text-xs)",
          color: light ? "#8a5a00" : "#ffd28a",
          background: light ? "rgba(245,158,11,0.14)" : "rgba(245,158,11,0.22)",
        }}
      >
        <AlertTriangle size={12} /> {RISK_LABEL} <Info size={12} />
      </button>
      {open && (
        <span
          role="tooltip"
          style={{
            position: "absolute",
            left: 0,
            bottom: "calc(100% + 8px)",
            zIndex: 20,
            width: "min(280px, 75vw)",
            padding: "10px 12px",
            borderRadius: "var(--radius-m)",
            background: "#1a1a2e",
            color: "#fff",
            fontSize: 12,
            lineHeight: 1.45,
            fontWeight: 500,
            boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
          }}
        >
          {RISK_HINT}
        </span>
      )}
    </span>
  );
}

const badge: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  padding: "3px 10px",
  borderRadius: "var(--radius-full)",
  fontWeight: 600,
};

function chipStyle(active: boolean): React.CSSProperties {
  return {
    padding: "8px 14px",
    borderRadius: "var(--radius-full)",
    border: `1px solid ${active ? "var(--color-accent)" : "var(--color-border)"}`,
    background: active ? "var(--color-accent)" : "var(--color-surface)",
    color: active ? "#fff" : "var(--color-text-primary)",
    fontSize: "var(--text-s)",
    fontWeight: 600,
    cursor: "pointer",
  };
}
