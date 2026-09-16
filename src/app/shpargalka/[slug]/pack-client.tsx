"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ShpargalkaPack, ShpargalkaPrompt } from "@/lib/shpargalka";
import { PACK_ICONS } from "../pack-icons";
import { CopyButton } from "../shpargalka-ui";
import ShpargalkaCatalog from "../catalog-client";

export default function ShpargalkaPackClient({
  pack,
  prompts,
  tasks,
}: {
  pack: ShpargalkaPack;
  prompts: ShpargalkaPrompt[];
  tasks: string[];
}) {
  const Icon = PACK_ICONS[pack.icon];

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
          background: "var(--color-bg-primary)",
          borderBottom: "1px solid var(--color-border)",
          padding: "40px 20px 32px",
        }}
      >
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <Link
            href="/shpargalka"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              color: "#0f766e",
              fontWeight: 700,
              fontSize: 14,
              textDecoration: "none",
              marginBottom: 16,
            }}
          >
            <ArrowLeft size={16} aria-hidden /> Все шаблоны
          </Link>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div
              style={{
                width: 48,
                height: 48,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(15,118,110,0.1)",
                color: "#0f766e",
                flexShrink: 0,
              }}
            >
              <Icon size={24} aria-hidden />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#0f766e", letterSpacing: "0.04em" }}>
                {pack.profession.toUpperCase()} · {prompts.length} ШАБЛОНОВ
              </div>
              <h1
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(26px, 4vw, 36px)",
                  fontWeight: 900,
                  margin: "6px 0 8px",
                  letterSpacing: "-0.02em",
                }}
              >
                {pack.title}
              </h1>
              <p style={{ margin: 0, fontSize: 16, lineHeight: 1.55, color: "var(--color-text-secondary)", maxWidth: 620 }}>
                {pack.summary}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "28px 20px 72px" }}>
        <section
          style={{
            marginBottom: 28,
            padding: 18,
            border: "1px solid var(--color-border)",
            background: "var(--color-bg-primary)",
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 800, color: "#0f766e", marginBottom: 10 }}>ПЛОХО → ХОРОШО</div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
              gap: 12,
              marginBottom: 12,
            }}
          >
            <div style={{ padding: 12, background: "#fef2f2" }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#991b1b", marginBottom: 4 }}>ПЛОХО</div>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>{pack.howToWrite.bad}</p>
            </div>
            <div style={{ padding: 12, background: "#ecfdf5" }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#0f766e", marginBottom: 4 }}>ХОРОШО</div>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>{pack.howToWrite.good}</p>
            </div>
          </div>
          <p style={{ margin: "0 0 12px", fontSize: 14, color: "var(--color-text-secondary)" }}>{pack.howToWrite.why}</p>
          <div style={{ fontSize: 13, marginBottom: 12 }}>
            <strong>Было:</strong> {pack.example.before}
            <br />
            <strong>Стало:</strong> {pack.example.after}
          </div>
          <CopyButton text={pack.howToWrite.good} label="Копировать хороший запрос" />
        </section>

        <ShpargalkaCatalog prompts={prompts} tasks={tasks} />
      </div>
    </div>
  );
}
