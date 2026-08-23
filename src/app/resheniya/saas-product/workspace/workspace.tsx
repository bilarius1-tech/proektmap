"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  Clipboard,
  Clock3,
  Copy,
  ExternalLink,
  FileCheck2,
  Lightbulb,
  Lock,
  Map,
  Play,
  Route,
  Sparkles,
  Target,
  TriangleAlert,
} from "lucide-react";
import { saasSolution } from "../../data";
import type { ReadySolution, SolutionPhase } from "../../data";

type WorkspaceTab = "understand" | "choose" | "action" | "verify";
type ArtifactEvidence = { summary: string; reference: string };
type BlockerState = "unset" | "none" | "blocked";

const EMPTY_ARTIFACT: ArtifactEvidence = { summary: "", reference: "" };

type SolutionWorkspaceProps = {
  solution?: ReadySolution;
  phases?: SolutionPhase[];
  overviewHref?: string;
  projectLabel?: string;
  storageKey?: string;
};

function isValidReference(value: string) {
  const reference = value.trim();
  return (
    /^https?:\/\/\S+$/i.test(reference) ||
    /^(?:docs|src|artifacts|public)\/[\w./-]+\.(?:md|pdf|png|jpe?g|fig|json|zip)$/i.test(reference) ||
    /^[\w./-]+\.(?:md|pdf|png|jpe?g|fig|json|zip)$/i.test(reference)
  );
}

const tabs: Array<{ id: WorkspaceTab; label: string; icon: typeof Target }> = [
  { id: "understand", label: "Понять", icon: Lightbulb },
  { id: "choose", label: "Решить", icon: Target },
  { id: "action", label: "Сделать", icon: Play },
  { id: "verify", label: "Проверить", icon: CheckCircle2 },
];

