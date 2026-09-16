import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Boxes,
  Check,
  Clock3,
  FileCheck2,
  Route,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import { guidedGrokBotCursorSolution, GROK_CURSOR_HOW_TO_WRITE } from "../grok-bot-cursor-guided-data";
import ArsenalBridgePanel from "@/components/arsenal/arsenal-bridge-panel";
import PlatipomiruCallout from "@/components/resheniya/platipomiru-callout";
import { OuterInnerInfographic } from "@/components/agent-engineering/grok-bot-infographics";
import CopyTextButton from "@/components/agent-engineering/copy-text-button";
import { TEMPLATES } from "@/lib/agent-engineering/grok-bot-data";

export const metadata: Metadata = {
  title: "Собрать контур Grok Bot → Cursor — готовое AI-решение",
  description:
    "Маршрут вайбкодера на ProektMap: внешний Grok Bot собирает бриф, внутренний Cursor пишет код. Устав, skill, стоп на PR — без серых схем доступа.",
  alternates: { canonical: "https://proektmap.ru/resheniya/grok-bot-cursor" },
};

const launchArtifacts = guidedGrokBotCursorSolution.steps.map((step) => step.artifact);

export default function GrokBotCursorSolutionPage() {
  const s = guidedGrokBotCursorSolution;
  const contextSlugs = ["split-loops", "charter", "handoff"];
  const contextSteps = contextSlugs
    .map((slug) => s.steps.find((step) => step.slug === slug))
    .filter((step): step is (typeof s.steps)[number] => Boolean(step));

  return (
    <div className="solutions-page">
      <main className="solutions-shell solution-detail">
        <nav className="solution-breadcrumb" aria-label="Навигация">
          <Link href="/resheniya">
            <ArrowLeft size={15} /> Все решения
          </Link>
          <span>/</span>
          <span>Grok Bot → Cursor</span>
        </nav>

        <div style={{ marginBottom: 20 }}>
          <PlatipomiruCallout compact />
        </div>

        <section className="solution-detail-hero">
          <div className="solution-detail-copy">
            <div className="solutions-eyebrow">
              <Sparkles size={16} /> Готовый инженерный маршрут · два контура
            </div>
            <h1>Собрать контур Grok Bot → Cursor</h1>
            <p>
              {s.subtitle}. Стек уже выбран: внешний продюсер готовит бриф, внутренний агент меняет
              репозиторий. Автопилот — только после ручного прогона.
            </p>
            <div className="solution-detail-meta">
              <span>
                <Route size={16} /> {s.steps.length} готовых шагов
              </span>
              <span>
                <Clock3 size={16} /> {s.duration}
              </span>
              <span>
                <ShieldCheck size={16} /> PR без вашего ОК не уходит
              </span>
            </div>
            <div className="solutions-hero-actions">
              <Link
                href="/resheniya/grok-bot-cursor/workspace"
                className="solutions-button solutions-button-primary"
              >
                Начать маршрут <ArrowRight size={18} />
              </Link>
              <a href="#route" className="solutions-button solutions-button-secondary">
                Посмотреть этапы
              </a>
              <Link href="/agent-engineering/grok-bot" className="solutions-button solutions-button-secondary">
                Мануал Grok Bot
              </Link>
            </div>
          </div>

          <aside className="solution-result-contract">
            <div className="solution-result-icon">
              <Route size={24} />
            </div>
            <span>Контракт результата</span>
            <h2>Что будет готово на финише</h2>
            <p>{s.result}</p>
            <div className="solution-result-checks">
              {[
                "Grok Bot-продюсер с уставом",
                "Skill «Бриф для Cursor»",
                "Один успешный handoff в Cursor",
                "PR и письма — только после вашего ОК",
              ].map((item) => (
                <div key={item}>
                  <Check size={16} /> {item}
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section className="solution-route-section" aria-labelledby="loops-title">
          <div className="solutions-section-heading">
            <div>
              <span className="solutions-kicker">Как устроен контур</span>
              <h2 id="loops-title">Снаружи бриф, внутри код</h2>
            </div>
            <p>Один агент не читает Slack и сразу не пушит в репозиторий. Сначала чистый заказ.</p>
          </div>
          <OuterInnerInfographic />
        </section>

        <section
          style={{
            margin: "0 0 28px",
            padding: "16px 18px",
            border: "1px solid rgba(234,88,12,0.35)",
            background: "rgba(234,88,12,0.06)",
          }}
          aria-label="Доступ и безопасность"
        >
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <ShieldCheck size={22} color="#ea580c" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <strong style={{ display: "block", marginBottom: 6 }}>Без серых схем и без автопилота в прод</strong>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: "var(--color-text-secondary)" }}>
                Grok Bot ищем в оплаченном Cursor, не на grok.com. Нет в аккаунте — честная остановка. Все боты
                аккаунта делят один компьютер: имя не сейф. Письма, покупки, PR — только approve.
              </p>
            </div>
          </div>
        </section>

        <section className="solution-route-section" aria-labelledby="contrast-title">
          <div className="solutions-section-heading">
            <div>
              <span className="solutions-kicker">Как писать боту</span>
              <h2 id="contrast-title">Плохо → хорошо</h2>
            </div>
            <p>Один пример — одна идея. Хороший текст можно сразу вставить в описание бота.</p>
          </div>
          <div style={{ display: "grid", gap: 12 }}>
            {GROK_CURSOR_HOW_TO_WRITE.map((rule) => (
              <article
                key={rule.title}
                style={{
                  background: "var(--color-bg-primary)",
                  border: "1px solid var(--color-border)",
                  padding: 16,
                }}
              >
                <strong style={{ display: "block", marginBottom: 8 }}>{rule.title}</strong>
                <p style={{ margin: "0 0 8px", fontSize: 13, color: "#dc2626", lineHeight: 1.5 }}>
                  Плохо: {rule.bad}
                </p>
                <p style={{ margin: "0 0 10px", fontSize: 13, color: "#0f766e", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
                  Хорошо: {rule.good}
                </p>
                <p style={{ margin: "0 0 12px", fontSize: 13, color: "var(--color-text-secondary)" }}>Почему: {rule.why}</p>
                <CopyTextButton text={rule.good} label="Копировать хороший вариант" />
              </article>
            ))}
          </div>
          {TEMPLATES.filter((t) => t.id === "outer-loop").map((tpl) => (
            <article
              key={tpl.id}
              style={{
                marginTop: 12,
                background: "var(--color-bg-primary)",
                border: "1px solid rgba(234,88,12,0.35)",
                padding: 16,
              }}
            >
              <strong style={{ display: "block", marginBottom: 6 }}>{tpl.title}</strong>
              <p style={{ margin: "0 0 10px", fontSize: 13, color: "var(--color-text-secondary)" }}>{tpl.description}</p>
              <pre
                style={{
                  margin: "0 0 12px",
                  whiteSpace: "pre-wrap",
                  fontSize: 13,
                  lineHeight: 1.5,
                  fontFamily: "var(--font-body)",
                }}
              >
                {tpl.text}
              </pre>
              <CopyTextButton text={tpl.text} label="Копировать промпт передачи в Cursor" />
            </article>
          ))}
          <p style={{ margin: "12px 0 0", fontSize: 14 }}>
            Остальные шаблоны — в{" "}
            <Link href="/agent-engineering/grok-bot#shablony" style={{ color: "#ea580c", fontWeight: 700 }}>
              мануале Grok Bot
            </Link>
            .
          </p>
        </section>

        <section className="solution-route-section" id="route" aria-labelledby="grok-route-title">
          <div className="solutions-section-heading">
            <div>
              <span className="solutions-kicker">Карта выполнения</span>
              <h2 id="grok-route-title">От двух контуров до первого handoff</h2>
            </div>
            <p>Каждый шаг: рекомендация, готовый промпт, наблюдаемая проверка.</p>
          </div>

          <div className="solution-route">
            {s.steps.map((phase, index) => (
              <article className="solution-route-card" key={phase.slug}>
                <div className="solution-route-marker">
                  <span>{index + 1}</span>
                  {index < s.steps.length - 1 && <i aria-hidden />}
                </div>
                <div className="solution-route-content">
                  <div className="solution-route-topline">
                    <span>Шаг {index + 1}</span>
                    <span>
                      <Clock3 size={14} /> {phase.duration}
                    </span>
                  </div>
                  <h3>{phase.title}</h3>
                  <p>{phase.explanation}</p>
                  <div className="solution-route-outcome">
                    <Target size={17} />
                    <div>
                      <span>Результат</span>
                      <strong>{phase.goal}</strong>
                    </div>
                  </div>
                  <div className="solution-route-artifact">
                    <FileCheck2 size={16} /> {phase.artifact}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <ArsenalBridgePanel solutionSlug="grok-bot-cursor" />

        <section className="solution-pack-section" aria-labelledby="grok-pack-title">
          <div className="solution-pack-copy">
            <span className="solutions-kicker">Готовый технический путь</span>
            <h2 id="grok-pack-title">Стек уже выбран</h2>
            <p>
              Пользователь не проектирует оркестрацию агентов. Основной путь: Grok Bot готовит бриф, Cursor
              меняет код, человек ставит стоп.
            </p>
            <ul style={{ margin: "12px 0 0", paddingLeft: 18, lineHeight: 1.55, fontSize: 14 }}>
              {s.defaultStack.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="solution-pack-grid">
            {launchArtifacts.map((item, index) => (
              <div key={`${item}-${index}`}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <Boxes size={18} />
                <strong>{item}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="solution-context-section" aria-labelledby="grok-context-title">
          <div className="solutions-section-heading">
            <div>
              <span className="solutions-kicker">Экосистема по шагам</span>
              <h2 id="grok-context-title">Мануал и трек внутри маршрута</h2>
            </div>
          </div>
          <div className="solution-context-groups">
            {contextSteps.map((phase) => (
              <article className="solution-context-group" key={phase.slug}>
                <span>Шаг {s.steps.indexOf(phase) + 1}</span>
                <h3>{phase.title}</h3>
                <p>{phase.goal}</p>
                <div>
                  {phase.references.map((resource) => (
                    <Link href={resource.href} key={`${resource.kind}-${resource.href}`}>
                      {resource.label} <ArrowRight size={14} />
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="solution-final-cta">
          <div>
            <span className="solutions-kicker">Первый рабочий контур</span>
            <h2>Соберите продюсера и отдайте заказ Cursor</h2>
            <p>
              Следующий шаг открывается после понятного результата. Не начинайте с флота ботов и расписания.
            </p>
          </div>
          <Link
            href="/resheniya/grok-bot-cursor/workspace"
            className="solutions-button solutions-button-primary"
          >
            Открыть рабочую зону <ArrowRight size={18} />
          </Link>
        </section>
      </main>
    </div>
  );
}
