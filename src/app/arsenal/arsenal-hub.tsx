"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import {
  Search,
  ExternalLink,
  Shield,
  Layers,
  ArrowRight,
  Filter,
  X,
  Map as MapIcon,
  Wrench,
  AlertTriangle,
} from "lucide-react";
import type { ArsenalStack, ArsenalTool, ArsenalToolTag, ArsenalCategoryMeta } from "@/lib/arsenal";
import { getArsenalHubStats, searchArsenalStacks, searchArsenalTools } from "@/lib/arsenal";

const TAG_FILTERS: { slug: ArsenalToolTag | "all"; label: string }[] = [
  { slug: "all", label: "Любой режим" },
  { slug: "local", label: "Локально" },
  { slug: "cloud", label: "Облако" },
  { slug: "rf", label: "РФ-доступно" },
  { slug: "mcp", label: "Агенты / MCP" },
];

export default function ArsenalHub({
  stacks,
  tools,
  categories,
}: {
  stacks: ArsenalStack[];
  tools: ArsenalTool[];
  categories: ArsenalCategoryMeta[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [tag, setTag] = useState<ArsenalToolTag | "all">("all");
  const [showFilters, setShowFilters] = useState(false);
  const [showTools, setShowTools] = useState(false);

  const filteredStacks = useMemo(
    () => searchArsenalStacks(stacks, { query, category, tag }),
    [stacks, query, category, tag],
  );

  const filteredTools = useMemo(
    () =>
      searchArsenalTools(tools, {
        query,
        category,
        tag,
        onlyInStacks: true,
      }),
    [tools, query, category, tag],
  );

  const activeFilterCount =
    (category !== "all" ? 1 : 0) + (tag !== "all" ? 1 : 0);

  const hubStats = useMemo(() => getArsenalHubStats(stacks, tools), [stacks, tools]);

  const statsItems: { value: number; label: string; hint: string }[] = [
    { value: hubStats.stacks, label: "Арсеналов", hint: "Готовые стеки под миссию" },
    { value: hubStats.tools, label: "Инструментов", hint: "Карточки в каталоге" },
    { value: hubStats.categories, label: "Категорий", hint: "Категории Excel с материалом" },
    { value: hubStats.withLink, label: "Со ссылкой", hint: "Есть сайт или скачивание" },
  ];

  function resetFilters() {
    setCategory("all");
    setTag("all");
    setQuery("");
  }

  return (
    <div
      style={{
        fontFamily: "Inter, sans-serif",
        background: "var(--color-bg-primary)",
        color: "var(--color-text-primary)",
        minHeight: "100vh",
      }}
    >
      {/* Hero */}
      <div
        style={{
          background: "linear-gradient(145deg, #0f172a 0%, #1e293b 45%, #0c4a6e 100%)",
          padding: "56px 20px 36px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 70% 20%, rgba(14,165,233,0.18), transparent 55%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", maxWidth: 760, margin: "0 auto" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 16px",
              borderRadius: "var(--radius-full)",
              background: "rgba(14,165,233,0.18)",
              color: "#7dd3fc",
              fontSize: "var(--text-xs)",
              fontWeight: 700,
              marginBottom: "var(--space-m)",
            }}
          >
            <Layers size={15} /> Нейро каталог
          </div>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(28px, 5vw, 44px)",
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: "var(--space-s)",
              letterSpacing: "-0.02em",
              color: "#fff",
            }}
          >
            Нейро каталог
          </h1>
          <p
            style={{
              fontSize: "var(--text-m)",
              color: "rgba(255,255,255,0.72)",
              maxWidth: 560,
              margin: "0 auto var(--space-l)",
              lineHeight: 1.55,
            }}
          >
            Стеки AI-инструментов под задачу — не свалка ссылок. Возьми набор в порядке
            использования и доведи до Definition of Done.
          </p>

          <div style={{ maxWidth: 520, margin: "0 auto", position: "relative" }}>
            <Search
              size={18}
              style={{
                position: "absolute",
                left: 16,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--color-text-tertiary)",
              }}
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Миссия, инструмент, «локальный», голос…"
              aria-label="Поиск по стекам и инструментам"
              style={{
                width: "100%",
                padding: "14px 16px 14px 44px",
                borderRadius: "var(--radius-m)",
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.96)",
                color: "#0f172a",
                fontSize: "var(--text-m)",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              justifyContent: "center",
              marginTop: 20,
            }}
          >
            <a
              href="#arsenals"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "11px 18px",
                borderRadius: "var(--radius-m)",
                background: "#0ea5e9",
                color: "#fff",
                fontWeight: 700,
                fontSize: "var(--text-s)",
                textDecoration: "none",
              }}
            >
              Смотреть стеки <ArrowRight size={16} />
            </a>
            <Link
              href="/resheniya"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "11px 18px",
                borderRadius: "var(--radius-m)",
                background: "rgba(255,255,255,0.1)",
                color: "#fff",
                fontWeight: 600,
                fontSize: "var(--text-s)",
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <MapIcon size={16} /> Связать с готовым решением
            </Link>
          </div>

          {/* Compact live stats — derived from hub data */}
          <style>{`
            .arsenal-hero-stats {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 10px;
              margin-top: 28px;
              max-width: 640px;
              margin-left: auto;
              margin-right: auto;
              text-align: left;
            }
            @media (min-width: 640px) {
              .arsenal-hero-stats {
                grid-template-columns: repeat(4, minmax(0, 1fr));
                gap: 12px;
              }
            }
          `}</style>
          <div
            className="arsenal-hero-stats"
            role="group"
            aria-label="Объём материала в каталоге"
          >
            {statsItems.map((item) => (
              <div
                key={item.label}
                style={{
                  padding: "12px 14px",
                  borderRadius: "var(--radius-m)",
                  background: "rgba(15, 23, 42, 0.45)",
                  border: "1px solid rgba(125, 211, 252, 0.22)",
                  backdropFilter: "blur(6px)",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "clamp(22px, 4vw, 28px)",
                    fontWeight: 800,
                    lineHeight: 1.1,
                    color: "#f8fafc",
                    letterSpacing: "-0.02em",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {item.value}
                </div>
                <div
                  style={{
                    marginTop: 4,
                    fontSize: "var(--text-xs)",
                    fontWeight: 700,
                    color: "#7dd3fc",
                    letterSpacing: "0.02em",
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    marginTop: 2,
                    fontSize: 11,
                    lineHeight: 1.35,
                    color: "rgba(255,255,255,0.55)",
                  }}
                >
                  {item.hint}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters bar */}
      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "var(--space-l) 20px var(--space-s)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              fontSize: "var(--text-xs)",
              fontWeight: 700,
              color: "var(--color-text-tertiary)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            Фильтры
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => setShowFilters((v) => !v)}
              style={chipStyle(showFilters || activeFilterCount > 0)}
            >
              <Filter size={14} /> Фильтры
              {activeFilterCount > 0 ? ` · ${activeFilterCount}` : ""}
            </button>
            {(query || activeFilterCount > 0) && (
              <button type="button" onClick={resetFilters} style={chipStyle(false)}>
                <X size={14} /> Сбросить
              </button>
            )}
          </div>
        </div>

        {/* Desktop chips always; mobile via sheet toggle */}
        <div
          style={{
            display: showFilters ? "block" : "none",
          }}
          className="arsenal-filters-panel"
        >
          <style>{`
            @media (min-width: 768px) {
              .arsenal-filters-panel { display: block !important; }
              .arsenal-filters-mobile-hint { display: none !important; }
            }
            @media (max-width: 767px) {
              .arsenal-filters-panel { display: ${showFilters ? "block" : "none"} !important; }
            }
          `}</style>

          <div
            style={{
              fontSize: "var(--text-xs)",
              fontWeight: 700,
              color: "var(--color-text-tertiary)",
              marginBottom: 8,
            }}
          >
            Категория Excel
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
            <button type="button" onClick={() => setCategory("all")} style={chipStyle(category === "all")}>
              Все
            </button>
            {categories.map((c) => (
              <button
                key={c.slug}
                type="button"
                onClick={() => setCategory(c.slug)}
                style={chipStyle(category === c.slug)}
              >
                {c.icon} {c.label}
              </button>
            ))}
          </div>

          <div
            style={{
              fontSize: "var(--text-xs)",
              fontWeight: 700,
              color: "var(--color-text-tertiary)",
              marginBottom: 8,
            }}
          >
            Режим
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
            {TAG_FILTERS.map((t) => (
              <button
                key={t.slug}
                type="button"
                onClick={() => setTag(t.slug)}
                style={chipStyle(tag === t.slug)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <p
          className="arsenal-filters-mobile-hint"
          style={{
            margin: "0 0 8px",
            fontSize: "var(--text-xs)",
            color: "var(--color-text-tertiary)",
          }}
        >
          На телефоне открой «Фильтры», чтобы сузить категорию и режим.
        </p>
      </div>

      {/* Arsenals */}
      <div
        id="arsenals"
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "var(--space-m) 20px var(--space-l)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: 8,
            marginBottom: 16,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "clamp(20px, 3vw, 26px)",
              fontWeight: 800,
              letterSpacing: "-0.01em",
            }}
          >
            Стеки под миссию
          </h2>
          <span style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)" }}>
            {filteredStacks.length} из {stacks.length}
          </span>
        </div>

        {filteredStacks.length === 0 ? (
          <EmptyState
            title="Нет стеков по запросу"
            hint="Сбрось фильтры или попробуй другое слово: «голос», «авито», «локальный», «каталог»."
            onReset={resetFilters}
          />
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))",
              gap: 16,
            }}
          >
            {filteredStacks.map((s) => (
              <ArsenalCard key={s.slug} stack={s} tools={tools} />
            ))}
          </div>
        )}
      </div>

      {/* Bridges */}
      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "0 20px var(--space-xl)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))",
          gap: 12,
        }}
      >
        <BridgeCard
          href="/resheniya"
          title="Нужен пошаговый маршрут"
          text="Готовые решения AI: результат → этапы → проверка. Нейро каталог — toolkit рядом."
          icon={<MapIcon size={18} />}
        />
        <BridgeCard
          href="/resheniya/saas-product"
          title="SaaS → стек vibe-coder"
          text="Маршрут SaaS + арсенал агент-кодера и промпт-операций."
          icon={<Wrench size={18} />}
        />
        <BridgeCard
          href="/resheniya/avito-business"
          title="Авито → listing-photo"
          text="AI-магазин на Авито + стеки фото и контента продавца."
          icon={<Shield size={18} />}
        />
      </div>

      {/* Tools subset */}
      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "0 20px var(--space-xxl)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 14,
          }}
        >
          <div>
            <h2
              style={{
                margin: "0 0 4px",
                fontSize: "clamp(18px, 2.5vw, 22px)",
                fontWeight: 800,
              }}
            >
              Инструменты из стеков
            </h2>
            <p style={{ margin: 0, fontSize: "var(--text-s)", color: "var(--color-text-secondary)" }}>
              Каталог растёт этапами: «Голос и Аудио» закрыта. Далее — локальный AI и другие категории.
            </p>
          </div>
          <button type="button" onClick={() => setShowTools((v) => !v)} style={chipStyle(showTools)}>
            {showTools ? "Скрыть список" : `Показать · ${filteredTools.length}`}
          </button>
        </div>

        {showTools &&
          (filteredTools.length === 0 ? (
            <EmptyState
              title="Нет инструментов по фильтру"
              hint="Сбрось категорию или режим — либо открой стек выше."
              onReset={resetFilters}
            />
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))",
                gap: 12,
              }}
            >
              {filteredTools.map((t) => (
                <ToolMiniCard key={t.slug} tool={t} />
              ))}
            </div>
          ))}
      </div>
    </div>
  );
}