export default function SolutionWorkspace({
  solution = saasSolution,
  phases = solution.phases,
  overviewHref = "/resheniya/saas-product",
  projectLabel = "мой первый SaaS",
  storageKey = "proektmap:resheniya:saas-product:v2",
}: SolutionWorkspaceProps = {}) {
  const [activePhase, setActivePhase] = useState(0);
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("understand");
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [choices, setChoices] = useState<Record<number, string>>({});
  const [choiceReasons, setChoiceReasons] = useState<Record<number, string>>({});
  const [artifacts, setArtifacts] = useState<Record<number, ArtifactEvidence>>({});
  const [checks, setChecks] = useState<Record<number, boolean[]>>({});
  const [checkEvidence, setCheckEvidence] = useState<Record<number, string[]>>({});
  const [blockerStates, setBlockerStates] = useState<Record<number, BlockerState>>({});
  const [blockerNotes, setBlockerNotes] = useState<Record<number, string>>({});
  const [copied, setCopied] = useState(false);
  const [notice, setNotice] = useState("");
  const [hydrated, setHydrated] = useState(false);

  const phase = phases[activePhase];
  const nextPhaseIndex = useMemo(() => {
    const next = phases.findIndex((_, index) => !completed.has(index));
    return next === -1 ? phases.length - 1 : next;
  }, [completed, phases]);
  const progress = Math.round((completed.size / phases.length) * 100);
  const currentChecks = checks[activePhase] || phase.checks.map(() => false);
  const currentCheckEvidence = checkEvidence[activePhase] || phase.checks.map(() => "");
  const currentArtifact = artifacts[activePhase] || EMPTY_ARTIFACT;
  const artifactReady =
    currentArtifact.summary.trim().length >= 30 &&
    isValidReference(currentArtifact.reference);
  const checksReady =
    currentChecks.every(Boolean) &&
    currentCheckEvidence.every((evidence) => evidence.trim().length >= 20);
  const blockerReady = blockerStates[activePhase] === "none";
  const canComplete =
    Boolean(choices[activePhase]) &&
    (choiceReasons[activePhase]?.trim().length || 0) >= 20 &&
    artifactReady &&
    checksReady &&
    blockerReady;

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        const state = JSON.parse(saved);
        const savedCompleted = Array.isArray(state.completed) ? state.completed : [];
        setCompleted(new Set(savedCompleted));
        const nextIncomplete = phases.findIndex((_, index) => !savedCompleted.includes(index));
        setActivePhase(nextIncomplete === -1 ? phases.length - 1 : nextIncomplete);
        setChoices(state.choices || {});
        setChoiceReasons(state.choiceReasons || {});
        setArtifacts(state.artifacts || {});
        setChecks(state.checks || {});
        setCheckEvidence(state.checkEvidence || {});
        setBlockerStates(state.blockerStates || {});
        setBlockerNotes(state.blockerNotes || {});
      }
    } catch {
      window.localStorage.removeItem(storageKey);
    } finally {
      setHydrated(true);
    }
  }, [phases, storageKey]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(storageKey, JSON.stringify({
      completed: [...completed],
      choices,
      choiceReasons,
      artifacts,
      checks,
      checkEvidence,
      blockerStates,
      blockerNotes,
    }));
  }, [hydrated, completed, choices, choiceReasons, artifacts, checks, checkEvidence, blockerStates, blockerNotes, storageKey]);

  function openPhase(index: number) {
    if (index > nextPhaseIndex && !completed.has(index)) return;
    setActivePhase(index);
    setActiveTab("understand");
    setNotice("");
  }

  function toggleCheck(index: number) {
    setChecks((previous) => {
      const next = [...(previous[activePhase] || phase.checks.map(() => false))];
      next[index] = !next[index];
      return { ...previous, [activePhase]: next };
    });
  }

  function updateArtifact(field: keyof ArtifactEvidence, value: string) {
    setArtifacts((previous) => ({
      ...previous,
      [activePhase]: { ...(previous[activePhase] || EMPTY_ARTIFACT), [field]: value },
    }));
  }

  function updateCheckEvidence(index: number, value: string) {
    setCheckEvidence((previous) => {
      const next = [...(previous[activePhase] || phase.checks.map(() => ""))];
      next[index] = value;
      return { ...previous, [activePhase]: next };
    });
  }

  function completePhase() {
    if (!canComplete) return;
    const nextCompleted = new Set(completed);
    nextCompleted.add(activePhase);
    setCompleted(nextCompleted);
    setNotice(`Этап «${phase.shortTitle}» проверен. Следующая миссия открыта.`);
    if (activePhase < phases.length - 1) {
      setTimeout(() => {
        setActivePhase(activePhase + 1);
        setActiveTab("understand");
      }, 650);
    }
  }

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(phase.action.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setNotice("Не удалось скопировать автоматически. Выделите текст промпта вручную.");
    }
  }

  return (
    <div className="solution-workspace">
      <header className="solution-workspace-header">
        <div>
          <Link href={overviewHref} className="solution-workspace-back">
            <ArrowLeft size={16} /> Обзор решения
          </Link>
          <div className="solution-workspace-title">
            <Route size={21} />
            <div>
              <strong>{solution.title}</strong>
              <span>Проект: {projectLabel}</span>
            </div>
          </div>
        </div>
        <div className="solution-workspace-progress">
          <div><span>Прогресс продукта</span><strong>{progress}%</strong></div>
          <div className="solution-workspace-progress-track"><i style={{ width: `${progress}%` }} /></div>
          <small>{completed.size} из {phases.length} результатов проверено</small>
        </div>
      </header>

      <div className="solution-prototype-note">
        <Sparkles size={16} />
        <span><strong>UX-прототип.</strong> Решения и доказательства сохраняются на этом устройстве. Серверное хранение подключим вместе с новой моделью данных.</span>
      </div>

      <div className="solution-workspace-layout">
        <aside className="solution-route-sidebar">
          <div className="solution-sidebar-heading"><Map size={17} /> Маршрут запуска</div>
          <div className="solution-sidebar-list">
            {phases.map((item, index) => {
              const isDone = completed.has(index);
              const isActive = activePhase === index;
              const isLocked = index > nextPhaseIndex && !isDone;
              return (
                <button
                  type="button"
                  key={item.slug}
                  onClick={() => openPhase(index)}
                  disabled={isLocked}
                  className={`solution-sidebar-stage ${isActive ? "is-active" : ""} ${isDone ? "is-done" : ""}`}
                >
                  <span className="solution-sidebar-state">
                    {isDone ? <Check size={15} /> : isLocked ? <Lock size={13} /> : index + 1}
                  </span>
                  <span>
                    <strong>{item.shortTitle}</strong>
                    <small>{isDone ? "Проверено" : isActive ? "Текущая миссия" : isLocked ? "Закрыто" : "Доступно"}</small>
                  </span>
                </button>
              );
            })}
          </div>
          <Link href="/resheniya" className="solution-sidebar-catalog">Все готовые решения <ArrowRight size={15} /></Link>
        </aside>

        <main className="solution-mission">
          {notice && <div className="solution-success-notice"><CheckCircle2 size={18} /> {notice}</div>}

          <section className="solution-mission-heading">
            <div className="solution-mission-kicker">
              Этап {activePhase + 1} из {phases.length}
              <span><Clock3 size={14} /> {phase.time}</span>
            </div>
            <h1>{phase.title}</h1>
            <p>{phase.description}</p>
            <div className="solution-mission-outcome">
              <Target size={20} />
              <div><span>Проверяемый результат</span><strong>{phase.outcome}</strong></div>
            </div>
          </section>

          <div className="solution-mission-tabs" role="tablist" aria-label="Шаги текущей миссии">
            {tabs.map(({ id, label, icon: Icon }, index) => (
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === id}
                aria-controls={`solution-panel-${id}`}
                id={`solution-tab-${id}`}
                className={activeTab === id ? "is-active" : ""}
                onClick={() => setActiveTab(id)}
                key={id}
              >
                <span>{index + 1}</span><Icon size={16} /> {label}
              </button>
            ))}
          </div>

          <section
            className="solution-mission-panel"
            role="tabpanel"
            id={`solution-panel-${activeTab}`}
            aria-labelledby={`solution-tab-${activeTab}`}
          >
            {activeTab === "understand" && (
              <div className="solution-panel-stack">
                <div className="solution-panel-heading">
                  <span>Зачем этот этап</span>
                  <h2>Сначала договоримся, что должно измениться</h2>
                  <p>{phase.description}</p>
                </div>
                <div className="solution-understand-grid">
                  <div>
                    <Target size={20} />
                    <span>После этапа</span>
                    <strong>{phase.outcome}</strong>
                  </div>
                  <div>
                    <FileCheck2 size={20} />
                    <span>Артефакт</span>
                    <strong>{phase.artifact}</strong>
                  </div>
                </div>
                <div className="solution-context-resources">
                  <div className="solution-subheading"><BookOpen size={17} /> Полезно именно сейчас</div>
                  <div>
                    {phase.resources.map((resource) => (
                      <Link href={resource.href} key={resource.href}>
                        <span>{resource.kind}</span>
                        <strong>{resource.label}</strong>
                        <ExternalLink size={14} />
                      </Link>
                    ))}
                  </div>
                </div>
                <button className="solutions-button solutions-button-primary solution-next-button" onClick={() => setActiveTab("choose")}>
                  Перейти к решению <ArrowRight size={17} />
                </button>
              </div>
            )}

            {activeTab === "choose" && (
              <div className="solution-panel-stack">
                <div className="solution-panel-heading">
                  <span>Точка решения</span>
                  <h2>{phase.decision.question}</h2>
                  <p>Выбор попадёт в паспорт проекта и будет учитываться на следующих этапах.</p>
                </div>
                <div className="solution-choice-list">
                  {phase.decision.options.map((option) => (
                    <button
                      type="button"
                      key={option}
                      aria-pressed={choices[activePhase] === option}
                      className={choices[activePhase] === option ? "is-selected" : ""}
                      onClick={() => setChoices((previous) => ({ ...previous, [activePhase]: option }))}
                    >
                      <span>{choices[activePhase] === option ? <Check size={16} /> : ""}</span>
                      <strong>{option}</strong>
                    </button>
                  ))}
                </div>
                <label className="solution-decision-reason">
                  <span>Почему этот вариант подходит проекту</span>
                  <textarea
                    value={choiceReasons[activePhase] || ""}
                    onChange={(event) => setChoiceReasons((previous) => ({ ...previous, [activePhase]: event.target.value }))}
                    placeholder="Зафиксируйте причину и главное ограничение выбора…"
                  />
                  <small>Не меньше 20 символов — обоснование попадёт в паспорт проекта.</small>
                </label>
                <button
                  className="solutions-button solutions-button-primary solution-next-button"
                  disabled={!choices[activePhase] || (choiceReasons[activePhase]?.trim().length || 0) < 20}
                  onClick={() => setActiveTab("action")}
                >
                  Зафиксировать и сделать <ArrowRight size={17} />
                </button>
              </div>
            )}

            {activeTab === "action" && (
              <div className="solution-panel-stack">
                <div className="solution-panel-heading">
                  <span>Практическое действие</span>
                  <h2>{phase.action.title}</h2>
                  <p>Выполните шаги и сохраните ссылку, файл или краткое описание результата.</p>
                </div>
                <ol className="solution-action-list">
                  {phase.action.steps.map((step) => <li key={step}>{step}</li>)}
                </ol>
                <div className="solution-prompt-box">
                  <div><span>Промпт для AI-агента</span><button type="button" onClick={copyPrompt}><Copy size={15} /> {copied ? "Скопировано" : "Копировать"}</button></div>
                  <p>{phase.action.prompt}</p>
                </div>
                <div className="solution-artifact-proof">
                  <div className="solution-subheading"><Clipboard size={16} /> Доказательство артефакта — {phase.artifact}</div>
                  <label className="solution-artifact-field">
                    <span>Что именно готово</span>
                    <textarea
                      value={currentArtifact.summary}
                      onChange={(event) => updateArtifact("summary", event.target.value)}
                      placeholder="Опишите конкретный результат и что в нём можно проверить…"
                    />
                    <small>Не меньше 30 символов содержательного описания.</small>
                  </label>
                  <label className="solution-artifact-field">
                    <span>Ссылка или путь к файлу</span>
                    <input
                      value={currentArtifact.reference}
                      onChange={(event) => updateArtifact("reference", event.target.value)}
                      placeholder="https://… или docs/problem-brief.md"
                    />
                    <small>Принимается URL или путь к файлу .md, .pdf, .png, .fig, .json, .zip.</small>
                  </label>
                  <div className={`solution-proof-status ${artifactReady ? "is-ready" : ""}`}>
                    {artifactReady ? <CheckCircle2 size={16} /> : <TriangleAlert size={16} />}
                    {artifactReady ? "Формат доказательства подтверждён" : "Нужны описание и проверяемая ссылка или файл"}
                  </div>
                </div>
                <button
                  className="solutions-button solutions-button-primary solution-next-button"
                  disabled={!artifactReady}
                  onClick={() => setActiveTab("verify")}
                >
                  Перейти к проверке <ArrowRight size={17} />
                </button>
              </div>
            )}

            {activeTab === "verify" && (
              <div className="solution-panel-stack">
                <div className="solution-panel-heading">
                  <span>Контрольная точка</span>
                  <h2>Докажите, что результат действительно готов</h2>
                  <p>Галочка не завершает этап сама по себе: должны быть решение, артефакт и пройденные проверки.</p>
                </div>
                <div className="solution-check-list">
                  {phase.checks.map((check, index) => (
                    <div className={`solution-check-item ${currentChecks[index] ? "is-checked" : ""}`} key={check}>
                      <button
                        type="button"
                        aria-pressed={Boolean(currentChecks[index])}
                        onClick={() => toggleCheck(index)}
                      >
                        <span>{currentChecks[index] && <Check size={16} />}</span>
                        <strong>{check}</strong>
                      </button>
                      <label>
                        <span>Чем подтверждается</span>
                        <input
                          value={currentCheckEvidence[index] || ""}
                          onChange={(event) => updateCheckEvidence(index, event.target.value)}
                          placeholder="Факт, число, URL, лог или наблюдение…"
                        />
                      </label>
                    </div>
                  ))}
                </div>
                <div className="solution-blocker-gate">
                  <div className="solution-subheading"><TriangleAlert size={17} /> Есть ли нерешённый блокер?</div>
                  <div className="solution-blocker-options">
                    <button
                      type="button"
                      aria-pressed={blockerStates[activePhase] === "none"}
                      className={blockerStates[activePhase] === "none" ? "is-selected" : ""}
                      onClick={() => setBlockerStates((previous) => ({ ...previous, [activePhase]: "none" }))}
                    >
                      <CheckCircle2 size={17} /> Блокеров нет
                    </button>
                    <button
                      type="button"
                      aria-pressed={blockerStates[activePhase] === "blocked"}
                      className={blockerStates[activePhase] === "blocked" ? "is-blocked" : ""}
                      onClick={() => setBlockerStates((previous) => ({ ...previous, [activePhase]: "blocked" }))}
                    >
                      <TriangleAlert size={17} /> Есть блокер
                    </button>
                  </div>
                  {blockerStates[activePhase] === "blocked" && (
                    <label className="solution-blocker-note">
                      <span>Опишите блокер — этап останется закрытым</span>
                      <textarea
                        value={blockerNotes[activePhase] || ""}
                        onChange={(event) => setBlockerNotes((previous) => ({ ...previous, [activePhase]: event.target.value }))}
                        placeholder="Что мешает доказать готовность и какое следующее действие?"
                      />
                    </label>
                  )}
                </div>
                <div className="solution-definition-done">
                  <div><span className={choices[activePhase] && (choiceReasons[activePhase]?.trim().length || 0) >= 20 ? "is-ready" : ""}>{choices[activePhase] && (choiceReasons[activePhase]?.trim().length || 0) >= 20 ? <Check size={14} /> : "1"}</span> Решение обосновано</div>
                  <div><span className={artifactReady ? "is-ready" : ""}>{artifactReady ? <Check size={14} /> : "2"}</span> Артефакт доказан</div>
                  <div><span className={checksReady ? "is-ready" : ""}>{checksReady ? <Check size={14} /> : "3"}</span> Проверки доказаны</div>
                  <div><span className={blockerReady ? "is-ready" : ""}>{blockerReady ? <Check size={14} /> : "4"}</span> Блокеров нет</div>
                </div>
                <button
                  type="button"
                  className="solutions-button solutions-button-primary solution-complete-button"
                  disabled={!canComplete}
                  onClick={completePhase}
                >
                  <CheckCircle2 size={18} /> Завершить этап и открыть следующий
                </button>
              </div>
            )}
          </section>
        </main>

        <aside className="solution-passport">
          <div className="solution-passport-heading">
            <FileCheck2 size={20} />
            <div><strong>Паспорт проекта</strong><span>Растёт вместе с продуктом</span></div>
          </div>
          <div className="solution-passport-progress">
            <strong>{progress}%</strong>
            <span>до проверенного запуска</span>
          </div>
          <div className="solution-passport-section">
            <span>Зафиксированные решения</span>
            {Object.keys(choices).length === 0 ? (
              <p>Первое решение появится после шага «Решить».</p>
            ) : (
              Object.entries(choices).map(([index, choice]) => (
                <div className="solution-passport-entry" key={index}>
                  <small>{phases[Number(index)].shortTitle}</small>
                  <strong>{choice}</strong>
                  <span>{choiceReasons[Number(index)] || "Обоснование ещё не добавлено"}</span>
                </div>
              ))
            )}
          </div>
          <div className="solution-passport-section">
            <span>Доказанные артефакты</span>
            {Object.entries(artifacts).filter(([index, artifact]) =>
              completed.has(Number(index)) &&
              artifact.summary.trim().length >= 30 &&
              isValidReference(artifact.reference)
            ).length === 0 ? (
              <p>Артефакт появится после полного завершения этапа: доказательств checks и отсутствия блокеров.</p>
            ) : (
              Object.entries(artifacts)
                .filter(([index, artifact]) =>
                  completed.has(Number(index)) &&
                  artifact.summary.trim().length >= 30 &&
                  isValidReference(artifact.reference)
                )
                .map(([index, artifact]) => (
                  <div className="solution-passport-entry solution-passport-artifact" key={index}>
                    <small>{phases[Number(index)].artifact}</small>
                    <strong>{artifact.summary}</strong>
                    <code>{artifact.reference}</code>
                    <span>
                      {(checks[Number(index)] || []).filter(Boolean).length}/{phases[Number(index)].checks.length} проверок · без блокеров
                    </span>
                  </div>
                ))
            )}
            <div className="solution-passport-count">
              <strong>{Object.entries(artifacts).filter(([index, artifact]) =>
                completed.has(Number(index)) &&
                artifact.summary.trim().length >= 30 &&
                isValidReference(artifact.reference)
              ).length}</strong> из {phases.length}
            </div>
          </div>
          <div className="solution-passport-section">
            <span>На финише</span>
            <p>{solution.result}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
