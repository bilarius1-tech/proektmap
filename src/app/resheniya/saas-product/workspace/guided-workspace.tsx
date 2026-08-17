"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  Clipboard,
  Clock3,
  Code2,
  Copy,
  ExternalLink,
  Lightbulb,
  Lock,
  Map as MapIcon,
  Monitor,
  RotateCcw,
  Sparkles,
  Target,
  Terminal,
} from "lucide-react";
import Term from "@/components/glossary/tooltip-term";
import { guidedSaasSolution, type GuidedSolution } from "../../guided-data";

type ModelItem = {
  id: string;
  name: string;
  provider: string;
  code: number;
  intel: number;
  priceP: number;
  reason: boolean;
};

function RichText({ text, terms }: { text: string; terms: string[] }) {
  const ordered = [...terms].sort((a, b) => b.length - a.length);
  if (ordered.length === 0) return <>{text}</>;
  const escaped = ordered.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const parts = text.split(new RegExp(`(${escaped.join("|")})`, "gi"));
  const lookup = new Map(ordered.map((term) => [term.toLowerCase(), term]));

  return (
    <>
      {parts.map((part, index) => {
        const term = lookup.get(part.toLowerCase());
        return term ? <Term term={term} key={`${part}-${index}`} /> : <span key={`${part}-${index}`}>{part}</span>;
      })}
    </>
  );
}

function CurrentModelRecommendations() {
  const [models, setModels] = useState<ModelItem[]>([]);

  useEffect(() => {
    fetch("/api/models")
      .then((response) => response.json())
      .then((data) => setModels(Array.isArray(data.models) ? data.models : []))
      .catch(() => setModels([]));
  }, []);

  const recommendations = useMemo(() => {
    if (models.length === 0) return [];
    const coding = [...models].sort((a, b) => b.code - a.code)[0];
    const reasoning = [...models]
      .filter((model) => model.reason && model.id !== coding?.id)
      .sort((a, b) => b.intel - a.intel)[0];
    const economy = [...models]
      .filter((model) => model.priceP > 0 && model.id !== coding?.id && model.id !== reasoning?.id)
      .sort((a, b) => a.priceP - b.priceP || b.code - a.code)[0];
    return [
      { role: "Основная для кода", model: coding, metric: coding ? `Код ${coding.code.toFixed(1)}` : "" },
      { role: "Архитектор и проверяющий", model: reasoning, metric: reasoning ? `Интеллект ${reasoning.intel.toFixed(1)}` : "" },
      { role: "Быстрая для простых задач", model: economy, metric: economy ? `$${economy.priceP.toFixed(2)} / 1M` : "" },
    ].filter((item) => item.model);
  }, [models]);

  if (recommendations.length === 0) {
    return (
      <div className="guided-model-loading">
        <RotateCcw size={16} /> Актуальные модели загружаются из рейтинга ProektMap…
      </div>
    );
  }

  return (
    <div className="guided-model-grid">
      {recommendations.map(({ role, model, metric }) => (
        <Link href={`/models?search=${encodeURIComponent(model!.name)}`} key={role}>
          <span>{role}</span>
          <strong>{model!.name}</strong>
          <small>{model!.provider} · {metric}</small>
          <ExternalLink size={14} />
        </Link>
      ))}
    </div>
  );
}

type GuidedWorkspaceProps = {
  solution?: GuidedSolution;
  overviewHref?: string;
  storageKey?: string;
  finalCta?: string;
};

