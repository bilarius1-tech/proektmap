"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Copy,
  ExternalLink,
  Layers,
  Route,
  Sparkles,
  Wand2,
  BookOpen,
  Palette,
} from "lucide-react";
import {
  AI_SKILLS,
  AI_SKILL_RECIPE,
  AI_SKILL_STACK,
  AI_DESIGN_CONTOUR,
  DESIGN_MD_TEMPLATE,
  WRITE_WELL_PILLARS,
  getAiSkill,
} from "@/lib/ai-skills";

function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setOk(true);
          setTimeout(() => setOk(false), 1600);
        } catch {
          /* ignore */
        }
      }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "8px 12px",
        border: "1px solid var(--color-border)",
        background: ok ? "rgba(15,184,128,0.12)" : "var(--color-bg-primary)",
        color: ok ? "#0f766e" : "var(--color-text-primary)",
        fontSize: 13,
        fontWeight: 700,
        cursor: "pointer",
        fontFamily: "var(--font-body)",
      }}
    >
      {ok ? <Check size={14} /> : <Copy size={14} />}
      {ok ? "Скопировано" : label}
    </button>
  );
}

function PreBlock({ text }: { text: string }) {
  return (
    <pre
      style={{
        margin: 0,
        padding: 16,
        background: "#0f172a",
        color: "#e2e8f0",
        fontSize: 13,
        lineHeight: 1.55,
        overflowX: "auto",
        whiteSpace: "pre-wrap",
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
      }}
    >
      {text}
    </pre>
  );
}

function SkillGraph() {
  const box = (label: string, href?: string, accent?: boolean) => {
    const inner = (
      <div
        style={{
          padding: "10px 14px",
          border: accent ? "2px solid #0f766e" : "1px solid var(--color-border)",
          background: accent ? "rgba(15,118,110,0.08)" : "var(--color-bg-primary)",
          fontWeight: 700,
          fontSize: 13,
          textAlign: "center",
          minWidth: 120,
        }}
      >
        {label}
      </div>
    );
    return href ? (
      <Link href={href} style={{ textDecoration: "none", color: "inherit" }}>
        {inner}
      </Link>
    ) : (
      inner
    );
  };

  const arrow = (
    <div style={{ textAlign: "center", color: "var(--color-text-secondary)", fontSize: 18, lineHeight: 1.2 }}>
      ↓
    </div>
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        padding: "24px 16px",
        background: "var(--color-bg-primary)",
        border: "1px solid var(--color-border)",
      }}
    >
      {box("WEB DESIGN")}
      {arrow}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
        {box("taste-skill", "/ai-skills/taste-skill", true)}
        {box("Guidelines", "/ai-skills/web-design-guidelines", true)}
      </div>
      {arrow}
      {box("Frontend Design", "/ai-skills/frontend-design", true)}
      {arrow}
      {box("IMPLEMENTATION")}
      {arrow}
      {box("Impeccable", "/ai-skills/impeccable", true)}
      {arrow}
      {box("POLISH")}
      <p
        style={{
          margin: "12px 0 0",
          fontSize: 12,
          color: "var(--color-text-secondary)",
          textAlign: "center",
          maxWidth: 420,
        }}
      >
        Граф = роли Skills. Порядок для задачи — в Recipe ниже.
      </p>
    </div>
  );
}

