import Link from "next/link";
import { ArrowLeft, Library } from "lucide-react";
import CreativeLibraryClient from "./client";
import { CREATIVE_TOOLS } from "@/lib/creative-library/data";

export const metadata = {
  title: "Креативная библиотека вайбкодера — Песочница | ProektMap",
  description:
    "Стеки-рецепты: сайт-фильм, вирт. галереи, карты, туры + инструменты Tier 1–3 и FPS Killers.",
  openGraph: {
    title: "Креативная библиотека вайбкодера",
    description: "Рецепты стеков: галереи, карты, туры, scroll-фильм — когда брать и что сказать агенту.",
    images: [
      {
        url: "https://proektmap.ru/api/og?title=Креативная+библиотека&category=Песочница&author=Вайбкодинг",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function CreativeLibraryPage() {
  return (
    <div style={{ fontFamily: "var(--font-body)", background: "var(--color-bg-secondary)", color: "var(--color-text-primary)", minHeight: "100dvh" }}>
      <div
        style={{
          background: "linear-gradient(160deg, #0c1210 0%, #12241c 45%, #0fb88022 100%)",
          color: "#f5f5f3",
          padding: "var(--space-xxl) var(--space-m)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          <Link
            href="/sandbox"
            style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: "rgba(245,245,243,0.65)", textDecoration: "none", marginBottom: "var(--space-l)" }}
          >
            <ArrowLeft size={14} /> Песочница
          </Link>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.75, marginBottom: "var(--space-s)" }}>
            <Library size={14} /> Песочница · MVP {CREATIVE_TOOLS.length}
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
            Креативная библиотека вайбкодера
          </h1>
          <p style={{ fontSize: "var(--text-m)", lineHeight: 1.65, opacity: 0.85, maxWidth: 560, margin: 0 }}>
            Не awesome-list. Сначала стек-рецепт под задачу, потом карточки Tier 1–3: когда брать, что сказать агенту, как не убить FPS.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1040, margin: "0 auto", padding: "var(--space-xl) var(--space-m) var(--space-xxl)" }}>
        <CreativeLibraryClient />

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
            <li>Выбери задачу («Мне нужно…») или открой карточку.</li>
            <li>Прочитай Design DNA и Do / Don&apos;t.</li>
            <li>Скопируй промпт → вставь агенту в Cursor / Claude Code.</li>
            <li>Собери в своём стеке. Код чужих демо не копируем — копируем решение.</li>
          </ol>
          <p style={{ margin: "12px 0 0", fontSize: 12, color: "var(--color-text-tertiary)" }}>
            Центр продукта — <Link href="/resheniya" style={{ color: "var(--color-accent)" }}>/resheniya</Link>. Эта библиотека — слой «на чём сделать необычно».
          </p>
        </section>
      </div>
    </div>
  );
}