function ArsenalCard({ stack, tools }: { stack: ArsenalStack; tools: ArsenalTool[] }) {
  const toolMap = useMemo(() => new Map(tools.map((t) => [t.slug, t])), [tools]);
  const names = stack.tools
    .slice(0, 5)
    .map((slug) => toolMap.get(slug)?.name)
    .filter(Boolean);

  return (
    <Link
      href={`/arsenal/${stack.slug}`}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: "20px 18px",
        borderRadius: "var(--radius-l)",
        border: "1px solid var(--color-border)",
        background: "var(--color-surface)",
        textDecoration: "none",
        color: "inherit",
        minHeight: 220,
        transition: "border-color 0.15s, box-shadow 0.15s",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
        <span style={{ fontSize: 28, lineHeight: 1 }} aria-hidden>
          {stack.icon}
        </span>
        <span
          style={{
            fontSize: "var(--text-xs)",
            fontWeight: 700,
            color: "#0369a1",
            background: "rgba(14,165,233,0.12)",
            padding: "4px 10px",
            borderRadius: "var(--radius-full)",
          }}
        >
          {stack.focus}
        </span>
      </div>
      <div>
        <h3
          style={{
            margin: "0 0 6px",
            fontSize: "var(--text-l)",
            fontWeight: 800,
            letterSpacing: "-0.01em",
          }}
        >
          {stack.title}
        </h3>
        <p
          style={{
            margin: 0,
            fontSize: "var(--text-s)",
            color: "var(--color-text-secondary)",
            lineHeight: 1.5,
          }}
        >
          {stack.mission}
        </p>
      </div>
      <div style={{ marginTop: "auto" }}>
        <div
          style={{
            fontSize: "var(--text-xs)",
            color: "var(--color-text-tertiary)",
            marginBottom: 6,
          }}
        >
          {stack.tools.length} инструментов · порядок готов
        </div>
        <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.45 }}>
          {names.join(" → ")}
          {stack.tools.length > 5 ? "…" : ""}
        </div>
      </div>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          fontSize: "var(--text-s)",
          fontWeight: 700,
          color: "#0284c7",
        }}
      >
        Открыть стек <ArrowRight size={14} />
      </div>
    </Link>
  );
}