export default function AiSkillsHubClient() {
  return (
    <div
      style={{
        background: "var(--color-bg-secondary)",
        minHeight: "100vh",
        fontFamily: "var(--font-body)",
        color: "var(--color-text-primary)",
      }}
    >
      {/* HERO */}
      <section
        style={{
          background:
            "linear-gradient(165deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 55%, rgba(15, 184, 128, 0.08) 100%)",
          borderBottom: "1px solid var(--color-border)",
          padding: "56px 20px 48px",
        }}
      >
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "4px 12px",
              background: "rgba(15, 118, 110, 0.12)",
              color: "#0f766e",
              fontSize: "var(--text-xs)",
              fontWeight: 700,
              letterSpacing: "0.03em",
              marginBottom: 16,
            }}
          >
            <Wand2 size={14} aria-hidden /> AI ENGINEERING · DESIGN CLUSTER
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
            AI Engineering Skills
          </h1>

          <p
            style={{
              margin: "0 0 12px",
              fontSize: "var(--text-l, 18px)",
              lineHeight: 1.65,
              color: "var(--color-text-secondary)",
              maxWidth: 640,
            }}
          >
            Скилы, которые превращают AI из генератора кода в специализированного инженера.
            Особенно в дизайне: агента можно усилить — если знать, где взять усилитель и как правильно написать запрос.
          </p>

          <p style={{ margin: 0, fontSize: 14, color: "var(--color-text-secondary)", maxWidth: 640 }}>
            Это не «Карта способностей» (/skills). Здесь — внешние Skill-пакеты для агента: install → invoke → маршрут.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 28 }}>
            <a
              href="#contour"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 22px",
                background: "var(--color-accent)",
                color: "#fff",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "var(--text-s)",
                minHeight: 52,
              }}
            >
              Контур AI-дизайна <ArrowRight size={16} />
            </a>
            <a
              href="#write-well"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 22px",
                background: "var(--color-bg-primary)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text-primary)",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "var(--text-s)",
                minHeight: 52,
              }}
            >
              Как правильно писать
            </a>
            <Link
              href="/sandbox/design-system"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 22px",
                background: "var(--color-bg-primary)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text-primary)",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "var(--text-s)",
                minHeight: 52,
              }}
            >
              Дизайн-система
            </Link>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 880, margin: "0 auto", padding: "40px 20px 72px" }}>
        {/* BRIDGE A — design system */}
        <section
          style={{
            marginBottom: 40,
            padding: 18,
            border: "1px solid rgba(15,118,110,0.35)",
            background: "rgba(15,118,110,0.06)",
            display: "flex",
            flexWrap: "wrap",
            gap: 14,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ flex: "1 1 260px", display: "flex", gap: 12, alignItems: "flex-start" }}>
            <Palette size={22} color="#0f766e" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontWeight: 800, marginBottom: 4 }}>Сначала язык продукта</div>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: "var(--color-text-secondary)" }}>
                Skills усиливают агента. Дизайн-система задаёт токены и правила, которые агент не должен ломать.
                Без DESIGN.md даже Impeccable полирует случайность.
              </p>
            </div>
          </div>
          <Link
            href="/sandbox/design-system"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 14px",
              background: "#0f766e",
              color: "#fff",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            Открыть дизайн-систему <ArrowRight size={14} />
          </Link>
        </section>

        {/* WHY */}
        <section style={{ marginBottom: 48 }}>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: 22,
              fontWeight: 800,
              margin: "0 0 12px",
            }}
          >
            Зачем специалисту усиливать агента
          </h2>
          <p style={{ margin: "0 0 16px", lineHeight: 1.65, color: "var(--color-text-secondary)" }}>
            Без Skill агент тянет «средний» UI из обучающей выборки. Skill — это сжатая экспертиза: правила,
            антипаттерны, команды. Специалист не рисует пиксель за пикселем — он ставит усилитель и пишет точный
            заказ.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 12,
            }}
          >
            {[
              { t: "Где взять", d: "Официальные и проверенные репозитории — карточки ниже со ссылкой и install." },
              { t: "Как поставить", d: "skills CLI / Cursor Skills / папка .cursor/skills — команда на каждой карточке." },
              { t: "Как писать", d: "Skill + scope + запреты + один шаг маршрута. Разбор — в блоке «Как правильно писать»." },
            ].map((item) => (
              <div
                key={item.t}
                style={{
                  padding: 16,
                  background: "var(--color-bg-primary)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <div style={{ fontWeight: 800, marginBottom: 6 }}>{item.t}</div>
                <div style={{ fontSize: 14, lineHeight: 1.55, color: "var(--color-text-secondary)" }}>{item.d}</div>
              </div>
            ))}
          </div>
        </section>

        {/* PHASE B — CONTOUR */}
        <section id="contour" style={{ marginBottom: 48, scrollMarginTop: 80 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <Route size={20} color="#0f766e" />
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 22, fontWeight: 800, margin: 0 }}>
              Контур AI-дизайна
            </h2>
          </div>
          <p style={{ margin: "0 0 16px", lineHeight: 1.65, color: "var(--color-text-secondary)" }}>
            Полный путь специалиста: сначала правила продукта, потом усилители агента, потом паттерн экрана.
          </p>
          <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 10 }}>
            {AI_DESIGN_CONTOUR.map((item) => (
              <li
                key={item.step}
                style={{
                  display: "grid",
                  gridTemplateColumns: "48px 1fr",
                  gap: 12,
                  padding: 14,
                  background: "var(--color-bg-primary)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(15,118,110,0.1)",
                    color: "#0f766e",
                    fontWeight: 800,
                    fontSize: 14,
                  }}
                >
                  {item.step}
                </div>
                <div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "baseline", marginBottom: 4 }}>
                    <Link
                      href={item.href}
                      style={{ fontWeight: 800, color: "#0f766e", textDecoration: "none", fontSize: 15 }}
                    >
                      {item.title}
                    </Link>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "var(--color-text-secondary)" }}>
                      {item.role}
                    </span>
                  </div>
                  <div style={{ fontSize: 14, lineHeight: 1.5, color: "var(--color-text-secondary)" }}>{item.note}</div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* PHASE B — DESIGN.md */}
        <section id="design-md" style={{ marginBottom: 48, scrollMarginTop: 80 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <BookOpen size={20} color="#0f766e" />
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 22, fontWeight: 800, margin: 0 }}>
              Шаблон DESIGN.md
            </h2>
          </div>
          <p style={{ margin: "0 0 16px", lineHeight: 1.65, color: "var(--color-text-secondary)" }}>
            Файл, который агент читает до кода. Skills (особенно Impeccable) усиливают процесс — но источник правды
            здесь. Положите в корень проекта и допишите свои токены.
          </p>
          <PreBlock text={DESIGN_MD_TEMPLATE} />
          <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 10 }}>
            <CopyButton label="Copy DESIGN.md" text={DESIGN_MD_TEMPLATE} />
            <Link
              href="/sandbox/design-system#section-2"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 12px",
                border: "1px solid var(--color-border)",
                textDecoration: "none",
                color: "var(--color-text-primary)",
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              Гайд по токенам →
            </Link>
          </div>
        </section>

        {/* WRITE WELL — главный акцент */}
        <section id="write-well" style={{ marginBottom: 48, scrollMarginTop: 80 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <Sparkles size={20} color="#0f766e" />
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 22, fontWeight: 800, margin: 0 }}>
              Как правильно писать
            </h2>
          </div>
          <p style={{ margin: "0 0 16px", lineHeight: 1.65, color: "var(--color-text-secondary)" }}>
            Самое важное: Skill не сработает от фразы «сделай красиво». Пишите как инженерный заказ.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 12,
              marginBottom: 20,
            }}
          >
            {WRITE_WELL_PILLARS.map((p) => (
              <div
                key={p.title}
                style={{
                  padding: 16,
                  borderLeft: "3px solid #0f766e",
                  background: "var(--color-bg-primary)",
                }}
              >
                <div style={{ fontWeight: 800, marginBottom: 6 }}>{p.title}</div>
                <div style={{ fontSize: 14, lineHeight: 1.55, color: "var(--color-text-secondary)" }}>{p.text}</div>
              </div>
            ))}
          </div>

          <div
            style={{
              padding: 20,
              background: "var(--color-bg-primary)",
              border: "1px solid var(--color-border)",
            }}
          >
            <div style={{ fontWeight: 800, marginBottom: 10, fontSize: 14, letterSpacing: "0.04em" }}>
              ШАБЛОН ЗАКАЗА АГЕНТУ
            </div>
            <PreBlock
              text={`Подключи Skill: [название]
Роль шага: [направление | вкус | audit | polish]
Экран / файлы: [scope]
Продукт и аудитория: […]
Дизайн-система: читай DESIGN.md — не выдумывай токены
Направление / режим: […]
Запреты: [Inter, фиолетовый градиент, …]
Стек: […]
Сначала план в 5 буллетах, потом код. Не выходи за scope.`}
            />
            <div style={{ marginTop: 12 }}>
              <CopyButton
                label="Copy шаблон"
                text={`Подключи Skill: [название]
Роль шага: [направление | вкус | audit | polish]
Экран / файлы: [scope]
Продукт и аудитория: […]
Дизайн-система: читай DESIGN.md — не выдумывай токены
Направление / режим: […]
Запреты: [Inter, фиолетовый градиент, …]
Стек: […]
Сначала план в 5 буллетах, потом код. Не выходи за scope.`}
              />
            </div>
          </div>
        </section>

        {/* GRAPH */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 22, fontWeight: 800, margin: "0 0 12px" }}>
            Skill Graph · Design
          </h2>
          <SkillGraph />
        </section>

        {/* CARDS */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 22, fontWeight: 800, margin: "0 0 16px" }}>
            Design-кластер · 4 Skills
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 14,
            }}
          >
            {AI_SKILLS.map((skill) => (
              <Link
                key={skill.slug}
                href={`/ai-skills/${skill.slug}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  padding: 18,
                  background: "var(--color-bg-primary)",
                  border: "1px solid var(--color-border)",
                  textDecoration: "none",
                  color: "inherit",
                  minHeight: 200,
                }}
              >
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {skill.typeLabels.map((t) => (
                    <span
                      key={t}
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: "0.04em",
                        padding: "3px 8px",
                        background: "rgba(15,118,110,0.1)",
                        color: "#0f766e",
                      }}
                    >
                      {t.toUpperCase()}
                    </span>
                  ))}
                </div>
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 18 }}>{skill.title}</div>
                <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>by {skill.author}</div>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: "var(--color-text-secondary)", flex: 1 }}>
                  {skill.summary}
                </p>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 700, fontSize: 13, color: "#0f766e" }}>
                  Открыть Skill <ArrowRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* STACK */}
        <section style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <Layers size={20} color="#0f766e" />
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 22, fontWeight: 800, margin: 0 }}>
              Skill Stack
            </h2>
          </div>
          <div
            style={{
              padding: 22,
              background: "var(--color-bg-primary)",
              border: "1px solid var(--color-border)",
            }}
          >
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 20, marginBottom: 8 }}>
              {AI_SKILL_STACK.title}
            </div>
            <p style={{ margin: "0 0 14px", lineHeight: 1.6, color: "var(--color-text-secondary)" }}>
              {AI_SKILL_STACK.summary}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {AI_SKILL_STACK.skillSlugs.map((slug) => {
                const s = getAiSkill(slug);
                return (
                  <Link
                    key={slug}
                    href={`/ai-skills/${slug}`}
                    style={{
                      padding: "8px 12px",
                      border: "1px solid var(--color-border)",
                      textDecoration: "none",
                      color: "var(--color-text-primary)",
                      fontWeight: 700,
                      fontSize: 13,
                    }}
                  >
                    {s?.title ?? slug}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* RECIPE */}
        <section id="recipe" style={{ marginBottom: 48, scrollMarginTop: 80 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <Route size={20} color="#0f766e" />
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 22, fontWeight: 800, margin: 0 }}>
              Skill Recipe
            </h2>
          </div>
          <div
            style={{
              padding: 22,
              background: "var(--color-bg-primary)",
              border: "1px solid var(--color-border)",
            }}
          >
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 20, marginBottom: 6 }}>
              {AI_SKILL_RECIPE.title}
            </div>
            <p style={{ margin: "0 0 18px", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
              Цель: {AI_SKILL_RECIPE.goal}
            </p>

            <ol style={{ margin: "0 0 20px", paddingLeft: 20, display: "grid", gap: 12 }}>
              {AI_SKILL_RECIPE.steps.map((step, i) => {
                const s = getAiSkill(step.skillSlug);
                return (
                  <li key={step.skillSlug} style={{ lineHeight: 1.5 }}>
                    <Link href={`/ai-skills/${step.skillSlug}`} style={{ fontWeight: 800, color: "#0f766e" }}>
                      {i + 1}. {s?.title}
                    </Link>
                    <span style={{ color: "var(--color-text-secondary)" }}> — {step.role}. {step.note}</span>
                  </li>
                );
              })}
            </ol>

            <div style={{ fontWeight: 800, fontSize: 13, letterSpacing: "0.04em", marginBottom: 8 }}>
              ROUTE PROMPT · скопируй в агент
            </div>
            <PreBlock text={AI_SKILL_RECIPE.routePrompt} />
            <div style={{ marginTop: 12 }}>
              <CopyButton label="Copy Recipe" text={AI_SKILL_RECIPE.routePrompt} />
            </div>
          </div>
        </section>

        {/* LINKS */}
        <section
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            paddingTop: 8,
            borderTop: "1px solid var(--color-border)",
          }}
        >
          <Link href="/sandbox/design-system" style={{ fontWeight: 700, color: "#0f766e", textDecoration: "none" }}>
            Дизайн-система →
          </Link>
          <Link href="/agent-engineering" style={{ fontWeight: 700, color: "#0f766e", textDecoration: "none" }}>
            ← Инженерия агентов
          </Link>
          <Link href="/ui-patterns" style={{ fontWeight: 700, color: "#0f766e", textDecoration: "none" }}>
            UI-Атлас →
          </Link>
          <Link href="/resheniya/premium-landing" style={{ fontWeight: 700, color: "#0f766e", textDecoration: "none" }}>
            Решение: без AI-скуфа →
          </Link>
          <Link href="/skills" style={{ fontWeight: 700, color: "#0f766e", textDecoration: "none" }}>
            Карта способностей →
          </Link>
          <a
            href="https://github.com/anthropics/skills"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              fontWeight: 700,
              color: "var(--color-text-secondary)",
              textDecoration: "none",
            }}
          >
            anthropics/skills <ExternalLink size={14} />
          </a>
        </section>
      </div>
    </div>
  );
}
