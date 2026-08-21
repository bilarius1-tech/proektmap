"use client";

import { useEffect, useRef, useState } from "react";
import QuestBackground from "@/components/vaibik/quest-background";
import SpeechNextButton from "@/components/vaibik/speech-next-button";
import { playClick, playPop, playWin } from "@/lib/vaibik/quest-audio";
import { getAction, getTheme } from "@/lib/vaibik/quest-choices";
import { getLine, programAction, programTheme } from "@/lib/vaibik/quest-lines";
import { useSpeechAdvance } from "@/lib/vaibik/use-speech-advance";
import { cn } from "@/lib/vaibik/utils";
import {
  Brain,
  CheckCircle2,
  Cpu,
  MessageCircle,
  SearchCheck,
  Sparkles,
  Star,
  Wand2,
  type LucideIcon,
} from "lucide-react";

type Emotion = "normal" | "happy" | "thinking";
type Phase = "intro" | "theme" | "action" | "explain" | "reward" | "done";

const MISSION_LABEL = "МИССИЯ 5/6";
const START_PROGRESS = 66.6;
const DONE_PROGRESS = 83.3;

// Медленная, спокойная скорость «печати» промпта, чтобы каждая буква
// успевала прочитаться. Паузы между частями задаются фазами и речью Вайбика.
const TYPE_MS = 120;

interface ProgramVibeCraftProps {
  themeId?: string;
  actionId?: string;
  onComplete?: () => void;
}

interface EngineStep {
  id: string;
  icon: LucideIcon;
  label: string;
  gradient: string;
}

const ENGINE_STEPS: EngineStep[] = [
  {
    id: "think",
    icon: Brain,
    label: "Думать",
    gradient: "from-indigo-400 to-blue-500",
  },
  {
    id: "explain",
    icon: MessageCircle,
    label: "Объяснять",
    gradient: "from-fuchsia-400 to-purple-500",
  },
  {
    id: "check",
    icon: SearchCheck,
    label: "Проверять",
    gradient: "from-emerald-400 to-teal-500",
  },
  {
    id: "fix",
    icon: Wand2,
    label: "Исправлять",
    gradient: "from-rose-400 to-orange-500",
  },
];

function Vaibik({ emotion }: { emotion: Emotion }) {
  const happy = emotion === "happy";
  const thinking = emotion === "thinking";
  const eyeOpen = happy ? "M50 60 Q64 46 78 60" : undefined;
  const eyeOpen2 = happy ? "M86 60 Q100 46 114 60" : undefined;

  return (
    <div className="relative">
      <div className="absolute inset-0 -m-6 rounded-full bg-gradient-to-br from-indigo-400/40 via-fuchsia-400/30 to-transparent blur-2xl animate-pulse" />
      <div className="absolute -inset-4 rounded-full border-2 border-indigo-300/40 animate-pulse" />
      <svg
        viewBox="0 0 160 160"
        className="relative h-40 w-40 sm:h-48 sm:w-48 drop-shadow-[0_0_28px_rgba(168,85,247,0.7)]"
        role="img"
        aria-label="Голограмма робота Вайбика"
      >
        <circle cx="80" cy="92" r="78" fill="url(#hologlow)" opacity="0.35" />
        <defs>
          <radialGradient id="hologlow" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#c4b5fd" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#a21caf" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g className="animate-pulse">
          <line
            x1="80"
            y1="22"
            x2="80"
            y2="6"
            stroke="#a5b4fc"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="80" cy="5" r="5" fill="#fbbf24">
            <animate
              attributeName="opacity"
              values="1;0.3;1"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
        <rect x="34" y="20" width="92" height="86" rx="24" fill="#7c6cf0" />
        <rect
          x="40"
          y="26"
          width="80"
          height="74"
          rx="18"
          fill="#8f83f5"
          opacity="0.9"
        />
        {eyeOpen ? (
          <>
            <path
              d={eyeOpen}
              stroke="#312e81"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d={eyeOpen2}
              stroke="#312e81"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
          </>
        ) : (
          <>
            <circle cx="64" cy="58" r="11" fill="#ffffff">
              <animate
                attributeName="ry"
                values="11;3;11"
                dur="2.4s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="rx"
                values="11;14;11"
                dur="2.4s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="100" cy="58" r="11" fill="#ffffff">
              <animate
                attributeName="ry"
                values="11;3;11"
                dur="2.4s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="rx"
                values="11;14;11"
                dur="2.4s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="66" cy="60" r="4" fill="#312e81" />
            <circle cx="102" cy="60" r="4" fill="#312e81" />
            {thinking && (
              <path
                d="M48 42 L64 46"
                stroke="#312e81"
                strokeWidth="4"
                strokeLinecap="round"
              />
            )}
          </>
        )}
        {eyeOpen ? (
          <path d="M60 88 Q82 108 104 88 Z" fill="#312e81" />
        ) : thinking ? (
          <path
            d="M70 92 Q82 86 94 92"
            stroke="#312e81"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
        ) : (
          <path
            d="M62 92 Q82 106 100 92"
            stroke="#312e81"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
        )}
        <rect x="64" y="108" width="34" height="24" rx="12" fill="#f59e0b" />
        <rect x="46" y="116" width="10" height="22" rx="5" fill="#9ca3af" />
        <rect x="106" y="116" width="10" height="22" rx="5" fill="#9ca3af" />
      </svg>
    </div>
  );
}

