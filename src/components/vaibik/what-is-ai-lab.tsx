"use client";

import { useEffect, useRef, useState } from "react";
import QuestBackground from "@/components/vaibik/quest-background";
import SpeechNextButton from "@/components/vaibik/speech-next-button";
import { playClick, speak } from "@/lib/vaibik/quest-audio";
import { getLine, labActionPrompt, labDone } from "@/lib/vaibik/quest-lines";
import { useSpeechAdvance } from "@/lib/vaibik/use-speech-advance";
import { cn } from "@/lib/vaibik/utils";
import {
  Brain,
  Cat,
  Egg,
  Ghost,
  Rocket,
  Sparkles,
  Star,
  Trophy,
  type LucideIcon,
} from "lucide-react";

type Emotion = "normal" | "thinking" | "happy" | "surprised";
type Phase = "intro" | "theme" | "action" | "learned" | "done";

const MISSION_LABEL = "МИССИЯ 2/6";
const START_PROGRESS = 16.6;
const DONE_PROGRESS = 33.3;

interface IntroLine {
  text: string;
  emotion: Emotion;
}

const INTRO_LINES: IntroLine[] = [
  { text: getLine("lab.intro.greet"), emotion: "happy" },
  { text: getLine("lab.intro.clever"), emotion: "thinking" },
  { text: getLine("lab.intro.secret"), emotion: "normal" },
  { text: getLine("lab.intro.noMindRead"), emotion: "surprised" },
  {
    text: getLine("lab.intro.explain"),
    emotion: "happy",
  },
  { text: getLine("lab.intro.together"), emotion: "happy" },
];

interface LabOption {
  id: string;
  label: string;
  icon: LucideIcon;
  gradient: string;
  reaction: string;
}

const THEMES: LabOption[] = [
  {
    id: "space",
    label: "Космос",
    icon: Rocket,
    gradient: "from-indigo-500/80 to-blue-500/80",
    reaction: getLine("lab.theme.reaction.space"),
  },
  {
    id: "dino",
    label: "Динозавры",
    icon: Egg,
    gradient: "from-emerald-500/80 to-lime-500/80",
    reaction: getLine("lab.theme.reaction.dino"),
  },
  {
    id: "cat",
    label: "Кот",
    icon: Cat,
    gradient: "from-amber-500/80 to-orange-500/80",
    reaction: getLine("lab.theme.reaction.cat"),
  },
];

const ACTIONS: LabOption[] = [
  {
    id: "stars",
    label: "Собирать звёзды",
    icon: Star,
    gradient: "from-yellow-400/80 to-amber-500/80",
    reaction: getLine("lab.action.reaction.stars"),
  },
  {
    id: "aliens",
    label: "Убегать от пришельцев",
    icon: Ghost,
    gradient: "from-fuchsia-500/80 to-purple-500/80",
    reaction: getLine("lab.action.reaction.aliens"),
  },
  {
    id: "score",
    label: "Набирать очки",
    icon: Trophy,
    gradient: "from-cyan-400/80 to-sky-500/80",
    reaction: getLine("lab.action.reaction.score"),
  },
];

