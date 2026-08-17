"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
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
} from "lucide-react";
import { saasPhases, saasSolution } from "../../data";

type WorkspaceTab = "understand" | "choose" | "action" | "verify";

const tabs: Array<{ id: WorkspaceTab; label: string; icon: typeof Target }> = [
  { id: "understand", label: "Понять", icon: Lightbulb },
  { id: "choose", label: "Решить", icon: Target },
  { id: "action", label: "Сделать", icon: Play },
  { id: "verify", label: "Проверить", icon: CheckCircle2 },
];

export default function SolutionWorkspace() {
  const [activePhase, setActivePhase] = useState(0);
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("understand");
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [choices, setChoices] = useState<Record<number, string>>({});
  const [artifacts, setArtifacts] = useState<Record<number, string>>({});
  const [checks, setChecks] = useState<Record<number, boolean[]>>({});
  const [copied, setCopied] = useState(false);
  const [notice, setNotice] = useState("");

  const phase = saasPhases[activePhase];
  const nextPhaseIndex = useMemo(() => {
    const next = saasPhases.findIndex((_, index) => !completed.has(index));
    return next === -1 ? saasPhases.length - 1 : next;
  }, [completed]);
  const progress = Math.round((completed.size / saasPhases.length) * 100);
  const currentChecks = checks[activePhase] || phase.checks.map(() => false);
  const canComplete =
    Boolean(choices[activePhase]) &&
    (artifacts[activePhase]?.trim().length || 0) >= 12 &&
    currentChecks.every(Boolean);

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

  function completePhase() {
    if (!canComplete) return;
    const nextCompleted = new Set(completed);
    nextCompleted.add(activePhase);
    setCompleted(nextCompleted);
    setNotice(`Этап «${phase.shortTitle}» проверен. Следующая миссия открыта.`);
    if (activePhase < saasPhases.length - 1) {
      setTimeout(() => {
        setActivePhase(activePhase + 1);
        setActiveTab("understand");
      }, 650);
    }
  }

  async function copyPrompt() {
    await navigator.clipboard.writeText(phase.action.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="solution-workspace">
      <header className="solution-workspace-header">
        <div>
          <Link href="/resheniya/saas-product" className="solution-workspace-back">
            <ArrowLeft size={16} /> Обзор решения
          </Link>
          <div className="solution-workspace-title">
            <Route size={21} />
            <div>
              <strong>{saasSolution.title}</strong>
              <span>Проект: мой первый SaaS</span>
            </div>
          </div>
        </div>
        <div className="solution-workspace-progress">
          <div><span>Прогресс продукта</span><strong>{progress}%</strong></div>
          <div className="solution-workspace-progress-track"><i style={{ width: `${progress}%` }} /></div>
          <small>{completed.size} из {saasPhases.length} результатов проверено</small>
        </div>
      </header>

      <div className="solution-prototype-note">
        <Sparkles size={16} />
        <span><strong>UX-прототип.</strong> Здесь проверяется новая логика прохождения; сохранение в новую модель данных подключим следующим этапом.</span>
      </div>

      <div className="solution-workspace-layout">
        <aside className="solution-route-sidebar">
          <div className="solution-sidebar-heading"><Map size={17} /> Маршрут запуска</div>
          <div className="solution-sidebar-list">
            {saasPhases.map((item, index) => {
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
              Этап {activePhase + 1} из {saasPhases.length}
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
                className={activeTab === id ? "is-active" : ""}
                onClick={() => setActiveTab(id)}
                key={id}
              >
                <span>{index + 1}</span><Icon size={16} /> {label}
              </button>
            ))}
          </div>

          <section className="solution-mission-panel">
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
                <button
                  className="solutions-button solutions-button-primary solution-next-button"
                  disabled={!choices[activePhase]}
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
                <label className="solution-artifact-field">
                  <span><Clipboard size={16} /> Результат работы — {phase.artifact}</span>
                  <textarea
                    value={artifacts[activePhase] || ""}
                    onChange={(event) => setArtifacts((previous) => ({ ...previous, [activePhase]: event.target.value }))}
                    placeholder="Вставьте ссылку, путь к файлу или коротко опишите готовый результат…"
                  />
                  <small>Минимум 12 символов. В рабочей версии здесь будут ссылки, файлы и скриншоты.</small>
                </label>
                <button
                  className="solutions-button solutions-button-primary solution-next-button"
                  disabled={(artifacts[activePhase]?.trim().length || 0) < 12}
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
                    <button
                      type="button"
                      key={check}
                      aria-pressed={Boolean(currentChecks[index])}
                      className={currentChecks[index] ? "is-checked" : ""}
                      onClick={() => toggleCheck(index)}
                    >
                      <span>{currentChecks[index] && <Check size={16} />}</span>
                      <strong>{check}</strong>
                    </button>
                  ))}
                </div>
                <div className="solution-definition-done">
                  <div><span className={choices[activePhase] ? "is-ready" : ""}>{choices[activePhase] ? <Check size={14} /> : "1"}</span> Решение принято</div>
                  <div><span className={(artifacts[activePhase]?.trim().length || 0) >= 12 ? "is-ready" : ""}>{(artifacts[activePhase]?.trim().length || 0) >= 12 ? <Check size={14} /> : "2"}</span> Артефакт добавлен</div>
                  <div><span className={currentChecks.every(Boolean) ? "is-ready" : ""}>{currentChecks.every(Boolean) ? <Check size={14} /> : "3"}</span> Проверки пройдены</div>
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
                  <small>{saasPhases[Number(index)].shortTitle}</small>
                  <strong>{choice}</strong>
                </div>
              ))
            )}
          </div>
          <div className="solution-passport-section">
            <span>Артефакты</span>
            <div className="solution-passport-count"><strong>{Object.values(artifacts).filter((value) => value.trim().length >= 12).length}</strong> из {saasPhases.length}</div>
          </div>
          <div className="solution-passport-section">
            <span>На финише</span>
            <p>{saasSolution.result}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