export default function GuidedWorkspace({
  solution = guidedSaasSolution,
  overviewHref = "/resheniya/saas-product",
  storageKey = "proektmap:resheniya:saas-guided:v1",
  finalCta = "SaaS запущен — завершить маршрут",
}: GuidedWorkspaceProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [copiedKey, setCopiedKey] = useState("");
  const [hydrated, setHydrated] = useState(false);

  const step = solution.steps[activeIndex];
  const progress = Math.round((completed.size / solution.steps.length) * 100);
  const nextIncomplete = solution.steps.findIndex((_, index) => !completed.has(index));

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        const savedCompleted = Array.isArray(parsed.completed) ? parsed.completed : [];
        setCompleted(new Set(savedCompleted));
        const next = solution.steps.findIndex((_, index) => !savedCompleted.includes(index));
        setActiveIndex(next === -1 ? solution.steps.length - 1 : next);
      }
    } catch {
      window.localStorage.removeItem(storageKey);
    } finally {
      setHydrated(true);
    }
  }, [solution, storageKey]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(storageKey, JSON.stringify({ completed: [...completed] }));
  }, [completed, hydrated, storageKey]);

  async function copyText(value: string, key: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey(""), 1600);
    } catch {
      setCopiedKey("");
    }
  }

  function openStep(index: number) {
    const firstOpen = nextIncomplete === -1 ? solution.steps.length - 1 : nextIncomplete;
    if (index > firstOpen && !completed.has(index)) return;
    setActiveIndex(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function completeStep() {
    setCompleted((previous) => new Set([...previous, activeIndex]));
    if (activeIndex < solution.steps.length - 1) {
      setActiveIndex(activeIndex + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <div className="guided-workspace">
      <header className="guided-topbar">
        <div className="guided-topbar-main">
          <Link href={overviewHref}><ArrowLeft size={17} /> Обзор решения</Link>
          <div>
            <Monitor size={20} />
            <span><strong>{solution.title}</strong><small>{solution.subtitle}</small></span>
          </div>
        </div>
        <div className="guided-progress">
          <div><span style={{ width: `${progress}%` }} /></div>
          <strong>{progress}%</strong>
          <small>{completed.size} из {solution.steps.length} шагов</small>
        </div>
      </header>

      <div className="guided-note">
        <Sparkles size={17} />
        <span><strong>Маршрут уже спроектирован.</strong> Выполняйте инструкции по порядку — выбирать стек и писать техническое задание не нужно.</span>
      </div>

      <div className="guided-layout">
        <aside className="guided-sidebar">
          <div className="guided-sidebar-heading"><MapIcon size={17} /> {solution.title}</div>
          <div className="guided-step-list">
            {solution.steps.map((item, index) => {
              const done = completed.has(index);
              const current = activeIndex === index;
              const firstOpen = nextIncomplete === -1 ? solution.steps.length - 1 : nextIncomplete;
              const locked = index > firstOpen && !done;
              return (
                <button
                  type="button"
                  key={item.slug}
                  disabled={locked}
                  onClick={() => openStep(index)}
                  className={`${current ? "is-active" : ""} ${done ? "is-done" : ""}`}
                >
                  <span>{done ? <Check size={14} /> : locked ? <Lock size={12} /> : String(index + 1).padStart(2, "0")}</span>
                  <strong>{item.shortTitle}</strong>
                  {current && <ChevronRight size={15} />}
                </button>
              );
            })}
          </div>
          <div className="guided-stack-summary">
            <span>Готовый стек</span>
            <p>{solution.defaultStack.join(" · ")}</p>
          </div>
        </aside>

        <main className="guided-main">
          <section className="guided-step-header">
            <div>
              <span>Шаг {String(activeIndex + 1).padStart(2, "0")} из {solution.steps.length}</span>
              <span><Clock3 size={14} /> {step.duration}</span>
            </div>
            <h1>{step.title}</h1>
            <p><RichText text={step.goal} terms={step.terms} /></p>
          </section>

          <section className="guided-recommendation">
            <div className="guided-section-icon"><Lightbulb size={20} /></div>
            <div>
              <span>ProektMap рекомендует</span>
              <h2>{step.recommendation.title}</h2>
              <p><RichText text={step.recommendation.why} terms={step.terms} /></p>
              {step.recommendation.link && (
                <Link href={step.recommendation.link.href}>
                  {step.recommendation.link.label} <ExternalLink size={14} />
                </Link>
              )}
            </div>
          </section>

          <section className="guided-explanation">
            <div className="guided-section-title"><BookOpen size={18} /><h2>Что сейчас делаем</h2></div>
            <p><RichText text={step.explanation} terms={step.terms} /></p>
          </section>

          {step.slug === "models" && (
            <section className="guided-models">
              <div className="guided-section-title"><Target size={18} /><h2>Актуальная рекомендация моделей</h2></div>
              <CurrentModelRecommendations />
              <small>Рекомендации рассчитываются из текущего рейтинга `/models`, поэтому не привязаны навсегда к одному названию.</small>
            </section>
          )}

          <section className="guided-actions">
            <div className="guided-section-title"><Terminal size={18} /><h2>Что сделать</h2></div>
            <div className="guided-instruction-list">
              {step.instructions.map((instruction, index) => (
                <article key={instruction.title}>
                  <span>{index + 1}</span>
                  <div>
                    <h3>{instruction.title}</h3>
                    <p><RichText text={instruction.text} terms={step.terms} /></p>
                    {instruction.command && (
                      <div className="guided-code">
                        <code>{instruction.command}</code>
                        <button type="button" onClick={() => copyText(instruction.command!, `${step.slug}-command-${index}`)}>
                          {copiedKey === `${step.slug}-command-${index}` ? <Check size={15} /> : <Copy size={15} />}
                          {copiedKey === `${step.slug}-command-${index}` ? "Скопировано" : "Копировать"}
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>

          {step.prompt && (
            <section className="guided-prompt">
              <div className="guided-prompt-heading">
                <div><Code2 size={18} /><span>Готовый промпт</span><h2>{step.prompt.title}</h2></div>
                <button type="button" onClick={() => copyText(step.prompt!.body, `${step.slug}-prompt`)}>
                  {copiedKey === `${step.slug}-prompt` ? <Check size={16} /> : <Copy size={16} />}
                  {copiedKey === `${step.slug}-prompt` ? "Скопировано" : "Скопировать промпт"}
                </button>
              </div>
              <pre>{step.prompt.body}</pre>
            </section>
          )}

          <section className="guided-success">
            <div className="guided-section-title"><CheckCircle2 size={19} /><h2>Как понять, что всё получилось</h2></div>
            <div className="guided-success-list">
              {step.success.map((item) => <div key={item}><Check size={15} /><span>{item}</span></div>)}
            </div>
            <div className="guided-artifact"><Clipboard size={17} /><span>Результат шага</span><strong>{step.artifact}</strong></div>
          </section>

          <section className="guided-ecosystem">
            <div className="guided-section-title"><BookOpen size={18} /><h2>Внутри экосистемы ProektMap</h2></div>
            <div>
              {step.references.map((reference) => (
                <Link href={reference.href} key={`${reference.kind}-${reference.label}`}>
                  <span>{reference.kind}</span>
                  <strong>{reference.label}</strong>
                  <small>{reference.description}</small>
                  <ExternalLink size={14} />
                </Link>
              ))}
            </div>
          </section>

          <button type="button" className="guided-complete" onClick={completeStep}>
            <CheckCircle2 size={19} />
            {activeIndex === solution.steps.length - 1 ? finalCta : "Всё получилось — следующий шаг"}
            <ArrowRight size={18} />
          </button>
        </main>
      </div>
    </div>
  );
}