function Vaibik({ emotion }: { emotion: Emotion }) {
  const eyeOpen = emotion === "happy" ? "M50 60 Q64 46 78 60" : undefined;
  const eyeOpen2 = emotion === "happy" ? "M86 60 Q100 46 114 60" : undefined;
  const surprised = emotion === "surprised";
  const thinking = emotion === "thinking";

  return (
    <div className="relative">
      <div className="absolute inset-0 -m-6 rounded-full bg-gradient-to-br from-indigo-400/40 via-fuchsia-400/30 to-transparent blur-2xl animate-pulse" />
      <div className="absolute -inset-4 rounded-full border-2 border-indigo-300/40 animate-pulse" />
      <svg
        viewBox="0 0 160 160"
        className="relative h-44 w-44 sm:h-52 sm:w-52 drop-shadow-[0_0_28px_rgba(168,85,247,0.7)]"
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
        {/* eyes */}
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
            <circle
              cx="64"
              cy="58"
              r={surprised ? 13 : 11}
              fill="#ffffff"
              className={surprised ? "" : ""}
            >
              <animate
                attributeName="ry"
                values={surprised ? "13" : "11;3;11"}
                dur={surprised ? "1s" : "2.4s"}
                repeatCount="indefinite"
              />
              <animate
                attributeName="rx"
                values={surprised ? "13" : "11;14;11"}
                dur={surprised ? "1s" : "2.4s"}
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="100" cy="58" r={surprised ? 13 : 11} fill="#ffffff">
              <animate
                attributeName="ry"
                values={surprised ? "13" : "11;3;11"}
                dur={surprised ? "1s" : "2.4s"}
                repeatCount="indefinite"
              />
              <animate
                attributeName="rx"
                values={surprised ? "13" : "11;14;11"}
                dur={surprised ? "1s" : "2.4s"}
                repeatCount="indefinite"
              />
            </circle>
            <circle
              cx={surprised ? 66 : 66}
              cy={surprised ? 60 : 60}
              r={surprised ? 4 : 4}
              fill="#312e81"
            />
            <circle
              cx={surprised ? 102 : 102}
              cy={surprised ? 60 : 60}
              r={surprised ? 4 : 4}
              fill="#312e81"
            />
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
        {/* mouth */}
        {surprised ? (
          <ellipse cx="82" cy="90" rx="8" ry="9" fill="#312e81" />
        ) : eyeOpen ? (
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

function OptionCard({
  option,
  flying,
  selected,
  onClick,
  delay,
}: {
  option: LabOption;
  flying: boolean;
  selected: boolean;
  onClick: () => void;
  delay: number;
}) {
  const Icon = option.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "card-hover group relative flex flex-col items-center gap-4 rounded-3xl border border-white/15 bg-slate-900/70 px-5 py-7 backdrop-blur-md transition-all duration-500 ease-out animate-in fade-in slide-in-from-bottom-6",
        flying && "pointer-events-none -translate-y-72 scale-50 opacity-0",
        selected && "ring-2 ring-fuchsia-300/80"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className={cn(
          "flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg transition-transform duration-300 group-hover:scale-110",
          option.gradient
        )}
      >
        <Icon className="h-8 w-8" />
      </div>
      <span className="text-center text-lg font-bold text-white">
        {option.label}
      </span>
      {flying && (
        <Sparkles className="absolute h-8 w-8 text-fuchsia-200 animate-pulse" />
      )}
    </button>
  );
}

interface WhatIsAiLabProps {
  onComplete?: (themeId: string, actionId: string) => void;
}

export default function WhatIsAiLab({ onComplete }: WhatIsAiLabProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [introIndex, setIntroIndex] = useState(0);
  const [theme, setTheme] = useState<string | null>(null);
  const [action, setAction] = useState<string | null>(null);
  const [flying, setFlying] = useState<string | null>(null);
  const [reaction, setReaction] = useState<{
    text: string;
    emotion: Emotion;
  } | null>(null);
  const [rewarded, setRewarded] = useState(false);
  const [progress, setProgress] = useState(START_PROGRESS);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    if (phase !== "done" || rewarded) return;
    const t = window.setTimeout(() => {
      setRewarded(true);
      setProgress(DONE_PROGRESS);
    }, 900);
    timers.current.push(t);
    return () => clearTimeout(t);
  }, [phase, rewarded]);

  const showReaction = (opt: LabOption, next: () => void) => {
    playClick();
    setFlying(opt.id);
    const t = window.setTimeout(() => {
      setFlying(null);
      setReaction({ text: opt.reaction, emotion: "happy" });
      const t2 = window.setTimeout(() => {
        setReaction(null);
        next();
      }, 3000);
      timers.current.push(t2);
    }, 1000);
    timers.current.push(t);
  };

  const pickTheme = (opt: LabOption) => {
    if (flying || theme || phase !== "theme") return;
    setTheme(opt.id);
    showReaction(opt, () => setPhase("action"));
  };

  const pickAction = (opt: LabOption) => {
    if (flying || action || phase !== "action") return;
    setAction(opt.id);
    showReaction(opt, () => setPhase("learned"));
  };

  const selectedTheme = THEMES.find((o) => o.id === theme);
  const selectedAction = ACTIONS.find((o) => o.id === action);

  const defaultLine = (): { text: string; emotion: Emotion } => {
    switch (phase) {
      case "intro":
        return INTRO_LINES[Math.min(introIndex, INTRO_LINES.length - 1)];
      case "theme":
        return { text: getLine("lab.theme.prompt"), emotion: "thinking" };
      case "action":
        return {
          text: labActionPrompt(selectedTheme?.label ?? ""),
          emotion: "thinking",
        };
      case "learned":
        return {
          text: getLine("lab.learned"),
          emotion: "happy",
        };
      case "done":
        return {
          text: labDone(
            selectedTheme?.label ?? "",
            selectedAction?.label ?? ""
          ),
          emotion: "happy",
        };
    }
  };

  const line = reaction ?? defaultLine();

  // Речевой шлюз для автоматических слайдов: кадр меняется только после того,
  // как Вайбик дочитал реплику (событие окончания речи), с тайм-аутом-
  // подстраховкой и кнопкой «Дальше» для ручного перехода.
  const introDone = introIndex >= INTRO_LINES.length;
  const introGate = useSpeechAdvance({
    text: phase === "intro" && !introDone ? INTRO_LINES[introIndex].text : "",
    advance: () => {
      if (introIndex + 1 >= INTRO_LINES.length) setPhase("theme");
      else setIntroIndex((i) => i + 1);
    },
    fallbackMs: 14000,
    minWaitMs: 1800,
    active: phase === "intro" && !introDone,
    deps: [phase, introIndex],
  });

  const learnedGate = useSpeechAdvance({
    text: phase === "learned" ? getLine("lab.learned") : "",
    advance: () => setPhase("done"),
    fallbackMs: 14000,
    minWaitMs: 1800,
    active: phase === "learned",
    deps: [phase],
  });

  const doneGate = useSpeechAdvance({
    text:
      phase === "done"
        ? labDone(selectedTheme?.label ?? "", selectedAction?.label ?? "")
        : "",
    advance: () => onComplete?.(theme ?? "", action ?? ""),
    fallbackMs: 14000,
    minWaitMs: 1800,
    active: phase === "done" && !!theme && !!action && !!onComplete,
    deps: [phase],
  });

  const handleNext = () => {
    playClick();
    if (phase === "intro") introGate.skip();
    else if (phase === "learned") learnedGate.skip();
    else if (phase === "done") doneGate.skip();
  };

  useEffect(() => {
    if (!line?.text) return;
    if (phase === "intro" || phase === "learned" || phase === "done") return;
    speak(line.text);
  }, [line?.text, phase]);

  const showOptions = (phase === "theme" || phase === "action") && !reaction;

  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center overflow-hidden px-4 py-10">
      <QuestBackground kind="dialog" />
      <div
        className="pointer-events-none absolute inset-0 pattern-grid opacity-20"
        aria-hidden="true"
      />

      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center">
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

        <div className="relative flex w-full flex-col items-center animate-in fade-in duration-700">
          <Vaibik emotion={line.emotion} />
          <div
            key={line.text}
            className="relative z-10 mt-2 max-w-md rounded-3xl border border-white/20 bg-slate-900/85 px-6 py-4 text-center text-lg font-semibold text-white shadow-[0_12px_40px_-10px_rgba(0,0,0,0.7)] backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 duration-400"
          >
            {line.text}
            <div className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 rounded-sm bg-slate-900/85" />
          </div>
        </div>

        {phase === "intro" && (
          <div className="mt-6 flex items-center gap-2 text-sm text-indigo-100/70 animate-pulse">
            <Sparkles className="h-4 w-4" />
            Слушай Вайбика...
          </div>
        )}

        {(phase === "intro" || phase === "learned" || phase === "done") && (
          <div className="mt-6 flex justify-center">
            <SpeechNextButton onNext={handleNext} />
          </div>
        )}

        {showOptions && (
          <div
            className={cn(
              "mt-10 grid w-full gap-4",
              "grid-cols-1 sm:grid-cols-3"
            )}
          >
            {(phase === "theme" ? THEMES : ACTIONS).map((opt, i) => (
              <OptionCard
                key={opt.id}
                option={opt}
                flying={flying === opt.id}
                selected={
                  (phase === "theme" ? theme : action) === opt.id && !reaction
                }
                onClick={() =>
                  phase === "theme" ? pickTheme(opt) : pickAction(opt)
                }
                delay={i * 140}
              />
            ))}
          </div>
        )}

        {phase === "learned" && (
          <div className="mt-10 w-full max-w-md rounded-3xl border border-fuchsia-300/60 bg-gradient-to-br from-fuchsia-500/20 via-indigo-500/20 to-transparent p-[1px] animate-in fade-in zoom-in duration-700">
            <div className="flex flex-col items-center gap-3 rounded-3xl bg-slate-900/70 px-6 py-7 text-center backdrop-blur-md shadow-[0_0_40px_-8px_rgba(217,70,239,0.8)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fuchsia-500/30 text-fuchsia-200">
                <Brain className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-white">Ты узнал!</h2>
              <p className="text-base leading-relaxed text-indigo-100/90">
                ИИ — это умный помощник. Он делает, что ты просишь, но не читает
                мысли! Нужно объяснять задачу словами. Ты выбрал тему и действие
                — теперь Вайбик точно знает, что создавать.
              </p>
            </div>
          </div>
        )}

        {phase === "done" && (
          <div className="mt-10 flex flex-col items-center gap-3 text-center animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="flex items-center gap-2 rounded-2xl border border-amber-300/50 bg-amber-400/20 px-5 py-3 text-lg font-bold text-amber-200 shadow-[0_0_30px_-6px_rgba(251,191,36,0.7)]">
              <Star className="h-6 w-6 fill-amber-300" />
              +10 ⭐
            </div>
            <p className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-indigo-100/90 backdrop-blur-md">
              Этап пройден! Дальше — соберём из твоих слов первую игру.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