function ToolMiniCard({ tool }: { tool: ArsenalTool }) {
  return (
    <div
      style={{
        padding: "14px 14px",
        borderRadius: "var(--radius-m)",
        border: "1px solid var(--color-border)",
        background: "var(--color-surface)",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "flex-start" }}>
        <Link
          href={`/arsenal/tools/${tool.slug}`}
          style={{
            fontWeight: 700,
            fontSize: "var(--text-s)",
            color: "var(--color-text-primary)",
            textDecoration: "none",
          }}
        >
          {tool.categoryIcon} {tool.name}
        </Link>
        {tool.wasDuplicate && (
          <span style={{ fontSize: 11, color: "var(--color-text-tertiary)" }} title="Слито из двух строк Excel">
            dedup
          </span>
        )}
      </div>
      <p
        style={{
          margin: 0,
          fontSize: "var(--text-xs)",
          color: "var(--color-text-secondary)",
          lineHeight: 1.45,
          flex: 1,
        }}
      >
        {tool.summary}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
        {tool.website && (
          <a
            href={tool.website}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              fontSize: "var(--text-xs)",
              fontWeight: 600,
              color: "#0284c7",
              textDecoration: "none",
            }}
          >
            Сайт <ExternalLink size={12} />
          </a>
        )}
        <Link
          href={`/arsenal/tools/${tool.slug}`}
          style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}
        >
          Карточка
        </Link>
      </div>
    </div>
  );
}

