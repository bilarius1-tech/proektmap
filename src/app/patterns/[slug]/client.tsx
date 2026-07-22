"use client";

import { useState } from "react";
import Link from "next/link";
import Breadcrumbs from "@/components/nav/breadcrumbs";
import Term from "@/components/glossary/tooltip-term";
import { useRouter } from "next/navigation";
import { ArrowLeft, Star, Clock, DollarSign, Wrench, Check, X, ExternalLink, Play, Database, Layers, GitBranch, AlertTriangle, Lightbulb } from "lucide-react";

export default function PatternDetailClient({ pattern, blueprint, blueprints }: any) {
  const router = useRouter();
  const outcome = JSON.parse(pattern.outcome || "{}");
  const entities = JSON.parse(pattern.entities || "[]");
  const stack = JSON.parse(pattern.stack || "[]");
  const architecture = JSON.parse(pattern.architecture || "[]");
  const evolution = JSON.parse(pattern.evolution || "[]");
  const mistakes = JSON.parse(pattern.mistakes || "[]");

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "var(--space-xl) var(--space-m)" }}>
      <Breadcrumbs pathname={`/patterns/${pattern.slug}`} pageTitle={pattern.title} />
      <Link href="/patterns" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "var(--text-s)", color: "var(--color-text-secondary)", textDecoration: "none", marginBottom: "var(--space-l)" }}>
        <ArrowLeft size={14} /> Назад к паттернам
      </Link>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-l)", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ display: "inline-block", padding: "2px 10px", borderRadius: 0, background: pattern.difficulty === "beginner" ? "#ecfdf5" : pattern.difficulty === "intermediate" ? "#fffbeb" : "#fef2f2", color: pattern.difficulty === "beginner" ? "#065f46" : pattern.difficulty === "intermediate" ? "#92400e" : "#991b1b", fontSize: 10, fontWeight: 700, marginBottom: "var(--space-xs)" }}>
            {pattern.difficulty === "beginner" ? "🟢 Новичок" : pattern.difficulty === "intermediate" ? "🟡 Практик" : "🔴 Профи"}
          </div>
          <h1 style={{ fontSize: "var(--text-xxl)", fontWeight: 800, margin: "var(--space-xs) 0" }}>{pattern.title}</h1>
          <p style={{ fontSize: "var(--text-m)", color: "var(--color-text-secondary)", lineHeight: 1.7, maxWidth: 600 }}>{pattern.description}</p>
        <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", lineHeight: 1.7, marginTop: 4 }}>Наведи на термин чтобы узнать значение: <Term term="MCP" />, <Term term="API" />, <Term term="Next.js" /></p>
        </div>
        <Link href={`/${blueprint?.slug || blueprints[0]?.slug || "corporate-website"}`}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 0, background: "var(--color-accent)", color: "white", textDecoration: "none", fontSize: "var(--text-m)", fontWeight: 700, whiteSpace: "nowrap", flexShrink: 0 }}>
          <Play size={18} /> Собрать
        </Link>
      </div>

      {/* Outcome bar */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "var(--space-s)", marginBottom: "var(--space-xl)", padding: "var(--space-l)", background: "var(--color-bg-secondary)", borderRadius: 0, border: "1px solid var(--color-border-light)" }}>
        {[
          { label: "Сложность", value: outcome.complexity + "/10", icon: <Star size={14} style={{ color: "var(--color-warning)", fill: "var(--color-warning)" }} /> },
          { label: "Запуск", value: outcome.launchTime || pattern.timeToBuild, icon: <Clock size={14} /> },
          { label: "Доход", value: "$" + outcome.revenuePotential + "/мес", icon: <DollarSign size={14} style={{ color: "var(--color-accent)" }} /> },
          { label: "Поддержка", value: outcome.maintenance || "—", icon: <Wrench size={14} /> },
        ].map((s, i) => (
          <div key={i} style={{ textAlign: "center", padding: "var(--space-m)" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>{s.label}</div>
            <div style={{ fontSize: "var(--text-s)", fontWeight: 800 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Entities */}
      {entities.length > 0 && (
        <div style={{ marginBottom: "var(--space-xl)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "var(--space-m)" }}>
            <Database size={16} style={{ color: "var(--color-accent)" }} />
            <h2 style={{ fontSize: "var(--text-xl)", fontWeight: 700 }}>Сущности</h2>
          </div>
          <p style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)", marginBottom: "var(--space-m)", lineHeight: 1.6 }}>
            Проект начинается с модели данных. Вот какие сущности нужны для этого паттерна:
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "var(--space-s)" }}>
            {entities.map((e: any, i: number) => (
              <div key={i} style={{ padding: "var(--space-m)", background: "var(--color-bg-primary)", borderRadius: 0, border: "1px solid var(--color-border-light)" }}>
                <div style={{ fontWeight: 700, fontSize: "var(--text-s)", marginBottom: 4 }}>{e.name}</div>
                <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginBottom: 6 }}>{e.relations}</div>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {e.fields.map((f: string, j: number) => (
                    <span key={j} style={{ padding: "1px 6px", borderRadius: "var(--radius-full)", background: "var(--color-bg-secondary)", fontSize: 9, color: "var(--color-text-secondary)", fontFamily: "monospace" }}>{f}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Why this stack */}
      {stack.length > 0 && (
        <div style={{ marginBottom: "var(--space-xl)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "var(--space-m)" }}>
            <Layers size={16} style={{ color: "var(--color-accent)" }} />
            <h2 style={{ fontSize: "var(--text-xl)", fontWeight: 700 }}>Почему этот стек</h2>
          <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", marginBottom: "var(--space-m)" }}>Термины: <Term term="Frontend" />, <Term term="Backend" />, <Term term="API" />, <Term term="База данных" /></p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
            {stack.map((s: any, i: number) => (
              <div key={i} style={{ padding: "var(--space-m)", background: "var(--color-bg-primary)", borderRadius: 0, border: "1px solid var(--color-border-light)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: "var(--text-s)", marginBottom: 4 }}>{s.tool}</div>
                    <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
                      <span style={{ color: "#065f46", fontWeight: 600 }}>✅ </span>{s.why}
                    </div>
                    {s.whyNot && (
                      <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.5, marginTop: 4 }}>
                        <span style={{ color: "#991b1b", fontWeight: 600 }}>❌ Почему не {s.whyNot.split(" — ")[0]?.split("?")?.[0] || "альтернатива"}:</span> {s.whyNot.includes(" — ") ? s.whyNot.split(" — ")[1] : s.whyNot}
                      </div>
                    )}
                  </div>
                  {s.alternatives?.length > 0 && (
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap", alignSelf: "flex-start" }}>
                      <span style={{ fontSize: 9, color: "var(--color-text-tertiary)", fontWeight: 600 }}>Альтернативы:</span>
                      {s.alternatives.map((a: string, j: number) => (
                        <span key={j} style={{ padding: "1px 6px", borderRadius: "var(--radius-full)", background: "var(--color-bg-secondary)", fontSize: 9, color: "var(--color-text-secondary)" }}>{a}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Architecture */}
      {architecture.length > 0 && (
        <div style={{ marginBottom: "var(--space-xl)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "var(--space-m)" }}>
            <GitBranch size={16} style={{ color: "var(--color-accent)" }} />
            <h2 style={{ fontSize: "var(--text-xl)", fontWeight: 700 }}>Архитектура</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
            {architecture.map((a: any, i: number) => (
              <div key={i} style={{ padding: "var(--space-m)", background: "var(--color-bg-primary)", borderRadius: 0, border: "1px solid var(--color-border-light)" }}>
                <div style={{ fontWeight: 700, fontSize: "var(--text-s)", marginBottom: 6 }}>{a.phase}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {a.steps.map((step: string, j: number) => (
                    <div key={j} style={{ display: "flex", gap: 8, fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
                      <span style={{ color: "var(--color-accent)", fontWeight: 700 }}>{j + 1}.</span> {step}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Evolution */}
      {evolution.length > 0 && (
        <div style={{ marginBottom: "var(--space-xl)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "var(--space-m)" }}>
            <GitBranch size={16} style={{ color: "var(--color-accent)" }} />
            <h2 style={{ fontSize: "var(--text-xl)", fontWeight: 700 }}>Эволюция</h2>
          </div>
          <div style={{ position: "relative" }}>
            {evolution.map((ev: any, i: number) => (
              <div key={i} style={{ display: "flex", gap: 0, marginBottom: i < evolution.length - 1 ? 0 : 0 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 60, flexShrink: 0 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--color-accent)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>{i + 1}</div>
                  {i < evolution.length - 1 && <div style={{ width: 2, flex: 1, background: "var(--color-border)", margin: "4px 0" }} />}
                </div>
                <div style={{ padding: "0 0 var(--space-l) var(--space-m)", flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: "var(--text-s)", marginBottom: 2 }}>{ev.version}: {ev.desc}</div>
                  <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>➕ {ev.adds}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mistakes */}
      {mistakes.length > 0 && (
        <div style={{ marginBottom: "var(--space-xl)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "var(--space-m)" }}>
            <AlertTriangle size={16} style={{ color: "#f59e0b" }} />
            <h2 style={{ fontSize: "var(--text-xl)", fontWeight: 700 }}>Типичные ошибки</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
            {mistakes.map((m: any, i: number) => (
              <div key={i} style={{ padding: "var(--space-m)", background: "#fffbeb", borderRadius: 0, border: "1px solid #f59e0b" }}>
                <div style={{ fontWeight: 700, fontSize: "var(--text-s)", color: "#92400e", marginBottom: 4 }}>{m.title}</div>
                <div style={{ fontSize: "var(--text-xs)", color: "#92400e", lineHeight: 1.5 }}>{m.desc}</div>
                <div style={{ fontSize: "var(--text-xs)", color: "#92400e", marginTop: 4, fontWeight: 600 }}>
                  <Lightbulb size={12} style={{ display: "inline", marginRight: 4 }} />Урок: {m.lesson}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      <div style={{ padding: "var(--space-xl)", background: "var(--color-accent-light)", borderRadius: 0, border: "2px solid var(--color-accent)", textAlign: "center" }}>
        <div style={{ fontSize: "var(--text-xl)", fontWeight: 800, marginBottom: "var(--space-s)" }}>Готов собрать?</div>
        <p style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)", marginBottom: "var(--space-m)" }}>Открой Blueprint и пройди по шагам с AI-помощником</p>
        <Link href={`/${blueprint?.slug || blueprints[0]?.slug || "corporate-website"}`}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 32px", borderRadius: 0, background: "var(--color-accent)", color: "white", textDecoration: "none", fontSize: "var(--text-m)", fontWeight: 700 }}>
          <Play size={18} /> {blueprint ? `Открыть Blueprint «${blueprint.title}»` : "Начать сборку"}
        </Link>
      </div>
    </div>
  );
}
