import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Bot,
  CheckCircle2,
  ExternalLink,
  KeyRound,
  Layers,
  ListChecks,
  Shield,
  Sparkles,
  XCircle,
} from "lucide-react";
import CopyTextButton from "@/components/agent-engineering/copy-text-button";
import {
  AnatomyInfographic,
  LadderInfographic,
  OuterInnerInfographic,
  SharedComputerInfographic,
  SkillPluginStrip,
} from "@/components/agent-engineering/grok-bot-infographics";
import NeuroCatalogCallout from "@/components/arsenal/neuro-catalog-callout";
import {
  ACCESS_NOTES,
  BEFORE_AFTER,
  BOT_FIELDS,
  GROK_BOT_ACCENT as ACCENT,
  GROK_BOT_META,
  GROK_BOT_TOC,
  HOW_TO_WRITE,
  OFFICIAL_DOCS,
  PRODUCT_COMPARE,
  RELATED_LINKS,
  SAFETY_RULES,
  SCENARIOS,
  SKILL_INVOKE,
  SKILL_VS_PLUGIN,
  TEMPLATES,
  TRACK_MAP,
  TRUST_LADDER,
} from "@/lib/agent-engineering/grok-bot-data";

export const metadata: Metadata = {
  title: GROK_BOT_META.seoTitle,
  description: GROK_BOT_META.seoDescription,
  alternates: {
    canonical: GROK_BOT_META.canonical,
  },
  openGraph: {
    title: GROK_BOT_META.seoTitle,
    description: GROK_BOT_META.seoDescription,
    url: GROK_BOT_META.canonical,
    siteName: "ProektMap",
    type: "article",
  },
};

const sectionTitle: CSSProperties = {
  fontFamily: "var(--font-heading)",
  fontSize: "clamp(22px, 3vw, 28px)",
  fontWeight: 800,
  margin: "0 0 8px",
};