function PromptWindow({
  typed,
  placeholder,
}: {
  typed: string;
  placeholder: string;
}) {
  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-indigo-300/40 bg-slate-950/80 shadow-[0_20px_70px_-20px_rgba(91,42,134,0.9)] backdrop-blur-md">
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-red-400/80" />
        <span className="h-3 w-3 rounded-full bg-amber-300/80" />
        <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
        <span className="ml-2 flex items-center gap-1.5 text-xs font-semibold tracking-wide text-indigo-200/80">
          <Cpu className="h-3.5 w-3.5" />
          VibeCraft
        </span>
        <span className="ml-auto text-xs font-medium text-indigo-200/50">
          Промпт
        </span>
      </div>

      <div className="min-h-[9rem] p-5">
        <div className="rounded-2xl border border-fuchsia-300/40 bg-slate-900/70 p-4 shadow-[inset_0_0_30px_-12px_rgba(217,70,239,0.4)]">
          <p className="font-mono text-base leading-relaxed text-white sm:text-lg">
            {typed || (
              <span className="text-fuchsia-200/50">{placeholder}</span>
            )}
            <span className="ml-0.5 inline-block h-5 w-2 animate-pulse rounded-sm bg-fuchsia-300 align-middle" />
          </p>
        </div>
      </div>
    </div>
  );
}

