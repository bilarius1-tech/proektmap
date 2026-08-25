import Link from "next/link";
import { ArrowLeft, LayoutTemplate } from "lucide-react";
import VibeBlocksClient from "./client";
import { VIBE_KITS } from "@/lib/vibe-blocks/data";

export const metadata = {
  title: "Вайб-блоки — UI-киты и промпты для агента | Песочница ProektMap",
  description:
    "Каталог UI-китов в духе OriginKit и 21st.dev: готовые блоки, Copy prompt, MCP. Сценарии для лендинга, анимаций и AI-чата.",
  openGraph: {
    title: "Вайб-блоки — идеи и промпты для вайбкодера",
    description: "OriginKit, 21st, Magic UI, Aceternity и другие: когда брать и что сказать агенту.",
    images: [
      {
        url: "https://proektmap.ru/api/og?title=Вайб-блоки&category=Песочница&author=UI+для+агента",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function VibeBlocksPage() {
  return (
    <div
      style={{
        fontFamily: "var(--font-body)",
        background: "var(--color-bg-secondary)",
        color: "var(--color-text-primary)",
        minHeight: "100dvh",
      }}
    >
      <div
        style={{
          background: "linear-gradient(155deg, #10131a 0%, #1a2438 48%, #3d7eff22 100%)",
          color: "#f5f5f3",
          padding: "var(--space-xxl) var(--space-m)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          <Link
            href="/sandbox"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              fontSize: 12,
              color: "rgba(245,245,243,0.65)",
              textDecoration: "none",
              marginBottom: "var(--space-l)",
            }}
          >
            <ArrowLeft size={14} /> Песочница
          </Link>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              opacity: 0.75,
              marginBottom: "var(--space-s)",
            }}
          >
            <LayoutTemplate size={14} /> Песочница · {VIBE_KITS.length} китов
          </div>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(32px, 6vw, 52px)",
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              margin: "0 0 var(--space-m)",
              maxWidth: 720,
            }}
          >
            Вайб-блоки
          </h1>
          <p style={{ fontSize: "var(--text-m)", lineHeight: 1.65, opacity: 0.85, maxWidth: 580, margin: 0 }}>
            Когда не хватает идей и визуала: каталог UI-китов с превью-логикой OriginKit / 21st.dev.
            Выбери сценарий → скопируй бриф → отдай агенту.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1040, margin: "0 auto", padding: "var(--space-xl) var(--space-m) var(--space-xxl)" }}>
        <VibeBlocksClient />

        <section
          style={{
            marginTop: "var(--space-xl)",
            padding: "var(--space-l)",
            border: "1px solid var(--color-border)",
            background: "var(--color-bg-primary)",
          }}
        >
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-m)", fontWeight: 800, margin: "0 0 8px" }}>
            Как пользоваться
          </h2>
          <ol style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.7 }}>
            <li>Выбери сценарий («Лендинг за вечер», «Вау-анимации»…).</li>
            <li>Открой 1–2 карточки китов — когда брать / не брать.</li>
            <li>Скопируй промпт или бриф сценария → вставь в Cursor / Claude Code.</li>
            <li>
              Инструменты анимации (GSAP, Three…) — в{" "}
              <Link href="/sandbox/creative-library" style={{ color: "var(--color-accent)" }}>
                Креативной библиотеке
              </Link>
              .
            </li>
          </ol>
          <p style={{ margin: "12px 0 0", fontSize: 12, color: "var(--color-text-tertiary)" }}>
            Центр продукта —{" "}
            <Link href="/resheniya" style={{ color: "var(--color-accent)" }}>
              /resheniya
            </Link>
            . Этот раздел — слой «какой блок и какой промпт».
          </p>
        </section>
      </div>
    </div>
  );
}