const kicker: CSSProperties = {
  margin: "0 0 6px",
  fontSize: 12,
  fontWeight: 700,
  color: ACCENT,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

export default function GrokBotManualPage() {
  return (
    <div
      style={{
        background: "var(--color-bg-secondary)",
        minHeight: "100vh",
        fontFamily: "var(--font-body)",
        color: "var(--color-text-primary)",
      }}
    >
      <style>{`
        @media (max-width: 720px) {
          .grok-bot-compare-grid,
          .grok-bot-howto-grid,
          .grok-bot-fields-grid {
            grid-template-columns: 1fr !important;
          }
          .grok-bot-howto-bad {
            border-right: none !important;
            border-bottom: 1px solid var(--color-border);
          }
        }
      `}</style>
      <section
        style={{
          background:
            "linear-gradient(165deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 55%, rgba(234, 88, 12, 0.10) 100%)",
          borderBottom: "1px solid var(--color-border)",
          padding: "48px 20px 40px",
        }}
      >
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <Link
            href="/agent-engineering"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              fontWeight: 600,
              color: "var(--color-text-secondary)",
              textDecoration: "none",
              marginBottom: 16,
            }}
          >
            <ArrowLeft size={14} /> Инженерия агентов
          </Link>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "4px 12px",
              background: "rgba(234, 88, 12, 0.12)",
              color: ACCENT,
              fontSize: "var(--text-xs)",
              fontWeight: 700,
              letterSpacing: "0.03em",
              marginBottom: 16,
            }}
          >
            <Bot size={14} aria-hidden /> {GROK_BOT_META.tagline}
          </div>

          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(28px, 5vw, 42px)",
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              margin: "0 0 14px",
            }}
          >
            Grok Bot — коллега с компьютером в облаке
          </h1>
          <p
            style={{
              margin: "0 0 10px",
              fontSize: "var(--text-l, 18px)",
              lineHeight: 1.65,
              color: "var(--color-text-secondary)",
              maxWidth: 680,
            }}
          >
            {GROK_BOT_META.heroLead}
          </p>
          <p
            style={{
              margin: 0,
              fontSize: 15,
              lineHeight: 1.6,
              color: "var(--color-text-secondary)",
              maxWidth: 680,
            }}
          >
            {GROK_BOT_META.valueProp}
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 24 }}>
            <a
              href="#shablony"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 22px",
                background: ACCENT,
                color: "#fff",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "var(--text-s)",
                minHeight: 52,
              }}
            >
              К копируемым шаблонам <ArrowRight size={16} />
            </a>
            <a
              href="#lestnica"
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
              <ListChecks size={16} /> Лестница доверия
            </a>
          </div>

          <nav
            aria-label="Содержание"
            style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 22 }}
          >
            {GROK_BOT_TOC.map((item) => (
              <a
                key={item.href}
                href={item.href}
                style={{
                  padding: "8px 12px",
                  border: `1px solid ${ACCENT}44`,
                  color: ACCENT,
                  textDecoration: "none",
                  fontSize: 13,
                  fontWeight: 700,
                  background: "var(--color-bg-primary)",
                }}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <main style={{ maxWidth: 880, margin: "0 auto", padding: "36px 20px 72px" }}>
        <NeuroCatalogCallout
          style={{ marginBottom: 32 }}
          secondaryHref="/arsenal/mcp-agents"
          secondaryLabel="Стек: агенты и скиллы"
        />

        <section id="chto-eto" style={{ marginBottom: 48 }}>
          <p style={kicker}>Одна фраза</p>
          <h2 style={sectionTitle}>Это не чат. Это сотрудник с рабочим столом</h2>
          <p style={{ margin: "0 0 20px", color: "var(--color-text-secondary)", lineHeight: 1.65 }}>
            Пишете как коллеге. У коллеги есть постоянный облачный компьютер: браузер, файлы,
            терминал. Можно перехватить стол на капче и 2FA. Можно поставить расписание. Можно
            передать работу другому боту.
          </p>
          <AnatomyInfographic />
        </section>

        <section id="sravnenie" style={{ marginBottom: 48 }}>
          <p style={kicker}>Не путать продукты</p>
          <h2 style={sectionTitle}>Четыре разных инструмента</h2>
          <p style={{ margin: "0 0 18px", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
            Если смешать Grok-чат, Grok Bot, Cursor и Grok Build — мануал бесполезен. Сначала
            выберите контур.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 12,
            }}
            className="grok-bot-compare-grid"
          >
            {PRODUCT_COMPARE.map((item) => (
              <article
                key={item.id}
                style={{
                  background: "var(--color-bg-primary)",
                  border: item.id === "grok-bot" ? `1px solid ${ACCENT}` : "1px solid var(--color-border)",
                  padding: 16,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: item.accent,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    marginBottom: 6,
                  }}
                >
                  {item.role}
                </div>
                <h3 style={{ margin: "0 0 8px", fontFamily: "var(--font-heading)", fontSize: 17 }}>
                  {item.name}
                </h3>
                <p style={{ margin: "0 0 8px", fontSize: 13, lineHeight: 1.55 }}>{item.does}</p>
                <p style={{ margin: "0 0 8px", fontSize: 13, lineHeight: 1.5, color: "var(--color-text-secondary)" }}>
                  {item.not}
                </p>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: item.accent }}>
                  Когда: {item.when}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section id="anatomiya" style={{ marginBottom: 48 }}>
          <p style={kicker}>Анатомия</p>
          <h2 style={sectionTitle}>Три поля — и закон не в чате</h2>
          <p style={{ margin: "0 0 16px", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
            Сообщение — текущая задача. Описание — правила, которые должны быть верны всегда.
          </p>
          <div style={{ display: "grid", gap: 10, marginBottom: 22 }}>
            {BOT_FIELDS.map((field) => (
              <article
                key={field.name}
                className="grok-bot-fields-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(88px, 120px) 1fr",
                  gap: 12,
                  background: "var(--color-bg-primary)",
                  border: "1px solid var(--color-border)",
                  padding: "14px 16px",
                }}
              >
                <strong style={{ color: ACCENT }}>{field.name}</strong>
                <div>
                  <p style={{ margin: "0 0 4px", fontSize: 14, lineHeight: 1.5 }}>{field.role}</p>
                  <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-secondary)" }}>
                    Пример: {field.example}
                  </p>
                </div>
              </article>
            ))}
          </div>
          <HowToWriteBlock />
        </section>

        <section id="lestnica" style={{ marginBottom: 48 }}>
          <p style={kicker}>Главный урок страницы</p>
          <h2 style={sectionTitle}>Задача → skill → routine → второй бот</h2>
          <p style={{ margin: "0 0 18px", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
            Официальная лестница xAI/Cursor совпадает с Loop на этом треке: сначала наблюдаемый
            результат, потом метод, потом автопилот.
          </p>
          <LadderInfographic />
          <ul
            style={{
              margin: "18px 0 0",
              padding: 0,
              listStyle: "none",
              display: "grid",
              gap: 8,
            }}
          >
            {TRUST_LADDER.map((step) => (
              <li
                key={step.n}
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-start",
                  background: "var(--color-bg-primary)",
                  border: "1px solid var(--color-border)",
                  padding: "12px 14px",
                }}
              >
                <CheckCircle2 size={18} color="#0f766e" style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: 14, lineHeight: 1.5 }}>
                  <strong>Готово, если:</strong> {step.done}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section id="skilly" style={{ marginBottom: 48 }}>
          <p style={kicker}>Skills, плагины, команды</p>
          <h2 style={sectionTitle}>Плагин ходит в сервис. Skill говорит, как работать</h2>
          <SkillPluginStrip />
          <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
            {SKILL_VS_PLUGIN.map((item) => (
              <article
                key={item.kind}
                style={{
                  background: "var(--color-bg-primary)",
                  border: "1px solid var(--color-border)",
                  padding: "14px 16px",
                }}
              >
                <strong style={{ display: "block", marginBottom: 6 }}>{item.kind}</strong>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: "var(--color-text-secondary)" }}>
                  {item.text}
                </p>
              </article>
            ))}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 10,
              marginTop: 16,
            }}
          >
            {SKILL_INVOKE.map((row) => (
              <div
                key={row.cmd}
                style={{
                  background: "var(--color-bg-primary)",
                  border: "1px solid var(--color-border)",
                  padding: "12px 14px",
                }}
              >
                <code
                  style={{
                    display: "inline-block",
                    padding: "2px 8px",
                    background: "var(--color-bg-secondary)",
                    fontWeight: 800,
                    fontSize: 13,
                    marginBottom: 8,
                  }}
                >
                  {row.cmd}
                </code>
                <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: "var(--color-text-secondary)" }}>
                  {row.meaning}
                </p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20 }}>
            <OuterInnerInfographic />
          </div>
        </section>

        <section id="bezopasnost" style={{ marginBottom: 48 }}>
          <p style={kicker}>Безопасность</p>
          <h2 style={sectionTitle}>Имя бота не делит сейф</h2>
          <SharedComputerInfographic />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 12,
              marginTop: 16,
            }}
          >
            {SAFETY_RULES.map((rule) => (
              <article
                key={rule.title}
                style={{
                  background: "var(--color-bg-primary)",
                  border: "1px solid var(--color-border)",
                  padding: 16,
                }}
              >
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                  <Shield size={18} color={ACCENT} aria-hidden />
                  <h3 style={{ margin: 0, fontSize: 15, fontFamily: "var(--font-heading)" }}>{rule.title}</h3>
                </div>
                <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: "var(--color-text-secondary)" }}>
                  {rule.text}
                </p>
              </article>
            ))}
          </div>

          <aside
            id="dostup"
            style={{
              marginTop: 20,
              padding: 18,
              background: "var(--color-bg-primary)",
              border: "1px solid var(--color-border)",
              borderLeft: "4px solid #64748b",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <KeyRound size={18} aria-hidden />
              <strong>Доступ из России — без серых схем</strong>
            </div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, lineHeight: 1.65, color: "var(--color-text-secondary)" }}>
              {ACCESS_NOTES.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </aside>
        </section>

        <section id="scenarii" style={{ marginBottom: 48 }}>
          <p style={kicker}>Русские сценарии</p>
          <h2 style={sectionTitle}>Четыре бота, которые имеют смысл</h2>
          <p style={{ margin: "0 0 16px", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
            Не Costco и не Facebook Marketplace. Контур вайбкодера: заявки, бриф в Cursor, черновик,
            дежурство по багу.
          </p>
          <div style={{ display: "grid", gap: 16 }}>
            {SCENARIOS.map((s) => (
              <article
                key={s.id}
                style={{
                  background: "var(--color-bg-primary)",
                  border: "1px solid var(--color-border)",
                  padding: 18,
                }}
              >
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 10 }}>
                  <div>
                    <h3 style={{ margin: "0 0 4px", fontFamily: "var(--font-heading)", fontSize: 18 }}>{s.title}</h3>
                    <p style={{ margin: 0, fontSize: 14, color: "var(--color-text-secondary)" }}>{s.job}</p>
                    <p style={{ margin: "6px 0 0", fontSize: 12, fontWeight: 700, color: ACCENT }}>{s.stack}</p>
                  </div>
                  <CopyTextButton text={s.firstPrompt} label="Копировать старт" />
                </div>
                <pre
                  style={{
                    margin: "14px 0 0",
                    padding: 14,
                    background: "var(--color-bg-secondary)",
                    border: "1px solid var(--color-border)",
                    fontSize: 13,
                    lineHeight: 1.5,
                    whiteSpace: "pre-wrap",
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                  }}
                >
                  {s.firstPrompt}
                </pre>
              </article>
            ))}
          </div>
        </section>

        <section id="before-after" style={{ marginBottom: 48 }}>
          <p style={kicker}>Наблюдаемый результат</p>
          <h2 style={sectionTitle}>До маршрута и после</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 12,
            }}
          >
            <article
              style={{
                background: "var(--color-bg-primary)",
                border: "1px solid var(--color-border)",
                padding: 18,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, color: "#dc2626" }}>
                <XCircle size={18} />
                <strong>{BEFORE_AFTER.before.title}</strong>
              </div>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, lineHeight: 1.65, color: "var(--color-text-secondary)" }}>
                {BEFORE_AFTER.before.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
            <article
              style={{
                background: "var(--color-bg-primary)",
                border: `1px solid ${ACCENT}`,
                padding: 18,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, color: "#0f766e" }}>
                <Sparkles size={18} />
                <strong>{BEFORE_AFTER.after.title}</strong>
              </div>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, lineHeight: 1.65, color: "var(--color-text-secondary)" }}>
                {BEFORE_AFTER.after.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section id="shablony" style={{ marginBottom: 48 }}>
          <p style={kicker}>Копируйте и вставляйте</p>
          <h2 style={sectionTitle}>Шесть шаблонов на русском</h2>
          <p style={{ margin: "0 0 16px", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
            Сначала устав и контракт задачи. Skill и routine — только после удачного ручного прогона.
          </p>
          <div style={{ display: "grid", gap: 16 }}>
            {TEMPLATES.map((tpl) => (
              <article
                key={tpl.id}
                style={{
                  background: "var(--color-bg-primary)",
                  border: "1px solid var(--color-border)",
                  borderLeft: `4px solid ${ACCENT}`,
                  padding: 18,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    gap: 12,
                    marginBottom: 10,
                  }}
                >
                  <div>
                    <h3 style={{ margin: "0 0 4px", fontFamily: "var(--font-heading)", fontSize: 17 }}>{tpl.title}</h3>
                    <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-secondary)" }}>{tpl.description}</p>
                  </div>
                  <CopyTextButton text={tpl.text} label="Копировать шаблон" />
                </div>
                <pre
                  style={{
                    margin: 0,
                    maxHeight: 240,
                    overflow: "auto",
                    padding: 14,
                    background: "var(--color-bg-secondary)",
                    border: "1px solid var(--color-border)",
                    fontSize: 12,
                    lineHeight: 1.5,
                    whiteSpace: "pre-wrap",
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                  }}
                >
                  {tpl.text}
                </pre>
              </article>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: 48 }}>
          <p style={kicker}>Связь с треком</p>
          <h2 style={sectionTitle}>Тот же Harness → Loop → Graph, только в продукте</h2>
          <div style={{ display: "grid", gap: 10 }}>
            {TRACK_MAP.map((item) => (
              <Link
                key={item.slug}
                href={item.href}
                style={{
                  display: "block",
                  textDecoration: "none",
                  color: "inherit",
                  background: "var(--color-bg-primary)",
                  border: "1px solid var(--color-border)",
                  padding: "16px 18px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
                  <div>
                    <strong style={{ color: ACCENT }}>{item.title}</strong>
                    <p style={{ margin: "6px 0 0", fontSize: 14, lineHeight: 1.55, color: "var(--color-text-secondary)" }}>
                      {item.grok}
                    </p>
                  </div>
                  <ArrowRight size={16} style={{ flexShrink: 0, marginTop: 4, color: ACCENT }} />
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 12,
            marginBottom: 40,
          }}
        >
          {RELATED_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                display: "block",
                textDecoration: "none",
                color: "inherit",
                background: "var(--color-bg-primary)",
                border: "1px solid var(--color-border)",
                padding: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, color: "#0f766e" }}>
                <Layers size={16} />
                <strong>{link.label}</strong>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-secondary)" }}>{link.note}</p>
            </Link>
          ))}
        </section>

        <section
          style={{
            background: "var(--color-bg-primary)",
            border: "1px solid var(--color-border)",
            padding: 18,
            marginBottom: 28,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <BookOpen size={18} aria-hidden />
            <strong>Официальные источники</strong>
          </div>
          <p style={{ margin: "0 0 10px", fontSize: 13, color: "var(--color-text-secondary)" }}>
            Интерфейс меняется. Перед опасным действием сверяйтесь с доками, не только с этой страницей.
          </p>
          <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8 }}>
            {OFFICIAL_DOCS.map((doc) => (
              <li key={doc.href}>
                <a
                  href={doc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: ACCENT, fontWeight: 600, textDecoration: "none" }}
                >
                  {doc.label} <ExternalLink size={12} />
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section
          style={{
            textAlign: "center",
            padding: "28px 20px",
            background: "var(--color-bg-primary)",
            border: "1px solid var(--color-border)",
          }}
        >
          <p style={{ margin: "0 0 16px", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
            Следующий шаг трека — каркас вокруг любой модели, не только Grok Bot.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
            <Link
              href="/agent-engineering/harness"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 24px",
                background: ACCENT,
                color: "#fff",
                textDecoration: "none",
                fontWeight: 700,
                minHeight: 52,
              }}
            >
              Модуль Harness <ArrowRight size={16} />
            </Link>
            <Link
              href="/ai-skills"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 24px",
                background: "var(--color-bg-secondary)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text-primary)",
                textDecoration: "none",
                fontWeight: 700,
                minHeight: 52,
              }}
            >
              AI Skills
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

function HowToWriteBlock() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      {HOW_TO_WRITE.map((rule) => (
        <article
          key={rule.title}
          style={{
            background: "var(--color-bg-primary)",
            border: "1px solid var(--color-border)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "12px 16px",
              borderBottom: "1px solid var(--color-border)",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              gap: 8,
              alignItems: "center",
            }}
          >
            <strong style={{ fontFamily: "var(--font-heading)", fontSize: 16 }}>{rule.title}</strong>
            <CopyTextButton text={rule.good} label="Копировать хороший" variant="ghost" />
          </div>
          <div
            className="grok-bot-howto-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            }}
          >
            <div className="grok-bot-howto-bad" style={{ padding: 16, borderRight: "1px solid var(--color-border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#dc2626", marginBottom: 8, fontWeight: 800, fontSize: 12, letterSpacing: "0.04em" }}>
                <XCircle size={14} /> ПЛОХО
              </div>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, whiteSpace: "pre-wrap" }}>{rule.bad}</p>
            </div>
            <div style={{ padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#0f766e", marginBottom: 8, fontWeight: 800, fontSize: 12, letterSpacing: "0.04em" }}>
                <CheckCircle2 size={14} /> ХОРОШО
              </div>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, whiteSpace: "pre-wrap" }}>{rule.good}</p>
            </div>
          </div>
          <p
            style={{
              margin: 0,
              padding: "10px 16px",
              fontSize: 13,
              background: "var(--color-bg-secondary)",
              color: "var(--color-text-secondary)",
              lineHeight: 1.5,
            }}
          >
            Почему: {rule.why}
          </p>
        </article>
      ))}
    </div>
  );
}