function ResultWindow({
  themeTyped,
  actionTyped,
  HeroIcon,
  CollectIcon,
  collectColor,
  collectFill,
  scoreLabel,
}: {
  themeTyped: boolean;
  actionTyped: boolean;
  HeroIcon: LucideIcon;
  CollectIcon: LucideIcon;
  collectColor: string;
  collectFill: string;
  scoreLabel: string;
}) {
  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-fuchsia-300/40 bg-slate-950/80 shadow-[0_20px_70px_-20px_rgba(168,85,247,0.7)] backdrop-blur-md">
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-3">
        <span className="ml-1 flex items-center gap-1.5 text-xs font-semibold tracking-wide text-fuchsia-200/80">
          <Sparkles className="h-3.5 w-3.5" />
          ИИ создаёт
        </span>
        <span className="ml-auto flex items-center gap-1 text-xs font-medium text-amber-200/60">
          <Star className="h-3 w-3 fill-amber-300/60" />
          {scoreLabel}
        </span>
      </div>

      <div className="relative min-h-[9rem] overflow-hidden p-5">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-900 to-fuchsia-950/60" />
        <div className="absolute inset-0 pattern-grid opacity-20" />

        {!themeTyped && !actionTyped && (
          <div className="relative z-10 flex h-full min-h-[9rem] flex-col items-center justify-center gap-2 text-center">
            <Cpu className="h-8 w-8 animate-pulse text-indigo-300/50" />
            <p className="text-sm font-medium text-indigo-200/60">
              Здесь появится твоя игра
            </p>
          </div>
        )}

        {themeTyped && (
          <div
            className="relative z-10 flex flex-col items-center justify-center gap-3 animate-in fade-in zoom-in duration-700"
            key="hero"
          >
            <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-indigo-300/50 bg-slate-900/70 text-white shadow-[0_0_30px_-6px_rgba(129,140,248,1)]">
              <HeroIcon className="h-12 w-12 animate-bob" />
            </div>
            <span className="text-xs font-semibold tracking-wide text-indigo-200/80">
              Тема готова!
            </span>
          </div>
        )}

        {actionTyped && (
          <div
            className="relative z-10 mt-3 flex flex-col items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-700"
            key="action"
          >
            <div className="flex items-center gap-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="flex h-10 w-10 items-center justify-center rounded-2xl border border-fuchsia-300/50 bg-slate-900/70 shadow-[0_0_22px_-6px_rgba(232,121,249,0.9)]"
                  style={{ animationDelay: `${i * 0.15}s` }}
                >
                  <CollectIcon
                    className={cn("h-6 w-6 animate-bob", collectColor)}
                    style={{ fill: collectFill }}
                    strokeWidth={1}
                  />
                </div>
              ))}
            </div>
            <span className="rounded-full border border-amber-300/50 bg-amber-400/15 px-3 py-1 text-sm font-bold text-amber-200">
              ⭐ 0
            </span>
            <Sparkles className="h-5 w-5 animate-pulse text-amber-300" />
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProgramVibeCraft({
  themeId = "space",
  actionId = "stars",
  onComplete,
}: ProgramVibeCraftProps) {
  const theme = getTheme(themeId);
  const action = getAction(actionId);
  const HeroIcon = theme.heroIcon;
  const CollectIcon = action.collectIcon;

  // Промпт ребёнка, который Вайбик «печатает» по частям.
  const themePart = `Создай игру про ${theme.promptWord}, `;
  const actionPart = `где нужно ${action.promptWord}`;
  const prompt = themePart + actionPart;

  const [phase, setPhase] = useState<Phase>("intro");
  const [typed, setTyped] = useState("");
  const [rewarded, setRewarded] = useState(false);
  const [progress, setProgress] = useState(START_PROGRESS);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const themeTyped = typed.length >= themePart.length;
  const actionTyped = typed.length >= prompt.length;

  // Медленная «печать» промпта по частям: в фазе theme печатаем тему,
  // в фазе action — действие.
  useEffect(() => {
    if (phase === "theme") {
      if (typed.length < themePart.length) {
        const t = window.setTimeout(
          () => setTyped(themePart.slice(0, typed.length + 1)),
          TYPE_MS
        );
        timers.current.push(t);
        return () => clearTimeout(t);
      }
    } else if (phase === "action") {
      if (typed.length < prompt.length) {
        const t = window.setTimeout(
          () => setTyped(prompt.slice(0, typed.length + 1)),
          TYPE_MS
        );
        timers.current.push(t);
        return () => clearTimeout(t);
      }
    }
  }, [phase, typed, prompt, themePart]);

  // Звуки «оживления» при завершении ввода каждой части.
  useEffect(() => {
    if (phase === "theme" && themeTyped) playPop();
  }, [phase, themeTyped]);
  useEffect(() => {
    if (phase === "action" && actionTyped) playWin();
  }, [phase, actionTyped]);

  // Речевой шлюз каждой фазы включается, только когда текст части уже введён
  // (revealed), чтобы реплика озвучивалась после появления результата справа.
  const revealed =
    phase === "intro" ||
    (phase === "theme" && themeTyped) ||
    (phase === "action" && actionTyped) ||
    phase === "explain" ||
    phase === "reward" ||
    phase === "done";

  const gateConfig: Record<
    Phase,
    {
      text: string;
      advance: () => void;
      fallbackMs: number;
      minWaitMs: number;
    }
  > = {
    intro: {
      text: getLine("program.intro"),
      advance: () => setPhase("theme"),
      fallbackMs: 14000,
      minWaitMs: 1800,
    },
    theme: {
      text: programTheme(theme.promptWord),
      advance: () => setPhase("action"),
      fallbackMs: 13000,
      minWaitMs: 1500,
    },
    action: {
      text: programAction(action.promptWord),
      advance: () => setPhase("explain"),
      fallbackMs: 14000,
      minWaitMs: 1500,
    },
    explain: {
      text: getLine("program.explain"),
      advance: () => setPhase("reward"),
      fallbackMs: 20000,
      minWaitMs: 1800,
    },
    reward: {
      text: getLine("program.reward"),
      advance: () => {
        setRewarded(true);
        setProgress(DONE_PROGRESS);
        setPhase("done");
        onComplete?.();
      },
      fallbackMs: 9000,
      minWaitMs: 1500,
    },
    done: {
      text: "",
      advance: () => {},
      fallbackMs: 0,
      minWaitMs: 0,
    },
  };

  const gate = gateConfig[phase];
  const gateActive = phase !== "done" && revealed;
  const { skip } = useSpeechAdvance({
    text: gate.text,
    advance: gate.advance,
    fallbackMs: gate.fallbackMs,
    minWaitMs: gate.minWaitMs,
    active: gateActive,
    deps: [phase, revealed],
  });

  const dialog = (): { text: string; emotion: Emotion } => {
    switch (phase) {
      case "intro":
        return { text: getLine("program.intro"), emotion: "happy" };
      case "theme":
        return { text: programTheme(theme.promptWord), emotion: "normal" };
      case "action":
        return { text: programAction(action.promptWord), emotion: "normal" };
      case "explain":
        return { text: getLine("program.explain"), emotion: "thinking" };
      case "reward":
      case "done":
        return { text: getLine("program.reward"), emotion: "happy" };
    }
  };

  const line = dialog();

  const handleNext = () => {
    playClick();
    skip();
  };

  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center overflow-hidden px-4 py-10">
      <QuestBackground kind="dialog" />
      <div
        className="pointer-events-none absolute inset-0 pattern-grid opacity-20"
        aria-hidden="true"
      />

      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center">
        <div className="mb-8 flex w-full max-w-sm flex-col items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-500">
          <span className="text-xs font-semibold tracking-[0.3em] text-indigo-200/80">
            {MISSION_LABEL}
          </span>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/15 ring-1 ring-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-fuchsia-400 transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          {rewarded && (
            <div className="flex items-center gap-1.5 text-sm font-bold text-amber-300 animate-in fade-in zoom-in duration-500">
              <Star className="h-4 w-4 fill-amber-300" />
              +10 звёзд
            </div>
          )}
        </div>

        <div className="grid w-full gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-left-6 duration-700">
            <Vaibik emotion={line.emotion} />
            <div
              key={line.text}
              className="relative z-10 mt-2 max-w-md rounded-3xl border border-white/20 bg-slate-900/85 px-6 py-4 text-center text-base font-semibold text-white shadow-[0_12px_40px_-10px_rgba(0,0,0,0.7)] backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 duration-400"
            >
              {line.text}
              <div className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 rounded-sm bg-slate-900/85" />
            </div>
            {gateActive && (
              <div className="mt-5 flex justify-center">
                <SpeechNextButton onNext={handleNext} />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-right-6 duration-700">
            <div className="grid gap-5 sm:grid-cols-2">
              <PromptWindow
                typed={typed}
                placeholder="Твой промпт появится здесь..."
              />
              <ResultWindow
                themeTyped={themeTyped}
                actionTyped={actionTyped}
                HeroIcon={HeroIcon}
                CollectIcon={CollectIcon}
                collectColor={action.collectColor}
                collectFill={action.collectFill}
                scoreLabel={action.label}
              />
            </div>

            {phase === "explain" && (
              <div className="rounded-3xl border border-fuchsia-300/60 bg-gradient-to-br from-fuchsia-500/20 via-indigo-500/20 to-transparent p-[1px] animate-in fade-in zoom-in duration-700">
                <div className="rounded-3xl bg-slate-900/70 px-6 py-6 backdrop-blur-md shadow-[0_0_40px_-8px_rgba(217,70,239,0.8)]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-fuchsia-500/30 text-fuchsia-200">
                      <Brain className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        AI-инженерия
                      </h2>
                      <p className="text-sm text-indigo-200/80">
                        Как работает настоящий мастер ИИ
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {ENGINE_STEPS.map((step) => {
                      const Icon = step.icon;
                      return (
                        <div
                          key={step.id}
                          className="card-hover flex flex-col items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-3 py-4 text-center backdrop-blur-md"
                        >
                          <div
                            className={cn(
                              "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg",
                              step.gradient
                            )}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <span className="text-sm font-bold text-white">
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <p className="mt-4 text-center text-base leading-relaxed text-indigo-100/90">
                    Промпт — только начало. Потом нужно{" "}
                    <span className="font-semibold text-white">
                      думать, объяснять, проверять и исправлять
                    </span>
                    . Этому мы и учимся!
                  </p>
                </div>
              </div>
            )}

            {(phase === "reward" || phase === "done") && (
              <div className="flex flex-col items-center gap-3 text-center animate-in fade-in slide-in-from-bottom-6 duration-700">
                <div className="flex items-center gap-2 rounded-2xl border border-amber-300/50 bg-amber-400/20 px-5 py-3 text-lg font-bold text-amber-200 shadow-[0_0_30px_-6px_rgba(251,191,36,0.7)]">
                  <CheckCircle2 className="h-6 w-6 text-amber-300" />
                  +10 ⭐
                </div>
                <p className="text-indigo-100/80">
                  Теперь ты знаешь секрет настоящего вайбкодера!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
