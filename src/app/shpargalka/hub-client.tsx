"use client";

import Link from "next/link";
import { ArrowRight, BookOpenCheck, ExternalLink } from "lucide-react";
import {
  SHPARGALKA_PROMPTS,
  getPublishedPacks,
  getSoonPacks,
} from "@/lib/shpargalka";
import { PACK_ICONS } from "./pack-icons";
import { ContourScheme, TeachingBlock } from "./shpargalka-ui";
import ShpargalkaCatalog from "./catalog-client";

export default function ShpargalkaHubClient() {
  const packs = getPublishedPacks();
  const soon = getSoonPacks();

  return (
    <div
      style={{
        background: "var(--color-bg-secondary)",
        minHeight: "100vh",
        fontFamily: "var(--font-body)",
        color: "var(--color-text-primary)",
      }}
    >
      <section
        style={{
          background:
            "linear-gradient(165deg, #0f172a 0%, #134e4a 55%, #0f766e 100%)",
          padding: "56px 20px 48px",
          color: "#fff",
        }}
      >
        <div style={{ maxWidth: 920, margin: "0 auto" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "4px 12px",
              background: "rgba(255,255,255,0.12)",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.03em",
              marginBottom: 16,
            }}
          >
            <BookOpenCheck size={14} aria-hidden /> БЕСПЛАТНАЯ ШПАРГАЛКА · {SHPARGALKA_PROMPTS.length} ШАБЛОНОВ
          </div>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(30px, 5vw, 44px)",
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              margin: "0 0 14px",
            }}
          >
            Готовые промпты по профессиям
          </h1>
          <p style={{ margin: "0 0 12px", fontSize: 18, lineHeight: 1.6, maxWidth: 640, color: "rgba(255,255,255,0.82)" }}>
            Берёте шаблон, подставляете слова в [скобках], копируете в ChatGPT или Cursor.
            Не изобретайте запрос с нуля — адаптируйте готовый.
          </p>
          <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.65)", maxWidth: 640 }}>
            Свои русские шаблоны ProektMap. Структура каталога вдохновлена бесплатной подборкой{" "}
            <a
              href="https://www.superhuman.ai/1000_chatgpt_prompts"
              target="_blank"
              rel="noreferrer"
              style={{ color: "#99f6e4" }}
            >
              Superhuman
            </a>
            . Это не Skills и не инженерные System Prompt.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "36px 20px 72px" }}>
        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 22, fontWeight: 800, margin: "0 0 12px" }}>
            Когда шпаргалка, когда Skill, когда маршрут
          </h2>
          <ContourScheme />
        </section>

        <div style={{ marginBottom: 36 }}>
          <TeachingBlock />
        </div>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 22, fontWeight: 800, margin: "0 0 14px" }}>
            Паки по профессиям
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 220px), 1fr))",
              gap: 12,
              marginBottom: 16,
            }}
          >
            {packs.map((pack) => {
              const Icon = PACK_ICONS[pack.icon];
              const count = SHPARGALKA_PROMPTS.filter((p) => p.pack === pack.slug).length;
              return (
                <Link
                  key={pack.slug}
                  href={`/shpargalka/${pack.slug}`}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    padding: 16,
                    border: "1px solid var(--color-border)",
                    background: "var(--color-bg-primary)",
                    textDecoration: "none",
                    color: "inherit",
                    minHeight: 140,
                  }}
                >
                  <Icon size={20} color="#0f766e" aria-hidden />
                  <div style={{ fontWeight: 800 }}>{pack.title}</div>
                  <p style={{ margin: 0, fontSize: 13, lineHeight: 1.45, color: "var(--color-text-secondary)", flex: 1 }}>
                    {pack.summary}
                  </p>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#0f766e" }}>
                    {count} шаблонов <ArrowRight size={12} style={{ verticalAlign: "middle" }} />
                  </span>
                </Link>
              );
            })}
          </div>
          {soon.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: "var(--color-text-tertiary)" }}>СКОРО</span>
            {soon.map((pack) => {
              const Icon = PACK_ICONS[pack.icon];
              return (
                <span
                  key={pack.slug}
                  title={pack.summary}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 12px",
                    minHeight: 40,
                    border: "1px dashed var(--color-border)",
                    color: "var(--color-text-tertiary)",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  <Icon size={14} aria-hidden />
                  {pack.title}
                </span>
              );
            })}
          </div>
          )}
        </section>

        <section>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 22, fontWeight: 800, margin: "0 0 14px" }}>
            Каталог шаблонов
          </h2>
          <ShpargalkaCatalog prompts={SHPARGALKA_PROMPTS} tasks={[]} packsForFilter={packs} />
        </section>

        <div
          style={{
            marginTop: 40,
            padding: 18,
            border: "1px solid var(--color-border)",
            background: "var(--color-bg-primary)",
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: "var(--color-text-secondary)", maxWidth: 640 }}>
            Нужен System Prompt для агента — в библиотеке инженерных промптов. Нужен Skill с установкой — в AI Skills.
            Английский оригинал структуры каталога — у Superhuman, бесплатно.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <Link href="/prompts" style={{ fontWeight: 700, color: "#0f766e", textDecoration: "none" }}>
              Инженерные промпты →
            </Link>
            <Link href="/ai-skills" style={{ fontWeight: 700, color: "#0f766e", textDecoration: "none" }}>
              AI Skills →
            </Link>
            <a
              href="https://www.superhuman.ai/1000_chatgpt_prompts"
              target="_blank"
              rel="noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 4, fontWeight: 700, color: "#0f766e", textDecoration: "none" }}
            >
              Superhuman <ExternalLink size={14} aria-hidden />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