function BridgeCard({
  href,
  title,
  text,
  icon,
}: {
  href: string;
  title: string;
  text: string;
  icon: ReactNode;
}) {
  return (
    <Link
      href={href}
      style={{
        display: "block",
        padding: "16px 16px",
        borderRadius: "var(--radius-m)",
        border: "1px solid var(--color-border)",
        background: "color-mix(in srgb, var(--color-surface) 90%, #0ea5e9)",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, fontWeight: 800 }}>
        {icon} {title}
      </div>
      <p style={{ margin: 0, fontSize: "var(--text-s)", color: "var(--color-text-secondary)", lineHeight: 1.45 }}>
        {text}
      </p>
    </Link>
  );
}

function EmptyState({
  title,
  hint,
  onReset,
}: {
  title: string;
  hint: string;
  onReset: () => void;
}) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "40px 16px",
        border: "1px dashed var(--color-border)",
        borderRadius: "var(--radius-l)",
        color: "var(--color-text-secondary)",
      }}
    >
      <AlertTriangle size={28} style={{ marginBottom: 10, opacity: 0.6 }} />
      <div style={{ fontWeight: 700, marginBottom: 6, color: "var(--color-text-primary)" }}>{title}</div>
      <p style={{ margin: "0 0 14px", fontSize: "var(--text-s)" }}>{hint}</p>
      <button type="button" onClick={onReset} style={chipStyle(true)}>
        Сбросить фильтры
      </button>
    </div>
  );
}

function chipStyle(active: boolean): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 12px",
    borderRadius: "var(--radius-full)",
    border: active ? "1px solid #0284c7" : "1px solid var(--color-border)",
    background: active ? "rgba(14,165,233,0.14)" : "var(--color-surface)",
    color: active ? "#0369a1" : "var(--color-text-secondary)",
    fontSize: "var(--text-xs)",
    fontWeight: 700,
    cursor: "pointer",
  };
}
